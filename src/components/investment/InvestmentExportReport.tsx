import React, { useState } from 'react';
import { ShareExportPanel, downloadStandardPdf, useShareExport } from '@/components/share-export';
import { type ProjectionResult, formatCurrency, formatPercentage } from '@/services/investmentProjectionCalculator';
import { useLanguage } from '@/contexts/LanguageContext';

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
        metaRows: [`${tr ? 'BTC Fiyatı' : 'BTC Price'}: $${btcPrice.toLocaleString()}`],
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

  return (
    <ShareExportPanel
      actions={[
        { kind: 'pdf', onClick: handleExport, loading: busy },
        { kind: 'copy-link', onClick: copyLink, copied },
      ]}
    />
  );
};
