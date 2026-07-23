import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useSafeLanguage } from "@/hooks/useSafeLanguage";
import { Breadcrumb } from '@/components/Breadcrumb';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import RelatedCalculators from '@/components/RelatedCalculatorsLazy';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingDown, AlertTriangle } from 'lucide-react';
import { useLiveBitcoinPrice } from '@/hooks/useLiveBitcoinPrice';
import { leverageLiquidationCalculator, exchangePresets, LiquidationResult, LeverageComparison } from '@/services/leverageLiquidationCalculator';
import { LeverageInputPanel } from '@/components/leverage/LeverageInputPanel';
import { LeverageResultsPanel } from '@/components/leverage/LeverageResultsPanel';
import { LiquidationPriceChart } from '@/components/leverage/LiquidationPriceChart';
import { RiskRewardVisualization } from '@/components/leverage/RiskRewardVisualization';
import { LeverageHowItWorksSection } from '@/components/leverage/LeverageHowItWorksSection';
import { LeverageFAQSection } from '@/components/leverage/LeverageFAQSection';
import { LeverageExportReport } from '@/components/leverage/LeverageExportReport';
import { PageBackground } from '@/components/modern/PageBackground';
import { CompactLiveBitcoinPrice } from '@/components/CompactLiveBitcoinPrice';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLanguage } from "@/contexts/LanguageContext";

