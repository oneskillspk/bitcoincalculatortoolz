/**
 * Calculator Formula Audit — hand-computed golden cases.
 *
 * Each case is verified against a closed-form textbook formula (cited in the
 * comment) and locked in so future refactors can't drift silently.
 *
 * Tolerance: 1e-6 relative for money math, exact for sats / integer counts.
 */
import { describe, it, expect } from 'vitest';

import { DCACalculator } from '../dcaCalculator';
import { createPurchase, calculateProfitLoss } from '../profitLossCalculator';
import { calculateCAGR } from '../cagrCalculator';
import { calculateAverageBuyPrice } from '../averageBuyPriceCalculator';
import {
  calculateSIPFutureValue,
  calculateLumpSumFutureValue,
  calculateSIPResults,
} from '../sipCalculatorService';
import {
  calculateAccumulation,
  calculateSavingsAccountComparison,
  normalizeToMonthly,
  calculateSatsPerDollar,
} from '../bitcoinSavingsCalculator';
import { calculateBitcoinLoan } from '../bitcoinLoanCalculator';
import { lotSizeCalculator } from '../lotSizeCalculator';
import { leverageLiquidationCalculator } from '../leverageLiquidationCalculator';
import {
  toBtc, fromBtc, fiatToBtc, btcToFiat, calculateConversions, BITCOIN_UNITS,
} from '../bitcoinConverterService';
import {
  calculatePizzaHeroData,
  calculateOpportunityCost,
  PIZZA_TRANSACTION,
} from '../pizzaDayCalculatorService';
import {
  calculatePowerLawPrice,
  getDaysSinceGenesis,
  GENESIS_DATE,
} from '../powerLawCalculator';
import { calculateZakat } from '../zakatCalculator';
import {
  calculateForward,
  calculateReverse,
} from '../priceTargetCalculator';

const close = (got: number, want: number, rel = 1e-6) => {
  if (want === 0) {
    expect(Math.abs(got)).toBeLessThan(1e-9);
  } else {
    expect(Math.abs((got - want) / want)).toBeLessThan(rel);
  }
};

// ─────────────────────────────────────────────────────────────
// 1. Bitcoin Converter — unit math
// ─────────────────────────────────────────────────────────────
describe('bitcoinConverterService', () => {
  it('unit multipliers match Bitcoin spec', () => {
    expect(BITCOIN_UNITS.btc.multiplier).toBe(1);
    expect(BITCOIN_UNITS.mbtc.multiplier).toBe(1_000);
    expect(BITCOIN_UNITS.bits.multiplier).toBe(1_000_000);
    expect(BITCOIN_UNITS.sats.multiplier).toBe(100_000_000);
  });
  it('1 BTC == 100_000_000 sats roundtrip', () => {
    expect(fromBtc(1, 'sats')).toBe(100_000_000);
    expect(toBtc(100_000_000, 'sats')).toBe(1);
  });
  it('fiat ↔ btc at $50,000', () => {
    expect(fiatToBtc(50_000, 50_000)).toBe(1);
    expect(btcToFiat(0.5, 50_000)).toBe(25_000);
  });
  it('calculateConversions from fiat at $100k', () => {
    const r = calculateConversions(1000, 'fiat', 100_000);
    expect(r.btc).toBe('0.01');
    expect(r.sats).toBe('1000000');
  });
});

// ─────────────────────────────────────────────────────────────
// 2. Profit / Loss
// ─────────────────────────────────────────────────────────────
describe('profitLossCalculator', () => {
  it('single purchase at $20k, sell at $40k, 0% fees → 100% ROI', () => {
    const p = createPurchase(10_000, 20_000, 0);
    expect(p.btcAmount).toBe(0.5);
    const r = calculateProfitLoss([p], 40_000, 0)!;
    close(r.totalBtcHeld, 0.5);
    close(r.grossProceeds, 20_000);
    close(r.netProfitLoss, 10_000);
    close(r.roiPercent, 100);
    close(r.breakevenPrice, 20_000);
  });
  it('breakeven price accounts for sell fee (1%)', () => {
    const p = createPurchase(1000, 100_000, 0); // 0.01 BTC
    const r = calculateProfitLoss([p], 100_000, 1)!;
    // breakeven = 1000 / (0.01 * 0.99) = 101010.101…
    close(r.breakevenPrice, 1000 / (0.01 * 0.99));
  });
  it('two purchases → weighted average cost basis', () => {
    const p1 = createPurchase(1000, 20_000, 0); // 0.05 BTC
    const p2 = createPurchase(1000, 50_000, 0); // 0.02 BTC
    const r = calculateProfitLoss([p1, p2], 60_000, 0)!;
    close(r.totalBtcHeld, 0.07);
    close(r.weightedAvgCostBasis, 2000 / 0.07);
  });
});

