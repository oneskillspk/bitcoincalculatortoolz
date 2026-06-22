import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { PageBackground } from "@/components/modern/PageBackground";
import RegionalCryptoTaxCalculator from "@/components/tax-calculator/RegionalCryptoTaxCalculator";
import RelatedCalculators from "@/components/RelatedCalculators";
import { TaxHero } from "@/components/tax/TaxHero";
import { TaxAccordionFAQ } from "@/components/tax/TaxAccordionFAQ";
import { TaxComparisonTable } from "@/components/tax/TaxComparisonTable";
import { TaxScenarioCards } from "@/components/tax/TaxScenarioCards";
import { TaxEffectiveRateChart } from "@/components/tax/TaxEffectiveRateChart";
import { TaxMethodologySection } from "@/components/tax/TaxMethodologySection";
import { TaxJsonLd } from "@/components/tax/TaxJsonLd";
import { TaxShareExportPanel } from "@/components/tax/TaxShareExportPanel";
import { TaxRelatedCalculators } from "@/components/tax/TaxRelatedCalculators";

const EN_URL = "https://bitcoincalculator.tools/calculators/bitcoin-tax-india";
const TR_URL =
  "https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-vergi-hindistan";

const TITLE_EN = "Bitcoin Tax Calculator India 2025 — 30% Crypto Tax + 1% TDS";
const TITLE_TR = "Hindistan Bitcoin Vergi Hesaplayıcısı 2025 — %30 + %1 TDS";
const DESC_EN =
  "Estimate India crypto tax under §115BBH: flat 30% on Bitcoin gains, 4% cess, and 1% TDS on every sale. Free calculator with the exact 2025 rules.";
const DESC_TR =
  "Hindistan kripto vergisini §115BBH kapsamında hesaplayın: Bitcoin kazançlarında sabit %30, %4 cess ve her satışta %1 TDS. 2025 kurallarıyla ücretsiz hesaplayıcı.";

const BitcoinIndiaTaxCalculator = () => {
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
      </Helmet>
      <TaxJsonLd
        region="in"
        url={URL}
        title={TITLE}
        description={DESC}
        isTr={isTr}
      />
      <BreadcrumbSchema
        language={isTr ? "tr" : "en"}
        items={[
          { name: isTr ? "Ana Sayfa" : "Home", url: "https://bitcoincalculator.tools/" },
          {
            name: isTr ? "Hesaplayıcılar" : "Calculators",
            url: "https://bitcoincalculator.tools/calculators",
          },
          { name: isTr ? "Bitcoin Vergi — Hindistan" : "Bitcoin Tax — India", url: URL },
        ]}
      />
      <PageBackground>
        <Header />
        <main>
          <div className="container mx-auto max-w-5xl px-4 pt-6">
            <Breadcrumb
              items={[
                {
                  label: isTr ? "Hesaplayıcılar" : "Calculators",
                  href: "/calculators",
                },
                {
                  label: isTr ? "Bitcoin Vergi — Hindistan" : "Bitcoin Tax — India",
                },
              ]}
            />
          </div>

          <TaxHero region="in" isTr={isTr} />

          <section
            aria-label={isTr ? "Vergi hesaplayıcısı" : "Tax calculator"}
            className="container mx-auto max-w-4xl px-4"
          >
            <RegionalCryptoTaxCalculator region="in" />
          </section>

          <TaxEffectiveRateChart region="in" isTr={isTr} />
          <TaxScenarioCards region="in" isTr={isTr} />
          <TaxComparisonTable highlight="in" isTr={isTr} />
          <TaxMethodologySection region="in" isTr={isTr} />
          <TaxAccordionFAQ region="in" isTr={isTr} />

          <div className="container mx-auto max-w-6xl px-4 pb-16">
            <RelatedCalculators />
          </div>
        </main>
        <Footer />
      </PageBackground>
    </>
  );
};

export default BitcoinIndiaTaxCalculator;
