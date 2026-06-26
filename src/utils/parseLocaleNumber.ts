/**
 * Locale-aware numeric input parser.
 *
 * Browsers + free-text <input type="text"> panels accept whatever the user types,
 * so a TR user typing `1,5` (= 1.5) or `1.234,56` (= 1234.56) must not be fed to
 * `parseFloat` directly — `parseFloat` only understands `.` as the decimal sep
 * and silently truncates at the first `,`. Result: 10×+ wrong calculations.
 *
 * This helper inspects the locale and normalises the input to a dotted decimal
 * before parsing. Safe to call on already-clean ASCII numerics too.
 *
 * - `tr-TR` / locale starting with `tr`: `.` = thousands, `,` = decimal
 * - everything else (default `en-US`): `,` = thousands, `.` = decimal
 *
 * Returns `NaN` for empty or unparseable input — matches `parseFloat` semantics.
 */
export function parseLocaleNumber(value: string | number | null | undefined, locale: string = 'en-US'): number {
  if (value === null || value === undefined) return NaN;
  if (typeof value === 'number') return value;

  const trimmed = value.trim();
  if (!trimmed) return NaN;

  const isTr = locale.toLowerCase().startsWith('tr');

  // Keep only digits, separators, and a leading sign.
  const sign = trimmed.startsWith('-') ? '-' : '';
  const body = trimmed.replace(/^[+-]/, '').replace(/[^0-9.,]/g, '');

  let normalised: string;
  if (isTr) {
    // Strip thousands `.`, swap decimal `,` → `.`
    normalised = body.replace(/\./g, '').replace(',', '.');
  } else {
    // Strip thousands `,`
    normalised = body.replace(/,/g, '');
  }

  const parsed = parseFloat(`${sign}${normalised}`);
  return parsed;
}

/**
 * Format a number for display in the active locale using the user's
 * thousands/decimal separators. Mirrors the parser above.
 */
export function formatLocaleNumber(value: number, locale: string = 'en-US'): string {
  if (!isFinite(value)) return String(value);
  return value.toLocaleString(locale);
}

/**
 * Non-hook helper: derive the active BCP-47 locale from the URL prefix.
 * Useful for components that previously called bare `.toLocaleString()` and
 * we want to fix without restructuring them into hook consumers.
 *
 * Mirrors `useLocale()`: `/tr` or `/tr/*` → `tr-TR`, everything else → `en-US`.
 * Safe to call during SSR (returns `en-US`).
 */
export function getCurrentIntlLocale(): string {
  if (typeof window === 'undefined') return 'en-US';
  const path = window.location?.pathname ?? '';
  return path === '/tr' || path.startsWith('/tr/') ? 'tr-TR' : 'en-US';
}


