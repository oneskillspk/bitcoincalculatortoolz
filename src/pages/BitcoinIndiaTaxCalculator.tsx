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
import { IndiaGlanceStrip } from "@/components/tax/india/IndiaGlanceStrip";
import { IndiaTDSReclaimPanel } from "@/components/tax/india/IndiaTDSReclaimPanel";
import { IndiaScheduleVDAPreview } from "@/components/tax/india/IndiaScheduleVDAPreview";
import { IndiaExtraJsonLd } from "@/components/tax/india/IndiaExtraJsonLd";

const EN_URL = "https://bitcoincalculator.tools/calculators/bitcoin-tax-india";
const TR_URL =
  "https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-vergi-hindistan";

const TITLE_EN = "Bitcoin Tax Calculator India 2026 — 30% Crypto Tax + 1% TDS";
const TITLE_TR = "Hindistan Bitcoin Vergi Hesaplayıcısı 2026 — %30 + %1 TDS";
const DESC_EN =
  "Estimate India crypto tax under §115BBH: flat 30% on Bitcoin gains, 4% cess, and 1% TDS on every sale. Updated June 2026 with the latest §115BBH rules.";
const DESC_TR =
  "Hindistan kripto vergisini §115BBH kapsamında hesaplayın: Bitcoin kazançlarında sabit %30, %4 cess ve her satışta %1 TDS. Haziran 2026 §115BBH kurallarına göre güncellendi.";

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
          { name: isTr ? "Ana Sayfa" : "Home", url: isTr ? "https://bitcoincalculator.tools/tr/" : "https://bitcoincalculator.tools/" },
          {
            name: isTr ? "Hesaplayıcılar" : "Calculators",
            url: isTr ? "https://bitcoincalculator.tools/tr/hesaplayicilar" : "https://bitcoincalculator.tools/calculators",
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
          <TaxShareExportPanel region="in" isTr={isTr} url={URL} />
          <PreFAQPlacement slug="capital-gains-tax" lang={isTr ? "tr" : "en"} resultSignals={["tax-relevant"]} />
          <TaxAccordionFAQ region="in" isTr={isTr} />
          <TaxRelatedCalculators isTr={isTr} />
        </main>
        <Footer />
      </PageBackground>
    </>
  );
};

export default BitcoinIndiaTaxCalculator;
