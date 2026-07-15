import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useSmartZones } from "@/hooks/useSmartZones";
import { PlacementProvider } from "@/contexts/PlacementProvider";
import { useSafeLanguage } from "@/hooks/useSafeLanguage";
import { Breadcrumb } from '@/components/Breadcrumb';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import RelatedCalculators from '@/components/RelatedCalculatorsLazy';
import { Card, CardContent } from '@/components/ui/card';
import { Ruler, AlertTriangle } from 'lucide-react';
import { useLiveBitcoinPrice } from '@/hooks/useLiveBitcoinPrice';
import { lotSizeCalculator, brokerPresets, LotSizeResult } from '@/services/lotSizeCalculator';
import { LotSizeInputPanel } from '@/components/lot-size/LotSizeInputPanel';
import { LotSizeResultsPanel } from '@/components/lot-size/LotSizeResultsPanel';
import { LotValueConverter } from '@/components/lot-size/LotValueConverter';
import { LotSizeHowToSection } from '@/components/lot-size/LotSizeHowToSection';
import { LotSizeFAQSection } from '@/components/lot-size/LotSizeFAQSection';
import { LotSizeExportReport } from '@/components/lot-size/LotSizeExportReport';
import { LotSizeTldrAnswer } from '@/components/lot-size/LotSizeTldrAnswer';
import { LotSizeLiquidationCard } from '@/components/lot-size/LotSizeLiquidationCard';
import { LotSizeScenarioMatrix } from '@/components/lot-size/LotSizeScenarioMatrix';
import { LotSizeBrokerMatrix } from '@/components/lot-size/LotSizeBrokerMatrix';
import { LotSizeContentSections } from '@/components/lot-size/LotSizeContentSections';
import { LotSizeAffiliateCluster } from '@/components/lot-size/LotSizeAffiliateCluster';
import { BROKER_MAINT_MARGIN, BROKER_TAKER_FEE_BPS } from '@/services/lotSizeAdvanced';
import { PageBackground } from '@/components/modern/PageBackground';
import { CompactLiveBitcoinPrice } from '@/components/CompactLiveBitcoinPrice';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useLanguage } from "@/contexts/LanguageContext";

import { HelmetOgImage } from "@/components/seo/HelmetOgImage";

