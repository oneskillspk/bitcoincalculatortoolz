import React, { useCallback, useState } from 'react';
import { ShareExportPanel, downloadSnapshot, downloadStandardPdf } from '@/components/share-export';
import { useLanguage } from '@/contexts/LanguageContext';

interface HalvingExportReportProps {
  reportRef: React.RefObject<HTMLDivElement>;
}

export const HalvingExportReport: React.FC<HalvingExportReportProps> = ({ reportRef }) => {
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
      await downloadStandardPdf({
        title: tr ? 'Bitcoin Halving Geri Sayım Raporu' : 'Bitcoin Halving Countdown Report',
        language,
        filename: { en: 'bitcoin-halving-countdown', tr: 'bitcoin-halving-geri-sayim' },
        canonicalUrl: 'bitcoincalculator.tools/calculators/halving-countdown',
        sections: [],
      });
    } finally { setBusy(null); }
  }, [language, tr]);

  return (
    <ShareExportPanel
      actions={[
        { kind: 'pdf', onClick: handlePDF, loading: busy === 'pdf' },
        { kind: 'png', onClick: handlePNG, loading: busy === 'png' },
      ]}
    />
  );
};
