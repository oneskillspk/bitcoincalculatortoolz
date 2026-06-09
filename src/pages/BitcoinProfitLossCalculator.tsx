import { Link } from '@/components/LocalizedLink';
import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Breadcrumb } from '@/components/Breadcrumb';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import RelatedCalculators from '@/components/RelatedCalculators';
import { QuickAnswerBox } from '@/components/calculator/QuickAnswerBox';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, AlertTriangle } from 'lucide-react';
import { useLiveBitcoinPrice } from '@/hooks/useLiveBitcoinPrice';
import { calculateProfitLoss, createPurchase, exchangeFeePresets, Purchase, ProfitLossResult } from '@/services/profitLossCalculator';
import { ProfitLossInputPanel } from '@/components/profit-loss/ProfitLossInputPanel';
import { ProfitLossResultsPanel } from '@/components/profit-loss/ProfitLossResultsPanel';
import { ProfitLossChart } from '@/components/profit-loss/ProfitLossChart';
import { CostBasisBreakdown } from '@/components/profit-loss/CostBasisBreakdown';
import { ProfitLossExportReport } from '@/components/profit-loss/ProfitLossExportReport';
import { ProfitLossHowItWorksSection } from '@/components/profit-loss/ProfitLossHowItWorksSection';
import { ProfitLossFAQSection } from '@/components/profit-loss/ProfitLossFAQSection';
import { ProfitLossContentSections } from '@/components/profit-loss/ProfitLossContentSections';
import { ProfitLossTaxAndTargetsPanel } from '@/components/profit-loss/ProfitLossTaxAndTargetsPanel';
import { ProfitLossShareSnapshot } from '@/components/profit-loss/ProfitLossShareSnapshot';
import { PageBackground } from '@/components/modern/PageBackground';
import { CompactLiveBitcoinPrice } from '@/components/CompactLiveBitcoinPrice';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AffiliatePlacement } from "@/components/affiliateAI/AffiliatePlacement";
import { CopyShareLinkButton } from '@/components/share/CopyShareLinkButton';
import { readShareParams } from '@/utils/shareLink';
import { useLanguage } from '@/contexts/LanguageContext';
import { buildCalculatorSpeakable } from '@/components/seo/calculatorSpeakable';

