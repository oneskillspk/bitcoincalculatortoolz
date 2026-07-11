import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Breadcrumb } from '@/components/Breadcrumb';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { PageBackground } from '@/components/modern/PageBackground';
import { QuickAnswerBox } from '@/components/calculator/QuickAnswerBox';
import { CompactLiveBitcoinPrice } from '@/components/CompactLiveBitcoinPrice';
import RelatedCalculators from '@/components/RelatedCalculators';
import { useLiveBitcoinPrice } from '@/hooks/useLiveBitcoinPrice';
import { getAccumulationResult } from '@/services/accumulationScoreService';
import { AccumulationScoreInputPanel } from '@/components/accumulation-score/AccumulationScoreInputPanel';
import { InputPanel } from '@/components/calculator';
import { AccumulationScoreResult } from '@/components/accumulation-score/AccumulationScoreResult';
import { AccumulationLifecycleCurve } from '@/components/accumulation-score/AccumulationLifecycleCurve';
import { AccumulationDcaCatchUp } from '@/components/accumulation-score/AccumulationDcaCatchUp';
import { AccumulationShareCard } from '@/components/accumulation-score/AccumulationShareCard';
import { AccumulationBenchmarkTable } from '@/components/accumulation-score/AccumulationBenchmarkTable';
import { AccumulationContentSections } from '@/components/accumulation-score/AccumulationContentSections';
import { AccumulationScoreFAQSection, accumulationScoreFaqSchemaData } from '@/components/accumulation-score/AccumulationScoreFAQSection';
import { AccumulationHowItWorksSection } from '@/components/accumulation-score/AccumulationHowItWorksSection';
import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { buildCalculatorSpeakable } from '@/components/seo/calculatorSpeakable';
import { PreFAQPlacement } from "@/components/placement/PreFAQPlacement";
import { QuickShareLinkPanel } from '@/components/share-export';

