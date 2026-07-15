/**
 * Utility functions for formatting values with proper handling of edge cases.
 *
 * Guiding rules for extreme / non-finite inputs:
 *  - Never render the literal "Infinity", "-Infinity", "NaN", or the ∞ symbol
 *    in user-facing output. They imply a real value and are misleading.
 *  - Use an em dash ("—") as the universal "no meaningful value" placeholder.
 *  - Compress very large magnitudes with K / M / B / T suffixes so we never
 *    dump 15-digit percentages onto the UI.
 */

const NON_FINITE_PLACEHOLDER = '—';

/**
 * Coerces a value to a finite number, returning null for NaN / ±Infinity /
 * non-numeric input. Centralised so every formatter treats edge cases the same
 * way.
 */
function toFiniteNumber(value: unknown): number | null {
  if (typeof value !== 'number') return null;
  if (!Number.isFinite(value)) return null;
  return value;
}

/**
 * Formats ROI percentage safely. Large magnitudes are compressed with a
 * suffix and non-finite / non-numeric input renders as an em dash instead of
 * "Infinity", "NaN", or "∞".
 */
export function formatROI(percentage: number, decimalPlaces: number = 1): string {
  const value = toFiniteNumber(percentage);
  if (value === null) return NON_FINITE_PLACEHOLDER;

  // Normalise -0 so we don't render "+0.0%" for a negative zero input.
  const normalised = Object.is(value, -0) ? 0 : value;
  const sign = normalised >= 0 ? '+' : '';
  const abs = Math.abs(normalised);
  const dp = Math.max(0, Math.min(20, decimalPlaces));

  if (abs >= 1e12) return `${sign}${(normalised / 1e12).toFixed(dp)}T%`;
  if (abs >= 1e9) return `${sign}${(normalised / 1e9).toFixed(dp)}B%`;
  if (abs >= 1e6) return `${sign}${(normalised / 1e6).toFixed(dp)}M%`;
  if (abs >= 1e4) return `${sign}${(normalised / 1e3).toFixed(dp)}K%`;

  if (abs >= 1000) {
    return `${sign}${normalised.toLocaleString('en-US', {
      minimumFractionDigits: dp,
      maximumFractionDigits: dp,
    })}%`;
  }

  return `${sign}${normalised.toFixed(dp)}%`;
}


/**
 * Formats currency values with proper localization.
 * Non-finite values render as an em dash instead of "$∞" or "$NaN".
 */
export function formatCurrency(
  value: number,
  currency: { symbol: string; code: string } | undefined,
  showInBtc: boolean = false,
  locale: string = 'en-US',
): string {
  const symbol = currency?.symbol || '$';
  const finite = toFiniteNumber(value);

  if (showInBtc) {
    if (finite === null) return NON_FINITE_PLACEHOLDER;
    return `${finite.toFixed(8)} BTC`;
  }

  if (finite === null) return NON_FINITE_PLACEHOLDER;

  const normalised = Object.is(finite, -0) ? 0 : finite;
  const formatted = Math.abs(normalised).toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const sign = normalised < 0 ? '-' : '';
  return `${sign}${symbol}${formatted}`;
}

/**
 * Formats large numbers with K / M / B / T suffixes.
 * Non-finite values render as an em dash instead of "∞".
 */
export function formatLargeNumber(value: number, decimalPlaces: number = 1): string {
  const finite = toFiniteNumber(value);
  if (finite === null) return NON_FINITE_PLACEHOLDER;

  const normalised = Object.is(finite, -0) ? 0 : finite;
  const absValue = Math.abs(normalised);
  const sign = normalised < 0 ? '-' : '';
  const dp = Math.max(0, Math.min(20, decimalPlaces));

  if (absValue >= 1e12) return `${sign}${(absValue / 1e12).toFixed(dp)}T`;
  if (absValue >= 1e9) return `${sign}${(absValue / 1e9).toFixed(dp)}B`;
  if (absValue >= 1e6) return `${sign}${(absValue / 1e6).toFixed(dp)}M`;
  if (absValue >= 1e3) return `${sign}${(absValue / 1e3).toFixed(dp)}K`;

  return `${sign}${absValue.toFixed(dp)}`;
}
