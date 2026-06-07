import React, { useState, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AffiliatePlacement } from "@/components/affiliateAI/AffiliatePlacement";
import { Breadcrumb } from '@/components/Breadcrumb';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { PageBackground } from '@/components/modern/PageBackground';
import { CompactLiveBitcoinPrice } from '@/components/CompactLiveBitcoinPrice';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { BitcoinLoanInputPanel, LoanFormInputs, LoanValidationErrors } from '@/components/bitcoin-loan/BitcoinLoanInputPanel';
import { BitcoinLoanResultsPanel } from '@/components/bitcoin-loan/BitcoinLoanResultsPanel';
import { BitcoinLoanHowToUseSection } from '@/components/bitcoin-loan/BitcoinLoanHowToUseSection';
import { BitcoinLoanFAQSection } from '@/components/bitcoin-loan/BitcoinLoanFAQSection';
import { BitcoinLoanExportReport } from '@/components/bitcoin-loan/BitcoinLoanExportReport';
import { BitcoinLoanShareCard } from '@/components/bitcoin-loan/BitcoinLoanShareCard';
import RelatedCalculators from '@/components/RelatedCalculators';
import { MethodologyBlock } from '@/components/calculator/MethodologyBlock';
import { Landmark, Shield, Scale, AlertTriangle, TrendingUp } from 'lucide-react';
import { calculateBitcoinLoan, LoanResult } from '@/services/bitcoinLoanCalculator';
import { useLanguage } from "@/contexts/LanguageContext";

const DEFAULT_INPUTS: LoanFormInputs = {
  btcCollateral: 0,
  btcPrice: 0,
  loanAmountUsd: 0,
  interestRateAnnual: 8,
  loanTermMonths: 12,
  initialLtv: 50,
  marginCallLtv: 65,
  liquidationLtv: 80,
  expectedBtcGrowthRate: 25,
  platform: 'conservative',
};

const loanPlatformRows = [
  { platform: 'Ledn', custody: 'Centralized custody; BTC held with institutional custodians', ltv: 'Up to 50% commonly advertised', margin: 'Margin call and liquidation thresholds depend on the active loan agreement', notes: 'Rates and availability vary by jurisdiction; verify current terms before applying', fit: 'Borrowers who want a known CeFi lender and accept third-party custody risk' },
  { platform: 'Unchained', custody: 'Collaborative custody model with multisig structure', ltv: 'Often lower-LTV, conservative structures', margin: 'Designed around overcollateralization; exact thresholds depend on product terms', notes: 'Availability can be limited and underwriting may be stricter than generic CeFi', fit: 'Borrowers who value custody transparency and lower operational risk' },
  { platform: 'Nexo', custody: 'Centralized platform custody; terms vary by region and account status', ltv: 'Flexible LTV ranges when available', margin: 'Automated collateral health monitoring and liquidation rules', notes: 'Product availability, rates, and eligible regions change frequently', fit: 'Users comparing flexible CeFi credit lines, with careful counterparty review' },
  { platform: 'Generic CeFi lender', custody: 'Usually full lender custody or third-party custodian custody', ltv: '25%–60% depending on risk appetite', margin: 'Higher LTV means margin calls arrive faster during drawdowns', notes: 'Use this fallback when live lender rates are unstable or unavailable', fit: 'Early planning before checking exact lender disclosures' },
];

