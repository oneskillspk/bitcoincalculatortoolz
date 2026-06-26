# /tr i18n Coverage Report

Generated: 2026-06-26T17:49:46.884Z
Scanner: `scripts/audit-tr-coverage.mjs`

## Translation key parity (`src/translations/index.ts`)

- EN keys: **0**
- TR keys: **0**
- EN keys missing TR value: **0**
- TR values identical to EN (likely untranslated): **0**

## Per-page coverage

Total pages scanned: 43
Total suspect English JSX strings (no `language === 'tr'` or `t()` wrapper on same line): **0**

| Page | useLanguage | TR ternaries | t() calls | Suspect EN | Examples |
|---|---|---:|---:|---:|---|
| BitcoinAccumulationScoreCalculator.tsx | ✅ | 18 | 3 | 0 |  |
| BitcoinArbitrageCalculator.tsx | ✅ | 4 | 22 | 0 |  |
| BitcoinAverageBuyPriceCalculator.tsx | ✅ | 5 | 20 | 0 |  |
| BitcoinCAGRCalculator.tsx | ✅ | 22 | 0 | 0 |  |
| BitcoinCapitalGainsTaxCalculator.tsx | ✅ | 1 | 40 | 0 |  |
| BitcoinConverter.tsx | ✅ | 23 | 0 | 0 |  |
| BitcoinCorrelationCalculator.tsx | ✅ | 5 | 15 | 0 |  |
| BitcoinDCACalculator.tsx | ✅ | 11 | 9 | 0 |  |
| BitcoinDominanceCalculator.tsx | ✅ | 4 | 15 | 0 |  |
| BitcoinDrawdownCalculator.tsx | ✅ | 6 | 20 | 0 |  |
| BitcoinETFCalculator.tsx | ✅ | 24 | 0 | 0 |  |
| BitcoinGermanyTaxCalculator.tsx | ❌ | 0 | 0 | 0 |  |
| BitcoinHODLStrategyCalculator.tsx | ✅ | 70 | 0 | 0 |  |
| BitcoinIndiaTaxCalculator.tsx | ❌ | 0 | 0 | 0 |  |
| BitcoinInflationDashboard.tsx | ✅ | 18 | 0 | 0 |  |
| BitcoinInheritanceTaxCalculator.tsx | ✅ | 5 | 20 | 0 |  |
| BitcoinInvestmentCalculator.tsx | ✅ | 15 | 4 | 0 |  |
| BitcoinLeverageLiquidationCalculator.tsx | ✅ | 5 | 34 | 0 |  |
| BitcoinLoanCalculator.tsx | ✅ | 1 | 14 | 0 |  |
| BitcoinLotSizeCalculator.tsx | ✅ | 5 | 19 | 0 |  |
| BitcoinMiningProfitabilityCalculator.tsx | ✅ | 4 | 27 | 0 |  |
| BitcoinObituariesTracker.tsx | ✅ | 4 | 15 | 0 |  |
| BitcoinPizzaDayCalculator.tsx | ✅ | 3 | 14 | 0 |  |
| BitcoinPortfolioTracker.tsx | ✅ | 3 | 20 | 0 |  |
| BitcoinPowerLawCalculator.tsx | ✅ | 3 | 16 | 0 |  |
| BitcoinPriceTargetCalculator.tsx | ✅ | 26 | 0 | 0 |  |
| BitcoinProfitLossCalculator.tsx | ✅ | 17 | 3 | 0 |  |
| BitcoinPurchasingPowerCalculator.tsx | ✅ | 16 | 0 | 0 |  |
| BitcoinRainbowChart.tsx | ✅ | 5 | 24 | 0 |  |
| BitcoinRetirementCalculator.tsx | ✅ | 6 | 9 | 0 |  |
| BitcoinSIPCalculator.tsx | ✅ | 5 | 15 | 0 |  |
| BitcoinSavingsCalculator.tsx | ✅ | 5 | 16 | 0 |  |
| BitcoinStakingCalculator.tsx | ✅ | 6 | 16 | 0 |  |
| BitcoinSupplyCalculator.tsx | ✅ | 6 | 30 | 0 |  |
| BitcoinTransactionFeeCalculator.tsx | ✅ | 5 | 22 | 0 |  |
| BitcoinUKCGTCalculator.tsx | ❌ | 0 | 0 | 0 |  |
| BitcoinVolatilityCalculator.tsx | ✅ | 4 | 18 | 0 |  |
| BitcoinWealthPercentile.tsx | ✅ | 18 | 0 | 0 |  |
| BitcoinWhatIfCalculator.tsx | ✅ | 12 | 0 | 0 |  |
| BitcoinZakatCalculator.tsx | ✅ | 6 | 17 | 0 |  |
| LightningNetworkFeeCalculator.tsx | ✅ | 7 | 21 | 0 |  |
| LumpSumVsDCACalculator.tsx | ✅ | 24 | 0 | 0 |  |
| StackSatsGoalCalculator.tsx | ✅ | 3 | 24 | 0 |  |

---
Rerun: `node scripts/audit-tr-coverage.mjs`