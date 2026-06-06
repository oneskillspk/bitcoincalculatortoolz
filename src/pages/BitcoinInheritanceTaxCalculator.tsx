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
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { InheritanceTaxInputPanel, InheritanceTaxInputs, ValidationErrors } from '@/components/inheritance-tax/InheritanceTaxInputPanel';
import { InheritanceTaxResultsPanel } from '@/components/inheritance-tax/InheritanceTaxResultsPanel';
import { InheritanceTaxHowToUseSection } from '@/components/inheritance-tax/InheritanceTaxHowToUseSection';
import { InheritanceTaxFAQSection } from '@/components/inheritance-tax/InheritanceTaxFAQSection';
import { InheritanceTaxExportReport } from '@/components/inheritance-tax/InheritanceTaxExportReport';
import { InheritanceTaxShareCard } from '@/components/inheritance-tax/InheritanceTaxShareCard';
import RelatedCalculators from '@/components/RelatedCalculators';
import { MethodologyBlock } from '@/components/calculator/MethodologyBlock';
import { Shield, Scale, FileText, AlertTriangle } from 'lucide-react';
import { calculateInheritanceTax, InheritanceTaxResult } from '@/services/inheritanceTaxCalculator';
import { useLanguage } from "@/contexts/LanguageContext";

const DEFAULT_INPUTS: InheritanceTaxInputs = {
  inheritedBtcAmount: 0,
  dateOfDeathPrice: 0,
  originalCostBasis: 0,
  currentPrice: 0,
  totalEstateValue: 0,
  filingStatus: 'single',
  stateOfResidence: 'TX',
  planToSell: true,
};

