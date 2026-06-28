import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Static audit: every calculator result panel must declare a polite,
 * atomic live region with a descriptive label so screen readers
 * announce updated results without interrupting the user.
 *
 * Valid attribute values (per WAI-ARIA 1.2):
 *   aria-live   ∈ {"polite", "assertive", "off"}   — we require "polite"
 *   aria-atomic ∈ {"true", "false"}                 — we require "true"
 *   aria-label  must be a non-empty string
 */
const RESULT_PANELS = [
  "src/components/accumulation-score/AccumulationScoreResult.tsx",
  "src/components/average-buy-price/AvgBuyResultCards.tsx",
  "src/components/bitcoin-arbitrage/BitcoinArbitrageResultsPanel.tsx",
  "src/components/bitcoin-loan/BitcoinLoanResultsPanel.tsx",
  "src/components/btc-vs-real-estate/BtcVsRealEstateResultsPanel.tsx",
  "src/components/cagr/CAGRResultsPanel.tsx",
  "src/components/etf/ETFResultsPanel.tsx",
  "src/components/hodl/HODLResultsPanel.tsx",
  "src/components/inflation/InflationResultsPanel.tsx",
  "src/components/inheritance-tax/InheritanceTaxResultsPanel.tsx",
  "src/components/investment/InvestmentResultsPanel.tsx",
  "src/components/leverage/LeverageResultsPanel.tsx",
  "src/components/lightning/LightningResultsPanel.tsx",
  "src/components/lot-size/LotSizeResultsPanel.tsx",
  "src/components/lumpsum-dca/ComparisonResultsPanel.tsx",
  "src/components/mining/MiningResultsPanel.tsx",
  "src/components/modern/ModernDCAResultsPanel.tsx",
  "src/components/modern/ModernResultsPanel.tsx",
  "src/components/obituaries/ObituariesResultsPanel.tsx",
  "src/components/power-law/PowerLawResultsPanel.tsx",
  "src/components/price-target/PriceTargetResultCards.tsx",
  "src/components/profit-loss/ProfitLossResultsPanel.tsx",
  "src/components/purchasing-power/PurchasingPowerResultsPanel.tsx",
  "src/components/retirement/RetirementResults.tsx",
  "src/components/retirement/FireModeResults.tsx",
  "src/components/retirement/GoalPlannerResults.tsx",
  "src/components/savings/SavingsResultsPanel.tsx",
  "src/components/sip/SIPResultCards.tsx",
  "src/components/stack-sats/StackSatsResultsPanel.tsx",
  "src/components/staking/StakingResultsPanel.tsx",
  "src/components/tax-calculator/EnhancedTaxResultsPanel.tsx",
  "src/components/timemachine/TimeMachineResultCard.tsx",
  "src/components/transaction-fees/FeeResultsPanel.tsx",
  "src/components/wealth/WealthPercentileResult.tsx",
  "src/components/what-if/WhatIfResultsPanel.tsx",
  "src/components/zakat/ZakatResultsPanel.tsx",
];

const LIVE_VALID = new Set(["polite", "assertive", "off"]);
const ATOMIC_VALID = new Set(["true", "false"]);

function attr(src: string, name: string): string | null {
  const m = src.match(new RegExp(`${name}="([^"]*)"`));
  return m ? m[1] : null;
}

function hasLocalizedLabel(src: string): boolean {
  // matches: aria-label={tr ? "Hesaplama sonucu" : "Calculator result"}
  return /aria-label=\{[^}]*\?\s*["'][^"']+["']\s*:\s*["'][^"']+["'][^}]*\}/.test(src);
}


describe("aria-live audit on calculator result panels", () => {
  it.each(RESULT_PANELS)("%s declares a valid polite live region", (file) => {
    const path = resolve(process.cwd(), file);
    expect(existsSync(path), `missing file: ${file}`).toBe(true);

    const src = readFileSync(path, "utf8");
    const live = attr(src, "aria-live");
    const atomic = attr(src, "aria-atomic");
    const label = attr(src, "aria-label");

    expect(live, `${file}: aria-live missing`).not.toBeNull();
    expect(LIVE_VALID.has(live!), `${file}: invalid aria-live="${live}"`).toBe(true);
    expect(live, `${file}: must be polite (assertive interrupts SR users)`).toBe("polite");

    expect(atomic, `${file}: aria-atomic missing`).not.toBeNull();
    expect(ATOMIC_VALID.has(atomic!), `${file}: invalid aria-atomic="${atomic}"`).toBe(true);
    expect(atomic, `${file}: aria-atomic must be "true"`).toBe("true");

    expect(label, `${file}: aria-label missing`).not.toBeNull();
    expect((label ?? "").trim().length, `${file}: aria-label empty`).toBeGreaterThan(0);
  });
});
