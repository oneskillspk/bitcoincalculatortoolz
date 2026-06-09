import { Link } from '@/components/LocalizedLink';
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AffiliatePlacement } from "@/components/affiliateAI/AffiliatePlacement";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { DatasetSchema } from "@/components/seo/DatasetSchema";
import { PageBackground } from "@/components/modern/PageBackground";
import { ModernInputPanel } from "@/components/modern/ModernInputPanel";
import { ModernResultsPanel } from "@/components/modern/ModernResultsPanel";
import { ModernChart } from "@/components/modern/ModernChart";
import { ResultsSection } from "@/components/ResultsSection";
import { InvestmentChart } from "@/components/InvestmentChart";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { BitcoinStorySection } from "@/components/BitcoinStorySection";
import { CompactLiveBitcoinPrice } from "@/components/CompactLiveBitcoinPrice";
import { HistoricalAnalysis } from "@/components/HistoricalAnalysis";
import { PurchaseComparison } from "@/components/PurchaseComparison";
import { ModernCrossAssetComparison } from "@/components/modern/ModernCrossAssetComparison";
import { ModernPurchaseComparison } from "@/components/modern/ModernPurchaseComparison";
import { ExportReportButton } from "@/components/ExportReportButton";
import { CalculationProgressStages } from "@/components/CalculationProgressStages";
import { EnhancedErrorDisplay } from "@/components/EnhancedErrorDisplay";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { NewHowItWorksSection } from "@/components/NewHowItWorksSection";
import { WhatIfRealExamples } from "@/components/what-if/WhatIfRealExamples";
import { WhatIfWhyBitcoinGrew } from "@/components/what-if/WhatIfWhyBitcoinGrew";
import { WhatIfKeyDates } from "@/components/what-if/WhatIfKeyDates";
import { WhatIfContentSections } from "@/components/what-if/WhatIfContentSections";
import { WhatIfScenarioInsightsPanel } from "@/components/what-if/WhatIfScenarioInsightsPanel";
import { WhatIfShareSnapshot } from "@/components/what-if/WhatIfShareSnapshot";
import RelatedCalculators from "@/components/RelatedCalculators";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { bitcoinApi, CalculationResult } from "@/services/bitcoinApi";
import { AlertTriangle, Calculator, TrendingUp } from "lucide-react";
import { useEffect } from "react";
import { CopyShareLinkButton } from "@/components/share/CopyShareLinkButton";
import { readShareParams } from "@/utils/shareLink";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocalizedSchema } from "@/hooks/useLocalizedSchema";

