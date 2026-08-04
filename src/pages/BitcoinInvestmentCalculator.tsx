import { HelmetOgImage } from "@/components/seo/HelmetOgImage";
import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Breadcrumb } from '@/components/Breadcrumb';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { DatasetSchema } from '@/components/seo/DatasetSchema';
import RelatedCalculators from '@/components/RelatedCalculatorsLazy';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { TrendingUp, AlertTriangle } from 'lucide-react';
import { CompactLiveBitcoinPrice } from '@/components/CompactLiveBitcoinPrice';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useLiveBitcoinPrice } from '@/hooks/useLiveBitcoinPrice';
import { InvestmentInputPanel } from '@/components/investment/InvestmentInputPanel';
import { InvestmentResultsPanel } from '@/components/investment/InvestmentResultsPanel';
import { InvestmentProjectionChart } from '@/components/investment/InvestmentProjectionChart';
import { InvestmentExportReport } from '@/components/investment/InvestmentExportReport';
import { InvestmentHowItWorksSection } from '@/components/investment/InvestmentHowItWorksSection';
import { InvestmentFAQSection } from '@/components/investment/InvestmentFAQSection';
import { InvestmentComparisonTable } from '@/components/investment/InvestmentComparisonTable';
import { InvestmentContentSections } from '@/components/investment/InvestmentContentSections';
import { InvestmentSipTable } from '@/components/investment/InvestmentSipTable';
import { PageBackground } from '@/components/modern/PageBackground';
import {
  calculateAllProjections,
  calculateAssetComparisons,
  calculateFromPriceTarget,
  GROWTH_MODELS,
  DEFAULT_INFLATION_RATE,
  type InvestmentInputs,
} from '@/services/investmentProjectionCalculator';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { buildCalculatorSpeakable } from '@/components/seo/calculatorSpeakable';
import { useLocale } from '@/hooks/useLocale';
import { PreFAQPlacement } from "@/components/placement/PreFAQPlacement";
import { QuickShareLinkPanel } from '@/components/share-export';
import { PageQuickAnswer } from "@/components/calculator/PageQuickAnswer";

