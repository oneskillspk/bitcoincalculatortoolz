import { HelmetOgImage } from "@/components/seo/HelmetOgImage";
import { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Zap, Users, Radio, Wallet, TrendingUp, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useSafeLanguage } from "@/hooks/useSafeLanguage";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { PageBackground } from "@/components/modern/PageBackground";
import { CompactLiveBitcoinPrice } from "@/components/CompactLiveBitcoinPrice";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import RelatedCalculators from "@/components/RelatedCalculatorsLazy";

import { LightningInputPanel } from "@/components/lightning/LightningInputPanel";
import { LightningResultsPanel } from "@/components/lightning/LightningResultsPanel";
import { NetworkCapacityChart } from "@/components/lightning/NetworkCapacityChart";
import { FeeEconomicsVisualization } from "@/components/lightning/FeeEconomicsVisualization";
import { LightningFAQSection } from "@/components/lightning/LightningFAQSection";
import { LightningHowItWorksSection } from "@/components/lightning/LightningHowItWorksSection";
import { LightningExportReport } from "@/components/lightning/LightningExportReport";
import { RouteFinderVisualization } from "@/components/lightning/RouteFinderVisualization";

import { useSmartZones } from "@/hooks/useSmartZones";
import { PlacementProvider } from "@/contexts/PlacementProvider";

import {
  fetchLightningStats,
  fetchHistoricalStats,
  fetchOnChainFees,
  calculateLightningFee,
  calculateChannelEconomics,
  LightningNetworkStats,
  LightningFeeEstimate,
  ChannelEconomics,
  HistoricalNetworkData,
  FALLBACK_NETWORK_STATS,
  LIGHTNING_CONSTANTS,
} from "@/services/lightningFeeCalculator";
import { useLiveBitcoinPrice } from "@/hooks/useLiveBitcoinPrice";
import { useLanguage } from "@/contexts/LanguageContext";

import { PageQuickAnswer } from "@/components/calculator/PageQuickAnswer";

