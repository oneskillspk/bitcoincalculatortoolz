/**
 * Single-component drop-in for the OG/Twitter image meta block.
 *
 * Owns its own <Helmet> so it can be placed anywhere in the tree —
 * react-helmet-async forbids React components as children of <Helmet>,
 * so this MUST NOT be nested inside another <Helmet>. Render it as a
 * sibling; meta tags dedupe by name/property across Helmet instances.
 */
import { Helmet } from "react-helmet-async";
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
    <Helmet>
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
    </Helmet>
  );
}
