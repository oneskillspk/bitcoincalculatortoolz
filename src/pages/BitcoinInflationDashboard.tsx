import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageBackground } from "@/components/modern/PageBackground";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { InflationInputPanel } from "@/components/inflation/InflationInputPanel";
import { InflationResultsPanel } from "@/components/inflation/InflationResultsPanel";
import { SupplyGrowthChart } from "@/components/inflation/SupplyGrowthChart";
import { PurchasingPowerChart } from "@/components/inflation/PurchasingPowerChart";
import { MoneyPrinterAnimation } from "@/components/inflation/MoneyPrinterAnimation";
import { HalvingTimeline } from "@/components/inflation/HalvingTimeline";
import { InflationHowItWorksSection } from "@/components/inflation/InflationHowItWorksSection";
import { InflationFAQSection } from "@/components/inflation/InflationFAQSection";
import RelatedCalculators from "@/components/RelatedCalculators";
import { CompactLiveBitcoinPrice } from "@/components/CompactLiveBitcoinPrice";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { BitcoinSupplyService, BitcoinSupplyData, HalvingEvent } from "@/services/bitcoinSupplyService";
import { FiatMoneySupplyService, FiatMoneySupplyData } from "@/services/fiatMoneySupplyService";
import { InflationComparisonCalculator } from "@/services/inflationComparisonCalculator";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

