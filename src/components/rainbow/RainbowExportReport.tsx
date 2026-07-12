import React, { useCallback, useState } from 'react';
import { formatGroupedInt } from '@/utils/numberFormat';
import { ShareExportPanel, downloadSnapshot, downloadStandardPdf, useShareExport } from '@/components/share-export';
import { CurrentBandResult } from '@/services/rainbowChartService';
import { useLanguage } from '@/contexts/LanguageContext';

interface RainbowExportReportProps {
  currentBand: CurrentBandResult;
  currentPrice: number;
}

export const RainbowExportReport: React.FC<RainbowExportReportProps> = ({ currentBand, currentPrice }) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [busy, setBusy] = useState<'pdf' | 'png' | null>(null);

  const handlePDF = useCallback(async () => {
    setBusy('pdf');
    try {
      const fmt = (n: number) => `$${formatGroupedInt(n, 'en-US')}`;
      await downloadStandardPdf({
        title: tr ? 'Bitcoin Gökkuşağı Fiyat Grafiği Raporu' : 'Bitcoin Rainbow Price Chart Report',
        language,
        filename: { en: 'bitcoin-rainbow-chart-report', tr: 'bitcoin-gokkusagi-grafigi-raporu' },
        canonicalUrl: 'bitcoincalculator.tools/calculators/rainbow-chart',
        headline: { label: tr ? 'Güncel Fiyat' : 'Current Price', value: fmt(currentPrice) },
        sections: [
          {
            heading: tr ? 'Mevcut Bölge' : 'Current Zone',
            rows: [
              [tr ? 'Bant' : 'Band', `${currentBand.bandIndex} — ${currentBand.name}`],
              [tr ? 'Bant Aralığı' : 'Band Range', `${fmt(currentBand.lowerPrice)} – ${fmt(currentBand.upperPrice)}`],
              [tr ? 'Açıklama' : 'Description', currentBand.description],
            ],
          },
        ],
      });
    } finally { setBusy(null); }
  }, [currentBand, currentPrice, language, tr]);

  const handlePNG = useCallback(async () => {
    const chartEl = document.querySelector('[data-chart-export="rainbow"]');
    if (!chartEl) return;
    setBusy('png');
    try {
      await downloadSnapshot(chartEl as HTMLElement, {
        filename: { en: 'bitcoin-rainbow-chart', tr: 'bitcoin-gokkusagi-grafigi' },
        language,
        withDate: false,
      });
    } finally { setBusy(null); }
  }, [language]);

  const { copied, copyLink } = useShareExport({
    slug: 'rainbow-chart',
    headline: tr ? 'Bitcoin Gökkuşağı Fiyat Grafiği' : 'Bitcoin Rainbow Price Chart',
    params: {},
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
};
