/**
 * Resolves an AIDecision + program registry into ready-to-render
 * affiliate items (localized URL + CTA + description). Also reports
 * the **effective** language that was actually rendered, so the caller
 * can log analytics and render the disclosure in the correct locale
 * instead of drifting to whatever the URL claimed.
 */
import { AFFILIATES } from "@/config/affiliates.config";
import type { AffiliateProgram, AIDecision, Lang } from "./types";

export interface ResolvedAffiliate {
  program: AffiliateProgram;
  url: string;
  cta: string;
  description: string;
  badge: string | null;
  /** The locale of the strings actually rendered (may differ from the
   *  requested lang when the partner only ships one locale). */
  effectiveLang: Lang;
}

const pick = <T,>(
  primary: T | null | undefined,
  secondary: T | null | undefined,
): { value: T | null; usedFallback: boolean } => {
  if (primary !== null && primary !== undefined) {
    return { value: primary, usedFallback: false };
  }
  if (secondary !== null && secondary !== undefined) {
    return { value: secondary, usedFallback: true };
  }
  return { value: null, usedFallback: false };
};

export function resolveAffiliates(
  decision: AIDecision,
  lang: Lang,
): ResolvedAffiliate[] {
  return decision.affiliate_ids
    .map((id) => AFFILIATES.find((a) => a.id === id))
    .filter((p): p is AffiliateProgram => !!p && p.enabled)
    .map((program) => {
      const primary = lang;
      const secondary: Lang = lang === "tr" ? "en" : "tr";
      const urlPick = pick(
        primary === "tr" ? program.url_tr : program.url_en,
        primary === "tr" ? program.url_en : program.url_tr,
      );
      const ctaPick = pick(
        primary === "tr" ? program.cta_short_tr : program.cta_short_en,
        primary === "tr" ? program.cta_short_en : program.cta_short_tr,
      );
      const descPick = pick(
        primary === "tr" ? program.description_tr : program.description_en,
        primary === "tr" ? program.description_en : program.description_tr,
      );
      const badgePick = pick(
        primary === "tr" ? program.badge_tr : program.badge_en,
        primary === "tr" ? program.badge_en : program.badge_tr,
      );
      const fellBack =
        urlPick.usedFallback ||
        ctaPick.usedFallback ||
        descPick.usedFallback;
      return {
        program,
        url: urlPick.value || "#",
        cta: ctaPick.value || program.name,
        description: descPick.value || "",
        badge: badgePick.value,
        effectiveLang: fellBack ? secondary : primary,
      } satisfies ResolvedAffiliate;
    })
    .filter((r) => r.url !== "#");
}
