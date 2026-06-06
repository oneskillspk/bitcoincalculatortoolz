import { useState } from 'react';
import { ShareExportPanel } from '@/components/share-export';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { applyLocalizedPdfFont } from '@/utils/pdfFont';
import { PIZZA_TRANSACTION } from '@/services/pizzaDayCalculatorService';
import { useLanguage } from '@/contexts/LanguageContext';
import { buildExportFilename } from '@/utils/exportFilename';

interface Props {
  currentBtcPrice: number;
  currentValue: number;
  reportRef: React.RefObject<HTMLDivElement>;
}

export const PizzaExportReport = ({ currentBtcPrice, currentValue, reportRef }: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<'png' | 'pdf' | null>(null);
  const { toast } = useToast();

  const fmtLarge = (n: number) => {
    if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
    if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
    return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  const buildReportHTML = () => `
    <div style="padding:40px;background:#fff;color:#111;font-family:system-ui,sans-serif;max-width:800px;">
      <div style="text-align:center;border-bottom:2px solid #f97316;padding-bottom:20px;margin-bottom:24px;">
        <h1 style="font-size:28px;margin:0 0 6px;">🍕 ${tr ? 'Bitcoin Pizza Günü Raporu' : 'Bitcoin Pizza Day Report'}</h1>
        <p style="color:#666;font-size:14px;margin:0;">${tr ? 'Oluşturuldu:' : 'Generated'} ${format(new Date(), 'MMMM d, yyyy')}</p>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px;">
        <div style="background:#fef3c7;padding:16px;border-radius:8px;">
          <p style="font-size:12px;color:#92400e;margin:0 0 4px;">${tr ? 'Orijinal İşlem' : 'Original Transaction'}</p>
          <p style="font-size:20px;font-weight:bold;margin:0;">$${PIZZA_TRANSACTION.usdValue}</p>
          <p style="font-size:12px;color:#666;margin:4px 0 0;">${PIZZA_TRANSACTION.btcSpent.toLocaleString()} BTC • ${PIZZA_TRANSACTION.date}</p>
        </div>
        <div style="background:#d1fae5;padding:16px;border-radius:8px;">
          <p style="font-size:12px;color:#065f46;margin:0 0 4px;">${tr ? 'Güncel Değer' : 'Current Value'}</p>
          <p style="font-size:20px;font-weight:bold;margin:0;">${fmtLarge(currentValue)}</p>
          <p style="font-size:12px;color:#666;margin:4px 0 0;">${tr ? 'BTC Fiyatı:' : 'BTC Price:'} $${currentBtcPrice.toLocaleString()}</p>
        </div>
      </div>

      <div style="background:#f9fafb;padding:16px;border-radius:8px;margin-bottom:24px;">
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;text-align:center;">
          <div>
            <p style="font-size:12px;color:#666;margin:0 0 4px;">${tr ? 'Çarpan' : 'Multiplier'}</p>
            <p style="font-size:18px;font-weight:bold;color:#f97316;margin:0;">${Math.round(currentValue / 41).toLocaleString()}x</p>
          </div>
          <div>
            <p style="font-size:12px;color:#666;margin:0 0 4px;">${tr ? 'Pizza Başına Maliyet' : 'Cost Per Pizza'}</p>
            <p style="font-size:18px;font-weight:bold;margin:0;">${fmtLarge(currentValue / 2)}</p>
          </div>
          <div>
            <p style="font-size:12px;color:#666;margin:0 0 4px;">${tr ? 'Yıl Önce' : 'Years Ago'}</p>
            <p style="font-size:18px;font-weight:bold;margin:0;">${new Date().getFullYear() - 2010}</p>
          </div>
        </div>
      </div>

      <div style="text-align:center;border-top:1px solid #e5e7eb;padding-top:16px;">
        <p style="font-size:11px;color:#999;margin:0;">bitcoincalculator.tools/calculators/pizza-day</p>
      </div>
    </div>
  `;

  const generatePNG = async () => {
    setIsExporting(true);
    setExportType('png');
    try {
      const el = document.createElement('div');
      el.innerHTML = buildReportHTML();
      document.body.appendChild(el);
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      document.body.removeChild(el);
      const link = document.createElement('a');
      link.download = buildExportFilename({ en: 'bitcoin-pizza-day-report', tr: 'bitcoin-pizza-gunu-raporu' }, 'png', language);
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast({ title: tr ? 'Rapor İndirildi' : 'Report Downloaded', description: tr ? 'PNG raporu başarıyla kaydedildi' : 'PNG report saved successfully' });
    } catch {
      toast({ title: tr ? 'Dışa Aktarma Başarısız' : 'Export Failed', description: tr ? 'PNG oluşturulamadı' : 'Could not generate PNG', variant: 'destructive' });
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  const generatePDF = async () => {
    setIsExporting(true);
    setExportType('pdf');
    try {
      const el = document.createElement('div');
      el.innerHTML = buildReportHTML();
      document.body.appendChild(el);
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      document.body.removeChild(el);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      await applyLocalizedPdfFont(pdf, language);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(buildExportFilename({ en: 'bitcoin-pizza-day-report', tr: 'bitcoin-pizza-gunu-raporu' }, 'pdf', language));
      toast({ title: tr ? 'Rapor İndirildi' : 'Report Downloaded', description: tr ? 'PDF raporu başarıyla kaydedildi' : 'PDF report saved successfully' });
    } catch {
      toast({ title: tr ? 'Dışa Aktarma Başarısız' : 'Export Failed', description: tr ? 'PDF oluşturulamadı' : 'Could not generate PDF', variant: 'destructive' });
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  return (
    <ShareExportPanel
      description={tr ? 'Pizza Günü analizini PNG veya PDF olarak kaydedin' : 'Save your Pizza Day analysis as PNG or PDF'}
      actions={[
        { kind: 'pdf', onClick: generatePDF, loading: isExporting && exportType === 'pdf' },
        { kind: 'png', onClick: generatePNG, loading: isExporting && exportType === 'png' },
      ]}
    />
  );
};
