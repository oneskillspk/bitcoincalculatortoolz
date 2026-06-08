import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Breadcrumb } from '@/components/Breadcrumb';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import RelatedCalculators from '@/components/RelatedCalculators';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, AlertTriangle } from 'lucide-react';
import { PageBackground } from '@/components/modern/PageBackground';
import { CompactLiveBitcoinPrice } from '@/components/CompactLiveBitcoinPrice';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { WealthInputPanel } from '@/components/wealth/WealthInputPanel';
import { WealthPercentileResult } from '@/components/wealth/WealthPercentileResult';
import { WealthDistributionChart } from '@/components/wealth/WealthDistributionChart';
import { WealthMilestoneTracker } from '@/components/wealth/WealthMilestoneTracker';
import { WealthShareCard } from '@/components/wealth/WealthShareCard';
import { WealthComparisonTable } from '@/components/wealth/WealthComparisonTable';
import { WealthExportReport } from '@/components/wealth/WealthExportReport';
import { WealthFAQSection } from '@/components/wealth/WealthFAQSection';
import { WealthHowItWorksSection } from '@/components/wealth/WealthHowItWorksSection';
import { WealthScenarioPanel } from '@/components/wealth/WealthScenarioPanel';
import { WealthAddressLensSlider, type AddressLens } from '@/components/wealth/WealthAddressLensSlider';
import { WealthSatoshiEquivalent } from '@/components/wealth/WealthSatoshiEquivalent';
import { WealthContentSections, } from '@/components/wealth/WealthContentSections';
import { wealthFaqJsonLdEn, wealthFaqJsonLdTr } from '@/components/wealth/WealthFAQSection';
import { WealthShareSnapshot } from '@/components/wealth/WealthShareSnapshot';
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocalizedSchema } from "@/hooks/useLocalizedSchema";
import {
  calculatePercentile,
  getNextMilestone,
} from '@/services/wealthPercentileService';

