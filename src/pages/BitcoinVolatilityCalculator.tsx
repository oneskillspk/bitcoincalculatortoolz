import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useSafeLanguage } from "@/hooks/useSafeLanguage";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { PageBackground } from "@/components/modern/PageBackground";
import { CompactLiveBitcoinPrice } from "@/components/CompactLiveBitcoinPrice";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import RelatedCalculators from "@/components/RelatedCalculatorsLazy";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VolatilityLiveDashboard } from "@/components/volatility/VolatilityLiveDashboard";
import { VolatilityChart } from "@/components/volatility/VolatilityChart";
import { VolatilityCustomCalculator } from "@/components/volatility/VolatilityCustomCalculator";
import { VolatilityComparisonTab } from "@/components/volatility/VolatilityComparisonTab";
import { VolatilityHeatmaps } from "@/components/volatility/VolatilityHeatmaps";
import { VolatilityRollingWindow } from "@/components/volatility/VolatilityRollingWindow";
import { VolatilityPercentileGauge } from "@/components/volatility/VolatilityPercentileGauge";
import { VolatilityContentSections } from "@/components/volatility/VolatilityContentSections";
import { VolatilityFAQSection, volatilityFaqSchemaDataEn, volatilityFaqSchemaDataTr } from "@/components/volatility/VolatilityFAQSection";
import { useQuery } from "@tanstack/react-query";
import { fetchVolatilityData, getAssetComparison } from "@/services/volatilityService";
import { AlertTriangle, Activity } from "lucide-react";
import { QuickAnswerBox } from "@/components/calculator/QuickAnswerBox";
import { useLanguage } from "@/contexts/LanguageContext";
import { buildCalculatorSpeakable } from '@/components/seo/calculatorSpeakable';
import { useLocalizedSchema } from "@/hooks/useLocalizedSchema";

