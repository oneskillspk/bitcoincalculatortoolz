import { brand } from '@/lib/brandColors';
import React, { useState } from 'react';
import { ShareExportPanel } from '@/components/share-export';
import { MiningResult, MiningParams } from '@/services/miningProfitabilityCalculator';
import { format } from 'date-fns';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { applyLocalizedPdfFont } from '@/utils/pdfFont';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { buildExportFilename } from '@/utils/exportFilename';

interface MiningExportReportProps {
  result: MiningResult;
  params: MiningParams;
}

export const MiningExportReport = React.memo(({ result, params }: MiningExportReportProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<'png' | 'pdf' | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const generatePNGReport = async () => {
    setIsExporting(true);
    setExportType('png');

    try {
      const reportElement = document.createElement('div');
      reportElement.style.cssText = 'padding: 40px; background: white; width: 800px; font-family: system-ui, -apple-system, sans-serif;';

      const isProfitable = result.dailyProfit > 0;

      reportElement.innerHTML = `
        <div style="max-width: 800px; margin: 0 auto;">
          <div style="text-align: center; border-bottom: 2px solid ${brand.ember}; padding-bottom: 24px; margin-bottom: 24px;">
            <h1 style="font-size: 28px; font-weight: bold; color: #1f2937; margin: 0 0 8px 0;">${tr ? 'Bitcoin Madencilik Karlılık Raporu' : 'Bitcoin Mining Profitability Report'}</h1>
            <p style="color: #6b7280; margin: 0;">${tr ? 'Oluşturuldu:' : 'Generated on'} ${format(new Date(), 'MMMM d, yyyy')}</p>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">
            <div style="background: #f9fafb; padding: 20px; border-radius: 12px;">
              <h2 style="font-size: 18px; font-weight: 600; color: #1f2937; margin: 0 0 16px 0;">${tr ? 'Madencilik Kurulumu' : 'Mining Setup'}</h2>
              <div style="display: grid; gap: 8px; font-size: 14px;">
                <p style="margin: 0;"><strong>${tr ? 'Hash Hızı:' : 'Hash Rate:'}</strong> ${params.hashRate} TH/s</p>
                <p style="margin: 0;"><strong>${tr ? 'Güç Tüketimi:' : 'Power Consumption:'}</strong> ${params.powerConsumption} W</p>
                <p style="margin: 0;"><strong>${tr ? 'Elektrik Maliyeti:' : 'Electricity Cost:'}</strong> $${params.electricityCost}/kWh</p>
                <p style="margin: 0;"><strong>${tr ? 'Havuz Ücreti:' : 'Pool Fee:'}</strong> ${params.poolFee}%</p>
                <p style="margin: 0;"><strong>${tr ? 'Donanım Maliyeti:' : 'Hardware Cost:'}</strong> ${formatCurrency(params.hardwareCost)}</p>
              </div>
            </div>
            <div style="background: #f9fafb; padding: 20px; border-radius: 12px;">
              <h2 style="font-size: 18px; font-weight: 600; color: #1f2937; margin: 0 0 16px 0;">${tr ? 'Piyasa Koşulları' : 'Market Conditions'}</h2>
              <div style="display: grid; gap: 8px; font-size: 14px;">
                <p style="margin: 0;"><strong>${tr ? 'Bitcoin Fiyatı:' : 'Bitcoin Price:'}</strong> ${formatCurrency(params.bitcoinPrice)}</p>
                <p style="margin: 0;"><strong>${tr ? 'Blok Ödülü:' : 'Block Reward:'}</strong> ${params.blockReward} BTC</p>
                <p style="margin: 0;"><strong>${tr ? 'Zorluk Ayarlaması:' : 'Difficulty Adjustment:'}</strong> ${params.difficultyAdjustment}% ${tr ? 'aylık' : 'monthly'}</p>
              </div>
            </div>
          </div>

          <div style="background: ${isProfitable ? '#ecfdf5' : '#fef2f2'}; border: 1px solid ${isProfitable ? '#10b981' : '#ef4444'}; padding: 20px; border-radius: 12px; margin-bottom: 24px;">
            <div style="text-align: center;">
              <span style="font-size: 14px; color: ${isProfitable ? '#059669' : '#dc2626'}; font-weight: 600;">
                ${isProfitable ? (tr ? '✓ KARLI' : '✓ PROFITABLE') : (tr ? '✗ KARSIZ' : '✗ UNPROFITABLE')}
              </span>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px;">
            <div style="background: #f9fafb; padding: 16px; border-radius: 12px; text-align: center;">
              <p style="color: #6b7280; font-size: 12px; margin: 0 0 4px 0;">${tr ? 'Günlük Kâr' : 'Daily Profit'}</p>
              <p style="font-size: 20px; font-weight: bold; color: ${result.dailyProfit >= 0 ? '#10b981' : '#ef4444'}; margin: 0;">${formatCurrency(result.dailyProfit)}</p>
            </div>
            <div style="background: #f9fafb; padding: 16px; border-radius: 12px; text-align: center;">
              <p style="color: #6b7280; font-size: 12px; margin: 0 0 4px 0;">${tr ? 'Aylık Kâr' : 'Monthly Profit'}</p>
              <p style="font-size: 20px; font-weight: bold; color: ${result.monthlyProfit >= 0 ? '#10b981' : '#ef4444'}; margin: 0;">${formatCurrency(result.monthlyProfit)}</p>
            </div>
            <div style="background: #f9fafb; padding: 16px; border-radius: 12px; text-align: center;">
              <p style="color: #6b7280; font-size: 12px; margin: 0 0 4px 0;">${tr ? 'Yıllık Kâr' : 'Yearly Profit'}</p>
              <p style="font-size: 20px; font-weight: bold; color: ${result.yearlyProfit >= 0 ? '#10b981' : '#ef4444'}; margin: 0;">${formatCurrency(result.yearlyProfit)}</p>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
            <div style="background: #fff7ed; padding: 16px; border-radius: 12px; text-align: center;">
              <p style="color: #6b7280; font-size: 12px; margin: 0 0 4px 0;">${tr ? 'Günlük BTC' : 'Daily BTC'}</p>
              <p style="font-size: 16px; font-weight: bold; color: ${brand.ember}; margin: 0;">${(result.dailyBtcMined * 100000000).toFixed(0)} sats</p>
            </div>
            <div style="background: #eff6ff; padding: 16px; border-radius: 12px; text-align: center;">
              <p style="color: #6b7280; font-size: 12px; margin: 0 0 4px 0;">${tr ? 'Başabaş' : 'Break-Even'}</p>
              <p style="font-size: 16px; font-weight: bold; color: #3b82f6; margin: 0;">${result.breakEvenDays === Infinity ? (tr ? 'Hiçbir zaman' : 'Never') : `${result.breakEvenDays} ${tr ? 'gün' : 'days'}`}</p>
            </div>
            <div style="background: #f0fdf4; padding: 16px; border-radius: 12px; text-align: center;">
              <p style="color: #6b7280; font-size: 12px; margin: 0 0 4px 0;">${tr ? 'Yıllık ROI' : 'Annual ROI'}</p>
              <p style="font-size: 16px; font-weight: bold; color: ${result.roiPercentage >= 0 ? '#10b981' : '#ef4444'}; margin: 0;">${result.roiPercentage.toFixed(1)}%</p>
            </div>
            <div style="background: #fdf4ff; padding: 16px; border-radius: 12px; text-align: center;">
              <p style="color: #6b7280; font-size: 12px; margin: 0 0 4px 0;">${tr ? 'BTC Başına Maliyet' : 'Cost/BTC'}</p>
              <p style="font-size: 16px; font-weight: bold; color: #a855f7; margin: 0;">${formatCurrency(result.costPerBtc)}</p>
            </div>
          </div>

          <div style="text-align: center; color: #9ca3af; font-size: 11px; border-top: 1px solid #e5e7eb; padding-top: 16px;">
            <p style="margin: 0 0 4px 0;">Report generated by Bitcoin Calculator Tools • Mining Profitability Calculator</p>
            <p style="margin: 0;">${tr ? 'Bu rapor yalnızca bilgilendirme amaçlıdır ve finansal tavsiye niteliği taşımaz.' : 'This report is for informational purposes only and should not be considered financial advice.'}</p>
          </div>
        </div>
      `;

      document.body.appendChild(reportElement);
      const canvas = await html2canvas(reportElement, { backgroundColor: '#ffffff', scale: 2, useCORS: true, allowTaint: true });

      const link = document.createElement('a');
      link.download = buildExportFilename({ en: 'bitcoin-mining-report', tr: 'bitcoin-madencilik-raporu' }, 'png', language);
      link.href = canvas.toDataURL('image/png');
      link.click();

      document.body.removeChild(reportElement);

      toast({ title: tr ? 'Rapor dışa aktarıldı' : 'Report exported', description: tr ? 'Madencilik raporunuz PNG olarak kaydedildi' : 'Your mining report has been saved as PNG' });
    } catch (error) {
      toast({ title: tr ? 'Dışa aktarma başarısız' : 'Export failed', description: tr ? 'PNG raporu oluşturulamadı' : 'Failed to generate PNG report', variant: 'destructive' });
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  const generatePDFReport = async () => {
    setIsExporting(true);
    setExportType('pdf');

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      await applyLocalizedPdfFont(pdf, language);
      const pageWidth = pdf.internal.pageSize.getWidth();
      const isProfitable = result.dailyProfit > 0;

      pdf.setFontSize(24);
      pdf.setFont(undefined, 'bold');
      pdf.text(tr ? 'Bitcoin Madencilik Karlılık Raporu' : 'Bitcoin Mining Profitability Report', pageWidth / 2, 25, { align: 'center' });

      pdf.setFontSize(11);
      pdf.setFont(undefined, 'normal');
      pdf.setTextColor(100);
      pdf.text(`${tr ? 'Oluşturuldu:' : 'Generated on'} ${format(new Date(), 'MMMM d, yyyy')}`, pageWidth / 2, 33, { align: 'center' });

      let yPos = 50;
      pdf.setTextColor(0);
      pdf.setFontSize(14);
      pdf.setFont(undefined, 'bold');
      pdf.text(tr ? 'Madencilik Kurulumu' : 'Mining Setup', 20, yPos);
      yPos += 10;

      pdf.setFontSize(10);
      pdf.setFont(undefined, 'normal');
      pdf.text(`${tr ? 'Hash Hızı:' : 'Hash Rate:'} ${params.hashRate} TH/s`, 20, yPos); yPos += 6;
      pdf.text(`${tr ? 'Güç Tüketimi:' : 'Power Consumption:'} ${params.powerConsumption} W`, 20, yPos); yPos += 6;
      pdf.text(`${tr ? 'Elektrik Maliyeti:' : 'Electricity Cost:'} $${params.electricityCost}/kWh`, 20, yPos); yPos += 6;
      pdf.text(`${tr ? 'Havuz Ücreti:' : 'Pool Fee:'} ${params.poolFee}%`, 20, yPos); yPos += 6;
      pdf.text(`${tr ? 'Donanım Maliyeti:' : 'Hardware Cost:'} ${formatCurrency(params.hardwareCost)}`, 20, yPos); yPos += 6;
      pdf.text(`${tr ? 'Bitcoin Fiyatı:' : 'Bitcoin Price:'} ${formatCurrency(params.bitcoinPrice)}`, 20, yPos); yPos += 6;
      pdf.text(`${tr ? 'Zorluk Ayarlaması:' : 'Difficulty Adjustment:'} ${params.difficultyAdjustment}% ${tr ? 'aylık' : 'monthly'}`, 20, yPos);

      yPos += 15;
      pdf.setFontSize(14);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(isProfitable ? 16 : 220, isProfitable ? 185 : 38, isProfitable ? 129 : 38);
      pdf.text(isProfitable ? (tr ? '✓ KARLI' : '✓ PROFITABLE') : (tr ? '✗ KARSIZ' : '✗ UNPROFITABLE'), 20, yPos);

      yPos += 15;
      pdf.setTextColor(0);
      pdf.setFontSize(14);
      pdf.text(tr ? 'Karlılık Sonuçları' : 'Profitability Results', 20, yPos);
      yPos += 10;

      pdf.setFontSize(10);
      pdf.setFont(undefined, 'normal');
      pdf.text(`${tr ? 'Günlük Kâr:' : 'Daily Profit:'} ${formatCurrency(result.dailyProfit)}`, 20, yPos); yPos += 6;
      pdf.text(`${tr ? 'Aylık Kâr:' : 'Monthly Profit:'} ${formatCurrency(result.monthlyProfit)}`, 20, yPos); yPos += 6;
      pdf.text(`${tr ? 'Yıllık Kâr:' : 'Yearly Profit:'} ${formatCurrency(result.yearlyProfit)}`, 20, yPos); yPos += 6;
      pdf.text(`${tr ? 'Günlük Kazılan BTC:' : 'Daily BTC Mined:'} ${result.dailyBtcMined.toFixed(8)} BTC (${(result.dailyBtcMined * 100000000).toFixed(0)} sats)`, 20, yPos); yPos += 6;
      pdf.text(`${tr ? 'Başabaş:' : 'Break-Even:'} ${result.breakEvenDays === Infinity ? (tr ? 'Hiçbir zaman' : 'Never') : `${result.breakEvenDays} ${tr ? 'gün' : 'days'}`}`, 20, yPos); yPos += 6;
      pdf.text(`${tr ? 'Yıllık ROI:' : 'Annual ROI:'} ${result.roiPercentage.toFixed(1)}%`, 20, yPos); yPos += 6;
      pdf.text(`${tr ? 'BTC Başına Maliyet:' : 'Cost per BTC:'} ${formatCurrency(result.costPerBtc)}`, 20, yPos);

      yPos += 15;
      pdf.setFontSize(14);
      pdf.setFont(undefined, 'bold');
      pdf.text(tr ? 'Verimlilik Metrikleri' : 'Efficiency Metrics', 20, yPos);
      yPos += 10;

      pdf.setFontSize(10);
      pdf.setFont(undefined, 'normal');
      pdf.text(`${tr ? 'Hash Maliyet Oranı:' : 'Hash Cost Ratio:'} $${result.hashCostRatio.toFixed(2)}/TH`, 20, yPos); yPos += 6;
      pdf.text(`${tr ? 'Enerji Verimliliği:' : 'Energy Efficiency:'} ${result.energyEfficiency.toFixed(1)} J/TH`, 20, yPos); yPos += 6;
      pdf.text(`${tr ? 'Kar Marjı:' : 'Profit Margin:'} ${result.profitMargin.toFixed(1)}%`, 20, yPos);

      pdf.setFontSize(8);
      pdf.setTextColor(150);
      pdf.text('Report generated by Bitcoin Calculator Tools', pageWidth / 2, 280, { align: 'center' });
      pdf.text(tr ? 'Bu rapor yalnızca bilgilendirme amaçlıdır ve finansal tavsiye niteliği taşımaz.' : 'This report is for informational purposes only and should not be considered financial advice.', pageWidth / 2, 285, { align: 'center' });

      pdf.save(buildExportFilename({ en: 'bitcoin-mining-report', tr: 'bitcoin-madencilik-raporu' }, 'pdf', language));

      toast({ title: tr ? 'Rapor dışa aktarıldı' : 'Report exported', description: tr ? 'Madencilik raporunuz PDF olarak kaydedildi' : 'Your mining report has been saved as PDF' });
    } catch (error) {
      toast({ title: tr ? 'Dışa aktarma başarısız' : 'Export failed', description: tr ? 'PDF raporu oluşturulamadı' : 'Failed to generate PDF report', variant: 'destructive' });
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  const generateShareableLink = async () => {
    const baseUrl = `${window.location.origin}/${tr ? 'tr/hesaplayicilar/madencilik-karlilik' : 'calculators/mining-profitability'}`;
    const urlParams = new URLSearchParams({
      hashRate: params.hashRate.toString(),
      power: params.powerConsumption.toString(),
      electricity: params.electricityCost.toString(),
      poolFee: params.poolFee.toString(),
      hardware: params.hardwareCost.toString(),
      difficulty: params.difficultyAdjustment.toString()
    });

    const shareUrl = `${baseUrl}?${urlParams.toString()}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setLinkCopied(true);
      toast({ title: tr ? 'Bağlantı kopyalandı!' : 'Link copied!', description: tr ? 'Paylaşım bağlantısı panoya kopyalandı' : 'Shareable link copied to clipboard' });
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      // silent
    }
  };

  return (
    <ShareExportPanel
      actions={[
        { kind: 'png', onClick: generatePNGReport, loading: isExporting && exportType === 'png', disabled: isExporting },
        { kind: 'pdf', onClick: generatePDFReport, loading: isExporting && exportType === 'pdf', disabled: isExporting },
        { kind: 'copy-link', onClick: generateShareableLink, copied: linkCopied },
      ]}
    />
  );
});

MiningExportReport.displayName = 'MiningExportReport';
