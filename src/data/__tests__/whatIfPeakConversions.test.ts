import { describe, it, expect } from 'vitest';
import {
  computeConversion,
  latestAthConversion,
  formatBtcAmount,
  formatWorth,
} from '../whatIfPeakConversions';
import { BTC_REF_PRICE_USD, LATEST_ATH_USD, LATEST_ATH_DATE } from '../whatIfAnchors';

describe('whatIfPeakConversions', () => {
  it('anchors expose the verified Oct 6, 2025 ATH', () => {
    expect(LATEST_ATH_USD).toBe(126_198);
    expect(LATEST_ATH_DATE).toBe('2025-10-06');
  });

  it('computeConversion derives BTC amount and current worth', () => {
    const { btcAmount, worthNow } = computeConversion(1000, 100, 65_000);
    expect(btcAmount).toBeCloseTo(0.1, 10);
    expect(worthNow).toBeCloseTo(6_500, 6);
  });

  it('latestAthConversion($100) uses LATEST_ATH_USD and BTC_REF_PRICE_USD', () => {
    const row = latestAthConversion(100);
    expect(row.btcAmount).toBeCloseTo(100 / LATEST_ATH_USD, 12);
    expect(row.worthNow).toBeCloseTo((100 / LATEST_ATH_USD) * BTC_REF_PRICE_USD, 8);
  });

  it('throws on non-positive btcPrice', () => {
    expect(() => computeConversion(0, 100)).toThrow();
    expect(() => computeConversion(-1, 100)).toThrow();
  });

  it('formatBtcAmount picks precision by magnitude', () => {
    expect(formatBtcAmount(24_390)).toBe('24390.00');
    expect(formatBtcAmount(0.0805)).toBe('0.08050');
    expect(formatBtcAmount(0.000792)).toBe('0.000792');
  });

  it('formatWorth rounds and thousands-separates in USD', () => {
    expect(formatWorth(52.17)).toBe('$52');
    expect(formatWorth(5230.4)).toBe('$5,230');
  });
});
