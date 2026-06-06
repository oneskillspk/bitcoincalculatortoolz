# /tr i18n Coverage Report

Generated: 2026-05-25T10:18:00.157Z
Scanner: `scripts/audit-tr-coverage.mjs`

## Translation key parity (`src/translations/index.ts`)

- EN keys: **860**
- TR keys: **860**
- EN keys missing TR value: **0**
- TR values identical to EN (likely untranslated): **24**

### TR = EN (suspected untranslated)

- `about.creator.name` — "Web3Believer"
- `comparison.bitcoin` — "Bitcoin"
- `comparison.sp500` — "S&P 500"
- `hero.bento.priceLabel` — "BTC / USD"
- `staking.hero.titlePrefix` — "Bitcoin"
- `sip.hero.titlePrefix` — "Bitcoin"
- `savings.hero.titlePrefix` — "Bitcoin"
- `inheritance.hero.titlePrefix` — "Bitcoin"
- `cgt.hero.titlePrefix` — "Bitcoin"
- `loan.hero.titlePrefix` — "Bitcoin"
- `avgbuy.hero.titlePrefix` — "Bitcoin"
- `onchain.hero.titlePrefix` — "Bitcoin"
- `dominance.hero.titlePrefix` — "Bitcoin"
- `halving.hero.titlePrefix` — "Bitcoin"
- `powerlaw.hero.titlePrefix` — "Bitcoin"
- `fg.hero.titlePrefix` — "Bitcoin"
- `rainbow.hero.titlePrefix` — "Bitcoin"
- `supply.hero.titlePrefix` — "Bitcoin"
- `mining.h1.pre` — "Bitcoin "
- `txfee.h1.pre` — "Bitcoin "
- `vol.hero.titlePrefix` — "Bitcoin"
- `corr.hero.titlePrefix` — "Bitcoin"
- `lev.hero.titlePrefix` — "Bitcoin"
- `lot.hero.titlePrefix` — "Bitcoin"

## Per-page coverage

Total pages scanned: 40
Total suspect English JSX strings (no `language === 'tr'` or `t()` wrapper on same line): **2**

| Page | useLanguage | TR ternaries | t() calls | Suspect EN | Examples |
|---|---|---:|---:|---:|---|
| BitcoinConverter.tsx | ✅ | 21 | 0 | 1 | `Pi to Bitcoin Calculator` |
| BitcoinRetirementCalculator.tsx | ✅ | 31 | 9 | 1 | `FIRE Hareketi ve Bitcoin` |
| BitcoinAccumulationScoreCalculator.tsx | ✅ | 20 | 3 | 0 |  |
| BitcoinArbitrageCalculator.tsx | ✅ | 6 | 69 | 0 |  |
| BitcoinAverageBuyPriceCalculator.tsx | ✅ | 5 | 20 | 0 |  |
| BitcoinCAGRCalculator.tsx | ✅ | 22 | 0 | 0 |  |
| BitcoinCapitalGainsTaxCalculator.tsx | ✅ | 2 | 40 | 0 |  |
| BitcoinCorrelationCalculator.tsx | ✅ | 5 | 15 | 0 |  |
| BitcoinDCACalculator.tsx | ✅ | 10 | 7 | 0 |  |
| BitcoinDominanceCalculator.tsx | ✅ | 4 | 15 | 0 |  |
| BitcoinDrawdownCalculator.tsx | ✅ | 6 | 20 | 0 |  |
| BitcoinETFCalculator.tsx | ✅ | 24 | 0 | 0 |  |
| BitcoinHODLStrategyCalculator.tsx | ✅ | 70 | 0 | 0 |  |
| BitcoinInflationDashboard.tsx | ✅ | 18 | 0 | 0 |  |
| BitcoinInheritanceTaxCalculator.tsx | ✅ | 5 | 20 | 0 |  |
| BitcoinInvestmentCalculator.tsx | ✅ | 17 | 4 | 0 |  |
| BitcoinLeverageLiquidationCalculator.tsx | ✅ | 5 | 34 | 0 |  |
| BitcoinLoanCalculator.tsx | ✅ | 3 | 47 | 0 |  |
| BitcoinLotSizeCalculator.tsx | ✅ | 5 | 19 | 0 |  |
| BitcoinMiningProfitabilityCalculator.tsx | ✅ | 4 | 27 | 0 |  |
| BitcoinObituariesTracker.tsx | ✅ | 4 | 15 | 0 |  |
| BitcoinPizzaDayCalculator.tsx | ✅ | 3 | 14 | 0 |  |
| BitcoinPortfolioTracker.tsx | ✅ | 2 | 20 | 0 |  |
| BitcoinPowerLawCalculator.tsx | ✅ | 3 | 16 | 0 |  |
| BitcoinPriceTargetCalculator.tsx | ✅ | 26 | 0 | 0 |  |
| BitcoinProfitLossCalculator.tsx | ✅ | 19 | 3 | 0 |  |
| BitcoinPurchasingPowerCalculator.tsx | ✅ | 16 | 0 | 0 |  |
| BitcoinRainbowChart.tsx | ✅ | 5 | 24 | 0 |  |
| BitcoinSIPCalculator.tsx | ✅ | 5 | 15 | 0 |  |
| BitcoinSavingsCalculator.tsx | ✅ | 5 | 16 | 0 |  |
| BitcoinStakingCalculator.tsx | ✅ | 6 | 16 | 0 |  |
| BitcoinSupplyCalculator.tsx | ✅ | 6 | 30 | 0 |  |
| BitcoinTransactionFeeCalculator.tsx | ✅ | 5 | 22 | 0 |  |
| BitcoinVolatilityCalculator.tsx | ✅ | 4 | 18 | 0 |  |
| BitcoinWealthPercentile.tsx | ✅ | 17 | 0 | 0 |  |
| BitcoinWhatIfCalculator.tsx | ✅ | 23 | 0 | 0 |  |
| BitcoinZakatCalculator.tsx | ✅ | 6 | 17 | 0 |  |
| LightningNetworkFeeCalculator.tsx | ✅ | 7 | 21 | 0 |  |
| LumpSumVsDCACalculator.tsx | ✅ | 24 | 0 | 0 |  |
| StackSatsGoalCalculator.tsx | ✅ | 3 | 24 | 0 |  |

---
Rerun: `node scripts/audit-tr-coverage.mjs`