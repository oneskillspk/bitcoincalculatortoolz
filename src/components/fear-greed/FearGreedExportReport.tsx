import React from 'react';
import { ShareExportPanel } from '@/components/share-export';
import { jsPDF } from 'jspdf';
import { applyLocalizedPdfFont } from '@/utils/pdfFont';
import { useLanguage } from '@/contexts/LanguageContext';
import { buildExportFilename } from '@/utils/exportFilename';

interface FearGreedExportReportProps {
  currentValue: number;
  classification: string;
  trend7dAvg: number;
  trend30dAvg: number;
}

export const FearGreedExportReport: React.FC<FearGreedExportReportProps> = ({
  currentValue,
  classification,
  trend7dAvg,
  trend30dAvg,
}) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const handleExportPDF = async () => {
    const doc = new jsPDF();
    await applyLocalizedPdfFont(doc, language);
    const now = new Date().toLocaleDateString(tr ? 'tr-TR' : 'en-US');

    doc.setFontSize(20);
    doc.text(tr ? 'Bitcoin Korku & Açgözlülük Endeksi Raporu' : 'Bitcoin Fear & Greed Index Report', 20, 25);

    doc.setFontSize(10);
    doc.setTextColor(128);
    doc.text(`${tr ? 'Oluşturuldu:' : 'Generated on'} ${now} • bitcoincalculator.tools`, 20, 33);

    doc.setDrawColor(200);
    doc.line(20, 37, 190, 37);

    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text(tr ? 'Güncel Endeks' : 'Current Index', 20, 50);

    doc.setFontSize(36);
    doc.text(String(currentValue), 20, 70);

    doc.setFontSize(14);
    doc.text(classification, 55, 70);

    doc.setFontSize(12);
    doc.setTextColor(80);
    doc.text(`${tr ? '7 Günlük Ortalama:' : '7-Day Average:'} ${trend7dAvg}`, 20, 90);
    doc.text(`${tr ? '30 Günlük Ortalama:' : '30-Day Average:'} ${trend30dAvg}`, 20, 100);

    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text(
      tr
        ? 'Yasal Uyarı: Bu rapor yalnızca bilgilendirme amaçlıdır ve finansal tavsiye niteliği taşımaz.'
        : 'Disclaimer: This report is for informational purposes only and does not constitute financial advice.',
      20, 280
    );

    doc.save(buildExportFilename({ en: 'bitcoin-fear-greed-index-report', tr: 'bitcoin-korku-acgozluluk-raporu' }, 'pdf', language));
  };

  return (
    <ShareExportPanel
      description={tr ? 'Bugünkü Korku & Açgözlülük analizinin PDF özetini indirin.' : "Download a PDF summary of today's Fear & Greed analysis."}
      actions={[{ kind: 'pdf', onClick: handleExportPDF }]}
    />
  );
};
