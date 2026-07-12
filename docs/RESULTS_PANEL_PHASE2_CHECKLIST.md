# Results Panel — Phase 2 Migration Checklist

Audit against `docs/RESULTS_PANEL_SPEC.md`. Scope: 35 result-consuming files under `src/components/**`.

## Systemic issue (fix first — unblocks aria compliance everywhere)

- `src/components/calculator/ResultPanel.tsx` — the props interface does not declare `aria-live` / `aria-atomic` / `aria-label`, and unknown props are not spread onto the root `<section>`. Every panel currently passes these attributes and they are silently dropped. Fix the primitive to accept and forward `React.HTMLAttributes<HTMLElement>` (or explicit aria props) before doing per-panel work.

## P0 — Shell / forbidden legacy class

| File | Violations | Effort |
|---|---|---|
| `bitcoin-arbitrage/BitcoinArbitrageResultsPanel.tsx` | raw `Card` + `glass-morphism-card`, hand-rolled rows, `.toLocaleString` ×10, hardcoded `text-success`/`text-destructive`, no loading/error triad | L |

## P1 — Ad-hoc grids inside `ResultPanel`

| File | Fix | Effort |
|---|---|---|
| `accumulation-score/AccumulationScoreResult.tsx` | Replace `grid grid-cols-2` divs with `ResultsGrid cols={2}` + `ResultCard` (stack, target, gap) | M |
| `cagr/CAGRResultsPanel.tsx` | Convert per-asset metric blocks (44-91) to `ResultsGrid` + `ResultCard`, drop inline `style={{color}}` | M |
| `hodl/HODLResultsPanel.tsx` | Convert strategy comparison (59-82) and Key Insights (83-93) to `ResultsGrid`/`ResultCard` | M |
| `inflation/InflationResultsPanel.tsx` | Wrap Bitcoin-supply / halving numbers (60-115) in `ResultCard` + `ResultsGrid` | M |
| `purchasing-power/PurchasingPowerResultsPanel.tsx` | Convert Top Purchases and Categories (64-110) to `ResultsGrid cols={2}` + `ResultCard` | M |
| `zakat/ZakatResultsPanel.tsx` | Convert zakat-due/not-due summary blocks (81-109) to `ResultHero`/`EmptyState`/`ResultCard` | M |

## P2 — Tone, grid density, formatter, fullValue

### Tone (only one `primary` per panel)

| File | Line(s) | Fix |
|---|---|---|
| `retirement/GoalPlannerResults.tsx` | 130-133 | Reduce 4× `primary` to 1 |
| `retirement/RetirementResults.tsx` | 83-86 | Reduce 4× `primary` to 1 |
| `savings/SavingsResultsPanel.tsx` | 44, 57, 76 | Reduce 3× `primary` to 1 |
| `price-target/PriceTargetResultCards.tsx` | 35, 38, 47, 48 | Reduce 4× `primary`; use `positive`/unset for multiplier / BTC needed |

### Formatter (route through `src/utils/numberFormat.ts` — no `Intl.NumberFormat`, no bespoke `toLocaleString`)

| File | Line(s) |
|---|---|
| `leverage/LeverageResultsPanel.tsx` | 19-20, 227-250 — delete module-level `Intl.NumberFormat` helper |
| `profit-loss/ProfitLossResultsPanel.tsx` | 19-20, 97-250 — delete parallel `formatCurrency`; `disp()` already imported |
| `profit-loss/CostBasisBreakdown.tsx` | 15 |
| `mining/MiningResultsPanel.tsx` | 31, 67 |
| `inflation/InflationResultsPanel.tsx` | 61, 71, 100-107 |
| `purchasing-power/PurchasingPowerResultsPanel.tsx` | 49-59 — remove manual K/M/B compaction |
| `accumulation-score/AccumulationScoreResult.tsx` | 39, 44, 70 |
| `obituaries/ObituariesResultsPanel.tsx` | 44, 64 |
| `power-law/PowerLawResultsPanel.tsx` | 80 |
| `price-target/PriceTargetResultCards.tsx` | 10 |
| `savings/SavingsResultsPanel.tsx` | 29, 42, 55 |
| `stack-sats/StackSatsResultsPanel.tsx` | 90 |
| `transaction-fees/FeeResultsPanel.tsx` | 90, 157 |
| `wealth/WealthPercentileResult.tsx` | 74, 98 |
| `modern/ModernResultsPanel.tsx` | 15, 31-50, 135 — replace `abbreviatedCurrency`/`abbreviatedBtc` with `formatCurrencyDisplay`/`formatBtcDisplay` |

### Grid density

| File | Issue | Fix |
|---|---|---|
| `modern/ModernResultsPanel.tsx` | 7 tiles split into two grids (spec: single `cols=4`) | Merge or add `// spec-exception` |
| `modern/ModernDCAResultsPanel.tsx` | 9 tiles split into two 4-col grids | Merge or annotate |

### Hardcoded colors outside `ResultCard tone`

| File | Line(s) |
|---|---|
| `mining/MiningResultsPanel.tsx` | 118-120 — route margin color through `ResultCard tone` |

## P3 — Triad, aria, nested shell tokens

| File | Violation | Fix |
|---|---|---|
| `bitcoin-arbitrage/BitcoinArbitrageResultsPanel.tsx` | No `Skeleton` loading; empty uses raw icon+text | Add `Skeleton` state, `EmptyState` |
| `retirement/FireModeResults.tsx` (94), `GoalPlannerResults.tsx` (98, 137), `RetirementResults.tsx` (57, 90) | Nested `calc-surface-card` inside an already-mounted `ResultPanel` | Convert to sibling `ResultPanel`s (`space-y-4`) or downgrade to `calc-surface-subtle` |
| `modern/ModernDCAResultsPanel.tsx` | 220-237 — bare `<ResultPanel>` hosts a checkbox toggle (misuse) | Move the tax toggle to the input/options area |
| `profit-loss/CostBasisBreakdown.tsx` | No aria triad (may be false-positive if always nested) | Verify call sites; add aria if rendered standalone |

## Phase 2 execution order (recommended)

1. Fix `ResultPanel` prop forwarding (systemic) — validates aria across all files.
2. P0: rewrite `BitcoinArbitrageResultsPanel`.
3. P1 batch (6 files) — mechanical swap to `ResultsGrid` + `ResultCard`.
4. P2 formatter sweep — one PR replacing all `Intl.NumberFormat` / `toLocaleString` with `numberFormat.ts` helpers.
5. P2 tone/density cleanup.
6. P3 nested-shell and triad fixes.
7. Add CI guards: forbid `glass-morphism-card` outside `src/components/modern/legacy/`, forbid `toLocaleString(` / `new Intl.NumberFormat(` in `src/components/**/*Result*`.

## Open questions

- `profit-loss/CostBasisBreakdown.tsx` — confirm it is always rendered nested inside `ProfitLossResultsPanel`; if so, aria triad inheritance is fine.
- Confirm whether `modern/Modern*ResultsPanel` splits are intentional (dense flagship layout) — if so, annotate as `// spec-exception` rather than merging.

## Totals

- P0: **1 file** (L)
- P1: **6 files** (M each)
- P2: **19 file/violation pairs across 14 files** (mostly S, a few M)
- P3: **6 files** (S–M)
- Systemic primitive fix: **1** (S)
