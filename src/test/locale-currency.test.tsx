import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useLocale } from '@/hooks/useLocale';
import { formatCurrencyDisplay } from '@/utils/numberFormat';

const wrapperFor = (initialPath: string) =>
  ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter initialEntries={[initialPath]}>{children}</MemoryRouter>
  );

describe('Locale-driven currency defaults (e2e contract)', () => {
  it('defaults to USD on English routes', () => {
    const { result } = renderHook(() => useLocale(), {
      wrapper: wrapperFor('/converter'),
    });
    expect(result.current.locale).toBe('en');
    expect(result.current.defaultCurrency).toBe('USD');
    expect(result.current.intlLocale).toBe('en-US');
    expect(result.current.isTr).toBe(false);
  });

  it('defaults to TRY on /tr converter route', () => {
    const { result } = renderHook(() => useLocale(), {
      wrapper: wrapperFor('/tr/donusturucu'),
    });
    expect(result.current.locale).toBe('tr');
    expect(result.current.defaultCurrency).toBe('TRY');
    expect(result.current.intlLocale).toBe('tr-TR');
    expect(result.current.isTr).toBe(true);
  });

  it('treats bare /tr as Turkish', () => {
    const { result } = renderHook(() => useLocale(), {
      wrapper: wrapperFor('/tr'),
    });
    expect(result.current.isTr).toBe(true);
    expect(result.current.defaultCurrency).toBe('TRY');
  });

  it('does not match URLs that merely contain "tr"', () => {
    const { result } = renderHook(() => useLocale(), {
      wrapper: wrapperFor('/transactions'),
    });
    expect(result.current.isTr).toBe(false);
    expect(result.current.defaultCurrency).toBe('USD');
  });

  it('pick() returns locale-specific values', () => {
    const en = renderHook(() => useLocale(), { wrapper: wrapperFor('/') });
    const tr = renderHook(() => useLocale(), { wrapper: wrapperFor('/tr/') });
    expect(en.result.current.pick({ en: 'Copy', tr: 'Kopyala' })).toBe('Copy');
    expect(tr.result.current.pick({ en: 'Copy', tr: 'Kopyala' })).toBe('Kopyala');
  });
});

describe('Number formatting consistency across locales', () => {
  it('formats USD and TRY values with the same numeric backbone', () => {
    const usd = formatCurrencyDisplay(1234567.89, '$');
    const tryF = formatCurrencyDisplay(1234567.89, '₺');
    expect(usd.display).toMatch(/^\$/);
    expect(tryF.display).toMatch(/^₺/);
    // Above threshold both should use compact (K/M/B) notation
    expect(usd.display).toMatch(/[KMB]$/);
    expect(tryF.display).toMatch(/[KMB]$/);
    // Full precision should expose all digits
    expect(usd.full).toContain('1,234,567');
    expect(tryF.full).toContain('1,234,567');
  });

  it('keeps small values unabbreviated in both currencies', () => {
    const usd = formatCurrencyDisplay(42.5, '$');
    const tryF = formatCurrencyDisplay(42.5, '₺');
    expect(usd.display).not.toMatch(/[KMB]$/);
    expect(tryF.display).not.toMatch(/[KMB]$/);
  });
});
