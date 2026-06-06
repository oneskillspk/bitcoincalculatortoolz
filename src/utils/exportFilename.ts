/**
 * Build a localized filename for exported reports (PDF / PNG / etc.).
 *
 * Why this exists: every export component used to hardcode an English slug
 * such as `bitcoin-investment-report-2026-05-24.pdf`, so Turkish users on
 * /tr/* received English filenames. This helper centralises the slug map
 * and date suffix so every download respects the active language.
 *
 * @example
 *   buildExportFilename({ en: 'bitcoin-investment-report', tr: 'bitcoin-yatirim-raporu' }, 'pdf', 'tr')
 *   // => 'bitcoin-yatirim-raporu-2026-05-24.pdf'
 */
export type ExportLanguage = 'en' | 'tr' | (string & {});
export type ExportExtension = 'pdf' | 'png' | 'jpg' | 'jpeg' | 'csv' | 'txt';

export interface ExportSlug {
  en: string;
  tr: string;
}

export interface BuildExportFilenameOptions {
  /** Append `-YYYY-MM-DD` before the extension. Defaults to true. */
  withDate?: boolean;
  /** Override the date used for the suffix (mostly for tests). */
  date?: Date;
  /** Extra slug appended after the base, before the date (e.g. `'2024'`, `'10x'`). */
  extra?: string;
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function isoDate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function buildExportFilename(
  slug: ExportSlug,
  ext: ExportExtension,
  language: ExportLanguage,
  options: BuildExportFilenameOptions = {},
): string {
  const { withDate = true, date = new Date(), extra } = options;
  const base = language === 'tr' ? slug.tr : slug.en;
  const extraPart = extra ? `-${extra}` : '';
  const suffix = withDate ? `-${isoDate(date)}` : '';
  return `${base}${extraPart}${suffix}.${ext}`;
}
