import React, { useState } from 'react';
import { ShareExportPanel, downloadStandardPdf, useShareExport } from '@/components/share-export';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFileDownload } from '@/hooks/useFileDownload';

interface FearGreedExportReportProps {
  currentValue: number;
  classification: string;
  trend7dAvg: number;
  trend30dAvg: number;
}

export const FearGreedExportReport: React.FC<FearGreedExportReportProps> = ({
  currentValue, classification, trend7dAvg, trend30dAvg,
}) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [busy, setBusy] = useState(false);
  const { exportCsv } = useFileDownload();

  const handlePdf = async () => {
    setBusy(true);
    try {
      const accent = currentValue < 25 ? 'danger' : currentValue > 75 ? 'success' : 'ember';
      await downloadStandardPdf({
        title: tr ? 'Bitcoin Korku & Açgözlülük Endeksi Raporu' : 'Bitcoin Fear & Greed Index Report',
        language,
        filename: { en: 'bitcoin-fear-greed-index-report', tr: 'bitcoin-korku-acgozluluk-raporu' },
        canonicalUrl: 'bitcoincalculator.tools/calculators/fear-greed-index',
        headline: { label: tr ? 'Güncel Endeks' : 'Current Index', value: `${currentValue} · ${classification}`, accent },
        sections: [
          {
            heading: tr ? 'Trend Ortalamaları' : 'Trend Averages',
            rows: [
              [tr ? '7 Günlük Ortalama' : '7-Day Average', String(trend7dAvg)],
              [tr ? '30 Günlük Ortalama' : '30-Day Average', String(trend30dAvg)],
            ],
          },
        ],
      });
    } finally { setBusy(false); }
  };

  /** CSV mirrors the PDF so both exports always agree. */
  const handleCsv = () => {
    exportCsv({
      meta: {
        calculator: tr ? 'Bitcoin Korku & Açgözlülük Endeksi' : 'Bitcoin Fear & Greed Index',
        path: '/calculators/fear-greed-index',
      },
      filename: { en: 'bitcoin-fear-greed-index', tr: 'bitcoin-korku-acgozluluk-endeksi' },
      columns: tr ? ['Metrik', 'Değer'] : ['Metric', 'Value'],
      rows: [
        [tr ? 'Güncel endeks (0-100)' : 'Current index (0-100)', String(currentValue)],
        [tr ? 'Sınıflandırma' : 'Classification', classification],
        [tr ? '7 günlük ortalama' : '7-day average', String(trend7dAvg)],
        [tr ? '30 günlük ortalama' : '30-day average', String(trend30dAvg)],
      ],
    });
  };

  const { copied, copyLink } = useShareExport({
    slug: 'fear-greed-index',
    headline: tr ? 'Bitcoin Korku & Açgözlülük Endeksi' : 'Bitcoin Fear & Greed Index',
    params: {},
  });

  return (
    <ShareExportPanel
      description={tr ? 'Bugünkü Korku & Açgözlülük analizinin PDF özetini indirin.' : "Download a PDF summary of today's Fear & Greed analysis."}
      actions={[
        { kind: 'pdf', onClick: handlePdf, loading: busy },
        { kind: 'csv', onClick: handleCsv },
        { kind: 'copy-link', onClick: copyLink, copied },
      ]}
    />
  );
};
