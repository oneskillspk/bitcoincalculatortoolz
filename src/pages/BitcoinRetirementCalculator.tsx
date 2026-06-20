import { useState, useEffect, useMemo, useCallback } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PageBackground } from "@/components/modern/PageBackground";
import { QuickAnswerBox } from "@/components/calculator/QuickAnswerBox";
import { RetirementInputsPanel } from "@/components/retirement/RetirementInputsPanel";
import { RetirementResults } from "@/components/retirement/RetirementResults";
import { RetirementChart } from "@/components/retirement/RetirementChart";
import { RetirementTable } from "@/components/retirement/RetirementTable";
import { GoalPlannerInputsPanel, type GoalPlannerInputs } from "@/components/retirement/GoalPlannerInputsPanel";
import { GoalPlannerResults } from "@/components/retirement/GoalPlannerResults";
import { bitcoinApi } from "@/services/bitcoinApi";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FullWidthChartSection } from "@/components/charts/FullWidthChartSection";
import { PiggyBank, Target, Flame } from "lucide-react";
import { AffiliatePlacement } from "@/components/affiliateAI/AffiliatePlacement";
import { useSafeLanguage } from "@/hooks/useSafeLanguage";
import { RetirementExportReport } from "@/components/retirement/RetirementExportReport";
import { FireModeInputsPanel, type FireModeInputs } from "@/components/retirement/FireModeInputsPanel";
import { FireModeResults, FireModeScenariosPanel } from "@/components/retirement/FireModeResults";
import { ErrorBoundary } from "@/components/ErrorBoundary";
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

  const [isCalculating, setIsCalculating] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [isGoalCalculating, setIsGoalCalculating] = useState(false);
  const [hasGoalCalculated, setHasGoalCalculated] = useState(false);
  const [isFireCalculating, setIsFireCalculating] = useState(false);
  const [hasFireCalculated, setHasFireCalculated] = useState(false);
  const [goalResults, setGoalResults] = useState<any>(null);

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
  const calculations = useRetirementCalculations(inputs, currentBtcPrice, hasCalculated);
  const goalCalculations = useGoalPlannerCalculations(goalInputs, currentBtcPrice, hasGoalCalculated);
  const fireResults = useFireCalculations(fireInputs, currentBtcPrice, hasFireCalculated);

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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Forecaster Tab */}
              {activeTab === 'forecaster' && (
                <>
                  <div className="lg:sticky lg:top-24 lg:self-start">
                    <RetirementInputsPanel inputs={inputs} onChange={handleInputChange} currentBtcPrice={currentBtcPrice} onCalculate={handleCalculate} loading={isCalculating} />
                  </div>

                  <div className="space-y-6">
                    <ErrorBoundary>
                      {hasCalculated ? (
                        <>
                          <RetirementResults metrics={calculations.metrics} inputs={inputs} currentBtcPrice={currentBtcPrice} />
                          <RetirementExportReport mode="forecaster" inputs={inputs} projections={calculations.projections} currentBtcPrice={currentBtcPrice} chartView={chartView} />
                        </>
                      ) : (
                        <Card className="glass-morphism-card border-border/20 shadow-sm">
                          <div className="p-12 text-center">
                            <div className="space-y-4">
                              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                                <PiggyBank className="w-8 h-8 text-primary" />
                              </div>
                              <div className="space-y-2">
                                <h3 className="text-h3 font-semibold text-foreground">
                                  {language === 'tr' ? 'Bitcoin Emekliliğinizi Planlamaya Hazır' : 'Ready to Plan Your Bitcoin Retirement'}
                                </h3>
                                <p className="text-muted-foreground max-w-md mx-auto">
                                  {language === 'tr' ? 'Parametrelerinizi yapılandırın ve kişiselleştirilmiş Bitcoin emeklilik projeksiyonlarınızı görmek için "Emeklilik Planını Hesapla"ya tıklayın' : 'Configure your parameters and click "Calculate Retirement Plan" to see your personalized Bitcoin retirement projections'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Card>
                      )}
                    </ErrorBoundary>
                  </div>
                </>
              )}

              {/* Goal Planner Tab */}
              {activeTab === 'planner' && (
                <>
                  <div className="lg:sticky lg:top-24 lg:self-start">
                    <GoalPlannerInputsPanel inputs={goalInputs} onChange={handleGoalInputChange} currentBtcPrice={currentBtcPrice} onCalculate={handleGoalCalculate} loading={isGoalCalculating} />
                  </div>

                  <div className="space-y-6">
                    <ErrorBoundary>
                      {hasGoalCalculated ? (
                        <>
                          <GoalPlannerResults results={goalResults} inputs={goalInputs} currentBtcPrice={currentBtcPrice} />
                          <RetirementExportReport mode="planner" goalInputs={goalInputs} goalResults={goalResults} currentBtcPrice={currentBtcPrice} chartView={chartView} />
                        </>
                      ) : (
                        <Card className="glass-morphism-card border-border/20 shadow-sm">
                          <div className="p-12 text-center">
                            <div className="space-y-4">
                              <div className="w-16 h-16 rounded-2xl bg-blue-soft text-blue-accent flex items-center justify-center mx-auto">
                                <Target className="w-8 h-8" />
                              </div>
                              <div className="space-y-2">
                                <h3 className="text-h3 font-semibold text-foreground">
                                  {language === 'tr' ? 'Finansal Özgürlük Yolunuzu Planlamaya Hazır' : 'Ready to Plan Your Path to Financial Freedom'}
                                </h3>
                                <p className="text-muted-foreground max-w-md mx-auto">
                                  {language === 'tr' ? 'Emeklilik hayallerinizi anlatın, aylık ne kadar yatırım yapmanız gerektiğini tam olarak hesaplayalım' : 'Tell us your retirement dreams and we\'ll calculate exactly how much you need to invest monthly to make them reality'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Card>
                      )}
                    </ErrorBoundary>
                  </div>
                </>
              )}

              {/* FIRE Mode Tab */}
              {activeTab === 'fire' && (
                <>
                  <div className="lg:sticky lg:top-24 lg:self-start">
                    <FireModeInputsPanel inputs={fireInputs} onChange={handleFireInputChange} currentBtcPrice={currentBtcPrice} onCalculate={handleFireCalculate} loading={isFireCalculating} />
                  </div>

                  <div className="space-y-6">
                    <ErrorBoundary>
                      {hasFireCalculated ? (
                        <>
                          <FireModeResults results={fireResults} inputs={fireInputs} currentBtcPrice={currentBtcPrice} summaryOnly />
                          <RetirementExportReport mode="fire" fireInputs={fireInputs} fireResults={fireResults} currentBtcPrice={currentBtcPrice} />
                        </>
                      ) : (
                        <Card className="glass-morphism-card border-border/20 shadow-sm">
                          <div className="p-12 text-center">
                            <div className="space-y-4">
                              <div className="w-16 h-16 rounded-2xl bg-warning/10 text-warning flex items-center justify-center mx-auto">
                                <Flame className="w-8 h-8" />
                              </div>
                              <div className="space-y-2">
                                <h3 className="text-h3 font-semibold text-foreground">
                                  {language === 'tr' ? 'FIRE Tarihinizi Bulmaya Hazır mısınız?' : 'Ready to Find Your FIRE Date?'}
                                </h3>
                                <p className="text-muted-foreground max-w-md mx-auto">
                                  {language === 'tr' ? 'Bitcoin\'in sizi ne zaman finansal özgürlüğe kavuşturabileceğini keşfetmek için yıllık harcamalarınızı ve çekim oranınızı ayarlayın' : 'Set your annual expenses and withdrawal rate to discover when Bitcoin could make you financially independent'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Card>
                      )}
                    </ErrorBoundary>
                  </div>
                </>
              )}
            </div>

            {/* Full-width Projection Chart / Year-by-Year (Forecaster) */}
            {activeTab === 'forecaster' && hasCalculated && (
              <FullWidthChartSection
                ariaLabel={language === 'tr' ? 'Emeklilik projeksiyon grafikleri' : 'Retirement projection charts'}
                className="mt-10 lg:mt-14"
              >
                <Tabs value={chartView} onValueChange={(v) => setChartView(v as 'chart' | 'table')} className="w-full">
                  <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 calc-surface-card border-0 p-1 h-auto">
                    <TabsTrigger value="chart">{language === 'tr' ? 'Projeksiyon Grafiği' : 'Projection Chart'}</TabsTrigger>
                    <TabsTrigger value="table">{language === 'tr' ? 'Yıl Yıl' : 'Year-by-Year'}</TabsTrigger>
                  </TabsList>
                  <TabsContent value="chart" className="mt-6">
                    <RetirementChart projections={calculations.projections} />
                  </TabsContent>
                  <TabsContent value="table" className="mt-6">
                    <RetirementTable projections={calculations.projections} currency={inputs.currency} />
                  </TabsContent>
                </Tabs>
              </FullWidthChartSection>
            )}

            {/* Full-width Projection Chart / Year-by-Year (Goal Planner) */}
            {activeTab === 'planner' && hasGoalCalculated && goalResults?.projections && (
              <FullWidthChartSection
                ariaLabel={language === 'tr' ? 'Hedef planlayıcı projeksiyonları' : 'Goal Planner projections'}
                className="mt-10 lg:mt-14"
              >
                <Tabs value={chartView} onValueChange={(v) => setChartView(v as 'chart' | 'table')} className="w-full">
                  <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 calc-surface-card border-0 p-1 h-auto">
                    <TabsTrigger value="chart">{language === 'tr' ? 'Projeksiyon Grafiği' : 'Projection Chart'}</TabsTrigger>
                    <TabsTrigger value="table">{language === 'tr' ? 'Yıl Yıl' : 'Year-by-Year'}</TabsTrigger>
                  </TabsList>
                  <TabsContent value="chart" className="mt-6">
                    <RetirementChart projections={goalResults.projections} />
                  </TabsContent>
                  <TabsContent value="table" className="mt-6">
                    <RetirementTable projections={goalResults.projections} currency={goalInputs.currency} />
                  </TabsContent>
                </Tabs>
              </FullWidthChartSection>
            )}

            {/* Full-width Growth Scenarios (FIRE) */}
            {activeTab === 'fire' && hasFireCalculated && fireResults && (
              <FullWidthChartSection
                ariaLabel={language === 'tr' ? 'FIRE büyüme senaryoları' : 'FIRE growth scenarios'}
                className="mt-10 lg:mt-14"
              >
                <FireModeScenariosPanel results={fireResults} inputs={fireInputs} />
              </FullWidthChartSection>
            )}
          </section>


          {/* Zone 3 — How It Works (explain the method first) */}
          <RetirementZoneThree language={language} onSelectMode={setActiveTab} />

          {/* Zone 2 — By the Numbers (proof, after the method is explained) */}
          <RetirementZoneTwo language={language} />


          {hasCalculated && (
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 pb-6">
              <AffiliatePlacement slug="retirement" lang={lang} resultSignals={["retirement", "long-term", "security"]} />
            </div>
          )}

          <RetirementZoneFour language={language} disclaimer={t('retirement.disclaimer')} />
        </main>

        <Footer />
      </PageBackground>
    </>
  );
};

export default BitcoinRetirementCalculator;