// ─────────────────────────────────────────────────────────────
// 3. Average Buy Price
// ─────────────────────────────────────────────────────────────
describe('averageBuyPriceCalculator', () => {
  it('weighted avg = totalSpent / totalBtc', () => {
    const r = calculateAverageBuyPrice(
      [
        { id: '1', btcAmount: 0.1, pricePerBtc: 20_000 },
        { id: '2', btcAmount: 0.1, pricePerBtc: 40_000 },
      ],
      50_000,
    )!;
    close(r.weightedAvgPrice, 30_000);
    close(r.totalSpent, 6000);
    close(r.currentValue, 10_000);
    close(r.unrealizedPL, 4000);
    close(r.roiPercent, (4000 / 6000) * 100);
  });
});

// ─────────────────────────────────────────────────────────────
// 4. CAGR — (end/start)^(1/n) − 1
// ─────────────────────────────────────────────────────────────
describe('cagrCalculator', () => {
  it('doubles in 1 year → 100% CAGR', () => {
    close(calculateCAGR(100, 200, 1), 100);
  });
  it('10× over 10 years → ~25.89%', () => {
    close(calculateCAGR(1000, 10_000, 10), (Math.pow(10, 0.1) - 1) * 100);
  });
  it('rejects zero/negative', () => {
    expect(calculateCAGR(0, 100, 1)).toBe(0);
    expect(calculateCAGR(100, 0, 1)).toBe(0);
    expect(calculateCAGR(100, 200, 0)).toBe(0);
  });
});

// ─────────────────────────────────────────────────────────────
// 5. SIP — annuity-due future value
// ─────────────────────────────────────────────────────────────
describe('sipCalculatorService', () => {
  it('FV = P·[((1+r)^n−1)/r]·(1+r), r=1%, n=12, P=100', () => {
    // Hand: 100 × ((1.01^12 − 1)/0.01) × 1.01 = 1280.93…
    const got = calculateSIPFutureValue(100, 0.01, 12);
    const r = 0.01, n = 12, P = 100;
    const want = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    close(got, want);
  });
  it('rate = 0 → P × n', () => {
    expect(calculateSIPFutureValue(50, 0, 24)).toBe(1200);
  });
  it('lump-sum FV = PV·(1+r)^n', () => {
    close(calculateLumpSumFutureValue(1000, 0.1, 5), 1000 * Math.pow(1.1, 5));
  });
  it('monthly SIP $100, 12%/yr, 10y produces corpus ≈ $23,234', () => {
    const r = calculateSIPResults({
      amount: 100,
      frequency: 'monthly',
      expectedAnnualReturn: 0.12,
      timePeriodYears: 10,
      inflationRate: null,
    });
    expect(r.totalInvested).toBe(12_000);
    // 100*((1.01^120 - 1)/0.01)*1.01 ≈ 23234.6
    close(r.estimatedCorpus, 100 * ((Math.pow(1.01, 120) - 1) / 0.01) * 1.01, 1e-4);
  });
});

// ─────────────────────────────────────────────────────────────
// 6. Bitcoin Loan — standard amortization
// ─────────────────────────────────────────────────────────────
describe('bitcoinLoanCalculator', () => {
  it('monthly payment matches PMT formula', () => {
    const r = calculateBitcoinLoan({
      btcCollateral: 1,
      btcPrice: 100_000,
      loanAmountUsd: 50_000,
      interestRateAnnual: 12,
      loanTermMonths: 12,
      initialLtv: 50,
      marginCallLtv: 75,
      liquidationLtv: 85,
      expectedBtcGrowthRate: 0,
    });
    // PMT = P·(r·(1+r)^n)/((1+r)^n−1); r=0.01, n=12, P=50000
    const r0 = 0.01, n = 12, P = 50_000;
    const want = P * (r0 * Math.pow(1 + r0, n)) / (Math.pow(1 + r0, n) - 1);
    close(r.monthlyPayment, want, 1e-6);
    close(r.collateralValueUsd, 100_000);
    close(r.currentLtv, 50);
    // liquidation price: 50000/1 / 0.85 = 58823.53
    close(r.liquidationPrice, 50_000 / 0.85);
  });
  it('0% interest → straight-line payment', () => {
    const r = calculateBitcoinLoan({
      btcCollateral: 1, btcPrice: 100_000, loanAmountUsd: 12_000,
      interestRateAnnual: 0, loanTermMonths: 12,
      initialLtv: 50, marginCallLtv: 75, liquidationLtv: 85,
      expectedBtcGrowthRate: 0,
    });
    close(r.monthlyPayment, 1000);
  });
});

