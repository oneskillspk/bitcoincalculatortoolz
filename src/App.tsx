import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Suspense, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Defers mounting <NotFound /> by a short tick so transient unmatched URL
 * states during chunk swaps / route transitions don't flash 404 in the
 * sandbox preview. If the route resolves before the timer fires, this
 * component unmounts harmlessly.
 */
const DeferredNotFound = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setShow(true), 150);
    return () => clearTimeout(id);
  }, []);
  if (!show) return <RouteLoadingFallback />;
  return <NotFound />;
};
import { lazyWithRetry } from "@/utils/lazyWithRetry";
import LanguageRouteSync from "@/components/LanguageRouteSync";
import InternalLinkInterceptor from "@/components/InternalLinkInterceptor";
import { GlobalHreflang } from "@/components/GlobalHreflang";
import { LocaleMeta } from "@/components/LocaleMeta";
import { SoftwareApplicationSchema } from "@/components/seo/SoftwareApplicationSchema";
import { HowToSchema } from "@/components/seo/HowToSchema";
import { AutoDatasetSchema } from "@/components/seo/AutoDatasetSchema";


// Deliberately render no visible fallback during lazy route handoff. This
// prevents first-paint/route-change flashes from being perceived as a splash.
const RouteLoadingFallback = () => null;

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { MobileBottomTabBar } from "@/components/layout/MobileBottomTabBar";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";

