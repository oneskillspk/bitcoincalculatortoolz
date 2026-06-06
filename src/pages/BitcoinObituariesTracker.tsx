import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { PageBackground } from "@/components/modern/PageBackground";
import { CompactLiveBitcoinPrice } from "@/components/CompactLiveBitcoinPrice";
import { ObituariesInputPanel, FilterOptions } from "@/components/obituaries/ObituariesInputPanel";
import { ObituariesResultsPanel } from "@/components/obituaries/ObituariesResultsPanel";
import { ObituariesTimeline } from "@/components/obituaries/ObituariesTimeline";
import { ObituariesChart } from "@/components/obituaries/ObituariesChart";
import { ObituariesComparison } from "@/components/obituaries/ObituariesComparison";
import { ObituariesHowItWorksSection } from "@/components/obituaries/ObituariesHowItWorksSection";
import { ObituariesFAQSection } from "@/components/obituaries/ObituariesFAQSection";
import RelatedCalculators from "@/components/RelatedCalculators";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { useState, useEffect, useCallback } from "react";
import { BitcoinObituariesService, ObituariesResult } from "@/services/bitcoinObituariesService";
import { useLiveBitcoinPrice } from "@/hooks/useLiveBitcoinPrice";
import { Skull, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocalizedSchema } from "@/hooks/useLocalizedSchema";

