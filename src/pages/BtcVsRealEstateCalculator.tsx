import React, { Suspense, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useSafeLanguage } from "@/hooks/useSafeLanguage";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { PageBackground } from "@/components/modern/PageBackground";
import { CompactLiveBitcoinPrice } from "@/components/CompactLiveBitcoinPrice";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import RelatedCalculators from "@/components/RelatedCalculators";
import { Card, CardContent } from "@/components/ui/card";
import { BtcVsRealEstateInputPanel } from "@/components/btc-vs-real-estate/BtcVsRealEstateInputPanel";
import { BtcVsRealEstateResultsPanel } from "@/components/btc-vs-real-estate/BtcVsRealEstateResultsPanel";
import { BtcVsRealEstateHowToUse } from "@/components/btc-vs-real-estate/BtcVsRealEstateHowToUse";
import { BtcVsRealEstateFAQSection } from "@/components/btc-vs-real-estate/BtcVsRealEstateFAQSection";
import { calculateBtcVsRealEstate, defaultInputs, BtcVsRealEstateInputs, BtcVsRealEstateResult } from "@/services/btcVsRealEstateCalculator";
import { AlertTriangle, Home, Landmark, Scale } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocalizedSchema } from "@/hooks/useLocalizedSchema";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { lazyWithRetry } from "@/utils/lazyWithRetry";

import { HelmetOgImage } from "@/components/seo/HelmetOgImage";
import { PreFAQPlacement } from "@/components/placement/PreFAQPlacement";
import { QuickShareLinkPanel } from '@/components/share-export';

const BtcVsRealEstateChart = lazyWithRetry(() =>
  import("@/components/btc-vs-real-estate/BtcVsRealEstateChart").then((m) => ({ default: m.BtcVsRealEstateChart }))
);

const LazyBtcVsRealEstateChart = ({ data }: { data: BtcVsRealEstateResult["yearlyBreakdown"] }) => {
  const [ref, isVisible] = useIntersectionObserver({ rootMargin: "300px", triggerOnce: true });
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="min-h-[400px]">

      {isVisible ? (
        <Suspense fallback={<div className="h-[400px]" aria-hidden="true" />}>
          <BtcVsRealEstateChart data={data} />
        </Suspense>
      ) : null}
    </div>
  );
};

