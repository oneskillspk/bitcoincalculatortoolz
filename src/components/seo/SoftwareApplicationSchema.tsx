import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { calculatorMeta, getCalculatorName } from "@/data/calculatorMeta";
import { EN_TO_TR } from "@/utils/localizedRoutes";

const TR_TO_EN: Record<string, string> = Object.fromEntries(
  Object.entries(EN_TO_TR).map(([en, tr]) => [tr, en]),
);

const BASE = "https://bitcoincalculator.tools";

/**
 * Auto-emits a schema.org/SoftwareApplication JSON-LD block on every
 * `/calculators/<slug>` and `/tr/hesaplayicilar/<tr-slug>` route. Resolves
 * the EN slug via the localized route table so a single mount covers both
 * locales without per-page wiring.
 *
 * Skips silently when the current path is not a calculator route or the
 * slug is not in `calculatorMeta`.
 */
export const SoftwareApplicationSchema = () => {
  const { pathname } = useLocation();
  const isTr = pathname.startsWith("/tr/");
  const language: "en" | "tr" = isTr ? "tr" : "en";

  // Resolve EN slug regardless of locale by mapping TR routes back to EN.
  let enPath = pathname.replace(/\/$/, "");
  if (isTr) {
    enPath = TR_TO_EN[enPath] ?? "";
  }
  const match = enPath.match(/^\/calculators\/([a-z0-9-]+)$/i);
  if (!match) return null;
  const slug = match[1];
  const meta = calculatorMeta[slug];
  if (!meta) return null;

  const url = `${BASE}${pathname.replace(/\/$/, "") || "/"}`;
  const name = getCalculatorName(slug, language);

  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${url}#software`,
    name,
    applicationCategory: "FinanceApplication",
    applicationSubCategory: "Bitcoin Calculator",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    url,
    inLanguage: language,
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    publisher: {
      "@type": "Organization",
      name: "Bitcoin Calculator Tools",
      url: BASE,
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};
