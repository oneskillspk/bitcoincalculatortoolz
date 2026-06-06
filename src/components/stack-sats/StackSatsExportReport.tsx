import { ShareExportPanel } from '@/components/share-export';
import { StackSatsResult } from '@/services/stackSatsCalculator';
import jsPDF from 'jspdf';
import { applyLocalizedPdfFont } from '@/utils/pdfFont';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';
import { buildExportFilename } from '@/utils/exportFilename';

interface StackSatsExportReportProps {
  results: StackSatsResult | null;
  currency: string;
  currentBtcHoldings: number;
  targetBtcGoal: number;
  monthlyContribution: number;
  expectedGrowthRate: number;
}

export const StackSatsExportReport = ({ results, currency, currentBtcHoldings, targetBtcGoal, monthlyContribution, expectedGrowthRate }: StackSatsExportReportProps) => {
  const { language } = useLanguage();
  const tr = language==='tr';
  const handleExport = async () => {
    if (!results) return;
    const pdf = new jsPDF();
    await applyLocalizedPdfFont(pdf, language);
    const pageWidth = pdf.internal.pageSize.getWidth();
    let yPos = 20;

    pdf.setFontSize(22);
    pdf.setTextColor(247, 147, 26);
    pdf.text(tr ? 'Stack Sats Hedef Raporu' : 'Stack Sats Goal Report', pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`${tr ? 'Oluşturulma tarihi' : 'Generated'}: ${format(new Date(), 'PPP')}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 20;

    pdf.setFontSize(16); pdf.setTextColor(0, 0, 0); pdf.text(tr ? 'Hedefiniz' : 'Your Goal', 20, yPos); yPos += 10;
    pdf.setFontSize(11); pdf.setTextColor(60, 60, 60);
    pdf.text(`${tr ? 'Mevcut Bakiyeniz:' : 'Current Holdings:'} ${currentBtcHoldings.toFixed(8)} BTC`, 20, yPos); yPos += 7;
    pdf.text(`${tr ? 'Hedef:' : 'Target Goal:'} ${targetBtcGoal.toFixed(8)} BTC`, 20, yPos); yPos += 7;
    pdf.text(`${tr ? 'Aylık Katkı:' : 'Monthly Contribution:'} ${monthlyContribution.toLocaleString()} ${currency}`, 20, yPos); yPos += 7;
    pdf.text(`${tr ? 'Beklenen Büyüme Oranı:' : 'Expected Growth Rate:'} ${expectedGrowthRate}% ${tr ? 'yıllık' : 'annually'}`, 20, yPos); yPos += 15;

    pdf.setFontSize(16); pdf.setTextColor(0, 0, 0); pdf.text(tr ? 'Hedef Zaman Çizelgesi' : 'Timeline to Goal', 20, yPos); yPos += 10;
    pdf.setFontSize(11); pdf.setTextColor(60, 60, 60);
    pdf.text(`${tr ? 'Hedefe Kalan Süre:' : 'Time to Goal:'} ${results.yearsToGoal} ${tr ? 'yıl' : 'years'} (${results.monthsToGoal} ${tr ? 'ay' : 'months'})`, 20, yPos); yPos += 7;
    pdf.text(`${tr ? 'Tamamlanma Tarihi:' : 'Completion Date:'} ${format(results.projectedCompletionDate, 'PPP')}`, 20, yPos); yPos += 7;
    pdf.text(`${tr ? 'Toplam Yatırım:' : 'Total Investment:'} ${results.totalFiatInvested.toLocaleString()} ${currency}`, 20, yPos); yPos += 7;
    pdf.text(`${tr ? 'Ort. Alış Fiyatı:' : 'Average Buy Price:'} ${results.averageBuyPrice.toLocaleString()} ${currency}`, 20, yPos); yPos += 7;
    pdf.text(`${tr ? 'İlerleme:' : 'Progress:'} ${results.currentProgress.toFixed(1)}%`, 20, yPos); yPos += 15;

    pdf.setFontSize(16); pdf.setTextColor(0, 0, 0); pdf.text(tr ? 'Önemli Kilometre Taşları' : 'Key Milestones', 20, yPos); yPos += 10;
    pdf.setFontSize(11); pdf.setTextColor(60, 60, 60);
    results.progressMilestones.forEach((milestone) => { if (yPos > 260) { pdf.addPage(); yPos = 20; } pdf.text(`${milestone.percentage}% - ${milestone.btcAmount.toFixed(8)} BTC ${tr ? 'için' : 'by'} ${format(milestone.estimatedDate, 'MMM yyyy')}`, 20, yPos); yPos += 7; });
    yPos += 10;

    if (yPos > 240) { pdf.addPage(); yPos = 20; }
    pdf.setFontSize(16); pdf.setTextColor(0, 0, 0); pdf.text(tr ? 'Alternatif Senaryolar' : 'Alternative Scenarios', 20, yPos); yPos += 10;
    pdf.setFontSize(11); pdf.setTextColor(60, 60, 60);
    pdf.text(`${tr ? 'Muhafazakar' : 'Conservative'} (10%): ${results.alternativeScenarios.conservative.months} ${tr ? 'ay' : 'months'}, ${results.alternativeScenarios.conservative.totalInvested.toLocaleString()} ${currency}`, 20, yPos); yPos += 7;
    pdf.text(`${tr ? 'Orta' : 'Moderate'} (15%): ${results.alternativeScenarios.moderate.months} ${tr ? 'ay' : 'months'}, ${results.alternativeScenarios.moderate.totalInvested.toLocaleString()} ${currency}`, 20, yPos); yPos += 7;
    pdf.text(`${tr ? 'İyimser' : 'Optimistic'} (25%): ${results.alternativeScenarios.optimistic.months} ${tr ? 'ay' : 'months'}, ${results.alternativeScenarios.optimistic.totalInvested.toLocaleString()} ${currency}`, 20, yPos);

    yPos += 20;
    if (yPos > 260) { pdf.addPage(); yPos = 20; }
    pdf.setFontSize(9); pdf.setTextColor(150, 150, 150);
    pdf.text(tr ? 'Uyarı: Bu rapor yalnızca eğitim amaçlıdır. Geçmiş performans gelecekteki sonuçları garanti etmez.' : 'Disclaimer: This report is for educational purposes only. Past performance does not guarantee future results.', pageWidth / 2, yPos, { align: 'center', maxWidth: pageWidth - 40 });
    yPos += 5;
    pdf.text(tr ? 'Bitcoin Calculator Tools tarafından oluşturuldu - bitcoincalculator.tools' : 'Generated by Bitcoin Calculator Tools - bitcoincalculator.tools', pageWidth / 2, yPos + 5, { align: 'center' });
    pdf.save(buildExportFilename({ en: 'stack-sats-goal-report', tr: 'satoshi-hedef-raporu' }, 'pdf', language));
  };

  return <ShareExportPanel actions={[{ kind: 'pdf', onClick: handleExport, disabled: !results }]} />;
};