const formatCurrency = (value: number) => value.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const BtcVsRealEstateCalculator = () => {
  const { language, t } = useLanguage();
  const [inputs, setInputs] = useState<BtcVsRealEstateInputs>(defaultInputs);
  const [result, setResult] = useState<BtcVsRealEstateResult | null>(null);

  const handleCalculate = () => {
    setResult(calculateBtcVsRealEstate(inputs));
  };

  const handleReset = () => {
    setInputs(defaultInputs);
    setResult(null);
  };

  const webAppSchemaEn = {
    "@context": "https://schema.org", "@type": "WebApplication",
    "name": "Bitcoin vs Real Estate Calculator",
    "description": "Compare Bitcoin vs real estate returns side by side. Model mortgage leverage, rental income, appreciation, and BTC growth over 1–20 years. Free tool.",
    "url": "https://bitcoincalculator.tools/calculators/btc-vs-real-estate",
    "inLanguage": "en",
    "applicationCategory": "FinanceApplication", "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools" },
    "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" }
  };
  const webAppSchemaTr = {
    "@context": "https://schema.org", "@type": "WebApplication",
    "name": "Bitcoin vs Gayrimenkul Hesaplayıcısı",
    "description": "Bitcoin ve gayrimenkul getirilerini yan yana karşılaştırın. Mortgage kaldıracını, kira gelirini, değerlenmeyi ve 1–20 yıl boyunca BTC büyümesini modelleyin. Ücretsiz araç.",
    "url": "https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-gayrimenkul",
    "inLanguage": "tr",
    "applicationCategory": "FinanceApplication", "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "TRY" },
    "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools" },
    "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" }
  };

  const howToSchemaEn = {
    "@context": "https://schema.org", "@type": "HowTo",
    "name": "How to Use the Bitcoin vs Real Estate Calculator",
    "description": "Step-by-step guide to comparing Bitcoin and real estate investment returns",
    "inLanguage": "en", "totalTime": "PT3M",
    "step": [
      { "@type": "HowToStep", "name": "Enter Property Details", "text": "Set the property price, down payment percentage, mortgage rate, loan term, and expected annual appreciation.", "url": "https://bitcoincalculator.tools/calculators/btc-vs-real-estate#step1" },
      { "@type": "HowToStep", "name": "Add Operating Costs", "text": "Input rental yield, vacancy rate, maintenance costs, property tax, and closing costs to model realistic returns.", "url": "https://bitcoincalculator.tools/calculators/btc-vs-real-estate#step2" },
      { "@type": "HowToStep", "name": "Set Bitcoin Growth Rate", "text": "Choose your expected annual BTC growth rate between -20% and 100%.", "url": "https://bitcoincalculator.tools/calculators/btc-vs-real-estate#step3" },
      { "@type": "HowToStep", "name": "Compare Results", "text": "Review side-by-side ROI, cost breakdowns, and the year-by-year chart.", "url": "https://bitcoincalculator.tools/calculators/btc-vs-real-estate#step4" }
    ]
  };
  const howToSchemaTr = {
    "@context": "https://schema.org", "@type": "HowTo",
    "name": "Bitcoin vs Gayrimenkul Hesaplayıcısı Nasıl Kullanılır?",
    "description": "Bitcoin ve gayrimenkul yatırım getirilerini karşılaştırmak için adım adım rehber",
    "inLanguage": "tr", "totalTime": "PT3M",
    "step": [
      { "@type": "HowToStep", "name": "Mülk Bilgilerini Girin", "text": "Mülk fiyatını, peşinat yüzdesini, mortgage faizini, kredi vadesini ve beklenen yıllık değerlenmeyi belirleyin.", "url": "https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-gayrimenkul#step1" },
      { "@type": "HowToStep", "name": "İşletme Maliyetlerini Ekleyin", "text": "Gerçekçi getiriyi modellemek için kira getirisi, boşluk oranı, bakım maliyetleri, emlak vergisi ve kapanış masraflarını girin.", "url": "https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-gayrimenkul#step2" },
      { "@type": "HowToStep", "name": "Bitcoin Büyüme Oranını Belirleyin", "text": "Beklenen yıllık BTC büyüme oranınızı %-20 ile %100 arasında seçin.", "url": "https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-gayrimenkul#step3" },
      { "@type": "HowToStep", "name": "Sonuçları Karşılaştırın", "text": "Yan yana getiriyi, maliyet kırılımlarını ve yıl bazında grafiği inceleyin.", "url": "https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-gayrimenkul#step4" }
    ]
  };

  const faqSchemaEn = {
    "@context": "https://schema.org", "@type": "FAQPage", "inLanguage": "en",
    "mainEntity": [
      { "@type": "Question", "name": "Is this a fair comparison between Bitcoin and real estate?", "acceptedAnswer": { "@type": "Answer", "text": "The 'Same Cash Invested' mode provides the fairest comparison — it compares the same dollar amount going into BTC vs. the down payment on a property." }},
      { "@type": "Question", "name": "How does real estate leverage affect the comparison?", "acceptedAnswer": { "@type": "Answer", "text": "Real estate allows you to control a large asset with a small down payment. If the property appreciates, your equity grows faster than the appreciation rate because you earn on the full property value." }},
      { "@type": "Question", "name": "Does this calculator account for rental income?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. You can set an annual rental yield and vacancy rate. Net rental income is accumulated and added to the real estate net value." }},
      { "@type": "Question", "name": "What costs are included for real estate?", "acceptedAnswer": { "@type": "Answer", "text": "Mortgage interest, maintenance, insurance, property tax, and buying/selling closing costs are all included." }},
      { "@type": "Question", "name": "Why is Bitcoin more liquid than real estate?", "acceptedAnswer": { "@type": "Answer", "text": "Bitcoin can be sold 24/7 on global exchanges in minutes. Real estate typically takes 30–90 days and involves 3–6% closing costs." }},
      { "@type": "Question", "name": "What BTC growth rate should I use?", "acceptedAnswer": { "@type": "Answer", "text": "Bitcoin's historical CAGR is approximately 50–80%, but conservative long-term estimates use 20–40% as the market matures." }}
    ]
  };
  const faqSchemaTr = {
    "@context": "https://schema.org", "@type": "FAQPage", "inLanguage": "tr",
    "mainEntity": [
      { "@type": "Question", "name": "Bitcoin ile gayrimenkul karşılaştırması adil mi?", "acceptedAnswer": { "@type": "Answer", "text": "'Aynı Nakit Yatırımı' modu en adil karşılaştırmayı sunar — aynı dolar tutarının BTC'ye gitmesi ile mülk için ödenen peşinat karşılaştırılır." }},
      { "@type": "Question", "name": "Gayrimenkulde kaldıraç karşılaştırmayı nasıl etkiler?", "acceptedAnswer": { "@type": "Answer", "text": "Gayrimenkul, küçük bir peşinatla büyük bir varlığı kontrol etmenizi sağlar. Mülk değerlenirse, mülkün tam değeri üzerinden kazandığınız için öz sermayeniz değerlenme oranından daha hızlı büyür." }},
      { "@type": "Question", "name": "Bu hesaplayıcı kira gelirini hesaba katıyor mu?", "acceptedAnswer": { "@type": "Answer", "text": "Evet. Yıllık kira getirisini ve boşluk oranını girebilirsiniz. Net kira geliri birikir ve gayrimenkul net değerine eklenir." }},
      { "@type": "Question", "name": "Gayrimenkul için hangi maliyetler dâhildir?", "acceptedAnswer": { "@type": "Answer", "text": "Mortgage faizi, bakım, sigorta, emlak vergisi ile alım/satım kapanış masraflarının tamamı dâhildir." }},
      { "@type": "Question", "name": "Bitcoin neden gayrimenkulden daha likittir?", "acceptedAnswer": { "@type": "Answer", "text": "Bitcoin global borsalarda 7/24 dakikalar içinde satılabilir. Gayrimenkul satışı genellikle 30–90 gün sürer ve %3–6 kapanış masrafları içerir." }},
      { "@type": "Question", "name": "Hangi BTC büyüme oranını kullanmalıyım?", "acceptedAnswer": { "@type": "Answer", "text": "Bitcoin'in tarihsel yıllık bileşik büyüme oranı yaklaşık %50–80'dir; ancak piyasa olgunlaştıkça muhafazakâr uzun vadeli tahminler %20–40 kullanmaktadır." }}
    ]
  };

  const webAppSchema = useLocalizedSchema(webAppSchemaEn, webAppSchemaTr);
  const howToSchema = useLocalizedSchema(howToSchemaEn, howToSchemaTr);
  const faqSchema = useLocalizedSchema(faqSchemaEn, faqSchemaTr);

  return (
    <>
      <Helmet>
        <title>{t('re.meta.title')}</title>
        <meta name="description" content={t('re.meta.description')} />
        <link rel="canonical" href={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-gayrimenkul':'https://bitcoincalculator.tools/calculators/btc-vs-real-estate'} />

        <link rel="alternate" hrefLang="en" href="https://bitcoincalculator.tools/calculators/btc-vs-real-estate" />
        <link rel="alternate" hrefLang="tr" href="https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-gayrimenkul" />
        <link rel="alternate" hrefLang="x-default" href="https://bitcoincalculator.tools/calculators/btc-vs-real-estate" />
        <meta property="og:title" content={t('re.meta.ogTitle')} />
        <meta property="og:description" content={t('re.meta.ogDescription')} />
        <meta property="og:url" content={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-gayrimenkul':'https://bitcoincalculator.tools/calculators/btc-vs-real-estate'} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="bitcoincalculator.tools" />
        <meta property="og:locale" content={language==='tr'?'tr_TR':'en_US'} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('re.meta.twitterTitle')} />
        <meta name="twitter:description" content={t('re.meta.twitterDescription')} />
        <meta name="twitter:creator" content="@web3believers" />

        <meta name="twitter:site" content="@web3believers" />
        <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
        <HelmetOgImage slug="btc-vs-real-estate-calculator" enAlt={`Bitcoin vs Real Estate Calculator | bitcoincalculator.tools`} />

      <BreadcrumbSchema language={language}
        items={[
          { name: "Home", url: "https://bitcoincalculator.tools/" },
          { name: "Calculators", url: "https://bitcoincalculator.tools/calculators" },
          { name: "BTC vs Real Estate", url: "https://bitcoincalculator.tools/calculators/btc-vs-real-estate" },
        ]}
      />

      <PageBackground variant="clean">
        <Header />

        <main id="main-content" className="pt-20 relative z-10">
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb items={[{ label: t('re.crumb.calculators'), href: language==='tr'?'/tr/hesaplayicilar':'/calculators' }, { label: t('re.crumb.current') }]} />
          </div>

          <section className="container mx-auto px-6 py-16 text-center">
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/10">
                <Home className="w-4 h-4" />
                {t('re.hero.badge')}
              </div>
              <h1 className="text-h1 font-bold text-foreground">
                <>{t('re.hero.titlePrefix')}<span className="text-gradient-premium">{t('re.hero.titleMiddle')}</span>{t('re.hero.titleSuffix')}</>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('re.hero.subtitle')}
              </p>
              <div className="max-w-sm mx-auto">
                <CompactLiveBitcoinPrice currency="USD" />
              </div>
            </div>
          </section>

          <section className="container mx-auto px-6 pb-20">
            <div className="max-w-6xl mx-auto space-y-8">
              <ErrorBoundary>
                <BtcVsRealEstateInputPanel
                  inputs={inputs}
                  onChange={setInputs}
                  onCalculate={handleCalculate}
                  onReset={handleReset}
                />
              </ErrorBoundary>

              {result && (
                <ErrorBoundary>
                  <LazyBtcVsRealEstateChart data={result.yearlyBreakdown} />
                  <BtcVsRealEstateResultsPanel result={result} />
                  <Card className="border-border/30">
                    <CardContent className="p-0 overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/40 text-muted-foreground">
                          <tr>
                            <th className="text-left p-4 font-medium">{t('re.table.asset')}</th>
                            <th className="text-right p-4 font-medium">{t('re.table.finalValue')}</th>
                            <th className="text-right p-4 font-medium">ROI</th>
                            <th className="text-left p-4 font-medium">{t('re.table.taxNote')}</th>
                            <th className="text-left p-4 font-medium">{t('re.table.liquidity')}</th>
                            <th className="text-left p-4 font-medium">{t('re.table.effort')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-t border-border/30">
                            <td className="p-4 font-semibold text-foreground">Bitcoin</td>
                            <td className="p-4 text-right font-mono">{formatCurrency(result.btcFinalValue)}</td>
                            <td className="p-4 text-right font-mono">{result.btcROI.toFixed(1)}%</td>
                            <td className="p-4 text-muted-foreground">{t('re.table.btcTax')}</td>
                            <td className="p-4 text-muted-foreground">{t('re.table.btcLiquidity')}</td>
                            <td className="p-4 text-muted-foreground">{t('re.table.btcEffort')}</td>
                          </tr>
                          <tr className="border-t border-border/30">
                            <td className="p-4 font-semibold text-foreground">{t('re.table.reLabel')}</td>
                            <td className="p-4 text-right font-mono">{formatCurrency(result.reFinalNetValue)}</td>
                            <td className="p-4 text-right font-mono">{result.reROI.toFixed(1)}%</td>
                            <td className="p-4 text-muted-foreground">{t('re.table.reTax')}</td>
                            <td className="p-4 text-muted-foreground">{t('re.table.reLiquidity')}</td>
                            <td className="p-4 text-muted-foreground">{t('re.table.reEffort')}</td>
                          </tr>
                        </tbody>
                      </table>
                    </CardContent>
                  </Card>
                </ErrorBoundary>
              )}
            </div>
          </section>

          <section className="container mx-auto px-6 pb-16">
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-morphism-card border-border/20">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-primary">
                    <Landmark className="w-5 h-5" />
                    <h2 id="bitcoin-vs-real-estate-10-year-example" className="text-xl font-semibold text-foreground">{t('re.example.title')}</h2>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('re.example.p1')}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('re.example.p2')}
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-morphism-card border-border/20">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-primary">
                    <Scale className="w-5 h-5" />
                    <h2 id="bitcoin-vs-real-estate-tax-and-leverage" className="text-xl font-semibold text-foreground">{t('re.tax.title')}</h2>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('re.tax.p1')}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('re.tax.p2')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <BtcVsRealEstateHowToUse />
          <PreFAQPlacement slug="btc-vs-real-estate" />
          <BtcVsRealEstateFAQSection />
          <section className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <QuickShareLinkPanel slug="btc-vs-real-estate" headline={language === 'tr' ? 'BTC vs Gayrimenkul Hesaplayıcı' : 'BTC vs Real Estate Calculator'} />
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
                      <h3 className="font-semibold text-foreground mb-2">{t('re.dis.title')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('re.dis.body')}
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

export default BtcVsRealEstateCalculator;
