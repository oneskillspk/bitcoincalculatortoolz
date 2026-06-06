/**
 * Phase D — Section 10 AI Decision Map test.
 *
 * For every slug documented in INTENT_MAP, asserts that at least one of
 * the documented intent winners (per language) appears in the top-3
 * scored affiliates. This guarantees the "this calculator prefers X"
 * rules survive future scoring tweaks without being brittle about exact
 * rank ordering.
 */
import { describe, expect, it } from "vitest";
import { INTENT_MAP } from "@/config/placements.config";
import { AFFILIATES } from "@/config/affiliates.config";
import { scoreAffiliate } from "@/lib/affiliateAI/scoringEngine";
import type { CalculatorContext, Lang } from "@/lib/affiliateAI/types";

const ctxFor = (slug: string, lang: Lang): CalculatorContext => ({
  slug,
  lang,
  segment: "default",
  resultSignals: [],
  device: "desktop",
  isReturning: false,
  optedOut: false,
});

const eligibleIds = new Set(AFFILIATES.filter((a) => a.enabled).map((a) => a.id));

describe("INTENT_MAP — documented winners appear in top-3 of scored list", () => {
  for (const [slug, intent] of Object.entries(INTENT_MAP)) {
    for (const lang of ["en", "tr"] as Lang[]) {
      const winners = (lang === "tr" ? intent.tr : intent.en).filter((id) =>
        eligibleIds.has(id)
      );
      if (winners.length === 0) continue;

      it(`${slug} (${lang}) → at least one of [${winners.join(", ")}] ranks in top 3`, () => {
        const ctx = ctxFor(slug, lang);
        const ranked = AFFILIATES.filter(
          (a) =>
            a.enabled &&
            (a.language_restriction.length === 0 ||
              a.language_restriction.includes(lang))
        )
          .map((a) => ({ id: a.id, score: scoreAffiliate(a, ctx) }))
          .sort((x, y) => y.score - x.score)
          .slice(0, 3)
          .map((r) => r.id);

        const hit = winners.some((w) => ranked.includes(w));
        expect(hit, `top-3 was [${ranked.join(", ")}]`).toBe(true);
      });
    }
  }
});
