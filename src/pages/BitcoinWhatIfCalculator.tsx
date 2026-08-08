// Link import removed — post-calculator internal links now live in child components/zones.
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useSmartZones } from "@/hooks/useSmartZones";
import { PlacementProvider } from "@/contexts/PlacementProvider";
import { useSafeLanguage } from "@/hooks/useSafeLanguage";
import { useEngagementSignal } from "@/hooks/useEngagementSignal";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PageBackground } from "@/components/modern/PageBackground";
import { ModernChart } from "@/components/modern/ModernChart";
import { CompactLiveBitcoinPrice } from "@/components/CompactLiveBitcoinPrice";
import { HistoricalAnalysis } from "@/components/HistoricalAnalysis";
import { ModernCrossAssetComparison } from "@/components/modern/ModernCrossAssetComparison";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { WhatIfScenarioInsightsPanel } from "@/components/what-if/WhatIfScenarioInsightsPanel";
import { WhatIfShareSnapshot } from "@/components/what-if/WhatIfShareSnapshot";
import { WhatIfSeoHead } from "@/components/what-if/WhatIfSeoHead";
import { WhatIfInputPanel } from "@/components/what-if/WhatIfInputPanel";
import { WhatIfResultsPanel } from "@/components/what-if/WhatIfResultsPanel";
import { WhatIfZoneTwo } from "@/components/what-if/WhatIfZoneTwo";
import { WhatIfZoneThree } from "@/components/what-if/WhatIfZoneThree";
import { WhatIfZoneFour } from "@/components/what-if/WhatIfZoneFour";
import { LAST_REFRESHED } from "@/data/whatIfAnchors";
import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { bitcoinApi, CalculationResult } from "@/services/bitcoinApi";
import { Calculator, AlertTriangle } from "lucide-react";
import { CopyShareLinkButton } from "@/components/share/CopyShareLinkButton";
import { readShareParams } from "@/utils/shareLink";
import { useLanguage } from "@/contexts/LanguageContext";
import { QuickShareLinkPanel } from '@/components/share-export';
import { PageQuickAnswer } from "@/components/calculator/PageQuickAnswer";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import RelatedCalculators from '@/components/RelatedCalculatorsLazy';
import { Card, CardContent } from '@/components/ui/card';

