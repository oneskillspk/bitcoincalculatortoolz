import React, { useState } from 'react';
import { formatCurrencyAmount } from '@/utils/formatCurrency';
import { ShareExportPanel, downloadStandardPdf } from '@/components/share-export';
import type { PdfReportSection } from '@/components/share-export/exporters/pdfReport';
import { RetirementInputs, RetirementProjection } from '@/pages/BitcoinRetirementCalculator';
import { GoalPlannerInputs } from '@/components/retirement/GoalPlannerInputsPanel';
import { FireModeInputs } from '@/components/retirement/FireModeInputsPanel';
import { FireModeResultsData } from '@/components/retirement/FireModeResults';
import { SUPPORTED_CURRENCIES } from '@/services/bitcoinApi';
import { useLanguage } from '@/contexts/LanguageContext';
import { buildExportFilename } from '@/utils/exportFilename';

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

const safeCurrency = (currency: unknown): string => {
  const code = typeof currency === 'string' ? currency.toUpperCase() : '';
  return SUPPORTED_CURRENCIES.some((c) => c.code === code) ? code : 'USD';
};

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
  const tr = language === 'tr';
  const [busy, setBusy] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const formatCurrency = (amount: number, currency: string) => {
    const code = safeCurrency(currency);
    const locale = tr ? 'tr-TR' : (code === 'TRY' ? 'tr-TR' : 'en-US');
    return formatCurrencyAmount(amount, code, { locale, decimals: 2 });
  };

  const generatePDFReport = async () => {
    setBusy(true);
    try {
      if (mode === 'forecaster' && inputs && projections) {
        const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
        const totalContributions = inputs.monthlyContribution * yearsToRetirement * 12;
        const currentPortfolioValue = inputs.currentBtcHoldings * currentBtcPrice;
        const firstYearBudget = projections[0]?.annualBudget ?? 0;

        const sections: PdfReportSection[] = [
          {
            heading: tr ? 'Emeklilik Planı' : 'Retirement Plan',
            rows: [
              [tr ? 'Mevcut yaş' : 'Current Age', `${inputs.currentAge}`],
              [tr ? 'Emeklilik yaşı' : 'Retirement Age', `${inputs.retirementAge}`],
              [tr ? 'Emekliliğe kalan yıl' : 'Years to Retirement', `${yearsToRetirement}`],
              [
                tr ? 'Çekim stratejisi' : 'Withdrawal Strategy',
                inputs.mode === 'conservative'
                  ? (tr ? 'Temkinli (Hepsini Sat)' : 'Conservative (Sell All)')
                  : (tr ? 'Optimize (Tut ve Çek)' : 'Optimized (Hold & Withdraw)'),
              ],
              [tr ? 'Para birimi' : 'Currency', safeCurrency(inputs.currency)],
            ],
          },
          {
            heading: tr ? 'Yatırım Detayları' : 'Investment Details',
            rows: [
              [tr ? 'Mevcut BTC varlığı' : 'Current BTC Holdings', `${inputs.currentBtcHoldings} BTC`],
              [tr ? 'Mevcut portföy değeri' : 'Current Portfolio Value', formatCurrency(currentPortfolioValue, inputs.currency)],
              [tr ? 'Aylık katkı' : 'Monthly Contribution', formatCurrency(inputs.monthlyContribution, inputs.currency)],
              [tr ? 'Toplam katkı' : 'Total Contributions', formatCurrency(totalContributions, inputs.currency)],
              [tr ? 'Beklenen büyüme' : 'Expected Growth Rate', `${inputs.expectedGrowthRate}%`],
              [tr ? 'Enflasyon' : 'Inflation Rate', `${inputs.inflationRate}%`],
            ],
          },
          {
            kind: 'table',
            heading: tr ? 'Yıl Yıl Projeksiyon' : 'Year-by-Year Projection',
            columns: tr
              ? ['Yıl', 'Yaş', 'BTC', 'Portföy', 'Yıllık Bütçe']
              : ['Year', 'Age', 'BTC', 'Portfolio', 'Annual Budget'],
            rows: projections.map((p) => [
              String(p.year),
              String(p.age),
              p.btcHoldings.toFixed(4),
              formatCurrency(p.fiatValue, inputs.currency),
              formatCurrency(p.annualBudget, inputs.currency),
            ]),
          },
        ];

        await downloadStandardPdf({
          title: tr ? 'Bitcoin Emeklilik Tahmin Raporu' : 'Bitcoin Retirement Forecast Report',
          subtitle: tr
            ? `${yearsToRetirement} yıl birikim · ${projections.length} yıl emeklilik`
            : `${yearsToRetirement}-year accumulation · ${projections.length}-year retirement`,
          language,
          filename: { en: 'bitcoin-retirement-forecast', tr: 'bitcoin-emeklilik-tahmini' },
          canonicalUrl: 'bitcoincalculator.tools/calculators/retirement',
          headline: {
            label: tr ? '1. Yıl Yıllık Bütçe' : 'Year 1 Annual Budget',
            value: formatCurrency(firstYearBudget, inputs.currency),
            accent: 'ember',
          },
          metaRows: [`${tr ? 'BTC Fiyatı' : 'BTC Price'}: ${formatCurrency(currentBtcPrice, inputs.currency)}`],
          sections,
        });
      } else if (mode === 'planner' && goalInputs && goalResults) {
        const yearsToRetirement = goalInputs.desiredRetirementAge - goalInputs.currentAge;
        const currentPortfolioValue = goalInputs.currentBtcHoldings * currentBtcPrice;

        await downloadStandardPdf({
          title: tr ? 'Bitcoin Emeklilik Hedef Planı' : 'Bitcoin Retirement Goal Plan',
          subtitle: goalResults.feasible
            ? (tr ? 'Hedef ulaşılabilir' : 'Goal is feasible')
            : (tr ? 'Hedef zorlu' : 'Goal is challenging'),
          language,
          filename: { en: 'bitcoin-retirement-goal-plan', tr: 'bitcoin-emeklilik-hedef-plani' },
          canonicalUrl: 'bitcoincalculator.tools/calculators/retirement',
          headline: {
            label: tr ? 'Gerekli Aylık Yatırım' : 'Required Monthly Investment',
            value: formatCurrency(goalResults.requiredMonthlyInvestment, goalInputs.currency),
            accent: goalResults.feasible ? 'success' : 'danger',
          },
          metaRows: [`${tr ? 'BTC Fiyatı' : 'BTC Price'}: ${formatCurrency(currentBtcPrice, goalInputs.currency)}`],
          sections: [
            {
              heading: tr ? 'Emeklilik Hedefi' : 'Retirement Goal',
              rows: [
                [tr ? 'Mevcut yaş' : 'Current Age', `${goalInputs.currentAge}`],
                [tr ? 'Hedef emeklilik yaşı' : 'Desired Retirement Age', `${goalInputs.desiredRetirementAge}`],
                [tr ? 'Emekliliğe kalan yıl' : 'Years to Retirement', `${yearsToRetirement}`],
                [tr ? 'İstenen yıllık bütçe' : 'Desired Annual Budget', formatCurrency(goalInputs.desiredAnnualBudget, goalInputs.currency)],
                [tr ? 'Para birimi' : 'Currency', safeCurrency(goalInputs.currency)],
              ],
            },
            {
              heading: tr ? 'Yatırım Gereksinimleri' : 'Investment Requirements',
              rows: [
                [tr ? 'Mevcut BTC varlığı' : 'Current BTC Holdings', `${goalInputs.currentBtcHoldings} BTC`],
                [tr ? 'Mevcut portföy değeri' : 'Current Portfolio Value', formatCurrency(currentPortfolioValue, goalInputs.currency)],
                [tr ? 'Gerekli toplam BTC' : 'Total BTC Needed', `${goalResults.totalBtcNeededAtRetirement.toFixed(4)} BTC`],
                [tr ? 'Toplam yatırım' : 'Total Investment', formatCurrency(goalResults.totalInvestmentRequired, goalInputs.currency)],
                [tr ? 'Beklenen büyüme' : 'Expected Growth Rate', `${goalInputs.expectedGrowthRate}%`],
                [tr ? 'Enflasyon' : 'Inflation Rate', `${goalInputs.inflationRate}%`],
                [
                  tr ? 'Değerlendirme' : 'Assessment',
                  goalResults.feasible ? (tr ? 'Ulaşılabilir' : 'Feasible') : (tr ? 'Zorlu' : 'Challenging'),
                ],
              ],
            },
          ],
        });
      } else if (mode === 'fire' && fireInputs && fireResults) {
        await downloadStandardPdf({
          title: tr ? 'Bitcoin FIRE Raporu' : 'Bitcoin FIRE Report',
          subtitle: tr
            ? `Çekim oranı ${fireInputs.withdrawalRate}%`
            : `Withdrawal rate ${fireInputs.withdrawalRate}%`,
          language,
          filename: { en: 'bitcoin-fire-report', tr: 'bitcoin-fire-raporu' },
          canonicalUrl: 'bitcoincalculator.tools/calculators/retirement',
          headline: {
            label: tr ? 'FIRE Hedefi' : 'FIRE Target',
            value: formatCurrency(fireResults.fireTarget, fireInputs.currency),
            accent: 'ember',
          },
          metaRows: [`${tr ? 'BTC Fiyatı' : 'BTC Price'}: ${formatCurrency(currentBtcPrice, fireInputs.currency)}`],
          sections: [
            {
              heading: tr ? 'FIRE Parametreleri' : 'FIRE Parameters',
              rows: [
                [tr ? 'Mevcut yaş' : 'Current Age', `${fireInputs.currentAge}`],
                [tr ? 'Mevcut BTC' : 'Current BTC', `${fireInputs.currentBtcHoldings} BTC`],
                [tr ? 'Aylık DCA' : 'Monthly DCA', formatCurrency(fireInputs.monthlyContribution, fireInputs.currency)],
                [tr ? 'Yıllık gider' : 'Annual Expenses', formatCurrency(fireInputs.annualExpenses, fireInputs.currency)],
                [tr ? 'Çekim oranı' : 'Withdrawal Rate', `${fireInputs.withdrawalRate}%`],
              ],
            },
            {
              kind: 'table',
              heading: tr ? 'Senaryolar' : 'Scenarios',
              columns: tr
                ? ['Senaryo', 'Büyüme', 'FIRE Yaşı', 'Yıl', 'Portföy']
                : ['Scenario', 'Growth', 'FIRE Age', 'Years', 'Portfolio'],
              rows: fireResults.scenarios.map((s) => [
                s.label,
                `${s.growthRate}%`,
                String(s.fireAge),
                `${s.yearsToFire}`,
                formatCurrency(s.portfolioValueAtFire, fireInputs.currency),
              ]),
            },
          ],
        });
      }
    } catch (error) {
      console.error('PDF export failed:', error);
    } finally {
      setBusy(false);
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

    if ((mode === 'forecaster' || mode === 'planner') && chartView) {
      params.set('view', chartView);
    }

    const shareUrl = `${baseUrl}?${params.toString()}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setLinkCopied(true);
      window.setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      console.log('Shareable link:', shareUrl);
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

  const actions = [
    { kind: 'pdf' as const, onClick: generatePDFReport, loading: busy },
    ...(canCsv ? [{ kind: 'csv' as const, onClick: generateCSV }] : []),
    { kind: 'copy-link' as const, onClick: generateShareableLink, copied: linkCopied },
  ];

  return (
    <div data-testid="retirement-export-controls">
      <ShareExportPanel actions={actions} />
    </div>
  );
});

RetirementExportReport.displayName = 'RetirementExportReport';
