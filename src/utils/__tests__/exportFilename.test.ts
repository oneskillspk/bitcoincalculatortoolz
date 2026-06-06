import { describe, it, expect } from 'vitest';
import { buildExportFilename } from '@/utils/exportFilename';

const slug = { en: 'bitcoin-investment-report', tr: 'bitcoin-yatirim-raporu' };
const fixed = new Date('2026-05-24T12:00:00Z');

describe('buildExportFilename', () => {
  it('uses Turkish slug when language is tr', () => {
    expect(buildExportFilename(slug, 'pdf', 'tr', { date: fixed }))
      .toBe('bitcoin-yatirim-raporu-2026-05-24.pdf');
  });

  it('uses English slug when language is en', () => {
    expect(buildExportFilename(slug, 'pdf', 'en', { date: fixed }))
      .toBe('bitcoin-investment-report-2026-05-24.pdf');
  });

  it('supports png and omitting date', () => {
    expect(buildExportFilename(slug, 'png', 'tr', { date: fixed, withDate: false }))
      .toBe('bitcoin-yatirim-raporu.png');
  });

  it('zero-pads month and day', () => {
    const jan3 = new Date(2026, 0, 3, 12);
    expect(buildExportFilename(slug, 'pdf', 'en', { date: jan3 }))
      .toBe('bitcoin-investment-report-2026-01-03.pdf');
  });
});