const BitcoinInvestmentCalculator: React.FC = () => {
  const { language, t } = useLanguage();
  const { defaultCurrency } = useLocale();
  const { price: liveBtcPrice, isLoading: isLoadingPrice, priceChangePercentage24h } = useLiveBitcoinPrice(defaultCurrency);

  // Input state
  const [lumpSum, setLumpSum] = useState(1000);
  const [monthlyContribution, setMonthlyContribution] = useState(100);
  const [timeHorizon, setTimeHorizon] = useState(5);
  const [selectedModels, setSelectedModels] = useState<string[]>(['conservative', 'moderate', 'aggressive']);
  const [customCAGR, setCustomCAGR] = useState(35);
  const [showCustom, setShowCustom] = useState(false);
  const [showInflation, setShowInflation] = useState(false);
  const [inflationRate, setInflationRate] = useState(DEFAULT_INFLATION_RATE * 100);
  const [useLivePrice, setUseLivePrice] = useState(true);
  const [customBtcPrice, setCustomBtcPrice] = useState(100000);
  const [showPriceTarget, setShowPriceTarget] = useState(false);
  const [targetBtcPrice, setTargetBtcPrice] = useState(250000);
  const [showAssetComparison, setShowAssetComparison] = useState(true);

  const currentBtcPrice = useLivePrice ? liveBtcPrice : customBtcPrice;

  const handleToggleModel = (modelId: string) => {
    setSelectedModels((prev) =>
      prev.includes(modelId)
        ? prev.filter((id) => id !== modelId)
        : [...prev, modelId]
    );
  };

  // Compute projections
  const inputs: InvestmentInputs = useMemo(() => ({
    lumpSum,
    monthlyContribution,
    timeHorizon,
    currentBtcPrice,
    inflationRate: inflationRate / 100,
    customCAGR: showCustom ? customCAGR / 100 : undefined,
  }), [lumpSum, monthlyContribution, timeHorizon, currentBtcPrice, inflationRate, showCustom, customCAGR]);

  const allResults = useMemo(() => {
    if (currentBtcPrice <= 0 || (lumpSum <= 0 && monthlyContribution <= 0)) return [];
    return calculateAllProjections(inputs, showCustom);
  }, [inputs, showCustom, currentBtcPrice, lumpSum, monthlyContribution]);

  const filteredResults = useMemo(() => {
    return allResults.filter((r) =>
      selectedModels.includes(r.modelId) || r.modelId === 'custom'
    );
  }, [allResults, selectedModels]);

  const assetComparisons = useMemo(() => {
    if (lumpSum <= 0 && monthlyContribution <= 0) return [];
    return calculateAssetComparisons(inputs);
  }, [inputs, lumpSum, monthlyContribution]);

  const priceTargetResult = useMemo(() => {
    if (!showPriceTarget || targetBtcPrice <= 0 || currentBtcPrice <= 0) return null;
    return calculateFromPriceTarget(inputs, targetBtcPrice);
  }, [showPriceTarget, targetBtcPrice, inputs, currentBtcPrice]);

  const breadcrumbItems = language==='tr' ? [
    { name: 'Ana Sayfa', url: 'https://bitcoincalculator.tools/' },
    { name: 'Hesaplayıcılar', url: 'https://bitcoincalculator.tools/tr/hesaplayicilar' },
    { name: 'Yatırım Hesaplayıcısı', url: 'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-yatirim-hesaplayicisi' },
  ] : [
    { name: 'Home', url: 'https://bitcoincalculator.tools/' },
    { name: 'Calculators', url: 'https://bitcoincalculator.tools/calculators' },
    { name: 'Investment Calculator', url: 'https://bitcoincalculator.tools/calculators/investment' },
  ];

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Bitcoin Investment Calculator",
    "description": "Put in any dollar amount today and see what it could be worth in 1, 5, 10 or 20 years. Compare Bitcoin growth against gold and the S&P 500 side by side.",
    "url": "https://bitcoincalculator.tools/calculators/investment",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "featureList": [
      "Multiple growth models (Conservative, Moderate, Aggressive, Custom)",
      "Lump sum and DCA combined projections",
      "Interactive growth projection chart",
      "Side-by-side asset comparison (S&P 500, Gold, Savings)",
      "Inflation-adjusted returns",
      "Price target reverse lookup",
      "Live Bitcoin price integration",
      "PDF and PNG export"
    ],
    "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
    "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" }
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Project Your Bitcoin Investment Returns",
    "description": "Model your Bitcoin investment growth with multiple scenarios",
    "step": [
      { "@type": "HowToStep", "name": "Enter Your Investment", "text": "Input a lump sum amount, a recurring monthly contribution, or both" },
      { "@type": "HowToStep", "name": "Choose a Growth Model", "text": "Select Conservative (10%), Moderate (25%), Aggressive (50%), or set a custom annual growth rate" },
      { "@type": "HowToStep", "name": "Set Your Time Horizon", "text": "Choose a projection period from 1 to 20 years" },
      { "@type": "HowToStep", "name": "Compare and Decide", "text": "View projected returns vs. S&P 500, Gold, and savings accounts" }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{language === 'tr' ? 'Bitcoin Yatırım Hesaplayıcısı | 1-20 Yıl Büyüme Projeksiyonu' : 'Bitcoin Investment Calculator 2026 — 1-20 Year Growth Projection'}</title>
        <meta name="description" content={language === 'tr' ? 'Bitcoin yatırım hesaplayıcısı ile bugünkü yatırımınızın 1-20 yıl içinde ne olabileceğini görün. Altın ve S&P 500 karşılaştırması, canlı BTC fiyatı.' : 'Put in any dollar amount today and see what it could be worth in 1, 5, 10 or 20 years. Compare Bitcoin growth against gold and the S&P 500 side by side.'} />
        <link rel="canonical" href={language === 'tr' ? 'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-yatirim-hesaplayicisi' : 'https://bitcoincalculator.tools/calculators/investment'} />

        {/* hreflang alternates emitted globally via <GlobalHreflang /> */}
        <meta property="og:title" content={language === 'tr' ? 'Bitcoin Yatırım Hesaplayıcısı — Ücretsiz Büyüme Projektörü' : 'Bitcoin Investment Calculator'} />
        <meta property="og:description" content={language === 'tr' ? 'Bitcoin yatırım hesaplayıcısı ile tutarınızın 1-20 yıl içinde ne olabileceğini görün. Altın ve S&P 500 ile yan yana karşılaştırın.' : 'Put in any dollar amount today and see what it could be worth in 1, 5, 10 or 20 years. Compare Bitcoin growth against gold and the S&P 500 side by side.'} />
        <meta property="og:url" content={language === 'tr' ? 'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-yatirim-hesaplayicisi' : 'https://bitcoincalculator.tools/calculators/investment'} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="bitcoincalculator.tools" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={language === 'tr' ? 'Bitcoin Yatırım Hesaplayıcısı' : 'Bitcoin Investment Calculator'} />
        <meta name="twitter:description" content={language === 'tr' ? 'Bitcoin yatırımınızın 1-20 yıl içinde ne olabileceğini görün. Altın ve S&P 500 ile karşılaştırın.' : 'See what any Bitcoin investment could be worth in 1, 5, 10 or 20 years. Compare vs gold and S&P 500.'} />
        <meta name="twitter:creator" content="@web3believers" />

        <meta name="twitter:site" content="@web3believers" />
        {language !== 'tr' && <>
        <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            { "@type": "Question", "name": "How much will $100 of Bitcoin be worth in 5 years?", "acceptedAnswer": { "@type": "Answer", "text": "That depends on Bitcoin's future growth rate. Using our calculator with a moderate 25% annual growth model, $100 invested today could grow to approximately $305 in 5 years. With an aggressive 50% model, it could reach about $759." }},
            { "@type": "Question", "name": "Is it too late to invest in Bitcoin?", "acceptedAnswer": { "@type": "Answer", "text": "Many people asked this same question when Bitcoin was at $100, $1,000, $10,000, and $50,000. Bitcoin's long-term growth has consistently rewarded patient investors who held for 4+ years." }},
            { "@type": "Question", "name": "What is Bitcoin's average annual return (CAGR)?", "acceptedAnswer": { "@type": "Answer", "text": "Bitcoin's CAGR since 2010 has been approximately 75-100% per year. However, as Bitcoin matures, most analysts expect this rate to decrease. Our calculator offers Conservative (10%), Moderate (25%), and Aggressive (50%) models." }},
            { "@type": "Question", "name": "How does Bitcoin compare to the S&P 500?", "acceptedAnswer": { "@type": "Answer", "text": "The S&P 500 has historically returned approximately 10% annually. Bitcoin has significantly outperformed this over every 4+ year holding period. Our calculator lets you compare side-by-side." }},
            { "@type": "Question", "name": "How does Bitcoin compare to gold as an investment?", "acceptedAnswer": { "@type": "Answer", "text": "Gold has historically returned approximately 7% annually. Bitcoin shares some properties with gold but has significantly higher volatility and growth potential." }},
            { "@type": "Question", "name": "What growth rate should I use for Bitcoin projections?", "acceptedAnswer": { "@type": "Answer", "text": "Our Conservative model (10%) equals the stock market's historical return. Moderate (25%) reflects adoption-adjusted return. Aggressive (50%) discounts Bitcoin's historical average for market maturation." }},
            { "@type": "Question", "name": "Can I invest small amounts in Bitcoin?", "acceptedAnswer": { "@type": "Answer", "text": "Yes! Bitcoin is divisible into 100 million satoshis. You can buy as little as a few dollars worth on most exchanges." }},
            { "@type": "Question", "name": "What is dollar cost averaging into Bitcoin?", "acceptedAnswer": { "@type": "Answer", "text": "DCA means investing a fixed amount at regular intervals regardless of price. This reduces the impact of volatility by buying more BTC when prices are low and less when high." }},
            { "@type": "Question", "name": "How does inflation affect my Bitcoin investment?", "acceptedAnswer": { "@type": "Answer", "text": "A 3% annual inflation rate means $100 today buys about $74 worth of goods in 10 years. Our calculator includes an inflation adjustment toggle to show real purchasing power growth." }},
            { "@type": "Question", "name": "How do I calculate Bitcoin profit?", "acceptedAnswer": { "@type": "Answer", "text": "Enter your buy price, sell price, and amount to see profit in USD, ROI percentage, and capital gains. Our investment calculator models projected profit over any time horizon." }},
            { "@type": "Question", "name": "What is a good ROI on Bitcoin?", "acceptedAnswer": { "@type": "Answer", "text": "Bitcoin's historical average annual return has been approximately 60-80% since 2012, though with extreme volatility." }},
            { "@type": "Question", "name": "How much Bitcoin should I own?", "acceptedAnswer": { "@type": "Answer", "text": "Most financial advisors suggest a 1-10% portfolio allocation to Bitcoin depending on risk tolerance. At 5%, a $100,000 portfolio would hold $5,000 in BTC." }},
            { "@type": "Question", "name": "Is Bitcoin a better investment than real estate?", "acceptedAnswer": { "@type": "Answer", "text": "Real estate offers rental income and leverage but requires large capital and active management. Bitcoin offers high liquidity, stronger historical appreciation, but significantly higher volatility." }},
            { "@type": "Question", "name": "What happens to my Bitcoin investment during a crash?", "acceptedAnswer": { "@type": "Answer", "text": "Bitcoin has experienced drawdowns of 50-85% multiple times. In every case, the price recovered and set new all-time highs within 2-3 years." }},
            { "@type": "Question", "name": "Should I invest in Bitcoin or Bitcoin ETFs?", "acceptedAnswer": { "@type": "Answer", "text": "Spot Bitcoin ETFs offer convenient exposure without managing wallets. Direct ownership gives full control and zero ongoing fees. Both benefit from the same price appreciation." }},
            { "@type": "Question", "name": "How do taxes work on Bitcoin investments?", "acceptedAnswer": { "@type": "Answer", "text": "In the US, Bitcoin is taxed as property. Short-term gains are taxed at ordinary income rates. Long-term gains qualify for 0%, 15%, or 20% rates depending on income." }},
            { "@type": "Question", "name": "What is the minimum amount to invest in Bitcoin?", "acceptedAnswer": { "@type": "Answer", "text": "There is no minimum. Most exchanges allow purchases starting from $1-$10. Even $25 per week can accumulate a meaningful position over several years." }},
            { "@type": "Question", "name": "How does the Bitcoin halving affect investment returns?", "acceptedAnswer": { "@type": "Answer", "text": "The halving reduces new BTC supply by 50% every four years. Historically, each halving has preceded a major bull run. The most recent halving occurred in April 2024." }}
          ]
        })}</script>
        </>}

        {language === 'tr' && <>
          <script type="application/ld+json">{JSON.stringify({
            "@context": "https://schema.org", "@type": "WebApplication",
            "name": "Bitcoin Yatırım Hesaplayıcısı", "inLanguage": "tr",
            "url": "https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-yatirim-hesaplayicisi",
            "description": "Bitcoin yatırım hesaplayıcısı: bugün yatırdığınız tutarın 1-20 yıl içinde ne olabileceğini görün.",
            "applicationCategory": "FinanceApplication", "operatingSystem": "Any",
            "offers": {"@type": "Offer", "price": "0", "priceCurrency": "TRY"},
            "provider": {"@type": "Organization", "name": "Bitcoin Calculator Tools"},
            "author": {"@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools"}
          })}</script>
          <script type="application/ld+json">{JSON.stringify({
            "@context": "https://schema.org", "@type": "FAQPage", "inLanguage": "tr",
            "mainEntity": [
              {"@type": "Question", "name": "1.000 TL Bitcoin yatırımı 10 yılda ne olur?", "acceptedAnswer": {"@type": "Answer", "text": "Muhafazakâr yüzde 10 büyüme senaryosunda 1.000 TL 10 yılda yaklaşık 2.594 TL olabilir. Yüzde 30'luk senaryo ile 13.786 TL'ye ulaşabilir. Bitcoin'in tarihsel YBBO'su çok daha yüksek olmuştur; ancak geçmiş performans gelecekteki sonuçları garanti etmez."}},
              {"@type": "Question", "name": "Bitcoin'e yatırım yapmak için çok geç mi?", "acceptedAnswer": {"@type": "Answer", "text": "Birçok kişi Bitcoin 100, 1.000, 10.000 ve 50.000 dolar iken de aynı soruyu sordu. Tüm bu zamanlarda yatırım yapanlar uzun vadede kârlı çıktı. Bitcoin'in toplam piyasa değeri hâlâ küresel altın piyasasının yalnızca küçük bir kısmını oluşturmaktadır."}},
              {"@type": "Question", "name": "Bitcoin'in ortalama yıllık getirisi nedir?", "acceptedAnswer": {"@type": "Answer", "text": "2010'dan bu yana Bitcoin'in bileşik yıllık büyüme oranı yaklaşık yüzde 75-100 olmuştur. Son birkaç yılda bu oran düşme eğilimindedir. Analistler, piyasa olgunlaştıkça getirinin yüzde 20-40 aralığına yerleşebileceğini öngörmektedir."}},
              {"@type": "Question", "name": "Bitcoin S&P 500 ile nasıl karşılaştırılır?", "acceptedAnswer": {"@type": "Answer", "text": "S&P 500 tarihsel olarak yılda yaklaşık yüzde 10 getiri sağlamaktadır. Bitcoin'in tarihsel getirisi çok daha yüksek olmakla birlikte oynaklığı da çok daha fazladır. Birçok portföy yöneticisi dengeli bir portföyde yüzde 5-15 Bitcoin tutmayı önermektedir."}},
              {"@type": "Question", "name": "Enflasyon Bitcoin yatırımımı nasıl etkiler?", "acceptedAnswer": {"@type": "Answer", "text": "Yüzde 3'lük yıllık enflasyon, bugünkü 1.000 TL'nin 10 yıl içinde yaklaşık 744 TL değerinde alım gücüne sahip olacağı anlamına gelir. Bitcoin, tasarımı gereği enflasyona karşı bir koruma olarak konumlandırılmaktadır; zira toplam arzı 21 milyonla sınırlıdır."}}
            ]
          })}</script>
        </>}
              <script type="application/ld+json">{JSON.stringify(buildCalculatorSpeakable(language === 'tr' ? 'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-yatirim-hesaplayicisi' : 'https://bitcoincalculator.tools/calculators/investment', language))}</script>
      </Helmet>
        <HelmetOgImage slug="bitcoin-investment-calculator" enAlt={`Bitcoin Investment Calculator | bitcoincalculator.tools`} />

      <DatasetSchema
        name="Bitcoin Investment Returns Dataset (CAGR & ROI by Year)"
        description="Year-by-year Bitcoin investment performance dataset showing CAGR, total ROI, and annualised drawdown for every entry year from 2011 to today."
        url="https://bitcoincalculator.tools/calculators/investment"
        temporalCoverage="2011-01-01/.."
        variableMeasured={["Entry year", "Exit value (USD)", "Total ROI %", "CAGR %", "Max drawdown %"]}
        keywords={["bitcoin investment returns", "btc cagr by year", "bitcoin roi calculator dataset"]}
      />

      <BreadcrumbSchema language={language} items={breadcrumbItems} />

      <PageBackground variant="clean">
        <Header />

        <main id="main-content" className="pt-20 relative z-10">
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb items={[
              { label: language === 'tr' ? 'Hesaplayıcılar' : 'Calculators', href: language === 'tr' ? '/tr/hesaplayicilar' : '/calculators' },
              { label: t('investment.breadcrumb') },
            ]} />
          </div>

          <section className="container mx-auto px-6 py-16 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6 text-sm font-medium text-primary">
              <TrendingUp className="w-4 h-4" />
              {t('investment.badge')}
            </div>

            <h1 className="text-h1 font-bold text-foreground mb-4">
              {language === 'tr'
                ? <>Bitcoin <span className="text-gradient-premium">Yatırım</span> Hesaplayıcısı</>
                : <>Bitcoin <span className="text-gradient-premium">Investment</span> Calculator</>}
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              {language === 'tr'
                ? 'Bitcoin yatırımınızın 1-20 yıl içinde ne kadar değer kazanabileceğini görün. Büyüme senaryolarını modelleyin, hisse senetleri ve altınla karşılaştırın, canlı BTC fiyatlarıyla finansal geleceğinizi planlayın.'
                : 'See how much your Bitcoin investment could be worth in 1–20 years. Model growth scenarios, compare with stocks and gold, and plan your financial future with live BTC prices.'}
            </p>

            <div className="max-w-sm mx-auto">
              <CompactLiveBitcoinPrice currency={defaultCurrency} />
            </div>
          </section>

          <section className="container mx-auto px-6 pb-20">
            <PageQuickAnswer
              en='This investment calculator projects what a Bitcoin position could be worth over time. Enter your starting amount, any recurring contribution, a time horizon and an expected annual return, and it returns projected value, total invested and profit, with conservative, base and bullish scenarios shown side by side.'
              tr='Bu yatırım hesaplayıcısı bir Bitcoin pozisyonunun zaman içinde ne kadar değerleneceğini projekte eder. Başlangıç tutarınızı, düzenli katkınızı, vadenizi ve beklenen yıllık getiriyi girin; projeksiyon değeri, toplam yatırım ve kârı muhafazakâr, temel ve iyimser senaryolarla yan yana gösterir.'
            />
            <div className="max-w-6xl mx-auto space-y-10">
              <OfflineIndicator />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                <ErrorBoundary>
                  <InvestmentInputPanel
                    lumpSum={lumpSum}
                    setLumpSum={setLumpSum}
                    monthlyContribution={monthlyContribution}
                    setMonthlyContribution={setMonthlyContribution}
                    timeHorizon={timeHorizon}
                    setTimeHorizon={setTimeHorizon}
                    selectedModels={selectedModels}
                    onToggleModel={handleToggleModel}
                    customCAGR={customCAGR}
                    setCustomCAGR={setCustomCAGR}
                    showCustom={showCustom}
                    setShowCustom={setShowCustom}
                    showInflation={showInflation}
                    setShowInflation={setShowInflation}
                    inflationRate={inflationRate}
                    setInflationRate={setInflationRate}
                    useLivePrice={useLivePrice}
                    setUseLivePrice={setUseLivePrice}
                    customBtcPrice={customBtcPrice}
                    setCustomBtcPrice={setCustomBtcPrice}
                    liveBtcPrice={liveBtcPrice}
                    targetBtcPrice={targetBtcPrice}
                    setTargetBtcPrice={setTargetBtcPrice}
                    showPriceTarget={showPriceTarget}
                    setShowPriceTarget={setShowPriceTarget}
                    currency={defaultCurrency}
                  />
                </ErrorBoundary>

                <ErrorBoundary>
                  <InvestmentResultsPanel
                    results={filteredResults}
                    showInflation={showInflation}
                    priceTargetResult={priceTargetResult}
                    targetBtcPrice={targetBtcPrice}
                    assetComparisons={assetComparisons}
                    currency={defaultCurrency}
                  />
                </ErrorBoundary>
              </div>

              {/* Projection Chart */}
              {filteredResults.length > 0 && (
                <div>
                  <div className="flex items-center justify-end gap-3 mb-4">
                    <Label htmlFor="asset-comparison-toggle" className="text-sm text-muted-foreground cursor-pointer">
                      {t('investment.chartToggle')}
                    </Label>
                    <Switch
                      id="asset-comparison-toggle"
                      checked={showAssetComparison}
                      onCheckedChange={setShowAssetComparison}
                    />
                  </div>
                  <InvestmentProjectionChart
                    results={filteredResults}
                    showInflation={showInflation}
                    showAssetComparison={showAssetComparison}
                    lumpSum={lumpSum}
                    monthlyContribution={monthlyContribution}
                    timeHorizon={timeHorizon}
                    currency={defaultCurrency}
                  />
                </div>
              )}

              {/* Export Report */}
              <InvestmentExportReport
                results={filteredResults}
                lumpSum={lumpSum}
                monthlyContribution={monthlyContribution}
                timeHorizon={timeHorizon}
                btcPrice={currentBtcPrice}
              />
            </div>
          </section>

          {/* SEO H2 Section */}
          <section className="container mx-auto px-6 pb-12">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-h2 font-bold text-foreground mb-4">
                Bitcoin Growth Calculator
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Model how Bitcoin could grow over time using this Bitcoin growth calculator. Set your investment amount, time horizon, and expected annual growth rate to project future portfolio value under conservative, moderate, and optimistic scenarios.
              </p>
            </div>
          </section>

          {/* Static Comparison Table for AI/SEO */}
          <InvestmentComparisonTable />

          <InvestmentSipTable />
          <InvestmentContentSections />

          <InvestmentHowItWorksSection />
          <PreFAQPlacement slug="investment" />
          <InvestmentFAQSection />
          {language === 'tr' && (
            <section className="container mx-auto px-6 pb-12">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-h2 font-bold text-foreground mb-4">Bitcoin Yatırım Hesaplayıcısı: 1-20 Yıl Büyüme Projeksiyonu</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Bitcoin yatırım hesaplayıcısı, bugün yatırdığınız tutarın farklı büyüme senaryoları altında gelecekte ne olabileceğini gösterir. Muhafazakâr, orta ve iyimser büyüme modellerini seçin; altın ve S&P 500 ile yan yana karşılaştırın.
                </p>
                <h3 className="text-h3 font-semibold text-foreground mb-2">Bitcoin Yatırımı S&P 500 ile Nasıl Karşılaştırılır?</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  S&P 500 tarihsel olarak yılda yaklaşık yüzde 10 getiri sağlamıştır. Bitcoin'in geçmiş on yıllık YBBO'su çok daha yüksek olmakla birlikte oynaklığı da fazladır. Hesaplayıcımız her iki varlık sınıfını aynı başlangıç tutarı ve zaman dilimi için karşılaştırmanıza olanak tanır.
                </p>
                <h3 className="text-h3 font-semibold text-foreground mb-2">Enflasyona Göre Düzeltilmiş Büyüme</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Enflasyon düzeltmesi seçeneğini etkinleştirerek bugünkü satın alma gücü cinsinden gerçek getiriyi hesaplayın. Türkiye'nin yüksek enflasyon ortamında bu özellik, gerçek değer korumasını değerlendirmenin kritik bir aracıdır.
                </p>
              </div>
            </section>
          )}

          <div className="container mx-auto px-4 sm:px-6"><div className="max-w-6xl mx-auto"><QuickShareLinkPanel slug="investment" headline={language === 'tr' ? 'Bitcoin Yatırım Hesaplayıcı' : 'Bitcoin Investment Calculator'} /></div></div>
          <RelatedCalculators />

          {/* Disclaimer */}
          <section className="container mx-auto px-6 pb-16">
            <div className="max-w-3xl mx-auto">
              <Card className="glass-morphism-card border-border/20 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{language === 'tr' ? 'Feragatname' : 'Disclaimer'}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('investment.disclaimer')}
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

export default BitcoinInvestmentCalculator;
