import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AffiliatePlacement } from "@/components/affiliateAI/AffiliatePlacement";
import { Breadcrumb } from '@/components/Breadcrumb';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import RelatedCalculators from '@/components/RelatedCalculators';
import { CompactLiveBitcoinPrice } from '@/components/CompactLiveBitcoinPrice';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Scale, AlertTriangle } from 'lucide-react';
import { useLiveBitcoinPrice } from '@/hooks/useLiveBitcoinPrice';
import { PurchaseEntry, createPurchaseEntry, calculateAverageBuyPrice } from '@/services/averageBuyPriceCalculator';
import { AvgBuyInputPanel } from '@/components/average-buy-price/AvgBuyInputPanel';
import { AvgBuyResultCards } from '@/components/average-buy-price/AvgBuyResultCards';
import { AvgBuyBreakevenCard } from '@/components/average-buy-price/AvgBuyBreakevenCard';
import { AvgBuyScenarioTable } from '@/components/average-buy-price/AvgBuyScenarioTable';
import { AvgBuyShareCard } from '@/components/average-buy-price/AvgBuyShareCard';
import { AvgBuyExportReport } from '@/components/average-buy-price/AvgBuyExportReport';
import { AvgBuyContentSections } from '@/components/average-buy-price/AvgBuyContentSections';
import { AvgBuyHowToUse } from '@/components/average-buy-price/AvgBuyHowToUse';
import { AvgBuyFAQSection, avgBuyFaqSchema, avgBuyFaqSchemaTr } from '@/components/average-buy-price/AvgBuyFAQSection';
import { PageBackground } from '@/components/modern/PageBackground';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from "@/components/LocalizedLink";
import { QuickAnswerBox } from '@/components/calculator/QuickAnswerBox';
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocalizedSchema } from "@/hooks/useLocalizedSchema";

