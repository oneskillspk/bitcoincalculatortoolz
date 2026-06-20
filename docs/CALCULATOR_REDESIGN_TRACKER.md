# Calculator Redesign Tracker

Per-calculator phase status for the template rollout defined in
[`CALCULATOR_TEMPLATE_SPEC.md`](./CALCULATOR_TEMPLATE_SPEC.md).

Update this file at the end of every phase. One row per phase. Keep `Diff`
short (commit SHA, PR #, or `src/...` glob). Use the legend below for status.

## Legend

| Symbol | Meaning |
| --- | --- |
| ☐ | Not started |
| ◐ | In progress |
| ☑ | Phase complete, verified |
| ⚠ | Complete with caveat — see Notes |
| — | N/A for this calculator |

### Phase columns (P1–P8) map 1:1 to spec §8

P1 prep · P2 zones · P3 redundancy · P4 bugs · P5 inputs ·
P6 results metric · P7 internal links · P8 final QA

### Checklist columns (C1–C10) map 1:1 to spec §9

C1 zones · C2 no-dupes · C3 no TR end-dupe · C4 slider parity ·
C5 localized labels · C6 FAQ parity · C7 honest progress · C8 mobile parity ·
C9 localized links · C10 schema audit clean

---

## Template — copy when starting a new calculator

```md
### <Calculator Name> — `src/pages/<File>.tsx`

| Phase | Status | Diff | Notes |
| --- | --- | --- | --- |
| P1 prep | ☐ | | |
| P2 zones | ☐ | | |
| P3 redundancy | ☐ | | |
| P4 bugs | ☐ | | |
| P5 inputs | ☐ | | |
| P6 progress metric | ☐ | | |
| P7 internal links | ☐ | | |
| P8 final QA | ☐ | | |

Checklist: C1 ☐ · C2 ☐ · C3 ☐ · C4 ☐ · C5 ☐ · C6 ☐ · C7 ☐ · C8 ☐ · C9 ☐ · C10 ☐

Sanity test (P6): _inputs → expected %_
Playwright specs: ☐ visual · ☐ mobile-audit
```

---

## Reference pass (complete) — Bitcoin Retirement Calculator

| Phase | Status | Diff | Notes |
| --- | --- | --- | --- |
| P1–P8 | ☑ | `src/pages/BitcoinRetirementCalculator.tsx`, `src/components/retirement/*` | Template source-of-truth pass. |

Checklist: C1 ☑ · C2 ☑ · C3 ☑ · C4 ☑ · C5 ☑ · C6 ☑ · C7 ☑ · C8 ☑ · C9 ☑ · C10 ☑

Playwright specs: ☑ `e2e/retirement-results-visual.spec.ts` · ☑ `e2e/retirement-mobile-audit.spec.ts` · ☑ `e2e/retirement-tables-sticky.spec.ts`

---

## Remaining calculators (45)

Slugs sourced from `src/data/calculatorMeta.ts`. Order is the rollout queue —
adjust by editing the headings, not by reshuffling rows mid-pass.

### 1. DCA Calculator — `dca`

| Phase | Status | Diff | Notes |
| --- | --- | --- | --- |
| P1 prep | ☐ | | |
| P2 zones | ☐ | | |
| P3 redundancy | ☐ | | |
| P4 bugs | ☐ | | |
| P5 inputs | ☐ | | |
| P6 progress metric | ☐ | | |
| P7 internal links | ☐ | | |
| P8 final QA | ☐ | | |

Checklist: C1 ☐ · C2 ☐ · C3 ☐ · C4 ☐ · C5 ☐ · C6 ☐ · C7 ☐ · C8 ☐ · C9 ☐ · C10 ☐
Sanity test (P6): _tbd_
Playwright specs: ☐ visual · ☐ mobile-audit

### 2. Lump Sum vs DCA — `lump-sum-vs-dca`

| Phase | Status | Diff | Notes |
| --- | --- | --- | --- |
| P1–P8 | ☐ | | |

Checklist: C1 ☐ · C2 ☐ · C3 ☐ · C4 ☐ · C5 ☐ · C6 ☐ · C7 ☐ · C8 ☐ · C9 ☐ · C10 ☐
Playwright specs: ☐ visual · ☐ mobile-audit

### 3. Bitcoin Savings — `bitcoin-savings`

| Phase | Status | Diff | Notes |
| --- | --- | --- | --- |
| P1–P8 | ☐ | | |

Checklist: C1 ☐ · C2 ☐ · C3 ☐ · C4 ☐ · C5 ☐ · C6 ☐ · C7 ☐ · C8 ☐ · C9 ☐ · C10 ☐
Playwright specs: ☐ visual · ☐ mobile-audit

### 4. Halving Countdown — `halving-countdown`

| Phase | Status | Diff | Notes |
| --- | --- | --- | --- |
| P1–P8 | ☐ | | |

Checklist: C1 ☐ · C2 ☐ · C3 ☐ · C4 ☐ · C5 ☐ · C6 ☐ · C7 ☐ · C8 ☐ · C9 ☐ · C10 ☐
Playwright specs: ☐ visual · ☐ mobile-audit

### 5. Mining Profitability — `mining-profitability`

| Phase | Status | Diff | Notes |
| --- | --- | --- | --- |
| P1–P8 | ☐ | | |

Checklist: C1 ☐ · C2 ☐ · C3 ☐ · C4 ☐ · C5 ☐ · C6 ☐ · C7 ☐ · C8 ☐ · C9 ☐ · C10 ☐
Playwright specs: ☐ visual · ☐ mobile-audit

### 6. What If Calculator — `what-if`

| Phase | Status | Diff | Notes |
| --- | --- | --- | --- |
| P1–P8 | ☐ | | |

Checklist: C1 ☐ · C2 ☐ · C3 ☐ · C4 ☐ · C5 ☐ · C6 ☐ · C7 ☐ · C8 ☐ · C9 ☐ · C10 ☐
Playwright specs: ☐ visual · ☐ mobile-audit

### 7. Profit & Loss — `profit-loss`

| Phase | Status | Diff | Notes |
| --- | --- | --- | --- |
| P1–P8 | ☐ | | |

Checklist: C1 ☐ · C2 ☐ · C3 ☐ · C4 ☐ · C5 ☐ · C6 ☐ · C7 ☐ · C8 ☐ · C9 ☐ · C10 ☐
Playwright specs: ☐ visual · ☐ mobile-audit

### 8. Capital Gains Tax — `capital-gains-tax`

| Phase | Status | Diff | Notes |
| --- | --- | --- | --- |
| P1–P8 | ☐ | | |

Checklist: C1 ☐ · C2 ☐ · C3 ☐ · C4 ☐ · C5 ☐ · C6 ☐ · C7 ☐ · C8 ☐ · C9 ☐ · C10 ☐
Playwright specs: ☐ visual · ☐ mobile-audit

### 9. Investment Calculator — `investment`

| Phase | Status | Diff | Notes |
| --- | --- | --- | --- |
| P1–P8 | ☐ | | |

Checklist: C1 ☐ · C2 ☐ · C3 ☐ · C4 ☐ · C5 ☐ · C6 ☐ · C7 ☐ · C8 ☐ · C9 ☐ · C10 ☐
Playwright specs: ☐ visual · ☐ mobile-audit

### 10. Fear & Greed Index — `fear-greed-index`

| Phase | Status | Diff | Notes |
| --- | --- | --- | --- |
| P1–P8 | ☐ | | |

Checklist: C1 ☐ · C2 ☐ · C3 ☐ · C4 ☐ · C5 ☐ · C6 ☐ · C7 ☐ · C8 ☐ · C9 ☐ · C10 ☐
Playwright specs: ☐ visual · ☐ mobile-audit

### 11. Retirement Planner — `retirement`

> Distinct from the Bitcoin Retirement Calculator reference pass. Audit
> separately and confirm no shared component drift introduced.

| Phase | Status | Diff | Notes |
| --- | --- | --- | --- |
| P1–P8 | ☐ | | |

Checklist: C1 ☐ · C2 ☐ · C3 ☐ · C4 ☐ · C5 ☐ · C6 ☐ · C7 ☐ · C8 ☐ · C9 ☐ · C10 ☐
Playwright specs: ☐ visual · ☐ mobile-audit

### 12. Bitcoin Converter — `bitcoin-converter`

| Phase | Status | Diff | Notes |
| --- | --- | --- | --- |
| P1–P8 | ☐ | | |

Checklist: C1 ☐ · C2 ☐ · C3 ☐ · C4 ☐ · C5 ☐ · C6 ☐ · C7 ☐ · C8 ☐ · C9 ☐ · C10 ☐
Playwright specs: ☐ visual · ☐ mobile-audit

### 13. Stack Sats Goal — `stack-sats`

| Phase | Status | Diff | Notes |
| --- | --- | --- | --- |
| P1–P8 | ☐ | | |

Checklist: C1 ☐ · C2 ☐ · C3 ☐ · C4 ☐ · C5 ☐ · C6 ☐ · C7 ☐ · C8 ☐ · C9 ☐ · C10 ☐
Playwright specs: ☐ visual · ☐ mobile-audit

### 14. HODL Strategy — `hodl-strategy`

| Phase | Status | Diff | Notes |
| --- | --- | --- | --- |
| P1–P8 | ☐ | | |

Checklist: C1 ☐ · C2 ☐ · C3 ☐ · C4 ☐ · C5 ☐ · C6 ☐ · C7 ☐ · C8 ☐ · C9 ☐ · C10 ☐
Playwright specs: ☐ visual · ☐ mobile-audit

### 15. Transaction Fees — `transaction-fees`

| Phase | Status | Diff | Notes |
| --- | --- | --- | --- |
| P1–P8 | ☐ | | |

Checklist: C1 ☐ · C2 ☐ · C3 ☐ · C4 ☐ · C5 ☐ · C6 ☐ · C7 ☐ · C8 ☐ · C9 ☐ · C10 ☐
Playwright specs: ☐ visual · ☐ mobile-audit

### 16. Purchasing Power — `purchasing-power`

| Phase | Status | Diff | Notes |
| --- | --- | --- | --- |
| P1–P8 | ☐ | | |

Checklist: C1 ☐ · C2 ☐ · C3 ☐ · C4 ☐ · C5 ☐ · C6 ☐ · C7 ☐ · C8 ☐ · C9 ☐ · C10 ☐
Playwright specs: ☐ visual (`e2e/purchasing-power-visual.spec.ts` already exists) · ☐ mobile-audit

### 17. Average Buy Price — `average-buy-price`

| Phase | Status | Diff | Notes |
| --- | --- | --- | --- |
| P1–P8 | ☐ | | |

Checklist: C1 ☐ · C2 ☐ · C3 ☐ · C4 ☐ · C5 ☐ · C6 ☐ · C7 ☐ · C8 ☐ · C9 ☐ · C10 ☐
Playwright specs: ☐ visual · ☐ mobile-audit

### 18. Wealth Percentile — `wealth-percentile`

| Phase | Status | Diff | Notes |
| --- | --- | --- | --- |
| P1–P8 | ☐ | | |

Checklist: C1 ☐ · C2 ☐ · C3 ☐ · C4 ☐ · C5 ☐ · C6 ☐ · C7 ☐ · C8 ☐ · C9 ☐ · C10 ☐
Playwright specs: ☐ visual · ☐ mobile-audit

### 19. BTC vs Assets — `btc-vs-assets`

| Phase | Status | Diff | Notes |
| --- | --- | --- | --- |
| P1–P8 | ☐ | | |

Checklist: C1 ☐ · C2 ☐ · C3 ☐ · C4 ☐ · C5 ☐ · C6 ☐ · C7 ☐ · C8 ☐ · C9 ☐ · C10 ☐
Playwright specs: ☐ visual · ☐ mobile-audit

### 20. BTC vs Real Estate — `btc-vs-real-estate`

| Phase | Status | Diff | Notes |
| --- | --- | --- | --- |
| P1–P8 | ☐ | | |

Checklist: C1 ☐ · C2 ☐ · C3 ☐ · C4 ☐ · C5 ☐ · C6 ☐ · C7 ☐ · C8 ☐ · C9 ☐ · C10 ☐
Playwright specs: ☐ visual · ☐ mobile-audit

### 21. BTC Dominance Tracker — `dominance`

| Phase | Status | Diff | Notes |
| --- | --- | --- | --- |
| P1–P8 | ☐ | | |

Checklist: C1 ☐ · C2 ☐ · C3 ☐ · C4 ☐ · C5 ☐ · C6 ☐ · C7 ☐ · C8 ☐ · C9 ☐ · C10 ☐
Playwright specs: ☐ visual · ☐ mobile-audit

### 22. Rainbow Chart — `rainbow-chart`

| Phase | Status | Diff | Notes |
| --- | --- | --- | --- |
| P1–P8 | ☐ | | |

Checklist: C1 ☐ · C2 ☐ · C3 ☐ · C4 ☐ · C5 ☐ · C6 ☐ · C7 ☐ · C8 ☐ · C9 ☐ · C10 ☐
Playwright specs: ☐ visual · ☐ mobile-audit

### 23. Drawdown Calculator — `drawdown`

| Phase | Status | Diff | Notes |
| --- | --- | --- | --- |
| P1–P8 | ☐ | | |

Checklist: C1 ☐ · C2 ☐ · C3 ☐ · C4 ☐ · C5 ☐ · C6 ☐ · C7 ☐ · C8 ☐ · C9 ☐ · C10 ☐
Playwright specs: ☐ visual · ☐ mobile-audit

### 24. Volatility Calculator — `volatility`

| Phase | Status | Diff | Notes |
| --- | --- | --- | --- |
| P1–P8 | ☐ | | |

Checklist: C1 ☐ · C2 ☐ · C3 ☐ · C4 ☐ · C5 ☐ · C6 ☐ · C7 ☐ · C8 ☐ · C9 ☐ · C10 ☐
Playwright specs: ☐ visual · ☐ mobile-audit

### 25. Power Law Calculator — `power-law`

| Phase | Status | Diff | Notes |
| --- | --- | --- | --- |
| P1–P8 | ☐ | | |

Checklist: C1 ☐ · C2 ☐ · C3 ☐ · C4 ☐ · C5 ☐ · C6 ☐ · C7 ☐ · C8 ☐ · C9 ☐ · C10 ☐
Playwright specs: ☐ visual · ☐ mobile-audit

### 26. Stock-to-Flow Model — `stock-to-flow`

| Phase | Status | Diff | Notes |
| --- | --- | --- | --- |
| P1–P8 | ☐ | | |

Checklist: C1 ☐ · C2 ☐ · C3 ☐ · C4 ☐ · C5 ☐ · C6 ☐ · C7 ☐ · C8 ☐ · C9 ☐ · C10 ☐
Playwright specs: ☐ visual · ☐ mobile-audit

### 27. Supply Tracker — `supply`

| Phase | Status | Diff | Notes |
| --- | --- | --- | --- |
| P1–P8 | ☐ | | |

Checklist: C1 ☐ · C2 ☐ · C3 ☐ · C4 ☐ · C5 ☐ · C6 ☐ · C7 ☐ · C8 ☐ · C9 ☐ · C10 ☐
Playwright specs: ☐ visual · ☐ mobile-audit

### 28. On-Chain Metrics — `on-chain`

| Phase | Status | Diff | Notes |
| --- | --- | --- | --- |
| P1–P8 | ☐ | | |

Checklist: C1 ☐ · C2 ☐ · C3 ☐ · C4 ☐ · C5 ☐ · C6 ☐ · C7 ☐ · C8 ☐ · C9 ☐ · C10 ☐
Playwright specs: ☐ visual · ☐ mobile-audit

### 29. Lightning Calculator — `lightning`

| Phase | Status | Diff | Notes |
| --- | --- | --- | --- |
| P1–P8 | ☐ | | |

Checklist: C1 ☐ · C2 ☐ · C3 ☐ · C4 ☐ · C5 ☐ · C6 ☐ · C7 ☐ · C8 ☐ · C9 ☐ · C10 ☐
Playwright specs: ☐ visual · ☐ mobile-audit

### 30. ETF Comparison — `etf`

| Phase | Status | Diff | Notes |
| --- | --- | --- | --- |
| P1–P8 | ☐ | | |

Checklist: C1 ☐ · C2 ☐ · C3 ☐ · C4 ☐ · C5 ☐ · C6 ☐ · C7 ☐ · C8 ☐ · C9 ☐ · C10 ☐
Playwright specs: ☐ visual · ☐ mobile-audit

### 31. SIP Calculator — `sip`

| Phase | Status | Diff | Notes |
| --- | --- | --- | --- |
| P1–P8 | ☐ | | |

Checklist: C1 ☐ · C2 ☐ · C3 ☐ · C4 ☐ · C5 ☐ · C6 ☐ · C7 ☐ · C8 ☐ · C9 ☐ · C10 ☐
Playwright specs: ☐ visual · ☐ mobile-audit

### 32. Pizza Day Calculator — `pizza-day`

| Phase | Status | Diff | Notes |
| --- | --- | --- | --- |
| P1–P8 | ☐ | | |

Checklist: C1 ☐ · C2 ☐ · C3 ☐ · C4 ☐ · C5 ☐ · C6 ☐ · C7 ☐ · C8 ☐ · C9 ☐ · C10 ☐
Playwright specs: ☐ visual · ☐ mobile-audit

### 33. Millionaire Calculator — `millionaire`

| Phase | Status | Diff | Notes |
| --- | --- | --- | --- |
| P1–P8 | ☐ | | |

Checklist: C1 ☐ · C2 ☐ · C3 ☐ · C4 ☐ · C5 ☐ · C6 ☐ · C7 ☐ · C8 ☐ · C9 ☐ · C10 ☐
Playwright specs: ☐ visual · ☐ mobile-audit

### 34. Staking Calculator — `staking`

| Phase | Status | Diff | Notes |
| --- | --- | --- | --- |
| P1–P8 | ☐ | | |

Checklist: C1 ☐ · C2 ☐ · C3 ☐ · C4 ☐ · C5 ☐ · C6 ☐ · C7 ☐ · C8 ☐ · C9 ☐ · C10 ☐
Playwright specs: ☐ visual · ☐ mobile-audit

### 35. Liquidation Calculator — `liquidation`

| Phase | Status | Diff | Notes |
| --- | --- | --- | --- |
| P1–P8 | ☐ | | |

Checklist: C1 ☐ · C2 ☐ · C3 ☐ · C4 ☐ · C5 ☐ · C6 ☐ · C7 ☐ · C8 ☐ · C9 ☐ · C10 ☐
Playwright specs: ☐ visual · ☐ mobile-audit

### 36. Leverage & Liquidation — `leverage-liquidation`

| Phase | Status | Diff | Notes |
| --- | --- | --- | --- |
| P1–P8 | ☐ | | |

Checklist: C1 ☐ · C2 ☐ · C3 ☐ · C4 ☐ · C5 ☐ · C6 ☐ · C7 ☐ · C8 ☐ · C9 ☐ · C10 ☐
Playwright specs: ☐ visual · ☐ mobile-audit

### 37. Obituaries Tracker — `obituaries-tracker`

| Phase | Status | Diff | Notes |
| --- | --- | --- | --- |
| P1–P8 | ☐ | | |

Checklist: C1 ☐ · C2 ☐ · C3 ☐ · C4 ☐ · C5 ☐ · C6 ☐ · C7 ☐ · C8 ☐ · C9 ☐ · C10 ☐
Playwright specs: ☐ visual · ☐ mobile-audit

### 38. Accumulation Score — `bitcoin-accumulation-score`

| Phase | Status | Diff | Notes |
| --- | --- | --- | --- |
| P1–P8 | ☐ | | |

Checklist: C1 ☐ · C2 ☐ · C3 ☐ · C4 ☐ · C5 ☐ · C6 ☐ · C7 ☐ · C8 ☐ · C9 ☐ · C10 ☐
Playwright specs: ☐ visual · ☐ mobile-audit

### 39. Lot Size Calculator — `bitcoin-lot-size`

| Phase | Status | Diff | Notes |
| --- | --- | --- | --- |
| P1–P8 | ☐ | | |

Checklist: C1 ☐ · C2 ☐ · C3 ☐ · C4 ☐ · C5 ☐ · C6 ☐ · C7 ☐ · C8 ☐ · C9 ☐ · C10 ☐
Playwright specs: ☐ visual · ☐ mobile-audit

### 40. Bitcoin Zakat Calculator — `bitcoin-zakat`

| Phase | Status | Diff | Notes |
| --- | --- | --- | --- |
| P1–P8 | ☐ | | |

Checklist: C1 ☐ · C2 ☐ · C3 ☐ · C4 ☐ · C5 ☐ · C6 ☐ · C7 ☐ · C8 ☐ · C9 ☐ · C10 ☐
Playwright specs: ☐ visual · ☐ mobile-audit

### 41. CAGR Calculator — `cagr`

| Phase | Status | Diff | Notes |
| --- | --- | --- | --- |
| P1–P8 | ☐ | | |

Checklist: C1 ☐ · C2 ☐ · C3 ☐ · C4 ☐ · C5 ☐ · C6 ☐ · C7 ☐ · C8 ☐ · C9 ☐ · C10 ☐
Playwright specs: ☐ visual · ☐ mobile-audit

### 42. Price Target — `price-target`

| Phase | Status | Diff | Notes |
| --- | --- | --- | --- |
| P1–P8 | ☐ | | |

Checklist: C1 ☐ · C2 ☐ · C3 ☐ · C4 ☐ · C5 ☐ · C6 ☐ · C7 ☐ · C8 ☐ · C9 ☐ · C10 ☐
Playwright specs: ☐ visual · ☐ mobile-audit

---

## Rollout summary

`LIVE_CALCULATOR_COUNT = 46` (see `src/config/siteStats.ts`).
`calculatorMeta` lists 42 slugs; the remaining 4 live calculators not yet in
the meta map (TimeMachine etc.) must be added to this tracker as they get
queued. Update both this file and `calculatorMeta.ts` in the same pass when
that happens.

- Done: 1 / 46 (Bitcoin Retirement Calculator)
- In progress: 0
- Remaining: 45

Bump these counters at the end of every P8.
