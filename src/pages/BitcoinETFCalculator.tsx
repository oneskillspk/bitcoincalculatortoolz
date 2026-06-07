import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { PageBackground } from "@/components/modern/PageBackground";
import { ETFInputPanel } from "@/components/etf/ETFInputPanel";
import { ETFResultsPanel } from "@/components/etf/ETFResultsPanel";
import { ETFComparisonTable } from "@/components/etf/ETFComparisonTable";
import { ETFFAQSection } from "@/components/etf/ETFFAQSection";
import { ETFContentSections } from "@/components/etf/ETFContentSections";
import { AffiliatePlacement } from "@/components/affiliateAI/AffiliatePlacement";
import { ExportReportButton } from "@/components/ExportReportButton";
import { CompactLiveBitcoinPrice } from "@/components/CompactLiveBitcoinPrice";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import RelatedCalculators from "@/components/RelatedCalculators";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { bitcoinApi } from "@/services/bitcoinApi";
import { BitcoinETF, ETFCalculationResult, calculateETFReturns, compareAllETFs } from "@/services/etfData";
import { AlertTriangle, BarChart3, Calculator, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ETFSharesToBTCPanel } from "@/components/etf/ETFSharesToBTCPanel";
import { useLanguage } from "@/contexts/LanguageContext";

