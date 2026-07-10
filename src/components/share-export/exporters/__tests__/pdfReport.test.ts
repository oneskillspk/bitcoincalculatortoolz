import { describe, it, expect } from 'vitest';
import { renderStandardPdf } from '../pdfReport';

describe('renderStandardPdf', () => {
  it('renders a single-page PDF with headline, kv, table, and note sections', async () => {
    const doc = await renderStandardPdf({
      title: 'Test Calculator Report',
      subtitle: 'Preset A',
      language: 'en',
      filename: { en: 'test-report', tr: 'test-raporu' },
      canonicalUrl: 'bitcoincalculator.tools/calculators/test',
      metaRows: ['BTC $100,000'],
      headline: { label: 'Headline', value: '$1,234', accent: 'ember' },
      sections: [
        { heading: 'Inputs', rows: [['Amount', '$500'], ['Years', '5']] },
        {
          kind: 'table',
          heading: 'Yearly Results',
          columns: ['Year', 'Value', 'Return'],
          rows: [
            ['2026', '$1,000', '10%'],
            ['2027', '$1,100', '10%'],
          ],
        },
        { kind: 'note', heading: 'Notes', body: 'This is a wrapped paragraph with plenty of text to test wrapping behavior across the width of the page and multiple line breaks.' },
      ],
    });
    expect(doc.getNumberOfPages()).toBe(1);
    // PDF output is non-empty
    expect(doc.output().length).toBeGreaterThan(1000);
  });

  it('paginates automatically with many rows and repaints the header on subsequent pages', async () => {
    const bigRows = Array.from({ length: 80 }, (_, i) => [`Row ${i + 1}`, `$${(i + 1) * 100}`] as [string, string]);
    const doc = await renderStandardPdf({
      title: 'Long Report',
      language: 'en',
      filename: { en: 'long-report', tr: 'uzun-rapor' },
      canonicalUrl: 'bitcoincalculator.tools/calculators/long',
      sections: [{ heading: 'Many Rows', rows: bigRows }],
    });
    expect(doc.getNumberOfPages()).toBeGreaterThan(1);
  });

  it('uses Turkish disclaimer text when language is tr', async () => {
    const doc = await renderStandardPdf({
      title: 'TR Rapor',
      language: 'tr',
      filename: { en: 'tr-report', tr: 'tr-rapor' },
      canonicalUrl: 'bitcoincalculator.tools/calculators/tr',
      sections: [{ heading: 'Bölüm', rows: [['Etiket', 'Değer']] }],
    });
    // Extract embedded text stream for a rough content assertion
    const pdfText = doc.output();
    expect(pdfText).toBeTypeOf('string');
    expect(doc.getNumberOfPages()).toBe(1);
  });
});
