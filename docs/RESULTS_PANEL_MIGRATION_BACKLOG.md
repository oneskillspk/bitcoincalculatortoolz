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

## Cleared (Phase 4, shell sweep)

Migrated off `Card` / `glass-morphism-card` shells onto `ResultPanel`
(+ `InputPanel` for hybrid controllers). Nested Card blocks collapsed to
`calc-surface-subtle` divs per spec §3.

- `src/components/sip/SIPCard.tsx` (shared wrapper now emits `calc-surface-card`)
- `src/components/onchain/S2FPanel.tsx`
- `src/components/wealth/WealthScenarioPanel.tsx`
- `src/components/tax-calculator/UKTaxPanel.tsx`
- `src/components/price-target/PriceTargetMoonPanel.tsx`
- `src/components/etf/ETFSharesToBTCPanel.tsx`
- `src/components/cagr/ReverseCAGRPanel.tsx`
- `src/components/lumpsum-dca/RiskAnalysisPanel.tsx`
- `src/components/what-if/WhatIfScenarioInsightsPanel.tsx`

The Lightning / LotSize / Staking / EnhancedTax result panels listed in
the earlier P2 block were already on `ResultPanel` — backlog references
were stale and have been dropped below.

---

## Backlog — P2 stragglers (deferred)

Each still uses raw `Card` shells or inline `toLocaleString` inside a
results surface. Migrate to `ResultPanel` + `ResultsGrid` + `ResultCard`
per spec §§1-3.

### Calculator result panels
- (none remaining — Phase 4 cleared the shell set)


### Metric-card surfaces (would-be `ResultsGrid`)
- (none remaining — Phase 5 migrated Drawdown / Dominance / Supply metric
  grids onto `ResultPanel` + `ResultsGrid` + `ResultCard`, and swapped the
  `OnChainMetricCard` shell from `glass-morphism-card` to `calc-surface-subtle`.)

### Retirement suite (needs coordinated pass)
- (none remaining — Phase 6 swapped the nested `calc-surface-card` and
  hand-rolled surface shells inside `RetirementResults`, `GoalPlannerResults`,
  and `FireModeResults` to the spec-approved `calc-surface-subtle` sub-surface,
  and replaced the `glass-morphism-card` disclaimer shell in
  `RetirementZoneFour` with `calc-surface-subtle`. Inputs already use
  `InputPanel`.)

---

## Cleared (Phase 7, formatter sweep — input panels / charts / exports)

Migrated the last remaining `toLocaleString` / `Intl.NumberFormat` calls
in input panels, chart tooltips/axes, export-report builders, and misc
surface components onto `formatGroupedInt` / `formatGroupedDecimal` /
`formatSymbolAmount` from `src/utils/numberFormat.ts`. 52 files touched
in one sweep; the only remaining hits outside sanctioned utils are:
- Date `toLocaleString('default', { month: 'short' })` in
  `OnChainPriceChart.tsx` (date formatting, not number formatting)
- Doc comments in the four cleared result panels

Sanctioned Intl callers (allow-listed by spec §10 as the single
formatting path): `src/utils/formatters.ts`, `formatCurrency.ts`,
`formatMoney.ts`, `formatTRY.ts`, `parseLocaleNumber.ts`,
`components/charts/formatters.ts`, `components/ui/chart.tsx`.

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
