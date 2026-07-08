/**
 * Deterministic client-side A/B bucketing.
 *
 * No third-party dep, no cookie prompt, no vendor bill. A stable
 * anonymous `visitor_id` is minted once per browser and used together
 * with the experiment key to hash into a variant slot. Same visitor
 * always sees the same variant across pages and sessions.
 *
 * Every experiment variant a visitor sees is stamped into their next
 * `click`/`impression` payload as `variant_id`, so SQL group-bys on
 * `clicks.variant_id JOIN conversions` give real CVR per variant.
 */
import { useMemo } from "react";
import { EXPERIMENTS, type ExperimentKey, type Variant } from "@/config/experiments.config";

const VISITOR_KEY = "bct_visitor_id_v1";

function getVisitorId(): string {
  if (typeof window === "undefined") return "ssr";
  try {
    const cached = window.localStorage.getItem(VISITOR_KEY);
    if (cached) return cached;
    const v =
      (typeof crypto !== "undefined" && crypto.randomUUID)
        ? crypto.randomUUID()
        : "v-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    window.localStorage.setItem(VISITOR_KEY, v);
    return v;
  } catch {
    return "anon";
  }
}

// FNV-1a 32-bit — small, fast, good-enough distribution for bucketing.
function hash(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export interface ExperimentResult<TPayload = unknown> {
  variantId: string;
  payload: TPayload;
  experimentKey: string;
  /** Full stamp for logging: `${experimentKey}:${variantId}`. */
  stamp: string;
}

export function useExperiment<TPayload = unknown>(
  key: ExperimentKey,
): ExperimentResult<TPayload> {
  return useMemo(() => {
    const exp = EXPERIMENTS[key];
    if (!exp || exp.variants.length === 0) {
      return { variantId: "control", payload: {} as TPayload, experimentKey: key, stamp: `${key}:control` };
    }
    const visitor = getVisitorId();
    const bucket = hash(`${visitor}::${exp.key}`) % 100;

    const totalWeight = exp.variants.reduce((s, v) => s + (v.weight ?? 1), 0);
    let cursor = 0;
    let chosen: Variant<TPayload> = exp.variants[0] as Variant<TPayload>;
    for (const v of exp.variants) {
      const share = ((v.weight ?? 1) / totalWeight) * 100;
      cursor += share;
      if (bucket < cursor) {
        chosen = v as Variant<TPayload>;
        break;
      }
    }
    return {
      variantId: chosen.id,
      payload: chosen.payload as TPayload,
      experimentKey: exp.key,
      stamp: `${exp.key}:${chosen.id}`,
    };
  }, [key]);
}