const BitcoinAccumulationScoreCalculator = () => {
  const { language, t } = useLanguage();
  const [age, setAge] = useState(30);
  const [holdings, setHoldings] = useState(0);
  const { price } = useLiveBitcoinPrice();
  const btcPrice = price || 100000;

  const result = useMemo(() => getAccumulationResult(age, holdings), [age, holdings]);

  return (
    <>
      <Helmet>
        <title>{language === 'tr' ? 'Bitcoin Birikim Skoru Hesaplayıcısı (2026) | Yaş Notu' : 'Bitcoin Accumulation Score Calculator (2026)'}</title>
        <meta name="description" content={language === 'tr' ? 'Bitcoin birikim skoru hesaplayıcısı: yaşınıza ve BTC varlığınıza göre A+ ile F arası not alın. Yaşam döngüsü eğrisi ve DCA yetişme planı ücretsiz.' : 'Grade your Bitcoin stack by age. Enter BTC holdings, see your A+ to F score, view lifecycle targets, and plan your DCA catch-up.'} />
        <link rel="canonical" href={language === 'tr' ? 'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-birikim-skoru' : 'https://bitcoincalculator.tools/calculators/bitcoin-accumulation-score'} />
        {/* hreflang alternates emitted globally via <GlobalHreflang /> */}

        <meta property="og:title" content={language === 'tr' ? 'Bitcoin Birikim Skoru Hesaplayıcısı — Yaş Notu' : 'Bitcoin Accumulation Score Calculator (2026)'} />
        <meta property="og:description" content={language === 'tr' ? 'Bitcoin birikim skoru hesaplayıcısı ile yaşınıza göre A+ ile F arası notunuzu alın. Yaşam döngüsü eğrisi ve DCA yetişme planı ile ücretsiz.' : 'Grade your Bitcoin stack by age. Get your A+ to F grade, explore the lifecycle curve, and plan your DCA catch-up. Free tool.'} />
        <meta property="og:url" content={language === 'tr' ? 'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-birikim-skoru' : 'https://bitcoincalculator.tools/calculators/bitcoin-accumulation-score'} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={(typeof window !== 'undefined' && window.location.pathname.startsWith('/tr')) ? 'https://bitcoincalculator.tools/bitcoin-kar-hesaplayici-og.webp' : 'https://bitcoincalculator.tools/social-preview.webp'} />
        <meta property="og:image:alt" content={language === 'tr' ? 'Bitcoin Birikim Skoru Hesaplayıcısı | bitcoincalculator.tools' : 'Bitcoin Accumulation Score Calculator | bitcoincalculator.tools'} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="bitcoincalculator.tools" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={language === 'tr' ? 'Bitcoin Birikim Skoru Hesaplayıcısı' : 'Bitcoin Accumulation Score Calculator (2026)'} />
        <meta name="twitter:description" content={language === 'tr' ? 'Bitcoin notunuz nedir? Yaşa göre A+ ile F puanlama. Ücretsiz, gizli, anlık.' : "What's your Bitcoin grade? A+ to F scoring by age. Free, private, instant."} />
        <meta name="twitter:image" content={(typeof window !== 'undefined' && window.location.pathname.startsWith('/tr')) ? 'https://bitcoincalculator.tools/bitcoin-kar-hesaplayici-og.webp' : 'https://bitcoincalculator.tools/social-preview.webp'} />
        <meta name="twitter:creator" content="@web3believers" />
        <meta name="twitter:site" content="@web3believers" />

        {language !== 'tr' && <>
        {/* WebApplication Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Bitcoin Accumulation Score Calculator",
            "description": "Grade your Bitcoin stack by age with a letter grade from A+ to F. Uses the Bitcoin Lifecycle Model with Power Law appreciation and lifecycle income curves.",
            "url": "https://bitcoincalculator.tools/calculators/bitcoin-accumulation-score",
            "inLanguage": "en",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Any",
            "featureList": [
              "Age-based Bitcoin accumulation grading (A+ to F)",
              "Bitcoin Lifecycle Accumulation Curve visualization",
              "DCA catch-up planner with multiple timelines",
              "Social share card generator",
              "Static benchmark table for 14 age milestones",
              "Live Bitcoin price integration",
              "Privacy-first: all calculations in browser"
            ],
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
            "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools" },
            "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" }
          })}
        </script>

        {/* HowTo Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Check Your Bitcoin Accumulation Score",
            "description": "Step-by-step guide to grading your Bitcoin stack by age using the Accumulation Score Calculator.",
            "inLanguage": "en",
            "step": [
              { "@type": "HowToStep", "position": 1, "name": "Enter your age", "text": "Use the slider or type your current age (13-83)" },
              { "@type": "HowToStep", "position": 2, "name": "Enter your BTC holdings", "text": "Input your total Bitcoin across all wallets and exchanges" },
              { "@type": "HowToStep", "position": 3, "name": "See your grade", "text": "View your letter grade (A+ to F) and lifecycle phase" },
              { "@type": "HowToStep", "position": 4, "name": "Plan your DCA catch-up", "text": "Use the timeline selector to calculate the monthly DCA needed to close any gap" }
            ]
          })}
        </script>

        {/* FAQPage Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "inLanguage": "en",
            "mainEntity": accumulationScoreFaqSchemaData
          })}
        </script>
        </>}

        {language === 'tr' && <>
          <script type="application/ld+json">{JSON.stringify({
            "@context": "https://schema.org", "@type": "WebApplication",
            "name": "Bitcoin Birikim Skoru Hesaplayıcısı", "inLanguage": "tr",
            "url": "https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-birikim-skoru",
            "description": "Bitcoin birikim skoru hesaplayıcısı ile yaşınıza göre A+ ile F arası notunuzu alın.",
            "applicationCategory": "FinanceApplication", "operatingSystem": "Any",
            "offers": {"@type": "Offer", "price": "0", "priceCurrency": "TRY"},
            "provider": {"@type": "Organization", "name": "Bitcoin Calculator Tools"},
            "author": {"@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools"}
          })}</script>
          <script type="application/ld+json">{JSON.stringify({
            "@context": "https://schema.org", "@type": "FAQPage", "inLanguage": "tr",
            "mainEntity": [
              {"@type": "Question", "name": "Bitcoin birikim skoru nedir?", "acceptedAnswer": {"@type": "Answer", "text": "Bitcoin Birikim Skoru, yaşınıza göre Bitcoin varlıklarınızı değerlendiren ve A+ ile F arasında bir not veren bir araçtır. Bitcoin Yaşam Döngüsü Modeline dayalı teorik bir kıyaslama noktası sağlar ve DCA yetişme planlaması yapmanızı sağlar."}},
              {"@type": "Question", "name": "Yaşıma göre ne kadar Bitcoin'e sahip olmalıyım?", "acceptedAnswer": {"@type": "Answer", "text": "Bitcoin Yaşam Döngüsü Modeline göre medyan hedefler şu şekildedir: 25 yaşında yaklaşık 0.10 BTC, 30 yaşında yaklaşık 0.21 BTC, 35 yaşında yaklaşık 0.30 BTC, 40 yaşında yaklaşık 0.35 BTC. Bu rakamlar teorik kıyaslama noktalarıdır ve kişisel mali koşullarınıza göre değişmelidir."}},
              {"@type": "Question", "name": "Notumu nasıl yükseltebilirim?", "acceptedAnswer": {"@type": "Answer", "text": "DCA Yetişme Planlayıcısı, bir sonraki nota ulaşmak için gereken aylık yatırım miktarını gösterir. Örneğin C notundan B notuna geçmek için 0.05 BTC eksikseniz, mevcut Bitcoin fiyatlarına göre aylık gereken DCA miktarını hesaplayabilirsiniz."}},
              {"@type": "Question", "name": "Bu skor gerçek bir finansal değerlendirme midir?", "acceptedAnswer": {"@type": "Answer", "text": "Hayır, bu teorik bir kıyaslama aracıdır ve finansal tavsiye niteliği taşımaz. Gerçek birikim hedefleri gelir, harcama, risk toleransı ve kişisel koşullara bağlıdır. Yatırım kararı vermeden önce bir finansal danışmana başvurun."}},
              {"@type": "Question", "name": "Hesaplama nasıl yapılır?", "acceptedAnswer": {"@type": "Answer", "text": "Skor, Bitcoin Güç Yasası fiyat modelini ve yaş bazlı yaşam döngüsü gelir eğrilerini kullanır. Yaşınız ve BTC varlıklarınız, teorik medyan ve üst persentil hedeflerle karşılaştırılarak A+ ile F arası bir puan belirlenir."}}
            ]
          })}</script>
        </>}
              <script type="application/ld+json">{JSON.stringify(buildCalculatorSpeakable(language === 'tr' ? 'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-birikim-skoru' : 'https://bitcoincalculator.tools/calculators/bitcoin-accumulation-score', language))}</script>
      </Helmet>

      <BreadcrumbSchema language={language}
        items={[
          { name: "Home", url: "https://bitcoincalculator.tools" },
          { name: "Calculators", url: "https://bitcoincalculator.tools/calculators" },
          { name: "Bitcoin Accumulation Score", url: "https://bitcoincalculator.tools/calculators/bitcoin-accumulation-score" },
        ]}
      />

      <PageBackground variant="clean">
        <Header />

        <main id="main-content" className="pt-20 relative z-10">
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb
              items={[
                { label: language === 'tr' ? 'Hesaplayıcılar' : 'Calculators', href: language === 'tr' ? '/tr/hesaplayicilar' : '/calculators' },
                { label: t('accumulation.breadcrumb') },
              ]}
            />
          </div>

          {/* Hero */}
          <section className="py-16 text-center">
            <div className="container mx-auto px-6 max-w-4xl">
              <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/20 mb-6">
                🏆 {t('accumulation.badge')}
              </div>
              <h1 className="text-h1 font-bold mb-4">
                {language === 'tr'
                  ? <>Bitcoin Birikim Skoru — <span className="text-gradient-premium">Notunuz Nedir?</span></>
                  : <>Bitcoin Accumulation Score — <span className="text-gradient-premium">What's Your Grade?</span></>}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
                {language === 'tr'
                  ? 'Yaşınızı ve BTC varlıklarınızı girin, birikim notunuzu (A+ ile F) öğrenin, yaşam döngüsü eğrisini inceleyin ve DCA yetişme stratejinizi planlayın. Ücretsiz, gizli, anlık.'
                  : 'Enter your age and BTC holdings to get your accumulation grade (A+ to F), see the lifecycle bell curve, and plan your DCA catch-up strategy. Free, private, instant.'}
              </p>
              <CompactLiveBitcoinPrice currency="USD" />
            </div>
          </section>

          {/* Calculator */}
          <section className="pb-16">
            <div className="container mx-auto px-6 max-w-3xl space-y-10">
              <QuickAnswerBox
                answer={language==='tr'
                  ? 'Bitcoin Birikim Skoru, BTC birikiminizi yaş grubunuzdaki diğer kullanıcılara karşı çan eğrisi üzerinde derecelendirir. Yaşınızı ve mevcut BTC miktarınızı girin — A+ ile F arası harf notu, küresel yüzdeliğiniz, yaş kohortunuzun yaşam döngüsü medyanı ve bir üst kademeye yükselmeniz için kişiselleştirilmiş DCA planı sunarız.'
                  : 'The Bitcoin Accumulation Score grades your BTC stack against your age peers on a bell curve. Enter your age and current BTC holdings — we return a letter grade A+ through F, your global percentile, the lifecycle median for your cohort, and a personalised DCA catch-up plan to reach the next grade tier.'}
              />
              {/* Input Panel */}
              <InputPanel
                title={language === 'tr' ? 'Birikim Skoru' : 'Accumulation Score'}
                description={language === 'tr'
                  ? 'Yaşınızı ve BTC bakiyenizi girin — sonuç otomatik güncellenir.'
                  : 'Enter your age and BTC holdings — results update automatically.'}
              >
                <AccumulationScoreInputPanel
                  age={age}
                  holdings={holdings}
                  onAgeChange={setAge}
                  onHoldingsChange={setHoldings}
                />
              </InputPanel>

              {/* Result */}
              {holdings > 0 && (
                <>
                  <AccumulationScoreResult result={result} btcPrice={btcPrice} holdings={holdings} />
                  <AccumulationShareCard result={result} age={age} />
                </>
              )}

              {/* Lifecycle Curve */}
              <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-8">
                <AccumulationLifecycleCurve userAge={age} userHoldings={holdings} />
              </div>

              {/* DCA Catch-Up */}
              {holdings > 0 && result.gap > 0 && (
                <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-8">
                  <AccumulationDcaCatchUp gapBtc={result.gap} btcPrice={btcPrice} />
                </div>
              )}
            </div>
          </section>

          {/* Benchmark Table */}
          <section className="py-16 bg-muted/10">
            <div className="container mx-auto px-6 max-w-3xl">
              <AccumulationBenchmarkTable btcPrice={btcPrice} />
            </div>
          </section>

          {/* How It Works */}
          <AccumulationHowItWorksSection />

          {/* Educational Content */}
          <section className="py-16 bg-muted/10">
            <div className="container mx-auto px-6">
              <AccumulationContentSections />
            </div>
          </section>
        </main>

        {/* AI-driven affiliate placement */}

        {/* FAQ - Outside main per template */}
        <PreFAQPlacement slug="accumulation-score" />
        <AccumulationScoreFAQSection />

        {language === 'tr' && (
          <section className="py-16 md:py-20 bg-muted/10">
            <div className="container mx-auto px-6 max-w-3xl">
              <h2 className="text-h2 font-bold text-foreground mb-4">Bitcoin Birikim Skoru: Yaşınıza Göre Notunuz</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Bitcoin Birikim Skoru, yaşınıza ve BTC varlıklarınıza göre A+ ile F arasında bir not verir. Bitcoin Yaşam Döngüsü Modeline dayanan bu araç, akranlarınızla kıyaslandığında Bitcoin birikiminin ne düzeyde olduğunu değerlendirmenize yardımcı olur.
              </p>
              <h3 className="text-h3 font-semibold text-foreground mb-2">Yaşa Göre Bitcoin Hedefleri</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Yaşam döngüsü modeline göre teorik medyan hedefler şöyledir: 25 yaşında 0.10 BTC, 30 yaşında 0.21 BTC, 35 yaşında 0.30 BTC, 40 yaşında 0.35 BTC ve 45 yaşında 0.38 BTC. Bu rakamlar birer kıyaslama noktasıdır; gerçek hedefiniz kişisel mali durumunuza göre belirlenmelidir.
              </p>
              <h3 className="text-h3 font-semibold text-foreground mb-2">DCA ile Notunuzu Yükseltme</h3>
              <p className="text-muted-foreground leading-relaxed">
                DCA Yetişme Planlayıcısı, bir sonraki nota ulaşmak için aylık ne kadar yatırım yapmanız gerektiğini gösterir. Örneğin C notundan B notuna geçmek için 0.05 BTC eksikseniz, mevcut Bitcoin fiyatına ve süreye göre aylık gereken DCA miktarını otomatik hesaplar.
              </p>
            </div>
          </section>
        )}

        <div className="container mx-auto px-4 sm:px-6"><div className="max-w-6xl mx-auto"><QuickShareLinkPanel slug="bitcoin-accumulation-score" headline={language === 'tr' ? 'Bitcoin Biriktirme Skoru' : 'Bitcoin Accumulation Score'} /></div></div>
        <RelatedCalculators />

        {/* Disclaimer */}
        <section className="py-16 md:py-20 bg-muted/20">
          <div className="container mx-auto px-6 max-w-3xl">
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <p>
                {language === 'tr'
                  ? <><strong>⚠️ Yalnızca Eğitim Amaçlı:</strong> {t('accumulation.disclaimer')} Hedefler idealize edilmiş koşulları varsayar ve mutlak hedefler olarak değil, yönlendirici bir rehber olarak kullanılmalıdır. Her zaman kendi araştırmanızı yapın ve yatırım kararı vermeden önce nitelikli bir finansal danışmana başvurun.</>
                  : <><strong>⚠️ Educational Purpose Only:</strong> The Bitcoin Accumulation Score is a theoretical benchmark based on the Bitcoin Lifecycle Model. It is not financial advice. Actual accumulation depends on income, expenses, risk tolerance, and personal circumstances. The targets assume idealized conditions and should be used as directional guidance, not absolute goals. Always do your own research and consult a qualified financial advisor before making investment decisions. Cryptocurrency investments carry significant risk.</>}
              </p>
            </div>
          </div>
        </section>

        <Footer />
      </PageBackground>
    </>
  );
};

export default BitcoinAccumulationScoreCalculator;
