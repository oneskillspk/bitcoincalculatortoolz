import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { DatasetSchema } from "@/components/seo/DatasetSchema";
import { PageBackground } from "@/components/modern/PageBackground";
import { ComparisonInputPanel } from "@/components/lumpsum-dca/ComparisonInputPanel";
import { ComparisonResultsPanel } from "@/components/lumpsum-dca/ComparisonResultsPanel";
import { ComparisonChart } from "@/components/lumpsum-dca/ComparisonChart";
import { StrategyComparison } from "@/components/lumpsum-dca/StrategyComparison";
import { RiskAnalysisPanel } from "@/components/lumpsum-dca/RiskAnalysisPanel";
import { LumpSumDCAHero } from "@/components/lumpsum-dca/LumpSumDCAHero";
import { LumpSumDCAZoneTwo } from "@/components/lumpsum-dca/LumpSumDCAZoneTwo";
import { LumpSumDCAZoneThree } from "@/components/lumpsum-dca/LumpSumDCAZoneThree";
import { LumpSumDCAZoneFour } from "@/components/lumpsum-dca/LumpSumDCAZoneFour";
import { SectionHeader } from "@/components/lumpsum-dca/SectionHeader";
import { ExportReportButton } from "@/components/ExportReportButton";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { EnhancedErrorDisplay } from "@/components/EnhancedErrorDisplay";
import { EmptyState, ResultPanel, ResultsGrid, PageSection } from "@/components/calculator";
import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { bitcoinApi } from "@/services/bitcoinApi";
import { lumpSumDcaComparator, LumpSumParams, DCAParams, DVAParams, ComparisonResult } from "@/services/lumpSumDcaComparator";
import { GitCompare, AlertTriangle, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuickAnswerBox } from "@/components/calculator/QuickAnswerBox";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocalizedSchema } from "@/hooks/useLocalizedSchema";

import { HelmetOgImage } from "@/components/seo/HelmetOgImage";

