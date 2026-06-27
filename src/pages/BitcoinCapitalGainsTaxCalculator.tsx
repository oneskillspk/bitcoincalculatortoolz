import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Breadcrumb } from '@/components/Breadcrumb';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { PageBackground } from '@/components/modern/PageBackground';
import { QuickAnswerBox } from '@/components/calculator/QuickAnswerBox';
import { CompactLiveBitcoinPrice } from '@/components/CompactLiveBitcoinPrice';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnhancedTaxInputPanel } from '@/components/tax-calculator/EnhancedTaxInputPanel';
import { EnhancedTaxResultsPanel } from '@/components/tax-calculator/EnhancedTaxResultsPanel';
import { TransactionTable } from '@/components/tax-calculator/TransactionTable';
import { TaxCalculatorFAQSection } from '@/components/tax-calculator/TaxCalculatorFAQSection';
import { TaxContentSections } from '@/components/tax-calculator/TaxContentSections';
import { TaxCalculatorHowItWorksSection } from '@/components/tax-calculator/TaxCalculatorHowItWorksSection';
import RelatedCalculators from '@/components/RelatedCalculators';
import { MethodologyBlock } from '@/components/calculator/MethodologyBlock';
import { Calculator, Receipt, TrendingUp, AlertTriangle, FileText } from 'lucide-react';
import { TaxTransaction, TaxConfiguration, EnhancedTaxCalculation } from '@/services/enhancedTaxCalculator';
import { CostBasisComparison } from '@/components/tax-calculator/CostBasisComparison';
import UKTaxPanel from '@/components/tax-calculator/UKTaxPanel';
import { useEffect } from 'react';
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocalizedSchema } from "@/hooks/useLocalizedSchema";

