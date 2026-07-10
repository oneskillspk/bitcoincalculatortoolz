import React, { useCallback, useState } from 'react';
import { ShareExportPanel, downloadSnapshot, downloadStandardPdf } from '@/components/share-export';
import { useLanguage } from '@/contexts/LanguageContext';

interface HalvingExportReportProps {
  reportRef: React.RefObject<HTMLDivElement>;
  currentBlock?: number;
  blocksRemaining?: number;
  estimatedDate?: Date | string;
  currentReward?: number;
  nextReward?: number;
}

export const HalvingExportReport: React.FC<HalvingExportReportProps> = ({
  reportRef, currentBlock, blocksRemaining, estimatedDate, currentReward, nextReward,
}) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [busy, setBusy] = useState<'pdf' | 'png' | null>(null);

  const handlePNG = useCallback(async () => {
    if (!reportRef.current) return;
    setBusy('png');
    try {
      await downloadSnapshot(reportRef.current, {
        filename: { en: 'bitcoin-halving-countdown', tr: 'bitcoin-halving-geri-sayim' },
        language,
      });
    } finally { setBusy(null); }
  }, [reportRef, language]);

  const handlePDF = useCallback(async () => {
    setBusy('pdf');
    try {
      const rows: [string, string][] = [];
      if (currentBlock !== undefined) rows.push([tr ? 'Mevcut Blok' : 'Current Block', currentBlock.toLocaleString()]);
      if (blocksRemaining !== undefined) rows.push([tr ? 'Kalan Blok' : 'Blocks Remaining', blocksRemaining.toLocaleString()]);
      if (estimatedDate) {
        const d = typeof estimatedDate === 'string' ? new Date(estimatedDate) : estimatedDate;
        rows.push([tr ? 'Tahmini Tarih' : 'Estimated Date', d.toLocaleDateString(tr ? 'tr-TR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })]);
      }
      if (currentReward !== undefined) rows.push([tr ? 'Mevcut Ödül' : 'Current Reward', `${currentReward} BTC`]);
      if (nextReward !== undefined) rows.push([tr ? 'Sonraki Ödül' : 'Next Reward', `${nextReward} BTC`]);

      await downloadStandardPdf({
        title: tr ? 'Bitcoin Halving Geri Sayım Raporu' : 'Bitcoin Halving Countdown Report',
        language,
        filename: { en: 'bitcoin-halving-countdown', tr: 'bitcoin-halving-geri-sayim' },
        canonicalUrl: 'bitcoincalculator.tools/calculators/halving-countdown',
        headline: blocksRemaining !== undefined
          ? { label: tr ? 'Kalan Blok' : 'Blocks Remaining', value: blocksRemaining.toLocaleString(), accent: 'ember' }
          : undefined,
        sections: rows.length ? [{ heading: tr ? 'Halving Durumu' : 'Halving Status', rows }] : [],
      });
    } finally { setBusy(null); }
  }, [language, tr, currentBlock, blocksRemaining, estimatedDate, currentReward, nextReward]);

  return (
    <ShareExportPanel
      actions={[
        { kind: 'pdf', onClick: handlePDF, loading: busy === 'pdf' },
        { kind: 'png', onClick: handlePNG, loading: busy === 'png' },
      ]}
    />
  );
};
