/**
 * Resolves an AIDecision + program registry into ready-to-render
 * affiliate items (localized URL + CTA + description).
 */
import { AFFILIATES } from "@/config/affiliates.config";
import type { AffiliateProgram, AIDecision, Lang } from "./types";

export interface ResolvedAffiliate {
  program: AffiliateProgram;
  url: string;
  cta: string;
  description: string;
  badge: string | null;
}

const pick = <T,>(en: T | null | undefined, tr: T | null | undefined, lang: Lang): T | null =>
  (lang === "tr" ? tr : en) ?? (lang === "tr" ? en : tr) ?? null;

export function resolveAffiliates(
  decision: AIDecision,
  lang: Lang
): ResolvedAffiliate[] {
  return decision.affiliate_ids
    .map((id) => AFFILIATES.find((a) => a.id === id))
    .filter((p): p is AffiliateProgram => !!p && p.enabled)
    .map((program) => {
      const url = pick(program.url_en, program.url_tr, lang);
      const cta =
        decision.cta_override ||
        pick(program.cta_short_en, program.cta_short_tr, lang) ||
        program.name;
      const description =
        pick(program.description_en, program.description_tr, lang) || "";
      const badge = pick(program.badge_en, program.badge_tr, lang);
      return { program, url: url || "#", cta, description, badge };
    })
    .filter((r) => r.url !== "#");
}
