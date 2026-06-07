import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AffiliatePlacement } from "@/components/affiliateAI/AffiliatePlacement";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { DatasetSchema } from "@/components/seo/DatasetSchema";
import { PageBackground } from "@/components/modern/PageBackground";
import { ComparisonInputPanel } from "@/components/lumpsum-dca/ComparisonInputPanel";
import { ComparisonResultsPanel } from "@/components/lumpsum-dca/ComparisonResultsPanel";
import { ComparisonChart } from "@/components/lumpsum-dca/ComparisonChart";
import { StrategyComparison } from "@/components/lumpsum-dca/StrategyComparison";
import { RiskAnalysisPanel } from "@/components/lumpsum-dca/RiskAnalysisPanel";
import { LumpSumDCAFAQSection } from "@/components/lumpsum-dca/LumpSumDCAFAQSection";
import { LumpSumDCAHowItWorksSection } from "@/components/lumpsum-dca/LumpSumDCAHowItWorksSection";
import { LumpSumDCAContentSections } from "@/components/lumpsum-dca/LumpSumDCAContentSections";
import { CompactLiveBitcoinPrice } from "@/components/CompactLiveBitcoinPrice";
import { ExportReportButton } from "@/components/ExportReportButton";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import RelatedCalculators from "@/components/RelatedCalculators";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { EnhancedErrorDisplay } from "@/components/EnhancedErrorDisplay";
import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { bitcoinApi } from "@/services/bitcoinApi";
import { lumpSumDcaComparator, LumpSumParams, DCAParams, DVAParams, ComparisonResult } from "@/services/lumpSumDcaComparator";
import { GitCompare, AlertTriangle, TrendingUp } from "lucide-react";
import { QuickAnswerBox } from "@/components/calculator/QuickAnswerBox";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocalizedSchema } from "@/hooks/useLocalizedSchema";