import { HelmetOgImage } from "@/components/seo/HelmetOgImage";
const BitcoinProfitLossCalculator: React.FC = () => {
  const { language, t } = useLanguage();
  const { price: liveBtcPrice, isLoading: isLoadingPrice, priceChangePercentage24h } = useLiveBitcoinPrice();

  // Hydrate from a shared URL once on mount.
  // Example: /calculators/profit-loss?invested=1000&buy=30000&sell=85000&exchange=binance
  const initialFromUrl = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const p = readShareParams();
    if (!p.has('invested') && !p.has('buy') && !p.has('sell')) return null;
    return {
      invested: p.number('invested'),
      buy: p.number('buy'),
      sell: p.number('sell'),
      exchange: p.string('exchange'),
    };
  }, []);

  const [selectedExchange, setSelectedExchange] = useState(initialFromUrl?.exchange || 'binance');
  const [useLivePrice, setUseLivePrice] = useState(!initialFromUrl?.sell);
  const [sellPrice, setSellPrice] = useState<number>(initialFromUrl?.sell || 0);
  const [customBuyFee, setCustomBuyFee] = useState(0.1);
  const [customSellFee, setCustomSellFee] = useState(0.1);
  const [isRealized, setIsRealized] = useState(!!initialFromUrl?.sell);
  const [sellPriceSeededFromLive, setSellPriceSeededFromLive] = useState(false);

  // Realized mode forces a custom sell price (disables Live Price)
  // Unrealized mode forces Live Price on, so labels and math always agree
  const handleRealizedChange = (next: boolean) => {
    setIsRealized(next);
    if (next) {
      // switching to Realized: drop live price; seed custom sell with current live price
      if (useLivePrice && liveBtcPrice > 0 && sellPrice <= 0) {
        setSellPrice(Math.round(liveBtcPrice * 100) / 100);
        setSellPriceSeededFromLive(true);
      }
      setUseLivePrice(false);
    } else {
      setUseLivePrice(true);
      setSellPriceSeededFromLive(false);
    }
  };

  // Clear the "seeded" hint as soon as the user edits the sell price
  const handleSellPriceChange = (price: number) => {
    setSellPrice(price);
    if (sellPriceSeededFromLive) setSellPriceSeededFromLive(false);
  };

  // Keep toggle in sync if the user flips the live-price switch directly
  React.useEffect(() => {
    if (useLivePrice && isRealized) setIsRealized(false);
    if (!useLivePrice && !isRealized) setIsRealized(true);
    if (useLivePrice) setSellPriceSeededFromLive(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useLivePrice]);

  const currentPreset = exchangeFeePresets.find(e => e.id === selectedExchange);
  const sellFeePercent = selectedExchange === 'custom' ? customSellFee : (currentPreset?.sellFeePercent || 0);
  const buyFee = selectedExchange === 'custom' ? customBuyFee : (currentPreset?.buyFeePercent || 0);

  const [sellFeeState, setSellFeeState] = useState(sellFeePercent);

  const [purchases, setPurchases] = useState<Purchase[]>([
    createPurchase(initialFromUrl?.invested || 1000, initialFromUrl?.buy || 30000, buyFee),
  ]);

  const effectiveSellPrice = useLivePrice ? liveBtcPrice : sellPrice;

  const result = useMemo<ProfitLossResult | null>(() => {
    if (effectiveSellPrice <= 0) return null;
    return calculateProfitLoss(purchases, effectiveSellPrice, sellFeePercent);
  }, [purchases, effectiveSellPrice, sellFeePercent]);

  const breadcrumbItems = language==='tr' ? [
    { name: 'Ana Sayfa', url: 'https://bitcoincalculator.tools/' },
    { name: 'Hesaplayıcılar', url: 'https://bitcoincalculator.tools/tr/hesaplayicilar' },
    { name: 'Kâr & Zarar', url: 'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-kar-zarar-hesaplayicisi' },
  ] : [
    { name: 'Home', url: 'https://bitcoincalculator.tools/' },
    { name: 'Calculators', url: 'https://bitcoincalculator.tools/calculators' },
    { name: 'Profit & Loss', url: 'https://bitcoincalculator.tools/calculators/profit-loss' },
  ];

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Bitcoin Profit & Loss Calculator",
    "description": "Enter what you paid, what you have, and what you want to sell at. See your exact profit, loss, ROI, and net after fees in seconds. Live BTC price included.",
    "url": "https://bitcoincalculator.tools/calculators/profit-loss",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "featureList": [
      "Live Bitcoin price integration",
      "Multi-purchase cost basis tracking with weighted average",
      "Exchange fee presets (Binance, Coinbase, Kraken, Bybit, Gemini)",
      "Sell scenario modeling and price targets",
      "Breakeven price calculation including fees",
      "Profit multiple targets (2x, 5x, 10x scenarios)",
      "Break-even reference table by entry year",
      "After-tax ROI estimator",
      "Reverse profit-target calculator",
      "Unrealized vs realized P/L toggle",
      "Social share snapshot (PNG)",
      "PDF and PNG export"
    ],
    "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
    "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" }
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Calculate Bitcoin Profit and Loss",
    "description": "Learn how to calculate your real Bitcoin profit after fees",
    "step": [
      { "@type": "HowToStep", "name": "Enter Your Purchases", "text": "Input how much you invested and at what price per BTC" },
      { "@type": "HowToStep", "name": "Set Exchange Fees", "text": "Choose your exchange or enter custom buy/sell fee percentages" },
      { "@type": "HowToStep", "name": "Choose Your Sell Price", "text": "Use the live BTC price or set a custom target sell price" },
      { "@type": "HowToStep", "name": "See Your Real P/L", "text": "View net profit after all fees with breakeven analysis and scenario modeling" }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{language === 'tr' ? 'Bitcoin Kâr Zarar Hesaplayıcısı | Net Kâr' : 'Bitcoin Profit & Loss Calculator'}</title>
        <meta name="description" content={language === 'tr' ? 'Bitcoin kâr zarar hesaplayıcısı: alış, satış fiyatı ve borsa ücretlerini girin — anında net kâr, ROI yüzdesi ve başabaş noktası hesaplayın.' : 'Enter what you paid, what you have, and what you want to sell at. See your exact profit, loss, ROI, and net after fees in seconds. Live BTC price included.'} />
        <meta name="keywords" content={language === 'tr' ? 'bitcoin kar zarar hesaplayıcı, bitcoin kâr hesaplama, bitcoin roi hesaplayıcı, bitcoin satış hesaplayıcı, bitcoin maliyet bazı, kripto kâr hesaplama, bitcoin başabaş hesaplayıcı' : 'bitcoin profit calculator, btc profit loss calculator, bitcoin roi calculator, crypto profit calculator, bitcoin sell calculator, bitcoin cost basis, bitcoin investment return, bitcoin breakeven calculator'} />
        <link rel="canonical" href={language === 'tr' ? 'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-kar-zarar-hesaplayicisi' : 'https://bitcoincalculator.tools/calculators/profit-loss'} />
        {/* hreflang alternates emitted globally via <GlobalHreflang /> */}

        <meta property="og:title" content={language === 'tr' ? 'Bitcoin Kâr Zarar Hesaplayıcısı — Net Kâr' : 'Bitcoin Profit & Loss Calculator'} />
        <meta property="og:description" content={language === 'tr' ? 'Bitcoin kâr zarar hesaplayıcısı ile alış, satış fiyatı ve borsa ücretlerinizi girin — net kâr, ROI ve başabaş noktasını anında görün.' : 'Enter what you paid, what you have, and what you want to sell at. See your exact profit, loss, ROI, and net after fees in seconds. Live BTC price included.'} />
        <meta property="og:url" content={language === 'tr' ? 'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-kar-zarar-hesaplayicisi' : 'https://bitcoincalculator.tools/calculators/profit-loss'} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="bitcoincalculator.tools" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={language === 'tr' ? 'Bitcoin Kâr Zarar Hesaplayıcısı' : 'Bitcoin Profit & Loss Calculator'} />
        <meta name="twitter:description" content={language === 'tr' ? 'Alış fiyatı ve satış hedefinizi girin — net kâr, ROI ve ücret sonrası tutarı anında görün.' : 'Enter your buy price and sell target — see exact profit, ROI, and net after fees instantly.'} />
        <meta name="twitter:creator" content="@web3believers" />

        <meta name="twitter:site" content="@web3believers" />
        {language !== 'tr' && <>
        <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            { "@type": "Question", "name": "How do I calculate Bitcoin profit?", "acceptedAnswer": { "@type": "Answer", "text": "Bitcoin profit = (Selling Price - Buy Price) × Amount of BTC - Fees. Enter your buy price, amount, and sell price in our calculator to see exact profit, ROI percentage, and net proceeds after exchange fees." }},
            { "@type": "Question", "name": "Are Bitcoin exchange fees included?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, our calculator accounts for exchange fees. You can enter the fee percentage charged by your exchange (typically 0.1%-1.5%) to see your true net profit after all costs." }},
            { "@type": "Question", "name": "What is ROI in Bitcoin?", "acceptedAnswer": { "@type": "Answer", "text": "ROI (Return on Investment) measures your profit as a percentage of your initial investment. For example, if you bought Bitcoin at $30,000 and sold at $60,000, your ROI is 100%. Our calculator computes this automatically." }},
            { "@type": "Question", "name": "Should I use the live price or enter a custom sell price?", "acceptedAnswer": { "@type": "Answer", "text": "Both options are available. Use the live Bitcoin price to see your current unrealized profit/loss, or enter a custom sell target to plan future trades and set price targets." }},
            { "@type": "Question", "name": "How do I calculate Bitcoin profit after fees?", "acceptedAnswer": { "@type": "Answer", "text": "Our Bitcoin profit calculator includes built-in exchange fee presets for Binance, Coinbase, Kraken, and more. Select your exchange or enter custom fee percentages — the calculator deducts fees from both buy and sell sides to show your true net profit after all transaction costs." }},
            { "@type": "Question", "name": "How do I calculate Bitcoin ROI?", "acceptedAnswer": { "@type": "Answer", "text": "Bitcoin ROI = (Current Value − Total Cost) ÷ Total Cost × 100. If you invested $5,000 and your Bitcoin is now worth $12,500, your ROI is 150%. This calculator shows both ROI percentage and absolute dollar profit or loss." }},
            { "@type": "Question", "name": "How do exchange fees affect Bitcoin profit?", "acceptedAnswer": { "@type": "Answer", "text": "Exchange fees reduce your net profit on both the buy and sell sides. For example, Coinbase charges approximately 1.49% per trade, while Binance charges 0.1%. On a $10,000 round-trip trade, Coinbase fees total ~$298 versus ~$20 on Binance. Use the exchange fee presets above to see your true net profit after all costs." }},
            
            { "@type": "Question", "name": "How do I calculate my Bitcoin profit?", "acceptedAnswer": { "@type": "Answer", "text": "To calculate your Bitcoin profit, subtract your total cost (purchase price + buy fees) from your total proceeds (sell price × BTC amount - sell fees). This calculator automates this by tracking each purchase, applying exchange-specific fees, and showing your net profit or loss instantly." }},
            { "@type": "Question", "name": "What is cost basis in Bitcoin?", "acceptedAnswer": { "@type": "Answer", "text": "Cost basis is the total amount you originally paid for your Bitcoin, including any transaction fees. If you made multiple purchases at different prices, your weighted average cost basis is calculated by dividing your total investment by the total BTC acquired." }},
            { "@type": "Question", "name": "What is my breakeven price for Bitcoin?", "acceptedAnswer": { "@type": "Answer", "text": "Your breakeven price is the minimum price at which you need to sell your Bitcoin to recover your total investment including all fees. It's calculated as: Breakeven = Total Invested ÷ (BTC Held × (1 - Sell Fee %))." }},
            { "@type": "Question", "name": "Should I account for fees when calculating crypto profit?", "acceptedAnswer": { "@type": "Answer", "text": "Absolutely. Many traders overlook fees and overestimate their profits. Exchange fees typically range from 0.1% (Binance) to 1.49% (Coinbase) per trade. On a $10,000 investment with Coinbase fees, you'd pay ~$300 in total fees (buy + sell), which directly reduces your profit." }},
            { "@type": "Question", "name": "How does this calculator differ from a tax calculator?", "acceptedAnswer": { "@type": "Answer", "text": "This Profit/Loss calculator focuses on your current position value and potential sell outcomes. A tax calculator determines your tax liability based on holding period, jurisdiction, and tax brackets." }},
            { "@type": "Question", "name": "Can I calculate profit for multiple Bitcoin purchases?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Our calculator supports multiple purchases at different prices and amounts. Each purchase is tracked individually, then combined into a weighted average cost basis for your total position." }},
            { "@type": "Question", "name": "What price does Bitcoin need to hit for me to 10x my investment?", "acceptedAnswer": { "@type": "Answer", "text": "For a 10x return, Bitcoin needs to rise 900% from your average entry price. If your average entry was $30,000, BTC needs to reach $300,000 before fees. Factor in a 1-3% round-trip fee load and 15-20% long-term capital gains tax for your real take-home." }},
            { "@type": "Question", "name": "Are unrealized Bitcoin gains taxable?", "acceptedAnswer": { "@type": "Answer", "text": "No. Unrealized gains are not taxable in the US, UK, Canada, Australia, or most major jurisdictions. You only owe tax when you trigger a realized gain — selling BTC for fiat, swapping it for another crypto, or spending it." }},
            { "@type": "Question", "name": "What is the difference between gross profit and net profit on Bitcoin?", "acceptedAnswer": { "@type": "Answer", "text": "Gross profit is the simple sell price minus buy price calculation. Net profit deducts all fees (buy fee, sell fee, network fees, withdrawal fees) and reflects what actually lands in your account." }},
            { "@type": "Question", "name": "How does FIFO vs HIFO change my Bitcoin profit calculation?", "acceptedAnswer": { "@type": "Answer", "text": "FIFO (first in, first out) sells your oldest, often cheapest coins first, maximizing taxable gains. HIFO (highest in, first out) sells your most expensive lot first, minimizing tax on each sale. The IRS allows you to choose, but you must be consistent within a tax year." }},
            { "@type": "Question", "name": "Should I count network and withdrawal fees in my Bitcoin cost basis?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Any fee directly tied to acquiring or moving your Bitcoin counts toward cost basis. This includes exchange buy fees, network (miner) fees on transfers to your own wallet, and withdrawal fees." }},
            { "@type": "Question", "name": "How do I calculate Bitcoin profit when I have multiple purchases?", "acceptedAnswer": { "@type": "Answer", "text": "Use a weighted average cost basis: total dollars invested (including fees) divided by total BTC held. The calculator above does this automatically when you add multiple lots." }},
            { "@type": "Question", "name": "How is profit and loss calculated on Bitcoin?", "acceptedAnswer": { "@type": "Answer", "text": "Profit and loss on Bitcoin is your net proceeds from a sale minus your total cost basis. Net proceeds equal your sell price multiplied by the BTC sold, minus the exchange sell fee. Cost basis equals every dollar you spent acquiring that BTC, including buy fees." }},
            { "@type": "Question", "name": "What is the formula for crypto profit and loss?", "acceptedAnswer": { "@type": "Answer", "text": "P/L = (Sell Price × BTC Held × (1 − Sell Fee%)) − Total Invested. Total Invested already includes buy fees. Divide P/L by Total Invested and multiply by 100 to get ROI as a percentage." }},
            { "@type": "Question", "name": "How do I calculate break-even on Bitcoin?", "acceptedAnswer": { "@type": "Answer", "text": "Break-even price equals Total Invested divided by (BTC Held × (1 − Sell Fee%)). On a $5,000 buy at 1.49% Coinbase fees, you receive about 0.1372 BTC, so BTC must reach roughly $36,995 to recover the full $5,000 after another 1.49% sell fee." }},
            { "@type": "Question", "name": "Do I pay tax on Bitcoin profit?", "acceptedAnswer": { "@type": "Answer", "text": "In the US, yes, but only on realized gains. Selling BTC for fiat, swapping it for another crypto, or spending it all trigger a taxable event. Long-term holds over 365 days are taxed at 0, 15, or 20 percent federally based on income, plus a possible 3.8 percent NIIT." }},
            { "@type": "Question", "name": "What price does Bitcoin need to reach for me to break even?", "acceptedAnswer": { "@type": "Answer", "text": "It depends on your average entry price and your sell fee. A 2024 buyer with a $63,800 average and 0.6 percent round-trip Coinbase Advanced fees needs roughly $64,565 to walk away even. The break-even card calculates your exact number." }}
          ]
        })}</script>
        </>}

        {language === 'tr' && <>
          <script type="application/ld+json">{JSON.stringify({
            "@context": "https://schema.org", "@type": "WebApplication",
            "name": "Bitcoin Kâr Zarar Hesaplayıcısı", "inLanguage": "tr",
            "url": "https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-kar-zarar-hesaplayicisi",
            "description": "Bitcoin kâr zarar hesaplayıcısı ile alış fiyatı, satış fiyatı ve borsa ücretlerinizi girin — net kâr ve ROI hesaplama.",
            "applicationCategory": "FinanceApplication", "operatingSystem": "Any",
            "offers": {"@type": "Offer", "price": "0", "priceCurrency": "TRY"},
            "provider": {"@type": "Organization", "name": "Bitcoin Calculator Tools"},
            "author": {"@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools"}
          })}</script>
          <script type="application/ld+json">{JSON.stringify({
            "@context": "https://schema.org", "@type": "FAQPage", "inLanguage": "tr",
            "mainEntity": [
              {"@type": "Question", "name": "Bitcoin kâr ve zarar nasıl hesaplanır?", "acceptedAnswer": {"@type": "Answer", "text": "Bitcoin kârı = (Satış Fiyatı - Alış Fiyatı) × BTC Miktarı - Ücretler. Alış fiyatınızı, BTC miktarınızı ve satış fiyatını girin; hesaplayıcı USD cinsinden net kârı, ROI yüzdesini ve ücret sonrası tutarı otomatik hesaplar."}},
              {"@type": "Question", "name": "Borsa ücretleri hesaba katılıyor mu?", "acceptedAnswer": {"@type": "Answer", "text": "Evet, hesaplayıcımız borsa ücretlerini hesaba katar. Borsanızın yüzde ücretini girerek (genellikle yüzde 0.1-1.5) gerçek net kârınızı tüm maliyetler düşüldükten sonra görebilirsiniz."}},
              {"@type": "Question", "name": "Bitcoin ROI nedir?", "acceptedAnswer": {"@type": "Answer", "text": "ROI (Yatırım Getirisi), kârınızı başlangıç yatırımınızın yüzdesi olarak ölçer. Örneğin 30.000 dolara Bitcoin alıp 60.000 dolara sattıysanız ROI'niz yüzde 100'dür. Hesaplayıcımız bunu otomatik hesaplar."}},
              {"@type": "Question", "name": "Canlı fiyat mı yoksa özel satış fiyatı mı kullanmalıyım?", "acceptedAnswer": {"@type": "Answer", "text": "Her iki seçenek de mevcuttur. Mevcut gerçekleşmemiş kâr/zararınızı görmek için canlı Bitcoin fiyatını kullanın ya da gelecekteki işlemleri planlamak için özel bir satış hedefi girin."}},
              {"@type": "Question", "name": "Birden fazla Bitcoin alımım varsa nasıl hesaplama yapabilirim?", "acceptedAnswer": {"@type": "Answer", "text": "Hesaplayıcımız farklı fiyat ve miktarlarda birden fazla alımı destekler. Her alım ayrı ayrı izlenir ve ağırlıklı ortalama maliyet bazı otomatik hesaplanır."}}
            ]
          })}</script>
        </>}
              <script type="application/ld+json">{JSON.stringify(buildCalculatorSpeakable(language === 'tr' ? 'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-kar-zarar-hesaplayicisi' : 'https://bitcoincalculator.tools/calculators/profit-loss', language))}</script>
      </Helmet>
        <HelmetOgImage slug="bitcoin-profit-loss-calculator" enAlt={`Bitcoin Profit & Loss Calculator | bitcoincalculator.tools`} />

      <BreadcrumbSchema language={language} items={breadcrumbItems} />

      <PageBackground variant="clean">
        <Header />

        <main id="main-content" className="pt-20 relative z-10">
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb items={[
              { label: language === 'tr' ? 'Hesaplayıcılar' : 'Calculators', href: language === 'tr' ? '/tr/hesaplayicilar' : '/calculators' },
              { label: t('profitLoss.breadcrumb') },
            ]} />
          </div>

          <section className="container mx-auto px-6 py-16 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6 text-sm font-medium text-primary">
              <BarChart3 className="w-4 h-4" />
              {t('profitLoss.badge')}
            </div>

            <h1 className="text-h1 font-bold text-foreground mb-4">
              {language === 'tr'
                ? <>Bitcoin <span className="text-gradient-premium">Kâr &amp; Zarar</span> Hesaplayıcısı</>
                : <>Bitcoin <span className="text-gradient-premium">Profit &amp; Loss</span> Calculator</>}
            </h1>


            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              {language === 'tr'
                ? 'Borsa ücretleri dahil gerçek Bitcoin kâr veya zararınızı hesaplayın. Çoklu alım maliyet bazını takip edin, satış senaryoları modelleyin ve başabaş fiyatınızı bulun.'
                : 'Calculate your real Bitcoin profit or loss after exchange fees. Track multi-purchase cost basis, model sell scenarios, and find your breakeven price.'}
            </p>

            <div className="max-w-sm mx-auto">
              <CompactLiveBitcoinPrice currency="USD" />
            </div>
          </section>

          <section className="container mx-auto px-6 pb-20">
            <div className="max-w-6xl mx-auto space-y-10">
              <QuickAnswerBox
                answer={language==='tr'
                  ? 'Bitcoin Kâr Zarar Hesaplayıcısı, BTC pozisyonunuzdaki gerçekleşmiş ve gerçekleşmemiş kazançları hesaplar. Alış fiyatı, satış fiyatı, BTC miktarı ve borsa ücretlerinizi girin — TRY cinsinden net kâr, ROI yüzdesi, ücret sonrası net rakam, elde tutma süresi ve Türkiye için kısa/uzun vadeli vergi göstergesi döner.'
                  : 'The Bitcoin Profit & Loss Calculator computes realized and unrealized gains on a BTC position. Enter your buy price, sell price, BTC amount, and any exchange fees — we return profit in USD, ROI percentage, net-after-fees figure, holding period, and a short-vs-long-term tax flag for U.S. filers.'}
              />
              <OfflineIndicator />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                <ErrorBoundary>
                  <ProfitLossInputPanel
                    purchases={purchases}
                    setPurchases={setPurchases}
                    sellPrice={sellPrice}
                    setSellPrice={handleSellPriceChange}
                    sellFeePercent={sellFeePercent}
                    setSellFeePercent={setSellFeeState}
                    selectedExchange={selectedExchange}
                    setSelectedExchange={setSelectedExchange}
                    useLivePrice={useLivePrice}
                    setUseLivePrice={setUseLivePrice}
                    liveBtcPrice={liveBtcPrice}
                    isLoadingPrice={isLoadingPrice}
                    customBuyFee={customBuyFee}
                    setCustomBuyFee={setCustomBuyFee}
                    customSellFee={customSellFee}
                    setCustomSellFee={setCustomSellFee}
                    sellPriceSeededFromLive={sellPriceSeededFromLive}
                  />
                </ErrorBoundary>

                <ErrorBoundary>
                  <ProfitLossResultsPanel result={result} isRealized={isRealized} />
                </ErrorBoundary>
              </div>

              {/* Tax & Targets dashboard + Share snapshot */}
              {result && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                  <ErrorBoundary>
                    <ProfitLossTaxAndTargetsPanel
                      result={result}
                      isRealized={isRealized}
                      onRealizedChange={handleRealizedChange}
                      sellFeePercent={sellFeePercent}
                    />
                  </ErrorBoundary>
                  <ErrorBoundary>
                    <div className="space-y-3">
                      <ProfitLossShareSnapshot result={result} />
                      <div className="flex justify-end pt-1">
                        <CopyShareLinkButton
                          slug="profit-loss"
                          variant="pill"
                          label="Share results"
                          headline={`My BTC P/L: ${result.netProfitLoss >= 0 ? '+' : ''}$${Math.round(result.netProfitLoss).toLocaleString()} (${result.roiPercent >= 0 ? '+' : ''}${result.roiPercent.toFixed(1)}% ROI)`}
                          params={{
                            invested: purchases[0]?.amount,
                            buy: purchases[0]?.pricePerBtc,
                            sell: useLivePrice ? undefined : sellPrice,
                            exchange: selectedExchange,
                          }}
                        />
                      </div>
                    </div>
                  </ErrorBoundary>
                </div>
              )}

              {/* Visualizations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <ProfitLossChart result={result} />
                <CostBasisBreakdown purchases={purchases} sellPrice={effectiveSellPrice} />
              </div>

            </div>
          </section>

          {/* SEO H2 Sections */}
          <section className="container mx-auto px-6 pb-12">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-h2 font-bold text-foreground mb-4">
                Bitcoin ROI Calculator
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                The Bitcoin ROI calculator measures your return on investment as a percentage of your original cost. Enter your buy price, sell price or current price, and position size to calculate ROI instantly.
              </p>
            </div>
          </section>

          <section className="container mx-auto px-6 pb-12">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-h2 font-bold text-foreground mb-4">
                Exchange Fee Impact on Bitcoin Profit
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Exchange fees can significantly reduce your Bitcoin profit. This calculator includes built-in fee presets for Coinbase (1.49%), Binance (0.1%), Kraken (0.26%), and custom fee inputs. Fees are deducted from both the buy and sell side, and the fee amount is shown as a line item in your results so you can see your true net profit after all transaction costs.
              </p>
            </div>
          </section>

          <div className="max-w-3xl mx-auto px-6"><AffiliatePlacement slug="profit-loss" lang={language === 'tr' ? 'tr' : 'en'} resultSignals={["profit"]} /></div>
          <ProfitLossContentSections />
          <ProfitLossHowItWorksSection />
          <ProfitLossFAQSection />
          {language === 'tr' && (
            <section className="container mx-auto px-6 pb-12">
              <div className="max-w-3xl mx-auto prose prose-sm max-w-none">
                <h2 className="text-h2 font-bold text-foreground mb-4">Bitcoin Kâr Zarar Hesaplayıcısı: Borsa Ücreti Dahil Net Kâr</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Bitcoin kâr zarar hesaplayıcısı, bir Bitcoin pozisyonundaki gerçekleşmiş ve gerçekleşmemiş kazançları hesaplar. Alış fiyatı, satış fiyatı ve borsa ücretlerini girerek net kârınızı, ROI yüzdenizi, başabaş fiyatınızı ve çoklu alım için ağırlıklı ortalama maliyet bazınızı anında görün.
                </p>
                <h3 className="text-h3 font-semibold text-foreground mb-2">Bitcoin Kârı Nasıl Hesaplanır?</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Bitcoin kârı hesaplama formülü şöyledir: Kâr = (Satış Fiyatı × BTC Miktarı × (1 - Satış Ücreti %)) - Toplam Yatırım. Toplam yatırım, alış ücretleri dahil tüm maliyetleri kapsar. ROI ise kârın toplam yatırıma bölünüp 100 ile çarpılmasıyla bulunur.
                </p>
                <h3 className="text-h3 font-semibold text-foreground mb-2">Borsa Ücretleri Neden Önemlidir?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Borsa ücretleri kârınızı önemli ölçüde azaltabilir. Binance yüzde 0.1, Coinbase yüzde 1.49 ücret alır. 10.000 dolarlık bir işlemde Coinbase ücretleri yaklaşık 298 dolar iken Binance'de yalnızca 20 dolardır. Hesaplayıcımız Binance, Coinbase, Kraken ve daha fazlası için hazır ücret önayarları sunar.
                </p>
              </div>
            </section>
          )}

          {/* Downside-risk internal link */}
          <section className="container mx-auto px-6 pb-8">
            <div className="max-w-3xl mx-auto text-center text-sm text-muted-foreground">
              {language === 'tr' ? (
                <>Kayıplar bağlam ister mi? <Link to="/calculators/drawdown" className="text-primary hover:underline font-medium">Bitcoin düşüş ve çöküş geçmişi</Link> ile karşılaştırın.</>
              ) : (
                <>Losses need context? Compare yours against the full <Link to="/calculators/drawdown" className="text-primary hover:underline font-medium">bitcoin drawdown & crash history</Link>.</>
              )}
            </div>
          </section>

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
                        {t('profitLoss.disclaimer')}
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

export default BitcoinProfitLossCalculator;
