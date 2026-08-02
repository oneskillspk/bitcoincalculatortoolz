import React, { useCallback, useState } from 'react';
import { formatGroupedDecimal } from '@/utils/numberFormat';
import { formatROI } from '@/utils/formatters';
import { ShareExportPanel, downloadStandardPdf, captureSnapshot, useShareExport } from '@/components/share-export';
import { CalculationResult } from '@/services/bitcoinApi';
import { format } from 'date-fns';
import { tr as trLocale } from 'date-fns/locale';
import { buildExportFilename } from '@/utils/exportFilename';
import { useLanguage } from '@/contexts/LanguageContext';
import type { ShareParams } from '@/utils/shareLink';
import { useFileDownload } from '@/hooks/useFileDownload';
import { csvNumber, csvPercent } from '@/utils/csvExport';


interface ExportReportButtonProps {
  result: CalculationResult;
  chartRef?: React.RefObject<HTMLDivElement>;
  /**
   * Calculator identity — drives the copied share link + the canonical
   * URL printed on the PDF header. Defaults preserve the historical
   * DCA / What-If behaviour so unmigrated callers keep working, but
   * every caller that isn't literally the What-If calculator MUST pass
   * the correct slug so the copied URL routes back to the right page.
   */
  slug?: string;
  /** Headline text used in the share-link clipboard payload. */
  headline?: string;
  /** Query params merged into the shared URL. Defaults to amount+date+currency. */
  shareParams?: ShareParams;
  /** Overrides the "Bitcoin Investment Analysis Report" PDF title. */
  pdfTitle?: { en: string; tr: string };
  /** Overrides the PDF filename slug pair. */
  pdfFilename?: { en: string; tr: string };
  /** Canonical URL printed on the PDF footer/header. Defaults to /calculators/<slug>. */
  canonicalUrlPath?: string;
}

