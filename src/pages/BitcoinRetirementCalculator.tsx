import { Suspense, useState, useEffect, useMemo, useCallback, useDeferredValue } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PageBackground } from "@/components/modern/PageBackground";
import { QuickAnswerBox } from "@/components/calculator/QuickAnswerBox";
import { type GoalPlannerInputs } from "@/components/retirement/GoalPlannerInputsPanel";
import { bitcoinApi } from "@/services/bitcoinApi";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Skeleton } from "@/components/ui/skeleton";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PiggyBank, Target, Flame } from "lucide-react";
import { AffiliatePlacement } from "@/components/affiliateAI/AffiliatePlacement";
import { useSmartZones } from "@/hooks/useSmartZones";
import { useSafeLanguage } from "@/hooks/useSafeLanguage";
import { type FireModeInputs } from "@/components/retirement/FireModeInputsPanel";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/hooks/useLocale";
import { RetirementSEOHead } from "@/components/retirement/RetirementSEOHead";
import { RetirementHero } from "@/components/retirement/RetirementHero";
import { RetirementZoneTwo } from "@/components/retirement/RetirementZoneTwo";
import { RetirementZoneThree } from "@/components/retirement/RetirementZoneThree";
import { RetirementZoneFour } from "@/components/retirement/RetirementZoneFour";
import { useRetirementCalculations } from "@/components/retirement/hooks/useRetirementCalculations";
import { useGoalPlannerCalculations } from "@/components/retirement/hooks/useGoalPlannerCalculations";
import { useFireCalculations } from "@/components/retirement/hooks/useFireCalculations";
import { lazyWithRetry } from "@/utils/lazyWithRetry";

// Each mode (Forecaster / Goal Planner / FIRE) is split into its own chunk.
// Only the active mode is downloaded + mounted — heavy chart/table code stays
// out of the critical path until the user actually opens that tab.
const ForecasterMode = lazyWithRetry(() => import("@/components/retirement/modes/ForecasterMode"));
const PlannerMode = lazyWithRetry(() => import("@/components/retirement/modes/PlannerMode"));
const FireMode = lazyWithRetry(() => import("@/components/retirement/modes/FireMode"));

/**
 * Fallback shown while a mode chunk loads. A11y contract:
 *   role="status" + aria-busy + aria-live so AT users hear "Loading
 *   retirement mode" and are then notified once the real UI swaps in.
 *   tabIndex={-1} keeps the placeholder out of the tab order.
 */
const ModeSkeleton = () => (
  <div
    role="status"
    aria-busy="true"
    aria-live="polite"
    tabIndex={-1}
    data-testid="retirement-mode-skeleton"
    className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
  >
    <span className="sr-only">Loading retirement mode</span>
    <Skeleton className="h-[520px] w-full rounded-2xl" aria-hidden="true" />
    <Skeleton className="h-[520px] w-full rounded-2xl" aria-hidden="true" />
  </div>
);



export interface RetirementInputs {
  currentAge: number;
  retirementAge: number;
  currentBtcHoldings: number;
  monthlyContribution: number;
  expectedGrowthRate: number;
  inflationRate: number;
  mode: 'conservative' | 'optimized';
  currency: string;
}
export interface RetirementProjection {
  year: number;
  age: number;
  btcHoldings: number;
  btcPrice: number;
  fiatValue: number;
  annualBudget: number;
  monthlyBudget: number;
  withdrawnBtc?: number;
  remainingBtc?: number;
}

