import { HelmetOgImage } from "@/components/seo/HelmetOgImage";
import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AffiliatePlacement } from "@/components/affiliateAI/AffiliatePlacement";
import { useSmartZones } from "@/hooks/useSmartZones";
import { useSafeLanguage } from "@/hooks/useSafeLanguage";
import { Breadcrumb } from '@/components/Breadcrumb';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import RelatedCalculators from '@/components/RelatedCalculators';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, AlertTriangle } from 'lucide-react';
import { PageBackground } from '@/components/modern/PageBackground';
import { CompactLiveBitcoinPrice } from '@/components/CompactLiveBitcoinPrice';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { SIPInputPanel } from '@/components/sip/SIPInputPanel';
import { SIPResultCards } from '@/components/sip/SIPResultCards';
import { SIPGrowthChart } from '@/components/sip/SIPGrowthChart';
import { SIPvsLumpSum } from '@/components/sip/SIPvsLumpSum';
import { SIPHowToUse } from '@/components/sip/SIPHowToUse';
import { SIPFAQSection } from '@/components/sip/SIPFAQSection';
import { QuickAnswerBox } from '@/components/calculator/QuickAnswerBox';
import { useLanguage } from "@/contexts/LanguageContext";
import {
  SIPFrequency,
  calculateSIPResults,
  calculateSIPvsLumpSum,
} from '@/services/sipCalculatorService';

