/**
 * Guards the AffiliateAI INTENT_MAP against the two regressions we just
 * shipped fixes for:
 *   1. Referencing a disabled (or unknown) affiliate id — the +15 intent
 *      boost would silently vanish because `scoreAndPick` filters out
 *      `enabled: false` candidates.
 *   2. Listing the same affiliate id twice inside the same (slug, lang)
 *      list — inflates weighted rotation and bypasses tier/priority.
 *
 * Also enforces that every entry in WISHLIST_INTENT_MAP points at a real
 * (but currently disabled) program so the wishlist stays meaningful.
 */
import { describe, it, expect } from "vitest";
import { AFFILIATES } from "@/config/affiliates.config";
import {
  INTENT_MAP,
  WISHLIST_INTENT_MAP,
} from "@/config/placements.config";

const enabledIds = new Set(AFFILIATES.filter((a) => a.enabled).map((a) => a.id));
const allIds = new Set(AFFILIATES.map((a) => a.id));

describe("INTENT_MAP integrity", () => {
  for (const [slug, intent] of Object.entries(INTENT_MAP)) {
    for (const lang of ["en", "tr"] as const) {
      const list = intent[lang];

      it(`${slug} · ${lang} — no duplicate ids`, () => {
        expect(new Set(list).size).toBe(list.length);
      });

      it(`${slug} · ${lang} — every id is enabled`, () => {
        for (const id of list) {
          expect(
            enabledIds.has(id),
            `INTENT_MAP[${slug}].${lang} references "${id}" but that affiliate is not enabled — move it to WISHLIST_INTENT_MAP`,
          ).toBe(true);
        }
      });
    }
  }
});

describe("WISHLIST_INTENT_MAP integrity", () => {
  for (const [slug, intent] of Object.entries(WISHLIST_INTENT_MAP)) {
    for (const lang of ["en", "tr"] as const) {
      for (const id of intent[lang]) {
        it(`${slug} · ${lang} — wishlist id "${id}" exists in registry`, () => {
          expect(allIds.has(id)).toBe(true);
        });
      }
    }
  }
});
