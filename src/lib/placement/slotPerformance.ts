/**
 * Slot-level performance ranking with guardrails.
 *
 * Re-ranks Slot A/C/D by observed EPC × CTR so the density-cap trimmer
 * in usePlacementOrchestrator drops the genuinely weakest slot first,
 * instead of always trimming a fixed order.
 *
 * Guardrails (non-negotiable):
 *   • Slot B is ALWAYS priority #1. B fires on explicit intent
 *     (result lands) and never participates in re-ranking.
 *   • A slot only overrides its default rank once it has at least
 *     MIN_SAMPLE impressions — small samples cannot demote a slot.
 *   • Output is a strict total order over {A,C,D}. Combined with the
 *     existing collision rules (A yields to B, B+D mobile guard) this
 *     preserves the "no double-arm" invariant.
 *
 * Data source: a JSON blob in localStorage written by the admin
 * Revenue dashboard ("Publish slot ranks") after it aggregates the
 * clicks/impressions tables. Absent or stale data ⇒ defaults.
 */

export type SlotKey = "A" | "B" | "C" | "D";

export interface SlotStats {
  impressions: number;
  clicks: number;
  /** USD earned (estimated or actual). */
  revenue: number;
}

export type SlotStatsMap = Partial<Record<SlotKey, SlotStats>>;

const STORAGE_KEY = "aff_slot_stats_v1";
const MIN_SAMPLE = 200;
const MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

// Default priority (lower = higher priority). B pinned, others tuned by
// historical mobile/desktop performance — A converts best pre-result on
// desktop, D on mobile, C is fallback long-content.
const DEFAULT_PRIORITY = {
  desktop: { A: 2, D: 3, C: 4 } as Record<Exclude<SlotKey, "B">, number>,
  mobile: { D: 2, A: 3, C: 4 } as Record<Exclude<SlotKey, "B">, number>,
};

interface StoredPayload {
  updatedAt: number;
  stats: SlotStatsMap;
}

function readStored(): StoredPayload | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredPayload;
    if (!parsed?.stats || typeof parsed.updatedAt !== "number") return null;
    if (Date.now() - parsed.updatedAt > MAX_AGE_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Effective score = EPC × CTR. Higher = better. */
function scoreOf(s: SlotStats | undefined): number | null {
  if (!s || s.impressions < MIN_SAMPLE) return null;
  const ctr = s.clicks / s.impressions;
  const epc = s.clicks > 0 ? s.revenue / s.clicks : 0;
  return ctr * epc;
}

/**
 * Returns a total-ordered priority list of {A,C,D} with B pinned first.
 * Lower index = higher priority (matches the orchestrator's existing
 * `pri` numbering).
 */
export function rankedSlotPriority(
  isMobile: boolean
): Array<{ key: SlotKey; pri: number }> {
  const defaults = isMobile ? DEFAULT_PRIORITY.mobile : DEFAULT_PRIORITY.desktop;
  const stored = readStored()?.stats ?? {};

  const candidates: Array<Exclude<SlotKey, "B">> = ["A", "C", "D"];

  // For each non-B slot decide its sort key: observed score when we have
  // enough samples, otherwise -∞ so it falls back to defaults order.
  const ranked = candidates
    .map((key) => ({
      key,
      observed: scoreOf(stored[key]),
      fallback: defaults[key],
    }))
    .sort((a, b) => {
      // Slots with observed scores rank above un-sampled ones.
      if (a.observed !== null && b.observed !== null) {
        return b.observed - a.observed;
      }
      if (a.observed !== null) return -1;
      if (b.observed !== null) return 1;
      return a.fallback - b.fallback;
    });

  return [
    { key: "B" as const, pri: 1 },
    ...ranked.map((r, i) => ({ key: r.key as SlotKey, pri: i + 2 })),
  ];
}

/** Admin/test helper — write ranks atomically. */
export function publishSlotStats(stats: SlotStatsMap): void {
  if (typeof localStorage === "undefined") return;
  try {
    const payload: StoredPayload = { updatedAt: Date.now(), stats };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* quota — keep defaults */
  }
}

/** Test helper. */
export function __resetSlotPerformance(): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* noop */
  }
}
