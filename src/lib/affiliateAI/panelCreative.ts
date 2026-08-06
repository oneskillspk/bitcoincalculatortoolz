/**
 * panelCreative — picks the partner's OWN native creative to fill the
 * 16:10 promo card panel.
 *
 * We never render generated/illustrated artwork here: every panel image is
 * a real creative supplied by the affiliate network (or a CDN-hosted native
 * asset uploaded from the partner's media kit).
 *
 * Selection rules:
 *  1. Only "panel-shaped" creatives — aspect ratio between 1.2 and 2.0.
 *     Anything wider (leaderboards, footer strips) or taller (skyscrapers)
 *     is excluded; those belong to the banner formats.
 *  2. Language match first, then language-agnostic creatives.
 *  3. Closest aspect ratio to 16:10 (1.6) wins. Ties break on larger width
 *     so we get the crispest asset, then on image_url for determinism.
 */
import type { AffiliateCreative, AffiliateProgram, Lang } from "./types";
import { AFFILIATES } from "@/config/affiliates.config";

export interface PanelCreative {
  image_url: string;
  width: number;
  height: number;
  alt: string;
}

const TARGET_RATIO = 16 / 10;
const MIN_RATIO = 1.2;
const MAX_RATIO = 2.0;

/** True when a creative's shape can sit in a 16:10 panel without looking wrong. */
export function isPanelShaped(c: AffiliateCreative): boolean {
  if (!c.width || !c.height) return false;
  const ratio = c.width / c.height;
  return ratio >= MIN_RATIO && ratio <= MAX_RATIO;
}

function bestOf(candidates: AffiliateCreative[]): AffiliateCreative | null {
  if (candidates.length === 0) return null;
  return [...candidates].sort((a, b) => {
    const da = Math.abs(a.width / a.height - TARGET_RATIO);
    const db = Math.abs(b.width / b.height - TARGET_RATIO);
    if (da !== db) return da - db;
    if (a.width !== b.width) return b.width - a.width;
    return a.image_url.localeCompare(b.image_url);
  })[0];
}

/**
 * Deterministic pick — the same partner + language always resolves to the
 * same panel image, so a grid never flickers or duplicates.
 */
export function pickPanelCreative(
  creatives: AffiliateCreative[] | undefined | null,
  lang: Lang
): PanelCreative | null {
  const pool = (creatives ?? []).filter(isPanelShaped);
  if (pool.length === 0) return null;

  const chosen =
    bestOf(pool.filter((c) => c.lang === lang)) ??
    bestOf(pool.filter((c) => !c.lang)) ??
    bestOf(pool);

  if (!chosen) return null;
  return {
    image_url: chosen.image_url,
    width: chosen.width,
    height: chosen.height,
    alt: chosen.alt,
  };
}

/** Same as pickPanelCreative but resolves the program from its id. */
export function pickPanelCreativeById(
  affiliateId: string,
  lang: Lang
): PanelCreative | null {
  const program = (AFFILIATES as AffiliateProgram[]).find((p) => p.id === affiliateId);
  return pickPanelCreative(program?.creatives, lang);
}
