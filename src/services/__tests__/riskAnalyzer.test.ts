import { describe, it, expect } from 'vitest';
import { RiskAnalyzer } from '../riskAnalyzer';
import type { BitcoinPrice } from '../bitcoinApi';

const linearPrices = (start: number, end: number, days: number): BitcoinPrice[] => {
  const startMs = new Date('2024-01-01').getTime();
  return Array.from({ length: days }, (_, i) => ({
    date: new Date(startMs + i * 86400000).toISOString().slice(0, 10),
    price: start + ((end - start) * i) / (days - 1),
  }));
};

describe('RiskAnalyzer', () => {
  it('flat prices → near-zero volatility and zero max drawdown', () => {
    const flat = linearPrices(100_000, 100_000, 100);
    const m = RiskAnalyzer.calculateRiskMetrics(flat);
    expect(m.volatility).toBeCloseTo(0, 5);
    expect(m.maxDrawdown).toBeCloseTo(0, 5);
  });

  it('monotonically rising prices → zero max drawdown', () => {
    const rising = linearPrices(10_000, 50_000, 365);
    const m = RiskAnalyzer.calculateRiskMetrics(rising);
    expect(m.maxDrawdown).toBeCloseTo(0, 5);
    expect(m.averageReturn).toBeGreaterThan(0);
  });

  it('VaR95 ≥ VaR99 (less negative)', () => {
    // Build a volatile but realistic series
    const prices: BitcoinPrice[] = [];
    let p = 50_000;
    const startMs = new Date('2024-01-01').getTime();
    for (let i = 0; i < 200; i++) {
      // Deterministic pseudo-random walk
      p *= 1 + (Math.sin(i * 1.7) * 0.04);
      prices.push({ date: new Date(startMs + i * 86400000).toISOString().slice(0, 10), price: p });
    }
    const m = RiskAnalyzer.calculateRiskMetrics(prices);
    expect(m.valueAtRisk95).toBeGreaterThanOrEqual(m.valueAtRisk99);
  });

  it('volatilityAnalysis classifies flat series as low/conservative', () => {
    const flat = linearPrices(100_000, 100_000, 400);
    const a = RiskAnalyzer.calculateVolatilityAnalysis(flat);
    expect(a.volatilityRegime).toBe('low');
    expect(a.riskLevel).toBe('conservative');
  });
});