import { ScrollToTop } from "@/components/ScrollToTop";
import { CursorFollower } from "@/components/motion/CursorFollower";
import { PerformanceBudget } from "@/components/motion/PerformanceBudget";
import { LegacyRedirect } from "@/components/LegacyRedirect";
import { AffiliateDebugOverlay } from "@/components/debug/AffiliateDebugOverlay";
import { useSlotStatsSync } from "@/hooks/useSlotStatsSync";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load pages with retry for stale chunk recovery
const Calculators = lazyWithRetry(() => import("./pages/Calculators"));
const BitcoinWhatIfCalculator = lazyWithRetry(() => import("./pages/BitcoinWhatIfCalculator"));
const BitcoinRetirementCalculator = lazyWithRetry(() => import("./pages/BitcoinRetirementCalculator"));
const BitcoinDCACalculator = lazyWithRetry(() => import("./pages/BitcoinDCACalculator"));
const LumpSumVsDCACalculator = lazyWithRetry(() => import("./pages/LumpSumVsDCACalculator"));
const TypographyPreview = lazyWithRetry(() => import("./pages/TypographyPreview"));
const StateCardsQA = lazyWithRetry(() => import("./pages/StateCardsQA"));
const AffiliatePlacementQA = lazyWithRetry(() => import("./pages/AffiliatePlacementQA"));
const Status = lazyWithRetry(() => import("./pages/Status"));
const AdminLogin = lazyWithRetry(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazyWithRetry(() => import("./pages/admin/AdminDashboard"));
const BitcoinCapitalGainsTaxCalculator = lazyWithRetry(() => import("./pages/BitcoinCapitalGainsTaxCalculator"));
const StackSatsGoalCalculator = lazyWithRetry(() => import("./pages/StackSatsGoalCalculator"));
const BitcoinPurchasingPowerCalculator = lazyWithRetry(() => import("./pages/BitcoinPurchasingPowerCalculator"));
const BitcoinInflationDashboard = lazyWithRetry(() => import("./pages/BitcoinInflationDashboard"));
const BitcoinObituariesTracker = lazyWithRetry(() => import("./pages/BitcoinObituariesTracker"));
const BitcoinHODLStrategyCalculator = lazyWithRetry(() => import("./pages/BitcoinHODLStrategyCalculator"));
const BitcoinMiningProfitabilityCalculator = lazyWithRetry(() => import("./pages/BitcoinMiningProfitabilityCalculator"));
const BitcoinTransactionFeeCalculator = lazyWithRetry(() => import("./pages/BitcoinTransactionFeeCalculator"));
const LightningNetworkFeeCalculator = lazyWithRetry(() => import("./pages/LightningNetworkFeeCalculator"));
const BitcoinLeverageLiquidationCalculator = lazyWithRetry(() => import("./pages/BitcoinLeverageLiquidationCalculator"));
const BitcoinProfitLossCalculator = lazyWithRetry(() => import("./pages/BitcoinProfitLossCalculator"));
const BitcoinConverter = lazyWithRetry(() => import("./pages/BitcoinConverter"));
const BitcoinInvestmentCalculator = lazyWithRetry(() => import("./pages/BitcoinInvestmentCalculator"));
const BitcoinHalvingCountdown = lazyWithRetry(() => import("./pages/BitcoinHalvingCountdown"));
const BitcoinSavingsCalculator = lazyWithRetry(() => import("./pages/BitcoinSavingsCalculator"));
const BitcoinFearGreedIndex = lazyWithRetry(() => import("./pages/BitcoinFearGreedIndex"));
const BitcoinRainbowChart = lazyWithRetry(() => import("./pages/BitcoinRainbowChart"));
const BitcoinWealthPercentile = lazyWithRetry(() => import("./pages/BitcoinWealthPercentile"));
const BitcoinETFCalculator = lazyWithRetry(() => import("./pages/BitcoinETFCalculator"));
const BitcoinPowerLawCalculator = lazyWithRetry(() => import("./pages/BitcoinPowerLawCalculator"));
const BitcoinCAGRCalculator = lazyWithRetry(() => import("./pages/BitcoinCAGRCalculator"));
const BitcoinStakingCalculator = lazyWithRetry(() => import("./pages/BitcoinStakingCalculator"));
const BitcoinOnChainDashboard = lazyWithRetry(() => import("./pages/BitcoinOnChainDashboard"));
const BitcoinVolatilityCalculator = lazyWithRetry(() => import("./pages/BitcoinVolatilityCalculator"));
const BitcoinSupplyCalculator = lazyWithRetry(() => import("./pages/BitcoinSupplyCalculator"));
const BitcoinDominanceCalculator = lazyWithRetry(() => import("./pages/BitcoinDominanceCalculator"));
const BitcoinTimeMachine = lazyWithRetry(() => import("./pages/BitcoinTimeMachine"));
const BitcoinDrawdownCalculator = lazyWithRetry(() => import("./pages/BitcoinDrawdownCalculator"));
const BitcoinSIPCalculator = lazyWithRetry(() => import("./pages/BitcoinSIPCalculator"));
const BitcoinPizzaDayCalculator = lazyWithRetry(() => import("./pages/BitcoinPizzaDayCalculator"));
const BitcoinAverageBuyPriceCalculator = lazyWithRetry(() => import("./pages/BitcoinAverageBuyPriceCalculator"));
const BitcoinInheritanceTaxCalculator = lazyWithRetry(() => import("./pages/BitcoinInheritanceTaxCalculator"));
const BitcoinLoanCalculator = lazyWithRetry(() => import("./pages/BitcoinLoanCalculator"));
const BitcoinPriceTargetCalculator = lazyWithRetry(() => import("./pages/BitcoinPriceTargetCalculator"));
const BitcoinCorrelationCalculator = lazyWithRetry(() => import("./pages/BitcoinCorrelationCalculator"));
const BtcVsRealEstateCalculator = lazyWithRetry(() => import("./pages/BtcVsRealEstateCalculator"));
const BitcoinLotSizeCalculator = lazyWithRetry(() => import("./pages/BitcoinLotSizeCalculator"));
const BitcoinZakatCalculator = lazyWithRetry(() => import("./pages/BitcoinZakatCalculator"));
const BitcoinArbitrageCalculator = lazyWithRetry(() => import("./pages/BitcoinArbitrageCalculator"));
const PiToBitcoinCalculator = lazyWithRetry(() => import("./pages/PiToBitcoinCalculator"));
const BitcoinPortfolioTracker = lazyWithRetry(() => import("./pages/BitcoinPortfolioTracker"));
const BitcoinAccumulationScoreCalculator = lazyWithRetry(() => import("./pages/BitcoinAccumulationScoreCalculator"));
const BitcoinIndiaTaxCalculator = lazyWithRetry(() => import("./pages/BitcoinIndiaTaxCalculator"));
const BitcoinUKCGTCalculator = lazyWithRetry(() => import("./pages/BitcoinUKCGTCalculator"));
const BitcoinGermanyTaxCalculator = lazyWithRetry(() => import("./pages/BitcoinGermanyTaxCalculator"));
const Methodology = lazyWithRetry(() => import("./pages/Methodology"));
const ShareRedirect = lazyWithRetry(() => import("./pages/ShareRedirect"));
const Learn = lazyWithRetry(() => import("./pages/Learn"));
const AdminLinkAudit = lazyWithRetry(() => import("./pages/AdminLinkAudit"));
const LearnArticle = lazyWithRetry(() => import("./pages/LearnArticle"));
const Tools = lazyWithRetry(() => import("./pages/Tools"));
const About = lazyWithRetry(() => import("./pages/About"));
const Contact = lazyWithRetry(() => import("./pages/Contact"));
const Terms = lazyWithRetry(() => import("./pages/Terms"));
const Privacy = lazyWithRetry(() => import("./pages/Privacy"));
const AffiliateDisclosure = lazyWithRetry(() => import("./pages/AffiliateDisclosure"));
const Unsubscribe = lazyWithRetry(() => import("./pages/Unsubscribe"));
const Sitemap = lazyWithRetry(() => import("./pages/Sitemap"));

// Turkish pages
const TurkishHome = lazyWithRetry(() => import("./pages/TurkishHome"));
const TurkishNotFound = lazyWithRetry(() => import("./pages/TurkishNotFound"));

const App = () => {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();
  useSlotStatsSync();
  const routeMotionClass = location.pathname.startsWith("/calculators")
    ? "calculator-motion-scope"
    : undefined;
  const normalizedPathname = location.pathname.replace(/\/+$/, "") || "/";

  // Dev-only V2 Slot coverage check — warns in console if a calculator
  // route loads without SlotB or SlotC mounting within 4s.
  useEffect(() => {
    void import("@/lib/placement/v2Registry").then(({ verifyV2Coverage }) =>
      verifyV2Coverage(location.pathname)
    );
  }, [location.pathname]);


  // Trailing-slash / duplicate-slash normalization redirect.
  // Sandbox link rewrites occasionally append a trailing slash that misses
  // the exact route match and falls into the catch-all.
  if (normalizedPathname !== location.pathname) {
    return <Navigate to={normalizedPathname + location.search + location.hash} replace />;
  }

  return (
    <ErrorBoundary>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {import.meta.env.DEV && <AffiliateDebugOverlay />}
        
        
        <ScrollToTop />
        <CursorFollower />
        <PerformanceBudget />
        {/* Syncs language context with /tr/* URL prefix — renders nothing */}
        <LanguageRouteSync />
        {/* Rewrites plain-anchor internal links to locale-aware SPA navigation */}
        <InternalLinkInterceptor />
        {/* Injects hreflang alternate links on every page that has a Turkish mirror */}
        <GlobalHreflang />
        {/* Sets <html lang> + og:locale globally based on URL prefix */}
        <LocaleMeta />
        {/* Auto-emits SoftwareApplication JSON-LD on every calculator route */}
        <SoftwareApplicationSchema />
        {/* Auto-emits HowTo JSON-LD on step-based calculator routes */}
        <HowToSchema />
        {/* Auto-emits Dataset JSON-LD on data-heavy calculator routes */}
        <AutoDatasetSchema />
          <Suspense fallback={<RouteLoadingFallback />}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={location.pathname}
                className={routeMotionClass}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 14, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8, filter: 'blur(4px)' }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              >
            <Routes location={location}>
              {/* ─── English routes ─────────────────────────────────────── */}
              <Route path="/" element={<Index />} />
              <Route path="/calculators" element={<Calculators />} />
              <Route path="/calculators/what-if" element={<BitcoinWhatIfCalculator />} />
              <Route path="/calculators/whatif" element={<Navigate to="/calculators/what-if" replace />} />
              <Route path="/calculator/what-if" element={<Navigate to="/calculators/what-if" replace />} />
              <Route path="/calculators/retirement" element={<BitcoinRetirementCalculator />} />
              <Route path="/calculators/dca" element={<BitcoinDCACalculator />} />
              <Route path="/calculators/lump-sum-vs-dca" element={<LumpSumVsDCACalculator />} />
              <Route path="/typography-preview" element={<TypographyPreview />} />
              <Route path="/qa/state-cards" element={<StateCardsQA />} />
              <Route path="/qa/affiliates" element={<AffiliatePlacementQA />} />
              <Route path="/status" element={<Status />} />
              <Route path="/calculators/capital-gains-tax" element={<BitcoinCapitalGainsTaxCalculator />} />
              <Route path="/calculators/stack-sats" element={<StackSatsGoalCalculator />} />
              <Route path="/calculators/purchasing-power" element={<BitcoinPurchasingPowerCalculator />} />
              <Route path="/calculators/inflation-dashboard" element={<BitcoinInflationDashboard />} />
              <Route path="/calculators/obituaries-tracker" element={<BitcoinObituariesTracker />} />
              <Route path="/calculators/hodl-strategy" element={<BitcoinHODLStrategyCalculator />} />
              <Route path="/calculators/mining-profitability" element={<BitcoinMiningProfitabilityCalculator />} />
              <Route path="/calculators/transaction-fees" element={<BitcoinTransactionFeeCalculator />} />
              <Route path="/calculators/lightning" element={<LightningNetworkFeeCalculator />} />
              <Route path="/calculators/leverage-liquidation" element={<BitcoinLeverageLiquidationCalculator />} />
              <Route path="/calculators/profit-loss" element={<BitcoinProfitLossCalculator />} />
              <Route path="/calculators/bitcoin-converter" element={<BitcoinConverter />} />
              <Route path="/calculators/investment" element={<BitcoinInvestmentCalculator />} />
              <Route path="/calculators/halving-countdown" element={<BitcoinHalvingCountdown />} />
              <Route path="/calculators/bitcoin-savings" element={<BitcoinSavingsCalculator />} />
              <Route path="/calculators/fear-greed-index" element={<BitcoinFearGreedIndex />} />
              <Route path="/calculators/rainbow-chart" element={<BitcoinRainbowChart />} />
              <Route path="/calculators/wealth-percentile" element={<BitcoinWealthPercentile />} />
              <Route path="/calculators/etf" element={<BitcoinETFCalculator />} />
              <Route path="/calculators/power-law" element={<BitcoinPowerLawCalculator />} />
              <Route path="/calculators/cagr" element={<BitcoinCAGRCalculator />} />
              <Route path="/calculators/staking" element={<BitcoinStakingCalculator />} />
              <Route path="/calculators/on-chain" element={<BitcoinOnChainDashboard />} />
              <Route path="/calculators/volatility" element={<BitcoinVolatilityCalculator />} />
              <Route path="/calculators/supply" element={<BitcoinSupplyCalculator />} />
              <Route path="/calculators/dominance" element={<BitcoinDominanceCalculator />} />
              <Route path="/calculators/time-machine" element={<BitcoinTimeMachine />} />
              <Route path="/calculators/drawdown" element={<BitcoinDrawdownCalculator />} />
              <Route path="/calculators/sip" element={<BitcoinSIPCalculator />} />
              <Route path="/calculators/pizza-day" element={<BitcoinPizzaDayCalculator />} />
              <Route path="/calculators/average-buy-price" element={<BitcoinAverageBuyPriceCalculator />} />
              <Route path="/calculators/price-target" element={<BitcoinPriceTargetCalculator />} />
              <Route path="/calculators/inheritance-tax" element={<BitcoinInheritanceTaxCalculator />} />
              <Route path="/calculators/bitcoin-loan" element={<BitcoinLoanCalculator />} />
              <Route path="/calculators/correlation" element={<BitcoinCorrelationCalculator />} />
              <Route path="/calculators/btc-vs-real-estate" element={<BtcVsRealEstateCalculator />} />
              <Route path="/calculators/bitcoin-lot-size" element={<BitcoinLotSizeCalculator />} />
              <Route path="/calculators/bitcoin-zakat" element={<BitcoinZakatCalculator />} />
              <Route path="/calculators/bitcoin-arbitrage" element={<BitcoinArbitrageCalculator />} />
              <Route path="/calculators/pi-to-bitcoin" element={<PiToBitcoinCalculator />} />
              <Route path="/calculators/portfolio-tracker" element={<BitcoinPortfolioTracker />} />
              <Route path="/calculators/bitcoin-accumulation-score" element={<BitcoinAccumulationScoreCalculator />} />
              <Route path="/calculators/bitcoin-tax-india" element={<BitcoinIndiaTaxCalculator />} />
              <Route path="/calculators/bitcoin-tax-uk-cgt" element={<BitcoinUKCGTCalculator />} />
              <Route path="/calculators/bitcoin-tax-germany" element={<BitcoinGermanyTaxCalculator />} />
              <Route path="/methodology" element={<Methodology />} />
              {/* TR aliases for the 3 regional tax pages (P2 item 11) */}
              <Route path="/tr/hesaplayicilar/bitcoin-vergi-hindistan" element={<BitcoinIndiaTaxCalculator />} />
              <Route path="/tr/hesaplayicilar/bitcoin-vergi-ingiltere-cgt" element={<BitcoinUKCGTCalculator />} />
              <Route path="/tr/hesaplayicilar/bitcoin-vergi-almanya" element={<BitcoinGermanyTaxCalculator />} />
              {/* Legacy slug redirects (preserve link equity from external backlinks) */}
              <Route path="/calculators/what-if-bitcoin" element={<LegacyRedirect to="/calculators/what-if" />} />
              <Route path="/calculators/bitcoin-retirement" element={<LegacyRedirect to="/calculators/retirement" />} />
              <Route path="/calculators/stack-sats-goal" element={<LegacyRedirect to="/calculators/stack-sats" />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/learn/:slug" element={<LearnArticle />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/affiliate-disclosure" element={<AffiliateDisclosure />} />
              <Route path="/unsubscribe" element={<Unsubscribe />} />
              <Route path="/sitemap" element={<Sitemap />} />
              <Route path="/admin/link-audit" element={<AdminLinkAudit />} />
              {/* Branded short share-link redirect: /s/<slug>?...params → /calculators/<slug>?...params */}
              <Route path="/s/:slug" element={<ShareRedirect />} />

              {/* ─── Turkish routes (/tr/*) ──────────────────────────────── */}
              {/* Homepage & hubs */}
              <Route path="/tr" element={<TurkishHome />} />
              <Route path="/tr/" element={<TurkishHome />} />
              {/* Guard against malformed /tr/tr links surfaced by the link audit. */}
              <Route path="/tr/tr" element={<Navigate to="/tr" replace />} />
              <Route path="/tr/hesaplayicilar" element={<Calculators />} />

              {/* Calculator pages — CRITICAL priority */}
              <Route path="/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi" element={<BitcoinDCACalculator />} />
              <Route path="/tr/hesaplayicilar/bitcoin-kar-zarar-hesaplayicisi" element={<BitcoinProfitLossCalculator />} />
              <Route path="/tr/hesaplayicilar/bitcoin-yatirim-hesaplayicisi" element={<BitcoinInvestmentCalculator />} />
              <Route path="/tr/hesaplayicilar/bitcoin-emeklilik-hesaplayicisi" element={<BitcoinRetirementCalculator />} />
              <Route path="/tr/hesaplayicilar/bitcoin-birikim-skoru" element={<BitcoinAccumulationScoreCalculator />} />
              <Route path="/tr/hesaplayicilar/bitcoin-enflasyon" element={<BitcoinPurchasingPowerCalculator />} />
              <Route path="/tr/hesaplayicilar/bitcoin-donusturucu" element={<BitcoinConverter />} />

              {/* Calculator pages — HIGH priority */}
              <Route path="/tr/hesaplayicilar/bitcoin-vergi-hesaplayicisi" element={<BitcoinCapitalGainsTaxCalculator />} />
              <Route path="/tr/hesaplayicilar/bitcoin-servet-yuzdesi" element={<BitcoinWealthPercentile />} />
              <Route path="/tr/hesaplayicilar/bitcoin-madencilik-hesaplayicisi" element={<BitcoinMiningProfitabilityCalculator />} />
              <Route path="/tr/hesaplayicilar/bitcoin-gokkusagi-grafigi" element={<BitcoinRainbowChart />} />
              <Route path="/tr/hesaplayicilar/bitcoin-fiyat-hedef" element={<BitcoinPriceTargetCalculator />} />
              <Route path="/tr/hesaplayicilar/bitcoin-guc-yasasi" element={<BitcoinPowerLawCalculator />} />
              <Route path="/tr/hesaplayicilar/bitcoin-zekat-hesaplayicisi" element={<BitcoinZakatCalculator />} />
              <Route path="/tr/hesaplayicilar/bitcoin-yarilama" element={<BitcoinHalvingCountdown />} />
              <Route path="/tr/hesaplayicilar/bitcoin-ortalama-alis" element={<BitcoinAverageBuyPriceCalculator />} />
              <Route path="/tr/hesaplayicilar/bitcoin-zaman-makinesi" element={<BitcoinTimeMachine />} />
              <Route path="/tr/hesaplayicilar/bitcoin-maliyet-ortalama" element={<LumpSumVsDCACalculator />} />

              {/* Calculator pages — MEDIUM priority */}
              <Route path="/tr/hesaplayicilar/bitcoin-yillik-buyume" element={<BitcoinCAGRCalculator />} />
              <Route path="/tr/hesaplayicilar/bitcoin-oynaklik" element={<BitcoinVolatilityCalculator />} />
              <Route path="/tr/hesaplayicilar/bitcoin-korelasyon" element={<BitcoinCorrelationCalculator />} />
              <Route path="/tr/hesaplayicilar/bitcoin-arbitraj" element={<BitcoinArbitrageCalculator />} />
              <Route path="/tr/hesaplayicilar/bitcoin-lot-buyuklugu" element={<BitcoinLotSizeCalculator />} />
              <Route path="/tr/hesaplayicilar/bitcoin-tasfiye" element={<BitcoinLeverageLiquidationCalculator />} />
              <Route path="/tr/hesaplayicilar/bitcoin-ag-ucreti" element={<BitcoinTransactionFeeCalculator />} />
              <Route path="/tr/hesaplayicilar/bitcoin-sip-dca" element={<BitcoinSIPCalculator />} />
              <Route path="/tr/hesaplayicilar/bitcoin-etf-hesaplayicisi" element={<BitcoinETFCalculator />} />
              <Route path="/tr/hesaplayicilar/bitcoin-birikim-hesaplayicisi" element={<BitcoinSavingsCalculator />} />
              <Route path="/tr/hesaplayicilar/bitcoin-portfoy" element={<BitcoinPortfolioTracker />} />
              <Route path="/tr/hesaplayicilar/satoshi-biriktirme" element={<StackSatsGoalCalculator />} />
              <Route path="/tr/hesaplayicilar/bitcoin-stok-akis" element={<BitcoinOnChainDashboard />} />
              <Route path="/tr/hesaplayicilar/bitcoin-enflasyon-paneli" element={<BitcoinInflationDashboard />} />
              <Route path="/tr/hesaplayicilar/bitcoin-hodl-stratejisi" element={<BitcoinHODLStrategyCalculator />} />
              <Route path="/tr/hesaplayicilar/bitcoin-korku-acgozluluk" element={<BitcoinFearGreedIndex />} />
              <Route path="/tr/hesaplayicilar/bitcoin-staking" element={<BitcoinStakingCalculator />} />

              {/* Calculator pages — LOWER priority */}
              <Route path="/tr/hesaplayicilar/bitcoin-arz" element={<BitcoinSupplyCalculator />} />
              <Route path="/tr/hesaplayicilar/bitcoin-dominansi" element={<BitcoinDominanceCalculator />} />
              <Route path="/tr/hesaplayicilar/bitcoin-dusus-analizi" element={<BitcoinDrawdownCalculator />} />
              <Route path="/tr/hesaplayicilar/bitcoin-pizza-gunu" element={<BitcoinPizzaDayCalculator />} />
              <Route path="/tr/hesaplayicilar/bitcoin-gayrimenkul" element={<BtcVsRealEstateCalculator />} />
              <Route path="/tr/hesaplayicilar/bitcoin-kredi" element={<BitcoinLoanCalculator />} />
              <Route path="/tr/hesaplayicilar/bitcoin-miras-vergisi" element={<BitcoinInheritanceTaxCalculator />} />
              <Route path="/tr/hesaplayicilar/bitcoin-pi-donusturucu" element={<PiToBitcoinCalculator />} />
              <Route path="/tr/hesaplayicilar/bitcoin-lightning-ucreti" element={<LightningNetworkFeeCalculator />} />
              <Route path="/tr/hesaplayicilar/bitcoin-olum-ilanlari" element={<BitcoinObituariesTracker />} />
              <Route path="/tr/hesaplayicilar/bitcoin-ya-olsaydi" element={<BitcoinWhatIfCalculator />} />

              {/* Turkish tools page */}
              <Route path="/tr/araclar" element={<Tools />} />

              {/* Turkish learn / articles hub and articles */}
              <Route path="/tr/ogrenin" element={<Learn />} />
              <Route path="/tr/ogrenin/:slug" element={<LearnArticle />} />

              {/* Turkish static pages */}
              <Route path="/tr/hakkimizda" element={<About />} />
              <Route path="/tr/iletisim" element={<Contact />} />
              <Route path="/tr/gizlilik" element={<Privacy />} />
              <Route path="/tr/kosullar" element={<Terms />} />
              <Route path="/tr/bagli-kurulus-aciklamasi" element={<AffiliateDisclosure />} />
              <Route path="/tr/site-haritasi" element={<Sitemap />} />
              <Route path="/tr/yontem" element={<Methodology />} />

              {/* Turkish 404 — must come after all /tr/* routes */}
              <Route path="/tr/*" element={<TurkishNotFound />} />

              {/* Admin */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<DeferredNotFound />} />
            </Routes>
              </motion.div>
            </AnimatePresence>
          </Suspense>
          <MobileBottomTabBar />
          <CookieConsentBanner />
        </TooltipProvider>
    </ErrorBoundary>
  );
};

export default App;
