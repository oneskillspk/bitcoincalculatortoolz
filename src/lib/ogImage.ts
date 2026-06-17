/**
 * Centralized OG/Twitter image resolver.
 *
 * Resolves the correct social-preview image per route × language.
 * - Category-level defaults: Home, Calculators, Learn — auto-detected from
 *   the current URL prefix.
 * - Per-slug overrides win when set.
 * - TR falls back to the generic TR card when no category-specific card is
 *   wired.
 *
 * Use via `<HelmetOgImage slug="..." enAlt="..." />` so a single resolver
 * owns the 6-meta-tag block per page.
 */
import type { Lang } from "@/lib/affiliateAI/types";
import ogHome from "@/assets/og/og-home.webp.asset.json";
import ogCalculators from "@/assets/og/og-calculators.webp.asset.json";
import ogLearn from "@/assets/og/og-learn.webp.asset.json";

export interface OgImageInfo {
  url: string;
  alt: string;
  width: number;
  height: number;
  type: string;
}

const BASE = "https://bitcoincalculator.tools";

const EN_DEFAULT_URL = `${BASE}/social-preview.webp`;
const TR_DEFAULT_URL = `${BASE}/bitcoin-kar-hesaplayici-og.webp`;
const TR_DEFAULT_ALT =
  "Bitcoin Hesaplayıcıları — 46+ Ücretsiz Araç | bitcoincalculator.tools";

interface PerSlugOg {
  url?: string;
  alt?: string;
}

const OVERRIDES: Record<string, Partial<Record<Lang, PerSlugOg>>> = {};

/**
 * Category cards keyed by URL prefix. First-matching prefix wins.
 * Use absolute CDN URLs from the asset pointers so social-preview crawlers
 * resolve them without a redirect hop.
 */
const CATEGORY_CARDS: Array<{ prefix: RegExp; url: string; alt: string }> = [
  {
    prefix: /^\/(learn|tr\/ogrenin)(\/|$)/,
    url: ogLearn.url,
    alt: "Bitcoin Learn — Guides, formulas, and on-chain analysis | bitcoincalculator.tools",
  },
  {
    prefix: /^\/(calculators|tr\/hesaplayicilar)(\/|$)/,
    url: ogCalculators.url,
    alt: "Bitcoin Calculators — DCA, Tax, Retirement, Mining, Lightning | bitcoincalculator.tools",
  },
  {
    prefix: /^\/(tr\/?)?$/,
    url: ogHome.url,
    alt: "46 Free Bitcoin Calculators | bitcoincalculator.tools",
  },
];

function categoryCardFor(pathname: string): { url: string; alt: string } | undefined {
  return CATEGORY_CARDS.find((c) => c.prefix.test(pathname));
}

export function getOgImage(slug: string, lang: Lang, enAlt?: string): OgImageInfo {
  const o = OVERRIDES[slug]?.[lang];
  const isTr = lang === "tr";

  let url = o?.url;
  let alt = o?.alt;

  if (!url && typeof window !== "undefined") {
    const cat = categoryCardFor(window.location.pathname);
    if (cat) { url = cat.url; alt = alt ?? cat.alt; }
  }

  return {
    url: url ?? (isTr ? TR_DEFAULT_URL : EN_DEFAULT_URL),
    alt: alt ?? (isTr ? TR_DEFAULT_ALT : enAlt ?? "Bitcoin Calculator | bitcoincalculator.tools"),
    width: 1200,
    height: 630,
    type: "image/webp",
  };
}

export function detectOgLang(): Lang {
  if (typeof window === "undefined") return "en";
  const p = window.location.pathname;
  return p === "/tr" || p.startsWith("/tr/") ? "tr" : "en";
}
