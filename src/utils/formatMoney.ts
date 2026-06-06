import { formatTRY } from './formatTRY';

/**
 * Locale-aware money formatter. In TR, converts USD→TRY using the supplied
 * fxRate and renders ₺X. In EN, renders $X.
 *
 * Use the `useUsdToTryRate()` hook to obtain a live rate and pass it here
 * so calculator outputs stay accurate as the lira moves intraday.
 */
export function formatMoney(
  usdValue: number,
  opts: { tr: boolean; fxRate?: number; decimals?: number }
): string {
  const { tr, fxRate = 1, decimals = 0 } = opts;
  if (tr) {
    return formatTRY(usdValue * fxRate, decimals);
  }
  const formatted = usdValue.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `$${formatted}`;
}

/**
 * Compact money formatter ($1.2M, ₺48.9M, $250K, ₺9.9M). For TR, converts
 * USD→TRY via fxRate and renders with ₺ + Turkish digits. For EN, renders $.
 */
export function formatMoneyCompact(
  usdValue: number,
  opts: { tr: boolean; fxRate?: number }
): string {
  const { tr, fxRate = 1 } = opts;
  const v = tr ? usdValue * fxRate : usdValue;
  const symbol = tr ? '₺' : '$';
  const locale = tr ? 'tr-TR' : 'en-US';
  const fmt = (n: number, d: number) =>
    n.toLocaleString(locale, { minimumFractionDigits: d, maximumFractionDigits: d });
  if (Math.abs(v) >= 1_000_000_000) return `${symbol}${fmt(v / 1_000_000_000, 2)}B`;
  if (Math.abs(v) >= 1_000_000) return `${symbol}${fmt(v / 1_000_000, 2)}M`;
  if (Math.abs(v) >= 1_000) return `${symbol}${fmt(v / 1_000, 0)}K`;
  if (Math.abs(v) >= 1) return `${symbol}${fmt(v, 0)}`;
  return `${symbol}${fmt(v, 4)}`;
}
