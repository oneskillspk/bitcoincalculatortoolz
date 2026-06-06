/**
 * Reads pre-computed AI decisions from Cloud `decisions_cache`.
 * Also reads `affiliate_overrides` for force/hide rules. Falls back
 * to the rule-based scoring engine on miss or network error.
 */
import { supabase } from "@/integrations/supabase/client";
import type { AIDecision, CalculatorContext, OverrideRecord } from "./types";
import { scoreAndPick } from "./scoringEngine";

export async function fetchDecision(
  ctx: CalculatorContext
): Promise<AIDecision> {
  try {
    const [{ data: cached }, { data: override }] = await Promise.all([
      supabase
        .from("decisions_cache")
        .select("*")
        .eq("slug", ctx.slug)
        .eq("lang", ctx.lang)
        .eq("segment", ctx.segment)
        .maybeSingle(),
      supabase
        .from("affiliate_overrides")
        .select("*")
        .eq("slug", ctx.slug)
        .eq("lang", ctx.lang)
        .maybeSingle(),
    ]);

    const ov = override as OverrideRecord | null;
    if (ov?.hidden) {
      return { ...scoreAndPick(ctx), affiliate_ids: [], source: "override" };
    }
    if (ov?.forced_affiliate_id) {
      const base = cached
        ? mapCached(cached, ctx)
        : scoreAndPick(ctx);
      return {
        ...base,
        affiliate_ids: [ov.forced_affiliate_id],
        zone: (ov.forced_zone as AIDecision["zone"]) || base.zone,
        source: "override",
      };
    }
    if (cached) return mapCached(cached, ctx);
  } catch {
    /* swallow → fallback */
  }
  return scoreAndPick(ctx);
}

function mapCached(row: any, ctx: CalculatorContext): AIDecision {
  return {
    slug: ctx.slug,
    lang: ctx.lang,
    segment: ctx.segment,
    affiliate_ids: row.affiliate_ids ?? [],
    format: row.format,
    zone: row.zone,
    delay_ms: row.delay_ms ?? 800,
    cta_override: row.cta_override ?? null,
    reasoning: row.reasoning ?? null,
    generated_at: row.generated_at,
    source: "cache",
  };
}
