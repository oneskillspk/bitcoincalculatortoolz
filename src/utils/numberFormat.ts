/**
 * Standardized number formatting used across all calculator result cards.
 * Returns both a compact display value (fits inside small cards on mobile)
 * and the full precision value (shown in a tooltip on hover/tap).
 *
 * All formatters accept an optional BCP-47 locale (e.g. `tr-TR`) so callers
 * driven by URL locale render correct thousands/decimal separators regardless
 * of the user's browser locale. Defaults to `en-US` to preserve historical
 * output for unspecified call sites.
 */

export interface FormattedValue {
  display: string;
  full: string;
}

const COMPACT_THRESHOLD = 100_000; // values >= 100k use K/M/B notation

function compact(abs: number): string {
  if (abs >= 1e12) return `${(abs / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${(abs / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${(abs / 1e3).toFixed(2)}K`;
  return abs.toFixed(0);
}

const fullNumber = (value: number, decimals = 2, locale: string = 'en-US') =>
  value.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

export function formatCurrencyDisplay(
  value: number,
  symbol = '$',
  opts: { compactThreshold?: number; signed?: boolean; locale?: string } = {},
): FormattedValue {
  if (!isFinite(value)) return { display: `${symbol}∞`, full: `${symbol}∞` };
  const locale = opts.locale ?? 'en-US';
  const threshold = opts.compactThreshold ?? COMPACT_THRESHOLD;
  const abs = Math.abs(value);
  const negSign = value < 0 ? '-' : opts.signed && value > 0 ? '+' : '';
  const useCompact = abs >= threshold;
  const displayBody = useCompact
    ? compact(abs)
    : abs.toLocaleString(locale, { maximumFractionDigits: 0 });
  const fullBody = fullNumber(abs, 2, locale);
  return {
    display: `${negSign}${symbol}${displayBody}`,
    full: `${negSign}${symbol}${fullBody}`,
  };
}

export function formatBtcDisplay(value: number): FormattedValue {
  if (!isFinite(value)) return { display: '₿∞', full: '₿∞' };
  return {
    display: `₿${value.toFixed(4)}`,
    full: `₿${value.toFixed(8)}`,
  };
}

export function formatPercent(value: number, decimals = 1): FormattedValue {
  if (!isFinite(value)) return { display: '∞%', full: '∞%' };
  const sign = value > 0 ? '+' : '';
  return {
    display: `${sign}${value.toFixed(decimals)}%`,
    full: `${sign}${value.toFixed(4)}%`,
  };
}

/**
 * Locale-aware thousands-grouped integer, without going through
 * `toLocaleString` — which is banned inside result panels by
 * `RESULTS_PANEL_SPEC` §6 (single formatting path only). Uses `.` as
 * the group separator for Turkish locales and `,` for everything else,
 * matching the site's TR/EN split.
 */
export function formatGroupedInt(value: number, locale: string = 'en-US'): string {
  if (!isFinite(value)) return '∞';
  const sep = locale.toLowerCase().startsWith('tr') ? '.' : ',';
  return Math.trunc(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep);
}

/**
 * Locale-aware grouped decimal. Combines `formatGroupedInt` for the integer
 * side with a `.toFixed()` fractional part so we never touch `toLocaleString`
 * inside result panels (per `RESULTS_PANEL_SPEC` §6).
 */
export function formatGroupedDecimal(
  value: number,
  decimals = 2,
  locale: string = 'en-US',
): string {
  if (!isFinite(value)) return '∞';
  const isTr = locale.toLowerCase().startsWith('tr');
  const decSep = isTr ? ',' : '.';
  const sign = value < 0 ? '-' : '';
  const abs = Math.abs(value);
  const fixed = abs.toFixed(decimals);
  const [intPart, fracPart] = fixed.split('.');
  const groupedInt = formatGroupedInt(Number(intPart), locale);
  return decimals > 0 && fracPart
    ? `${sign}${groupedInt}${decSep}${fracPart}`
    : `${sign}${groupedInt}`;
}
