import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AffiliatePlacement } from "@/components/affiliateAI/AffiliatePlacement";
import { PageBackground } from "@/components/modern/PageBackground";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { CompactLiveBitcoinPrice } from "@/components/CompactLiveBitcoinPrice";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { PurchasingPowerInputPanel } from "@/components/purchasing-power/PurchasingPowerInputPanel";
import { PurchasingPowerResultsPanel } from "@/components/purchasing-power/PurchasingPowerResultsPanel";
import { PurchasingPowerComparison } from "@/components/purchasing-power/PurchasingPowerComparison";
import { PurchasingPowerChart } from "@/components/purchasing-power/PurchasingPowerChart";
import { PurchasingPowerHowItWorksSection } from "@/components/purchasing-power/PurchasingPowerHowItWorksSection";
import { PurchasingPowerFAQSection } from "@/components/purchasing-power/PurchasingPowerFAQSection";
import RelatedCalculators from "@/components/RelatedCalculators";
import { useLiveBitcoinPrice } from "@/hooks/useLiveBitcoinPrice";
import { PurchasingPowerCalculator, type PurchasingPowerResult } from "@/services/purchasingPowerCalculator";
import { SUPPORTED_CURRENCIES } from "@/services/bitcoinApi";
import { AlertTriangle, ShoppingCart } from "lucide-react";
import { QuickAnswerBox } from "@/components/calculator/QuickAnswerBox";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocalizedSchema } from "@/hooks/useLocalizedSchema";

