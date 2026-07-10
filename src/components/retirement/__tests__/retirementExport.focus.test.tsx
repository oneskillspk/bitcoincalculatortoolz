import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { RetirementExportReport } from '../RetirementExportReport';
import type { RetirementInputs, RetirementProjection } from '@/pages/BitcoinRetirementCalculator';
import type { GoalPlannerInputs } from '@/components/retirement/GoalPlannerInputsPanel';
import type { FireModeInputs } from '@/components/retirement/FireModeInputsPanel';
import type { FireModeResultsData } from '@/components/retirement/FireModeResults';

const forecasterInputs = {
  currentAge: 30, retirementAge: 60, currentBtcHoldings: 0.5, monthlyContribution: 500,
  expectedGrowthRate: 20, inflationRate: 3, mode: 'optimized', currency: 'USD',
} as RetirementInputs;
const goalInputs = {
  currentAge: 30, desiredRetirementAge: 55, desiredAnnualBudget: 100_000,
  currentBtcHoldings: 0.25, expectedGrowthRate: 15, inflationRate: 3, currency: 'USD',
} as GoalPlannerInputs;
const fireInputs = {
  currentAge: 32, currentBtcHoldings: 1, monthlyContribution: 1_000,
  annualExpenses: 60_000, withdrawalRate: 4, currency: 'USD',
} as FireModeInputs;
const goalResults = { requiredMonthlyInvestment: 850, totalBtcNeededAtRetirement: 2.5, totalInvestmentRequired: 255_000, feasible: true };
const fireResults: FireModeResultsData = {
  fireTarget: 1_500_000,
  scenarios: [{ label: 'Bear', growthRate: 10, fireAge: 55, yearsToFire: 23, portfolioValueAtFire: 1_500_000, totalBtcAtFire: 1.5, monthlyBtcWithdrawal: 0.005 }],
} as FireModeResultsData;
const projections: RetirementProjection[] = [
  { year: 2056, age: 60, btcHoldings: 3, btcPrice: 1_000_000, fiatValue: 3_000_000, annualBudget: 120_000, monthlyBudget: 10_000 } as RetirementProjection,
];

const wrap = (ui: React.ReactElement) => render(<LanguageProvider>{ui}</LanguageProvider>);

/**
 * Guard: the shared shadcn <Button> base MUST retain the visible
 * focus-visible ring (2px ember ring + 2px offset) that keyboard users rely on.
 * If someone flips this to `focus:outline-none` without a replacement, this test fails.
 */
const REQUIRED_FOCUS_CLASSES = [
  'focus-visible:outline-none',
  'focus-visible:ring-2',
  'focus-visible:ring-[hsl(var(--ember))]',
  'focus-visible:ring-offset-2',
];

const modes = [
  { name: 'forecaster', el: <RetirementExportReport mode="forecaster" inputs={forecasterInputs} projections={projections} currentBtcPrice={100_000} /> },
  { name: 'planner',    el: <RetirementExportReport mode="planner" goalInputs={goalInputs} goalResults={goalResults} currentBtcPrice={100_000} /> },
  { name: 'fire',       el: <RetirementExportReport mode="fire" fireInputs={fireInputs} fireResults={fireResults} currentBtcPrice={100_000} /> },
];

describe('RetirementExportReport — visible focus styles', () => {
  modes.forEach(({ name, el }) => {
    it(`${name}: PDF, CSV, and copy-link buttons ship the ember focus-visible ring`, () => {
      wrap(el);
      const patterns = [/pdf/i, /csv/i, /copy|link/i];
      for (const p of patterns) {
        const btn = screen.getByRole('button', { name: p });
        const cls = btn.className;
        for (const required of REQUIRED_FOCUS_CLASSES) {
          expect(cls, `${name} / ${p} missing "${required}"`).toContain(required);
        }
        // No override that would hide the ring.
        expect(cls).not.toMatch(/focus-visible:ring-0(?!\d)/);
        expect(cls).not.toMatch(/focus-visible:outline-none(?=.*focus-visible:ring-none)/);
      }
    });
  });
});
