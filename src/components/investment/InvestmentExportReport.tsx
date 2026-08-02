import React, { useState } from 'react';
import { formatGroupedInt } from '@/utils/numberFormat';
import { ShareExportPanel, downloadStandardPdf, useShareExport } from '@/components/share-export';
import { type ProjectionResult, formatCurrency, formatPercentage } from '@/services/investmentProjectionCalculator';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFileDownload } from '@/hooks/useFileDownload';
import { csvNumber, csvPercent } from '@/utils/csvExport';

interface InvestmentExportReportProps {
  results: ProjectionResult[];
  lumpSum: number;
  monthlyContribution: number;
  timeHorizon: number;
  btcPrice: number;
}

export const InvestmentExportReport: React.FC<InvestmentExportReportProps> = ({
  results, lumpSum, monthlyContribution, timeHorizon, btcPrice,
}) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [busy, setBusy] = useState(false);
  const { exportCsv } = useFileDownload();
  const { copied, copyLink } = useShareExport({
    slug: 'investment',
    headline: tr ? 'Bitcoin Yatırım Projeksiyonu' : 'Bitcoin Investment Projection',
    params: { lumpSum, monthly: monthlyContribution, years: timeHorizon },
  });

  if (results.length === 0) return null;


  const handleExport = async () => {
    setBusy(true);
    try {
      const median = results[Math.floor(results.length / 2)] ?? results[0];
      await downloadStandardPdf({
        title: tr ? 'Bitcoin Yatırım Projeksiyonu' : 'Bitcoin Investment Projection',
        subtitle: tr ? `${timeHorizon} yıllık ufuk` : `${timeHorizon}-year horizon`,
        language,
        filename: { en: 'bitcoin-investment-projection', tr: 'bitcoin-yatirim-projeksiyonu' },
        canonicalUrl: 'bitcoincalculator.tools/calculators/investment',
        headline: { label: tr ? 'Medyan Model Değeri' : 'Median Model Value', value: formatCurrency(median.finalValue), accent: 'ember' },
        metaRows: [`${tr ? 'BTC Fiyatı' : 'BTC Price'}: $${formatGroupedInt(btcPrice)}`],
        sections: [
          {
            heading: tr ? 'Girdiler' : 'Inputs',
            rows: [
              [tr ? 'Başlangıç Yatırımı' : 'Initial Investment', formatCurrency(lumpSum)],
              [tr ? 'Aylık DCA' : 'Monthly DCA', formatCurrency(monthlyContribution)],
              [tr ? 'Zaman Ufku' : 'Time Horizon', `${timeHorizon} ${tr ? 'yıl' : 'years'}`],
            ],
          },
          {
            kind: 'table',
            heading: tr ? 'Model Sonuçları' : 'Model Results',
            columns: [tr ? 'Model' : 'Model', tr ? 'Değer' : 'Value', tr ? 'Kâr' : 'Profit', 'ROI', 'BTC'],
            rows: results.map((r) => [
              r.modelName,
              formatCurrency(r.finalValue),
              formatCurrency(r.projectedProfit),
              formatPercentage(r.projectedROI),
              r.estimatedBtcHoldings.toFixed(6),
            ]),
          },
        ],
      });
    } finally { setBusy(false); }
  };

  /** CSV mirrors the PDF's model table so both exports always agree. */
  const handleCsv = () => {
    exportCsv({
      meta: {
        calculator: tr ? 'Bitcoin Yatırım Projeksiyonu' : 'Bitcoin Investment Projection',
        btcPrice,
        currency: 'USD',
        path: '/calculators/investment',
        extraRows: [
          [tr ? 'Başlangıç yatırımı (USD)' : 'Initial investment (USD)', csvNumber(lumpSum)],
          [tr ? 'Aylık DCA (USD)' : 'Monthly DCA (USD)', csvNumber(monthlyContribution)],
          [tr ? 'Zaman ufku (yıl)' : 'Time horizon (years)', String(timeHorizon)],
        ],
      },
      filename: { en: 'bitcoin-investment-projection', tr: 'bitcoin-yatirim-projeksiyonu' },
      columns: tr
        ? ['Model', 'Nihai değer (USD)', 'Kâr (USD)', 'ROI', 'BTC varlığı']
        : ['Model', 'Final value (USD)', 'Profit (USD)', 'ROI', 'BTC holdings'],
      rows: results.map((r) => [
        r.modelName,
        csvNumber(r.finalValue),
        csvNumber(r.projectedProfit),
        csvPercent(r.projectedROI, { decimals: 1 }),
        r.estimatedBtcHoldings.toFixed(8),
      ]),
    });
  };

  return (
    <ShareExportPanel
      actions={[
        { kind: 'pdf', onClick: handleExport, loading: busy },
        { kind: 'csv', onClick: handleCsv },
        { kind: 'copy-link', onClick: copyLink, copied },
      ]}
    />
  );
};
