import { Helmet } from "react-helmet-async";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
  /**
   * Page language. Used to set `inLanguage` on the BreadcrumbList so AI
   * crawlers reading the JSON-LD know which locale the crumb labels match.
   * Defaults to "en" for backward compatibility.
   */
  language?: string;
}

/**
 * BreadcrumbSchema component for adding JSON-LD BreadcrumbList structured data.
 * Locale-aware: pass `language` so TR pages emit `inLanguage: "tr"` and
 * crawlers don't conflate the Turkish breadcrumb names with English ones.
 */
export const BreadcrumbSchema = ({ items, language = "en" }: BreadcrumbSchemaProps) => {
  const lang = language === "tr" ? "tr" : "en";
  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "inLanguage": lang,
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url,
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbList)}
      </script>
    </Helmet>
  );
};

export default BreadcrumbSchema;