const BitcoinWhatIfCalculator = () => {
  const { language, t } = useLanguage();

  // Hydrate from shared URL once on mount.
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
  useEngagementSignal("what-if");
  const [calculationParams, setCalculationParams] = useState<{
    amount: number;
    startDate: Date;
    currency: string;
    showInBtc: boolean;
    inputMode: 'fiat' | 'btc';
  } | null>(null);
  const [isManualCalculation, setIsManualCalculation] = useState(false);
  const [calculationStage, setCalculationStage] = useState<'fetching-current' | 'fetching-historical' | 'fetching-range' | 'calculating' | 'complete'>('fetching-current');

  const { data: result, isLoading, error, refetch } = useQuery<CalculationResult>({
    queryKey: ['bitcoin-calculation', calculationParams],
    queryFn: async () => {
      if (!calculationParams) throw new Error('No calculation parameters');
      
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
      if (error.message.includes('Network Error')) return failureCount < 3;
      if (error.message.includes('timeout')) return failureCount < 2;
      return failureCount < 1;
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
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

  const breadcrumbItems = [
    { label: language==='tr'?'Hesaplayıcılar':'Calculators', href: language==='tr'?'/tr/hesaplayicilar':'/calculators' },
    { label: language==='tr'?'Ya Olsaydı Hesaplayıcısı':'What If Calculator' }
  ];

  return (
    <PlacementProvider value={sz}>
      <WhatIfSeoHead language={language} />

      <PageBackground variant="clean">
        <Header />

        <main id="main-content" className="relative z-10" style={{ paddingTop: 'max(env(safe-area-inset-top), 5rem)' }}>
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="pt-6 sm:pt-8">
              <Breadcrumb items={breadcrumbItems} />
            </div>

            <section className="py-8 sm:py-12 text-center">
              <div className="max-w-3xl mx-auto space-y-5 animate-fade-in">
                <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium border border-primary/10 max-w-full">
                  <Calculator className="w-4 h-4 shrink-0" />
                  <span className="break-words">{language==='tr'?'Bitcoin Yatırım Hesaplayıcısı':'Bitcoin Investment Calculator'}</span>
                </div>

                <h1 className="text-h1 font-semibold text-foreground break-words">
                  {language==='tr'?<>Bitcoin <span className="text-gradient-premium">Ya Olsaydı</span> Hesaplayıcısı</>:<>Bitcoin <span className="text-gradient-premium">What If</span> Calculator</>}
                </h1>

                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed break-words">
                  {language==='tr'?'"Bitcoin alsaydım ne olurdu" senaryosu çalıştırmak, Bitcoin\'in tarihe göre değerini kontrol etmek veya varsayımsal getirilerinizi hesaplamak için — herhangi bir miktar ve tarih girerek yatırımınızın bugün tam olarak ne değerde olacağını görün.':'Whether you want to run a "what if I bought Bitcoin" scenario, check Bitcoin\'s value by date, or calculate your hypothetical returns over time — enter any amount and date to see exactly what your investment would be worth today.'}
                </p>

                <div className="max-w-sm mx-auto pt-1">
                  <CompactLiveBitcoinPrice currency={calculationParams?.currency || 'USD'} />
                </div>
              </div>
            </section>

            {/* SlotA — pre-calculator spotlight */}
            <div className="pb-4"><sz.SlotA /></div>

            <div className="container mx-auto px-4 sm:px-6">
              <PageQuickAnswer
                en='The what-if calculator answers what a past Bitcoin investment would be worth today. Choose a date and an amount, and it returns the BTC purchased, current value, total return and annualised growth using verified daily closing prices going back to 2013.'
                tr='Ya alsaydım hesaplayıcısı, geçmişte yapılmış bir Bitcoin yatırımının bugün ne kadar değerde olacağını yanıtlar. Bir tarih ve tutar seçin; 2013’e kadar doğrulanmış günlük kapanış fiyatlarıyla alınan BTC’yi, güncel değeri, toplam getiriyi ve yıllıklandırılmış büyümeyi verir.'
              />
            </div>

            <section className="pb-10 sm:pb-14">
              <div className="space-y-8 sm:space-y-10">
              <OfflineIndicator />
              
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-8">
                <div className="lg:sticky lg:top-24 lg:self-start">
                  <ErrorBoundary>
                    <WhatIfInputPanel
                      onCalculate={handleCalculate}
                      loading={isLoading}
                      initialValues={initialFromUrl ?? undefined}
                      autoSubmit={!!initialFromUrl}
                    />
                  </ErrorBoundary>
                </div>

                <div className="space-y-4">
                  <ErrorBoundary>
                    <WhatIfResultsPanel
                      language={language}
                      error={error as Error | null}
                      isLoading={isLoading}
                      result={result}
                      calculationParams={calculationParams}
                      calculationStage={calculationStage}
                      onRetry={handleRetry}
                    />
                  </ErrorBoundary>
                  
                  {/* SlotB — result-adjacent spotlight */}
                  <sz.SlotB />
                </div>
              </div>

              {result && (
                <div className="animate-fade-in space-y-10">
                  <div className="overflow-hidden rounded-2xl">
                    <ModernChart
                      priceData={result.priceData}
                      currency={result.currency}
                      investmentAmount={result.investmentAmount}
                      startDate={result.startDate}
                    />
                  </div>

                  <div className="overflow-hidden rounded-2xl">
                    <ModernCrossAssetComparison result={result} />
                  </div>

                  <div className="overflow-hidden rounded-2xl">
                    <WhatIfScenarioInsightsPanel result={result} />
                  </div>

                  <div className="space-y-3 overflow-hidden rounded-2xl">
                    <WhatIfShareSnapshot result={result} />
                    <div className="flex justify-end pt-1">
                      <CopyShareLinkButton
                        slug="what-if"
                        variant="pill"
                        label="Share results"
                        headline={`What if I bought ${calculationParams?.inputMode === 'btc' ? `${calculationParams.amount} BTC` : `${calculationParams?.currency} ${calculationParams?.amount?.toLocaleString()}`} on ${calculationParams?.startDate?.toISOString()?.slice(0, 10)}? → ${result.roiPercentage >= 0 ? '+' : ''}${result.roiPercentage.toFixed(0)}% return`}
                        params={{
                          amount: calculationParams?.amount || 0,
                          start: calculationParams?.startDate || new Date(),
                          currency: calculationParams?.currency || 'USD',
                          mode: calculationParams?.inputMode || 'fiat',
                          showBtc: calculationParams?.showInBtc || false,
                        }}
                      />
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-2xl">
                    <HistoricalAnalysis result={result} investmentAmount={result.investmentAmount} />
                  </div>
                </div>
              )}
              </div>
            </section>
          </div>

          <WhatIfZoneTwo language={language} />

          {/* SlotC — mid-content checkpoint */}
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-6"><sz.SlotC /></div>

          <WhatIfZoneThree language={language} />

          <div className="container mx-auto px-4 sm:px-6 py-8">
            <div className="max-w-6xl mx-auto">
              <QuickShareLinkPanel
                slug="what-if"
                headline={language === 'tr' ? 'Bitcoin What-If Hesaplayıcı' : 'Bitcoin What-If Calculator'}
              />
            </div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 pb-6">
            <p className="text-center text-xs text-muted-foreground/80">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-card/40 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
                {language === 'tr'
                  ? `Son güncelleme: ${LAST_REFRESHED === 'July 2026' ? 'Temmuz 2026' : LAST_REFRESHED} · Referans BTC fiyatı 65.000 $`
                  : `Last updated ${LAST_REFRESHED} · Reference BTC price $65,000`}
              </span>
            </p>
          </div>

          <WhatIfZoneFour language={language} />
          
          <div className="container mx-auto px-6">
            <RelatedCalculators />
          </div>

          <section className="container mx-auto px-6 pb-16 pt-8">
            <div className="max-w-3xl mx-auto">
              <Card className="glass-morphism-card border-border/20 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{language === 'tr' ? 'Feragatname' : 'Disclaimer'}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {language === 'tr' 
                          ? 'Bu hesaplayıcı tarihsel verilere dayanmaktadır ve gelecek performansın garantisi değildir. Yatırım kararlarınızı vermeden önce mutlaka kendi araştırmanızı yapın.'
                          : 'This calculator is based on historical data and is not a guarantee of future performance. Always do your own research before making investment decisions.'}
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
