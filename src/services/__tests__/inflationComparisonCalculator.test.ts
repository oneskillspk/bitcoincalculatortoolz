import { describe, it, expect } from 'vitest';
import { InflationComparisonCalculator } from '../inflationComparisonCalculator';

describe('InflationComparisonCalculator.calculateRealReturns', () => {
  it('nominal = invested × (1 + roi%); real = nominal / (1+inflation%)', () => {
    const r = InflationComparisonCalculator.calculateRealReturns(10_000, 50, 10);
    expect(r.nominalValue).toBeCloseTo(15_000, 6);
    expect(r.realValue).toBeCloseTo(15_000 / 1.10, 6);
    expect(r.inflationAdjustedGain).toBeCloseTo(((15_000 / 1.10) - 10_000) / 10_000 * 100, 6);
  });

  it('zero inflation → real = nominal', () => {
    const r = InflationComparisonCalculator.calculateRealReturns(1000, 20, 0);
    expect(r.realValue).toBeCloseTo(r.nominalValue, 9);
  });

  it('inflation exceeds ROI → negative real gain', () => {
    const r = InflationComparisonCalculator.calculateRealReturns(1000, 5, 10);
    expect(r.inflationAdjustedGain).toBeLessThan(0);
  });
});
