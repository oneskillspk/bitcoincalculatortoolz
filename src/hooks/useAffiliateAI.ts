/**
 * Single entry point for placement components.
 * Builds context, fetches decision (cache → override → fallback),
 * resolves to renderable items, and exposes shadow-mode flag.
 */
import { useEffect, useState } from "react";
import {
  AFFILIATE_ENGINE_ENABLED,
  AFFILIATE_SHADOW_MODE,
} from "@/config/affiliates.config";
import { buildContext } from "@/lib/affiliateAI/contextEngine";
import { fetchDecision } from "@/lib/affiliateAI/decisionClient";
import { scoreAndPick } from "@/lib/affiliateAI/scoringEngine";
import {
  resolveAffiliates,
  type ResolvedAffiliate,
} from "@/lib/affiliateAI/placementResolver";
import type { AIDecision, Lang, Zone } from "@/lib/affiliateAI/types";

export interface UseAffiliateAIOptions {
  slug: string;
  lang?: Lang;
  resultSignals?: string[];
  /** Force placement to use a specific zone (skips category default). */
  zone?: Zone;
  /** If true, skip Cloud fetch and use rule-based pick synchronously. */
  syncOnly?: boolean;
  /** Force a specific affiliate id (bypasses scoring + Cloud fetch). */
  forceAffiliateId?: string;
  /** Optional format override when forcing an affiliate id. */
  forceFormat?: AIDecision["format"];
  /** Override how many affiliates the decision returns (promo-grid uses 3). */
  maxAffiliates?: number;
}

export interface UseAffiliateAIResult {
  decision: AIDecision | null;
  items: ResolvedAffiliate[];
  loading: boolean;
  hidden: boolean;
  shadow: boolean;
}

export function useAffiliateAI({
  slug,
  lang = "en",
  resultSignals = [],
  zone,
  syncOnly = false,
  forceAffiliateId,
  forceFormat,
  maxAffiliates,
}: UseAffiliateAIOptions): UseAffiliateAIResult {
  const ctx = buildContext({ slug, lang, resultSignals });
  const hidden = !AFFILIATE_ENGINE_ENABLED || ctx.optedOut;

  const useSyncPath = syncOnly || !!zone || !!forceAffiliateId;

  const buildForced = (): AIDecision => ({
    slug,
    lang,
    segment: ctx.segment,
    affiliate_ids: [forceAffiliateId as string],
    format: forceFormat ?? "single-card",
    zone: zone ?? "inline",
    delay_ms: 0,
    source: "override",
  });

  const [decision, setDecision] = useState<AIDecision | null>(() => {
    if (hidden) return null;
    if (forceAffiliateId) return buildForced();
    return useSyncPath
      ? scoreAndPick(ctx, { zone, maxAffiliates, format: forceFormat })
      : null;
  });
  const [loading, setLoading] = useState<boolean>(
    !useSyncPath && !hidden && !forceAffiliateId
  );

  useEffect(() => {
    if (hidden || useSyncPath) return;
    let cancelled = false;
    fetchDecision(ctx).then((d) => {
      if (!cancelled) {
        setDecision(d);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, lang, ctx.segment, resultSignals.join("|"), zone, forceAffiliateId]);

  const items = decision ? resolveAffiliates(decision, lang, resultSignals) : [];

  return {
    decision,
    items,
    loading,
    hidden,
    shadow: AFFILIATE_SHADOW_MODE,
  };
}
