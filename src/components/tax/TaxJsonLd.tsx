import { Helmet } from "react-helmet-async";
import { REGION_META, TAX_LAST_REVIEWED_ISO, type RegionId } from "./regionMeta";

interface Props {
  region: RegionId;
  url: string;
  title: string;
  description: string;
  isTr: boolean;
}

/**
 * Emits WebApplication + HowTo JSON-LD for a regional tax calculator page.
 * (FAQPage JSON-LD is emitted by TaxAccordionFAQ.)
 */
export const TaxJsonLd = ({ region, url, title, description, isTr }: Props) => {
  const m = REGION_META[region];
  const steps = isTr ? m.methodology.tr : m.methodology.en;

  const webApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: title,
    url,
    description,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    inLanguage: isTr ? "tr" : "en",
    offers: { "@type": "Offer", price: "0", priceCurrency: m.currency },
  };

  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: title,
    inLanguage: isTr ? "tr" : "en",
    totalTime: "PT2M",
    step: steps.map((text, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: `${isTr ? "Adım" : "Step"} ${i + 1}`,
      text,
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(webApp)}</script>
      <script type="application/ld+json">{JSON.stringify(howTo)}</script>
    </Helmet>
  );
};

export default TaxJsonLd;
