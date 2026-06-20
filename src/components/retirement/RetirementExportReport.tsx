import React, { useState } from 'react';
import { formatCurrencyAmount } from '@/utils/formatCurrency';
import { ShareExportPanel } from '@/components/share-export';
import { RetirementInputs, RetirementProjection } from '@/pages/BitcoinRetirementCalculator';
import { GoalPlannerInputs } from '@/components/retirement/GoalPlannerInputsPanel';
import { FireModeInputs } from '@/components/retirement/FireModeInputsPanel';
import { FireModeResultsData } from '@/components/retirement/FireModeResults';
import { format } from 'date-fns';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { applyLocalizedPdfFont } from '@/utils/pdfFont';
import { SUPPORTED_CURRENCIES } from '@/services/bitcoinApi';
import { useLanguage } from '@/contexts/LanguageContext';
import { buildExportFilename } from '@/utils/exportFilename';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileText, Image as ImageIcon, FileSpreadsheet, Loader2, ChevronDown } from 'lucide-react';


interface RetirementExportReportProps {
  mode: 'forecaster' | 'planner' | 'fire';
  inputs?: RetirementInputs;
  goalInputs?: GoalPlannerInputs;
  fireInputs?: FireModeInputs;
  projections?: RetirementProjection[];
  goalResults?: any;
  fireResults?: FireModeResultsData | null;
  currentBtcPrice: number;
  /** Inner chart/table tab selection — included in Copy-link share URLs. */
  chartView?: 'chart' | 'table';
}

