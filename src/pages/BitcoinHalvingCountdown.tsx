import React, { useState, useMemo, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Breadcrumb } from '@/components/Breadcrumb';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import RelatedCalculators from '@/components/RelatedCalculatorsLazy';
import { PreFAQPlacement } from '@/components/placement/PreFAQPlacement';
import { useSafeLanguage } from '@/hooks/useSafeLanguage';
import { CompactLiveBitcoinPrice } from '@/components/CompactLiveBitcoinPrice';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PageBackground } from '@/components/modern/PageBackground';
import { Card, CardContent } from '@/components/ui/card';
import { useLiveBitcoinPrice } from '@/hooks/useLiveBitcoinPrice';
import { useQuery } from '@tanstack/react-query';
import { HalvingCountdownService } from '@/services/halvingCountdownService';
import { HalvingCountdownTimer } from '@/components/halving/HalvingCountdownTimer';
import { SupplyDashboard } from '@/components/halving/SupplyDashboard';
import { HalvingImpactChart } from '@/components/halving/HalvingImpactChart';
import { HalvingHistoryTable } from '@/components/halving/HalvingHistoryTable';
import { HalvingProjection } from '@/components/halving/HalvingProjection';
import { SupplyScheduleChart } from '@/components/halving/SupplyScheduleChart';
import { HalvingExportReport } from '@/components/halving/HalvingExportReport';
import { HalvingHowItWorksSection } from '@/components/halving/HalvingHowItWorksSection';
import { HalvingFAQSection } from '@/components/halving/HalvingFAQSection';
import { HalvingContentSections } from '@/components/halving/HalvingContentSections';
import { Timer, AlertTriangle } from 'lucide-react';
import { useLanguage } from "@/contexts/LanguageContext";
import { buildCalculatorSpeakable } from '@/components/seo/calculatorSpeakable';
import { useLocalizedSchema } from "@/hooks/useLocalizedSchema";

