import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { PageBackground } from "@/components/modern/PageBackground";
import { CompactLiveBitcoinPrice } from "@/components/CompactLiveBitcoinPrice";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import RelatedCalculators from "@/components/RelatedCalculatorsLazy";
import { MethodologyBlock } from "@/components/calculator/MethodologyBlock";
import { Card, CardContent } from "@/components/ui/card";
import { useSmartZones } from "@/hooks/useSmartZones";
import { PlacementProvider } from "@/contexts/PlacementProvider";
import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { bitcoinApi } from "@/services/bitcoinApi";
import { MiningProfitabilityCalculator, MiningResult, MiningParams } from "@/services/miningProfitabilityCalculator";
import { MiningInputPanel } from "@/components/mining/MiningInputPanel";
import { MiningResultsPanel } from "@/components/mining/MiningResultsPanel";
import { MiningProfitChart } from "@/components/mining/MiningProfitChart";
import { MiningBreakdownTable } from "@/components/mining/MiningBreakdownTable";
import { MiningHowItWorksSection } from "@/components/mining/MiningHowItWorksSection";
import { MiningFAQSection } from "@/components/mining/MiningFAQSection";
import { MiningContentSections } from "@/components/mining/MiningContentSections";
import { MiningDifficultySection } from "@/components/mining/MiningDifficultySection";
import { MiningExportReport } from "@/components/mining/MiningExportReport";
import { AlertTriangle, Pickaxe, Calculator, Activity, Clock, TrendingUp } from "lucide-react";
import { useSafeLanguage } from "@/hooks/useSafeLanguage";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocalizedSchema } from "@/hooks/useLocalizedSchema";
import { HelmetOgImage } from "@/components/seo/HelmetOgImage";
import { QuickShareLinkPanel } from '@/components/share-export';
import { PageQuickAnswer } from "@/components/calculator/PageQuickAnswer";
const BitcoinMiningProfitabilityCalculator = () => {
  const { language, t } = useLanguage();
  const lang = useSafeLanguage();

  const [miningResult, setMiningResult] = useState<MiningResult | null>(null);

  const sz = useSmartZones({
    pageSlug: "mining-profitability",
    hasResultSignal: !!miningResult,
    lang,
  });

  const trUrl = "https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-madencilik-hesaplayicisi";
  const enUrl = "https://bitcoincalculator.tools/calculators/mining-profitability";

  const webAppSchema = useLocalizedSchema(
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "inLanguage": "en",
      "name": "Bitcoin Mining Profitability Calculator",
      "description": "Enter hashrate, hardware and electricity cost — see daily profit, monthly revenue and break-even at today's BTC price and difficulty. Is mining worth it?",
      "url": enUrl,
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Any",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools" },
      "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "inLanguage": "tr",
      "name": "Bitcoin Madencilik Karlılığı Hesaplayıcısı",
      "description": "Hashrate, donanım ve elektrik maliyetini girin — günümüz BTC fiyatı ve zorluğunda günlük kâr, aylık gelir ve başabaş süresini görün. Madencilik kârlı mı?",
      "url": trUrl,
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Any",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "TRY" },
      "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools" },
      "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
    },
  );

  const howToSchema = useLocalizedSchema(
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "inLanguage": "en",
      "name": "How to Calculate Bitcoin Mining Profitability",
      "description": "Enter your ASIC hashrate, power draw and electricity cost to project daily Bitcoin mining revenue, payback time and break-even BTC price.",
      "totalTime": "PT3M",
      "step": [
        { "@type": "HowToStep", "name": "Select Mining Hardware", "text": "Choose from popular ASIC miners or enter custom hardware specifications" },
        { "@type": "HowToStep", "name": "Enter Operating Costs", "text": "Input your electricity rate, pool fees, and hardware investment" },
        { "@type": "HowToStep", "name": "Calculate Profitability", "text": "View daily, monthly, and yearly profit projections" },
        { "@type": "HowToStep", "name": "Analyze Results", "text": "Review the Break-Even BTC Price (where daily revenue equals electricity cost), Hardware Payback in days, annual ROI, and 12-month projections." },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "inLanguage": "tr",
      "name": "Bitcoin Madencilik Karlılığı Nasıl Hesaplanır",
      "description": "Bitcoin madencilik kârınızı ve yatırım geri dönüşünüzü hesaplamak için adım adım rehber",
      "totalTime": "PT3M",
      "step": [
        { "@type": "HowToStep", "name": "Madencilik Donanımını Seçin", "text": "Popüler ASIC madencilerden birini seçin veya özel donanım özellikleri girin" },
        { "@type": "HowToStep", "name": "İşletme Maliyetlerini Girin", "text": "Elektrik tarifenizi, havuz ücretlerinizi ve donanım yatırımınızı girin" },
        { "@type": "HowToStep", "name": "Karlılığı Hesaplayın", "text": "Günlük, aylık ve yıllık kâr projeksiyonlarını görüntüleyin" },
        { "@type": "HowToStep", "name": "Sonuçları Analiz Edin", "text": "Başabaş BTC Fiyatını (günlük gelirin elektrik maliyetine eşit olduğu fiyat), Donanım Geri Ödeme süresini (gün), yıllık ROI'yi ve 12 aylık projeksiyonları inceleyin." },
      ],
    },
  );

  const faqSchema = useLocalizedSchema(
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "inLanguage": "en",
      "mainEntity": [
        { "@type": "Question", "name": "How does the Bitcoin mining profitability calculator work?", "acceptedAnswer": { "@type": "Answer", "text": "Our calculator uses your mining hardware specifications, electricity costs, and current network conditions to estimate potential Bitcoin mining profits with 12-month projections." } },
        { "@type": "Question", "name": "What is a profitable electricity rate for Bitcoin mining?", "acceptedAnswer": { "@type": "Answer", "text": "Generally, miners need electricity costs below $0.10/kWh to be competitive. Industrial operations often secure rates of $0.03-$0.06/kWh for profitable mining." } },
        { "@type": "Question", "name": "How do I calculate Bitcoin mining hashrate earnings?", "acceptedAnswer": { "@type": "Answer", "text": "Daily BTC earnings = (Your Hashrate ÷ Network Hashrate) × Daily Block Reward. At current network conditions, 1 TH/s earns approximately 0.000012 BTC per day before electricity costs." } },
        { "@type": "Question", "name": "Is GPU Bitcoin mining profitable in 2026?", "acceptedAnswer": { "@type": "Answer", "text": "GPU mining of Bitcoin itself is generally not profitable in 2026 due to the dominance of ASIC miners. The RTX 4090 achieves approximately 130 MH/s, far below ASIC performance." } },
        { "@type": "Question", "name": "Is Bitcoin mining still profitable in 2026?", "acceptedAnswer": { "@type": "Answer", "text": "It depends on your electricity rate. At $0.05/kWh with an Antminer S21, mining generates roughly $8-10/day profit. At $0.12/kWh, margins are slim. The 2024 halving cut block rewards to 3.125 BTC." } },
        { "@type": "Question", "name": "How long to break even on an Antminer S21?", "acceptedAnswer": { "@type": "Answer", "text": "Hardware payback is hardware cost divided by daily profit. At $0.08/kWh and $84,000 BTC, the S21 (200 TH/s, $5,500) shows a Hardware Payback of roughly 240-360 days in the calculator, assuming 3.5% monthly difficulty growth. That is separate from the Break-Even BTC Price shown alongside it, which is the price at which daily revenue just covers electricity." } },
        { "@type": "Question", "name": "What is the break-even Bitcoin price for mining?", "acceptedAnswer": { "@type": "Answer", "text": "The Break-Even BTC Price is daily electricity cost divided by daily BTC mined (pool fee already deducted). Below that price, each day of mining loses money on power alone even before hardware is paid off. The calculator displays this value alongside Hardware Payback so you can see both the operating floor and the capital recovery timeline." } },
        { "@type": "Question", "name": "How much does it cost to mine 1 Bitcoin in 2026?", "acceptedAnswer": { "@type": "Answer", "text": "With an S21 Pro at $0.05/kWh, electricity costs are roughly $30,000-$40,000 per BTC. Add hardware and the total is $45,000-$55,000. Industrial operations can get below $25,000." } },
        { "@type": "Question", "name": "What is the most profitable Bitcoin miner in 2026?", "acceptedAnswer": { "@type": "Answer", "text": "The Antminer S21 Pro leads at 15 J/TH with 234 TH/s. It costs about $6,500 but earns the most per dollar of electricity. The Bitaxe Ultra at $70 is ideal for hobbyists." } },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "inLanguage": "tr",
      "mainEntity": [
        { "@type": "Question", "name": "Bitcoin madencilik kârlılığı hesaplayıcısı nasıl çalışır?", "acceptedAnswer": { "@type": "Answer", "text": "Hesaplayıcımız madencilik donanım özelliklerinizi, elektrik maliyetlerinizi ve güncel ağ koşullarını kullanarak 12 aylık projeksiyonlarla potansiyel Bitcoin madencilik kârlarını tahmin eder." } },
        { "@type": "Question", "name": "Bitcoin madenciliği için kârlı elektrik tarifesi nedir?", "acceptedAnswer": { "@type": "Answer", "text": "Genel olarak madencilerin rekabetçi olabilmesi için elektrik maliyetinin 0,10 $/kWh'in altında olması gerekir. Endüstriyel operasyonlar kârlı madencilik için genellikle 0,03-0,06 $/kWh aralığında tarife sağlar." } },
        { "@type": "Question", "name": "Bitcoin madencilik hashrate kazancını nasıl hesaplarım?", "acceptedAnswer": { "@type": "Answer", "text": "Günlük BTC kazancı = (Hashrate'iniz ÷ Ağ Hashrate'i) × Günlük Blok Ödülü. Mevcut ağ koşullarında 1 TH/s elektrik maliyeti öncesi günde yaklaşık 0,000012 BTC kazandırır." } },
        { "@type": "Question", "name": "2026'da GPU ile Bitcoin madenciliği kârlı mı?", "acceptedAnswer": { "@type": "Answer", "text": "ASIC madencilerin hâkimiyeti nedeniyle 2026'da GPU ile Bitcoin madenciliği genellikle kârlı değildir. RTX 4090 yaklaşık 130 MH/s sağlar; bu, ASIC performansının çok altındadır." } },
        { "@type": "Question", "name": "Bitcoin madenciliği 2026'da hâlâ kârlı mı?", "acceptedAnswer": { "@type": "Answer", "text": "Elektrik tarifenize bağlıdır. 0,05 $/kWh'de Antminer S21 ile madencilik günde yaklaşık 8-10 $ kâr sağlar. 0,12 $/kWh'de marjlar dardır. 2024 yarılaması blok ödülünü 3,125 BTC'ye indirdi." } },
        { "@type": "Question", "name": "Antminer S21'de donanım geri ödemesi ne kadar sürer?", "acceptedAnswer": { "@type": "Answer", "text": "Donanım Geri Ödeme = donanım maliyeti ÷ günlük kâr. 0,08 $/kWh ve 84.000 $ BTC fiyatında S21 (200 TH/s, 5.500 $), aylık %3,5 zorluk artışı varsayımıyla hesaplayıcıda yaklaşık 240-360 gün Donanım Geri Ödeme gösterir. Bu değer, aynı ekranda gösterilen Başabaş BTC Fiyatından farklıdır — o fiyat, günlük gelirin elektrik maliyetine tam eşitlendiği seviyedir." } },
        { "@type": "Question", "name": "Madencilikte başabaş Bitcoin fiyatı nedir?", "acceptedAnswer": { "@type": "Answer", "text": "Başabaş BTC Fiyatı = günlük elektrik maliyeti ÷ günlük çıkarılan BTC (havuz ücreti düşülmüş halde). Bu fiyatın altında, donanım henüz amorti olmadan bile her gün yalnızca elektrik nedeniyle zarar edersiniz. Hesaplayıcı bu değeri Donanım Geri Ödeme ile birlikte gösterir; böylece hem işletme tabanını hem de sermaye geri kazanım süresini görürsünüz." } },
        { "@type": "Question", "name": "2026'da 1 Bitcoin madenciliğinin maliyeti nedir?", "acceptedAnswer": { "@type": "Answer", "text": "0,05 $/kWh'de S21 Pro ile elektrik maliyetleri BTC başına yaklaşık 30.000-40.000 $'dır. Donanımı eklediğinizde toplam 45.000-55.000 $ olur. Endüstriyel operasyonlar 25.000 $'ın altına inebilir." } },
        { "@type": "Question", "name": "2026'nın en kârlı Bitcoin madencisi hangisi?", "acceptedAnswer": { "@type": "Answer", "text": "Antminer S21 Pro, 234 TH/s ile 15 J/TH verimlilikte öne çıkıyor. Yaklaşık 6.500 $'a mal olur ancak elektrik dolarına en çok kazandıran modeldir. Bitaxe Ultra 70 $'la hobi kullanıcıları için idealdir." } },
      ],
    },
  );

  const [miningParams, setMiningParams] = useState<MiningParams | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Get current Bitcoin price
  const { data: currentPrice, isError: isPriceError } = useQuery({
    queryKey: ['current-btc-price', 'USD'],
    queryFn: () => bitcoinApi.getCurrentPrice('USD'),
    refetchInterval: 30000,
    retry: 2,
  });

  const effectivePrice = currentPrice ?? 0;
  const isUsingFallback = !currentPrice || isPriceError;

  // Fetch live network stats from mempool.space
  const { data: networkStats, isLoading: networkStatsLoading } = useQuery({
    queryKey: ['network-stats'],
    queryFn: () => MiningProfitabilityCalculator.fetchNetworkStats(),
    refetchInterval: 60000, // Refresh every minute
    staleTime: 30000,
    retry: 2,
  });

  const handleCalculate = useCallback((params: MiningParams) => {
    setIsCalculating(true);
    setMiningParams(params);
    
    // Use live difficulty if available
    const paramsWithLiveDifficulty = {
      ...params,
      networkDifficulty: networkStats?.difficulty || params.networkDifficulty,
    };
    
    // Simulate brief calculation time for UX
    setTimeout(() => {
      const result = MiningProfitabilityCalculator.calculate(paramsWithLiveDifficulty);
      setMiningResult(result);
      setIsCalculating(false);
    }, 500);
  }, [networkStats]);

  return (
    <PlacementProvider value={sz}>
      <Helmet>
        <title>{t('mining.seo.title')}</title>
        <meta name="description" content={t('mining.seo.description')} />
        <link rel="canonical" href={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-madencilik-hesaplayicisi':'https://bitcoincalculator.tools/calculators/mining-profitability'} />

        <link rel="alternate" hrefLang="tr" href="https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-madencilik-hesaplayicisi" />
        <link rel="alternate" hrefLang="en" href="https://bitcoincalculator.tools/calculators/mining-profitability" />
        <link rel="alternate" hrefLang="x-default" href="https://bitcoincalculator.tools/calculators/mining-profitability" />
        <meta property="og:title" content={t('mining.seo.title')} />
        <meta property="og:description" content={t('mining.seo.ogDescription')} />
        <meta property="og:url" content={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-madencilik-hesaplayicisi':'https://bitcoincalculator.tools/calculators/mining-profitability'} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="bitcoincalculator.tools" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('mining.seo.title')} />
        <meta name="twitter:description" content={t('mining.seo.twitterDescription')} />
        <meta name="twitter:creator" content="@web3believers" />

        <meta name="twitter:site" content="@web3believers" />
        <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>

      </Helmet>
        <HelmetOgImage slug="bitcoin-mining-profitability-calculator" enAlt={`Bitcoin Mining Profitability Calculator | bitcoincalculator.tools`} />

      <BreadcrumbSchema
        language={language}
        items={language === 'tr' ? [
          { name: "Ana Sayfa", url: "https://bitcoincalculator.tools/tr/" },
          { name: "Hesaplayıcılar", url: "https://bitcoincalculator.tools/tr/hesaplayicilar" },
          { name: "Madencilik Karlılığı", url: trUrl },
        ] : [
          { name: "Home", url: "https://bitcoincalculator.tools/" },
          { name: "Calculators", url: "https://bitcoincalculator.tools/calculators" },
          { name: "Mining Profitability", url: enUrl },
        ]}
      />

      <PageBackground variant="clean">
        <Header />

        <main id="main-content" className="pt-20 relative z-10">
          {/* Breadcrumb Navigation */}
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb 
              items={[
                { label: t('nav.calculators'), href: language==='tr'?'/tr/hesaplayicilar':'/calculators' },
                { label: t('mining.breadcrumb.current') }
              ]} 
            />
          </div>

          {/* SlotA — pre-calculator spotlight */}
          <div className="container mx-auto px-6 pt-8 mb-4">
            <sz.SlotA />
          </div>

          {/* Header Section */}
          {/* SlotA — pre-calculator spotlight */}
          <div className="container mx-auto px-6 max-w-5xl"><sz.SlotA /></div>

          <section className="container mx-auto px-6 py-16 text-center">
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/10">
                <Pickaxe className="w-4 h-4" />
                {t('mining.badge')}
              </div>

              <h1 className="text-h1 font-bold text-foreground">
                {t('mining.h1.pre')}<span className="text-gradient-premium">{t('mining.h1.highlight')}</span>{t('mining.h1.post')}
              </h1>

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('mining.subtitle')}
              </p>

              {/* Compact Live Bitcoin Price */}
              <div className="max-w-sm mx-auto">
                <CompactLiveBitcoinPrice currency="USD" />
                {isUsingFallback && (
                  <div className="flex items-center justify-center gap-2 mt-2 text-warning text-xs">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{t('mining.network.priceUnavailable')}</span>
                  </div>
                )}
              </div>

              {/* Network Stats Display */}
              {networkStats && !networkStatsLoading && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto mt-4">
                  <div className="p-3 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <Activity className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs text-muted-foreground">{t('mining.network.difficulty')}</span>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {MiningProfitabilityCalculator.formatDifficulty(networkStats.difficulty)}
                    </p>
                  </div>
                  <div className="p-3 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <TrendingUp className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs text-muted-foreground">{t('mining.network.hashrate')}</span>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {networkStats.networkHashrate > 0 
                        ? MiningProfitabilityCalculator.formatNetworkHashrate(networkStats.networkHashrate)
                        : '—'
                      }
                    </p>
                  </div>
                  <div className="p-3 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs text-muted-foreground">{t('mining.network.nextAdjustment')}</span>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {networkStats.estimatedRetargetDate 
                        ? format(networkStats.estimatedRetargetDate, 'MMM d')
                        : '—'
                      }
                    </p>
                  </div>
                  <div className="p-3 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <span className={`text-xs ${networkStats.difficultyChange >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {networkStats.difficultyChange >= 0 ? '↑' : '↓'}
                      </span>
                      <span className="text-xs text-muted-foreground">{t('mining.network.estChange')}</span>
                    </div>
                    <p className={`text-sm font-semibold ${networkStats.difficultyChange >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {networkStats.difficultyChange >= 0 ? '+' : ''}{networkStats.difficultyChange.toFixed(2)}%
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Calculator Section */}
          <section className="container mx-auto px-6 pb-20">
            <PageQuickAnswer
              en='Mining profitability depends on hashrate, power draw, electricity price and network difficulty. This calculator returns daily, monthly and yearly profit after power costs, plus your break-even electricity rate and the break-even Bitcoin price at which your rig stops covering its own running costs.'
              tr='Madencilik kârlılığı hashrate, güç tüketimi, elektrik fiyatı ve ağ zorluğuna bağlıdır. Bu hesaplayıcı elektrik maliyeti sonrası günlük, aylık ve yıllık kârı verir; ayrıca başabaş elektrik tarifenizi ve cihazınızın işletme maliyetini karşılamayı bıraktığı başabaş Bitcoin fiyatını gösterir.'
            />
            <div className="max-w-6xl mx-auto space-y-10 sm:space-y-14">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Input Panel */}
                <div>
                  <MiningInputPanel
                    onCalculate={handleCalculate}
                    loading={isCalculating}
                    currentBtcPrice={effectivePrice}
                    networkStats={networkStats}
                    networkStatsLoading={networkStatsLoading}
                  />
                </div>

                {/* Results Panel */}
                <div>
                  <ErrorBoundary>
                    {isCalculating && (
                      <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
                        <CardContent className="p-8 text-center">
                          <LoadingSpinner />
                          <p className="text-sm text-muted-foreground mt-4">
                            {t('mining.loading')}
                          </p>
                        </CardContent>
                      </Card>
                      )}
                    </ErrorBoundary>

                    {/* SlotB — result-adjacent spotlight */}
                    <div className="mt-8">
                      <sz.SlotB />
                    </div>
                  </div>

                    {miningResult && !isCalculating && (
                      <MiningResultsPanel 
                        result={miningResult}
                        currency="USD"
                      />
                    )}

                    {!miningResult && !isCalculating && (
                      <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
                        <CardContent className="p-8 text-center">
                          <div className="space-y-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                              <Calculator className="w-6 h-6 text-primary" />
                            </div>
                            <div className="space-y-1">
                              <h3 className="text-lg font-semibold text-foreground">
                                {t('mining.ready.title')}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {t('mining.ready.desc')}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

              {/* Charts and Tables */}
              {miningResult && miningParams && !isCalculating && (
                <div className="animate-fade-in space-y-8">
                  <MiningProfitChart 
                    projections={miningResult.projections}
                    currency="USD"
                  />
                  <MiningBreakdownTable 
                    projections={miningResult.projections}
                    currency="USD"
                  />
                  <MiningExportReport
                    result={miningResult}
                    params={miningParams}
                  />
                </div>
              )}
            </div>
          </section>

          {/* SEO H2 Sections */}
          <section className="container mx-auto px-6 pb-12">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-h2 font-bold text-foreground mb-4">
                {t('mining.h2.hashrate.title')}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('mining.h2.hashrate.body')}
              </p>
            </div>
          </section>

          <section className="container mx-auto px-6 pb-12">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-h2 font-bold text-foreground mb-4">
                {t('mining.h2.gpu.title')}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('mining.h2.gpu.body')}
              </p>
            </div>
          </section>


          {/* Educational Content */}
            <MiningDifficultySection />
            <MiningHowItWorksSection />
          <MiningContentSections />
          
          {/* SlotC — mid-content checkpoint */}
          <div className="container mx-auto px-6 py-8">
            <sz.SlotC />
          </div>

          <MiningFAQSection />

          <MethodologyBlock
            methodology="Expected daily BTC reward = (your hashrate ÷ network hashrate) × blocks per day × block subsidy + fees. Daily revenue = expected BTC × live BTC price. Daily electricity cost = power draw (kW) × hours × your $/kWh rate. Net profit subtracts pool fees (default 1%) and electricity. Break-even price solves for the BTC price at which daily revenue equals daily cost. Live network hashrate and difficulty come from mempool.space; live BTC price from CoinGecko."
            sources={[
              { label: 'Bitcoin network hashrate & difficulty', url: 'https://mempool.space/graphs/mining/hashrate-difficulty', publisher: 'mempool.space' },
              { label: 'Block subsidy schedule (post-halving)', url: 'https://en.bitcoin.it/wiki/Controlled_supply', publisher: 'Bitcoin Wiki' },
              { label: 'Cambridge Bitcoin Electricity Consumption Index', url: 'https://ccaf.io/cbnsi/cbeci', publisher: 'University of Cambridge' },
            ]}
            lastReviewed="2026-04-15"
            disclaimer="Mining profitability fluctuates with BTC price, network difficulty, and electricity cost. This calculator assumes static inputs over the projection window — actual results will vary as difficulty adjusts every ~2 weeks."
          />

          {/* Related Calculators */}
          <div className="container mx-auto px-4 sm:px-6"><div className="max-w-6xl mx-auto"><QuickShareLinkPanel slug="mining-profitability" headline={language === 'tr' ? 'Bitcoin Madencilik Kârlılığı' : 'Bitcoin Mining Profitability'} /></div></div>
          <RelatedCalculators />

          {/* Disclaimer */}
          <section className="container mx-auto px-6 pb-16">
            <div className="max-w-3xl mx-auto">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning mt-0.5 shrink-0" />
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">{t('mining.disclaimer.title')}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {t('mining.disclaimer.body')}
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

export default BitcoinMiningProfitabilityCalculator;
