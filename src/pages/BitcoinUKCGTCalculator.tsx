import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { PageBackground } from "@/components/modern/PageBackground";
import RegionalCryptoTaxCalculator from "@/components/tax-calculator/RegionalCryptoTaxCalculator";
import { TaxHero } from "@/components/tax/TaxHero";
import { TaxAccordionFAQ } from "@/components/tax/TaxAccordionFAQ";
import { PreFAQPlacement } from "@/components/placement/PreFAQPlacement";
import { TaxComparisonTable } from "@/components/tax/TaxComparisonTable";
import { TaxScenarioCards } from "@/components/tax/TaxScenarioCards";
import { TaxEffectiveRateChart } from "@/components/tax/TaxEffectiveRateChart";
import { TaxMethodologySection } from "@/components/tax/TaxMethodologySection";
import { TaxJsonLd } from "@/components/tax/TaxJsonLd";
import { TaxShareExportPanel } from "@/components/tax/TaxShareExportPanel";
import { TaxRelatedCalculators } from "@/components/tax/TaxRelatedCalculators";
import { HelmetOgImage } from "@/components/seo/HelmetOgImage";
import { PageQuickAnswer } from "@/components/calculator/PageQuickAnswer";

const EN_URL = "https://bitcoincalculator.tools/calculators/bitcoin-tax-uk-cgt";
const TR_URL =
  "https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-vergi-ingiltere-cgt";

const TITLE_EN = "UK Bitcoin CGT Calculator 2026/27 — £3,000 Allowance, 18%/24%";
const TITLE_TR =
  "İngiltere Bitcoin CGT Hesaplayıcısı 2026/27 — £3.000 Muafiyet, %18/24";
const DESC_EN =
  "Estimate your UK Bitcoin capital gains tax for 2026/27. Applies the £3,000 annual exempt amount and the 18% basic / 24% higher CGT rates set by HMRC. Updated June 2026.";
const DESC_TR =
  "2026/27 için İngiltere Bitcoin sermaye kazancı vergisini tahmin edin. HMRC'nin £3.000 yıllık muafiyeti ile %18 temel / %24 üst CGT oranlarını uygular. Haziran 2026 itibarıyla güncel.";

const BitcoinUKCGTCalculator = () => {
  const isTr = useLocation().pathname.startsWith("/tr/");
  const URL = isTr ? TR_URL : EN_URL;
  const TITLE = isTr ? TITLE_TR : TITLE_EN;
  const DESC = isTr ? DESC_TR : DESC_EN;

  return (
    <>
      <Helmet>
        <html lang={isTr ? "tr" : "en"} />
        <title>{TITLE}</title>
        <meta name="description" content={DESC} />
        <link rel="canonical" href={URL} />
        <link rel="alternate" hrefLang="en" href={EN_URL} />
        <link rel="alternate" hrefLang="tr" href={TR_URL} />
        <link rel="alternate" hrefLang="x-default" href={EN_URL} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESC} />
        <meta property="og:url" content={URL} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content={isTr ? "tr_TR" : "en_US"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESC} />
      </Helmet>
      <HelmetOgImage slug="bitcoin-tax-uk-cgt" enAlt={TITLE_EN} lang={isTr ? "tr" : "en"} />
      <TaxJsonLd
        region="uk"
        url={URL}
        title={TITLE}
        description={DESC}
        isTr={isTr}
      />
      <BreadcrumbSchema
        language={isTr ? "tr" : "en"}
        items={[
          { name: isTr ? "Ana Sayfa" : "Home", url: isTr ? "https://bitcoincalculator.tools/tr/" : "https://bitcoincalculator.tools/" },
          {
            name: isTr ? "Hesaplayıcılar" : "Calculators",
            url: isTr ? "https://bitcoincalculator.tools/tr/hesaplayicilar" : "https://bitcoincalculator.tools/calculators",
          },
          { name: isTr ? "Bitcoin CGT — İngiltere" : "Bitcoin CGT — UK", url: URL },
        ]}
      />
      <PageBackground>
        <Header />
        <main>
          <div className="container mx-auto max-w-5xl px-4 pt-20 sm:pt-24">
            <Breadcrumb
              items={[
                {
                  label: isTr ? "Hesaplayıcılar" : "Calculators",
                  href: "/calculators",
                },
                { label: isTr ? "Bitcoin CGT — İngiltere" : "Bitcoin CGT — UK" },
              ]}
            />
          </div>

          <TaxHero region="uk" isTr={isTr} />

          <section
            aria-label={isTr ? "CGT hesaplayıcısı" : "CGT calculator"}
            className="container mx-auto max-w-4xl px-4"
          >
            <div className="container mx-auto px-4 sm:px-6">
              <PageQuickAnswer
                en='In the UK, selling Bitcoin is a capital gains event, with gains above the annual exempt amount taxed at the basic or higher rate. This calculator applies HMRC share-pooling rules, including the same-day and 30-day matching tests, and estimates the CGT you owe.'
                tr='Birleşik Krallık’ta Bitcoin satışı sermaye kazancı doğurur; yıllık istisnayı aşan kazançlar temel veya yüksek oranda vergilendirilir. Bu hesaplayıcı, aynı gün ve 30 gün eşleştirme testleri dahil HMRC havuzlama kurallarını uygular ve ödemeniz gereken CGT’yi tahmin eder.'
              />
            </div>
            <RegionalCryptoTaxCalculator region="uk" />
          </section>

          <TaxEffectiveRateChart region="uk" isTr={isTr} />
          <TaxScenarioCards region="uk" isTr={isTr} />
          <TaxComparisonTable highlight="uk" isTr={isTr} />
          <TaxMethodologySection region="uk" isTr={isTr} />
          <TaxShareExportPanel region="uk" isTr={isTr} url={URL} />
          <PreFAQPlacement slug="capital-gains-tax" lang={isTr ? "tr" : "en"} resultSignals={["tax-relevant"]} />
          <TaxAccordionFAQ region="uk" isTr={isTr} />
          <TaxRelatedCalculators isTr={isTr} />
        </main>
        <Footer />
      </PageBackground>
    </>
  );
};

export default BitcoinUKCGTCalculator;
