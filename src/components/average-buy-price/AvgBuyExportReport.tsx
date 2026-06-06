import { useState } from 'react';
import { ShareExportPanel } from '@/components/share-export';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { applyLocalizedPdfFont } from '@/utils/pdfFont';
import { AvgBuyResult } from '@/services/averageBuyPriceCalculator';
import { useLanguage } from '@/contexts/LanguageContext';
import { buildExportFilename } from '@/utils/exportFilename';

interface Props {
  result: AvgBuyResult | null;
  liveBtcPrice: number;
}

export const AvgBuyExportReport = ({ result, liveBtcPrice }: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<'png' | 'pdf' | null>(null);
  const { toast } = useToast();

  if (!result) return null;

  const fmt = (n: number) => `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

  const buildHTML = () => `
    <div style="padding:40px;background:#fff;color:#111;font-family:system-ui,sans-serif;max-width:800px;">
      <div style="text-align:center;border-bottom:2px solid #f97316;padding-bottom:20px;margin-bottom:24px;">
        <h1 style="font-size:24px;margin:0 0 6px;">📊 Bitcoin Average Buy Price Report</h1>
        <p style="color:#666;font-size:14px;margin:0;">Generated ${format(new Date(), 'MMMM d, yyyy')}</p>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;">
        <div style="background:#eff6ff;padding:16px;border-radius:8px;">
          <p style="font-size:12px;color:#1e40af;margin:0 0 4px;">Average Buy Price</p>
          <p style="font-size:20px;font-weight:bold;margin:0;">${fmt(result.weightedAvgPrice)}</p>
        </div>
        <div style="background:#fef3c7;padding:16px;border-radius:8px;">
          <p style="font-size:12px;color:#92400e;margin:0 0 4px;">Total BTC Held</p>
          <p style="font-size:20px;font-weight:bold;margin:0;">₿ ${result.totalBtc.toFixed(8)}</p>
        </div>
        <div style="background:#f0fdf4;padding:16px;border-radius:8px;">
          <p style="font-size:12px;color:#065f46;margin:0 0 4px;">Current Value</p>
          <p style="font-size:20px;font-weight:bold;margin:0;">${fmt(result.currentValue)}</p>
        </div>
        <div style="background:${result.unrealizedPL >= 0 ? '#f0fdf4' : '#fef2f2'};padding:16px;border-radius:8px;">
          <p style="font-size:12px;color:${result.unrealizedPL >= 0 ? '#065f46' : '#991b1b'};margin:0 0 4px;">Unrealized P/L</p>
          <p style="font-size:20px;font-weight:bold;margin:0;color:${result.unrealizedPL >= 0 ? '#16a34a' : '#dc2626'};">${result.unrealizedPL >= 0 ? '+' : ''}${fmt(result.unrealizedPL)}</p>
          <p style="font-size:12px;color:#666;margin:4px 0 0;">ROI: ${result.roiPercent >= 0 ? '+' : ''}${result.roiPercent.toFixed(2)}%</p>
        </div>
      </div>
      <div style="text-align:center;border-top:1px solid #e5e7eb;padding-top:16px;">
        <p style="font-size:12px;color:#666;margin:0;">Live BTC Price: ${fmt(liveBtcPrice)}</p>
        <p style="font-size:11px;color:#999;margin:4px 0 0;">bitcoincalculator.tools/calculators/average-buy-price</p>
      </div>
    </div>
  `;

  const generate = async (type: 'png' | 'pdf') => {
    setIsExporting(true);
    setExportType(type);
    try {
      const el = document.createElement('div');
      el.innerHTML = buildHTML();
      document.body.appendChild(el);
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      document.body.removeChild(el);

      if (type === 'png') {
        const link = document.createElement('a');
        link.download = buildExportFilename({ en: 'bitcoin-avg-buy-price', tr: 'bitcoin-ortalama-alis-fiyati' }, 'png', language);
        link.href = canvas.toDataURL('image/png');
        link.click();
      } else {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        await applyLocalizedPdfFont(pdf, language);
        const w = pdf.internal.pageSize.getWidth();
        const h = (canvas.height * w) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, w, h);
        pdf.save(buildExportFilename({ en: 'bitcoin-avg-buy-price', tr: 'bitcoin-ortalama-alis-fiyati' }, 'pdf', language));
      }
      toast({ title: tr ? 'İndirildi' : 'Downloaded', description: `${type.toUpperCase()} ${tr ? 'raporu kaydedildi' : 'report saved'}` });
    } catch {
      toast({ title: tr ? 'Dışa Aktarma Başarısız' : 'Export Failed', variant: 'destructive' });
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  return (
    <ShareExportPanel
      actions={[
        { kind: 'pdf', onClick: () => generate('pdf'), loading: isExporting && exportType === 'pdf' },
        { kind: 'png', onClick: () => generate('png'), loading: isExporting && exportType === 'png' },
      ]}
    />
  );
};
