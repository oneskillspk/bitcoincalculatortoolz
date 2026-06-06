/**
 * Picks the best image creative for a given zone + viewport + language.
 * Returns null when no suitable creative exists (caller can fall back to
 * card format).
 */
import type {
  AffiliateCreative,
  AffiliateProgram,
  CalculatorContext,
  Lang,
  Zone,
} from "./types";

type Device = CalculatorContext["device"];

/** Preferred creative sizes per zone, in priority order. */
const ZONE_SIZE_PREFERENCE: Record<Zone, Record<Device, string[]>> = {
  "post-result": {
    desktop: ["728x90", "468x60", "336x280", "300x250"],
    tablet: ["468x60", "728x90", "300x250", "336x280"],
    mobile: ["300x250", "320x50", "250x250", "336x280"],
  },
  "inline-mid-article": {
    desktop: ["728x90", "850x420", "468x60", "336x280", "300x250"],
    tablet: ["468x60", "728x90", "300x250"],
    mobile: ["300x250", "336x280", "250x250", "320x50", "250x100"],
  },
  sidebar: {
    desktop: ["300x250", "336x280", "160x600", "120x600", "250x250"],
    tablet: ["300x250", "250x250"],
    mobile: ["300x250", "250x250"],
  },
  "pre-footer": {
    desktop: ["970x90", "728x90", "468x60"],
    tablet: ["728x90", "468x60", "300x250"],
    mobile: ["300x250", "320x50"],
  },
  inline: {
    desktop: ["728x90", "468x60"],
    tablet: ["468x60", "300x250"],
    mobile: ["300x250", "320x50"],
  },
  comparison: {
    desktop: ["300x250", "336x280"],
    tablet: ["300x250"],
    mobile: ["300x250"],
  },
  footer: {
    desktop: ["728x90", "468x60"],
    tablet: ["468x60"],
    mobile: ["300x250", "320x50"],
  },
};

/**
 * Weighted-random rotation across all creatives that match the zone/device.
 * Higher-priority sizes get exponentially more weight, but lower-priority
 * sizes still appear sometimes — this is what lets the QA page observe
 * rotation across sizes over multiple refreshes.
 */
export function pickCreative(
  program: AffiliateProgram,
  zone: Zone,
  device: Device,
  lang: Lang,
  rng: () => number = Math.random
): AffiliateCreative | null {
  const list = program.creatives ?? [];
  if (list.length === 0) return null;

  const byLang = (c: AffiliateCreative) =>
    c.lang === lang ? 0 : !c.lang ? 1 : 2;

  const preferences = ZONE_SIZE_PREFERENCE[zone] ?? ZONE_SIZE_PREFERENCE["post-result"];
  const sizeOrder = preferences[device];

  // Best language tier present (0/1/2). Drop creatives in worse language tiers.
  const bestLang = Math.min(...list.map(byLang));
  const candidates = list.filter((c) => byLang(c) === bestLang);

  // Weight = 2^(N - rank). Unknown sizes get a tiny baseline weight (1) so
  // they can still appear if nothing in the preference list exists.
  const weighted = candidates.map((c) => {
    const rank = sizeOrder.indexOf(c.size);
    const weight = rank === -1 ? 1 : Math.pow(2, sizeOrder.length - rank);
    return { c, weight };
  });

  const total = weighted.reduce((sum, w) => sum + w.weight, 0);
  if (total === 0) return candidates[0] ?? null;
  let r = rng() * total;
  for (const { c, weight } of weighted) {
    r -= weight;
    if (r <= 0) return c;
  }
  return weighted[weighted.length - 1].c;
}
