# Results Panel Migration Backlog

Tracks result-surface components that still deviate from
[`RESULTS_PANEL_SPEC.md`](./RESULTS_PANEL_SPEC.md). Each entry is a
**deliberate deferral**, not an unknown gap. New CI guards for the spec
must allow-list these paths until they're migrated.

Preamble rule (spec header): "Deviations require an inline
`// spec-exception: <reason>` comment and a linked follow-up issue."
This doc is the shared follow-up for all P2 stragglers below — link to it
from any allow-list entry.

---

## Cleared (Phase 2, P0 + P1)

- `src/components/bitcoin-arbitrage/BitcoinArbitrageResultsPanel.tsx`
  (cost-waterfall block retains a `spec-exception` comment; see file)
- `src/components/modern/ModernResultsPanel.tsx`
- `src/components/what-if/WhatIfResultsPanel.tsx`
- `src/components/cagr/CAGRResultsPanel.tsx`
- `src/components/inflation/InflationResultsPanel.tsx`
- `src/components/purchasing-power/PurchasingPowerResultsPanel.tsx`
- `src/components/zakat/ZakatResultsPanel.tsx`
- HODL + Accumulation result panels (parent-controller triads landed in
  `BitcoinCAGRCalculator.tsx`, `BitcoinAccumulationScoreCalculator.tsx`,
  `BitcoinZakatCalculator.tsx`).

## Cleared (Phase 3, formatter sweep)

Migrated off `Intl.NumberFormat` / `toLocaleString` inside the panel body.
`formatGroupedInt(value, locale)` was added to `src/utils/numberFormat.ts`
as the sanctioned replacement for locale-aware thousands-separator counts.

- `src/components/hodl/HODLResultsPanel.tsx`
- `src/components/leverage/LeverageResultsPanel.tsx`
- `src/components/mining/MiningResultsPanel.tsx`
- `src/components/profit-loss/ProfitLossResultsPanel.tsx`
- `src/components/price-target/PriceTargetResultCards.tsx`
- `src/components/savings/SavingsResultsPanel.tsx`
- `src/components/obituaries/ObituariesResultsPanel.tsx`
- `src/components/power-law/PowerLawResultsPanel.tsx`
- `src/components/stack-sats/StackSatsResultsPanel.tsx`
- `src/components/transaction-fees/FeeResultsPanel.tsx`
- `src/components/purchasing-power/PurchasingPowerResultsPanel.tsx`
- `src/components/inflation/InflationResultsPanel.tsx`
- `src/components/zakat/ZakatResultsPanel.tsx`
- `src/components/modern/ModernResultsPanel.tsx`
- `src/components/lumpsum-dca/RiskAnalysisPanel.tsx`
- `src/components/price-target/PriceTargetMoonPanel.tsx`
- `src/components/cagr/ReverseCAGRPanel.tsx`
- `src/components/wealth/WealthScenarioPanel.tsx`
- `src/components/etf/ETFSharesToBTCPanel.tsx`
- `src/components/onchain/S2FPanel.tsx`
- `src/components/tax-calculator/UKTaxPanel.tsx`

`formatGroupedDecimal(value, decimals, locale)` was added alongside
`formatGroupedInt` to cover locale-aware thousands + fixed-decimal output
without going through `toLocaleString` / `Intl.NumberFormat`.

---

## Backlog — P2 stragglers (deferred)

Each still uses `glass-morphism-card`, `calc-surface-card`, raw `Card`
shells, or inline `toLocaleString` inside a results surface. Migrate to
`ResultPanel` + `ResultsGrid` + `ResultCard` per spec §§1-3.

### Calculator result panels
- `src/components/lightning/LightningResultsPanel.tsx`
- `src/components/lot-size/LotSizeResultsPanel.tsx`
- `src/components/price-target/PriceTargetMoonPanel.tsx` (shell only; formatter cleared)
- `src/components/staking/StakingResultsPanel.tsx`
- `src/components/tax-calculator/EnhancedTaxResultsPanel.tsx`
- `src/components/tax-calculator/UKTaxPanel.tsx` (shell only; formatter cleared)
- `src/components/wealth/WealthScenarioPanel.tsx` (shell only; formatter cleared)
- `src/components/what-if/WhatIfScenarioInsightsPanel.tsx`
- `src/components/cagr/ReverseCAGRPanel.tsx` (shell only; formatter cleared)
- `src/components/etf/ETFSharesToBTCPanel.tsx` (shell only; formatter cleared)
- `src/components/lumpsum-dca/RiskAnalysisPanel.tsx` (shell only; formatter cleared)
- `src/components/sip/SIPCard.tsx`
- `src/components/onchain/S2FPanel.tsx` (shell only; formatter cleared)

### Metric-card surfaces (would-be `ResultsGrid`)
- `src/components/drawdown/DrawdownMetricCards.tsx`
- `src/components/dominance/DominanceMetricCards.tsx`
- `src/components/supply/SupplyMetricCards.tsx`
- `src/components/onchain/OnChainMetricCard.tsx`

### Retirement suite (needs coordinated pass)
- `src/components/retirement/RetirementResults.tsx`
- `src/components/retirement/GoalPlannerResults.tsx`
- `src/components/retirement/FireModeResults.tsx`

---

## Guard configuration

Until the backlog closes, the following CI rules from spec §10 must
either:
1. Be gated to spec-cleared files only, OR
2. Ship with an explicit allow-list matching the paths above and a
   comment pointing at this document.

Rules affected:
- ESLint no-`glass-morphism-card` outside `legacy/`
- Grep guard: no `toLocaleString(` in `*Results*Panel.tsx` /
  `*ResultCards.tsx`
- Snapshot rule: every `ResultCard` value ≥ 10,000 must pass `fullValue`
