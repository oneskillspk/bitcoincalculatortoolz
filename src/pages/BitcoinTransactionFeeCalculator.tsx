import { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { Wifi, Activity, Clock, Box, AlertTriangle } from "lucide-react";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CompactLiveBitcoinPrice } from "@/components/CompactLiveBitcoinPrice";
import { useLiveBitcoinPrice } from "@/hooks/useLiveBitcoinPrice";
import RelatedCalculators from "@/components/RelatedCalculators";
import { Footer } from "@/components/Footer";
import { AffiliatePlacement } from "@/components/affiliateAI/AffiliatePlacement";
import { Header } from "@/components/Header";
import { PageBackground } from "@/components/modern/PageBackground";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { FeeInputPanel } from "@/components/transaction-fees/FeeInputPanel";
import { FeeResultsPanel } from "@/components/transaction-fees/FeeResultsPanel";
import { FeeHistoryChart } from "@/components/transaction-fees/FeeHistoryChart";
import { MempoolVisualization } from "@/components/transaction-fees/MempoolVisualization";
import { TransactionFeeHowItWorksSection } from "@/components/transaction-fees/TransactionFeeHowItWorksSection";
import { TransactionFeeFAQSection } from "@/components/transaction-fees/TransactionFeeFAQSection";
import { FeeExportReport } from "@/components/transaction-fees/FeeExportReport";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  transactionFeeCalculator, 
  type AddressType, 
  type Priority,
  type FeeRecommendation,
  type MempoolStats,
  type MempoolBlock,
  type AllFeeEstimates
} from "@/services/transactionFeeCalculator";