import { HelmetOgImage } from "@/components/seo/HelmetOgImage";
import { PreFAQPlacement } from "@/components/placement/PreFAQPlacement";
import { TradingBrokerBanner } from "@/components/affiliateAI/TradingBrokerBanner";
import { AffiliatePlacement } from "@/components/affiliateAI/AffiliatePlacement";
import { InViewMount } from "@/components/lot-size/InViewMount";
import { QuickShareLinkPanel } from '@/components/share-export';
const BitcoinVolatilityCalculator = () => {
  const { language, t } = useLanguage();

  const webAppSchema = useLocalizedSchema(
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Bitcoin Volatility Calculator",
      "description": "Track live Bitcoin volatility — 7, 30, 60-day realized vol, expected daily moves, and BTC vs S&P 500 and gold comparison.",
      "url": "https://bitcoincalculator.tools/calculators/volatility",
      "inLanguage": "en",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Any",
      "featureList": [
        "Live realized volatility tracking",
        "7-day 30-day 60-day 90-day rolling volatility",
        "Rolling window selector 30d 90d 6m 1y",
        "Volatility percentile gauge",
        "Expected daily and weekly price move",
        "Bitcoin vs S&P 500 volatility comparison",
        "Bitcoin vs gold volatility comparison",
        "Bitcoin vs MSTR COIN TSLA NVDA NFLX comparison",
        "Volatility by hour and day of week",
        "Sharpe ratio calculator",
        "Historical volatility for any date range",
        "Volatility percentile ranking",
      ],
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools" },
      "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Bitcoin Oynaklık Hesaplayıcısı",
      "description": "Canlı Bitcoin oynaklığını takip edin — 7, 30, 60 günlük gerçekleşmiş volatilite, beklenen günlük hareketler ve BTC ile S&P 500, altın karşılaştırması.",
      "url": "https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-oynaklik",
      "inLanguage": "tr",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Any",
      "featureList": [
        "Canlı gerçekleşmiş oynaklık takibi",
        "7, 30, 60, 90 günlük yuvarlanan oynaklık",
        "Yuvarlanan pencere seçici: 30g, 90g, 6a, 1y",
        "Oynaklık yüzdelik göstergesi",
        "Beklenen günlük ve haftalık fiyat hareketi",
        "Bitcoin vs S&P 500 oynaklık karşılaştırması",
        "Bitcoin vs altın oynaklık karşılaştırması",
        "Bitcoin vs MSTR, COIN, TSLA, NVDA, NFLX karşılaştırması",
        "Saat ve haftanın gününe göre oynaklık",
        "Sharpe oranı hesaplayıcısı",
        "Herhangi bir tarih aralığı için tarihsel oynaklık",
        "Oynaklık yüzdelik sıralaması",
      ],
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools" },
      "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
    },
  );

  const howToSchema = useLocalizedSchema(
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Calculate Bitcoin Volatility",
      "description": "Step-by-step guide to calculating Bitcoin's realized volatility using log returns.",
      "inLanguage": "en",
      "totalTime": "PT3M",
      "step": [
        { "@type": "HowToStep", "name": "Collect Price Data", "text": "Collect daily closing prices for your chosen time window (e.g., 30 days of BTC/USD prices)." },
        { "@type": "HowToStep", "name": "Calculate Log Returns", "text": "Calculate daily log returns: ln(today's price / yesterday's price) for each consecutive day." },
        { "@type": "HowToStep", "name": "Find Standard Deviation", "text": "Find the standard deviation of all the log returns in your dataset." },
        { "@type": "HowToStep", "name": "Annualize the Result", "text": "Multiply by √365 to annualize (Bitcoin trades 365 days/year, unlike stocks which use √252)." },
        { "@type": "HowToStep", "name": "Interpret the Result", "text": "The result is annualized realized volatility as a percentage. Below 40% is low for BTC, 40-65% is normal, above 90% is extreme." },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "Bitcoin Oynaklığı Nasıl Hesaplanır",
      "description": "Logaritmik getirilerle Bitcoin'in gerçekleşmiş oynaklığını adım adım hesaplama rehberi.",
      "inLanguage": "tr",
      "totalTime": "PT3M",
      "step": [
        { "@type": "HowToStep", "name": "Fiyat Verisi Toplayın", "text": "Seçtiğiniz zaman penceresi için günlük kapanış fiyatlarını toplayın (örneğin 30 günlük BTC/USD fiyatları)." },
        { "@type": "HowToStep", "name": "Logaritmik Getirileri Hesaplayın", "text": "Her ardışık gün için günlük logaritmik getiriyi hesaplayın: ln(bugünkü fiyat / dünkü fiyat)." },
        { "@type": "HowToStep", "name": "Standart Sapmayı Bulun", "text": "Veri setinizdeki tüm logaritmik getirilerin standart sapmasını bulun." },
        { "@type": "HowToStep", "name": "Sonucu Yıllıklandırın", "text": "√365 ile çarparak yıllıklandırın (Bitcoin yılda 365 gün işlem görür; hisseler için √252 kullanılır)." },
        { "@type": "HowToStep", "name": "Sonucu Yorumlayın", "text": "Sonuç, yüzde olarak yıllık gerçekleşmiş oynaklıktır. BTC için %40'ın altı düşük, %40–65 normal, %90 üzeri aşırıdır." },
      ],
    },
  );

  const faqSchema = useLocalizedSchema(
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "inLanguage": "en",
      "mainEntity": volatilityFaqSchemaDataEn,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "inLanguage": "tr",
      "mainEntity": volatilityFaqSchemaDataTr,
    },
  );
  const { data, isLoading, isError } = useQuery({
    queryKey: ["bitcoin-volatility"],
    queryFn: fetchVolatilityData,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: 2,
  });

  const comparison = data ? getAssetComparison(data.vol30d, data.vol1y) : [];

  return (
    <>
      <Helmet>
        <title>{t('vol.meta.title')}</title>
        <meta name="description" content={t('vol.meta.description')} />
        <link rel="canonical" href={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-oynaklik':'https://bitcoincalculator.tools/calculators/volatility'} />

        <link rel="alternate" hrefLang="tr" href="https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-oynaklik" />
        <link rel="alternate" hrefLang="en" href="https://bitcoincalculator.tools/calculators/volatility" />
        <link rel="alternate" hrefLang="x-default" href="https://bitcoincalculator.tools/calculators/volatility" />
        <meta property="og:title" content={t('vol.meta.ogTitle')} />
        <meta property="og:description" content={t('vol.meta.ogDescription')} />
        <meta property="og:url" content={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-oynaklik':'https://bitcoincalculator.tools/calculators/volatility'} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="bitcoincalculator.tools" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('vol.meta.twitterTitle')} />
        <meta name="twitter:description" content={t('vol.meta.twitterDescription')} />
        <meta name="twitter:creator" content="@web3believers" />

        <meta name="twitter:site" content="@web3believers" />
        <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>

              <script type="application/ld+json">{JSON.stringify(buildCalculatorSpeakable(language === 'tr' ? 'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-oynaklik' : 'https://bitcoincalculator.tools/calculators/volatility', language))}</script>
      </Helmet>
        <HelmetOgImage slug="bitcoin-volatility-calculator" enAlt={`Bitcoin Volatility Calculator | bitcoincalculator.tools`} />

      <BreadcrumbSchema language={language}
        items={[
          { name: "Home", url: "https://bitcoincalculator.tools/" },
          { name: "Calculators", url: "https://bitcoincalculator.tools/calculators" },
          { name: "Volatility Calculator", url: "https://bitcoincalculator.tools/calculators/volatility" },
        ]}
      />

      <PageBackground variant="clean">
        <Header />

        <main id="main-content" className="pt-20 relative z-10">
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb items={[{ label: t('vol.crumb.calculators'), href: language==='tr'?'/tr/hesaplayicilar':'/calculators' }, { label: t('vol.crumb.current') }]} />
          </div>

          <section className="container mx-auto px-6 py-16 text-center">
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/10">
                <Activity className="w-4 h-4" />
                {t('vol.hero.badge')}
              </div>
              <h1 className="text-h1 font-bold text-foreground">
                {t('vol.hero.titlePrefix')} <span className="text-gradient-premium">{t('vol.hero.titleHighlight')}</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('vol.hero.description')}
              </p>
              <div className="max-w-sm mx-auto">
                <CompactLiveBitcoinPrice currency="USD" />
              </div>
            </div>
          </section>

          <section className="container mx-auto px-6 pb-20">
            <div className="max-w-6xl mx-auto space-y-10">
              <QuickAnswerBox answer="Bitcoin volatility measures how much BTC's price swings around its average — annualised, it sits around 60–80%, roughly 4× the S&P 500's 15–20%. The calculator computes 30-day, 90-day, and 1-year rolling standard deviation from CoinGecko price history, then benchmarks BTC against gold, the S&P 500, and the Nasdaq so you can size positions properly." />
              <OfflineIndicator />

              {isError && (
                <div className="flex items-center gap-3 bg-warning/$3 border border-warning/20 rounded-xl p-4">
                  <AlertTriangle className="w-4 h-4 text-warning shrink-0" />
                  <p className="text-sm text-warning">{t('vol.error.fetch')}</p>
                </div>
              )}

              <Tabs defaultValue="live" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8 gap-1 [&_button]:text-xs sm:[&_button]:text-sm [&_button]:px-2">
                  <TabsTrigger value="live">{t('vol.tab.live')}</TabsTrigger>
                  <TabsTrigger value="custom">{t('vol.tab.custom')}</TabsTrigger>
                  <TabsTrigger value="compare">{t('vol.tab.compare')}</TabsTrigger>
                </TabsList>

                <TabsContent value="live" className="space-y-8">
                  <ErrorBoundary>
                    <VolatilityLiveDashboard data={data} loading={isLoading} />
                  </ErrorBoundary>
                  {data && (
                    <ErrorBoundary>
                      <VolatilityPercentileGauge percentile={data.volatilityPercentile} vol30d={data.vol30d} />
                    </ErrorBoundary>
                  )}
                  <ErrorBoundary>
                    <VolatilityRollingWindow data={data} />
                  </ErrorBoundary>
                  <ErrorBoundary>
                    <VolatilityChart data={data} loading={isLoading} />
                  </ErrorBoundary>
                  <ErrorBoundary>
                    <VolatilityHeatmaps data={data} />
                  </ErrorBoundary>
                </TabsContent>

                <TabsContent value="custom">
                  <ErrorBoundary>
                    <VolatilityCustomCalculator data={data} loading={isLoading} />
                  </ErrorBoundary>
                </TabsContent>

                <TabsContent value="compare">
                  {comparison.length > 0 && (
                    <ErrorBoundary>
                      <VolatilityComparisonTab data={comparison} />
                    </ErrorBoundary>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </section>

          <section className="container mx-auto px-6 pb-4">
            <div className="max-w-3xl mx-auto">
              <TradingBrokerBanner slug="volatility" segment="post-results" forceAxi />
            </div>
          </section>

          <VolatilityContentSections />

          <PreFAQPlacement slug="volatility" />
          <VolatilityFAQSection />
          <section className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <QuickShareLinkPanel slug="volatility" headline={language === 'tr' ? 'Bitcoin Volatilite Hesaplayıcı' : 'Bitcoin Volatility Calculator'} />
            </div>
          </section>
          <RelatedCalculators />

          <section className="container mx-auto px-6 pb-16">
            <div className="max-w-3xl mx-auto">
              <Card className="glass-morphism-card border-border/20 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{t('vol.disclaimer.title')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('vol.disclaimer.body')}
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

export default BitcoinVolatilityCalculator;
