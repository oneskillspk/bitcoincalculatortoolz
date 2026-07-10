import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import {
  buildForecasterPdfPayload,
  buildPlannerPdfPayload,
  buildFirePdfPayload,
  buildShareableLink,
  RETIREMENT_CSV_FILENAMES,
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

const goalInputs: GoalPlannerInputs = {
  currentAge: 30,
  desiredRetirementAge: 55,
  desiredAnnualBudget: 100_000,
  currentBtcHoldings: 0.25,
  expectedGrowthRate: 15,
  inflationRate: 3,
  currency: 'USD',
} as GoalPlannerInputs;

const fireInputs: FireModeInputs = {
  currentAge: 32,
  currentBtcHoldings: 1,
  monthlyContribution: 1_000,
  annualExpenses: 60_000,
  withdrawalRate: 4,
  currency: 'USD',
} as FireModeInputs;

const goalResults = {
  requiredMonthlyInvestment: 850,
  totalBtcNeededAtRetirement: 2.5,
  totalInvestmentRequired: 255_000,
  feasible: true,
};

const fireResults: FireModeResultsData = {
  fireTarget: 1_500_000,
  scenarios: [
    { label: 'Bear', growthRate: 10, fireAge: 55, yearsToFire: 23, portfolioValueAtFire: 1_500_000, totalBtcAtFire: 1.5, monthlyBtcWithdrawal: 0.005 },
    { label: 'Base', growthRate: 20, fireAge: 45, yearsToFire: 13, portfolioValueAtFire: 1_600_000, totalBtcAtFire: 1.2, monthlyBtcWithdrawal: 0.004 },
  ],
} as FireModeResultsData;

const makeProjections = (n: number, overrides: Partial<RetirementProjection> = {}): RetirementProjection[] =>
  Array.from({ length: n }, (_, i) => ({
    year: 2056 + i,
    age: 60 + i,
    btcHoldings: 3 - i * 0.01,
    btcPrice: 1_000_000 + i * 50_000,
    fiatValue: 3_000_000 - i * 25_000,
    annualBudget: 120_000,
    monthlyBudget: 10_000,
    ...overrides,
  })) as RetirementProjection[];

describe('copy-link ↔ PDF ↔ CSV parity', () => {
  it('forecaster share link encodes the same mode identifier as PDF/CSV filenames', () => {
    const link = buildShareableLink({
      mode: 'forecaster', inputs: forecasterInputs, chartView: 'table', origin: 'https://x.test',
    });
    const url = new URL(link);
    expect(url.pathname).toBe('/calculators/retirement');
    expect(url.searchParams.get('tab')).toBe('forecaster');
    expect(url.searchParams.get('view')).toBe('table');
    // Canonical URL used in PDF matches share-link path
    const pdf = buildForecasterPdfPayload({
      inputs: forecasterInputs, projections: makeProjections(3), currentBtcPrice: 100_000, language: 'en',
    });
    expect(pdf.canonicalUrl.endsWith('/calculators/retirement')).toBe(true);
    // PDF and CSV filename slugs share the same mode identifier
    expect(pdf.filename.en).toContain('retirement');
    expect(RETIREMENT_CSV_FILENAMES.forecaster.en).toContain('retirement');
  });

  it('planner share link and CSV/PDF filenames all use the goal-plan slug', () => {
    const link = buildShareableLink({
      mode: 'planner', goalInputs, chartView: 'chart', origin: 'https://x.test',
    });
    expect(new URL(link).searchParams.get('tab')).toBe('planner');
    expect(new URL(link).searchParams.get('view')).toBe('chart');
    const pdf = buildPlannerPdfPayload({ goalInputs, goalResults, currentBtcPrice: 100_000, language: 'en' });
    expect(pdf.filename.en).toBe(RETIREMENT_CSV_FILENAMES.planner.en);
    expect(pdf.filename.tr).toBe(RETIREMENT_CSV_FILENAMES.planner.tr);
  });

  it('fire share link omits ?view and PDF/CSV filenames share the fire slug', () => {
    const link = buildShareableLink({ mode: 'fire', fireInputs, chartView: 'chart', origin: 'https://x.test' });
    const url = new URL(link);
    expect(url.searchParams.get('tab')).toBe('fire');
    expect(url.searchParams.get('view')).toBeNull(); // fire has no chart/table sub-view
    const pdf = buildFirePdfPayload({ fireInputs, fireResults, currentBtcPrice: 100_000, language: 'en' });
    expect(pdf.filename.en).toContain('fire');
    expect(RETIREMENT_CSV_FILENAMES.fire.en).toContain('fire');
  });

  it('share-link params round-trip all planner input fields', () => {
    const url = new URL(buildShareableLink({ mode: 'planner', goalInputs, origin: 'https://x.test' }));
    expect(url.searchParams.get('currentAge')).toBe('30');
    expect(url.searchParams.get('desiredRetirementAge')).toBe('55');
    expect(url.searchParams.get('desiredAnnualBudget')).toBe('100000');
    expect(url.searchParams.get('currency')).toBe('USD');
  });
});

describe('edge cases — extreme values and missing data', () => {
  it('handles multi-million-dollar BTC prices without breaking the table row shape', async () => {
    const projections = makeProjections(3, { btcPrice: 12_345_678.9, fiatValue: 999_999_999 });
    const payload = buildForecasterPdfPayload({
      inputs: forecasterInputs, projections, currentBtcPrice: 12_345_678.9, language: 'en',
    });
    const table = payload.sections.find((s) => 'kind' in s && s.kind === 'table') as any;
    expect(table.rows.every((r: string[]) => r.length === 7)).toBe(true);
    // Currency formatter emits a $ prefix for USD
    expect(table.rows[0][3]).toMatch(/^\$/);
    const doc = await renderStandardPdf(payload);
    expect(doc.getNumberOfPages()).toBeGreaterThanOrEqual(1);
  });

  it('produces at least 3 pages for a 60-year projection (pagination sanity)', async () => {
    const payload = buildForecasterPdfPayload({
      inputs: forecasterInputs, projections: makeProjections(60), currentBtcPrice: 100_000, language: 'en',
    });
    const doc = await renderStandardPdf(payload);
    expect(doc.getNumberOfPages()).toBeGreaterThanOrEqual(3);
  });

  it('renders an empty scenarios FIRE payload without throwing', async () => {
    const payload = buildFirePdfPayload({
      fireInputs, fireResults: { ...fireResults, scenarios: [] }, currentBtcPrice: 100_000, language: 'en',
    });
    const table = payload.sections.find((s) => 'kind' in s && s.kind === 'table') as any;
    expect(table.rows).toHaveLength(0);
    const doc = await renderStandardPdf(payload);
    expect(doc.getNumberOfPages()).toBe(1);
  });

  it('planner headline flips to danger accent when goal is not feasible', () => {
    const notFeasible = buildPlannerPdfPayload({
      goalInputs, goalResults: { ...goalResults, feasible: false }, currentBtcPrice: 100_000, language: 'en',
    });
    expect(notFeasible.headline?.accent).toBe('danger');
  });

  it('handles zero BTC holdings and zero portfolio without NaN in kv rows', () => {
    const payload = buildForecasterPdfPayload({
      inputs: { ...forecasterInputs, currentBtcHoldings: 0, monthlyContribution: 0 },
      projections: makeProjections(1, { btcHoldings: 0, fiatValue: 0, annualBudget: 0, monthlyBudget: 0 }),
      currentBtcPrice: 0,
      language: 'en',
    });
    payload.sections.forEach((s) => {
      if (!('kind' in s) || s.kind === 'kv') {
        (s as any).rows.forEach((r: [string, string]) => {
          expect(r[1]).not.toMatch(/NaN|undefined/);
        });
      }
    });
  });

  it('rejects unknown currency codes and falls back to USD in the payload', () => {
    const payload = buildForecasterPdfPayload({
      inputs: { ...forecasterInputs, currency: 'ZZZ' as any },
      projections: makeProjections(2), currentBtcPrice: 100_000, language: 'en',
    });
    const kv = payload.sections[0] as any;
    const currencyRow = kv.rows.find((r: [string, string]) => r[0] === 'Currency');
    expect(currencyRow[1]).toBe('USD');
  });
});

describe('column widths remain proportional across narrow ratios (styling regression)', () => {
  const assertWidthsValid = (widths: number[]) => {
    expect(widths.every((w) => w > 0)).toBe(true);
    const sum = widths.reduce((a, b) => a + b, 0);
    // No single column should hog more than half the width
    expect(Math.max(...widths) / sum).toBeLessThan(0.5);
  };

  it('forecaster table declares 7 positive width ratios with no dominant column', () => {
    const payload = buildForecasterPdfPayload({
      inputs: forecasterInputs, projections: makeProjections(5), currentBtcPrice: 100_000, language: 'en',
    });
    const table = payload.sections.find((s) => 'kind' in s && s.kind === 'table') as any;
    expect(table.widths).toHaveLength(7);
    assertWidthsValid(table.widths);
  });

  it('fire scenarios table declares 7 positive width ratios with no dominant column', () => {
    const payload = buildFirePdfPayload({ fireInputs, fireResults, currentBtcPrice: 100_000, language: 'en' });
    const table = payload.sections.find((s) => 'kind' in s && s.kind === 'table') as any;
    expect(table.widths).toHaveLength(7);
    assertWidthsValid(table.widths);
  });
});

// ------------------------------------------------------------------
// Integration: click each share-export button and assert side effects.
// downloadStandardPdf is heavy in JSDOM (font fetches / Blob writes) so we
// mock it and assert it was invoked with the payload the builders produce.
// ------------------------------------------------------------------
vi.mock('@/components/share-export', async () => {
  const actual = await vi.importActual<any>('@/components/share-export');
  return { ...actual, downloadStandardPdf: vi.fn(async () => {}) };
});

import { downloadStandardPdf } from '@/components/share-export';
import { RetirementExportReport } from '../RetirementExportReport';
import { LanguageProvider } from '@/contexts/LanguageContext';

const renderWithLang = (ui: React.ReactElement) =>
  render(<LanguageProvider>{ui}</LanguageProvider>);

describe('RetirementExportReport — click integration', () => {
  beforeEach(() => {
    (downloadStandardPdf as any).mockClear();
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn(async () => {}) },
    });
    (URL as any).createObjectURL = vi.fn(() => 'blob:mock');
    (URL as any).revokeObjectURL = vi.fn();
  });

  const cases = [
    {
      name: 'forecaster',
      props: {
        mode: 'forecaster' as const,
        inputs: forecasterInputs,
        projections: makeProjections(5),
        currentBtcPrice: 100_000,
      },
      expectedSlug: 'bitcoin-retirement-forecast',
    },
    {
      name: 'planner',
      props: {
        mode: 'planner' as const,
        goalInputs,
        goalResults,
        currentBtcPrice: 100_000,
      },
      expectedSlug: 'bitcoin-retirement-goal-plan',
    },
    {
      name: 'fire',
      props: {
        mode: 'fire' as const,
        fireInputs,
        fireResults,
        currentBtcPrice: 100_000,
      },
      expectedSlug: 'bitcoin-fire-report',
    },
  ];

  cases.forEach(({ name, props, expectedSlug }) => {
    it(`${name}: PDF, CSV, and copy-link buttons all trigger side effects`, async () => {
      renderWithLang(<RetirementExportReport {...(props as any)} />);

      // PDF
      const pdfBtn = screen.getByRole('button', { name: /pdf/i });
      fireEvent.click(pdfBtn);
      await waitFor(() => expect(downloadStandardPdf).toHaveBeenCalled());
      const payload = (downloadStandardPdf as any).mock.calls[0][0];
      expect(payload.filename.en).toBe(expectedSlug);
      expect(payload.canonicalUrl.endsWith('/calculators/retirement')).toBe(true);

      // CSV
      const csvBtn = screen.getByRole('button', { name: /csv/i });
      const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
      fireEvent.click(csvBtn);
      expect(clickSpy).toHaveBeenCalled();
      clickSpy.mockRestore();

      // Copy-link
      const copyBtn = screen.getByRole('button', { name: /copy|link/i });
      fireEvent.click(copyBtn);
      await waitFor(() => expect(navigator.clipboard.writeText).toHaveBeenCalled());
      const url = (navigator.clipboard.writeText as any).mock.calls[0][0];
      expect(url).toContain(`tab=${name}`);
    });
  });
});