const BitcoinSIPCalculator: React.FC = () => {
  const { language, t } = useLanguage();

  const lang = useSafeLanguage();
  const [amount, setAmount] = useState(100);
  const [frequency, setFrequency] = useState<SIPFrequency>('monthly');
  const [expectedReturn, setExpectedReturn] = useState(30);
  const [timePeriod, setTimePeriod] = useState(5);
  const [inflationEnabled, setInflationEnabled] = useState(false);
  const [inflationRate, setInflationRate] = useState(3);

  const sipResults = useMemo(() =>
    calculateSIPResults({
      amount,
      frequency,
      expectedAnnualReturn: expectedReturn / 100,
      timePeriodYears: timePeriod,
      inflationRate: inflationEnabled ? inflationRate / 100 : null,
    }), [amount, frequency, expectedReturn, timePeriod, inflationEnabled, inflationRate]);

  const lumpSumResults = useMemo(() =>
    calculateSIPvsLumpSum({
      amount,
      frequency,
      expectedAnnualReturn: expectedReturn / 100,
      timePeriodYears: timePeriod,
      inflationRate: inflationEnabled ? inflationRate / 100 : null,
    }), [amount, frequency, expectedReturn, timePeriod, inflationEnabled, inflationRate]);

  const hasSipResult = (sipResults?.growthData?.length ?? 0) > 0;
  const sz = useSmartZones({
    pageSlug: "sip",
    hasResultSignal: hasSipResult,
    autoCalc: true,
    lang,
    resultSignals: ["accumulation", "long-term"],
  });



  const breadcrumbItems = [
    { name: 'Home', url: 'https://bitcoincalculator.tools/' },
    { name: 'Calculators', url: 'https://bitcoincalculator.tools/calculators' },
    { name: 'SIP Calculator', url: 'https://bitcoincalculator.tools/calculators/sip' },
  ];

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Bitcoin SIP Calculator",
    "description": "Plan your Bitcoin Systematic Investment Plan. Set a weekly or monthly amount, choose a growth scenario, and see projected BTC value at 1, 3, 5 and 10 years.",
    "url": "https://bitcoincalculator.tools/calculators/sip",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "featureList": [
      "Forward-looking SIP projections",
      "Weekly, biweekly, monthly frequency",
      "Expected return rate presets",
      "Inflation-adjusted returns",
      "SIP vs Lump Sum comparison",
      "Interactive growth chart",
      "Live Bitcoin price display"
    ],
    "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
    "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" }
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Use the Bitcoin SIP Calculator",
    "description": "Plan your Bitcoin systematic investment plan in four simple steps",
    "step": [
      { "@type": "HowToStep", "name": "Set SIP Amount", "text": "Choose how much you want to invest per period using the slider or input field ($10 to $10,000)" },
      { "@type": "HowToStep", "name": "Choose Frequency", "text": "Select weekly, biweekly, or monthly investment frequency" },
      { "@type": "HowToStep", "name": "Set Expected Return & Period", "text": "Choose your expected annual return rate and investment time period (1-20 years)" },
      { "@type": "HowToStep", "name": "Review Results", "text": "Compare SIP vs Lump Sum returns and view the growth projection chart" }
    ]
  };

  const sipFaqsEn = [
    { q: "What is a Bitcoin SIP?", a: "A Bitcoin SIP (Systematic Investment Plan) is a strategy where you invest a fixed amount in Bitcoin at regular intervals — weekly, biweekly, or monthly — to reduce the impact of price volatility." },
    { q: "How is SIP different from DCA?", a: "SIP and DCA are similar concepts. DCA is the general strategy of investing fixed amounts at regular intervals. SIP is the term used in India and Asian markets, typically in the context of mutual funds." },
    { q: "What return rate should I expect for Bitcoin SIP?", a: "Bitcoin's historical CAGR has been 60-80% since inception, but a conservative estimate of 15-30% may be more appropriate for forward planning." },
    { q: "Is weekly or monthly SIP better for Bitcoin?", a: "Weekly SIPs provide more price averaging points, but the long-term difference between weekly and monthly DCA is minimal over 5+ year horizons." },
    { q: "Can I do SIP in Bitcoin in the USA or India?", a: "Yes. In the USA, platforms like Swan Bitcoin, Strike, and River support automated recurring purchases. In India, exchanges like WazirX and CoinDCX offer auto-invest features." },
    { q: "How does inflation affect my Bitcoin SIP returns?", a: "Inflation erodes purchasing power over time. Toggle inflation adjustment in the calculator to see real vs nominal returns." },
  ];
  const sipFaqsTr = [
    { q: "Bitcoin SIP nedir?", a: "Bitcoin SIP (Sistematik Yatırım Planı), fiyat oynaklığının etkisini azaltmak için Bitcoin'e düzenli aralıklarla — haftalık, iki haftada bir veya aylık — sabit bir tutar yatırdığınız bir stratejidir." },
    { q: "SIP, DCA'dan nasıl farklıdır?", a: "SIP ve DCA benzer kavramlardır. DCA, düzenli aralıklarla sabit tutarlar yatırmanın genel stratejisidir. SIP, Hindistan ve Asya piyasalarında, genellikle yatırım fonları bağlamında kullanılan terimdir." },
    { q: "Bitcoin SIP için ne kadar getiri oranı beklemeliyim?", a: "Bitcoin'in tarihsel CAGR'ı kuruluşundan bu yana %60-80 olmuştur, ancak ileriye dönük planlama için %15-30'luk muhafazakar bir tahmin daha uygun olabilir." },
    { q: "Bitcoin için haftalık mı yoksa aylık SIP mi daha iyi?", a: "Haftalık SIP'ler daha fazla fiyat ortalama noktası sağlar, ancak 5+ yıllık ufuklarda haftalık ve aylık DCA arasındaki uzun vadeli fark çok azdır." },
    { q: "ABD'de veya Hindistan'da Bitcoin'de SIP yapabilir miyim?", a: "Evet. ABD'de Swan Bitcoin, Strike ve River gibi platformlar otomatik tekrarlı alımları destekler. Hindistan'da WazirX ve CoinDCX gibi borsalar otomatik yatırım özellikleri sunar." },
    { q: "Enflasyon Bitcoin SIP getirilerimi nasıl etkiler?", a: "Enflasyon zaman içinde satın alma gücünü aşındırır. Reel ve nominal getirileri görmek için hesaplayıcıdaki enflasyon ayarını açın." },
  ];
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "inLanguage": language === 'tr' ? 'tr' : 'en',
    "mainEntity": (language === 'tr' ? sipFaqsTr : sipFaqsEn).map(({q,a}) => ({ "@type": "Question", "name": q, "acceptedAnswer": { "@type": "Answer", "text": a } }))
  };

  return (
    <>
      <Helmet>
        <title>{t('sip.meta.title')}</title>
        <meta name="description" content={t('sip.meta.description')} />
        <link rel="canonical" href={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-sip-dca':'https://bitcoincalculator.tools/calculators/sip'} />
        <link rel="alternate" hrefLang="tr" href="https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-sip-dca" />
        <link rel="alternate" hrefLang="en" href="https://bitcoincalculator.tools/calculators/sip" />
        <link rel="alternate" hrefLang="x-default" href="https://bitcoincalculator.tools/calculators/sip" />

        <meta property="og:title" content={t('sip.meta.title')} />
        <meta property="og:description" content={t('sip.meta.ogDescription')} />
        <meta property="og:url" content={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-sip-dca':'https://bitcoincalculator.tools/calculators/sip'} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="bitcoincalculator.tools" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('sip.meta.title')} />
        <meta name="twitter:description" content={t('sip.meta.twitterDescription')} />
        <meta name="twitter:creator" content="@web3believers" />

        <meta name="twitter:site" content="@web3believers" />
        <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
        <HelmetOgImage slug="bitcoin-sip-calculator" enAlt={`Bitcoin SIP Calculator | bitcoincalculator.tools`} />

      <BreadcrumbSchema language={language} items={breadcrumbItems} />

      <PageBackground variant="clean">
        <Header />

        <main id="main-content" className="pt-20 relative z-10">
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb items={[
              { label: t('sip.crumb.calculators'), href: language==='tr'?'/tr/hesaplayicilar':'/calculators' },
              { label: t('sip.crumb.current') },
            ]} />
          </div>

          <section className="container mx-auto px-4 sm:px-6 py-16 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6 text-sm font-medium text-primary max-w-full">
              <TrendingUp className="w-4 h-4 shrink-0" />
              <span className="break-words">{t('sip.hero.badge')}</span>
            </div>

            <h1 className="text-h1 font-bold text-foreground mb-4 break-words hyphens-auto">
              {t('sip.hero.titlePrefix')} <span className="text-gradient-premium">{t('sip.hero.titleMiddle')}</span> {t('sip.hero.titleSuffix')}
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-6 break-words">
              {t('sip.hero.description')}
            </p>

            <div className="max-w-sm mx-auto">
              <CompactLiveBitcoinPrice currency="USD" />
            </div>
          </section>

          <div className="container mx-auto px-6 max-w-5xl"><sz.Zone1 /></div>
          <section className="container mx-auto px-6 pb-20">
            <div className="max-w-6xl mx-auto space-y-10">
              <QuickAnswerBox answer="A Bitcoin Systematic Investment Plan (SIP) automatically invests a fixed rupee or dollar amount on a recurring schedule — typically monthly. The calculator backtests your SIP across CoinGecko's full price history, showing total invested, total BTC accumulated, average buy price, and current portfolio value. SIPs in BTC have historically outperformed lump-sum entries during bear markets by smoothing volatility." />
              <OfflineIndicator />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                <ErrorBoundary>
                  <SIPInputPanel
                    amount={amount}
                    setAmount={setAmount}
                    frequency={frequency}
                    setFrequency={setFrequency}
                    expectedReturn={expectedReturn}
                    setExpectedReturn={setExpectedReturn}
                    timePeriod={timePeriod}
                    setTimePeriod={setTimePeriod}
                    inflationEnabled={inflationEnabled}
                    setInflationEnabled={setInflationEnabled}
                    inflationRate={inflationRate}
                    setInflationRate={setInflationRate}
                  />
                </ErrorBoundary>

                <ErrorBoundary>
                  <SIPResultCards results={sipResults} />
                </ErrorBoundary>
              </div>

              {/* Growth Chart */}
              {sipResults.growthData.length > 0 && (
                <ErrorBoundary>
                  <SIPGrowthChart data={sipResults.growthData} showRealValue={inflationEnabled} />
                </ErrorBoundary>
              )}

              {/* SIP vs Lump Sum */}
              <ErrorBoundary>
                <SIPvsLumpSum results={lumpSumResults} />
              </ErrorBoundary>
            </div>
          </section>

          {/* Zone 2 — post-result spotlight */}
          <div className="container mx-auto px-6 max-w-5xl"><sz.Zone2 /></div>

          <SIPHowToUse />

          {/* Zone 4 — pre-FAQ checkpoint */}
          <div className="container mx-auto px-6 max-w-5xl"><sz.Zone4 /></div>

          <SIPFAQSection />
          {/* legacy post-result banner removed — Zone 2 above covers it */}
          <RelatedCalculators />

          {/* Disclaimer */}
          <section className="container mx-auto px-6 pb-16">
            <div className="max-w-3xl mx-auto">
              <Card className="glass-morphism-card border-border/20 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{t('sip.disclaimer.title')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('sip.disclaimer.body')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>

        <Footer />
        <sz.Zone5 />
      </PageBackground>
    </>
  );
};

export default BitcoinSIPCalculator;
