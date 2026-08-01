import { describe, it, expect } from 'vitest';
import { buildCsv, escapeCsvCell, csvPercent, csvNumber, csvBtc, CSV_BOM } from '@/utils/csvExport';

const FIXED = new Date('2026-05-24T10:30:00.000Z');

const sample = () =>
  buildCsv({
    meta: {
      calculator: 'Bitcoin DCA Calculator',
      language: 'en',
      btcPrice: 126198,
      currency: 'USD',
      path: '/bitcoin-dca-calculator',
      date: FIXED,
    },
    columns: ['Date', 'Amount invested (USD)', 'P&L %'],
    rows: [['2026-01-01', '100.00', '12.50%']],
  });

describe('csvExport', () => {
  it('prefixes a UTF-8 BOM so Excel on Windows decodes non-ASCII correctly', () => {
    expect(sample().startsWith(CSV_BOM)).toBe(true);
  });

  it('uses CRLF line endings per RFC 4180', () => {
    const csv = sample();
    expect(csv).toContain('\r\n');
    expect(csv.split('\r\n').length).toBeGreaterThan(5);
  });

  it('includes calculator name, timestamp, BTC price used and source URL', () => {
    const csv = sample();
    expect(csv).toContain('Calculator,Bitcoin DCA Calculator');
    expect(csv).toContain('Generated at,2026-05-24T10:30:00.000Z');
    expect(csv).toContain('BTC price used (USD),126198.00');
    expect(csv).toContain('Source,https://bitcoincalculator.tools/bitcoin-dca-calculator');
  });

  it('emits the header row and data rows after the preamble', () => {
    const lines = sample().split('\r\n');
    const headerIndex = lines.indexOf('Date,Amount invested (USD),P&L %');
    expect(headerIndex).toBeGreaterThan(0);
    expect(lines[headerIndex - 1]).toBe('');
    expect(lines[headerIndex + 1]).toBe('2026-01-01,100.00,12.50%');
  });

  it('escapes commas, quotes and newlines', () => {
    expect(escapeCsvCell('a,b')).toBe('"a,b"');
    expect(escapeCsvCell('say "hi"')).toBe('"say ""hi"""');
    expect(escapeCsvCell('line1\nline2')).toBe('"line1\nline2"');
    expect(escapeCsvCell(undefined)).toBe('');
  });

  it('preserves Turkish characters in the payload', () => {
    const csv = buildCsv({
      meta: { calculator: 'Bitcoin Kâr Hesaplayıcısı', language: 'tr', date: FIXED },
      columns: ['Değer (₺)'],
      rows: [['1.234,56 ₺']],
    });
    expect(csv).toContain('Değer (₺)');
    expect(csv).toContain('Hesaplayıcı,Bitcoin Kâr Hesaplayıcısı');
  });

  it('formats percentages as human strings, never raw ratios', () => {
    expect(csvPercent(0.125, { asRatio: true })).toBe('12.50%');
    expect(csvPercent(12.5)).toBe('12.50%');
    expect(csvPercent(30, { decimals: 0 })).toBe('30%');
    expect(csvPercent(Number.NaN)).toBe('');
  });

  it('keeps decimal places consistent for fiat and BTC', () => {
    expect(csvNumber(1234.5)).toBe('1234.50');
    expect(csvBtc(0.12345678912)).toBe('0.12345679');
    expect(csvBtc(1)).toBe('1.00000000');
    expect(csvNumber(Number.POSITIVE_INFINITY)).toBe('');
  });
});
