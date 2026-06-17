import { HelmetOgImage } from "@/components/seo/HelmetOgImage";
import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Breadcrumb } from '@/components/Breadcrumb';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import RelatedCalculators from '@/components/RelatedCalculators';
import { AffiliatePlacement } from '@/components/affiliateAI/AffiliatePlacement';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet, AlertTriangle } from 'lucide-react';
import { useLiveBitcoinPrice } from '@/hooks/useLiveBitcoinPrice';
import { SavingsInputPanel } from '@/components/savings/SavingsInputPanel';
import { SavingsResultsPanel } from '@/components/savings/SavingsResultsPanel';
import { SavingsAccumulationChart } from '@/components/savings/SavingsAccumulationChart';
import { SavingsMilestonesTracker } from '@/components/savings/SavingsMilestonesTracker';
import { SavingsComparisonPanel } from '@/components/savings/SavingsComparisonPanel';
import { SavingsExportReport } from '@/components/savings/SavingsExportReport';
import { SavingsHowItWorksSection } from '@/components/savings/SavingsHowItWorksSection';
import { SavingsFAQSection } from '@/components/savings/SavingsFAQSection';
import { PageBackground } from '@/components/modern/PageBackground';
import { CompactLiveBitcoinPrice } from '@/components/CompactLiveBitcoinPrice';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { QuickAnswerBox } from '@/components/calculator/QuickAnswerBox';
import { useLanguage } from "@/contexts/LanguageContext";
import {
  PayFrequency,
  SavingsMode,
  calculateAccumulation,
  calculateMilestones,
  calculateSatsPerDollar,
  normalizeToMonthly,
  calculateSavingsAmount,
  type SavingsInputs,
} from '@/services/bitcoinSavingsCalculator';