import { HelmetOgImage } from "@/components/seo/HelmetOgImage";
import { PreFAQPlacement } from "@/components/placement/PreFAQPlacement";
import { QuickShareLinkPanel } from '@/components/share-export';
const BitcoinInflationDashboard = () => {
  const { language, t } = useLanguage();
  const [currency, setCurrency] = useState("USD");
  const [timePeriod, setTimePeriod] = useState("all");
  const [bitcoinData, setBitcoinData] = useState<BitcoinSupplyData | null>(null);
  const [fiatData, setFiatData] = useState<FiatMoneySupplyData | null>(null);
  const [halvingHistory, setHalvingHistory] = useState<HalvingEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data on initial mount and when currency changes
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [btcData, fiatAllData, halvings] = await Promise.all([
          BitcoinSupplyService.getSupplyData(),
          FiatMoneySupplyService.getAllData(),
          BitcoinSupplyService.getHalvingHistory()
        ]);

        setBitcoinData(btcData);
        setFiatData(fiatAllData[currency] || null);
        setHalvingHistory(halvings);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currency]);

  // Calculate data for charts
  const supplyGrowthData = fiatData
    ? InflationComparisonCalculator.calculateSupplyGrowthTimeline(
        fiatData,
        timePeriod === "all" ? 2014 : new Date().getFullYear() - parseInt(timePeriod),
        new Date().getFullYear()
      )
    : [];

  const purchasingPowerData = fiatData
    ? InflationComparisonCalculator.calculatePurchasingPowerTimeline(
        fiatData,
        [],
        timePeriod === "all" ? 2014 : new Date().getFullYear() - parseInt(timePeriod),
        new Date().getFullYear()
      )
    : [];

  // Calculate money printer stats from latest available annual growth rate
  const growthYears = fiatData ? Object.keys(fiatData.annualGrowthRates).sort() : [];
  const latestGrowthYear = growthYears[growthYears.length - 1];
  const latestGrowthRate = (latestGrowthYear && fiatData?.annualGrowthRates[latestGrowthYear]) || 6.2;
  const annualGrowth = (fiatData?.currentM2 || 0) * (latestGrowthRate / 100);
  const perSecond = FiatMoneySupplyService.getMoneyCreatedPerSecond(annualGrowth);
  const dataAsOfYear = latestGrowthYear ? parseInt(latestGrowthYear, 10) : new Date().getFullYear();

  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '\u20AC',
    GBP: '\u00A3'
  };


  return (
    <>
<Helmet>
  <title>{language==='tr'?'Bitcoin vs Enflasyon Panosu':'Bitcoin vs Inflation Dashboard'}</title>
  <meta name="description" content={language==='tr'?'Bitcoin: sabit 21 milyon. Para biriminiz: sınırsız. Canlı M2 para arzı verilerini, satın alma gücü kaybınızı ve Bitcoin\'in koruma sağladığı şeyleri görün.':'Bitcoin: fixed 21 million. Your currency: unlimited. See live M2 money supply data, how much purchasing power you\'ve lost, and what Bitcoin protects against.'} />
  <link rel="canonical" href={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-enflasyon-paneli':'https://bitcoincalculator.tools/calculators/inflation-dashboard'} />
  
  <link rel="alternate" hrefLang="tr" href="https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-enflasyon-paneli" />
  <link rel="alternate" hrefLang="en" href="https://bitcoincalculator.tools/calculators/inflation-dashboard" />
  <link rel="alternate" hrefLang="x-default" href="https://bitcoincalculator.tools/calculators/inflation-dashboard" />
  <meta property="og:title" content={language==='tr'?'Bitcoin vs Enflasyon Panosu':'Bitcoin vs Inflation Dashboard'} />
  <meta property="og:description" content={language==='tr'?'Bitcoin: sabit 21 milyon. Para biriminiz: sınırsız. Canlı M2 para arzı verilerini ve Bitcoin\'in enflasyona karşı korumasını görün.':'Bitcoin: fixed 21 million. Your currency: unlimited. See live M2 money supply data, how much purchasing power you\'ve lost, and what Bitcoin protects against.'} />
  <meta property="og:url" content={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-enflasyon-paneli':'https://bitcoincalculator.tools/calculators/inflation-dashboard'} />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="bitcoincalculator.tools" />
  
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={language==='tr'?'Bitcoin vs Enflasyon Panosu':'Bitcoin vs Inflation Dashboard'} />
  <meta name="twitter:description" content={language==='tr'?'Bitcoin: sabit 21 milyon. Para biriminiz: sınırsız. Bitcoin\'in neye karşı koruma sağladığını görün.':'Bitcoin: fixed 21 million. Your currency: unlimited supply. See what Bitcoin protects against.'} />
  <meta name="twitter:creator" content="@web3believers" />
  
        <meta name="twitter:site" content="@web3believers" />
  <script type="application/ld+json">{JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Bitcoin vs Inflation Dashboard",
    "description": "Bitcoin: fixed 21 million. Your currency: unlimited. See live M2 money supply data, how much purchasing power you've lost, and what Bitcoin protects against.",
    "url": "https://bitcoincalculator.tools/calculators/inflation-dashboard",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Any",
    "featureList": [
      "Real-time Bitcoin supply tracking",
      "M2 money supply data for major currencies",
      "Purchasing power comparison",
      "CPI inflation rate visualization",
      "Bitcoin halving impact analysis"
    ],
    "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
    "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" }
  })}</script>

  <script type="application/ld+json">{JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "inLanguage": language === 'tr' ? 'tr' : 'en',
    "mainEntity": (language === 'tr' ? [
      { q: "Bitcoin'in sabit arzı neden önemlidir?", a: "Bitcoin'in 21 milyon coin limiti, altına benzer şekilde dijital kıtlık yaratır. Sınırsızca basılabilen fiat para birimlerinin aksine, programlanmış arzın ötesinde kimse daha fazla Bitcoin üretemez. Bu kıtlık, artan talep ile birleştiğinde uzun vadeli değer artışını destekler ve parasal enflasyona karşı korur." },
      { q: "M2 para arzı nedir?", a: "M2, nakit, vadesiz mevduat, tasarruf hesapları ve diğer kolayca erişilebilir fonları içeren en geniş para arzı ölçüsüdür. Ekonomide ne kadar para olduğunu gösterir. M2 ekonomik üretimden daha hızlı büyüdüğünde genellikle enflasyona ve para birimi değer kaybına yol açar." },
      { q: "Bitcoin enflasyona karşı nasıl koruma sağlar?", a: "Bitcoin'in sabit arzı, hiçbir merkezi otoritenin daha fazla coin üreterek varlıklarınızın değerini düşüremeyeceği anlamına gelir. Fiat para birimleri enflasyon nedeniyle yıllık yaklaşık %2-8 satın alma gücü kaybederken, Bitcoin'in kıtlığı ve büyüyen benimsenmesi tarihsel olarak uzun vadeli değer kazanımına yol açmış ve onu potansiyel bir enflasyon korunağı haline getirmiştir." },
      { q: "21 milyon Bitcoin'in tamamı çıkarıldıktan sonra ne olacak?", a: "Yaklaşık 2140 yılında tüm Bitcoin çıkarılmış olacak. Bundan sonra madenciler blok ödülleri yerine yalnızca işlem ücretleriyle ödüllendirilecek. Bitcoin'in enflasyon oranı mutlak sıfıra ulaşacak ve onu mükemmel şekilde öngörülebilir arzıyla yaratılmış en sert para biçimi haline getirecek." },
      { q: "Bu panonun verileri ne kadar doğru?", a: "Bitcoin arzı için gerçek zamanlı blockchain verisi, fiat M2 para arzı ve TÜFE için tarihsel Federal Reserve (FRED API) verisi kullanıyoruz. Tüm hesaplamalar şeffaf ve doğrulanabilirdir. Bitcoin verisi yeni bloklarla her 10 dakikada bir, fiat verisi ise merkez bankalarınca aylık olarak güncellenir." }
    ] : [
      { q: "Why is Bitcoin's fixed supply important?", a: "Bitcoin's 21 million coin limit creates digital scarcity, similar to gold. Unlike fiat currencies that can be printed indefinitely, no one can create more Bitcoin beyond the programmed supply. This scarcity combined with growing demand drives long-term value appreciation and protects against monetary inflation." },
      { q: "What is M2 money supply?", a: "M2 is the broadest measure of money supply, including cash, checking deposits, savings accounts, and other easily accessible funds. It shows how much currency exists in the economy. When M2 grows faster than economic output, it typically leads to inflation and currency devaluation." },
      { q: "How does Bitcoin protect against inflation?", a: "Bitcoin's fixed supply means no central authority can devalue your holdings by creating more coins. While fiat currencies lose ~2-8% of purchasing power annually due to inflation, Bitcoin's scarcity and growing adoption have historically led to long-term appreciation, making it a potential inflation hedge." },
      { q: "What happens after all 21 million Bitcoin are mined?", a: "Around the year 2140, all Bitcoin will be mined. After that, miners will be compensated solely through transaction fees rather than block rewards. Bitcoin's inflation rate will reach absolute zero, making it the hardest form of money ever created with perfectly predictable supply." },
      { q: "How accurate is this dashboard's data?", a: "We use real-time blockchain data for Bitcoin supply and historical Federal Reserve data (FRED API) for fiat M2 money supply and CPI. All calculations are transparent and verifiable. Bitcoin data updates every 10 minutes with new blocks, while fiat data is updated monthly by central banks." }
    ]).map(({q,a}) => ({ "@type": "Question", "name": q, "acceptedAnswer": { "@type": "Answer", "text": a } }))
  })}</script>

  <script type="application/ld+json">{JSON.stringify({
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Compare Bitcoin vs Fiat Inflation",
    "description": "Use the Bitcoin vs Inflation Dashboard to visualize money supply growth and purchasing power erosion.",
    "step": [
      { "@type": "HowToStep", "name": "Select Your Fiat Currency", "text": "Choose USD, EUR, or GBP to see that currency's M2 money supply data." },
      { "@type": "HowToStep", "name": "Set a Time Period", "text": "Select 'All Time' or a specific range to focus your analysis." },
      { "@type": "HowToStep", "name": "Compare Supply Growth", "text": "Review the supply growth chart showing Bitcoin's fixed schedule vs unlimited fiat expansion, plus purchasing power erosion over time." }
    ]
  })}</script>
