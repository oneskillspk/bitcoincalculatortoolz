/**
 * Affiliate render tracker.
 *
 * Fires whenever a placement actually paints a creative (not just when
 * the AI decision resolves). Gives us ground-truth "who served where"
 * so we can confirm a broker like Axi is truly rendering in Slot B on
 * the lot-size page — separate from the impression log which counts
 * decisions, not paints.
 *
 * Consumers:
 *   • `AffiliateDebugOverlay` — surfaces a per-zone table.
 *   • Any external tool listening to `window` event `aff:render`.
 *   • `window.__AFF_RENDERS__` — last 200 renders (ring buffer) for
 *     ad-hoc console inspection.
 */
export interface AffiliateRender {
  ts: number;
  slug: string;
  zone: string;
  format: string;
  lang: string;
  affiliate_id: string;
  variant_id?: string;
  creative?: {
    size?: string;
    width?: number;
    height?: number;
    image_url?: string;
    landing_url?: string | null;
  };
}

const MAX = 200;

function bucket(): AffiliateRender[] {
  if (typeof window === "undefined") return [];
  const w = window as unknown as { __AFF_RENDERS__?: AffiliateRender[] };
  if (!w.__AFF_RENDERS__) w.__AFF_RENDERS__ = [];
  return w.__AFF_RENDERS__;
}

export function reportRender(r: AffiliateRender): void {
  if (typeof window === "undefined") return;
  const b = bucket();
  b.push(r);
  if (b.length > MAX) b.splice(0, b.length - MAX);
  try {
    window.dispatchEvent(new CustomEvent("aff:render", { detail: r }));
  } catch {
    /* ignore */
  }
}

export function getRenders(): AffiliateRender[] {
  return bucket().slice();
}

export function clearRenders(): void {
  const b = bucket();
  b.length = 0;
}
