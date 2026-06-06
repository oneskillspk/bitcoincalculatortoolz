/**
 * Locale-aware formatters used by axes, tooltips, and legends.
 * Pass `intlLocale` from useLocale() — defaults to 'en-US'.
 */

export type ChartFormatterKind =
  | 'usd'
  | 'btc'
  | 'sats'
  | 'percent'
  | 'compact'
  | 'date'
  | 'year';

export function formatUsd(value: number, intlLocale = 'en-US'): string {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat(intlLocale, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: Math.abs(value) >= 1000 ? 0 : 2,
  }).format(value);
}

export function formatBtc(value: number, intlLocale = 'en-US'): string {
  if (!Number.isFinite(value)) return '—';
  const digits = Math.abs(value) >= 1 ? 4 : 8;
  return `₿ ${new Intl.NumberFormat(intlLocale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: digits,
  }).format(value)}`;
}

export function formatSats(value: number, intlLocale = 'en-US'): string {
  if (!Number.isFinite(value)) return '—';
  return `${new Intl.NumberFormat(intlLocale, {
    maximumFractionDigits: 0,
  }).format(value)} sats`;
}

export function formatPercent(value: number, intlLocale = 'en-US'): string {
  if (!Number.isFinite(value)) return '—';
  return `${new Intl.NumberFormat(intlLocale, {
    minimumFractionDigits: Math.abs(value) < 1 ? 2 : 1,
    maximumFractionDigits: 2,
  }).format(value)}%`;
}

export function formatCompact(value: number, intlLocale = 'en-US'): string {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat(intlLocale, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatCompactUsd(value: number, intlLocale = 'en-US'): string {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat(intlLocale, {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatYear(value: string | number): string {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? String(value) : String(d.getFullYear());
}

export function formatShortDate(value: string | number, intlLocale = 'en-US'): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return new Intl.DateTimeFormat(intlLocale, {
    month: 'short',
    year: 'numeric',
  }).format(d);
}

/** Pick a formatter by kind. Returns a unary function ready for Recharts. */
export function getFormatter(
  kind: ChartFormatterKind,
  intlLocale = 'en-US',
): (v: number | string) => string {
  switch (kind) {
    case 'usd':
      return (v) => formatUsd(Number(v), intlLocale);
    case 'btc':
      return (v) => formatBtc(Number(v), intlLocale);
    case 'sats':
      return (v) => formatSats(Number(v), intlLocale);
    case 'percent':
      return (v) => formatPercent(Number(v), intlLocale);
    case 'compact':
      return (v) => formatCompactUsd(Number(v), intlLocale);
    case 'year':
      return (v) => formatYear(v);
    case 'date':
      return (v) => formatShortDate(v, intlLocale);
  }
}