const LightningNetworkFeeCalculator = () => {
  const { language, t } = useLanguage();
  const lang = useSafeLanguage();

  

  // Bitcoin price
  const { price: btcPriceUsd, isLoading: priceLoading } = useLiveBitcoinPrice();
  
  // Network data state
  const [networkStats, setNetworkStats] = useState<LightningNetworkStats | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalNetworkData[]>([]);
  const [onChainFees, setOnChainFees] = useState<{ fastestFee: number; halfHourFee: number; economyFee: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Input state
  const [amountSats, setAmountSats] = useState(10000);
  const [amountUnit, setAmountUnit] = useState<'sats' | 'btc' | 'usd'>('sats');
  const [estimatedHops, setEstimatedHops] = useState(3);
  const [baseFeePerHop, setBaseFeePerHop] = useState(1000);
  const [feeRatePpm, setFeeRatePpm] = useState(100);
  const [channelSizeSats, setChannelSizeSats] = useState(0);

  const sz = useSmartZones({
    pageSlug: "lightning",
    hasResultSignal: amountSats > 0,
    lang,
    resultSignals: ["scalability", "real-time"],
  });

  // Fetch network data
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [stats, historical, fees] = await Promise.all([
        fetchLightningStats(),
        fetchHistoricalStats(),
        fetchOnChainFees(),
      ]);
      
      setNetworkStats(stats);
      setHistoricalData(historical);
      setOnChainFees(fees);
      setLastUpdated(new Date());
      
      if (baseFeePerHop === 1000 && stats.avgBaseFee) {
        setBaseFeePerHop(stats.avgBaseFee);
      }
      if (feeRatePpm === 100 && stats.avgFeeRate) {
        setFeeRatePpm(stats.avgFeeRate);
      }
    } catch (err) {
      console.error('Failed to fetch Lightning data:', err);
      setError('Failed to load network data. Using fallback values.');
      setNetworkStats(FALLBACK_NETWORK_STATS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  // Calculate fee estimate
  const feeEstimate: LightningFeeEstimate | null = useMemo(() => {
    if (amountSats <= 0) return null;
    return calculateLightningFee(
      { amountSats, estimatedHops, baseFeePerHop, feeRatePpm },
      btcPriceUsd || 100000,
      onChainFees || undefined
    );
  }, [amountSats, estimatedHops, baseFeePerHop, feeRatePpm, btcPriceUsd, onChainFees]);

  // Calculate channel economics
  const channelEconomics: ChannelEconomics | null = useMemo(() => {
    if (channelSizeSats <= 0) return null;
    return calculateChannelEconomics(channelSizeSats, feeRatePpm, baseFeePerHop, btcPriceUsd || 100000);
  }, [channelSizeSats, feeRatePpm, baseFeePerHop, btcPriceUsd]);

  const breadcrumbItems = [
    { name: "Home", url: "https://bitcoincalculator.tools/" },
    { name: "Calculators", url: "https://bitcoincalculator.tools/calculators" },
    { name: "Lightning Network Fees", url: "https://bitcoincalculator.tools/calculators/lightning" }
  ];

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Lightning Network Fee Calculator",
    "description": "Calculate Bitcoin Lightning Network routing fees before you send. See channel costs, compare routes, and understand why some payments cost fractions of a cent.",
    "url": "https://bitcoincalculator.tools/calculators/lightning",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
    "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" }
  };

  return (
    <PlacementProvider value={sz}>
      <Helmet>
        <title>{t('lightning.seo.title')}</title>
        <meta name="description" content={t('lightning.seo.description')} />
        <link rel="canonical" href={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-lightning-ucreti':'https://bitcoincalculator.tools/calculators/lightning'} />
        
        <link rel="alternate" hrefLang="tr" href="https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-lightning-ucreti" />
        <link rel="alternate" hrefLang="en" href="https://bitcoincalculator.tools/calculators/lightning" />
        <link rel="alternate" hrefLang="x-default" href="https://bitcoincalculator.tools/calculators/lightning" />
        <meta property="og:title" content={t('lightning.seo.title')} />
        <meta property="og:description" content={t('lightning.seo.ogDescription')} />
        <meta property="og:url" content={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-lightning-ucreti':'https://bitcoincalculator.tools/calculators/lightning'} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="bitcoincalculator.tools" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('lightning.seo.title')} />
        <meta name="twitter:description" content={t('lightning.seo.twitterDescription')} />
        <meta name="twitter:creator" content="@web3believers" />
        
        <meta name="twitter:site" content="@web3believers" />
        <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Estimate Lightning Network Fees",
            "description": "Calculate routing fees for Bitcoin payments on the Lightning Network.",
            "step": [
              { "@type": "HowToStep", "name": "Enter Payment Amount", "text": "Input the amount you want to send in satoshis or fiat equivalent." },
              { "@type": "HowToStep", "name": "Select Channel Parameters", "text": "Choose expected route length and fee rate to model different scenarios." },
              { "@type": "HowToStep", "name": "Compare to On-Chain Fees", "text": "See how Lightning fees compare to regular Bitcoin transaction fees for the same amount." }
            ]
          })}
        </script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "inLanguage": language==='tr' ? 'tr' : 'en',
          "mainEntity": (language==='tr' ? [
            { "@type": "Question", "name": "Lightning Network ücretleri nedir?", "acceptedAnswer": { "@type": "Answer", "text": "Lightning Network ücretleri, ödemeleri ödeme kanalları üzerinden yönlendirmek için alınan küçük ücretlerdir. İşlem başına sabit bir taban ücret ve ödeme tutarıyla orantılı bir ücret oranından oluşur. Toplam ücretler küçük ödemeler için genellikle bir kuruşun küçük bir kısmıdır." }},
            { "@type": "Question", "name": "Lightning, zincir üstü işlemlere göre ne kadar ucuz?", "acceptedAnswer": { "@type": "Answer", "text": "Lightning işlemleri tipik olarak zincir üstü Bitcoin işlemlerinden 100-1000 kat daha ucuzdur. Bir zincir üstü işlem ağ yoğunluğuna bağlı olarak 1-50 $ veya daha fazlasına mal olabilirken aynı tutardaki Lightning ödemesi genellikle 1 satoshiden az yönlendirme ücretiyle gerçekleşir." }},
            { "@type": "Question", "name": "Lightning ücretleri neden değişir?", "acceptedAnswer": { "@type": "Answer", "text": "Ücretler ödeme tutarına, rota uzunluğuna (atlama sayısı), kanal likiditesine ve ayrı düğüm ücret politikalarına bağlıdır. Daha çok atlamaya sahip uzun rotalar daha fazla ücret biriktirirken bol likiditeli iyi bağlantılı düğümler daha az ücret alma eğilimindedir." }},
            { "@type": "Question", "name": "Minimum Lightning ödemesi var mı?", "acceptedAnswer": { "@type": "Answer", "text": "Lightning Network 1 satoshi (en küçük Bitcoin birimi) kadar küçük ödemeleri işleyebilir. Bu durum onu, ana Bitcoin blok zincirinde uygulanması mantıksız olan mikro ödemeler, bahşişler ve kullandıkça öde hizmetleri için ideal kılar." }}
          ] : [
            { "@type": "Question", "name": "What are Lightning Network fees?", "acceptedAnswer": { "@type": "Answer", "text": "Lightning Network fees are small charges for routing payments through payment channels. They consist of a base fee (fixed per transaction) and a fee rate (proportional to payment amount). Total fees are typically fractions of a cent for small payments." }},
            { "@type": "Question", "name": "How much cheaper is Lightning vs on-chain?", "acceptedAnswer": { "@type": "Answer", "text": "Lightning transactions are typically 100-1000x cheaper than on-chain Bitcoin transactions. While an on-chain transaction might cost $1-50+ depending on network congestion, a Lightning payment of the same amount usually costs less than 1 satoshi in routing fees." }},
            { "@type": "Question", "name": "Why do Lightning fees vary?", "acceptedAnswer": { "@type": "Answer", "text": "Fees depend on payment amount, route length (number of hops), channel liquidity, and individual node fee policies. Longer routes with more hops accumulate more fees, while well-connected nodes with ample liquidity tend to charge less." }},
            { "@type": "Question", "name": "Is there a minimum Lightning payment?", "acceptedAnswer": { "@type": "Answer", "text": "The Lightning Network can handle payments as small as 1 satoshi (the smallest Bitcoin unit). This makes it ideal for micropayments, tipping, and pay-per-use services that would be impractical on the main Bitcoin blockchain." }}
          ]).map(f => ({ "@type": "Question", "name": f.name, "acceptedAnswer": f.acceptedAnswer }))
        })}</script>
      </Helmet>
        <HelmetOgImage slug="lightning-network-fee-calculator" enAlt={`Lightning Network Fee Calculator | bitcoincalculator.tools`} />

      <BreadcrumbSchema language={language} items={breadcrumbItems} />

      <PageBackground variant="clean">
        <Header />
        
        <main id="main-content" className="pt-20 relative z-10">
          {/* Breadcrumb Navigation */}
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb 
              items={[
                { label: t('nav.home'), href: language==='tr'?'/tr':'/' },
                { label: t('nav.calculators'), href: language==='tr'?'/tr/hesaplayicilar':'/calculators' },
                { label: t('lightning.breadcrumb.current') }
              ]} 
            />
          </div>

          {/* SlotA — pre-calculator spotlight */}
          <div className="container mx-auto px-6 max-w-5xl"><sz.SlotA /></div>

          {/* Hero Section */}
          <section className="container mx-auto px-6 py-16 text-center">
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Zap className="w-4 h-4" />
                {t('lightning.badge')}
              </div>

              <h1 className="text-h1 font-bold text-foreground">
                Lightning Network <span className="text-gradient-premium">{t('lightning.h1.highlight')}</span>{t('lightning.h1.post')}
              </h1>

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('lightning.subtitle')}
              </p>

              <CompactLiveBitcoinPrice currency="USD" />
            </div>
          </section>

          {/* Live Network Stats */}
          <section className="container mx-auto px-6 mb-8">
            <PageQuickAnswer
              en='Lightning moves Bitcoin off-chain, so fees are a tiny base amount plus a rate measured in parts per million of the payment. This calculator prices a Lightning payment, compares it with the same transfer on-chain, and shows the channel capacity your route needs.'
              tr='Lightning, Bitcoin’i zincir dışına taşır; bu nedenle ücretler küçük bir sabit tutar artı ödemenin milyonda biri cinsinden ölçülen bir orandan oluşur. Bu hesaplayıcı bir Lightning ödemesini fiyatlandırır, aynı transferi zincir üstüyle karşılaştırır ve rotanızın ihtiyaç duyduğu kanal kapasitesini gösterir.'
            />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">{t('lightning.stats.totalNodes')}</span>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">
                    {isLoading ? '...' : (networkStats?.nodeCount.toLocaleString() || '-')}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Radio className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">{t('lightning.stats.channels')}</span>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">
                    {isLoading ? '...' : (networkStats?.channelCount.toLocaleString() || '-')}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Wallet className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">{t('lightning.stats.capacity')}</span>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">
                    {isLoading ? '...' : (
                      networkStats 
                        ? `${(networkStats.totalCapacitySats / 100_000_000).toFixed(0)} BTC`
                        : '-'
                    )}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">{t('lightning.stats.avgFeeRate')}</span>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">
                    {isLoading ? '...' : `${networkStats?.avgFeeRate || '-'} ppm`}
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground max-w-4xl mx-auto">
              <span>
                {lastUpdated ? `${t('lightning.updated')}: ${lastUpdated.toLocaleTimeString(language==='tr'?'tr-TR':'en-US')}` : t('lightning.loading')}
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={fetchData}
                disabled={isLoading}
                className="h-7 text-xs"
              >
                <RefreshCw className={`w-3 h-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </section>

          {/* Error Alert */}
          {error && (
            <section className="container mx-auto px-6 mb-6">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </section>
          )}

          {/* Calculator Section */}
          <section className="container mx-auto px-6 pb-20">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                <div>
                  <LightningInputPanel
                    amountSats={amountSats}
                    setAmountSats={setAmountSats}
                    amountUnit={amountUnit}
                    setAmountUnit={setAmountUnit}
                    estimatedHops={estimatedHops}
                    setEstimatedHops={setEstimatedHops}
                    baseFeePerHop={baseFeePerHop}
                    setBaseFeePerHop={setBaseFeePerHop}
                    feeRatePpm={feeRatePpm}
                    setFeeRatePpm={setFeeRatePpm}
                    channelSizeSats={channelSizeSats}
                    setChannelSizeSats={setChannelSizeSats}
                    networkStats={networkStats}
                    btcPriceUsd={btcPriceUsd || 100000}
                    isLoading={isLoading}
                  />
                </div>
                
                <div className="space-y-6">
                  <ErrorBoundary>
                    <LightningResultsPanel
                      feeEstimate={feeEstimate}
                      channelEconomics={channelEconomics}
                      amountSats={amountSats}
                      btcPriceUsd={btcPriceUsd || 100000}
                      isLoading={isLoading || priceLoading}
                    />
                  </ErrorBoundary>

                  {/* SlotB — result-adjacent spotlight */}
                  <div className="mt-8">
                    <sz.SlotB />
                  </div>
                </div>
              </div>

              {/* Export Report */}
              {feeEstimate && (
                <LightningExportReport
                  feeEstimate={feeEstimate}
                  networkStats={networkStats}
                  amountSats={amountSats}
                  estimatedHops={estimatedHops}
                  baseFeePerHop={baseFeePerHop}
                  feeRatePpm={feeRatePpm}
                  btcPriceUsd={btcPriceUsd || 100000}
                />
              )}

              {/* Route Finder Visualization */}
              <RouteFinderVisualization
                amountSats={amountSats}
                estimatedHops={estimatedHops}
                baseFeePerHop={baseFeePerHop}
                feeRatePpm={feeRatePpm}
                btcPriceUsd={btcPriceUsd || 100000}
                isLoading={isLoading}
              />

              {/* Charts Section */}
              <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
                <NetworkCapacityChart
                  data={historicalData}
                  isLoading={isLoading}
                />
                <FeeEconomicsVisualization
                  feeEstimate={feeEstimate}
                  amountSats={amountSats}
                />
              </div>
            </div>
          </section>

          {/* How It Works */}
          <LightningHowItWorksSection />

          {/* FAQ */}
          {/* SlotC — mid-content checkpoint */}
          <div className="container mx-auto px-6 py-8"><sz.SlotC /></div>
          <LightningFAQSection />

          {/* Related Calculators */}
          <RelatedCalculators />

          {/* Disclaimer */}
          <section className="container mx-auto px-6 pb-16">
            <div className="max-w-3xl mx-auto">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning mt-0.5 shrink-0" />
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">{t('lightning.disclaimer.title')}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {t('lightning.disclaimer.body')}
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

export default LightningNetworkFeeCalculator;
