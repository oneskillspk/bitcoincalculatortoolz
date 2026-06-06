import { describe, it, expect } from 'vitest';
import { formatCurrencyDisplay, formatBtcDisplay, formatPercent } from '@/utils/numberFormat';

describe('numberFormat', () => {
  it('formats small currency without compact notation', () => {
    const r = formatCurrencyDisplay(1234, '$');
    expect(r.display).toBe('$1,234');
    expect(r.full).toBe('$1,234.00');
  });

  it('uses K/M/B compact above threshold and preserves full precision', () => {
    const m = formatCurrencyDisplay(1_234_567.89, '$');
    expect(m.display).toBe('$1.23M');
    expect(m.full).toBe('$1,234,567.89');

    const b = formatCurrencyDisplay(2_500_000_000, '€');
    expect(b.display).toBe('€2.50B');
    expect(b.full).toBe('€2,500,000,000.00');
  });

  it('handles negatives correctly', () => {
    const n = formatCurrencyDisplay(-1_500_000, '$');
    expect(n.display).toBe('-$1.50M');
    expect(n.full).toBe('-$1,500,000.00');
  });

  it('formats BTC with 4-digit display and 8-digit full precision', () => {
    const r = formatBtcDisplay(0.12345678);
    expect(r.display).toBe('₿0.1235');
    expect(r.full).toBe('₿0.12345678');
  });

  it('formats infinity safely', () => {
    expect(formatCurrencyDisplay(Infinity, '$').display).toBe('$∞');
    expect(formatPercent(Infinity).display).toBe('∞%');
  });
});
