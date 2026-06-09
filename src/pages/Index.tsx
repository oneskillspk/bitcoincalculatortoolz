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
import { AffiliatePlacement } from "@/components/affiliateAI/AffiliatePlacement";

import { useLanguage } from "@/contexts/LanguageContext";

import { HelmetOgImage } from "@/components/seo/HelmetOgImage";
const Index = () => {
  const { language } = useLanguage();

  return (
    <>
      <Helmet>
        <title>Bitcoin Calculators — 45+ Free Tools with Live BTC Prices</title>
        <meta name="description" content="45+ free Bitcoin calculators: DCA, retirement, profit, tax, power law and more. Live BTC prices, instant results. No signup, no fees — ever." />
        <link rel="canonical" href="https://bitcoincalculator.tools/" />
        <link rel="alternate" hrefLang="en" href="https://bitcoincalculator.tools/" />
        <link rel="alternate" hrefLang="tr" href="https://bitcoincalculator.tools/tr/" />
        <link rel="alternate" hrefLang="x-default" href="https://bitcoincalculator.tools/" />

        {/* Open Graph */}
        <meta property="og:title" content="Bitcoin Calculators — 45+ Free Tools with Live BTC Prices" />
        <meta property="og:description" content="45+ free Bitcoin calculators: DCA, retirement, profit, tax, power law and more. Live BTC prices, instant results. No signup, no fees — ever." />
        <meta property="og:url" content="https://bitcoincalculator.tools/" />
        <meta property="og:type" content="website" />
        <HelmetOgImage slug="index" enAlt={`Bitcoin Calculators — 45+ Free Tools with Live BTC Prices | bitcoincalculator.tools`} />
        <meta property="og:site_name" content="bitcoincalculator.tools" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={language==='tr'?'Bitcoin Hesaplayıcıları — 45+ Ücretsiz Araç, Canlı BTC':'Bitcoin Calculators — 45+ Free Tools with Live BTC Prices'} />
        <meta name="twitter:description" content={language==='tr'?'45+ ücretsiz Bitcoin hesaplayıcısı, canlı BTC fiyatları ile. Kayıt yok, ücret yok — hiçbir zaman.':'45+ free Bitcoin calculators with live BTC prices. No signup, no fees — ever.'} />
        <meta name="twitter:creator" content="@web3believers" />

        <meta name="twitter:site" content="@web3believers" />
        <meta name="keywords" content="bitcoin calculator, btc calculator, bitcoin dca calculator, bitcoin profit calculator, bitcoin investment calculator, bitcoin retirement calculator, free bitcoin calculator, cryptocurrency calculator, bitcoin price calculator, bitcoin tools" />

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
              "description": "45+ free Bitcoin calculators with live BTC prices — DCA, profit, retirement, tax, mining and more. No signup, no fees.",
              "inLanguage": "en-US",
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
              "inLanguage": "en",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What Bitcoin calculators are available for free?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Bitcoin Calculator Tools offers 47 free calculators including a Bitcoin DCA calculator, Bitcoin profit and loss calculator, Bitcoin what if calculator, Bitcoin retirement calculator, Bitcoin investment calculator, Bitcoin to USD converter, capital gains tax calculator, HODL strategy calculator, mining profitability calculator, and lump sum vs DCA comparison. Every calculator is completely free with no signup required."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What is the best free Bitcoin calculator?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The best Bitcoin calculator depends on your goal. For checking what a past investment would be worth today, use the What If Calculator. For planning a regular investing strategy, use the DCA Calculator. For calculating profit or loss on a trade, use the Profit and Loss Calculator. For long-term financial planning, try the Retirement Calculator. All are free with no account needed."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How accurate are the Bitcoin calculations?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "All calculations use verified historical Bitcoin daily closing price data sourced from CoinGecko API, covering every day since 2013. Live calculations use the current real-time BTC market price updated every 30 seconds."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Do I need to create an account to use these calculators?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No account, registration, or payment is ever required. All 45+ Bitcoin calculators are completely free with no signup. All calculations run in your browser and no personal data is ever collected or stored."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is the Bitcoin price data on this site real-time?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. The live Bitcoin price updates every 30 seconds using CoinGecko API data. Historical calculations use verified daily price records going back to 2013."
                  }
                }
              ]
            }
          ])}
        </script>
      </Helmet>

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
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="my-10 border-t border-border/60 pt-8" role="complementary" aria-label="Sponsored partner">
              <AffiliatePlacement
                slug="home"
                lang="en"
                zone="inline"
                forceAffiliateId="ledger"
                forceFormat="image-banner"
              />
            </div>
          </div>

        </main>


        <Footer />
      </div>
    </>
  );
};

export default Index;
