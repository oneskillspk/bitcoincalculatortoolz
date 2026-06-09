import { Link } from '@/components/LocalizedLink';
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { DatasetSchema } from "@/components/seo/DatasetSchema";
import { PageBackground } from "@/components/modern/PageBackground";
import { ModernDCAInputPanel } from "@/components/modern/ModernDCAInputPanel";
import { ModernDCAResultsPanel } from "@/components/modern/ModernDCAResultsPanel";
import { ModernDCAChart } from "@/components/modern/ModernDCAChart";
import { DCAPurchasesTable } from "@/components/advanced/DCAPurchasesTable";
import { DCAChartPanel } from "@/components/advanced/DCAChartPanel";
import { ExportReportButton } from "@/components/ExportReportButton";
import { CompactLiveBitcoinPrice } from "@/components/CompactLiveBitcoinPrice";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { EnhancedErrorDisplay } from "@/components/EnhancedErrorDisplay";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import RelatedCalculators from "@/components/RelatedCalculators";
import { DCAHowItWorksSection } from "@/components/modern/DCAHowItWorksSection";
import { DCAFAQSection } from "@/components/modern/DCAFAQSection";
import { DCAComparisonTable } from "@/components/dca/DCAComparisonTable";
import { DCAContentSections } from "@/components/dca/DCAContentSections";
import { AffiliatePlacement } from "@/components/affiliateAI/AffiliatePlacement";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useCallback, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { bitcoinApi } from "@/services/bitcoinApi";
import { DCACalculator, DCAResult } from "@/services/dcaCalculator";
import { AlertTriangle, BarChart3, TrendingUp, Calculator } from "lucide-react";
import { CopyShareLinkButton } from "@/components/share/CopyShareLinkButton";
import { QuickAnswerBox } from "@/components/calculator/QuickAnswerBox";
import { readShareParams } from "@/utils/shareLink";
import { useLanguage } from "@/contexts/LanguageContext";
import { buildCalculatorSpeakable } from '@/components/seo/calculatorSpeakable';