const BitcoinLoanCalculator = () => {
  const { language, t } = useLanguage();
  const [inputs, setInputs] = useState<LoanFormInputs>({ ...DEFAULT_INPUTS });
  const [results, setResults] = useState<LoanResult | null>(null);
  const [drawdownScenario, setDrawdownScenario] = useState(30);
  const [validationErrors, setValidationErrors] = useState<LoanValidationErrors>({});
  const resultsRef = useRef<HTMLDivElement>(null);

  const drawdownAnalysis = results ? (() => {
    const stressedPrice = inputs.btcPrice * (1 - drawdownScenario / 100);
    const stressedCollateralValue = inputs.btcCollateral * stressedPrice;
    const stressedLtv = stressedCollateralValue > 0 ? (results.loanAmountUsd / stressedCollateralValue) * 100 : 0;
    const status = stressedLtv >= inputs.liquidationLtv ? 'Liquidation zone' : stressedLtv >= inputs.marginCallLtv ? 'Margin call zone' : 'Healthy buffer';
    const collateralNeededForMargin = results.loanAmountUsd / (inputs.marginCallLtv / 100);
    const collateralNeededForLiquidation = results.loanAmountUsd / (inputs.liquidationLtv / 100);
    return {
      stressedPrice,
      stressedLtv,
      status,
      marginGap: stressedCollateralValue - collateralNeededForMargin,
      liquidationGap: stressedCollateralValue - collateralNeededForLiquidation,
    };
  })() : null;

  const validate = useCallback((): boolean => {
    const errors: LoanValidationErrors = {};
    if (!inputs.btcCollateral || inputs.btcCollateral <= 0) errors.btcCollateral = 'Enter a BTC amount greater than 0';
    if (!inputs.btcPrice || inputs.btcPrice <= 0) errors.btcPrice = 'Enter the Bitcoin price';
    if (!inputs.loanAmountUsd || inputs.loanAmountUsd <= 0) errors.loanAmountUsd = 'Enter the loan amount';
    if (!inputs.interestRateAnnual || inputs.interestRateAnnual <= 0) errors.interestRateAnnual = 'Enter an interest rate';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [inputs]);

  const handleCalculate = () => {
    if (!validate()) return;
    const result = calculateBitcoinLoan({
      btcCollateral: inputs.btcCollateral,
      btcPrice: inputs.btcPrice,
      loanAmountUsd: inputs.loanAmountUsd,
      interestRateAnnual: inputs.interestRateAnnual,
      loanTermMonths: inputs.loanTermMonths,
      initialLtv: inputs.initialLtv,
      marginCallLtv: inputs.marginCallLtv,
      liquidationLtv: inputs.liquidationLtv,
      expectedBtcGrowthRate: inputs.expectedBtcGrowthRate,
    });
    setResults(result);
    setTimeout(() => {
      if (resultsRef.current && window.innerWidth < 1024) {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleReset = () => {
    setInputs({ ...DEFAULT_INPUTS });
    setResults(null);
    setValidationErrors({});
  };

  const faqSchema = [
    { "@type": "Question", "name": "What is a Bitcoin-backed loan?", "acceptedAnswer": { "@type": "Answer", "text": "A Bitcoin-backed loan lets you borrow fiat currency by locking your Bitcoin as collateral. You keep ownership of your BTC — the lender holds it until you repay the loan. Unlike selling, borrowing doesn't trigger a taxable capital gains event." }},
    { "@type": "Question", "name": "What is LTV (Loan-to-Value) ratio?", "acceptedAnswer": { "@type": "Answer", "text": "LTV is the ratio of your loan amount to your Bitcoin collateral value. A 50% LTV on $100,000 of BTC means you borrow $50,000. Lower LTV ratios are safer because Bitcoin's price must drop further before triggering liquidation." }},
    { "@type": "Question", "name": "What happens if Bitcoin's price drops during my loan?", "acceptedAnswer": { "@type": "Answer", "text": "If Bitcoin's price falls far enough, your LTV rises. When it reaches the margin call threshold, the platform asks you to add collateral. If it reaches the liquidation threshold, the platform force-sells your Bitcoin to recover the loan." }},
    { "@type": "Question", "name": "How is the liquidation price calculated?", "acceptedAnswer": { "@type": "Answer", "text": "Liquidation price = (Loan Amount ÷ BTC Collateral) ÷ (Liquidation LTV ÷ 100). For example, borrowing $50,000 against 1 BTC with 80% liquidation LTV gives a liquidation price of $62,500." }},
    { "@type": "Question", "name": "Is borrowing against Bitcoin better than selling?", "acceptedAnswer": { "@type": "Answer", "text": "It depends. Borrowing avoids capital gains tax (up to 23.8%) and keeps Bitcoin upside exposure. But you pay interest and face liquidation risk. Our calculator compares both scenarios with your specific numbers." }},
    { "@type": "Question", "name": "What interest rates do Bitcoin loan platforms charge?", "acceptedAnswer": { "@type": "Answer", "text": "Rates vary: 4-8% for conservative platforms, 8-12% for standard CeFi, and 5-20%+ for DeFi protocols. Rates depend on LTV ratio, loan term, and platform." }},
    { "@type": "Question", "name": "Can I lose more than my collateral?", "acceptedAnswer": { "@type": "Answer", "text": "Most Bitcoin-backed loans are non-recourse — the lender can only seize your collateral, not your other assets. However, terms vary by platform." }},
    { "@type": "Question", "name": "Is this Bitcoin loan calculator free?", "acceptedAnswer": { "@type": "Answer", "text": "Yes — completely free, no signup required. All calculations run in your browser for privacy. It covers LTV analysis, liquidation pricing, amortization schedules, and a borrow-vs-sell tax comparison." }},
  ];

  const faqSchemaTr = [
    { "@type": "Question", "name": "Bitcoin teminatlı kredi nedir?", "acceptedAnswer": { "@type": "Answer", "text": "Bitcoin teminatlı kredi, Bitcoin'inizi teminat olarak kilitleyerek fiat para birimi ödünç almanıza olanak tanır. BTC'nizin mülkiyetini elinde tutarsınız — borç vereni krediyi geri ödeyene kadar onu tutar. Satıştan farklı olarak, borçlanma vergiye tabi bir sermaye kazancı olayını tetiklemez." }},
    { "@type": "Question", "name": "LTV (Kredi-Teminat Oranı) nedir?", "acceptedAnswer": { "@type": "Answer", "text": "LTV, kredi tutarınızın Bitcoin teminat değerinize oranıdır. 100.000 $ BTC üzerinde %50 LTV, 50.000 $ ödünç aldığınız anlamına gelir. Daha düşük LTV oranları daha güvenlidir çünkü tasfiye tetiklenmeden önce Bitcoin fiyatının daha fazla düşmesi gerekir." }},
    { "@type": "Question", "name": "Kredim sırasında Bitcoin fiyatı düşerse ne olur?", "acceptedAnswer": { "@type": "Answer", "text": "Bitcoin fiyatı yeterince düşerse LTV'niz artar. Marjin çağrısı eşiğine ulaştığında platform ek teminat eklemenizi ister. Tasfiye eşiğine ulaşırsa platform, krediyi geri almak için Bitcoin'inizi zorla satar." }},
    { "@type": "Question", "name": "Tasfiye fiyatı nasıl hesaplanır?", "acceptedAnswer": { "@type": "Answer", "text": "Tasfiye fiyatı = (Kredi Tutarı ÷ BTC Teminatı) ÷ (Tasfiye LTV ÷ 100). Örneğin, %80 tasfiye LTV ile 1 BTC karşılığında 50.000 $ ödünç almak 62.500 $ tasfiye fiyatı verir." }},
    { "@type": "Question", "name": "Bitcoin karşılığı borçlanmak satmaktan daha mı iyi?", "acceptedAnswer": { "@type": "Answer", "text": "Duruma bağlı. Borçlanmak, sermaye kazancı vergisinden (%23,8'e kadar) kaçınır ve Bitcoin'in yukarı yönlü potansiyelini korur. Ancak faiz ödersiniz ve tasfiye riskiyle karşılaşırsınız. Hesaplayıcımız her iki senaryoyu sizin rakamlarınızla karşılaştırır." }},
    { "@type": "Question", "name": "Bitcoin kredi platformları hangi faiz oranlarını uygular?", "acceptedAnswer": { "@type": "Answer", "text": "Oranlar değişir: muhafazakâr platformlar için %4-8, standart CeFi için %8-12 ve DeFi protokolleri için %5-20+. Oranlar LTV oranına, kredi vadesine ve platforma bağlıdır." }},
    { "@type": "Question", "name": "Teminatımdan daha fazlasını kaybedebilir miyim?", "acceptedAnswer": { "@type": "Answer", "text": "Çoğu Bitcoin teminatlı kredi rücu hakkı içermez — borç veren yalnızca teminatınıza el koyabilir, diğer varlıklarınıza değil. Ancak şartlar platforma göre değişir." }},
    { "@type": "Question", "name": "Bu Bitcoin kredi hesaplayıcısı ücretsiz mi?", "acceptedAnswer": { "@type": "Answer", "text": "Evet — tamamen ücretsiz, kayıt gerekmez. Tüm hesaplamalar gizlilik için tarayıcınızda çalışır. LTV analizi, tasfiye fiyatlandırması, amortisman çizelgeleri ve borçlanma-satma vergi karşılaştırmasını kapsar." }},
  ];

  return (
    <>
<Helmet>
  {/* Primary Meta Tags */}
  <title>{t('loan.meta.title')}</title>
  <meta name="description" content={t('loan.meta.description')} />
  <meta name="keywords" content="bitcoin loan calculator, borrow against bitcoin, btc collateral calculator, bitcoin ltv calculator, bitcoin liquidation price, bitcoin backed loan, crypto loan calculator, borrow vs sell bitcoin" />
  <link rel="canonical" href={language==='tr' ? 'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-kredi' : 'https://bitcoincalculator.tools/calculators/bitcoin-loan'} />

  {/* hreflang alternates emitted globally via <GlobalHreflang /> */}
  {/* Open Graph Meta Tags */}
  <meta property="og:title" content={t('loan.meta.title')} />
  <meta property="og:description" content={t('loan.meta.ogDescription')} />
  <meta property="og:url" content={language==='tr' ? 'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-kredi' : 'https://bitcoincalculator.tools/calculators/bitcoin-loan'} />
  <meta property="og:type" content="website" />
  <meta property="og:image" content={(typeof window !== 'undefined' && window.location.pathname.startsWith('/tr')) ? 'https://bitcoincalculator.tools/bitcoin-kar-hesaplayici-og.webp' : 'https://bitcoincalculator.tools/social-preview.webp'} />
  <meta property="og:image:alt" content={(typeof window !== 'undefined' && window.location.pathname.startsWith('/tr')) ? 'Bitcoin Hesaplayıcıları — 45+ Ücretsiz Araç | bitcoincalculator.tools' : 'Bitcoin Loan Calculator — Borrow Against BTC | bitcoincalculator.tools'} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="bitcoincalculator.tools" />

  {/* Twitter Card Meta Tags */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={t('loan.meta.title')} />
  <meta name="twitter:description" content={t('loan.meta.twitterDescription')} />
  <meta name="twitter:image" content={(typeof window !== 'undefined' && window.location.pathname.startsWith('/tr')) ? 'https://bitcoincalculator.tools/bitcoin-kar-hesaplayici-og.webp' : 'https://bitcoincalculator.tools/social-preview.webp'} />
  <meta name="twitter:creator" content="@web3believers" />

        <meta name="twitter:site" content="@web3believers" />
        {/* JSON-LD: WebApplication */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Bitcoin Loan & LTV Calculator",
            "description": "Calculate how much you can borrow against your Bitcoin. Enter your BTC,  loan amount and LTV ratio to see liquidation price and margin call levels. Free.",
            "url": "https://bitcoincalculator.tools/calculators/bitcoin-loan",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Any",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
            "featureList": [
              "LTV ratio calculation",
              "Liquidation price calculator",
              "Margin call price estimation",
              "Amortization schedule",
              "Borrow vs sell tax comparison",
              "Platform preset configurations",
              "Health factor scoring",
              "Multi-scenario analysis"
            ],
            "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools" },
            "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" }
          })}
        </script>

        {/* JSON-LD: HowTo */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Calculate a Bitcoin-Backed Loan",
            "description": "Step-by-step guide to using the Bitcoin loan calculator to find LTV ratios, liquidation prices, and compare borrowing vs selling",
            "totalTime": "PT3M",
            "supply": [{ "@type": "HowToSupply", "name": "Bitcoin collateral amount, current BTC price, desired loan amount" }],
            "tool": [{ "@type": "HowToTool", "name": "Bitcoin Loan Calculator" }],
            "step": [
              { "@type": "HowToStep", "name": "Enter Bitcoin Collateral", "text": "Input the amount of BTC to use as collateral and the current Bitcoin price", "url": "https://bitcoincalculator.tools/calculators/bitcoin-loan#step1" },
              { "@type": "HowToStep", "name": "Choose Platform Preset", "text": "Select a platform type (Conservative, Standard, Aggressive) or enter custom LTV thresholds", "url": "https://bitcoincalculator.tools/calculators/bitcoin-loan#step2" },
              { "@type": "HowToStep", "name": "Set Loan Terms", "text": "Configure loan amount, interest rate, and term length in months", "url": "https://bitcoincalculator.tools/calculators/bitcoin-loan#step3" },
              { "@type": "HowToStep", "name": "Review Results", "text": "Analyze liquidation price, health factor, monthly payments, and borrow-vs-sell comparison", "url": "https://bitcoincalculator.tools/calculators/bitcoin-loan#step4" },
            ]
          })}
        </script>

        {/* JSON-LD: FAQPage (EN) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "inLanguage": "en",
            "mainEntity": faqSchema
          })}
        </script>

        {/* JSON-LD: FAQPage (TR) */}
        {language === 'tr' && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "inLanguage": "tr",
              "mainEntity": faqSchemaTr
            })}
          </script>
        )}