const BitcoinETFCalculator = () => {
  const { language, t } = useLanguage();
  const [result, setResult] = useState<ETFCalculationResult | null>(null);
  const [allResults, setAllResults] = useState<ETFCalculationResult[]>([]);

  const { data: currentPrice } = useQuery({
    queryKey: ['current-btc-price', 'USD'],
    queryFn: () => bitcoinApi.getCurrentPrice('USD'),
    refetchInterval: 30000,
    retry: 2,
  });

  const handleCalculate = useCallback((params: {
    investmentAmount: number;
    selectedETF: BitcoinETF;
    holdingPeriodYears: number;
    expectedReturn: number;
  }) => {
    const price = currentPrice || 100000;
    const mainResult = calculateETFReturns(
      params.investmentAmount,
      params.selectedETF,
      params.holdingPeriodYears,
      price,
      params.expectedReturn
    );
    setResult(mainResult);
    setAllResults(compareAllETFs(
      params.investmentAmount,
      params.holdingPeriodYears,
      price,
      params.expectedReturn
    ));
  }, [currentPrice]);

  return (
    <>
<Helmet>
  {/* Primary Meta Tags */}
  <title>{language==='tr'?'Bitcoin ETF Hesaplayıcısı':'Bitcoin ETF Calculator'}</title>
  <meta name="description" content={language==='tr'?'Her Bitcoin ETF\'ini karşılaştırın — IBIT, FBTC, ARKB ve daha fazlası. Yönetim ücreti etkisini ve ETF ile gerçek BTC sahibi olmanın farkını görün.':'Compare every Bitcoin ETF — IBIT, FBTC, ARKB and more. See expense ratio drag over time and whether owning the ETF or actual BTC makes more sense for you.'} />
  <meta name="keywords" content="bitcoin ETF calculator, IBIT calculator, bitcoin ETF returns, crypto ETF cost, bitcoin ETF comparison, spot bitcoin ETF, bitcoin ETF expense ratio, FBTC calculator, ARKB calculator" />
  <link rel="canonical" href={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-etf-hesaplayicisi':'https://bitcoincalculator.tools/calculators/etf'} />

  <link rel="alternate" hrefLang="tr" href="https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-etf-hesaplayicisi" />
  <link rel="alternate" hrefLang="en" href="https://bitcoincalculator.tools/calculators/etf" />
  <link rel="alternate" hrefLang="x-default" href="https://bitcoincalculator.tools/calculators/etf" />
  {/* Open Graph Meta Tags */}
  <meta property="og:title" content={language==='tr'?'Bitcoin ETF Hesaplayıcısı':'Bitcoin ETF Calculator'} />
  <meta property="og:description" content={language==='tr'?'Her Bitcoin ETF\'ini karşılaştırın — IBIT, FBTC, ARKB ve daha fazlası. Yönetim ücreti etkisi ve ETF ile gerçek BTC farkını görün.':'Compare every Bitcoin ETF — IBIT, FBTC, ARKB and more. See expense ratio drag over time and whether owning the ETF or actual BTC makes more sense for you.'} />
  <meta property="og:url" content={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-etf-hesaplayicisi':'https://bitcoincalculator.tools/calculators/etf'} />
  <meta property="og:type" content="website" />
  <meta property="og:image" content={(typeof window !== 'undefined' && window.location.pathname.startsWith('/tr')) ? 'https://bitcoincalculator.tools/bitcoin-kar-hesaplayici-og.webp' : 'https://bitcoincalculator.tools/social-preview.webp'} />
  <meta property="og:image:alt" content={(typeof window !== 'undefined' && window.location.pathname.startsWith('/tr')) ? 'Bitcoin Hesaplayıcıları — 45+ Ücretsiz Araç | bitcoincalculator.tools' : 'Bitcoin ETF Calculator | bitcoincalculator.tools'} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="bitcoincalculator.tools" />

  {/* Twitter Card Meta Tags */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={language==='tr'?'Bitcoin ETF Hesaplayıcısı':'Bitcoin ETF Calculator'} />
  <meta name="twitter:description" content={language==='tr'?'Bitcoin ETF\'lerini karşılaştırın — IBIT, FBTC, ARKB ve daha fazlası. ETF mi yoksa doğrudan BTC mi daha mantıklı?':'Compare Bitcoin ETFs — IBIT, FBTC, ARKB and more. ETF vs direct BTC — which makes more sense?'} />
  <meta name="twitter:image" content={(typeof window !== 'undefined' && window.location.pathname.startsWith('/tr')) ? 'https://bitcoincalculator.tools/bitcoin-kar-hesaplayici-og.webp' : 'https://bitcoincalculator.tools/social-preview.webp'} />
  <meta name="twitter:creator" content="@web3believers" />

        <meta name="twitter:site" content="@web3believers" />
        {/* JSON-LD WebApplication */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Bitcoin ETF Calculator",
            "description": "Compare every Bitcoin ETF — IBIT, FBTC, ARKB and more. See expense ratio drag over time and whether owning the ETF or actual BTC makes more sense for you.",
            "url": "https://bitcoincalculator.tools/calculators/etf",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Any",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
            "featureList": [
              "Compare IBIT, FBTC, ARKB, BITB, GBTC and BTC Mini Trust",
              "Fee-drag projection over 1, 5, and 10 year horizons",
              "ETF vs spot Bitcoin delta tracker",
              "Shares-to-BTC conversion calculator",
              "Custodian and AUM context per fund",
              "Tax-advantaged account guidance (IRA/401k)"
            ],
            "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools" },
            "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" }
          })}
        </script>

        {/* HowTo JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Calculate Bitcoin ETF Returns and Fee Impact",
            "description": "Step-by-step guide to compare Bitcoin ETF costs and project investment returns",
            "totalTime": "PT2M",
            "step": [
              { "@type": "HowToStep", "name": "Enter Investment Amount", "text": "Input how much USD you plan to invest in a Bitcoin ETF", "url": "https://bitcoincalculator.tools/calculators/etf#step1" },
              { "@type": "HowToStep", "name": "Select ETF", "text": "Choose from IBIT, FBTC, ARKB, BITB, and other spot Bitcoin ETFs", "url": "https://bitcoincalculator.tools/calculators/etf#step2" },
              { "@type": "HowToStep", "name": "Set Holding Period", "text": "Choose how many years you plan to hold the ETF (1-20 years)", "url": "https://bitcoincalculator.tools/calculators/etf#step3" },
              { "@type": "HowToStep", "name": "Compare Results", "text": "View projected returns, total fees paid, and compare all ETFs side-by-side against direct BTC ownership", "url": "https://bitcoincalculator.tools/calculators/etf#step4" }
            ]
          })}
        </script>

        {/* FAQ JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "inLanguage": language === 'tr' ? 'tr' : 'en',
            "mainEntity": (language === 'tr' ? [
              { q: "Bitcoin ETF nedir?", a: "Bitcoin ETF (Borsada İşlem Gören Fon), Bitcoin fiyatını takip eden, düzenlemeye tabi bir yatırım aracıdır. Yatırımcıların doğrudan kripto satın alıp saklamadan, geleneksel aracı kurum hesabı üzerinden Bitcoin'e maruz kalmasını sağlar." },
              { q: "Gider oranı nedir ve getirimi nasıl etkiler?", a: "Gider oranı, ETF sağlayıcısının yatırımınızın yüzdesi olarak aldığı yıllık ücrettir. Örneğin IBIT yıllık %0,25 alır. Küçük gibi görünse de bu ücret zamanla bileşik etki yaratır — 10 yıl tutulan 10.000 USD'lik yatırımda yüzlerce dolarlık getiri kaybına yol açabilir." },
              { q: "En düşük ücretli Bitcoin ETF hangisi?", a: "2026 itibarıyla Grayscale Bitcoin Mini Trust (BTC) %0,15 ve Bitwise BITB %0,20 ile başlıca spot Bitcoin ETF'leri arasında en düşük gider oranlarına sahip. Her ikisi de eski Grayscale GBTC'nin %1,50'sine kıyasla çok daha ucuzdur." },
              { q: "Bitcoin ETF satın almak Bitcoin'e sahip olmakla aynı mı?", a: "Hayır. Bitcoin ETF aldığınızda, Bitcoin tutan bir fonun hisselerine sahip olursunuz — doğrudan Bitcoin'e sahip olmazsınız. Bu, dayanak BTC'yi gönderemeyeceğiniz, alamayacağınız veya kendi cüzdanınızda saklayamayacağınız anlamına gelir. Ayrıca doğrudan Bitcoin sahiplerinin ödemediği yönetim ücretleri ödersiniz." },
              { q: "Bitcoin ETF mi yoksa doğrudan Bitcoin mi almalıyım?", a: "Önceliklerinize bağlı. ETF'ler kolaylık, düzenleyici güvence ve vergi avantajlı hesap (IRA/401k) imkânı sunar. Doğrudan Bitcoin sahipliği size öz-saklama, sürekli ücret olmaması ve gerçek mülkiyet sağlar. Bu hesaplayıcı iki yaklaşım arasındaki maliyet farkını karşılaştırmanıza yardımcı olur." },
              { q: "2026'da en ucuz Bitcoin ETF hangisi?", a: "Grayscale Bitcoin Mini Trust (sembol: BTC) yıllık %0,15 ile en ucuzudur. Bitwise BITB %0,20 ile ikinci, ardından ARKB %0,21 gelir. IBIT ve FBTC %0,25 alır. Eski GBTC ise %1,50 ile en pahalı olmaya devam ediyor — en ucuz rakibinin yaklaşık 10 katı." },
              { q: "IBIT mi FBTC mi daha iyi?", a: "Hem IBIT (BlackRock) hem FBTC (Fidelity) aynı %0,25 gider oranını uygular ve gerçek Bitcoin'i soğuk depolamada tutar. İşlevsel fark marka ve saklama kuruluşudur: IBIT Coinbase Custody, FBTC Fidelity Digital Assets kullanır. IBIT daha yüksek varlık büyüklüğü ve daha dar alış-satış marjına sahiptir, ancak uzun vadeli tutuş için ikisi büyük ölçüde birbirinin yerine geçebilir." },
              { q: "Bitcoin ETF ücretleri 10 yılda ne kadar tutar?", a: "BTC'nin yıllık ortalama %25 getiri sağladığı varsayımıyla 10.000 USD'lik yatırımda %0,25 gider oranı (IBIT/FBTC) 10 yılda yaklaşık 2.316 USD'ye mal olur. %0,15'lik Bitcoin Mini Trust aynı dönemde 1.395 USD tutar. %1,50'lik Grayscale GBTC ise yaklaşık 13.200 USD eritir — en ucuz seçeneklerin 5 katından fazla." },
              { q: "Bitcoin ETF'yi IRA veya 401k hesabımda tutabilir miyim?", a: "Evet. Spot Bitcoin ETF'ler, ETF'ye izin veren her standart aracı kurum IRA, Roth IRA veya 401k hesabında tutulabilir. Bu, ETF'lerin doğrudan Bitcoin'e göre en büyük avantajlarından biridir: Roth IRA içinde elde edilen kazançlar tamamen vergisiz büyür." },
              { q: "BlackRock veya Fidelity iflas ederse ETF hisselerime ne olur?", a: "ETF'nin tuttuğu Bitcoin, üçüncü taraf bir saklama kuruluşunda (Coinbase Custody veya Fidelity Digital Assets) ayrıştırılmıştır ve hukuki olarak ihraççıya değil hissedarlara aittir. BlackRock veya Fidelity iflas etse bile dayanak BTC yeni bir fon yöneticisine devredilir." },
              { q: "Bir IBIT hissesi ne kadar Bitcoin'i temsil eder?", a: "BlackRock IBIT'in her hissesi Mart 2026 itibarıyla yaklaşık 0,00095 BTC'yi temsil eder. Bu oran, yıllık %0,25 yönetim ücreti fonun Bitcoin varlıklarından düşüldüğü için zamanla hafifçe azalır. Güncel oranı bulmak için fonun toplam Bitcoin varlığını, BlackRock'un her gün açıkladığı toplam hisse sayısına bölün." },
              { q: "IBIT'e sahip olmak ile doğrudan Bitcoin'e sahip olmak arasındaki fark nedir?", a: "IBIT sahipleri, düzenlemeye tabi bir fon yapısı aracılığıyla Bitcoin'e dolaylı maruz kalır. Doğrudan Bitcoin sahipliği size tam saklama ve sıfır yönetim ücreti sağlar, ancak cüzdan ve özel anahtar yönetimi gerektirir. IBIT yıllık %0,25 alır, standart aracı kurum hesapları üzerinden işlem görür ve saklama sorumluluğu doğurmaz. Doğrudan Bitcoin sahipliğinde sürekli ücret yoktur ve bir saklayıcı tarafından dondurulamaz." }
            ] : [
              { q: "What is a Bitcoin ETF?", a: "A Bitcoin ETF (Exchange-Traded Fund) is a regulated investment vehicle that tracks the price of Bitcoin. It allows investors to gain Bitcoin exposure through a traditional brokerage account without directly buying, storing, or securing cryptocurrency." },
              { q: "What is an expense ratio and how does it affect my returns?", a: "An expense ratio is the annual fee charged by the ETF provider, expressed as a percentage of your investment. For example, IBIT charges 0.25% per year. While this seems small, the fee compounds over time — on a $10,000 investment held for 10 years, it can cost hundreds of dollars in lost returns." },
              { q: "Which Bitcoin ETF has the lowest fees?", a: "As of 2026, Grayscale's Bitcoin Mini Trust (BTC) at 0.15% and Bitwise's BITB at 0.20% have the lowest expense ratios among major spot Bitcoin ETFs. Both are significantly cheaper than the legacy Grayscale GBTC at 1.50%." },
              { q: "Is buying a Bitcoin ETF the same as owning Bitcoin?", a: "No. When you buy a Bitcoin ETF, you own shares of a fund that holds Bitcoin — you do not directly own Bitcoin. This means you cannot send, receive, or self-custody the underlying BTC. You also pay ongoing management fees that direct Bitcoin holders do not." },
              { q: "Should I buy a Bitcoin ETF or buy Bitcoin directly?", a: "It depends on your priorities. ETFs offer convenience, regulatory protections, and tax-advantaged accounts (IRA/401k). Direct Bitcoin ownership gives you self-custody, no ongoing fees, and true ownership. This calculator helps you compare the cost difference between both approaches." },
              { q: "What is the cheapest Bitcoin ETF in 2026?", a: "Grayscale's Bitcoin Mini Trust (ticker: BTC) is the cheapest at 0.15% annually. BITB from Bitwise is second at 0.20%, followed by ARKB at 0.21%. IBIT and FBTC both charge 0.25%. The legacy GBTC remains the most expensive at 1.50%, roughly 10x the cheapest competitor." },
              { q: "Is IBIT or FBTC better?", a: "Both IBIT (BlackRock) and FBTC (Fidelity) charge identical 0.25% expense ratios and hold real Bitcoin in cold storage. The functional difference is brand and custodian: IBIT uses Coinbase Custody, FBTC uses Fidelity Digital Assets. IBIT has higher AUM and tighter bid-ask spreads, but for a long-term hold the two are essentially interchangeable." },
              { q: "How much do Bitcoin ETF fees cost over 10 years?", a: "On a $10,000 investment with BTC averaging 25% annual returns, a 0.25% expense ratio (IBIT/FBTC) costs about $2,316 over 10 years. The 0.15% Bitcoin Mini Trust costs $1,395 over the same period. Grayscale's 1.50% GBTC bleeds roughly $13,200 — over 5x more than the cheapest options." },
              { q: "Can I hold a Bitcoin ETF in my IRA or 401k?", a: "Yes. Spot Bitcoin ETFs can be held in any standard brokerage IRA, Roth IRA, or 401k that allows ETFs. This is one of the biggest advantages of ETFs over direct Bitcoin: gains inside a Roth IRA grow completely tax-free." },
              { q: "What happens to my ETF shares if BlackRock or Fidelity goes bankrupt?", a: "The Bitcoin held by the ETF is segregated at a third-party custodian (Coinbase Custody or Fidelity Digital Assets) and legally belongs to shareholders, not the issuer. If BlackRock or Fidelity went bankrupt, the underlying BTC would be transferred to a new fund manager." },
              { q: "How much Bitcoin does one IBIT share represent?", a: "Each BlackRock IBIT share represents approximately 0.00095 BTC as of March 2026. This ratio decreases slightly over time as the 0.25% annual management fee is deducted from the fund's Bitcoin holdings. To find the exact current ratio, divide the fund's total Bitcoin holdings by the total shares outstanding, which is reported daily by BlackRock." },
              { q: "What is the difference between owning IBIT and owning Bitcoin directly?", a: "IBIT holders have indirect exposure to Bitcoin through a regulated fund structure. Direct Bitcoin ownership gives you full custody and no management fees, but requires a wallet and private key management. IBIT charges 0.25% annually, trades through standard brokerage accounts, and involves no custody responsibility. Direct Bitcoin ownership has no ongoing fees and cannot be frozen by a custodian." }
            ]).map(({q,a}) => ({ "@type": "Question", "name": q, "acceptedAnswer": { "@type": "Answer", "text": a } }))
          })}
        </script>

      </Helmet>

      <BreadcrumbSchema language={language} 
        items={[
          { name: "Home", url: "https://bitcoincalculator.tools/" },
          { name: "Calculators", url: "https://bitcoincalculator.tools/calculators" },
          { name: "ETF Calculator", url: "https://bitcoincalculator.tools/calculators/etf" }
        ]}
      />

      <PageBackground variant="clean">
        <Header />
        
        <main id="main-content" className="pt-20 relative z-10">
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb 
              items={[
                { label: language==='tr'?'Hesaplayıcılar':'Calculators', href: language==='tr'?'/tr/hesaplayicilar':'/calculators' },
                { label: language==='tr'?'ETF Hesaplayıcısı':'ETF Calculator' }
              ]} 
            />
          </div>

          {/* Header */}
          <section className="container mx-auto px-6 py-16 text-center">
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/10">
                <BarChart3 className="w-4 h-4" />
                {language==='tr'?'ETF Maliyet ve Getiri Hesaplayıcısı':'ETF Cost & Returns Calculator'}
              </div>
              
              <h1 className="text-h1 font-bold text-foreground">
                {language==='tr'?<>Bitcoin <span className="text-gradient-premium">ETF Hesaplayıcısı</span></>:<>Bitcoin <span className="text-gradient-premium">ETF Calculator</span></>}
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {language==='tr'?'IBIT, FBTC, ARKB ve tüm spot Bitcoin ETF\'lerini karşılaştırın. Gider oranı etkisini hesaplayın ve ETF ücretlerinin doğrudan BTC sahipliğine kıyasla getirinizi nasıl aşındırdığını görün.':'Compare IBIT, FBTC, ARKB, and all spot Bitcoin ETFs. Calculate expense ratio impact and see how ETF fees erode your returns vs direct BTC ownership.'}
              </p>

              <div className="max-w-sm mx-auto">
                <CompactLiveBitcoinPrice currency="USD" />
              </div>
            </div>
          </section>

          {/* Calculator */}
          <section className="container mx-auto px-6 pb-20">
            <div className="max-w-6xl mx-auto space-y-12">
              <OfflineIndicator />

              <Tabs defaultValue="returns" className="w-full">
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
                  <TabsTrigger value="returns">{language==='tr'?'ETF Getirileri':'ETF Returns'}</TabsTrigger>
                  <TabsTrigger value="shares-btc">{language==='tr'?'Hisse → BTC':'Shares → BTC'}</TabsTrigger>
                </TabsList>

                <TabsContent value="returns">
                  <div className="space-y-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <ETFInputPanel onCalculate={handleCalculate} />
                      </div>
                      <div>
                        <ErrorBoundary>
                          {result ? (
                            <ETFResultsPanel result={result} />
                          ) : (
                            <Card className="glass-morphism-card border-border/20 shadow-sm">
                              <CardContent className="p-8 text-center">
                                <div className="space-y-4">
                                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                                    <Calculator className="w-6 h-6 text-primary" />
                                  </div>
                                  <div className="space-y-1">
                                    <h3 className="text-lg font-semibold text-foreground">{language==='tr'?'ETF\'leri Karşılaştırmaya Hazır':'Ready to Compare ETFs'}</h3>
                                    <p className="text-sm text-muted-foreground">{language==='tr'?'Parametrelerinizi ayarlayın ve hesapla\'ya tıklayın':'Set your parameters and click calculate'}</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </ErrorBoundary>
                      </div>
                    </div>

                    {/* Comparison Table */}
                    {allResults.length > 0 && (
                      <div className="animate-fade-in space-y-8">
                        <ETFComparisonTable results={allResults} />

                        <ExportReportButton 
                          result={{
                            investmentAmount: result!.investmentAmount,
                            currentValue: result!.valueAfterFees,
                            profitLoss: result!.valueAfterFees - result!.investmentAmount,
                            roiPercentage: ((result!.valueAfterFees - result!.investmentAmount) / result!.investmentAmount) * 100,
                            currency: 'USD',
                            startDate: new Date().toISOString(),
                            startPrice: result!.btcPrice,
                            currentPrice: result!.btcPrice,
                            btcAmount: result!.btcExposure,
                            priceData: []
                          }}
                        />
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="shares-btc">
                  <ETFSharesToBTCPanel currentBtcPrice={currentPrice || 100000} />
                </TabsContent>
              </Tabs>
            </div>
          </section>

          {/* SEO H2 Section */}
          <section className="container mx-auto px-6 pb-12">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-h2 font-bold text-foreground mb-4">
                {language==='tr'?'IBIT\'den Bitcoin Hesaplayıcısı — Hisseleriniz Ne Kadar BTC Temsil Ediyor?':'IBIT to Bitcoin Calculator — How Much BTC Do Your Shares Represent?'}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {language==='tr'?'Bitcoin ETF yatırımcıları genellikle hisselerinin ne kadar gerçek Bitcoin temsil ettiğini merak eder. Bu IBIT\'ten Bitcoin\'e hesaplayıcısı, ETF hisse sayınızı yaklaşık BTC eşdeğerine dönüştürür. BlackRock\'un IBIT\'i, Fidelity\'nin FBTC\'si ve diğer Bitcoin ETF\'leri hissedarlar adına fiziksel Bitcoin tutar — her hisse, birikmiş yönetim ücretleri düşüldükten sonra bir Bitcoin\'in bir kesirine karşılık gelir.':'Bitcoin ETF investors often want to know how much actual Bitcoin their shares represent. This IBIT to Bitcoin calculator converts your ETF share count into approximate BTC equivalent. BlackRock\'s IBIT, Fidelity\'s FBTC, and other Bitcoin ETFs hold physical Bitcoin on behalf of shareholders — each share represents a fraction of one Bitcoin minus accumulated management fees.'}
              </p>
            </div>
          </section>

          <div className="container mx-auto px-6 pb-6 max-w-5xl"><AffiliatePlacement slug="etf" lang="en" resultSignals={["brokerage", "etf"]} /></div>
          <ETFContentSections />
          <ETFFAQSection />
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
                        {language==='tr'?'Bu ETF hesaplayıcısı yalnızca eğitim amaçlıdır. Gider oranları ve ETF verileri değişebilir. Geçmiş performans gelecekteki sonuçları garanti etmez. Bu finansal tavsiye değildir — yatırım yapmadan önce her zaman bir finansal danışmana başvurun.':'This ETF calculator is for educational purposes only. Expense ratios and ETF data may change. Past performance does not guarantee future results. This is not financial advice — always consult a financial advisor before investing.'}
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

export default BitcoinETFCalculator;
