import React, { useMemo, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AffiliatePlacement } from "@/components/affiliateAI/AffiliatePlacement";
import { Breadcrumb } from '@/components/Breadcrumb';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import RelatedCalculators from '@/components/RelatedCalculators';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { useLiveBitcoinPrice } from '@/hooks/useLiveBitcoinPrice';
import { PageBackground } from '@/components/modern/PageBackground';
import { CompactLiveBitcoinPrice } from '@/components/CompactLiveBitcoinPrice';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PizzaHeroCard } from '@/components/pizzaday/PizzaHeroCard';
import { OpportunityCostPanel } from '@/components/pizzaday/OpportunityCostPanel';
import { PizzaIndexChart } from '@/components/pizzaday/PizzaIndexChart';
import { PizzaDayTimeline } from '@/components/pizzaday/PizzaDayTimeline';
import { PizzaDayHowToUse } from '@/components/pizzaday/PizzaDayHowToUse';
import { PizzaDayFAQSection } from '@/components/pizzaday/PizzaDayFAQSection';
import { PizzaShareCard } from '@/components/pizzaday/PizzaShareCard';
import { PizzaExportReport } from '@/components/pizzaday/PizzaExportReport';
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocalizedSchema } from "@/hooks/useLocalizedSchema";

const BitcoinPizzaDayCalculator: React.FC = () => {
  const { language, t } = useLanguage();
  const { price: liveBtcPrice, isLoading: isLoadingPrice, priceChangePercentage24h } = useLiveBitcoinPrice();
  const reportRef = useRef<HTMLDivElement>(null);
  const currentValue = useMemo(() => liveBtcPrice * 10_000, [liveBtcPrice]);

  const breadcrumbItems = [
    { name: 'Home', url: 'https://bitcoincalculator.tools/' },
    { name: 'Calculators', url: 'https://bitcoincalculator.tools/calculators' },
    { name: 'Pizza Day Calculator', url: 'https://bitcoincalculator.tools/calculators/pizza-day' },
  ];

  const webAppSchemaEn = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Bitcoin Pizza Day Calculator",
    "description": "On 22 May 2010, Laszlo paid 10,000 BTC for two pizzas. Those coins are now worth over $1 billion. What is your Bitcoin opportunity cost? Find out here.",
    "url": "https://bitcoincalculator.tools/calculators/pizza-day",
    "inLanguage": "en",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "featureList": [
      "Live 10,000 BTC pizza valuation",
      "Personal opportunity cost calculator",
      "Bitcoin Pizza Index chart",
      "Historical pizza transaction timeline",
      "Real-time Bitcoin price integration"
    ],
    "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
    "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" }
  };

  const webAppSchemaTr = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Bitcoin Pizza Günü Hesaplayıcısı",
    "description": "22 Mayıs 2010'da Laszlo iki pizza için 10.000 BTC ödedi. Bu coinler bugün 1 milyar doların üzerinde değere ulaştı. Sizin Bitcoin fırsat maliyetiniz ne kadar? Hemen hesaplayın.",
    "url": "https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-pizza-gunu",
    "inLanguage": "tr",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "TRY" },
    "featureList": [
      "Canlı 10.000 BTC pizza değerlemesi",
      "Kişisel fırsat maliyeti hesaplayıcısı",
      "Bitcoin Pizza Endeksi grafiği",
      "Tarihsel pizza işlemi kronolojisi",
      "Gerçek zamanlı Bitcoin fiyatı entegrasyonu"
    ],
    "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
    "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" }
  };

  const howToSchemaEn = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Use the Bitcoin Pizza Day Calculator",
    "description": "Calculate Bitcoin opportunity cost and explore the famous pizza transaction",
    "inLanguage": "en",
    "step": [
      { "@type": "HowToStep", "name": "View the Famous Pizza", "text": "See the real-time value of the original 10,000 BTC pizza purchase from May 22, 2010" },
      { "@type": "HowToStep", "name": "Calculate Opportunity Cost", "text": "Enter any past purchase amount and date to see what it would be worth in Bitcoin today" },
      { "@type": "HowToStep", "name": "Explore the Pizza Index", "text": "View how many pizzas 1 BTC could buy each year since 2010" },
      { "@type": "HowToStep", "name": "Follow the Timeline", "text": "Read the complete story from the forum post to Bitcoin surpassing $100K" }
    ]
  };

  const howToSchemaTr = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Bitcoin Pizza Günü Hesaplayıcısı Nasıl Kullanılır?",
    "description": "Bitcoin fırsat maliyetini hesaplayın ve ünlü pizza işlemini keşfedin",
    "inLanguage": "tr",
    "step": [
      { "@type": "HowToStep", "name": "Ünlü Pizza'yı Görüntüleyin", "text": "22 Mayıs 2010'daki orijinal 10.000 BTC pizza alımının gerçek zamanlı değerini görün" },
      { "@type": "HowToStep", "name": "Fırsat Maliyetini Hesaplayın", "text": "Geçmişte yaptığınız herhangi bir alımın tutarını ve tarihini girerek bugün Bitcoin olarak ne değer ifade ettiğini görün" },
      { "@type": "HowToStep", "name": "Pizza Endeksini Keşfedin", "text": "1 BTC'nin 2010'dan bu yana her yıl kaç pizza alabildiğini inceleyin" },
      { "@type": "HowToStep", "name": "Kronolojiyi Takip Edin", "text": "Forum gönderisinden Bitcoin'in 100.000 doları aşmasına kadar tüm hikâyeyi okuyun" }
    ]
  };

  const faqSchemaEn = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "inLanguage": "en",
    "mainEntity": [
      { "@type": "Question", "name": "What is Bitcoin Pizza Day?", "acceptedAnswer": { "@type": "Answer", "text": "Bitcoin Pizza Day is celebrated on May 22 each year, commemorating the first known real-world transaction using Bitcoin when Laszlo Hanyecz paid 10,000 BTC for two Papa John's pizzas in 2010." } },
      { "@type": "Question", "name": "How much is 10,000 Bitcoin worth today?", "acceptedAnswer": { "@type": "Answer", "text": "The value changes with the live Bitcoin price. At $100,000 per BTC, 10,000 Bitcoin would be worth $1 billion. Our calculator shows the exact real-time value." } },
      { "@type": "Question", "name": "Who bought pizza with Bitcoin?", "acceptedAnswer": { "@type": "Answer", "text": "Laszlo Hanyecz, a programmer from Jacksonville, Florida, made the purchase on May 22, 2010. Jeremy Sturdivant accepted the offer and ordered two Papa John's pizzas." } },
      { "@type": "Question", "name": "What is Bitcoin opportunity cost?", "acceptedAnswer": { "@type": "Answer", "text": "Bitcoin opportunity cost is the potential profit you missed by spending money on something else instead of buying Bitcoin. Our calculator helps you quantify this for any past purchase." } },
      { "@type": "Question", "name": "How many pizzas can 1 Bitcoin buy?", "acceptedAnswer": { "@type": "Answer", "text": "At current prices, 1 Bitcoin can buy thousands of $20 pizzas. Our Pizza Index chart tracks this fun metric over time since 2010." } },
      { "@type": "Question", "name": "When is Bitcoin Pizza Day 2026?", "acceptedAnswer": { "@type": "Answer", "text": "Bitcoin Pizza Day is always May 22. In 2026, it falls on a Friday. Many Bitcoin communities celebrate with pizza parties and crypto exchange promotions." } },
    ]
  };

  const faqSchemaTr = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "inLanguage": "tr",
    "mainEntity": [
      { "@type": "Question", "name": "Bitcoin Pizza Günü nedir?", "acceptedAnswer": { "@type": "Answer", "text": "Bitcoin Pizza Günü her yıl 22 Mayıs'ta kutlanır ve 2010'da Laszlo Hanyecz'in iki Papa John's pizzası için 10.000 BTC ödediği, Bitcoin ile yapılan bilinen ilk gerçek dünya işlemini anar." } },
      { "@type": "Question", "name": "10.000 Bitcoin bugün ne kadar eder?", "acceptedAnswer": { "@type": "Answer", "text": "Değer canlı Bitcoin fiyatıyla birlikte değişir. BTC başına 100.000 dolardan 10.000 Bitcoin 1 milyar dolar eder. Hesaplayıcımız anlık değeri kesin olarak gösterir." } },
      { "@type": "Question", "name": "Bitcoin ile pizzayı kim aldı?", "acceptedAnswer": { "@type": "Answer", "text": "Alımı, 22 Mayıs 2010'da Jacksonville, Florida'lı programcı Laszlo Hanyecz yaptı. Jeremy Sturdivant teklifi kabul edip iki Papa John's pizzası sipariş etti." } },
      { "@type": "Question", "name": "Bitcoin fırsat maliyeti nedir?", "acceptedAnswer": { "@type": "Answer", "text": "Bitcoin fırsat maliyeti, parayı Bitcoin almak yerine başka bir şeye harcayarak kaçırdığınız potansiyel kârdır. Hesaplayıcımız bunu geçmişteki herhangi bir alım için sayısallaştırmanıza yardımcı olur." } },
      { "@type": "Question", "name": "1 Bitcoin kaç pizza alır?", "acceptedAnswer": { "@type": "Answer", "text": "Güncel fiyatlarla 1 Bitcoin, 20 dolarlık binlerce pizza alabilir. Pizza Endeksi grafiğimiz bu eğlenceli metriği 2010'dan bu yana izler." } },
      { "@type": "Question", "name": "2026 Bitcoin Pizza Günü ne zaman?", "acceptedAnswer": { "@type": "Answer", "text": "Bitcoin Pizza Günü her zaman 22 Mayıs'tır. 2026'da Cuma gününe denk gelir. Birçok Bitcoin topluluğu pizza partileri ve borsa kampanyalarıyla bu günü kutlar." } },
    ]
  };

  const webAppSchema = useLocalizedSchema(webAppSchemaEn, webAppSchemaTr);
  const howToSchema = useLocalizedSchema(howToSchemaEn, howToSchemaTr);
  const faqSchema = useLocalizedSchema(faqSchemaEn, faqSchemaTr);

  return (
    <>
      <Helmet>
        <title>{t('pizza.meta.title')}</title>
        <meta name="description" content={t('pizza.meta.description')} />
        <meta name="keywords" content="bitcoin pizza day calculator, bitcoin pizza index, 10000 btc pizza, bitcoin opportunity cost calculator, bitcoin pizza cost today, bitcoin pizza day 2026, who bought pizza with bitcoin, bitcoin regret calculator, crypto opportunity cost" />
        <link rel="canonical" href={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-pizza-gunu':'https://bitcoincalculator.tools/calculators/pizza-day'} />

        <link rel="alternate" hrefLang="tr" href="https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-pizza-gunu" />
        <link rel="alternate" hrefLang="en" href="https://bitcoincalculator.tools/calculators/pizza-day" />
        <link rel="alternate" hrefLang="x-default" href="https://bitcoincalculator.tools/calculators/pizza-day" />
        <meta property="og:title" content={t('pizza.meta.title')} />
        <meta property="og:description" content={t('pizza.meta.ogDescription')} />
        <meta property="og:url" content={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-pizza-gunu':'https://bitcoincalculator.tools/calculators/pizza-day'} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={(typeof window !== 'undefined' && window.location.pathname.startsWith('/tr')) ? 'https://bitcoincalculator.tools/bitcoin-kar-hesaplayici-og.webp' : 'https://bitcoincalculator.tools/social-preview.webp'} />
        <meta property="og:image:alt" content={(typeof window !== 'undefined' && window.location.pathname.startsWith('/tr')) ? 'Bitcoin Hesaplayıcıları — 45+ Ücretsiz Araç | bitcoincalculator.tools' : 'Bitcoin Pizza Day Calculator | bitcoincalculator.tools'} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="bitcoincalculator.tools" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('pizza.meta.title')} />
        <meta name="twitter:description" content={t('pizza.meta.twitterDescription')} />
        <meta name="twitter:image" content={(typeof window !== 'undefined' && window.location.pathname.startsWith('/tr')) ? 'https://bitcoincalculator.tools/bitcoin-kar-hesaplayici-og.webp' : 'https://bitcoincalculator.tools/social-preview.webp'} />
        <meta name="twitter:creator" content="@web3believers" />

        <meta name="twitter:site" content="@web3believers" />
        <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <BreadcrumbSchema language={language} items={breadcrumbItems} />

      <PageBackground variant="clean">
        <Header />

        <main id="main-content" className="pt-20 relative z-10">
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb items={[
              { label: t('pizza.crumb.calculators'), href: language==='tr'?'/tr/hesaplayicilar':'/calculators' },
              { label: t('pizza.crumb.current') },
            ]} />
          </div>

          <section className="container mx-auto px-6 py-16 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6 text-sm font-medium text-primary">
              🍕 May 22, 2010
            </div>

            <h1 className="text-h1 font-bold text-foreground mb-3 sm:mb-4">
              <>{t('pizza.hero.titlePrefix')}<span className="text-gradient-premium">{t('pizza.hero.titleMiddle')}</span>{t('pizza.hero.titleSuffix')}</>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              {t('pizza.hero.subtitle')}
            </p>

            <div className="max-w-sm mx-auto">
              <CompactLiveBitcoinPrice currency="USD" />
            </div>
          </section>

          <section className="container mx-auto px-6 pb-20">
            <div className="max-w-4xl mx-auto space-y-10">
              <OfflineIndicator />

              <ErrorBoundary>
                <PizzaHeroCard currentBtcPrice={liveBtcPrice} isLoading={isLoadingPrice} />
              </ErrorBoundary>

              <ErrorBoundary>
                <OpportunityCostPanel currentBtcPrice={liveBtcPrice} />
              </ErrorBoundary>

              <ErrorBoundary>
                <PizzaIndexChart currentBtcPrice={liveBtcPrice} />
              </ErrorBoundary>

              <ErrorBoundary>
                <PizzaDayTimeline />
              </ErrorBoundary>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PizzaShareCard currentBtcPrice={liveBtcPrice} currentValue={currentValue} />
                <PizzaExportReport currentBtcPrice={liveBtcPrice} currentValue={currentValue} reportRef={reportRef} />
              </div>
            </div>
          </section>

          <PizzaDayHowToUse />
          <PizzaDayFAQSection />
          <div className="container mx-auto px-6 max-w-5xl"><AffiliatePlacement slug="pizza-day" /></div>
          <RelatedCalculators />

          {/* Disclaimer */}
          <section className="container mx-auto px-6 pb-16">
            <div className="max-w-3xl mx-auto">
              <Card className="glass-morphism-card border-border/20 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{t('pizza.dis.title')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('pizza.dis.body')}
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

export default BitcoinPizzaDayCalculator;
