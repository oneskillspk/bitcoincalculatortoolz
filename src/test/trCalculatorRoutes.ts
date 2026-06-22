/**
 * Phase 9.2 — Canonical /tr calculator route table for the
 * "no stray $ outside [data-currency-exempt]" e2e harness.
 *
 * Tiers:
 *   - strict:  zero "$" allowed outside data-currency-exempt subtrees.
 *              A leak fails the test (and the build).
 *   - soft:    leaks are logged via console.warn, the test still passes.
 *              Use while a calculator family is being localized.
 *   - tracked: route is mounted only to confirm it does not throw on /tr.
 *              "$" count is recorded but never asserted. Default for all
 *              /tr calculator routes that have not yet been localized.
 *
 * Promotion path: tracked → soft → strict. Promote a route by editing this
 * file AND scripts/.tr-currency-tiers.json so the static script and the
 * runtime test agree.
 */
import type { ComponentType } from 'react';

import BitcoinDCACalculator from '@/pages/BitcoinDCACalculator';
import BitcoinProfitLossCalculator from '@/pages/BitcoinProfitLossCalculator';
import BitcoinInvestmentCalculator from '@/pages/BitcoinInvestmentCalculator';
import BitcoinRetirementCalculator from '@/pages/BitcoinRetirementCalculator';
import BitcoinAccumulationScoreCalculator from '@/pages/BitcoinAccumulationScoreCalculator';
import BitcoinPurchasingPowerCalculator from '@/pages/BitcoinPurchasingPowerCalculator';
import BitcoinConverter from '@/pages/BitcoinConverter';
import BitcoinCapitalGainsTaxCalculator from '@/pages/BitcoinCapitalGainsTaxCalculator';
import BitcoinWealthPercentile from '@/pages/BitcoinWealthPercentile';
import BitcoinMiningProfitabilityCalculator from '@/pages/BitcoinMiningProfitabilityCalculator';
import BitcoinRainbowChart from '@/pages/BitcoinRainbowChart';
import BitcoinPriceTargetCalculator from '@/pages/BitcoinPriceTargetCalculator';
import BitcoinPowerLawCalculator from '@/pages/BitcoinPowerLawCalculator';
import BitcoinZakatCalculator from '@/pages/BitcoinZakatCalculator';
import BitcoinHalvingCountdown from '@/pages/BitcoinHalvingCountdown';
import BitcoinAverageBuyPriceCalculator from '@/pages/BitcoinAverageBuyPriceCalculator';
import BitcoinTimeMachine from '@/pages/BitcoinTimeMachine';
import LumpSumVsDCACalculator from '@/pages/LumpSumVsDCACalculator';
import BitcoinCAGRCalculator from '@/pages/BitcoinCAGRCalculator';
import BitcoinVolatilityCalculator from '@/pages/BitcoinVolatilityCalculator';
import BitcoinCorrelationCalculator from '@/pages/BitcoinCorrelationCalculator';
import BitcoinArbitrageCalculator from '@/pages/BitcoinArbitrageCalculator';
import BitcoinLotSizeCalculator from '@/pages/BitcoinLotSizeCalculator';
import BitcoinLeverageLiquidationCalculator from '@/pages/BitcoinLeverageLiquidationCalculator';
import BitcoinTransactionFeeCalculator from '@/pages/BitcoinTransactionFeeCalculator';
import BitcoinSIPCalculator from '@/pages/BitcoinSIPCalculator';
import BitcoinETFCalculator from '@/pages/BitcoinETFCalculator';
import BitcoinSavingsCalculator from '@/pages/BitcoinSavingsCalculator';
import BitcoinPortfolioTracker from '@/pages/BitcoinPortfolioTracker';
import StackSatsGoalCalculator from '@/pages/StackSatsGoalCalculator';
import BitcoinOnChainDashboard from '@/pages/BitcoinOnChainDashboard';
import BitcoinIndiaTaxCalculator from '@/pages/BitcoinIndiaTaxCalculator';
import BitcoinUKCGTCalculator from '@/pages/BitcoinUKCGTCalculator';
import BitcoinGermanyTaxCalculator from '@/pages/BitcoinGermanyTaxCalculator';
import BitcoinInflationDashboard from '@/pages/BitcoinInflationDashboard';
import BitcoinHODLStrategyCalculator from '@/pages/BitcoinHODLStrategyCalculator';
import BitcoinFearGreedIndex from '@/pages/BitcoinFearGreedIndex';
import BitcoinStakingCalculator from '@/pages/BitcoinStakingCalculator';
import BitcoinSupplyCalculator from '@/pages/BitcoinSupplyCalculator';
import BitcoinDominanceCalculator from '@/pages/BitcoinDominanceCalculator';
import BitcoinDrawdownCalculator from '@/pages/BitcoinDrawdownCalculator';
import BitcoinPizzaDayCalculator from '@/pages/BitcoinPizzaDayCalculator';
import BtcVsRealEstateCalculator from '@/pages/BtcVsRealEstateCalculator';
import BitcoinLoanCalculator from '@/pages/BitcoinLoanCalculator';
import BitcoinInheritanceTaxCalculator from '@/pages/BitcoinInheritanceTaxCalculator';
import PiToBitcoinCalculator from '@/pages/PiToBitcoinCalculator';
import LightningNetworkFeeCalculator from '@/pages/LightningNetworkFeeCalculator';
import BitcoinObituariesTracker from '@/pages/BitcoinObituariesTracker';
import BitcoinWhatIfCalculator from '@/pages/BitcoinWhatIfCalculator';