const BitcoinRetirementCalculator = () => {
  const { language, t } = useLanguage();
  const { defaultCurrency } = useLocale();
  const lang = useSafeLanguage();
  const [activeTab, setActiveTab] = useState<'forecaster' | 'planner' | 'fire'>('forecaster');
  // Inner chart/table tab — shared by Forecaster & Goal Planner full-width
  // panels so the selection round-trips through Copy-link share URLs.
  const [chartView, setChartView] = useState<'chart' | 'table'>('chart');


  const [inputs, setInputs] = useState<RetirementInputs>({
    currentAge: 30,
    retirementAge: 65,
    currentBtcHoldings: 0.5,
    monthlyContribution: 500,
    expectedGrowthRate: 15,
    inflationRate: 3,
    mode: 'conservative',
    currency: defaultCurrency,
  });
  const [goalInputs, setGoalInputs] = useState<GoalPlannerInputs>({
    currentAge: 30,
    desiredRetirementAge: 65,
    desiredAnnualBudget: 100000,
    currentBtcHoldings: 0.5,
    expectedGrowthRate: 15,
    inflationRate: 3,
    currency: defaultCurrency,
  });
  const [fireInputs, setFireInputs] = useState<FireModeInputs>({
    currentAge: 30,
    currentBtcHoldings: 0.5,
    monthlyContribution: 500,
    annualExpenses: 50000,
    withdrawalRate: 4,
    currency: defaultCurrency,
  });

  const [currentBtcPrice, setCurrentBtcPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const deferredInputs = useDeferredValue(inputs);
  const deferredGoalInputs = useDeferredValue(goalInputs);
  const deferredFireInputs = useDeferredValue(fireInputs);

  const [isCalculating, setIsCalculating] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [isGoalCalculating, setIsGoalCalculating] = useState(false);
  const [hasGoalCalculated, setHasGoalCalculated] = useState(false);
  const [isFireCalculating, setIsFireCalculating] = useState(false);
  const [hasFireCalculated, setHasFireCalculated] = useState(false);
  const [goalResults, setGoalResults] = useState<any>(null);

  const anyResult = hasCalculated || hasGoalCalculated || hasFireCalculated;
  const sz = useSmartZones({
    pageSlug: "retirement",
    hasResultSignal: anyResult,
    lang,
    resultSignals: ["retirement", "long-term", "security"],
  });

  // ── URL state ────────────────────────────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const num = (key: string, fallback: number, int = true) => {
      const raw = params.get(key);
      if (raw == null) return undefined;
      const v = int ? parseInt(raw, 10) : parseFloat(raw);
      return Number.isFinite(v) ? v : fallback;
    };

    // Restore active mode tab from deep link
    const tab = params.get('tab');
    if (tab === 'forecaster' || tab === 'planner' || tab === 'fire') {
      setActiveTab(tab);
    }

    // Inner chart/table view (Forecaster + Goal Planner)
    const view = params.get('view');
    if (view === 'chart' || view === 'table') setChartView(view);


    // Forecaster inputs (also covers legacy links without a `tab` param)
    if (!tab || tab === 'forecaster') {
      const urlInputs: Partial<RetirementInputs> = {};
      const ca = num('currentAge', 30); if (ca !== undefined) urlInputs.currentAge = ca;
      const ra = num('retirementAge', 65); if (ra !== undefined) urlInputs.retirementAge = ra;
      const cbh = num('currentBtcHoldings', 0.5, false); if (cbh !== undefined) urlInputs.currentBtcHoldings = cbh;
      const mc = num('monthlyContribution', 500); if (mc !== undefined) urlInputs.monthlyContribution = mc;
      const egr = num('expectedGrowthRate', 15); if (egr !== undefined) urlInputs.expectedGrowthRate = egr;
      const ir = num('inflationRate', 3); if (ir !== undefined) urlInputs.inflationRate = ir;
      const m = params.get('mode');
      if (m === 'conservative' || m === 'optimized') urlInputs.mode = m;
      if (params.get('currency')) urlInputs.currency = params.get('currency') || defaultCurrency;
      if (Object.keys(urlInputs).length > 0) {
        setInputs(prev => ({ ...prev, ...urlInputs }));
      }
    }

    // Goal Planner inputs
    if (tab === 'planner') {
      const g: Partial<GoalPlannerInputs> = {};
      const ca = num('currentAge', 30); if (ca !== undefined) g.currentAge = ca;
      const dra = num('desiredRetirementAge', 65); if (dra !== undefined) g.desiredRetirementAge = dra;
      const dab = num('desiredAnnualBudget', 100000); if (dab !== undefined) g.desiredAnnualBudget = dab;
      const cbh = num('currentBtcHoldings', 0.5, false); if (cbh !== undefined) g.currentBtcHoldings = cbh;
      const egr = num('expectedGrowthRate', 15); if (egr !== undefined) g.expectedGrowthRate = egr;
      const ir = num('inflationRate', 3); if (ir !== undefined) g.inflationRate = ir;
      if (params.get('currency')) g.currency = params.get('currency') || defaultCurrency;
      if (Object.keys(g).length > 0) setGoalInputs(prev => ({ ...prev, ...g }));
    }

    // FIRE inputs
    if (tab === 'fire') {
      const f: Partial<FireModeInputs> = {};
      const ca = num('currentAge', 30); if (ca !== undefined) f.currentAge = ca;
      const cbh = num('currentBtcHoldings', 0.5, false); if (cbh !== undefined) f.currentBtcHoldings = cbh;
      const mc = num('monthlyContribution', 500); if (mc !== undefined) f.monthlyContribution = mc;
      const ae = num('annualExpenses', 50000); if (ae !== undefined) f.annualExpenses = ae;
      const wr = num('withdrawalRate', 4, false); if (wr !== undefined) f.withdrawalRate = wr;
      if (params.get('currency')) f.currency = params.get('currency') || defaultCurrency;
      if (Object.keys(f).length > 0) setFireInputs(prev => ({ ...prev, ...f }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateURL = useCallback((newInputs: RetirementInputs) => {
    const params = new URLSearchParams();
    params.set('currentAge', newInputs.currentAge.toString());
    params.set('retirementAge', newInputs.retirementAge.toString());
    params.set('currentBtcHoldings', newInputs.currentBtcHoldings.toString());
    params.set('monthlyContribution', newInputs.monthlyContribution.toString());
    params.set('expectedGrowthRate', newInputs.expectedGrowthRate.toString());
    params.set('inflationRate', newInputs.inflationRate.toString());
    params.set('mode', newInputs.mode);
    params.set('currency', newInputs.currency);
    window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
  }, []);

  const handleInputChange = useCallback((newInputs: RetirementInputs) => {
    setInputs(newInputs);
    updateURL(newInputs);
  }, [updateURL]);

  const handleGoalInputChange = useCallback((newInputs: GoalPlannerInputs) => {
    setGoalInputs(newInputs);
    setInputs(prev => ({
      ...prev,
      currentAge: newInputs.currentAge,
      currentBtcHoldings: newInputs.currentBtcHoldings,
      expectedGrowthRate: newInputs.expectedGrowthRate,
      inflationRate: newInputs.inflationRate,
      currency: newInputs.currency,
    }));
  }, []);

  const handleFireInputChange = useCallback((newInputs: FireModeInputs) => {
    setFireInputs(newInputs);
  }, []);

  // ── Async "Calculate" handlers (preserve loading-state delay) ────
  const handleCalculate = useCallback(async () => {
    if (!currentBtcPrice) return;
    setIsCalculating(true);
    await new Promise(r => setTimeout(r, 500));
    setHasCalculated(true);
    setIsCalculating(false);
  }, [currentBtcPrice]);

  const handleGoalCalculate = useCallback(async () => {
    if (!currentBtcPrice) return;
    setIsGoalCalculating(true);
    await new Promise(r => setTimeout(r, 500));
    setHasGoalCalculated(true);
    setIsGoalCalculating(false);
  }, [currentBtcPrice]);

  const handleFireCalculate = useCallback(async () => {
    if (!currentBtcPrice) return;
    setIsFireCalculating(true);
    await new Promise(r => setTimeout(r, 500));
    setHasFireCalculated(true);
    setIsFireCalculating(false);
  }, [currentBtcPrice]);

  // ── Derived results (hooks) ──────────────────────────────────────
  const calculations = useRetirementCalculations(deferredInputs, currentBtcPrice, hasCalculated);
  const goalCalculations = useGoalPlannerCalculations(deferredGoalInputs, currentBtcPrice, hasGoalCalculated);
  const fireResults = useFireCalculations(deferredFireInputs, currentBtcPrice, hasFireCalculated);

  useEffect(() => {
    setGoalResults(goalCalculations);
  }, [goalCalculations]);

  // ── Live BTC price ───────────────────────────────────────────────
  useEffect(() => {
    const fetchBtcPrice = async () => {
      try {
        const price = await bitcoinApi.getCurrentPrice(inputs.currency);
        setCurrentBtcPrice(price);
      } catch (error) {
        console.error('Failed to fetch Bitcoin price:', error);
        setCurrentBtcPrice(97000);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBtcPrice();
  }, [inputs.currency]);

  const breadcrumbItems = useMemo(() => [
    { label: language === 'tr' ? 'Hesaplayıcılar' : 'Calculators', href: language === 'tr' ? '/tr/hesaplayicilar' : '/calculators' },
    { label: t('retirement.breadcrumb') },
  ], [language, t]);

  if (isLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <RetirementSEOHead language={language} />

      <PageBackground variant="clean">
        <Header />

        <main id="main-content" className="pt-20 pb-28 md:pb-20">
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb items={breadcrumbItems} />
          </div>

          <RetirementHero language={language} badge={t('retirement.badge')} currency={inputs.currency} />

          {/* Zone 1 — pre-calculator slim banner */}
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8"><sz.Zone1 /></div>

          {/* Calculator Interface */}
          <section aria-labelledby="retirement-calculator-heading" className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto pb-8 text-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full border border-border/60 bg-muted/40 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-4">
                {language === 'tr' ? 'Hesaplayıcı' : 'Calculator'}
              </span>
              <h2 id="retirement-calculator-heading" className="text-h2 font-semibold text-foreground">
                {language === 'tr' ? 'Bitcoin Emeklilik Planınızı Hesaplayın' : 'Build Your Bitcoin Retirement Plan'}
              </h2>
            </div>
            <QuickAnswerBox
              answer={language === 'tr'
                ? 'Bitcoin Emeklilik Hesaplayıcısı, Bitcoin’in emekliliği nasıl finanse edebileceğini gösterir. Yaşınızı, hedef emeklilik yaşınızı, aylık DCA tutarınızı, mevcut BTC birikiminizi ve beklenen uzun vadeli BTC büyümesini girin — biz de gelecekteki BTC varlıklarınızı, emeklilikteki USD değerini, güvenli çekim gelirini ve birikiminizin Tahminci, Hedef Planlayıcı ve FIRE Modu’nda ne kadar süreceğini hesaplayalım.'
                : 'The Bitcoin Retirement Calculator projects how Bitcoin can fund retirement. Enter your age, target retirement age, monthly DCA, current BTC stack, and expected long-term BTC growth — we compute your future BTC holdings, USD value at retirement, safe withdrawal income, and the years your stack will last in Forecaster, Goal Planner, and FIRE modes.'}
            />
            <OfflineIndicator />


            {/* Tab System */}
            <div className="mb-10">
              <Tabs value={activeTab} onValueChange={value => setActiveTab(value as 'forecaster' | 'planner' | 'fire')} className="w-full">
                {(() => {
                  const tabs = [
                    { value: 'forecaster', icon: PiggyBank, label: t('retirement.tab.forecaster'), sub: t('retirement.tab.forecaster.sub') },
                    { value: 'planner', icon: Target, label: t('retirement.tab.planner'), sub: t('retirement.tab.planner.sub') },
                    { value: 'fire', icon: Flame, label: t('retirement.tab.fire'), sub: t('retirement.tab.fire.sub') },
                  ];
                  const activeSub = tabs.find(tt => tt.value === activeTab)?.sub ?? '';
                  return (
                    <>
                      <TabsList className="mx-auto flex w-full max-w-2xl gap-1 rounded-full border border-border/40 bg-card/60 p-1 backdrop-blur-sm h-auto overflow-x-auto [&::-webkit-scrollbar]:hidden [&_button]:whitespace-nowrap [&_button]:text-xs sm:[&_button]:text-sm">
                        {tabs.map(({ value, icon: Icon, label, sub }) => (
                          <TabsTrigger
                            key={value}
                            value={value}
                            className="group flex-1 min-w-0 flex items-center justify-center gap-1.5 sm:gap-2 rounded-full px-2 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-muted-foreground transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm hover:text-foreground"
                            title={sub}
                            aria-label={`${label} — ${sub}`}
                          >
                            <Icon className="w-4 h-4 shrink-0" />
                            <span className="truncate">{label}</span>
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      <p key={activeTab} className="mt-3 text-center text-xs sm:text-sm text-muted-foreground" aria-live="polite">
                        {activeSub}
                      </p>
                    </>
                  );
                })()}
              </Tabs>
            </div>

            <Suspense fallback={<ModeSkeleton />}>
              {activeTab === 'forecaster' && (
                <ForecasterMode
                  language={language}
                  inputs={inputs}
                  onInputChange={handleInputChange}
                  onCalculate={handleCalculate}
                  isCalculating={isCalculating}
                  hasCalculated={hasCalculated}
                  currentBtcPrice={currentBtcPrice}
                  calculations={calculations}
                  chartView={chartView}
                  setChartView={setChartView}
                />
              )}

              {activeTab === 'planner' && (
                <PlannerMode
                  language={language}
                  goalInputs={goalInputs}
                  onGoalInputChange={handleGoalInputChange}
                  onGoalCalculate={handleGoalCalculate}
                  isGoalCalculating={isGoalCalculating}
                  hasGoalCalculated={hasGoalCalculated}
                  currentBtcPrice={currentBtcPrice}
                  goalResults={goalResults}
                  chartView={chartView}
                  setChartView={setChartView}
                />
              )}

              {activeTab === 'fire' && (
                <FireMode
                  language={language}
                  fireInputs={fireInputs}
                  onFireInputChange={handleFireInputChange}
                  onFireCalculate={handleFireCalculate}
                  isFireCalculating={isFireCalculating}
                  hasFireCalculated={hasFireCalculated}
                  currentBtcPrice={currentBtcPrice}
                  fireResults={fireResults}
                />
              )}
            </Suspense>
          </section>

          {/* Zone 2 — post-result spotlight */}
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8"><sz.Zone2 /></div>

          {/* Zone 2 — By the Numbers */}
          <RetirementZoneTwo language={language} />

          {/* Zone 3 — How It Works */}
          <RetirementZoneThree language={language} onSelectMode={setActiveTab} />


          {hasCalculated && (
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 pb-6">
              <AffiliatePlacement slug="retirement" lang={lang} resultSignals={["retirement", "long-term", "security"]} />
            </div>
          )}

          {/* Zone 4 — pre-FAQ checkpoint */}
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8"><sz.Zone4 /></div>

          <RetirementZoneFour language={language} disclaimer={t('retirement.disclaimer')} />
        </main>

        <Footer />
        <sz.Zone5 />
      </PageBackground>
    </>
  );
};

export default BitcoinRetirementCalculator;
