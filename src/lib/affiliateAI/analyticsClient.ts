/**
 * Fires impression/click events to the `log-event` edge function.
 *
 * Phase 7 — Resilient delivery:
 *   • Per-event retry with exponential backoff (3 attempts, 250ms→1s→4s).
 *   • Failed events are queued to localStorage and flushed on the next
 *     page load + every 30s + on `visibilitychange → visible`. This
 *     prevents Supabase cold-starts from silently dropping impressions.
 *   • The queue is capped at 100 events (FIFO eviction) so a long offline
 *     session cannot bloat localStorage.
 *   • Best-effort: all failures stay silent in production.
 */
const ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/log-event`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

export type AffiliateEvent = {
  kind: "impression" | "click";
  affiliate_id: string;
  slug: string;
  lang: string;
  segment?: string;
};

type QueuedEvent = {
  payload: Record<string, string>;
  attempts: number;
  queuedAt: number;
};

const QUEUE_KEY = "aff_event_queue_v1";
const MAX_QUEUE = 100;
const MAX_ATTEMPTS = 3;
const BACKOFFS_MS = [250, 1000, 4000];

const seenImpressions = new Set<string>();

function readQueue(): QueuedEvent[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? (JSON.parse(raw) as QueuedEvent[]) : [];
  } catch {
    return [];
  }
}

function writeQueue(q: QueuedEvent[]) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(q.slice(-MAX_QUEUE)));
  } catch {
    /* quota — drop silently */
  }
}

function enqueue(payload: Record<string, string>, attempts: number) {
  const q = readQueue();
  q.push({ payload, attempts, queuedAt: Date.now() });
  writeQueue(q);
}

async function postOnce(payload: Record<string, string>): Promise<boolean> {
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      mode: "cors",
      credentials: "omit",
      headers: {
        "Content-Type": "application/json",
        apikey: ANON_KEY,
      },
      body: JSON.stringify(payload),
      keepalive: true,
    });
    // 2xx and 3xx → success. Anything else → retry.
    return res.ok || (res.status >= 200 && res.status < 400);
  } catch {
    return false;
  }
}

function sendWithRetry(payload: Record<string, string>, attempt = 0) {
  postOnce(payload).then((ok) => {
    if (ok) return;
    const next = attempt + 1;
    if (next >= MAX_ATTEMPTS) {
      enqueue(payload, next);
      return;
    }
    setTimeout(() => sendWithRetry(payload, next), BACKOFFS_MS[next] ?? 4000);
  });
}

async function flushQueue() {
  // Hard consent gate — never POST buffered events until the user
  // explicitly grants analytics consent.
  if (typeof window !== "undefined" && !consentGrantedSafe()) return;
  const q = readQueue();
  if (q.length === 0) return;
  const remaining: QueuedEvent[] = [];
  for (const item of q) {
    const ok = await postOnce(item.payload);
    if (!ok) {
      const attempts = item.attempts + 1;
      // Give up after ~10 total attempts across sessions to avoid
      // permanently-poisoned queue entries.
      if (attempts < 10) remaining.push({ ...item, attempts });
    }
  }
  writeQueue(remaining);
}

// Boot-time flush + periodic + visibility-driven flush.
// All flushes are themselves consent-gated below.
if (typeof window !== "undefined") {
  // Defer to next tick so we don't compete with the first paint.
  setTimeout(() => {
    flushQueue();
  }, 1500);
  setInterval(() => {
    flushQueue();
  }, 30_000);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") flushQueue();
  });
  // Flush as soon as the user grants consent — the queue may already
  // hold impressions captured during the pre-consent buffering window.
  window.addEventListener("consentchange", (e) => {
    const value = (e as CustomEvent<"granted" | "denied">).detail;
    if (value === "granted") flushQueue();
  });
}

const CONSENT_KEY = "bct-consent-v1";

/**
 * Consent-mode gate.
 *
 * Until the user explicitly grants analytics consent we BUFFER events
 * to the local queue instead of POSTing them, so no PII (IP, UA) lands
 * on the edge function during the pre-consent window. Once consent is
 * granted (or pre-granted on returning visits) the queue flushes.
 *
 * Returns true when the network call is allowed right now.
 */
function consentGranted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(CONSENT_KEY) === "granted";
  } catch {
    return false;
  }
}

export function logEvent(evt: AffiliateEvent) {
  const key = `${evt.kind}:${evt.affiliate_id}:${evt.slug}:${evt.lang}:${evt.segment || "default"}`;
  if (evt.kind === "impression") {
    if (seenImpressions.has(key)) return;
    seenImpressions.add(key);
  }
  // Map client shape -> edge function schema (type/affiliateId).
  const payload = {
    type: evt.kind,
    affiliateId: evt.affiliate_id,
    slug: evt.slug,
    lang: evt.lang,
    segment: evt.segment || "default",
  };
  // Pre-consent: buffer to queue without firing the network call. The
  // `consentchange → granted` listener above will flush it.
  if (!consentGranted()) {
    enqueue(payload, 0);
    return;
  }
  try {
    sendWithRetry(payload);
  } catch {
    enqueue(payload, MAX_ATTEMPTS);
  }
}