import { HelmetOgImage } from "@/components/seo/HelmetOgImage";
import { PreFAQPlacement } from "@/components/placement/PreFAQPlacement";
import { PreCalcPlacement } from "@/components/placement/PreCalcPlacement";
const BitcoinCapitalGainsTaxCalculator = () => {
  const { language, t } = useLanguage();
  const tr = language==='tr';
  const enUrl = 'https://bitcoincalculator.tools/calculators/capital-gains-tax';
  const trUrl = 'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-vergi-hesaplayicisi';

  const howToSchema = useLocalizedSchema(
    {
      "@context": "https://schema.org", "@type": "HowTo", inLanguage: "en",
      "name": "How to Calculate Bitcoin Capital Gains Tax for 2026",
      "description": "Step-by-step guide to calculate your Bitcoin capital gains tax obligations with professional accuracy",
      "totalTime": "PT5M",
      "step": [
        { "@type": "HowToStep", "name": "Configure Tax Settings", "text": "Enter your filing status, annual taxable income, tax year, and state (if applicable)", "url": `${enUrl}#step1` },
        { "@type": "HowToStep", "name": "Add Bitcoin Transactions", "text": "Input all Bitcoin transactions including purchases, sales, trades, and mining/staking income", "url": `${enUrl}#step2` },
        { "@type": "HowToStep", "name": "Calculate Tax Liability", "text": "Generate comprehensive tax calculations including federal, state, and NIIT taxes", "url": `${enUrl}#step3` },
        { "@type": "HowToStep", "name": "Review Tax Optimization", "text": "Analyze results and review tax optimization suggestions for better tax planning", "url": `${enUrl}#step4` },
      ],
    },
    {
      "@context": "https://schema.org", "@type": "HowTo", inLanguage: "tr",
      "name": "2026 için Bitcoin Sermaye Kazancı Vergisi Nasıl Hesaplanır",
      "description": "Bitcoin sermaye kazancı vergi yükümlülüklerinizi profesyonel doğrulukla hesaplamak için adım adım rehber",
      "totalTime": "PT5M",
      "step": [
        { "@type": "HowToStep", "name": "Vergi Ayarlarını Yapılandırın", "text": "Beyan durumunuzu, yıllık vergilendirilebilir gelirinizi, vergi yılını ve (varsa) eyaleti girin", "url": `${trUrl}#step1` },
        { "@type": "HowToStep", "name": "Bitcoin İşlemlerini Ekleyin", "text": "Alımlar, satışlar, takaslar ve madencilik/staking gelirleri dahil tüm Bitcoin işlemlerini girin", "url": `${trUrl}#step2` },
        { "@type": "HowToStep", "name": "Vergi Yükümlülüğünü Hesaplayın", "text": "Federal, eyalet ve NIIT vergileri dahil kapsamlı vergi hesaplamaları oluşturun", "url": `${trUrl}#step3` },
        { "@type": "HowToStep", "name": "Vergi Optimizasyonunu İnceleyin", "text": "Sonuçları analiz edin ve daha iyi vergi planlaması için optimizasyon önerilerini gözden geçirin", "url": `${trUrl}#step4` },
      ],
    },
  );

  const faqSchema = useLocalizedSchema(
    {
      "@context": "https://schema.org", "@type": "FAQPage", inLanguage: "en",
      "mainEntity": [
        { "@type": "Question", "name": "How are Bitcoin capital gains taxed in 2025?", "acceptedAnswer": { "@type": "Answer", "text": "Bitcoin capital gains are taxed by holding period. Short-term gains (≤1 year) are taxed as ordinary income up to 37%. Long-term gains (>1 year) are taxed at 0%, 15%, or 20% based on income." }},
        { "@type": "Question", "name": "What filing status and income do I need?", "acceptedAnswer": { "@type": "Answer", "text": "You need your filing status and annual taxable income to determine your bracket and capital gains rates. Higher earners may also owe the 3.8% NIIT." }},
        { "@type": "Question", "name": "Does this calculator include state taxes?", "acceptedAnswer": { "@type": "Answer", "text": "Yes — major states including California (13.3%), New York (8.82%), and Washington (7% on high earners). States with no capital gains tax like Texas, Florida, Nevada are also supported." }},
        { "@type": "Question", "name": "What is the Net Investment Income Tax (NIIT)?", "acceptedAnswer": { "@type": "Answer", "text": "NIIT is an additional 3.8% tax on investment income for high earners — individuals over $200k (single) or $250k (MFJ). The calculator includes NIIT automatically when applicable." }},
        { "@type": "Question", "name": "How accurate are these tax calculations?", "acceptedAnswer": { "@type": "Answer", "text": "Uses current 2025 brackets and capital gains rates. For estimation only — consult a qualified tax professional for filing." }},
        { "@type": "Question", "name": "Is this Bitcoin tax calculator free?", "acceptedAnswer": { "@type": "Answer", "text": "Yes — completely free. No signup, no subscription. Covers all US federal and state rates, short and long-term gains, all filing statuses." }},
        { "@type": "Question", "name": "How much tax do I pay on Bitcoin profits?", "acceptedAnswer": { "@type": "Answer", "text": "Short-term gains taxed as ordinary income up to 37%. Long-term gains taxed at 0%, 15%, or 20% based on income and filing status." }},
        { "@type": "Question", "name": "How much is Bitcoin capital gains tax in the UK?", "acceptedAnswer": { "@type": "Answer", "text": "UK Bitcoin CGT is 18% for basic rate and 24% for higher rate taxpayers in 2025/26. The first £3,000 of gains is covered by the annual CGT allowance." }},
        { "@type": "Question", "name": "Do I owe tax on Bitcoin if I haven't sold?", "acceptedAnswer": { "@type": "Answer", "text": "No. Holding is not a taxable event. Tax triggers when you sell, swap, spend, or otherwise dispose of BTC." }},
        { "@type": "Question", "name": "Which states have no Bitcoin capital gains tax?", "acceptedAnswer": { "@type": "Answer", "text": "Nine states impose no state income tax on capital gains: Alaska, Florida, Nevada, New Hampshire, South Dakota, Tennessee, Texas, Washington, and Wyoming." }},
      ],
    },
    {
      "@context": "https://schema.org", "@type": "FAQPage", inLanguage: "tr",
      "mainEntity": [
        { "@type": "Question", "name": "Türkiye'de Bitcoin kâzanç vergisi nasıl hesaplanır?", "acceptedAnswer": { "@type": "Answer", "text": "Türkiye'de kripto kazançları için resmi vergi rejimi henüz netleşmemiştir. Bu hesaplayıcı, ABD ve İngiltere vergi rejimlerini referans alır; Türkiye'deki kullanıcılar için karşılaştırmalı bir referans sağlar. Yerel beyan için lütfen yetkili bir mali müşavire danışın." }},
        { "@type": "Question", "name": "2025'te Bitcoin sermaye kazançları nasıl vergilendirilir?", "acceptedAnswer": { "@type": "Answer", "text": "ABD'de Bitcoin sermaye kazançları tutma süresine göre vergilendirilir. Kısa vadeli kazançlar (≤1 yıl) %37'ye kadar olağan gelir olarak; uzun vadeli kazançlar (>1 yıl) gelire göre %0, %15 veya %20 oranında vergilendirilir." }},
        { "@type": "Question", "name": "Hangi beyan durumu ve gelir bilgisine ihtiyacım var?", "acceptedAnswer": { "@type": "Answer", "text": "Vergi diliminizi ve sermaye kazancı oranlarınızı belirlemek için beyan durumunuza ve yıllık vergilendirilebilir gelirinize ihtiyacınız vardır. Yüksek gelirliler ayrıca %3,8 NIIT'ye tabi olabilir." }},
        { "@type": "Question", "name": "Bu hesaplayıcı eyalet vergilerini içeriyor mu?", "acceptedAnswer": { "@type": "Answer", "text": "Evet — California (%13,3), New York (%8,82) ve Washington (yüksek gelirlilerde %7) dahil büyük eyaletler. Teksas, Florida, Nevada gibi sermaye kazancı vergisi olmayan eyaletler de desteklenir." }},
        { "@type": "Question", "name": "Net Yatırım Gelir Vergisi (NIIT) nedir?", "acceptedAnswer": { "@type": "Answer", "text": "NIIT, yüksek gelirliler için yatırım geliri üzerinde ek %3,8'lik bir vergidir — bireyler için 200 bin $ üzeri (tek), 250 bin $ üzeri (birlikte beyan). Hesaplayıcı NIIT'yi uygun olduğunda otomatik dahil eder." }},
        { "@type": "Question", "name": "Bu vergi hesaplamaları ne kadar doğrudur?", "acceptedAnswer": { "@type": "Answer", "text": "Güncel 2025 dilimlerini ve sermaye kazancı oranlarını kullanır. Yalnızca tahmin amaçlıdır — beyan için nitelikli bir vergi uzmanına danışın." }},
        { "@type": "Question", "name": "Bu Bitcoin vergi hesaplayıcısı ücretsiz mi?", "acceptedAnswer": { "@type": "Answer", "text": "Evet — tamamen ücretsiz. Kayıt yok, abonelik yok. Tüm ABD federal ve eyalet oranlarını, kısa ve uzun vadeli kazançları ve tüm beyan durumlarını kapsar." }},
        { "@type": "Question", "name": "Bitcoin satmadıysam vergi öder miyim?", "acceptedAnswer": { "@type": "Answer", "text": "Hayır. Sadece tutmak vergilendirilebilir bir olay değildir. Vergi; BTC'yi sattığınızda, takas ettiğinizde, harcadığınızda veya başka şekilde elden çıkardığınızda tetiklenir." }},
        { "@type": "Question", "name": "İngiltere'de Bitcoin sermaye kazancı vergisi ne kadar?", "acceptedAnswer": { "@type": "Answer", "text": "İngiltere'de 2025/26 vergi yılında Bitcoin CGT temel oranlı için %18, yüksek oranlı için %24'tür. Kazançların ilk 3.000 £'i yıllık CGT istisnası kapsamındadır." }},
        { "@type": "Question", "name": "Hangi eyaletlerde Bitcoin sermaye kazancı vergisi yoktur?", "acceptedAnswer": { "@type": "Answer", "text": "Dokuz eyalet sermaye kazançları üzerinden eyalet gelir vergisi almaz: Alaska, Florida, Nevada, New Hampshire, South Dakota, Tennessee, Teksas, Washington ve Wyoming." }},
      ],
    },
  );

  const [transactions, setTransactions] = useState<TaxTransaction[]>([]);
  const [taxResults, setTaxResults] = useState<EnhancedTaxCalculation | null>(null);
  const [config, setConfig] = useState<TaxConfiguration>({
    jurisdiction: 'US',
    filingStatus: 'single',
    annualIncome: 75000,
    taxYear: new Date().getFullYear(),
    costBasisMethod: 'FIFO'
  });
  const [isCalculating, setIsCalculating] = useState(false);

  const handleTransactionsUpdate = (newTransactions: TaxTransaction[]) => {
    setTransactions(newTransactions);
  };

  const handleConfigChange = (newConfig: TaxConfiguration) => {
    setConfig(newConfig);
  };

  const handleTaxCalculation = async (results: EnhancedTaxCalculation) => {
    setIsCalculating(true);
    
    try {
      // Simulate calculation time for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      setTaxResults(results);
    } catch (error) {
      console.error('Tax calculation failed:', error);
    } finally {
      setIsCalculating(false);
    }
  };


  return (
    <>
<Helmet>
  {/* Primary Meta Tags */}
  <title>{t('cgt.meta.title')}</title>
  <meta name="description" content={t('cgt.meta.description')} />
  <link rel="canonical" href={tr?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-vergi-hesaplayicisi':'https://bitcoincalculator.tools/calculators/capital-gains-tax'} />

  <link rel="alternate" hrefLang="tr" href="https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-vergi-hesaplayicisi" />
  <link rel="alternate" hrefLang="en" href="https://bitcoincalculator.tools/calculators/capital-gains-tax" />
  <link rel="alternate" hrefLang="x-default" href="https://bitcoincalculator.tools/calculators/capital-gains-tax" />
  {/* Open Graph Meta Tags */}
  <meta property="og:title" content={t('cgt.meta.title')} />
  <meta property="og:description" content={t('cgt.meta.ogDescription')} />
  <meta property="og:url" content={tr?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-vergi-hesaplayicisi':'https://bitcoincalculator.tools/calculators/capital-gains-tax'} />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="bitcoincalculator.tools" />

  {/* Twitter Card Meta Tags */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={t('cgt.meta.title')} />
  <meta name="twitter:description" content={t('cgt.meta.twitterDescription')} />
  <meta name="twitter:creator" content="@web3believers" />
       
        <meta name="twitter:site" content="@web3believers" />
        {/* JSON-LD Structured Data for WebApplication */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": tr ? "Bitcoin Sermaye Kazancı Vergi Hesaplayıcısı 2026" : "Bitcoin Capital Gains Tax Calculator 2026",
            "inLanguage": tr ? "tr" : "en",
            "description": tr ? "Bitcoin kârınıza uygulanacak vergiyi tam olarak hesaplayın. Federal ve eyalet oranları, kısa ve uzun vadeli kazançlar, tüm beyan durumları. Ücretsiz." : "See exactly what you owe on your Bitcoin profits. Covers federal and all US state rates, short- and long-term gains, and all filing statuses. Free.",
            "url": tr ? "https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-vergi-hesaplayicisi" : "https://bitcoincalculator.tools/calculators/capital-gains-tax",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": tr ? "TRY" : "USD"
            },
            "featureList": [
              "2026 IRS federal tax brackets",
              "All 50 US state tax rates and DC",
              "Multiple filing status support (Single, MFJ, MFS, HoH)",
              "Annual income tax bracket integration",
              "Short-term vs long-term capital gains analysis",
              "Tax optimization and harvest-loss suggestions",
              "Professional tax reports and CSV export",
              "NIIT (Net Investment Income Tax) auto-detection",
              "Wash sale detection",
              "FIFO, LIFO, HIFO cost basis methods",
              "UK HMRC capital gains tax support"
            ],
            "provider": {
              "@type": "Organization",
              "name": "Bitcoin Calculator Tools"
            },
            "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" }
          })}
        </script>

        {/* HowTo JSON-LD Schema */}
        <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>

        {/* FAQ JSON-LD Schema */}
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>

      </Helmet>
  <HelmetOgImage slug="bitcoin-capital-gains-tax-calculator" enAlt={`Bitcoin Capital Gains Tax Calculator 2026 | bitcoincalculator.tools`} />

      <BreadcrumbSchema
        language={language}
        items={tr ? [
          { name: "Ana Sayfa", url: "https://bitcoincalculator.tools/tr/" },
          { name: "Hesaplayıcılar", url: "https://bitcoincalculator.tools/tr/hesaplayicilar" },
          { name: "Sermaye Kazancı Vergi Hesaplayıcısı", url: trUrl },
        ] : [
          { name: "Home", url: "https://bitcoincalculator.tools/" },
          { name: "Calculators", url: "https://bitcoincalculator.tools/calculators" },
          { name: "Capital Gains Tax", url: enUrl },
        ]}
      />

      <PageBackground variant="clean">
        <Header />
        
        <main id="main-content" className="pt-20 relative z-10">
          {/* Breadcrumb Navigation */}
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb 
              items={[
                { label: t('cgt.crumb.calculators'), href: language==='tr'?'/tr/hesaplayicilar':'/calculators' },
                { label: t('cgt.crumb.current') }
              ]} 
            />
          </div>
          
          {/* Hero Section */}
          <section className="container mx-auto px-6 py-16 text-center">
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/10">
                <Receipt className="w-4 h-4" />
                {t('cgt.hero.badge')}
              </div>
              
              <h1 className="text-h1 font-bold text-foreground">
                {t('cgt.hero.titlePrefix')} <span className="text-gradient-premium">{t('cgt.hero.titleMiddle')}</span> {t('cgt.hero.titleSuffix')}
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('cgt.hero.description')}
              </p>

              {/* Compact Live Bitcoin Price */}
              <div className="max-w-sm mx-auto">
                <CompactLiveBitcoinPrice currency="USD" />
              </div>

              {/* Feature badges */}
              <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-success" />
                  <span>{t('cgt.feature.multi')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-info" />
                  <span>{t('cgt.feature.reports')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-500" />
                  <span>{t('cgt.feature.optim')}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Calculator Section */}
          <PreCalcPlacement slug="capital-gains-tax" />
          <section className="container mx-auto px-6 pb-20">
            <div className="max-w-6xl mx-auto space-y-12">
              <QuickAnswerBox
                answer={t('cgt.quickAnswer')}
              />
              {/* duplicate QuickAnswerBox removed by Phase-3 patch */}
              {/* Offline Indicator */}
              <OfflineIndicator />

              {/* US / UK Tabs */}
              <Tabs defaultValue="us" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto gap-1 [&_button]:text-xs sm:[&_button]:text-sm">
                  <TabsTrigger value="us">
                    <span className="mr-1.5 inline-flex items-center justify-center rounded-sm bg-foreground/10 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-foreground">US</span>
                    {t('cgt.tabs.us')}
                  </TabsTrigger>
                  <TabsTrigger value="uk">
                    <span className="mr-1.5 inline-flex items-center justify-center rounded-sm bg-foreground/10 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-foreground">UK</span>
                    {t('cgt.tabs.uk')}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="us" className="space-y-12 mt-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Enhanced Tax Input Panel */}
                    <div>
                      <EnhancedTaxInputPanel
                        transactions={transactions}
                        config={config}
                        onTransactionsUpdate={handleTransactionsUpdate}
                        onConfigChange={handleConfigChange}
                        onCalculate={handleTaxCalculation}
                        loading={isCalculating}
                      />
                    </div>

                    {/* Enhanced Tax Results Panel */}
                    <div>
                      <ErrorBoundary>
                        {isCalculating && (
                          <Card className="glass-morphism-card border-border/20 shadow-sm">
                            <CardContent className="p-8 text-center">
                              <LoadingSpinner />
                              <p className="text-sm text-muted-foreground mt-4">
                                {t('cgt.calculating')}
                              </p>
                            </CardContent>
                          </Card>
                        )}

                        {taxResults && !isCalculating && (
                          <EnhancedTaxResultsPanel 
                            results={taxResults}
                            config={config}
                          />
                        )}

                        {!taxResults && !isCalculating && (
                          <Card className="glass-morphism-card border-border/20 shadow-sm">
                            <CardContent className="p-8 text-center">
                              <div className="space-y-4">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                                  <Receipt className="w-6 h-6 text-primary" />
                                </div>
                                <div className="space-y-1">
                                  <h3 className="text-lg font-semibold text-foreground">
                                    {t('cgt.ready.title')}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {t('cgt.ready.desc')}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </ErrorBoundary>
                    </div>
                  </div>

                  {/* Cost Basis Method Comparison */}
                  {taxResults && !isCalculating && (
                    <div className="animate-fade-in">
                      <CostBasisComparison transactions={transactions} config={config} />
                    </div>
                  )}

                  {/* Transaction Management Tabs */}
                  {transactions.length > 0 && (
                    <div className="animate-fade-in">
                      <Tabs defaultValue="transactions" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="transactions">{t('cgt.innerTabs.transactions')}</TabsTrigger>
                          <TabsTrigger value="optimization">{t('cgt.innerTabs.optimization')}</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="transactions" className="space-y-6 mt-6">
                          <TransactionTable
                            transactions={transactions}
                            taxResults={taxResults}
                            onTransactionsUpdate={handleTransactionsUpdate}
                          />
                        </TabsContent>

                        <TabsContent value="optimization" className="space-y-6 mt-6">
                          <Card className="glass-morphism-card border-border/20">
                            <CardContent className="p-6">
                              <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                  <TrendingUp className="w-5 h-5 text-success" />
                                  {t('cgt.optStrategies.title')}
                                </h3>
                                
                                {taxResults?.optimizationSuggestions.length ? (
                                  <div className="space-y-3">
                                    {taxResults.optimizationSuggestions.map((suggestion, index) => (
                                      <div key={index} className="p-3 bg-info-soft rounded-lg">
                                        <p className="text-sm text-info">{suggestion}</p>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="space-y-3 text-muted-foreground">
                                    <p className="text-sm">{t('cgt.optStrategies.placeholder')}</p>
                                    <ul className="text-sm space-y-1 ml-4">
                                      <li>• {t('cgt.optStrategies.bullet1')}</li>
                                      <li>• {t('cgt.optStrategies.bullet2')}</li>
                                      <li>• {t('cgt.optStrategies.bullet3')}</li>
                                      <li>• {t('cgt.optStrategies.bullet4')}</li>
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </TabsContent>
                      </Tabs>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="uk" className="mt-8">
                  <UKTaxPanel />
                </TabsContent>
              </Tabs>
            </div>
          </section>

          {/* UK H2 Section */}
          <section className="container mx-auto px-6 pb-12">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-h2 font-bold text-foreground mb-4">
                {t('cgt.uk.title')}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('cgt.uk.body')}
              </p>
            </div>
          </section>

          {/* Contextual Affiliate Recommendations */}

          {/* Educational Content */}
          <TaxContentSections />
          <TaxCalculatorHowItWorksSection />
          <PreFAQPlacement slug="capital-gains-tax" />
          <TaxCalculatorFAQSection />

          <MethodologyBlock
            methodology={t('cgt.methodology.body')}
            sources={[
              { label: t('cgt.methodology.source1'), url: 'https://www.irs.gov/pub/irs-drop/n-14-21.pdf', publisher: 'U.S. Internal Revenue Service' },
              { label: t('cgt.methodology.source2'), url: 'https://www.irs.gov/taxtopics/tc409', publisher: 'U.S. Internal Revenue Service' },
              { label: t('cgt.methodology.source3'), url: 'https://www.irs.gov/forms-pubs/about-form-8949', publisher: 'U.S. Internal Revenue Service' },
              { label: t('cgt.methodology.source4'), url: 'https://www.irs.gov/individuals/net-investment-income-tax', publisher: 'U.S. Internal Revenue Service' },
            ]}
            lastReviewed="2026-04-15"
            reviewedBy="Web3Believer & Webio"
            disclaimer={t('cgt.methodology.disclaimer')}
          />

          {/* Related Calculators Section */}
          <RelatedCalculators />

          {/* Disclaimer */}
          <section className="container mx-auto px-6 pb-16">
            <div className="max-w-3xl mx-auto">
              <Card className="glass-morphism-card border-border/20 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{t('cgt.disclaimer.title')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('cgt.disclaimer.body')}
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

export default BitcoinCapitalGainsTaxCalculator;