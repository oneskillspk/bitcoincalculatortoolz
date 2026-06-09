import React, { useState, useMemo, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AffiliatePlacement } from "@/components/affiliateAI/AffiliatePlacement";
import { Breadcrumb } from '@/components/Breadcrumb';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import RelatedCalculators from '@/components/RelatedCalculators';
import { Card, CardContent } from '@/components/ui/card';
import { Target, AlertTriangle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLiveBitcoinPrice } from '@/hooks/useLiveBitcoinPrice';
import { calculateForward, calculateReverse, buildScenarioTable, findClosestScenarioIndex } from '@/services/priceTargetCalculator';
import { PriceTargetForwardPanel } from '@/components/price-target/PriceTargetForwardPanel';
import { PriceTargetReversePanel } from '@/components/price-target/PriceTargetReversePanel';
import { PriceTargetResultCards } from '@/components/price-target/PriceTargetResultCards';
import { PriceTargetScenarioTable } from '@/components/price-target/PriceTargetScenarioTable';
import { PriceTargetShareCard } from '@/components/price-target/PriceTargetShareCard';
import { PriceTargetExportReport } from '@/components/price-target/PriceTargetExportReport';
import { PriceTargetContentSections } from '@/components/price-target/PriceTargetContentSections';
import { PriceTargetMoonPanel } from '@/components/price-target/PriceTargetMoonPanel';
import { PriceTargetHowToUse } from '@/components/price-target/PriceTargetHowToUse';
import { PriceTargetFAQSection, faqSchemaEn, faqSchemaTr } from '@/components/price-target/PriceTargetFAQSection';
import { PageBackground } from '@/components/modern/PageBackground';
import { CompactLiveBitcoinPrice } from '@/components/CompactLiveBitcoinPrice';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { QuickAnswerBox } from '@/components/calculator/QuickAnswerBox';
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocalizedSchema } from "@/hooks/useLocalizedSchema";

const fmt = (v: number, dec = 2) => v.toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec });

