import { describe, it, expect } from 'vitest';
import { calculateS2F, getMVRVSignal, getMVRVLabel } from '../onChainMetricsService';

describe('onChainMetricsService', () => {
  it('calculateS2F: ratio = supply / annualFlow (164,250 BTC/yr post-2024 halving)', () => {
    const r = calculateS2F(19_850_000);
    expect(r.ratio).toBeCloseTo(19_850_000 / 164_250, 4);
    // Model price is exp(14.6) * ratio^3.3 — verify formula numerically
    const expected = Math.exp(14.6) * Math.pow(r.ratio, 3.3);
    expect(r.modelPrice).toBeCloseTo(expected, 0);
  });

  it('getMVRVSignal: boundary thresholds', () => {
    expect(getMVRVSignal(0.8)).toBe('undervalued');
    expect(getMVRVSignal(1.5)).toBe('fair');
    expect(getMVRVSignal(3.0)).toBe('overvalued');
    expect(getMVRVSignal(4.0)).toBe('extreme');
  });

  it('getMVRVLabel: returns a label string for every signal', () => {
    (['undervalued', 'fair', 'overvalued', 'extreme'] as const).forEach((s) => {
      expect(getMVRVLabel(s).label).toBeTruthy();
    });
  });
});
