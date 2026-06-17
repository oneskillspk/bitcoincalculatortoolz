import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { calculatorHowTo } from "@/data/calculatorHowTo";
import { EN_TO_TR } from "@/utils/localizedRoutes";

const TR_TO_EN: Record<string, string> = Object.fromEntries(
  Object.entries(EN_TO_TR).map(([en, tr]) => [tr, en]),
);

const BASE = "https://bitcoincalculator.tools";

/**
 * Auto-emits schema.org/HowTo JSON-LD on step-based calculator routes
 * (and their TR mirrors). Steps source from `src/data/calculatorHowTo.ts`.
 * Renders nothing on routes without registered steps.
 */
export const HowToSchema = () => {
  const { pathname } = useLocation();
  const isTr = pathname.startsWith("/tr/");
  const language: "en" | "tr" = isTr ? "tr" : "en";

  let enPath = pathname.replace(/\/$/, "");
  if (isTr) enPath = TR_TO_EN[enPath] ?? "";
  const match = enPath.match(/^\/calculators\/([a-z0-9-]+)$/i);
  if (!match) return null;
  const slug = match[1];
  const entry = calculatorHowTo[slug];
  if (!entry) return null;

  const url = `${BASE}${pathname.replace(/\/$/, "") || "/"}`;
  const payload = entry[language];

  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${url}#howto`,
    inLanguage: language,
    name: payload.name,
    step: payload.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};
