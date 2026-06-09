import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AffiliatePlacement } from "@/components/affiliateAI/AffiliatePlacement";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { PageBackground } from "@/components/modern/PageBackground";
import { StakingInputPanel } from "@/components/staking/StakingInputPanel";
import { StakingResultsPanel } from "@/components/staking/StakingResultsPanel";
import { StakingRewardsChart } from "@/components/staking/StakingRewardsChart";
import { StakingComparisonTable } from "@/components/staking/StakingComparisonTable";
import { StakingHowToUse } from "@/components/staking/StakingHowToUse";
import { StakingFAQSection } from "@/components/staking/StakingFAQSection";
import { CompactLiveBitcoinPrice } from "@/components/CompactLiveBitcoinPrice";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import RelatedCalculators from "@/components/RelatedCalculators";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { bitcoinApi } from "@/services/bitcoinApi";
import {
  calculateStakingRewards,
  compareAllProtocols,
  type StakingInput,
  type StakingResult,
} from "@/services/stakingCalculator";
import { AlertTriangle, Percent } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { buildCalculatorSpeakable } from '@/components/seo/calculatorSpeakable';

const BitcoinStakingCalculator = () => {
  const { language, t } = useLanguage();
  const [result, setResult] = useState<StakingResult | null>(null);
  const [allResults, setAllResults] = useState<StakingResult[]>([]);
  const [lastInput, setLastInput] = useState<StakingInput | null>(null);

  const { data: priceData } = useQuery({
    queryKey: ["bitcoin-price-usd"],
    queryFn: () => bitcoinApi.getCurrentPrice("USD"),
    staleTime: 60_000,
  });

  const btcPrice = priceData ?? 100000;

  const handleCalculate = useCallback(
    (input: StakingInput) => {
      setLastInput(input);
      const r = calculateStakingRewards(input, btcPrice);
      if (r) setResult(r);
      const allR = compareAllProtocols(input.btcAmount, input.years, input.compounding, btcPrice);
      setAllResults(allR);
    },
    [btcPrice],
  );

  return (
    <>
      <Helmet>
        <title>{t('staking.meta.title')}</title>
        <meta name="description" content={t('staking.meta.description')} />
        <meta name="keywords" content="bitcoin staking calculator, BTC staking rewards, bitcoin yield calculator, Babylon staking, bitcoin APY, bitcoin staking 2026" />
        <link rel="canonical" href={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-staking':'https://bitcoincalculator.tools/calculators/staking'} />

        <link rel="alternate" hrefLang="tr" href="https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-staking" />
        <link rel="alternate" hrefLang="en" href="https://bitcoincalculator.tools/calculators/staking" />
        <link rel="alternate" hrefLang="x-default" href="https://bitcoincalculator.tools/calculators/staking" />
        <meta property="og:title" content={t('staking.meta.title')} />
        <meta property="og:description" content={t('staking.meta.ogDescription')} />
        <meta property="og:url" content={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-staking':'https://bitcoincalculator.tools/calculators/staking'} />
        <meta property="og:type" content="website" />
        <HelmetOgImage slug="bitcoin-staking-calculator" enAlt={`Bitcoin Staking Calculator | bitcoincalculator.tools`} />
        <meta property="og:site_name" content="bitcoincalculator.tools" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('staking.meta.title')} />
        <meta name="twitter:description" content={t('staking.meta.twitterDescription')} />
        <meta name="twitter:creator" content="@web3believers" />

        <meta name="twitter:site" content="@web3believers" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Bitcoin Staking Calculator",
            "description": "Compare Babylon, Lido wBTC and Binance Earn Bitcoin staking yields. See projected BTC earnings at current APY rates over 1, 3 and 5 years. Updated March 2026.",
            "url": "https://bitcoincalculator.tools/calculators/staking",
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
            "name": "How to Use the Bitcoin Staking Calculator",
            "description": "Step-by-step guide to calculating Bitcoin staking rewards across multiple protocols",
            "totalTime": "PT2M",
            "step": [
              { "@type": "HowToStep", "name": "Enter BTC Amount", "text": "Type your Bitcoin principal or pick from presets: 0.1, 0.5, 1, or 5 BTC", "url": "https://bitcoincalculator.tools/calculators/staking#step1" },
              { "@type": "HowToStep", "name": "Select Protocol", "text": "Choose Babylon, Lido wBTC, Binance Flexible, or Binance 30-Day to set the APY", "url": "https://bitcoincalculator.tools/calculators/staking#step2" },
              { "@type": "HowToStep", "name": "Set Duration & Compounding", "text": "Slide the duration from 1 to 10 years and toggle compound vs simple interest", "url": "https://bitcoincalculator.tools/calculators/staking#step3" },
              { "@type": "HowToStep", "name": "Review Rewards & Compare", "text": "Read your BTC rewards, USD value, and compare all protocols side-by-side in the table", "url": "https://bitcoincalculator.tools/calculators/staking#step4" }
            ]
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "inLanguage": language === 'tr' ? 'tr' : 'en',
            "mainEntity": (language === 'tr' ? [
              { q: "Bitcoin staking nedir?", a: "Bitcoin staking, getiri kazanmak için BTC'yi (veya sarmalanmış BTC'yi) bir protokolde kilitlemektir. Babylon gibi platformlar saklamasız doğal BTC staking için kriptografik zaman kilitli komut dosyaları kullanır. Lido BTC'yi DeFi'ye sarmalar, Binance Earn ise saklamalı borç verme kullanır." },
              { q: "Bitcoin staking güvenli mi?", a: "Risk protokole göre değişir. Babylon (saklamasız) en düşük risklidir. Lido wBTC akıllı sözleşme riski getirir. Binance Earn saklamalıdır — karşı taraf olarak Binance'e güvenirsiniz. Yalnızca kaybetmeyi göze alabileceğiniz kadarını stake edin." },
              { q: "Babylon Protokolü nedir?", a: "Babylon, BTC'yi stake etmek için Bitcoin'in yerel betik dilini kullanır — köprü yok, sarmalama yok. BTC'niz Bitcoin zincirinde kalır ve Babylon'un PoS doğrulayıcı ağını güvence altına alır." },
              { q: "Bileşik ve basit staking arasındaki fark nedir?", a: "Basit faiz: Ödüller = Anapara × APY × Yıl. Bileşik: Sonuç = Anapara × (1 + APY)^Yıl. Bileşik, yıllık ödülleri yeniden yatırır ve uzun vadede daha yüksek bakiyeler üretir." },
              { q: "Staking APY oranları ne sıklıkla değişir?", a: "APY oranları sıkça — bazen günlük — değişir. Babylon'un oranı PoS talebine bağlıdır, Lido DeFi piyasalarıyla değişir, Binance haftalık ayarlar. Güncel oranları her protokolün resmi sitesinden doğrulayın." },
              { q: "Bitcoin getiri hesaplayıcı nedir?", a: "Bitcoin getiri hesaplayıcı, varlıklarınızı stake ederek veya borç vererek zaman içinde ne kadar BTC kazanabileceğinizi tahmin eder. Hesaplayıcımız Babylon, Lido wBTC ve Binance Earn arasındaki getiri oranlarını karşılaştırır — 1 ila 10 yıl için hem basit hem bileşik faiz projeksiyonlarıyla." }
            ] : [
              { q: "What is Bitcoin staking?", a: "Bitcoin staking is locking BTC (or wrapped BTC) in a protocol to earn yield. Platforms like Babylon use cryptographic time-lock scripts for non-custodial native BTC staking. Others like Lido wrap BTC into DeFi, and Binance Earn uses custodial lending." },
              { q: "Is Bitcoin staking safe?", a: "Risk varies by protocol. Babylon (non-custodial) is lowest risk. Lido wBTC introduces smart contract risk. Binance Earn is custodial — you trust Binance as counterparty. Always stake only what you can afford to lose." },
              { q: "What is Babylon Protocol?", a: "Babylon uses Bitcoin's native scripting language — no bridge, no wrapping — to stake BTC via cryptographic time-lock contracts. Your BTC stays on Bitcoin's chain and secures Babylon's PoS validator network." },
              { q: "Compound vs simple staking: what is the difference?", a: "Simple interest: Rewards = Principal × APY × Years. Compound: Final = Principal × (1 + APY)^Years. Compounding reinvests annual rewards, producing higher balances over longer periods." },
              { q: "How often do staking APYs change?", a: "APY rates change frequently — sometimes daily. Babylon's rate depends on PoS demand, Lido shifts with DeFi markets, and Binance adjusts weekly. Always verify current rates on each protocol's official site." },
              { q: "What is a Bitcoin yield calculator?", a: "A Bitcoin yield calculator estimates how much BTC you can earn by staking or lending your holdings over time. Our calculator compares yield rates across Babylon, Lido wBTC, and Binance Earn — with both simple and compound interest projections over 1 to 10 years." }
            ]).map(({q,a}) => ({ "@type": "Question", "name": q, "acceptedAnswer": { "@type": "Answer", "text": a } }))
          })}
        </script>

              <script type="application/ld+json">{JSON.stringify(buildCalculatorSpeakable(language === 'tr' ? 'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-staking' : 'https://bitcoincalculator.tools/calculators/staking', language))}</script>
      </Helmet>

      <BreadcrumbSchema language={language}
        items={[
          { name: "Home", url: "https://bitcoincalculator.tools/" },
          { name: "Calculators", url: "https://bitcoincalculator.tools/calculators" },
          { name: "Staking Calculator", url: "https://bitcoincalculator.tools/calculators/staking" },
        ]}
      />

      <PageBackground variant="clean">
        <Header />

        <main id="main-content" className="pt-20 relative z-10">
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb
              items={[
                { label: t('staking.crumb.calculators'), href: language==='tr'?'/tr/hesaplayicilar':'/calculators' },
                { label: t('staking.crumb.current') },
              ]}
            />
          </div>

          {/* Hero */}
          <section className="container mx-auto px-6 py-16 text-center">
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/10">
                <Percent className="w-4 h-4" />
                {t('staking.hero.badge')}
              </div>

              <h1 className="text-h1 font-bold text-foreground">
                {t('staking.hero.titlePrefix')} <span className="text-gradient-premium">{t('staking.hero.titleSuffix')}</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('staking.hero.description')}
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

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <StakingInputPanel onCalculate={handleCalculate} />
                </div>
                <div>
                  <ErrorBoundary>
                    {result ? (
                      <StakingResultsPanel result={result} />
                    ) : (
                      <Card className="glass-morphism-card border-border/20 shadow-sm">
                        <CardContent className="p-8 text-center">
                          <div className="space-y-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                              <Percent className="w-6 h-6 text-primary" />
                            </div>
                            <div className="space-y-1">
                              <h3 className="text-lg font-semibold text-foreground">{t('staking.placeholder.title')}</h3>
                              <p className="text-sm text-muted-foreground">
                                {t('staking.placeholder.desc')}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </ErrorBoundary>
                </div>
              </div>

              {/* Rewards Chart */}
              {result && allResults.length > 0 && (
                <div className="animate-fade-in">
                  <StakingRewardsChart result={result} allResults={allResults} />
                </div>
              )}

              {/* Comparison Table */}
              {lastInput && (
                <div className="animate-fade-in">
                  <StakingComparisonTable
                    btcAmount={lastInput.btcAmount}
                    selectedProtocolId={lastInput.protocolId}
                    btcPrice={btcPrice}
                    compounding={lastInput.compounding}
                  />
                </div>
              )}
            </div>
          </section>

          <StakingHowToUse />
          <StakingFAQSection />
          <div className="container mx-auto px-6 max-w-5xl"><AffiliatePlacement slug="staking" /></div>
          <RelatedCalculators />

          {/* Disclaimer */}
          <section className="container mx-auto px-6 pb-16">
            <div className="max-w-3xl mx-auto">
              <Card className="glass-morphism-card border-border/20 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{t('staking.disclaimer.title')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('staking.disclaimer.body')}
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

export default BitcoinStakingCalculator;
