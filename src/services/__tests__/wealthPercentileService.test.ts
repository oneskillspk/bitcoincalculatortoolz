import { describe, it, expect } from 'vitest';
import {
  calculatePercentile,
  getNextMilestone,
  getGlobalContext,
  satsToBtc,
  btcToSats,
  formatPercentile,
} from '../wealthPercentileService';

describe('wealthPercentileService', () => {
  it('satsToBtc / btcToSats roundtrip', () => {
    expect(satsToBtc(100_000_000)).toBe(1);
    expect(btcToSats(1)).toBe(100_000_000);
    expect(btcToSats(0.5)).toBe(50_000_000);
  });

  it('zero BTC → 0 percentile', () => {
    const r = calculatePercentile(0);
    expect(r.percentile).toBe(0);
    expect(r.addressesBelow).toBe(0);
  });

  it('percentile is monotonic non-decreasing in BTC', () => {
    const samples = [0.001, 0.01, 0.1, 1, 10, 100, 1000];
    const pcts = samples.map((s) => calculatePercentile(s).percentile);
    for (let i = 1; i < pcts.length; i++) {
      expect(pcts[i]).toBeGreaterThanOrEqual(pcts[i - 1]);
    }
  });

  it('percentile is capped at 99.9999', () => {
    const r = calculatePercentile(20_000_000);
    expect(r.percentile).toBeLessThanOrEqual(99.9999);
  });

  it('supplyPercentage uses circulating supply (~19.8M) as denominator', () => {
    const r = calculatePercentile(21);
    // 21 BTC against ~19.8M circulating ≈ 0.000106 %
    expect(r.supplyPercentage).toBeGreaterThan(0.0001);
    expect(r.supplyPercentage).toBeLessThan(0.00015);
  });

  it('getNextMilestone: small holder has a non-null next tier', () => {
    const m = getNextMilestone(0.001);
    expect(m.nextTier).not.toBeNull();
    expect(m.btcNeeded).toBeGreaterThanOrEqual(0);
  });

  it('getGlobalContext returns fair-share comparison string', () => {
    const ctx = getGlobalContext(1);
    expect(ctx.fairShareComparison).toMatch(/x the fair share/);
    expect(ctx.supplyShare).toMatch(/%$/);
  });

  it('formatPercentile clamps at 99.99 for whales', () => {
    expect(formatPercentile(99.9999)).toBe('99.99%');
    expect(formatPercentile(50)).toBe('50.0%');
  });
});
