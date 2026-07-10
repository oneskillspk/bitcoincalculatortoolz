import { describe, it, expect } from 'vitest';
import {
  buildForecasterPdfPayload,
  buildPlannerPdfPayload,
  buildFirePdfPayload,
} from '../retirementPdfPayload';
import { renderStandardPdf } from '@/components/share-export/exporters/pdfReport';
import type { RetirementInputs, RetirementProjection } from '@/pages/BitcoinRetirementCalculator';
import type { GoalPlannerInputs } from '@/components/retirement/GoalPlannerInputsPanel';
import type { FireModeInputs } from '@/components/retirement/FireModeInputsPanel';
import type { FireModeResultsData } from '@/components/retirement/FireModeResults';

const forecasterInputs: RetirementInputs = {
  currentAge: 30,
  retirementAge: 60,
  currentBtcHoldings: 0.5,
  monthlyContribution: 500,
  expectedGrowthRate: 20,
  inflationRate: 3,
  mode: 'optimized',
  currency: 'USD',
} as RetirementInputs;

const forecasterProjections: RetirementProjection[] = Array.from({ length: 30 }, (_, i) => ({
  year: 2056 + i,
  age: 60 + i,
  btcHoldings: 3 - i * 0.05,
  btcPrice: 1_000_000 + i * 50_000,
  fiatValue: 3_000_000 - i * 25_000,
  annualBudget: 120_000 + i * 1_000,
  monthlyBudget: 10_000 + i * 80,
})) as RetirementProjection[];

const goalInputs: GoalPlannerInputs = {
  currentAge: 30,
  desiredRetirementAge: 55,
  desiredAnnualBudget: 100_000,
  currentBtcHoldings: 0.25,
  expectedGrowthRate: 15,
  inflationRate: 3,
  currency: 'USD',
} as GoalPlannerInputs;

const goalResults = {
  requiredMonthlyInvestment: 850,
  totalBtcNeededAtRetirement: 2.5,
  totalInvestmentRequired: 255_000,
  feasible: true,
};

const fireInputs: FireModeInputs = {
  currentAge: 32,
  currentBtcHoldings: 1,
  monthlyContribution: 1_000,
  annualExpenses: 60_000,
  withdrawalRate: 4,
  currency: 'USD',
} as FireModeInputs;

const fireResults: FireModeResultsData = {
  fireTarget: 1_500_000,
  scenarios: [
    { label: 'Bear', growthRate: 10, fireAge: 55, yearsToFire: 23, portfolioValueAtFire: 1_500_000, totalBtcAtFire: 1.5, monthlyBtcWithdrawal: 0.005 },
    { label: 'Base', growthRate: 20, fireAge: 45, yearsToFire: 13, portfolioValueAtFire: 1_600_000, totalBtcAtFire: 1.2, monthlyBtcWithdrawal: 0.004 },
    { label: 'Bull', growthRate: 30, fireAge: 40, yearsToFire: 8, portfolioValueAtFire: 1_700_000, totalBtcAtFire: 1.0, monthlyBtcWithdrawal: 0.003 },
  ],
} as FireModeResultsData;

describe('Retirement PDF payload builders', () => {
  describe('forecaster', () => {
    const payload = buildForecasterPdfPayload({
      inputs: forecasterInputs,
      projections: forecasterProjections,
      currentBtcPrice: 100_000,
      language: 'en',
    });

    it('includes canonical URL and English title', () => {
      expect(payload.title).toBe('Bitcoin Retirement Forecast Report');
      expect(payload.canonicalUrl).toBe('bitcoincalculator.tools/calculators/retirement');
      expect(payload.filename.en).toBe('bitcoin-retirement-forecast');
    });

    it('emits headline, two kv sections, and a 7-column projection table', () => {
      expect(payload.headline?.accent).toBe('ember');
      const kv = payload.sections.filter((s) => !('kind' in s) || s.kind === 'kv') as any[];
      expect(kv).toHaveLength(2);
      const table = payload.sections.find((s) => 'kind' in s && s.kind === 'table') as any;
      expect(table.columns).toEqual(['Year', 'Age', 'BTC', 'BTC Price', 'Portfolio', 'Annual Budget', 'Monthly Budget']);
      expect(table.widths).toHaveLength(7);
      expect(table.rows).toHaveLength(30);
      expect(table.rows[0]).toHaveLength(7);
    });

    it('renders to a multi-page PDF with header repainted on each page', async () => {
      const doc = await renderStandardPdf(payload);
      expect(doc.getNumberOfPages()).toBeGreaterThan(1);
    });

    it('uses Turkish copy when language is tr', () => {
      const tr = buildForecasterPdfPayload({
        inputs: forecasterInputs,
        projections: forecasterProjections,
        currentBtcPrice: 100_000,
        language: 'tr',
      });
      expect(tr.title).toBe('Bitcoin Emeklilik Tahmin Raporu');
      const table = tr.sections.find((s) => 'kind' in s && s.kind === 'table') as any;
      expect(table.columns[0]).toBe('Yıl');
    });
  });

  describe('planner', () => {
    it('renders with success accent when feasible and danger when not', () => {
      const feasible = buildPlannerPdfPayload({ goalInputs, goalResults, currentBtcPrice: 100_000, language: 'en' });
      expect(feasible.headline?.accent).toBe('success');
      const notFeasible = buildPlannerPdfPayload({
        goalInputs, goalResults: { ...goalResults, feasible: false }, currentBtcPrice: 100_000, language: 'en',
      });
      expect(notFeasible.headline?.accent).toBe('danger');
    });

    it('has exactly two kv sections and no table', () => {
      const payload = buildPlannerPdfPayload({ goalInputs, goalResults, currentBtcPrice: 100_000, language: 'en' });
      expect(payload.sections).toHaveLength(2);
      expect(payload.sections.every((s) => !('kind' in s) || s.kind === 'kv')).toBe(true);
    });

    it('renders to a single-page PDF', async () => {
      const payload = buildPlannerPdfPayload({ goalInputs, goalResults, currentBtcPrice: 100_000, language: 'en' });
      const doc = await renderStandardPdf(payload);
      expect(doc.getNumberOfPages()).toBe(1);
    });
  });

  describe('fire', () => {
    const payload = buildFirePdfPayload({ fireInputs, fireResults, currentBtcPrice: 100_000, language: 'en' });

    it('exposes FIRE target as headline and 7-column scenarios table', () => {
      expect(payload.title).toBe('Bitcoin FIRE Report');
      expect(payload.headline?.label).toBe('FIRE Target');
      const table = payload.sections.find((s) => 'kind' in s && s.kind === 'table') as any;
      expect(table.columns).toHaveLength(7);
      expect(table.rows).toHaveLength(3);
      expect(table.widths).toHaveLength(7);
    });

    it('renders a valid single-page PDF', async () => {
      const doc = await renderStandardPdf(payload);
      expect(doc.getNumberOfPages()).toBe(1);
      expect(doc.output().length).toBeGreaterThan(1000);
    });
  });
});
