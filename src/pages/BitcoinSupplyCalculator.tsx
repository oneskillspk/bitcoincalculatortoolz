import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AffiliatePlacement } from "@/components/affiliateAI/AffiliatePlacement";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { PageBackground } from "@/components/modern/PageBackground";
import { CompactLiveBitcoinPrice } from "@/components/CompactLiveBitcoinPrice";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import RelatedCalculators from "@/components/RelatedCalculators";
import { Card, CardContent } from "@/components/ui/card";
import { SupplyMetricCards } from "@/components/supply/SupplyMetricCards";
import { SupplyScheduleChart } from "@/components/supply/SupplyScheduleChart";
import { SupplyHowToUse } from "@/components/supply/SupplyHowToUse";
import { SupplyFAQSection } from "@/components/supply/SupplyFAQSection";
import { useQuery } from "@tanstack/react-query";
import { BitcoinSupplyService } from "@/services/bitcoinSupplyService";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { AlertTriangle, Coins, Database } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/hooks/useLocale";

const BitcoinSupplyCalculator = () => {
  const { language, t } = useLanguage();
  const { intlLocale } = useLocale();
  const [userBtc, setUserBtc] = useState(0);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["bitcoin-supply-data"],
    queryFn: () => BitcoinSupplyService.getSupplyData(),
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: 2,
  });

  const estimatedLost = 3700000;
  const effectiveSupply = data ? data.currentSupply - estimatedLost : 0;

  return (
    <>
      <Helmet>
        <title>{t('supply.meta.title')}</title>
        <meta name="description" content={t('supply.meta.description')} />
        <meta name="keywords" content="how much bitcoin is left, bitcoin supply, bitcoin scarcity, lost bitcoin calculator, bitcoin circulation, bitcoin 21 million" />
        <link rel="canonical" href={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-arz':'https://bitcoincalculator.tools/calculators/supply'} />

        <link rel="alternate" hrefLang="tr" href="https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-arz" />
        <link rel="alternate" hrefLang="en" href="https://bitcoincalculator.tools/calculators/supply" />
        <link rel="alternate" hrefLang="x-default" href="https://bitcoincalculator.tools/calculators/supply" />
        <meta property="og:title" content={t('supply.meta.ogTitle')} />
        <meta property="og:description" content={t('supply.meta.ogDescription')} />
        <meta property="og:url" content={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-arz':'https://bitcoincalculator.tools/calculators/supply'} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={(typeof window !== 'undefined' && window.location.pathname.startsWith('/tr')) ? 'https://bitcoincalculator.tools/bitcoin-kar-hesaplayici-og.webp' : 'https://bitcoincalculator.tools/social-preview.webp'} />
        <meta property="og:image:alt" content={(typeof window !== 'undefined' && window.location.pathname.startsWith('/tr')) ? 'Bitcoin Hesaplayıcıları — 45+ Ücretsiz Araç | bitcoincalculator.tools' : 'Bitcoin Supply Calculator | bitcoincalculator.tools'} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="bitcoincalculator.tools" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('supply.meta.twitterTitle')} />
        <meta name="twitter:description" content={t('supply.meta.twitterDescription')} />
        <meta name="twitter:image" content={(typeof window !== 'undefined' && window.location.pathname.startsWith('/tr')) ? 'https://bitcoincalculator.tools/bitcoin-kar-hesaplayici-og.webp' : 'https://bitcoincalculator.tools/social-preview.webp'} />
        <meta name="twitter:creator" content="@web3believers" />


        <meta name="twitter:site" content="@web3believers" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Bitcoin Supply Calculator",
            "description": "How much Bitcoin is left to mine? Live circulating supply, coins yet to be mined, estimated lost BTC, and your stack as a % of total supply.",
            "url": "https://bitcoincalculator.tools/calculators/supply",
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
            "name": "How to Use the Bitcoin Supply Calculator",
            "description": "Step-by-step guide to understanding Bitcoin's supply and scarcity",
            "totalTime": "PT2M",
            "step": [
              { "@type": "HowToStep", "name": "View Live Supply", "text": "See current circulating supply, percentage mined, and remaining BTC", "url": "https://bitcoincalculator.tools/calculators/supply#step1" },
              { "@type": "HowToStep", "name": "Explore Supply Curve", "text": "Study the supply schedule from 2009 to 2140", "url": "https://bitcoincalculator.tools/calculators/supply#step2" },
              { "@type": "HowToStep", "name": "Check Your Stack %", "text": "Enter your BTC to see what % of total supply you own", "url": "https://bitcoincalculator.tools/calculators/supply#step3" },
              { "@type": "HowToStep", "name": "Understand Scarcity", "text": "Learn about lost BTC and effective supply", "url": "https://bitcoincalculator.tools/calculators/supply#step4" }
            ]
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "inLanguage": language === 'tr' ? 'tr' : 'en',
            "mainEntity": (language === 'tr' ? [
              { q: "Daha ne kadar Bitcoin madenciliği yapılacak?", a: "21 milyonluk sabit tavanın yaklaşık 1,2 milyon BTC'si henüz çıkarılmamıştır. Son bitcoin yaklaşık 2140 yılında çıkarılacaktır." },
              { q: "Kalıcı olarak kaybedilen bitcoin sayısı ne kadar?", a: "Tahminler unutulan parolalar, kayıp donanımlar ve Satoshi'nin hareket etmemiş coin'leri nedeniyle 3 ila 4 milyon BTC'nin kalıcı olarak kaybolduğunu söyler." },
              { q: "Tüm Bitcoin çıkarıldığında ne olacak?", a: "Madenciler tamamen işlem ücretlerine bağlı olacak. Geçiş kademelidir; çünkü blok ödülleri yaklaşık her 4 yılda bir yarıya iner." },
              { q: "Bitcoin'in mevcut enflasyon oranı nedir?", a: "4. halving'in (2024) ardından Bitcoin'in yıllık enflasyonu yaklaşık %0,85'tir; altının yaklaşık %1,5'inden daha düşüktür." },
              { q: "21 milyonluk tavan değiştirilebilir mi?", a: "Bir mutabakat değişikliği teorik olarak değiştirebilir, ancak bu neredeyse evrensel mutabakat gerektirdiği için fiilen imkânsız sayılır." },
              { q: "Toplam kaç adet Bitcoin var?", a: "Bitcoin'in sabit maksimum arzı 21 milyon coin'dir. Bugüne kadar yaklaşık 19,8 milyon BTC çıkarılmıştır. Bitcoin arz hesaplayıcımız canlı dolaşımdaki arzı, tahmini kayıp coin'leri ve henüz çıkarılmamış coin'leri gösterir." },
              { q: "Bitcoin paranın eşdeğeri midir?", a: "Bitcoin bir değer saklama aracı ve değişim aracı olarak işlev görür; ancak 21 milyon coin'lik sabit arzıyla fiat paradan ayrılır — hiçbir hükümet veya merkez bankası tarafından şişirilemez." }
            ] : [
              { q: "How much Bitcoin is left to mine?", a: "Approximately 1.2 million BTC remain unmined out of the 21 million hard cap. The last bitcoin will be mined around 2140." },
              { q: "How many bitcoins are lost forever?", a: "Estimates range from 3 to 4 million BTC lost permanently due to forgotten passwords, lost hardware, and Satoshi's unmoved coins." },
              { q: "What happens when all Bitcoin is mined?", a: "Miners will rely entirely on transaction fees. The transition is gradual as block rewards halve every ~4 years." },
              { q: "What is Bitcoin's current inflation rate?", a: "After the 4th halving (2024), Bitcoin's annual inflation is ~0.85%, lower than gold's ~1.5%." },
              { q: "Can the 21 million cap be changed?", a: "A consensus change could theoretically modify it, but this requires near-universal agreement and is considered virtually impossible." },
              { q: "How many Bitcoin are there in total?", a: "Bitcoin has a fixed maximum supply of 21 million coins. As of today, approximately 19.8 million BTC have been mined. Our Bitcoin supply calculator shows live circulating supply, estimated lost coins, and coins yet to be mined." },
              { q: "Is Bitcoin equivalent to money?", a: "Bitcoin functions as a store of value and medium of exchange, but differs from fiat money in that it has a fixed supply of 21 million coins — it cannot be inflated by any government or central bank." }
            ]).map(({q,a}) => ({ "@type": "Question", "name": q, "acceptedAnswer": { "@type": "Answer", "text": a } }))
          })}
        </script>

      </Helmet>

      <BreadcrumbSchema language={language}
        items={[
          { name: "Home", url: "https://bitcoincalculator.tools/" },
          { name: "Calculators", url: "https://bitcoincalculator.tools/calculators" },
          { name: "Supply Calculator", url: "https://bitcoincalculator.tools/calculators/supply" },
        ]}
      />

      <PageBackground variant="clean">
        <Header />

        <main id="main-content" className="pt-20 relative z-10">
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb items={[{ label: t('supply.crumb.calculators'), href: language==='tr'?'/tr/hesaplayicilar':'/calculators' }, { label: t('supply.crumb.current') }]} />
          </div>

          <section className="container mx-auto px-6 py-16 text-center">
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/10">
                <Coins className="w-4 h-4" />
                {t('supply.hero.badge')}
              </div>
              <h1 className="text-h1 font-bold text-foreground">
                {t('supply.hero.titlePrefix')} <span className="text-gradient-premium">{t('supply.hero.titleMiddle')}</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('supply.hero.description')}
              </p>
              <div className="max-w-sm mx-auto">
                <CompactLiveBitcoinPrice currency="USD" />
              </div>
            </div>
          </section>

          <section className="container mx-auto px-6 pb-20">
            <div className="max-w-6xl mx-auto space-y-10">
              <OfflineIndicator />

              {isError && (
                <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  <p className="text-sm text-amber-600">{t('supply.error.body')}</p>
                </div>
              )}

              <ErrorBoundary>
                <SupplyMetricCards data={data} loading={isLoading} userBtc={userBtc} />
              </ErrorBoundary>

              {/* User BTC input */}
              <Card className="glass-morphism-card border-border/20 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">{t('supply.input.title')}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{t('supply.input.body')}</p>
                  <div className="flex gap-3 items-center max-w-md">
                    <Input
                      type="number"
                      placeholder="e.g. 0.5"
                      min={0}
                      step={0.001}
                      value={userBtc || ''}
                      onChange={(e) => setUserBtc(parseFloat(e.target.value) || 0)}
                      className="max-w-[200px]"
                    />
                    <span className="text-sm text-muted-foreground">BTC</span>
                  </div>
                  {userBtc > 0 && data && (
                    <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/10">
                      <p className="text-sm text-foreground">
                        {t('supply.input.resultPart1')}<strong>{((userBtc / data.currentSupply) * 100).toFixed(8)}%</strong>{t('supply.input.resultPart2')}<strong>{((userBtc / effectiveSupply) * 100).toFixed(8)}%</strong>{t('supply.input.resultPart3')}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Lost BTC panel */}
              <Card className="glass-morphism-card border-border/20 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">{t('supply.lost.title')}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-muted/20">
                      <p className="text-2xl font-bold text-foreground">~3.7M BTC</p>
                      <p className="text-xs text-muted-foreground">{t('supply.lost.permanent')}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/20">
                      <p className="text-2xl font-bold text-foreground">~1.1M BTC</p>
                      <p className="text-xs text-muted-foreground">{t('supply.lost.satoshi')}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/20">
                      <p className="text-2xl font-bold text-foreground">{effectiveSupply > 0 ? `~${(effectiveSupply / 1e6).toFixed(1)}M` : "—"}</p>
                      <p className="text-xs text-muted-foreground">{t('supply.lost.effective')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <ErrorBoundary>
                <SupplyScheduleChart />
              </ErrorBoundary>

              {/* Next halving */}
              {data && (
                <Card className="glass-morphism-card border-border/20 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-3">{t('supply.next.title')}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                        <p className="text-xl font-bold text-foreground">{t('supply.next.block')} {data.nextHalving.blockHeight.toLocaleString(intlLocale)}</p>
                        <p className="text-xs text-muted-foreground">{t('supply.next.blockHeight')}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                        <p className="text-xl font-bold text-foreground">{data.nextHalving.blocksRemaining.toLocaleString(intlLocale)}</p>
                        <p className="text-xs text-muted-foreground">{t('supply.next.blocksRemaining')}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                        <p className="text-xl font-bold text-foreground">{new Date(data.nextHalving.estimatedDate).toLocaleDateString(language==='tr'?'tr-TR':'en-US', { year: 'numeric', month: 'short' })}</p>
                        <p className="text-xs text-muted-foreground">{t('supply.next.estDate')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/20 rounded-xl p-4">
                <Database className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{t('supply.dataSource')}</span>
              </div>
            </div>
          </section>

          <SupplyHowToUse />
          <SupplyFAQSection />
          <div className="container mx-auto px-6 max-w-5xl"><AffiliatePlacement slug="supply" /></div>
          <RelatedCalculators />

          <section className="container mx-auto px-6 pb-16">
            <div className="max-w-3xl mx-auto">
              <Card className="glass-morphism-card border-border/20 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{t('supply.disclaimer.title')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('supply.disclaimer.body')}
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

export default BitcoinSupplyCalculator;