</Helmet>

      <BreadcrumbSchema language={language}
        items={[
          { name: "Home", url: "https://bitcoincalculator.tools/" },
          { name: "Calculators", url: "https://bitcoincalculator.tools/calculators" },
          { name: "Bitcoin Loan", url: "https://bitcoincalculator.tools/calculators/bitcoin-loan" }
        ]}
      />

      <PageBackground variant="clean">
        <Header />

        <main id="main-content" className="pt-20 relative z-10">
          {/* Breadcrumb */}
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb
              items={[
                { label: t('loan.crumb.calculators'), href: language==='tr'?'/tr/hesaplayicilar':'/calculators' },
                { label: t('loan.crumb.current') }
              ]}
            />
          </div>

          {/* Hero */}
          <section className="container mx-auto px-6 py-16 text-center">
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/10">
                <Landmark className="w-4 h-4" />
                {t('loan.hero.badge')}
              </div>

              <h1 className="text-h1 font-bold text-foreground">
                {t('loan.hero.titlePrefix')} <span className="text-gradient-premium">{t('loan.hero.titleMiddle')}</span> {t('loan.hero.titleSuffix')}
              </h1>

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('loan.hero.description')}
              </p>

              <div className="max-w-sm mx-auto">
                <CompactLiveBitcoinPrice currency="USD" />
              </div>

              <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-success" />
                  <span>{t('loan.feature.liquidation')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-info" />
                  <span>{t('loan.feature.compare')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                  <span>{t('loan.feature.amortization')}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Calculator */}
          <section className="container mx-auto px-6 pb-20">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <BitcoinLoanInputPanel
                    inputs={inputs}
                    onChange={setInputs}
                    onCalculate={handleCalculate}
                    onReset={handleReset}
                    validationErrors={validationErrors}
                  />
                </div>

                <div ref={resultsRef}>
                  <ErrorBoundary>
                    {results ? (
                      <BitcoinLoanResultsPanel results={results} />
                    ) : (
                      <Card className="glass-morphism-card border-border/20 shadow-sm">
                        <CardContent className="p-8 text-center">
                          <div className="space-y-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                              <Landmark className="w-6 h-6 text-primary" />
                            </div>
                            <div className="space-y-1">
                              <h3 className="text-lg font-semibold text-foreground">{t('loan.ready.title')}</h3>
                              <p className="text-sm text-muted-foreground">
                                {t('loan.ready.desc')}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </ErrorBoundary>
                </div>
              </div>
            </div>

              {results && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                  <BitcoinLoanShareCard results={results} />
                  <BitcoinLoanExportReport results={results} />
                </div>
              )}

              {results && drawdownAnalysis && (
                <Card className="glass-morphism-card border-border/20 shadow-sm mt-8">
                  <CardContent className="p-6 space-y-5">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-semibold text-foreground">{t('loan.drawdown.title')}</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t('loan.drawdown.desc')}
                        </p>
                      </div>
                      <div className="rounded-lg border border-border/30 bg-muted/20 px-4 py-3 text-center min-w-36">
                        <div className="text-xs text-muted-foreground">{t('loan.drawdown.scenarioLabel')}</div>
                        <div className="text-2xl font-bold text-foreground">-{drawdownScenario}%</div>
                      </div>
                    </div>

                    <div className="space-y-2" aria-label={t('aria.drawdownSlider')}>
                      <Slider
                        value={[drawdownScenario]}
                        min={0}
                        max={80}
                        step={5}
                        onValueChange={(value) => setDrawdownScenario(value[0])}
                        className="py-3"
                        aria-label={t('aria.drawdownPercentage')}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0%</span>
                        <span>40%</span>
                        <span>80%</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      {[
                        { label: t('loan.drawdown.stressedPrice'), value: `$${drawdownAnalysis.stressedPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
                        { label: t('loan.drawdown.scenarioLtv'), value: `${drawdownAnalysis.stressedLtv.toFixed(1)}%` },
                        { label: t('loan.drawdown.marginLevel'), value: `${inputs.marginCallLtv}% LTV` },
                        { label: t('loan.drawdown.liquidationLevel'), value: `${inputs.liquidationLtv}% LTV` },
                      ].map((item) => (
                        <div key={item.label} className="rounded-lg border border-border/30 bg-background/40 p-4">
                          <div className="text-xs text-muted-foreground">{item.label}</div>
                          <div className="text-lg font-semibold text-foreground mt-1">{item.value}</div>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-lg border border-border/30 bg-muted/20 p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-warning" />
                        <h3 className="font-semibold text-foreground">{drawdownAnalysis.status}</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <p className="text-muted-foreground">
                          {t('loan.drawdown.marginBuffer')} <span className={drawdownAnalysis.marginGap >= 0 ? 'text-success' : 'text-destructive'}>{drawdownAnalysis.marginGap >= 0 ? '+' : ''}${drawdownAnalysis.marginGap.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        </p>
                        <p className="text-muted-foreground">
                          {t('loan.drawdown.liquidationBuffer')} <span className={drawdownAnalysis.liquidationGap >= 0 ? 'text-success' : 'text-destructive'}>{drawdownAnalysis.liquidationGap >= 0 ? '+' : ''}${drawdownAnalysis.liquidationGap.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {t('loan.drawdown.note')}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      {[
                        { label: t('loan.gauges.currentLtv'), value: results.currentLtv, tone: 'bg-primary' },
                        { label: t('loan.gauges.marginCall'), value: inputs.marginCallLtv, tone: 'bg-amber-500' },
                        { label: t('loan.gauges.liquidation'), value: inputs.liquidationLtv, tone: 'bg-destructive' },
                      ].map((item) => (
                        <div key={item.label} className="rounded-lg border border-border/30 bg-background/40 p-3 space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">{item.label}</span>
                            <span className="font-medium text-foreground">{item.value.toFixed(1)}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div className={`h-full ${item.tone}`} style={{ width: `${Math.min(100, item.value)}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
          </section>

          <section className="container mx-auto px-6 pb-16" aria-labelledby="bitcoin-loan-platform-comparison">
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="text-center max-w-3xl mx-auto">
                <h2 id="bitcoin-loan-platform-comparison" className="text-h2 font-bold text-foreground">
                  {t('loan.platforms.title')}
                </h2>
                <p className="text-sm text-muted-foreground mt-3">
                  {t('loan.platforms.subtitle')}
                </p>
              </div>

              <Card className="glass-morphism-card border-border/20 shadow-sm overflow-hidden">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[860px]">
                      <thead className="bg-muted/30 text-muted-foreground">
                        <tr className="border-b border-border/30">
                          <th className="text-left p-4 font-medium">{t('loan.platforms.colPlatform')}</th>
                          <th className="text-left p-4 font-medium">{t('loan.platforms.colCustody')}</th>
                          <th className="text-left p-4 font-medium">{t('loan.platforms.colLtv')}</th>
                          <th className="text-left p-4 font-medium">{t('loan.platforms.colMargin')}</th>
                          <th className="text-left p-4 font-medium">{t('loan.platforms.colRate')}</th>
                          <th className="text-left p-4 font-medium">{t('loan.platforms.colFit')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loanPlatformRows.map((row) => (
                          <tr key={row.platform} className="border-b border-border/20 last:border-0 align-top">
                            <td className="p-4 font-semibold text-foreground">{row.platform}</td>
                            <td className="p-4 text-muted-foreground">{row.custody}</td>
                            <td className="p-4 text-muted-foreground">{row.ltv}</td>
                            <td className="p-4 text-muted-foreground">{row.margin}</td>
                            <td className="p-4 text-muted-foreground">{row.notes}</td>
                            <td className="p-4 text-muted-foreground">{row.fit}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card id="bitcoin-loan-ltv-explained" className="glass-morphism-card border-border/20 shadow-sm">
                  <CardContent className="p-6 space-y-3">
                    <h3 className="text-lg font-semibold text-foreground">{t('loan.ltvExplained.title')}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t('loan.ltvExplained.body')}
                    </p>
                  </CardContent>
                </Card>

                <Card id="bitcoin-loan-50-drawdown-example" className="glass-morphism-card border-warning/20 shadow-sm bg-warning/$3">
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-warning" />
                      <h3 className="text-lg font-semibold text-foreground">{t('loan.drawdownExample.title')}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t('loan.drawdownExample.body')}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* How To Use & FAQ */}
          <BitcoinLoanHowToUseSection />
          <BitcoinLoanFAQSection />

          <MethodologyBlock
            methodology="Loan-to-Value (LTV) is computed as principal ÷ (Bitcoin collateral × live BTC price). The liquidation price is solved as principal ÷ (collateral × liquidation LTV), where liquidation LTV is set by the lender (typically 80–90%). Margin call price is computed at the warning LTV (typically 70%). Total interest is calculated on the principal using the lender's stated APR over the loan term, with monthly compounding. Live Bitcoin price comes from CoinGecko."
            sources={[
              { label: 'Aave V3 Risk Parameters', url: 'https://docs.aave.com/risk/asset-risk/risk-parameters', publisher: 'Aave Protocol' },
              { label: 'CFPB — Crypto-collateralized lending consumer guidance', url: 'https://www.consumerfinance.gov/about-us/blog/crypto-asset-related-products/', publisher: 'U.S. Consumer Financial Protection Bureau' },
              { label: 'Bitcoin live spot price', url: 'https://www.coingecko.com/en/coins/bitcoin', publisher: 'CoinGecko' },
            ]}
            lastReviewed="2026-04-15"
            disclaimer="Bitcoin-collateralized loans carry liquidation risk. A sharp price drop can trigger forced sale of your collateral. This calculator does not account for borrower KYC, regional availability, or counterparty risk. Always read the lender's full terms."
          />

          {/* Related Calculators */}
          <div className="container mx-auto px-6 max-w-5xl"><AffiliatePlacement slug="bitcoin-loan" /></div>
          <RelatedCalculators />

          {/* Disclaimer */}
          <section className="container mx-auto px-6 pb-16">
            <div className="max-w-3xl mx-auto">
              <Card className="glass-morphism-card border-border/20 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{t('loan.disclaimer.title')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('loan.disclaimer.body')}
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

export default BitcoinLoanCalculator;
