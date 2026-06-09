/**
 * Centralized OG/Twitter image resolver.
 *
 * Resolves the correct social-preview image per calculator slug × language.
 * - EN slugs default to `/social-preview.webp` (sitewide hero) but accept
 *   per-slug overrides as we ship calculator-specific cards.
 * - TR slugs default to `/bitcoin-kar-hesaplayici-og.webp` (generic TR card)
 *   and accept per-slug overrides as TR-localized cards are generated.
 *
 * Use via `<HelmetOgImage slug="..." enAlt="..." />` instead of hand-rolling
 * the 6-meta-tag block in each calculator. Single source of truth lets us
 * extend TR coverage without touching every page.
 */
import type { Lang } from "@/lib/affiliateAI/types";

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
  "Bitcoin Hesaplayıcıları — 45+ Ücretsiz Araç | bitcoincalculator.tools";

interface PerSlugOg {
  /** Optional per-slug image URL override. Falls back to the lang default. */
  url?: string;
  /** Optional per-slug alt override. Falls back to the lang default. */
  alt?: string;
}

/**
 * Per-slug × per-lang overrides. Add entries here as localized OG cards
 * ship; the resolver gracefully falls back when an entry is missing.
 *
 * Slugs match calculator URL paths (without leading slash, without /tr/).
 */
const OVERRIDES: Record<string, Partial<Record<Lang, PerSlugOg>>> = {
  // Examples (uncomment + add a real image to /public/og/<lang>/<slug>.webp):
  // "bitcoin-hodl-strategy-calculator": {
  //   tr: { url: `${BASE}/og/tr/bitcoin-hodl-strategy.webp`,
  //         alt: "Bitcoin HODL Stratejisi Hesaplayıcısı | bitcoincalculator.tools" },
  // },
};

export function getOgImage(slug: string, lang: Lang, enAlt?: string): OgImageInfo {
  const o = OVERRIDES[slug]?.[lang];
  const isTr = lang === "tr";
  return {
    url: o?.url ?? (isTr ? TR_DEFAULT_URL : EN_DEFAULT_URL),
    alt: o?.alt ?? (isTr ? TR_DEFAULT_ALT : enAlt ?? "Bitcoin Calculator | bitcoincalculator.tools"),
    width: 1200,
    height: 630,
    type: "image/webp",
  };
}

/**
 * Detects the active locale from the current URL. Mirrors the convention
 * used across the app (`/tr/...` or `/tr` => Turkish).
 */
export function detectOgLang(): Lang {
  if (typeof window === "undefined") return "en";
  const p = window.location.pathname;
  return p === "/tr" || p.startsWith("/tr/") ? "tr" : "en";
}
