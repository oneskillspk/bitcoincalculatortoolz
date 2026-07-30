import React, { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useSafeLanguage } from "@/hooks/useSafeLanguage";
import { Breadcrumb } from '@/components/Breadcrumb';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import RelatedCalculators from '@/components/RelatedCalculatorsLazy';
import { CompactLiveBitcoinPrice } from '@/components/CompactLiveBitcoinPrice';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PageBackground } from '@/components/modern/PageBackground';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Coins, HelpCircle, Info } from 'lucide-react';
import { useLiveBitcoinPrice } from '@/hooks/useLiveBitcoinPrice';
import { useQuery } from '@tanstack/react-query';
import { Link } from "@/components/LocalizedLink";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/hooks/useLocale";
import { useLocalizedSchema } from "@/hooks/useLocalizedSchema";

import { HelmetOgImage } from "@/components/seo/HelmetOgImage";
import { PreFAQPlacement } from "@/components/placement/PreFAQPlacement";
import { QuickShareLinkPanel } from '@/components/share-export';
import { PageQuickAnswer } from "@/components/calculator/PageQuickAnswer";
const PiToBitcoinCalculator: React.FC = () => {
  const { language, t } = useLanguage();
  const { intlLocale } = useLocale();
  const { price: liveBtcPrice } = useLiveBitcoinPrice();
  const [piAmount, setPiAmount] = useState<number>(1000);
  const [manualPiPrice, setManualPiPrice] = useState<number>(0.65);
  const [btcPriceOverride, setBtcPriceOverride] = useState<number>(0);
  const [btcInitialized, setBtcInitialized] = useState(false);

  // Try to fetch Pi price from CoinGecko
  const { data: piPriceData } = useQuery({
    queryKey: ['pi-network-price'],
    queryFn: async () => {
      const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=pi-network&vs_currencies=usd');
      if (!res.ok) throw new Error('Failed to fetch Pi price');
      const data = await res.json();
      return data['pi-network']?.usd as number | undefined;
    },
    retry: 1,
    staleTime: 60000,
  });

  const piPrice = piPriceData ?? manualPiPrice;
  const isPiPriceLive = !!piPriceData;

  useEffect(() => {
    if (piPriceData) setManualPiPrice(piPriceData);
  }, [piPriceData]);

  useEffect(() => {
    if (liveBtcPrice > 0 && !btcInitialized) {
      setBtcPriceOverride(liveBtcPrice);
      setBtcInitialized(true);
    }
  }, [liveBtcPrice, btcInitialized]);

  const btcPrice = btcPriceOverride || liveBtcPrice;

  const results = useMemo(() => {
    if (piPrice <= 0 || btcPrice <= 0) return null;
    const usdValue = piAmount * piPrice;
    const btcValue = usdValue / btcPrice;
    const satsValue = btcValue * 100_000_000;
    return { usdValue, btcValue, satsValue, unitUsd: piPrice, unitSats: (piPrice / btcPrice) * 100_000_000 };
  }, [piAmount, piPrice, btcPrice]);

  const referenceAmounts = [100, 1000, 10000, 100000];

  const breadcrumbItems = [
    { name: 'Home', url: 'https://bitcoincalculator.tools/' },
    { name: 'Calculators', url: 'https://bitcoincalculator.tools/calculators' },
    { name: 'Pi Coin to Bitcoin Calculator', url: 'https://bitcoincalculator.tools/calculators/pi-to-bitcoin' },
  ];

  const webAppSchemaEn = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Pi Coin to Bitcoin Calculator",
    "description": "Convert Pi Network coins to Bitcoin (BTC) and USD. Enter your Pi amount to see estimated BTC and USD value based on current Pi market price.",
    "url": "https://bitcoincalculator.tools/calculators/pi-to-bitcoin",
    "inLanguage": "en",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "featureList": ["Pi to BTC conversion", "Pi to USD conversion", "Pi to satoshis conversion", "Live Pi price", "Pi Network value calculator"],
    "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
    "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" }
  };

  const webAppSchemaTr = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Pi'den Bitcoin'e Dönüştürücü",
    "description": "Pi Network coinlerini canlı piyasa fiyatlarıyla Bitcoin (BTC) ve USD'ye dönüştürün. Pi miktarınızı girin, BTC ve USD değerini anında görün.",
    "url": "https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-pi-donusturucu",
    "inLanguage": "tr",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "TRY" },
    "featureList": ["Pi'den BTC'ye dönüşüm", "Pi'den USD'ye dönüşüm", "Pi'den satoshi'ye dönüşüm", "Canlı Pi fiyatı", "Pi Network değer hesaplayıcısı"],
    "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
    "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" }
  };

  const howToSchemaEn = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Convert Pi Coin to Bitcoin",
    "description": "Convert Pi Network coins to BTC using live market prices",
    "inLanguage": "en",
    "step": [
      { "@type": "HowToStep", "name": "Enter Pi Amount", "text": "Enter the number of Pi coins you want to convert" },
      { "@type": "HowToStep", "name": "Verify Pi Price", "text": "Check the Pi price — it auto-fills from CoinGecko or enter your exchange rate" },
      { "@type": "HowToStep", "name": "Read BTC Value", "text": "See your Pi value in Bitcoin, USD, and satoshis instantly" }
    ]
  };

  const howToSchemaTr = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Pi Coin'i Bitcoin'e Nasıl Dönüştürürsünüz?",
    "description": "Pi Network coinlerini canlı piyasa fiyatlarıyla BTC'ye dönüştürün",
    "inLanguage": "tr",
    "step": [
      { "@type": "HowToStep", "name": "Pi Miktarını Girin", "text": "Dönüştürmek istediğiniz Pi coin miktarını girin" },
      { "@type": "HowToStep", "name": "Pi Fiyatını Doğrulayın", "text": "Pi fiyatını kontrol edin — CoinGecko'dan otomatik gelir veya borsanızın kurunu girin" },
      { "@type": "HowToStep", "name": "BTC Değerini Okuyun", "text": "Pi değerinizi Bitcoin, USD ve satoshi cinsinden anında görün" }
    ]
  };

  const webAppSchema = useLocalizedSchema(webAppSchemaEn, webAppSchemaTr);
  const howToSchema = useLocalizedSchema(howToSchemaEn, howToSchemaTr);

  const faqsEn = [
    { q: "How much is Pi coin worth in Bitcoin?", a: "The value of Pi coin in Bitcoin depends on the current market price of Pi Network (PI). Use the live calculator above to see the current Pi to BTC conversion rate. Pi prices vary between exchanges — always verify the rate on your specific platform before transacting." },
    { q: "How do I convert Pi to Bitcoin?", a: "To convert Pi to Bitcoin you need to sell your Pi on a cryptocurrency exchange that lists PI/BTC or PI/USDT trading pairs, then use the proceeds to buy Bitcoin. Alternatively, some OTC platforms facilitate direct Pi to Bitcoin swaps. The conversion rate is Pi Price ÷ Bitcoin Price. Use the calculator above to see how much BTC your Pi holdings are worth at current prices." },
    { q: "How many Pi coins equal 1 Bitcoin?", a: "The number of Pi coins equal to 1 Bitcoin equals the current Bitcoin price divided by the current Pi price. Since both prices change constantly, use the live calculator above for the current rate. As of early 2026, Pi coins trade at a fraction of Bitcoin's price — the exact ratio depends on live market prices." },
    { q: "Is Pi Network legitimate?", a: "Pi Network is a real cryptocurrency project that launched mainnet in 2022. Pi coins trade on several cryptocurrency exchanges including OKX, Bitget, and others. However, Pi has significantly lower market capitalisation and liquidity than Bitcoin. Always research current exchange listings and market conditions before making any financial decisions regarding Pi Network." },
  ];

  const faqsTr = [
    { q: "Pi coin Bitcoin cinsinden ne kadar eder?", a: "Pi coin'in Bitcoin cinsinden değeri, Pi Network (PI) güncel piyasa fiyatına bağlıdır. Güncel Pi'den BTC'ye dönüşüm kurunu görmek için yukarıdaki canlı hesaplayıcıyı kullanın. Pi fiyatları borsalar arasında farklılık gösterebilir — işlem yapmadan önce kendi platformunuzdaki kuru mutlaka doğrulayın." },
    { q: "Pi'yi Bitcoin'e nasıl dönüştürürüm?", a: "Pi'yi Bitcoin'e dönüştürmek için Pi'nizi PI/BTC veya PI/USDT işlem çifti listeleyen bir kripto borsasında satıp elde ettiğiniz tutarla Bitcoin almanız gerekir. Bazı OTC platformları doğrudan Pi-Bitcoin takası da sunar. Dönüşüm kuru: Pi Fiyatı ÷ Bitcoin Fiyatı. Pi varlığınızın güncel BTC karşılığını görmek için yukarıdaki hesaplayıcıyı kullanın." },
    { q: "Kaç Pi coin 1 Bitcoin'e eşittir?", a: "1 Bitcoin'e eşit Pi coin sayısı, güncel Bitcoin fiyatının güncel Pi fiyatına bölümüne eşittir. İki fiyat da sürekli değiştiği için güncel kur için yukarıdaki canlı hesaplayıcıyı kullanın. 2026 başı itibarıyla Pi coin, Bitcoin fiyatının çok küçük bir kısmından işlem görmektedir — kesin oran canlı piyasa fiyatlarına bağlıdır." },
    { q: "Pi Network güvenilir bir proje mi?", a: "Pi Network, 2022'de ana ağını başlatan gerçek bir kripto para projesidir. Pi coin OKX, Bitget gibi birkaç kripto borsasında işlem görmektedir. Ancak Pi'nin piyasa değeri ve likiditesi Bitcoin'e göre çok daha düşüktür. Pi Network ile ilgili finansal kararlar almadan önce mutlaka güncel borsa listelemelerini ve piyasa koşullarını araştırın." },
  ];

  const faqs = language === 'tr' ? faqsTr : faqsEn;

  const faqSchemaEn = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "inLanguage": "en",
    "mainEntity": faqsEn.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } }))
  };
  const faqSchemaTr = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "inLanguage": "tr",
    "mainEntity": faqsTr.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } }))
  };
  const faqSchema = useLocalizedSchema(faqSchemaEn, faqSchemaTr);

  return (
    <>
      <Helmet>
        <title>{t('pi.meta.title')}</title>
        <meta name="description" content={t('pi.meta.description')} />
        <link rel="canonical" href={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-pi-donusturucu':'https://bitcoincalculator.tools/calculators/pi-to-bitcoin'} />

        <link rel="alternate" hrefLang="tr" href="https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-pi-donusturucu" />
        <link rel="alternate" hrefLang="en" href="https://bitcoincalculator.tools/calculators/pi-to-bitcoin" />
        <link rel="alternate" hrefLang="x-default" href="https://bitcoincalculator.tools/calculators/pi-to-bitcoin" />
        <meta property="og:title" content={t('pi.meta.ogTitle')} />
        <meta property="og:description" content={t('pi.meta.ogDescription')} />
        <meta property="og:url" content={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-pi-donusturucu':'https://bitcoincalculator.tools/calculators/pi-to-bitcoin'} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="bitcoincalculator.tools" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('pi.meta.twitterTitle')} />
        <meta name="twitter:description" content={t('pi.meta.twitterDescription')} />
        <meta name="twitter:creator" content="@web3believers" />

        <meta name="twitter:site" content="@web3believers" />
        <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
        <HelmetOgImage slug="pi-to-bitcoin-calculator" enAlt={`Pi Coin to Bitcoin Calculator | bitcoincalculator.tools`} />

      <BreadcrumbSchema language={language} items={breadcrumbItems} />

      <PageBackground variant="clean">
        <Header />

        <main id="main-content" className="pt-20 relative z-10">
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb items={[
              { label: t('pi.crumb.calculators'), href: language==='tr'?'/tr/hesaplayicilar':'/calculators' },
              { label: t('pi.crumb.current') },
            ]} />
          </div>

          <section className="container mx-auto px-6 py-16 text-center">
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/10">
                <Coins className="w-4 h-4" />
                Pi Converter
              </div>
              <h1 className="text-h1 font-bold text-foreground">
                <>{t('pi.hero.titlePrefix')}<span className="text-gradient-premium">{t('pi.hero.titleMiddle')}</span>{t('pi.hero.titleSuffix')}</>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Convert your Pi Network coins to Bitcoin and USD at live market prices. See how much BTC your Pi holdings are worth.
              </p>
              <div className="max-w-sm mx-auto">
                <CompactLiveBitcoinPrice currency="USD" />
              </div>
            </div>
          </section>

          <section className="container mx-auto px-6 pb-20">
            <PageQuickAnswer
              en='This converter values a Pi Network balance in Bitcoin and fiat. Enter your Pi amount and it applies the current quoted Pi price and live BTC rate to show the equivalent BTC, satoshis and dollar value, alongside a plain note on how thin Pi liquidity currently is.'
              tr='Bu dönüştürücü bir Pi Network bakiyesini Bitcoin ve fiat cinsinden değerler. Pi miktarınızı girin; güncel Pi fiyatı ve canlı BTC kuru uygulanarak eşdeğer BTC, satoshi ve dolar değeri gösterilir; ayrıca Pi likiditesinin şu anda ne kadar sığ olduğuna dair açık bir not sunulur.'
            />
            <div className="max-w-6xl mx-auto space-y-8">
              <OfflineIndicator />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input */}
                <ErrorBoundary>
                  <Card className="glass-morphism-card border-border/20 shadow-sm">
                    <CardContent className="p-6 space-y-4">
                      <h2 className="text-lg font-semibold text-foreground">{t('pi.input.title')}</h2>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs text-muted-foreground">{t('pi.input.amount')}</Label>
                          <Input type="number" inputMode="decimal" value={piAmount || ''} onChange={e => setPiAmount(Number(e.target.value))} placeholder="1000" />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground flex items-center gap-1">
                            {t('pi.input.piPrice')}
                            {isPiPriceLive && <span className="text-success text-[10px]">● Live</span>}
                            {!isPiPriceLive && <span className="text-warning text-[10px]">● Manual</span>}
                          </Label>
                          <Input type="number" inputMode="decimal" value={manualPiPrice || ''} onChange={e => setManualPiPrice(Number(e.target.value))} step="0.01" />
                          {!isPiPriceLive && (
                            <p className="text-xs text-warning mt-1 flex items-center gap-1">
                              <Info className="w-3 h-3" /> {t('pi.input.piPriceHint')}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">{t('pi.input.btcPrice')}</Label>
                          <Input type="number" inputMode="decimal" value={btcPriceOverride || ''} onChange={e => setBtcPriceOverride(Number(e.target.value))} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </ErrorBoundary>

                {/* Results */}
                <ErrorBoundary>
                  <Card className="glass-morphism-card border-border/20 shadow-sm">
                    <CardContent className="p-6 space-y-4">
                      <h2 className="text-lg font-semibold text-foreground">{t('pi.results.title')}</h2>
                      {results ? (
                        <div className="space-y-3">
                          <div className="flex justify-between py-2 border-b border-border/30">
                            <span className="text-sm text-muted-foreground">{t('pi.results.usd')}</span>
                            <span className="text-sm font-semibold text-foreground">${results.usdValue.toLocaleString(intlLocale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-border/30">
                            <span className="text-sm text-muted-foreground">{t('pi.results.btc')}</span>
                            <span className="text-sm font-semibold text-foreground">{results.btcValue.toFixed(8)} BTC</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-border/30">
                            <span className="text-sm text-muted-foreground">{t('pi.results.sat')}</span>
                            <span className="text-sm font-semibold text-foreground">{Math.round(results.satsValue).toLocaleString(intlLocale)} sats</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-border/30">
                            <span className="text-sm text-muted-foreground">{t('pi.results.oneEqual')}</span>
                            <span className="text-sm font-semibold text-foreground">${results.unitUsd.toFixed(4)} USD</span>
                          </div>
                          <div className="flex justify-between py-2">
                            <span className="text-sm text-muted-foreground">{t('pi.results.oneEqual')}</span>
                            <span className="text-sm font-semibold text-foreground">{Math.round(results.unitSats).toLocaleString(intlLocale)} sats</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-8">{t('pi.results.empty')}</p>
                      )}
                    </CardContent>
                  </Card>
                </ErrorBoundary>
              </div>

              {/* Quick Reference Table */}
              {results && (
                <Card className="glass-morphism-card border-border/20 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">{t('pi.table.title')}</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border/30">
                            <th className="text-left py-2 text-muted-foreground font-medium">{t('pi.table.amount')}</th>
                            <th className="text-right py-2 text-muted-foreground font-medium">{t('pi.table.usd')}</th>
                            <th className="text-right py-2 text-muted-foreground font-medium">{t('pi.table.btc')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {referenceAmounts.map(amt => {
                            const usd = amt * piPrice;
                            const btc = usd / btcPrice;
                            return (
                              <tr key={amt} className="border-b border-border/20">
                                <td className="py-2 font-medium text-foreground">{amt.toLocaleString(intlLocale)} Pi</td>
                                <td className="py-2 text-right text-foreground">${usd.toLocaleString(intlLocale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className="py-2 text-right text-foreground">{btc.toFixed(6)} BTC</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Disclaimer */}
              <div className="p-4 bg-warning/$3 border border-warning/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning mt-0.5 shrink-0" />
                  <p className="text-sm text-warning leading-relaxed">
                    {t('pi.disclaimer.body')}
                  </p>
                </div>
              </div>

              {/* Internal link */}
              <p className="text-sm text-muted-foreground">
                <Link to="/calculators/bitcoin-converter" className="text-primary hover:underline">{t('pi.related.converter')}</Link>
              </p>
            </div>
          </section>

          {/* H2 Sections */}
          <section className="container mx-auto px-6 pb-12">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-h2 font-bold text-foreground mb-4">{t('pi.how.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('pi.how.body')}
              </p>
            </div>
          </section>

          <section className="container mx-auto px-6 pb-12">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-h2 font-bold text-foreground mb-4">{t('pi.what.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('pi.what.body')}
              </p>
            </div>
          </section>

          <PreFAQPlacement slug="pi-to-bitcoin" />

          {/* FAQ */}
          <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-6">
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/30 mb-4">
                    <HelpCircle className="w-4 h-4" />
                    FAQ
                  </div>
                  <h2 className="text-h2 font-bold text-foreground">{t('pi.faq.title')}</h2>
                  <p className="text-muted-foreground mt-2">{t('pi.faq.subtitle')}</p>
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
          <section className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <QuickShareLinkPanel slug="pi-to-bitcoin" headline={language === 'tr' ? "Pi'den Bitcoin'e Hesaplayıcı" : 'Pi to Bitcoin Calculator'} />
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
                      <h3 className="font-semibold text-foreground mb-2">{t('pi.dis.title')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('pi.dis.body')}
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

export default PiToBitcoinCalculator;