const BitcoinObituariesTracker = () => {
  const { language, t } = useLanguage();
  const [result, setResult] = useState<ObituariesResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { price: currentBtcPrice } = useLiveBitcoinPrice();

  const handleCalculate = useCallback((filters: FilterOptions) => {
    setIsCalculating(true);
    setTimeout(() => {
      const calculatedResult = BitcoinObituariesService.filterObituaries(filters, currentBtcPrice);
      setResult(calculatedResult);
      setIsCalculating(false);
    }, 300);
  }, [currentBtcPrice]);

  // Load data and auto-calculate on mount
  useEffect(() => {
    BitcoinObituariesService.loadData().then(() => {
      if (currentBtcPrice > 0) {
        handleCalculate({ dateRange: { start: '2010-01-01', end: '2026-01-01' }, sourceTypes: ['all'], priceRange: { min: 0, max: 999999 }, searchQuery: '' });
      }
    });
  }, [currentBtcPrice, handleCalculate]);

  const webAppSchemaEn = {
    "@context": "https://schema.org", "@type": "WebApplication",
    "name": "Bitcoin Obituaries Tracker",
    "description": "Track all 400+ times Bitcoin was declared 'dead' since 2010. See price changes, ROI if you bought, and explore the most infamous crypto obituaries.",
    "url": "https://bitcoincalculator.tools/calculators/obituaries-tracker",
    "inLanguage": "en",
    "applicationCategory": "FinanceApplication", "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
    "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" }
  };
  const webAppSchemaTr = {
    "@context": "https://schema.org", "@type": "WebApplication",
    "name": "Bitcoin Ölüm İlanları Takipçisi",
    "description": "2010'dan bu yana Bitcoin'in 'öldü' ilan edildiği 400'den fazla anı izleyin. Fiyat değişimlerini, o gün alsaydınız elde edeceğiniz getiriyi görün ve en meşhur kripto ölüm ilanlarını keşfedin.",
    "url": "https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-olum-ilanlari",
    "inLanguage": "tr",
    "applicationCategory": "FinanceApplication", "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "TRY" },
    "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
    "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" }
  };

  const faqSchemaEn = {
    "@context": "https://schema.org", "@type": "FAQPage", "inLanguage": "en",
    "mainEntity": [
      { "@type": "Question", "name": "How many times has Bitcoin been declared dead?", "acceptedAnswer": { "@type": "Answer", "text": "Bitcoin has been declared 'dead' over 400 times since 2010, according to our comprehensive database. This number continues to grow as new critics emerge, yet Bitcoin continues to thrive and reach new adoption milestones." }},
      { "@type": "Question", "name": "What was the most famous Bitcoin obituary?", "acceptedAnswer": { "@type": "Answer", "text": "Some of the most famous include Jamie Dimon calling it 'a fraud' in 2017, Warren Buffett's 'rat poison squared' comment in 2018, and Peter Schiff's numerous predictions. Many of these critics have since softened their stance or been proven dramatically wrong by Bitcoin's performance." }},
      { "@type": "Question", "name": "How accurate are these obituaries?", "acceptedAnswer": { "@type": "Answer", "text": "Not accurate at all. Every single Bitcoin obituary has been proven wrong by Bitcoin's continued existence and growth. The average ROI if you had bought Bitcoin at each 'death' declaration is over 10,000%, demonstrating how wrong the critics have been." }},
      { "@type": "Question", "name": "Can I see ROI if I bought at each obituary?", "acceptedAnswer": { "@type": "Answer", "text": "Yes! Each obituary in our tracker shows the exact ROI you would have earned if you had bought Bitcoin at that price and held until today. The results consistently show massive gains, with many obituaries offering 10,000%+ returns." }},
      { "@type": "Question", "name": "Why do people keep declaring Bitcoin dead?", "acceptedAnswer": { "@type": "Answer", "text": "Critics often misunderstand Bitcoin's technology, have vested interests in traditional finance, or base their predictions on short-term price volatility rather than long-term fundamentals. Many also fail to recognize Bitcoin's unique properties and network effects." }}
    ]
  };
  const faqSchemaTr = {
    "@context": "https://schema.org", "@type": "FAQPage", "inLanguage": "tr",
    "mainEntity": [
      { "@type": "Question", "name": "Bitcoin kaç kez 'öldü' ilan edildi?", "acceptedAnswer": { "@type": "Answer", "text": "Kapsamlı veritabanımıza göre Bitcoin 2010'dan bu yana 400'den fazla kez 'öldü' ilan edildi. Yeni eleştirmenler ortaya çıktıkça bu sayı artmaya devam ediyor; buna karşın Bitcoin gelişmeye ve yeni benimsenme dönüm noktalarına ulaşmaya devam ediyor." }},
      { "@type": "Question", "name": "En ünlü Bitcoin ölüm ilanı hangisiydi?", "acceptedAnswer": { "@type": "Answer", "text": "En meşhurları arasında Jamie Dimon'ın 2017'deki 'sahtekârlık' ifadesi, Warren Buffett'ın 2018'deki 'fare zehri kare' yorumu ve Peter Schiff'in sayısız tahmini yer alır. Bu eleştirmenlerin büyük kısmı tutumlarını yumuşatmış veya Bitcoin'in performansıyla net biçimde yanılgıya düşürülmüştür." }},
      { "@type": "Question", "name": "Bu ölüm ilanları ne kadar isabetli?", "acceptedAnswer": { "@type": "Answer", "text": "Hiç isabetli değil. Her bir Bitcoin ölüm ilanı, Bitcoin'in varlığını sürdürmesi ve büyümesiyle yanlışlanmıştır. Her 'ölüm' ilanında Bitcoin alsaydınız ortalama getiriniz %10.000'in üzerinde olurdu — bu eleştirmenlerin ne kadar yanıldığını gösterir." }},
      { "@type": "Question", "name": "Her ölüm ilanında alsaydım getiriyi görebilir miyim?", "acceptedAnswer": { "@type": "Answer", "text": "Evet! Takipçimizdeki her ölüm ilanı, o günkü Bitcoin fiyatını ve o fiyattan alıp bugüne kadar tutsaydınız elde edeceğiniz tam getiriyi gösterir. Sonuçlar tutarlı biçimde büyük kazançlar ortaya koyar; birçok ilan %10.000'i aşan getiriler sunmuştur." }},
      { "@type": "Question", "name": "İnsanlar neden Bitcoin'i sürekli ölü ilan ediyor?", "acceptedAnswer": { "@type": "Answer", "text": "Eleştirmenler çoğu zaman Bitcoin'in teknolojisini yanlış anlar, geleneksel finansta çıkarları vardır veya tahminlerini uzun vadeli temellere değil kısa vadeli oynaklığa dayandırırlar. Birçoğu Bitcoin'in benzersiz özelliklerini ve ağ etkilerini de hesaba katmaz." }}
    ]
  };

  const howToSchemaEn = {
    "@context": "https://schema.org", "@type": "HowTo",
    "name": "How to Explore Bitcoin Obituaries and Death Predictions",
    "description": "Use the Bitcoin Obituaries Tracker to browse every time Bitcoin was declared dead and see the ROI if you had bought instead.",
    "inLanguage": "en",
    "step": [
      { "@type": "HowToStep", "name": "Browse the Timeline", "text": "Scroll through all 400+ obituaries sorted chronologically from 2010 to today." },
      { "@type": "HowToStep", "name": "Filter by Year or Source", "text": "Use the filter panel to narrow results by year, source type, or price range at time of declaration." },
      { "@type": "HowToStep", "name": "Check the ROI", "text": "Each obituary shows the Bitcoin price at the time and your return if you had bought and held until now." }
    ]
  };
  const howToSchemaTr = {
    "@context": "https://schema.org", "@type": "HowTo",
    "name": "Bitcoin Ölüm İlanları ve Ölüm Tahminlerini Nasıl İncelersiniz?",
    "description": "Bitcoin Ölüm İlanları Takipçisi ile Bitcoin'in 'öldü' ilan edildiği her anı tarayın ve o gün alsaydınız getirinizin ne olacağını görün.",
    "inLanguage": "tr",
    "step": [
      { "@type": "HowToStep", "name": "Kronolojiyi Tarayın", "text": "2010'dan bugüne kronolojik olarak sıralanmış 400'den fazla ölüm ilanı arasında gezinin." },
      { "@type": "HowToStep", "name": "Yıla veya Kaynağa Göre Filtreleyin", "text": "Sonuçları yıla, kaynak türüne veya ilan anındaki fiyat aralığına göre daraltmak için filtre panelini kullanın." },
      { "@type": "HowToStep", "name": "Getiriyi Kontrol Edin", "text": "Her ilan, o günkü Bitcoin fiyatını ve o fiyattan alıp bugüne kadar tutsaydınız elde edeceğiniz getiriyi gösterir." }
    ]
  };

  const webAppSchema = useLocalizedSchema(webAppSchemaEn, webAppSchemaTr);
  const faqSchema = useLocalizedSchema(faqSchemaEn, faqSchemaTr);
  const howToSchema = useLocalizedSchema(howToSchemaEn, howToSchemaTr);
  return (
    <>
      <Helmet>
        <title>{t('obit.meta.title')}</title>
        <meta name="description" content={t('obit.meta.description')} />
        <meta name="keywords" content="bitcoin obituaries, bitcoin declared dead, bitcoin death counter, bitcoin skeptics wrong, bitcoin critics tracker" />
        <link rel="canonical" href={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-olum-ilanlari':'https://bitcoincalculator.tools/calculators/obituaries-tracker'} />

        <link rel="alternate" hrefLang="en" href="https://bitcoincalculator.tools/calculators/obituaries-tracker" />
        <link rel="alternate" hrefLang="tr" href="https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-olum-ilanlari" />
        <link rel="alternate" hrefLang="x-default" href="https://bitcoincalculator.tools/calculators/obituaries-tracker" />
        {/* Open Graph */}
        <meta property="og:title" content={t('obit.meta.title')} />
        <meta property="og:description" content={t('obit.meta.ogDescription')} />
        <meta property="og:url" content={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-olum-ilanlari':'https://bitcoincalculator.tools/calculators/obituaries-tracker'} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={(typeof window !== 'undefined' && window.location.pathname.startsWith('/tr')) ? 'https://bitcoincalculator.tools/bitcoin-kar-hesaplayici-og.webp' : 'https://bitcoincalculator.tools/social-preview.webp'} />
        <meta property="og:image:alt" content={(typeof window !== 'undefined' && window.location.pathname.startsWith('/tr')) ? 'Bitcoin Hesaplayıcıları — 45+ Ücretsiz Araç | bitcoincalculator.tools' : 'Bitcoin Obituaries Tracker | bitcoincalculator.tools'} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="bitcoincalculator.tools" />
        <meta property="og:locale" content={language==='tr'?'tr_TR':'en_US'} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('obit.meta.title')} />
        <meta name="twitter:description" content={t('obit.meta.twitterDescription')} />
        <meta name="twitter:image" content={(typeof window !== 'undefined' && window.location.pathname.startsWith('/tr')) ? 'https://bitcoincalculator.tools/bitcoin-kar-hesaplayici-og.webp' : 'https://bitcoincalculator.tools/social-preview.webp'} />
        <meta name="twitter:creator" content="@web3believers" />

        <meta name="twitter:site" content="@web3believers" />
        {/* Structured Data */}
        <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
      </Helmet>

      <BreadcrumbSchema language={language} 
        items={[
          { name: "Home", url: "https://bitcoincalculator.tools/" },
          { name: "Calculators", url: "https://bitcoincalculator.tools/calculators" },
          { name: "Obituaries Tracker", url: "https://bitcoincalculator.tools/calculators/obituaries-tracker" }
        ]}
      />

      <PageBackground variant="clean">
        <Header />

        <main id="main-content" className="pt-20">
          {/* Breadcrumb */}
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb 
              items={[
                { label: t('obit.crumb.calculators'), href: language==='tr'?'/tr/hesaplayicilar':'/calculators' },
                { label: t('obit.crumb.current') }
              ]} 
            />
          </div>

          {/* Hero Section */}
          <section className="py-16">
            <div className="container mx-auto px-6">
              <div className="max-w-5xl mx-auto text-center space-y-6">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <Skull className="w-4 h-4" />
                  {t('obit.hero.badge')}
                </div>

                {/* Heading */}
                <h1 className="text-h1 font-bold text-foreground">
                  <>{t('obit.hero.titlePrefix')}<span className="text-gradient-premium">{t('obit.hero.titleMiddle')}</span>{t('obit.hero.titleSuffix')}</>
                </h1>

                {/* Description */}
                <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  {t('obit.hero.subtitle')}
                </p>

                {/* Live Price */}
                <div className="flex items-center justify-center">
                  <CompactLiveBitcoinPrice currency="USD" />
                </div>
              </div>
            </div>
          </section>

          {/* Calculator Section */}
          <section className="py-6 md:py-10" style={{ contentVisibility: 'auto', containIntrinsicSize: '800px' }}>
            <div className="container mx-auto px-6">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                  {/* Input Panel */}
                  <div>
                    <ObituariesInputPanel 
                      onCalculate={handleCalculate}
                      isCalculating={isCalculating}
                    />
                  </div>

                  {/* Results Panel */}
                  <div>
                    <ErrorBoundary>
                      <ObituariesResultsPanel result={result} />
                    </ErrorBoundary>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Timeline Section */}
          {result && result.filteredObituaries.length > 0 && (
            <ErrorBoundary>
              <ObituariesTimeline 
                obituaries={result.filteredObituaries}
                currentBtcPrice={currentBtcPrice}
              />
            </ErrorBoundary>
          )}

          {/* Charts Section */}
          {result && result.filteredObituaries.length > 0 && (
            <ErrorBoundary>
              <ObituariesChart result={result} />
            </ErrorBoundary>
          )}

          {/* Famous Obituaries Section */}
          {result && result.filteredObituaries.filter(o => o.isFamous).length > 0 && (
            <ErrorBoundary>
              <ObituariesComparison 
                famousObituaries={result.filteredObituaries.filter(o => o.isFamous)}
                currentBtcPrice={currentBtcPrice}
              />
            </ErrorBoundary>
          )}

          {/* How It Works */}
          <ObituariesHowItWorksSection />

          {/* FAQ */}
          <ObituariesFAQSection />

          {/* Related Calculators */}
          <RelatedCalculators />

          {/* Disclaimer */}
          <section className="container mx-auto px-6 pb-16">
            <div className="max-w-3xl mx-auto">
              <Card className="glass-morphism-card border-border/20 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{t('obit.dis.title')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('obit.dis.body')}
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

export default BitcoinObituariesTracker;
