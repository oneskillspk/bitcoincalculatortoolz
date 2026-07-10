/**
 * Pure builders that convert Retirement calculator state into
 * RenderStandardPdfOptions. Kept separate from the React component so
 * they can be tested without a DOM.
 */
import { formatCurrencyAmount } from '@/utils/formatCurrency';
import type { RenderStandardPdfOptions } from '@/components/share-export/exporters/pdfReport';
import type { RetirementInputs, RetirementProjection } from '@/pages/BitcoinRetirementCalculator';
import type { GoalPlannerInputs } from '@/components/retirement/GoalPlannerInputsPanel';
import type { FireModeInputs } from '@/components/retirement/FireModeInputsPanel';
import type { FireModeResultsData } from '@/components/retirement/FireModeResults';
import { SUPPORTED_CURRENCIES } from '@/services/bitcoinApi';
import type { ExportLanguage } from '@/utils/exportFilename';

export const safeCurrency = (currency: unknown): string => {
  const code = typeof currency === 'string' ? currency.toUpperCase() : '';
  return SUPPORTED_CURRENCIES.some((c) => c.code === code) ? code : 'USD';
};

const money = (amount: number, currency: string, language: ExportLanguage) => {
  const code = safeCurrency(currency);
  const locale = language === 'tr' ? 'tr-TR' : (code === 'TRY' ? 'tr-TR' : 'en-US');
  return formatCurrencyAmount(amount, code, { locale, decimals: 2 });
};

const CANONICAL_URL = 'bitcoincalculator.tools/calculators/retirement';

export const buildForecasterPdfPayload = (params: {
  inputs: RetirementInputs;
  projections: RetirementProjection[];
  currentBtcPrice: number;
  language: ExportLanguage;
}): RenderStandardPdfOptions => {
  const { inputs, projections, currentBtcPrice, language } = params;
  const tr = language === 'tr';
  const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
  const totalContributions = inputs.monthlyContribution * yearsToRetirement * 12;
  const currentPortfolioValue = inputs.currentBtcHoldings * currentBtcPrice;
  const firstYearBudget = projections[0]?.annualBudget ?? 0;
  const fmt = (n: number) => money(n, inputs.currency, language);

  return {
    title: tr ? 'Bitcoin Emeklilik Tahmin Raporu' : 'Bitcoin Retirement Forecast Report',
    subtitle: tr
      ? `${yearsToRetirement} yıl birikim · ${projections.length} yıl emeklilik`
      : `${yearsToRetirement}-year accumulation · ${projections.length}-year retirement`,
    language,
    filename: { en: 'bitcoin-retirement-forecast', tr: 'bitcoin-emeklilik-tahmini' },
    canonicalUrl: CANONICAL_URL,
    headline: {
      label: tr ? '1. Yıl Yıllık Bütçe' : 'Year 1 Annual Budget',
      value: fmt(firstYearBudget),
      accent: 'ember',
    },
    metaRows: [`${tr ? 'BTC Fiyatı' : 'BTC Price'}: ${fmt(currentBtcPrice)}`],
    sections: [
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
          [tr ? 'Mevcut portföy değeri' : 'Current Portfolio Value', fmt(currentPortfolioValue)],
          [tr ? 'Aylık katkı' : 'Monthly Contribution', fmt(inputs.monthlyContribution)],
          [tr ? 'Toplam katkı' : 'Total Contributions', fmt(totalContributions)],
          [tr ? 'Beklenen büyüme' : 'Expected Growth Rate', `${inputs.expectedGrowthRate}%`],
          [tr ? 'Enflasyon' : 'Inflation Rate', `${inputs.inflationRate}%`],
        ],
      },
      {
        kind: 'table',
        heading: tr ? 'Yıl Yıl Projeksiyon' : 'Year-by-Year Projection',
        columns: tr
          ? ['Yıl', 'Yaş', 'BTC', 'BTC Fiyatı', 'Portföy', 'Yıllık Bütçe', 'Aylık Bütçe']
          : ['Year', 'Age', 'BTC', 'BTC Price', 'Portfolio', 'Annual Budget', 'Monthly Budget'],
        widths: [0.55, 0.55, 0.85, 1.3, 1.4, 1.35, 1.5],
        rows: projections.map((p) => [
          String(p.year),
          String(p.age),
          p.btcHoldings.toFixed(4),
          fmt(p.btcPrice),
          fmt(p.fiatValue),
          fmt(p.annualBudget),
          fmt(p.monthlyBudget),
        ]),
      },
    ],
  };
};

