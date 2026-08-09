import { Link } from '@/components/LocalizedLink';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PageBackground } from "@/components/modern/PageBackground";
import { ModernDCAInputPanel } from "@/components/modern/ModernDCAInputPanel";
import { CompactLiveBitcoinPrice } from "@/components/CompactLiveBitcoinPrice";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { EnhancedErrorDisplay } from "@/components/EnhancedErrorDisplay";
import RelatedCalculators from "@/components/RelatedCalculatorsLazy";
import { PageSection } from "@/components/calculator/PageSection";
import { Card, CardContent } from "@/components/ui/card";
import { useSmartZones } from "@/hooks/useSmartZones";
import { PlacementProvider } from "@/contexts/PlacementProvider";
import { useSafeLanguage } from "@/hooks/useSafeLanguage";
import { Suspense, useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { bitcoinApi } from "@/services/bitcoinApi";
import { DCACalculator, DCAResult } from "@/services/dcaCalculator";
import { AlertTriangle, Calculator } from "lucide-react";
import { CopyShareLinkButton } from "@/components/share/CopyShareLinkButton";
import { QuickAnswerBox } from "@/components/calculator/QuickAnswerBox";
import { MethodologyBlock } from "@/components/calculator/MethodologyBlock";
import { readShareParams } from "@/utils/shareLink";
import { useLanguage } from "@/contexts/LanguageContext";
import { lazyNamedWithRetry } from "@/utils/lazyWithRetry";
import {
  DCAChartSkeleton,
  DCAResultsSkeleton,
  DCASectionSkeleton,
} from "@/components/dca/DCASkeletons";
import { BitcoinDCASeoHead } from "@/components/dca/BitcoinDCASeoHead";

// Heavy below-the-fold / post-calculation sections are split into their own
// chunks so the initial page JS stays small.
const ModernDCAResultsPanel = lazyNamedWithRetry(
  () => import("@/components/modern/ModernDCAResultsPanel"),
  "ModernDCAResultsPanel",
);
const DCAChartPanel = lazyNamedWithRetry(
  () => import("@/components/advanced/DCAChartPanel"),
  "DCAChartPanel",
);
const DCAPurchasesTable = lazyNamedWithRetry(
  () => import("@/components/advanced/DCAPurchasesTable"),
  "DCAPurchasesTable",
);
const ExportReportButton = lazyNamedWithRetry(
  () => import("@/components/ExportReportButton"),
  "ExportReportButton",
);
const DCAHowItWorksSection = lazyNamedWithRetry(
  () => import("@/components/modern/DCAHowItWorksSection"),
  "DCAHowItWorksSection",
);
const DCAFAQSection = lazyNamedWithRetry(
  () => import("@/components/modern/DCAFAQSection"),
  "DCAFAQSection",
);
const DCAComparisonTable = lazyNamedWithRetry(
  () => import("@/components/dca/DCAComparisonTable"),
  "DCAComparisonTable",
);
const DCAContentSections = lazyNamedWithRetry(
  () => import("@/components/dca/DCAContentSections"),
  "DCAContentSections",
);

import { QuickShareLinkPanel } from '@/components/share-export';
import { Helmet } from "react-helmet-async";
import { buildCalculatorSpeakable } from '@/components/seo/calculatorSpeakable';

const BitcoinDCACalculator = () => {
  const { language, t } = useLanguage();
  const lang = useSafeLanguage();
  const tr = language === 'tr';

  const [dcaResult, setDcaResult] = useState<DCAResult | null>(null);

  const sz = useSmartZones({
    pageSlug: "dca",
    hasResultSignal: !!dcaResult,
    lang,
  });

  // Hydrate initial values from a shared URL once on mount.
  const initialFromUrl = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const p = readShareParams();
    if (!p.has('amount') && !p.has('freq') && !p.has('start')) return null;
    const freq = p.string('freq') as 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | undefined;
    return {
      totalAmount: p.number('amount'),
      frequency: freq && ['daily', 'weekly', 'bi-weekly', 'monthly', 'quarterly'].includes(freq) ? freq : undefined,
      startDate: p.date('start'),
      endDate: p.date('end'),
      currency: p.string('currency'),
    };
  }, []);

  const [dcaResult, setDcaResult] = useState<DCAResult | null>(null);
  const [dcaParams, setDcaParams] = useState<{
    totalAmount: number;
    frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly';
    startDate: Date;
    endDate: Date;
    currency: string;
  } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const { data: priceData, isLoading: priceLoading, error: priceError, refetch } = useQuery({
    queryKey: ['bitcoin-price-data', dcaParams],
    queryFn: async () => {
      if (!dcaParams) throw new Error('No DCA parameters');
      return await bitcoinApi.getPriceRange(
        dcaParams.startDate,
        dcaParams.endDate,
        dcaParams.currency
      );
    },
    enabled: !!dcaParams,
    retry: 2,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  useQuery({
    queryKey: ['current-btc-price', dcaParams?.currency || 'USD'],
    queryFn: () => bitcoinApi.getCurrentPrice(dcaParams?.currency || 'USD'),
    refetchInterval: 30000,
    retry: 2,
  });

  const handleCalculate = useCallback(async (params: typeof dcaParams) => {
    if (!params) return;
    setDcaParams(params);
    setIsCalculating(true);
    setDcaResult(null);
    try {
      const priceRange = await bitcoinApi.getPriceRange(
        params.startDate,
        params.endDate,
        params.currency
      );
      const result = DCACalculator.calculateDCA(params, priceRange);
      setDcaResult(result);
    } catch (error) {
      console.error('DCA calculation failed:', error);
    } finally {
      setIsCalculating(false);
    }
  }, []);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <PlacementProvider value={sz}>
      <BitcoinDCASeoHead />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(buildCalculatorSpeakable(language === 'tr' ? 'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi' : 'https://bitcoincalculator.tools/calculators/dca', language))}</script>
      </Helmet>

      <PageBackground variant="clean">
        <Header />
        
        <main id="main-content" className="pt-20 pb-28 md:pb-20 relative z-10">
          {/* Breadcrumb Navigation */}
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb 
              items={[
                { label: language === 'tr' ? 'Hesaplayıcılar' : 'Calculators', href: language === 'tr' ? '/tr/hesaplayicilar' : '/calculators' },
                { label: t('dca.breadcrumb') }
              ]} 
            />
          </div>
          
          {/* Hero Section */}
          <section aria-labelledby="dca-hero-heading" className="container mx-auto px-6 py-16 text-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full border border-border/60 bg-muted/40 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-6">
              {t('dca.badge')}
            </span>

            <h1 id="dca-hero-heading" className="text-h1 font-bold text-foreground mb-6">
              {language === 'tr' ? 'Bitcoin DCA Hesaplayıcısı' : 'Bitcoin DCA Calculator'}
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              {language === 'tr'
                ? 'Bitcoin DCA stratejinizi gerçek CoinGecko verileriyle test edin. Aylık, haftalık veya günlük alım planınızın geçmişte nasıl sonuç vereceğini, ortalama alış maliyetini ve ROI\'yi hesaplayın.'
                : 'Plan for the future with the most accurate Bitcoin DCA calculator. Model recurring investments, project portfolio growth, and backtest your strategy with professional-grade historical data.'}
            </p>

            {/* Compact Live Bitcoin Price */}
            <CompactLiveBitcoinPrice currency={dcaParams?.currency || 'USD'} />
          </section>

          {/* SlotA — pre-calculator spotlight */}
          <div className="container mx-auto px-6 mb-8">
            <sz.SlotA />
          </div>

          {/* Calculator Section */}
          <section aria-labelledby="dca-calculator-heading" className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto pb-8 text-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full border border-border/60 bg-muted/40 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-4">
                {tr ? 'Hesaplayıcı' : 'Calculator'}
              </span>
              <h2 id="dca-calculator-heading" className="text-h2 font-semibold text-foreground">
                {tr ? 'DCA Stratejinizi Backtest Edin' : 'Backtest Your DCA Strategy'}
              </h2>
            </div>

            <div className="space-y-12">
              <QuickAnswerBox
                answer={language==='tr'
                  ? 'Bitcoin DCA Hesaplayıcısı, sabit bir tutarı düzenli aralıklarla Bitcoin’e yatırmış olsaydınız bugün biriktirdiğiniz BTC’nin ne kadar değerde olacağını gösterir. Tutar, sıklık ve başlangıç tarihinizi girin — toplam yatırımı, biriken BTC miktarını, güncel TRY değerini, ROI’yi, maksimum düşüşü ve Sharpe oranını doğrulanmış geçmiş CoinGecko fiyatlarıyla hesaplarız.'
                  : 'The Bitcoin DCA Calculator shows what your stack would be worth today if you had invested a fixed amount on a recurring schedule into Bitcoin. Enter an amount, frequency, and start date — we compute total invested, BTC accumulated, current USD value, ROI, max drawdown, and Sharpe ratio using verified historical CoinGecko price data.'}
              />
              {/* Offline Indicator */}
              <OfflineIndicator />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Modern DCA Input Panel */}
                <div className="lg:sticky lg:top-24 lg:self-start">
                  <ModernDCAInputPanel
                    onCalculate={handleCalculate}
                    loading={isCalculating || priceLoading}
                    initialValues={initialFromUrl ?? undefined}
                    autoSubmit={!!initialFromUrl}
                  />
                </div>

                {/* Modern DCA Results Panel */}
                <div>
                  <ErrorBoundary>
                    {priceError && (
                      <EnhancedErrorDisplay 
                        error={priceError}
                        onRetry={handleRetry}
                        context="data"
                      />
                    )}

                    {(isCalculating || priceLoading) && (
                      <div
                        className="space-y-3"
                        role="status"
                        aria-live="polite"
                        aria-label={isCalculating ? t('dca.loading.calculating') : t('dca.loading.fetching')}
                      >
                        <DCAResultsSkeleton />
                        <p className="text-center text-sm text-muted-foreground">
                          {isCalculating ? t('dca.loading.calculating') : t('dca.loading.fetching')}
                        </p>
                      </div>
                    )}

                    {dcaResult && dcaParams && !isCalculating && !priceLoading && (
                      <div className="space-y-3">
                        <Suspense fallback={<DCAResultsSkeleton />}>
                          <ModernDCAResultsPanel
                            result={dcaResult}
                            currency={dcaParams.currency}
                            startDate={dcaParams.startDate}
                            endDate={dcaParams.endDate}
                          />
                        </Suspense>
                        <div className="flex justify-end pt-1">
                          <CopyShareLinkButton
                            slug="dca"
                            variant="pill"
                            label="Share results"
                            headline={`My Bitcoin DCA backtest: ${dcaParams.currency} ${dcaParams.totalAmount.toLocaleString()} → ${dcaResult.roiPercentage >= 0 ? '+' : ''}${dcaResult.roiPercentage.toFixed(1)}% ROI`}
                            params={{
                              amount: dcaParams.totalAmount,
                              freq: dcaParams.frequency,
                              start: dcaParams.startDate,
                              end: dcaParams.endDate,
                              currency: dcaParams.currency,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* SlotB — result-adjacent spotlight */}
                    <sz.SlotB />

                    {!dcaResult && !isCalculating && !priceLoading && !priceError && (
                        <Card className="glass-morphism-card border-border/20 shadow-sm">
                          <CardContent className="p-12 text-center">
                          <div className="space-y-4">
                              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                                <Calculator className="w-8 h-8 text-primary" />
                            </div>
                              <div className="space-y-2">
                                <h3 className="text-h3 font-semibold text-foreground">
                                {t('dca.empty.title')}
                              </h3>
                                <p className="text-muted-foreground max-w-md mx-auto">
                                {t('dca.empty.subtitle')}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </ErrorBoundary>
                </div>
              </div>




              {/* Advanced Analytics Section */}
              {dcaResult && priceData && (
                <div className="animate-fade-in space-y-8">
                  {/* Chart Section */}
                  <Suspense fallback={<DCAChartSkeleton />}>
                    <DCAChartPanel
                      dcaResult={dcaResult}
                      priceData={priceData}
                      currency={dcaParams?.currency || 'USD'}
                    />
                  </Suspense>

                  {/* Purchases Table */}
                  <Suspense fallback={<DCASectionSkeleton rows={6} />}>
                    <DCAPurchasesTable
                      purchases={dcaResult.purchases}
                      currency={dcaParams?.currency || 'USD'}
                    />
                  </Suspense>

                  {/* Export Section */}
                  <Suspense fallback={<DCASectionSkeleton rows={1} />}>
                    <ExportReportButton
                      slug="dca"
                      headline={tr ? 'Bitcoin DCA geriye dönük testi' : 'Bitcoin DCA backtest'}
                      pdfTitle={{ en: 'Bitcoin DCA Backtest Report', tr: 'Bitcoin DCA Test Raporu' }}
                      pdfFilename={{ en: 'bitcoin-dca-report', tr: 'bitcoin-dca-raporu' }}
                      shareParams={{
                        amount: dcaParams?.totalAmount,
                        freq: dcaParams?.frequency,
                        start: dcaParams?.startDate,
                        end: dcaParams?.endDate,
                        currency: dcaParams?.currency,
                      }}
                      result={{
                        investmentAmount: dcaResult.totalInvested,
                        currentValue: dcaResult.currentValue,
                        profitLoss: dcaResult.profitLoss,
                        roiPercentage: dcaResult.roiPercentage,
                        currency: dcaParams?.currency || 'USD',
                        startDate: dcaParams?.startDate.toISOString() || '',
                        startPrice: priceData[0]?.price || 0,
                        currentPrice: priceData[priceData.length - 1]?.price || 0,
                        btcAmount: dcaResult.totalBitcoin,
                        priceData: priceData
                      }}
                    />
                  </Suspense>


                </div>
              )}
            </div>
          </section>

          {/* Zone 2 — How It Works (explain the method first) */}
          <PageSection tone="default" width="wide" spacing="loose" aria-labelledby="dca-overview-heading">
            <Suspense fallback={<DCASectionSkeleton rows={3} />}>
              <DCAHowItWorksSection />
            </Suspense>
            <Suspense fallback={<DCASectionSkeleton rows={3} />}>
              <DCAContentSections />
            </Suspense>

            {/* SlotC — mid-content checkpoint */}
            <div className="pt-8">
              <sz.SlotC />
            </div>
          </PageSection>

          {/* Zone 3 — By the Numbers (proof, after the method is explained) */}
          <Suspense fallback={<DCASectionSkeleton rows={5} />}>
            <DCAComparisonTable />
          </Suspense>


          {/* Affiliate placement — intentionally outside any PageSection zone.
              Matches retirement page wrapper: max-w-6xl + responsive px + pb-6 only. */}
          {dcaResult && (
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 pb-6">
              <Suspense fallback={null}>
              </Suspense>
            </div>
          )}

          {/* Zone 4 — Questions & Sources */}
          <PageSection tone="dark" width="wide" spacing="loose" aria-label={tr ? 'Sorular ve Kaynaklar' : 'Questions and Sources'}>
            <Suspense fallback={<DCASectionSkeleton rows={6} />}>
              
              <DCAFAQSection />
            </Suspense>

            <MethodologyBlock
              methodology={language === 'tr'
                ? 'Seçtiğiniz toplam yatırım tutarını ve DCA sıklığını tarih aralığınız boyunca eşit alımlara böleriz. Her alım için tarihsel Bitcoin fiyatını kullanarak alınan BTC miktarını hesaplar, sonra toplam BTC’yi güncel piyasa fiyatıyla değerleyerek toplam yatırım, mevcut değer, kâr/zarar, ROI, ortalama alış fiyatı, maksimum düşüş ve risk metriklerini üretiriz.'
                : 'We split your selected investment amount into equal recurring purchases across the chosen date range. Each purchase uses historical Bitcoin price data to calculate BTC acquired, then values the total BTC stack at the current market price to produce total invested, current value, profit/loss, ROI, average buy price, drawdown, and risk metrics.'}
              sources={[
                { label: 'CoinGecko historical Bitcoin price data', url: 'https://www.coingecko.com/en/coins/bitcoin/historical_data', publisher: 'CoinGecko' },
                { label: 'Dollar-cost averaging overview', url: 'https://www.investopedia.com/terms/d/dollarcostaveraging.asp', publisher: 'Investopedia' },
                { label: 'Bitcoin reference data', url: 'https://bitcoin.org/bitcoin.pdf', publisher: 'Satoshi Nakamoto' },
              ]}
              lastReviewed="2026-06-20"
              reviewer="Web3Believer & Webio"
              labels={language === 'tr'
                ? { title: 'Kaynaklar ve Yöntem', howWeCalculate: 'Nasıl hesaplıyoruz', primarySources: 'Birincil kaynaklar', reviewedBy: 'İncelendi', lastUpdated: 'Son güncelleme', formulasOpen: 'Tüm formüller yukarıda açıkça belgelenmiştir.', disclaimer: 'Feragatname:' }
                : undefined}
              disclaimer={language === 'tr'
                ? 'DCA geriye dönük testleri yalnızca örnek amaçlıdır, yatırım tavsiyesi değildir. Geçmiş Bitcoin getirileri gelecekteki performansı garanti etmez; borsa ücretleri, vergiler, spread ve alımların kesin zamanlaması gerçek sonuçları değiştirebilir.'
                : 'DCA backtests are illustrative, not investment advice. Past Bitcoin returns do not guarantee future performance; exchange fees, taxes, spreads, and exact execution timing can change real-world results.'}
            />

            {/* Downside-risk internal link */}
            <div className="max-w-3xl mx-auto text-center text-sm text-muted-foreground pt-8">
              {language === 'tr' ? (
                <>Düşüş riskini stres testi yapmak ister misiniz? <Link to="/calculators/drawdown" className="text-primary hover:underline font-medium">Bitcoin düzeltme hesaplayıcısı</Link> ile %10–80 senaryolarını modelleyin.</>
              ) : (
                <>Want to stress-test the downside? Model 10–80% scenarios with our <Link to="/calculators/drawdown" className="text-primary hover:underline font-medium">bitcoin correction calculator</Link>.</>
              )}
            </div>

            <div className="pt-8">
              <div className="container mx-auto px-4 sm:px-6"><div className="max-w-6xl mx-auto"><QuickShareLinkPanel slug="dca" headline={language === 'tr' ? 'Bitcoin DCA Hesaplayıcı' : 'Bitcoin DCA Calculator'} /></div></div>
              <RelatedCalculators />
            </div>

            {/* Disclaimer */}
            <div className="max-w-3xl mx-auto pt-8">
              <Card className="glass-morphism-card border-border/20 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{language === 'tr' ? 'Feragatname' : 'Disclaimer'}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('dca.disclaimer')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </PageSection>
        </main>
        <Footer />
        <sz.SlotD />
      </PageBackground>
    </PlacementProvider>
  );
};

export default BitcoinDCACalculator;
