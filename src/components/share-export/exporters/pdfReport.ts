/**
 * Canonical jsPDF report renderer. One header / divider / section / footer
 * layout used by every calculator. Per-calculator code only supplies the data.
 */
import jsPDF from 'jspdf';
import { applyLocalizedPdfFont } from '@/utils/pdfFont';
import { buildExportFilename, type ExportLanguage } from '@/utils/exportFilename';

export interface PdfReportSection {
  heading: string;
  rows: Array<[label: string, value: string]>;
}

export interface RenderStandardPdfOptions {
  title: string;
  language: ExportLanguage;
  filename: { en: string; tr: string };
  /** Full canonical URL of the calculator (printed under the title). */
  canonicalUrl: string;
  sections: PdfReportSection[];
  /** Optional disclaimer lines printed at the bottom. Defaults to the standard "not financial advice" copy. */
  disclaimer?: string[];
  /** Optional headline metric printed below the title. */
  headline?: { label: string; value: string };
}

const PAPER_BG: [number, number, number] = [245, 243, 238];   // matches site #f5f3ee
const INK: [number, number, number] = [26, 26, 26];
const MUTED: [number, number, number] = [110, 110, 110];
const RULE: [number, number, number] = [205, 200, 190];

export const renderStandardPdf = async ({
  title, language, filename, canonicalUrl, sections, disclaimer, headline,
}: RenderStandardPdfOptions): Promise<jsPDF> => {
  const tr = language === 'tr';
  const doc = new jsPDF('p', 'mm', 'a4');
  await applyLocalizedPdfFont(doc, language);

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 20;

  // Paper background band at the top
  doc.setFillColor(...PAPER_BG);
  doc.rect(0, 0, pageWidth, 50, 'F');

  // Title
  doc.setFontSize(20);
  doc.setTextColor(...INK);
  doc.setFont(undefined, 'bold');
  doc.text(title, marginX, 24);

  // Generated on + canonical URL
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(...MUTED);
  const generated = new Date().toLocaleDateString(tr ? 'tr-TR' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  doc.text(`${tr ? 'Oluşturuldu:' : 'Generated on'} ${generated}`, marginX, 32);
  doc.text(canonicalUrl, marginX, 38);

  // Divider
  doc.setDrawColor(...RULE);
  doc.setLineWidth(0.4);
  doc.line(marginX, 44, pageWidth - marginX, 44);

  let y = 56;

  if (headline) {
    doc.setFontSize(11);
    doc.setTextColor(...MUTED);
    doc.text(headline.label, marginX, y);
    doc.setFontSize(22);
    doc.setTextColor(...INK);
    doc.setFont(undefined, 'bold');
    doc.text(headline.value, marginX, y + 10);
    doc.setFont(undefined, 'normal');
    y += 22;
  }

  // Sections
  sections.forEach((section) => {
    if (y > pageHeight - 50) { doc.addPage(); y = 24; }
    doc.setFontSize(13);
    doc.setTextColor(...INK);
    doc.setFont(undefined, 'bold');
    doc.text(section.heading, marginX, y);
    doc.setFont(undefined, 'normal');
    y += 8;

    doc.setFontSize(10.5);
    section.rows.forEach(([label, value]) => {
      if (y > pageHeight - 40) { doc.addPage(); y = 24; }
      doc.setTextColor(...MUTED);
      doc.text(label, marginX, y);
      doc.setTextColor(...INK);
      doc.text(value, pageWidth - marginX, y, { align: 'right' });
      y += 6.5;
    });
    y += 6;
  });

  // Footer
  const defaultDisclaimer = tr
    ? [
        'Bu rapor yalnızca bilgilendirme amaçlıdır ve finansal tavsiye niteliği taşımaz.',
        'Geçmiş performans gelecekteki sonuçları garanti etmez. Kendi araştırmanızı yapın.',
      ]
    : [
        'This report is for informational purposes only and is not financial advice.',
        'Past performance does not guarantee future results. Always do your own research.',
      ];
  const lines = disclaimer ?? defaultDisclaimer;
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  const footerY = pageHeight - 14 - (lines.length - 1) * 4;
  lines.forEach((line, i) => doc.text(line, pageWidth / 2, footerY + i * 4, { align: 'center' }));
  doc.setTextColor(150, 150, 150);
  doc.text('bitcoincalculator.tools', pageWidth / 2, pageHeight - 6, { align: 'center' });

  return doc;
};

export const downloadStandardPdf = async (options: RenderStandardPdfOptions) => {
  const doc = await renderStandardPdf(options);
  doc.save(buildExportFilename(options.filename, 'pdf', options.language));
};
