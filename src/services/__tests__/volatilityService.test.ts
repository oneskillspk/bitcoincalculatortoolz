import { describe, it, expect } from 'vitest';
import { computeCustomVolatility, getAssetComparison, getStockVsBtcComparison } from '../volatilityService';

describe('volatilityService', () => {
  it('computeCustomVolatility: flat prices → 0 vol', () => {
    const prices = Array(50).fill(100_000);
    const dates = prices.map((_, i) => `2024-01-${String(i + 1).padStart(2, '0')}`);
    const r = computeCustomVolatility(prices, dates, dates[0], dates[dates.length - 1], 10);
    expect(r.annualizedVol).toBe(0);
    expect(r.dailyVol).toBe(0);
  });

  it('computeCustomVolatility: oscillating prices yield positive vol', () => {
    const prices = Array.from({ length: 60 }, (_, i) => 100_000 * (1 + 0.05 * Math.sin(i)));
    const dates = prices.map((_, i) => {
      const d = new Date('2024-01-01');
      d.setDate(d.getDate() + i);
      return d.toISOString().slice(0, 10);
    });
    const r = computeCustomVolatility(prices, dates, dates[0], dates[dates.length - 1], 10);
    expect(r.annualizedVol).toBeGreaterThan(0);
    expect(r.dailyVol).toBeGreaterThan(0);
  });

  it('getAssetComparison: Bitcoin row first and includes 5 benchmarks', () => {
    const rows = getAssetComparison(60);
    expect(rows[0].asset).toBe('Bitcoin');
    expect(rows.length).toBeGreaterThanOrEqual(6);
  });

  it('getStockVsBtcComparison: ratio column scales with btcVol30', () => {
    const lowVol = getStockVsBtcComparison(30);
    const highVol = getStockVsBtcComparison(120);
    // MSTR vs lower btc vol => higher ratio
    const lowRatio = parseFloat(lowVol[0].ratioVsBtc);
    const highRatio = parseFloat(highVol[0].ratioVsBtc);
    expect(lowRatio).toBeGreaterThan(highRatio);
  });
});