const LOT_SIZE_LAST_REVIEWED_ISO = '2026-07-15';
const BitcoinLotSizeCalculator: React.FC = () => {
  const { language, t } = useLanguage();
  const { price: liveBtcPrice, isLoading: isLoadingPrice } = useLiveBitcoinPrice();

  const lang = useSafeLanguage();
  const [accountBalance, setAccountBalance] = useState<number>(10000);
  const [riskPercent, setRiskPercent] = useState<number>(1);
  const [entryPrice, setEntryPrice] = useState<number>(0);
  const [hasUserEditedPrice, setHasUserEditedPrice] = useState(false);
  const [stopLossPrice, setStopLossPrice] = useState<number>(0);
  const [leverage, setLeverage] = useState<number>(1);
  const [selectedBroker, setSelectedBroker] = useState<string>('standard');
  const [contractSize, setContractSize] = useState<number>(1);
  const [takeProfitPrice, setTakeProfitPrice] = useState<number>(0);
  const [maxDailyDrawdown, setMaxDailyDrawdown] = useState<number>(0);

  // Auto-fill entry price from live data
  React.useEffect(() => {
    if (liveBtcPrice > 0 && !hasUserEditedPrice) {
      setEntryPrice(liveBtcPrice);
      // Set default stop loss 2.5% below entry
      setStopLossPrice(Math.round(liveBtcPrice * 0.975));
    }
  }, [liveBtcPrice, hasUserEditedPrice]);

  const handleSetEntryPrice = (price: number) => {
    setHasUserEditedPrice(true);
    setEntryPrice(price);
  };

  const result = useMemo<LotSizeResult | null>(() => {
    if (entryPrice <= 0 || accountBalance <= 0 || stopLossPrice <= 0 || entryPrice === stopLossPrice) return null;
    return lotSizeCalculator.calculateLotSize({
      accountBalance,
      riskPercent,
      entryPrice,
      stopLossPrice,
      leverage,
      contractSize,
      takeProfitPrice: takeProfitPrice > 0 ? takeProfitPrice : undefined,
      maxDailyDrawdown: maxDailyDrawdown > 0 ? maxDailyDrawdown : undefined,
    });
  }, [accountBalance, riskPercent, entryPrice, stopLossPrice, leverage, contractSize, takeProfitPrice, maxDailyDrawdown]);

  const sz = useSmartZones({
    pageSlug: "lot-size",
    hasResultSignal: !!result,
    autoCalc: true,
    lang,
    resultSignals: ["trading", "professional"],
  });


  const currentBroker = brokerPresets.find(b => b.id === selectedBroker);

  const breadcrumbItems = [
    { name: 'Home', url: 'https://bitcoincalculator.tools/' },
    { name: 'Calculators', url: 'https://bitcoincalculator.tools/calculators' },
    { name: 'Bitcoin Lot Size Calculator', url: 'https://bitcoincalculator.tools/calculators/bitcoin-lot-size' }
  ];

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Bitcoin Lot Size Calculator",
    "description": "Calculate the right BTC lot size for your trade. Enter account balance, risk %, stop loss and leverage. Works for MT5, Binance, Bybit and Exness. Free.",
    "url": "https://bitcoincalculator.tools/calculators/bitcoin-lot-size",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "featureList": ["Lot size calculation", "Position sizing", "Risk management", "Stop loss calculator", "Leverage calculator", "BTC pip value", "Broker presets"],
    "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
    "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" }
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Calculate Bitcoin Lot Size",
    "description": "Step-by-step guide to calculating the right lot size for BTC trades",
    "step": [
      { "@type": "HowToStep", "name": "Enter your account balance", "text": "Enter your trading account balance in USD" },
      { "@type": "HowToStep", "name": "Set your risk percentage", "text": "Set your risk percentage — 1-2% is recommended for most traders" },
      { "@type": "HowToStep", "name": "Enter your BTC entry price", "text": "Enter your planned entry price or use the live BTC price" },
      { "@type": "HowToStep", "name": "Enter your stop loss price", "text": "Set where you'd place your stop loss order" },
      { "@type": "HowToStep", "name": "Select your broker", "text": "Choose your broker's contract size from the presets or enter custom" },
      { "@type": "HowToStep", "name": "Read your recommended lot size", "text": "View your recommended lot size, position value, and risk breakdown" },
    ]
  };

  const lotFaqsEn = [
    { q: "How to calculate lot size on BTC?", a: "Lot Size = (Account Balance × Risk%) ÷ (Stop Loss Distance in USD × Tick Value). For example: $10,000 account, 1% risk ($100), stop loss $500 away = 0.2 lot." },
    { q: "How much is 0.01 lot size in Bitcoin?", a: "0.01 lots = 0.01 BTC (one micro lot). At a BTC price of $85,000, that equals $850." },
    { q: "How much is 1 lot of Bitcoin?", a: "1 standard lot of Bitcoin = 1 BTC. At $85,000 per BTC, 1 lot is worth $85,000. This is the standard contract size on most MT4/MT5 brokers." },
    { q: "How much is 0.001 BTC lot size in dollars?", a: "0.001 BTC (1 nano lot) at $85,000 BTC price = $85. Equivalent to 100,000 satoshis." },
    { q: "How do I calculate my lot size?", a: "Use the formula: Lot Size = Risk Amount ÷ (Stop Loss Distance × Pip Value). Risk Amount = Account Balance × Risk Percentage." },
    { q: "Is 0.01 a good lot size?", a: "0.01 (micro lot) is recommended for beginners and small accounts under $1,000. Professional traders adjust lot size based on their account size and risk rules, typically risking 1-2% per trade." },
    { q: "What lot size is $10?", a: "At $85,000 BTC, $10 equals approximately 0.000118 BTC, or 0.000118 lots. The minimum tradeable lot on most brokers is 0.01 (micro lot), which = ~$850." },
    { q: "What is a pip in Bitcoin trading?", a: "In Bitcoin forex trading, one pip is typically $1 (a $1 price movement in BTC/USD). The pip value depends on your lot size: for a 0.01 lot (0.01 BTC), a $1 move = $0.01 profit or loss. For a 1.0 standard lot (1 BTC), a $1 move = $1 profit or loss. Use the calculator above to find pip value for any lot size." },
  ];
  const lotFaqsTr = [
    { q: "BTC'de lot büyüklüğü nasıl hesaplanır?", a: "Lot Büyüklüğü = (Hesap Bakiyesi × Risk%) ÷ (USD cinsinden Stop Loss Mesafesi × Tick Değeri). Örneğin: 10.000 $ hesap, %1 risk (100 $), 500 $ uzaklıkta stop loss = 0,2 lot." },
    { q: "Bitcoin'de 0,01 lot büyüklüğü ne kadardır?", a: "0,01 lot = 0,01 BTC (bir mikro lot). 85.000 $ BTC fiyatında bu 850 $ eder." },
    { q: "1 lot Bitcoin ne kadardır?", a: "1 standart lot Bitcoin = 1 BTC. BTC başına 85.000 $ ile 1 lot 85.000 $ değerindedir. Çoğu MT4/MT5 broker'ında bu standart kontrat büyüklüğüdür." },
    { q: "0,001 BTC lot büyüklüğü dolar cinsinden ne kadardır?", a: "0,001 BTC (1 nano lot) 85.000 $ BTC fiyatında = 85 $. 100.000 satoshiye eşdeğerdir." },
    { q: "Lot büyüklüğümü nasıl hesaplarım?", a: "Şu formülü kullanın: Lot Büyüklüğü = Risk Tutarı ÷ (Stop Loss Mesafesi × Pip Değeri). Risk Tutarı = Hesap Bakiyesi × Risk Yüzdesi." },
    { q: "0,01 iyi bir lot büyüklüğü müdür?", a: "0,01 (mikro lot), yeni başlayanlar ve 1.000 $ altındaki küçük hesaplar için önerilir. Profesyonel yatırımcılar genellikle işlem başına %1-2 risk alarak lot büyüklüğünü hesaplarına ve risk kurallarına göre ayarlar." },
    { q: "10 $ hangi lot büyüklüğüdür?", a: "85.000 $ BTC'de 10 $ yaklaşık 0,000118 BTC veya 0,000118 lot eder. Çoğu broker'da minimum işlenebilir lot 0,01'dir (mikro lot) ve ~850 $ eder." },
    { q: "Bitcoin işlemlerinde pip nedir?", a: "Bitcoin forex işlemlerinde bir pip genellikle 1 $'dır (BTC/USD'de 1 $'lık fiyat hareketi). Pip değeri lot büyüklüğünüze bağlıdır: 0,01 lot (0,01 BTC) için 1 $ hareket = 0,01 $ kar veya zarar. 1,0 standart lot (1 BTC) için 1 $ hareket = 1 $ kar veya zarar. Herhangi bir lot büyüklüğü için pip değerini bulmak için yukarıdaki hesaplayıcıyı kullanın." },
  ];
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "inLanguage": language === 'tr' ? 'tr' : 'en',
    "mainEntity": (language === 'tr' ? lotFaqsTr : lotFaqsEn).map(({q,a}) => ({ "@type": "Question", "name": q, "acceptedAnswer": { "@type": "Answer", "text": a } }))
  };

  const canonicalUrl = language==='tr'
    ? 'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-lot-buyuklugu'
    : 'https://bitcoincalculator.tools/calculators/bitcoin-lot-size';

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": language === 'tr' ? "Bitcoin Lot Büyüklüğü Hesaplayıcı — Tam Kılavuz" : "Bitcoin Lot Size Calculator — Complete Guide",
    "inLanguage": language === 'tr' ? 'tr' : 'en',
    "datePublished": "2025-03-01",
    "dateModified": LOT_SIZE_LAST_REVIEWED_ISO,
    "url": canonicalUrl,
    "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
    "publisher": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
    "reviewedBy": { "@type": "Organization", "name": "Bitcoin Calculator Tools Trading Desk" },
    "mainEntityOfPage": canonicalUrl
  };

  const currentMaint = BROKER_MAINT_MARGIN[selectedBroker] ?? 0.005;
  const currentFeeBps = BROKER_TAKER_FEE_BPS[selectedBroker] ?? 6;

  return (
    <PlacementProvider value={sz}>
      <Helmet>
        <title>{t('lot.meta.title')}</title>
        <meta name="description" content={t('lot.meta.description')} />
        <link rel="canonical" href={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-lot-buyuklugu':'https://bitcoincalculator.tools/calculators/bitcoin-lot-size'} />

        <link rel="alternate" hrefLang="tr" href="https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-lot-buyuklugu" />
        <link rel="alternate" hrefLang="en" href="https://bitcoincalculator.tools/calculators/bitcoin-lot-size" />
        <link rel="alternate" hrefLang="x-default" href="https://bitcoincalculator.tools/calculators/bitcoin-lot-size" />
        <meta property="og:title" content={t('lot.meta.ogTitle')} />
        <meta property="og:description" content={t('lot.meta.ogDescription')} />
        <meta property="og:url" content={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-lot-buyuklugu':'https://bitcoincalculator.tools/calculators/bitcoin-lot-size'} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="bitcoincalculator.tools" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('lot.meta.twitterTitle')} />
        <meta name="twitter:description" content={t('lot.meta.twitterDescription')} />
        <meta name="twitter:creator" content="@web3believers" />

        <meta name="twitter:site" content="@web3believers" />
        <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      </Helmet>
        <HelmetOgImage slug="bitcoin-lot-size-calculator" enAlt={`Bitcoin Lot Size Calculator | bitcoincalculator.tools`} />

      <BreadcrumbSchema language={language} items={breadcrumbItems} />

      <PageBackground variant="clean">
        <Header />

        <main id="main-content" className="pt-20 relative z-10">
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb items={[
              { label: t('lot.crumb.calculators'), href: language==='tr'?'/tr/hesaplayicilar':'/calculators' },
              { label: t('lot.crumb.current') }
            ]} />
          </div>

          {/* Hero */}
          <section className="container mx-auto px-6 py-16 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6 text-sm font-medium text-primary">
              <Ruler className="w-4 h-4" />
              {t('lot.hero.badge')}
            </div>

            <h1 className="text-h1 font-bold text-foreground mb-4">
              {t('lot.hero.titlePrefix')} <span className="text-gradient-premium">{t('lot.hero.titleHighlight')}</span> {t('lot.hero.titleSuffix')}
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-2">
              {t('lot.hero.description')}
            </p>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto mb-2">
              <strong>1 lot of Bitcoin = 1 BTC.</strong> At today's price of ${liveBtcPrice ? liveBtcPrice.toLocaleString() : '—'}, 1 lot = ${liveBtcPrice ? liveBtcPrice.toLocaleString() : '—'}.
            </p>
            <p className="text-xs text-muted-foreground/70 max-w-xl mx-auto mb-6">
              {language === 'tr' ? 'İncelendi 15 Temmuz 2026 · Bitcoin Calculator Tools Trading Desk' : 'Reviewed July 15, 2026 · Bitcoin Calculator Tools Trading Desk'}
            </p>

            <div className="max-w-sm mx-auto mb-6">
              <CompactLiveBitcoinPrice currency="USD" />
            </div>

            <LotSizeTldrAnswer liveBtcPrice={liveBtcPrice} />
          </section>

          {/* Calculator Tabs */}
          <div className="container mx-auto px-6 max-w-5xl"><sz.SlotA /></div>
          <section className="container mx-auto px-6 pb-20">
            <div className="max-w-5xl mx-auto">
              <Tabs defaultValue="lot-size" className="space-y-8">
                <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                  <TabsTrigger value="lot-size">{t('lot.tab.lotSize')}</TabsTrigger>
                  <TabsTrigger value="converter">{t('lot.tab.converter')}</TabsTrigger>
                </TabsList>

                <TabsContent value="lot-size">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    <ErrorBoundary>
                      <LotSizeInputPanel
                        accountBalance={accountBalance}
                        setAccountBalance={setAccountBalance}
                        riskPercent={riskPercent}
                        setRiskPercent={setRiskPercent}
                        entryPrice={entryPrice}
                        setEntryPrice={handleSetEntryPrice}
                        stopLossPrice={stopLossPrice}
                        setStopLossPrice={setStopLossPrice}
                        leverage={leverage}
                        setLeverage={setLeverage}
                        selectedBroker={selectedBroker}
                        setSelectedBroker={setSelectedBroker}
                        contractSize={contractSize}
                        setContractSize={setContractSize}
                        takeProfitPrice={takeProfitPrice}
                        setTakeProfitPrice={setTakeProfitPrice}
                        maxDailyDrawdown={maxDailyDrawdown}
                        setMaxDailyDrawdown={setMaxDailyDrawdown}
                        liveBtcPrice={liveBtcPrice}
                        isLoadingPrice={isLoadingPrice}
                      />
                    </ErrorBoundary>
                    <ErrorBoundary>
                      <LotSizeResultsPanel result={result} />
                    </ErrorBoundary>
                  </div>

                  {result && (
                    <div className="mt-8">
                      <LotSizeExportReport
                        result={result}
                        entryPrice={entryPrice}
                        stopLossPrice={stopLossPrice}
                        riskPercent={riskPercent}
                        accountBalance={accountBalance}
                        leverage={leverage}
                        brokerName={currentBroker?.name || 'Custom'}
                      />
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="converter">
                  <ErrorBoundary>
                    <LotValueConverter
                      liveBtcPrice={liveBtcPrice}
                      contractSize={contractSize}
                    />
                  </ErrorBoundary>
                </TabsContent>
              </Tabs>
            </div>
          </section>

          {/* Zone 2 — post-result spotlight */}
          <div className="container mx-auto px-6 max-w-5xl"><sz.SlotB /></div>

          {/* SEO H2 Section */}
          <section className="container mx-auto px-6 pb-12">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-h2 font-bold text-foreground mb-4">
                {t('lot.pip.title')}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('lot.pip.body')}
              </p>
            </div>
          </section>

          {/* How To Section */}
          <LotSizeHowToSection />

          {/* Zone 4 — pre-FAQ checkpoint */}
          <div className="container mx-auto px-6 max-w-5xl"><sz.SlotC /></div>

          {/* FAQ */}
          <LotSizeFAQSection />

          {/* Related Calculators (legacy post-result banner removed — Zone 2 above covers it) */}
          <RelatedCalculators />

          {/* Disclaimer */}
          <section className="container mx-auto px-6 pb-16">
            <div className="max-w-3xl mx-auto">
              <Card className="glass-morphism-card border-border/20 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{t('lot.disclaimer.title')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('lot.disclaimer.body')}
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

export default BitcoinLotSizeCalculator;