// ─────────────────────────────────────────────────────────────
// 7. Lot Size — risk / (sl distance × contract)
// ─────────────────────────────────────────────────────────────
describe('lotSizeCalculator', () => {
  it('Risk $100 on $1000 stop-loss distance with 1 BTC contract → 0.1 lots', () => {
    const r = lotSizeCalculator.calculateLotSize({
      accountBalance: 10_000,
      riskPercent: 1,
      entryPrice: 100_000,
      stopLossPrice: 99_000,
      leverage: 10,
      contractSize: 1,
    });
    expect(r.dollarRisk).toBe(100);
    close(r.recommendedLotSize, 0.1);
    close(r.positionSizeBtc, 0.1);
    close(r.positionValueUsd, 10_000);
    close(r.marginRequired, 1000);
  });
  it('Risk/reward ratio computed from TP distance', () => {
    const r = lotSizeCalculator.calculateLotSize({
      accountBalance: 10_000, riskPercent: 1,
      entryPrice: 100_000, stopLossPrice: 99_000,
      takeProfitPrice: 103_000,
      leverage: 10, contractSize: 1,
    });
    close(r.riskRewardRatio!, 3);
  });
});

// ─────────────────────────────────────────────────────────────
// 8. Leverage Liquidation
// ─────────────────────────────────────────────────────────────
describe('leverageLiquidationCalculator', () => {
  it('Long 10x at $100k, mmr 0.5% → liq ≈ $90,500', () => {
    const liq = leverageLiquidationCalculator.calculateLiquidationPrice(
      100_000, 10, 'long', 0.5,
    );
    // 100000 * (1 - 0.1 + 0.005) = 90,500
    close(liq, 90_500);
  });
  it('Short 5x at $100k, mmr 0.5% → liq ≈ $119,500', () => {
    const liq = leverageLiquidationCalculator.calculateLiquidationPrice(
      100_000, 5, 'short', 0.5,
    );
    close(liq, 100_000 * (1 + 0.2 - 0.005));
  });
  it('PnL: long +10% on $10k position = +$1k', () => {
    close(
      leverageLiquidationCalculator.calculatePnL(100_000, 110_000, 10_000, 'long'),
      1000,
    );
  });
  it('PnL: short −10% on $10k position = +$1k', () => {
    close(
      leverageLiquidationCalculator.calculatePnL(100_000, 90_000, 10_000, 'short'),
      1000,
    );
  });
});

// ─────────────────────────────────────────────────────────────
// 9. Pizza Day
// ─────────────────────────────────────────────────────────────
describe('pizzaDayCalculatorService', () => {
  it('10,000 BTC × $100k = $1B; per pizza $500M', () => {
    const r = calculatePizzaHeroData(100_000);
    expect(r.originalBtcSpent).toBe(10_000);
    close(r.currentValue, 1_000_000_000);
    close(r.costPerPizza, 500_000_000);
    close(r.multiplier, 1_000_000_000 / PIZZA_TRANSACTION.usdValue);
  });
  it('opportunity cost: $100 at $1, now $50k → 100 BTC × $50k = $5M', () => {
    const r = calculateOpportunityCost({
      amountSpent: 100, currentBtcPrice: 50_000, historicalBtcPrice: 1,
      purchaseDate: new Date('2010-01-01'),
    });
    close(r.btcCouldHaveBought, 100);
    close(r.currentValue, 5_000_000);
    close(r.profitMissed, 4_999_900);
  });
});

// ─────────────────────────────────────────────────────────────
// 10. Power Law (Santostasi)
// ─────────────────────────────────────────────────────────────
describe('powerLawCalculator', () => {
  it('days since genesis is monotonic', () => {
    const d1 = getDaysSinceGenesis(new Date('2020-01-03T00:00:00Z'));
    const d2 = getDaysSinceGenesis(new Date('2021-01-03T00:00:00Z'));
    expect(d2 - d1).toBe(366); // 2020 leap year
  });
  it('fairValue = A·days^N matches formula', () => {
    const date = new Date('2024-01-03T00:00:00Z');
    const days = getDaysSinceGenesis(date);
    const A = Math.pow(10, -16.493), N = 5.8;
    const r = calculatePowerLawPrice(date);
    close(r.fairValue, A * Math.pow(days, N), 1e-9);
    close(r.support, r.fairValue / 3);
    close(r.resistance, r.fairValue * 3);
  });
  it('genesis date constant', () => {
    expect(GENESIS_DATE.toISOString().slice(0, 10)).toBe('2009-01-03');
  });
});