const BitcoinInheritanceTaxCalculator = () => {
  const { language, t } = useLanguage();
  const [inputs, setInputs] = useState<InheritanceTaxInputs>({ ...DEFAULT_INPUTS });
  const [results, setResults] = useState<InheritanceTaxResult | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const resultsRef = useRef<HTMLDivElement>(null);

  const validate = useCallback((): boolean => {
    const errors: ValidationErrors = {};
    if (!inputs.inheritedBtcAmount || inputs.inheritedBtcAmount <= 0) {
      errors.inheritedBtcAmount = 'Enter a BTC amount greater than 0';
    }
    if (!inputs.dateOfDeathPrice || inputs.dateOfDeathPrice <= 0) {
      errors.dateOfDeathPrice = 'Enter the price at date of death';
    }
    if (!inputs.currentPrice || inputs.currentPrice <= 0) {
      errors.currentPrice = 'Enter the current Bitcoin price';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [inputs]);

  const handleCalculate = () => {
    if (!validate()) return;

    const result = calculateInheritanceTax(
      inputs.inheritedBtcAmount,
      inputs.dateOfDeathPrice,
      inputs.originalCostBasis,
      inputs.currentPrice,
      inputs.totalEstateValue,
      inputs.filingStatus,
      inputs.stateOfResidence
    );
    setResults(result);

    // Scroll to results on mobile
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
<Helmet>
  {/* Primary Meta Tags */}
  <title>{t('inheritance.meta.title')}</title>
  <meta name="description" content={t('inheritance.meta.description')} />
  <meta name="keywords" content="bitcoin inheritance tax calculator, inherited crypto cost basis, step-up basis bitcoin, crypto estate planning calculator, bitcoin estate tax, inherited bitcoin tax, cryptocurrency inheritance" />
  <link rel="canonical" href={language==='tr' ? 'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-miras-vergisi' : 'https://bitcoincalculator.tools/calculators/inheritance-tax'} />

  {/* hreflang alternates emitted globally via <GlobalHreflang /> */}
  {/* Open Graph Meta Tags */}
  <meta property="og:title" content={t('inheritance.meta.title')} />
  <meta property="og:description" content={t('inheritance.meta.ogDescription')} />
  <meta property="og:url" content={language==='tr' ? 'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-miras-vergisi' : 'https://bitcoincalculator.tools/calculators/inheritance-tax'} />
  <meta property="og:type" content="website" />
  <meta property="og:image" content={(typeof window !== 'undefined' && window.location.pathname.startsWith('/tr')) ? 'https://bitcoincalculator.tools/bitcoin-kar-hesaplayici-og.webp' : 'https://bitcoincalculator.tools/social-preview.webp'} />
  <meta property="og:image:alt" content={(typeof window !== 'undefined' && window.location.pathname.startsWith('/tr')) ? 'Bitcoin Hesaplayıcıları — 45+ Ücretsiz Araç | bitcoincalculator.tools' : 'Bitcoin Inheritance Tax Calculator 2026 | bitcoincalculator.tools'} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="bitcoincalculator.tools" />

  {/* Twitter Card Meta Tags */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={t('inheritance.meta.title')} />
  <meta name="twitter:description" content={t('inheritance.meta.twitterDescription')} />
  <meta name="twitter:image" content={(typeof window !== 'undefined' && window.location.pathname.startsWith('/tr')) ? 'https://bitcoincalculator.tools/bitcoin-kar-hesaplayici-og.webp' : 'https://bitcoincalculator.tools/social-preview.webp'} />
  <meta name="twitter:creator" content="@web3believers" />

        <meta name="twitter:site" content="@web3believers" />
        {/* JSON-LD Structured Data for WebApplication */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Bitcoin Inheritance & Estate Tax Calculator 2026",
            "description": "Calculate taxes on inherited Bitcoin. Covers step-up basis, federal estate tax thresholds, state estate taxes, and capital gains if sold.",
            "url": "https://bitcoincalculator.tools/calculators/inheritance-tax",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              "Step-up in basis calculation",
              "Federal estate tax estimation",
              "State estate tax coverage (13 states + DC)",
              "Capital gains comparison (with vs. without step-up)",
              "NIIT (3.8%) surtax calculation",
              "2026 exemption thresholds",
              "Filing status support"
            ],
            "provider": {
              "@type": "Organization",
              "name": "Bitcoin Calculator Tools"
            },
            "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" }
          })}
        </script>

        {/* HowTo JSON-LD Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Calculate Bitcoin Inheritance Tax for 2026",
            "description": "Step-by-step guide to calculate taxes on inherited Bitcoin including step-up basis, estate tax, and capital gains",
            "totalTime": "PT3M",
            "supply": [
              {
                "@type": "HowToSupply",
                "name": "Inherited Bitcoin amount, date-of-death price, estate value"
              }
            ],
            "tool": [
              {
                "@type": "HowToTool",
                "name": "Bitcoin Inheritance Tax Calculator"
              }
            ],
            "step": [
              {
                "@type": "HowToStep",
                "name": "Enter Inheritance Details",
                "text": "Input the inherited Bitcoin amount, fair market value at date of death, and original purchase price",
                "url": "https://bitcoincalculator.tools/calculators/inheritance-tax#step1"
              },
              {
                "@type": "HowToStep",
                "name": "Configure Estate Information",
                "text": "Enter the total estate value, filing status, and state of residence",
                "url": "https://bitcoincalculator.tools/calculators/inheritance-tax#step2"
              },
              {
                "@type": "HowToStep",
                "name": "Review Step-Up Basis Savings",
                "text": "See how much tax the step-up basis saves compared to the original cost basis",
                "url": "https://bitcoincalculator.tools/calculators/inheritance-tax#step3"
              },
              {
                "@type": "HowToStep",
                "name": "Check Estate Tax Exposure",
                "text": "Review federal and state estate tax liability based on total estate value",
                "url": "https://bitcoincalculator.tools/calculators/inheritance-tax#step4"
              }
            ]
          })}
        </script>

        {/* FAQ JSON-LD Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "inLanguage": language === 'tr' ? 'tr' : 'en',
            "mainEntity": (language === 'tr' ? [
              { q: "ABD'de miras kalan Bitcoin nasıl vergilendirilir?", a: "Miras kalan Bitcoin, ölüm tarihindeki adil piyasa değerine eşit kademeli artırılmış bir maliyet bazı alır. Yalnızca ölüm tarihinden sonraki değer artışı için sermaye kazancı vergisi ödersiniz. Toplam mülk 13,61 milyon $'ı (2026 eşiği) aşarsa veraset vergisi uygulanabilir." },
              { q: "Miras kalan kripto için kademeli artırılmış baz nedir?", a: "Kademeli artırma, maliyet bazınızı orijinal sahibin öldüğü tarihteki Bitcoin fiyatına sıfırlar. 500 $'a BTC almışlarsa ve ölümde 65.000 $ ise, bazınız 65.000 $'dır. Yalnızca bu fiyatın üzerindeki kazançlar üzerinden vergi ödersiniz." },
              { q: "Miras kalan Bitcoin için veraset vergisi öder miyim?", a: "Federal veraset vergisi yalnızca toplam mülk 13,61 milyon $'ı (2026) aşarsa uygulanır. Çoğu mülk bunun altında kalır. Ancak 13 eyalet ve DC'nin muafiyetleri 1 milyon $'a kadar düşebilen kendi veraset vergileri vardır." },
              { q: "Bu Bitcoin miras vergisi hesaplayıcısı ücretsiz mi?", a: "Evet — tamamen ücretsiz. Kayıt yok, abonelik yok. Kademeli artırma bazını, federal ve eyalet veraset vergilerini ve sermaye kazancı karşılaştırmalarını kapsar. Tüm hesaplamalar gizlilik için tarayıcınızda çalışır." },
              { q: "Bitcoin miras alıp satmazsam ne olur?", a: "Miras kalan Bitcoin'i satmadan tutarsanız, sermaye kazancı vergisi ödemezsiniz. Kademeli artırılmış baz sabittir. Yalnızca Bitcoin'i sattığınızda, takas ettiğinizde veya harcadığınızda bir vergi olayı tetiklenir." }
            ] : [
              { q: "How is inherited Bitcoin taxed in the United States?", a: "Inherited Bitcoin receives a stepped-up cost basis equal to the fair market value on the date of death. You only owe capital gains tax on appreciation after the date of death. Estate tax may apply if the total estate exceeds $13.61 million (2026 threshold)." },
              { q: "What is the step-up in basis for inherited crypto?", a: "The step-up resets your cost basis to the Bitcoin price on the date the original owner died. If they bought BTC at $500 and it was $65,000 at death, your basis is $65,000. You only pay tax on gains above that price." },
              { q: "Do I owe estate tax on inherited Bitcoin?", a: "Federal estate tax only applies if the total estate exceeds $13.61 million (2026). Most estates fall below this. However, 13 states and DC have their own estate taxes with exemptions as low as $1 million." },
              { q: "Is this Bitcoin inheritance tax calculator free?", a: "Yes — completely free. No signup, no subscription. It covers step-up basis, federal and state estate taxes, and capital gains comparisons. All calculations run in your browser for privacy." },
              { q: "What happens if I inherit Bitcoin and don't sell it?", a: "If you hold inherited Bitcoin without selling, you owe no capital gains tax. The stepped-up basis is locked in. You only trigger a tax event when you sell, trade, or spend the Bitcoin." }
            ]).map(({q,a}) => ({ "@type": "Question", "name": q, "acceptedAnswer": { "@type": "Answer", "text": a } }))
          })}
        </script>
</Helmet>

      <BreadcrumbSchema language={language}
        items={[
          { name: "Home", url: "https://bitcoincalculator.tools/" },
          { name: "Calculators", url: "https://bitcoincalculator.tools/calculators" },
          { name: "Inheritance Tax", url: "https://bitcoincalculator.tools/calculators/inheritance-tax" }
        ]}
      />

      <PageBackground variant="clean">
        <Header />

        <main id="main-content" className="pt-20 relative z-10">
          {/* Breadcrumb Navigation */}
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb
              items={[
                { label: t('inheritance.crumb.calculators'), href: language==='tr'?'/tr/hesaplayicilar':'/calculators' },
                { label: t('inheritance.crumb.current') }
              ]}
            />
          </div>

          {/* Hero Section */}
          <section className="container mx-auto px-6 py-16 text-center">
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/10">
                <Shield className="w-4 h-4" />
                {t('inheritance.hero.badge')}
              </div>

              <h1 className="text-h1 font-bold text-foreground">
                {t('inheritance.hero.titlePrefix')} <span className="text-gradient-premium">{t('inheritance.hero.titleMiddle')}</span> {t('inheritance.hero.titleSuffix')}
              </h1>

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('inheritance.hero.description')}
              </p>

              <div className="max-w-sm mx-auto">
                <CompactLiveBitcoinPrice currency="USD" />
              </div>

              <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-success" />
                  <span>{t('inheritance.feature.stepUp')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-blue-500" />
                  <span>{t('inheritance.feature.estate')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-500" />
                  <span>{t('inheritance.feature.states')}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Calculator Section */}
          <section className="container mx-auto px-6 pb-20">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <InheritanceTaxInputPanel
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
                      <InheritanceTaxResultsPanel results={results} />
                    ) : (
                      <Card className="glass-morphism-card border-border/20 shadow-sm">
                        <CardContent className="p-8 text-center">
                          <div className="space-y-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                              <Shield className="w-6 h-6 text-primary" />
                            </div>
                            <div className="space-y-1">
                              <h3 className="text-lg font-semibold text-foreground">
                                {t('inheritance.placeholder.title')}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {t('inheritance.placeholder.desc')}
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
                  <InheritanceTaxShareCard results={results} />
                  <InheritanceTaxExportReport results={results} />
                </div>
              )}
          </section>

          {/* How To Use & Educational Content */}
          <InheritanceTaxHowToUseSection />
          <InheritanceTaxFAQSection />

          <MethodologyBlock
            methodology="U.S. federal estate tax is computed using the 2024 unified credit ($13.61M lifetime exemption per individual) and the 40% top marginal rate on the taxable estate. Bitcoin held at death receives a stepped-up cost basis to fair market value, eliminating embedded capital gains for heirs. State-level inheritance tax is layered on top using each state's bracket table. The calculator separates the gross estate, exemption, taxable estate, and net inheritance after federal + state liabilities."
            sources={[
              { label: 'IRS Estate Tax — Form 706 instructions', url: 'https://www.irs.gov/forms-pubs/about-form-706', publisher: 'U.S. Internal Revenue Service' },
              { label: 'IRC § 1014 — Stepped-up basis at death', url: 'https://www.law.cornell.edu/uscode/text/26/1014', publisher: 'Cornell LII' },
              { label: 'Tax Foundation — Estate, Inheritance & Gift Taxes', url: 'https://taxfoundation.org/data/all/state/estate-inheritance-taxes/', publisher: 'Tax Foundation' },
            ]}
            lastReviewed="2026-04-15"
            disclaimer="Estate tax law is highly state-specific and changes frequently. The 2026 federal exemption is scheduled to sunset back to ~$7M absent Congressional action. Always consult an estate planning attorney before relying on these estimates."
          />

          {/* Related Calculators */}
          <div className="container mx-auto px-6 max-w-5xl"><AffiliatePlacement slug="inheritance-tax" /></div>
          <RelatedCalculators />

          {/* Disclaimer */}
          <section className="container mx-auto px-6 pb-16">
            <div className="max-w-3xl mx-auto">
              <Card className="glass-morphism-card border-border/20 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{t('inheritance.disclaimer.title')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('inheritance.disclaimer.body')}
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

export default BitcoinInheritanceTaxCalculator;
