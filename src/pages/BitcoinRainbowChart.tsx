import { HelmetOgImage } from "@/components/seo/HelmetOgImage";
import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Breadcrumb } from '@/components/Breadcrumb';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { DatasetSchema } from '@/components/seo/DatasetSchema';
import RelatedCalculators from '@/components/RelatedCalculatorsLazy';
import { PreFAQPlacement } from '@/components/placement/PreFAQPlacement';
import { useSafeLanguage } from '@/hooks/useSafeLanguage';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, AlertTriangle, GitCompare, Scale } from 'lucide-react';
import { useLiveBitcoinPrice } from '@/hooks/useLiveBitcoinPrice';
import { PageBackground } from '@/components/modern/PageBackground';
import { CompactLiveBitcoinPrice } from '@/components/CompactLiveBitcoinPrice';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RainbowPriceChart } from '@/components/rainbow/RainbowPriceChart';
import { CurrentZoneIndicator } from '@/components/rainbow/CurrentZoneIndicator';
import { RainbowBandLegend } from '@/components/rainbow/RainbowBandLegend';
import { RainbowActionableSignals } from '@/components/rainbow/RainbowActionableSignals';
import { RainbowExportReport } from '@/components/rainbow/RainbowExportReport';
import { RainbowFAQSection } from '@/components/rainbow/RainbowFAQSection';
import { RainbowHowItWorksSection } from '@/components/rainbow/RainbowHowItWorksSection';
import { TradingBrokerBanner } from "@/components/affiliateAI/TradingBrokerBanner";
import { staticDataService } from '@/services/staticDataService';
import { bitcoinApi } from '@/services/bitcoinApi';
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocalizedSchema } from "@/hooks/useLocalizedSchema";
import { useUsdToTryRate } from '@/hooks/useUsdToTryRate';
import { formatMoney } from '@/utils/formatMoney';
import {
  generateChartData,
  getCurrentBand,
  getBandStatistics,
} from '@/services/rainbowChartService';

