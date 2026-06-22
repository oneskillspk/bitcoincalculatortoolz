import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { ProfessionalHeroSection } from "@/components/ProfessionalHeroSection";
import { PremiumCalculatorCards } from "@/components/PremiumCalculatorCards";
import { LiveCalculationDemo } from "@/components/modern/LiveCalculationDemo";
import { Footer } from "@/components/Footer";
import { AffiliatePlacement } from "@/components/affiliateAI/AffiliatePlacement";
import { LazyBelowFoldContent } from "@/components/optimized/LazyBelowFoldContent";
import { EditorialStatement } from "@/components/cinematic/EditorialStatement";
import { LIVE_CALCULATOR_COUNT_DISPLAY } from "@/config/siteStats";

const TurkishHome = () => {
  // Single source of truth for the calculator count (see src/config/siteStats.ts).
  // Drift is caught by scripts/audit-tool-count.mjs in CI.
  const COUNT = LIVE_CALCULATOR_COUNT_DISPLAY; // "49+"

  return (
    <>
      <Helmet>
        <html lang="tr" />
        <title>{`Bitcoin Hesaplayıcıları — ${COUNT} Ücretsiz Araç, Canlı BTC`}</title>
        <meta
          name="description"
          content={`${COUNT} ücretsiz Bitcoin hesaplayıcısı: DCA, emeklilik, kâr/zarar, vergi, güç yasası ve daha fazlası. Canlı BTC fiyatları, anlık sonuçlar. Kayıt yok, ücret yok — asla.`}
        />
        <link rel="canonical" href="https://bitcoincalculator.tools/tr/" />

        {/* Bidirectional hreflang */}
        <link rel="alternate" hrefLang="en" href="https://bitcoincalculator.tools/" />
        <link rel="alternate" hrefLang="tr" href="https://bitcoincalculator.tools/tr/" />
        <link rel="alternate" hrefLang="x-default" href="https://bitcoincalculator.tools/" />

        {/* Open Graph — Turkish locale */}
        <meta property="og:locale" content="tr_TR" />
        <meta property="og:title" content={`Bitcoin Hesaplayıcıları — ${COUNT} Ücretsiz Araç, Canlı BTC`} />
        <meta
          property="og:description"
          content={`${COUNT} ücretsiz Bitcoin hesaplayıcısı: DCA, emeklilik, kâr/zarar, vergi ve daha fazlası. Canlı BTC fiyatları, anlık sonuçlar. Kayıt yok, ücret yok.`}
        />
        <meta property="og:url" content="https://bitcoincalculator.tools/tr/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://bitcoincalculator.tools/bitcoin-kar-hesaplayici-og.webp" />
        <meta
          property="og:image:alt"
          content={`Bitcoin Hesaplayıcıları — ${COUNT} Ücretsiz Araç | bitcoincalculator.tools`}
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="bitcoincalculator.tools" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Bitcoin Hesaplayıcıları — ${COUNT} Ücretsiz Araç, Canlı BTC`} />
        <meta
          name="twitter:description"
          content={`${COUNT} ücretsiz Bitcoin hesaplayıcısı, canlı BTC fiyatlarıyla. Kayıt yok, ücret yok — asla.`}
        />
        <meta name="twitter:image" content="https://bitcoincalculator.tools/bitcoin-kar-hesaplayici-og.webp" />
        <meta name="twitter:creator" content="@web3believers" />
        <meta name="twitter:site" content="@web3believers" />

        {/* Structured Data — Turkish */}
        <script type="application/ld+json">
          {JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Bitcoin Calculator Tools",
              "url": "https://bitcoincalculator.tools",
              "description": `Türkiye'nin en kapsamlı ücretsiz Bitcoin hesaplayıcı platformu. ${COUNT} araç.`,
              "areaServed": "TR",
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
              "@id": "https://bitcoincalculator.tools/tr/#website",
              "url": "https://bitcoincalculator.tools/tr/",
              "name": "Bitcoin Hesaplayıcı Araçları",
              "alternateName": ["bitcoincalculator.tools", "BTC Hesaplayıcı Araçları"],
              "description": `${COUNT} ücretsiz Bitcoin hesaplayıcısı, canlı BTC fiyatlarıyla — DCA, kâr/zarar, emeklilik, vergi, madencilik ve daha fazlası. Kayıt yok, ücret yok.`,
              "inLanguage": "tr",
              "publisher": {
                "@type": "Organization",
                "name": "Bitcoin Calculator Tools",
                "url": "https://bitcoincalculator.tools"
              }
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "inLanguage": "tr",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Hangi Bitcoin hesaplayıcıları ücretsiz kullanılabilir?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `Bitcoin Calculator Tools; Bitcoin DCA hesaplayıcısı, kâr/zarar hesaplayıcısı, ya olsaydı hesaplayıcısı, emeklilik hesaplayıcısı, yatırım hesaplayıcısı, Bitcoin/TRY dönüştürücü, sermaye kazancı vergi hesaplayıcısı, HODL strateji hesaplayıcısı, madencilik kârlılık hesaplayıcısı ve toplu tutar vs. DCA karşılaştırması dahil ${COUNT} ücretsiz hesaplayıcı sunar. Her hesaplayıcı kayıt gerektirmeksizin tamamen ücretsizdir.`
                  }
                },
                {
                  "@type": "Question",
                  "name": "En iyi ücretsiz Bitcoin hesaplayıcısı hangisi?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "En iyi Bitcoin hesaplayıcısı hedefinize bağlıdır. Geçmişteki bir yatırımın bugün ne değerde olacağını görmek için Ya Olsaydı Hesaplayıcısı'nı kullanın. Düzenli yatırım stratejisi planlamak için DCA Hesaplayıcısı'nı deneyin. Bir işlemdeki kâr veya zararı hesaplamak için Kâr ve Zarar Hesaplayıcısı'nı kullanın. Uzun vadeli finansal planlama için Emeklilik Hesaplayıcısı'nı deneyin. Tümü hesap gerektirmeksizin ücretsizdir."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Bitcoin hesaplamaları ne kadar doğru?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Tüm hesaplamalar, 2013'ten bu yana her günü kapsayan CoinGecko API'sinden alınan doğrulanmış tarihsel Bitcoin günlük kapanış fiyat verilerini kullanır. Canlı hesaplamalar, her 30 saniyede bir güncellenen gerçek zamanlı BTC piyasa fiyatını kullanır."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Bu hesaplayıcıları kullanmak için hesap açmam gerekiyor mu?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `Hayır, asla hesap, kayıt veya ödeme gerekmez. ${COUNT} Bitcoin hesaplayıcısının tamamı kayıtsız ücretsizdir. Tüm hesaplamalar tarayıcınızda çalışır ve hiçbir kişisel veri toplanmaz veya saklanmaz.`
                  }
                },
                {
                  "@type": "Question",
                  "name": "Bu sitedeki Bitcoin fiyat verileri gerçek zamanlı mı?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Evet. Canlı Bitcoin fiyatı, CoinGecko API verileri kullanılarak her 30 saniyede bir güncellenir. Tarihsel hesaplamalar, 2013'e kadar uzanan doğrulanmış günlük fiyat kayıtlarını kullanır."
                  }
                }
              ]
            }
          ])}
        </script>
      </Helmet>

      <div className="min-h-screen w-full bg-background">
        <Header />

        <main id="main-content">
          <ProfessionalHeroSection />
          <EditorialStatement />
          <PremiumCalculatorCards />
          <LiveCalculationDemo />
          <LazyBelowFoldContent />
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="my-10 border-t border-border/60 pt-8" role="complementary" aria-label="Sponsorlu ortak">
              <AffiliatePlacement
                slug="home"
                lang="tr"
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

export default TurkishHome;
