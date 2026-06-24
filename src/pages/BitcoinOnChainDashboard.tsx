import { HelmetOgImage } from "@/components/seo/HelmetOgImage";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { PageBackground } from "@/components/modern/PageBackground";
import { CompactLiveBitcoinPrice } from "@/components/CompactLiveBitcoinPrice";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import RelatedCalculators from "@/components/RelatedCalculators";
import { Card, CardContent } from "@/components/ui/card";
import { OnChainMetricCard } from "@/components/onchain/OnChainMetricCard";
import { MVRVGauge } from "@/components/onchain/MVRVGauge";
import { S2FPanel } from "@/components/onchain/S2FPanel";
import { OnChainPriceChart } from "@/components/onchain/OnChainPriceChart";
import { OnChainHowToUse } from "@/components/onchain/OnChainHowToUse";
import { OnChainFAQSection } from "@/components/onchain/OnChainFAQSection";
import { useQuery } from "@tanstack/react-query";
import {
  fetchOnChainMetrics,
  fetchPriceHistory,
  formatHashRate,
  formatMarketCap,
  formatSupply,
  formatActiveAddresses,
  getMVRVLabel,
} from "@/services/onChainMetricsService";
import {
  Activity,
  AlertTriangle,
  Cpu,
  Users,
  TrendingUp,
  RefreshCw,
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { PreFAQPlacement } from "@/components/placement/PreFAQPlacement";

const BitcoinOnChainDashboard = () => {
  const { language, t } = useLanguage();
  const {
    data: metrics,
    isLoading: metricsLoading,
    isError: metricsError,
    refetch,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ["on-chain-metrics"],
    queryFn: fetchOnChainMetrics,
    staleTime: 3 * 60 * 1000,      // 3 min
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  const { data: priceHistory = [], isLoading: chartLoading } = useQuery({
    queryKey: ["on-chain-price-history"],
    queryFn: () => fetchPriceHistory(90),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });

  const mvrvLabel = metrics ? getMVRVLabel(metrics.mvrvSignal) : null;

  const lastUpdatedLabel = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : null;

  const canonicalUrl = language === 'tr'
    ? 'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-stok-akis'
    : 'https://bitcoincalculator.tools/calculators/on-chain';

  return (
    <>
      <Helmet>
        <title>{t('onchain.meta.title')}</title>
        <meta name="description" content={t('onchain.meta.description')} />
        <link rel="canonical" href={canonicalUrl} />

        <link rel="alternate" hrefLang="tr" href="https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-stok-akis" />
        <link rel="alternate" hrefLang="en" href="https://bitcoincalculator.tools/calculators/on-chain" />
        <link rel="alternate" hrefLang="x-default" href="https://bitcoincalculator.tools/calculators/on-chain" />
        <meta property="og:title" content={t('onchain.meta.title')} />
        <meta property="og:description" content={t('onchain.meta.ogDescription')} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="bitcoincalculator.tools" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('onchain.meta.title')} />
        <meta name="twitter:description" content={t('onchain.meta.twitterDescription')} />
        <meta name="twitter:creator" content="@web3believers" />

        <meta name="twitter:site" content="@web3believers" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Bitcoin On-Chain Metrics Dashboard",
            "description": "Live Bitcoin on-chain analytics: MVRV ratio, Stock-to-Flow model, hash rate, and active addresses. Free BTC cycle analysis dashboard.",
            "url": "https://bitcoincalculator.tools/calculators/on-chain",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Any",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
            "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools" },
            "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Use the Bitcoin On-Chain Metrics Dashboard",
            "description": "Step-by-step guide to interpreting Bitcoin on-chain metrics",
            "totalTime": "PT3M",
            "step": [
              { "@type": "HowToStep", "name": "View Live Metrics", "text": "The dashboard auto-loads live MVRV, S2F, hash rate, and active address data", "url": "https://bitcoincalculator.tools/calculators/on-chain#step1" },
              { "@type": "HowToStep", "name": "Read the MVRV Gauge", "text": "Check the MVRV ratio zone — below 1.0 is historically undervalued, above 3.5 is extreme overvalue", "url": "https://bitcoincalculator.tools/calculators/on-chain#step2" },
              { "@type": "HowToStep", "name": "Check S2F Deviation", "text": "See how current price compares to the PlanB S2F model price", "url": "https://bitcoincalculator.tools/calculators/on-chain#step3" },
              { "@type": "HowToStep", "name": "Combine Signals", "text": "Use on-chain metrics alongside the Fear & Greed Index and Rainbow Chart for a full picture", "url": "https://bitcoincalculator.tools/calculators/on-chain#step4" },
            ],
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "inLanguage": language === 'tr' ? 'tr' : 'en',
            "mainEntity": (language === 'tr' ? [
              { q: "MVRV oranı nedir?", a: "MVRV (Piyasa Değerinin Gerçekleşen Değere Oranı), Bitcoin'in piyasa değerini gerçekleşen değeriyle karşılaştırır. 1,0'ın altı = tarihsel olarak değerinin altında. 3,5'in üzeri = tarihsel olarak aşırı değerli." },
              { q: "Stock-to-Flow nedir?", a: "S2F, Bitcoin'in kıtlığını toplam arzı yıllık yeni ihraçla karşılaştırarak ölçer. 4. halving'in ardından Bitcoin'in yıllık akışı yaklaşık 164.250 BTC/yıldır." },
              { q: "Hash oranı bize ne söyler?", a: "Hash oranı, Bitcoin'i güvence altına alan toplam hesaplama gücünü ölçer. Yükselen hash oranı, madenci güvenini ve ağ sağlığını işaret eder." },
              { q: "Aktif adresler nedir?", a: "Aktif adresler, günlük olarak BTC gönderen veya alan benzersiz Bitcoin adreslerini sayar — gerçek ağ kullanımının ve benimsenmenin bir göstergesidir." },
              { q: "Bu veriler ne kadar doğru?", a: "Fiyat ve piyasa değeri CoinGecko'dan canlı alınmaktadır. Hash oranı ve aktif adresler, güncel kamuya açık tahminlerdir. MVRV bir yaklaşıklama yöntemi kullanır." }
            ] : [
              { q: "What is the MVRV ratio?", a: "MVRV (Market Value to Realized Value) compares Bitcoin's market cap to its realized cap. Below 1.0 = historically undervalued. Above 3.5 = historically extreme overvaluation." },
              { q: "What is Stock-to-Flow?", a: "S2F measures Bitcoin's scarcity by comparing total supply to annual new issuance. After the 4th halving, Bitcoin's annual flow is ~164,250 BTC/year." },
              { q: "What does hash rate tell us?", a: "Hash rate measures the total computational power securing Bitcoin. Rising hash rate signals miner confidence and network health." },
              { q: "What are active addresses?", a: "Active addresses count unique Bitcoin addresses that sent or received BTC daily — a proxy for real network usage and adoption." },
              { q: "How accurate is this data?", a: "Price and market cap are live from CoinGecko. Hash rate and active addresses are recent public estimates. MVRV uses an approximation method." }
            ]).map(({q,a}) => ({ "@type": "Question", "name": q, "acceptedAnswer": { "@type": "Answer", "text": a } })),
          })}
        </script>
      </Helmet>
        <HelmetOgImage slug="bitcoin-on-chain-dashboard" enAlt={`Bitcoin On-Chain Metrics Dashboard | bitcoincalculator.tools`} />

      <BreadcrumbSchema language={language}
        items={[
          { name: "Home", url: "https://bitcoincalculator.tools/" },
          { name: "Calculators", url: "https://bitcoincalculator.tools/calculators" },
          { name: "On-Chain Metrics", url: "https://bitcoincalculator.tools/calculators/on-chain" },
        ]}
      />

      <PageBackground variant="clean">
        <Header />

        <main id="main-content" className="pt-20 relative z-10">
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb
              items={[
                { label: t('onchain.crumb.calculators'), href: language==='tr'?'/tr/hesaplayicilar':'/calculators' },
                { label: t('onchain.crumb.current') },
              ]}
            />
          </div>

          {/* Hero */}
          <section className="container mx-auto px-6 py-16 text-center">
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/10">
                <Activity className="w-4 h-4" />
                {t('onchain.hero.badge')}
              </div>

              <h1 className="text-h1 font-bold text-foreground">
                {t('onchain.hero.titlePrefix')} <span className="text-gradient-premium">{t('onchain.hero.titleMiddle')}</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('onchain.hero.description')}
              </p>

              <div className="max-w-sm mx-auto">
                <CompactLiveBitcoinPrice currency="USD" />
              </div>
            </div>
          </section>

          {/* Dashboard */}
          <section className="container mx-auto px-6 pb-20">
            <div className="max-w-6xl mx-auto space-y-10">
              <OfflineIndicator />

              {/* Last updated + refresh */}
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {lastUpdatedLabel ? `${t('onchain.updated')}: ${lastUpdatedLabel}` : t('onchain.loading')}
                </p>
                <button
                  onClick={() => refetch()}
                  className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  {t('onchain.refresh')}
                </button>
              </div>

              {/* API error banner */}
              {metricsError && (
                <div className="flex items-center gap-3 bg-warning/$3 border border-warning/20 rounded-xl p-4">
                  <AlertTriangle className="w-4 h-4 text-warning shrink-0" />
                  <p className="text-sm text-warning">
                    {t('onchain.errorFetch')}
                  </p>
                </div>
              )}

              {/* Top metric cards — 4-grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <OnChainMetricCard
                  label="MVRV Ratio (Approx.)"
                  value={metrics ? metrics.mvrvRatio.toFixed(2) : "—"}
                  subValue="Market / Realized Cap"
                  signal={mvrvLabel?.label}
                  signalColor={mvrvLabel?.color}
                  signalBg={mvrvLabel?.bg}
                  icon={Database}
                  loading={metricsLoading}
                  description="Approximation — true MVRV requires on-chain realized cap data. Below 1.0 = historically undervalued."
                />
                <OnChainMetricCard
                  label="S2F Deviation"
                  value={metrics ? `${metrics.s2fDeviation > 0 ? '+' : ''}${metrics.s2fDeviation.toFixed(1)}%` : "—"}
                  subValue={`S2F Model: $${metrics ? new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(metrics.s2fModelPrice) : '—'}`}
                  signal={metrics && metrics.s2fDeviation > 20 ? "Above Model" : metrics && metrics.s2fDeviation < -10 ? "Below Model" : "Near Model"}
                  signalColor={metrics && metrics.s2fDeviation > 20 ? "text-warning" : metrics && metrics.s2fDeviation < -10 ? "text-success" : "text-info"}
                  signalBg={metrics && metrics.s2fDeviation > 20 ? "bg-warning/$3" : metrics && metrics.s2fDeviation < -10 ? "bg-success/10" : "bg-info/$3"}
                  icon={TrendingUp}
                  loading={metricsLoading}
                  description="% difference between live price and the S2F power law model."
                />
                <OnChainMetricCard
                  label="Hash Rate (Live)"
                  value={metrics ? formatHashRate(metrics.hashRate ?? 0) : "—"}
                  subValue="Network security — via mempool.space"
                  change={metrics?.hashRateChange30d}
                  icon={Cpu}
                  loading={metricsLoading}
                  description="Live computational power securing the Bitcoin network."
                />
                <OnChainMetricCard
                  label="Active Addresses (Est.)"
                  value={metrics ? formatActiveAddresses(metrics.activeAddresses ?? 0) : "—"}
                  subValue="Approximate daily unique addresses"
                  change={metrics?.activeAddressesChange}
                  icon={Users}
                  loading={metricsLoading}
                  description="Estimated unique addresses active on-chain per day. Static approximation — live data requires premium APIs."
                />
              </div>

              {/* MVRV Gauge + S2F Panel — side by side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ErrorBoundary>
                  <MVRVGauge metrics={metrics ?? null} loading={metricsLoading} />
                </ErrorBoundary>
                <ErrorBoundary>
                  <S2FPanel metrics={metrics ?? null} loading={metricsLoading} />
                </ErrorBoundary>
              </div>

              {/* Supply stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <OnChainMetricCard
                  label="Circulating Supply"
                  value={metrics ? formatSupply(metrics.circulatingSupply) : "—"}
                  subValue="Total BTC in existence"
                  icon={Activity}
                  loading={metricsLoading}
                />
                <OnChainMetricCard
                  label="% Mined"
                  value={metrics ? `${metrics.percentMined.toFixed(2)}%` : "—"}
                  subValue={`Max supply: ${formatSupply(21_000_000)}`}
                  icon={Cpu}
                  loading={metricsLoading}
                  description="Percentage of the 21M hard cap that has been mined so far."
                />
                <OnChainMetricCard
                  label="Market Cap"
                  value={metrics ? formatMarketCap(metrics.marketCap) : "—"}
                  subValue="Total market capitalization"
                  icon={TrendingUp}
                  loading={metricsLoading}
                />
              </div>

              {/* Price + S2F chart */}
              <ErrorBoundary>
                <OnChainPriceChart
                  data={priceHistory}
                  s2fModelPrice={metrics?.s2fModelPrice}
                  loading={chartLoading}
                />
              </ErrorBoundary>

              {/* Data source note */}
              <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/20 rounded-xl p-4">
                <Database className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Price, market cap, and supply data are fetched live from CoinGecko's public API.
                  Hash rate and active address figures are recent public estimates sourced from mempool.space and blockchain.com.
                  MVRV realized cap is approximated. Last data update: {" "}
                  <strong>{metrics?.lastUpdated ? new Date(metrics.lastUpdated).toLocaleString() : "N/A"}</strong>.
                </span>
              </div>
            </div>
          </section>

          <OnChainHowToUse />
          <PreFAQPlacement slug="on-chain-dashboard" resultSignals={["valuation", "long-term"]} />
          <OnChainFAQSection />
          <RelatedCalculators />

          {/* Disclaimer */}
          <section className="container mx-auto px-6 pb-16">
            <div className="max-w-3xl mx-auto">
              <Card className="glass-morphism-card border-border/20 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{t('onchain.disclaimer.title')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('onchain.disclaimer.body')}
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

export default BitcoinOnChainDashboard;
