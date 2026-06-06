# Calculator Accuracy & TR-Locale Audit

_Audit owner: engineering. Source of truth for calculator correctness across EN and TR routes._

## Methodology

- **Formulas:** unit-tested in `src/services/__tests__/*.test.ts` against textbook/closed-form references. **188 tests passing** across 28 service files.
- **TR routes** reuse the EN React components verbatim; only locale, currency, and number formatting differ. Audit therefore checks (1) formula, (2) locale-aware output, (3) locale-aware input parsing.
- **Static analysis:** ripgrep over `src/components` + `src/pages` for `parseFloat`/`Number`/`toLocaleString` usage on user input and display.

---

## Findings — Formula layer

| Severity | ID | Service | Issue | Status |
|---|---|---|---|---|
| 🟡 minor | BUG-001 | `bitcoinSupplyService.getSupplyData` | On exact halving-boundary block heights (840k, 1.05M, …), `nextHalving.blockHeight` returns the **current** boundary instead of `h + 210_000`. Off-by-one bucket. | Awaiting fix sign-off |

All other 27 audited services pass canonical-case, edge-case, and regression tests. No formula-level errors found.

---

## Findings — TR locale & parsing

### 🔴 BUG-101 — `parseFloat` on Turkish-formatted numbers (high impact)

**Files:**
- `src/components/modern/ModernInputPanel.tsx` (lines 79–123, 91–93) — drives **Bitcoin What-If Calculator** EN + `/tr/hesaplayicilar/bitcoin-yatirim-hesaplayici`
- `src/components/modern/ModernDCAInputPanel.tsx` (lines 70–115) — drives **Bitcoin DCA Calculator** EN + `/tr/hesaplayicilar/bitcoin-dca-hesaplayici`

Both panels call:
```ts
parseFloat(value.replace(/,/g, ''))
```

In TR, comma is the decimal separator. A user typing `1,5` (= 1.5) gets parsed as `15`. A user typing `1.234,56` (= 1234.56) gets parsed as `1.23456`. **Off by 10× or worse on the site's two most prominent calculators.**

**Fix:** introduce `parseLocaleNumber(value, locale)` helper that:
- detects `tr-TR` → strips thousands `.`, replaces decimal `,` with `.`, parses
- detects `en-US` → strips thousands `,`, parses

Apply at both `handleCalculate` and `formatAmount`.

### 🟡 BUG-102 — `toLocaleString()` without explicit locale (191 sites)

`toLocaleString()` with no arg uses the **browser** locale, not the URL prefix. A TR user with a US-set browser sees `$1,000.00` on `/tr` instead of `$1.000,00`. Inverse also true.

**Top offenders (display impact):**
- `src/utils/numberFormat.ts` lines 23, 40 — used by every result card (`formatCurrencyDisplay`)
- `src/pages/BitcoinDCACalculator.tsx:463`
- `src/pages/BitcoinWhatIfCalculator.tsx:630`
- `src/pages/BitcoinSupplyCalculator.tsx:233, 237`
- `src/pages/PiToBitcoinCalculator.tsx:283, 291, 322`
- `src/components/cagr/CAGRChart.tsx:56–57`
- `src/components/purchasing-power/PurchasingPower{Chart,Comparison,InputPanel,ResultsPanel}.tsx` (5 sites)
- `src/components/halving/{HalvingCountdownTimer,HalvingProjection,HalvingImpactChart,HalvingTimeline}.tsx` (6 sites)
- `src/components/wealth/{WealthShareSnapshot,WealthPercentileResult}.tsx` (3 sites)
- `src/components/inflation/{HalvingTimeline,MoneyPrinterAnimation}.tsx` (3 sites)

Full count from `rg "toLocaleString\(\)" src/components src/pages src/utils`: **191 sites**. Only 2 explicitly pass `'tr-…'`.

**Fix:** thread `intlLocale` from `useLocale()` through formatters. Update `formatCurrencyDisplay`/`formatBtcDisplay`/`formatPercent` to accept a locale param (similar to `src/components/charts/formatters.ts` which already does). Replace bare `.toLocaleString()` with `.toLocaleString(intlLocale)` at call sites or via a shared helper.

### ✅ No issue — `type="number"` inputs

All ~60 `parseFloat(e.target.value)` calls audited target `<Input type="number">`. The HTML spec normalizes those values to a dotted decimal regardless of locale, so `parseFloat` is safe there. Issue is isolated to the two `type="text"` modern panels above.

### ✅ No issue — `useLocale.ts`

`useLocale()` correctly derives `intlLocale` and `defaultCurrency = 'TRY'` from the URL. Pages that import it get the right context — the bug is downstream formatters that ignore the value.

---

## Service-level coverage matrix