import { HelmetOgImage } from "@/components/seo/HelmetOgImage";
const BitcoinAverageBuyPriceCalculator: React.FC = () => {
  const { language, t } = useLanguage();
  const { price: liveBtcPrice } = useLiveBitcoinPrice();

  const [purchases, setPurchases] = useState<PurchaseEntry[]>([
    createPurchaseEntry(0.05, 30000),
    createPurchaseEntry(0.03, 60000),
  ]);

  const result = useMemo(() => calculateAverageBuyPrice(purchases, liveBtcPrice), [purchases, liveBtcPrice]);

  const enUrl = 'https://bitcoincalculator.tools/calculators/average-buy-price';
  const trUrl = 'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-ortalama-alis';

  const webAppSchema = useLocalizedSchema(
    {
      "@context": "https://schema.org", "@type": "WebApplication", inLanguage: "en",
      "name": "Bitcoin Average Buy Price Calculator",
      "description": "Enter your Bitcoin purchases and see your average buy price, total BTC held, current profit/loss, and break-even price. Free calculator with live BTC price.",
      "url": enUrl, "applicationCategory": "FinanceApplication", "operatingSystem": "Any",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "featureList": [
        "Weighted average buy price calculation",
        "Live Bitcoin price integration",
        "Multi-purchase cost basis tracking",
        "Break-even price analysis",
        "Scenario projections at $100k–$1M",
        "PDF and PNG export",
      ],
      "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
      "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
    },
    {
      "@context": "https://schema.org", "@type": "WebApplication", inLanguage: "tr",
      "name": "Bitcoin Ortalama Alış Fiyatı Hesaplayıcısı",
      "description": "Bitcoin alımlarınızı girin; ortalama alış fiyatınızı, toplam elde tutulan BTC'yi, güncel kâr/zararı ve başabaş fiyatını görün. Canlı BTC fiyatlı ücretsiz hesaplayıcı.",
      "url": trUrl, "applicationCategory": "FinanceApplication", "operatingSystem": "Any",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "TRY" },
      "featureList": [
        "Ağırlıklı ortalama alış fiyatı hesaplaması",
        "Canlı Bitcoin fiyatı entegrasyonu",
        "Çoklu alım maliyet bazı takibi",
        "Başabaş fiyat analizi",
        "100 bin – 1 milyon $ aralığında senaryo projeksiyonları",
        "PDF ve PNG dışa aktarma",
      ],
      "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
      "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
    },
  );

  const howToSchema = useLocalizedSchema(
    {
      "@context": "https://schema.org", "@type": "HowTo", inLanguage: "en",
      "name": "How to Calculate Your Average Bitcoin Buy Price",
      "description": "Find your weighted average cost basis across multiple Bitcoin purchases.",
      "step": [
        { "@type": "HowToStep", "name": "Add Your Purchases", "text": "Enter each Bitcoin buy with the amount of BTC and the price per coin at purchase." },
        { "@type": "HowToStep", "name": "View Average Price", "text": "The calculator instantly shows your weighted average buy price and total holdings." },
        { "@type": "HowToStep", "name": "Check Profit/Loss", "text": "See your unrealized P/L, break-even price, and scenario projections at various future BTC prices." },
      ],
    },
    {
      "@context": "https://schema.org", "@type": "HowTo", inLanguage: "tr",
      "name": "Ortalama Bitcoin Alış Fiyatınızı Nasıl Hesaplarsınız",
      "description": "Birden fazla Bitcoin alımı arasında ağırlıklı ortalama maliyet bazınızı bulun.",
      "step": [
        { "@type": "HowToStep", "name": "Alımlarınızı Ekleyin", "text": "Her Bitcoin alımını BTC miktarı ve alımdaki coin başına fiyatla girin." },
        { "@type": "HowToStep", "name": "Ortalama Fiyatı Görüntüleyin", "text": "Hesaplayıcı, ağırlıklı ortalama alış fiyatınızı ve toplam tutarlarınızı anında gösterir." },
        { "@type": "HowToStep", "name": "Kâr/Zararı Kontrol Edin", "text": "Gerçekleşmemiş K/Z'nizi, başabaş fiyatınızı ve çeşitli gelecekteki BTC fiyatlarındaki senaryo projeksiyonlarını görün." },
      ],
    },
  );

  const faqSchema = useLocalizedSchema(avgBuyFaqSchema, avgBuyFaqSchemaTr);

  const breadcrumbItems = language === 'tr' ? [
    { name: 'Ana Sayfa', url: 'https://bitcoincalculator.tools/tr/' },
    { name: 'Hesaplayıcılar', url: 'https://bitcoincalculator.tools/tr/hesaplayicilar' },
    { name: 'Ortalama Alış Fiyatı', url: trUrl },
  ] : [
    { name: 'Home', url: 'https://bitcoincalculator.tools/' },
    { name: 'Calculators', url: 'https://bitcoincalculator.tools/calculators' },
    { name: 'Average Buy Price', url: enUrl },
  ];

  return (
    <>
      <Helmet>
        <title>{t('avgbuy.meta.title')}</title>
        <meta name="description" content={t('avgbuy.meta.description')} />
        <meta name="keywords" content="bitcoin average buy price calculator, bitcoin average cost calculator, btc average cost calculator, average bitcoin price calculator, bitcoin cost basis calculator, bitcoin break even price calculator, average down bitcoin calculator" />
        <link rel="canonical" href={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-ortalama-alis':'https://bitcoincalculator.tools/calculators/average-buy-price'} />

        <link rel="alternate" hrefLang="tr" href="https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-ortalama-alis" />
        <link rel="alternate" hrefLang="en" href="https://bitcoincalculator.tools/calculators/average-buy-price" />
        <link rel="alternate" hrefLang="x-default" href="https://bitcoincalculator.tools/calculators/average-buy-price" />
        <meta property="og:title" content={t('avgbuy.meta.title')} />
        <meta property="og:description" content={t('avgbuy.meta.ogDescription')} />
        <meta property="og:url" content={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-ortalama-alis':'https://bitcoincalculator.tools/calculators/average-buy-price'} />
        <meta property="og:type" content="website" />
        <HelmetOgImage slug="bitcoin-average-buy-price-calculator" enAlt={`Bitcoin Average Buy Price Calculator | bitcoincalculator.tools`} />
        <meta property="og:site_name" content="bitcoincalculator.tools" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('avgbuy.meta.title')} />
        <meta name="twitter:description" content={t('avgbuy.meta.twitterDescription')} />
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
              { label: t('avgbuy.crumb.calculators'), href: language==='tr'?'/tr/hesaplayicilar':'/calculators' },
              { label: t('avgbuy.crumb.current') },
            ]}
          />
          </div>

          {/* Hero */}
          <section className="container mx-auto px-6 py-16 text-center">
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/10">
                <Scale className="w-4 h-4" />
                {t('avgbuy.hero.badge')}
              </div>
              <h1 className="text-h1 font-bold text-foreground">
                {t('avgbuy.hero.titlePrefix')} <span className="text-gradient-premium">{t('avgbuy.hero.titleMiddle')}</span> {t('avgbuy.hero.titleSuffix')}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('avgbuy.hero.description')}
              </p>
              <div className="max-w-sm mx-auto">
                <CompactLiveBitcoinPrice currency="USD" />
              </div>
            </div>
          </section>

          <section className="container mx-auto px-6 pb-20">
            <div className="max-w-6xl mx-auto space-y-8">
              <QuickAnswerBox answer="Your Bitcoin average buy price is the total fiat spent divided by the total BTC accumulated. The calculator weights every purchase by size — a $5,000 buy at $30K weighs more than a $500 buy at $60K. Add every transaction (or paste from CSV) and you'll see your true cost basis, unrealized P&L versus the live BTC price, and how each purchase moved your average up or down." />
              <OfflineIndicator />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <AvgBuyInputPanel purchases={purchases} setPurchases={setPurchases} liveBtcPrice={liveBtcPrice} />
                <ErrorBoundary>
                  <div className="space-y-4">
                    <AvgBuyResultCards result={result} />
                    <AvgBuyBreakevenCard result={result} liveBtcPrice={liveBtcPrice} />
                  </div>
                </ErrorBoundary>
              </div>

              <div className="space-y-4">
                <ErrorBoundary>
                  <AvgBuyScenarioTable result={result} />
                </ErrorBoundary>
                {result && (
                  <Card className="glass-morphism-card border-border/20 shadow-sm">
                    <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <h2 className="text-base font-semibold text-foreground">{t('avgbuy.send.title')}</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t('avgbuy.send.desc')}
                        </p>
                      </div>
                      <Link
                        to={language==='tr'?`/tr/hesaplayicilar/bitcoin-kar-zarar-hesaplayicisi?btcAmount=${result.totalBtc}&buyPrice=${result.weightedAvgPrice}`:`/calculators/profit-loss?btcAmount=${result.totalBtc}&buyPrice=${result.weightedAvgPrice}`}
                        className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                      >
                        {t('avgbuy.send.cta')}
                      </Link>
                    </CardContent>
                  </Card>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <AvgBuyShareCard result={result} />
                  <AvgBuyExportReport result={result} liveBtcPrice={liveBtcPrice} />
                </div>
              </div>
            </div>
          </section>

          {/* SEO H2 Section */}
          <section className="container mx-auto px-6 pb-12">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-h2 font-bold text-foreground mb-4">
                {t('avgbuy.breakEven.title')}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('avgbuy.breakEven.body')}
              </p>
            </div>
          </section>

          <AvgBuyContentSections />
          <AvgBuyHowToUse />
          <AvgBuyFAQSection />
          <div className="container mx-auto px-6 max-w-5xl"><AffiliatePlacement slug="average-buy-price" /></div>
          <RelatedCalculators />

          <section className="container mx-auto px-6 pb-16">
            <div className="max-w-3xl mx-auto">
              <Card className="glass-morphism-card border-border/20 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{t('avgbuy.disclaimer.title')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('avgbuy.disclaimer.body')}
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

export default BitcoinAverageBuyPriceCalculator;