import { HelmetOgImage } from "@/components/seo/HelmetOgImage";
const BitcoinHalvingCountdown: React.FC = () => {
  const { language, t } = useLanguage();
  const { price: liveBtcPrice } = useLiveBitcoinPrice();
  const [projectionPrice, setProjectionPrice] = useState<number | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const { data: halvingHistory = [] } = useQuery({
    queryKey: ['halving-history-enhanced'],
    queryFn: () => HalvingCountdownService.loadHalvingHistory(),
    staleTime: 300000,
  });

  const { data: countdown } = useQuery({
    queryKey: ['halving-countdown-block-height'],
    queryFn: async () => {
      const height = await HalvingCountdownService.getCurrentBlockHeight();
      return HalvingCountdownService.calculateCountdown(height);
    },
    refetchInterval: 60000,
    staleTime: 30000,
  });

  const historicalImpact = useMemo(
    () => HalvingCountdownService.calculateHistoricalImpact(halvingHistory),
    [halvingHistory]
  );

  const supplySchedule = useMemo(
    () => HalvingCountdownService.calculateSupplySchedule(),
    []
  );

  const currentPrice = projectionPrice ?? liveBtcPrice;
  const projections = useMemo(
    () => currentPrice > 0 ? HalvingCountdownService.calculateProjection(currentPrice, halvingHistory) : [],
    [currentPrice, halvingHistory]
  );

  React.useEffect(() => {
    if (liveBtcPrice > 0 && projectionPrice === null) {
      setProjectionPrice(liveBtcPrice);
    }
  }, [liveBtcPrice, projectionPrice]);

  const enUrl = 'https://bitcoincalculator.tools/calculators/halving-countdown';
  const trUrl = 'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-yarilama';
  const canonicalUrl = language === 'tr' ? trUrl : enUrl;

  const webAppSchema = useLocalizedSchema(
    {
      '@context': 'https://schema.org', '@type': 'WebApplication', inLanguage: 'en',
      name: 'Bitcoin Halving Countdown 2028',
      description: 'Live countdown to the 2028 Bitcoin halving, block by block. See price history from past halvings and what the models predict for the next cycle.',
      url: enUrl,
      applicationCategory: 'FinanceApplication', operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      featureList: 'Live block-height countdown updated every 60 seconds, Historical halving impact tables (1-month to 18-month performance), Cycle ATH tracker with days-to-peak data, Bitcoin supply emission curve through 2140, Daily issuance and stock-to-flow metrics, Post-halving price projection scenarios, Live supply dashboard with mined/remaining BTC, Exportable halving report PDF',
      provider: { '@type': 'Organization', name: 'Bitcoin Calculator Tools', url: 'https://bitcoincalculator.tools' },
      author: { '@type': 'Organization', name: 'Bitcoin Calculator Tools', url: 'https://bitcoincalculator.tools' },
    },
    {
      '@context': 'https://schema.org', '@type': 'WebApplication', inLanguage: 'tr',
      name: 'Bitcoin Yarılama Geri Sayımı 2028',
      description: '2028 Bitcoin yarılamasına blok blok canlı geri sayım. Geçmiş yarılamaların fiyat tarihi ve modellerin bir sonraki döngü için öngörüleri.',
      url: trUrl,
      applicationCategory: 'FinanceApplication', operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'TRY' },
      featureList: '60 saniyede bir güncellenen canlı blok yüksekliği geri sayımı, Tarihsel yarılama etki tabloları (1 ay - 18 ay performans), Zirveye gün sayısı ile döngü ATH izleyicisi, 2140\'a kadar Bitcoin arz emisyon eğrisi, Günlük üretim ve stock-to-flow metrikleri, Yarılama sonrası fiyat projeksiyon senaryoları, Madenlenmiş/kalan BTC ile canlı arz panosu, Dışa aktarılabilir yarılama raporu PDF',
      provider: { '@type': 'Organization', name: 'Bitcoin Calculator Tools', url: 'https://bitcoincalculator.tools' },
      author: { '@type': 'Organization', name: 'Bitcoin Calculator Tools', url: 'https://bitcoincalculator.tools' },
    },
  );

  const howToSchema = useLocalizedSchema(
    {
      "@context": "https://schema.org", "@type": "HowTo", inLanguage: "en",
      "name": "How to Track the Next Bitcoin Halving",
      "description": "Use the Bitcoin Halving Countdown to monitor blocks remaining and estimated date.",
      "step": [
        { "@type": "HowToStep", "name": "View the Countdown", "text": "See the live countdown showing days, hours, and blocks remaining until the next halving." },
        { "@type": "HowToStep", "name": "Explore Halving History", "text": "Review past halvings, their dates, block rewards, and Bitcoin's price at each event." },
        { "@type": "HowToStep", "name": "Understand the Impact", "text": "Learn how each halving reduces the block reward by 50% and historically affects Bitcoin's price." },
      ],
    },
    {
      "@context": "https://schema.org", "@type": "HowTo", inLanguage: "tr",
      "name": "Bir Sonraki Bitcoin Yarılamasını Nasıl Takip Edersiniz",
      "description": "Kalan blokları ve tahmini tarihi izlemek için Bitcoin Yarılama Geri Sayımı'nı kullanın.",
      "step": [
        { "@type": "HowToStep", "name": "Geri Sayımı Görüntüleyin", "text": "Bir sonraki yarılamaya kalan gün, saat ve blok sayısını gösteren canlı geri sayımı görün." },
        { "@type": "HowToStep", "name": "Yarılama Tarihçesini Keşfedin", "text": "Geçmiş yarılamaları, tarihlerini, blok ödüllerini ve her olayda Bitcoin'in fiyatını inceleyin." },
        { "@type": "HowToStep", "name": "Etkiyi Anlayın", "text": "Her yarılamanın blok ödülünü %50 azalttığını ve tarihsel olarak Bitcoin'in fiyatını nasıl etkilediğini öğrenin." },
      ],
    },
  );

  const faqSchema = useLocalizedSchema(
    {
      "@context": "https://schema.org", "@type": "FAQPage", inLanguage: "en",
      "mainEntity": [
        { "@type": "Question", "name": "When is the next Bitcoin halving?", "acceptedAnswer": { "@type": "Answer", "text": "The next Bitcoin halving (#5) is estimated to occur around April 2028 at block height 1,050,000. The exact date depends on the average block time, which varies." }},
        { "@type": "Question", "name": "What is a Bitcoin halving?", "acceptedAnswer": { "@type": "Answer", "text": "A Bitcoin halving is a pre-programmed event in Bitcoin's code that cuts the block reward in half every 210,000 blocks, approximately every 4 years." }},
        { "@type": "Question", "name": "What happens to Bitcoin's price after a halving?", "acceptedAnswer": { "@type": "Answer", "text": "Historically, every Bitcoin halving has been followed by a significant price increase within 12-18 months, though past performance doesn't guarantee future results." }},
        { "@type": "Question", "name": "How many Bitcoin halvings have there been?", "acceptedAnswer": { "@type": "Answer", "text": "There have been 4 Bitcoin halvings so far: November 2012, July 2016, May 2020, and April 2024. The next is expected around April 2028." }},
        { "@type": "Question", "name": "What is the current Bitcoin block reward?", "acceptedAnswer": { "@type": "Answer", "text": "As of the April 2024 halving, the Bitcoin block reward is 3.125 BTC per block, roughly every 10 minutes." }},
        { "@type": "Question", "name": "How many Bitcoin are left to mine?", "acceptedAnswer": { "@type": "Answer", "text": "Approximately 1.2 million Bitcoin remain to be mined out of the 21 million total supply. The remainder is released at an ever-decreasing rate until ~2140." }},
        { "@type": "Question", "name": "Why does Bitcoin halving affect the price?", "acceptedAnswer": { "@type": "Answer", "text": "The halving reduces the rate of new Bitcoin supply entering the market. With demand the same or increasing, basic supply-and-demand suggests upward price pressure." }},
        { "@type": "Question", "name": "When will the last Bitcoin be mined?", "acceptedAnswer": { "@type": "Answer", "text": "The last Bitcoin is expected to be mined around the year 2140. After that, miners earn revenue solely from transaction fees." }},
      ],
    },
    {
      "@context": "https://schema.org", "@type": "FAQPage", inLanguage: "tr",
      "mainEntity": [
        { "@type": "Question", "name": "Bir sonraki Bitcoin yarılaması ne zaman?", "acceptedAnswer": { "@type": "Answer", "text": "Bir sonraki Bitcoin yarılamasının (#5) Nisan 2028 civarında, 1.050.000 blok yüksekliğinde gerçekleşmesi beklenmektedir. Kesin tarih ortalama blok süresine bağlıdır." }},
        { "@type": "Question", "name": "Bitcoin yarılaması nedir?", "acceptedAnswer": { "@type": "Answer", "text": "Bitcoin yarılaması, Bitcoin'in kodunda önceden programlanmış bir olaydır ve her 210.000 blokta bir (yaklaşık 4 yılda bir) blok ödülünü yarıya indirir." }},
        { "@type": "Question", "name": "Yarılamadan sonra Bitcoin fiyatına ne olur?", "acceptedAnswer": { "@type": "Answer", "text": "Tarihsel olarak her Bitcoin yarılamasını 12-18 ay içinde önemli bir fiyat artışı izlemiştir; ancak geçmiş performans gelecekteki sonuçları garanti etmez." }},
        { "@type": "Question", "name": "Şimdiye kadar kaç Bitcoin yarılaması oldu?", "acceptedAnswer": { "@type": "Answer", "text": "Şimdiye kadar 4 Bitcoin yarılaması gerçekleşti: Kasım 2012, Temmuz 2016, Mayıs 2020 ve Nisan 2024. Bir sonraki Nisan 2028 civarındadır." }},
        { "@type": "Question", "name": "Mevcut Bitcoin blok ödülü nedir?", "acceptedAnswer": { "@type": "Answer", "text": "Nisan 2024 yarılamasından itibaren Bitcoin blok ödülü blok başına 3,125 BTC'dir; yaklaşık her 10 dakikada bir." }},
        { "@type": "Question", "name": "Kaç Bitcoin'in madenlenmesi kaldı?", "acceptedAnswer": { "@type": "Answer", "text": "21 milyonluk toplam arzdan yaklaşık 1,2 milyon Bitcoin'in madenlenmesi kalmıştır. Kalan miktar ~2140'a kadar giderek azalan bir hızla piyasaya çıkar." }},
        { "@type": "Question", "name": "Yarılama Bitcoin fiyatını neden etkiler?", "acceptedAnswer": { "@type": "Answer", "text": "Yarılama, piyasaya giren yeni Bitcoin arz oranını azaltır. Talep sabit veya artarsa, temel arz-talep yukarı yönlü fiyat baskısı önerir." }},
        { "@type": "Question", "name": "Son Bitcoin ne zaman madenlenecek?", "acceptedAnswer": { "@type": "Answer", "text": "Son Bitcoin'in yaklaşık 2140 yılında madenlenmesi beklenmektedir. Bundan sonra madenciler gelirlerini yalnızca işlem ücretlerinden elde eder." }},
      ],
    },
  );

  return (
    <>
      <Helmet>
        <title>{t('halving.meta.title')}</title>
        <meta name="description" content={t('halving.meta.description')} />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="alternate" hrefLang="tr" href="https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-yarilama" />
        <link rel="alternate" hrefLang="en" href="https://bitcoincalculator.tools/calculators/halving-countdown" />
        <link rel="alternate" hrefLang="x-default" href="https://bitcoincalculator.tools/calculators/halving-countdown" />
        <meta property="og:title" content={t('halving.meta.title')} />
        <meta property="og:description" content={t('halving.meta.ogDescription')} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="bitcoincalculator.tools" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('halving.meta.title')} />
        <meta name="twitter:description" content={t('halving.meta.twitterDescription')} />
        <meta name="twitter:creator" content="@web3believers" />
        <meta name="twitter:site" content="@web3believers" />
        <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
              <script type="application/ld+json">{JSON.stringify(buildCalculatorSpeakable(canonicalUrl, language))}</script>
      </Helmet>
        <HelmetOgImage slug="bitcoin-halving-countdown" enAlt={`Bitcoin Halving Countdown 2028 | bitcoincalculator.tools`} />

      <BreadcrumbSchema
        language={language}
        items={language === 'tr' ? [
          { name: 'Ana Sayfa', url: 'https://bitcoincalculator.tools/tr/' },
          { name: 'Hesaplayıcılar', url: 'https://bitcoincalculator.tools/tr/hesaplayicilar' },
          { name: 'Bitcoin Yarılama Geri Sayımı', url: trUrl },
        ] : [
          { name: 'Home', url: 'https://bitcoincalculator.tools/' },
          { name: 'Calculators', url: 'https://bitcoincalculator.tools/calculators' },
          { name: 'Halving Countdown', url: enUrl },
        ]}
      />

      <PageBackground variant="clean">
        <Header />

        <main id="main-content" className="pt-20 relative z-10">
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb items={[
              { label: t('halving.crumb.calculators'), href: language==='tr'?'/tr/hesaplayicilar':'/calculators' },
              { label: t('halving.crumb.current') },
            ]} />
          </div>

          <section className="container mx-auto px-6 py-16 text-center">
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/10">
                <Timer className="w-4 h-4" />
                {t('halving.hero.badge')}
              </div>
              <h1 className="text-h1 font-bold text-foreground">
                {t('halving.hero.titlePrefix')} <span className="text-gradient-premium">{t('halving.hero.titleMiddle')}</span> {t('halving.hero.titleSuffix')}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('halving.hero.description')}
              </p>
              <div className="max-w-sm mx-auto">
                <CompactLiveBitcoinPrice currency="USD" />
              </div>
            </div>
          </section>

          <section className="container mx-auto px-6 pb-20">
            <div className="max-w-6xl mx-auto space-y-10" ref={reportRef}>
              <OfflineIndicator />

              <ErrorBoundary>
                <HalvingCountdownTimer />
              </ErrorBoundary>

              <ErrorBoundary>
                <div className="space-y-4">
                  <h2 className="text-h2 font-bold text-foreground">{t('halving.supplyDashboard.heading')}</h2>
                  <SupplyDashboard />
                </div>
              </ErrorBoundary>

              {historicalImpact.length > 0 && (
                <ErrorBoundary>
                  <HalvingImpactChart impactData={historicalImpact} />
                </ErrorBoundary>
              )}

              {historicalImpact.length > 0 && (
                <ErrorBoundary>
                  <HalvingHistoryTable impactData={historicalImpact} />
                </ErrorBoundary>
              )}

              {projections.length > 0 && (
                <ErrorBoundary>
                  <HalvingProjection
                    scenarios={projections}
                    currentPrice={currentPrice}
                    onPriceChange={setProjectionPrice}
                  />
                </ErrorBoundary>
              )}

              {supplySchedule.length > 0 && (
                <ErrorBoundary>
                  <SupplyScheduleChart data={supplySchedule} />
                </ErrorBoundary>
              )}

              <div className="flex justify-center">
                <HalvingExportReport
                  reportRef={reportRef}
                  currentBlock={countdown?.currentBlockHeight}
                  blocksRemaining={countdown?.blocksRemaining}
                  estimatedDate={countdown?.estimatedDate}
                  currentReward={countdown?.currentReward}
                  nextReward={countdown?.nextReward}
                />

              </div>
            </div>
          </section>

          <HalvingHowItWorksSection />
          <HalvingContentSections />
          <HalvingFAQSection />
          <PreFAQPlacement slug="halving-countdown" lang={useSafeLanguage()} resultSignals={["accumulation", "long-term"]} />
          <RelatedCalculators />

          <section className="container mx-auto px-6 pb-16">
            <div className="max-w-3xl mx-auto">
              <Card className="glass-morphism-card border-border/20 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{t('halving.disclaimer.title')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('halving.disclaimer.body')}
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

export default BitcoinHalvingCountdown;
