import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { PageBackground } from "@/components/modern/PageBackground";
import { CompactLiveBitcoinPrice } from "@/components/CompactLiveBitcoinPrice";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import RelatedCalculators from "@/components/RelatedCalculators";
import { DrawdownMetricCards } from "@/components/drawdown/DrawdownMetricCards";
import { DrawdownTable } from "@/components/drawdown/DrawdownTable";
import { DrawdownChart } from "@/components/drawdown/DrawdownChart";
import { DrawdownATHScenario } from "@/components/drawdown/DrawdownATHScenario";
import { DrawdownHowToUse } from "@/components/drawdown/DrawdownHowToUse";
import { DrawdownCorrectionCalculator } from "@/components/drawdown/DrawdownCorrectionCalculator";
import { DrawdownFAQSection } from "@/components/drawdown/DrawdownFAQSection";
import { DrawdownCycleComparison } from "@/components/drawdown/DrawdownCycleComparison";
import { DrawdownContentSections } from "@/components/drawdown/DrawdownContentSections";
import { AffiliatePlacement } from "@/components/affiliateAI/AffiliatePlacement";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { fetchDrawdownData } from "@/services/drawdownService";
import { TrendingDown, AlertTriangle, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const BitcoinDrawdownCalculator = () => {
  const { language, t } = useLanguage();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["btc-drawdown-data"],
    queryFn: fetchDrawdownData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
  });

  return (
    <>
      <Helmet>
        <title>{t('dd.meta.title')}</title>
        <meta name="description" content={t('dd.meta.description')} />
        <meta name="keywords" content="bitcoin drawdown, bitcoin correction calculator, 30% correction calculator, bitcoin crash calculator, bitcoin max drawdown, bitcoin recovery time, BTC drawdown chart" />
        <link rel="canonical" href={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-dusus-analizi':'https://bitcoincalculator.tools/calculators/drawdown'} />

        <link rel="alternate" hrefLang="tr" href="https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-dusus-analizi" />
        <link rel="alternate" hrefLang="en" href="https://bitcoincalculator.tools/calculators/drawdown" />
        <link rel="alternate" hrefLang="x-default" href="https://bitcoincalculator.tools/calculators/drawdown" />
        <meta property="og:title" content={t('dd.meta.ogTitle')} />
        <meta property="og:description" content={t('dd.meta.ogDescription')} />
        <meta property="og:url" content={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-dusus-analizi':'https://bitcoincalculator.tools/calculators/drawdown'} />
        <meta property="og:type" content="website" />
        <HelmetOgImage slug="bitcoin-drawdown-calculator" enAlt={`Bitcoin Drawdown & Correction Calculator | bitcoincalculator.tools`} />
        <meta property="og:site_name" content="bitcoincalculator.tools" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('dd.meta.twitterTitle')} />
        <meta name="twitter:description" content={t('dd.meta.twitterDescription')} />
        <meta name="twitter:creator" content="@web3believers" />

        <meta name="twitter:site" content="@web3believers" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Bitcoin Drawdown Calculator",
            "description": "Bitcoin has crashed 80%+ four times. See every major drawdown, recovery time, and where the current correction sits in history. Are you in a buying zone?",
            "url": "https://bitcoincalculator.tools/calculators/drawdown",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Any",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
            "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools" },
            "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" }
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Use the Bitcoin Drawdown Calculator",
            "description": "Step-by-step guide to analyzing Bitcoin's historical crashes and drawdowns",
            "totalTime": "PT2M",
            "step": [
              { "@type": "HowToStep", "name": "Understand Key Metrics", "text": "Review current drawdown from ATH, worst crash, average drawdown, and average recovery time", "url": "https://bitcoincalculator.tools/calculators/drawdown#step1" },
              { "@type": "HowToStep", "name": "Analyze Crashes Table", "text": "Study the top 10 worst Bitcoin crashes ranked by severity with recovery times", "url": "https://bitcoincalculator.tools/calculators/drawdown#step2" },
              { "@type": "HowToStep", "name": "Visualize Crash Depth", "text": "Use the bar chart to see crash severity patterns over time", "url": "https://bitcoincalculator.tools/calculators/drawdown#step3" },
              { "@type": "HowToStep", "name": "Run ATH Scenario", "text": "Enter an investment amount to see what happens if you bought at the all-time high", "url": "https://bitcoincalculator.tools/calculators/drawdown#step4" }
            ]
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "inLanguage": language === 'tr' ? 'tr' : 'en',
            "mainEntity": (language === 'tr' ? [
              { q: "Bitcoin düşüşü nedir?", a: "Düşüş, yeni bir yüksek seviyeye ulaşılmadan önce Bitcoin'in fiyatındaki zirve-dip gerilemesidir. Düzeltme veya çöküş sırasında önceki tüm zamanlar yüksekten ne kadar değer kaybedildiğini ölçer. %50'lik bir düşüş, Bitcoin'in fiyatının zirvesinden yarıya indiği anlamına gelir." },
              { q: "Bitcoin'in en kötü çöküşü neydi?", a: "Bitcoin'in en kötü çöküşü, fiyatın yaklaşık 32 dolardan 2 doların altına düştüğü 2011'de yaşanan yaklaşık %93'lük düşüştü. Ancak bu yıkıcı düşüş bile eninde sonunda yeni tüm zamanlar yükseklerine kurtarıldı. Piyasa olgunlaştıkça daha yakın tarihli düzeltmeler daha az şiddetli olmuştur." },
              { q: "Bitcoin her zaman çöküşlerden kurtuldu mu?", a: "Evet. Tarihsel olarak tamamlanan her Bitcoin düşüşü eninde sonunda yeni tüm zamanlar yükseğine ulaşmak için kurtarıldı. Ancak kurtarma süreleri önemli ölçüde farklılık gösterir — küçük düzeltmeler için haftalar, büyük ayı piyasaları için iki yıldan fazla. Geçmişteki kurtarma, gelecekteki kurtarmanın garantisi değildir." },
              { q: "Düşüş sırasında almalı mıyım?", a: "Tarihsel olarak, derin düşüşler sırasında (özellikle %50'nin üzerinde) alım yapmak çok yıllı zaman dilimlerinde son derece kârlı olmuştur. Ancak kesin dipteki zamanlamayı yakalamak neredeyse imkânsızdır. Düşüş dönemlerinde dolar maliyeti ortalama (DMA) yapmak, toplu alım zamanlaması yapmaya çalışmaktan genel olarak daha düşük riskli bir strateji olarak kabul edilir." },
              { q: "ATH'den mevcut düşüş nasıl hesaplanır?", a: "Güncel düşüş şu formülle hesaplanır: ((ATH Fiyatı − Güncel Fiyat) / ATH Fiyatı) × %100. Bitcoin'in en yeni ATH'si 6 Ekim 2025'te kaydedilen 126.287 $; bugün 82.000 $ fiyat yaklaşık %35 düşüşe karşılık gelir. Veriler canlı CoinGecko fiyatından alınır; CryptoCompare ve yerel anlık görüntü yedek olarak çalışır." },
              { q: "Bitcoin kaç kez %80'den fazla düştü?", a: "Dört kez. Bitcoin tüm zamanlar yüksekten 2011'de (-%93), 2013 sonundan 2015'e (-%85), 2017'den 2018'e (-%84) ve 2021'den 2022'ye (-%77) %80'den fazla düştü. Her çöküş borsa başarısızlıklarından düzenleyici baskılara kadar farklı bir katalizörden tetiklendi; ancak Bitcoin her birinden yeni tüm zamanlar yükseklerine kurtarıldı." },
              { q: "Bitcoin'in tüm zamanların en kötü düşüşü neydi?", a: "En kötü düşüş, 2011'deki yaklaşık %93'lük düşüştü. Bitcoin yaklaşık beş ayda yaklaşık 32 dolardan 2 doların altına düştü. O dönemde deneyin sonu gibi görünüyordu. 18 ay içinde fiyat önceki zirvesini aştı ve 2013 sonunda 1.000 doların üzerine tırmanmaya devam etti." },
              { q: "Bitcoin her çöküşten kurtulmak için ne kadar zaman harcadı?", a: "Kurtarma süreleri 6 aydan 3 yıla kadar değişmektedir. Nisan 2013 flash çöküşü yaklaşık 6 ayda kurtarıldı. 2014 Mt. Gox ayı piyasası yaklaşık 36 ay sürdü. 2018 çöküşü de yaklaşık 36 aya ihtiyaç duydu. 2022 düşüşü, BTC'nin Mart 2024'te 69.000 doları geri kazanmasıyla yaklaşık 24 ayda kurtarıldı; ardından 6 Ekim 2025'te yeni 126.287 $ ATH'sine ulaştı." },
              { q: "2025–26 düzeltmesi 2022'den daha kötü mü?", a: "Henüz değil. Bitcoin 6 Ekim 2025'te 126.287 $ ile zirve yaptıktan sonra 2026 ortasına kadar yaklaşık %35 düştü — 2022 döngüsündeki -%77'nin oldukça altında. Spot ETF girişleri, Nisan 2024 halving'i ve kurumsal hazineler bu döngüde önceki döngülere göre daha yüksek bir taban tutuyor görünüyor." },
              { q: "Bitcoin hiç büyük bir çöküşten kurtarılamadı mı?", a: "Tamamlanan her Bitcoin düşüşü eninde sonunda yeni bir tüm zamanlar yüksek belirlemek için kurtarıldı. 6 Ekim 2025 ATH'si 126.287 $'dan başlayan düşüş, Mayıs 2026 itibarıyla hâlâ açık. Geçmişteki kurtarma gelecekteki kurtarmayı garanti etmez." },
            ] : [
              { q: "What is a Bitcoin drawdown?", a: "A drawdown is the peak-to-trough decline in Bitcoin's price before a new high is reached. It measures how much value is lost from a previous all-time high during a correction or crash. A 50% drawdown means Bitcoin's price fell by half from its peak." },
              { q: "What was Bitcoin's worst crash?", a: "Bitcoin's worst crash was approximately 93% in 2011 when the price fell from around $32 to under $2. However, even this devastating drawdown eventually recovered to new all-time highs. More recent corrections have been less severe as the market matures." },
              { q: "Has Bitcoin always recovered from crashes?", a: "Yes. Historically, every completed Bitcoin drawdown has eventually recovered to reach new all-time highs. However, recovery times vary significantly — from weeks for minor corrections to over two years for major bear markets. Past recovery is not a guarantee of future recovery." },
              { q: "Should I buy during a drawdown?", a: "Historically, buying during deep drawdowns (especially above 50%) has been extremely profitable over multi-year time horizons. However, timing the exact bottom is nearly impossible. Dollar-cost averaging (DCA) during drawdown periods is generally considered a lower-risk strategy than trying to time a lump-sum purchase." },
              { q: "How is current drawdown from ATH calculated?", a: "Current drawdown is calculated as ((ATH Price − Current Price) / ATH Price) × 100%. Bitcoin's most recent all-time high is $126,287 set on October 6, 2025, so a price of $82,000 today implies a drawdown of about 35%. The metric is updated in real-time using live CoinGecko price data, with CryptoCompare and a bundled snapshot as fallbacks." },
              { q: "How many times has Bitcoin dropped more than 80%?", a: "Four times. Bitcoin fell more than 80% from its all-time high in 2011 (-93%), late 2013 to 2015 (-85%), 2017 to 2018 (-84%), and 2021 to 2022 (-77%). Each crash was triggered by a different catalyst, from exchange failures to regulatory crackdowns, but Bitcoin recovered to new all-time highs after every single one." },
              { q: "What was Bitcoin's worst drawdown ever?", a: "The worst drawdown was approximately 93% in 2011. Bitcoin dropped from around $32 to under $2 in about five months. At the time, it looked like the end of the experiment. Within 18 months, the price surpassed its previous peak and continued climbing past $1,000 by late 2013." },
              { q: "How long did Bitcoin take to recover from each crash?", a: "Recovery times range from 6 months to 3 years. The April 2013 flash crash recovered in about 6 months. The 2014 Mt. Gox bear market took roughly 36 months. The 2018 crash also needed about 36 months. The 2022 drawdown recovered in approximately 24 months, with BTC reclaiming $69,000 in March 2024 and pushing on to a new $126,287 ATH on October 6, 2025." },
              { q: "Is the 2025–26 correction worse than 2022?", a: "Not so far. After topping at $126,287 on October 6, 2025, Bitcoin has corrected roughly 35% into mid-2026 — well short of the 2022 cycle's -77%. Spot ETF inflows, the April 2024 halving, and corporate treasuries appear to be holding a higher floor than previous cycles." },
              { q: "Has Bitcoin ever not recovered from a major crash?", a: "Every completed Bitcoin drawdown has eventually recovered to a new all-time high. The drawdown from the October 6, 2025 ATH of $126,287 is still open as of May 2026. Past recovery does not guarantee future recovery — each cycle carried real risk that prices might not return." },
            ]).map((f) => ({
              "@type": "Question",
              "name": f.q,
              "acceptedAnswer": { "@type": "Answer", "text": f.a }
            }))
          })}
        </script>

      </Helmet>

      <BreadcrumbSchema language={language}
        items={[
          { name: "Home", url: "https://bitcoincalculator.tools/" },
          { name: "Calculators", url: "https://bitcoincalculator.tools/calculators" },
          { name: "Drawdown Calculator", url: "https://bitcoincalculator.tools/calculators/drawdown" },
        ]}
      />

      <PageBackground variant="clean">
        <Header />

        <main id="main-content" className="pt-20 relative z-10">
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb items={[{ label: t('dd.crumb.calculators'), href: language==='tr'?'/tr/hesaplayicilar':'/calculators' }, { label: t('dd.crumb.current') }]} />
          </div>

          <section className="container mx-auto px-6 py-16 text-center">
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/10">
                <TrendingDown className="w-4 h-4" />
                {t('dd.hero.badge')}
              </div>
              <h1 className="text-h1 font-bold text-foreground">
                {t('dd.hero.titlePrefix')} <span className="text-gradient-premium">{t('dd.hero.titleHighlight')}</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('dd.hero.description')}
              </p>
              <div className="max-w-sm mx-auto">
                <CompactLiveBitcoinPrice currency="USD" />
              </div>
            </div>
          </section>

          <section className="container mx-auto px-6 pb-20">
            <div className="max-w-5xl mx-auto space-y-8">
              <OfflineIndicator />

              {isLoading && (
                <div className="flex items-center justify-center gap-3 py-16">
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  <span className="text-sm text-muted-foreground">{t('dd.loading')}</span>
                </div>
              )}

              {isError && (
                <div role="alert" aria-live="polite" className="flex items-start gap-3 bg-destructive/10 border border-destructive/20 rounded-xl p-4">
                  <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{t('dd.error.fetch')}</p>
                </div>
              )}

              {data && data.summary.dataSource === 'local' && (
                <div role="status" aria-live="polite" className="flex items-start gap-3 bg-warning/$3 border border-warning/20 rounded-xl p-4">
                  <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                  <p className="text-sm text-warning">
                    {t('dd.snapshot.prefix')}{new Date(data.summary.asOf + 'T00:00:00').toLocaleDateString(language==='tr'?'tr-TR':'en-US', { day:'numeric', month:'short', year:'numeric' })}{t('dd.snapshot.suffix')}
                  </p>
                </div>
              )}

              {data && (
                <>
                  <ErrorBoundary>
                    <DrawdownMetricCards summary={data.summary} />
                  </ErrorBoundary>

                  <ErrorBoundary>
                    <DrawdownCycleComparison />
                  </ErrorBoundary>

                  <ErrorBoundary>
                    <DrawdownTable periods={data.periods} summary={data.summary} />
                  </ErrorBoundary>

                  <ErrorBoundary>
                    <DrawdownChart periods={data.periods} />
                  </ErrorBoundary>

                  <ErrorBoundary>
                    <DrawdownATHScenario summary={data.summary} />
                  </ErrorBoundary>
                </>
              )}
            </div>
          </section>

          {/* SEO H2 Section */}
          <section className="container mx-auto px-6 pb-12">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-h2 font-bold text-foreground mb-4">
                {t('dd.section.title')}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('dd.section.body')}
              </p>
            </div>
          </section>

          {/* Correction Scenario Calculator */}
          {data && (
            <section className="container mx-auto px-6 pb-12">
              <div className="max-w-5xl mx-auto">
                <ErrorBoundary>
                  <DrawdownCorrectionCalculator currentPrice={data.summary.currentPrice} periods={data.periods} />
                </ErrorBoundary>
              </div>
            </section>
          )}

          <section className="container mx-auto px-6 pb-12">
            <div className="max-w-5xl mx-auto">
              <AffiliatePlacement slug="drawdown" lang="en" resultSignals={["accumulation", "long-term"]} />
            </div>
          </section>

          <DrawdownHowToUse />
          <DrawdownContentSections />
          <DrawdownFAQSection />
          <RelatedCalculators />

          <section className="container mx-auto px-6 pb-16">
            <div className="max-w-3xl mx-auto">
              <Card className="glass-morphism-card border-border/20 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{t('dd.disclaimer.title')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('dd.disclaimer.body')}
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

export default BitcoinDrawdownCalculator;
