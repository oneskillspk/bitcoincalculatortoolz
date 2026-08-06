/**
 * Offer window status for affiliate promo cards.
 *
 * Partners may declare an optional `offer_start` / `offer_end` (YYYY-MM-DD).
 * Rules:
 *  - no dates            -> evergreen, "Ongoing" (green)
 *  - inside the window    -> "Ongoing" (green); ending within 14 days ->
 *                            "Ends <date>" (amber)
 *  - after `offer_end`    -> expired: no pill and the offer badge is suppressed
 *  - before `offer_start` -> upcoming: no pill
 */
import type { Lang } from "./types";

export type OfferState = "ongoing" | "ending-soon" | "upcoming" | "expired";

export interface OfferStatus {
  state: OfferState;
  /** Pill label, null when nothing should be shown. */
  label: string | null;
  tone: "success" | "warning" | null;
  /** False when the partner's promo badge must be hidden (stale claim). */
  showBadge: boolean;
}

const ENDING_SOON_DAYS = 14;
const DAY_MS = 86_400_000;

const LABEL: Record<Lang, { ongoing: string; ends: (d: string) => string }> = {
  en: { ongoing: "Ongoing", ends: (d) => `Ends ${d}` },
  tr: { ongoing: "Devam ediyor", ends: (d) => `${d} tarihinde bitiyor` },
};

function parseDay(value?: string | null): number | null {
  if (!value) return null;
  const ts = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(ts) ? ts : null;
}

function formatDay(ts: number, lang: Lang): string {
  return new Date(ts).toLocaleDateString(lang === "tr" ? "tr-TR" : "en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function getOfferStatus(
  offerStart: string | null | undefined,
  offerEnd: string | null | undefined,
  lang: Lang,
  now: Date = new Date(),
): OfferStatus {
  const start = parseDay(offerStart);
  const end = parseDay(offerEnd);
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const t = LABEL[lang] ?? LABEL.en;

  if (start !== null && today < start) {
    return { state: "upcoming", label: null, tone: null, showBadge: true };
  }
  if (end !== null && today > end) {
    return { state: "expired", label: null, tone: null, showBadge: false };
  }
  if (end !== null && end - today <= ENDING_SOON_DAYS * DAY_MS) {
    return {
      state: "ending-soon",
      label: t.ends(formatDay(end, lang)),
      tone: "warning",
      showBadge: true,
    };
  }
  return { state: "ongoing", label: t.ongoing, tone: "success", showBadge: true };
}

/** Shorten a partner badge to a single emphasis token ("A • B" -> "A"). */
export function shortBadge(badge?: string | null): string | null {
  if (!badge) return null;
  const first = badge.split("•")[0].trim();
  if (!first) return null;
  return first.length > 20 ? `${first.slice(0, 20).trim()}…` : first;
}