const LumpSumVsDCACalculator = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';
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

  const itemListSchema = useLocalizedSchema(
    {
      "@context": "https://schema.org", "@type": "ItemList", inLanguage: "en",
      "name": "Bitcoin Investment Strategies Compared",
      "description": "Three investment strategies backtested against real Bitcoin price history.",
      "itemListOrder": "https://schema.org/ItemListUnordered",
      "numberOfItems": 3,
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Lump Sum Investing", "description": "Invest the entire capital in Bitcoin on a single day to maximize time-in-market exposure." },
        { "@type": "ListItem", "position": 2, "name": "Dollar-Cost Averaging (DCA)", "description": "Spread purchases across regular intervals to average the entry price and reduce timing risk." },
        { "@type": "ListItem", "position": 3, "name": "Dollar-Value Averaging (DVA)", "description": "Adjust each contribution so the portfolio value grows on a predetermined target path." },
      ],
    },
    {
      "@context": "https://schema.org", "@type": "ItemList", inLanguage: "tr",
      "name": "Karşılaştırılan Bitcoin Yatırım Stratejileri",
      "description": "Gerçek Bitcoin fiyat geçmişine karşı geriye dönük test edilen üç yatırım stratejisi.",
      "itemListOrder": "https://schema.org/ItemListUnordered",
      "numberOfItems": 3,
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Toplu Yatırım", "description": "Tüm sermayeyi tek bir günde Bitcoin'e yatırarak piyasada kalma süresini en üst düzeye çıkarın." },
        { "@type": "ListItem", "position": 2, "name": "Dolar Maliyet Ortalaması (DCA)", "description": "Alımları düzenli aralıklara yayarak giriş fiyatını ortalayın ve zamanlama riskini azaltın." },
        { "@type": "ListItem", "position": 3, "name": "Dolar Değer Ortalaması (DVA)", "description": "Portföy değerinin belirli bir hedef yol izlemesi için her katkıyı ayarlayın." },
      ],
    },
  );

  const softwareSchema = useLocalizedSchema(
    {
      "@context": "https://schema.org", "@type": "SoftwareApplication", inLanguage: "en",
      "name": "Bitcoin Lump Sum vs DCA Calculator",
      "applicationCategory": "FinanceApplication",
      "applicationSubCategory": "Investment Backtesting Calculator",
      "operatingSystem": "Any",
      "url": enUrl,
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "featureList": [
        "Backtest lump-sum, DCA, and DVA strategies against real Bitcoin price data",
        "Configure investment amount, currency, frequency, and date range",
        "Side-by-side ROI, total value, and BTC accumulated comparisons",
        "Risk analysis with volatility, drawdown, and Sharpe-style metrics",
        "Downloadable PDF report and print-friendly view",
      ],
    },
    {
      "@context": "https://schema.org", "@type": "SoftwareApplication", inLanguage: "tr",
      "name": "Bitcoin Toplu Tutar vs DCA Hesaplayıcısı",
      "applicationCategory": "FinanceApplication",
      "applicationSubCategory": "Yatırım Geriye Dönük Test Hesaplayıcısı",
      "operatingSystem": "Any",
      "url": trUrl,
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "TRY" },
      "featureList": [
        "Toplu yatırım, DCA ve DVA stratejilerini gerçek Bitcoin fiyat verileriyle test edin",
        "Yatırım tutarı, para birimi, sıklık ve tarih aralığı ayarlayın",
        "Yan yana ROI, toplam değer ve biriken BTC karşılaştırmaları",
        "Oynaklık, düşüş ve Sharpe tarzı risk metrikleri",
        "İndirilebilir PDF raporu ve yazdırıcı dostu görünüm",
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
      const startDate = new Date(Math.min(
        comparisonParams.lumpSum.investmentDate.getTime(),
        comparisonParams.dca.startDate.getTime(),
      ));
      const endDate = comparisonParams.dca.endDate;
      const priceData = await bitcoinApi.getHistoricalPriceDataRange(startDate, endDate, comparisonParams.lumpSum.currency);
      return lumpSumDcaComparator.compare(
        comparisonParams.lumpSum,
        comparisonParams.dca,
        priceData,
        comparisonParams.dva,
      );
    },
    enabled: !!comparisonParams && isManualCalculation,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
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

  const currency = comparisonParams?.lumpSum.currency || 'USD';

  return (
    <>
      <Helmet>
        <title>{tr ? 'Bitcoin Toplu Tutar vs DCA Hesaplayıcısı' : 'Bitcoin Lump Sum vs DCA Calculator'}</title>
        <meta name="description" content={tr ? 'Bitcoin toplu yatırım ve DCA (dolar maliyet ortalaması) stratejilerini ücretsiz karşılaştırın. Hangi yaklaşım daha iyi getiri sağlar, anında görün.' : 'Compare Bitcoin lump sum vs dollar cost averaging strategies with our free calculator. See which approach delivers better returns and reduces timing risk.'} />
        <link rel="canonical" href={tr ? trUrl : enUrl} />
        <link rel="alternate" hrefLang="tr" href={trUrl} />
        <link rel="alternate" hrefLang="en" href={enUrl} />
        <link rel="alternate" hrefLang="x-default" href={enUrl} />
        <meta property="og:title" content={tr ? 'Bitcoin Toplu Tutar vs DCA Hesaplayıcısı' : 'Bitcoin Lump Sum vs DCA Calculator'} />
        <meta property="og:description" content={tr ? 'Bitcoin toplu yatırım ve DCA stratejilerini gerçek tarihsel verilerle karşılaştırın. Ücretsiz.' : 'Compare Bitcoin lump sum vs dollar cost averaging strategies with our free calculator. See which approach delivers better returns and reduces timing risk.'} />
        <meta property="og:url" content={tr ? trUrl : enUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="bitcoincalculator.tools" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={tr ? 'Bitcoin Toplu Tutar vs DCA Hesaplayıcısı' : 'Bitcoin Lump Sum vs DCA Calculator'} />
        <meta name="twitter:description" content={tr ? 'Gerçek tarihsel verilerle toplu yatırım ve DCA Bitcoin stratejilerini karşılaştırın.' : 'Compare lump sum vs DCA Bitcoin strategies with real historical data.'} />
        <meta name="twitter:creator" content="@web3believers" />
        <meta name="twitter:site" content="@web3believers" />
        <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(softwareSchema)}</script>
      </Helmet>
      <HelmetOgImage slug="lump-sum-vs-dca-calculator" enAlt="Bitcoin Lump Sum vs DCA Calculator | bitcoincalculator.tools" />

      <DatasetSchema
        name="Lump Sum vs DCA Bitcoin Dataset"
        description="Side-by-side dataset comparing lump-sum and dollar-cost-averaging entry strategies into Bitcoin across every historical entry window since 2010."
        url={tr ? trUrl : enUrl}
        temporalCoverage="2010-07-17/.."
        variableMeasured={["Entry date", "Lump-sum present value (USD)", "DCA present value (USD)", "ROI delta %", "Max drawdown delta %"]}
        keywords={["lump sum vs dca", "bitcoin dca comparison", "btc strategy backtest dataset"]}
      />

      <BreadcrumbSchema
        language={language}
        items={tr ? [
          { name: 'Ana Sayfa', url: 'https://bitcoincalculator.tools/tr/' },
          { name: 'Hesaplayıcılar', url: 'https://bitcoincalculator.tools/tr/hesaplayicilar' },
          { name: 'Toplu Tutar vs DCA', url: trUrl },
        ] : [
          { name: 'Home', url: 'https://bitcoincalculator.tools/' },
          { name: 'Calculators', url: 'https://bitcoincalculator.tools/calculators' },
          { name: 'Lump Sum vs DCA', url: enUrl },
        ]}
      />

      <PageBackground variant="clean">
        <Header />

        <main id="main-content" className="pt-20 relative z-10">
          {/* Breadcrumb */}
          <div className="container mx-auto px-6 pt-8 no-print">
            <Breadcrumb
              items={[
                { label: tr ? 'Hesaplayıcılar' : 'Calculators', href: tr ? '/tr/hesaplayicilar' : '/calculators' },
                { label: tr ? 'Toplu Tutar vs DCA' : 'Lump Sum vs DCA' },
              ]}
            />
          </div>

          {/* Hero */}
          <div className="no-print">
            <LumpSumDCAHero language={language} currency={currency} />
          </div>

          {/* Calculator Zone */}
          <PageSection tone="default" width="wide" spacing="default" aria-labelledby="lump-sum-dca-backtest-heading">
            <SectionHeader
              id="lump-sum-dca-backtest-heading"
              eyebrow={tr ? 'Geriye Dönük Test' : 'Backtest'}
              title={tr ? 'Stratejileri Karşılaştırın' : 'Compare Strategies'}
              lead={tr
                ? 'Toplu yatırım, DCA ve DVA parametrelerini yapılandırın; her ikisini de aynı gerçek Bitcoin geçmişine karşı test edin.'
                : 'Configure your lump sum, DCA, and DVA parameters, then backtest all three against real Bitcoin price history.'}
            />

            <QuickAnswerBox answer={tr
              ? 'Toplu yatırım, tüm sermayenizi ilk günden Bitcoin\'e koyar; dolar maliyeti ortalaması (DCA) bunu haftalara veya aylara yayar. Bitcoin\'in tüm geçmişinde toplu yatırım, BTC çoğu yıl yükseldiği için zamanın yaklaşık %70\'inde DCA\'yı geçmiştir — ancak DCA, yerel bir zirveye yakın başlayan pencerelerin yaklaşık %30\'unda düşüş riskini %40–60 azaltarak açık ara kazanır.'
              : "Lump-sum investing puts all your capital into Bitcoin on day one; dollar-cost averaging (DCA) spreads it across weeks or months. Across Bitcoin's full history, lump-sum has beaten DCA roughly 70% of the time because BTC trends up most years — but DCA wins decisively during the 30% of windows that start near a local top, cutting drawdown by 40–60%."} />

            <OfflineIndicator />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-8">
              <div>
                <ComparisonInputPanel onCalculate={handleCalculate} loading={isLoading} />
              </div>

              <div>
                <ErrorBoundary>
                  {error && (
                    <ResultPanel
                      icon={<AlertTriangle />}
                      title={tr ? 'Hesaplama hatası' : 'Calculation error'}
                      accentBar="negative"
                      aria-live="polite"
                      aria-atomic="true"
                      aria-label={tr ? 'Hesaplama hatası' : 'Calculation error'}
                    >
                      <EnhancedErrorDisplay error={error} onRetry={handleRetry} context="calculation" />
                    </ResultPanel>
                  )}

                  {isLoading && !error && (
                    <ResultPanel
                      icon={<GitCompare />}
                      title={tr ? 'Sonuçlar hesaplanıyor' : 'Calculating results'}
                      aria-live="polite"
                      aria-atomic="true"
                      aria-label={tr ? 'Yükleniyor' : 'Loading'}
                    >
                      <ResultsGrid cols={2}>
                        <Skeleton className="h-[100px] rounded-xl" />
                        <Skeleton className="h-[100px] rounded-xl" />
                        <Skeleton className="h-[100px] rounded-xl" />
                        <Skeleton className="h-[100px] rounded-xl" />
                      </ResultsGrid>
                    </ResultPanel>
                  )}

                  {result && !isLoading && (
                    <ComparisonResultsPanel result={result} currency={currency} />
                  )}

                  {!result && !isLoading && !error && (
                    <ResultPanel
                      icon={<GitCompare />}
                      title={tr ? 'Sonuçlar' : 'Results'}
                      aria-live="polite"
                      aria-atomic="true"
                      aria-label={tr ? 'Boş sonuç' : 'Empty result'}
                    >
                      <EmptyState
                        icon={<GitCompare />}
                        title={tr ? 'Stratejileri karşılaştırmaya hazır' : 'Ready to compare strategies'}
                        description={tr
                          ? 'Parametreleri ayarlayın ve karşılaştır\'a tıklayın.'
                          : 'Configure your parameters and click compare.'}
                      />
                    </ResultPanel>
                  )}
                </ErrorBoundary>
              </div>
            </div>

            {result && (
              <div className="mt-12 space-y-8 animate-fade-in">
                <ComparisonChart result={result} />
                <StrategyComparison result={result} currency={currency} />
                <RiskAnalysisPanel result={result} currency={currency} />

                <div className="calc-surface-subtle p-6">
                  <SectionHeader
                    eyebrow={tr ? 'Dışa Aktar' : 'Export'}
                    title={tr ? 'Karşılaştırmanızı kaydedin' : 'Save your comparison'}
                    lead={tr
                      ? 'Strateji karşılaştırma analizinizi profesyonel bir PDF raporu olarak dışa aktarın.'
                      : 'Export your strategy comparison analysis as a professional PDF report.'}
                    className="mb-6"
                  />
                  <div className="flex justify-center">
                    <ExportReportButton
                      slug="lump-sum-vs-dca"
                      headline={tr ? 'Toplu Alım vs DCA karşılaştırması' : 'Lump-Sum vs DCA comparison'}
                      pdfTitle={{ en: 'Lump-Sum vs DCA Comparison', tr: 'Toplu Alım vs DCA Karşılaştırması' }}
                      pdfFilename={{ en: 'bitcoin-lump-sum-vs-dca-report', tr: 'bitcoin-toplu-vs-dca-raporu' }}
                      shareParams={{
                        amount: result.lumpSum.totalInvested,
                        currency,
                        date: comparisonParams?.lumpSum.investmentDate,
                      }}
                      result={{
                        investmentAmount: result.lumpSum.totalInvested,
                        currency,
                        startDate: comparisonParams?.lumpSum.investmentDate.toISOString() || '',
                        startPrice: result.lumpSum.averageBuyPrice,
                        currentPrice: result.lumpSum.currentValue / result.lumpSum.totalBitcoin,
                        btcAmount: result.lumpSum.totalBitcoin,
                        currentValue: result.lumpSum.currentValue,
                        profitLoss: result.lumpSum.profitLoss,
                        roiPercentage: result.lumpSum.roiPercentage,
                        priceData: [],
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </PageSection>

          {/* Zone 2 — Data & Comparison */}
          <LumpSumDCAZoneTwo language={language} />

          {/* Zone 3 — Editorial / How It Works */}
          <LumpSumDCAZoneThree language={language} />

          {/* Zone 4 — FAQ + Methodology + Related + Disclaimer */}
          <LumpSumDCAZoneFour language={language} />
        </main>
        <Footer />
      </PageBackground>
    </>
  );
};

export default LumpSumVsDCACalculator;