const BitcoinWealthPercentile: React.FC = () => {
  const { language, t } = useLanguage();
  const [btcAmount, setBtcAmount] = useState(0.1);
  const [lens, setLens] = useState<AddressLens>('all');

  const result = useMemo(() => calculatePercentile(btcAmount), [btcAmount]);
  const milestone = useMemo(() => getNextMilestone(btcAmount), [btcAmount]);

  const trUrl = 'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-servet-yuzdesi';
  const enUrl = 'https://bitcoincalculator.tools/calculators/wealth-percentile';

  const breadcrumbItems = language === 'tr' ? [
    { name: 'Ana Sayfa', url: 'https://bitcoincalculator.tools/tr/' },
    { name: 'Hesaplayıcılar', url: 'https://bitcoincalculator.tools/tr/hesaplayicilar' },
    { name: 'Servet Yüzdesi', url: trUrl },
  ] : [
    { name: 'Home', url: 'https://bitcoincalculator.tools/' },
    { name: 'Calculators', url: 'https://bitcoincalculator.tools/calculators' },
    { name: 'Wealth Percentile', url: enUrl },
  ];

  const webAppSchema = useLocalizedSchema(
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "inLanguage": "en",
      "name": "Bitcoin Wealth Percentile Calculator",
      "description": "Find out what percentage of Bitcoin holders you outrank. Enter your BTC to see your wealth percentile, tier ranking, and how you compare globally. Free tool.",
      "url": enUrl,
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Any",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "featureList": [
        "Wealth percentile ranking",
        "Distribution chart",
        "Tier classification (Plankton to Humpback)",
        "Future-price scenario panel ($200K, $500K, $1M BTC)",
        "Distribution lens (all addresses, individual wallets, non-custodial)",
        "Satoshi equivalent display with fair-share comparison",
        "Milestone tracker",
        "Social sharing with privacy controls",
        "PDF export",
      ],
      "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
      "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "inLanguage": "tr",
      "name": "Bitcoin Servet Yüzdesi Hesaplayıcısı",
      "description": "Bitcoin sahiplerinin yüzde kaçını geride bıraktığınızı öğrenin. BTC'nizi girin — servet yüzdenizi, katman sıralamanızı ve küresel karşılaştırmanızı görün. Ücretsiz araç.",
      "url": trUrl,
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Any",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "TRY" },
      "featureList": [
        "Servet yüzdelik sıralaması",
        "Dağılım grafiği",
        "Kademe sınıflandırması (Planktondan Kambur Balinaya)",
        "Gelecek fiyat senaryo paneli (200B, 500B, 1M $ BTC)",
        "Dağılım merceği (tüm adresler, bireysel cüzdanlar, saklamasız)",
        "Adil pay karşılaştırması ile satoshi gösterimi",
        "Kilometre taşı takibi",
        "Gizlilik kontrollü sosyal paylaşım",
        "PDF dışa aktarma",
      ],
      "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
      "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
    },
  );

  const howToSchema = useLocalizedSchema(
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "inLanguage": "en",
      "name": "How to Use the Bitcoin Wealth Percentile Calculator",
      "description": "Discover your Bitcoin wealth ranking in four simple steps",
      "step": [
        { "@type": "HowToStep", "name": "Enter Your Holdings", "text": "Input how much Bitcoin you own in BTC, satoshis, or the equivalent fiat value using live prices" },
        { "@type": "HowToStep", "name": "See Your Percentile", "text": "Instantly discover what percentage of Bitcoin holders you outrank based on on-chain address distribution data" },
        { "@type": "HowToStep", "name": "Explore Your Tier", "text": "Learn which holder category you belong to (Shrimp, Crab, Fish, Dolphin, Shark, or Whale) with educational context" },
        { "@type": "HowToStep", "name": "Set Goals & Share", "text": "Use the milestone tracker to plan your next tier, then share your result on social media" },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "inLanguage": "tr",
      "name": "Bitcoin Servet Yüzdesi Hesaplayıcısı Nasıl Kullanılır",
      "description": "Bitcoin servet sıralamanızı dört basit adımda keşfedin",
      "step": [
        { "@type": "HowToStep", "name": "Varlıklarınızı Girin", "text": "Sahip olduğunuz Bitcoin miktarını BTC, satoshi veya canlı fiyatlarla eşdeğer fiat olarak girin" },
        { "@type": "HowToStep", "name": "Yüzdelik Diliminizi Görün", "text": "Zincir üstü adres dağılımı verilerine göre Bitcoin sahiplerinin yüzde kaçının önünde olduğunuzu anında öğrenin" },
        { "@type": "HowToStep", "name": "Kademenizi Keşfedin", "text": "Hangi sahibi kategorisine ait olduğunuzu (Karides, Yengeç, Balık, Yunus, Köpekbalığı veya Balina) eğitici bağlamla öğrenin" },
        { "@type": "HowToStep", "name": "Hedef Belirleyin ve Paylaşın", "text": "Sonraki kademenizi planlamak için kilometre taşı takibini kullanın, ardından sonucunuzu sosyal medyada paylaşın" },
      ],
    },
  );

  const faqSchema = useLocalizedSchema(
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "inLanguage": "en",
      "mainEntity": wealthFaqJsonLdEn.map((f) => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": { "@type": "Answer", "text": f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "inLanguage": "tr",
      "mainEntity": wealthFaqJsonLdTr.map((f) => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": { "@type": "Answer", "text": f.a },
      })),
    },
  );

  return (
    <>
      <Helmet>
        <title>{language==='tr'?'Bitcoin Servet Yüzdesi Hesaplayıcısı':'Bitcoin Wealth Percentile Calculator'}</title>
        <meta name="description" content={language==='tr'?'Bitcoin sahiplerinin yüzde kaçını geride bıraktığınızı öğrenin. BTC\'nizi girin — servet yüzdenizi, katman sıralamanızı ve küresel karşılaştırmanızı görün. Ücretsiz.':'Find out what percentage of Bitcoin holders you outrank. Enter your BTC to see your wealth percentile, tier ranking, and how you compare globally. Free tool.'} />
        <meta name="keywords" content="bitcoin wealth percentile, bitcoin rich list, how much bitcoin to be rich, bitcoin wealth distribution, bitcoin holder statistics, how many people own 1 bitcoin, bitcoin ownership, bitcoin percentile calculator, bitcoin distribution chart, am I rich in bitcoin" />
        <link rel="canonical" href={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-servet-yuzdesi':'https://bitcoincalculator.tools/calculators/wealth-percentile'} />

        <link rel="alternate" hrefLang="tr" href="https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-servet-yuzdesi" />
        <link rel="alternate" hrefLang="en" href="https://bitcoincalculator.tools/calculators/wealth-percentile" />
        <link rel="alternate" hrefLang="x-default" href="https://bitcoincalculator.tools/calculators/wealth-percentile" />
        <meta property="og:title" content={language==='tr'?'Bitcoin Servet Yüzdesi Hesaplayıcısı':'Bitcoin Wealth Percentile Calculator'} />
        <meta property="og:description" content={language==='tr'?'Bitcoin sahiplerinin yüzde kaçını geride bıraktığınızı öğrenin. BTC\'nizi girin — servet yüzdenizi ve küresel sıralamanızı görün. Ücretsiz.':'Find out what percentage of Bitcoin holders you outrank. Enter your BTC to see your wealth percentile, tier ranking, and how you compare globally. Free tool.'} />
        <meta property="og:url" content={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-servet-yuzdesi':'https://bitcoincalculator.tools/calculators/wealth-percentile'} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={(typeof window !== 'undefined' && window.location.pathname.startsWith('/tr')) ? 'https://bitcoincalculator.tools/bitcoin-kar-hesaplayici-og.webp' : 'https://bitcoincalculator.tools/social-preview.webp'} />
        <meta property="og:image:alt" content={(typeof window !== 'undefined' && window.location.pathname.startsWith('/tr')) ? 'Bitcoin Hesaplayıcıları — 45+ Ücretsiz Araç | bitcoincalculator.tools' : 'Bitcoin Wealth Percentile Calculator | bitcoincalculator.tools'} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="bitcoincalculator.tools" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={language==='tr'?'Bitcoin Servet Yüzdesi Hesaplayıcısı':'Bitcoin Wealth Percentile Calculator'} />
        <meta name="twitter:description" content={language==='tr'?'Bitcoin servet yüzdenizi ve katman sıralamanızı anında görün.':'See your Bitcoin wealth percentile and tier ranking instantly.'} />
        <meta name="twitter:image" content={(typeof window !== 'undefined' && window.location.pathname.startsWith('/tr')) ? 'https://bitcoincalculator.tools/bitcoin-kar-hesaplayici-og.webp' : 'https://bitcoincalculator.tools/social-preview.webp'} />
        <meta name="twitter:creator" content="@web3believers" />

        <meta name="twitter:site" content="@web3believers" />
        <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <BreadcrumbSchema language={language} items={breadcrumbItems} />

      <PageBackground variant="clean">
        <Header />

        <main id="main-content" className="pt-20 relative z-10">
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb items={[
              { label: language==='tr'?'Hesaplayıcılar':'Calculators', href: language==='tr'?'/tr/hesaplayicilar':'/calculators' },
              { label: language==='tr'?'Servet Yüzdesi':'Wealth Percentile' },
            ]} />
          </div>

          <section className="container mx-auto px-6 py-16 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6 text-sm font-medium text-primary">
              <Trophy className="w-4 h-4" />
              {language==='tr'?'Bitcoin Servet Sıralaması':'Bitcoin Wealth Ranking'}
            </div>

            <h1 className="text-h1 font-bold text-foreground mb-4">
              {language==='tr'?<>Bitcoin <span className="text-gradient-premium">Servet Yüzdesi</span> Hesaplayıcısı</>:<>Bitcoin <span className="text-gradient-premium">Wealth Percentile</span> Calculator</>}
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-6 leading-relaxed">
              {language==='tr'?'Bitcoin\'de ne kadar zenginsiniz? BTC varlıklarınızı girerek küresel servet yüzdenizi, katman sıralamanızı ve dünya genelindeki tüm Bitcoin adresleriyle karşılaştırmanızı keşfedin.':'How rich are you in Bitcoin? Enter your BTC holdings to discover your global wealth percentile, tier ranking, and how you compare to all Bitcoin addresses worldwide.'}
            </p>

            <div className="max-w-sm mx-auto">
              <CompactLiveBitcoinPrice currency="USD" />
            </div>
          </section>

          <section className="container mx-auto px-6 pb-20">
            <div className="max-w-6xl mx-auto space-y-10">
              <OfflineIndicator />

              <div className="max-w-3xl mx-auto">
                <ErrorBoundary>
                  <WealthInputPanel btcAmount={btcAmount} onBtcAmountChange={setBtcAmount} />
                </ErrorBoundary>
              </div>

              {btcAmount > 0 && (
                <>
                  <div className="max-w-3xl mx-auto">
                    <ErrorBoundary>
                      <WealthPercentileResult result={result} />
                    </ErrorBoundary>
                  </div>

                  <div className="max-w-3xl mx-auto">
                    <ErrorBoundary>
                      <WealthSatoshiEquivalent btcAmount={btcAmount} />
                    </ErrorBoundary>
                  </div>

                  <div className="max-w-3xl mx-auto">
                    <ErrorBoundary>
                      <WealthAddressLensSlider
                        lens={lens}
                        onLensChange={setLens}
                        basePercentile={result.percentile}
                      />
                    </ErrorBoundary>
                  </div>

                  <div className="max-w-3xl mx-auto">
                    <ErrorBoundary>
                      <WealthScenarioPanel btcAmount={btcAmount} />
                    </ErrorBoundary>
                  </div>

                  <ErrorBoundary>
                    <WealthDistributionChart result={result} />
                  </ErrorBoundary>

                  <div className="max-w-3xl mx-auto">
                    <ErrorBoundary>
                      <WealthMilestoneTracker result={result} milestone={milestone} />
                    </ErrorBoundary>
                  </div>

                  <ErrorBoundary>
                    <WealthComparisonTable result={result} />
                  </ErrorBoundary>

                  <div className="max-w-3xl mx-auto">
                    <ErrorBoundary>
                      <WealthShareSnapshot result={result} />
                    </ErrorBoundary>
                  </div>

                  <div className="max-w-3xl mx-auto">
                    <ErrorBoundary>
                      <WealthShareCard result={result} />
                    </ErrorBoundary>
                  </div>

                  <WealthExportReport result={result} milestone={milestone} />
                </>
              )}
            </div>
          </section>

          <WealthHowItWorksSection />
          <WealthContentSections />
          <WealthFAQSection />
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
                        {language==='tr'?'Servet yüzdesi verileri, kamuya açık zincir üstü adres dağılımına dayanmaktadır ve benzersiz sahipleri yansıtmayabilir. Bu araç yalnızca eğitim amaçlıdır ve finansal tavsiye niteliği taşımaz.':'Wealth percentile data is based on publicly available on-chain address distribution and may not reflect unique holders. This tool is for educational purposes only and does not constitute financial advice.'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
          <div className="container mx-auto px-6 pb-6 max-w-5xl">
            <AffiliatePlacement
              slug="wealth-percentile"
              lang={language === 'tr' ? 'tr' : 'en'}
              zone="inline"
              forceAffiliateId="ledger"
              forceFormat="image-banner"
            />
          </div>
        </main>


        <Footer />
      </PageBackground>
    </>
  );
};

export default BitcoinWealthPercentile;
