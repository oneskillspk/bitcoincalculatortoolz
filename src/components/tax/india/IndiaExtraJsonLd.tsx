import { Helmet } from "react-helmet-async";
import { IN_COPY } from "./inTaxCopy";

interface Props {
  url: string;
  isTr: boolean;
}

/**
 * India-specific supplementary JSON-LD: Dataset (Section 115BBH parameters),
 * a second filing-focused HowTo, and a SpeakableSpecification targeting
 * the new #in-tldr and #tds-reclaim headings.
 *
 * Emitted from a sibling Helmet so we never touch the page's primary
 * <Helmet> block (per project guardrail).
 */
export const IndiaExtraJsonLd = ({ url, isTr }: Props) => {
  const lang = isTr ? "tr" : "en";

  const dataset = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${url}#dataset-115bbh`,
    name: isTr
      ? "Hindistan VDA vergi parametreleri (115BBH Bölümü)"
      : "India VDA tax parameters (Section 115BBH)",
    description: isTr
      ? "Hindistan sanal dijital varlık (VDA) vergilendirmesi için sabit oran, cess, TDS ve zarar mahsup kuralları."
      : "Flat rate, cess, TDS, and loss set-off rules governing India virtual digital asset (VDA) taxation.",
    inLanguage: lang,
    url,
    creator: {
      "@type": "Organization",
      name: "Bitcoin Calculator Tools",
      url: "https://bitcoincalculator.tools",
    },
    variableMeasured: [
      { "@type": "PropertyValue", name: "Flat tax rate", value: "30%" },
      { "@type": "PropertyValue", name: "Health and education cess", value: "4%" },
      { "@type": "PropertyValue", name: "TDS under Section 194S", value: "1%" },
      { "@type": "PropertyValue", name: "Loss set-off allowed", value: "No" },
      { "@type": "PropertyValue", name: "Effective headline rate", value: "31.2%" },
    ],
  };

  const filingSteps = isTr ? IN_COPY.filingHowTo.steps.tr : IN_COPY.filingHowTo.steps.en;
  const filingHowTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${url}#howto-filing`,
    name: isTr ? IN_COPY.filingHowTo.name.tr : IN_COPY.filingHowTo.name.en,
    inLanguage: lang,
    totalTime: "PT10M",
    step: filingSteps.map((text, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: `${isTr ? "Adım" : "Step"} ${i + 1}`,
      text,
    })),
  };

  const speakable = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#speakable`,
    inLanguage: lang,
    url,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["#in-tldr-heading", "#tds-reclaim-heading"],
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(dataset)}</script>
      <script type="application/ld+json">{JSON.stringify(filingHowTo)}</script>
      <script type="application/ld+json">{JSON.stringify(speakable)}</script>
    </Helmet>
  );
};

export default IndiaExtraJsonLd;
