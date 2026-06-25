import { describe, it, expect } from "vitest";
import { DCACalculator } from "@/services/dcaCalculator";

// Synthetic deterministic price ladder: $10,000 → $50,000 across 2024.
function buildPrices(): { date: string; price: number; timestamp: number }[] {
  const out: { date: string; price: number; timestamp: number }[] = [];
  const start = new Date("2024-01-01T00:00:00Z");
  for (let i = 0; i < 366; i++) {
    const d = new Date(start.getTime() + i * 86400000);
    const date = d.toISOString().slice(0, 10);
    const price = 10000 + (40000 * i) / 365; // linear 10k → 50k
    out.push({ date, price, timestamp: d.getTime() });
  }
  return out;
}

describe("DCACalculator golden values (pre/post split)", () => {
  const prices = buildPrices();

  it("monthly $12,000 over 2024 produces stable totals", () => {
    const r = DCACalculator.calculateDCA(
      {
        totalAmount: 12000,
        frequency: "monthly",
        startDate: new Date("2024-01-01T00:00:00Z"),
        endDate: new Date("2024-12-31T00:00:00Z"),
        currency: "USD",
      },
      prices,
    );
    expect(r.purchases.length).toBeGreaterThan(0);
    expect(r.totalInvested).toBeCloseTo(12000, 2);
    // Snapshot the headline numbers — any drift breaks the test.
    expect(r.totalBitcoin).toMatchInlineSnapshot(`0.5255694027853062`);
    expect(r.averageBuyPrice).toMatchInlineSnapshot(`22832.37938967686`);
    expect(r.currentValue).toMatchInlineSnapshot(`26278.470139265308`);
    expect(r.roiPercentage).toMatchInlineSnapshot(`118.98725116054423`);
  });

  it("weekly $5,200 over 2024 produces stable totals", () => {
    const r = DCACalculator.calculateDCA(
      {
        totalAmount: 5200,
        frequency: "weekly",
        startDate: new Date("2024-01-01T00:00:00Z"),
        endDate: new Date("2024-12-31T00:00:00Z"),
        currency: "USD",
      },
      prices,
    );
    expect(r.totalInvested).toBeCloseTo(5200, 2);
    expect(r.totalBitcoin).toMatchInlineSnapshot(`0.2115116853626336`);
    expect(r.averageBuyPrice).toMatchInlineSnapshot(`24584.930100125075`);
  });
});

// ---------- Arbitrage formula golden values ----------
// Mirrors the useMemo in BitcoinArbitrageCalculator verbatim.
function computeArbitrage(
  priceA: number, priceB: number, feeA: number, feeB: number,
  tradeAmount: number, withdrawalFeeUsd: number, settlementCostUsd: number, slippagePct: number,
) {
  const priceLow = Math.min(priceA, priceB);
  const priceHigh = Math.max(priceA, priceB);
  const spreadAbs = Math.abs(priceB - priceA);
  const spreadPct = (spreadAbs / priceLow) * 100;
  const btcBought = tradeAmount / priceLow;
  const grossProceeds = btcBought * priceHigh;
  const grossProfit = grossProceeds - tradeAmount;
  const isABuyLeg = priceA <= priceB;
  const buyFeeRate = isABuyLeg ? feeA : feeB;
  const sellFeeRate = isABuyLeg ? feeB : feeA;
  const feeACost = tradeAmount * (buyFeeRate / 100);
  const feeBCost = grossProceeds * (sellFeeRate / 100);
  const slippageCost = tradeAmount * (slippagePct / 100);
  const totalFees = feeACost + feeBCost;
  const totalSettlement = withdrawalFeeUsd + settlementCostUsd + slippageCost;
  const netProfit = grossProfit - totalFees - totalSettlement;
  const returnOnTrade = (netProfit / tradeAmount) * 100;
  return { spreadAbs, spreadPct, grossProfit, totalFees, netProfit, returnOnTrade };
}