const BitcoinPurchasingPowerCalculator = () => {
  const { language, t } = useLanguage();

  const trUrl = "https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-enflasyon";
  const enUrl = "https://bitcoincalculator.tools/calculators/purchasing-power";

  const webAppSchema = useLocalizedSchema(
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "inLanguage": "en",
      "name": "Bitcoin Purchasing Power Calculator",
      "description": "What can your Bitcoin actually buy? See the real-world value of your BTC in goods, assets and experiences — updated live. Real context, not just numbers.",
      "url": enUrl,
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Any",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "featureList": [
        "Real-time Bitcoin price conversion",
        "60+ items across 8 categories",
        "Multi-currency support",
        "Category filtering and search",
        "Visual charts and breakdowns",
      ],
      "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
      "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "inLanguage": "tr",
      "name": "Bitcoin Satın Alma Gücü Hesaplayıcısı",
      "description": "Bitcoin'iniz gerçekte ne satın alabilir? BTC'nizin mal, varlık ve deneyimlerdeki gerçek dünya değerini canlı fiyatlarla görün.",
      "url": trUrl,
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Any",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "TRY" },
      "featureList": [
        "Gerçek zamanlı Bitcoin fiyat dönüşümü",
        "8 kategoride 60+ ürün",
        "Çoklu para birimi desteği",
        "Kategori filtreleme ve arama",
        "Görsel grafikler ve dökümler",
      ],
      "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
      "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
    },
  );

  const faqSchema = useLocalizedSchema(
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "inLanguage": "en",
      "mainEntity": [
        { "@type": "Question", "name": "What is Bitcoin purchasing power?", "acceptedAnswer": { "@type": "Answer", "text": "Bitcoin purchasing power refers to how much real-world goods and services your Bitcoin holdings can buy. Our calculator translates your BTC value into tangible items like phones, cars, experiences, and investments, making it easier to understand the actual worth of your cryptocurrency." } },
        { "@type": "Question", "name": "How accurate are the item prices?", "acceptedAnswer": { "@type": "Answer", "text": "Item prices are based on average market prices and are regularly updated. Prices represent typical costs in USD and are converted to other currencies using current exchange rates. Actual prices may vary based on your location, retailer, and specific product variants." } },
        { "@type": "Question", "name": "Does this calculator include transaction fees?", "acceptedAnswer": { "@type": "Answer", "text": "No, this calculator shows raw purchasing power based on your Bitcoin's current value. It doesn't account for exchange fees, transaction costs, or taxes that would apply when converting Bitcoin to fiat currency and making actual purchases." } },
        { "@type": "Question", "name": "Why is purchasing power important for Bitcoin holders?", "acceptedAnswer": { "@type": "Answer", "text": "Understanding purchasing power helps you make better financial decisions by showing what your Bitcoin can actually buy. It makes abstract numbers tangible and helps you set realistic goals, whether you're saving for a car, planning a vacation, or building long-term wealth." } },
        { "@type": "Question", "name": "Is my financial data private and secure?", "acceptedAnswer": { "@type": "Answer", "text": "Absolutely. All calculations are performed locally in your browser. We do not store, track, or transmit any of your financial information to our servers. Your Bitcoin holdings and calculations remain completely private." } },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "inLanguage": "tr",
      "mainEntity": [
        { "@type": "Question", "name": "Bitcoin satın alma gücü nedir?", "acceptedAnswer": { "@type": "Answer", "text": "Bitcoin satın alma gücü, elinizdeki Bitcoin'in gerçek dünyada ne kadar mal ve hizmet alabileceğini ifade eder. Hesaplayıcımız BTC değerinizi telefon, araba, deneyim ve yatırım gibi somut ürünlere çevirerek kripto varlığınızın gerçek değerini görmenizi sağlar." } },
        { "@type": "Question", "name": "Ürün fiyatları ne kadar doğru?", "acceptedAnswer": { "@type": "Answer", "text": "Ürün fiyatları ortalama piyasa fiyatlarına dayanır ve düzenli olarak güncellenir. Fiyatlar USD bazlıdır ve güncel kurlarla diğer para birimlerine çevrilir. Gerçek fiyatlar bulunduğunuz konuma, satıcıya ve ürün varyantına göre değişebilir." } },
        { "@type": "Question", "name": "Hesaplayıcı işlem ücretlerini içeriyor mu?", "acceptedAnswer": { "@type": "Answer", "text": "Hayır, hesaplayıcı Bitcoin'inizin güncel değerine göre brüt satın alma gücünü gösterir. Bitcoin'i fiat'a çevirip alışveriş yaparken karşılaşacağınız borsa ücretleri, işlem maliyetleri veya vergileri hesaba katmaz." } },
        { "@type": "Question", "name": "Satın alma gücü Bitcoin sahipleri için neden önemli?", "acceptedAnswer": { "@type": "Answer", "text": "Satın alma gücünü anlamak, Bitcoin'inizin gerçekte ne alabileceğini göstererek daha sağlıklı finansal kararlar vermenize yardımcı olur. Soyut sayıları somutlaştırır; ister araba almak, ister tatil planlamak, ister uzun vadeli servet biriktirmek olsun gerçekçi hedefler belirlemenizi kolaylaştırır." } },
        { "@type": "Question", "name": "Finansal verilerim gizli ve güvende mi?", "acceptedAnswer": { "@type": "Answer", "text": "Kesinlikle. Tüm hesaplamalar tarayıcınızda yerel olarak yapılır. Finansal bilgilerinizi saklamaz, izlemez veya sunucularımıza göndermeyiz. Bitcoin bakiyeniz ve hesaplamalarınız tamamen size özeldir." } },
      ],
    },
  );

  const howToSchema = useLocalizedSchema(
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "inLanguage": "en",
      "name": "How to Check What Your Bitcoin Can Buy",
      "description": "Use the Bitcoin Purchasing Power Calculator to see what your BTC holdings are worth in real-world goods and experiences.",
      "step": [
        { "@type": "HowToStep", "name": "Enter Your BTC Amount", "text": "Type in how much Bitcoin you hold or want to evaluate." },
        { "@type": "HowToStep", "name": "Choose Your Currency", "text": "Select your local currency (USD, EUR, GBP, etc.) for accurate pricing." },
        { "@type": "HowToStep", "name": "Browse Your Purchasing Power", "text": "See how many everyday items — from coffee to cars — your Bitcoin can buy, with live price data." },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "inLanguage": "tr",
      "name": "Bitcoin'inizin Neler Alabileceğini Nasıl Görürsünüz",
      "description": "Bitcoin Satın Alma Gücü Hesaplayıcısı ile BTC varlığınızın gerçek dünyadaki ürün ve deneyim karşılıklarını görün.",
      "step": [
        { "@type": "HowToStep", "name": "BTC Miktarınızı Girin", "text": "Sahip olduğunuz veya değerlendirmek istediğiniz Bitcoin miktarını yazın." },
        { "@type": "HowToStep", "name": "Para Biriminizi Seçin", "text": "Doğru fiyatlandırma için yerel para biriminizi (TRY, USD, EUR vb.) seçin." },
        { "@type": "HowToStep", "name": "Satın Alma Gücünüzü Keşfedin", "text": "Kahveden arabaya kadar Bitcoin'inizin canlı fiyatlarla kaç ürün alabildiğini görün." },
      ],
    },
  );

  const [btcAmount, setBtcAmount] = useState<number>(0.5);
  const [fiatAmount, setFiatAmount] = useState<number>(0);
  const [currency, setCurrency] = useState<string>('USD');
  const [useLivePrice, setUseLivePrice] = useState<boolean>(true);
  const [result, setResult] = useState<PurchasingPowerResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { price: currentBtcPrice, isLoading: priceLoading } = useLiveBitcoinPrice(currency);
  const currencySymbol = SUPPORTED_CURRENCIES.find(c => c.code === currency)?.symbol || '$';

  // Auto-sync amounts when live price is enabled
  useEffect(() => {
    if (useLivePrice && currentBtcPrice > 0 && btcAmount > 0) {
      setFiatAmount(btcAmount * currentBtcPrice);
    }
  }, [useLivePrice, currentBtcPrice, btcAmount]);

  // Auto-calculate on initial load if BTC amount is set
  useEffect(() => {
    if (currentBtcPrice > 0 && btcAmount > 0 && !result) {
      handleCalculate();
    }
  }, [currentBtcPrice]);

  const handleCalculate = () => {
    if (btcAmount <= 0 || currentBtcPrice <= 0) return;

    setLoading(true);
    
    // Simulate calculation delay for UX
    setTimeout(() => {
      const calculatedResult = PurchasingPowerCalculator.calculatePurchasingPower(
        btcAmount,
        currentBtcPrice,
        currency
      );
      setResult(calculatedResult);
      setLoading(false);
    }, 300);
  };


  return (
    <>
<Helmet>
  <title>{language==='tr'?'Bitcoin Satın Alma Gücü Hesaplayıcısı':'Bitcoin Purchasing Power Calculator'}</title>
  <meta name="description" content={language==='tr'?'Bitcoin\'iniz gerçekte ne satın alabilir? BTC\'nizin mal, varlık ve deneyimlerdeki gerçek dünya değerini canlı güncel olarak görün. Rakamlar değil, gerçek bağlam.':'What can your Bitcoin actually buy? See the real-world value of your BTC in goods, assets and experiences — updated live. Real context, not just numbers.'} />
  <meta name="keywords" content="bitcoin purchasing power calculator, bitcoin value calculator, what can i buy with bitcoin, btc worth today, bitcoin real world value, btc live price tool" />
  <link rel="canonical" href={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-enflasyon':'https://bitcoincalculator.tools/calculators/purchasing-power'} />
  
  <link rel="alternate" hrefLang="tr" href="https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-enflasyon" />
  <link rel="alternate" hrefLang="en" href="https://bitcoincalculator.tools/calculators/purchasing-power" />
  <link rel="alternate" hrefLang="x-default" href="https://bitcoincalculator.tools/calculators/purchasing-power" />
  <meta property="og:title" content={language==='tr'?'Bitcoin Satın Alma Gücü Hesaplayıcısı':'Bitcoin Purchasing Power Calculator'} />
  <meta property="og:description" content={language==='tr'?'Bitcoin\'iniz gerçekte ne satın alabilir? BTC\'nizin mal, varlık ve deneyimlerdeki gerçek dünya değerini görün. Canlı güncelleme.':'What can your Bitcoin actually buy? See the real-world value of your BTC in goods, assets and experiences — updated live. Real context, not just numbers.'} />
  <meta property="og:url" content={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-enflasyon':'https://bitcoincalculator.tools/calculators/purchasing-power'} />
  <meta property="og:type" content="website" />
  <HelmetOgImage slug="bitcoin-purchasing-power-calculator" enAlt={`Bitcoin Purchasing Power Calculator | bitcoincalculator.tools`} />
  <meta property="og:site_name" content="bitcoincalculator.tools" />
  
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={language==='tr'?'Bitcoin Satın Alma Gücü Hesaplayıcısı':'Bitcoin Purchasing Power Calculator'} />
  <meta name="twitter:description" content={language==='tr'?'Bitcoin\'iniz şu anda gerçekte ne satın alabilir? Mal, varlık ve deneyimlerdeki gerçek dünya değeri.':'What can your Bitcoin actually buy right now? Real-world value in goods, assets and experiences.'} />
  <meta name="twitter:creator" content="@web3believers" />
  
        <meta name="twitter:site" content="@web3believers" />
  <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>
  <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
  <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
</Helmet>

      <BreadcrumbSchema
        language={language}
        items={language === 'tr' ? [
          { name: "Ana Sayfa", url: "https://bitcoincalculator.tools/tr/" },
          { name: "Hesaplayıcılar", url: "https://bitcoincalculator.tools/tr/hesaplayicilar" },
          { name: "Satın Alma Gücü", url: trUrl },
        ] : [
          { name: "Home", url: "https://bitcoincalculator.tools/" },
          { name: "Calculators", url: "https://bitcoincalculator.tools/calculators" },
          { name: "Purchasing Power", url: enUrl },
        ]}
      />

      <PageBackground variant="clean">
        <Header />
        <OfflineIndicator />

        <main id="main-content" className="container mx-auto px-4 pt-32 md:pt-40 pb-8 max-w-6xl">
          {/* Breadcrumb */}
          <Breadcrumb items={[
            { label: language==='tr'?'Hesaplayıcılar':'Calculators', href: language==='tr'?'/tr/hesaplayicilar':'/calculators' },
            { label: language==='tr'?'Satın Alma Gücü':'Purchasing Power' }
          ]} />

          {/* Hero */}
          <div className="text-center mb-8 mt-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
              <ShoppingCart className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-h1 font-bold text-foreground mb-4">
              {language==='tr'?<>Bitcoin <span className="text-primary">Satın Alma Gücü</span> Hesaplayıcısı</>:<>Bitcoin <span className="text-primary">Purchasing Power</span> Calculator</>}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {language==='tr'?'Bitcoin\'inizin gerçek dünyada gerçekte ne satın alabileceğini görün. Kahveden arabaya, hisse senetlerinden gayrimenkule — BTC varlıklarınızın gerçek satın alma gücünü anlayın.':'See what your Bitcoin can actually buy in the real world. From coffee to cars, stocks to real estate — understand the true purchasing power of your BTC holdings.'}
            </p>
          </div>

          {/* Live Price */}
          <div className="max-w-sm mx-auto mb-6">
            <CompactLiveBitcoinPrice currency={currency} />
          </div>

          <QuickAnswerBox answer={language==='tr'
            ? 'Bitcoin satın alma gücü, BTC’nizin gerçek dünyada hangi mal ve hizmetleri alabildiğini gösterir — kahve, araba, ev, hisse senedi. Hesaplayıcı, BTC miktarınızı canlı BTC fiyatıyla çarpar, ardından güncel varlık fiyatlarına böler (Türkiye ortalama konut, Tesla Model 3, Big Mac, ons altın) — böylece 1 BTC’nin beş yıl önce aldığını bugün hâlâ alıp alamayacağınızı görürsünüz.'
            : 'Bitcoin purchasing power tells you what real-world goods your BTC actually buys — coffee, cars, houses, stocks. The calculator multiplies your BTC holding by the live BTC price, then divides by current asset prices (median U.S. home, Tesla Model 3, Big Mac, troy ounce of gold) so you can see whether one full Bitcoin still buys what it bought five years ago.'} />

          {/* Input + Results */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <div className="lg:col-span-1 min-w-0">
              <PurchasingPowerInputPanel
                btcAmount={btcAmount}
                onBtcAmountChange={setBtcAmount}
                fiatAmount={fiatAmount}
                onFiatAmountChange={setFiatAmount}
                currency={currency}
                onCurrencyChange={setCurrency}
                useLivePrice={useLivePrice}
                onLivePriceToggle={setUseLivePrice}
                currentBtcPrice={currentBtcPrice}
                onCalculate={handleCalculate}
                loading={loading}
              />
            </div>
            <div className="lg:col-span-2 min-w-0">
              <PurchasingPowerResultsPanel
                result={result}
                currencySymbol={currencySymbol}
              />
            </div>
          </div>

          {/* Comparison & Chart */}
          {result && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              <PurchasingPowerComparison
                result={result}
                currencySymbol={currencySymbol}
              />
              <PurchasingPowerChart
                result={result}
                currencySymbol={currencySymbol}
              />
            </div>
          )}

          {/* How It Works */}
          <PurchasingPowerHowItWorksSection />

          {/* FAQ */}
          <PurchasingPowerFAQSection />

          {/* Related */}
          <div className="container mx-auto px-6 max-w-5xl"><AffiliatePlacement slug="purchasing-power" /></div>
          <RelatedCalculators />

          <section className="pb-12" aria-labelledby="purchasing-power-disclaimer">
            <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/30 p-4 rounded-lg border border-border/30">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-warning" />
              <p id="purchasing-power-disclaimer">
                {language==='tr'?'Bu hesaplayıcı yalnızca eğitim amaçlıdır. Ürün fiyatları tahminidir, Bitcoin fiyatları sürekli değişir ve sonuçlar vergileri, borsa ücretlerini veya satıcı mevcudiyetini kapsamaz.':'This calculator is for educational purposes only. Item prices are estimates, Bitcoin prices move constantly, and results do not include taxes, exchange fees, or merchant availability.'}
              </p>
            </div>
          </section>
        </main>

        <Footer />
      </PageBackground>
    </>
  );
};

export default BitcoinPurchasingPowerCalculator;
