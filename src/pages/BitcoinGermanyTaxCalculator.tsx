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

const EN_URL = "https://bitcoincalculator.tools/calculators/bitcoin-tax-germany";
const TR_URL =
  "https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-vergi-almanya";

const TITLE_EN =
  "Germany Bitcoin Tax Calculator 2026 — §23 EStG 1-Year Holding Rule";
const TITLE_TR =
  "Almanya Bitcoin Vergi Hesaplayıcısı 2026 — §23 EStG 1 Yıl Kuralı";
const DESC_EN =
  "Estimate German Bitcoin tax under §23 EStG for 2026. Held over 12 months → 0%. Within 12 months → taxed at your marginal rate after the €1,000 Freigrenze. Updated June 2026.";
const DESC_TR =
  "2026 için §23 EStG kapsamında Alman Bitcoin vergisini tahmin edin. 12 aydan uzun tutuldu → %0. 12 ay içinde → €1.000 Freigrenze sonrası marjinal oranınızla vergilendirilir. Haziran 2026 itibarıyla güncel.";

const BitcoinGermanyTaxCalculator = () => {
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
        region="de"
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
          { name: isTr ? "Bitcoin Vergi — Almanya" : "Bitcoin Tax — Germany", url: URL },
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
                  label: isTr ? "Bitcoin Vergi — Almanya" : "Bitcoin Tax — Germany",
                },
              ]}
            />
          </div>

          <TaxHero region="de" isTr={isTr} />

          <section
            aria-label={isTr ? "Vergi hesaplayıcısı" : "Tax calculator"}
            className="container mx-auto max-w-4xl px-4"
          >
            <RegionalCryptoTaxCalculator region="de" />
          </section>

          <TaxEffectiveRateChart region="de" isTr={isTr} />
          <TaxScenarioCards region="de" isTr={isTr} />
          <TaxComparisonTable highlight="de" isTr={isTr} />
          <TaxMethodologySection region="de" isTr={isTr} />
          <TaxShareExportPanel region="de" isTr={isTr} url={URL} />
          <PreFAQPlacement slug="capital-gains-tax" lang={isTr ? "tr" : "en"} resultSignals={["tax-relevant"]} />
          <TaxAccordionFAQ region="de" isTr={isTr} />
          <TaxRelatedCalculators isTr={isTr} />
        </main>
        <Footer />
      </PageBackground>
    </>
  );
};

export default BitcoinGermanyTaxCalculator;
