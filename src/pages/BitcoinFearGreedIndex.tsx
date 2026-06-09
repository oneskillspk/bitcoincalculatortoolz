import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Breadcrumb } from '@/components/Breadcrumb';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import RelatedCalculators from '@/components/RelatedCalculators';
import { CompactLiveBitcoinPrice } from '@/components/CompactLiveBitcoinPrice';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Activity } from 'lucide-react';
import { PageBackground } from '@/components/modern/PageBackground';
import { FearGreedGauge } from '@/components/fear-greed/FearGreedGauge';
import { FearGreedHistoryChart } from '@/components/fear-greed/FearGreedHistoryChart';
import { SentimentBreakdown } from '@/components/fear-greed/SentimentBreakdown';
import { HistoricalOutcomes } from '@/components/fear-greed/HistoricalOutcomes';
import { ActionableSignals } from '@/components/fear-greed/ActionableSignals';
import { FearGreedTimeline } from '@/components/fear-greed/FearGreedTimeline';
import { FearGreedExportReport } from '@/components/fear-greed/FearGreedExportReport';
import { FearGreedFAQSection } from '@/components/fear-greed/FearGreedFAQSection';
import { FearGreedHowItWorksSection } from '@/components/fear-greed/FearGreedHowItWorksSection';
import { bitcoinApi } from '@/services/bitcoinApi';
import {
  fetchCurrentIndex,
  fetchHistoricalIndex,
  calculateTrend,
  calculateHistoricalOutcomes,
  getClassification,
  getColorClass,
} from '@/services/fearGreedService';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useLanguage } from "@/contexts/LanguageContext";