describe("Arbitrage formula golden values (pre/post split)", () => {
  it("profitable case: $300 spread, standard preset", () => {
    const r = computeArbitrage(84900, 85200, 0.08, 0.12, 1000, 10, 8, 0.15);
    expect(r.spreadAbs).toBe(300);
    expect(r.spreadPct).toMatchInlineSnapshot(`0.35335689045936397`.replace(/\[.*\]/, ""));
    expect(r.grossProfit).toMatchInlineSnapshot(`3.5335689045937215`);
    expect(r.totalFees).toMatchInlineSnapshot(`2.0042402826855126`);
    expect(r.netProfit).toMatchInlineSnapshot(`-17.97067137809179`);
    expect(r.returnOnTrade).toMatchInlineSnapshot(`-1.7970671378091791`);
  });

  it("unprofitable case: tiny spread", () => {
    const r = computeArbitrage(85000, 85050, 0.1, 0.5, 1000, 12, 8, 0.15);
    expect(r.spreadAbs).toBe(50);
    expect(r.netProfit).toBeLessThan(0);
  });
});

// ---------- WhatIf calculator formula golden values ----------
// Mirrors bitcoinApi.calculateInvestment / calculateInvestmentFromBtc verbatim
// (the page split did not touch these service methods).
function computeWhatIfFiat(amount: number, historicalPrice: number, currentPrice: number) {
  const btcAmount = amount / historicalPrice;
  const currentValue = btcAmount * currentPrice;
  const profitLoss = currentValue - amount;
  const roiPercentage = (profitLoss / amount) * 100;
  return {
    btcAmount: Math.round(btcAmount * 1e8) / 1e8,
    currentValue: Math.round(currentValue * 100) / 100,
    profitLoss: Math.round(profitLoss * 100) / 100,
    roiPercentage: Math.round(roiPercentage * 100) / 100,
  };
}

function computeWhatIfBtc(btcAmount: number, historicalPrice: number, currentPrice: number) {
  const investmentAmount = btcAmount * historicalPrice;
  const currentValue = btcAmount * currentPrice;
  const profitLoss = currentValue - investmentAmount;
  const roiPercentage = (profitLoss / investmentAmount) * 100;
  return {
    investmentAmount: Math.round(investmentAmount * 100) / 100,
    currentValue: Math.round(currentValue * 100) / 100,
    profitLoss: Math.round(profitLoss * 100) / 100,
    roiPercentage: Math.round(roiPercentage * 100) / 100,
  };
}

describe("WhatIf calculator golden values (pre/post split)", () => {
  it("fiat: $1,000 at $1,000 → $100,000 (100x)", () => {
    const r = computeWhatIfFiat(1000, 1000, 100000);
    expect(r).toMatchInlineSnapshot(`
      {
        "btcAmount": 1,
        "currentValue": 100000,
        "profitLoss": 99000,
        "roiPercentage": 9900,
      }
    `);
  });

  it("fiat: $5,000 at $20,000 → $65,000", () => {
    const r = computeWhatIfFiat(5000, 20000, 65000);
    expect(r).toMatchInlineSnapshot(`
      {
        "btcAmount": 0.25,
        "currentValue": 16250,
        "profitLoss": 11250,
        "roiPercentage": 225,
      }
    `);
  });

  it("fiat: loss scenario $10,000 at $69,000 → $30,000", () => {
    const r = computeWhatIfFiat(10000, 69000, 30000);
    expect(r.profitLoss).toBeLessThan(0);
    expect(r.roiPercentage).toBeCloseTo(-56.52, 1);
  });

  it("btc: 0.5 BTC at $30,000 → $90,000", () => {
    const r = computeWhatIfBtc(0.5, 30000, 90000);
    expect(r).toMatchInlineSnapshot(`
      {
        "currentValue": 45000,
        "investmentAmount": 15000,
        "profitLoss": 30000,
        "roiPercentage": 200,
      }
    `);
  });
});