export const buildPlannerPdfPayload = (params: {
  goalInputs: GoalPlannerInputs;
  goalResults: any;
  currentBtcPrice: number;
  language: ExportLanguage;
}): RenderStandardPdfOptions => {
  const { goalInputs, goalResults, currentBtcPrice, language } = params;
  const tr = language === 'tr';
  const yearsToRetirement = goalInputs.desiredRetirementAge - goalInputs.currentAge;
  const currentPortfolioValue = goalInputs.currentBtcHoldings * currentBtcPrice;
  const fmt = (n: number) => money(n, goalInputs.currency, language);

  return {
    title: tr ? 'Bitcoin Emeklilik Hedef Planı' : 'Bitcoin Retirement Goal Plan',
    subtitle: goalResults.feasible
      ? (tr ? 'Hedef ulaşılabilir' : 'Goal is feasible')
      : (tr ? 'Hedef zorlu' : 'Goal is challenging'),
    language,
    filename: { en: 'bitcoin-retirement-goal-plan', tr: 'bitcoin-emeklilik-hedef-plani' },
    canonicalUrl: CANONICAL_URL,
    headline: {
      label: tr ? 'Gerekli Aylık Yatırım' : 'Required Monthly Investment',
      value: fmt(goalResults.requiredMonthlyInvestment),
      accent: goalResults.feasible ? 'success' : 'danger',
    },
    metaRows: [`${tr ? 'BTC Fiyatı' : 'BTC Price'}: ${fmt(currentBtcPrice)}`],
    sections: [
      {
        heading: tr ? 'Emeklilik Hedefi' : 'Retirement Goal',
        rows: [
          [tr ? 'Mevcut yaş' : 'Current Age', `${goalInputs.currentAge}`],
          [tr ? 'Hedef emeklilik yaşı' : 'Desired Retirement Age', `${goalInputs.desiredRetirementAge}`],
          [tr ? 'Emekliliğe kalan yıl' : 'Years to Retirement', `${yearsToRetirement}`],
          [tr ? 'İstenen yıllık bütçe' : 'Desired Annual Budget', fmt(goalInputs.desiredAnnualBudget)],
          [tr ? 'Para birimi' : 'Currency', safeCurrency(goalInputs.currency)],
        ],
      },
      {
        heading: tr ? 'Yatırım Gereksinimleri' : 'Investment Requirements',
        rows: [
          [tr ? 'Mevcut BTC varlığı' : 'Current BTC Holdings', `${goalInputs.currentBtcHoldings} BTC`],
          [tr ? 'Mevcut portföy değeri' : 'Current Portfolio Value', fmt(currentPortfolioValue)],
          [tr ? 'Gerekli toplam BTC' : 'Total BTC Needed', `${goalResults.totalBtcNeededAtRetirement.toFixed(4)} BTC`],
          [tr ? 'Toplam yatırım' : 'Total Investment', fmt(goalResults.totalInvestmentRequired)],
          [tr ? 'Beklenen büyüme' : 'Expected Growth Rate', `${goalInputs.expectedGrowthRate}%`],
          [tr ? 'Enflasyon' : 'Inflation Rate', `${goalInputs.inflationRate}%`],
          [
            tr ? 'Değerlendirme' : 'Assessment',
            goalResults.feasible ? (tr ? 'Ulaşılabilir' : 'Feasible') : (tr ? 'Zorlu' : 'Challenging'),
          ],
        ],
      },
    ],
  };
};