export const ExportReportButton = React.memo(({
  result,
  chartRef,
  slug = 'what-if',
  headline,
  shareParams,
  pdfTitle,
  pdfFilename,
  canonicalUrlPath,
}: ExportReportButtonProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [busy, setBusy] = useState<'pdf' | 'png' | null>(null);
  const { exportCsv } = useFileDownload();

  const longDate = (d: Date) =>
    tr ? format(d, 'd MMMM yyyy', { locale: trLocale }) : format(d, 'MMMM d, yyyy');
  const fmtCur = (n: number) =>
    Number.isFinite(n)
      ? `${result.currency}${formatGroupedDecimal(n, 2, tr ? 'tr-TR' : 'en-US')}`
      : '—';


  const daysHeld = Math.floor(
    (Date.now() - new Date(result.startDate).getTime()) / (1000 * 60 * 60 * 24),
  );

  const resolvedPdfTitle = pdfTitle ?? {
    en: 'Bitcoin Investment Analysis Report',
    tr: 'Bitcoin Yatırım Analizi Raporu',
  };
  const resolvedFilename = pdfFilename ?? {
    en: 'bitcoin-investment-report',
    tr: 'bitcoin-yatirim-raporu',
  };
  const resolvedCanonicalPath = canonicalUrlPath ?? `/calculators/${slug}`;
  const resolvedHeadline =
    headline ?? (tr ? 'Bitcoin What-If Hesaplayıcı' : 'Bitcoin What-If Calculator');

  const handlePDF = useCallback(async () => {
    setBusy('pdf');
    try {
      await downloadStandardPdf({
        title: tr ? resolvedPdfTitle.tr : resolvedPdfTitle.en,
        language,
        filename: resolvedFilename,
        canonicalUrl: `bitcoincalculator.tools${resolvedCanonicalPath}`,
        headline: {
          label: tr ? 'Güncel Değer' : 'Current Value',
          value: fmtCur(result.currentValue),
        },
        sections: [
          {
            heading: tr ? 'Yatırım Detayları' : 'Investment Details',
            rows: [
              [tr ? 'Yatırım Tarihi' : 'Investment Date', longDate(new Date(result.startDate))],
              [tr ? 'İlk Yatırım' : 'Initial Investment', fmtCur(result.investmentAmount)],
              [tr ? 'Bitcoin Fiyatı (Başlangıç)' : 'Bitcoin Price (Start)', fmtCur(result.startPrice)],
              [tr ? 'Bitcoin Miktarı' : 'Bitcoin Amount', Number.isFinite(result.btcAmount) ? `${result.btcAmount.toFixed(8)} BTC` : '—'],
              [tr ? 'Para Birimi' : 'Currency', result.currency],
              [tr ? 'Analiz Süresi' : 'Analysis Period', `${daysHeld} ${tr ? 'gün' : 'days'}`],
            ],
          },
          {
            heading: tr ? 'Güncel Performans' : 'Current Performance',
            rows: [
              [tr ? 'Güncel Bitcoin Fiyatı' : 'Current Bitcoin Price', fmtCur(result.currentPrice)],
              [tr ? 'Güncel Değer' : 'Current Value', fmtCur(result.currentValue)],
              [tr ? 'Kâr / Zarar' : 'Profit / Loss', fmtCur(result.profitLoss)],
              ['ROI', formatROI(result.roiPercentage, 2)],
              [tr ? 'Fiyat Büyümesi' : 'Price Growth', result.startPrice > 0 && Number.isFinite(result.currentPrice) ? `${(result.currentPrice / result.startPrice).toFixed(2)}x` : '—'],
            ],
          },

        ],
      });
    } finally {
      setBusy(null);
    }
  }, [result, language, tr, daysHeld, resolvedPdfTitle, resolvedFilename, resolvedCanonicalPath]);

  const handlePNG = useCallback(async () => {
    setBusy('png');
    try {
      const target = chartRef?.current ?? document.body;
      const canvas = await captureSnapshot(target);
      const link = document.createElement('a');
      link.download = buildExportFilename(resolvedFilename, 'png', language);
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally {
      setBusy(null);
    }
  }, [chartRef, language, resolvedFilename]);

  /** CSV mirrors the PDF's rows so both exports always agree. */
  const handleCsv = useCallback(() => {
    exportCsv({
      meta: {
        calculator: resolvedHeadline,
        btcPrice: result.currentPrice,
        currency: result.currency,
        path: resolvedCanonicalPath,
        extraRows: [
          [tr ? 'Yatırım tarihi' : 'Investment date', String(result.startDate)],
          [`${tr ? 'İlk yatırım' : 'Initial investment'} (${result.currency})`, csvNumber(result.investmentAmount)],
          [tr ? 'Analiz süresi (gün)' : 'Analysis period (days)', String(daysHeld)],
        ],
      },
      filename: resolvedFilename,
      columns: tr ? ['Metrik', 'Değer'] : ['Metric', 'Value'],
      rows: [
        [`${tr ? 'Başlangıç BTC fiyatı' : 'Start BTC price'} (${result.currency})`, csvNumber(result.startPrice)],
        [`${tr ? 'Güncel BTC fiyatı' : 'Current BTC price'} (${result.currency})`, csvNumber(result.currentPrice)],
        [tr ? 'Bitcoin miktarı (BTC)' : 'Bitcoin amount (BTC)', Number.isFinite(result.btcAmount) ? result.btcAmount.toFixed(8) : ''],
        [`${tr ? 'Güncel değer' : 'Current value'} (${result.currency})`, csvNumber(result.currentValue)],
        [`${tr ? 'Kâr / zarar' : 'Profit / loss'} (${result.currency})`, csvNumber(result.profitLoss)],
        ['ROI', csvPercent(result.roiPercentage, { decimals: 2 })],
        [tr ? 'Fiyat büyümesi (x)' : 'Price growth (x)', result.startPrice > 0 && Number.isFinite(result.currentPrice) ? (result.currentPrice / result.startPrice).toFixed(2) : ''],
      ],
    });
  }, [exportCsv, tr, result, daysHeld, resolvedHeadline, resolvedFilename, resolvedCanonicalPath]);

  const { copied, copyLink } = useShareExport({
    slug,
    headline: resolvedHeadline,
    params: shareParams ?? {
      amount: result.investmentAmount,
      date: result.startDate,
      currency: result.currency,
    },
  });

  return (
    <ShareExportPanel
      actions={[
        { kind: 'pdf', onClick: handlePDF, loading: busy === 'pdf' },
        { kind: 'png', onClick: handlePNG, loading: busy === 'png' },
        { kind: 'csv', onClick: handleCsv },
        { kind: 'copy-link', onClick: copyLink, copied },
      ]}
    />
  );
});

ExportReportButton.displayName = 'ExportReportButton';
