import React, { useState } from 'react';
import { formatCurrencyAmount } from '@/utils/formatCurrency';
import { ShareExportPanel, downloadStandardPdf } from '@/components/share-export';
import { RetirementInputs, RetirementProjection } from '@/pages/BitcoinRetirementCalculator';
import { GoalPlannerInputs } from '@/components/retirement/GoalPlannerInputsPanel';
import { FireModeInputs } from '@/components/retirement/FireModeInputsPanel';
import { FireModeResultsData } from '@/components/retirement/FireModeResults';
import { useLanguage } from '@/contexts/LanguageContext';
import { buildExportFilename } from '@/utils/exportFilename';
import {
  buildForecasterPdfPayload,
  buildPlannerPdfPayload,
  buildFirePdfPayload,
  buildShareableLink,
  safeCurrency,
  RETIREMENT_CSV_FILENAMES,
} from './retirementPdfPayload';

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
  const tr = language === 'tr';
  const [busy, setBusy] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const fmt = (amount: number, currency: string) => {
    const code = safeCurrency(currency);
    const locale = tr ? 'tr-TR' : (code === 'TRY' ? 'tr-TR' : 'en-US');
    return formatCurrencyAmount(amount, code, { locale, decimals: 2 });
  };

  const generatePDFReport = async () => {
    setBusy(true);
    try {
      if (mode === 'forecaster' && inputs && projections) {
        await downloadStandardPdf(
          buildForecasterPdfPayload({ inputs, projections, currentBtcPrice, language }),
        );
      } else if (mode === 'planner' && goalInputs && goalResults) {
        await downloadStandardPdf(
          buildPlannerPdfPayload({ goalInputs, goalResults, currentBtcPrice, language }),
        );
      } else if (mode === 'fire' && fireInputs && fireResults) {
        await downloadStandardPdf(
          buildFirePdfPayload({ fireInputs, fireResults, currentBtcPrice, language }),
        );
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

  /**
   * CSV mirrors the PDF's table section field-for-field to keep parity.
   * Forecaster: 7-column year-by-year projection (Year, Age, BTC, BTC Price, Portfolio, Annual, Monthly).
   * Planner:    2-column metric/value dump matching the PDF's KV sections.
   * FIRE:       7-column scenarios matching the PDF's Scenarios table.
   */
  const generateCSV = () => {
    let headers: string[] = [];
    let rows: (string | number)[][] = [];
    let nameKey: { en: string; tr: string } = { en: 'bitcoin-retirement-projections', tr: 'bitcoin-emeklilik-projeksiyonlari' };

    if (mode === 'forecaster') {
      if (!inputs || !projections || projections.length === 0) return;
      headers = tr
        ? ['Yıl', 'Yaş', 'BTC', 'BTC Fiyatı', 'Portföy', 'Yıllık Bütçe', 'Aylık Bütçe']
        : ['Year', 'Age', 'BTC', 'BTC Price', 'Portfolio', 'Annual Budget', 'Monthly Budget'];
      rows = projections.map(p => [
        p.year, p.age,
        p.btcHoldings.toFixed(4),
        fmt(p.btcPrice, inputs.currency),
        fmt(p.fiatValue, inputs.currency),
        fmt(p.annualBudget, inputs.currency),
        fmt(p.monthlyBudget, inputs.currency),
      ]);
    } else if (mode === 'planner' && goalInputs && goalResults) {
      nameKey = { en: 'bitcoin-retirement-goal-plan', tr: 'bitcoin-emeklilik-hedef-plani' };
      headers = tr ? ['Metrik', 'Değer'] : ['Metric', 'Value'];
      const currentPortfolio = goalInputs.currentBtcHoldings * currentBtcPrice;
      const yearsToRetirement = goalInputs.desiredRetirementAge - goalInputs.currentAge;
      rows = [
        [tr ? 'Mevcut yaş' : 'Current Age', goalInputs.currentAge],
        [tr ? 'Hedef emeklilik yaşı' : 'Desired Retirement Age', goalInputs.desiredRetirementAge],
        [tr ? 'Emekliliğe kalan yıl' : 'Years to Retirement', yearsToRetirement],
        [tr ? 'İstenen yıllık bütçe' : 'Desired Annual Budget', fmt(goalInputs.desiredAnnualBudget, goalInputs.currency)],
        [tr ? 'Mevcut BTC varlığı' : 'Current BTC Holdings', `${goalInputs.currentBtcHoldings} BTC`],
        [tr ? 'Mevcut portföy değeri' : 'Current Portfolio Value', fmt(currentPortfolio, goalInputs.currency)],
        [tr ? 'Gerekli aylık yatırım' : 'Required Monthly Investment', fmt(goalResults.requiredMonthlyInvestment, goalInputs.currency)],
        [tr ? 'Gerekli toplam BTC' : 'Total BTC Needed', `${goalResults.totalBtcNeededAtRetirement.toFixed(4)} BTC`],
        [tr ? 'Toplam yatırım' : 'Total Investment', fmt(goalResults.totalInvestmentRequired, goalInputs.currency)],
        [tr ? 'Beklenen büyüme (%)' : 'Expected Growth (%)', goalInputs.expectedGrowthRate],
        [tr ? 'Enflasyon (%)' : 'Inflation (%)', goalInputs.inflationRate],
        [tr ? 'Para birimi' : 'Currency', safeCurrency(goalInputs.currency)],
        [tr ? 'Değerlendirme' : 'Assessment', goalResults.feasible ? (tr ? 'Ulaşılabilir' : 'Feasible') : (tr ? 'Zorlu' : 'Challenging')],
      ];
    } else if (mode === 'fire' && fireInputs && fireResults) {
      nameKey = { en: 'bitcoin-fire-scenarios', tr: 'bitcoin-fire-senaryolari' };
      headers = tr
        ? ['Senaryo', 'Büyüme %', 'FIRE Yaşı', 'Yıl', 'Portföy', "FIRE'da BTC", 'Aylık BTC']
        : ['Scenario', 'Growth %', 'FIRE Age', 'Years', 'Portfolio', 'BTC at FIRE', 'Monthly BTC'];
      rows = fireResults.scenarios.map(s => [
        s.label, s.growthRate, s.fireAge, s.yearsToFire,
        fmt(s.portfolioValueAtFire, fireInputs.currency),
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
