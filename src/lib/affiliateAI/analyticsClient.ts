/**
 * Fires impression/click events to the `log-event` edge function.
 * Best-effort; failures are swallowed. Works in shadow mode too.
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

const seenImpressions = new Set<string>();

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
  try {
    const body = JSON.stringify(payload);
    // Always use fetch with credentials:'omit' so the browser does not send
    // cookies (which would force CORS into credentialed mode and reject our
    // wildcard / cross-origin response).
    fetch(ENDPOINT, {
      method: "POST",
      mode: "cors",
      credentials: "omit",
      headers: {
        "Content-Type": "application/json",
        apikey: ANON_KEY,
      },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* noop */
  }
}
