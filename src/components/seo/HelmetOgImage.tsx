/**
 * Single-component drop-in for the OG/Twitter image meta block.
 *
 * Replaces the repeated 6-line ternary block scattered across 112 calculator
 * pages with a centralized, locale-aware resolver. Drop inside an existing
 * `<Helmet>` block:
 *
 *   <HelmetOgImage slug="bitcoin-hodl-strategy-calculator"
 *                  enAlt="Bitcoin HODL Strategy Calculator | bitcoincalculator.tools" />
 *
 * Emits og:image, og:image:secure_url, og:image:type, og:image:width,
 * og:image:height, og:image:alt, twitter:image, twitter:image:alt, and
 * og:locale — all derived from `getOgImage(slug, lang)`.
 */
import { getOgImage, detectOgLang } from "@/lib/ogImage";
import type { Lang } from "@/lib/affiliateAI/types";

interface Props {
  slug: string;
  enAlt: string;
  /** Override the auto-detected language. Useful for SSR/tests. */
  lang?: Lang;
}

export function HelmetOgImage({ slug, enAlt, lang }: Props) {
  const resolvedLang = lang ?? detectOgLang();
  const img = getOgImage(slug, resolvedLang, enAlt);
  return (
    <>
      <meta property="og:locale" content={resolvedLang === "tr" ? "tr_TR" : "en_US"} />
      <meta
        property="og:locale:alternate"
        content={resolvedLang === "tr" ? "en_US" : "tr_TR"}
      />
      <meta property="og:image" content={img.url} />
      <meta property="og:image:secure_url" content={img.url} />
      <meta property="og:image:type" content={img.type} />
      <meta property="og:image:width" content={String(img.width)} />
      <meta property="og:image:height" content={String(img.height)} />
      <meta property="og:image:alt" content={img.alt} />
      <meta name="twitter:image" content={img.url} />
      <meta name="twitter:image:alt" content={img.alt} />
    </>
  );
}
