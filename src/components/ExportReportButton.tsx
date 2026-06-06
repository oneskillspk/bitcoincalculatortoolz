import React, { useCallback, useState } from 'react';
import { ShareExportPanel, downloadStandardPdf, captureSnapshot, useShareExport } from '@/components/share-export';
import { CalculationResult } from '@/services/bitcoinApi';
import { format } from 'date-fns';
import { tr as trLocale } from 'date-fns/locale';
import { buildExportFilename } from '@/utils/exportFilename';
import { useLanguage } from '@/contexts/LanguageContext';

interface ExportReportButtonProps {
  result: CalculationResult;
  chartRef?: React.RefObject<HTMLDivElement>;
}

export const ExportReportButton = React.memo(({ result, chartRef }: ExportReportButtonProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [busy, setBusy] = useState<'pdf' | 'png' | null>(null);

  const longDate = (d: Date) =>
    tr ? format(d, 'd MMMM yyyy', { locale: trLocale }) : format(d, 'MMMM d, yyyy');
  const fmtCur = (n: number) =>
    `${result.currency}${n.toLocaleString(tr ? 'tr-TR' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const daysHeld = Math.floor(
    (Date.now() - new Date(result.startDate).getTime()) / (1000 * 60 * 60 * 24),
  );

  const handlePDF = useCallback(async () => {
    setBusy('pdf');
    try {
      await downloadStandardPdf({
        title: tr ? 'Bitcoin Yatırım Analizi Raporu' : 'Bitcoin Investment Analysis Report',
        language,
        filename: { en: 'bitcoin-investment-report', tr: 'bitcoin-yatirim-raporu' },
        canonicalUrl: 'bitcoincalculator.tools/calculators/what-if',
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
              [tr ? 'Bitcoin Miktarı' : 'Bitcoin Amount', `${result.btcAmount.toFixed(8)} BTC`],
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
              ['ROI', `${result.roiPercentage.toFixed(2)}%`],
              [tr ? 'Fiyat Büyümesi' : 'Price Growth', `${(result.currentPrice / result.startPrice).toFixed(2)}x`],
            ],
          },
        ],
      });
    } finally {
      setBusy(null);
    }
  }, [result, language, tr, daysHeld]);

  const handlePNG = useCallback(async () => {
    setBusy('png');
    try {
      const target = chartRef?.current ?? document.body;
      const canvas = await captureSnapshot(target);
      const link = document.createElement('a');
      link.download = buildExportFilename(
        { en: 'bitcoin-investment-report', tr: 'bitcoin-yatirim-raporu' },
        'png',
        language,
      );
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally {
      setBusy(null);
    }
  }, [chartRef, language]);

  const { copied, copyLink } = useShareExport({
    slug: 'what-if',
    headline: tr ? 'Bitcoin What-If Hesaplayıcı' : 'Bitcoin What-If Calculator',
    params: {
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
        { kind: 'copy-link', onClick: copyLink, copied },
      ]}
    />
  );
});

ExportReportButton.displayName = 'ExportReportButton';
