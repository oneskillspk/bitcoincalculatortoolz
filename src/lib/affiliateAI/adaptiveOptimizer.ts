/**
 * Adaptive Placement Optimizer
 * ----------------------------
 * Local, real-time feedback loop that shifts ad slots based on the
 * user's own CTR and engagement. Zero-network, zero-cost.
 *
 * Signals tracked (per browser, localStorage):
 *   • Impressions  per (slug|zone|affiliate)
 *   • Clicks       per (slug|zone|affiliate)
 *   • Engagement   per slug (scroll >50% AND dwell >15s)
 *
 * Consumers:
 *   • scoringEngine.scoreAffiliate → CTR multiplier on final score.
 *   • AffiliatePlacement           → recordImpression / recordClick.
 *   • useEngagementSignal          → recordEngagement.
 *
 * Design choices:
 *   • Laplace-smoothed CTR:  (clicks + α) / (impressions + α + β)
 *     with α=1, β=40  → a fresh slot starts at ~2.4% (site baseline)
 *     and moves smoothly as data accrues. No cold-start dominance.
 *   • Multiplier is clamped to [0.4, 2.0] so we never fully starve
 *     a slot nor let one runaway winner monopolize inventory.
 *   • 14-day sliding window (older buckets decay) so seasonal
 *     creatives can recover.
 */

const LS_KEY = "aff_adaptive_v1";
const ENG_KEY = "aff_engaged_v1";
const WINDOW_MS = 14 * 24 * 60 * 60 * 1000;

const ALPHA = 1;      // Laplace prior — clicks
const BETA = 40;      // Laplace prior — non-clicks (baseline CTR ~2.4%)
const BASELINE_CTR = ALPHA / (ALPHA + BETA);

const MIN_MULT = 0.4;
const MAX_MULT = 2.0;
const MIN_IMPRESSIONS_TO_ADJUST = 20;

interface Bucket {
  impressions: number;
  clicks: number;
  lastTs: number;
}

type Store = Record<string, Bucket>;

const memStore: Store = {};
let hydrated = false;

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function load(): Store {
  if (!isBrowser()) return memStore;
  if (hydrated) return memStore;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Store;
      const now = Date.now();
      for (const [k, v] of Object.entries(parsed)) {
        if (v && typeof v.lastTs === "number" && now - v.lastTs < WINDOW_MS) {
          memStore[k] = v;
        }
      }
    }
  } catch {
    /* corrupt payload — start clean */
  }
  hydrated = true;
  return memStore;
}

let flushTimer: ReturnType<typeof setTimeout> | null = null;
function persist(): void {
  if (!isBrowser()) return;
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(memStore));
    } catch {
      /* quota — drop */
    }
  }, 500);
}

export function makeKey(slug: string, zone: string, affiliateId: string): string {
  return `${slug}|${zone}|${affiliateId}`;
}

export function recordImpression(slug: string, zone: string, affiliateId: string): void {
  const store = load();
  const key = makeKey(slug, zone, affiliateId);
  const b = store[key] ?? { impressions: 0, clicks: 0, lastTs: 0 };
  b.impressions += 1;
  b.lastTs = Date.now();
  store[key] = b;
  persist();
}

export function recordClick(slug: string, zone: string, affiliateId: string): void {
  const store = load();
  const key = makeKey(slug, zone, affiliateId);
  const b = store[key] ?? { impressions: 0, clicks: 0, lastTs: 0 };
  b.clicks += 1;
  b.lastTs = Date.now();
  store[key] = b;
  persist();
}

export function getBucket(slug: string, zone: string, affiliateId: string): Bucket | undefined {
  const store = load();
  return store[makeKey(slug, zone, affiliateId)];
}

/**
 * Score multiplier for the (slug, zone, affiliate) triple.
 * Returns 1.0 when we have insufficient data.
 */
export function getCtrMultiplier(slug: string, zone: string, affiliateId: string): number {
  const b = getBucket(slug, zone, affiliateId);
  if (!b || b.impressions < MIN_IMPRESSIONS_TO_ADJUST) return 1;
  const smoothedCtr = (b.clicks + ALPHA) / (b.impressions + ALPHA + BETA);
  const ratio = smoothedCtr / BASELINE_CTR;
  // Compress with sqrt so extreme CTRs don't nuke rotation diversity.
  const mult = Math.sqrt(ratio);
  return Math.min(MAX_MULT, Math.max(MIN_MULT, mult));
}

/**
 * Aggregate CTR across all affiliates in a zone for a slug.
 * Used by bestZoneFor to promote well-performing zones.
 */
export function getZoneCtr(slug: string, zone: string): { ctr: number; impressions: number } {
  const store = load();
  let imp = 0;
  let clk = 0;
  for (const [k, v] of Object.entries(store)) {
    const [s, z] = k.split("|");
    if (s === slug && z === zone) {
      imp += v.impressions;
      clk += v.clicks;
    }
  }
  return { ctr: imp === 0 ? 0 : clk / imp, impressions: imp };
}

/**
 * Returns the zone with the highest smoothed CTR for a slug, or null
 * when no zone has crossed the confidence threshold.
 */
export function bestZoneFor(slug: string, zones: string[]): string | null {
  let best: { zone: string; score: number } | null = null;
  for (const z of zones) {
    const { ctr, impressions } = getZoneCtr(slug, z);
    if (impressions < MIN_IMPRESSIONS_TO_ADJUST) continue;
    const smoothed = (ctr * impressions + ALPHA) / (impressions + ALPHA + BETA);
    if (!best || smoothed > best.score) best = { zone: z, score: smoothed };
  }
  return best?.zone ?? null;
}

/* ---------------------------- Engagement ---------------------------- */

interface EngagementRecord {
  engaged: boolean;
  ts: number;
}

export function recordEngagement(slug: string): void {
  if (!isBrowser()) return;
  try {
    const raw = sessionStorage.getItem(ENG_KEY);
    const map = (raw ? JSON.parse(raw) : {}) as Record<string, EngagementRecord>;
    map[slug] = { engaged: true, ts: Date.now() };
    sessionStorage.setItem(ENG_KEY, JSON.stringify(map));
    try {
      window.dispatchEvent(new CustomEvent("aff:engaged", { detail: { slug } }));
    } catch {
      /* ignore */
    }
  } catch {
    /* ignore */
  }
}

export function isEngaged(slug: string): boolean {
  if (!isBrowser()) return false;
  try {
    const raw = sessionStorage.getItem(ENG_KEY);
    if (!raw) return false;
    const map = JSON.parse(raw) as Record<string, EngagementRecord>;
    return !!map[slug]?.engaged;
  } catch {
    return false;
  }
}

/* ---------------------------- Debug / QA ---------------------------- */

export function snapshot(): Store {
  return { ...load() };
}

export function reset(): void {
  for (const k of Object.keys(memStore)) delete memStore[k];
  if (isBrowser()) {
    try {
      localStorage.removeItem(LS_KEY);
      sessionStorage.removeItem(ENG_KEY);
    } catch {
      /* ignore */
    }
  }
}
