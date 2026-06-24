import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useSafeLanguage } from "@/hooks/useSafeLanguage";
import { Breadcrumb } from '@/components/Breadcrumb';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import RelatedCalculators from '@/components/RelatedCalculators';
import { CompactLiveBitcoinPrice } from '@/components/CompactLiveBitcoinPrice';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PageBackground } from '@/components/modern/PageBackground';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, ArrowUpDown, CheckCircle, XCircle, HelpCircle, Link as LinkIcon } from 'lucide-react';
import { useLiveBitcoinPrice } from '@/hooks/useLiveBitcoinPrice';
import { Link } from "@/components/LocalizedLink";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocalizedSchema } from "@/hooks/useLocalizedSchema";

import { HelmetOgImage } from "@/components/seo/HelmetOgImage";
import { PreFAQPlacement } from "@/components/placement/PreFAQPlacement";
const EXCHANGES = ['Binance', 'Coinbase', 'Kraken', 'Bybit', 'OKX', 'KuCoin', 'Gemini', 'Custom'];

const FEE_PRESETS = {
  conservative: { label: 'Conservative', maker: 0.1, taker: 0.2, withdrawal: 18, settlement: 12, slippage: 0.25 },
  standard: { label: 'Standard', maker: 0.08, taker: 0.12, withdrawal: 10, settlement: 8, slippage: 0.15 },
  pro: { label: 'Pro / pre-funded', maker: 0.02, taker: 0.06, withdrawal: 4, settlement: 3, slippage: 0.05 },
};

