import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AffiliatePlacement } from "@/components/affiliateAI/AffiliatePlacement";
import { useSafeLanguage } from "@/hooks/useSafeLanguage";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { PageBackground } from "@/components/modern/PageBackground";
import { CompactLiveBitcoinPrice } from "@/components/CompactLiveBitcoinPrice";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import RelatedCalculators from "@/components/RelatedCalculators";
import { Card, CardContent } from "@/components/ui/card";
import { DominanceMetricCards } from "@/components/dominance/DominanceMetricCards";
import { DominanceScenarioModeler } from "@/components/dominance/DominanceScenarioModeler";
import { DominanceHistoryChart } from "@/components/dominance/DominanceHistoryChart";
import { DominanceHowToUse } from "@/components/dominance/DominanceHowToUse";
import { DominanceFAQSection } from "@/components/dominance/DominanceFAQSection";
import { useQuery } from "@tanstack/react-query";
import { fetchDominanceData } from "@/services/dominanceService";
import { AlertTriangle, Crown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { buildCalculatorSpeakable } from '@/components/seo/calculatorSpeakable';

import { HelmetOgImage } from "@/components/seo/HelmetOgImage";
import { PreFAQPlacement } from "@/components/placement/PreFAQPlacement";
const BitcoinDominanceCalculator = () => {
  const { language, t } = useLanguage();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["bitcoin-dominance"],
    queryFn: fetchDominanceData,
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  const canonicalUrl = language === 'tr'
    ? 'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-dominansi'
    : 'https://bitcoincalculator.tools/calculators/dominance';

  return (
    <>
      <Helmet>
        <title>{t('dominance.meta.title')}</title>
        <meta name="description" content={t('dominance.meta.description')} />
        <link rel="canonical" href={canonicalUrl} />

        <link rel="alternate" hrefLang="tr" href="https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-dominansi" />
        <link rel="alternate" hrefLang="en" href="https://bitcoincalculator.tools/calculators/dominance" />
        <link rel="alternate" hrefLang="x-default" href="https://bitcoincalculator.tools/calculators/dominance" />
        <meta property="og:title" content={t('dominance.meta.title')} />
        <meta property="og:description" content={t('dominance.meta.ogDescription')} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="bitcoincalculator.tools" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('dominance.meta.title')} />
        <meta name="twitter:description" content={t('dominance.meta.twitterDescription')} />
        <meta name="twitter:creator" content="@web3believers" />

        <meta name="twitter:site" content="@web3believers" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Bitcoin Dominance Calculator",
            "description": "Live Bitcoin dominance percentage with a price scenario modeler. See what BTC price would be if dominance hit 60%, 70% or 80%. Historical data since 2013.",
            "url": "https://bitcoincalculator.tools/calculators/dominance",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Any",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
            "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools" },
            "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" }
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Use the Bitcoin Dominance Calculator",
            "description": "Step-by-step guide to using the BTC dominance and price scenario tool",
            "totalTime": "PT2M",
            "step": [
              { "@type": "HowToStep", "name": "View Live Dominance", "text": "See current BTC dominance, market cap, and total crypto market", "url": "https://bitcoincalculator.tools/calculators/dominance#step1" },
              { "@type": "HowToStep", "name": "Model Scenarios", "text": "Adjust total market cap and dominance sliders to see implied BTC price", "url": "https://bitcoincalculator.tools/calculators/dominance#step2" },
              { "@type": "HowToStep", "name": "Study History", "text": "Review how BTC dominance has shifted since 2020", "url": "https://bitcoincalculator.tools/calculators/dominance#step3" },
              { "@type": "HowToStep", "name": "Inform Allocation", "text": "Use dominance insights for portfolio allocation decisions", "url": "https://bitcoincalculator.tools/calculators/dominance#step4" }
            ]
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "inLanguage": language==='tr' ? 'tr' : 'en',
            "mainEntity": (language==='tr' ? [
              { "@type": "Question", "name": "Bitcoin hâkimiyeti nedir?", "acceptedAnswer": { "@type": "Answer", "text": "BTC hâkimiyeti, Bitcoin'in piyasa değerinin toplam kripto piyasa değerine oranıdır." }},
              { "@type": "Question", "name": "BTC hâkimiyeti neden önemli?", "acceptedAnswer": { "@type": "Answer", "text": "Yükselen hâkimiyet = sermayenin BTC'ye akması. Düşen hâkimiyet = altcoin sezonu. Portföy rotasyonu için kritik bir göstergedir." }},
              { "@type": "Question", "name": "Hâkimiyeti neler değiştirir?", "acceptedAnswer": { "@type": "Answer", "text": "BTC ile altcoinler arasındaki sermaye rotasyonu. Riskten kaçınma hareketleri hâkimiyeti artırır; spekülatif dönemler azaltır." }},
              { "@type": "Question", "name": "Senaryo modelleyici nasıl çalışır?", "acceptedAnswer": { "@type": "Answer", "text": "Zımni BTC Fiyatı = (Toplam Piyasa Değeri × Hâkimiyet %) ÷ Dolaşımdaki Arz." }},
              { "@type": "Question", "name": "Yüksek mi düşük hâkimiyet mi daha iyi?", "acceptedAnswer": { "@type": "Answer", "text": "Doğası gereği hiçbiri. Yüksek = BTC tercih ediliyor. Düşük = büyüyen ekosistem veya spekülatif altcoin enflasyonu." }}
            ] : [
              { "@type": "Question", "name": "What is Bitcoin dominance?", "acceptedAnswer": { "@type": "Answer", "text": "BTC dominance is the percentage of Bitcoin's market cap relative to total crypto market cap." }},
              { "@type": "Question", "name": "Why does BTC dominance matter?", "acceptedAnswer": { "@type": "Answer", "text": "Rising dominance = capital flowing to BTC. Falling dominance = alt season. Key for portfolio rotation." }},
              { "@type": "Question", "name": "What causes dominance to change?", "acceptedAnswer": { "@type": "Answer", "text": "Capital rotation between BTC and altcoins. Risk-off moves increase dominance; speculative periods decrease it." }},
              { "@type": "Question", "name": "How does the scenario modeler work?", "acceptedAnswer": { "@type": "Answer", "text": "Implied BTC Price = (Total Market Cap × Dominance %) ÷ Circulating Supply." }},
              { "@type": "Question", "name": "Is high or low dominance better?", "acceptedAnswer": { "@type": "Answer", "text": "Neither inherently. High = BTC preferred. Low = growing ecosystem or speculative altcoin inflation." }}
            ]).map(f => ({ "@type": "Question", "name": f.name, "acceptedAnswer": f.acceptedAnswer }))
          })}
        </script>

              <script type="application/ld+json">{JSON.stringify(buildCalculatorSpeakable(canonicalUrl, language))}</script>
      </Helmet>
        <HelmetOgImage slug="bitcoin-dominance-calculator" enAlt={`Bitcoin Dominance Calculator | bitcoincalculator.tools`} />

      <BreadcrumbSchema language={language}
        items={[
          { name: "Home", url: "https://bitcoincalculator.tools/" },
          { name: "Calculators", url: "https://bitcoincalculator.tools/calculators" },
          { name: "Dominance Calculator", url: "https://bitcoincalculator.tools/calculators/dominance" },
        ]}
      />

      <PageBackground variant="clean">
        <Header />

        <main id="main-content" className="pt-20 relative z-10">
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb items={[{ label: t('dominance.crumb.calculators'), href: language==='tr'?'/tr/hesaplayicilar':'/calculators' }, { label: t('dominance.crumb.current') }]} />
          </div>

          <section className="container mx-auto px-6 py-16 text-center">
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/10">
                <Crown className="w-4 h-4" />
                {t('dominance.hero.badge')}
              </div>
              <h1 className="text-h1 font-bold text-foreground">
                {t('dominance.hero.titlePrefix')} <span className="text-gradient-premium">{t('dominance.hero.titleMiddle')}</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('dominance.hero.description')}
              </p>
              <div className="max-w-sm mx-auto">
                <CompactLiveBitcoinPrice currency="USD" />
              </div>
            </div>
          </section>

          <section className="container mx-auto px-6 pb-20">
            <div className="max-w-6xl mx-auto space-y-10">
              <OfflineIndicator />

              {isError && (
                <div className="flex items-center gap-3 bg-warning/$3 border border-warning/20 rounded-xl p-4">
                  <AlertTriangle className="w-4 h-4 text-warning shrink-0" />
                  <p className="text-sm text-warning">{t('dominance.errorFetch')}</p>
                </div>
              )}

              <ErrorBoundary>
                <DominanceMetricCards data={data} loading={isLoading} />
              </ErrorBoundary>

              {data && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ErrorBoundary>
                    <DominanceScenarioModeler
                      circulatingSupply={data.circulatingSupply}
                      currentDominance={data.btcDominance}
                    />
                  </ErrorBoundary>
                  <ErrorBoundary>
                    <DominanceHistoryChart />
                  </ErrorBoundary>
                </div>
              )}

              {!data && !isLoading && (
                <ErrorBoundary>
                  <DominanceHistoryChart />
                </ErrorBoundary>
              )}
            </div>
          </section>

          <DominanceHowToUse />
          <PreFAQPlacement slug="dominance" />
          <DominanceFAQSection />
          <div className="container mx-auto px-6 max-w-5xl"><AffiliatePlacement lang={useSafeLanguage()} slug="dominance" /></div>
          <RelatedCalculators />

          <section className="container mx-auto px-6 pb-16">
            <div className="max-w-3xl mx-auto">
              <Card className="glass-morphism-card border-border/20 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{t('dominance.disclaimer.title')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('dominance.disclaimer.body')}
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

export default BitcoinDominanceCalculator;
