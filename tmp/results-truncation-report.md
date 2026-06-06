# Result Card / Field Truncation & Wrapping Report

Generated after wiring `ResultCard` and `ResultHero` to use a shared
`formatCurrencyDisplay` helper plus a tap-friendly Radix tooltip that
exposes the full precision value (also surfaced via `aria-label` for
screen readers and Playwright assertions).

## Status legend
- ✅ Fully visible — value fits, tooltip exposes full precision
- ⚠️  Truncates with tooltip — abbreviated (K/M/B) on display, full value on hover/tap
- ❌ Still clipping or wrapping mid-digit — needs a follow-up

## Per-route status (desktop ≥1280, mobile 390)

| Route | Component | Desktop | Mobile | Notes |
|---|---|---|---|---|
| `/dca-calculator` | `ModernDCAResultsPanel` hero | ✅ | ⚠️  | Compacts above $100k via `formatCurrencyDisplay`, tooltip shows full |
| `/dca-calculator` | DCA 4-up metric grid | ✅ | ⚠️  | All 4 cards now use `ResultCard` + `fullValue` tooltip |
| `/dca-calculator` | BTC Acquired card | ✅ | ✅ | 4-decimal display, 8-decimal tooltip |
| `/lump-sum-vs-dca` | `ComparisonResultsPanel` hero + side cards | ✅ | ⚠️  | Inherits `ResultHero`/`ResultCard` tooltip behaviour |
| `/retirement` | `GoalPlannerResults` hero | ✅ | ⚠️  | bounded clamp + tooltip via `ResultHero` |
| `/retirement` | `FireModeResults` 3-up grid | ✅ | ⚠️  | bounded clamp + tooltip via `ResultsGrid` |
| `/retirement` | `RetirementResults` (legacy `.calculator-result-value` direct) | ⚠️  | ⚠️  | Uses raw class — full value not in a tooltip yet (see Follow-ups) |
| `/etf-calculator` | `ETFResultsPanel` `StatCard` (local) | ⚠️  | ⚠️  | Uses local `StatCard`, not shared primitive — no tooltip on full value |
| `/sip-calculator` | shared via `ResultCard` | ✅ | ⚠️  | OK |
| `/staking-calculator` | shared via `ResultCard` | ✅ | ⚠️  | OK |
| `/purchasing-power` | shared via `ResultCard` | ✅ | ⚠️  | OK |
| `/inflation-dashboard` | mixed | ✅ | ⚠️  | OK |
| `/wealth-percentile` | shared via `ResultCard` | ✅ | ⚠️  | OK |
| Other calculators using `ResultCard`/`ResultHero` | — | ✅ | ⚠️  | All inherit the new tooltip behaviour automatically |

## What changed

1. **`src/utils/numberFormat.ts` (new)** — single source of truth for
   currency, BTC, and percent formatting. Returns `{ display, full }` so
   every card shows a fitted value and exposes full precision in the
   tooltip.
2. **`src/components/calculator/ResultCard.tsx`** — when `fullValue` is
   provided, the value renders as a focusable `<button>` wrapped in a
   Radix `<Tooltip>`; `aria-label` includes the full value so it is
   reachable on touch devices and by screen readers.
3. **`src/components/calculator/ResultHero.tsx`** — same tooltip
   treatment for the hero number.
4. **`src/components/modern/ModernDCAResultsPanel.tsx`** — switched to
   `formatCurrencyDisplay` + `formatBtcDisplay` so DCA matches the rest
   of the suite (decimals, grouping, hover full value).

## Tests

- `src/utils/__tests__/numberFormat.test.ts` — verifies grouping,
  K/M/B compaction, negative handling, BTC precision, ∞ safety.
- `src/components/calculator/__tests__/ResultCard.test.tsx` — verifies
  the value renders as a button with `aria-label="<label>: <full>"` and
  reveals the tooltip on focus (the path mobile taps + keyboard users
  follow), and falls back to a plain div when no `fullValue` is given.

All 9 tests pass.

## Follow-ups (not done in this pass — flagged for a follow-up)

- `src/components/retirement/RetirementResults.tsx` still uses the raw
  `.calculator-result-value` / `.metric-value` classes directly with no
  tooltip wrapper. Migrate to `ResultHero` + `ResultsGrid`/`ResultCard`
  to inherit the tooltip + standardized formatting.
- `src/components/etf/ETFResultsPanel.tsx` defines a local `StatCard`
  with `text-lg` and no full-value tooltip. Replace with shared
  `ResultCard` + `formatCurrencyDisplay`.
