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
  DEFAULT_INFLATION_RATE,
  type InvestmentInputs,
} from '@/services/investmentProjectionCalculator';
import { useLanguage } from '@/contexts/LanguageContext';
import { buildCalculatorSpeakable } from '@/components/seo/calculatorSpeakable';
import { useLocale } from '@/hooks/useLocale';
import { QuickShareLinkPanel } from '@/components/share-export';
import { PageQuickAnswer } from "@/components/calculator/PageQuickAnswer";
import { useSmartZones } from "@/hooks/useSmartZones";
import { PlacementProvider } from "@/contexts/PlacementProvider";
import { useSafeLanguage } from "@/hooks/useSafeLanguage";

const BitcoinInvestmentCalculator: React.FC = () => {
  const { language, t } = useLanguage();
  const { defaultCurrency } = useLocale();
  const { price: liveBtcPrice } = useLiveBitcoinPrice(defaultCurrency);

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

  const lang = useSafeLanguage();
  const sz = useSmartZones({
    pageSlug: "investment",
    hasResultSignal: filteredResults.length > 0,
    lang,
    resultSignals: ["accumulation", "long-term"],
  });

  const breadcrumbItems = language==='tr' ? [
    { label: 'Ana Sayfa', href: 'https://bitcoincalculator.tools/' },
    { label: 'Hesaplayıcılar', href: 'https://bitcoincalculator.tools/tr/hesaplayicilar' },
    { label: 'Yatırım Hesaplayıcısı', href: 'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-yatirim-hesaplayicisi' },
  ] : [
    { label: 'Home', href: 'https://bitcoincalculator.tools/' },
    { label: 'Calculators', href: 'https://bitcoincalculator.tools/calculators' },
    { label: 'Investment Calculator', href: 'https://bitcoincalculator.tools/calculators/investment' },
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

  const seoItems = breadcrumbItems.map(item => ({ name: item.label, url: item.href }));

  return (
    <PlacementProvider value={sz}>
      <Helmet>
        <title>{language === 'tr' ? 'Bitcoin Yatırım Hesaplayıcısı | 1-20 Yıl Büyüme Projeksiyonu' : 'Bitcoin Investment Calculator — $1,000 in 5 Years & SIP Returns'}</title>
        <meta name="description" content={language === 'tr' ? 'Bitcoin yatırım hesaplayıcısı ile bugünkü yatırımınızın 1-20 yıl içinde ne olabileceğini görün. Altın ve S&P 500 karşılaştırması, canlı BTC fiyatı.' : 'See what $1,000 in Bitcoin could be worth in 1, 5, 10 or 20 years, plus real SIP returns for the last 3, 5 and 10 years. Compare against gold and the S&P 500.'} />
        <link rel="canonical" href={language === 'tr' ? 'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-yatirim-hesaplayicisi' : 'https://bitcoincalculator.tools/calculators/investment'} />
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

      <BreadcrumbSchema language={language} items={seoItems} />

      <PageBackground variant="clean">
        <Header />

        <main id="main-content" className="pt-20 pb-28 md:pb-20 relative z-10">
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb items={breadcrumbItems} />
          </div>

          <section aria-labelledby="inv-hero-heading" className="container mx-auto px-6 py-16 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6 text-sm font-medium text-primary max-w-full">
              <TrendingUp className="w-4 h-4 shrink-0" />
              <span className="break-words">{language === 'tr' ? 'Yatırım Projektörü' : 'Investment Projector'}</span>
            </div>

            <h1 id="inv-hero-heading" className="text-h1 font-bold text-foreground mb-6">
              {language === 'tr' ? 'Bitcoin Yatırım Hesaplayıcısı' : 'Bitcoin Investment Calculator'}
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              {language === 'tr'
                ? 'Bitcoin yatırımınızın geleceğini görün. Lump sum veya DCA modelleriyle 1-20 yıllık büyüme projeksiyonları oluşturun.'
                : 'Project your Bitcoin portfolio growth. Model lump sum or recurring investments across multiple growth scenarios over 1-20 years.'}
            </p>

            <CompactLiveBitcoinPrice currency={defaultCurrency} />
          </section>

          {/* SlotA — pre-calc anchor */}
          <div className="container mx-auto px-6 max-w-5xl"><sz.SlotA /></div>

          <section className="container mx-auto px-6 pb-20">
            <div className="max-w-6xl mx-auto space-y-12">
              <PageQuickAnswer
                en="The Bitcoin Investment Calculator projects the future value of a Bitcoin position over 1-20 years. Input a starting amount and monthly DCA, then choose between Conservative (10%), Moderate (25%), or Aggressive (50%) annual growth models to see projected USD value, ROI, and total BTC holdings."
                tr="Bitcoin Yatırım Hesaplayıcısı, bir Bitcoin pozisyonunun 1-20 yıl içindeki gelecekteki değerini tahmin eder. Bir başlangıç tutarı ve aylık DCA girin, ardından projected USD değerini, ROI'yi ve toplam BTC varlıklarını görmek için Muhafazakâr (%10), Orta (%25) veya Agresif (%50) yıllık büyüme modelleri arasından seçim yapın."
              />
              <OfflineIndicator />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                <div className="lg:sticky lg:top-24 lg:self-start">
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
                    showPriceTarget={showPriceTarget}
                    setShowPriceTarget={setShowPriceTarget}
                    targetBtcPrice={targetBtcPrice}
                    setTargetBtcPrice={setTargetBtcPrice}
                    currency={defaultCurrency}
                  />
                </div>

                <div className="space-y-4">
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
                  
                  {/* SlotB — result adjacent */}
                  <sz.SlotB />
                </div>
              </div>

              {filteredResults.length > 0 && (
                <div className="animate-fade-in space-y-12">
                  <InvestmentProjectionChart
                    results={filteredResults}
                    showInflation={showInflation}
                    showAssetComparison={showAssetComparison}
                    lumpSum={lumpSum}
                    monthlyContribution={monthlyContribution}
                    timeHorizon={timeHorizon}
                    currency={defaultCurrency}
                  />

                  <InvestmentSipTable />

                  <InvestmentExportReport
                    results={filteredResults}
                    lumpSum={lumpSum}
                    monthlyContribution={monthlyContribution}
                    timeHorizon={timeHorizon}
                    btcPrice={currentBtcPrice}
                  />
                </div>
              )}
            </div>
          </section>

          {/* SlotC — mid content */}
          <div className="container mx-auto px-6 max-w-5xl"><sz.SlotC /></div>

          <InvestmentHowItWorksSection />
          <InvestmentContentSections />
          <InvestmentComparisonTable />
          <InvestmentFAQSection />

          <section className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <QuickShareLinkPanel slug="investment" headline={language === 'tr' ? 'Bitcoin Yatırım Hesaplayıcı' : 'Bitcoin Investment Calculator'} />
            </div>
          </section>

          <RelatedCalculators />

          <section className="container mx-auto px-6 pb-16">
            <div className="max-w-3xl mx-auto">
              <Card className="glass-morphism-card border-border/20 shadow-sm">
                <CardContent className="p-6 text-sm text-muted-foreground">
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-warning" />
                    {language === 'tr' ? 'Yasal Uyarı' : 'Investment Disclaimer'}
                  </h3>
                  <p>
                    {language === 'tr'
                      ? 'Bu hesaplayıcı yalnızca eğitim ve bilgilendirme amaçlıdır. Finansal tavsiye niteliği taşımaz. Bitcoin yüksek oynaklığa sahiptir ve geçmiş performans gelecekteki getirilerin garantisi değildir.'
                      : 'This calculator is for educational and informational purposes only. It does not constitute financial advice. Bitcoin is subject to extreme volatility, and past performance is no guarantee of future returns.'}
                  </p>
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

export default BitcoinInvestmentCalculator;