| Service | Tested | File |
|---|---|---|
| accumulationScoreService | ✅ | `__tests__/accumulationScoreService.test.ts` |
| averageBuyPriceCalculator | ✅ | `__tests__/calculator-formulas.test.ts` |
| bitcoinConverterService | ✅ | `__tests__/calculator-formulas.test.ts` |
| bitcoinLoanCalculator | ✅ | `__tests__/calculator-formulas.test.ts` |
| bitcoinSavingsCalculator | ✅ | `__tests__/calculator-formulas.test.ts` |
| bitcoinSupplyService | ⚠️ BUG-001 | `__tests__/bitcoinSupplyService.test.ts` |
| btcVsRealEstateCalculator | ✅ | `__tests__/btcVsRealEstateCalculator.test.ts` |
| cagrCalculator | ✅ | `__tests__/calculator-formulas.test.ts` |
| correlationService | ✅ | `__tests__/correlationService.test.ts` |
| dcaCalculator | ✅ | `__tests__/calculator-formulas.test.ts` |
| dominanceService | ✅ | `__tests__/dominanceService.test.ts` |
| drawdownService | ✅ | `__tests__/drawdownService.test.ts` |
| fearGreedService | ✅ | `__tests__/fearGreedService.test.ts` |
| halvingCountdownService | ✅ | `__tests__/halvingCountdownService.test.ts` |
| hodlStrategyCalculator | ✅ | `__tests__/hodlStrategyCalculator.test.ts` |
| inflationComparisonCalculator | ✅ | `__tests__/inflationComparisonCalculator.test.ts` |
| inheritanceTaxCalculator | ✅ | `__tests__/inheritanceTaxCalculator.test.ts` |
| investmentProjectionCalculator | ✅ | `__tests__/investmentProjectionCalculator.test.ts` |
| leverageLiquidationCalculator | ✅ | `__tests__/calculator-formulas.test.ts` |
| lightningFeeCalculator | ✅ | `__tests__/lightningFeeCalculator.test.ts` |
| lotSizeCalculator | ✅ | `__tests__/calculator-formulas.test.ts` |
| lumpSumDcaComparator | ✅ | `__tests__/lumpSumDcaComparator.test.ts` |
| miningProfitabilityCalculator | ✅ | `__tests__/miningProfitabilityCalculator.test.ts` |
| monteCarloSimulator | ✅ | `__tests__/monteCarloSimulator.test.ts` |
| onChainMetricsService | ✅ | `__tests__/onChainMetricsService.test.ts` |
| pizzaDayCalculatorService | ✅ | `__tests__/calculator-formulas.test.ts` |
| powerLawCalculator | ✅ | `__tests__/calculator-formulas.test.ts` |
| priceTargetCalculator | ✅ | `__tests__/calculator-formulas.test.ts` |
| profitLossCalculator | ✅ | `__tests__/calculator-formulas.test.ts` |
| purchasingPowerCalculator | ✅ | `__tests__/purchasingPowerCalculator.test.ts` |
| rainbowChartService | ✅ | `__tests__/rainbowChartService.test.ts` |
| riskAnalyzer | ✅ | `__tests__/riskAnalyzer.test.ts` |
| sipCalculatorService | ✅ | `__tests__/calculator-formulas.test.ts` |
| stackSatsCalculator | ✅ | `__tests__/stackSatsCalculator.test.ts` |
| stakingCalculator | ✅ | `__tests__/stakingCalculator.test.ts` |
| taxCalculator | ✅ | `__tests__/taxCalculator.test.ts` |
| timeMachineService | ✅ | `__tests__/timeMachineService.test.ts` |
| transactionFeeCalculator | ✅ | `__tests__/transactionFeeCalculator.test.ts` |
| volatilityService | ✅ | `__tests__/volatilityService.test.ts` |
| wealthPercentileService | ✅ | `__tests__/wealthPercentileService.test.ts` |
| zakatCalculator | ✅ | `__tests__/calculator-formulas.test.ts` |
| enhancedTaxCalculator | partial (via taxCalculator) | — |
| assetComparisonService | n/a (data) | — |
| bitcoinObituariesService | n/a (data) | — |
| etfData | n/a (data) | — |
| fiatMoneySupplyService | n/a (data) | — |
| onChainMetricsService (fetch) | n/a (network) | — |

**Tested: 41/46 services. Data-only services not unit-tested by design.**

---

## Recommended fix order

1. **BUG-101** (TR input parsing on DCA & What-If) — highest user impact, smallest patch. Ship `parseLocaleNumber` helper + use in both panels.
2. **BUG-102** (locale-blind `toLocaleString`) — extend `useLocale` consumers to thread `intlLocale` into `formatCurrencyDisplay` and friends. Migrate top 30 display sites first, sweep the rest in a follow-up.
3. **BUG-001** (halving-boundary off-by-one) — guard the boundary case in `bitcoinSupplyService.getSupplyData`.

No formula errors require user-facing corrections beyond these three.
