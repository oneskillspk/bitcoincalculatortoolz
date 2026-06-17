import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { PageBackground } from "@/components/modern/PageBackground";
import { PowerLawInputPanel } from "@/components/power-law/PowerLawInputPanel";
import { PowerLawResultsPanel } from "@/components/power-law/PowerLawResultsPanel";
import { PowerLawChart } from "@/components/power-law/PowerLawChart";
import { PowerLawHowToUse } from "@/components/power-law/PowerLawHowToUse";
import { PowerLawFAQSection } from "@/components/power-law/PowerLawFAQSection";
import { PowerLawContentSections } from "@/components/power-law/PowerLawContentSections";
import { PowerLawProjectionTable } from "@/components/power-law/PowerLawProjectionTable";
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
import { calculatePowerLawPrice, calculateDeviation, PowerLawResult, DeviationResult } from "@/services/powerLawCalculator";
import { AlertTriangle, TrendingUp, Calculator } from "lucide-react";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocalizedSchema } from "@/hooks/useLocalizedSchema";

import { HelmetOgImage } from "@/components/seo/HelmetOgImage";
const BitcoinPowerLawCalculator = () => {
  const { language, t } = useLanguage();
  const defaultDate = new Date();
  defaultDate.setFullYear(defaultDate.getFullYear() + 1);

  const [targetDate, setTargetDate] = useState<Date>(defaultDate);
  const [result, setResult] = useState<PowerLawResult | null>(null);
  const [deviation, setDeviation] = useState<DeviationResult | null>(null);

  const { data: currentPrice } = useQuery({
    queryKey: ['current-btc-price', 'USD'],
    queryFn: () => bitcoinApi.getCurrentPrice('USD'),
    refetchInterval: 30000,
    retry: 2,
  });

  const handleCalculate = useCallback((date: Date) => {
    setTargetDate(date);
    const r = calculatePowerLawPrice(date);
    setResult(r);
    if (currentPrice) {
      setDeviation(calculateDeviation(currentPrice));
    }
  }, [currentPrice]);

  // Auto-calculate on mount and when price updates
  useEffect(() => {
    handleCalculate(targetDate);
  }, [currentPrice]);

  const enUrl = 'https://bitcoincalculator.tools/calculators/power-law';
  const trUrl = 'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-guc-yasasi';
  const canonicalUrl = language === 'tr' ? trUrl : enUrl;

  const webAppSchema = useLocalizedSchema(
    {
      "@context": "https://schema.org", "@type": "WebApplication", inLanguage: "en",
      "name": "Bitcoin Power Law Calculator",
      "description": "Free Bitcoin Power Law calculator. Project future BTC prices using Santostasi's regression model with support, fair value, and resistance bands.",
      "url": enUrl, "applicationCategory": "FinanceApplication", "operatingSystem": "Any",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools" },
      "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
    },
    {
      "@context": "https://schema.org", "@type": "WebApplication", inLanguage: "tr",
      "name": "Bitcoin Güç Yasası Hesaplayıcısı",
      "description": "Ücretsiz Bitcoin Güç Yasası hesaplayıcısı. Santostasi'nin regresyon modeliyle destek, gerçek değer ve direnç bantlarını kullanarak gelecekteki BTC fiyatlarını öngörün.",
      "url": trUrl, "applicationCategory": "FinanceApplication", "operatingSystem": "Any",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "TRY" },
      "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools" },
      "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
    },
  );

  const howToSchema = useLocalizedSchema(
    {
      "@context": "https://schema.org", "@type": "HowTo", inLanguage: "en",
      "name": "How to Use the Bitcoin Power Law Calculator",
      "description": "Step-by-step guide to project Bitcoin prices using the Power Law model",
      "totalTime": "PT2M",
      "step": [
        { "@type": "HowToStep", "name": "Select a Target Date", "text": "Pick a future date using the date picker or quick preset buttons (2026, 2028, 2030, 2035)", "url": `${enUrl}#step1` },
        { "@type": "HowToStep", "name": "View Projected Price Range", "text": "See the Power Law fair value, support, and resistance bands for your chosen date", "url": `${enUrl}#step2` },
        { "@type": "HowToStep", "name": "Check Current Deviation", "text": "See whether Bitcoin is currently undervalued or overvalued vs the Power Law model", "url": `${enUrl}#step3` },
        { "@type": "HowToStep", "name": "Export Your Report", "text": "Download a PNG or PDF report of your Power Law analysis", "url": `${enUrl}#step4` },
      ],
    },
    {
      "@context": "https://schema.org", "@type": "HowTo", inLanguage: "tr",
      "name": "Bitcoin Güç Yasası Hesaplayıcısı Nasıl Kullanılır",
      "description": "Güç Yasası modelini kullanarak Bitcoin fiyatlarını öngörmek için adım adım rehber",
      "totalTime": "PT2M",
      "step": [
        { "@type": "HowToStep", "name": "Hedef Tarih Seçin", "text": "Tarih seçici veya hızlı ön ayar düğmelerini (2026, 2028, 2030, 2035) kullanarak gelecek bir tarih seçin", "url": `${trUrl}#step1` },
        { "@type": "HowToStep", "name": "Öngörülen Fiyat Aralığını Görüntüleyin", "text": "Seçtiğiniz tarih için Güç Yasası gerçek değerini, destek ve direnç bantlarını görün", "url": `${trUrl}#step2` },
        { "@type": "HowToStep", "name": "Mevcut Sapmayı Kontrol Edin", "text": "Bitcoin'in Güç Yasası modeline göre şu anda değerinin altında mı yoksa üstünde mi işlem gördüğünü görün", "url": `${trUrl}#step3` },
        { "@type": "HowToStep", "name": "Raporunuzu Dışa Aktarın", "text": "Güç Yasası analizinizin PNG veya PDF raporunu indirin", "url": `${trUrl}#step4` },
      ],
    },
  );

  const faqSchema = useLocalizedSchema(
    {
      "@context": "https://schema.org", "@type": "FAQPage", inLanguage: "en",
      "mainEntity": [
        { "@type": "Question", "name": "What is the Bitcoin Power Law?", "acceptedAnswer": { "@type": "Answer", "text": "The Bitcoin Power Law is a mathematical model showing that Bitcoin's price follows a power-law relationship with time since its Genesis Block (January 3, 2009). The formula is Price = A × (days)^n." }},
        { "@type": "Question", "name": "Who created the Power Law model?", "acceptedAnswer": { "@type": "Answer", "text": "It was developed by astrophysicist Giovanni Santostasi, who applied physics techniques to Bitcoin's price history." }},
        { "@type": "Question", "name": "How accurate is the Power Law model?", "acceptedAnswer": { "@type": "Answer", "text": "The Power Law has shown a strong historical fit with an R² above 0.95 on log-log scale since 2009. It is a statistical regression — not a guarantee — and works best as a long-term framework." }},
        { "@type": "Question", "name": "What are the support and resistance bands?", "acceptedAnswer": { "@type": "Answer", "text": "The support band is roughly fair value ÷ 3, while the resistance band is fair value × 3 — a confidence corridor around the trend." }},
        { "@type": "Question", "name": "What are the limitations of the Power Law?", "acceptedAnswer": { "@type": "Answer", "text": "The model assumes past power-law relationships continue indefinitely. It cannot predict short-term volatility or black swan events." }},
        { "@type": "Question", "name": "What is the Power Law floor price?", "acceptedAnswer": { "@type": "Answer", "text": "The Power Law floor (support band) is calculated as the fair value divided by 3. Bitcoin has historically rarely traded below this line for extended periods." }},
      ],
    },
    {
      "@context": "https://schema.org", "@type": "FAQPage", inLanguage: "tr",
      "mainEntity": [
        { "@type": "Question", "name": "Bitcoin Güç Yasası nedir?", "acceptedAnswer": { "@type": "Answer", "text": "Bitcoin Güç Yasası, Bitcoin'in fiyatının Genesis Block (3 Ocak 2009) tarihinden bu yana zamanla bir güç yasası ilişkisi izlediğini gösteren matematiksel bir modeldir. Formül: Fiyat = A × (gün)^n." }},
        { "@type": "Question", "name": "Güç Yasası modelini kim oluşturdu?", "acceptedAnswer": { "@type": "Answer", "text": "Astrofizikçi Giovanni Santostasi tarafından geliştirilmiştir; Bitcoin'in fiyat tarihine fizik tekniklerini uygulamıştır." }},
        { "@type": "Question", "name": "Güç Yasası modeli ne kadar doğrudur?", "acceptedAnswer": { "@type": "Answer", "text": "2009'dan bu yana log-log ölçekte R² 0,95 üzerinde güçlü bir tarihsel uyum göstermiştir. Bu bir istatistiksel regresyondur, garanti değildir ve uzun vadeli bir çerçeve olarak en iyi şekilde çalışır." }},
        { "@type": "Question", "name": "Destek ve direnç bantları nelerdir?", "acceptedAnswer": { "@type": "Answer", "text": "Destek bandı yaklaşık olarak gerçek değer ÷ 3, direnç bandı ise gerçek değer × 3'tür — trend etrafında bir güven koridoru." }},
        { "@type": "Question", "name": "Güç Yasası'nın sınırlamaları nelerdir?", "acceptedAnswer": { "@type": "Answer", "text": "Model, geçmiş güç yasası ilişkilerinin süresiz devam ettiğini varsayar. Kısa vadeli oynaklığı veya kara kuğu olaylarını tahmin edemez." }},
        { "@type": "Question", "name": "Güç Yasası taban fiyatı nedir?", "acceptedAnswer": { "@type": "Answer", "text": "Güç Yasası tabanı (destek bandı) gerçek değer ÷ 3 olarak hesaplanır. Bitcoin tarihsel olarak bu çizginin altında uzun süre işlem görmemiştir." }},
      ],
    },
  );


  return (
    <>
<Helmet>
  <title>{t('powerlaw.meta.title')}</title>
  <meta name="description" content={t('powerlaw.meta.description')} />
  <link rel="canonical" href={canonicalUrl} />

  <link rel="alternate" hrefLang="tr" href="https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-guc-yasasi" />
  <link rel="alternate" hrefLang="en" href="https://bitcoincalculator.tools/calculators/power-law" />
  <link rel="alternate" hrefLang="x-default" href="https://bitcoincalculator.tools/calculators/power-law" />
  <meta property="og:title" content={t('powerlaw.meta.title')} />
  <meta property="og:description" content={t('powerlaw.meta.ogDescription')} />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="bitcoincalculator.tools" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={t('powerlaw.meta.title')} />
  <meta name="twitter:description" content={t('powerlaw.meta.twitterDescription')} />
  <meta name="twitter:creator" content="@web3believers" />

        <meta name="twitter:site" content="@web3believers" />
        <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
  <HelmetOgImage slug="bitcoin-power-law-calculator" enAlt={`Bitcoin Power Law Calculator | bitcoincalculator.tools`} />

      <BreadcrumbSchema
        language={language}
        items={language === 'tr' ? [
          { name: "Ana Sayfa", url: "https://bitcoincalculator.tools/tr/" },
          { name: "Hesaplayıcılar", url: "https://bitcoincalculator.tools/tr/hesaplayicilar" },
          { name: "Güç Yasası Hesaplayıcısı", url: trUrl },
        ] : [
          { name: "Home", url: "https://bitcoincalculator.tools/" },
          { name: "Calculators", url: "https://bitcoincalculator.tools/calculators" },
          { name: "Power Law Calculator", url: enUrl },
        ]}
      />

      <PageBackground variant="clean">
        <Header />

        <main id="main-content" className="pt-20 relative z-10">
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb
              items={[
                { label: t('powerlaw.crumb.calculators'), href: language==='tr'?'/tr/hesaplayicilar':'/calculators' },
                { label: t('powerlaw.crumb.current') }
              ]}
            />
          </div>

          {/* Header */}
          <section className="container mx-auto px-6 py-16 text-center">
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/10">
                <TrendingUp className="w-4 h-4" />
                {t('powerlaw.hero.badge')}
              </div>

              <h1 className="text-h1 font-bold text-foreground">
                {t('powerlaw.hero.titlePrefix')} <span className="text-gradient-premium">{t('powerlaw.hero.titleMiddle')}</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('powerlaw.hero.description')}
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
                  <PowerLawInputPanel onCalculate={handleCalculate} />
                </div>
                <div>
                  <ErrorBoundary>
                    {result && deviation ? (
                      <PowerLawResultsPanel
                        result={result}
                        deviation={deviation}
                        targetDate={targetDate}
                        currentPrice={currentPrice || 0}
                      />
                    ) : (
                      <Card className="glass-morphism-card border-border/20 shadow-sm">
                        <CardContent className="p-8 text-center">
                          <div className="space-y-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                              <Calculator className="w-6 h-6 text-primary" />
                            </div>
                            <div className="space-y-1">
                              <h3 className="text-lg font-semibold text-foreground">{t('powerlaw.empty.title')}</h3>
                              <p className="text-sm text-muted-foreground">{t('powerlaw.empty.body')}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </ErrorBoundary>
                </div>
              </div>

              {/* Chart */}
              <div className="animate-fade-in">
                <PowerLawChart
                  targetYear={targetDate.getFullYear()}
                  currentPrice={currentPrice || undefined}
                />
              </div>

              {/* Export */}
              {result && (
                <ExportReportButton
                  result={{
                    investmentAmount: 0,
                    currentValue: result.fairValue,
                    profitLoss: 0,
                    roiPercentage: 0,
                    currency: 'USD',
                    startDate: new Date().toISOString(),
                    startPrice: currentPrice || 0,
                    currentPrice: currentPrice || 0,
                    btcAmount: 0,
                    priceData: []
                  }}
                />
              )}
            </div>
          </section>

          {/* Projection Table */}
          <section className="container mx-auto px-6 pb-12">
            <div className="max-w-6xl mx-auto">
              <PowerLawProjectionTable />
            </div>
          </section>

          <div className="container mx-auto px-6 pb-6 max-w-5xl"><AffiliatePlacement slug="power-law" lang="en" resultSignals={["valuation", "long-term"]} /></div>

          <PowerLawHowToUse />
          <PowerLawContentSections currentPrice={currentPrice || undefined} />
          <PowerLawFAQSection />
          <RelatedCalculators />

          {/* Disclaimer */}
          <section className="container mx-auto px-6 pb-16">
            <div className="max-w-3xl mx-auto">
              <Card className="glass-morphism-card border-border/20 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{t('powerlaw.disclaimer.title')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('powerlaw.disclaimer.body')}
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

export default BitcoinPowerLawCalculator;
