import { describe, expect, it } from 'vitest';
import { formatCurrency, formatLargeNumber, formatROI } from '../formatters';

describe('formatROI', () => {
  it('formats large historical returns without rendering infinity', () => {
    expect(formatROI(435_957, 1)).toBe('+436.0K%');
    expect(formatROI(10_000, 1)).toBe('+10.0K%');
    expect(formatROI(9_999.9, 1)).toBe('+9,999.9%');
  });

  it('compresses extreme magnitudes with M / B / T suffixes', () => {
    expect(formatROI(5_871_500_000, 1)).toBe('+5.9B%');
    expect(formatROI(1.2e13, 1)).toBe('+12.0T%');
    expect(formatROI(-2_500_000, 1)).toBe('-2.5M%');
  });

  it('handles small and negative values normally', () => {
    expect(formatROI(0, 1)).toBe('+0.0%');
    expect(formatROI(-0, 1)).toBe('+0.0%');
    expect(formatROI(-29.4, 1)).toBe('-29.4%');
    expect(formatROI(12.345, 2)).toBe('+12.35%');
  });

  it('uses an em dash for every non-finite value and never leaks Infinity/NaN', () => {
    for (const bad of [Infinity, -Infinity, Number.NaN]) {
      const out = formatROI(bad, 1);
      expect(out).toBe('—');
      expect(out).not.toMatch(/Infinity|NaN|∞/i);
    }
    // Defensive: non-number inputs (e.g. from bad API data) also stay safe.
    expect(formatROI(undefined as unknown as number, 1)).toBe('—');
    expect(formatROI(null as unknown as number, 1)).toBe('—');
    expect(formatROI('123' as unknown as number, 1)).toBe('—');
  });
});

describe('formatCurrency', () => {
  const usd = { symbol: '$', code: 'USD' };

  it('formats finite values with symbol and grouping', () => {
    expect(formatCurrency(1234.5, usd)).toBe('$1,234.50');
    expect(formatCurrency(-99.9, usd)).toBe('-$99.90');
  });

  it('formats BTC output when requested', () => {
    expect(formatCurrency(0.12345678, usd, true)).toBe('0.12345678 BTC');
  });

  it('returns em dash — never $∞ or $NaN — for non-finite input', () => {
    for (const bad of [Infinity, -Infinity, Number.NaN]) {
      expect(formatCurrency(bad, usd)).toBe('—');
      expect(formatCurrency(bad, usd, true)).toBe('—');
    }
  });
});

describe('formatLargeNumber', () => {
  it('compresses with K / M / B / T suffixes', () => {
    expect(formatLargeNumber(1_500)).toBe('1.5K');
    expect(formatLargeNumber(2_500_000)).toBe('2.5M');
    expect(formatLargeNumber(3.4e9)).toBe('3.4B');
    expect(formatLargeNumber(9.9e12)).toBe('9.9T');
    expect(formatLargeNumber(-1_000)).toBe('-1.0K');
  });

  it('returns em dash instead of ∞ for non-finite input', () => {
    for (const bad of [Infinity, -Infinity, Number.NaN]) {
      const out = formatLargeNumber(bad);
      expect(out).toBe('—');
      expect(out).not.toMatch(/Infinity|NaN|∞/i);
    }
  });
});
