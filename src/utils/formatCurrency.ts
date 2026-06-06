/**
 * Locale + ISO currency aware money formatter.
 *
 * Uses `Intl.NumberFormat` so every ISO 4217 currency renders with the right
 * symbol and digit grouping (e.g. PKR → Rs, INR → ₹ with 14,42,231 grouping,
 * JPY → ¥, CHF → CHF, TRY → ₺). No hand-maintained symbol map needed.
 */
export interface FormatCurrencyOptions {
  /** Render in compact notation (e.g. $1.44M). Default false. */
  compact?: boolean;
  /** Decimal digits. Defaults: 0 for standard, 2 for compact. */
  decimals?: number;
  /** BCP-47 locale tag. Defaults to 'en-US'. Pass 'tr-TR' for Turkish routes. */
  locale?: string;
  /** Prefix with explicit + sign for positive numbers. */
  signed?: boolean;
}

/**
 * Per-currency locale fallbacks that produce the most natural digit grouping
 * and symbol placement for currencies that often display long amounts.
 * Only used when the caller did not pass an explicit locale.
 */
const CURRENCY_LOCALE_FALLBACK: Record<string, string> = {
  INR: 'en-IN',
  PKR: 'en-PK',
  BDT: 'en-BD',
  LKR: 'en-LK',
  NPR: 'en-NP',
  JPY: 'ja-JP',
  CNY: 'zh-CN',
  KRW: 'ko-KR',
  TRY: 'tr-TR',
  RUB: 'ru-RU',
  BRL: 'pt-BR',
  CHF: 'de-CH',
  EUR: 'en-IE',
  GBP: 'en-GB',
};

function resolveLocale(currency: string, locale?: string): string {
  if (locale) return locale;
  const code = (currency || '').toUpperCase();
  return CURRENCY_LOCALE_FALLBACK[code] ?? 'en-US';
}

export function formatCurrencyAmount(
  amount: number,
  currency: string,
  opts: FormatCurrencyOptions = {},
): string {
  const { compact = false, decimals, signed = false } = opts;
  const locale = resolveLocale(currency, opts.locale);
  const fractionDigits = decimals ?? (compact ? 2 : 0);

  let formatted: string;
  try {
    formatted = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: (currency || 'USD').toUpperCase(),
      notation: compact ? 'compact' : 'standard',
      maximumFractionDigits: fractionDigits,
      minimumFractionDigits: 0,
      currencyDisplay: 'narrowSymbol',
    }).format(amount);
  } catch {
    // Intl rejects unknown / malformed currency codes — fall back gracefully.
    formatted = `${(currency || '').toUpperCase()} ${amount.toLocaleString(locale, {
      maximumFractionDigits: fractionDigits,
      minimumFractionDigits: 0,
    })}`;
  }

  if (signed && amount > 0 && !formatted.startsWith('+')) {
    return `+${formatted}`;
  }
  return formatted;
}

/** Convenience wrapper for compact mode. */
export const formatCurrencyCompact = (amount: number, currency: string, locale?: string) =>
  formatCurrencyAmount(amount, currency, { compact: true, locale });

export interface CurrencyDisplay {
  /** Card-safe value — compact above the threshold, full otherwise. */
  display: string;
  /** Always-full value, suitable for tooltips, titles, exports. */
  full: string;
  /** True if `display` was compacted (e.g. `Rs 3.43M`). */
  isCompact: boolean;
}

export interface FormatCurrencyForDisplayOptions extends FormatCurrencyOptions {
  /** Numbers whose |value| exceeds this are rendered compact. Default 100_000. */
  compactAbove?: number;
  /** Decimals for the full (tooltip) value. Default 2. */
  fullDecimals?: number;
}

/**
 * Card-safe currency formatter.
 *
 * Returns a short `display` value suitable for narrow KPI cards and a `full`
 * value to use for tooltips, titles, exports, or screen readers. This is the
 * primary helper for result panels — it prevents long currencies (PKR, INR,
 * JPY, CHF, TRY) from being clipped with `...` inside tight cards.
 */
export function formatCurrencyForDisplay(
  amount: number,
  currency: string,
  opts: FormatCurrencyForDisplayOptions = {},
): CurrencyDisplay {
  const {
    compactAbove = 100_000,
    fullDecimals = 2,
    decimals,
    signed,
  } = opts;
  const locale = resolveLocale(currency, opts.locale);
  const abs = Math.abs(amount);
  const useCompact = isFinite(amount) && abs >= compactAbove;

  const display = formatCurrencyAmount(amount, currency, {
    locale,
    signed,
    compact: useCompact,
    decimals: useCompact ? decimals ?? 2 : decimals ?? 0,
  });

  const full = formatCurrencyAmount(amount, currency, {
    locale,
    signed,
    compact: false,
    decimals: fullDecimals,
  });

  return { display, full, isCompact: useCompact };
}
