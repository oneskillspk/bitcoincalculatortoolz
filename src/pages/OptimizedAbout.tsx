import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { PageBackground } from "@/components/modern/PageBackground";
import { useLanguage } from "@/contexts/LanguageContext";
import { AboutHeroSection } from "@/components/about/AboutHeroSection";
import { AboutMissionSection } from "@/components/about/AboutMissionSection";
import { AboutTeamSection } from "@/components/about/AboutTeamSection";
import { AboutWhyTrustSection } from "@/components/about/AboutWhyTrustSection";
import { AboutTimelineSection } from "@/components/about/AboutTimelineSection";
import { AboutMethodologySection } from "@/components/about/AboutMethodologySection";
import { AboutFAQSection } from "@/components/about/AboutFAQSection";

const About = () => {
  const { t, language } = useLanguage();
  const tr = language === 'tr';

  return (
    <>
      <Helmet>
        <title>{tr ? 'Bitcoin Hesaplayıcı Araçları Hakkında | 2010\'dan Beri Bitcoin Yatırımcıları' : 'About Bitcoin Calculator Tools | Built by Bitcoin Investors'}</title>
        <meta
          name="description"
          content={tr ? '2010\'dan beri Bitcoin yatırımcısı Web3Believer tarafından inşa edildi. Profesyonel düzeyde, ücretsiz, şeffaf ve herkese açık Bitcoin araçları.' : 'Built by Web3Believer, a Bitcoin investor since 2010. Professional-grade Bitcoin tools that are free, transparent, and open to all.'}
        />
        <link rel="canonical" href={tr ? 'https://bitcoincalculator.tools/tr/hakkimizda' : 'https://bitcoincalculator.tools/about'} />
        <link rel="alternate" hrefLang="en" href="https://bitcoincalculator.tools/about" />
        <link rel="alternate" hrefLang="tr" href="https://bitcoincalculator.tools/tr/hakkimizda" />
        <link rel="alternate" hrefLang="x-default" href="https://bitcoincalculator.tools/about" />

        {/* Author & Publisher */}
        <meta name="author" content="Web3Believer, Webio" />
        <meta name="publisher" content="Bitcoin Calculator Tools" />
        <meta name="last-modified" content="2026-03-18" />

        {/* Open Graph */}
        <meta property="og:title" content={tr ? 'Bitcoin Hesaplayıcı Araçları Hakkında | 2010\'dan Beri Bitcoin Yatırımcıları' : 'About Bitcoin Calculator Tools | Built by Bitcoin Investors Since 2010'} />
        <meta
          property="og:description"
          content={tr ? 'Bitcoin Calculator Tools, 2010\'dan beri Bitcoin yatırımcısı ve aktif trader olan Web3Believer tarafından inşa edildi. 45+ ücretsiz araç, sıfır veri toplama, şeffaf metodoloji.' : 'Bitcoin Calculator Tools was built by Web3Believer, a Bitcoin investor and active trader since 2010. 45+ free tools, zero data collection, transparent methodology.'}
        />
        <meta property="og:url" content={tr ? 'https://bitcoincalculator.tools/tr/hakkimizda' : 'https://bitcoincalculator.tools/about'} />
        <meta property="og:image" content={(typeof window !== 'undefined' && window.location.pathname.startsWith('/tr')) ? 'https://bitcoincalculator.tools/bitcoin-kar-hesaplayici-og.webp' : 'https://bitcoincalculator.tools/social-preview.webp'} />
        <meta property="og:image:alt" content={tr ? 'Bitcoin Hesaplayıcı Araçları Hakkında, 2010\'dan beri Bitcoin yatırımcıları tarafından inşa edildi' : 'About Bitcoin Calculator Tools, built by Bitcoin investors since 2010'} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="BitcoinCalculator.Tools" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={language==='tr'?'Bitcoin Hesaplayıcı Araçları Hakkında | 2010\'dan Beri Bitcoin Yatırımcıları Tarafından İnşa Edildi':'About Bitcoin Calculator Tools | Built by Bitcoin Investors Since 2010'} />
        <meta
          name="twitter:description"
          content={language==='tr'?'2010\'dan beri Bitcoin yatırımcısı Web3Believer tarafından inşa edildi. 47 ücretsiz hesaplayıcı, sıfır veri toplama, şeffaf metodoloji.':'Built by Web3Believer, a Bitcoin investor since 2010. 47 free calculators, zero data collection, transparent methodology.'}
        />
        <meta name="twitter:image" content={(typeof window !== 'undefined' && window.location.pathname.startsWith('/tr')) ? 'https://bitcoincalculator.tools/bitcoin-kar-hesaplayici-og.webp' : 'https://bitcoincalculator.tools/social-preview.webp'} />
        <meta name="twitter:creator" content="@web3believers" />
        <meta name="twitter:site" content="@web3believers" />

        <meta
          name="keywords"
          content="about bitcoin calculator tools, bitcoin calculator team, web3believer bitcoin, bitcoin investment tools, cryptocurrency calculator platform, bitcoin analysis tools"
        />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": "https://bitcoincalculator.tools/#organization",
                "name": "Bitcoin Calculator Tools",
                "alternateName": "BitcoinCalculator.Tools",
                "url": "https://bitcoincalculator.tools",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://bitcoincalculator.tools/bitcoin-logo.png"
                },
                "foundingDate": "2024",
                "description":
                  "Bitcoin Calculator Tools provides 45+ free, professional-grade Bitcoin calculators including DCA, retirement planning, tax estimation, mining profitability, and market analysis tools. Built by Bitcoin investors, for Bitcoin investors.",
                "contactPoint": {
                  "@type": "ContactPoint",
                  "contactType": "customer support",
                  "url": "https://bitcoincalculator.tools/contact"
                },
                "sameAs": [
                  "https://twitter.com/web3believers",
                  "https://x.com/web3believers"
                ],
                "founder": [
                  { "@id": "https://bitcoincalculator.tools/#web3believer" },
                  { "@id": "https://bitcoincalculator.tools/#webio" }
                ]
              },
              {
                "@type": "Person",
                "@id": "https://bitcoincalculator.tools/#web3believer",
                "name": "Web3Believer",
                "jobTitle": "Creator & Bitcoin Expert",
                "image": "https://bitcoincalculator.tools/web3believer-photo.png",
                "description":
                  "Web3Believer is a Bitcoin investor, active multi-chain trader, and software tool builder based in Asia. Active in the Bitcoin community since approximately 2010 and on Twitter since 2011 under the consistent pseudonym @web3believers. Executes 20+ blockchain transactions weekly across Bitcoin, Ethereum, Layer 2 networks, and Solana. Founded Bitcoin Calculator Tools in 2024 to make professional-grade Bitcoin analysis accessible to everyone, free of charge.",
                "knowsAbout": [
                  "Bitcoin",
                  "Cryptocurrency Trading",
                  "Dollar Cost Averaging",
                  "Bitcoin Investment Strategy",
                  "Blockchain Technology",
                  "DeFi",
                  "Ethereum",
                  "Layer 2 Networks",
                  "Bitcoin Mining",
                  "Financial Tool Development"
                ],
                "sameAs": [
                  "https://twitter.com/web3believers",
                  "https://x.com/web3believers"
                ]
              },
              {
                "@type": "Person",
                "@id": "https://bitcoincalculator.tools/#webio",
                "name": "Webio",
                "jobTitle": "Co-creator & Financial Writer",
                "image": "https://bitcoincalculator.tools/webio-photo.png",
                "description":
                  "Webio is an experienced financial writer, researcher, and Web3 content specialist. Active in blockchain and DeFi projects, with a background in financial research and web content creation. Co-creator of Bitcoin Calculator Tools, responsible for educational content, calculator documentation, and making complex Bitcoin financial concepts accessible to everyday investors.",
                "knowsAbout": [
                  "Financial Writing",
                  "Bitcoin Education",
                  "Cryptocurrency Research",
                  "Web3",
                  "Blockchain",
                  "DeFi",
                  "Content Strategy",
                  "Financial Analysis"
                ],
                "sameAs": [
                  "https://x.com/webio",
                  "https://twitter.com/webio"
                ]
              },
              {
                "@type": "AboutPage",
                "@id": "https://bitcoincalculator.tools/about",
                "url": "https://bitcoincalculator.tools/about",
                "name": "About Bitcoin Calculator Tools | Built by Bitcoin Investors Since 2010",
                "description":
                  "Learn about the mission, team, and methodology behind Bitcoin Calculator Tools. Built by Web3Believer, a Bitcoin investor and trader since 2010, to provide free, professional-grade Bitcoin calculators to investors worldwide.",
                "inLanguage": "en-US",
                "dateModified": "2026-03-18",
                "mainEntity": { "@id": "https://bitcoincalculator.tools/#organization" },
                "publisher": { "@id": "https://bitcoincalculator.tools/#organization" },
                "author": { "@id": "https://bitcoincalculator.tools/#web3believer" }
              },
              {
                "@type": "FAQPage",
                "inLanguage": tr ? "tr" : "en",
                "mainEntity": (tr ? [
                  { q: "Bitcoin Calculator Tools'u kim geliştirdi?", a: "Bitcoin Calculator Tools, yaklaşık 2010'dan beri Bitcoin yatırımcısı ve aktif çok zincirli yatırımcı olan Web3Believer ile deneyimli finans yazarı ve Web3 araştırmacısı ortak kurucu Webio tarafından geliştirilmiştir. Web3Believer 2011'den beri Twitter'da @web3believers olarak aktiftir ve 2024'ten beri Bitcoin topluluğu için araçlar geliştirmektedir." },
                  { q: "Bitcoin hesaplayıcıları hangi veri kaynaklarını kullanır?", a: "Tüm hesaplayıcılar CoinGecko genel API'sinden gerçek zamanlı güncellenen canlı fiyat verilerini kullanır. Tarihsel Bitcoin fiyat verisi, Bitcoin'in 2010'daki ilk işlem gören fiyatına kadar uzanır. Madencilik kârlılık hesaplamaları mempool.space'ten gerçek zamanlı ücret ve hash oranı verisi kullanır. İşlem ücreti tahminleri canlı Bitcoin mempool verisi kullanır." },
                  { q: "Araçların tamamı neden ücretsiz?", a: "Portföy büyüklüğünden bağımsız olarak her Bitcoin yatırımcısının profesyonel düzeyde analiz araçlarına erişim hakkı olduğuna inanıyoruz. 45'ten fazla hesaplayıcının tamamı tamamen ücretsizdir; kayıt, premium katmanlar veya gizli ücretler yoktur ve bu hiç değişmeyecek." },
                  { q: "Veri gizliliğini nasıl sağlıyorsunuz?", a: "Tüm hesaplamalar tamamen tarayıcınızda istemci tarafı JavaScript ile çalışır. Hiçbir kişisel veya finansal veri sunucularımıza iletilmez, bir veritabanında saklanmaz veya üçüncü taraflarla paylaşılmaz. Yatırım rakamlarınız cihazınızda kalır." },
                  { q: "Hesaplamalar doğru mu?", a: "Evet. Tüm hesaplayıcılar, CoinGecko'nun genel API'sinden alınan gerçek piyasa verisiyle doğrulanmış finansal formüller üzerine kuruludur. Yöntemler her hesaplayıcı sayfasında belgelenmiştir. Sonuçlar eğitim amaçlıdır ve finansal tavsiye olarak değerlendirilmemelidir." }
                ] : [
                  { q: "Who built Bitcoin Calculator Tools?", a: "Bitcoin Calculator Tools was created by Web3Believer, a Bitcoin investor and active multi-chain trader since approximately 2010, along with co-creator Webio, an experienced financial writer and Web3 researcher. Web3Believer has been active on Twitter as @web3believers since 2011 and has been building tools for the Bitcoin community since 2024." },
                  { q: "What data sources do the Bitcoin calculators use?", a: "All calculators use live price data from the CoinGecko public API, updated in real time. Historical Bitcoin price data goes back to Bitcoin's first tradeable price in 2010. Mining profitability calculations use real-time fee and hash rate data from mempool.space. Transaction fee estimates use live Bitcoin mempool data." },
                  { q: "Why are all the tools free?", a: "We believe every Bitcoin investor deserves access to professional-grade analysis tools regardless of their portfolio size. All 45+ calculators are completely free with no signup required, no premium tiers, and no hidden fees, and that will never change." },
                  { q: "How do you ensure data privacy?", a: "All calculations run entirely in your browser using client-side JavaScript. No personal or financial data is ever transmitted to our servers, stored in any database, or shared with third parties. Your investment figures stay on your device." },
                  { q: "Are the calculations accurate?", a: "Yes. All calculators are built on verified financial formulas with real market data from CoinGecko's public API. Methodologies are documented on each calculator page. Results are for educational purposes and should not be treated as financial advice." }
                ]).map(({q,a}) => ({ "@type": "Question", "name": q, "acceptedAnswer": { "@type": "Answer", "text": a } }))
              }
            ]
          })}
        </script>
      </Helmet>

      <BreadcrumbSchema language={language}
        items={[
          { name: "Home", url: "https://bitcoincalculator.tools/" },
          { name: "About", url: "https://bitcoincalculator.tools/about" }
        ]}
      />

      <PageBackground variant="clean">
        <Header />

        <main id="main-content" className="pt-20 relative z-10">
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb items={[{ label: "About" }]} />
          </div>

          <AboutHeroSection />
          <AboutMissionSection />
          <AboutMethodologySection />
          <AboutWhyTrustSection />
          <AboutTimelineSection />
          <AboutTeamSection />
          <AboutFAQSection />
        </main>

        <Footer />
      </PageBackground>
    </>
  );
};

export default About;