export type CurrencyTier = 'strict' | 'soft' | 'tracked';

export interface TrCalcRoute {
  trPath: string;
  page: ComponentType;
  tier: CurrencyTier;
}

export const TR_CALC_ROUTES: TrCalcRoute[] = [
  // ── strict: must render zero $ outside data-currency-exempt ──
  { trPath: '/tr/hesaplayicilar/bitcoin-emeklilik-hesaplayicisi', page: BitcoinRetirementCalculator, tier: 'strict' },

  // ── soft: localized in flight; leaks are logged but not failing ──
  { trPath: '/tr/hesaplayicilar/bitcoin-donusturucu',             page: BitcoinConverter,                      tier: 'soft' },
  { trPath: '/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi',       page: BitcoinDCACalculator,                  tier: 'soft' },
  { trPath: '/tr/hesaplayicilar/bitcoin-yatirim-hesaplayicisi',   page: BitcoinInvestmentCalculator,           tier: 'soft' },
  { trPath: '/tr/hesaplayicilar/bitcoin-yarilama',                page: BitcoinHalvingCountdown,               tier: 'soft' },
  { trPath: '/tr/hesaplayicilar/bitcoin-dominansi',               page: BitcoinDominanceCalculator,            tier: 'soft' },
  { trPath: '/tr/hesaplayicilar/bitcoin-portfoy',                 page: BitcoinPortfolioTracker,               tier: 'soft' },

  // ── tracked: render-only smoke (no $ assertion) ──
  { trPath: '/tr/hesaplayicilar/bitcoin-kar-zarar-hesaplayicisi', page: BitcoinProfitLossCalculator,           tier: 'tracked' },
  { trPath: '/tr/hesaplayicilar/bitcoin-birikim-skoru',           page: BitcoinAccumulationScoreCalculator,    tier: 'tracked' },
  { trPath: '/tr/hesaplayicilar/bitcoin-enflasyon',               page: BitcoinPurchasingPowerCalculator,      tier: 'tracked' },
  { trPath: '/tr/hesaplayicilar/bitcoin-vergi-hesaplayicisi',     page: BitcoinCapitalGainsTaxCalculator,      tier: 'tracked' },
  { trPath: '/tr/hesaplayicilar/bitcoin-servet-yuzdesi',          page: BitcoinWealthPercentile,               tier: 'tracked' },
  { trPath: '/tr/hesaplayicilar/bitcoin-madencilik-hesaplayicisi', page: BitcoinMiningProfitabilityCalculator, tier: 'tracked' },
  { trPath: '/tr/hesaplayicilar/bitcoin-gokkusagi-grafigi',       page: BitcoinRainbowChart,                   tier: 'tracked' },
  { trPath: '/tr/hesaplayicilar/bitcoin-fiyat-hedef',             page: BitcoinPriceTargetCalculator,          tier: 'tracked' },
  { trPath: '/tr/hesaplayicilar/bitcoin-guc-yasasi',              page: BitcoinPowerLawCalculator,             tier: 'tracked' },
  { trPath: '/tr/hesaplayicilar/bitcoin-zekat-hesaplayicisi',     page: BitcoinZakatCalculator,                tier: 'tracked' },
  { trPath: '/tr/hesaplayicilar/bitcoin-ortalama-alis',           page: BitcoinAverageBuyPriceCalculator,      tier: 'tracked' },
  { trPath: '/tr/hesaplayicilar/bitcoin-zaman-makinesi',          page: BitcoinTimeMachine,                    tier: 'tracked' },
  { trPath: '/tr/hesaplayicilar/bitcoin-maliyet-ortalama',        page: LumpSumVsDCACalculator,                tier: 'tracked' },
  { trPath: '/tr/hesaplayicilar/bitcoin-yillik-buyume',           page: BitcoinCAGRCalculator,                 tier: 'tracked' },
  { trPath: '/tr/hesaplayicilar/bitcoin-oynaklik',                page: BitcoinVolatilityCalculator,           tier: 'tracked' },
  { trPath: '/tr/hesaplayicilar/bitcoin-korelasyon',              page: BitcoinCorrelationCalculator,          tier: 'tracked' },
  { trPath: '/tr/hesaplayicilar/bitcoin-arbitraj',                page: BitcoinArbitrageCalculator,            tier: 'tracked' },
  { trPath: '/tr/hesaplayicilar/bitcoin-lot-buyuklugu',           page: BitcoinLotSizeCalculator,              tier: 'tracked' },
  { trPath: '/tr/hesaplayicilar/bitcoin-tasfiye',                 page: BitcoinLeverageLiquidationCalculator,  tier: 'tracked' },
  { trPath: '/tr/hesaplayicilar/bitcoin-ag-ucreti',               page: BitcoinTransactionFeeCalculator,       tier: 'tracked' },
  { trPath: '/tr/hesaplayicilar/bitcoin-sip-dca',                 page: BitcoinSIPCalculator,                  tier: 'tracked' },
  { trPath: '/tr/hesaplayicilar/bitcoin-etf-hesaplayicisi',       page: BitcoinETFCalculator,                  tier: 'tracked' },
  { trPath: '/tr/hesaplayicilar/bitcoin-birikim-hesaplayicisi',   page: BitcoinSavingsCalculator,              tier: 'tracked' },
  { trPath: '/tr/hesaplayicilar/satoshi-biriktirme',              page: StackSatsGoalCalculator,               tier: 'tracked' },
  { trPath: '/tr/hesaplayicilar/bitcoin-stok-akis',               page: BitcoinOnChainDashboard,               tier: 'tracked' },
  { trPath: '/tr/hesaplayicilar/bitcoin-enflasyon-paneli',        page: BitcoinInflationDashboard,             tier: 'tracked' },
  { trPath: '/tr/hesaplayicilar/bitcoin-hodl-stratejisi',         page: BitcoinHODLStrategyCalculator,         tier: 'tracked' },
  { trPath: '/tr/hesaplayicilar/bitcoin-korku-acgozluluk',        page: BitcoinFearGreedIndex,                 tier: 'tracked' },
  { trPath: '/tr/hesaplayicilar/bitcoin-staking',                 page: BitcoinStakingCalculator,              tier: 'tracked' },
  { trPath: '/tr/hesaplayicilar/bitcoin-arz',                     page: BitcoinSupplyCalculator,               tier: 'tracked' },
  { trPath: '/tr/hesaplayicilar/bitcoin-dusus-analizi',           page: BitcoinDrawdownCalculator,             tier: 'tracked' },
  { trPath: '/tr/hesaplayicilar/bitcoin-pizza-gunu',              page: BitcoinPizzaDayCalculator,             tier: 'tracked' },
  { trPath: '/tr/hesaplayicilar/bitcoin-gayrimenkul',             page: BtcVsRealEstateCalculator,             tier: 'tracked' },
  { trPath: '/tr/hesaplayicilar/bitcoin-kredi',                   page: BitcoinLoanCalculator,                 tier: 'tracked' },
  { trPath: '/tr/hesaplayicilar/bitcoin-miras-vergisi',           page: BitcoinInheritanceTaxCalculator,       tier: 'tracked' },
  { trPath: '/tr/hesaplayicilar/bitcoin-pi-donusturucu',          page: PiToBitcoinCalculator,                 tier: 'tracked' },
  { trPath: '/tr/hesaplayicilar/bitcoin-lightning-ucreti',        page: LightningNetworkFeeCalculator,         tier: 'tracked' },
  { trPath: '/tr/hesaplayicilar/bitcoin-olum-ilanlari',           page: BitcoinObituariesTracker,              tier: 'tracked' },
  { trPath: '/tr/hesaplayicilar/bitcoin-ya-olsaydi',              page: BitcoinWhatIfCalculator,               tier: 'tracked' },
  { trPath: '/tr/hesaplayicilar/bitcoin-vergi-hindistan',         page: BitcoinIndiaTaxCalculator,             tier: 'tracked' },
  { trPath: '/tr/hesaplayicilar/bitcoin-vergi-ingiltere-cgt',     page: BitcoinUKCGTCalculator,                tier: 'tracked' },
  { trPath: '/tr/hesaplayicilar/bitcoin-vergi-almanya',           page: BitcoinGermanyTaxCalculator,           tier: 'tracked' },
];
