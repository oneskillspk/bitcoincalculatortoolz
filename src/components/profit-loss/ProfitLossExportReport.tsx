import React, { useRef, useState } from 'react';
import { ShareExportPanel } from '@/components/share-export';
import { ProfitLossResult, Purchase } from '@/services/profitLossCalculator';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { applyLocalizedPdfFont } from '@/utils/pdfFont';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { buildExportFilename } from '@/utils/exportFilename';

interface ProfitLossExportReportProps {
  result: ProfitLossResult | null;
  purchases: Purchase[];
  exchangeName: string;
}

export const ProfitLossExportReport: React.FC<ProfitLossExportReportProps> = ({
  result,
  purchases,
  exchangeName,
}) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const reportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const fmt = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(v);

  const handleExportPNG = async () => {
    if (!reportRef.current || !result) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(reportRef.current, { backgroundColor: '#0a0a0b', scale: 2 });
      const link = document.createElement('a');
      link.download = buildExportFilename({ en: 'bitcoin-profit-loss', tr: 'bitcoin-kar-zarar' }, 'png', language);
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast({ title: tr ? 'Dışa Aktarma Başarılı' : 'Export Successful', description: tr ? 'Kâr/zarar raporunuz PNG olarak kaydedildi' : 'Your profit/loss report has been saved as PNG' });
    } catch {
      toast({ title: tr ? 'Dışa Aktarma Başarısız' : 'Export Failed', description: tr ? 'Görsel oluşturulamadı.' : 'Unable to generate image.', variant: 'destructive' });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    if (!reportRef.current || !result) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(reportRef.current, { backgroundColor: '#0a0a0b', scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      await applyLocalizedPdfFont(pdf, language);
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(buildExportFilename({ en: 'bitcoin-profit-loss', tr: 'bitcoin-kar-zarar' }, 'pdf', language));
      toast({ title: tr ? 'Dışa Aktarma Başarılı' : 'Export Successful', description: tr ? 'Kâr/zarar raporunuz PDF olarak kaydedildi' : 'Your profit/loss report has been saved as PDF' });
    } catch {
      toast({ title: tr ? 'Dışa Aktarma Başarısız' : 'Export Failed', description: tr ? 'PDF oluşturulamadı.' : 'Unable to generate PDF.', variant: 'destructive' });
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    if (!result) return;
    const isProfit = result.netProfitLoss >= 0;
    const text = tr
      ? `📊 Bitcoin Kâr/Zarar Analizi\n\nToplam Yatırım: ${fmt(result.totalInvested)}\nElde Tutulan BTC: ${result.totalBtcHeld.toFixed(8)} BTC\nSatış Fiyatı: ${fmt(result.sellPrice)}\nNet ${isProfit ? 'Kâr' : 'Zarar'}: ${fmt(result.netProfitLoss)}\nROI: ${result.roiPercent.toFixed(2)}%\nBaşabaş: ${fmt(result.breakevenPrice)}\nToplam Ücretler: ${fmt(result.totalFeesPaid)}\n\nKendini hesapla: bitcoincalculator.tools/calculators/profit-loss`
      : `📊 Bitcoin Profit/Loss Analysis\n\nTotal Invested: ${fmt(result.totalInvested)}\nBTC Held: ${result.totalBtcHeld.toFixed(8)} BTC\nSell Price: ${fmt(result.sellPrice)}\nNet ${isProfit ? 'Profit' : 'Loss'}: ${fmt(result.netProfitLoss)}\nROI: ${result.roiPercent.toFixed(2)}%\nBreakeven: ${fmt(result.breakevenPrice)}\nTotal Fees: ${fmt(result.totalFeesPaid)}\n\nCalculate yours: bitcoincalculator.tools/calculators/profit-loss`;

    try {
      if (navigator.share) {
        await navigator.share({ title: tr ? 'Bitcoin Kâr/Zarar Analizi' : 'Bitcoin Profit/Loss Analysis', text });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({ title: tr ? 'Panoya Kopyalandı' : 'Copied to Clipboard', description: tr ? 'Paylaşım metni kopyalandı' : 'Share text copied successfully' });
      }
    } catch {}
  };

  if (!result) return null;

  const isProfit = result.netProfitLoss >= 0;

  return (
    <div className="space-y-4">
      <ShareExportPanel
        actions={[
          { kind: 'png', onClick: handleExportPNG, loading: isExporting, disabled: !result },
          { kind: 'pdf', onClick: handleExportPDF, loading: isExporting, disabled: !result },
          { kind: 'copy-link', onClick: handleShare, copied },
        ]}
      />

      <div ref={reportRef} className="fixed -left-[9999px] w-[800px] p-8 bg-[#0a0a0b] text-white" style={{ fontFamily: 'system-ui, sans-serif' }}>
        <div className="space-y-6">
          <div className="text-center pb-6 border-b border-white/10">
            <div className="text-2xl font-bold mb-2">{tr ? 'Bitcoin Kâr/Zarar Analizi' : 'Bitcoin Profit/Loss Analysis'}</div>
            <div className="text-sm text-gray-400">
              {tr ? 'Oluşturuldu:' : 'Generated on'} {new Date().toLocaleDateString()} • bitcoincalculator.tools
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-orange-500">{tr ? 'Yatırım Özeti' : 'Investment Summary'}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-400">{tr ? 'Borsa' : 'Exchange'}</span><span>{exchangeName}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">{tr ? 'Toplam Yatırım' : 'Total Invested'}</span><span>{fmt(result.totalInvested)}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">{tr ? 'Elde Tutulan BTC' : 'BTC Held'}</span><span>{result.totalBtcHeld.toFixed(8)}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">{tr ? 'Ort. Maliyet Bazı' : 'Avg Cost Basis'}</span><span>{fmt(result.weightedAvgCostBasis)}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">{tr ? 'Alım Sayısı' : 'Purchases'}</span><span>{purchases.length}</span></div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className={`text-lg font-semibold ${isProfit ? 'text-success' : 'text-destructive'}`}>
                {isProfit ? (tr ? 'Kâr' : 'Profit') : (tr ? 'Zarar' : 'Loss')} {tr ? 'Analizi' : 'Analysis'}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-400">{tr ? 'Satış Fiyatı' : 'Sell Price'}</span><span>{fmt(result.sellPrice)}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">{tr ? 'Brüt K/Z' : 'Gross P/L'}</span><span className={isProfit ? 'text-success' : 'text-destructive'}>{fmt(result.grossProfitLoss)}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">{tr ? 'Toplam Ücretler' : 'Total Fees'}</span><span className="text-warning">{fmt(result.totalFeesPaid)}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">{tr ? 'Net K/Z' : 'Net P/L'}</span><span className={`font-bold ${isProfit ? 'text-success' : 'text-destructive'}`}>{fmt(result.netProfitLoss)}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">ROI</span><span className={isProfit ? 'text-success' : 'text-destructive'}>{result.roiPercent.toFixed(2)}%</span></div>
                <div className="flex justify-between"><span className="text-gray-400">{tr ? 'Başabaş' : 'Breakeven'}</span><span>{fmt(result.breakevenPrice)}</span></div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 text-xs text-gray-500 text-center">
            {tr ? 'Bu analiz yalnızca eğitim amaçlıdır ve finansal tavsiye niteliği taşımaz.' : 'This analysis is for educational purposes only and does not constitute financial advice.'}
          </div>
        </div>
      </div>
    </div>
  );
};
