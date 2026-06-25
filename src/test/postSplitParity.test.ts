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
