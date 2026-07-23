/**
 * Rule-based fallback. Runs in <1ms with no network. Used when
 * decisions_cache has no row OR Cloud is unreachable.
 */
import type { AIDecision, CalculatorContext, AffiliateProgram, Zone } from "./types";
import { AFFILIATES } from "@/config/affiliates.config";
import {
  CATEGORY_PLACEMENT,
  DEFAULT_PLACEMENT,
  INTENT_BOOST,
  INTENT_MAP,
  SLUG_CATEGORY,
  ZONE_PRESETS,
  type PlacementRule,
} from "@/config/placements.config";
import { getZoneWeight } from "@/config/placementWeights";
import { getPageViewShown, markPageViewShown } from "./pageViewShown";
import { getCtrMultiplier, isEngaged } from "./adaptiveOptimizer";

const RECENCY_KEY = "aff_seen";
const RECENCY_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function wasShownRecently(affiliateId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const seen = JSON.parse(localStorage.getItem(RECENCY_KEY) || "{}");
    const ts = seen[affiliateId];
    return typeof ts === "number" && Date.now() - ts < RECENCY_WINDOW_MS;
  } catch {
    return false;
  }
}


const matchesPage = (a: AffiliateProgram, slug: string) =>
  a.target_pages.includes("*") || a.target_pages.includes(slug);

const matchesLang = (a: AffiliateProgram, lang: string) =>
  a.language_restriction.length === 0 ||
  a.language_restriction.includes(lang as never);

const matchesResults = (a: AffiliateProgram, signals: string[]) => {
  if (a.target_results.length === 0) return true;
  if (a.target_results.includes("*")) return true;
  if (signals.length === 0) return true; // no signals → don't filter out
  return a.target_results.some((r) => signals.includes(r));
};

const intentWeight: Record<NonNullable<AffiliateProgram["conversion_intent"]>, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

const tierWeight: Record<AffiliateProgram["tier"], number> = {
  1: 4,
  2: 2,
  3: 1,
};

export function scoreAffiliate(
  a: AffiliateProgram,
  ctx: CalculatorContext,
  zone?: Zone
): number {
  let score = 0;
  score += a.priority; // 1-10
  score += tierWeight[a.tier];
  if (a.conversion_intent) score += intentWeight[a.conversion_intent];
  if (a.target_pages.includes(ctx.slug)) score += 5;
  else if (a.target_pages.includes("*")) score += 1;
  const overlap = a.target_results.filter((r) =>
    ctx.resultSignals.includes(r)
  ).length;
  score += overlap * 2;
  if (a.language_restriction.includes(ctx.lang)) score += 2;
  // Banner-zone bonus: prefer affiliates that have creatives for image zones
  const isBannerZone =
    zone === "pre-footer" || zone === "inline-mid-article" || zone === "sidebar";
  if (isBannerZone && (a.creatives?.length ?? 0) > 0) score += 4;
  // Section-10 intent map: hard boost for the documented winners per slug+lang
  const intent = INTENT_MAP[ctx.slug];
  if (intent) {
    const list = ctx.lang === "tr" ? intent.tr : intent.en;
    if (list.includes(a.id)) score += INTENT_BOOST;
  }
  // Recency is now a HARD exclusion in scoreAndPick (Phase 5). The
  // small negative kept here only matters when the hard filter is
  // bypassed by the "everything was filtered out" graceful fallback.
  if (wasShownRecently(a.id)) score -= 3;

  // Geo-aware boost / suppress. Turkish traffic converts on native TR
  // exchanges (BTCTurk, Paribu, MEXC, Bybit) and cannot use Coinbase or
  // Swan (US-only). Kick those to the bottom instead of showing dead links.
  if (ctx.lang === "tr") {
    if (["btcturk", "paribu", "mexc", "bybit"].includes(a.id)) score += 6;
    if (["coinbase", "swan_bitcoin"].includes(a.id)) score -= 10;
  }

  // Admin-controlled placement weight (0 disables broker in that slot).
  if (zone) {
    const weight = getZoneWeight(a.id, zone);
    if (weight <= 0) return -Infinity;
    score = score * weight;
  }

  return score;
}

