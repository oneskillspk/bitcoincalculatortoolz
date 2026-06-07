import React, { useRef, useState } from 'react';
import { ShareExportPanel } from '@/components/share-export';
import { LiquidationResult } from '@/services/leverageLiquidationCalculator';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { applyLocalizedPdfFont } from '@/utils/pdfFont';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { buildExportFilename } from '@/utils/exportFilename';

interface LeverageExportReportProps {
  result: LiquidationResult | null;
  entryPrice: number;
  leverage: number;
  marginAmount: number;
  positionType: 'long' | 'short';
  exchangeName: string;
}

export const LeverageExportReport: React.FC<LeverageExportReportProps> = ({
  result,
  entryPrice,
  leverage,
  marginAmount,
  positionType,
  exchangeName
}) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const reportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const formatCurrency = (value: number): string =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(value);

  const formatPct = (value: number): string => value.toFixed(2) + '%';

  const handleExportPNG = async () => {
    if (!reportRef.current || !result) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(reportRef.current, { backgroundColor: '#0a0a0b', scale: 2 });
      const link = document.createElement('a');
      link.download = buildExportFilename({ en: 'leverage-analysis', tr: 'kaldirac-analizi' }, 'png', language, { extra: `${leverage}x` });
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast({ title: tr ? 'Dışa Aktarma Başarılı' : 'Export Successful', description: tr ? 'Kaldıraç analiziniz PNG olarak kaydedildi' : 'Your leverage analysis has been saved as PNG' });
    } catch {
      toast({ title: tr ? 'Dışa Aktarma Başarısız' : 'Export Failed', description: tr ? 'Görsel oluşturulamadı. Lütfen tekrar deneyin.' : 'Unable to generate image. Please try again.', variant: 'destructive' });
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
      pdf.save(buildExportFilename({ en: 'leverage-analysis', tr: 'kaldirac-analizi' }, 'pdf', language, { extra: `${leverage}x` }));
      toast({ title: tr ? 'Dışa Aktarma Başarılı' : 'Export Successful', description: tr ? 'Kaldıraç analiziniz PDF olarak kaydedildi' : 'Your leverage analysis has been saved as PDF' });
    } catch {
      toast({ title: tr ? 'Dışa Aktarma Başarısız' : 'Export Failed', description: tr ? 'PDF oluşturulamadı. Lütfen tekrar deneyin.' : 'Unable to generate PDF. Please try again.', variant: 'destructive' });
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    if (!result) return;
    const posLabel = positionType.toUpperCase();
    const shareText = tr
      ? `📊 Bitcoin Kaldıraç Analizi\n\nPozisyon: ${posLabel}\nKaldıraç: ${leverage}x\nGiriş Fiyatı: ${formatCurrency(entryPrice)}\nTeminat: ${formatCurrency(marginAmount)}\nPozisyon Büyüklüğü: ${formatCurrency(result.positionSizeUsd)}\nLikidasyon Fiyatı: ${formatCurrency(result.liquidationPrice)}\nLikidasyona Uzaklık: ${formatPct(result.distanceToLiquidation)}\nRisk Skoru: ${result.riskScore.toUpperCase()}\n\nKendini hesapla: bitcoincalculator.tools/calculators/leverage-liquidation`
      : `📊 Bitcoin Leverage Analysis\n\nPosition: ${posLabel}\nLeverage: ${leverage}x\nEntry Price: ${formatCurrency(entryPrice)}\nMargin: ${formatCurrency(marginAmount)}\nPosition Size: ${formatCurrency(result.positionSizeUsd)}\nLiquidation Price: ${formatCurrency(result.liquidationPrice)}\nDistance to Liq: ${formatPct(result.distanceToLiquidation)}\nRisk Score: ${result.riskScore.toUpperCase()}\n\nCalculate yours: bitcoincalculator.tools/calculators/leverage-liquidation`;

    try {
      if (navigator.share) {
        await navigator.share({ title: tr ? 'Bitcoin Kaldıraç Analizi' : 'Bitcoin Leverage Analysis', text: shareText });
      } else {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({ title: tr ? 'Panoya Kopyalandı' : 'Copied to Clipboard', description: tr ? 'Paylaşım metni kopyalandı' : 'Share text copied successfully' });
      }
    } catch {}
  };

  if (!result) return null;

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
            <div className="text-2xl font-bold mb-2">{tr ? 'Bitcoin Kaldıraç Analizi' : 'Bitcoin Leverage Analysis'}</div>
            <div className="text-sm text-gray-400">
              {tr ? 'Oluşturuldu:' : 'Generated on'} {new Date().toLocaleDateString()} • bitcoincalculator.tools
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-orange-500">{tr ? 'Pozisyon Detayları' : 'Position Details'}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-400">{tr ? 'Pozisyon Tipi' : 'Position Type'}</span><span className="font-medium">{positionType.toUpperCase()}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">{tr ? 'Borsa' : 'Exchange'}</span><span className="font-medium">{exchangeName}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">{tr ? 'Giriş Fiyatı' : 'Entry Price'}</span><span className="font-medium">{formatCurrency(entryPrice)}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">{tr ? 'Kaldıraç' : 'Leverage'}</span><span className="font-medium">{leverage}x</span></div>
                <div className="flex justify-between"><span className="text-gray-400">{tr ? 'Teminat' : 'Margin'}</span><span className="font-medium">{formatCurrency(marginAmount)}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">{tr ? 'Pozisyon Büyüklüğü' : 'Position Size'}</span><span className="font-medium">{formatCurrency(result.positionSizeUsd)}</span></div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-destructive">{tr ? 'Risk Analizi' : 'Risk Analysis'}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-400">{tr ? 'Likidasyon Fiyatı' : 'Liquidation Price'}</span><span className="font-medium text-destructive">{formatCurrency(result.liquidationPrice)}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">{tr ? 'Likidasyona Uzaklık' : 'Distance to Liq.'}</span><span className="font-medium">{formatPct(result.distanceToLiquidation)}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">{tr ? 'Teminat Çağrısı Fiyatı' : 'Margin Call Price'}</span><span className="font-medium text-orange-400">{formatCurrency(result.marginCallPrice)}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">{tr ? 'Başabaş Fiyatı' : 'Break-Even Price'}</span><span className="font-medium">{formatCurrency(result.breakEvenPrice)}</span></div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{tr ? 'Risk Skoru' : 'Risk Score'}</span>
                  <span className={`font-medium ${result.riskScore === 'low' ? 'text-success' : result.riskScore === 'medium' ? 'text-warning' : result.riskScore === 'high' ? 'text-orange-400' : 'text-destructive'}`}>{result.riskScore.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-white/10 text-xs text-gray-500 text-center">
            {tr ? 'Bu analiz yalnızca eğitim amaçlıdır ve finansal tavsiye niteliği taşımaz. Kaldıraçlı işlemler önemli kayıp riski taşır.' : 'This analysis is for educational purposes only and does not constitute financial advice. Leverage trading carries significant risk of loss.'}
          </div>
        </div>
      </div>
    </div>
  );
};
