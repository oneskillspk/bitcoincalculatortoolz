import { describe, it, expect } from 'vitest';
import { computeDrawdowns, calculateATHScenario } from '../drawdownService';

interface PP { date: string; price: number }

// Helper: build a price series day-by-day from a path of prices starting on 2020-01-01
function series(path: number[]): PP[] {
  const start = new Date('2020-01-01T00:00:00Z').getTime();
  return path.map((price, i) => ({
    date: new Date(start + i * 86400000).toISOString().split('T')[0],
    price,
  }));
}

describe('computeDrawdowns', () => {
  it('detects a single ~50% drawdown and computes recovery days', () => {
    // peak 100 (day 0) → trough 50 (day 10) → recovery to 100 (day 20) → push to 110 (day 21)
    const path: number[] = [];
    for (let i = 0; i <= 10; i++) path.push(100 - i * 5);    // 100..50 over 11 days
    for (let i = 1; i <= 10; i++) path.push(50 + i * 5);     // 55..100 over 10 days
    path.push(110);                                          // new ATH closes the period
    const { periods, summary } = computeDrawdowns(series(path), 'local');

    expect(periods.length).toBe(1);
    const p = periods[0];
    expect(p.peakPrice).toBe(100);
    expect(p.troughPrice).toBe(50);
    expect(p.drawdownPercent).toBeCloseTo(50, 5);
    expect(p.daysToTrough).toBe(10);
    expect(p.recoveryDays).toBe(10);
    expect(summary.athPrice).toBe(110);
    expect(summary.maxDrawdown).toBeCloseTo(50, 5);
    expect(summary.totalCrashes).toBe(1);
    expect(summary.dataSource).toBe('local');
  });

  it('marks an open drawdown with null recovery and computes currentDrawdown from ATH', () => {
    // peak 200 then drop to 100 with no recovery
    const path = [200, 180, 160, 140, 120, 100];
    const { periods, summary } = computeDrawdowns(series(path), 'coingecko');
    expect(periods.length).toBe(1);
    expect(periods[0].recoveryDays).toBeNull();
    expect(periods[0].drawdownPercent).toBeCloseTo(50, 5);
    expect(summary.athPrice).toBe(200);
    expect(summary.currentPrice).toBe(100);
    expect(summary.currentDrawdown).toBeCloseTo(50, 5);
  });

  it('ignores shallow dips below the 20% threshold', () => {
    // 100 → 85 (-15%) → 100 → 80 (-20%) → 100. Only second qualifies.
    const path = [100, 95, 90, 85, 90, 95, 100, 95, 90, 85, 80, 90, 100];
    const { periods } = computeDrawdowns(series(path), 'local');
    expect(periods.length).toBe(1);
    expect(periods[0].drawdownPercent).toBeCloseTo(20, 5);
  });

  it('sorts multiple drawdowns by severity and ranks them', () => {
    const path = [
      100, 60, 100,           // -40%
      120, 30, 120,           // -75%
      130, 91, 130,           // -30%
    ];
    const { periods } = computeDrawdowns(series(path), 'local');
    expect(periods.map((p) => p.rank)).toEqual([1, 2, 3]);
    expect(periods[0].drawdownPercent).toBeGreaterThan(periods[1].drawdownPercent);
    expect(periods[1].drawdownPercent).toBeGreaterThan(periods[2].drawdownPercent);
  });

  it('throws on empty input rather than returning misleading numbers', () => {
    expect(() => computeDrawdowns([], 'local')).toThrow();
  });

  it('keeps ATH/asOf stable regardless of dataSource label', () => {
    const path = [50, 100, 80, 100, 90];
    const a = computeDrawdowns(series(path), 'coingecko');
    const b = computeDrawdowns(series(path), 'cryptocompare');
    expect(a.summary.athPrice).toBe(b.summary.athPrice);
    expect(a.summary.athDate).toBe(b.summary.athDate);
    expect(a.summary.asOf).toBe(b.summary.asOf);
    expect(a.summary.dataSource).toBe('coingecko');
    expect(b.summary.dataSource).toBe('cryptocompare');
  });
});

describe('calculateATHScenario', () => {
  it('computes loss% and dollar P/L when buying at ATH', () => {
    const r = calculateATHScenario(100, '2025-10-06', 50, 1000);
    expect(r.btcBought).toBeCloseTo(10, 5);
    expect(r.currentValue).toBeCloseTo(500, 5);
    expect(r.lossPercent).toBeCloseTo(-50, 5);
    expect(r.profitUsd).toBeCloseTo(-500, 5);
  });
});
