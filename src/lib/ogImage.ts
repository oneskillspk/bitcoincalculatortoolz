/**
 * Centralized OG/Twitter image resolver.
 *
 * Simple locale-based resolution:
 * - EN routes → social-preview.webp
 * - TR routes → bitcoin-kar-hesaplayici-og.webp
 *
 * Category-specific OG images (learn, calculators, articles) will be
 * layered on later. For now every page in a locale shares one image.
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
  "Bitcoin Hesaplayıcıları — 49+ Ücretsiz Araç | bitcoincalculator.tools";

export function getOgImage(_slug: string, lang: Lang, enAlt?: string): OgImageInfo {
  const isTr = lang === "tr";
  return {
    url: isTr ? TR_DEFAULT_URL : EN_DEFAULT_URL,
    alt: isTr ? TR_DEFAULT_ALT : enAlt ?? "Bitcoin Calculator | bitcoincalculator.tools",
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
