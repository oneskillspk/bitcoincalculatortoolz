import { Link } from '@/components/LocalizedLink';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useSmartZones } from "@/hooks/useSmartZones";
import { PlacementProvider } from "@/contexts/PlacementProvider";
import { useSafeLanguage } from "@/hooks/useSafeLanguage";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PageBackground } from "@/components/modern/PageBackground";
import { ModernChart } from "@/components/modern/ModernChart";
import { CompactLiveBitcoinPrice } from "@/components/CompactLiveBitcoinPrice";
import { HistoricalAnalysis } from "@/components/HistoricalAnalysis";
import { ModernCrossAssetComparison } from "@/components/modern/ModernCrossAssetComparison";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { NewHowItWorksSection } from "@/components/NewHowItWorksSection";
import { WhatIfRealExamples } from "@/components/what-if/WhatIfRealExamples";
import { WhatIfWhyBitcoinGrew } from "@/components/what-if/WhatIfWhyBitcoinGrew";
import { WhatIfKeyDates } from "@/components/what-if/WhatIfKeyDates";
import { WhatIfContentSections } from "@/components/what-if/WhatIfContentSections";
import { WhatIfScenarioInsightsPanel } from "@/components/what-if/WhatIfScenarioInsightsPanel";
import { WhatIfShareSnapshot } from "@/components/what-if/WhatIfShareSnapshot";
import { WhatIfSeoHead } from "@/components/what-if/WhatIfSeoHead";
import { WhatIfInputPanel } from "@/components/what-if/WhatIfInputPanel";
import { WhatIfResultsPanel } from "@/components/what-if/WhatIfResultsPanel";
import RelatedCalculators from "@/components/RelatedCalculators";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { bitcoinApi, CalculationResult } from "@/services/bitcoinApi";
import { AlertTriangle, Calculator } from "lucide-react";
import { CopyShareLinkButton } from "@/components/share/CopyShareLinkButton";
import { readShareParams } from "@/utils/shareLink";
import { useLanguage } from "@/contexts/LanguageContext";
import { QuickShareLinkPanel } from '@/components/share-export';
const BitcoinWhatIfCalculator = () => {
  const { language, t } = useLanguage();



  // Hydrate from shared URL once on mount.
  // Example: /calculators/what-if?amount=1000&start=2017-01-01&currency=USD&mode=fiat
  const initialFromUrl = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const p = readShareParams();
    if (!p.has('amount') && !p.has('start')) return null;
    const mode = p.string('mode');
    return {
      amount: p.number('amount'),
      startDate: p.date('start'),
      currency: p.string('currency'),
      inputMode: (mode === 'btc' ? 'btc' : 'fiat') as 'fiat' | 'btc',
      showInBtc: p.bool('showBtc'),
    };
  }, []);

  const lang = useSafeLanguage();
  const [calculationParams, setCalculationParams] = useState<{
    amount: number;
    startDate: Date;
    currency: string;
    showInBtc: boolean;
    inputMode: 'fiat' | 'btc';
  } | null>(null);
  const [isManualCalculation, setIsManualCalculation] = useState(false);
  const [calculationStage, setCalculationStage] = useState<'fetching-current' | 'fetching-historical' | 'fetching-range' | 'calculating' | 'complete'>('fetching-current');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const { data: result, isLoading, error, refetch } = useQuery<CalculationResult>({
    queryKey: ['bitcoin-calculation', calculationParams],
    queryFn: async () => {
      if (!calculationParams) throw new Error('No calculation parameters');
      
      // Simulate calculation stages for better UX
      setCalculationStage('fetching-current');
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setCalculationStage('fetching-historical');
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setCalculationStage('fetching-range');
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setCalculationStage('calculating');
      const result = calculationParams.inputMode === 'btc'
        ? await bitcoinApi.calculateInvestmentFromBtc(
            calculationParams.amount,
            calculationParams.startDate,
            calculationParams.currency
          )
        : await bitcoinApi.calculateInvestment(
            calculationParams.amount,
            calculationParams.startDate,
            calculationParams.currency
          );
      
      setCalculationStage('complete');
      return result;
    },
    enabled: !!calculationParams && isManualCalculation,
    retry: (failureCount, error) => {
      // Smart retry logic based on error type
      if (error.message.includes('Network Error')) {
        return failureCount < 3;
      }
      if (error.message.includes('timeout')) {
        return failureCount < 2;
      }
      return failureCount < 1;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes
  });

  const sz = useSmartZones({
    pageSlug: "what-if",
    hasResultSignal: !!result,
    lang,
    resultSignals: ["profit", "accumulation"],
  });



  const handleCalculate = useCallback((params: {
    amount: number;
    startDate: Date;
    currency: string;
    showInBtc: boolean;
    inputMode: 'fiat' | 'btc';
  }) => {
    setCalculationParams(params);
    setIsManualCalculation(true);
    setCalculationStage('fetching-current');
  }, []);

  const handleRetry = useCallback(() => {
    if (calculationParams) {
      setIsManualCalculation(true);
      setCalculationStage('fetching-current');
      refetch();
    }
  }, [calculationParams, refetch]);

  const handleLoadCalculation = useCallback((loadedResult: CalculationResult) => {
    setCalculationParams({
      amount: loadedResult.investmentAmount,
      startDate: new Date(loadedResult.startDate),
      currency: loadedResult.currency,
      showInBtc: false,
      inputMode: 'fiat'
    });
    setIsManualCalculation(false);
  }, []);


  return (
    <PlacementProvider value={sz}>
      <WhatIfSeoHead language={language} />


      
      <PageBackground variant="clean">
        <Header />

        <main id="main-content" className="relative z-10" style={{ paddingTop: 'max(env(safe-area-inset-top), 5rem)' }}>
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb Navigation */}
            <div className="pt-6 sm:pt-8">
              <Breadcrumb
                items={[
                  { label: language==='tr'?'Hesaplayıcılar':'Calculators', href: language==='tr'?'/tr/hesaplayicilar':'/calculators' },
                  { label: language==='tr'?'Ya Olsaydı Hesaplayıcısı':'What If Calculator' }
                ]}
              />
            </div>

            {/* Hero Section */}
            <section className="py-8 sm:py-12 text-center">
              <div className="max-w-3xl mx-auto space-y-5 animate-fade-in">
                <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium border border-primary/10">
                  <Calculator className="w-4 h-4" />
                  {language==='tr'?'Bitcoin Yatırım Hesaplayıcısı':'Bitcoin Investment Calculator'}
                </div>

                <h1 className="text-h1 font-semibold text-foreground">
                  {language==='tr'?<>Bitcoin <span className="text-gradient-premium">Ya Olsaydı</span> Hesaplayıcısı</>:<>Bitcoin <span className="text-gradient-premium">What If</span> Calculator</>}
                </h1>

                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  {language==='tr'?'"Bitcoin alsaydım ne olurdu" senaryosu çalıştırmak, Bitcoin\'in tarihe göre değerini kontrol etmek veya varsayımsal getirilerinizi hesaplamak için — herhangi bir miktar ve tarih girerek yatırımınızın bugün tam olarak ne değerde olacağını görün.':'Whether you want to run a "what if I bought Bitcoin" scenario, check Bitcoin\'s value by date, or calculate your hypothetical returns over time — enter any amount and date to see exactly what your investment would be worth today.'}
                </p>

                <div className="max-w-sm mx-auto pt-1">
                  <CompactLiveBitcoinPrice currency={calculationParams?.currency || 'USD'} />
                </div>
              </div>
            </section>

            {/* Zone 1 — pre-calculator slim banner */}
            <div className="pb-4"><sz.SlotA /></div>

            {/* Calculator Section */}
            <section className="pb-10 sm:pb-14">
              <div className="space-y-8 sm:space-y-10">
              {/* Offline Indicator */}
              <OfflineIndicator />
              
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-8">
                <WhatIfInputPanel
                  onCalculate={handleCalculate}
                  loading={isLoading}
                  initialValues={initialFromUrl ?? undefined}
                  autoSubmit={!!initialFromUrl}
                />

                <WhatIfResultsPanel
                  language={language}
                  error={error as Error | null}
                  isLoading={isLoading}
                  result={result}
                  calculationParams={calculationParams}
                  calculationStage={calculationStage}
                  onRetry={handleRetry}
                />
              </div>


              {/* Chart Section */}
              {result && (
                  <div className="animate-fade-in overflow-hidden rounded-2xl">
                  <ModernChart
                    priceData={result.priceData}
                    currency={result.currency}
                    investmentAmount={result.investmentAmount}
                    startDate={result.startDate}
                  />
                </div>
              )}

              {/* Modern Cross-Asset Comparison */}
              {result && (
                  <div className="animate-fade-in overflow-hidden rounded-2xl">
                  <ModernCrossAssetComparison result={result} />
                </div>
              )}

              {/* Scenario Insights Dashboard */}
              {result && (
                  <div className="animate-fade-in overflow-hidden rounded-2xl">
                  <WhatIfScenarioInsightsPanel result={result} />
                </div>
              )}

              {/* Share Snapshot */}
              {result && calculationParams && (
                  <div className="animate-fade-in space-y-3 overflow-hidden rounded-2xl">
                  <WhatIfShareSnapshot result={result} />
                  <div className="flex justify-end pt-1">
                    <CopyShareLinkButton
                      slug="what-if"
                      variant="pill"
                      label="Share results"
                      headline={`What if I bought ${calculationParams.inputMode === 'btc' ? `${calculationParams.amount} BTC` : `${calculationParams.currency} ${calculationParams.amount.toLocaleString()}`} on ${calculationParams.startDate.toISOString().slice(0, 10)}? → ${result.roiPercentage >= 0 ? '+' : ''}${result.roiPercentage.toFixed(0)}% return`}
                      params={{
                        amount: calculationParams.amount,
                        start: calculationParams.startDate,
                        currency: calculationParams.currency,
                        mode: calculationParams.inputMode,
                        showBtc: calculationParams.showInBtc,
                      }}
                    />
                  </div>
                </div>
              )}


              {/* Enhanced Historical Analysis */}
              {result && (
                  <div className="animate-fade-in overflow-hidden rounded-2xl">
                  <HistoricalAnalysis result={result} investmentAmount={result.investmentAmount} />
                </div>
              )}
              </div>
            </section>

            {/* Zone 2 — post-result spotlight */}
            <div className="pb-8"><sz.SlotB /></div>


            {/* SEO H2 Section */}
            <section className="pb-10 sm:pb-14">
              <div className="max-w-3xl">
                <h2 className="text-h2 font-semibold text-foreground mb-4">
                  {language==='tr'?'Bitcoin Tarihsel Getiri Hesaplayıcısı — Yatırımınız Bugün Ne Değer Olurdu?':'Bitcoin Historical Return Calculator — What Would Your Investment Be Worth Today?'}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {language==='tr'?'Bu Bitcoin tarihsel getiri hesaplayıcısı, geçmişteki herhangi bir Bitcoin yatırımının tam değerini aramanıza olanak tanır. Toplam getirinizi, yıllık kazancınızı, ROI yüzdenizi ve mevcut portföy değerinizi görmek için bir satın alma tarihi ve tutarı girin — hepsi gerçek günlük kapanış fiyat verilerine dayanmaktadır.':'This Bitcoin historical return calculator lets you look up the exact value of any past Bitcoin investment. Enter a purchase date and amount to see your total return, annualized gain, ROI percentage, and current portfolio value — all based on real daily closing price data.'}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {language==='tr'?'2010\'da Bitcoin\'e yatırılan 100 $\'ın bugün ne değerde olduğunu mu merak ediyorsunuz? Ya da 2017\'de yapılan 1.000 $\'lık bir alımın iki boğa koşusu ve bir ayı piyasasında nasıl performans gösterdiğini mi? Yukarıdaki hesaplayıcı bu soruları anında yanıtlıyor.':'Wondering what $100 invested in Bitcoin in 2010 would be worth? Or how a $1,000 purchase in 2017 performed through two bull runs and a bear market? The calculator above answers these questions instantly. Even a modest $10,000 investment in early 2020 — before the COVID crash — would have grown to over $96,000 at today\'s prices. These aren\'t hypothetical projections. They\'re historical facts, calculated from Bitcoin\'s actual market data.'}
                </p>
              </div>
            </section>
          </div>
          {/* /max-w-6xl page wrapper */}

          {/* Real-World Investment Examples */}
          <WhatIfRealExamples />

          {/* Why Bitcoin Has Grown */}
          <WhatIfWhyBitcoinGrew />

          {/* Key Dates to Try */}
          <WhatIfKeyDates />

          {/* Educational Content Sections */}
          <WhatIfContentSections />

          {/* New How It Works & FAQ Section */}
          <section className="calc-section-band">
            <div className="backdrop-blur-sm">
              {/* Zone 4 — pre-FAQ checkpoint */}
              <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8"><sz.SlotC /></div>

              <NewHowItWorksSection />
            </div>
          </section>

          {/* Downside-risk internal link */}
          <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 pb-8">
            <div className="max-w-3xl mx-auto text-center text-sm text-muted-foreground">
              {language==='tr' ? (
                <>Ya alımdan sonra çökerse? <Link to="/calculators/drawdown" className="text-primary hover:underline font-medium">%30 düzeltme senaryosunu</Link> tarihsel Bitcoin çöküşlerine karşı çalıştırın.</>
              ) : (
                <>What if it crashes after you buy? Run a <Link to="/calculators/drawdown" className="text-primary hover:underline font-medium">30% correction scenario</Link> against every historical Bitcoin crash.</>
              )}
            </div>
          </section>

          {/* Related Calculators (legacy post-result banner removed — Zone 2 above covers it) */}
          <div className="container mx-auto px-4 sm:px-6"><div className="max-w-6xl mx-auto"><QuickShareLinkPanel slug="what-if" headline={language === 'tr' ? 'Bitcoin What-If Hesaplayıcı' : 'Bitcoin What-If Calculator'} /></div></div>
          <RelatedCalculators />

          {/* Minimalist Disclaimer */}
          <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 pb-16">
            <div className="max-w-3xl mx-auto">
              <Card className="glass-morphism-card border-border/30 rounded-2xl shadow-sm">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{language==='tr'?'Sorumluluk Reddi':'Disclaimer'}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {language==='tr'?'Bu hesaplayıcı yalnızca eğitim amaçlıdır. Geçmiş performans gelecekteki sonuçları garanti etmez. Bitcoin yatırımları önemli risk taşır.':'This calculator is for educational purposes only. Past performance does not guarantee future results. Bitcoin investments carry significant risk.'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
        <Footer />
        <sz.SlotD />
      </PageBackground>
    </PlacementProvider>
  );
};

export default BitcoinWhatIfCalculator;