const BitcoinTransactionFeeCalculator = () => {
  const { language, t } = useLanguage();
  // Live Bitcoin price
  const { price: btcPrice, isLoading: priceLoading } = useLiveBitcoinPrice();

  // Input state
  const [addressType, setAddressType] = useState<AddressType>('native-segwit');
  const [inputCount, setInputCount] = useState(1);
  const [outputCount, setOutputCount] = useState(2);
  const [amountBtc, setAmountBtc] = useState('');
  const [priority, setPriority] = useState<Priority>('halfHour');

  // Live data state
  const [feeRecommendation, setFeeRecommendation] = useState<FeeRecommendation | null>(null);
  const [mempoolStats, setMempoolStats] = useState<MempoolStats | null>(null);
  const [mempoolBlocks, setMempoolBlocks] = useState<MempoolBlock[]>([]);
  const [allEstimates, setAllEstimates] = useState<AllFeeEstimates | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch live data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [fees, stats, blocks] = await Promise.all([
          transactionFeeCalculator.getRecommendedFees(),
          transactionFeeCalculator.getMempoolStats(),
          transactionFeeCalculator.getMempoolBlocks()
        ]);
        setFeeRecommendation(fees);
        setMempoolStats(stats);
        setMempoolBlocks(blocks);
      } catch (error) {
        console.error('Failed to fetch mempool data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Calculate estimates when inputs change
  useEffect(() => {
    const calculateEstimates = async () => {
      if (!btcPrice) return;
      
      const amountSats = amountBtc ? Math.round(parseFloat(amountBtc) * 100000000) : 0;
      
      const estimates = await transactionFeeCalculator.calculateAllFeeEstimates(
        { inputCount, outputCount, addressType, amountSats },
        btcPrice
      );
      setAllEstimates(estimates);
    };

    calculateEstimates();
  }, [inputCount, outputCount, addressType, amountBtc, btcPrice, feeRecommendation]);

  // Selected estimate
  const selectedEstimate = useMemo(() => {
    if (!allEstimates) return null;
    return allEstimates[priority];
  }, [allEstimates, priority]);

  // Transaction size
  const transactionSize = useMemo(() => {
    return transactionFeeCalculator.calculateTransactionSize({ inputCount, outputCount, addressType });
  }, [inputCount, outputCount, addressType]);

  // Savings vs legacy
  const savingsVsLegacy = useMemo(() => {
    return transactionFeeCalculator.calculateSavingsVsLegacy(addressType, inputCount, outputCount);
  }, [addressType, inputCount, outputCount]);

  // Current fee rate for visualization
  const currentFeeRate = selectedEstimate?.satsPerVbyte || feeRecommendation?.halfHourFee || 20;

  // SEO structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Bitcoin Transaction Fee Calculator",
    "description": "What does a Bitcoin transaction cost? Live fees in sats and USD for economy, standard and priority confirmation. Real mempool data, updated every block.",
    "url": "https://bitcoincalculator.tools/calculators/transaction-fees",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
    "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" }
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Calculate Bitcoin Transaction Fees",
    "description": "Step-by-step guide to estimate optimal Bitcoin transaction fees using real-time mempool data",
    "totalTime": "PT2M",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Enter Transaction Details",
        "text": "Choose your address type (Legacy, SegWit, Native SegWit, or Taproot) and specify the number of inputs and outputs for your transaction"
      },
      {
        "@type": "HowToStep",
        "name": "Select Priority Level",
        "text": "Choose your desired confirmation speed: fastest (~10 min), 30 minutes, 1 hour, or economy (4+ hours)"
      },
      {
        "@type": "HowToStep",
        "name": "View Fee Estimate",
        "text": "See the recommended fee rate in sat/vB and total cost in both satoshis and USD based on current network conditions"
      },
      {
        "@type": "HowToStep",
        "name": "Compare Options",
        "text": "Review all priority levels in the comparison table to balance cost vs. confirmation time for your needs"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "inLanguage": language === 'tr' ? 'tr' : 'en',
    "mainEntity": (language === 'tr' ? [
      { q: "sat/vB (sanal bayt başına satoshi) nedir?", a: "sat/vB (sanal bayt başına satoshi), Bitcoin işlem ücretlerini ölçmek için kullanılan birimdir. İşlem verisinin sanal baytı başına ödemek istediğiniz satoshi miktarını gösterir." },
      { q: "Bitcoin işlem ücretleri nasıl hesaplanır?", a: "Bitcoin işlem ücretleri, işleminizin boyutunun (sanal bayt cinsinden) ücret oranıyla (sat/vB) çarpılmasıyla hesaplanır. Boyut; girdi, çıktı sayısına ve kullanılan adres tipine bağlıdır." },
      { q: "Legacy, SegWit ve Taproot adresleri arasındaki fark nedir?", a: "Legacy adresleri en fazla blok alanı kullanır ve en yüksek ücretlere sahiptir. SegWit adresleri ücretleri %30-40 azaltır. Taproot adresleri karmaşık işlemler için en iyi gizliliği ve en düşük ücretleri sunar." }
    ] : [
      { q: "What is a sat/vB (satoshi per virtual byte)?", a: "A sat/vB (satoshi per virtual byte) is the unit used to measure Bitcoin transaction fees. It represents how many satoshis you're willing to pay per virtual byte of transaction data." },
      { q: "How are Bitcoin transaction fees calculated?", a: "Bitcoin transaction fees are calculated by multiplying your transaction's size (in virtual bytes) by the fee rate (sat/vB). The size depends on the number of inputs, outputs, and address type used." },
      { q: "What's the difference between Legacy, SegWit, and Taproot addresses?", a: "Legacy addresses use the most block space and have highest fees. SegWit addresses reduce fees by 30-40%. Taproot addresses offer the best privacy and lowest fees for complex transactions." }
    ]).map(({q,a}) => ({ "@type": "Question", "name": q, "acceptedAnswer": { "@type": "Answer", "text": a } }))
  };

  return (
    <>
      <Helmet>
        <title>{t('txfee.seo.title')}</title>
        <meta name="description" content={t('txfee.seo.description')} />
        <meta 
          name="keywords" 
          content="bitcoin fee calculator, transaction fee, mempool fees, sat/vbyte, bitcoin network fees, optimal fee, confirmation time, segwit fees, taproot fees" 
        />
        <link rel="canonical" href={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-ag-ucreti':'https://bitcoincalculator.tools/calculators/transaction-fees'} />
        
        <link rel="alternate" hrefLang="tr" href="https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-ag-ucreti" />
        <link rel="alternate" hrefLang="en" href="https://bitcoincalculator.tools/calculators/transaction-fees" />
        <link rel="alternate" hrefLang="x-default" href="https://bitcoincalculator.tools/calculators/transaction-fees" />
        {/* Open Graph */}
        <meta property="og:title" content={t('txfee.seo.title')} />
        <meta property="og:description" content={t('txfee.seo.ogDescription')} />
        <meta property="og:url" content={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-ag-ucreti':'https://bitcoincalculator.tools/calculators/transaction-fees'} />
        <meta property="og:type" content="website" />
        <HelmetOgImage slug="bitcoin-transaction-fee-calculator" enAlt={`Bitcoin Transaction Fee Calculator | bitcoincalculator.tools`} />
        <meta property="og:site_name" content="bitcoincalculator.tools" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('txfee.seo.title')} />
        <meta name="twitter:description" content={t('txfee.seo.twitterDescription')} />
        <meta name="twitter:creator" content="@web3believers" />
        
        <meta name="twitter:site" content="@web3believers" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(howToSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <BreadcrumbSchema language={language} 
        items={[
          { name: "Home", url: "https://bitcoincalculator.tools/" },
          { name: "Calculators", url: "https://bitcoincalculator.tools/calculators" },
          { name: "Transaction Fees", url: "https://bitcoincalculator.tools/calculators/transaction-fees" }
        ]} 
      />

      <PageBackground variant="clean">
        <Header />
        
        <main id="main-content" className="pt-20 relative z-10">
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb 
              items={[
                { label: t('nav.calculators'), href: language==='tr'?'/tr/hesaplayicilar':'/calculators' },
                { label: t('txfee.breadcrumb.current') }
              ]} 
            />
          </div>

          <section className="container mx-auto px-6 py-16 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6 text-sm font-medium text-primary">
              <Wifi className="w-4 h-4" />
              {t('txfee.badge')}
            </div>
            
            <h1 className="text-h1 font-bold text-foreground mb-4">
              {t('txfee.h1.pre')}<span className="text-gradient-premium">{t('txfee.h1.highlight')}</span>{t('txfee.h1.post')}
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              {t('txfee.subtitle')}
            </p>

            <div className="max-w-sm mx-auto">
              <CompactLiveBitcoinPrice currency="USD" />
            </div>
          </section>

          <section className="container mx-auto px-6 pb-6">
            <div className="max-w-5xl mx-auto space-y-6">
              <OfflineIndicator />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
                {/* Mempool Size */}
                <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-card/50 rounded-lg border border-border/30">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <Box className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-xs text-muted-foreground">
                      <span className="hidden sm:inline">{t('txfee.stats.mempool')}</span>
                      <span className="sm:hidden">{t('txfee.stats.mempoolShort')}</span>
                    </p>
                    <p className="text-sm sm:text-lg font-semibold truncate">
                      {mempoolStats ? `${(mempoolStats.vsize / 1000000).toFixed(1)} MB` : '—'}
                    </p>
                  </div>
                </div>

                {/* Pending TXs */}
                <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-card/50 rounded-lg border border-border/30">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-info/$3 rounded-lg flex items-center justify-center shrink-0">
                    <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-info" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-xs text-muted-foreground">
                      <span className="hidden sm:inline">{t('txfee.stats.pendingTxs')}</span>
                      <span className="sm:hidden">{t('txfee.stats.pendingShort')}</span>
                    </p>
                    <p className="text-sm sm:text-lg font-semibold truncate">
                      {mempoolStats ? mempoolStats.count.toLocaleString() : '—'}
                    </p>
                  </div>
                </div>

                {/* Next Block Fee */}
                <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-card/50 rounded-lg border border-border/30">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-success/10 rounded-lg flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-xs text-muted-foreground">
                      <span className="hidden sm:inline">{t('txfee.stats.nextBlock')}</span>
                      <span className="sm:hidden">{t('txfee.stats.nextShort')}</span>
                    </p>
                    <p className="text-sm sm:text-lg font-semibold truncate">
                      {feeRecommendation ? `${feeRecommendation.fastestFee} sat/vB` : '—'}
                    </p>
                  </div>
                </div>

                {/* Congestion */}
                <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-card/50 rounded-lg border border-border/30">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    mempoolStats?.congestionLevel === 'low' ? 'bg-success/10' :
                    mempoolStats?.congestionLevel === 'high' ? 'bg-destructive/10' : 'bg-warning/$3'
                  }`}>
                    <AlertTriangle className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      mempoolStats?.congestionLevel === 'low' ? 'text-success' :
                      mempoolStats?.congestionLevel === 'high' ? 'text-destructive' : 'text-warning'
                    }`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-xs text-muted-foreground">{t('txfee.stats.network')}</p>
                    <p className="text-sm sm:text-lg font-semibold capitalize truncate">
                      {mempoolStats?.congestionLevel || '—'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Calculator Section */}
          <section className="container mx-auto px-6 pb-12">
            <div className="max-w-6xl mx-auto">
              {/* Export Button */}
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mb-4">
                <FeeExportReport
                  selectedEstimate={selectedEstimate}
                  allEstimates={allEstimates}
                  addressType={addressType}
                  priority={priority}
                  inputCount={inputCount}
                  outputCount={outputCount}
                  btcPrice={btcPrice}
                />
              </div>

              {/* Input/Results Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                <ErrorBoundary>
                  <FeeInputPanel
                    addressType={addressType}
                    setAddressType={setAddressType}
                    inputCount={inputCount}
                    setInputCount={setInputCount}
                    outputCount={outputCount}
                    setOutputCount={setOutputCount}
                    amountBtc={amountBtc}
                    setAmountBtc={setAmountBtc}
                    priority={priority}
                    setPriority={setPriority}
                    feeRecommendation={feeRecommendation}
                    mempoolStats={mempoolStats}
                    isLoading={isLoading}
                  />
                </ErrorBoundary>

                <ErrorBoundary>
                  <FeeResultsPanel
                    selectedEstimate={selectedEstimate}
                    allEstimates={allEstimates}
                    selectedPriority={priority}
                    savingsVsLegacy={savingsVsLegacy}
                    transactionSize={transactionSize}
                    isLoading={isLoading || priceLoading}
                  />
                </ErrorBoundary>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                <MempoolVisualization
                  blocks={mempoolBlocks}
                  userFeeRate={currentFeeRate}
                  isLoading={isLoading}
                />
                <FeeHistoryChart
                  currentFees={feeRecommendation}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </section>

          {/* How It Works */}
          <TransactionFeeHowItWorksSection />

          {/* FAQ */}
          <TransactionFeeFAQSection />

          {/* Related Calculators */}
          <div className="container mx-auto px-6 max-w-5xl"><AffiliatePlacement slug="transaction-fees" /></div>
          <RelatedCalculators />

          {/* Disclaimer */}
          <section className="container mx-auto px-6 pb-16">
            <div className="max-w-3xl mx-auto">
              <Card className="glass-morphism-card border-border/20 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{t('txfee.disclaimer.title')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('txfee.disclaimer.body')}
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

export default BitcoinTransactionFeeCalculator;