</Helmet>
  <HelmetOgImage slug="bitcoin-inflation-dashboard" enAlt={`Bitcoin vs Inflation Dashboard | bitcoincalculator.tools`} />

      <BreadcrumbSchema language={language} 
        items={[
          { name: "Home", url: "https://bitcoincalculator.tools/" },
          { name: "Calculators", url: "https://bitcoincalculator.tools/calculators" },
          { name: "Inflation Dashboard", url: "https://bitcoincalculator.tools/calculators/inflation-dashboard" }
        ]}
      />
      
      <PageBackground variant="clean">
        <Header />

        <main id="main-content" className="pt-20 relative z-10">
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb items={[
              { label: language==='tr'?'Hesaplayıcılar':'Calculators', href: language==='tr'?'/tr/hesaplayicilar':'/calculators' },
              { label: language==='tr'?'Enflasyon Panosu':'Inflation Dashboard' }
            ]} />
          </div>

          <section className="container mx-auto px-6 py-16 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6 text-sm font-medium text-primary">
              <Activity className="w-4 h-4" />
              {language==='tr'?'Bitcoin vs Fiat':'Bitcoin vs Fiat'}
            </div>

            <h1 className="text-h1 font-bold text-foreground mb-4">
              {language==='tr'?<>Bitcoin vs <span className="text-gradient-premium">Enflasyon</span> Panosu</>:<>Bitcoin vs <span className="text-gradient-premium">Inflation</span> Dashboard</>}
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              {language==='tr'?'Bitcoin\'in sabit 21 milyon arzını sınırsız fiat para basımıyla karşılaştırın. Gerçek M2 verilerini, satın alma gücü kaybını ve Bitcoin\'in neden tarihte yaratılmış en sert para olduğunu görün.':'Compare Bitcoin\'s fixed 21 million supply against unlimited fiat money printing. See real M2 data, purchasing power erosion, and why Bitcoin is the hardest money ever created.'}
            </p>

            <div className="max-w-sm mx-auto">
              <CompactLiveBitcoinPrice currency={currency} />
            </div>
          </section>

          <section className="container mx-auto px-6 pb-20">
            <div className="max-w-6xl mx-auto space-y-10">
              <OfflineIndicator />

              {/* Input + Results */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ErrorBoundary>
                  <InflationInputPanel
                    currency={currency}
                    onCurrencyChange={setCurrency}
                    timePeriod={timePeriod}
                    onTimePeriodChange={setTimePeriod}
                  />
                </ErrorBoundary>
                <ErrorBoundary>
                  <InflationResultsPanel
                    bitcoinData={bitcoinData}
                    fiatData={fiatData}
                    loading={loading}
                  />
                </ErrorBoundary>
              </div>

              {/* Money Printer */}
              <ErrorBoundary>
                <MoneyPrinterAnimation
                  perSecond={perSecond}
                  currencySymbol={currencySymbols[currency] || '$'}
                  currency={currency}
                  growthRate={latestGrowthRate}
                  dataAsOfYear={dataAsOfYear}
                  loading={loading}
                />
              </ErrorBoundary>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ErrorBoundary>
                  <SupplyGrowthChart
                    data={supplyGrowthData}
                    currencySymbol={currencySymbols[currency] || '$'}
                  />
                </ErrorBoundary>
                <ErrorBoundary>
                  <PurchasingPowerChart data={purchasingPowerData} />
                </ErrorBoundary>
              </div>

              {/* Halving Timeline */}
              <ErrorBoundary>
                <HalvingTimeline halvings={halvingHistory} />
              </ErrorBoundary>
            </div>
          </section>

          {/* How It Works */}
          <InflationHowItWorksSection />

          {/* FAQ */}
          <PreFAQPlacement slug="inflation-dashboard" resultSignals={["inflation", "purchasing-power"]} />
          <InflationFAQSection />

          {/* Related */}
          <div className="container mx-auto px-4 sm:px-6"><div className="max-w-6xl mx-auto"><QuickShareLinkPanel slug="inflation-dashboard" headline={language === 'tr' ? 'Bitcoin Enflasyon Paneli' : 'Bitcoin Inflation Dashboard'} /></div></div>
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
                        {language==='tr'?'M2 para arzı verileri merkez bankası yayınlarından alınmaktadır ve 1-2 ay gecikme gösterebilir. Bitcoin arz verileri, blokzincir API\'lerinden gerçek zamanlıdır. Bu pano yalnızca eğitim amaçlıdır ve finansal tavsiye niteliği taşımaz.':'M2 money supply data is sourced from central bank publications and may lag by 1-2 months. Bitcoin supply data is real-time from blockchain APIs. This dashboard is for educational purposes only and does not constitute financial advice.'}
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

export default BitcoinInflationDashboard;
