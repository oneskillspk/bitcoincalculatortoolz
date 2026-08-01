/**
 * Canonical CSV builder + downloader.
 *
 * Guarantees for every CSV the site emits:
 *   - UTF-8 BOM so Windows Excel renders `₺`, `é`, `İ`, `–` correctly.
 *   - CRLF line endings (RFC 4180 — what Excel expects).
 *   - A metadata preamble: generation timestamp, the exact BTC price the UI
 *     showed at calculation time, and the source URL.
 *   - RFC 4180 escaping for commas, quotes and newlines.
 *   - Percentages as `12.5%` strings, never `0.125`.
 *   - Descriptive, language-aware filenames via `buildExportFilename`.
 */
import { buildExportFilename, type ExportLanguage, type ExportSlug } from '@/utils/exportFilename';
import { downloadTextFile, type DownloadBlobResult } from '@/utils/downloadFile';

export const CSV_BOM = '\uFEFF';
const EOL = '\r\n';
export const SITE_URL = 'https://bitcoincalculator.tools';

export const escapeCsvCell = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  const s = String(value);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/** Format a ratio (0.125) or a percent number as a spreadsheet-safe "12.5%". */
export const csvPercent = (value: number, opts: { asRatio?: boolean; decimals?: number } = {}): string => {
  if (!Number.isFinite(value)) return '';
  const { asRatio = false, decimals = 2 } = opts;
  const pct = asRatio ? value * 100 : value;
  return `${pct.toFixed(decimals)}%`;
};

/** Fixed-decimal number, empty string for non-finite input. */
export const csvNumber = (value: number, decimals = 2): string =>
  Number.isFinite(value) ? value.toFixed(decimals) : '';

/** BTC amounts always use 8 decimals (1 sat). */
export const csvBtc = (value: number): string => csvNumber(value, 8);

export interface CsvMeta {
  /** Calculator name, printed on the first preamble row. */
  calculator: string;
  language: ExportLanguage;
  /** The exact BTC price rendered in the UI at export time. */
  btcPrice?: number;
  /** Currency code for `btcPrice` (defaults to USD). */
  currency?: string;
  /** Canonical page path, e.g. `/bitcoin-profit-calculator`. */
  path?: string;
  /** Extra `label,value` preamble rows (inputs used, mode, etc.). */
  extraRows?: Array<[string, string]>;
  /** Override the generation timestamp (tests). */
  date?: Date;
}

export interface BuildCsvOptions {
  meta: CsvMeta;
  /** Header row — include units, e.g. `Amount invested (USD)`. */
  columns: string[];
  rows: Array<Array<string | number | null | undefined>>;
}

/** Build the full CSV text (BOM + preamble + table). */
export const buildCsv = ({ meta, columns, rows }: BuildCsvOptions): string => {
  const tr = meta.language === 'tr';
  const date = meta.date ?? new Date();
  const currency = meta.currency ?? 'USD';

  const preamble: Array<[string, string]> = [
    [tr ? 'Hesaplayıcı' : 'Calculator', meta.calculator],
    [tr ? 'Oluşturulma zamanı' : 'Generated at', date.toISOString()],
    [
      tr ? 'Yerel zaman' : 'Local time',
      date.toLocaleString(tr ? 'tr-TR' : 'en-US'),
    ],
  ];
  if (Number.isFinite(meta.btcPrice)) {
    preamble.push([
      `${tr ? 'Kullanılan BTC fiyatı' : 'BTC price used'} (${currency})`,
      csvNumber(meta.btcPrice as number, 2),
    ]);
  }
  preamble.push([
    tr ? 'Kaynak' : 'Source',
    `${SITE_URL}${meta.path ?? ''}`,
  ]);
  if (meta.extraRows?.length) preamble.push(...meta.extraRows);

  const lines = [
    ...preamble.map(([k, v]) => `${escapeCsvCell(k)},${escapeCsvCell(v)}`),
    '',
    columns.map(escapeCsvCell).join(','),
    ...rows.map((row) => row.map(escapeCsvCell).join(',')),
  ];

  return CSV_BOM + lines.join(EOL) + EOL;
};

export interface DownloadCsvOptions extends BuildCsvOptions {
  /** Localized filename slug, e.g. `{ en: 'bitcoin-dca-results', tr: '...' }`. */
  filename: ExportSlug;
  /** Extra slug segment before the date. */
  filenameExtra?: string;
}

export interface DownloadCsvResult extends DownloadBlobResult {
  filename: string;
  rowCount: number;
}

/** Build + download in one call. Returns the object URL for a fallback link. */
export const downloadCsv = (options: DownloadCsvOptions): DownloadCsvResult => {
  const csv = buildCsv(options);
  const filename = buildExportFilename(options.filename, 'csv', options.meta.language, {
    extra: options.filenameExtra,
  });
  const result = downloadTextFile(csv, filename, 'text/csv;charset=utf-8;', {
    keepAliveForFallback: true,
  });
  return { ...result, filename, rowCount: options.rows.length };
};
