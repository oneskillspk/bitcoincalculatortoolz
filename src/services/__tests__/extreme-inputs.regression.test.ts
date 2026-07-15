/**
 * Cross-calculator regression: extreme / edge-case inputs must never render
 * as "Infinity", "-Infinity", "NaN", or "∞" through the shared formatters.
 *
 * We drive each calculator with values known to blow up naive math (zero
 * prices, zero cost basis, huge magnitudes, negative years, empty inputs)
 * and then walk every numeric field on the result through the formatting
 * helpers used by the UI. Nothing that reaches the DOM may contain those
 * forbidden tokens.
 */
import { describe, it, expect } from 'vitest';

import { formatROI, formatCurrency, formatLargeNumber } from '@/utils/formatters';

import { calculateProfitLoss, type Purchase } from '@/services/profitLossCalculator';
import { calculateCAGR, projectInvestment } from '@/services/cagrCalculator';
import {
  futureValueLumpSum,
  futureValueAnnuity,
  futureValueCombined,
  adjustForInflation,
} from '@/services/investmentProjectionCalculator';
import { calculateAverageBuyPrice } from '@/services/averageBuyPriceCalculator';
import { calculateLightningFee, calculateChannelEconomics } from '@/services/lightningFeeCalculator';
import { MiningProfitabilityCalculator, type MiningParams } from '@/services/miningProfitabilityCalculator';
import { leverageLiquidationCalculator } from '@/services/leverageLiquidationCalculator';
import { calculateInheritanceTax } from '@/services/inheritanceTaxCalculator';
import { calculateAccumulation } from '@/services/bitcoinSavingsCalculator';
import { RiskAnalyzer } from '@/services/riskAnalyzer';
import type { BitcoinPrice } from '@/services/bitcoinApi';

const FORBIDDEN = /Infinity|NaN|∞/;

/** Every numeric field on `value`, when formatted, is safe to render. */
function assertRendersSafely(value: unknown, path = 'root'): void {
  if (value == null) return;
  if (typeof value === 'number') {
    // Rendered through both currency-ish and ROI-ish formatters — both must
    // collapse non-finite input to a placeholder, never to a forbidden token.
    expect(formatCurrency(value, { symbol: '$', code: 'USD' }), `${path} formatCurrency`).not.toMatch(FORBIDDEN);
    expect(formatROI(value), `${path} formatROI`).not.toMatch(FORBIDDEN);
    expect(formatUSD(value), `${path} formatUSD`).not.toMatch(FORBIDDEN);
    expect(formatBTC(value), `${path} formatBTC`).not.toMatch(FORBIDDEN);
    expect(formatCompactNumber(value), `${path} formatCompactNumber`).not.toMatch(FORBIDDEN);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((v, i) => assertRendersSafely(v, `${path}[${i}]`));
    return;
  }
  if (typeof value === 'object') {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      assertRendersSafely(v, `${path}.${k}`);
    }
  }
}

/** Fields whose type is `number | null` must never be a non-finite number. */
function assertNullableFinite(value: number | null | undefined, label: string): void {
  if (value == null) return;
  expect(Number.isFinite(value), `${label} must be finite or null, got ${value}`).toBe(true);
}