const BitcoinWhatIfCalculator = () => {
  const { language, t } = useLanguage();

  const trUrl = "https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-ya-olsaydi";
  const enUrl = "https://bitcoincalculator.tools/calculators/what-if";

  const webAppSchemaLocalized = useLocalizedSchema(
    {
      "@context": "https://schema.org", "@type": "WebApplication", "inLanguage": "en",
      "name": "Bitcoin What If Calculator",
      "description": "What if you had put $1,000 into Bitcoin in 2020? Or 2017? Or 2013? Enter any amount and any date — find out what you would be sitting on right now.",
      "url": enUrl, "applicationCategory": "FinanceApplication", "operatingSystem": "Any",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "featureList": [
        "Pre-loaded historical milestone presets (Pizza Day, halvings, COVID low)",
        "Dual-mode input (fiat USD or BTC quantity)",
        "Inflation-adjusted return toggle (CPI)",
        "4-year hold analysis card",
        "Best vs worst entry table by cycle",
        "Tax estimate toggle (long-term capital gains)",
        "Cross-asset performance comparison",
        "Social share snapshot (PNG)",
        "Daily historical price data back to 2010",
      ],
      "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools" },
      "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
    },
    {
      "@context": "https://schema.org", "@type": "WebApplication", "inLanguage": "tr",
      "name": "Bitcoin Ya Olsaydı Hesaplayıcısı",
      "description": "2020'de Bitcoin'e 1.000 $ koysaydınız ne olurdu? Ya 2017'de? Herhangi bir miktar ve tarih girin — şu anda elinizdekini öğrenin.",
      "url": trUrl, "applicationCategory": "FinanceApplication", "operatingSystem": "Any",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "TRY" },
      "featureList": [
        "Önceden yüklenmiş tarihsel kilometre taşı ön ayarları (Pizza Günü, yarılamalar, COVID dibi)",
        "Çift mod giriş (fiat USD veya BTC miktarı)",
        "Enflasyona göre düzeltilmiş getiri seçeneği (TÜFE)",
        "4 yıllık tutma analiz kartı",
        "Döngüye göre en iyi ve en kötü giriş tablosu",
        "Vergi tahmin seçeneği (uzun vadeli sermaye kazancı)",
        "Çoklu varlık performans karşılaştırması",
        "Sosyal paylaşım anlık görüntüsü (PNG)",
        "2010'a kadar günlük tarihsel fiyat verisi",
      ],
      "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools" },
      "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
    },
  );

  const howToSchemaLocalized = useLocalizedSchema(
    {
      "@context": "https://schema.org", "@type": "HowTo", "inLanguage": "en",
      "name": "How to Calculate Historical Bitcoin Investment Returns",
      "description": "Step-by-step guide to calculate what your Bitcoin investment would be worth today",
      "totalTime": "PT2M",
      "step": [
        { "@type": "HowToStep", "name": "Enter Investment Amount", "text": "Input the amount you would have invested in your preferred currency (USD, EUR, etc.)", "url": `${enUrl}#step1` },
        { "@type": "HowToStep", "name": "Select Investment Date", "text": "Choose the historical date when you would have made the Bitcoin investment", "url": `${enUrl}#step2` },
        { "@type": "HowToStep", "name": "Calculate Returns", "text": "Click calculate to see your current value, total profit, ROI percentage, and annualized returns", "url": `${enUrl}#step3` },
        { "@type": "HowToStep", "name": "Analyze Results", "text": "Review the interactive chart, compare with other assets, and export your results if needed", "url": `${enUrl}#step4` },
      ],
    },
    {
      "@context": "https://schema.org", "@type": "HowTo", "inLanguage": "tr",
      "name": "Bitcoin'in Tarihsel Yatırım Getirilerini Nasıl Hesaplarsınız",
      "description": "Bitcoin yatırımınızın bugün ne kadar değerinde olabileceğini hesaplamak için adım adım rehber",
      "totalTime": "PT2M",
      "step": [
        { "@type": "HowToStep", "name": "Yatırım Tutarını Girin", "text": "Tercih ettiğiniz para biriminde (USD, TRY, EUR vb.) yatırım yapmış olacağınız miktarı girin", "url": `${trUrl}#step1` },
        { "@type": "HowToStep", "name": "Yatırım Tarihini Seçin", "text": "Bitcoin yatırımını yapmış olacağınız tarihsel günü seçin", "url": `${trUrl}#step2` },
        { "@type": "HowToStep", "name": "Getiriyi Hesaplayın", "text": "Güncel değeri, toplam kârı, ROI yüzdesini ve yıllıklandırılmış getiriyi görmek için hesapla'ya tıklayın", "url": `${trUrl}#step3` },
        { "@type": "HowToStep", "name": "Sonuçları Analiz Edin", "text": "İnteraktif grafiği inceleyin, diğer varlıklarla karşılaştırın ve gerekirse sonuçları dışa aktarın", "url": `${trUrl}#step4` },
      ],
    },
  );

  const faqSchemaLocalized = useLocalizedSchema(
    null,
    {
      "@context": "https://schema.org", "@type": "FAQPage", "inLanguage": "tr", "url": trUrl,
      "mainEntity": [
        { "@type": "Question", "name": "Bu Bitcoin hesaplayıcısı ne kadar doğru?", "acceptedAnswer": { "@type": "Answer", "text": "Hesaplayıcı, geçmiş bir yatırımın performansını yüksek doğrulukla göstermek için Bitcoin'in tarihsel günlük kapanış fiyatlarını kullanır. Nihai değer, tarihsel verilere dayalı kesin bir hesaplamadır." } },
        { "@type": "Question", "name": "Yatırım Getirisi (ROI) nedir?", "acceptedAnswer": { "@type": "Answer", "text": "ROI, bir yatırımın ne kadar kârlı olduğunu gösteren yüzdedir. Net kâr ilk yatırım tutarına bölünerek hesaplanır. %500 ROI, kârın başlangıç yatırımının beş katı olduğunu gösterir." } },
        { "@type": "Question", "name": "Bu hesaplama işlem ücretlerini içeriyor mu?", "acceptedAnswer": { "@type": "Answer", "text": "Hayır. Hesaplayıcı piyasa fiyatına göre ham varlık büyümesini gösterir. Platforma göre değişebilen borsa veya işlem ücretlerini dikkate almaz." } },
        { "@type": "Question", "name": "Bu hesaplayıcı gelecekteki Bitcoin fiyatlarını tahmin edebilir mi?", "acceptedAnswer": { "@type": "Answer", "text": "Bu araç yalnızca geçmiş analizi içindir ve gelecekteki performansı tahmin edemez. Kripto piyasası oldukça oynaktır; geçmiş sonuçlar gelecekteki getirilerin göstergesi değildir." } },
        { "@type": "Question", "name": "10 yıl önce Bitcoin'e 100 $ yatırsaydım?", "acceptedAnswer": { "@type": "Answer", "text": "2014 başında yapılan 100 $'lık bir yatırım, tarihe bağlı olarak bugün yaklaşık 18.000–25.000 $ değerinde olurdu — %18.000'in üzerinde getiri. Tam rakamı görmek için hesaplayıcıyı kendi tarihinizle kullanın." } },
        { "@type": "Question", "name": "Bitcoin'e yatırım yapmak için artık geç mi?", "acceptedAnswer": { "@type": "Answer", "text": "Bu soru 100 $, 1.000 $, 10.000 $ ve 60.000 $ gibi her büyük fiyat seviyesinde sorulmuştur. Her seferinde Bitcoin önemli ölçüde daha yüksek fiyatlara ulaştı. Geçmiş performans garanti vermese de uzun vadeli sahiplerin tarihsel olarak ödüllendirildiği görülmektedir." } },
        { "@type": "Question", "name": "Bitcoin kârımı nasıl hesaplarım?", "acceptedAnswer": { "@type": "Answer", "text": "Kâr = (Güncel Değer − Başlangıç Yatırımı). ROI yüzdesi = ((Güncel Değer − Başlangıç Yatırımı) ÷ Başlangıç Yatırımı) × 100." } },
        { "@type": "Question", "name": "Yıllıklandırılmış getiri (CAGR) nasıl hesaplanır?", "acceptedAnswer": { "@type": "Answer", "text": "CAGR = (Bitiş Değeri ÷ Başlangıç Değeri)^(1 ÷ Yıl) − 1, yüzde olarak ifade edilir. 2017'deki 1.000 $'ın 9 yılda 100.000 $'a ulaşması ≈ yıllık %66 CAGR demektir." } },
      ],
    },
  );

  // Hydrate from shared URL once on mount.
  // Example: /calculators/what-if?amount=1000&start=2017-01-01&currency=USD&mode=fiat
  const initialFromUrl = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const p = readShareParams();
    if (!p.has('amount') && !p.has('start')) return null;
    const mode = p.string('mode');
    return {
      amount: p.number('amount'),
      startDate: p.date('start'),
      currency: p.string('currency'),
      inputMode: (mode === 'btc' ? 'btc' : 'fiat') as 'fiat' | 'btc',
      showInBtc: p.bool('showBtc'),
    };
  }, []);

  const [calculationParams, setCalculationParams] = useState<{
    amount: number;
    startDate: Date;
    currency: string;
    showInBtc: boolean;
    inputMode: 'fiat' | 'btc';
  } | null>(null);
  const [isManualCalculation, setIsManualCalculation] = useState(false);
  const [calculationStage, setCalculationStage] = useState<'fetching-current' | 'fetching-historical' | 'fetching-range' | 'calculating' | 'complete'>('fetching-current');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const { data: result, isLoading, error, refetch } = useQuery<CalculationResult>({
    queryKey: ['bitcoin-calculation', calculationParams],
    queryFn: async () => {
      if (!calculationParams) throw new Error('No calculation parameters');
      
      // Simulate calculation stages for better UX
      setCalculationStage('fetching-current');
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setCalculationStage('fetching-historical');
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setCalculationStage('fetching-range');
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setCalculationStage('calculating');
      const result = calculationParams.inputMode === 'btc'
        ? await bitcoinApi.calculateInvestmentFromBtc(
            calculationParams.amount,
            calculationParams.startDate,
            calculationParams.currency
          )
        : await bitcoinApi.calculateInvestment(
            calculationParams.amount,
            calculationParams.startDate,
            calculationParams.currency
          );
      
      setCalculationStage('complete');
      return result;
    },
    enabled: !!calculationParams && isManualCalculation,
    retry: (failureCount, error) => {
      // Smart retry logic based on error type
      if (error.message.includes('Network Error')) {
        return failureCount < 3;
      }
      if (error.message.includes('timeout')) {
        return failureCount < 2;
      }
      return failureCount < 1;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes
  });

  const handleCalculate = useCallback((params: {
    amount: number;
    startDate: Date;
    currency: string;
    showInBtc: boolean;
    inputMode: 'fiat' | 'btc';
  }) => {
    setCalculationParams(params);
    setIsManualCalculation(true);
    setCalculationStage('fetching-current');
  }, []);

  const handleRetry = useCallback(() => {
    if (calculationParams) {
      setIsManualCalculation(true);
      setCalculationStage('fetching-current');
      refetch();
    }
  }, [calculationParams, refetch]);

  const handleLoadCalculation = useCallback((loadedResult: CalculationResult) => {
    setCalculationParams({
      amount: loadedResult.investmentAmount,
      startDate: new Date(loadedResult.startDate),
      currency: loadedResult.currency,
      showInBtc: false,
      inputMode: 'fiat'
    });
    setIsManualCalculation(false);
  }, []);


  return (
    <>
<Helmet>
  <title>{language==='tr'?'Bitcoin Ya Olsaydı Hesaplayıcısı':'Bitcoin What If Calculator'}</title>
  <meta name="description" content={language==='tr'?'2020\'de Bitcoin\'e 1.000$ koysaydınız ne olurdu? Ya 2017\'de? Ya da 2013\'te? Herhangi bir tutar ve tarih girin — şu an elinizde ne olacağını öğrenin.':'What if you had put $1,000 into Bitcoin in 2020? Or 2017? Or 2013? Enter any amount and any date — find out what you would be sitting on right now.'} />
  <meta name="keywords" content="bitcoin what if calculator, bitcoin roi calculator, historical bitcoin profit, crypto investment calculator" />
  <link rel="canonical" href={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-ya-olsaydi':'https://bitcoincalculator.tools/calculators/what-if'} />
  <link rel="alternate" hrefLang="tr" href="https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-ya-olsaydi" />
  <link rel="alternate" hrefLang="en" href="https://bitcoincalculator.tools/calculators/what-if" />
  <link rel="alternate" hrefLang="x-default" href="https://bitcoincalculator.tools/calculators/what-if" />

  {/* Open Graph Meta Tags */}
  <meta property="og:title" content={language==='tr'?'Bitcoin Ya Olsaydı Hesaplayıcısı':'Bitcoin What If Calculator'} />
  <meta property="og:description" content={language==='tr'?'2020\'de Bitcoin\'e 1.000$ koysaydınız ne olurdu? Ya 2017\'de? Ya da 2013\'te? Herhangi bir tutar ve tarih girin — şu an elinizde ne olacağını görün.':'What if you had put $1,000 into Bitcoin in 2020? Or 2017? Or 2013? Enter any amount and any date — find out what you would be sitting on right now.'} />
  <meta property="og:url" content={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-ya-olsaydi':'https://bitcoincalculator.tools/calculators/what-if'} />
  <meta property="og:type" content="website" />
  <HelmetOgImage slug="bitcoin-what-if-calculator" enAlt={`Bitcoin What If Calculator | bitcoincalculator.tools`} />
  <meta property="og:site_name" content="bitcoincalculator.tools" />

  {/* Twitter Card Meta Tags */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={language==='tr'?'Bitcoin Ya Olsaydı Hesaplayıcısı':'Bitcoin What If Calculator'} />
  <meta name="twitter:description" content={language==='tr'?'2020\'de Bitcoin\'e 1.000$ koysaydınız ne olurdu? Ya 2017\'de? Şu an elinizde ne olacağını öğrenin.':'What if you had put $1,000 into Bitcoin in 2020? Or 2017? Find out what you would have now.'} />
  <meta name="twitter:creator" content="@web3believers" />
        
        <meta name="twitter:site" content="@web3believers" />
        {/* JSON-LD Structured Data — locale-aware */}
        <script type="application/ld+json">{JSON.stringify(webAppSchemaLocalized)}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchemaLocalized)}</script>
        {faqSchemaLocalized && (
          <script type="application/ld+json">{JSON.stringify(faqSchemaLocalized)}</script>
        )}

        {/* FAQ JSON-LD Schema — EN long-form (only when not Turkish) */}
        {language !== 'tr' && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "url": "https://bitcoincalculator.tools/calculators/what-if",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How accurate is this Bitcoin calculator?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "This calculator uses historical daily closing price data for Bitcoin to provide a highly accurate representation of a past investment's performance. The final value is a precise calculation based on historical data."
                }
              },
              {
                "@type": "Question", 
                "name": "What is Return on Investment (ROI)?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Return on Investment (ROI) is a percentage that shows how profitable an investment was. It's calculated by dividing the net profit by the initial investment amount. A 500% ROI means you made five times your initial investment in profit."
                }
              },
              {
                "@type": "Question",
                "name": "Does this calculation include trading fees?",
                "acceptedAnswer": {
                  "@type": "Answer", 
                  "text": "No, this tool calculates the raw asset growth based on market price. It does not account for potential exchange or trading fees, which can vary depending on the platform used to buy or sell."
                }
              },
              {
                "@type": "Question",
                "name": "Can this calculator predict future Bitcoin prices?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "This tool is for historical analysis only and cannot predict future performance. The cryptocurrency market is highly volatile, and past results are not an indicator of future returns."
                }
              },
              {
                "@type": "Question",
                "name": "What if I invested $100 in Bitcoin 10 years ago?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A $100 investment in Bitcoin in early 2014 would be worth approximately $18,000–$25,000 today, depending on the exact date. That represents a return of over 18,000%. Use the calculator with your specific date to get a precise figure."
                }
              },
              {
                "@type": "Question",
                "name": "Is it too late to invest in Bitcoin?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "People have asked this question at every major price level — $100, $1,000, $10,000, and $60,000. At each point, Bitcoin went on to reach significantly higher prices. While past performance doesn't guarantee future results, the historical data shows that long-term holders have been rewarded regardless of when they started."
                }
              },
              {
                "@type": "Question",
                "name": "How do I calculate my Bitcoin profit?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Bitcoin profit is calculated as: (Current Value − Original Investment) = Profit. For ROI percentage: ((Current Value − Original Investment) ÷ Original Investment) × 100. For example, if you bought $500 worth of BTC at $10,000 per coin and it's now $69,000, your profit is $2,950 and your ROI is 590%."
                }
              },
              {
                "@type": "Question",
                "name": "Does this calculator work for other cryptocurrencies like Ethereum or Solana?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No, this tool is specifically designed for Bitcoin and uses Bitcoin's historical price data exclusively. Bitcoin has the longest and most reliable price history in crypto, dating back to 2009."
                }
              },
              {
                "@type": "Question",
                "name": "How do I calculate Bitcoin returns?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Bitcoin return = ((Current Price − Purchase Price) ÷ Purchase Price) × 100. For example, buying 1 BTC at $10,000 that is now worth $85,000 gives a return of 750%. Use the date picker above to calculate returns for any historical purchase date."
                }
              },
              {
                "@type": "Question",
                "name": "What if I bought $100 of Bitcoin in 2010?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A $100 investment in Bitcoin during May 2010 (around Pizza Day, when BTC traded at $0.0041) would have purchased roughly 24,390 BTC. At a $100,000 BTC price, that stake would be worth approximately $2.44 billion. This is the most extreme example in Bitcoin history and is statistically impossible to repeat."
                }
              },
              {
                "@type": "Question",
                "name": "How much would $1000 in Bitcoin be worth today?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "It depends on when you bought. $1,000 invested in January 2017 (BTC ~$1,000) would be worth roughly $100,000 at $100K BTC. $1,000 invested in January 2020 (BTC ~$7,200) would be worth roughly $13,900. $1,000 invested in November 2021 at the $69K peak would still be roughly $1,450. Use the calculator above for your exact date."
                }
              },
              {
                "@type": "Question",
                "name": "What if I had bought Bitcoin on Pizza Day 2010?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "On May 22, 2010, Laszlo Hanyecz famously paid 10,000 BTC for two pizzas, valuing each Bitcoin at roughly $0.0041. A $1 investment that day would have bought 244 BTC, worth around $24.4 million at $100K BTC. Pizza Day is now an annual community holiday celebrating Bitcoin's first real-world transaction."
                }
              },
              {
                "@type": "Question",
                "name": "What is the worst time in history to have bought Bitcoin?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The most painful single buy was the December 2017 peak at $19,800, which took until December 2020 to recover, or the November 2021 peak at $69,000, which took until March 2024 to recover. However, anyone who held through both bear markets eventually came out profitable. Bitcoin has never had a losing 4-year holding period."
                }
              },
              {
                "@type": "Question",
                "name": "Is the What-If Calculator inflation-adjusted?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The default calculation shows nominal returns (raw price growth without adjusting for inflation). Real purchasing power gains would be slightly lower after accounting for roughly 35% cumulative US inflation from 2017 to 2026. Bitcoin's outsized returns mean inflation adjustment changes the percentage but not the qualitative outcome."
                }
              },
              {
                "@type": "Question",
                "name": "Can I share my What-If result on social media?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. After calculating, use the export button to download a share-ready image showing your investment amount, purchase date, and current value. The image is generated client-side in your browser, so no data is sent to any server."
                }
              },
              {
                "@type": "Question",
                "name": "What if I had bought Bitcoin at the all-time high?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Even the worst-timed buys have recovered. Someone who bought at the December 2017 peak of $19,800 was back to break-even by December 2020 and roughly 5x profitable by 2026. The November 2021 peak of $69,000 took until March 2024 to recover and is now sitting at a comfortable gain. Bitcoin has never had a losing 4-year hold from any all-time high entry."
                }
              },
              {
                "@type": "Question",
                "name": "Has Bitcoin ever had a losing 4-year hold?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No. According to CoinGecko price data through 2026, every 4-year Bitcoin hold from any entry date between 2010 and 2022 has produced a positive nominal return. The pattern lines up with the roughly 4-year halving cycle. This is historical fact, not a guarantee about future cycles."
                }
              },
              {
                "@type": "Question",
                "name": "How does inflation affect my Bitcoin returns?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Inflation erodes the purchasing power of any nominal return. From 2017 to 2026, US CPI rose roughly 35% per the BLS series CUUR0000SA0. So a $100,000 Bitcoin position from a $1,000 entry in 2017 has a real (CPI-adjusted) value closer to $74,000 in 2017 dollars. Bitcoin's outsized returns mean the inflation correction reduces the headline number but rarely flips the sign."
                }
              },
              {
                "@type": "Question",
                "name": "What's the worst entry price in Bitcoin history?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The two most painful single-day buys were the December 17, 2017 peak at $19,800 and the November 10, 2021 peak at $69,000. The 2017 peak required a 3-year hold to recover. The 2021 peak required roughly 28 months. Both eventually returned strong profits to anyone who held through the bear market that followed."
                }
              },
              {
                "@type": "Question",
                "name": "Do I owe tax on my What-If gains?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The What-If Calculator shows hypothetical gains, so no tax is owed on the model. If you had actually held Bitcoin and sold in 2026, US long-term capital gains rates of 0%, 15%, or 20% would apply depending on your income, plus a possible 3.8% NIIT surcharge. Short-term sales (held less than one year) are taxed as ordinary income up to 37%. See the Capital Gains Tax Calculator for a full breakdown."
                }
              },
              {
                "@type": "Question",
                "name": "How is the annualized return (CAGR) calculated?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "CAGR = (Ending Value ÷ Beginning Value)^(1 ÷ Years) − 1, expressed as a percentage. Example: $1,000 in 2017 worth $100,000 in 2026 over 9 years gives a CAGR of (100)^(1/9) − 1 ≈ 66% per year. CAGR smooths out year-to-year volatility into a single average growth rate so you can compare Bitcoin against indexes, gold, or real estate on equal terms."
                }
              }
            ]
          })}
        </script>
        )}
      </Helmet>

      <DatasetSchema
        name="Bitcoin Historical Price Dataset 2010–2026"
        description="Daily Bitcoin closing-price record from the earliest tradeable price through today, used to power What-If hypothetical investment backtests."
        url="https://bitcoincalculator.tools/calculators/what-if"
        temporalCoverage="2010-07-17/.."
        variableMeasured={["BTC closing price (USD)", "Hypothetical investment amount", "BTC quantity acquired", "Present value (USD)", "ROI %", "CAGR %"]}
        keywords={["bitcoin historical price", "btc what if calculator", "bitcoin price 2010", "btc backtest dataset"]}
      />

      <BreadcrumbSchema
        language={language}
        items={language === 'tr' ? [
          { name: "Ana Sayfa", url: "https://bitcoincalculator.tools/tr/" },
          { name: "Hesaplayıcılar", url: "https://bitcoincalculator.tools/tr/hesaplayicilar" },
          { name: "Ya Olsaydı Hesaplayıcısı", url: trUrl },
        ] : [
          { name: "Home", url: "https://bitcoincalculator.tools/" },
          { name: "Calculators", url: "https://bitcoincalculator.tools/calculators" },
          { name: "What If Calculator", url: enUrl },
        ]}
      />
      
      <PageBackground variant="clean">
        <Header />

        <main id="main-content" className="relative z-10" style={{ paddingTop: 'max(env(safe-area-inset-top), 5rem)' }}>
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb Navigation */}
            <div className="pt-6 sm:pt-8">
              <Breadcrumb
                items={[
                  { label: language==='tr'?'Hesaplayıcılar':'Calculators', href: language==='tr'?'/tr/hesaplayicilar':'/calculators' },
                  { label: language==='tr'?'Ya Olsaydı Hesaplayıcısı':'What If Calculator' }
                ]}
              />
            </div>

            {/* Hero Section */}
            <section className="py-8 sm:py-12 text-center">
              <div className="max-w-3xl mx-auto space-y-5 animate-fade-in">
                <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium border border-primary/10">
                  <Calculator className="w-4 h-4" />
                  {language==='tr'?'Bitcoin Yatırım Hesaplayıcısı':'Bitcoin Investment Calculator'}
                </div>

                <h1 className="text-h1 font-semibold text-foreground">
                  {language==='tr'?<>Bitcoin <span className="text-gradient-premium">Ya Olsaydı</span> Hesaplayıcısı</>:<>Bitcoin <span className="text-gradient-premium">What If</span> Calculator</>}
                </h1>

                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  {language==='tr'?'"Bitcoin alsaydım ne olurdu" senaryosu çalıştırmak, Bitcoin\'in tarihe göre değerini kontrol etmek veya varsayımsal getirilerinizi hesaplamak için — herhangi bir miktar ve tarih girerek yatırımınızın bugün tam olarak ne değerde olacağını görün.':'Whether you want to run a "what if I bought Bitcoin" scenario, check Bitcoin\'s value by date, or calculate your hypothetical returns over time — enter any amount and date to see exactly what your investment would be worth today.'}
                </p>

                <div className="max-w-sm mx-auto pt-1">
                  <CompactLiveBitcoinPrice currency={calculationParams?.currency || 'USD'} />
                </div>
              </div>
            </section>

            {/* Calculator Section */}
            <section className="pb-10 sm:pb-14">
              <div className="space-y-8 sm:space-y-10">
              {/* Offline Indicator */}
              <OfflineIndicator />
              
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-8">
                {/* Input Panel */}
                <div>
                  <ModernInputPanel 
                    onCalculate={handleCalculate} 
                    loading={isLoading}
                    initialValues={initialFromUrl ?? undefined}
                    autoSubmit={!!initialFromUrl}
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
                      <CalculationProgressStages 
                        stage={calculationStage}
                        progress={
                          calculationStage === 'fetching-current' ? 25 :
                          calculationStage === 'fetching-historical' ? 50 :
                          calculationStage === 'fetching-range' ? 75 :
                          calculationStage === 'calculating' ? 90 :
                          100
                        }
                      />
                    )}

                    {result && calculationParams && !isLoading && (
                      <ModernResultsPanel 
                        result={result} 
                        showInBtc={calculationParams.showInBtc} 
                      />
                    )}

                    {!result && !isLoading && !error && (
                      <Card className="glass-morphism-card border-border/20 shadow-sm">
                        <CardContent className="p-8 text-center">
                          <div className="space-y-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                              <Calculator className="w-6 h-6 text-primary" />
                            </div>
                            <div className="space-y-1">
                              <h3 className="text-lg font-semibold text-foreground">
                                {language==='tr'?'Hesaplamaya Hazır':'Ready to Calculate'}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {language==='tr'?'Yatırım detaylarınızı girin ve hesapla\'ya tıklayın':'Enter your investment details and click calculate'}
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
                  <div className="animate-fade-in overflow-hidden rounded-2xl">
                  <ModernChart
                    priceData={result.priceData}
                    currency={result.currency}
                    investmentAmount={result.investmentAmount}
                    startDate={result.startDate}
                  />
                </div>
              )}

              {/* Modern Cross-Asset Comparison */}
              {result && (
                  <div className="animate-fade-in overflow-hidden rounded-2xl">
                  <ModernCrossAssetComparison result={result} />
                </div>
              )}

              {/* Scenario Insights Dashboard */}
              {result && (
                  <div className="animate-fade-in overflow-hidden rounded-2xl">
                  <WhatIfScenarioInsightsPanel result={result} />
                </div>
              )}

              {/* Share Snapshot */}
              {result && calculationParams && (
                  <div className="animate-fade-in space-y-3 overflow-hidden rounded-2xl">
                  <WhatIfShareSnapshot result={result} />
                  <div className="flex justify-end pt-1">
                    <CopyShareLinkButton
                      slug="what-if"
                      variant="pill"
                      label="Share results"
                      headline={`What if I bought ${calculationParams.inputMode === 'btc' ? `${calculationParams.amount} BTC` : `${calculationParams.currency} ${calculationParams.amount.toLocaleString()}`} on ${calculationParams.startDate.toISOString().slice(0, 10)}? → ${result.roiPercentage >= 0 ? '+' : ''}${result.roiPercentage.toFixed(0)}% return`}
                      params={{
                        amount: calculationParams.amount,
                        start: calculationParams.startDate,
                        currency: calculationParams.currency,
                        mode: calculationParams.inputMode,
                        showBtc: calculationParams.showInBtc,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Export & Share Section */}
              {result && (
                  <div className="animate-fade-in overflow-hidden rounded-2xl">
                  <ExportReportButton result={result} />
                </div>
              )}

              {/* Enhanced Historical Analysis */}
              {result && (
                  <div className="animate-fade-in overflow-hidden rounded-2xl">
                  <HistoricalAnalysis result={result} investmentAmount={result.investmentAmount} />
                </div>
              )}
              </div>
            </section>

            {/* SEO H2 Section */}
            <section className="pb-10 sm:pb-14">
              <div className="max-w-3xl">
                <h2 className="text-h2 font-semibold text-foreground mb-4">
                  {language==='tr'?'Bitcoin Tarihsel Getiri Hesaplayıcısı — Yatırımınız Bugün Ne Değer Olurdu?':'Bitcoin Historical Return Calculator — What Would Your Investment Be Worth Today?'}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {language==='tr'?'Bu Bitcoin tarihsel getiri hesaplayıcısı, geçmişteki herhangi bir Bitcoin yatırımının tam değerini aramanıza olanak tanır. Toplam getirinizi, yıllık kazancınızı, ROI yüzdenizi ve mevcut portföy değerinizi görmek için bir satın alma tarihi ve tutarı girin — hepsi gerçek günlük kapanış fiyat verilerine dayanmaktadır.':'This Bitcoin historical return calculator lets you look up the exact value of any past Bitcoin investment. Enter a purchase date and amount to see your total return, annualized gain, ROI percentage, and current portfolio value — all based on real daily closing price data.'}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {language==='tr'?'2010\'da Bitcoin\'e yatırılan 100 $\'ın bugün ne değerde olduğunu mu merak ediyorsunuz? Ya da 2017\'de yapılan 1.000 $\'lık bir alımın iki boğa koşusu ve bir ayı piyasasında nasıl performans gösterdiğini mi? Yukarıdaki hesaplayıcı bu soruları anında yanıtlıyor.':'Wondering what $100 invested in Bitcoin in 2010 would be worth? Or how a $1,000 purchase in 2017 performed through two bull runs and a bear market? The calculator above answers these questions instantly. Even a modest $10,000 investment in early 2020 — before the COVID crash — would have grown to over $96,000 at today\'s prices. These aren\'t hypothetical projections. They\'re historical facts, calculated from Bitcoin\'s actual market data.'}
                </p>
              </div>
            </section>
          </div>
          {/* /max-w-6xl page wrapper */}

          {/* Real-World Investment Examples */}
          <WhatIfRealExamples />

          {/* Why Bitcoin Has Grown */}
          <WhatIfWhyBitcoinGrew />

          {/* Key Dates to Try */}
          <WhatIfKeyDates />

          {/* Educational Content Sections */}
          <WhatIfContentSections />

          {/* New How It Works & FAQ Section */}
          <section className="calc-section-band">
            <div className="backdrop-blur-sm">
              <NewHowItWorksSection />
            </div>
          </section>

          {/* Downside-risk internal link */}
          <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 pb-8">
            <div className="max-w-3xl mx-auto text-center text-sm text-muted-foreground">
              {language==='tr' ? (
                <>Ya alımdan sonra çökerse? <Link to="/calculators/drawdown" className="text-primary hover:underline font-medium">%30 düzeltme senaryosunu</Link> tarihsel Bitcoin çöküşlerine karşı çalıştırın.</>
              ) : (
                <>What if it crashes after you buy? Run a <Link to="/calculators/drawdown" className="text-primary hover:underline font-medium">30% correction scenario</Link> against every historical Bitcoin crash.</>
              )}
            </div>
          </section>

          {/* Related Calculators Section */}
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8"><AffiliatePlacement slug="what-if" /></div>
          <RelatedCalculators />

          {/* Minimalist Disclaimer */}
          <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 pb-16">
            <div className="max-w-3xl mx-auto">
              <Card className="glass-morphism-card border-border/30 rounded-2xl shadow-sm">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{language==='tr'?'Sorumluluk Reddi':'Disclaimer'}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {language==='tr'?'Bu hesaplayıcı yalnızca eğitim amaçlıdır. Geçmiş performans gelecekteki sonuçları garanti etmez. Bitcoin yatırımları önemli risk taşır.':'This calculator is for educational purposes only. Past performance does not guarantee future results. Bitcoin investments carry significant risk.'}
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

export default BitcoinWhatIfCalculator;