const BitcoinFearGreedIndex: React.FC = () => {
  const { language, t } = useLanguage();
  // Fetch current F&G index
  const { data: currentData, isLoading: isLoadingCurrent, error: currentError } = useQuery({
    queryKey: ['fear-greed-current'],
    queryFn: fetchCurrentIndex,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });

  // Fetch historical F&G data (365 days)
  const { data: historicalData, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['fear-greed-history'],
    queryFn: () => fetchHistoricalIndex(365),
    staleTime: 60 * 60 * 1000,
  });

  // Fetch historical BTC prices for chart overlay + outcomes correlation
  const { data: btcPriceData } = useQuery({
    queryKey: ['fear-greed-btc-prices', historicalData?.length],
    queryFn: async () => {
      if (!historicalData || historicalData.length === 0) return [];
      const oldestDate = new Date(historicalData[historicalData.length - 1].timestamp);
      const today = new Date();
      const endDate = new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000);
      return bitcoinApi.getPriceRange(oldestDate, endDate);
    },
    enabled: !!historicalData && historicalData.length > 0,
    staleTime: 60 * 60 * 1000,
  });

  const trend = historicalData ? calculateTrend(historicalData) : null;
  const yesterdayValue = historicalData && historicalData.length > 1 ? historicalData[1].value : undefined;
  const lastWeekValue = historicalData && historicalData.length > 6 ? historicalData[6].value : undefined;
  const lastMonthValue = historicalData && historicalData.length > 29 ? historicalData[29].value : undefined;

  // Historical outcomes with real BTC price data
  const outcomes = React.useMemo(() => {
    if (!historicalData || !btcPriceData || btcPriceData.length === 0) return [];
    return calculateHistoricalOutcomes(historicalData, btcPriceData);
  }, [historicalData, btcPriceData]);

  const breadcrumbItems = [
    { name: 'Home', url: 'https://bitcoincalculator.tools/' },
    { name: 'Calculators', url: 'https://bitcoincalculator.tools/calculators' },
    { name: 'Fear & Greed Index', url: 'https://bitcoincalculator.tools/calculators/fear-greed-index' },
  ];

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Bitcoin Fear & Greed Index",
    "description": "Is the market euphoric or panicking? See the live Bitcoin Fear & Greed score, what it has been historically, and what price did after extreme readings.",
    "url": "https://bitcoincalculator.tools/calculators/fear-greed-index",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "featureList": [
      "Live sentiment gauge",
      "Historical chart with price overlay",
      "Historical outcomes analysis",
      "Actionable buy/sell signals",
      "Sentiment methodology breakdown",
      "PDF export"
    ],
    "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
    "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" }
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Use the Bitcoin Fear & Greed Index",
    "description": "Use the Fear & Greed Index in four steps to inform your Bitcoin strategy",
    "step": [
      { "@type": "HowToStep", "name": "Check the Sentiment", "text": "Our live gauge shows today's Fear & Greed Index value (0-100) with real-time classification from Extreme Fear to Extreme Greed" },
      { "@type": "HowToStep", "name": "Study the Trend", "text": "Review the historical chart with Bitcoin price overlay to see how sentiment correlates with price movements" },
      { "@type": "HowToStep", "name": "Analyze Outcomes", "text": "See what historically happened to Bitcoin's price 7, 30, and 90 days after reaching similar Fear & Greed levels" },
      { "@type": "HowToStep", "name": "Take Action", "text": "Use our contextual recommendations linked to your DCA, Investment, and Savings calculators to make informed decisions" }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{t('fg.meta.title')}</title>
        <meta name="description" content={t('fg.meta.description')} />
        <meta name="keywords" content="bitcoin fear and greed index, crypto fear greed, bitcoin market sentiment, should I buy bitcoin now, bitcoin buy or sell, bitcoin market analysis, fear and greed index today, crypto sentiment index, bitcoin fear index, bitcoin greed index" />
        <link rel="canonical" href={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-korku-acgozluluk':'https://bitcoincalculator.tools/calculators/fear-greed-index'} />

        <link rel="alternate" hrefLang="tr" href="https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-korku-acgozluluk" />
        <link rel="alternate" hrefLang="en" href="https://bitcoincalculator.tools/calculators/fear-greed-index" />
        <link rel="alternate" hrefLang="x-default" href="https://bitcoincalculator.tools/calculators/fear-greed-index" />
        <meta property="og:title" content={t('fg.meta.ogTitle')} />
        <meta property="og:description" content={t('fg.meta.ogDescription')} />
        <meta property="og:url" content={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-korku-acgozluluk':'https://bitcoincalculator.tools/calculators/fear-greed-index'} />
        <meta property="og:type" content="website" />
        <HelmetOgImage slug="bitcoin-fear-greed-index" enAlt={`Bitcoin Fear & Greed Index | bitcoincalculator.tools`} />
        <meta property="og:site_name" content="bitcoincalculator.tools" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('fg.meta.twitterTitle')} />
        <meta name="twitter:description" content={t('fg.meta.twitterDescription')} />
        <meta name="twitter:creator" content="@web3believers" />

        <meta name="twitter:site" content="@web3believers" />
        <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "inLanguage": language==='tr' ? 'tr' : 'en',
          "mainEntity": (language==='tr' ? [
            { "@type": "Question", "name": "Bitcoin Korku ve Açgözlülük Endeksi nedir?", "acceptedAnswer": { "@type": "Answer", "text": "Korku ve Açgözlülük Endeksi, piyasa duygusunu 0 (Aşırı Korku) ile 100 (Aşırı Açgözlülük) arasında ölçen bir duyarlılık göstergesidir. Oynaklık, momentum, sosyal medya, anketler, BTC hâkimiyeti ve trend verilerini birleştirerek tek bir günlük skor üretir." }},
            { "@type": "Question", "name": "Korku ve Açgözlülük Endeksi nasıl kullanılmalı?", "acceptedAnswer": { "@type": "Answer", "text": "Birçok yatırımcı endeksi tersine bir sinyal olarak kullanır: Aşırı Korku (0-25) bir alım fırsatına işaret edebilirken Aşırı Açgözlülük (75-100) piyasanın aşırı ısındığını gösterebilir. Gökkuşağı Grafiği veya zincir üstü metriklerle birlikte kullanıldığında en iyi sonucu verir." }},
            { "@type": "Question", "name": "Endeks ne sıklıkla güncellenir?", "acceptedAnswer": { "@type": "Answer", "text": "Bitcoin Korku ve Açgözlülük Endeksi her gün UTC gece yarısı güncellenir. Panomuz mevcut skoru, 30 günlük geçmiş grafiği ve bağlam için tarihsel uç değerleri gösterir." }},
            { "@type": "Question", "name": "Skoru hangi faktörler oluşturur?", "acceptedAnswer": { "@type": "Answer", "text": "Endeks altı faktörü ağırlıklandırır: oynaklık (%25), piyasa momentumu/hacim (%25), sosyal medya duyarlılığı (%15), anketler (%15), Bitcoin hâkimiyeti (%10) ve Google Trends verisi (%10). Her faktör genel duyarlılık okumasına katkı sağlar." }}
          ] : [
            { "@type": "Question", "name": "What is the Bitcoin Fear and Greed Index?", "acceptedAnswer": { "@type": "Answer", "text": "The Fear & Greed Index is a sentiment indicator that measures market emotions on a scale from 0 (Extreme Fear) to 100 (Extreme Greed). It aggregates data from volatility, momentum, social media, surveys, dominance, and trends to produce a single daily score." }},
            { "@type": "Question", "name": "How should I use the Fear and Greed Index?", "acceptedAnswer": { "@type": "Answer", "text": "Many investors use it as a contrarian signal: Extreme Fear (0-25) may indicate a buying opportunity, while Extreme Greed (75-100) may suggest the market is overheated. It works best when combined with other tools like the Rainbow Chart or on-chain metrics." }},
            { "@type": "Question", "name": "How often is the index updated?", "acceptedAnswer": { "@type": "Answer", "text": "The Bitcoin Fear & Greed Index is updated daily at midnight UTC. Our dashboard shows the current score, a 30-day history chart, and historical extremes for context." }},
            { "@type": "Question", "name": "What factors make up the Fear and Greed score?", "acceptedAnswer": { "@type": "Answer", "text": "The index weighs six factors: volatility (25%), market momentum/volume (25%), social media sentiment (15%), surveys (15%), Bitcoin dominance (10%), and Google Trends data (10%). Each factor contributes to the overall sentiment reading." }}
          ]).map(f => ({ "@type": "Question", "name": f.name, "acceptedAnswer": f.acceptedAnswer }))
        })}</script>
      </Helmet>

      <BreadcrumbSchema language={language} items={breadcrumbItems} />

      <PageBackground variant="clean">
        <Header />

        <main id="main-content" className="pt-20 relative z-10">
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb items={[
              { label: t('fg.crumb.calculators'), href: language==='tr'?'/tr/hesaplayicilar':'/calculators' },
              { label: t('fg.crumb.current') },
            ]} />
          </div>

          <section className="container mx-auto px-6 py-16 text-center">
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/10">
                <Activity className="w-4 h-4" />
                {t('fg.hero.badge')}
              </div>
              <h1 className="text-h1 font-bold text-foreground">
                {t('fg.hero.titlePrefix')} <span className="text-gradient-premium">{t('fg.hero.titleMiddle')}</span> {t('fg.hero.titleSuffix')}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('fg.hero.description')}
              </p>
              <div className="max-w-sm mx-auto">
                <CompactLiveBitcoinPrice currency="USD" />
              </div>
            </div>
          </section>

          <section className="container mx-auto px-6 pb-20">
            <div className="max-w-6xl mx-auto space-y-8">
              <OfflineIndicator />

              {/* Error state */}
              {currentError && (
                <div className="flex items-center gap-3 bg-warning/10 border border-warning/20 rounded-xl p-4">
                  <AlertTriangle className="w-4 h-4 text-warning shrink-0" />
                  <div>
                    <p className="font-medium text-warning">{t('fg.error.title')}</p>
                    <p className="text-sm text-warning">{t('fg.error.body')}</p>
                  </div>
                </div>
              )}

              {/* Gauge Section */}
              {isLoadingCurrent ? (
                <div className="flex flex-col items-center justify-center h-64 gap-3">
                  <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                  <span className="text-sm text-muted-foreground">{t('fg.loading')}</span>
                </div>
              ) : currentData ? (
                <div className="max-w-lg mx-auto">
                  <FearGreedGauge
                    value={currentData.value}
                    previousValue={yesterdayValue}
                    lastUpdated={currentData.date}
                  />
                </div>
              ) : null}

              {/* Sentiment Summary Bar */}
              {trend && historicalData && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
                  {[
                    { label: t('fg.stat.yesterday'), value: yesterdayValue },
                    { label: t('fg.stat.lastWeek'), value: lastWeekValue },
                    { label: t('fg.stat.lastMonth'), value: lastMonthValue },
                    { label: t('fg.stat.avg7'), value: Math.round(trend.avg7d) },
                    { label: t('fg.stat.avg30'), value: Math.round(trend.avg30d) },
                    { label: t('fg.stat.trend7d'), value: trend.delta7d, isSpecial: true },
                  ].map((stat, i) => (
                    <Card key={i} className="border-border/20 bg-card/80 backdrop-blur-sm hover:bg-card transition-colors">
                      <CardContent className="p-3 text-center">
                        <p className="text-xs sm:text-xs text-muted-foreground mb-1 uppercase tracking-wider font-medium">{stat.label}</p>
                        {stat.isSpecial ? (
                          <div className={cn(
                            'text-lg font-bold flex items-center justify-center gap-1',
                            (stat.value ?? 0) > 0 ? 'text-success' : (stat.value ?? 0) < 0 ? 'text-destructive' : 'text-muted-foreground'
                          )}>
                            {(stat.value ?? 0) > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : (stat.value ?? 0) < 0 ? <TrendingDown className="w-3.5 h-3.5" /> : null}
                            {(stat.value ?? 0) > 0 ? '+' : ''}{stat.value ?? 0}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <span className="text-lg font-bold text-foreground tabular-nums">{stat.value ?? '—'}</span>
                            {stat.value !== undefined && (
                              <span className={cn('text-[10px] font-medium', getColorClass(stat.value))}>
                                {getClassification(stat.value)}
                              </span>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Actionable Signals */}
              {currentData && <ActionableSignals value={currentData.value} />}

              {/* Historical Chart with BTC Price Overlay */}
              {historicalData && historicalData.length > 0 && (
                <FearGreedHistoryChart
                  fgData={historicalData}
                  priceData={btcPriceData && btcPriceData.length > 0 ? btcPriceData : undefined}
                />
              )}

              {/* Timeline */}
              {historicalData && historicalData.length > 0 && (
                <FearGreedTimeline data={historicalData} />
              )}

              {/* Historical Outcomes */}
              <HistoricalOutcomes
                outcomes={outcomes}
                isLoading={isLoadingHistory || (!btcPriceData && !!historicalData)}
              />

              {/* Sentiment Breakdown */}
              <SentimentBreakdown />

              {/* Export */}
              {currentData && trend && (
                <FearGreedExportReport
                  currentValue={currentData.value}
                  classification={currentData.classification}
                  trend7dAvg={trend.avg7d}
                  trend30dAvg={trend.avg30d}
                />
              )}
            </div>
          </section>

          <FearGreedHowItWorksSection />
          <FearGreedFAQSection />
          <RelatedCalculators />

          <section className="container mx-auto px-6 pb-16">
            <div className="max-w-3xl mx-auto">
              <Card className="glass-morphism-card border-border/20 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{t('fg.disclaimer.title')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('fg.disclaimer.body')}
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

export default BitcoinFearGreedIndex;
