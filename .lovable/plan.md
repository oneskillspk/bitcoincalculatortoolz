# Calculator Accuracy & Workflow QA

Goal: verify a representative set of live calculators produce mathematically correct results, handle edge cases, and deliver the outputs the user intends — then deliver a written report.

## Scope (first pass, 6 calculators)

Chosen because they cover the main math families on the site:

1. **BTC ⇄ Fiat Converter** — spot-price conversion, sats math
2. **Profit / Loss Calculator** — buy/sell price, fees, ROI %
3. **What-If (Time Machine)** — historical price lookup, gain multiple
4. **DCA Simulator** — periodic contributions, avg cost, portfolio value
5. **Savings Plan (paycheck → sats)** — sats-per-paycheck, projected value, ROI
6. **Retirement / FIRE Mode** — FIRE target, years-to-FIRE across Bear/Base/Bull/Hyper growth scenarios

Second pass (if first pass surfaces issues or user wants more): Tax (US/UK/DE/IN), Inflation Comparison, Halving Countdown, Purchasing Power, Goal Planner.

## Test method per calculator

For each one:

1. **Golden case** — hand-computed inputs with a known correct answer; assert UI matches within rounding tolerance.
2. **Edge cases** — zero, very large, negative-return, breakeven, boundary dates.
3. **Formula audit** — read the underlying service (`src/services/*` and hooks like `useFireCalculations.ts`) and confirm the formula matches its label.
4. **UI parity** — run the flow in the live preview via Playwright, capture the results panel, compare displayed values to the golden number.
5. **i18n check** — spot-check EN vs TR number/currency formatting on one result.

## Deliverable

A single report with, per calculator:

- Inputs used, expected output, actual output, pass/fail
- Formula reference (`file:line`)
- Any discrepancies with severity (Critical / Major / Minor / Cosmetic)
- Suggested fix location if broken

No code changes in this pass — this is a read-only audit. Fixes proposed as a follow-up plan once you review the report.

## Technical notes

- Golden math computed in a scratch Python/JS snippet, not by re-reading the same service (prevents circular validation).
- Live-price calculators (converter, what-if) are tested against the price the app displays at test time, not a hard-coded rate, to isolate formula correctness from data-feed drift.
- Existing vitest suites (`inflationComparisonCalculator.test.ts`, `timeMachineService.test.ts`) will be run as a baseline; failures included in report.

## Question before I start

Do you want me to run the full 6-calculator pass, or start with a specific 1–2 you're most worried about?  Run 6 full calculators