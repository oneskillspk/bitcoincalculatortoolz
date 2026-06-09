import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AffiliatePlacement } from "@/components/affiliateAI/AffiliatePlacement";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { PageBackground } from "@/components/modern/PageBackground";
import { CompactLiveBitcoinPrice } from "@/components/CompactLiveBitcoinPrice";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import RelatedCalculators from "@/components/RelatedCalculators";
import { Card, CardContent } from "@/components/ui/card";
import { CorrelationTimeSelector } from "@/components/correlation/CorrelationTimeSelector";
import { CorrelationMatrix } from "@/components/correlation/CorrelationMatrix";
import { RollingCorrelationChart } from "@/components/correlation/RollingCorrelationChart";
import { CorrelationScatterPlot } from "@/components/correlation/CorrelationScatterPlot";
import { CorrelationHowToUse } from "@/components/correlation/CorrelationHowToUse";
import { CorrelationFAQSection } from "@/components/correlation/CorrelationFAQSection";
import { useQuery } from "@tanstack/react-query";
import { fetchCorrelationData } from "@/services/correlationService";
import { AlertTriangle, GitCompare } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const BitcoinCorrelationCalculator = () => {
  const { language, t } = useLanguage();
  const [period, setPeriod] = useState("1y");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["bitcoin-correlation", period],
    queryFn: () => fetchCorrelationData(period),
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: 2,
  });

  return (
    <>
      <Helmet>
        <title>{t('corr.meta.title')}</title>
        <meta name="description" content={t('corr.meta.description')} />
        <meta name="keywords" content="bitcoin correlation, BTC correlation S&P 500, bitcoin gold correlation, crypto stock correlation, bitcoin portfolio diversification 2026" />
        <link rel="canonical" href={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-korelasyon':'https://bitcoincalculator.tools/calculators/correlation'} />

        <link rel="alternate" hrefLang="tr" href="https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-korelasyon" />
        <link rel="alternate" hrefLang="en" href="https://bitcoincalculator.tools/calculators/correlation" />
        <link rel="alternate" hrefLang="x-default" href="https://bitcoincalculator.tools/calculators/correlation" />
        <meta property="og:title" content={t('corr.meta.ogTitle')} />
        <meta property="og:description" content={t('corr.meta.ogDescription')} />
        <meta property="og:url" content={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-korelasyon':'https://bitcoincalculator.tools/calculators/correlation'} />
        <meta property="og:type" content="website" />
        <HelmetOgImage slug="bitcoin-correlation-calculator" enAlt={`Bitcoin Correlation Calculator | bitcoincalculator.tools`} />
        <meta property="og:site_name" content="bitcoincalculator.tools" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('corr.meta.twitterTitle')} />
        <meta name="twitter:description" content={t('corr.meta.twitterDescription')} />
        <meta name="twitter:creator" content="@web3believers" />

        <meta name="twitter:site" content="@web3believers" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Bitcoin Correlation Calculator",
            "description": "See how Bitcoin correlates with the S&P 500, Gold, Nasdaq, and US Dollar over 30d, 90d, 1y, and 3y. Interactive correlation matrix, rolling chart, and scatter plot. Free tool.",
            "url": "https://bitcoincalculator.tools/calculators/correlation",
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
            "name": "How to Use the Bitcoin Correlation Calculator",
            "description": "Step-by-step guide to analyzing Bitcoin's correlation with traditional assets",
            "totalTime": "PT2M",
            "step": [
              { "@type": "HowToStep", "name": "Choose a Time Period", "text": "Select 30d, 90d, 1y, or 3y to analyze correlations across different market cycles", "url": "https://bitcoincalculator.tools/calculators/correlation#step1" },
              { "@type": "HowToStep", "name": "Read the Correlation Matrix", "text": "View the heatmap of Pearson correlation coefficients between Bitcoin and traditional assets", "url": "https://bitcoincalculator.tools/calculators/correlation#step2" },
              { "@type": "HowToStep", "name": "Track Rolling Correlation", "text": "See how Bitcoin's correlation with each asset evolves over the selected period", "url": "https://bitcoincalculator.tools/calculators/correlation#step3" },
              { "@type": "HowToStep", "name": "Explore Scatter Plot", "text": "Visualize return clustering to assess diversification potential", "url": "https://bitcoincalculator.tools/calculators/correlation#step4" }
            ]
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "inLanguage": language==='tr' ? 'tr' : 'en',
            "mainEntity": (language==='tr' ? [
              { "@type": "Question", "name": "Yatırımda korelasyon ne demektir?", "acceptedAnswer": { "@type": "Answer", "text": "Korelasyon, iki varlığın birbirine göre nasıl hareket ettiğini ölçer. +1 katsayısı tamamen birlikte hareket ettiklerini, −1 zıt yönlerde hareket ettiklerini, 0 ise doğrusal bir ilişki olmadığını gösterir." }},
              { "@type": "Question", "name": "Bitcoin hisse senedi piyasasıyla korele midir?", "acceptedAnswer": { "@type": "Answer", "text": "Bitcoin'in hisselerle korelasyonu değişkendir. Riskten kaçınma dönemlerinde BTC, hisselerle yüksek korelasyona ulaşabilir. Daha sakin dönemlerde Bitcoin sıklıkla bağımsız işlem görür." }},
              { "@type": "Question", "name": "Bitcoin'in korelasyonu zamanla neden değişir?", "acceptedAnswer": { "@type": "Answer", "text": "Korelasyon; makro koşullara, kurumsal katılıma ve piyasa duyarlılığına göre kayar. Bitcoin, halving gibi kripto'ya özgü olaylar sırasında diğer piyasalardan ayrışabilir." }},
              { "@type": "Question", "name": "Bitcoin altın gibi enflasyona karşı iyi bir korunma aracı mıdır?", "acceptedAnswer": { "@type": "Answer", "text": "Bitcoin'in altınla korelasyonu tutarsızdır. Uzun vadede ikisi de parasal değer kaybından (debasement) yararlanır; ancak kısa vadeli korelasyon genellikle sıfıra yakındır." }},
              { "@type": "Question", "name": "Karşılaştırma verileri ne kadar doğru?", "acceptedAnswer": { "@type": "Answer", "text": "Bitcoin fiyatları CoinGecko'dan canlı olarak alınır. Geleneksel varlık verileri, günlüğe enterpole edilen yaklaşık aylık getirileri kullanır; yön bakımından doğru tahminler sunar." }}
            ] : [
              { "@type": "Question", "name": "What does correlation mean in investing?", "acceptedAnswer": { "@type": "Answer", "text": "Correlation measures how two assets move in relation to each other. A coefficient of +1 means they move perfectly together, −1 means opposite directions, and 0 means no linear relationship." }},
              { "@type": "Question", "name": "Is Bitcoin correlated with the stock market?", "acceptedAnswer": { "@type": "Answer", "text": "Bitcoin's correlation with stocks varies. During risk-off events, BTC can become highly correlated with equities. In calmer periods, Bitcoin often trades independently." }},
              { "@type": "Question", "name": "Why does Bitcoin's correlation change over time?", "acceptedAnswer": { "@type": "Answer", "text": "Correlation shifts based on macro conditions, institutional participation, and market sentiment. Bitcoin can decouple during crypto-specific events like halvings." }},
              { "@type": "Question", "name": "Is Bitcoin a good hedge against inflation like gold?", "acceptedAnswer": { "@type": "Answer", "text": "Bitcoin's correlation with gold is inconsistent. Over long periods both benefit from monetary debasement, but short-term correlation is often near zero." }},
              { "@type": "Question", "name": "How accurate is the benchmark data?", "acceptedAnswer": { "@type": "Answer", "text": "Bitcoin prices are live from CoinGecko. Traditional asset data uses approximate monthly returns interpolated to daily, providing directionally accurate estimates." }}
            ]).map(f => ({ "@type": "Question", "name": f.name, "acceptedAnswer": f.acceptedAnswer }))
          })}
        </script>
      </Helmet>

      <BreadcrumbSchema language={language}
        items={[
          { name: "Home", url: "https://bitcoincalculator.tools/" },
          { name: "Calculators", url: "https://bitcoincalculator.tools/calculators" },
          { name: "Correlation Calculator", url: "https://bitcoincalculator.tools/calculators/correlation" },
        ]}
      />

      <PageBackground variant="clean">
        <Header />

        <main id="main-content" className="pt-20 relative z-10">
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb items={[{ label: t('corr.crumb.calculators'), href: language==='tr'?'/tr/hesaplayicilar':'/calculators' }, { label: t('corr.crumb.current') }]} />
          </div>

          <section className="container mx-auto px-6 py-16 text-center">
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/10">
                <GitCompare className="w-4 h-4" />
                {t('corr.hero.badge')}
              </div>
              <h1 className="text-h1 font-bold text-foreground">
                {t('corr.hero.titlePrefix')} <span className="text-gradient-premium">{t('corr.hero.titleHighlight')}</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('corr.hero.description')}
              </p>
              <div className="max-w-sm mx-auto">
                <CompactLiveBitcoinPrice currency="USD" />
              </div>
            </div>
          </section>

          <section className="container mx-auto px-6 pb-20">
            <div className="max-w-6xl mx-auto space-y-8">
              <OfflineIndicator />

              <div className="flex justify-center">
                <CorrelationTimeSelector selected={period} onChange={setPeriod} />
              </div>

              {isError && (
                <div className="flex items-center gap-3 bg-warning/$3 border border-warning/20 rounded-xl p-4">
                  <AlertTriangle className="w-4 h-4 text-warning shrink-0" />
                  <p className="text-sm text-warning">{t('corr.error.fetch')}</p>
                </div>
              )}

              <ErrorBoundary>
                <CorrelationMatrix data={data?.matrix ?? []} loading={isLoading} />
              </ErrorBoundary>

              <ErrorBoundary>
                <RollingCorrelationChart data={data?.rolling ?? []} loading={isLoading} />
              </ErrorBoundary>

              <ErrorBoundary>
                <CorrelationScatterPlot
                  btcReturns={data?.btcReturns ?? []}
                  assetReturns={data?.assetReturns ?? {}}
                  loading={isLoading}
                />
              </ErrorBoundary>
            </div>
          </section>

          <CorrelationHowToUse />
          <CorrelationFAQSection />
          <div className="container mx-auto px-6 max-w-5xl"><AffiliatePlacement slug="correlation" /></div>
          <RelatedCalculators />

          <section className="container mx-auto px-6 pb-16">
            <div className="max-w-3xl mx-auto">
              <Card className="glass-morphism-card border-border/20 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{t('corr.disclaimer.title')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('corr.disclaimer.body')}
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

export default BitcoinCorrelationCalculator;
