/**
 * Canonical jsPDF report renderer. One header / divider / section / footer
 * layout used by every calculator. Per-calculator code only supplies the data.
 *
 * Section kinds:
 *   - 'kv'    (default) — label/value rows aligned left/right
 *   - 'table' — n-column grid with a bold header row and zebra body rows
 *   - 'note'  — wrapped paragraph text
 *
 * The header band (title, generated-on, canonical URL, divider) is repainted
 * automatically on every added page so multi-page exports stay branded.
 */
import jsPDF from 'jspdf';
import { applyLocalizedPdfFont } from '@/utils/pdfFont';
import { buildExportFilename, type ExportLanguage } from '@/utils/exportFilename';

export type PdfBrandAccent = 'ember' | 'success' | 'danger' | 'ink';

export interface PdfKvSection {
  kind?: 'kv';
  heading: string;
  rows: Array<[label: string, value: string]>;
}
export interface PdfTableSection {
  kind: 'table';
  heading: string;
  columns: string[];
  /** Column alignment per index — 'left' | 'right'. Defaults to left for col 0, right for the rest. */
  align?: Array<'left' | 'right'>;
  /** Optional column width ratios (any positive numbers, normalized). Defaults to equal widths. */
  widths?: number[];
  rows: string[][];
}
export interface PdfNoteSection {
  kind: 'note';
  heading?: string;
  body: string;
}
export type PdfReportSection = PdfKvSection | PdfTableSection | PdfNoteSection;

export interface RenderStandardPdfOptions {
  title: string;
  /** Optional secondary line under the title (e.g. mode / preset). */
  subtitle?: string;
  language: ExportLanguage;
  filename: { en: string; tr: string };
  /** Full canonical URL of the calculator (printed under the title). */
  canonicalUrl: string;
  sections: PdfReportSection[];
  /** Optional disclaimer lines printed at the bottom. Defaults to the standard "not financial advice" copy. */
  disclaimer?: string[];
  /** Optional headline metric printed below the title. */
  headline?: { label: string; value: string; accent?: PdfBrandAccent };
  /** Optional metadata rows shown under the canonical URL (e.g. "BTC $103,245 · USD"). */
  metaRows?: string[];
}

const PAPER_BG: [number, number, number] = [245, 243, 238];   // matches site #f5f3ee
const INK: [number, number, number] = [26, 26, 26];
const MUTED: [number, number, number] = [110, 110, 110];
const RULE: [number, number, number] = [205, 200, 190];
const ZEBRA: [number, number, number] = [237, 233, 224];

const ACCENTS: Record<PdfBrandAccent, [number, number, number]> = {
  ember:   [232, 93, 58],   // #e85d3a
  success: [10, 138, 90],   // #0a8a5a
  danger:  [168, 52, 29],   // #a8341d
  ink:     INK,
};

const HEADER_HEIGHT = 46;
const HEADER_MIN_HEIGHT = 30;
const BOTTOM_KEEPOUT = 30;

