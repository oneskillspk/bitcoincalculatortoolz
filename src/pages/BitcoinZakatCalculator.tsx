import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AffiliatePlacement } from "@/components/affiliateAI/AffiliatePlacement";
import { Breadcrumb } from '@/components/Breadcrumb';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { PageBackground } from '@/components/modern/PageBackground';
import { CompactLiveBitcoinPrice } from '@/components/CompactLiveBitcoinPrice';
import RelatedCalculators from '@/components/RelatedCalculators';
import { MethodologyBlock } from '@/components/calculator/MethodologyBlock';
import { ZakatNisabBanner } from '@/components/zakat/ZakatNisabBanner';
import { ZakatCurrencySelector } from '@/components/zakat/ZakatCurrencySelector';
import { ZakatNisabStandardSelector } from '@/components/zakat/ZakatNisabStandardSelector';
import { ZakatAssetInputPanel } from '@/components/zakat/ZakatAssetInputPanel';
import { ZakatDeductionsPanel } from '@/components/zakat/ZakatDeductionsPanel';
import { ZakatHawlChecker, HawlStatus } from '@/components/zakat/ZakatHawlChecker';
import { ZakatResultsPanel } from '@/components/zakat/ZakatResultsPanel';
import { ZakatQuickReferenceTable } from '@/components/zakat/ZakatQuickReferenceTable';
import { ZakatContentSections } from '@/components/zakat/ZakatContentSections';
import { ZakatFAQSection, zakatFaqSchemaDataEn, zakatFaqSchemaDataTr } from '@/components/zakat/ZakatFAQSection';
import { useMetalPrices, calculateZakat, ZakatAssets, NisabStandard, SupportedCurrency } from '@/services/zakatCalculator';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useLanguage } from "@/contexts/LanguageContext";
import { buildCalculatorSpeakable } from '@/components/seo/calculatorSpeakable';
import { useLocalizedSchema } from "@/hooks/useLocalizedSchema";

import { HelmetOgImage } from "@/components/seo/HelmetOgImage";
const DEFAULT_ASSETS: ZakatAssets = {
  btcAmount: 0, cashOnHand: 0, bankSavings: 0, fixedDeposits: 0,
  goldGrams: 0, goldPurity: '24K', silverGrams: 0, stocksValue: 0, debts: 0,
};

