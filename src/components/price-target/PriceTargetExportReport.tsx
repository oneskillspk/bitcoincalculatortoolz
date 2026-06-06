import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { buildExportFilename } from '@/utils/exportFilename';
import { ShareExportPanel, captureSnapshot } from '@/components/share-export';

interface Props {
  exportRef: React.RefObject<HTMLDivElement>;
}

export const PriceTargetExportReport: React.FC<Props> = ({ exportRef }) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const { toast } = useToast();

  const handlePNG = async () => {
    if (!exportRef.current) return;
    const canvas = await captureSnapshot(exportRef.current);
    const link = document.createElement('a');
    link.download = buildExportFilename({ en: 'bitcoin-price-target-report', tr: 'bitcoin-fiyat-hedefi-raporu' }, 'png', language);
    link.href = canvas.toDataURL('image/png');
    link.click();
    toast({ title: tr ? 'PNG İndirildi' : 'PNG Downloaded', description: tr ? 'Raporunuz kaydedildi' : 'Your report has been saved' });
  };

  const handlePDF = async () => {
    if (!exportRef.current) return;
    const { jsPDF } = await import('jspdf');
    const canvas = await captureSnapshot(exportRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(buildExportFilename({ en: 'bitcoin-price-target-report', tr: 'bitcoin-fiyat-hedefi-raporu' }, 'pdf', language));
    toast({ title: tr ? 'PDF İndirildi' : 'PDF Downloaded', description: tr ? 'Raporunuz kaydedildi' : 'Your report has been saved' });
  };

  return (
    <ShareExportPanel
      actions={[
        { kind: 'pdf', onClick: handlePDF },
        { kind: 'png', onClick: handlePNG },
      ]}
    />
  );
};