export const RetirementExportReport = React.memo(({
  mode,
  inputs,
  goalInputs,
  fireInputs,
  projections,
  goalResults,
  fireResults,
  currentBtcPrice,
  chartView,
}: RetirementExportReportProps) => {

  const { language } = useLanguage();
  const tr = language==='tr';
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<'png' | 'pdf' | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  
  const formatCurrency = (amount: number, currency: string) => {
    const locale = tr ? 'tr-TR' : (currency === 'TRY' ? 'tr-TR' : 'en-US');
    return formatCurrencyAmount(amount, currency, { locale, decimals: 2 });
  };

  const generateForecasterPNGReport = async () => {
    if (!inputs || !projections) return;
    
    setIsExporting(true);
    setExportType('png');
    
    try {
      const reportElement = document.createElement('div');
      reportElement.className = 'p-8 bg-card text-card-foreground max-w-4xl mx-auto';
      
      const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
      const totalContributions = inputs.monthlyContribution * yearsToRetirement * 12;
      const currentPortfolioValue = inputs.currentBtcHoldings * currentBtcPrice;
      
      reportElement.innerHTML = `
        <div class="space-y-8">
          <div class="text-center border-b border-gray-200 pb-6">
            <h1 class="text-3xl font-bold mb-2 text-gray-900">${tr?'Bitcoin Emeklilik Tahmin Raporu':'Bitcoin Retirement Forecast Report'}</h1>
            <p class="text-gray-600">${tr?'Oluşturulma tarihi':'Generated on'} ${format(new Date(), 'MMMM d, yyyy')}</p>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-3">
              <h2 class="text-xl font-semibold text-gray-900">${tr?'Emeklilik Planı':'Retirement Plan'}</h2>
              <div class="space-y-2 text-sm">
                <p><strong>${tr?'Mevcut yaş:':'Current Age:'}</strong> ${inputs.currentAge} ${tr?'yıl':'years'}</p>
                <p><strong>${tr?'Emeklilik yaşı:':'Retirement Age:'}</strong> ${inputs.retirementAge} ${tr?'yıl':'years'}</p>
                <p><strong>${tr?'Emekliliğe kalan yıl:':'Years to Retirement:'}</strong> ${yearsToRetirement} ${tr?'yıl':'years'}</p>
                <p><strong>${tr?'Çekim stratejisi:':'Withdrawal Strategy:'}</strong> ${inputs.mode === 'conservative' ? (tr?'Temkinli (Hepsini Sat)':'Conservative (Sell All)') : (tr?'Optimize (Tut ve Çek)':'Optimized (Hold & Withdraw)')}</p>
                <p><strong>${tr?'Para birimi:':'Currency:'}</strong> ${inputs.currency}</p>
              </div>
            </div>
            
            <div class="space-y-3">
              <h2 class="text-xl font-semibold text-gray-900">${tr?'Yatırım Detayları':'Investment Details'}</h2>
              <div class="space-y-2 text-sm">
                <p><strong>${tr?'Mevcut BTC varlığı:':'Current BTC Holdings:'}</strong> ${inputs.currentBtcHoldings} BTC</p>
                <p><strong>${tr?'Mevcut portföy değeri:':'Current Portfolio Value:'}</strong> ${formatCurrency(currentPortfolioValue, inputs.currency)}</p>
                <p><strong>${tr?'Aylık katkı:':'Monthly Contribution:'}</strong> ${formatCurrency(inputs.monthlyContribution, inputs.currency)}</p>
                <p><strong>${tr?'Toplam katkı:':'Total Contributions:'}</strong> ${formatCurrency(totalContributions, inputs.currency)}</p>
                <p><strong>${tr?'Beklenen büyüme oranı:':'Expected Growth Rate:'}</strong> ${inputs.expectedGrowthRate}% ${tr?'yıllık':'annually'}</p>
                <p><strong>${tr?'Enflasyon oranı:':'Inflation Rate:'}</strong> ${inputs.inflationRate}% ${tr?'yıllık':'annually'}</p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4 py-6 border-t border-b border-gray-200">
            <div class="text-center">
              <div class="text-2xl font-bold text-orange-600">${projections.length}</div>
              <div class="text-sm text-gray-600">${tr?'Emeklilik yılı':'Years of Retirement'}</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-success">
                ${formatCurrency(projections[0]?.annualBudget || 0, inputs.currency)}
              </div>
              <div class="text-sm text-gray-600">${tr?'Yıllık bütçe (1. yıl)':'Annual Budget (Year 1)'}</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-600">${inputs.expectedGrowthRate}%</div>
              <div class="text-sm text-gray-600">${tr?'Büyüme varsayımı':'Growth Assumption'}</div>
            </div>
          </div>

          <div class="text-center text-xs text-gray-500 pt-6">
            <p>${tr?'Bitcoin Calculator Tools tarafından oluşturuldu • Emeklilik Planlama Aracı':'Report generated by Bitcoin Calculator Tools • Retirement Planning Tool'}</p>
            <p>${tr?'Bu rapor yalnızca bilgilendirme amaçlıdır ve finansal tavsiye olarak değerlendirilmemelidir.':'This report is for informational purposes only and should not be considered financial advice.'}</p>
          </div>
        </div>
      `;
      
      document.body.appendChild(reportElement);
      const canvas = await html2canvas(reportElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      const link = document.createElement('a');
      link.download = buildExportFilename({ en: 'bitcoin-retirement-forecast', tr: 'bitcoin-emeklilik-tahmini' }, 'png', language);
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      document.body.removeChild(reportElement);
      
    } catch (error) {
      console.error('PNG export failed:', error);
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  const generatePlannerPNGReport = async () => {
    if (!goalInputs || !goalResults) return;
    
    setIsExporting(true);
    setExportType('png');
    
    try {
      const reportElement = document.createElement('div');
      reportElement.className = 'p-8 bg-card text-card-foreground max-w-4xl mx-auto';
      
      const yearsToRetirement = goalInputs.desiredRetirementAge - goalInputs.currentAge;
      const currentPortfolioValue = goalInputs.currentBtcHoldings * currentBtcPrice;
      
      reportElement.innerHTML = `
        <div class="space-y-8">
          <div class="text-center border-b border-gray-200 pb-6">
            <h1 class="text-3xl font-bold mb-2 text-gray-900">${tr?'Bitcoin Emeklilik Hedef Planlayıcı Raporu':'Bitcoin Retirement Goal Planner Report'}</h1>
            <p class="text-gray-600">${tr?'Oluşturulma tarihi':'Generated on'} ${format(new Date(), 'MMMM d, yyyy')}</p>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-3">
              <h2 class="text-xl font-semibold text-gray-900">${tr?'Emeklilik Hedefi':'Retirement Goal'}</h2>
              <div class="space-y-2 text-sm">
                <p><strong>${tr?'Mevcut yaş:':'Current Age:'}</strong> ${goalInputs.currentAge} ${tr?'yıl':'years'}</p>
                <p><strong>${tr?'İstenen emeklilik yaşı:':'Desired Retirement Age:'}</strong> ${goalInputs.desiredRetirementAge} ${tr?'yıl':'years'}</p>
                <p><strong>${tr?'Emekliliğe kalan yıl:':'Years to Retirement:'}</strong> ${yearsToRetirement} ${tr?'yıl':'years'}</p>
                <p><strong>${tr?'İstenen yıllık bütçe:':'Desired Annual Budget:'}</strong> ${formatCurrency(goalInputs.desiredAnnualBudget, goalInputs.currency)}</p>
                <p><strong>${tr?'Para birimi:':'Currency:'}</strong> ${goalInputs.currency}</p>
              </div>
            </div>
            
            <div class="space-y-3">
              <h2 class="text-xl font-semibold text-gray-900">${tr?'Yatırım Gereksinimleri':'Investment Requirements'}</h2>
              <div class="space-y-2 text-sm">
                <p><strong>${tr?'Mevcut BTC varlığı:':'Current BTC Holdings:'}</strong> ${goalInputs.currentBtcHoldings} BTC</p>
                <p><strong>${tr?'Mevcut portföy değeri:':'Current Portfolio Value:'}</strong> ${formatCurrency(currentPortfolioValue, goalInputs.currency)}</p>
                <p><strong>${tr?'Gerekli aylık yatırım:':'Required Monthly Investment:'}</strong> ${formatCurrency(goalResults.requiredMonthlyInvestment, goalInputs.currency)}</p>
                <p><strong>${tr?'Gerekli toplam BTC:':'Total BTC Needed:'}</strong> ${goalResults.totalBtcNeededAtRetirement.toFixed(4)} BTC</p>
                <p><strong>${tr?'Beklenen büyüme oranı:':'Expected Growth Rate:'}</strong> ${goalInputs.expectedGrowthRate}% ${tr?'yıllık':'annually'}</p>
                <p><strong>${tr?'Enflasyon oranı:':'Inflation Rate:'}</strong> ${goalInputs.inflationRate}% ${tr?'yıllık':'annually'}</p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4 py-6 border-t border-b border-gray-200">
            <div class="text-center">
              <div class="text-2xl font-bold ${goalResults.feasible ? 'text-success' : 'text-destructive'}">
                ${goalResults.feasible ? (tr?'✓ Ulaşılabilir':'✓ Feasible') : (tr?'⚠ Zorlu':'⚠ Challenging')}
              </div>
              <div class="text-sm text-gray-600">${tr?'Hedef değerlendirmesi':'Goal Assessment'}</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-600">
                ${formatCurrency(goalResults.requiredMonthlyInvestment, goalInputs.currency)}
              </div>
              <div class="text-sm text-gray-600">${tr?'Aylık yatırım':'Monthly Investment'}</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-orange-600">${yearsToRetirement}</div>
              <div class="text-sm text-gray-600">${tr?'Hedefe kalan yıl':'Years to Goal'}</div>
            </div>
          </div>

          <div class="text-center text-xs text-gray-500 pt-6">
            <p>${tr?'Bitcoin Calculator Tools tarafından oluşturuldu • Hedef Planlama Aracı':'Report generated by Bitcoin Calculator Tools • Goal Planner Tool'}</p>
            <p>${tr?'Bu rapor yalnızca bilgilendirme amaçlıdır ve finansal tavsiye olarak değerlendirilmemelidir.':'This report is for informational purposes only and should not be considered financial advice.'}</p>
          </div>
        </div>
      `;
      
      document.body.appendChild(reportElement);
      const canvas = await html2canvas(reportElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      const link = document.createElement('a');
      link.download = buildExportFilename({ en: 'bitcoin-retirement-goal-plan', tr: 'bitcoin-emeklilik-hedef-plani' }, 'png', language);
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      document.body.removeChild(reportElement);
      
    } catch (error) {
      console.error('PNG export failed:', error);
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
      
      if (mode === 'forecaster' && inputs) {
        // Forecaster PDF logic
        pdf.setFontSize(24);
        pdf.setFont(undefined, 'bold');
        pdf.text(tr?'Bitcoin Emeklilik Tahmin Raporu':'Bitcoin Retirement Forecast Report', pageWidth / 2, 30, { align: 'center' });
        
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'normal');
        pdf.text(tr?`${format(new Date(), 'MMMM d, yyyy')} tarihinde oluşturuldu`:`Generated on ${format(new Date(), 'MMMM d, yyyy')}`, pageWidth / 2, 40, { align: 'center' });
        
        let yPos = 65;
        const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
        
        pdf.setFontSize(16);
        pdf.setFont(undefined, 'bold');
        pdf.text(tr?'Emeklilik planı detayları':'Retirement Plan Details', 20, yPos);
        yPos += 15;
        
        pdf.setFontSize(11);
        pdf.setFont(undefined, 'normal');
        pdf.text(`${tr?'Mevcut yaş:':'Current Age:'} ${inputs.currentAge} ${tr?'yıl':'years'}`, 20, yPos); yPos += 7;
        pdf.text(`${tr?'Emeklilik yaşı:':'Retirement Age:'} ${inputs.retirementAge} ${tr?'yıl':'years'}`, 20, yPos); yPos += 7;
        pdf.text(`${tr?'Emekliliğe kalan yıl:':'Years to Retirement:'} ${yearsToRetirement} ${tr?'yıl':'years'}`, 20, yPos); yPos += 7;
        pdf.text(`${tr?'Aylık katkı:':'Monthly Contribution:'} ${formatCurrency(inputs.monthlyContribution, inputs.currency)}`, 20, yPos); yPos += 7;
        pdf.text(`${tr?'Beklenen büyüme oranı:':'Expected Growth Rate:'} ${inputs.expectedGrowthRate}% ${tr?'yıllık':'annually'}`, 20, yPos); yPos += 7;
        
      } else if (mode === 'planner' && goalInputs && goalResults) {
        // Goal Planner PDF logic
        pdf.setFontSize(24);
        pdf.setFont(undefined, 'bold');
        pdf.text(tr?'Bitcoin Emeklilik Hedef Plan Raporu':'Bitcoin Retirement Goal Plan Report', pageWidth / 2, 30, { align: 'center' });
        
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'normal');
        pdf.text(tr?`${format(new Date(), 'MMMM d, yyyy')} tarihinde oluşturuldu`:`Generated on ${format(new Date(), 'MMMM d, yyyy')}`, pageWidth / 2, 40, { align: 'center' });
        
        let yPos = 65;
        const yearsToRetirement = goalInputs.desiredRetirementAge - goalInputs.currentAge;
        
        pdf.setFontSize(16);
        pdf.setFont(undefined, 'bold');
        pdf.text(tr?'Hedef planlama detayları':'Goal Planning Details', 20, yPos);
        yPos += 15;
        
        pdf.setFontSize(11);
        pdf.setFont(undefined, 'normal');
        pdf.text(`${tr?'İstenen emeklilik yaşı:':'Desired Retirement Age:'} ${goalInputs.desiredRetirementAge} ${tr?'yıl':'years'}`, 20, yPos); yPos += 7;
        pdf.text(`${tr?'İstenen yıllık bütçe:':'Desired Annual Budget:'} ${formatCurrency(goalInputs.desiredAnnualBudget, goalInputs.currency)}`, 20, yPos); yPos += 7;
        pdf.text(`${tr?'Gerekli aylık yatırım:':'Required Monthly Investment:'} ${formatCurrency(goalResults.requiredMonthlyInvestment, goalInputs.currency)}`, 20, yPos); yPos += 7;
        pdf.text(`${tr?'Gerekli toplam BTC:':'Total BTC Needed:'} ${goalResults.totalBtcNeededAtRetirement.toFixed(4)} BTC`, 20, yPos); yPos += 7;
      } else if (mode === 'fire' && fireInputs && fireResults) {
        // FIRE PDF logic
        pdf.setFontSize(24);
        pdf.setFont(undefined, 'bold');
        pdf.text(tr ? 'Bitcoin FIRE Raporu' : 'Bitcoin FIRE Report', pageWidth / 2, 30, { align: 'center' });

        pdf.setFontSize(12);
        pdf.setFont(undefined, 'normal');
        pdf.text(tr ? `${format(new Date(), 'MMMM d, yyyy')} tarihinde oluşturuldu` : `Generated on ${format(new Date(), 'MMMM d, yyyy')}`, pageWidth / 2, 40, { align: 'center' });

        let yPos = 65;
        pdf.setFontSize(16);
        pdf.setFont(undefined, 'bold');
        pdf.text(tr ? 'FIRE Parametreleri' : 'FIRE Parameters', 20, yPos);
        yPos += 12;

        pdf.setFontSize(11);
        pdf.setFont(undefined, 'normal');
        pdf.text(`${tr ? 'Mevcut yaş:' : 'Current Age:'} ${fireInputs.currentAge}`, 20, yPos); yPos += 7;
        pdf.text(`${tr ? 'Mevcut BTC:' : 'Current BTC:'} ${fireInputs.currentBtcHoldings} BTC`, 20, yPos); yPos += 7;
        pdf.text(`${tr ? 'Aylık DCA:' : 'Monthly DCA:'} ${formatCurrency(fireInputs.monthlyContribution, fireInputs.currency)}`, 20, yPos); yPos += 7;
        pdf.text(`${tr ? 'Yıllık gider:' : 'Annual Expenses:'} ${formatCurrency(fireInputs.annualExpenses, fireInputs.currency)}`, 20, yPos); yPos += 7;
        pdf.text(`${tr ? 'Çekim oranı:' : 'Withdrawal Rate:'} ${fireInputs.withdrawalRate}%`, 20, yPos); yPos += 7;
        pdf.text(`${tr ? 'FIRE hedefi:' : 'FIRE Target:'} ${formatCurrency(fireResults.fireTarget, fireInputs.currency)}`, 20, yPos); yPos += 12;

        pdf.setFontSize(14);
        pdf.setFont(undefined, 'bold');
        pdf.text(tr ? 'Senaryolar' : 'Scenarios', 20, yPos); yPos += 9;
        pdf.setFontSize(10);
        pdf.setFont(undefined, 'normal');
        fireResults.scenarios.forEach((s) => {
          pdf.text(
            `${s.label}  ${s.growthRate}%  ${tr ? 'yaş' : 'age'} ${s.fireAge}  ${s.yearsToFire}y  ${formatCurrency(s.portfolioValueAtFire, fireInputs.currency)}`,
            20,
            yPos,
          );
          yPos += 6;
        });
      }

      const fileName =
        mode === 'forecaster'
          ? buildExportFilename({ en: 'bitcoin-retirement-forecast', tr: 'bitcoin-emeklilik-tahmini' }, 'pdf', language)
          : mode === 'planner'
          ? buildExportFilename({ en: 'bitcoin-retirement-goal-plan', tr: 'bitcoin-emeklilik-hedef-plani' }, 'pdf', language)
          : buildExportFilename({ en: 'bitcoin-fire-report', tr: 'bitcoin-fire-raporu' }, 'pdf', language);

      pdf.save(fileName);

    } catch (error) {
      console.error('PDF export failed:', error);
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  const generateShareableLink = async () => {
    const baseUrl = `${window.location.origin}/calculators/retirement`;
    const params = new URLSearchParams();

    if (mode === 'forecaster' && inputs) {
      params.set('tab', 'forecaster');
      params.set('currentAge', inputs.currentAge.toString());
      params.set('retirementAge', inputs.retirementAge.toString());
      params.set('currentBtcHoldings', inputs.currentBtcHoldings.toString());
      params.set('monthlyContribution', inputs.monthlyContribution.toString());
      params.set('expectedGrowthRate', inputs.expectedGrowthRate.toString());
      params.set('inflationRate', inputs.inflationRate.toString());
      params.set('mode', inputs.mode);
      params.set('currency', inputs.currency);
    } else if (mode === 'planner' && goalInputs) {
      params.set('tab', 'planner');
      params.set('currentAge', goalInputs.currentAge.toString());
      params.set('desiredRetirementAge', goalInputs.desiredRetirementAge.toString());
      params.set('desiredAnnualBudget', goalInputs.desiredAnnualBudget.toString());
      params.set('currentBtcHoldings', goalInputs.currentBtcHoldings.toString());
      params.set('expectedGrowthRate', goalInputs.expectedGrowthRate.toString());
      params.set('inflationRate', goalInputs.inflationRate.toString());
      params.set('currency', goalInputs.currency);
    } else if (mode === 'fire' && fireInputs) {
      params.set('tab', 'fire');
      params.set('currentAge', fireInputs.currentAge.toString());
      params.set('currentBtcHoldings', fireInputs.currentBtcHoldings.toString());
      params.set('monthlyContribution', fireInputs.monthlyContribution.toString());
      params.set('annualExpenses', fireInputs.annualExpenses.toString());
      params.set('withdrawalRate', fireInputs.withdrawalRate.toString());
      params.set('currency', fireInputs.currency);
    }

    const shareUrl = `${baseUrl}?${params.toString()}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setLinkCopied(true);
      window.setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      console.log('Shareable link:', shareUrl);
    }
  };

  const handlePNGExport = () => {
    if (mode === 'forecaster') {
      generateForecasterPNGReport();
    } else if (mode === 'planner') {
      generatePlannerPNGReport();
    } else {
      // FIRE: reuse PDF as the visual export to preserve parity
      generatePDFReport();
    }
  };

  const generateCSV = () => {
    let headers: string[] = [];
    let rows: (string | number)[][] = [];
    let nameKey: { en: string; tr: string } = { en: 'bitcoin-retirement-projections', tr: 'bitcoin-emeklilik-projeksiyonlari' };

    if (mode === 'forecaster') {
      if (!projections || projections.length === 0) return;
      headers = tr
        ? ['Yıl', 'Yaş', 'Bitcoin Varlıkları', 'BTC Fiyatı', 'Portföy Değeri', 'Yıllık Bütçe', 'Aylık Bütçe']
        : ['Year', 'Age', 'Bitcoin Holdings', 'BTC Price', 'Portfolio Value', 'Annual Budget', 'Monthly Budget'];
      rows = projections.map(p => [
        p.year, p.age,
        p.btcHoldings.toFixed(4), p.btcPrice.toFixed(0),
        p.fiatValue.toFixed(0), p.annualBudget.toFixed(0), p.monthlyBudget.toFixed(0),
      ]);
    } else if (mode === 'planner' && goalInputs && goalResults) {
      nameKey = { en: 'bitcoin-retirement-goal-plan', tr: 'bitcoin-emeklilik-hedef-plani' };
      headers = tr ? ['Metrik', 'Değer'] : ['Metric', 'Value'];
      const currentPortfolio = goalInputs.currentBtcHoldings * currentBtcPrice;
      rows = [
        [tr ? 'Mevcut yaş' : 'Current Age', goalInputs.currentAge],
        [tr ? 'Hedef emeklilik yaşı' : 'Desired Retirement Age', goalInputs.desiredRetirementAge],
        [tr ? 'İstenen yıllık bütçe' : 'Desired Annual Budget', goalInputs.desiredAnnualBudget],
        [tr ? 'Mevcut portföy' : 'Current Portfolio', currentPortfolio.toFixed(0)],
        [tr ? 'Gerekli aylık yatırım' : 'Required Monthly Investment', goalResults.requiredMonthlyInvestment.toFixed(0)],
        [tr ? 'Gerekli toplam BTC' : 'Total BTC Needed', goalResults.totalBtcNeededAtRetirement.toFixed(4)],
        [tr ? 'Toplam yatırım' : 'Total Investment', goalResults.totalInvestmentRequired.toFixed(0)],
        [tr ? 'Beklenen büyüme (%)' : 'Expected Growth (%)', goalInputs.expectedGrowthRate],
        [tr ? 'Enflasyon (%)' : 'Inflation (%)', goalInputs.inflationRate],
        [tr ? 'Para birimi' : 'Currency', goalInputs.currency],
        [tr ? 'Ulaşılabilir' : 'Feasible', goalResults.feasible ? (tr ? 'Evet' : 'Yes') : (tr ? 'Hayır' : 'No')],
      ];
    } else if (mode === 'fire' && fireInputs && fireResults) {
      nameKey = { en: 'bitcoin-fire-scenarios', tr: 'bitcoin-fire-senaryolari' };
      headers = tr
        ? ['Senaryo', 'Büyüme %', 'FIRE Yaşı', 'Yıl', 'Portföy', "FIRE'da BTC", 'Aylık BTC Çekim']
        : ['Scenario', 'Growth %', 'FIRE Age', 'Years', 'Portfolio', 'BTC at FIRE', 'Monthly BTC Withdrawal'];
      rows = fireResults.scenarios.map(s => [
        s.label, s.growthRate, s.fireAge, s.yearsToFire,
        s.portfolioValueAtFire.toFixed(0),
        s.totalBtcAtFire.toFixed(4),
        s.monthlyBtcWithdrawal.toFixed(6),
      ]);
    } else {
      return;
    }

    const escape = (cell: string | number) => {
      const s = String(cell);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const csv = [headers.map(escape).join(','), ...rows.map(r => r.map(escape).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = buildExportFilename(nameKey, 'csv', language);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const canCsv =
    (mode === 'forecaster' && !!projections && projections.length > 0) ||
    (mode === 'planner' && !!goalInputs && !!goalResults) ||
    (mode === 'fire' && !!fireInputs && !!fireResults);

  return (
    <div className="flex flex-wrap items-center gap-2 py-2" data-testid="retirement-export-controls">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={isExporting}
            aria-label={tr ? 'Dışa aktar' : 'Export'}
            className="h-9 gap-2"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {tr ? 'Dışa Aktar' : 'Export'}
            <ChevronDown className="w-3.5 h-3.5 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {canCsv && (
            <DropdownMenuItem onSelect={generateCSV} className="gap-2">
              <FileSpreadsheet className="w-4 h-4" />
              {tr ? 'CSV İndir' : 'Download CSV'}
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onSelect={generatePDFReport} className="gap-2">
            <FileText className="w-4 h-4" />
            {tr ? 'PDF Raporu' : 'PDF Report'}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handlePNGExport} className="gap-2">
            <ImageIcon className="w-4 h-4" />
            {tr ? 'PNG Görsel' : 'PNG Image'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ShareExportPanel
        variant="inline"
        actions={[
          { kind: 'copy-link', onClick: generateShareableLink, copied: linkCopied },
        ]}
      />
    </div>
  );
});


RetirementExportReport.displayName = 'RetirementExportReport';