// ─────────────────────────────────────────────────────────────
// 11. Zakat (2.5%)
// ─────────────────────────────────────────────────────────────
describe('zakatCalculator', () => {
  const nisab = {
    goldPerGramUsd: 80,
    silverPerGramUsd: 1,
    btcUsd: 100_000,
    goldNisabUsd: 7000,
    silverNisabUsd: 600,
    exchangeRates: { USD: 1, EUR: 1, GBP: 1, TRY: 1, IDR: 1, MYR: 1, PKR: 1, SAR: 1, AED: 1 } as Record<string, number>,
    updatedAt: '2026-01-01',
    isFallback: false,
  };
  const empty = {
    btcAmount: 0, goldGrams: 0, goldPurity: '24K' as const, silverGrams: 0,
    cashOnHand: 0, bankSavings: 0, fixedDeposits: 0, stocksValue: 0, debts: 0,
  };
  it('1 BTC at $100k → above nisab → 2.5% = 0.025 BTC', () => {
    const r = calculateZakat(
      { ...empty, btcAmount: 1 },
      nisab, 'gold', 'USD',
    );
    expect(r.nisabExceeded).toBe(true);
    close(r.zakatDue, 2500);
    close(r.zakatInBtc, 0.025);
  });
  it('below nisab → 0 zakat', () => {
    const r = calculateZakat(
      { ...empty, cashOnHand: 100 },
      nisab, 'silver', 'USD',
    );
    expect(r.nisabExceeded).toBe(false);
    expect(r.zakatDue).toBe(0);
  });
});

// ─────────────────────────────────────────────────────────────
// 12. Savings — note: milestones uses linear /12, accumulation uses compound
// ─────────────────────────────────────────────────────────────
describe('bitcoinSavingsCalculator', () => {
  it('sats per dollar = 1e8 / price', () => {
    expect(calculateSatsPerDollar(100_000)).toBe(1000);
    expect(calculateSatsPerDollar(50_000)).toBe(2000);
  });
  it('normalizeToMonthly: weekly $100 → monthly ≈ $433.33', () => {
    close(normalizeToMonthly(100, 'weekly'), (100 * 52) / 12);
  });
  it('savings-account compounding (0% APY) = pure deposits', () => {
    const r = calculateSavingsAccountComparison(100, 0, 12);
    expect(r.finalBalance).toBe(1200);
    expect(r.totalInterest).toBe(0);
  });
  it('accumulation with 0% growth: BTC purchased monthly = amount/price', () => {
    const r = calculateAccumulation({
      income: 0, savingsPercentage: 0, fixedAmount: 1000, savingsMode: 'fixed',
      frequency: 'monthly', timeHorizonMonths: 12,
      currentBtcPrice: 100_000, annualGrowthRate: 0,
      savingsAccountAPY: 0,
    } as any);
    close(r.totalFiatInvested, 12_000);
    close(r.totalBtcAccumulated, 0.12);
  });
});

// ─────────────────────────────────────────────────────────────
// 13. Price Target
// ─────────────────────────────────────────────────────────────
describe('priceTargetCalculator', () => {
  it('forward: 0.5 BTC at $200k target → $100k portfolio, 2x multiplier from $100k live', () => {
    const r = calculateForward(0.5, 200_000, 100_000);
    close(r.portfolioValue, 100_000);
    close(r.multiplier, 2);
  });
  it('reverse: need $1M at $200k price → 5 BTC', () => {
    const r = calculateReverse(1_000_000, 200_000, 100_000, 0);
    close(r.btcNeeded, 5);
  });
});

// ─────────────────────────────────────────────────────────────
// 14. DCA — small synthetic price series
// ─────────────────────────────────────────────────────────────
describe('DCACalculator', () => {
  it('flat $20k price, monthly $100 × 12 months → 0.06 BTC at $20k', () => {
    const start = new Date('2024-01-01T00:00:00Z');
    const end = new Date('2024-12-01T00:00:00Z');
    // 12 monthly points all at $20k
    const priceData = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(start);
      d.setUTCMonth(d.getUTCMonth() + i);
      return { date: d.toISOString().slice(0, 10), price: 20_000 };
    });
    const r = DCACalculator.calculateDCA({
      totalAmount: 1200, frequency: 'monthly',
      startDate: start, endDate: end, currency: 'USD',
    }, priceData as any);
    close(r.totalInvested, 1200);
    close(r.totalBitcoin, 1200 / 20_000); // 0.06
    close(r.averageBuyPrice, 20_000);
    close(r.roiPercentage, 0);
  });

  it('respects user totalAmount when some purchase dates fall outside the price dataset', () => {
    // Dataset only covers first 6 months; user requests 12 monthly buys of $10,000 total.
    // Fix: totalInvested must equal the user's requested $10,000, not a silently
    // reduced amount from dropped out-of-range purchases.
    const start = new Date('2024-01-01T00:00:00Z');
    const end = new Date('2024-12-01T00:00:00Z');
    const priceData = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(start);
      d.setUTCMonth(d.getUTCMonth() + i);
      return { date: d.toISOString().slice(0, 10), price: 20_000 };
    });
    const r = DCACalculator.calculateDCA({
      totalAmount: 10_000, frequency: 'monthly',
      startDate: start, endDate: end, currency: 'USD',
    }, priceData as any);
    close(r.totalInvested, 10_000);
  });
});
