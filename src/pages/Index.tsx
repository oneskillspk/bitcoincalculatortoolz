import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { ProfessionalHeroSection } from "@/components/ProfessionalHeroSection";
import { PremiumCalculatorCards } from "@/components/PremiumCalculatorCards";
import { LiveCalculationDemo } from "@/components/modern/LiveCalculationDemo";
import { Footer } from "@/components/Footer";
import { LazyBelowFoldContent } from "@/components/optimized/LazyBelowFoldContent";
import { EditorialStatement } from "@/components/cinematic/EditorialStatement";
import { EmberThread } from "@/components/motion/EmberThread";
import { PageLoadScan } from "@/components/motion/PageLoadScan";
import { HeroScrollTimeline } from "@/components/motion/HeroScrollTimeline";
import { SectionTransition } from "@/components/motion/SectionTransition";
import { SectionNavRail } from "@/components/motion/SectionNavRail";
import { PreFAQPlacement } from "@/components/placement/PreFAQPlacement";

import { useLanguage } from "@/contexts/LanguageContext";
import { LIVE_CALCULATOR_COUNT_DISPLAY } from "@/config/siteStats";

import { HelmetOgImage } from "@/components/seo/HelmetOgImage";
const Index = () => {
  const { language } = useLanguage();
  // Single source of truth for the calculator count surfaced in head + JSON-LD.
  // Mirrors src/config/siteStats.ts; audit-tool-count.mjs CI guards drift.
  const COUNT = LIVE_CALCULATOR_COUNT_DISPLAY; // "49+"

  const tr = language === 'tr';
  const titleEn = `Bitcoin Calculators — ${COUNT} Free Tools with Live BTC Prices`;
  const titleTr = `Bitcoin Hesaplayıcıları — ${COUNT} Ücretsiz Araç, Canlı BTC`;
  const descEn = `${COUNT} free Bitcoin calculators: DCA, retirement, profit, tax, power law and more. Live BTC prices, instant results. No signup, no fees — ever.`;
  const descTr = `${COUNT} ücretsiz Bitcoin hesaplayıcısı: DCA, emeklilik, kâr, vergi, güç yasası ve daha fazlası. Canlı BTC fiyatları, anlık sonuçlar. Kayıt yok, ücret yok.`;

  return (
    <>
      <Helmet>
        <title>{tr ? titleTr : titleEn}</title>
        <meta name="description" content={tr ? descTr : descEn} />
        <link rel="canonical" href={tr ? "https://bitcoincalculator.tools/tr/" : "https://bitcoincalculator.tools/"} />
        <link rel="alternate" hrefLang="en" href="https://bitcoincalculator.tools/" />
        <link rel="alternate" hrefLang="tr" href="https://bitcoincalculator.tools/tr/" />
        <link rel="alternate" hrefLang="x-default" href="https://bitcoincalculator.tools/" />

        {/* Open Graph */}
        <meta property="og:title" content={tr ? titleTr : titleEn} />
        <meta property="og:description" content={tr ? descTr : descEn} />
        <meta property="og:url" content={tr ? "https://bitcoincalculator.tools/tr/" : "https://bitcoincalculator.tools/"} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="bitcoincalculator.tools" />
        <meta property="og:locale" content={tr ? 'tr_TR' : 'en_US'} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={tr ? titleTr : titleEn} />
        <meta name="twitter:description" content={tr ? descTr : descEn} />
        <meta name="twitter:creator" content="@web3believers" />
        <meta name="twitter:site" content="@web3believers" />
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Bitcoin Calculator Tools",
              "url": "https://bitcoincalculator.tools",
              "description": "Free professional Bitcoin calculators for DCA, profit, retirement and investment analysis",
              "logo": {
                "@type": "ImageObject",
                "url": "https://bitcoincalculator.tools/bitcoin-logo.png",
                "width": 512,
                "height": 512
              },
              "sameAs": [
                "https://twitter.com/web3believers",
                "https://x.com/web3believers"
              ]
            },
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": "https://bitcoincalculator.tools/#website",
              "url": "https://bitcoincalculator.tools",
              "name": "Bitcoin Calculator Tools",
              "alternateName": ["bitcoincalculator.tools", "BTC Calculator Tools"],
              "description": `${COUNT} free Bitcoin calculators with live BTC prices — DCA, profit, retirement, tax, mining and more. No signup, no fees.`,
              "inLanguage": tr ? "tr" : "en-US",
              "publisher": {
                "@type": "Organization",
                "name": "Bitcoin Calculator Tools",
                "url": "https://bitcoincalculator.tools"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://bitcoincalculator.tools/calculators?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "inLanguage": tr ? "tr" : "en",
              "mainEntity": (tr ? [
                { q: "Hangi Bitcoin hesaplayıcıları ücretsiz olarak sunuluyor?", a: `Bitcoin Calculator Tools, DCA, kâr/zarar, ya olsaydı, emeklilik, yatırım, BTC-USD dönüştürücü, sermaye kazancı vergisi, HODL stratejisi, madencilik kârlılığı ve toplu yatırım vs DCA dahil ${COUNT} ücretsiz hesaplayıcı sunar. Tüm hesaplayıcılar kayıt gerekmeden tamamen ücretsizdir.` },
                { q: "En iyi ücretsiz Bitcoin hesaplayıcısı hangisidir?", a: "Hedefinize bağlıdır. Geçmiş bir yatırımın bugünkü değerini öğrenmek için Ya Olsaydı Hesaplayıcısı'nı, düzenli yatırım planlamak için DCA Hesaplayıcısı'nı, kâr/zarar için Kâr-Zarar Hesaplayıcısı'nı, uzun vadeli planlama için Emeklilik Hesaplayıcısı'nı kullanın. Hepsi ücretsizdir." },
                { q: "Bitcoin hesaplamaları ne kadar doğru?", a: "Tüm hesaplamalar CoinGecko API'sinden alınan ve 2013'e uzanan doğrulanmış tarihsel günlük kapanış fiyatlarını kullanır. Canlı hesaplamalar her 30 saniyede bir güncellenir." },
                { q: "Hesaplayıcıları kullanmak için hesap oluşturmam gerekir mi?", a: `Hayır. Hesap, kayıt veya ödeme asla gerekmez. ${COUNT} hesaplayıcının tamamı tamamen ücretsizdir; tüm hesaplamalar tarayıcınızda çalışır ve hiçbir kişisel veri toplanmaz.` },
                { q: "Bu sitedeki Bitcoin fiyat verisi gerçek zamanlı mı?", a: "Evet. Canlı Bitcoin fiyatı CoinGecko API verisiyle her 30 saniyede bir güncellenir. Tarihsel hesaplamalar 2013'e kadar uzanan doğrulanmış günlük fiyat kayıtlarını kullanır." }
              ] : [
                { q: "What Bitcoin calculators are available for free?", a: `Bitcoin Calculator Tools offers ${COUNT} free calculators including a Bitcoin DCA calculator, Bitcoin profit and loss calculator, Bitcoin what if calculator, Bitcoin retirement calculator, Bitcoin investment calculator, Bitcoin to USD converter, capital gains tax calculator, HODL strategy calculator, mining profitability calculator, and lump sum vs DCA comparison. Every calculator is completely free with no signup required.` },
                { q: "What is the best free Bitcoin calculator?", a: "The best Bitcoin calculator depends on your goal. For checking what a past investment would be worth today, use the What If Calculator. For planning a regular investing strategy, use the DCA Calculator. For calculating profit or loss on a trade, use the Profit and Loss Calculator. For long-term financial planning, try the Retirement Calculator. All are free with no account needed." },
                { q: "How accurate are the Bitcoin calculations?", a: "All calculations use verified historical Bitcoin daily closing price data sourced from CoinGecko API, covering every day since 2013. Live calculations use the current real-time BTC market price updated every 30 seconds." },
                { q: "Do I need to create an account to use these calculators?", a: `No account, registration, or payment is ever required. All ${COUNT} Bitcoin calculators are completely free with no signup. All calculations run in your browser and no personal data is ever collected or stored.` },
                { q: "Is the Bitcoin price data on this site real-time?", a: "Yes. The live Bitcoin price updates every 30 seconds using CoinGecko API data. Historical calculations use verified daily price records going back to 2013." }
              ]).map(({ q, a }) => ({ "@type": "Question", "name": q, "acceptedAnswer": { "@type": "Answer", "text": a } }))
            }
          ])}
        </script>
      </Helmet>
        <HelmetOgImage slug="index" enAlt={`Bitcoin Calculators — ${COUNT} Free Tools with Live BTC Prices | bitcoincalculator.tools`} />

      <div className="min-h-screen w-full bg-background">
        <PageLoadScan />
        <EmberThread />
        <Header />
        <SectionNavRail />

        <main id="main-content">
          <div id="hero">
            <ProfessionalHeroSection />
          </div>
          <div id="hero-timeline">
            <SectionTransition variant="fade" disabled>
              <HeroScrollTimeline />
            </SectionTransition>
          </div>
          <div id="live-demo">
            <SectionTransition variant="rise">
              <LiveCalculationDemo />
            </SectionTransition>
          </div>
          <div id="statement">
            <SectionTransition variant="rise">
              <EditorialStatement />
            </SectionTransition>
          </div>
          <div id="tools">
            <SectionTransition variant="curtain">
              <PremiumCalculatorCards />
            </SectionTransition>
          </div>
          <div id="comparison">
            <SectionTransition variant="fade">
              <LazyBelowFoldContent />
            </SectionTransition>
          </div>
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8" data-slot-d-collision>
            <div className="my-10 border-t border-border/60 pt-8 min-h-[160px]" role="complementary" aria-label="Sponsored partner">
              <PreFAQPlacement slug="home" lang={tr ? 'tr' : 'en'} disableSlotD />
            </div>
          </div>

        </main>


        <Footer />
      </div>
    </>
  );
};

export default Index;