const BitcoinArbitrageCalculator: React.FC = () => {
  const { language, t } = useLanguage();
  const { price: liveBtcPrice, isLoading: isLoadingPrice } = useLiveBitcoinPrice();

  const [exchangeA, setExchangeA] = useState('Binance');
  const [priceA, setPriceA] = useState<number>(0);
  const [feeA, setFeeA] = useState<number>(0.1);
  const [exchangeB, setExchangeB] = useState('Coinbase');
  const [priceB, setPriceB] = useState<number>(0);
  const [feeB, setFeeB] = useState<number>(0.5);
  const [tradeAmount, setTradeAmount] = useState<number>(1000);
  const [feePreset, setFeePreset] = useState<keyof typeof FEE_PRESETS>('standard');
  const [buyOrderType, setBuyOrderType] = useState<'maker' | 'taker'>('taker');
  const [sellOrderType, setSellOrderType] = useState<'maker' | 'taker'>('taker');
  const [withdrawalFeeUsd, setWithdrawalFeeUsd] = useState<number>(12);
  const [settlementCostUsd, setSettlementCostUsd] = useState<number>(8);
  const [slippagePct, setSlippagePct] = useState<number>(0.15);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [pricesInitialized, setPricesInitialized] = useState(false);

  const applyFeePreset = (presetKey: keyof typeof FEE_PRESETS) => {
    const preset = FEE_PRESETS[presetKey];
    setFeePreset(presetKey);
    setFeeA(buyOrderType === 'maker' ? preset.maker : preset.taker);
    setFeeB(sellOrderType === 'maker' ? preset.maker : preset.taker);
    setWithdrawalFeeUsd(preset.withdrawal);
    setSettlementCostUsd(preset.settlement);
    setSlippagePct(preset.slippage);
  };

  // Auto-fill prices with live BTC price once
  React.useEffect(() => {
    if (liveBtcPrice > 0 && !pricesInitialized) {
      setPriceA(liveBtcPrice);
      setPriceB(liveBtcPrice);
      setPricesInitialized(true);
    }
  }, [liveBtcPrice, pricesInitialized]);

  const results = useMemo(() => {
    if (priceA <= 0 || priceB <= 0 || tradeAmount <= 0) return null;

    const priceLow = Math.min(priceA, priceB);
    const priceHigh = Math.max(priceA, priceB);
    const spreadAbs = Math.abs(priceB - priceA);
    const spreadPct = (spreadAbs / priceLow) * 100;

    // Buy on cheaper exchange, sell on more expensive
    const btcBought = tradeAmount / priceLow;
    const grossProceeds = btcBought * priceHigh;
    const grossProfit = grossProceeds - tradeAmount;

    const isABuyLeg = priceA <= priceB;
    const buyExchange = isABuyLeg ? exchangeA : exchangeB;
    const sellExchange = isABuyLeg ? exchangeB : exchangeA;
    const buyFeeRate = isABuyLeg ? feeA : feeB;
    const sellFeeRate = isABuyLeg ? feeB : feeA;
    const feeACost = tradeAmount * (buyFeeRate / 100);
    const feeBCost = grossProceeds * (sellFeeRate / 100);
    const slippageCost = tradeAmount * (slippagePct / 100);
    const totalFees = feeACost + feeBCost;
    const totalSettlementCosts = withdrawalFeeUsd + settlementCostUsd + slippageCost;

    const netProfit = grossProfit - totalFees - totalSettlementCosts;
    const returnOnTrade = (netProfit / tradeAmount) * 100;

    return {
      spreadAbs,
      spreadPct,
      grossProfit,
      feeACost,
      feeBCost,
      withdrawalFeeUsd,
      settlementCostUsd,
      slippageCost,
      totalFees,
      totalSettlementCosts,
      netProfit,
      returnOnTrade,
      isProfitable: netProfit > 0,
      buyExchange,
      sellExchange,
      costLegs: [
        { label: `Buy leg fee (${buyExchange})`, amount: feeACost },
        { label: `Sell leg fee (${sellExchange})`, amount: feeBCost },
        { label: 'BTC withdrawal / network', amount: withdrawalFeeUsd },
        { label: 'Fiat settlement', amount: settlementCostUsd },
        { label: 'Spread / slippage', amount: slippageCost },
      ],
    };
  }, [priceA, priceB, feeA, feeB, tradeAmount, exchangeA, exchangeB, withdrawalFeeUsd, settlementCostUsd, slippagePct]);

  const breadcrumbItems = [
    { name: 'Home', url: 'https://bitcoincalculator.tools/' },
    { name: 'Calculators', url: 'https://bitcoincalculator.tools/calculators' },
    { name: 'Bitcoin Arbitrage Calculator', url: 'https://bitcoincalculator.tools/calculators/bitcoin-arbitrage' },
  ];

  const webAppSchemaEn = {
    "@context": "https://schema.org", "@type": "WebApplication",
    "name": "Bitcoin Arbitrage Calculator",
    "description": "Calculate Bitcoin arbitrage profit between exchanges. Enter prices on two exchanges, add trading fees, and see your net spread and profit opportunity instantly. Free.",
    "url": "https://bitcoincalculator.tools/calculators/bitcoin-arbitrage",
    "inLanguage": "en",
    "applicationCategory": "FinanceApplication", "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "featureList": ["Bitcoin price spread calculator", "Exchange fee comparison", "Net arbitrage profit calculator", "Cross-exchange Bitcoin price comparison", "Trading fee impact calculator"],
    "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
    "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" }
  };
  const webAppSchemaTr = {
    "@context": "https://schema.org", "@type": "WebApplication",
    "name": "Bitcoin Arbitraj Hesaplayıcısı",
    "description": "Borsalar arasında Bitcoin arbitraj kârını hesaplayın. İki borsadaki fiyatları girin, işlem ücretlerini ekleyin ve net spread ile kâr fırsatını anında görün. Ücretsiz.",
    "url": "https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-arbitraj",
    "inLanguage": "tr",
    "applicationCategory": "FinanceApplication", "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "TRY" },
    "featureList": ["Bitcoin fiyat farkı hesaplayıcısı", "Borsa ücreti karşılaştırması", "Net arbitraj kâr hesaplayıcısı", "Borsa arası Bitcoin fiyat karşılaştırması", "İşlem ücreti etkisi hesaplayıcısı"],
    "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
    "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" }
  };

  const howToSchemaEn = {
    "@context": "https://schema.org", "@type": "HowTo",
    "name": "How to Calculate Bitcoin Arbitrage Profit",
    "description": "Step-by-step guide to calculating Bitcoin arbitrage profit between exchanges",
    "inLanguage": "en",
    "step": [
      { "@type": "HowToStep", "name": "Enter Exchange A Price", "text": "Enter the Bitcoin price on your first exchange" },
      { "@type": "HowToStep", "name": "Enter Exchange B Price", "text": "Enter the Bitcoin price on your second exchange" },
      { "@type": "HowToStep", "name": "Add Trading Fees", "text": "Add the trading fee percentage for each exchange" },
      { "@type": "HowToStep", "name": "Enter Trade Amount", "text": "Enter your trade amount in USD" },
      { "@type": "HowToStep", "name": "Read Results", "text": "Read your net arbitrage profit after all fees" }
    ]
  };
  const howToSchemaTr = {
    "@context": "https://schema.org", "@type": "HowTo",
    "name": "Bitcoin Arbitraj Kârı Nasıl Hesaplanır?",
    "description": "Borsalar arasında Bitcoin arbitraj kârını hesaplamak için adım adım rehber",
    "inLanguage": "tr",
    "step": [
      { "@type": "HowToStep", "name": "A Borsasının Fiyatını Girin", "text": "İlk borsadaki Bitcoin fiyatını girin" },
      { "@type": "HowToStep", "name": "B Borsasının Fiyatını Girin", "text": "İkinci borsadaki Bitcoin fiyatını girin" },
      { "@type": "HowToStep", "name": "İşlem Ücretlerini Ekleyin", "text": "Her borsa için işlem ücreti yüzdesini ekleyin" },
      { "@type": "HowToStep", "name": "İşlem Tutarını Girin", "text": "USD cinsinden işlem tutarınızı girin" },
      { "@type": "HowToStep", "name": "Sonuçları Okuyun", "text": "Tüm ücretler düşüldükten sonraki net arbitraj kârınızı okuyun" }
    ]
  };

  const faqsEn = [
    { q: "What is Bitcoin arbitrage?", a: "Bitcoin arbitrage is the practice of buying Bitcoin on one exchange where the price is lower and simultaneously selling it on another exchange where the price is higher, capturing the price difference as profit. The profit must exceed all trading fees, withdrawal fees, and transfer costs to be worthwhile." },
    { q: "How do I calculate Bitcoin arbitrage profit?", a: "Bitcoin arbitrage profit = (Price on Exchange B − Price on Exchange A) × BTC amount − trading fees on both exchanges. For example, buying 0.1 BTC at $84,900 on Exchange A and selling at $85,200 on Exchange B gives a gross profit of $30, minus fees on both sides. Use the calculator above to find the net profit for any price difference and fee combination." },
    { q: "What fees reduce Bitcoin arbitrage profit?", a: "The main fees that reduce Bitcoin arbitrage profit are trading fees on both the buy and sell side (typically 0.1% to 0.5% per trade), withdrawal fees to transfer Bitcoin between exchanges (fixed fee per transaction), and network transaction fees. Most apparent arbitrage opportunities disappear once these fees are deducted." },
    { q: "How much price difference do you need for Bitcoin arbitrage?", a: "The minimum price difference needed for profitable Bitcoin arbitrage depends on your combined fees. If Exchange A charges 0.1% and Exchange B charges 0.5%, your total fee load is approximately 0.6%. You need a price spread larger than 0.6% to profit. At $85,000 per BTC, that means you need at least a $510 price difference between exchanges to break even." },
  ];
  const faqsTr = [
    { q: "Bitcoin arbitrajı nedir?", a: "Bitcoin arbitrajı, Bitcoin'i fiyatın daha düşük olduğu bir borsadan alıp eş zamanlı olarak fiyatın daha yüksek olduğu başka bir borsada satarak fiyat farkını kâr olarak elde etme uygulamasıdır. Kârın anlamlı olabilmesi için tüm işlem ücretlerini, çekim ücretlerini ve transfer maliyetlerini aşması gerekir." },
    { q: "Bitcoin arbitraj kârını nasıl hesaplarım?", a: "Bitcoin arbitraj kârı = (B Borsasındaki Fiyat − A Borsasındaki Fiyat) × BTC miktarı − her iki borsadaki işlem ücretleri. Örneğin A Borsasından 84.900 dolardan 0,1 BTC alıp B Borsasında 85.200 dolardan satmak 30 dolar brüt kâr verir; iki tarafın ücretleri bu rakamdan düşülür. Herhangi bir fiyat farkı ve ücret kombinasyonu için net kârı bulmak üzere yukarıdaki hesaplayıcıyı kullanın." },
    { q: "Bitcoin arbitraj kârını hangi ücretler azaltır?", a: "Bitcoin arbitraj kârını azaltan temel ücretler, alım ve satım tarafındaki işlem ücretleri (genellikle işlem başına %0,1–0,5), Bitcoin'i borsalar arasında transfer etme çekim ücretleri (işlem başına sabit ücret) ve ağ işlem ücretleridir. Görünür arbitraj fırsatlarının çoğu, bu ücretler düşüldüğünde ortadan kalkar." },
    { q: "Bitcoin arbitrajı için ne kadar fiyat farkı gerekir?", a: "Kârlı bir Bitcoin arbitrajı için gereken minimum fiyat farkı, toplam ücretlerinize bağlıdır. A Borsası %0,1, B Borsası %0,5 alırsa toplam ücret yükünüz yaklaşık %0,6 olur. Kâr edebilmek için %0,6'dan büyük bir spread'e ihtiyacınız vardır. BTC başına 85.000 dolardan, bu başabaş için borsalar arasında en az 510 dolar fark gerekir demektir." },
  ];
  const faqs = language === 'tr' ? faqsTr : faqsEn;

  const faqSchemaEn = { "@context": "https://schema.org", "@type": "FAQPage", "inLanguage": "en", "mainEntity": faqsEn.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })) };
  const faqSchemaTr = { "@context": "https://schema.org", "@type": "FAQPage", "inLanguage": "tr", "mainEntity": faqsTr.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })) };

  const webAppSchema = useLocalizedSchema(webAppSchemaEn, webAppSchemaTr);
  const howToSchema = useLocalizedSchema(howToSchemaEn, howToSchemaTr);
  const faqSchema = useLocalizedSchema(faqSchemaEn, faqSchemaTr);

  return (
    <>
      <Helmet>
        <title>{t('arb.meta.title')}</title>
        <meta name="description" content={t('arb.meta.description')} />
        <link rel="canonical" href={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-arbitraj':'https://bitcoincalculator.tools/calculators/bitcoin-arbitrage'} />

        <link rel="alternate" hrefLang="tr" href="https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-arbitraj" />
        <link rel="alternate" hrefLang="en" href="https://bitcoincalculator.tools/calculators/bitcoin-arbitrage" />
        <link rel="alternate" hrefLang="x-default" href="https://bitcoincalculator.tools/calculators/bitcoin-arbitrage" />
        <meta property="og:title" content={t('arb.meta.ogTitle')} />
        <meta property="og:description" content={t('arb.meta.ogDescription')} />
        <meta property="og:url" content={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-arbitraj':'https://bitcoincalculator.tools/calculators/bitcoin-arbitrage'} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="bitcoincalculator.tools" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('arb.meta.twitterTitle')} />
        <meta name="twitter:description" content={t('arb.meta.twitterDescription')} />
        <meta name="twitter:creator" content="@web3believers" />

        <meta name="twitter:site" content="@web3believers" />
        <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
        <HelmetOgImage slug="bitcoin-arbitrage-calculator" enAlt={`Bitcoin Arbitrage Calculator | bitcoincalculator.tools`} />

      <BreadcrumbSchema language={language} items={breadcrumbItems} />

      <PageBackground variant="clean">
        <Header />

        <main id="main-content" className="pt-20 relative z-10">
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb items={[
              { label: t('arb.crumb.calculators'), href: language==='tr'?'/tr/hesaplayicilar':'/calculators' },
              { label: t('arb.crumb.current') },
            ]} />
          </div>

          <section className="container mx-auto px-6 py-16 text-center">
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/10">
                <ArrowUpDown className="w-4 h-4" />
                {t('arb.hero.badge')}
              </div>
              <h1 className="text-h1 font-bold text-foreground">
                <>{t('arb.hero.titlePrefix')}<span className="text-gradient-premium">{t('arb.hero.titleMiddle')}</span>{t('arb.hero.titleSuffix')}</>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('arb.hero.subtitle')}
              </p>
              <div className="max-w-sm mx-auto">
                <CompactLiveBitcoinPrice currency="USD" />
              </div>
            </div>
          </section>

          <section className="container mx-auto px-6 pb-20">
            <div className="max-w-6xl mx-auto space-y-8">
              <OfflineIndicator />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Panel */}
                <ErrorBoundary>
                  <Card className="glass-morphism-card border-border/20 shadow-sm">
                    <CardContent className="p-6 space-y-6">
                      <h2 className="text-lg font-semibold text-foreground">{t('arb.input.title')}</h2>
                      
                      {/* Exchange A */}
                      <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border/30">
                        <h3 className="text-sm font-medium text-foreground">{t('arb.input.exchangeA')}</h3>
                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs text-muted-foreground">{t('arb.input.exchangeName')}</Label>
                            <Select value={exchangeA} onValueChange={setExchangeA}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {EXCHANGES.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">{t('arb.input.btcPrice')}</Label>
                            <Input type="number" value={priceA || ''} onChange={e => setPriceA(Number(e.target.value))} placeholder="84900" />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">{t('arb.input.tradingFee')}</Label>
                            <Input type="number" value={feeA} onChange={e => setFeeA(Number(e.target.value))} step="0.01" />
                          </div>
                        </div>
                      </div>

                      {/* Exchange B */}
                      <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border/30">
                        <h3 className="text-sm font-medium text-foreground">{t('arb.input.exchangeB')}</h3>
                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs text-muted-foreground">{t('arb.input.exchangeName')}</Label>
                            <Select value={exchangeB} onValueChange={setExchangeB}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {EXCHANGES.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">{t('arb.input.btcPrice')}</Label>
                            <Input type="number" value={priceB || ''} onChange={e => setPriceB(Number(e.target.value))} placeholder="85200" />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">{t('arb.input.tradingFee')}</Label>
                            <Input type="number" value={feeB} onChange={e => setFeeB(Number(e.target.value))} step="0.01" />
                          </div>
                        </div>
                      </div>

                      {/* Trade Amount */}
                      <div>
                        <Label className="text-xs text-muted-foreground">{t('arb.input.tradeAmount')}</Label>
                        <Input type="number" value={tradeAmount || ''} onChange={e => setTradeAmount(Number(e.target.value))} placeholder="1000" />
                      </div>

                      <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border/30">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="text-sm font-medium text-foreground">{t('arb.input.presets')}</h3>
                          <span className="text-xs text-muted-foreground">{t('arb.input.editable')}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {(Object.entries(FEE_PRESETS) as [keyof typeof FEE_PRESETS, typeof FEE_PRESETS[keyof typeof FEE_PRESETS]][]).map(([key, preset]) => (
                            <Button key={key} type="button" variant={feePreset === key ? 'default' : 'outline'} onClick={() => applyFeePreset(key)} className="h-auto min-h-14 flex-col items-start gap-1 p-3 text-left">
                              <span className="text-sm font-semibold">{preset.label}</span>
                              <span className="text-xs opacity-80">Taker {preset.taker}% · Slip {preset.slippage}%</span>
                            </Button>
                          ))}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs text-muted-foreground">{t('arb.input.buyOrder')}</Label>
                            <Select value={buyOrderType} onValueChange={(value) => {
                              const orderType = value as 'maker' | 'taker';
                              setBuyOrderType(orderType);
                              setFeeA(orderType === 'maker' ? FEE_PRESETS[feePreset].maker : FEE_PRESETS[feePreset].taker);
                            }}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="maker">{t('arb.input.maker')}</SelectItem>
                                <SelectItem value="taker">{t('arb.input.taker')}</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">{t('arb.input.sellOrder')}</Label>
                            <Select value={sellOrderType} onValueChange={(value) => {
                              const orderType = value as 'maker' | 'taker';
                              setSellOrderType(orderType);
                              setFeeB(orderType === 'maker' ? FEE_PRESETS[feePreset].maker : FEE_PRESETS[feePreset].taker);
                            }}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="maker">{t('arb.input.maker')}</SelectItem>
                                <SelectItem value="taker">{t('arb.input.taker')}</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
                          <CollapsibleTrigger asChild>
                            <Button type="button" variant="outline" className="w-full justify-between">{t('arb.input.advanced')} <span>{advancedOpen ? '−' : '+'}</span></Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="pt-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div>
                                <Label className="text-xs text-muted-foreground">{t('arb.input.withdrawalFee')}</Label>
                                <Input type="number" value={withdrawalFeeUsd} onChange={e => setWithdrawalFeeUsd(Number(e.target.value))} step="1" />
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">{t('arb.input.fiatCost')}</Label>
                                <Input type="number" value={settlementCostUsd} onChange={e => setSettlementCostUsd(Number(e.target.value))} step="1" />
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">{t('arb.input.slippage')}</Label>
                                <Input type="number" value={slippagePct} onChange={e => setSlippagePct(Number(e.target.value))} step="0.01" />
                              </div>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    </CardContent>
                  </Card>
                </ErrorBoundary>

                {/* Results Panel */}
                <ErrorBoundary>
                  <Card className="glass-morphism-card border-border/20 shadow-sm">
                    <CardContent className="p-6 space-y-6">
                      <h2 className="text-lg font-semibold text-foreground">{t('arb.results.title')}</h2>

                      {results ? (
                        <div className="space-y-4">
                          {/* Status */}
                          <div className={`flex items-center gap-2 p-3 rounded-lg ${results.isProfitable ? 'bg-success/10 border border-success/20' : 'bg-destructive/10 border border-destructive/20'}`}>
                            {results.isProfitable ? (
                              <CheckCircle className="w-5 h-5 text-success" />
                            ) : (
                              <XCircle className="w-5 h-5 text-destructive" />
                            )}
                            <span className={`text-sm font-medium ${results.isProfitable ? 'text-success' : 'text-destructive'}`}>
                              {results.isProfitable ? t('arb.results.profitable') : t('arb.results.notProfitable')}
                            </span>
                          </div>

                          <p className="text-xs text-muted-foreground">{t('arb.results.buySell', { buy: results.buyExchange, sell: results.sellExchange })}</p>

                          <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-border/30">
                              <span className="text-sm text-muted-foreground">{t('arb.results.spread')}</span>
                              <span className="text-sm font-semibold text-foreground">
                                ${results.spreadAbs.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({results.spreadPct.toFixed(3)}%)
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-border/30">
                              <span className="text-sm text-muted-foreground">{t('arb.results.gross')}</span>
                              <span className="text-sm font-semibold text-foreground">
                                ${results.grossProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-border/30">
                              <span className="text-sm text-muted-foreground">{t('arb.results.feeOn', { exchange: exchangeA })}</span>
                              <span className="text-sm text-destructive">
                                −${results.feeACost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-border/30">
                              <span className="text-sm text-muted-foreground">{t('arb.results.feeOn', { exchange: exchangeB })}</span>
                              <span className="text-sm text-destructive">
                                −${results.feeBCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-border/30">
                              <span className="text-sm text-muted-foreground">{t('arb.results.totalFees')}</span>
                              <span className="text-sm text-destructive font-medium">
                                −${results.totalFees.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            </div>
                            <div className="rounded-lg border border-border/30 bg-muted/20 p-3 space-y-2">
                              <div className="text-sm font-medium text-foreground">{t('arb.results.settlement')}</div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{t('arb.results.withdrawal')}</span>
                                <span className="text-destructive">−${results.withdrawalFeeUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{t('arb.results.fiatRails')}</span>
                                <span className="text-destructive">−${results.settlementCostUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{t('arb.results.estSlippage')}</span>
                                <span className="text-destructive">−${results.slippageCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                              </div>
                              <div className="flex justify-between text-sm pt-2 border-t border-border/30">
                                <span className="font-medium text-foreground">{t('arb.results.tradingSettle')}</span>
                                <span className="font-medium text-destructive">−${(results.totalFees + results.totalSettlementCosts).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                              </div>
                            </div>
                            <div className="rounded-lg border border-border/30 bg-background/40 p-4 space-y-3" aria-label={t('aria.arbitrageNetProfit')}>
                              <div className="flex items-center justify-between gap-3">
                                <span className="text-sm font-medium text-foreground">{t('arb.results.waterfall')}</span>
                                <span className="text-xs text-muted-foreground">{t('arb.results.grossLess')}</span>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-3 text-xs">
                                  <span className="w-32 text-muted-foreground">{t('arb.results.grossSpread')}</span>
                                  <div className="h-3 flex-1 rounded-full bg-primary/20 overflow-hidden">
                                    <div className="h-full bg-primary" style={{ width: '100%' }} />
                                  </div>
                                  <span className="w-20 text-right text-foreground">${results.grossProfit.toFixed(2)}</span>
                                </div>
                                {results.costLegs.map((leg) => {
                                  const width = results.grossProfit > 0 ? Math.min(100, (leg.amount / results.grossProfit) * 100) : 100;
                                  return (
                                    <div key={leg.label} className="flex items-center gap-3 text-xs">
                                      <span className="w-32 text-muted-foreground truncate">{leg.label}</span>
                                      <div className="h-3 flex-1 rounded-full bg-muted overflow-hidden">
                                        <div className="h-full bg-destructive/70" style={{ width: `${width}%` }} />
                                      </div>
                                      <span className="w-20 text-right text-destructive">−${leg.amount.toFixed(2)}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                            <div className="flex justify-between items-center py-3 bg-muted/30 rounded-lg px-3">
                              <span className="text-sm font-semibold text-foreground">{t('arb.results.netProfit')}</span>
                              <span className={`text-lg font-bold ${results.netProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
                                {results.netProfit >= 0 ? '+' : ''}${results.netProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                              <span className="text-sm text-muted-foreground">{t('arb.results.returnTrade')}</span>
                              <span className={`text-sm font-semibold ${results.returnOnTrade >= 0 ? 'text-success' : 'text-destructive'}`}>
                                {results.returnOnTrade >= 0 ? '+' : ''}{results.returnOnTrade.toFixed(3)}%
                              </span>
                            </div>
                          </div>

                          <p className="text-xs text-muted-foreground mt-4">
                            {t('arb.results.note')}
                          </p>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <ArrowUpDown className="w-10 h-10 mx-auto mb-3 opacity-30" />
                          <p className="text-sm">{t('arb.results.empty')}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </ErrorBoundary>
              </div>

              {/* Internal Links */}
              <div className="flex flex-wrap gap-3 text-sm">
                <Link to={language==='tr'?'/tr/hesaplayicilar/bitcoin-ag-ucreti':'/calculators/transaction-fees'} className="inline-flex items-center gap-1 text-primary hover:underline">
                  <LinkIcon className="w-3 h-3" /> {t('arb.related.fees')}
                </Link>
                <Link to={language==='tr'?'/tr/hesaplayicilar/bitcoin-lot-buyuklugu':'/calculators/bitcoin-lot-size'} className="inline-flex items-center gap-1 text-primary hover:underline">
                  <LinkIcon className="w-3 h-3" /> {t('arb.related.lot')}
                </Link>
              </div>
            </div>
          </section>

          {/* H2 SEO Sections */}
          <section className="container mx-auto px-6 pb-12">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-h2 font-bold text-foreground mb-4">{t('arb.how.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('arb.how.body')}
              </p>
            </div>
          </section>

          <section className="container mx-auto px-6 pb-12">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-h2 font-bold text-foreground mb-4">{t('arb.profit.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('arb.profit.body')}
              </p>
            </div>
          </section>

          <section className="container mx-auto px-6 pb-12" aria-labelledby="kimchi-premium-bitcoin-arbitrage">
            <div className="max-w-3xl mx-auto space-y-4">
              <h2 id="kimchi-premium-bitcoin-arbitrage" className="text-h2 font-bold text-foreground mb-4">{t('arb.kimchi.title')}</h2>
              <Card className="glass-morphism-card border-border/20 shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{t('arb.kimchi.h1')}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                      {t('arb.kimchi.b1')}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{t('arb.kimchi.h2')}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                      {t('arb.kimchi.b2')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <PreFAQPlacement slug="arbitrage" lang={language as "en" | "tr"} />

          {/* FAQ Section */}
          <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-6">
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/30 mb-4">
                    <HelpCircle className="w-4 h-4" />
                    FAQ
                  </div>
                  <h2 className="text-h2 font-bold text-foreground">{t('arb.faq.title')}</h2>
                  <p className="text-muted-foreground mt-2">{t('arb.faq.subtitle')}</p>
                </div>
                <Accordion type="single" collapsible className="space-y-3">
                  {faqs.map((faq, i) => (
                    <AccordionItem key={i} value={`faq-${i}`} className="bg-card border-border/50 rounded-xl px-4">
                      <AccordionTrigger className="text-left text-sm font-medium">{faq.q}</AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">{faq.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
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
                      <h3 className="font-semibold text-foreground mb-2">{t('arb.dis.title')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('arb.dis.body')}
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

export default BitcoinArbitrageCalculator;
