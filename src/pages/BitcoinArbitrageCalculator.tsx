import React, { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Breadcrumb } from '@/components/Breadcrumb';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import RelatedCalculators from '@/components/RelatedCalculators';
import { CompactLiveBitcoinPrice } from '@/components/CompactLiveBitcoinPrice';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PageBackground } from '@/components/modern/PageBackground';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, ArrowUpDown, HelpCircle, Link as LinkIcon } from 'lucide-react';
import { useLiveBitcoinPrice } from '@/hooks/useLiveBitcoinPrice';
import { Link } from "@/components/LocalizedLink";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useLanguage } from "@/contexts/LanguageContext";
import { PreFAQPlacement } from "@/components/placement/PreFAQPlacement";
import { BitcoinArbitrageSeoHead } from '@/components/bitcoin-arbitrage/BitcoinArbitrageSeoHead';
import { BitcoinArbitrageInputPanel } from '@/components/bitcoin-arbitrage/BitcoinArbitrageInputPanel';
import { BitcoinArbitrageResultsPanel, ArbitrageResults } from '@/components/bitcoin-arbitrage/BitcoinArbitrageResultsPanel';
import { FEE_PRESETS, FeePresetKey, faqsEn, faqsTr } from '@/components/bitcoin-arbitrage/bitcoinArbitrageData';