const LumpSumVsDCACalculator = () => {
  const { language, t } = useLanguage();
  const enUrl = 'https://bitcoincalculator.tools/calculators/lump-sum-vs-dca';
  const trUrl = 'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-maliyet-ortalama';

  const webAppSchema = useLocalizedSchema(
    {
      "@context": "https://schema.org", "@type": "WebApplication", inLanguage: "en",
      "name": "Bitcoin Lump Sum vs DCA Calculator",
      "description": "Compare Bitcoin lump sum vs dollar cost averaging strategies with our free calculator. See which approach delivers better returns and reduces timing risk.",
      "url": enUrl, "applicationCategory": "FinanceApplication", "operatingSystem": "Any",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools" },
      "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
    },
    {
      "@context": "https://schema.org", "@type": "WebApplication", inLanguage: "tr",
      "name": "Bitcoin Toplu Tutar vs DCA Hesaplayıcısı",
      "description": "Bitcoin toplu yatırım ile dolar maliyet ortalaması (DCA) stratejilerini ücretsiz hesaplayıcımızla karşılaştırın. Hangi yaklaşımın daha iyi getiri sağladığını ve zamanlama riskini nasıl azalttığını görün.",
      "url": trUrl, "applicationCategory": "FinanceApplication", "operatingSystem": "Any",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "TRY" },
      "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools" },
      "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
    },
  );

  const howToSchema = useLocalizedSchema(
    {
      "@context": "https://schema.org", "@type": "HowTo", inLanguage: "en",
      "name": "How to Compare Lump Sum vs DCA Bitcoin Investing",
      "description": "Use this calculator to compare lump sum and dollar cost averaging strategies for Bitcoin.",
      "step": [
        { "@type": "HowToStep", "name": "Set Your Investment Amount", "text": "Enter the total amount you want to invest in Bitcoin." },
        { "@type": "HowToStep", "name": "Choose Your Time Period", "text": "Select the historical date range to backtest both strategies." },
        { "@type": "HowToStep", "name": "Configure DCA Frequency", "text": "Set how often you'd invest with DCA — weekly, biweekly, or monthly." },
        { "@type": "HowToStep", "name": "Compare Results", "text": "See side-by-side returns for lump sum vs DCA including total value, ROI, and risk metrics." },
      ],
    },
    {
      "@context": "https://schema.org", "@type": "HowTo", inLanguage: "tr",
      "name": "Bitcoin'de Toplu Tutar vs DCA Nasıl Karşılaştırılır",
      "description": "Bu hesaplayıcıyı kullanarak Bitcoin için toplu yatırım ve dolar maliyet ortalaması stratejilerini karşılaştırın.",
      "step": [
        { "@type": "HowToStep", "name": "Yatırım Tutarını Belirleyin", "text": "Bitcoin'e yatırmak istediğiniz toplam tutarı girin." },
        { "@type": "HowToStep", "name": "Zaman Dilimi Seçin", "text": "Her iki stratejiyi geriye dönük test etmek için tarihsel tarih aralığını seçin." },
        { "@type": "HowToStep", "name": "DCA Sıklığını Ayarlayın", "text": "DCA ile ne sıklıkla yatırım yapacağınızı belirleyin — haftalık, iki haftalık veya aylık." },
        { "@type": "HowToStep", "name": "Sonuçları Karşılaştırın", "text": "Toplam değer, ROI ve risk metrikleri dahil toplu tutar ile DCA için yan yana getirileri görün." },
      ],
    },
  );

  const faqSchema = useLocalizedSchema(
    {
      "@context": "https://schema.org", "@type": "FAQPage", inLanguage: "en",
      "mainEntity": [
        { "@type": "Question", "name": "What's the difference between lump sum and DCA investing?", "acceptedAnswer": { "@type": "Answer", "text": "Lump sum invests all money at once; DCA spreads purchases over time. Lump sum maximizes time-in-market but carries timing risk; DCA averages out price fluctuations." }},
        { "@type": "Question", "name": "Which strategy is better for Bitcoin?", "acceptedAnswer": { "@type": "Answer", "text": "Historically lump sum wins in strong bull markets while DCA tends to perform better in volatile or declining markets." }},
        { "@type": "Question", "name": "How does market volatility affect each strategy?", "acceptedAnswer": { "@type": "Answer", "text": "High volatility generally favors DCA because it buys more Bitcoin when prices are low. Lump sum investing in volatile markets carries more risk." }},
        { "@type": "Question", "name": "What if I don't have a lump sum available?", "acceptedAnswer": { "@type": "Answer", "text": "DCA is often the practical choice if you don't have a large amount to invest at once — it lets you invest consistently from income." }},
        { "@type": "Question", "name": "How accurate are historical comparisons?", "acceptedAnswer": { "@type": "Answer", "text": "Calculations use real historical Bitcoin price data. Past performance does not guarantee future results." }},
        { "@type": "Question", "name": "What about transaction fees?", "acceptedAnswer": { "@type": "Answer", "text": "Results show raw performance without fees. In practice, DCA typically incurs more fees due to multiple transactions." }},
        { "@type": "Question", "name": "What's the best DCA frequency?", "acceptedAnswer": { "@type": "Answer", "text": "Daily DCA provides the most averaging but higher fees. Monthly DCA aligns with salary payments and is popular." }},
        { "@type": "Question", "name": "How often does lump sum beat DCA in Bitcoin's history?", "acceptedAnswer": { "@type": "Answer", "text": "Across rolling 12-month entry periods since 2013, lump sum has outperformed 12-month DCA roughly 60% of the time when holding period extends beyond 4 years." }},
      ],
    },
    {
      "@context": "https://schema.org", "@type": "FAQPage", inLanguage: "tr",
      "mainEntity": [
        { "@type": "Question", "name": "Toplu tutar ile DCA yatırımı arasındaki fark nedir?", "acceptedAnswer": { "@type": "Answer", "text": "Toplu tutar tüm parayı bir kerede yatırır; DCA alımları zamana yayar. Toplu tutar piyasada kalma süresini maksimize eder ancak zamanlama riski taşır; DCA fiyat dalgalanmalarını ortalar." }},
        { "@type": "Question", "name": "Bitcoin için hangi strateji daha iyidir?", "acceptedAnswer": { "@type": "Answer", "text": "Tarihsel olarak güçlü boğa piyasalarında toplu tutar kazanır; oynak veya düşen piyasalarda DCA daha iyi performans gösterir." }},
        { "@type": "Question", "name": "Piyasa oynaklığı her stratejiyi nasıl etkiler?", "acceptedAnswer": { "@type": "Answer", "text": "Yüksek oynaklık genellikle DCA'yı destekler çünkü fiyatlar düşükken daha fazla Bitcoin alır. Oynak piyasalarda toplu tutar yatırım daha fazla risk taşır." }},
        { "@type": "Question", "name": "Elimde toplu tutar yoksa ne olur?", "acceptedAnswer": { "@type": "Answer", "text": "Bir kerede yatırılacak büyük bir tutarınız yoksa DCA pratik bir seçimdir; gelirinizden tutarlı şekilde yatırım yapmanızı sağlar." }},
        { "@type": "Question", "name": "Tarihsel karşılaştırmalar ne kadar doğrudur?", "acceptedAnswer": { "@type": "Answer", "text": "Hesaplamalar gerçek tarihsel Bitcoin fiyat verilerini kullanır. Geçmiş performans gelecekteki sonuçları garanti etmez." }},
        { "@type": "Question", "name": "İşlem ücretleri ne olacak?", "acceptedAnswer": { "@type": "Answer", "text": "Sonuçlar ücretler hariç ham performansı gösterir. Pratikte DCA, birden fazla işlem nedeniyle genellikle daha fazla ücret yaratır." }},
        { "@type": "Question", "name": "En iyi DCA sıklığı nedir?", "acceptedAnswer": { "@type": "Answer", "text": "Günlük DCA en fazla ortalamayı sağlar ancak ücretler yüksek olabilir. Aylık DCA maaş ödemeleriyle örtüştüğü için popülerdir." }},
        { "@type": "Question", "name": "Bitcoin tarihinde toplu tutar DCA'yı ne sıklıkta geçer?", "acceptedAnswer": { "@type": "Answer", "text": "2013'ten bu yana yuvarlanan 12 aylık giriş dönemlerinde, tutma süresi 4 yılı aştığında toplu tutar 12 aylık DCA'dan yaklaşık %60 oranında daha iyi performans göstermiştir." }},
      ],
    },
  );

  const [comparisonParams, setComparisonParams] = useState<{
    lumpSum: LumpSumParams;
    dca: DCAParams;
    dva?: DVAParams;
  } | null>(null);
  const [isManualCalculation, setIsManualCalculation] = useState(false);

  const { data: result, isLoading, error, refetch } = useQuery<ComparisonResult>({
    queryKey: ['lump-sum-dca-comparison', comparisonParams],
    queryFn: async () => {
      if (!comparisonParams) throw new Error('No comparison parameters');
      
      // Get historical price data for the required range
      const startDate = new Date(Math.min(
        comparisonParams.lumpSum.investmentDate.getTime(),
        comparisonParams.dca.startDate.getTime()
      ));
      const endDate = comparisonParams.dca.endDate;
      
      const priceData = await bitcoinApi.getHistoricalPriceDataRange(startDate, endDate, comparisonParams.lumpSum.currency);
      
      return lumpSumDcaComparator.compare(
        comparisonParams.lumpSum,
        comparisonParams.dca,
        priceData,
        comparisonParams.dva
      );
    },
    enabled: !!comparisonParams && isManualCalculation,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  });

  const handleCalculate = useCallback((params: {
    lumpSum: LumpSumParams;
    dca: DCAParams;
    dva?: DVAParams;
  }) => {
    setComparisonParams(params);
    setIsManualCalculation(true);
  }, []);

  const handleRetry = useCallback(() => {
    if (comparisonParams) {
      setIsManualCalculation(true);
      refetch();
    }
  }, [comparisonParams, refetch]);


  return (
    <>
<Helmet>
  <title>{language==='tr'?'Bitcoin Toplu Tutar vs DCA Hesaplayıcısı':'Bitcoin Lump Sum vs DCA Calculator'}</title>
  <meta name="description" content={language==='tr'?'Bitcoin toplu yatırım ve DCA (dolar maliyet ortalaması) stratejilerini ücretsiz karşılaştırın. Hangi yaklaşım daha iyi getiri sağlar, anında görün.':'Compare Bitcoin lump sum vs dollar cost averaging strategies with our free calculator. See which approach delivers better returns and reduces timing risk.'} />
  <meta name="keywords" content="lump sum vs dca bitcoin, bitcoin investment strategy, dollar cost averaging comparison, bitcoin timing risk" />
  <link rel="canonical" href={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-maliyet-ortalama':'https://bitcoincalculator.tools/calculators/lump-sum-vs-dca'} />

  <link rel="alternate" hrefLang="tr" href="https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-maliyet-ortalama" />
  <link rel="alternate" hrefLang="en" href="https://bitcoincalculator.tools/calculators/lump-sum-vs-dca" />
  <link rel="alternate" hrefLang="x-default" href="https://bitcoincalculator.tools/calculators/lump-sum-vs-dca" />
  <meta property="og:title" content={language==='tr'?'Bitcoin Toplu Tutar vs DCA Hesaplayıcısı':'Bitcoin Lump Sum vs DCA Calculator'} />
  <meta property="og:description" content={language==='tr'?'Bitcoin toplu yatırım ve DCA stratejilerini gerçek tarihsel verilerle karşılaştırın. Ücretsiz.':'Compare Bitcoin lump sum vs dollar cost averaging strategies with our free calculator. See which approach delivers better returns and reduces timing risk.'} />
  <meta property="og:url" content={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-maliyet-ortalama':'https://bitcoincalculator.tools/calculators/lump-sum-vs-dca'} />
  <meta property="og:type" content="website" />
  <meta property="og:image" content={(typeof window !== 'undefined' && window.location.pathname.startsWith('/tr')) ? 'https://bitcoincalculator.tools/bitcoin-kar-hesaplayici-og.webp' : 'https://bitcoincalculator.tools/social-preview.webp'} />
  <meta property="og:image:alt" content={(typeof window !== 'undefined' && window.location.pathname.startsWith('/tr')) ? 'Bitcoin Hesaplayıcıları — 45+ Ücretsiz Araç | bitcoincalculator.tools' : 'Bitcoin Lump Sum vs DCA Calculator | bitcoincalculator.tools'} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="bitcoincalculator.tools" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={language==='tr'?'Bitcoin Toplu Tutar vs DCA Hesaplayıcısı':'Bitcoin Lump Sum vs DCA Calculator'} />
  <meta name="twitter:description" content={language==='tr'?'Gerçek tarihsel verilerle toplu yatırım ve DCA Bitcoin stratejilerini karşılaştırın.':'Compare lump sum vs DCA Bitcoin strategies with real historical data.'} />
  <meta name="twitter:image" content={(typeof window !== 'undefined' && window.location.pathname.startsWith('/tr')) ? 'https://bitcoincalculator.tools/bitcoin-kar-hesaplayici-og.webp' : 'https://bitcoincalculator.tools/social-preview.webp'} />
  <meta name="twitter:creator" content="@web3believers" />
        
        <meta name="twitter:site" content="@web3believers" />
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <DatasetSchema
        name="Lump Sum vs DCA Bitcoin Dataset"
        description="Side-by-side dataset comparing lump-sum and dollar-cost-averaging entry strategies into Bitcoin across every historical entry window since 2010."
        url={language === 'tr' ? trUrl : enUrl}
        temporalCoverage="2010-07-17/.."
        variableMeasured={["Entry date", "Lump-sum present value (USD)", "DCA present value (USD)", "ROI delta %", "Max drawdown delta %"]}
        keywords={["lump sum vs dca", "bitcoin dca comparison", "btc strategy backtest dataset"]}
      />

      <BreadcrumbSchema
        language={language}
        items={language === 'tr' ? [
          { name: "Ana Sayfa", url: "https://bitcoincalculator.tools/tr/" },
          { name: "Hesaplayıcılar", url: "https://bitcoincalculator.tools/tr/hesaplayicilar" },
          { name: "Toplu Tutar vs DCA", url: trUrl },
        ] : [
          { name: "Home", url: "https://bitcoincalculator.tools/" },
          { name: "Calculators", url: "https://bitcoincalculator.tools/calculators" },
          { name: "Lump Sum vs DCA", url: enUrl },
        ]}
      />
      
      <PageBackground variant="clean">
        <Header />
        
        <main id="main-content" className="pt-20 relative z-10">
          {/* Breadcrumb Navigation */}
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb 
              items={[
                { label: language==='tr'?'Hesaplayıcılar':'Calculators', href: language==='tr'?'/tr/hesaplayicilar':'/calculators' },
                { label: language==='tr'?'Toplu Tutar vs DCA':'Lump Sum vs DCA' }
              ]} 
            />
          </div>
          
          {/* Header Section */}
          <section className="container mx-auto px-6 py-16 text-center">
            <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/10">
                <GitCompare className="w-4 h-4" />
                {language==='tr'?'Strateji Karşılaştırma Hesaplayıcısı':'Strategy Comparison Calculator'}
              </div>
              
              <h1 className="text-h1 font-bold text-foreground">
                {language==='tr'?<><span className="text-gradient-premium">Toplu Tutar vs DCA</span> Karşılaştırma</>:<><span className="text-gradient-premium">Lump Sum vs DCA</span> Calculator</>}
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {language==='tr'?'Bitcoin için toplu tutar, dolar maliyet ortalaması ve dolar değer ortalaması stratejilerini karşılaştırın. Tarihsel veriler ve risk analiziyle hangi yaklaşımın daha iyi performans gösterdiğini görün.':'Compare lump sum, dollar cost averaging, and dollar value averaging strategies for Bitcoin. See which approach would have performed better with historical data and risk analysis.'}
              </p>

              {/* Compact Live Bitcoin Price */}
              <div className="max-w-sm mx-auto">
                <CompactLiveBitcoinPrice currency={comparisonParams?.lumpSum.currency || 'USD'} />
              </div>
            </div>
          </section>

          {/* Calculator Section */}
          <section className="container mx-auto px-6 pb-20">
            <div className="max-w-6xl mx-auto space-y-12">
              <QuickAnswerBox answer={language==='tr'?'Toplu yatırım, tüm sermayenizi ilk günden Bitcoin’e koyar; dolar maliyeti ortalaması (DCA) bunu haftalara veya aylara yayar. Bitcoin’in tüm geçmişinde toplu yatırım, BTC çoğu yıl yükseldiği için zamanın yaklaşık %70’inde DCA’yı geçmiştir — ancak DCA, yerel bir zirveye yakın başlayan pencerelerin yaklaşık %30’unda düşüş riskini %40–60 azaltarak açık ara kazanır.':'Lump-sum investing puts all your capital into Bitcoin on day one; dollar-cost averaging (DCA) spreads it across weeks or months. Across Bitcoin\'s full history, lump-sum has beaten DCA roughly 70% of the time because BTC trends up most years — but DCA wins decisively during the 30% of windows that start near a local top, cutting drawdown by 40–60%.'} />
              {/* Offline Indicator */}
              <OfflineIndicator />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Input Panel */}
                <div>
                  <ComparisonInputPanel 
                    onCalculate={handleCalculate} 
                    loading={isLoading}
                  />
                </div>

                {/* Results Panel */}
                <div>
                  <ErrorBoundary>
                    {error && (
                      <EnhancedErrorDisplay 
                        error={error}
                        onRetry={handleRetry}
                        context="calculation"
                      />
                    )}

                    {isLoading && (
                      <Card className="glass-morphism-card border-border/20">
                        <CardContent className="p-8 flex items-center justify-center">
                          <div className="text-center space-y-4">
                            <LoadingSpinner />
                            <p className="text-sm text-muted-foreground">
                              {language==='tr'?'Stratejiler analiz ediliyor ve sonuçlar hesaplanıyor...':'Analyzing strategies and calculating results...'}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {result && !isLoading && (
                      <ComparisonResultsPanel result={result} currency={comparisonParams?.lumpSum.currency || 'USD'} />
                    )}

                    {!result && !isLoading && !error && (
                      <Card className="glass-morphism-card border-border/20 shadow-sm">
                        <CardContent className="p-8 text-center">
                          <div className="space-y-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                              <GitCompare className="w-6 h-6 text-primary" />
                            </div>
                            <div className="space-y-1">
                              <h3 className="text-lg font-semibold text-foreground">
                                {language==='tr'?'Stratejileri Karşılaştırmaya Hazır':'Ready to Compare Strategies'}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {language==='tr'?'Hem toplu tutar hem de DCA parametrelerini ayarlayın, ardından karşılaştır\'a tıklayın':'Configure both lump sum and DCA parameters, then click compare'}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </ErrorBoundary>
                </div>
              </div>

              {/* Chart Section */}
              {result && (
                <div className="animate-fade-in">
                  <ComparisonChart result={result} />
                </div>
              )}

              {/* Strategy Comparison */}
              {result && (
                <div className="animate-fade-in">
                  <StrategyComparison result={result} />
                </div>
              )}

              {/* Risk Analysis */}
              {result && (
                <div className="animate-fade-in">
                  <RiskAnalysisPanel result={result} />
                </div>
              )}

              {/* Export Section */}
              {result && (
                <div className="animate-fade-in text-center">
                  <Card className="glass-morphism-card border-border/20 p-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">
                        {language==='tr'?'Karşılaştırmanızı Dışa Aktarın':'Export Your Comparison'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {language==='tr'?'Strateji karşılaştırma analizinizi profesyonel bir rapor olarak kaydedin':'Save your strategy comparison analysis as a professional report'}
                      </p>
                      <ExportReportButton 
                        result={{
                          investmentAmount: result.lumpSum.totalInvested,
                          currency: comparisonParams?.lumpSum.currency || 'USD',
                          startDate: comparisonParams?.lumpSum.investmentDate.toISOString() || '',
                          startPrice: result.lumpSum.averageBuyPrice,
                          currentPrice: result.lumpSum.currentValue / result.lumpSum.totalBitcoin,
                          btcAmount: result.lumpSum.totalBitcoin,
                          currentValue: result.lumpSum.currentValue,
                          profitLoss: result.lumpSum.profitLoss,
                          roiPercentage: result.lumpSum.roiPercentage,
                          priceData: []
                        }} 
                      />
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </section>

          {/* How It Works Section */}
          <section className="bg-background/50">
            <div className="backdrop-blur-sm">
              <LumpSumDCAHowItWorksSection />
            </div>
          </section>

          {/* FAQ Section */}
          <LumpSumDCAContentSections />
          <LumpSumDCAFAQSection />

          {/* Related Calculators */}
          <div className="container mx-auto px-6 max-w-5xl"><AffiliatePlacement slug="lump-sum-vs-dca" /></div>
          <RelatedCalculators />

          {/* Disclaimer */}
          <section className="container mx-auto px-6 pb-16">
            <div className="max-w-3xl mx-auto">
              <Card className="glass-morphism-card border-border/20 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{language==='tr'?'Yatırım Sorumluluk Reddi':'Investment Disclaimer'}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {language==='tr'?'Bu hesaplayıcı yalnızca tarihsel analiz sunar ve gelecekteki performansı tahmin edemez. Kripto para yatırımları son derece değişken ve risklidir. Geçmiş performans gelecekteki sonuçları garanti etmez. Her zaman kendi araştırmanızı yapın ve risk toleransınızı göz önünde bulundurun.':'This calculator provides historical analysis only and cannot predict future performance. Cryptocurrency investments are highly volatile and risky. Past performance does not guarantee future results. Always conduct your own research and consider your risk tolerance.'}
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

export default LumpSumVsDCACalculator;