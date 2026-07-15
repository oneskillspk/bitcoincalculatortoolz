import { describe, it, expect } from 'vitest';
import {
  MIN_SELECTABLE_DATE,
  getMaxSelectableDate,
  clampSelectableDate,
  computeConversion,
} from '../whatIfPeakConversions';
import { BTC_REF_PRICE_USD } from '../whatIfAnchors';
import { formatCurrencyAmount } from '@/utils/formatCurrency';

/**
 * These tests lock the contract between the date picker's selectable range
 * (2009-01-03 → today) and the fiat conversion helpers so that boundary
 * dates and leap-year edges never leak stale or unformatted numbers into
 * the UI.
 */

describe('clampSelectableDate — min/max bounds', () => {
  const NOW = new Date('2026-07-15T12:00:00Z');

  it('exposes the Bitcoin-genesis minimum as an immutable anchor', () => {
    expect(MIN_SELECTABLE_DATE.toISOString().slice(0, 10)).toBe('2009-01-03');
  });

  it('clamps a pre-genesis date up to MIN_SELECTABLE_DATE', () => {
    const out = clampSelectableDate(new Date('1999-01-01T00:00:00Z'), NOW);
    expect(out.getTime()).toBe(MIN_SELECTABLE_DATE.getTime());
  });

  it('clamps a far-future date down to today (max)', () => {
    const out = clampSelectableDate(new Date('2099-12-31T00:00:00Z'), NOW);
    expect(out.getTime()).toBe(getMaxSelectableDate(NOW).getTime());
  });

  it('passes an in-range date through untouched', () => {
    const inRange = new Date('2017-12-17T00:00:00Z');
    expect(clampSelectableDate(inRange, NOW).getTime()).toBe(inRange.getTime());
  });

  it('collapses Invalid Date to MIN_SELECTABLE_DATE', () => {
    const out = clampSelectableDate(new Date('not-a-date'), NOW);
    expect(out.getTime()).toBe(MIN_SELECTABLE_DATE.getTime());
  });

  it('treats the exact min boundary as valid', () => {
    const out = clampSelectableDate(new Date(MIN_SELECTABLE_DATE), NOW);
    expect(out.getTime()).toBe(MIN_SELECTABLE_DATE.getTime());
  });
});

describe('Leap-year edge cases', () => {
  const NOW = new Date('2026-07-15T12:00:00Z');

  it('accepts Feb 29 on real leap years (2016, 2020, 2024)', () => {
    for (const yr of [2016, 2020, 2024]) {
      const feb29 = new Date(Date.UTC(yr, 1, 29));
      // Real leap day → month stays February.
      expect(feb29.getUTCMonth()).toBe(1);
      expect(feb29.getUTCDate()).toBe(29);
      expect(clampSelectableDate(feb29, NOW).getTime()).toBe(feb29.getTime());
    }
  });

  it('rolls Feb 29 into March 1 on non-leap years (JS Date semantics)', () => {
    // 2023 is not a leap year — constructing Feb 29 must overflow to Mar 1
    // so any consumer relying on the raw Date sees the same UTC calendar.
    const overflow = new Date(Date.UTC(2023, 1, 29));
    expect(overflow.getUTCMonth()).toBe(2); // March
    expect(overflow.getUTCDate()).toBe(1);
  });

  it('century-rule: 1900 is not a leap year, 2000 is', () => {
    expect(new Date(Date.UTC(1900, 1, 29)).getUTCMonth()).toBe(2); // Mar
    expect(new Date(Date.UTC(2000, 1, 29)).getUTCDate()).toBe(29);
  });

  it('Feb 29 2020 conversion produces the same math as any other in-range date', () => {
    const feb29 = new Date(Date.UTC(2020, 1, 29));
    expect(clampSelectableDate(feb29, NOW).getTime()).toBe(feb29.getTime());
    // Historical BTC ~$8,672 on 2020-02-29; verify pure-math derivation.
    const { btcAmount, worthNow } = computeConversion(8_672, 100);
    expect(btcAmount).toBeCloseTo(100 / 8_672, 12);
    expect(worthNow).toBeCloseTo((100 / 8_672) * BTC_REF_PRICE_USD, 6);
  });
});

describe('Fiat conversion formatting at boundary dates', () => {
  const NOW = new Date('2026-07-15T12:00:00Z');

  // Approximate historical BTC prices for the boundary dates we test against.
  // Values are illustrative — the assertions target formatting, not the price.
  const boundaries: Array<{
    label: string;
    date: Date;
    btcPrice: number;
  }> = [
    { label: 'min (genesis)', date: MIN_SELECTABLE_DATE, btcPrice: 0.0008 },
    { label: 'max (today)', date: getMaxSelectableDate(NOW), btcPrice: BTC_REF_PRICE_USD },
    { label: 'leap day 2020-02-29', date: new Date(Date.UTC(2020, 1, 29)), btcPrice: 8_672 },
    { label: 'leap day 2024-02-29', date: new Date(Date.UTC(2024, 1, 29)), btcPrice: 62_400 },
  ];

  it.each(boundaries)('$label: worth renders with correct rounding + grouping across fiats', ({ date, btcPrice }) => {
    // Every boundary date must be inside the selectable range.
    expect(clampSelectableDate(date, NOW).getTime()).toBe(date.getTime());

    const { worthNow } = computeConversion(btcPrice, 100);
    // USD → integer with thousands separators when >=1,000
    const usd = formatCurrencyAmount(worthNow, 'USD');
    expect(usd.startsWith('$')).toBe(true);
    if (Math.round(worthNow) >= 1000) expect(usd).toContain(',');
    // Default decimals=0 for standard notation → no trailing ".xx"
    expect(usd).not.toMatch(/\.\d{2}$/);

    // EUR (locale en-IE via fallback) still respects 0-decimal default.
    const eur = formatCurrencyAmount(worthNow * 0.92, 'EUR');
    expect(eur).not.toMatch(/\.\d{2}$/);

    // JPY has no minor unit → never prints a decimal fraction.
    const jpy = formatCurrencyAmount(worthNow * 155, 'JPY');
    expect(jpy).not.toMatch(/[.,]\d{2}$/);

    // TRY uses tr-TR grouping — dot thousands separators. Intl trims trailing
    // zero decimals when minimumFractionDigits=0, so assert on a value with a
    // real fractional part to lock the comma decimal separator too.
    const tryOut = formatCurrencyAmount(worthNow * 40 + 0.37, 'TRY', { decimals: 2 });
    expect(tryOut).toMatch(/,\d{2}$/);
  });

  it('genesis-date $100 buys an enormous BTC stack that formats as billions', () => {
    // At $0.0008 → 100/0.0008 = 125,000 BTC → * $107,890 ≈ $13.49B
    const { worthNow } = computeConversion(0.0008, 100);
    const compact = formatCurrencyAmount(worthNow, 'USD', { compact: true, decimals: 2 });
    expect(compact).toMatch(/[MB]$/);
    const full = formatCurrencyAmount(worthNow, 'USD');
    // Full form must contain at least three comma groupings (billions).
    expect((full.match(/,/g) || []).length).toBeGreaterThanOrEqual(3);
  });

  it('max-date (today) $100 is worth exactly $100 in USD (no rounding drift)', () => {
    const { worthNow } = computeConversion(BTC_REF_PRICE_USD, 100);
    expect(worthNow).toBeCloseTo(100, 10);
    expect(formatCurrencyAmount(worthNow, 'USD')).toBe('$100');
  });
});
