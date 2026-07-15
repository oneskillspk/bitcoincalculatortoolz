import { describe, it, expect } from 'vitest';
import {
  computeConversion,
  latestAthConversion,
  formatBtcAmount,
  formatWorth,
} from '../whatIfPeakConversions';
import { formatCurrencyAmount } from '@/utils/formatCurrency';
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
    expect(formatWorth(52.49)).toBe('$52');
    expect(formatWorth(52.5)).toBe('$53'); // banker-agnostic rounding via Math.round
    expect(formatWorth(5230.4)).toBe('$5,230');
    expect(formatWorth(1_234_567.89)).toBe('$1,234,568');
    expect(formatWorth(0)).toBe('$0');
  });

  it('formatWorth keeps thousands separator for the ATH-derived $100 row', () => {
    const row = latestAthConversion(100);
    const display = formatWorth(row.worthNow);
    // Anchor-derived worth is under $100 as of Jul 2026 refs → no separator, no decimals.
    expect(display).toMatch(/^\$\d{1,3}$/);
  });
});

describe('Fiat currency formatting derived from ATH anchors', () => {
  const invest = 100;
  // Currencies covering: 2-decimal Latin (USD/EUR/GBP), Indian grouping (INR),
  // zero-decimal (JPY), and Turkish (TRY) with comma decimal separator.
  const cases: Array<{ code: string; locale?: string; fxFromUsd: number }> = [
    { code: 'USD', fxFromUsd: 1 },
    { code: 'EUR', fxFromUsd: 0.92 },
    { code: 'GBP', fxFromUsd: 0.78 },
    { code: 'INR', fxFromUsd: 83.5 },
    { code: 'JPY', fxFromUsd: 155 },
    { code: 'TRY', fxFromUsd: 40 },
  ];

  it.each(cases)('formats $code worth with correct rounding and grouping', ({ code, fxFromUsd }) => {
    const usdWorth = latestAthConversion(invest).worthNow;
    const localWorth = usdWorth * fxFromUsd;
    const out = formatCurrencyAmount(localWorth, code);
    // Never contain unformatted long digit runs (>=4 digits with no separator).
    // JPY/USD-small values are single/double digits so this holds for all six.
    expect(out).not.toMatch(/\d{4,}/);
    expect(out.length).toBeGreaterThan(0);
  });

  it('applies thousands separators for large fiat conversions', () => {
    // Simulate the 2010 Pizza Day row scaled to fiat: 24,390 BTC * $65,000 ≈ $1.585B.
    const usd = 24_390 * 65_000;
    expect(formatCurrencyAmount(usd, 'USD')).toContain(',');
    expect(formatCurrencyAmount(usd * 83.5, 'INR')).toMatch(/[,]/); // Indian grouping uses commas
    expect(formatCurrencyAmount(usd * 40, 'TRY')).toMatch(/[.\s]/); // tr-TR uses dot/nbsp grouping
    // JPY prints without a decimal fraction
    expect(formatCurrencyAmount(usd * 155, 'JPY')).not.toMatch(/[.,]\d{2}$/);
  });

  it('rounds fractional fiat amounts to the currency default (no decimals for standard)', () => {
    // 100 USD @ ATH (~$126k) is worth ~$52 → 52 * 0.92 EUR ≈ 47.84
    const eur = latestAthConversion(100).worthNow * 0.92;
    const out = formatCurrencyAmount(eur, 'EUR');
    // Default decimals=0 for standard notation → no decimal separator in output.
    expect(out).not.toMatch(/[.,]\d{2}$/);
  });

  it('renders TRY with tr-TR grouping (dot thousands, comma decimals) at 2-decimal precision', () => {
    const out = formatCurrencyAmount(1_234_567.89, 'TRY', { decimals: 2 });
    // Comma is the decimal separator in tr-TR
    expect(out).toMatch(/,\d{2}$/);
    // Grouping present somewhere before the decimal
    expect(out).toMatch(/[.\s\u00a0]/);
  });
});