const BitcoinPriceTargetCalculator: React.FC = () => {
  const { language, t } = useLanguage();
  const { price: liveBtcPrice, isLoading: isLoadingPrice, priceChangePercentage24h } = useLiveBitcoinPrice();
  const exportRef = useRef<HTMLDivElement>(null);

  // Forward mode state
  const [btcAmount, setBtcAmount] = useState(0.5);
  const [forwardTargetPrice, setForwardTargetPrice] = useState(500_000);

  // Reverse mode state
  const [targetNetWorth, setTargetNetWorth] = useState(1_000_000);
  const [reverseTargetPrice, setReverseTargetPrice] = useState(1_000_000);
  const [currentHolding, setCurrentHolding] = useState(0);

  const [activeMode, setActiveMode] = useState<'forward' | 'reverse' | 'moon'>('forward');

  const forwardResult = useMemo(() => calculateForward(btcAmount, forwardTargetPrice, liveBtcPrice), [btcAmount, forwardTargetPrice, liveBtcPrice]);
  const reverseResult = useMemo(() => calculateReverse(targetNetWorth, reverseTargetPrice, liveBtcPrice, currentHolding), [targetNetWorth, reverseTargetPrice, liveBtcPrice, currentHolding]);
  const scenarioRows = useMemo(() => buildScenarioTable(btcAmount, liveBtcPrice), [btcAmount, liveBtcPrice]);
  const highlightIndex = useMemo(() => findClosestScenarioIndex(liveBtcPrice), [liveBtcPrice]);

  // Share text — localized; numbers stay in USD because share links route to /calculators/* (EN canonical)
  const forwardShareText = language === 'tr'
    ? `${btcAmount} BTC'm, Bitcoin $${fmt(forwardTargetPrice, 0)}'a ulaşırsa $${fmt(forwardResult.portfolioValue)} değerinde olabilir. Bu ${forwardResult.multiplier.toFixed(1)}x getiri demek! bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-fiyat-hedef`
    : `My ${btcAmount} BTC could be worth $${fmt(forwardResult.portfolioValue)} if Bitcoin hits $${fmt(forwardTargetPrice, 0)}. That's a ${forwardResult.multiplier.toFixed(1)}x return! bitcoincalculator.tools/calculators/price-target`;
  const reverseShareText = language === 'tr'
    ? `Fiyat $${fmt(reverseTargetPrice, 0)}'a ulaştığında $${fmt(targetNetWorth, 0)}'a ulaşmak için ${fmt(reverseResult.btcNeeded, 4)} BTC'ye ihtiyacım var. Şu an hedefin %${fmt(reverseResult.progressPercent, 1)}'indeyim. bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-fiyat-hedef`
    : `I need ${fmt(reverseResult.btcNeeded, 4)} BTC to reach $${fmt(targetNetWorth, 0)} when price hits $${fmt(reverseTargetPrice, 0)}. Currently ${fmt(reverseResult.progressPercent, 1)}% of the way there. bitcoincalculator.tools/calculators/price-target`;

  const breadcrumbItems = [
    { name: 'Home', url: 'https://bitcoincalculator.tools/' },
    { name: 'Calculators', url: 'https://bitcoincalculator.tools/calculators' },
    { name: 'Price Target', url: 'https://bitcoincalculator.tools/calculators/price-target' },
  ];

  const faqSchema = useLocalizedSchema(faqSchemaEn, faqSchemaTr);

  const webAppSchema = useLocalizedSchema(
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Bitcoin Price Target Calculator",
      "description": "Enter your BTC amount and a target price to see your future portfolio value. Or reverse it: see exactly how much Bitcoin you need to reach $1M.",
      "url": "https://bitcoincalculator.tools/calculators/price-target",
      "inLanguage": "en",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Any",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "featureList": [
        "Forward mode: project portfolio value at any BTC price",
        "Reverse mode: calculate BTC needed for target net worth",
        "6-row scenario table with live price highlight",
        "Social sharing with viral pre-filled tweets",
        "PNG and PDF export",
      ],
      "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
      "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Bitcoin Fiyat Hedef Hesaplayıcısı",
      "description": "Bitcoin hedef fiyat hesaplayıcısı: BTC miktarını ve hedef fiyatı girin, gelecekteki portföy değerini görün. 1 milyon dolar için kaç BTC gerekir?",
      "url": "https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-fiyat-hedef",
      "inLanguage": "tr",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Any",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "featureList": [
        "İleri mod: herhangi bir BTC fiyatında portföy değerini projeksiyon",
        "Ters mod: hedef servet için gereken BTC miktarını hesaplama",
        "6 satırlı senaryo tablosu ve canlı fiyat vurgusu",
        "Hazır tweet ile sosyal paylaşım",
        "PNG ve PDF dışa aktarım",
      ],
      "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
      "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
    },
  );

  const howToSchema = useLocalizedSchema(
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Calculate How Much Bitcoin You Need to Be a Millionaire",
      "description": "Use the Reverse Mode of the Bitcoin Price Target Calculator to find out exactly how much BTC you need.",
      "inLanguage": "en",
      "step": [
        { "@type": "HowToStep", "name": "Select Reverse Mode", "text": "Click the 'How much BTC do I need?' tab to switch to Reverse Mode." },
        { "@type": "HowToStep", "name": "Enter Target Net Worth", "text": "Enter your desired net worth (e.g. $1,000,000) or select a preset chip." },
        { "@type": "HowToStep", "name": "Set Target BTC Price", "text": "Enter the Bitcoin price at which you plan to measure your wealth." },
        { "@type": "HowToStep", "name": "View BTC Needed", "text": "The calculator instantly shows how much BTC you need and the cost to buy it today." },
        { "@type": "HowToStep", "name": "Track Your Progress", "text": "Optionally enter your current holdings to see a progress bar showing how close you are." },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "Milyoner Olmak İçin Ne Kadar Bitcoin Gerekir Hesaplama",
      "description": "Bitcoin Fiyat Hedef Hesaplayıcısının Ters Modunu kullanarak tam olarak ne kadar BTC'ye ihtiyacınız olduğunu öğrenin.",
      "inLanguage": "tr",
      "step": [
        { "@type": "HowToStep", "name": "Ters Modu Seçin", "text": "Ters Moda geçmek için 'Ne kadar BTC lazım?' sekmesine tıklayın." },
        { "@type": "HowToStep", "name": "Hedef Net Servet Girin", "text": "İstediğiniz net serveti girin (örn. 1.000.000 $) veya hazır bir öneri seçin." },
        { "@type": "HowToStep", "name": "Hedef BTC Fiyatını Belirleyin", "text": "Servetinizi ölçmeyi planladığınız Bitcoin fiyatını girin." },
        { "@type": "HowToStep", "name": "Gerekli BTC'yi Görün", "text": "Hesaplayıcı, gereken BTC miktarını ve bugünkü maliyetini anında gösterir." },
        { "@type": "HowToStep", "name": "İlerlemenizi Takip Edin", "text": "Mevcut varlıklarınızı isteğe bağlı olarak girip hedefe ne kadar yaklaştığınızı gösteren ilerleme çubuğunu görün." },
      ],
    },
  );

  return (
    <>
      <Helmet>
        <title>{language==='tr'?'Bitcoin Fiyat Hedef Hesaplayıcısı':'Bitcoin Price Target Calculator'}</title>
        <meta name="description" content={language==='tr'?'Bitcoin hedef fiyat hesaplayıcısı: BTC miktarını ve hedef fiyatı girin, gelecekteki portföy değerini görün. 1 milyon dolar için kaç BTC gerekir?':'Enter your BTC amount and a target price to see your future portfolio value. Or reverse it: see exactly how much Bitcoin you need to reach $1M.'} />
        <meta name="keywords" content="bitcoin millionaire calculator, how much bitcoin to be a millionaire, if bitcoin hits calculator, bitcoin price target calculator, how many bitcoin do i need, bitcoin wealth calculator, if bitcoin reaches $1 million, how much bitcoin for financial freedom" />
        <link rel="canonical" href={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-fiyat-hedef':'https://bitcoincalculator.tools/calculators/price-target'} />

        <link rel="alternate" hrefLang="tr" href="https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-fiyat-hedef" />
        <link rel="alternate" hrefLang="en" href="https://bitcoincalculator.tools/calculators/price-target" />
        <link rel="alternate" hrefLang="x-default" href="https://bitcoincalculator.tools/calculators/price-target" />
        <meta property="og:title" content={language==='tr'?'Bitcoin Fiyat Hedef Hesaplayıcısı':'Bitcoin Price Target Calculator'} />
        <meta property="og:description" content={language==='tr'?'BTC miktarınızı ve hedef fiyatı girin — gelecekteki portföy değerinizi veya 1 milyon dolara ulaşmak için gereken BTC miktarını görün.':'Enter your BTC amount and a target price to see your future portfolio value. Or reverse it: see exactly how much Bitcoin you need to reach $1M.'} />
        <meta property="og:url" content={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-fiyat-hedef':'https://bitcoincalculator.tools/calculators/price-target'} />
        <meta property="og:type" content="website" />
        <HelmetOgImage slug="bitcoin-price-target-calculator" enAlt={`Bitcoin Millionaire Calculator | bitcoincalculator.tools`} />
        <meta property="og:site_name" content="bitcoincalculator.tools" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={language==='tr'?'Bitcoin Fiyat Hedef Hesaplayıcısı':'Bitcoin Price Target Calculator'} />
        <meta name="twitter:description" content={language==='tr'?'BTC yığınınızın değeri ne olabilir — ya da 1 milyon dolara ulaşmak için ne kadar Bitcoin gerekiyor?':'See what your BTC stack could be worth — or calculate how much Bitcoin you need to reach $1M.'} />
        <meta name="twitter:creator" content="@web3believers" />

        <meta name="twitter:site" content="@web3believers" />
        <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
      </Helmet>

      <BreadcrumbSchema language={language} items={breadcrumbItems} />

      <PageBackground variant="clean">
        <Header />

        <main id="main-content" className="pt-20 relative z-10">
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb items={[
              { label: language==='tr'?'Hesaplayıcılar':'Calculators', href: language==='tr'?'/tr/hesaplayicilar':'/calculators' },
              { label: language==='tr'?'Fiyat Hedefi':'Price Target' },
            ]} />
          </div>

          <section className="container mx-auto px-6 py-16 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6 text-sm font-medium text-primary">
              <Target className="w-4 h-4" />
              {language==='tr'?'Bitcoin Milyoner Hesaplayıcısı':'Bitcoin Millionaire Calculator'}
            </div>

            <h1 className="text-h1 font-bold text-foreground mb-4">
              {language==='tr'?<>Bitcoin <span className="text-gradient-premium">Fiyat Hedefi</span> Hesaplayıcısı</>:<>Bitcoin <span className="text-gradient-premium">Price Target</span> Calculator</>}
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              {language==='tr'
                ? 'BTC yığınınızın gelecekteki herhangi bir fiyatta ne kadar değerlenebileceğini görün — ya da finansal hedeflerinize ulaşmak için tam olarak ne kadar Bitcoin gerektiğini hesaplayın.'
                : 'See what your BTC stack could be worth at any future price — or calculate exactly how much Bitcoin you need to reach your financial goals.'}
            </p>

            <div className="max-w-sm mx-auto">
              <CompactLiveBitcoinPrice currency="USD" />
            </div>
          </section>

          <section className="container mx-auto px-6 pb-20">
            <div className="max-w-6xl mx-auto space-y-10">
              <QuickAnswerBox answer={language==='tr'
                ? 'Bitcoin fiyat hedefi hesaplayıcısı iki soruyu anında yanıtlar: BTC başına 200.000 $, 1 milyon $ veya 10 milyon $\'da portföyünüzün değeri ne olur ve bu fiyatta belirli bir net değer hedefine ulaşmak için bugün ne kadar Bitcoin\'e ihtiyacınız var. Canlı BTC fiyatını CoinGecko\'dan kullanır, böylece kazanç yüzdesi ve gerekli BTC rakamları gerçek zamanlı güncellenir.'
                : "The Bitcoin price target calculator answers two questions instantly: what would your portfolio be worth at $200K, $1M, or $10M per BTC, and how much Bitcoin you'd need today to hit a specific net-worth goal at that price. It uses live BTC price from CoinGecko, so the gain percentage and BTC-needed figures update in real time."} />
              <OfflineIndicator />

              <ErrorBoundary>
                <div ref={exportRef}>
                  <Tabs value={activeMode} onValueChange={(v) => setActiveMode(v as 'forward' | 'reverse' | 'moon')} className="mb-6">
                    <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 gap-1 [&_button]:text-xs sm:[&_button]:text-sm [&_button]:px-2">
                      <TabsTrigger value="forward">{language==='tr'?'Portföyüm ne kadar eder?':'What will my stack be worth?'}</TabsTrigger>
                      <TabsTrigger value="reverse">{language==='tr'?'Ne kadar BTC lazım?':'How much BTC do I need?'}</TabsTrigger>
                      <TabsTrigger value="moon">{language==='tr'?'Ay Hesaplayıcısı':'Moon Calculator'}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="forward" className="mt-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                        <PriceTargetForwardPanel
                          btcAmount={btcAmount}
                          setBtcAmount={setBtcAmount}
                          targetPrice={forwardTargetPrice}
                          setTargetPrice={setForwardTargetPrice}
                        />
                        <PriceTargetResultCards mode="forward" result={forwardResult} />
                      </div>
                    </TabsContent>

                    <TabsContent value="reverse" className="mt-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                        <PriceTargetReversePanel
                          targetNetWorth={targetNetWorth}
                          setTargetNetWorth={setTargetNetWorth}
                          targetPrice={reverseTargetPrice}
                          setTargetPrice={setReverseTargetPrice}
                          currentHolding={currentHolding}
                          setCurrentHolding={setCurrentHolding}
                        />
                        <PriceTargetResultCards mode="reverse" result={reverseResult} liveBtcPrice={liveBtcPrice} />
                      </div>
                    </TabsContent>

                    <TabsContent value="moon" className="mt-6">
                      <PriceTargetMoonPanel liveBtcPrice={liveBtcPrice} />
                    </TabsContent>
                  </Tabs>

                  {/* Scenario + Share + Export */}
                  <div className="mt-6 space-y-4">
                    <PriceTargetScenarioTable rows={scenarioRows} highlightIndex={highlightIndex} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <PriceTargetShareCard
                        mode={activeMode === 'moon' ? 'forward' : activeMode}
                        forwardText={forwardShareText}
                        reverseText={reverseShareText}
                      />
                      <PriceTargetExportReport exportRef={exportRef} />
                    </div>
                  </div>
                </div>
              </ErrorBoundary>
            </div>
          </section>

          {/* SEO H2 Sections */}
          <section className="container mx-auto px-6 pb-12">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-h2 font-bold text-foreground mb-4">
                {language==='tr'?'Bitcoin Gelecek Hesaplayıcısı':'Bitcoin Future Calculator'}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {language==='tr'?'Bu Bitcoin gelecek hesaplayıcısı, Bitcoin belirli bir hedef fiyata ulaşırsa varlıklarınızın ne kadar değer kazanacağını hesaplar. BTC miktarınızı ve hedef fiyatı girin; tahmini portföy değerinizi, kazanç yüzdenizi ve Bitcoin\'in o fiyata ulaşmak için ihtiyaç duyacağı piyasa değerini görün.':'This Bitcoin future calculator projects what your holdings could be worth if Bitcoin reaches a target price. Enter your BTC amount and a future price target to see your projected portfolio value, gain percentage, and the market cap Bitcoin would need to reach that price.'}
              </p>
            </div>
          </section>

          <section className="container mx-auto px-6 pb-12">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-h2 font-bold text-foreground mb-4">
                {language==='tr'?'Bitcoin Ay Hesaplayıcısı Nedir?':'What Is a Bitcoin Moon Calculator?'}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {language==='tr'?'Bitcoin ay hesaplayıcısı, mevcut varlıklarınızın belirli bir servet hedefine ulaşması için Bitcoin\'in hangi fiyata gelmesi gerektiğini gösterir. BTC miktarınızı ve hedefinizi girin — ister 100.000 $, ister 1 milyon $, ister finansal bağımsızlık olsun — hesaplayıcı anında Bitcoin\'in ulaşması gereken fiyatı ve o fiyatta gereken piyasa değerini gösterir.':'A Bitcoin moon calculator shows the exact Bitcoin price at which your current holdings would reach a specific wealth target. Enter your BTC stack and your goal — whether that is $100,000, $1 million, or financial independence — and the moon calculator instantly shows the price Bitcoin needs to reach. It also shows the market cap Bitcoin would need at that price, giving context for how realistic or ambitious the target is.'}
              </p>
            </div>
          </section>

          <PriceTargetContentSections />
          <PriceTargetHowToUse />
          <PriceTargetFAQSection />
          <div className="container mx-auto px-6 max-w-5xl"><AffiliatePlacement slug="price-target" /></div>
          <RelatedCalculators />

          {/* Disclaimer */}
          <section className="container mx-auto px-6 pb-16">
            <div className="max-w-3xl mx-auto">
              <Card className="glass-morphism-card border-border/20 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{language==='tr'?'Sorumluluk Reddi':'Disclaimer'}</h3>
                      <p className="text-sm text-muted-foreground">
                        {language==='tr'?'Bu hesaplayıcı yalnızca eğitim amaçlıdır. Fiyat hedefleri ve portföy projeksiyonları varsayımsaldır. Bitcoin volatildir ve geçmiş performans gelecek sonuçları garanti etmez. Bu finansal tavsiye değildir.':'This calculator is for educational purposes only. Price targets and portfolio projections are hypothetical. Bitcoin is volatile and past performance does not guarantee future results. This is not financial advice.'}
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

export default BitcoinPriceTargetCalculator;