const BitcoinSavingsCalculator: React.FC = () => {
  const { language, t } = useLanguage();
  const { price: liveBtcPrice, isLoading: isLoadingPrice, priceChangePercentage24h } = useLiveBitcoinPrice();

  // Input state
  const [income, setIncome] = useState(5000);
  const [frequency, setFrequency] = useState<PayFrequency>('monthly');
  const [savingsMode, setSavingsMode] = useState<SavingsMode>('fixed');
  const [fixedAmount, setFixedAmount] = useState(100);
  const [savingsPercentage, setSavingsPercentage] = useState(5);
  const [annualGrowthRate, setAnnualGrowthRate] = useState(0);
  const [timeHorizonMonths, setTimeHorizonMonths] = useState(12);
  const [savingsAccountAPY, setSavingsAccountAPY] = useState(0.045);
  const [useLivePrice, setUseLivePrice] = useState(true);
  const [customBtcPrice, setCustomBtcPrice] = useState(100000);

  const currentBtcPrice = useLivePrice ? liveBtcPrice : customBtcPrice;

  const inputs: SavingsInputs = useMemo(() => ({
    income,
    frequency,
    savingsMode,
    fixedAmount,
    savingsPercentage,
    currentBtcPrice,
    annualGrowthRate: annualGrowthRate / 100,
    timeHorizonMonths,
    savingsAccountAPY,
  }), [income, frequency, savingsMode, fixedAmount, savingsPercentage, currentBtcPrice, annualGrowthRate, timeHorizonMonths, savingsAccountAPY]);

  const results = useMemo(() => {
    if (currentBtcPrice <= 0) return null;
    const savingsAmount = calculateSavingsAmount(inputs);
    if (savingsAmount <= 0) return null;
    return calculateAccumulation(inputs);
  }, [inputs, currentBtcPrice]);

  const milestones = useMemo(() => {
    if (!results || currentBtcPrice <= 0) return [];
    return calculateMilestones(
      results.monthlyAmount,
      currentBtcPrice,
      annualGrowthRate / 100,
      timeHorizonMonths
    );
  }, [results, currentBtcPrice, annualGrowthRate, timeHorizonMonths]);

  const satsPerDollar = calculateSatsPerDollar(currentBtcPrice);

  const breadcrumbItems = [
    { name: 'Home', url: 'https://bitcoincalculator.tools/' },
    { name: 'Calculators', url: 'https://bitcoincalculator.tools/calculators' },
    { name: 'Savings Calculator', url: 'https://bitcoincalculator.tools/calculators/bitcoin-savings' },
  ];

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Bitcoin Savings Calculator",
    "description": "How many satoshis does your paycheck buy? Enter your savings amount — weekly or monthly — and watch your Bitcoin stack build over time. Every sat counts.",
    "url": "https://bitcoincalculator.tools/calculators/bitcoin-savings",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "featureList": [
      "Income-based savings planning",
      "Fixed amount and percentage modes",
      "Paycheck frequency matching",
      "Satoshi milestones tracker",
      "Savings account comparison",
      "Interactive accumulation chart",
      "Live Bitcoin price integration",
      "PDF export"
    ],
    "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
    "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" }
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Plan Your Bitcoin Savings",
    "description": "Plan your Bitcoin savings in four simple steps",
    "step": [
      { "@type": "HowToStep", "name": "Enter Your Income", "text": "Input your salary or income amount and select how often you get paid" },
      { "@type": "HowToStep", "name": "Set Your Savings Amount", "text": "Choose a fixed dollar amount or percentage of your income to allocate to Bitcoin savings" },
      { "@type": "HowToStep", "name": "Choose Your Time Horizon", "text": "See projections from 6 months to 5 years with conservative, moderate, or optimistic growth scenarios" },
      { "@type": "HowToStep", "name": "Track Your Milestones", "text": "View your projected Bitcoin accumulation, compare with traditional savings, and track when you will hit key ownership milestones" }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{t('savings.meta.title')}</title>
        <meta name="description" content={t('savings.meta.description')} />
        <link rel="canonical" href={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-birikim-hesaplayicisi':'https://bitcoincalculator.tools/calculators/bitcoin-savings'} />

        <link rel="alternate" hrefLang="tr" href="https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-birikim-hesaplayicisi" />
        <link rel="alternate" hrefLang="en" href="https://bitcoincalculator.tools/calculators/bitcoin-savings" />
        <link rel="alternate" hrefLang="x-default" href="https://bitcoincalculator.tools/calculators/bitcoin-savings" />
        <meta property="og:title" content={t('savings.meta.title')} />
        <meta property="og:description" content={t('savings.meta.ogDescription')} />
        <meta property="og:url" content={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-birikim-hesaplayicisi':'https://bitcoincalculator.tools/calculators/bitcoin-savings'} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="bitcoincalculator.tools" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('savings.meta.title')} />
        <meta name="twitter:description" content={t('savings.meta.twitterDescription')} />
        <meta name="twitter:creator" content="@web3believers" />

        <meta name="twitter:site" content="@web3believers" />
        <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "inLanguage": language==='tr' ? 'tr' : 'en',
          "mainEntity": (language==='tr' ? [
            { "@type": "Question", "name": "Bitcoin birikim planı nasıl çalışır?", "acceptedAnswer": { "@type": "Answer", "text": "Bitcoin birikim planı, haftalık, iki haftada bir veya aylık olarak düzenli aralıklarla sabit bir tutarı Bitcoin almak için ayırmaktır. Bu, fiyat dalgalanmasından bağımsız olarak Bitcoin stoğunuzu zamanla istikrarlı biçimde büyüten bir dolar maliyeti ortalaması (DMA) yöntemidir." }},
            { "@type": "Question", "name": "10 $ ile kaç satoshi alırım?", "acceptedAnswer": { "@type": "Answer", "text": "Alabileceğiniz satoshi sayısı Bitcoin'in güncel fiyatına bağlıdır. BTC fiyatı 100.000 $ iken 10 $ yaklaşık 10.000 satoshi alır. Hesaplayıcımız en güncel Bitcoin fiyatıyla gerçek zamanlı dönüşüm gösterir." }},
            { "@type": "Question", "name": "Bitcoin'de birikim banka mevduatından daha mı iyidir?", "acceptedAnswer": { "@type": "Answer", "text": "Bitcoin, çok yıllı pencerelerde geleneksel mevduat hesaplarının tarihsel olarak çok üzerinde getiri sağladı; ancak oynaklık ve risk daha yüksektir. Banka mevduatından farklı olarak Bitcoin'in arzı 21 milyon adetle sabittir; bu da onu enflasyona karşı potansiyel bir koruma yapar." }},
            { "@type": "Question", "name": "Bitcoin'de birikime başlamak için en az ne kadar gerekir?", "acceptedAnswer": { "@type": "Answer", "text": "Çoğu borsada 1 $ kadar küçük tutarlarla Bitcoin'de birikime başlayabilirsiniz. Bitcoin 8 ondalık basamağa kadar bölünebildiği için (1 BTC = 100 milyon satoshi) minimum tutma şartı yoktur. Her satoshi sayılır." }}
          ] : [
            { "@type": "Question", "name": "How does a Bitcoin savings plan work?", "acceptedAnswer": { "@type": "Answer", "text": "A Bitcoin savings plan involves regularly setting aside a fixed amount of money to buy Bitcoin — weekly, biweekly, or monthly. This is a form of dollar-cost averaging that builds your Bitcoin stack steadily over time regardless of price fluctuations." }},
            { "@type": "Question", "name": "How many satoshis can I buy with $10?", "acceptedAnswer": { "@type": "Answer", "text": "The number of satoshis you can buy depends on Bitcoin's current price. At $100,000 per BTC, $10 buys approximately 10,000 satoshis. Our calculator shows real-time conversions using the latest Bitcoin price." }},
            { "@type": "Question", "name": "Is saving in Bitcoin better than a bank account?", "acceptedAnswer": { "@type": "Answer", "text": "Bitcoin has historically outperformed traditional savings accounts over multi-year periods, but comes with higher volatility and risk. Unlike bank savings, Bitcoin has a fixed supply of 21 million coins, making it a potential hedge against inflation." }},
            { "@type": "Question", "name": "What is the minimum amount to start saving in Bitcoin?", "acceptedAnswer": { "@type": "Answer", "text": "You can start saving in Bitcoin with as little as $1 on most exchanges. Since Bitcoin is divisible to 8 decimal places (100 million satoshis per BTC), there's no minimum holding requirement. Every sat counts." }}
          ]).map(f => ({ "@type": "Question", "name": f.name, "acceptedAnswer": f.acceptedAnswer }))
        })}</script>
      </Helmet>
        <HelmetOgImage slug="bitcoin-savings-calculator" enAlt={`Bitcoin Savings Calculator | bitcoincalculator.tools`} />

      <BreadcrumbSchema language={language} items={breadcrumbItems} />

      <PageBackground variant="clean">
        <Header />

        <main id="main-content" className="pt-20 relative z-10">
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb items={[
              { label: t('savings.crumb.calculators'), href: language==='tr'?'/tr/hesaplayicilar':'/calculators' },
              { label: t('savings.crumb.current') },
            ]} />
          </div>

          <section className="container mx-auto px-4 sm:px-6 py-16 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6 text-sm font-medium text-primary max-w-full">
              <Wallet className="w-4 h-4 shrink-0" />
              <span className="break-words">{t('savings.hero.badge')}</span>
            </div>

            <h1 className="text-h1 font-bold text-foreground mb-4 break-words hyphens-auto">
              {t('savings.hero.titlePrefix')} <span className="text-gradient-premium">{t('savings.hero.titleMiddle')}</span> {t('savings.hero.titleSuffix')}
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-6 break-words">
              {t('savings.hero.description')}
            </p>

            <div className="max-w-sm mx-auto">
              <CompactLiveBitcoinPrice currency="USD" />
            </div>
          </section>

          <section className="container mx-auto px-6 pb-20">
            <div className="max-w-6xl mx-auto space-y-10">
              <QuickAnswerBox answer="A Bitcoin savings plan auto-converts a slice of your monthly income into BTC at a fixed cadence — daily, weekly, or monthly. The calculator backtests how much Bitcoin you'd own today and what it would be worth, using real CoinGecko price history. Start with 5–10% of disposable income, automate the buy, and let dollar-cost averaging smooth out volatility over years, not months." />
              <OfflineIndicator />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                <ErrorBoundary>
                  <SavingsInputPanel
                    income={income}
                    setIncome={setIncome}
                    frequency={frequency}
                    setFrequency={setFrequency}
                    savingsMode={savingsMode}
                    setSavingsMode={setSavingsMode}
                    fixedAmount={fixedAmount}
                    setFixedAmount={setFixedAmount}
                    savingsPercentage={savingsPercentage}
                    setSavingsPercentage={setSavingsPercentage}
                    annualGrowthRate={annualGrowthRate}
                    setAnnualGrowthRate={setAnnualGrowthRate}
                    timeHorizonMonths={timeHorizonMonths}
                    setTimeHorizonMonths={setTimeHorizonMonths}
                    savingsAccountAPY={savingsAccountAPY}
                    setSavingsAccountAPY={setSavingsAccountAPY}
                    useLivePrice={useLivePrice}
                    setUseLivePrice={setUseLivePrice}
                    customBtcPrice={customBtcPrice}
                    setCustomBtcPrice={setCustomBtcPrice}
                    liveBtcPrice={liveBtcPrice}
                  />
                </ErrorBoundary>

                <ErrorBoundary>
                  {results ? (
                    <SavingsResultsPanel results={results} />
                  ) : (
                    <div className="flex items-center justify-center h-64 text-muted-foreground">
                      {t('savings.placeholder.empty')}
                    </div>
                  )}
                </ErrorBoundary>
              </div>

              {/* Accumulation Chart */}
              {results && results.accumulationData.length > 0 && (
                <ErrorBoundary>
                  <SavingsAccumulationChart data={results.accumulationData} />
                </ErrorBoundary>
              )}

              {/* Milestones */}
              {milestones.length > 0 && (
                <ErrorBoundary>
                  <SavingsMilestonesTracker milestones={milestones} />
                </ErrorBoundary>
              )}

              {/* Comparison Panel */}
              {results && (
                <ErrorBoundary>
                  <SavingsComparisonPanel
                    results={results}
                    timeHorizonMonths={timeHorizonMonths}
                    annualGrowthRate={annualGrowthRate}
                  />
                </ErrorBoundary>
              )}

              {/* Export */}
              <SavingsExportReport
                results={results}
                milestones={milestones}
                timeHorizonMonths={timeHorizonMonths}
                annualGrowthRate={annualGrowthRate}
              />
            </div>
          </section>

          <SavingsHowItWorksSection />
          <SavingsFAQSection />
          {/* AI-driven affiliate placement */}
          <div className="container mx-auto px-6 pb-6 max-w-5xl"><AffiliatePlacement slug="bitcoin-savings" lang="en" resultSignals={["savings", "accumulation", "long-term"]} /></div>
          <RelatedCalculators />

          {/* Disclaimer */}
          <section className="container mx-auto px-6 pb-16">
            <div className="max-w-3xl mx-auto">
              <Card className="glass-morphism-card border-border/20 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{t('savings.disclaimer.title')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('savings.disclaimer.body')}
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

export default BitcoinSavingsCalculator;