export const renderStandardPdf = async ({
  title, subtitle, language, filename, canonicalUrl, sections, disclaimer, headline, metaRows,
}: RenderStandardPdfOptions): Promise<jsPDF> => {
  const tr = language === 'tr';
  const doc = new jsPDF('p', 'mm', 'a4');
  await applyLocalizedPdfFont(doc, language);

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 20;
  const contentWidth = pageWidth - marginX * 2;

  const generated = new Date().toLocaleDateString(tr ? 'tr-TR' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  /** Paint the branded top band. Used on every page. */
  const paintHeader = (isFirstPage: boolean): number => {
    const bandHeight = isFirstPage ? HEADER_HEIGHT + (subtitle ? 6 : 0) + (metaRows?.length ?? 0) * 5 : HEADER_MIN_HEIGHT;
    doc.setFillColor(...PAPER_BG);
    doc.rect(0, 0, pageWidth, bandHeight, 'F');

    doc.setTextColor(...INK);
    doc.setFont(undefined, 'bold');
    doc.setFontSize(isFirstPage ? 20 : 12);
    doc.text(title, marginX, isFirstPage ? 22 : 16);

    doc.setFont(undefined, 'normal');
    doc.setFontSize(isFirstPage ? 10 : 8);
    doc.setTextColor(...MUTED);

    let cursor = isFirstPage ? 30 : 22;
    if (isFirstPage) {
      if (subtitle) { doc.text(subtitle, marginX, cursor); cursor += 5; }
      doc.text(`${tr ? 'Oluşturuldu:' : 'Generated on'} ${generated}`, marginX, cursor); cursor += 5;
      doc.text(canonicalUrl, marginX, cursor); cursor += 5;
      metaRows?.forEach((row) => { doc.text(row, marginX, cursor); cursor += 5; });
    } else {
      doc.text(canonicalUrl, pageWidth - marginX, 16, { align: 'right' });
    }

    // Divider line
    doc.setDrawColor(...RULE);
    doc.setLineWidth(0.4);
    const dividerY = isFirstPage ? cursor + 1 : 22;
    doc.line(marginX, dividerY, pageWidth - marginX, dividerY);
    return dividerY + 8;
  };

  let y = paintHeader(true);

  const pageBreakIfNeeded = (needed: number) => {
    if (y + needed > pageHeight - BOTTOM_KEEPOUT) {
      doc.addPage();
      y = paintHeader(false);
    }
  };

  // Headline
  if (headline) {
    pageBreakIfNeeded(24);
    doc.setFontSize(10.5);
    doc.setTextColor(...MUTED);
    doc.setFont(undefined, 'normal');
    doc.text(headline.label, marginX, y);
    const accent = ACCENTS[headline.accent ?? 'ink'];
    doc.setFontSize(22);
    doc.setTextColor(...accent);
    doc.setFont(undefined, 'bold');
    doc.text(headline.value, marginX, y + 10);
    doc.setFont(undefined, 'normal');
    y += 20;
  }

  // Split text helper (word wrap)
  const splitLines = (text: string, maxWidth: number, fontSize: number): string[] => {
    doc.setFontSize(fontSize);
    return doc.splitTextToSize(text, maxWidth) as string[];
  };

  sections.forEach((section) => {
    const kind = (section as PdfKvSection).kind ?? 'kv';

    // Heading
    const heading = (section as PdfKvSection | PdfTableSection | PdfNoteSection).heading;
    if (heading) {
      pageBreakIfNeeded(14);
      doc.setFontSize(13);
      doc.setTextColor(...INK);
      doc.setFont(undefined, 'bold');
      doc.text(heading, marginX, y);
      doc.setFont(undefined, 'normal');
      y += 7;
    }

    if (kind === 'kv') {
      const rows = (section as PdfKvSection).rows;
      doc.setFontSize(10.5);
      rows.forEach(([label, value]) => {
        pageBreakIfNeeded(7);
        doc.setTextColor(...MUTED);
        doc.text(label, marginX, y);
        doc.setTextColor(...INK);
        doc.text(String(value), pageWidth - marginX, y, { align: 'right' });
        y += 6.5;
      });
      y += 6;
    } else if (kind === 'table') {
      const s = section as PdfTableSection;
      const cols = s.columns.length;
      const align = s.align ?? s.columns.map((_, i) => (i === 0 ? 'left' as const : 'right' as const));
      const colW = contentWidth / cols;
      const rowH = 7;

      // Header row
      pageBreakIfNeeded(rowH + 2);
      doc.setFillColor(...RULE);
      doc.rect(marginX, y - 4.5, contentWidth, rowH, 'F');
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(...INK);
      s.columns.forEach((col, i) => {
        const x = align[i] === 'right' ? marginX + colW * (i + 1) - 2 : marginX + colW * i + 2;
        doc.text(col, x, y, { align: align[i] });
      });
      doc.setFont(undefined, 'normal');
      y += rowH;

      // Body
      doc.setFontSize(10);
      s.rows.forEach((row, ri) => {
        pageBreakIfNeeded(rowH);
        if (ri % 2 === 0) {
          doc.setFillColor(...ZEBRA);
          doc.rect(marginX, y - 4.5, contentWidth, rowH, 'F');
        }
        doc.setTextColor(...INK);
        row.forEach((cell, i) => {
          const x = align[i] === 'right' ? marginX + colW * (i + 1) - 2 : marginX + colW * i + 2;
          doc.text(String(cell), x, y, { align: align[i] });
        });
        y += rowH;
      });
      y += 6;
    } else if (kind === 'note') {
      const s = section as PdfNoteSection;
      const lines = splitLines(s.body, contentWidth, 10.5);
      doc.setFontSize(10.5);
      doc.setTextColor(...INK);
      lines.forEach((line) => {
        pageBreakIfNeeded(6);
        doc.text(line, marginX, y);
        y += 5.5;
      });
      y += 6;
    }
  });

  // Footer (on every page)
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
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p += 1) {
    doc.setPage(p);
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    const footerY = pageHeight - 14 - (lines.length - 1) * 4;
    lines.forEach((line, i) => doc.text(line, pageWidth / 2, footerY + i * 4, { align: 'center' }));
    doc.setTextColor(150, 150, 150);
    doc.text('bitcoincalculator.tools', marginX, pageHeight - 6);
    doc.text(`${p} / ${pageCount}`, pageWidth - marginX, pageHeight - 6, { align: 'right' });
  }

  return doc;
};

export const downloadStandardPdf = async (options: RenderStandardPdfOptions) => {
  const doc = await renderStandardPdf(options);
  doc.save(buildExportFilename(options.filename, 'pdf', options.language));
};