export const buildFirePdfPayload = (params: {
  fireInputs: FireModeInputs;
  fireResults: FireModeResultsData;
  currentBtcPrice: number;
  language: ExportLanguage;
}): RenderStandardPdfOptions => {
  const { fireInputs, fireResults, currentBtcPrice, language } = params;
  const tr = language === 'tr';
  const fmt = (n: number) => money(n, fireInputs.currency, language);

  return {
    title: tr ? 'Bitcoin FIRE Raporu' : 'Bitcoin FIRE Report',
    subtitle: tr
      ? `Çekim oranı ${fireInputs.withdrawalRate}%`
      : `Withdrawal rate ${fireInputs.withdrawalRate}%`,
    language,
    filename: { en: 'bitcoin-fire-report', tr: 'bitcoin-fire-raporu' },
    canonicalUrl: CANONICAL_URL,
    headline: {
      label: tr ? 'FIRE Hedefi' : 'FIRE Target',
      value: fmt(fireResults.fireTarget),
      accent: 'ember',
    },
    metaRows: [`${tr ? 'BTC Fiyatı' : 'BTC Price'}: ${fmt(currentBtcPrice)}`],
    sections: [
      {
        heading: tr ? 'FIRE Parametreleri' : 'FIRE Parameters',
        rows: [
          [tr ? 'Mevcut yaş' : 'Current Age', `${fireInputs.currentAge}`],
          [tr ? 'Mevcut BTC' : 'Current BTC', `${fireInputs.currentBtcHoldings} BTC`],
          [tr ? 'Aylık DCA' : 'Monthly DCA', fmt(fireInputs.monthlyContribution)],
          [tr ? 'Yıllık gider' : 'Annual Expenses', fmt(fireInputs.annualExpenses)],
          [tr ? 'Çekim oranı' : 'Withdrawal Rate', `${fireInputs.withdrawalRate}%`],
        ],
      },
      {
        kind: 'table',
        heading: tr ? 'Senaryolar' : 'Scenarios',
        columns: tr
          ? ['Senaryo', 'Büyüme', 'FIRE Yaşı', 'Yıl', 'Portföy', "FIRE'da BTC", 'Aylık BTC']
          : ['Scenario', 'Growth', 'FIRE Age', 'Years', 'Portfolio', 'BTC at FIRE', 'Monthly BTC'],
        widths: [1.3, 0.8, 1.0, 0.7, 1.6, 1.3, 1.5],
        rows: fireResults.scenarios.map((s) => [
          s.label,
          `${s.growthRate}%`,
          String(s.fireAge),
          `${s.yearsToFire}`,
          fmt(s.portfolioValueAtFire),
          s.totalBtcAtFire.toFixed(4),
          s.monthlyBtcWithdrawal.toFixed(6),
        ]),
      },
    ],
  };
};

/** CSV filename keys — must stay parallel to the PDF filename keys above. */
export const RETIREMENT_CSV_FILENAMES = {
  forecaster: { en: 'bitcoin-retirement-projections', tr: 'bitcoin-emeklilik-projeksiyonlari' },
  planner:    { en: 'bitcoin-retirement-goal-plan',   tr: 'bitcoin-emeklilik-hedef-plani' },
  fire:       { en: 'bitcoin-fire-scenarios',         tr: 'bitcoin-fire-senaryolari' },
} as const;

export const RETIREMENT_CANONICAL_URL = CANONICAL_URL;

export interface ShareLinkParams {
  mode: 'forecaster' | 'planner' | 'fire';
  inputs?: RetirementInputs;
  goalInputs?: GoalPlannerInputs;
  fireInputs?: FireModeInputs;
  chartView?: 'chart' | 'table';
  origin: string;
}

/** Build the copy-link share URL. Extracted for regression testing. */
export const buildShareableLink = (p: ShareLinkParams): string => {
  const params = new URLSearchParams();
  if (p.mode === 'forecaster' && p.inputs) {
    const i = p.inputs;
    params.set('tab', 'forecaster');
    params.set('currentAge', String(i.currentAge));
    params.set('retirementAge', String(i.retirementAge));
    params.set('currentBtcHoldings', String(i.currentBtcHoldings));
    params.set('monthlyContribution', String(i.monthlyContribution));
    params.set('expectedGrowthRate', String(i.expectedGrowthRate));
    params.set('inflationRate', String(i.inflationRate));
    params.set('mode', i.mode);
    params.set('currency', i.currency);
  } else if (p.mode === 'planner' && p.goalInputs) {
    const g = p.goalInputs;
    params.set('tab', 'planner');
    params.set('currentAge', String(g.currentAge));
    params.set('desiredRetirementAge', String(g.desiredRetirementAge));
    params.set('desiredAnnualBudget', String(g.desiredAnnualBudget));
    params.set('currentBtcHoldings', String(g.currentBtcHoldings));
    params.set('expectedGrowthRate', String(g.expectedGrowthRate));
    params.set('inflationRate', String(g.inflationRate));
    params.set('currency', g.currency);
  } else if (p.mode === 'fire' && p.fireInputs) {
    const f = p.fireInputs;
    params.set('tab', 'fire');
    params.set('currentAge', String(f.currentAge));
    params.set('currentBtcHoldings', String(f.currentBtcHoldings));
    params.set('monthlyContribution', String(f.monthlyContribution));
    params.set('annualExpenses', String(f.annualExpenses));
    params.set('withdrawalRate', String(f.withdrawalRate));
    params.set('currency', f.currency);
  }
  if ((p.mode === 'forecaster' || p.mode === 'planner') && p.chartView) {
    params.set('view', p.chartView);
  }
  return `${p.origin}/calculators/retirement?${params.toString()}`;
};
