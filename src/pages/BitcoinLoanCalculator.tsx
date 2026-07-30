import React, { useState, useRef, useCallback } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useSafeLanguage } from "@/hooks/useSafeLanguage";
import { Breadcrumb } from '@/components/Breadcrumb';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { PageBackground } from '@/components/modern/PageBackground';
import { CompactLiveBitcoinPrice } from '@/components/CompactLiveBitcoinPrice';
import { Card, CardContent } from '@/components/ui/card';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { BitcoinLoanInputPanel, LoanFormInputs, LoanValidationErrors } from '@/components/bitcoin-loan/BitcoinLoanInputPanel';
import { BitcoinLoanResultsPanel } from '@/components/bitcoin-loan/BitcoinLoanResultsPanel';
import { BitcoinLoanHowToUseSection } from '@/components/bitcoin-loan/BitcoinLoanHowToUseSection';
import { BitcoinLoanFAQSection } from '@/components/bitcoin-loan/BitcoinLoanFAQSection';
import { BitcoinLoanShareCard } from '@/components/bitcoin-loan/BitcoinLoanShareCard';
import { BitcoinLoanSeoHead } from '@/components/bitcoin-loan/BitcoinLoanSeoHead';
import { BitcoinLoanDrawdownStress } from '@/components/bitcoin-loan/BitcoinLoanDrawdownStress';
import { BitcoinLoanPlatformComparison } from '@/components/bitcoin-loan/BitcoinLoanPlatformComparison';
import { DEFAULT_INPUTS } from '@/components/bitcoin-loan/bitcoinLoanData';
import RelatedCalculators from '@/components/RelatedCalculatorsLazy';
import { MethodologyBlock } from '@/components/calculator/MethodologyBlock';
import { Landmark, Shield, Scale, AlertTriangle, TrendingUp } from 'lucide-react';
import { calculateBitcoinLoan, LoanResult } from '@/services/bitcoinLoanCalculator';
import { useLanguage } from "@/contexts/LanguageContext";
import { HelmetOgImage } from "@/components/seo/HelmetOgImage";
import { PreFAQPlacement } from "@/components/placement/PreFAQPlacement";
import { QuickShareLinkPanel } from '@/components/share-export';
import { PageQuickAnswer } from "@/components/calculator/PageQuickAnswer";

const BitcoinLoanCalculator = () => {
  const { language, t } = useLanguage();
  const [inputs, setInputs] = useState<LoanFormInputs>({ ...DEFAULT_INPUTS });
  const [results, setResults] = useState<LoanResult | null>(null);
  const [drawdownScenario, setDrawdownScenario] = useState(30);
  const [validationErrors, setValidationErrors] = useState<LoanValidationErrors>({});
  const resultsRef = useRef<HTMLDivElement>(null);

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

  return (
    <>
      <BitcoinLoanSeoHead />
      <HelmetOgImage slug="bitcoin-loan-calculator" enAlt={`Bitcoin Loan Calculator — Borrow Against BTC | bitcoincalculator.tools`} />

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
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb
              items={[
                { label: t('loan.crumb.calculators'), href: language==='tr'?'/tr/hesaplayicilar':'/calculators' },
                { label: t('loan.crumb.current') }
              ]}
            />
          </div>

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

          <section className="container mx-auto px-6 pb-20">
            <PageQuickAnswer
              en='A Bitcoin-backed loan lets you borrow cash against your BTC without selling it. This calculator works out your loan-to-value ratio, monthly interest cost, margin-call level and liquidation price, so you can see exactly how far Bitcoin can fall before you must add collateral or repay.'
              tr='Bitcoin teminatlı kredi, BTC’nizi satmadan nakit borçlanmanızı sağlar. Bu hesaplayıcı kredi/teminat oranınızı, aylık faiz maliyetinizi, teminat tamamlama seviyenizi ve tasfiye fiyatınızı hesaplar; teminat eklemeniz ya da geri ödemeniz gerekmeden önce Bitcoin’in ne kadar düşebileceğini net görürsünüz.'
            />
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
              <div className="mt-8">
                <BitcoinLoanShareCard results={results} />
              </div>
            )}

            {results && (
              <BitcoinLoanDrawdownStress
                inputs={inputs}
                results={results}
                drawdownScenario={drawdownScenario}
                setDrawdownScenario={setDrawdownScenario}
              />
            )}
          </section>

          <BitcoinLoanPlatformComparison />

          <BitcoinLoanHowToUseSection />
          <PreFAQPlacement slug="bitcoin-loan" />
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

          <div className="container mx-auto px-4 sm:px-6"><div className="max-w-6xl mx-auto"><QuickShareLinkPanel slug="bitcoin-loan" headline={language === 'tr' ? 'Bitcoin Kredi Hesaplayıcı' : 'Bitcoin Loan Calculator'} /></div></div>
          <RelatedCalculators />

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