describe('extreme-input regression: no calculator leaks Infinity/NaN to the UI', () => {
  describe('profitLossCalculator', () => {
    it('returns null for empty purchases and zero sell price', () => {
      expect(calculateProfitLoss([], 50_000, 0.1)).toBeNull();
      const p: Purchase = { id: '1', amount: 1000, pricePerBtc: 20_000, btcAmount: 0.05, buyFeePercent: 0 };
      expect(calculateProfitLoss([p], 0, 0.1)).toBeNull();
    });

    it('renders safely for huge sell price against tiny cost basis', () => {
      const p: Purchase = { id: '1', amount: 1, pricePerBtc: 1e-6, btcAmount: 1e6, buyFeePercent: 0 };
      const r = calculateProfitLoss([p], 1_000_000, 0.1);
      expect(r).not.toBeNull();
      assertRendersSafely(r);
    });
  });

  describe('cagrCalculator', () => {
    it('collapses degenerate CAGR inputs to 0 (never NaN/Infinity)', () => {
      expect(calculateCAGR(0, 100, 5)).toBe(0);
      expect(calculateCAGR(100, 0, 5)).toBe(0);
      expect(calculateCAGR(100, 100, 0)).toBe(0);
      expect(calculateCAGR(-1, 100, 5)).toBe(0);
    });

    it('projects investment with 0 years and known assets without leaking', () => {
      const r = projectInvestment({ investmentAmount: 1000, years: 0, includeAssets: ['BTC', 'SPY'] });
      assertRendersSafely(r);
    });
  });

  describe('investmentProjectionCalculator', () => {
    it('handles 0% rate, 0 years, and huge rate without producing non-finite numbers', () => {
      const cases: Array<[string, number]> = [
        ['lump 0%/0y', futureValueLumpSum(1000, 0, 0)],
        ['annuity 0%/5y', futureValueAnnuity(100, 0, 5)],
        ['combined huge rate', futureValueCombined(1000, 100, 10, 30)],
        ['inflation 0y', adjustForInflation(1000, 0.03, 0)],
      ];
      for (const [label, v] of cases) {
        expect(Number.isFinite(v), `${label} => ${v}`).toBe(true);
      }
    });
  });

  describe('averageBuyPriceCalculator', () => {
    it('returns null for empty / zero-price input', () => {
      expect(calculateAverageBuyPrice([], 50_000)).toBeNull();
      expect(
        calculateAverageBuyPrice(
          [{ id: '1', btcAmount: 1, pricePerBtc: 20_000 }],
          0,
        ),
      ).toBeNull();
    });

    it('renders safely for tiny cost basis vs huge live price', () => {
      const r = calculateAverageBuyPrice(
        [{ id: '1', btcAmount: 1e6, pricePerBtc: 1e-6 }],
        1_000_000,
      );
      expect(r).not.toBeNull();
      assertRendersSafely(r);
    });
  });

  describe('lightningFeeCalculator', () => {
    it('renders safely for zero-amount payments', () => {
      const fee = calculateLightningFee(
        { amountSats: 0, estimatedHops: 3, baseFeePerHop: 1000, feeRatePpm: 1 },
        60_000,
      );
      assertRendersSafely(fee);
    });

    it('breakEvenDays is null (never Infinity) for unprofitable channels', () => {
      const econ = calculateChannelEconomics(0, 0, 0, 60_000);
      assertNullableFinite(econ.breakEvenDays, 'econ.breakEvenDays');
      assertRendersSafely(econ);

      const econ2 = calculateChannelEconomics(1_000_000, 0, 0, 60_000);
      assertNullableFinite(econ2.breakEvenDays, 'econ2.breakEvenDays');
      assertRendersSafely(econ2);
    });
  });

  describe('miningProfitabilityCalculator', () => {
    const base: MiningParams = {
      hashRate: 100,
      powerConsumption: 3000,
      electricityCost: 0.1,
      poolFee: 2,
      hardwareCost: 5000,
      bitcoinPrice: 60_000,
      networkDifficulty: 1e14,
      blockReward: 3.125,
      difficultyAdjustment: 3.5,
      currency: 'USD',
    };

    it('unprofitable rig yields null breakEvenDays and safe render', () => {
      const r = MiningProfitabilityCalculator.calculate({
        ...base,
        electricityCost: 100, // absurd $/kWh → deeply unprofitable
      });
      assertNullableFinite(r.breakEvenDays, 'mining.breakEvenDays');
      assertRendersSafely(r);
    });

    it('zero hardware cost does not blow up ROI/cost-per-BTC', () => {
      const r = MiningProfitabilityCalculator.calculate({ ...base, hardwareCost: 0 });
      assertRendersSafely(r);
    });
  });

  describe('leverageLiquidationCalculator', () => {
    it('extreme leverage on tiny margin renders safely', () => {
      const r = leverageLiquidationCalculator.calculatePosition(
        {
          entryPrice: 60_000,
          positionType: 'long',
          leverage: 125,
          marginAmount: 1,
          maintenanceMargin: 0.5,
          takeProfitPercent: 5000,
          stopLossPercent: 99,
        },
        60_000,
      );
      assertRendersSafely(r);
    });

    it('short position with maxed leverage renders safely', () => {
      const r = leverageLiquidationCalculator.calculatePosition(
        {
          entryPrice: 60_000,
          positionType: 'short',
          leverage: 100,
          marginAmount: 10,
          maintenanceMargin: 0.5,
        },
        60_000,
      );
      assertRendersSafely(r);
    });
  });

  describe('inheritanceTaxCalculator', () => {
    it('zero estate value and zero cost basis do not create NaN effective rates', () => {
      const r = calculateInheritanceTax(0, 0, 0, 60_000, 0, 'single', 'CA');
      assertRendersSafely(r);
    });

    it('huge estate with tiny BTC share renders safely', () => {
      const r = calculateInheritanceTax(0.0001, 20_000, 10_000, 60_000, 1e12, 'married', 'NY');
      assertRendersSafely(r);
    });
  });

  describe('bitcoinSavingsCalculator', () => {
    it('zero BTC price does not divide by zero in sats-per-dollar', () => {
      const r = calculateAccumulation({
        income: 5000,
        savingsMode: 'percentage',
        fixedAmount: 0,
        savingsPercentage: 10,
        frequency: 'monthly',
        currentBtcPrice: 0,
        annualGrowthRate: 0.5,
        timeHorizonMonths: 12,
        savingsAccountAPY: 4,
      });
      assertRendersSafely(r);
    });

    it('extreme growth rate renders safely', () => {
      const r = calculateAccumulation({
        income: 5000,
        savingsMode: 'fixed',
        fixedAmount: 500,
        savingsPercentage: 0,
        frequency: 'monthly',
        currentBtcPrice: 60_000,
        annualGrowthRate: 10, // 1000% annual
        timeHorizonMonths: 240,
        savingsAccountAPY: 4,
      });
      assertRendersSafely(r);
    });
  });

  describe('riskAnalyzer', () => {
    it('flat price series produces null Sortino/Calmar, never Infinity', () => {
      const flat: BitcoinPrice[] = Array.from({ length: 30 }, (_, i) => ({
        date: `2024-01-${String(i + 1).padStart(2, '0')}`,
        price: 60_000,
        volume: 0,
        marketCap: 0,
      }));
      const r = RiskAnalyzer.calculateRiskMetrics(flat);
      assertNullableFinite(r.sortinoRatio, 'sortinoRatio');
      assertNullableFinite(r.calmarRatio, 'calmarRatio');
      // Every non-nullable metric on RiskMetrics must be a finite number.
      for (const k of ['volatility', 'sharpeRatio', 'maxDrawdown', 'averageReturn', 'standardDeviation'] as const) {
        expect(Number.isFinite(r[k]), `${k} must be finite (got ${r[k]})`).toBe(true);
      }
    });
  });
});
