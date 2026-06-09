import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AffiliatePlacement } from "@/components/affiliateAI/AffiliatePlacement";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { PageBackground } from "@/components/modern/PageBackground";
import { CAGRInputPanel } from "@/components/cagr/CAGRInputPanel";
import { CAGRResultsPanel } from "@/components/cagr/CAGRResultsPanel";
import { CAGRChart } from "@/components/cagr/CAGRChart";
import { CAGRHistoricalChart } from "@/components/cagr/CAGRHistoricalChart";
import { CAGRHistoricalDashboard } from "@/components/cagr/CAGRHistoricalDashboard";
import { CAGRAssetComparisonTab } from "@/components/cagr/CAGRAssetComparisonTab";
import { CAGRContentSections } from "@/components/cagr/CAGRContentSections";
import { CAGRShareSnapshot } from "@/components/cagr/CAGRShareSnapshot";
import { CAGRHowToUse } from "@/components/cagr/CAGRHowToUse";
import { CAGRFAQSection, cagrFaqJsonLd, cagrFaqJsonLdTr } from "@/components/cagr/CAGRFAQSection";
import { ReverseCAGRPanel } from "@/components/cagr/ReverseCAGRPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExportReportButton } from "@/components/ExportReportButton";
import { CompactLiveBitcoinPrice } from "@/components/CompactLiveBitcoinPrice";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import RelatedCalculators from "@/components/RelatedCalculators";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useCallback } from "react";
import { projectInvestment, type CAGRResult } from "@/services/cagrCalculator";
import { AlertTriangle, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

import { HelmetOgImage } from "@/components/seo/HelmetOgImage";
const BitcoinCAGRCalculator = () => {
  const { language, t } = useLanguage();
  const [result, setResult] = useState<CAGRResult | null>(null);
  const [selectedAssets, setSelectedAssets] = useState<string[]>(['BTC', 'GLD', 'SPY', 'VNQ']);

  const handleCalculate = useCallback((amount: number, years: number, assets: string[]) => {
    setSelectedAssets(assets);
    const r = projectInvestment({
      investmentAmount: amount,
      years,
      includeAssets: assets,
    });
    setResult(r);
  }, []);

  return (
    <>
      <Helmet>
        <title>{language==='tr'?'Bitcoin YBBO Hesaplayıcısı':'Bitcoin CAGR Calculator'}</title>
        <meta name="description" content={language==='tr'?'Bitcoin\'in yıllık bileşik büyüme oranını Altın, S&P 500 ve Gayrimenkul ile karşılaştırın. Gerçek 10 yıllık veriler ve interaktif projeksiyonlar.':'Compare Bitcoin\'s compound annual growth rate vs Gold, S&P 500, and Real Estate. Real 10-year historical data with interactive projections.'} />
        <meta name="keywords" content="bitcoin cagr, bitcoin cagr calculator, bitcoin compound annual growth rate, bitcoin vs gold, bitcoin vs sp500" />
        <link rel="canonical" href={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-yillik-buyume':'https://bitcoincalculator.tools/calculators/cagr'} />

        <link rel="alternate" hrefLang="tr" href="https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-yillik-buyume" />
        <link rel="alternate" hrefLang="en" href="https://bitcoincalculator.tools/calculators/cagr" />
        <link rel="alternate" hrefLang="x-default" href="https://bitcoincalculator.tools/calculators/cagr" />
        <meta property="og:title" content={language==='tr'?'Bitcoin YBBO Hesaplayıcısı — Yıllık Bileşik Büyüme':'Bitcoin CAGR Calculator'} />
        <meta property="og:description" content={language==='tr'?'Bitcoin\'in yıllık bileşik büyüme oranını Altın, S&P 500 ve Gayrimenkul ile karşılaştırın. 10 yıllık gerçek veriler.':'Compare Bitcoin\'s compound annual growth rate vs Gold, S&P 500, and Real Estate. Real 10-year historical data with interactive projections.'} />
        <meta property="og:url" content={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-yillik-buyume':'https://bitcoincalculator.tools/calculators/cagr'} />
        <meta property="og:type" content="website" />
        <HelmetOgImage slug="bitcoin-cagr-calculator" enAlt={`Bitcoin CAGR Calculator | bitcoincalculator.tools`} />
        <meta property="og:site_name" content="bitcoincalculator.tools" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={language==='tr'?'Bitcoin YBBO Hesaplayıcısı — Yıllık Bileşik Büyüme':'Bitcoin CAGR Calculator'} />
        <meta name="twitter:description" content={language==='tr'?'Bitcoin\'in yıllık bileşik büyüme oranını geleneksel varlıklarla karşılaştırın. Gerçek tarihsel veriler.':'Compare Bitcoin\'s compound annual growth rate against traditional assets with real historical data.'} />
        <meta name="twitter:creator" content="@web3believers" />

        <meta name="twitter:site" content="@web3believers" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Bitcoin CAGR Calculator",
            "description": "Compare Bitcoin's compound annual growth rate against Gold, S&P 500, and Real Estate using verified 10-year historical data (2016–2026).",
            "url": "https://bitcoincalculator.tools/calculators/cagr",
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
            "name": "How to Use the Bitcoin CAGR Calculator",
            "description": "Step-by-step guide to comparing Bitcoin's growth rate against traditional assets",
            "totalTime": "PT2M",
            "step": [
              { "@type": "HowToStep", "name": "Set Your Investment", "text": "Enter your investment amount and select the projection period (1–20 years)", "url": "https://bitcoincalculator.tools/calculators/cagr#step1" },
              { "@type": "HowToStep", "name": "Choose Assets", "text": "Select which assets to compare: Bitcoin, Gold, S&P 500, and Real Estate", "url": "https://bitcoincalculator.tools/calculators/cagr#step2" },
              { "@type": "HowToStep", "name": "Review Projections", "text": "See CAGR, projected values, volatility, and max drawdown for each asset", "url": "https://bitcoincalculator.tools/calculators/cagr#step3" },
              { "@type": "HowToStep", "name": "Export Report", "text": "Download a PNG or PDF report of your CAGR comparison analysis", "url": "https://bitcoincalculator.tools/calculators/cagr#step4" }
            ]
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "inLanguage": "en",
            "mainEntity": cagrFaqJsonLd.map((f) => ({
              "@type": "Question",
              "name": f.q,
              "acceptedAnswer": { "@type": "Answer", "text": f.a }
            }))
          })}
        </script>

        {language === 'tr' && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "inLanguage": "tr",
              "mainEntity": cagrFaqJsonLdTr.map((f) => ({
                "@type": "Question",
                "name": f.q,
                "acceptedAnswer": { "@type": "Answer", "text": f.a }
              }))
            })}
          </script>
        )}

      </Helmet>

      <BreadcrumbSchema language={language}
        items={[
          { name: "Home", url: "https://bitcoincalculator.tools/" },
          { name: "Calculators", url: "https://bitcoincalculator.tools/calculators" },
          { name: "CAGR Calculator", url: "https://bitcoincalculator.tools/calculators/cagr" }
        ]}
      />

      <PageBackground variant="clean">
        <Header />

        <main id="main-content" className="pt-20 relative z-10">
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb
              items={[
                { label: language==='tr'?'Hesaplayıcılar':'Calculators', href: language==='tr'?'/tr/hesaplayicilar':'/calculators' },
                { label: language==='tr'?'YBBO Hesaplayıcısı':'CAGR Calculator' }
              ]}
            />
          </div>

          {/* Header */}
          <section className="container mx-auto px-6 py-16 text-center">
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/10">
                <TrendingUp className="w-4 h-4" />
                {language==='tr'?'Yıllık Bileşik Büyüme Oranı':'Compound Annual Growth Rate'}
              </div>

              <h1 className="text-h1 font-bold text-foreground">
                {language==='tr'?<>Bitcoin <span className="text-gradient-premium">YBBO Hesaplayıcısı</span></>:<>Bitcoin <span className="text-gradient-premium">CAGR Calculator</span></>}
              </h1>

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {language==='tr'?'Herhangi bir dönem üzerindeki yıllık bileşik büyümeyi ölçmek için Bitcoin YBBO hesaplayıcısını kullanın, ardından gerçek 10 yıllık tarihsel verilerle (2016–2026) Altın, S&P 500 ve Gayrimenkul ile karşılaştırın.':'Use the Bitcoin CAGR calculator to measure compound annual growth over any period, then compare it against Gold, S&P 500, and Real Estate using real 10-year historical data (2016–2026).'}
              </p>

              <div className="max-w-sm mx-auto">
                <CompactLiveBitcoinPrice currency="USD" />
              </div>
            </div>
          </section>

          {/* Calculator */}
          <section className="container mx-auto px-6 pb-20">
            <div className="max-w-6xl mx-auto space-y-12">
              <OfflineIndicator />

              <Tabs defaultValue="cagr" className="w-full">
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
                  <TabsTrigger value="cagr">{language==='tr'?'YBBO Hesaplayıcısı':'CAGR Calculator'}</TabsTrigger>
                  <TabsTrigger value="reverse">{language==='tr'?'Ters YBBO':'Reverse CAGR'}</TabsTrigger>
                </TabsList>

                <TabsContent value="cagr">
                  <div className="space-y-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <CAGRInputPanel onCalculate={handleCalculate} />
                      </div>
                      <div>
                        <ErrorBoundary>
                          {result ? (
                            <CAGRResultsPanel result={result} />
                          ) : (
                            <Card className="glass-morphism-card border-border/20 shadow-sm">
                              <CardContent className="p-8 text-center">
                                <div className="space-y-4">
                                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                                    <TrendingUp className="w-6 h-6 text-primary" />
                                  </div>
                                  <div className="space-y-1">
                                    <h3 className="text-lg font-semibold text-foreground">{language==='tr'?'Karşılaştırmaya Hazır':'Ready to Compare'}</h3>
                                    <p className="text-sm text-muted-foreground">{language==='tr'?'Parametrelerinizi belirleyin ve Hesapla\'ya tıklayın':'Set your parameters and click Calculate'}</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </ErrorBoundary>
                      </div>
                    </div>

                    {/* Share Snapshot */}
                    {result && (
                      <ErrorBoundary>
                        <CAGRShareSnapshot result={result} />
                      </ErrorBoundary>
                    )}

                    {/* Projection Chart */}
                    {result && (
                      <div className="animate-fade-in">
                        <CAGRChart result={result} />
                      </div>
                    )}

                    {/* Asset Comparison Tab — BTC vs S&P 500 / Gold / Real Estate / Nasdaq */}
                    <div className="animate-fade-in">
                      <ErrorBoundary>
                        <CAGRAssetComparisonTab />
                      </ErrorBoundary>
                    </div>

                    {/* Historical CAGR Dashboard — 1Y/2Y/3Y/5Y/10Y/since-inception */}
                    <div className="animate-fade-in">
                      <ErrorBoundary>
                        <CAGRHistoricalDashboard />
                      </ErrorBoundary>
                    </div>

                    {/* Historical Chart */}
                    <div className="animate-fade-in">
                      <CAGRHistoricalChart selectedAssets={selectedAssets} />
                    </div>

                    {/* Export */}
                    {result && (
                      <ExportReportButton
                        result={{
                          investmentAmount: result.investmentAmount,
                          currentValue: result.projectedValues[0]?.finalValue || 0,
                          profitLoss: result.projectedValues[0]?.totalGain || 0,
                          roiPercentage: 0,
                          currency: 'USD',
                          startDate: new Date().toISOString(),
                          startPrice: 0,
                          currentPrice: 0,
                          btcAmount: 0,
                          priceData: []
                        }}
                      />
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="reverse">
                  <ReverseCAGRPanel />
                </TabsContent>
              </Tabs>
            </div>
          </section>

          {/* SEO H2 Section */}
          <section className="container mx-auto px-6 pb-12">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-h2 font-bold text-foreground mb-4">
                {language==='tr'?'Ters YBBO Hesaplayıcısı — İhtiyacınız Olan Büyüme Oranını Bulun':'Reverse CAGR Calculator — Find the Growth Rate You Need'}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {language==='tr'?'Ters YBBO hesaplayıcısı, Bitcoin fiyat hedefinden geriye doğru çalışır. Belirli bir büyüme oranının ne getiri ürettiğini sormak yerine şunu sorar: Bitcoin\'in seçtiğiniz tarihe kadar hedef fiyatınıza ulaşması için hangi yıllık büyüme oranına ihtiyacı var? Gerekli yıllık bileşik büyüme oranını anında görmek için bugünün fiyatını, hedef fiyatınızı ve zaman ufkunuzu girin.':'The reverse CAGR calculator works backwards from a Bitcoin price target. Instead of asking what return a given growth rate produces, it asks: what annual growth rate does Bitcoin need to reach your target price by your chosen date? Enter today\'s price, your target price, and your time horizon to instantly see the required compound annual growth rate.'}
              </p>
            </div>
          </section>

          <CAGRHowToUse />
          <CAGRContentSections />
          <CAGRFAQSection />
          <div className="container mx-auto px-6 max-w-5xl"><AffiliatePlacement slug="cagr" /></div>
          <RelatedCalculators />

          {/* Disclaimer */}
          <section className="container mx-auto px-6 pb-16">
            <div className="max-w-3xl mx-auto">
              <Card className="glass-morphism-card border-border/20 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{language==='tr'?'Sorumluluk Reddi':'Disclaimer'}</h3>
                      <p className="text-sm text-muted-foreground">
                        {language==='tr'?'YBBO projeksiyonları 2016–2026 tarihsel verilerine dayanmaktadır ve gelecekteki performansı garanti etmez. Bitcoin değişkendir ve geçmiş getiriler tekrarlanmayabilir. Bu finansal tavsiye değildir — her zaman kendi araştırmanızı yapın.':'CAGR projections are based on historical data from 2016–2026 and do not guarantee future performance. Bitcoin is volatile and past returns may not repeat. This is not financial advice — always do your own research.'}
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

export default BitcoinCAGRCalculator;