const BitcoinRainbowChart: React.FC = () => {
  const { language, t } = useLanguage();
  const tr = language === 'tr';
  const fxRate = useUsdToTryRate();
  const { price: liveBtcPrice, isLoading: isLoadingPrice, priceChangePercentage24h } = useLiveBitcoinPrice();

  // Fetch historical price data
  const { data: priceHistory, isLoading: isLoadingPrices } = useQuery({
    queryKey: ['rainbow-price-history'],
    queryFn: async () => {
      // Load static data first (fast, local)
      const staticStart = new Date('2010-07-01');
      const today = new Date();
      const staticData = await staticDataService.getPriceRange(staticStart, today);

      // Fill recent gap with CoinGecko
      const latestStaticDate = staticData.length > 0
        ? new Date(staticData[staticData.length - 1].date)
        : new Date('2025-01-01');
      
      const gapDays = Math.ceil((today.getTime() - latestStaticDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (gapDays > 2) {
        try {
          const recentData = await bitcoinApi.getPriceRange(latestStaticDate, today);
          // Merge — CoinGecko data overrides static data for overlapping dates
          const recentDates = new Set(recentData.map(d => d.date));
          const merged = staticData.filter(d => !recentDates.has(d.date));
          merged.push(...recentData);
          return merged.sort((a, b) => a.date.localeCompare(b.date));
        } catch (error) {
          console.warn('Failed to fetch recent prices, using static data only:', error);
        }
      }

      return staticData;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  // Generate chart data
  const chartData = useMemo(() => {
    if (!priceHistory || priceHistory.length === 0) return [];
    return generateChartData(priceHistory, 2);
  }, [priceHistory]);

  // Current band calculation
  const currentBand = useMemo(() => {
    if (!liveBtcPrice || liveBtcPrice === 0) return null;
    return getCurrentBand(liveBtcPrice, new Date());
  }, [liveBtcPrice]);

  // Band statistics
  const bandStats = useMemo(() => {
    if (!priceHistory || priceHistory.length === 0) return [];
    return getBandStatistics(priceHistory);
  }, [priceHistory]);

  const breadcrumbItems = [
    { name: 'Home', url: 'https://bitcoincalculator.tools/' },
    { name: 'Calculators', url: 'https://bitcoincalculator.tools/calculators' },
    { name: 'Rainbow Chart', url: 'https://bitcoincalculator.tools/calculators/rainbow-chart' },
  ];

  const webAppSchema = useLocalizedSchema(
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Live Bitcoin Rainbow Chart",
      "description": "Is Bitcoin cheap, fairly valued, or overpriced right now? The Rainbow Chart tells you in one look. Based on logarithmic regression. Live, free, updated daily.",
      "url": "https://bitcoincalculator.tools/calculators/rainbow-chart",
      "inLanguage": "en",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Any",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "featureList": [
        "Live rainbow price bands",
        "Logarithmic regression",
        "Current zone indicator",
        "Actionable buy/sell signals",
        "Historical band accuracy",
        "PDF export",
      ],
      "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
      "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Canlı Bitcoin Gökkuşağı Grafiği",
      "description": "Bitcoin şu anda ucuz mu, adil değerde mi yoksa aşırı pahalı mı? Gökkuşağı Grafiği tek bakışta söyler. Logaritmik regresyona dayalı. Canlı, ücretsiz, günlük güncelleme.",
      "url": "https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-gokkusagi-grafigi",
      "inLanguage": "tr",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Any",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "featureList": [
        "Canlı gökkuşağı fiyat bantları",
        "Logaritmik regresyon",
        "Mevcut bölge göstergesi",
        "Eyleme dönük alış/satış sinyalleri",
        "Tarihsel bant doğruluğu",
        "PDF dışa aktarım",
      ],
      "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
      "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
    },
  );

  const howToSchema = useLocalizedSchema(
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Use the Bitcoin Rainbow Price Chart",
      "description": "Use the Rainbow Chart in four steps to understand Bitcoin's valuation",
      "inLanguage": "en",
      "step": [
        { "@type": "HowToStep", "name": "Understand the Bands", "text": "The chart uses logarithmic regression to create 9 color-coded bands ranging from blue (Fire Sale) to dark red (Maximum Bubble Territory)" },
        { "@type": "HowToStep", "name": "Find Your Position", "text": "Look for the pulsing dot on the chart showing where Bitcoin's current price sits within the rainbow bands" },
        { "@type": "HowToStep", "name": "Read the Zone", "text": "Each color band has a specific meaning: blue and green zones suggest undervaluation, yellow is fair value, orange to red suggests overvaluation" },
        { "@type": "HowToStep", "name": "Take Action", "text": "Use the zone-specific recommendations linked to our DCA, Investment, and Savings calculators to make informed decisions" },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "Bitcoin Gökkuşağı Fiyat Grafiği Nasıl Kullanılır",
      "description": "Bitcoin'in değerlemesini anlamak için Gökkuşağı Grafiğini dört adımda kullanın.",
      "inLanguage": "tr",
      "step": [
        { "@type": "HowToStep", "name": "Bantları Anlayın", "text": "Grafik, mavi (Yangın Satışı) tonundan koyu kırmızıya (Maksimum Balon Bölgesi) uzanan 9 renkli bant oluşturmak için logaritmik regresyon kullanır." },
        { "@type": "HowToStep", "name": "Pozisyonunuzu Bulun", "text": "Grafik üzerinde Bitcoin'in mevcut fiyatının hangi bant içinde olduğunu gösteren yanıp sönen noktayı arayın." },
        { "@type": "HowToStep", "name": "Bölgeyi Okuyun", "text": "Her renk bandının bir anlamı vardır: mavi ve yeşil değer altı, sarı adil değer, turuncu–kırmızı aşırı değerlemeyi gösterir." },
        { "@type": "HowToStep", "name": "Aksiyon Alın", "text": "Bölgeye özgü önerileri DCA, Yatırım ve Tasarruf hesaplayıcılarımızla birlikte kullanarak bilinçli kararlar verin." },
      ],
    },
  );

  const faqSchema = useLocalizedSchema(
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "inLanguage": "en",
      "mainEntity": [
        { "@type": "Question", "name": "What is the Bitcoin Rainbow Chart?", "acceptedAnswer": { "@type": "Answer", "text": "The Bitcoin Rainbow Chart is a logarithmic regression model that overlays color-coded bands on Bitcoin's historical price. Each band represents a valuation zone from 'Fire Sale' (deep blue) to 'Maximum Bubble Territory' (dark red), helping investors gauge whether Bitcoin is undervalued or overvalued." }},
        { "@type": "Question", "name": "Is the Rainbow Chart accurate for predicting Bitcoin's price?", "acceptedAnswer": { "@type": "Answer", "text": "The Rainbow Chart is not a price prediction tool — it's a long-term valuation framework. It has historically been useful for identifying extreme overvaluation (red zones) and undervaluation (blue/green zones), but should be used alongside other analysis methods." }},
        { "@type": "Question", "name": "What do the different color bands mean?", "acceptedAnswer": { "@type": "Answer", "text": "The 9 bands range from blue (Fire Sale — historically best buying opportunities) through green (Accumulate/Still Cheap), yellow (Fair Value/HODL), orange (FOMO/Is This a Bubble?), to red (Sell/Maximum Bubble). Each zone reflects a different risk-reward profile." }},
        { "@type": "Question", "name": "How often is the Rainbow Chart updated?", "acceptedAnswer": { "@type": "Answer", "text": "Our Rainbow Chart updates in real-time using live Bitcoin price data. The logarithmic regression bands are recalculated continuously to reflect the latest market conditions." }},
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "inLanguage": "tr",
      "mainEntity": [
        { "@type": "Question", "name": "Bitcoin Gökkuşağı Grafiği nedir?", "acceptedAnswer": { "@type": "Answer", "text": "Bitcoin Gökkuşağı Grafiği, Bitcoin'in tarihsel fiyatı üzerine renk kodlu bantlar yerleştiren bir logaritmik regresyon modelidir. Her bant, 'Yangın Satışı'ndan (koyu mavi) 'Maksimum Balon Bölgesi'ne (koyu kırmızı) uzanan bir değerleme bölgesini temsil eder ve yatırımcıların Bitcoin'in ucuz mu yoksa pahalı mı olduğunu görmesine yardımcı olur." }},
        { "@type": "Question", "name": "Gökkuşağı Grafiği Bitcoin fiyatını tahmin etmede doğru mu?", "acceptedAnswer": { "@type": "Answer", "text": "Gökkuşağı Grafiği bir fiyat tahmin aracı değildir — uzun vadeli bir değerleme çerçevesidir. Aşırı değerlemeyi (kırmızı bölgeler) ve değer altını (mavi/yeşil bölgeler) tespit etmede tarihsel olarak yararlı olmuştur, ancak diğer analiz yöntemleriyle birlikte kullanılmalıdır." }},
        { "@type": "Question", "name": "Farklı renk bantları ne anlama gelir?", "acceptedAnswer": { "@type": "Answer", "text": "9 bant maviden (Yangın Satışı — tarihsel olarak en iyi alım fırsatları) yeşile (Biriktir / Hâlâ Ucuz), sarıya (Adil Değer / HODL), turuncuya (FOMO / Balon mu?) ve kırmızıya (Sat / Maksimum Balon) uzanır. Her bölge farklı bir risk–getiri profilini yansıtır." }},
        { "@type": "Question", "name": "Gökkuşağı Grafiği ne sıklıkta güncellenir?", "acceptedAnswer": { "@type": "Answer", "text": "Gökkuşağı Grafiğimiz canlı Bitcoin fiyat verisiyle gerçek zamanlı güncellenir. Logaritmik regresyon bantları en güncel piyasa koşullarını yansıtmak için sürekli olarak yeniden hesaplanır." }},
      ],
    },
  );


  return (
    <>
      <Helmet>
        <title>{t('rainbow.meta.title')}</title>
        <meta name="description" content={t('rainbow.meta.description')} />
        <link rel="canonical" href={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-gokkusagi-grafigi':'https://bitcoincalculator.tools/calculators/rainbow-chart'} />

        <link rel="alternate" hrefLang="tr" href="https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-gokkusagi-grafigi" />
        <link rel="alternate" hrefLang="en" href="https://bitcoincalculator.tools/calculators/rainbow-chart" />
        <link rel="alternate" hrefLang="x-default" href="https://bitcoincalculator.tools/calculators/rainbow-chart" />
        <meta property="og:title" content={t('rainbow.meta.ogTitle')} />
        <meta property="og:description" content={t('rainbow.meta.ogDescription')} />
        <meta property="og:url" content={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-gokkusagi-grafigi':'https://bitcoincalculator.tools/calculators/rainbow-chart'} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="bitcoincalculator.tools" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('rainbow.meta.twitterTitle')} />
        <meta name="twitter:description" content={t('rainbow.meta.twitterDescription')} />
        <meta name="twitter:creator" content="@web3believers" />

        <meta name="twitter:site" content="@web3believers" />
        <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
        <HelmetOgImage slug="bitcoin-rainbow-chart" enAlt={`Bitcoin Rainbow Chart | bitcoincalculator.tools`} />

      <DatasetSchema
        name="Bitcoin Rainbow Chart Bands Dataset"
        description="Logarithmic-regression dataset mapping every historical Bitcoin closing price into one of nine valuation bands (Fire Sale through Maximum Bubble) from 2010 to today."
        url="https://bitcoincalculator.tools/calculators/rainbow-chart"
        temporalCoverage="2010-07-17/.."
        variableMeasured={["BTC closing price (USD)", "Log-regression band index 1–9", "Band label", "Days in band"]}
        keywords={["bitcoin rainbow chart", "log regression bitcoin", "btc valuation bands dataset"]}
      />

      <BreadcrumbSchema language={language} items={breadcrumbItems} />

      <PageBackground variant="clean">
        <Header />

        <main id="main-content" className="pt-20 relative z-10">
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb items={[
              { label: t('rainbow.crumb.calculators'), href: language==='tr'?'/tr/hesaplayicilar':'/calculators' },
              { label: t('rainbow.crumb.current') },
            ]} />
          </div>

          <section className="container mx-auto px-6 py-16 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6 text-sm font-medium text-primary">
              <BarChart3 className="w-4 h-4" />
              {t('rainbow.hero.badge')}
            </div>

            <h1 className="text-h1 font-bold text-foreground mb-4">
              {t('rainbow.hero.titlePrefix')} <span className="text-gradient-premium">{t('rainbow.hero.titleMiddle')}</span> {t('rainbow.hero.titleSuffix')}
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-6 leading-relaxed">
              {t('rainbow.hero.description')}
            </p>

            <div className="max-w-sm mx-auto">
              <CompactLiveBitcoinPrice currency="USD" />
            </div>
          </section>

          <section className="container mx-auto px-6 pb-20">
            <div className="max-w-6xl mx-auto space-y-10">
              <OfflineIndicator />

              {/* Error state for no data */}
              {!isLoadingPrices && (!priceHistory || priceHistory.length === 0) && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-warning/10 border border-warning/30 text-warning">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{t('rainbow.error.title')}</p>
                    <p className="text-sm opacity-80">{t('rainbow.error.body')}</p>
                  </div>
                </div>
              )}

              {/* Rainbow Chart */}
              <ErrorBoundary>
                <RainbowPriceChart
                  chartData={chartData}
                  currentPrice={liveBtcPrice}
                  isLoading={isLoadingPrices}
                />
              </ErrorBoundary>

              {/* Current Zone Indicator */}
              {currentBand && (
                <ErrorBoundary>
                  <Card className="border-border/60 bg-card shadow-sm mb-6">
                    <CardContent className="p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <h2 id="current-rainbow-band-summary" className="text-xl font-semibold text-foreground">
                            {t('rainbow.zone.headingPrefix')} {currentBand.name} {t('rainbow.zone.headingSuffix')}
                          </h2>
                          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                            {tr
                              ? <>Canlı fiyat, bugünkü logaritmik bantta {formatMoney(currentBand.lowerPrice, { tr, fxRate })} ile {formatMoney(currentBand.upperPrice, { tr, fxRate })} arasında yer alıyor. Bunu işlem sinyali değil, değerleme bağlamı olarak değerlendirin.</>
                              : <>The live price sits between {formatMoney(currentBand.lowerPrice, { tr: false })} and {formatMoney(currentBand.upperPrice, { tr: false })} on today&apos;s logarithmic band. Treat this as valuation context, not a trading signal.</>}
                          </p>
                        </div>
                        <div className="text-sm font-medium text-primary whitespace-nowrap">{t('rainbow.zone.bandLabel')} {currentBand.bandIndex}/9</div>
                      </div>
                    </CardContent>
                  </Card>
                  <CurrentZoneIndicator
                    currentBand={currentBand}
                    currentPrice={liveBtcPrice}
                    isLoading={isLoadingPrice}
                  />
                </ErrorBoundary>
              )}

              {/* Actionable Signals */}
              {currentBand && (
                <ErrorBoundary>
                  <RainbowActionableSignals currentBand={currentBand} />
                </ErrorBoundary>
              )}

              {/* Band Legend */}
              <ErrorBoundary>
                <RainbowBandLegend
                  bandStats={bandStats}
                  currentBandIndex={currentBand?.bandIndex ?? 0}
                  isLoading={isLoadingPrices}
                />
              </ErrorBoundary>

              {/* Export */}
              {currentBand && (
                <RainbowExportReport
                  currentBand={currentBand}
                  currentPrice={liveBtcPrice}
                />
              )}
            </div>
          </section>

          <RainbowHowItWorksSection />
          <section className="container mx-auto px-6 py-16">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-morphism-card border-border/20">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-primary font-medium">
                    <GitCompare className="w-5 h-5" />
                    <h2 id="rainbow-chart-v1-v2" className="text-xl font-semibold text-foreground">{t('rainbow.v1v2.title')}</h2>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('rainbow.v1v2.body1')}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('rainbow.v1v2.body2')}
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-morphism-card border-border/20">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-primary font-medium">
                    <Scale className="w-5 h-5" />
                    <h2 id="rainbow-vs-power-law" className="text-xl font-semibold text-foreground">{t('rainbow.compare.title')}</h2>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {language==='tr'?<>Gökkuşağı Grafiği, logaritmik regresyonu renk bölgelerine dönüştürür. <a href="/tr/hesaplayicilar/bitcoin-guc-yasasi" className="text-primary hover:underline">Bitcoin Güç Yasası Hesaplayıcısı</a> ise matematiksel fiyat koridorunun kendisine odaklanır. Tek bir hedef fiyat yerine modele dayalı bir görünüm istediğinizde ikisini birden kullanın. Modelin arkasındaki matematik için <a href="/tr/ogrenin/bitcoin-guc-yasasi-aciklamasi" className="text-primary hover:underline">Bitcoin Güç Yasası açıklamamıza</a> bakın.</> :<>The Rainbow Chart turns logarithmic regression into color zones. The <a href="/calculators/power-law" className="text-primary hover:underline">Bitcoin Power Law Calculator</a> focuses on the mathematical price corridor itself. Use both when you want a model-based view instead of a single target price. For the math behind the model, read our <a href="/learn/bitcoin-power-law-explained" className="text-primary hover:underline">Bitcoin Power Law explained</a> guide.</>}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {language==='tr'?<>Risk bağlamı için, herhangi bir bandın tutunacağını varsaymadan önce bu sayfayı <a href="/tr/hesaplayicilar/bitcoin-dusus-analizi" className="text-primary hover:underline">Bitcoin Düşüş Hesaplayıcısı</a> ile birleştirin.</> :<>For risk context, pair this page with the <a href="/calculators/drawdown" className="text-primary hover:underline">Bitcoin Drawdown Calculator</a> before assuming any band will hold.</>}
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
          <RainbowFAQSection />
          <PreFAQPlacement slug="rainbow-chart" lang={useSafeLanguage()} resultSignals={["valuation", "long-term"]} />
          <RelatedCalculators />

          {/* Disclaimer */}
          <section className="container mx-auto px-6 pb-16">
            <div className="max-w-3xl mx-auto">
              <Card className="glass-morphism-card border-border/20 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{t('rainbow.disclaimer.title')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('rainbow.disclaimer.body')}
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

export default BitcoinRainbowChart;