const BitcoinZakatCalculator = () => {
  const { language, t } = useLanguage();
  const { data: nisab, loading, error } = useMetalPrices();
  const [currency, setCurrency] = useState<SupportedCurrency>(language === 'tr' ? 'TRY' : 'USD');
  const [standard, setStandard] = useState<NisabStandard>('silver');
  const [assets, setAssets] = useState<ZakatAssets>(DEFAULT_ASSETS);
  const [hawlStatus, setHawlStatus] = useState<HawlStatus>('yes');

  const result = useMemo(() => {
    if (!nisab) return null;
    return calculateZakat(assets, nisab, standard, currency);
  }, [assets, nisab, standard, currency]);

  const webAppSchema = useLocalizedSchema(
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Bitcoin Zakat Calculator 2026",
      "description": "Calculate Zakat on Bitcoin, gold, cash and savings in PKR, INR, USD and AED. Live Nisab 2026, Hawl checker, multi-currency.",
      "url": "https://bitcoincalculator.tools/calculators/bitcoin-zakat",
      "inLanguage": "en",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Any",
      "featureList": [
        "Live Bitcoin Zakat calculation",
        "Live Nisab threshold in USD PKR INR AED GBP",
        "Silver and gold Nisab with live metal prices",
        "Zakat on gold calculator",
        "Zakat on cash and savings",
        "Hawl lunar year checker",
        "Debt deduction for mortgage and loans",
        "1 lakh Zakat calculator for India",
        "Multi-currency: USD PKR INR AED GBP BDT MYR IDR SAR NGN",
        "Pay Zakat in Bitcoin calculation",
        "Ramadan 2026 Zakat calculator",
      ],
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools" },
      "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Bitcoin Zekat Hesaplayıcısı 2026",
      "description": "Bitcoin, altın, nakit ve tasarruflar üzerindeki Zekatı PKR, INR, USD ve AED cinsinden hesaplayın. Canlı Nisab 2026, Havl denetleyicisi, çoklu para birimi.",
      "url": "https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-zekat-hesaplayicisi",
      "inLanguage": "tr",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Any",
      "featureList": [
        "Canlı Bitcoin Zekat hesaplama",
        "USD, PKR, INR, AED, GBP cinsinden canlı Nisab eşiği",
        "Canlı metal fiyatlarıyla Gümüş ve Altın Nisabı",
        "Altın için Zekat hesaplayıcısı",
        "Nakit ve birikim için Zekat",
        "Havl (kameri yıl) denetleyicisi",
        "Mortgage ve kredi için borç düşümü",
        "Çoklu para birimi: USD, PKR, INR, AED, GBP, BDT, MYR, IDR, SAR, NGN, TRY",
        "Bitcoin ile Zekat ödeme hesaplaması",
        "Ramazan 2026 Zekat hesaplayıcısı",
      ],
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "TRY" },
      "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools" },
      "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
    },
  );

  const howToSchema = useLocalizedSchema(
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Calculate Zakat on Bitcoin",
      "description": "Step-by-step guide to calculating your Zakat on Bitcoin and other zakatable assets.",
      "inLanguage": "en",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "Select your currency", "text": "Choose your local currency (PKR, INR, USD, AED, etc.) for calculations" },
        { "@type": "HowToStep", "position": 2, "name": "Check today's live Nisab", "text": "View the Silver Nisab (~$1,671 USD) and Gold Nisab (~$14,377 USD) in March 2026" },
        { "@type": "HowToStep", "position": 3, "name": "Choose Nisab standard", "text": "Select Silver Nisab (recommended) or Gold Nisab" },
        { "@type": "HowToStep", "position": 4, "name": "Enter your Bitcoin amount", "text": "Input your BTC holdings — live value shows instantly" },
        { "@type": "HowToStep", "position": 5, "name": "Add other zakatable assets", "text": "Add cash, gold, silver, and stocks/ETFs" },
        { "@type": "HowToStep", "position": 6, "name": "Deduct debts", "text": "Subtract debts due within the next 12 months" },
        { "@type": "HowToStep", "position": 7, "name": "Confirm Hawl", "text": "Confirm your wealth has been above Nisab for one full lunar year (354 days)" },
        { "@type": "HowToStep", "position": 8, "name": "View your Zakat", "text": "Your Zakat is 2.5% of your net zakatable wealth" },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "Bitcoin Üzerinden Zekat Nasıl Hesaplanır",
      "description": "Bitcoin ve diğer zekata tabi varlıklar üzerindeki Zekatınızı hesaplamak için adım adım rehber.",
      "inLanguage": "tr",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "Para birimi seçin", "text": "Hesaplama için yerel para biriminizi seçin (TRY, USD, PKR, INR, AED vb.)" },
        { "@type": "HowToStep", "position": 2, "name": "Canlı Nisabı kontrol edin", "text": "2026 Mart için Gümüş Nisab (~1.671 USD) ve Altın Nisab (~14.377 USD) değerlerini görüntüleyin" },
        { "@type": "HowToStep", "position": 3, "name": "Nisab standardını seçin", "text": "Gümüş Nisab (önerilen) veya Altın Nisabı seçin" },
        { "@type": "HowToStep", "position": 4, "name": "Bitcoin miktarınızı girin", "text": "BTC varlığınızı girin — canlı değer anında gösterilir" },
        { "@type": "HowToStep", "position": 5, "name": "Diğer zekata tabi varlıkları ekleyin", "text": "Nakit, altın, gümüş ve hisse senedi/ETF ekleyin" },
        { "@type": "HowToStep", "position": 6, "name": "Borçları düşün", "text": "Önümüzdeki 12 ay içinde vadesi gelen borçları çıkarın" },
        { "@type": "HowToStep", "position": 7, "name": "Havl'i doğrulayın", "text": "Servetinizin tam bir kameri yıl (354 gün) boyunca Nisab üzerinde kaldığını doğrulayın" },
        { "@type": "HowToStep", "position": 8, "name": "Zekatınızı görün", "text": "Zekatınız, net zekata tabi servetinizin %2,5'idir" },
      ],
    },
  );

  const faqSchema = useLocalizedSchema(
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "inLanguage": "en",
      "mainEntity": zakatFaqSchemaDataEn,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "inLanguage": "tr",
      "mainEntity": zakatFaqSchemaDataTr,
    },
  );

  return (
    <>
      <Helmet>
        <title>{t('zakat.meta.title')}</title>
        <meta name="description" content={t('zakat.meta.description')} />
        <meta name="keywords" content="bitcoin zakat calculator, zakat calculator, islamic zakat calculator, calculating zakat, crypto zakat calculator, zakat on gold calculator, zakat calculator usa, bitcoin zakat calculator PKR, bitcoin zakat calculator INR, 1 lakh zakat calculator, zakat on bitcoin in Islam, nisab bitcoin calculator, bitcoin hawl calculator, zakat calculation on cryptocurrency, zakat calculator nisab, how to calculate zakat on cash, how to calculate zakat on salary" />
        <link rel="canonical" href={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-zekat-hesaplayicisi':'https://bitcoincalculator.tools/calculators/bitcoin-zakat'} />
        <link rel="alternate" hrefLang="tr" href="https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-zekat-hesaplayicisi" />
        <link rel="alternate" hrefLang="en" href="https://bitcoincalculator.tools/calculators/bitcoin-zakat" />
        <link rel="alternate" hrefLang="x-default" href="https://bitcoincalculator.tools/calculators/bitcoin-zakat" />

        <meta property="og:title" content={t('zakat.meta.title')} />
        <meta property="og:description" content={t('zakat.meta.ogDescription')} />
        <meta property="og:url" content={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-zekat-hesaplayicisi':'https://bitcoincalculator.tools/calculators/bitcoin-zakat'} />
        <meta property="og:type" content="website" />
        <HelmetOgImage slug="bitcoin-zakat-calculator" enAlt={`Bitcoin Zakat Calculator 2026 | bitcoincalculator.tools`} />
        <meta property="og:site_name" content="bitcoincalculator.tools" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('zakat.meta.title')} />
        <meta name="twitter:description" content={t('zakat.meta.twitterDescription')} />
        <meta name="twitter:creator" content="@web3believers" />

        <meta name="twitter:site" content="@web3believers" />
        <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
              <script type="application/ld+json">{JSON.stringify(buildCalculatorSpeakable(language === 'tr' ? 'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-zekat-hesaplayicisi' : 'https://bitcoincalculator.tools/calculators/bitcoin-zakat', language))}</script>
      </Helmet>

      <BreadcrumbSchema language={language}
        items={[
          { name: "Home", url: "https://bitcoincalculator.tools" },
          { name: "Calculators", url: "https://bitcoincalculator.tools/calculators" },
          { name: "Bitcoin Zakat Calculator", url: "https://bitcoincalculator.tools/calculators/bitcoin-zakat" },
        ]}
      />

      <PageBackground variant="clean">
      <Header />

      <main id="main-content" className="pt-20 relative z-10">
        <div className="container mx-auto px-6">
          <Breadcrumb
            items={[
              { label: t('zakat.crumb.calculators'), href: language==='tr'?'/tr/hesaplayicilar':'/calculators' },
              { label: t('zakat.crumb.current') },
            ]}
          />
        </div>

        {/* Hero */}
        <section className="py-16 text-center">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/20 mb-6">
              {t('zakat.hero.badge')}
            </div>
            <h1 className="text-h1 font-bold mb-4">
              {t('zakat.hero.titlePrefix')} <span className="text-gradient-premium">{t('zakat.hero.titleMiddle')}</span> {t('zakat.hero.titleSuffix')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              {t('zakat.hero.description')}
            </p>
            <CompactLiveBitcoinPrice currency={language === 'tr' ? 'TRY' : 'USD'} />
          </div>
        </section>

        {/* Calculator */}
        <section className="pb-16">
          <div className="container mx-auto px-6 max-w-3xl space-y-8">
            {loading && !nisab ? (
              <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{t('zakat.loading')}</span>
              </div>
            ) : error && !nisab ? (
              <div className="flex items-center justify-center py-20 gap-3 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            ) : nisab ? (
              <>
                {/* Step 1: Nisab Banner */}
                <ZakatNisabBanner nisab={nisab} currency={currency} loading={loading} />

                {/* Step 1: Currency */}
                <div className="space-y-3">
                  <h3 className="text-base font-semibold text-foreground">{t('zakat.step1.title')}</h3>
                  <ZakatCurrencySelector value={currency} onChange={setCurrency} />
                </div>

                {/* Step 2: Nisab Standard */}
                <ZakatNisabStandardSelector value={standard} onChange={setStandard} nisab={nisab} currency={currency} />

                {/* Step 3: Assets */}
                <ZakatAssetInputPanel assets={assets} onChange={setAssets} nisab={nisab} currency={currency} />

                {/* Step 4: Deductions */}
                <ZakatDeductionsPanel debts={assets.debts} onChange={v => setAssets(a => ({ ...a, debts: v }))} currency={currency} />

                {/* Step 5: Hawl */}
                <ZakatHawlChecker value={hawlStatus} onChange={setHawlStatus} />

                {/* Results */}
                {result && <ZakatResultsPanel result={result} nisab={nisab} standard={standard} currency={currency} hawlStatus={hawlStatus} />}

                {/* Quick Reference Table */}
                <ZakatQuickReferenceTable nisab={nisab} currency={currency} />
              </>
            ) : null}
          </div>
        </section>

        {/* Educational Content */}
        <section className="py-16 bg-muted/10">
          <div className="container mx-auto px-6">
            <ZakatContentSections />
          </div>
        </section>

        {/* FAQ */}
        <ZakatFAQSection />

        <MethodologyBlock
          methodology="Zakat is calculated at 2.5% of qualifying assets that exceed the Nisab threshold and have been held for one full lunar year (hawl). Qualifying assets include Bitcoin, cash, gold, silver, business inventory, and receivable debts. Personal-use items and primary residence are excluded. The Nisab is set as the lower of 87.48 g of gold or 612.36 g of silver, valued in your local currency at live spot prices. Outstanding short-term debts are deducted before applying the 2.5% rate."
          sources={[
            { label: 'AAOIFI Shariah Standard No. 35 — Zakah', url: 'https://aaoifi.com/shariaa-standards/?lang=en', publisher: 'AAOIFI' },
            { label: 'International Islamic Fiqh Academy (IIFA) — Resolutions on contemporary financial matters', url: 'https://iifa-aifi.org/', publisher: 'International Islamic Fiqh Academy' },
            { label: 'Live gold & silver spot prices', url: 'https://www.lbma.org.uk/prices-and-data', publisher: 'London Bullion Market Association' },
          ]}
          lastReviewed="2026-04-15"
          disclaimer="Zakat rules vary across madhabs. This calculator follows the majority position (Hanafi and Shafi'i hybrid). Consult a qualified scholar for personal rulings, especially for business assets, debts, or mixed Bitcoin holdings."
        />

        <div className="container mx-auto px-6 max-w-5xl"><AffiliatePlacement slug="bitcoin-zakat" /></div>

        <RelatedCalculators />

        {/* Disclaimer */}
        <section className="py-16 md:py-20 bg-muted/20">
          <div className="container mx-auto px-6 max-w-3xl">
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <p>
                <strong>{t('zakat.disclaimer.label')}</strong>{t('zakat.disclaimer.body')}
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      </PageBackground>
    </>
  );
};

export default BitcoinZakatCalculator;