const BitcoinArbitrageCalculator: React.FC = () => {
  const { language, t } = useLanguage();
  const { price: liveBtcPrice } = useLiveBitcoinPrice();

  const [exchangeA, setExchangeA] = useState('Binance');
  const [priceA, setPriceA] = useState<number>(0);
  const [feeA, setFeeA] = useState<number>(0.1);
  const [exchangeB, setExchangeB] = useState('Coinbase');
  const [priceB, setPriceB] = useState<number>(0);
  const [feeB, setFeeB] = useState<number>(0.5);
  const [tradeAmount, setTradeAmount] = useState<number>(1000);
  const [feePreset, setFeePreset] = useState<FeePresetKey>('standard');
  const [buyOrderType, setBuyOrderType] = useState<'maker' | 'taker'>('taker');
  const [sellOrderType, setSellOrderType] = useState<'maker' | 'taker'>('taker');
  const [withdrawalFeeUsd, setWithdrawalFeeUsd] = useState<number>(12);
  const [settlementCostUsd, setSettlementCostUsd] = useState<number>(8);
  const [slippagePct, setSlippagePct] = useState<number>(0.15);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [pricesInitialized, setPricesInitialized] = useState(false);

  const applyFeePreset = (presetKey: FeePresetKey) => {
    const preset = FEE_PRESETS[presetKey];
    setFeePreset(presetKey);
    setFeeA(buyOrderType === 'maker' ? preset.maker : preset.taker);
    setFeeB(sellOrderType === 'maker' ? preset.maker : preset.taker);
    setWithdrawalFeeUsd(preset.withdrawal);
    setSettlementCostUsd(preset.settlement);
    setSlippagePct(preset.slippage);
  };

  React.useEffect(() => {
    if (liveBtcPrice > 0 && !pricesInitialized) {
      setPriceA(liveBtcPrice);
      setPriceB(liveBtcPrice);
      setPricesInitialized(true);
    }
  }, [liveBtcPrice, pricesInitialized]);

  const results = useMemo<ArbitrageResults | null>(() => {
    if (priceA <= 0 || priceB <= 0 || tradeAmount <= 0) return null;

    const priceLow = Math.min(priceA, priceB);
    const priceHigh = Math.max(priceA, priceB);
    const spreadAbs = Math.abs(priceB - priceA);
    const spreadPct = (spreadAbs / priceLow) * 100;

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
      spreadAbs, spreadPct, grossProfit,
      feeACost, feeBCost,
      withdrawalFeeUsd, settlementCostUsd, slippageCost,
      totalFees, totalSettlementCosts,
      netProfit, returnOnTrade,
      isProfitable: netProfit > 0,
      buyExchange, sellExchange,
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

  const faqs = language === 'tr' ? faqsTr : faqsEn;

  return (
    <>
      <BitcoinArbitrageSeoHead />
      <BreadcrumbSchema language={language} items={breadcrumbItems} />

      <PageBackground variant="clean">
        <Header />

        <main id="main-content" className="pt-20 relative z-10">
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb items={[
              { label: t('arb.crumb.calculators'), href: language === 'tr' ? '/tr/hesaplayicilar' : '/calculators' },
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
                <ErrorBoundary>
                  <BitcoinArbitrageInputPanel
                    exchangeA={exchangeA} setExchangeA={setExchangeA}
                    priceA={priceA} setPriceA={setPriceA}
                    feeA={feeA} setFeeA={setFeeA}
                    exchangeB={exchangeB} setExchangeB={setExchangeB}
                    priceB={priceB} setPriceB={setPriceB}
                    feeB={feeB} setFeeB={setFeeB}
                    tradeAmount={tradeAmount} setTradeAmount={setTradeAmount}
                    feePreset={feePreset} setFeePreset={setFeePreset}
                    buyOrderType={buyOrderType} setBuyOrderType={setBuyOrderType}
                    sellOrderType={sellOrderType} setSellOrderType={setSellOrderType}
                    withdrawalFeeUsd={withdrawalFeeUsd} setWithdrawalFeeUsd={setWithdrawalFeeUsd}
                    settlementCostUsd={settlementCostUsd} setSettlementCostUsd={setSettlementCostUsd}
                    slippagePct={slippagePct} setSlippagePct={setSlippagePct}
                    advancedOpen={advancedOpen} setAdvancedOpen={setAdvancedOpen}
                    applyFeePreset={applyFeePreset}
                  />
                </ErrorBoundary>

                <ErrorBoundary>
                  <BitcoinArbitrageResultsPanel results={results} exchangeA={exchangeA} exchangeB={exchangeB} />
                </ErrorBoundary>
              </div>

              <div className="flex flex-wrap gap-3 text-sm">
                <Link to={language === 'tr' ? '/tr/hesaplayicilar/bitcoin-ag-ucreti' : '/calculators/transaction-fees'} className="inline-flex items-center gap-1 text-primary hover:underline">
                  <LinkIcon className="w-3 h-3" /> {t('arb.related.fees')}
                </Link>
                <Link to={language === 'tr' ? '/tr/hesaplayicilar/bitcoin-lot-buyuklugu' : '/calculators/bitcoin-lot-size'} className="inline-flex items-center gap-1 text-primary hover:underline">
                  <LinkIcon className="w-3 h-3" /> {t('arb.related.lot')}
                </Link>
              </div>
            </div>
          </section>

          <section className="container mx-auto px-6 pb-12">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-h2 font-bold text-foreground mb-4">{t('arb.how.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">{t('arb.how.body')}</p>
            </div>
          </section>

          <section className="container mx-auto px-6 pb-12">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-h2 font-bold text-foreground mb-4">{t('arb.profit.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">{t('arb.profit.body')}</p>
            </div>
          </section>

          <section className="container mx-auto px-6 pb-12" aria-labelledby="kimchi-premium-bitcoin-arbitrage">
            <div className="max-w-3xl mx-auto space-y-4">
              <h2 id="kimchi-premium-bitcoin-arbitrage" className="text-h2 font-bold text-foreground mb-4">{t('arb.kimchi.title')}</h2>
              <Card className="glass-morphism-card border-border/20 shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{t('arb.kimchi.h1')}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-2">{t('arb.kimchi.b1')}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{t('arb.kimchi.h2')}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-2">{t('arb.kimchi.b2')}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <PreFAQPlacement slug="arbitrage" lang={language as "en" | "tr"} />

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

          <section className="container mx-auto px-6 pb-16">
            <div className="max-w-3xl mx-auto">
              <Card className="glass-morphism-card border-border/20 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{t('arb.dis.title')}</h3>
                      <p className="text-sm text-muted-foreground">{t('arb.dis.body')}</p>
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