const BitcoinDCACalculator = () => {
  const { language, t } = useLanguage();
  const tr = language==='tr';
  // Hydrate initial values from a shared URL once on mount.
  // Example: /calculators/dca?amount=10000&freq=monthly&start=2020-01-01&end=2024-01-01&currency=USD
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

  // Fetch Bitcoin price data when DCA params change
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
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get current Bitcoin price for display
  const { data: currentPrice } = useQuery({
    queryKey: ['current-btc-price', dcaParams?.currency || 'USD'],
    queryFn: () => bitcoinApi.getCurrentPrice(dcaParams?.currency || 'USD'),
    refetchInterval: 30000, // 30 seconds
    retry: 2,
  });

  const handleCalculate = useCallback(async (params: typeof dcaParams) => {
    if (!params) return;
    
    setDcaParams(params);
    setIsCalculating(true);
    setDcaResult(null);
    
    // Wait for price data to be fetched
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
    <>
<Helmet>
  {/* Primary Meta Tags */}
  <title>{tr ? 'Bitcoin DCA Hesaplayıcısı (2026) | Strateji Analizi' : 'Bitcoin DCA Calculator'}</title>
  <meta name="description" content={tr ? 'Ücretsiz Bitcoin DCA hesaplayıcısı: gerçek CoinGecko verileriyle DCA stratejinizi test edin. Birikim BTC, ortalama alış fiyatı ve ROI hesaplama.' : 'Free Bitcoin DCA calculator to model your dollar cost averaging strategy. Estimate returns, average buy price, and performance for smarter investing.'} />
  <meta name="keywords" content={tr ? 'bitcoin dca hesaplayıcı, dolar maliyet ortalama bitcoin, bitcoin dca stratejisi, bitcoin düzenli yatırım hesaplama, kripto dca hesaplayıcı, bitcoin birikim hesaplayıcı türkiye' : 'bitcoin dca calculator, dollar cost averaging bitcoin, bitcoin investment strategy, crypto dca returns, bitcoin regular investment, dca crypto calculator, bitcoin dollar cost averaging tool'} />
  <link rel="canonical" href={tr ? 'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi' : 'https://bitcoincalculator.tools/calculators/dca'} />

  {/* hreflang alternates emitted globally via <GlobalHreflang /> */}
  {/* Open Graph Meta Tags */}
  <meta property="og:title" content={tr ? 'Bitcoin DCA Hesaplayıcısı — Geriye Dönük Test' : 'Bitcoin DCA Calculator'} />
  <meta property="og:description" content={tr ? 'Bitcoin DCA hesaplayıcısı ile dolar maliyet ortalama stratejinizi test edin. Gerçek tarihsel CoinGecko verileriyle birikim BTC ve ROI hesaplama.' : 'Free Bitcoin DCA calculator to model your dollar cost averaging strategy. Estimate returns, average buy price, and performance for smarter investing.'} />
  <meta property="og:url" content={tr ? 'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi' : 'https://bitcoincalculator.tools/calculators/dca'} />
  <meta property="og:type" content="website" />
  <HelmetOgImage slug="bitcoin-d-c-a-calculator" enAlt={`Bitcoin DCA Calculator | bitcoincalculator.tools`} />
  <meta property="og:site_name" content="bitcoincalculator.tools" />

  {/* Twitter Card Meta Tags */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={tr ? 'Bitcoin DCA Hesaplayıcısı' : 'Bitcoin DCA Calculator'} />
  <meta name="twitter:description" content={tr ? 'Bitcoin DCA hesaplayıcısı ile stratejinizi gerçek verilerle test edin.' : 'Model your Bitcoin DCA strategy with estimated returns and average buy price.'} />
  <meta name="twitter:creator" content="@web3believers" />
        
        <meta name="twitter:site" content="@web3believers" />
        {language !== 'tr' && <>
        {/* JSON-LD Structured Data for WebApplication */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": tr ? "Bitcoin DCA Hesaplayıcısı" : "Bitcoin DCA Calculator",
            "description": tr ? "Ücretsiz Bitcoin DCA hesaplayıcısı: dolar maliyet ortalama stratejinizi gerçek CoinGecko verileriyle test edin." : "Free Bitcoin DCA calculator to model your dollar cost averaging strategy. Estimate returns, average buy price, and performance for smarter investing.",
            "url": tr ? "https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi" : "https://bitcoincalculator.tools/calculators/dca",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": tr ? "TRY" : "USD"
            },
            "provider": {
              "@type": "Organization",
              "name": "Bitcoin Calculator Tools"
            },
            "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" }
          })}
        </script>

        {/* HowTo JSON-LD Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": tr ? "Bitcoin Dolar Maliyet Ortalama Getirisi Nasıl Hesaplanır?" : "How to Calculate Bitcoin Dollar Cost Averaging Returns",
            "description": tr ? "Bitcoin DCA yatırım performansınızı ve strateji etkinliğini hesaplamak için adım adım rehber" : "Step-by-step guide to calculate your Bitcoin DCA investment performance and strategy effectiveness",
            "totalTime": "PT3M",
            "supply": [
              {
                "@type": "HowToSupply",
                "name": "Total investment amount, frequency, and date range"
              }
            ],
            "tool": [
              {
                "@type": "HowToTool", 
                "name": "Bitcoin DCA Calculator"
              }
            ],
            "step": [
              {
                "@type": "HowToStep",
                "name": tr ? "Yatırım Parametrelerini Belirleyin" : "Set Investment Parameters",
                "text": tr ? "Toplam yatırım tutarınızı girin ve DCA sıklığınızı seçin (günlük, haftalık veya aylık)" : "Enter your total investment amount and select your DCA frequency (daily, weekly, or monthly)",
                "url": "https://bitcoincalculator.tools/calculators/dca#step1"
              },
              {
                "@type": "HowToStep",
                "name": tr ? "Tarih Aralığını Seçin" : "Choose Date Range",
                "text": tr ? "DCA yatırım döneminiz için başlangıç ve bitiş tarihlerini seçin" : "Select the start and end dates for your DCA investment period",
                "url": "https://bitcoincalculator.tools/calculators/dca#step2"
              },
              {
                "@type": "HowToStep",
                "name": tr ? "DCA Getirisini Hesaplayın" : "Calculate DCA Returns",
                "text": tr ? "Toplam elde edilen Bitcoin, güncel değer, kâr/zarar ve ortalama alış fiyatınızı görün" : "View your total Bitcoin acquired, current value, profit/loss, and average buy price",
                "url": "https://bitcoincalculator.tools/calculators/dca#step3"
              },
              {
                "@type": "HowToStep",
                "name": tr ? "Performansı Analiz Edin" : "Analyze Performance",
                "text": tr ? "DCA stratejinizin etkinliğini anlamak için performans metriklerini, alım geçmişini ve etkileşimli grafikleri inceleyin" : "Review performance metrics, purchase history, and interactive charts to understand your DCA strategy effectiveness",
                "url": "https://bitcoincalculator.tools/calculators/dca#step4"
              }
            ]
          })}
        </script>

        {/* FAQ JSON-LD Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": tr ? "Bitcoin Dolar Maliyet Ortalama (DCA) Nedir?" : "What is Bitcoin Dollar-Cost Averaging (DCA)?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": tr ? "Dolar Maliyet Ortalama (DCA), fiyattan bağımsız olarak düzenli aralıklarla Bitcoin'e sabit bir miktar yatırım yaptığınız bir stratejidir." : "Dollar-Cost Averaging (DCA) is an investment strategy where you invest a fixed amount of money into Bitcoin at regular intervals, regardless of the price. For example, buying $100 of Bitcoin every Friday. This approach helps reduce the impact of volatility and avoids the risk of investing a large sum at a price peak."
                }
              },
              {
                "@type": "Question",
                "name": tr ? "Bu hesaplayıcı portföy değerini nasıl belirler?" : "How does this calculator determine the portfolio's value?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": tr ? "Hesaplayıcımız, tekrarlayan alımlarınızı kesin tarihsel Bitcoin fiyat verileriyle simüle eder. Seçtiğiniz zaman aralığındaki her alım tarihi için ne kadar BTC alacağınızı hesaplar ve toplam birikmiş Bitcoin'inizi güncel piyasa fiyatıyla değerleyerek nihai portföy değerini belirler." : "Our calculator simulates your recurring purchases by using precise historical Bitcoin price data. For each purchase date in your selected timeframe, it calculates how much BTC you would have acquired and then values your total accumulated Bitcoin at the current market price to determine the final portfolio value."
                }
              },
              {
                "@type": "Question",
                "name": tr ? "'Ortalama Alış Fiyatı' nedir ve neden önemlidir?" : "What is the 'Average Buy Price' and why is it important?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": tr ? "Ortalama Alış Fiyatı, yatırım dönemi boyunca tüm Bitcoin'leriniz için ödediğiniz ortalama fiyattır. DCA için kritik bir metriktir çünkü efektif giriş noktanızı gösterir." : "The Average Buy Price is the average price you paid for all of your Bitcoin throughout your investment period. It's a crucial metric for DCA because it shows your effective entry point. A primary goal of DCA is to achieve an average buy price that is lower than what you might have gotten with a single lump-sum investment."
                }
              },
              {
                "@type": "Question",
                "name": "Does this calculation include exchange fees or taxes?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "This calculator models the raw asset growth based on historical market prices and does not account for exchange fees, which can vary by platform. It is intended for educational purposes to demonstrate the effectiveness of a DCA strategy. Always consult a financial advisor regarding tax implications."
                }
              },
              {
                "@type": "Question",
                "name": "How much Bitcoin should I buy each month?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Use our Bitcoin DCA calculator to model any monthly purchase amount. Enter how much you want to invest per month and see your projected Bitcoin stack and value over time based on historical average returns. Even small amounts like $50 or $100 per month can compound significantly over multiple years."
                }
              },
              {
                "@type": "Question",
                "name": "What is a Bitcoin cost average calculator?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A Bitcoin dollar-cost averaging (DCA) calculator shows what your Bitcoin investment would be worth if you had bought a fixed amount regularly — daily, weekly, or monthly — instead of all at once. It calculates your average buy price, total Bitcoin accumulated, and overall return on investment using real historical price data."
                }
              },
              {
                "@type": "Question",
                "name": "Does Bitcoin have compound interest?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Bitcoin itself does not pay interest, but the practice of dollar-cost averaging creates a compounding effect by accumulating Bitcoin at varying prices over time. The compound growth shown here reflects price appreciation on your growing BTC stack, not interest payments."
                }
              },
              {
                "@type": "Question",
                "name": "What happens if I invest $100 in Bitcoin every month?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "At current prices, $100/month buys roughly 120,000-150,000 satoshis. Over 5 years, that's $6,000 invested. Historically, every 5-year DCA window into Bitcoin has returned positive results, with typical accumulations of 0.05-0.15 BTC depending on the starting year."
                }
              },
              {
                "@type": "Question",
                "name": "Is DCA or lump sum better for Bitcoin?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Lump sum wins when you buy near bottoms, but identifying bottoms in real time is nearly impossible. DCA protects against buying at cycle tops — the 2017 and 2021 tops saw 75-84% drawdowns. For most people, DCA reduces regret risk and emotional stress."
                }
              },
              {
                "@type": "Question",
                "name": "What is the best day of the week to buy Bitcoin?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Backtested data from 2015-2024 shows Monday purchases accumulated approximately 14% more Bitcoin than Sunday purchases. The pattern reflects lower weekend volume and institutional buying on Mondays. Consistency matters more than day selection."
                }
              },
              {
                "@type": "Question",
                "name": "Should I DCA into Bitcoin during a bear market?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Bear markets are historically the best time to DCA. Investors who maintained their DCA through the 2018 and 2022 bear markets accumulated significantly more Bitcoin at lower average costs. Those purchases became the most profitable once prices recovered."
                }
              }
            ]
          })}
        </script>
        </>}

        {language === 'tr' && <>
          <script type="application/ld+json">{JSON.stringify({
            "@context": "https://schema.org", "@type": "WebApplication",
            "name": "Bitcoin DCA Hesaplayıcısı", "inLanguage": "tr",
            "url": "https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi",
            "description": "Ücretsiz Bitcoin DCA hesaplayıcısı ile dolar maliyet ortalama stratejinizi gerçek verilerle test edin.",
            "applicationCategory": "FinanceApplication", "operatingSystem": "Any",
            "offers": {"@type": "Offer", "price": "0", "priceCurrency": "TRY"},
            "provider": {"@type": "Organization", "name": "Bitcoin Calculator Tools"},
            "author": {"@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools"}
          })}</script>
          <script type="application/ld+json">{JSON.stringify({
            "@context": "https://schema.org", "@type": "FAQPage", "inLanguage": "tr",
            "mainEntity": [
              {"@type": "Question", "name": "Bitcoin DCA nedir?", "acceptedAnswer": {"@type": "Answer", "text": "Bitcoin DCA (Dolar Maliyet Ortalaması), fiyattan bağımsız olarak belirli aralıklarla sabit miktarda Bitcoin satın alma stratejisidir. Bu yaklaşım, büyük bir toplu yatırımı piyasa zirvesine denk getirme riskini azaltır ve uzun vadede daha düşük bir ortalama alış maliyeti elde etmenizi sağlar."}},
              {"@type": "Question", "name": "DCA hesaplayıcısı nasıl çalışır?", "acceptedAnswer": {"@type": "Answer", "text": "Hesaplayıcımız, belirlediğiniz başlangıç ve bitiş tarihleri arasındaki gerçek Bitcoin fiyat verilerini (CoinGecko) kullanarak her alım periyodunda ne kadar BTC satın alacağınızı simüle eder. Toplam yatırım, birikim BTC miktarı, ortalama alış fiyatı, mevcut portföy değeri ve ROI yüzdesi otomatik olarak hesaplanır."}},
              {"@type": "Question", "name": "Hangi DCA sıklığı en iyidir — günlük, haftalık veya aylık?", "acceptedAnswer": {"@type": "Answer", "text": "Araştırmalar, DCA sıklığı arasındaki getiri farkının küçük olduğunu göstermektedir. Tutarlılık, sıklık optimizasyonundan çok daha önemlidir. En iyi DCA sıklığı düzenli olarak uygulayabileceğiniz sıklıktır."}},
              {"@type": "Question", "name": "DCA mi yoksa toplu yatırım mı daha iyidir?", "acceptedAnswer": {"@type": "Answer", "text": "Toplu yatırım dip noktalara denk gelirse daha yüksek getiri sağlar; ancak gerçek zamanlı dip noktaları belirlemek neredeyse imkânsızdır. DCA, büyük çöküşlere karşı koruma sağlar ve duygusal stresi azaltır."}},
              {"@type": "Question", "name": "Aylık 1.000 TL Bitcoin yatırımı yaparsam ne olur?", "acceptedAnswer": {"@type": "Answer", "text": "Mevcut Bitcoin fiyatlarıyla aylık 1.000 TL yaklaşık 50.000-70.000 satoshi satın alır. 5 yıl boyunca bu toplam 60.000 TL yatırıma karşılık gelir. Tarihsel veriler, her 5 yıllık DCA penceresinin pozitif getiri sağladığını göstermektedir."}}
            ]
          })}</script>
        </>}

              <script type="application/ld+json">{JSON.stringify(buildCalculatorSpeakable(language === 'tr' ? 'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi' : 'https://bitcoincalculator.tools/calculators/dca', language))}</script>
      </Helmet>

      <DatasetSchema
        name="Historical Bitcoin DCA Returns 2010–2026"
        description="Daily Bitcoin closing-price dataset used to backtest dollar-cost-averaging strategies. Covers every trading day from the Bitcoin genesis-price era through today, sourced from CoinGecko."
        url="https://bitcoincalculator.tools/calculators/dca"
        temporalCoverage="2010-07-17/.."
        variableMeasured={["BTC closing price (USD)", "DCA amount per period", "BTC accumulated", "Cumulative invested (USD)", "ROI %", "Average buy price (USD)"]}
        keywords={["bitcoin dca", "dollar cost averaging", "btc historical price", "dca backtest dataset"]}
      />

      {/* Breadcrumb JSON-LD Schema */}
      <BreadcrumbSchema language={language} 
        items={[
          { name: "Home", url: "https://bitcoincalculator.tools/" },
          { name: "Calculators", url: "https://bitcoincalculator.tools/calculators" },
          { name: "DCA Calculator", url: "https://bitcoincalculator.tools/calculators/dca" }
        ]}
      />
      
      <PageBackground variant="clean">
        <Header />
        
        <main id="main-content" className="pt-20 relative z-10">
          {/* Breadcrumb Navigation */}
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb 
              items={[
                { label: language === 'tr' ? 'Hesaplayıcılar' : 'Calculators', href: language === 'tr' ? '/tr/hesaplayicilar' : '/calculators' },
                { label: t('dca.breadcrumb') }
              ]} 
            />
          </div>
          
          {/* Header Section */}
          <section className="container mx-auto px-6 py-16 text-center">
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/10">
                <BarChart3 className="w-4 h-4" />
                {t('dca.badge')}
              </div>
              
              <h1 className="text-h1 font-bold text-foreground">
                {language === 'tr' ? <>Bitcoin <span className="text-gradient-premium">DCA Hesaplayıcısı</span></> : <>Bitcoin <span className="text-gradient-premium">DCA Calculator</span></>}
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {language === 'tr'
                  ? 'Bitcoin DCA stratejinizi gerçek CoinGecko verileriyle test edin. Aylık, haftalık veya günlük alım planınızın geçmişte nasıl sonuç vereceğini, ortalama alış maliyetini ve ROI\'yi hesaplayın.'
                  : 'Whether you want to model a Bitcoin monthly investment plan, calculate your cost average over time, or see how much $50/month in BTC would be worth today — enter your amount and frequency to backtest your DCA strategy with real historical data'}
              </p>

              {/* Compact Live Bitcoin Price */}
              <div className="max-w-sm mx-auto">
                <CompactLiveBitcoinPrice currency={dcaParams?.currency || 'USD'} />
              </div>
            </div>
          </section>

          {/* Calculator Section */}
          <section className="container mx-auto px-6 pb-20">
            <div className="max-w-6xl mx-auto space-y-12">
              <QuickAnswerBox
                answer={language==='tr'
                  ? 'Bitcoin DCA Hesaplayıcısı, sabit bir tutarı düzenli aralıklarla Bitcoin’e yatırmış olsaydınız bugün biriktirdiğiniz BTC’nin ne kadar değerde olacağını gösterir. Tutar, sıklık ve başlangıç tarihinizi girin — toplam yatırımı, biriken BTC miktarını, güncel TRY değerini, ROI’yi, maksimum düşüşü ve Sharpe oranını doğrulanmış geçmiş CoinGecko fiyatlarıyla hesaplarız.'
                  : 'The Bitcoin DCA Calculator shows what your stack would be worth today if you had invested a fixed amount on a recurring schedule into Bitcoin. Enter an amount, frequency, and start date — we compute total invested, BTC accumulated, current USD value, ROI, max drawdown, and Sharpe ratio using verified historical CoinGecko price data.'}
              />
              {/* Offline Indicator */}
              <OfflineIndicator />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Modern DCA Input Panel */}
                <div>
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
                      <Card className="glass-morphism-card border-border/20 shadow-sm">
                        <CardContent className="p-8 text-center">
                          <LoadingSpinner />
                          <p className="text-sm text-muted-foreground mt-4">
                            {isCalculating ? t('dca.loading.calculating') : t('dca.loading.fetching')}
                          </p>
                        </CardContent>
                      </Card>
                    )}

                    {dcaResult && dcaParams && !isCalculating && !priceLoading && (
                      <div className="space-y-3">
                        <ModernDCAResultsPanel 
                          result={dcaResult}
                          currency={dcaParams.currency}
                          startDate={dcaParams.startDate}
                          endDate={dcaParams.endDate}
                        />
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

                    {!dcaResult && !isCalculating && !priceLoading && !priceError && (
                      <Card className="glass-morphism-card border-border/20 shadow-sm">
                        <CardContent className="p-8 text-center">
                          <div className="space-y-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                              <Calculator className="w-6 h-6 text-primary" />
                            </div>
                            <div className="space-y-1">
                              <h3 className="text-lg font-semibold text-foreground">
                                {t('dca.empty.title')}
                              </h3>
                              <p className="text-sm text-muted-foreground">
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
                  <DCAChartPanel
                    dcaResult={dcaResult}
                    priceData={priceData}
                    currency={dcaParams?.currency || 'USD'}
                  />

                  {/* Purchases Table */}
                  <DCAPurchasesTable
                    purchases={dcaResult.purchases}
                    currency={dcaParams?.currency || 'USD'}
                  />

                  {/* Export Section */}
                  <ExportReportButton 
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
                </div>
              )}
            </div>
          </section>

          {/* SEO H2 Section */}
          <section className="container mx-auto px-6 pb-12">
            <div className="max-w-3xl mx-auto">
              {language === 'tr' ? (
                <>
                  <h2 className="text-h2 font-bold text-foreground mb-4">
                    Bitcoin DCA Hesaplayıcısı: Dolar Maliyet Ortalaması Stratejinizi Test Edin
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Bitcoin DCA hesaplayıcısı, düzenli ve sabit miktarda Bitcoin satın alma stratejinizin geçmişte nasıl performans gösterdiğini simüle etmenizi sağlar. DCA (Dolar Maliyet Ortalaması), fiyat oynaklığına karşı en etkili savunma stratejilerinden biridir: fiyatlar düştüğünde daha fazla Bitcoin alırsınız, yükseldiğinde ise daha az — bu da zaman içinde ortalama alış maliyetinizi düşürür.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Türkiye'deki Bitcoin yatırımcıları için DCA stratejisi özellikle değerlidir. Türk lirası döviz kurundaki dalgalanmalar göz önüne alındığında, düzenli Bitcoin alımları hem fiyat riskini hem de kur riskini yönetmenin akıllıca bir yoludur. Hesaplayıcımız USD, EUR ve TRY dahil 100'den fazla para birimini destekler.
                  </p>
                  <h3 className="text-h3 font-semibold text-foreground mb-2">Bitcoin DCA Nasıl Çalışır?</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Bitcoin DCA'da düzenli aralıklarla sabit bir fiat tutarı yatırırsınız. Fiyat yüksek olduğunda daha az satoshi alırsınız; fiyat düşük olduğunda daha fazla. Bu mekanizma, büyük bir toplu yatırımı piyasa zirvesine denk getirme riskini ortadan kaldırır. Tarihsel veriler, 4 yılı aşkın her DCA penceresinin pozitif getiri sağladığını göstermektedir.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-h2 font-bold text-foreground mb-4">
                    Bitcoin Compound Interest Calculator
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Dollar-cost averaging into Bitcoin produces a compound effect over time — each purchase buys more BTC during dips and less during peaks, reducing your average cost. This Bitcoin compound interest calculator shows how regular contributions compound into significant holdings over months and years.
                  </p>
                </>
              )}
            </div>
          </section>

          {/* Static Comparison Table for AI/SEO */}
          <DCAComparisonTable />

          {/* AI-driven affiliate recommendation */}
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <AffiliatePlacement slug="dca" lang={language === 'tr' ? 'tr' : 'en'} resultSignals={["accumulation", "long-term"]} />
            </div>
          </div>

          {/* Educational Content Sections */}
          <DCAHowItWorksSection />
          <DCAContentSections />
          <DCAFAQSection />

          {/* Downside-risk internal link */}
          <section className="container mx-auto px-6 pb-8">
            <div className="max-w-3xl mx-auto text-center text-sm text-muted-foreground">
              {language === 'tr' ? (
                <>Düşüş riskini stres testi yapmak ister misiniz? <Link to="/calculators/drawdown" className="text-primary hover:underline font-medium">Bitcoin düzeltme hesaplayıcısı</Link> ile %10–80 senaryolarını modelleyin.</>
              ) : (
                <>Want to stress-test the downside? Model 10–80% scenarios with our <Link to="/calculators/drawdown" className="text-primary hover:underline font-medium">bitcoin correction calculator</Link>.</>
              )}
            </div>
          </section>

          {/* Related Calculators Section */}
          <RelatedCalculators />

          {/* Disclaimer */}
          <section className="container mx-auto px-6 pb-16">
            <div className="max-w-3xl mx-auto">
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
          </section>
        </main>
        <Footer />
      </PageBackground>
    </>
  );
};

export default BitcoinDCACalculator;
