import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import React from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { RetirementExportReport } from '../RetirementExportReport';
import type { RetirementInputs, RetirementProjection } from '@/pages/BitcoinRetirementCalculator';
import type { GoalPlannerInputs } from '@/components/retirement/GoalPlannerInputsPanel';
import type { FireModeInputs } from '@/components/retirement/FireModeInputsPanel';
import type { FireModeResultsData } from '@/components/retirement/FireModeResults';

expect.extend(toHaveNoViolations);

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

const goalResults = {
  requiredMonthlyInvestment: 850, totalBtcNeededAtRetirement: 2.5,
  totalInvestmentRequired: 255_000, feasible: true,
};

const fireResults: FireModeResultsData = {
  fireTarget: 1_500_000,
  scenarios: [
    { label: 'Bear', growthRate: 10, fireAge: 55, yearsToFire: 23, portfolioValueAtFire: 1_500_000, totalBtcAtFire: 1.5, monthlyBtcWithdrawal: 0.005 },
  ],
} as FireModeResultsData;

const projections: RetirementProjection[] = [
  { year: 2056, age: 60, btcHoldings: 3, btcPrice: 1_000_000, fiatValue: 3_000_000, annualBudget: 120_000, monthlyBudget: 10_000 } as RetirementProjection,
];

const wrap = (ui: React.ReactElement) =>
  render(<LanguageProvider>{ui}</LanguageProvider>);

// axe rule: color-contrast can't be computed reliably in JSDOM.
const axeOpts = { rules: { 'color-contrast': { enabled: false } } };

const modes = [
  {
    name: 'forecaster',
    element: <RetirementExportReport mode="forecaster" inputs={forecasterInputs} projections={projections} currentBtcPrice={100_000} />,
  },
  {
    name: 'planner',
    element: <RetirementExportReport mode="planner" goalInputs={goalInputs} goalResults={goalResults} currentBtcPrice={100_000} />,
  },
  {
    name: 'fire',
    element: <RetirementExportReport mode="fire" fireInputs={fireInputs} fireResults={fireResults} currentBtcPrice={100_000} />,
  },
];

describe('RetirementExportReport a11y', () => {
  modes.forEach(({ name, element }) => {
    it(`${name}: has no axe violations`, async () => {
      const { container } = wrap(element);
      const results = await axe(container, axeOpts);
      expect(results).toHaveNoViolations();
    });

    it(`${name}: every share-export button exposes an accessible name`, () => {
      wrap(element);
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThanOrEqual(3);
      for (const btn of buttons) {
        expect(btn).toHaveAccessibleName();
      }
    });

    it(`${name}: PDF/CSV/copy-link controls are focusable via keyboard (not disabled, tabIndex >= 0)`, () => {
      wrap(element);
      const patterns = [/pdf/i, /csv/i, /copy|link/i];
      for (const p of patterns) {
        const btn = screen.getByRole('button', { name: p }) as HTMLButtonElement;
        expect(btn).toBeEnabled();
        // Native <button> is focusable by default; tabIndex should not be negative.
        const tabIndex = btn.tabIndex;
        expect(tabIndex).toBeGreaterThanOrEqual(0);
        btn.focus();
        expect(document.activeElement).toBe(btn);
      }
    });
  });
});