export interface ScoreOptions {
  /** Force zone (overrides category default). Used by site-wide placements. */
  zone?: Zone;
}

/** Tiny deterministic hash → [0,1). Stable across renders within the same
 *  day, so the same user keeps seeing the same banner on a given page until
 *  the daily bucket flips. */
function seededRandom(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 100000) / 100000;
}

/** Weighted rotation: pick one entry where probability ∝ score. */
function weightedPick<T extends { score: number }>(items: T[], seed: string): T {
  const total = items.reduce((s, it) => s + Math.max(1, it.score), 0);
  let r = seededRandom(seed) * total;
  for (const it of items) {
    r -= Math.max(1, it.score);
    if (r <= 0) return it;
  }
  return items[items.length - 1];
}

export function scoreAndPick(
  ctx: CalculatorContext,
  opts: ScoreOptions = {}
): AIDecision {
  let placement: PlacementRule;
  if (opts.zone) {
    placement = ZONE_PRESETS[opts.zone] ?? DEFAULT_PLACEMENT;
  } else {
    const category = SLUG_CATEGORY[ctx.slug];
    placement = (category && CATEGORY_PLACEMENT[category]) || DEFAULT_PLACEMENT;
  }

  const eligible = AFFILIATES.filter(
    (a) =>
      a.enabled &&
      matchesPage(a, ctx.slug) &&
      matchesLang(a, ctx.lang) &&
      matchesResults(a, ctx.resultSignals)
  );

  // Phase 5: HARD exclude programs already shown this page-view AND
  // programs shown to this visitor within the last hour. Both filters
  // gracefully fall back to the wider pool if they would empty the list.
  const pageShown = getPageViewShown();
  const afterPageView = eligible.filter((a) => !pageShown.has(a.id));
  const stage1 = afterPageView.length > 0 ? afterPageView : eligible;
  const afterRecency = stage1.filter((a) => !wasShownRecently(a.id));
  const candidates = afterRecency.length > 0 ? afterRecency : stage1;

  const scored = candidates
    .map((a) => ({ a, score: scoreAffiliate(a, ctx, opts.zone) }))
    .sort((x, y) => y.score - x.score);


  // Daily-bucketed rotation seed: keeps a session stable, balances across days.
  const dayBucket = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  const seed = `${ctx.slug}|${ctx.lang}|${ctx.segment}|${opts.zone ?? "auto"}|${dayBucket}`;

  let ranked: typeof scored;
  if (placement.max_affiliates === 1 && scored.length > 1) {
    // Rotate between all eligible programs weighted by score.
    ranked = [weightedPick(scored, seed)];
  } else if (scored.length > placement.max_affiliates) {
    // Multi-slot: keep top scorer, then rotate the rest.
    const [first, ...rest] = scored;
    const picked = [first];
    const pool = [...rest];
    while (picked.length < placement.max_affiliates && pool.length > 0) {
      const next = weightedPick(pool, `${seed}|${picked.length}`);
      picked.push(next);
      pool.splice(pool.indexOf(next), 1);
    }
    ranked = picked;
  } else {
    ranked = scored.slice(0, placement.max_affiliates);
  }

  // If the placement targets a banner zone, prefer the top program's
  // default_format when it overrides the preset.
  let format = placement.format;
  const top = ranked[0]?.a;
  if (top?.default_format) format = top.default_format;

  const ids = ranked.map((r) => r.a.id);
  // Phase 5: record this pick so the NEXT placement on the same page
  // hard-excludes the same programs. (AffiliatePlacement also marks
  // these on impression for the cross-pageview 1-hour cap.)
  for (const id of ids) markPageViewShown(id);


  return {
    slug: ctx.slug,
    lang: ctx.lang,
    segment: ctx.segment,
    affiliate_ids: ids,
    format,
    zone: placement.zone,
    delay_ms: placement.delay_ms,
    reasoning: opts.zone
      ? `zone-preset:${opts.zone}+rotation`
      : "rule-based+rotation",
    source: "fallback",
  };

}
