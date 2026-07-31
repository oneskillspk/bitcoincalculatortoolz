import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useExperiment } from "@/hooks/useExperiment";
import { EXPERIMENTS, type ExperimentKey } from "@/config/experiments.config";

/**
 * Multi-armed bandit variant selector for affiliate experiments.
 *
 * Strategy: **epsilon-greedy over live performance weights** with a maturity gate.
 *   • Reads per-partner relative performance `weight` (0–1, derived from EPC
 *     server-side) and `clicks_30d` from `public.epc_live`. Money columns
 *     (epc_usd, revenue_30d_usd, conversions_30d) are admin-only and are never
 *     exposed to the browser.
 *   • Until EVERY variant has ≥ `minClicksPerArm` clicks in the last
 *     30 days, we behave exactly like `useExperiment` — deterministic,
 *     equal-split bucketing so early data is unbiased.
 *   • Once every arm is mature: with probability `epsilon` (default
 *     15%) we keep exploring via the deterministic bucket; the other
 *     85% we exploit the highest-EPC arm. The explore/exploit coin is
 *     itself bucketed on visitor id so a given visitor sees a stable
 *     variant across sessions.
 *
 * Falls back to the equal-split hook on:
 *   • network / RLS errors reading epc_live
 *   • SSR (no localStorage → visitor id "ssr")
 *
 * Every returned variant is stamped onto `impression`/`click` events
 * via `variant_id`, so per-arm CVR remains queryable.
 */

const EPSILON = 0.15;
const MIN_CLICKS_PER_ARM = 30;
const CACHE_KEY = "bct_bandit_epc_v1";
const CACHE_TTL_MS = 5 * 60 * 1000;

type EpcRow = { affiliate_id: string; weight: number; clicks_30d: number };

interface CachedEpc {
  fetchedAt: number;
  rows: EpcRow[];
}

async function loadEpc(): Promise<EpcRow[] | null> {
  if (typeof window === "undefined") return null;
  try {
    const cached = window.sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached) as CachedEpc;
      if (Date.now() - parsed.fetchedAt < CACHE_TTL_MS) return parsed.rows;
    }
  } catch {
    /* ignore */
  }
  const { data, error } = await supabase
    .from("epc_live")
    .select("affiliate_id, epc_usd, clicks_30d");
  if (error || !data) return null;
  const rows = data as EpcRow[];
  try {
    window.sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ fetchedAt: Date.now(), rows } satisfies CachedEpc),
    );
  } catch {
    /* quota / private mode — ignore */
  }
  return rows;
}

function fnv(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function getVisitorId(): string {
  if (typeof window === "undefined") return "ssr";
  try {
    return window.localStorage.getItem("bct_visitor_id_v1") ?? "anon";
  } catch {
    return "anon";
  }
}

export interface BanditResult {
  variantId: string;
  experimentKey: string;
  stamp: string;
  /** True when the pick came from the exploit branch (best EPC). */
  exploited: boolean;
  /** True while the arm is still learning (or EPC data unavailable). */
  learning: boolean;
}

export function useBanditVariant(
  key: ExperimentKey,
  opts: { epsilon?: number; minClicksPerArm?: number } = {},
): BanditResult {
  const epsilon = opts.epsilon ?? EPSILON;
  const minClicks = opts.minClicksPerArm ?? MIN_CLICKS_PER_ARM;

  // Deterministic equal-split fallback (also our explorer branch).
  const equalSplit = useExperiment<{ partnerId?: string }>(key);

  const [epc, setEpc] = useState<EpcRow[] | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    loadEpc()
      .then((rows) => {
        if (!alive) return;
        setEpc(rows);
      })
      .finally(() => {
        if (alive) setLoaded(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  return useMemo<BanditResult>(() => {
    const base: Omit<BanditResult, "variantId" | "stamp"> = {
      experimentKey: key,
      exploited: false,
      learning: true,
    };
    // Pre-load or missing EPC data → equal-split.
    if (!loaded || !epc || !Array.isArray(epc)) {
      return {
        ...base,
        variantId: equalSplit.variantId,
        stamp: equalSplit.stamp,
      };
    }

    const exp = EXPERIMENTS[key];
    if (!exp) return { ...base, variantId: "control", stamp: `${key}:control` };

    const armIds = exp.variants.map((v) => v.id);
    const perArm = armIds.map((id) => {
      const row = epc.find((r) => r.affiliate_id === id);
      return {
        id,
        epc: row?.epc_usd ?? 0,
        clicks: row?.clicks_30d ?? 0,
      };
    });
    const allMature = perArm.every((a) => a.clicks >= minClicks);
    if (!allMature) {
      return {
        ...base,
        variantId: equalSplit.variantId,
        stamp: equalSplit.stamp,
      };
    }

    // Explore/exploit split on visitor id so a given visitor is stable.
    const visitor = getVisitorId();
    const bucket = fnv(`${visitor}::bandit::${key}`) % 100;
    const explore = bucket < Math.round(epsilon * 100);

    if (explore) {
      return {
        ...base,
        learning: false,
        variantId: equalSplit.variantId,
        stamp: equalSplit.stamp,
      };
    }

    const best = perArm.reduce((a, b) => (b.epc > a.epc ? b : a));
    return {
      experimentKey: key,
      exploited: true,
      learning: false,
      variantId: best.id,
      stamp: `${key}:${best.id}`,
    };
  }, [epc, loaded, equalSplit.variantId, equalSplit.stamp, key, epsilon, minClicks]);
}