import { HelmetOgImage } from "@/components/seo/HelmetOgImage";
import { PreFAQPlacement } from "@/components/placement/PreFAQPlacement";
import { TradingBrokerBanner } from "@/components/affiliateAI/TradingBrokerBanner";
import { EditorialRotator as AffiliatePlacement } from "@/components/affiliateAI/EditorialRotator";
import { InViewMount } from "@/components/lot-size/InViewMount";
const BitcoinLeverageLiquidationCalculator: React.FC = () => {
  const { language, t } = useLanguage();
  const { price: liveBtcPrice, isLoading: isLoadingPrice, priceChangePercentage24h, trend } = useLiveBitcoinPrice();

  // Track whether user has manually edited entry price
  const [entryPrice, setEntryPrice] = useState<number>(0);
  const [hasUserEditedPrice, setHasUserEditedPrice] = useState(false);
  const [positionType, setPositionType] = useState<'long' | 'short'>('long');
  const [leverage, setLeverage] = useState<number>(10);
  const [marginAmount, setMarginAmount] = useState<number>(1000);
  const [marginMode, setMarginMode] = useState<'isolated' | 'cross'>('isolated');
  const [accountCollateral, setAccountCollateral] = useState<number>(0);
  const [maintenanceMargin, setMaintenanceMargin] = useState<number>(0.5);
  const [takeProfitPercent, setTakeProfitPercent] = useState<number>(10);
  const [stopLossPercent, setStopLossPercent] = useState<number>(5);
  const [selectedExchange, setSelectedExchange] = useState<string>('binance');

  // Update entry price when live price loads, only if user hasn't manually edited
  React.useEffect(() => {
    if (liveBtcPrice > 0 && !hasUserEditedPrice) {
      setEntryPrice(liveBtcPrice);
    }
  }, [liveBtcPrice, hasUserEditedPrice]);

  // Wrapper to track user edits
  const handleSetEntryPrice = (price: number) => {
    setHasUserEditedPrice(true);
    setEntryPrice(price);
  };

  // Calculate results
  const result = useMemo<LiquidationResult | null>(() => {
    if (entryPrice <= 0 || marginAmount <= 0 || leverage < 1) return null;
    
    return leverageLiquidationCalculator.calculatePosition({
      entryPrice,
      positionType,
      leverage,
      marginAmount,
      marginMode,
      accountCollateral,
      maintenanceMargin,
      takeProfitPercent: takeProfitPercent > 0 ? takeProfitPercent : undefined,
      stopLossPercent: stopLossPercent > 0 ? stopLossPercent : undefined
    }, liveBtcPrice || entryPrice);
  }, [entryPrice, positionType, leverage, marginAmount, marginMode, accountCollateral, maintenanceMargin, takeProfitPercent, stopLossPercent, liveBtcPrice]);

  // Generate leverage comparison table
  const leverageComparison = useMemo<LeverageComparison[]>(() => {
    if (entryPrice <= 0 || marginAmount <= 0) return [];
    
    return leverageLiquidationCalculator.generateLeverageComparison(
      entryPrice,
      marginAmount,
      positionType,
      maintenanceMargin,
      [2, 5, 10, 25, 50, 100]
    );
  }, [entryPrice, marginAmount, positionType, maintenanceMargin]);

  const marginSimulationRows = useMemo(() => {
    if (entryPrice <= 0 || marginAmount <= 0 || leverage < 1) return [];

    return [0, 5, 10, 20, 35, 50].map((move) => {
      const projectedPrice = positionType === 'long'
        ? entryPrice * (1 - move / 100)
        : entryPrice * (1 + move / 100);
      const isolated = leverageLiquidationCalculator.calculatePosition({
        entryPrice,
        positionType,
        leverage,
        marginAmount,
        marginMode: 'isolated',
        accountCollateral: 0,
        maintenanceMargin,
      }, projectedPrice);
      const cross = leverageLiquidationCalculator.calculatePosition({
        entryPrice,
        positionType,
        leverage,
        marginAmount,
        marginMode: 'cross',
        accountCollateral,
        maintenanceMargin,
      }, projectedPrice);

      return {
        move,
        projectedPrice,
        isolatedDistance: isolated.distanceToLiquidation,
        crossDistance: cross.distanceToLiquidation,
        isolatedStatus: isolated.distanceToLiquidation <= 0 ? 'Liquidated' : isolated.distanceToLiquidation <= 5 ? 'Near liquidation' : 'Open',
        crossStatus: cross.distanceToLiquidation <= 0 ? 'Liquidated' : cross.distanceToLiquidation <= 5 ? 'Near liquidation' : 'Open',
        isolatedLiquidation: isolated.liquidationPrice,
        crossLiquidation: cross.liquidationPrice,
        crossCollateral: cross.totalCollateralAtRisk,
      };
    });
  }, [entryPrice, marginAmount, leverage, positionType, maintenanceMargin, accountCollateral]);

  const currentExchange = exchangePresets.find(e => e.id === selectedExchange);
  
  const breadcrumbItems = [
    { name: 'Home', url: 'https://bitcoincalculator.tools/' },
    { name: 'Calculators', url: 'https://bitcoincalculator.tools/calculators' },
    { name: 'Leverage & Liquidation', url: 'https://bitcoincalculator.tools/calculators/leverage-liquidation' }
  ];

  // JSON-LD Schema
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Bitcoin Liquidation Calculator",
    "description": "Find your exact liquidation price before opening a leveraged Bitcoin position. Enter entry price, leverage and size — know your risk before the market does.",
    "url": "https://bitcoincalculator.tools/calculators/leverage-liquidation",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Real-time Bitcoin price integration",
      "Long and short position calculations",
      "Leverage up to 125x support",
      "Multiple exchange presets",
      "Risk score analysis",
      "Take profit and stop loss planning"
    ],
    "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
    "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" }
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Calculate Bitcoin Liquidation Price",
    "description": "Learn how to calculate your liquidation price for leveraged Bitcoin positions",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Enter Position Details",
        "text": "Set your entry price, position type (long/short), and margin amount"
      },
      {
        "@type": "HowToStep",
        "name": "Select Leverage Level",
        "text": "Choose leverage from 1x to 125x using presets or custom input"
      },
      {
        "@type": "HowToStep",
        "name": "Calculate Liquidation",
        "text": "View your liquidation price and distance using real market formulas"
      },
      {
        "@type": "HowToStep",
        "name": "Manage Risk",
        "text": "Set take profit/stop loss levels and review your risk score"
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{t('lev.meta.title')}</title>
        <meta name="description" content={t('lev.meta.description')} />
        <link rel="canonical" href={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-tasfiye':'https://bitcoincalculator.tools/calculators/leverage-liquidation'} />
        
        <link rel="alternate" hrefLang="tr" href="https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-tasfiye" />
        <link rel="alternate" hrefLang="en" href="https://bitcoincalculator.tools/calculators/leverage-liquidation" />
        <link rel="alternate" hrefLang="x-default" href="https://bitcoincalculator.tools/calculators/leverage-liquidation" />
        {/* Open Graph */}
        <meta property="og:title" content={t('lev.meta.ogTitle')} />
        <meta property="og:description" content={t('lev.meta.ogDescription')} />
        <meta property="og:url" content={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-tasfiye':'https://bitcoincalculator.tools/calculators/leverage-liquidation'} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="bitcoincalculator.tools" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('lev.meta.twitterTitle')} />
        <meta name="twitter:description" content={t('lev.meta.twitterDescription')} />

        <meta name="twitter:creator" content="@web3believers" />
        
        <meta name="twitter:site" content="@web3believers" />
        {/* JSON-LD Schemas */}
        <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "inLanguage": language === 'tr' ? 'tr' : 'en',
          "mainEntity": (language === 'tr' ? [
            { q: "Bitcoin tasfiye fiyatı nedir?", a: "Tasfiye fiyatı, marjınız zararları artık karşılayamadığı için kaldıraçlı Bitcoin pozisyonunuzun borsa tarafından otomatik olarak kapatıldığı fiyattır. Bu noktada, o pozisyon için tüm marjınızı (teminatınızı) kaybedersiniz." },
            { q: "Kaldıraç tasfiye riskini nasıl etkiler?", a: "Yüksek kaldıraç, daha küçük bir fiyat hareketinin tasfiyeyi tetikleyebileceği anlamına gelir. 2x kaldıraçta, bir long pozisyonun tasfiyesi için Bitcoin ~%50 düşmelidir. 10x'te yalnızca ~%10 düşüş gereklidir. 100x'te %1'den az bir hareket pozisyonunuzu silebilir." },
            { q: "İzole ve cross marj arasındaki fark nedir?", a: "İzole marj yalnızca belirli bir pozisyona atanan teminatı riske atar ve kaybınızı sınırlar. Cross marj tüm hesap bakiyenizi teminat olarak kullanır; tasfiyeden önce daha fazla alan sağlar ama işlem ters giderse tüm hesabınızı riske atar." },
            { q: "Tasfiye edilmekten nasıl kaçınabilirim?", a: "Daha düşük kaldıraç kullanın, stop-loss emirleri ayarlayın, yeterli marjı koruyun ve tek bir pozisyonda aşırı yoğunlaşmaktan kaçının. Hesaplayıcımız, uygun risk yönetimi seviyeleri belirleyebilmeniz için tam tasfiye fiyatınızı bulmanıza yardımcı olur." },
            { q: "Bitcoin kaldıraç tasfiye fiyatını nasıl hesaplarım?", a: "Bir işlem açmadan önce tam tasfiye fiyatınızı bulmak için Bitcoin tasfiye hesaplayıcımıza giriş fiyatınızı, kaldıraç çarpanınızı ve pozisyon büyüklüğünüzü girin. Formül, her borsaya özgü bakım marjı gereksinimlerini hesaba katar." },
            { q: "Kripto kaldıraç hesaplayıcı nedir?", a: "Bir kripto kaldıraç hesaplayıcı, kaldıraçlı Bitcoin pozisyonlarınız için tasfiye fiyatınızı, gerekli marjı ve maksimum kaybınızı gösterir — herhangi bir işlem açmadan önce kritiktir. Aracımız Binance, Bybit ve OKX dahil başlıca borsalar için hazır ayarları destekler." }
          ] : [
            { q: "What is a Bitcoin liquidation price?", a: "A liquidation price is the price at which your leveraged Bitcoin position is automatically closed by the exchange because your margin can no longer cover the losses. At this point, you lose your entire margin (collateral) for that position." },
            { q: "How does leverage affect liquidation risk?", a: "Higher leverage means a smaller price move can trigger liquidation. At 2x leverage, Bitcoin must drop ~50% to liquidate a long. At 10x, only ~10% drop is needed. At 100x, less than 1% can wipe out your position." },
            { q: "What is the difference between isolated and cross margin?", a: "Isolated margin only risks the collateral assigned to a specific position, limiting your loss. Cross margin uses your entire account balance as collateral, giving more room before liquidation but risking your full account if the trade goes wrong." },
            { q: "How can I avoid getting liquidated?", a: "Use lower leverage, set stop-loss orders, maintain adequate margin, and avoid over-concentrating in a single position. Our calculator helps you determine your exact liquidation price so you can set appropriate risk management levels." },
            { q: "How do I calculate Bitcoin leverage liquidation price?", a: "Enter your entry price, leverage multiplier, and position size in our Bitcoin liquidation calculator to find your exact liquidation price before you open a trade. The formula accounts for maintenance margin requirements specific to each exchange." },
            { q: "What is a crypto leverage calculator?", a: "A crypto leverage calculator shows your liquidation price, required margin, and maximum loss for leveraged Bitcoin positions — essential before opening any trade. Our tool supports presets for major exchanges including Binance, Bybit, and OKX." }
          ]).map(({q,a}) => ({ "@type": "Question", "name": q, "acceptedAnswer": { "@type": "Answer", "text": a } }))
        })}</script>
      </Helmet>
        <HelmetOgImage slug="bitcoin-leverage-liquidation-calculator" enAlt={`Bitcoin Liquidation Calculator | bitcoincalculator.tools`} />
      
      <BreadcrumbSchema language={language} items={breadcrumbItems} />
      
      <PageBackground variant="clean">
        <Header />
        
        <main id="main-content" className="pt-20 relative z-10">
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb items={[
              { label: t('lev.crumb.calculators'), href: language==='tr'?'/tr/hesaplayicilar':'/calculators' },
              { label: t('lev.crumb.current') }
            ]} />
          </div>

          <section className="container mx-auto px-6 py-16 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6 text-sm font-medium text-primary">
              <TrendingDown className="w-4 h-4" />
              {t('lev.hero.badge')}
            </div>
            
            <h1 className="text-h1 font-bold text-foreground mb-4">
              {t('lev.hero.titlePrefix')} <span className="text-gradient-premium">{t('lev.hero.titleHighlight')}</span> {t('lev.hero.titleSuffix')}
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              {t('lev.hero.description')}
            </p>

            <div className="max-w-sm mx-auto">
              <CompactLiveBitcoinPrice currency="USD" />
            </div>
          </section>

          <section className="container mx-auto px-6 pb-20">
            <div className="max-w-6xl mx-auto space-y-10">
              <OfflineIndicator />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                <ErrorBoundary>
                  <LeverageInputPanel
                    entryPrice={entryPrice}
                    setEntryPrice={handleSetEntryPrice}
                    positionType={positionType}
                    setPositionType={setPositionType}
                    leverage={leverage}
                    setLeverage={setLeverage}
                    marginAmount={marginAmount}
                    setMarginAmount={setMarginAmount}
                    marginMode={marginMode}
                    setMarginMode={setMarginMode}
                    accountCollateral={accountCollateral}
                    setAccountCollateral={setAccountCollateral}
                    maintenanceMargin={maintenanceMargin}
                    setMaintenanceMargin={setMaintenanceMargin}
                    takeProfitPercent={takeProfitPercent}
                    setTakeProfitPercent={setTakeProfitPercent}
                    stopLossPercent={stopLossPercent}
                    setStopLossPercent={setStopLossPercent}
                    selectedExchange={selectedExchange}
                    setSelectedExchange={setSelectedExchange}
                    liveBtcPrice={liveBtcPrice}
                    isLoadingPrice={isLoadingPrice}
                  />
                </ErrorBoundary>
                <ErrorBoundary>
                  <LeverageResultsPanel
                    result={result}
                    leverageComparison={leverageComparison}
                    entryPrice={entryPrice}
                    currentPrice={liveBtcPrice || entryPrice}
                    positionType={positionType}
                    isLoading={isLoadingPrice && !result}
                  />
                </ErrorBoundary>
              </div>

              {/* Visualizations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <LiquidationPriceChart
                  result={result}
                  entryPrice={entryPrice}
                  currentPrice={liveBtcPrice || entryPrice}
                  positionType={positionType}
                />
                <RiskRewardVisualization
                  result={result}
                  marginAmount={marginAmount}
                  leverage={leverage}
                />
              </div>

              {/* Export Section */}
              {result && (
                <div className="mt-6">
                  <LeverageExportReport
                    result={result}
                    entryPrice={entryPrice}
                    leverage={leverage}
                    marginAmount={marginAmount}
                    positionType={positionType}
                    exchangeName={currentExchange?.name || 'Unknown'}
                  />
                </div>
              )}

              {result && (
                <>
                  <TradingBrokerBanner
                    slug="leverage-liquidation"
                    segment="post-export"
                    hasLiquidationRisk={leverage >= 10}
                    forceAxi={leverage >= 10}
                  />
                  <InViewMount minHeight={260} ariaLabel="Sponsored broker banner" rootMargin="400px 0px">
                    <div className="mt-6">
                      <AffiliatePlacement
                        slug="leverage-liquidation"
                        zone="inline"
                        forceAffiliateId="axi"
                        forceFormat="image-banner"
                        variantId="axi-image-rotation"
                      />
                    </div>
                  </InViewMount>
                </>
              )}



              {marginSimulationRows.length > 0 && (
                <Card className="bg-card/50 backdrop-blur-sm border-border/50 mt-8">
                  <CardContent className="p-4 sm:p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-semibold text-foreground">{t('lev.margin.title')}</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t('lev.margin.descPrefix')}{positionType === 'long' ? t('lev.dir.long') : t('lev.dir.short')}{t('lev.margin.descSuffix')}
                        </p>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button type="button" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border/40 px-3 text-xs text-muted-foreground hover:text-foreground" aria-label={t('aria.explainCrossCollateral')}>
                              Cross collateral: ${Math.max(0, accountCollateral).toLocaleString()}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="text-xs">Cross margin adds extra account equity to this position. It can delay liquidation, but the added collateral is also at risk if the market keeps moving against you.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm min-w-[760px]">
                        <thead>
                          <tr className="border-b border-border/30 text-muted-foreground">
                            <th className="text-left py-2 font-medium">{t('lev.col.adverseMove')}</th>
                            <th className="text-right py-2 font-medium">{t('lev.col.projBTC')}</th>
                            <th className="text-right py-2 font-medium">{t('lev.col.isoLiq')}</th>
                            <th className="text-right py-2 font-medium">{t('lev.col.isoStatus')}</th>
                            <th className="text-right py-2 font-medium">{t('lev.col.crossLiq')}</th>
                            <th className="text-right py-2 font-medium">{t('lev.col.crossStatus')}</th>
                            <th className="text-right py-2 font-medium">{t('lev.col.crossCollat')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {marginSimulationRows.map((row) => (
                            <tr key={row.move} className="border-b border-border/20 last:border-0">
                              <td className="py-2.5 font-medium text-foreground">{row.move}%</td>
                              <td className="py-2.5 text-right text-muted-foreground">${row.projectedPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                              <td className="py-2.5 text-right text-muted-foreground">${row.isolatedLiquidation.toLocaleString(undefined, { maximumFractionDigits: 0 })} · {Math.max(0, row.isolatedDistance).toFixed(1)}%</td>
                              <td className={`py-2.5 text-right ${row.isolatedStatus === 'Open' ? 'text-success' : row.isolatedStatus === 'Near liquidation' ? 'text-warning' : 'text-destructive'}`}>{row.isolatedStatus}</td>
                              <td className="py-2.5 text-right text-muted-foreground">${row.crossLiquidation.toLocaleString(undefined, { maximumFractionDigits: 0 })} · {Math.max(0, row.crossDistance).toFixed(1)}%</td>
                              <td className={`py-2.5 text-right ${row.crossStatus === 'Open' ? 'text-success' : row.crossStatus === 'Near liquidation' ? 'text-warning' : 'text-destructive'}`}>{row.crossStatus}</td>
                              <td className="py-2.5 text-right text-muted-foreground">${row.crossCollateral.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-4 sm:p-6 space-y-4">
                  <div>
                    <h2 id="maintenance-margin-table" className="text-lg font-semibold text-foreground">{t('lev.maint.title')}</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('lev.maint.desc')}
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[560px]">
                      <thead>
                        <tr className="border-b border-border/30 text-muted-foreground">
                          <th className="text-left py-2 font-medium">{t('lev.maint.col.exchange')}</th>
                          <th className="text-right py-2 font-medium">{t('lev.maint.col.preset')}</th>
                          <th className="text-right py-2 font-medium">{t('lev.maint.col.maxLev')}</th>
                          <th className="text-right py-2 font-medium">{t('lev.maint.col.takerFee')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {exchangePresets.map((exchange) => (
                          <tr key={exchange.id} className="border-b border-border/20 last:border-0">
                            <td className="py-2.5 font-medium text-foreground">{exchange.name}</td>
                            <td className="py-2.5 text-right text-muted-foreground">{exchange.maintenanceMargin.toFixed(2)}%</td>
                            <td className="py-2.5 text-right text-muted-foreground">{exchange.maxLeverage}x</td>
                            <td className="py-2.5 text-right text-muted-foreground">{exchange.takerFee.toFixed(3)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* How It Works */}
          <LeverageHowItWorksSection />
          
          {/* FAQ Section */}
          <PreFAQPlacement slug="leverage-liquidation" />
          <LeverageFAQSection />
          
          {/* Related Calculators */}
          <RelatedCalculators />

          {/* Disclaimer */}
          <section className="container mx-auto px-6 pb-16">
            <div className="max-w-3xl mx-auto">
              <Card className="glass-morphism-card border-border/20 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{t('lev.warn.title')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('lev.warn.body')}
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

export default BitcoinLeverageLiquidationCalculator;
