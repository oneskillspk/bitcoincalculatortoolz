import { describe, it, expect, beforeEach } from "vitest";
import {
  getPageViewShown,
  markPageViewShown,
  resetPageViewShown,
} from "@/lib/affiliateAI/pageViewShown";
import { scoreAndPick } from "@/lib/affiliateAI/scoringEngine";
import { buildContext } from "@/lib/affiliateAI/contextEngine";

describe("pageViewShown (Phase 5)", () => {
  beforeEach(() => {
    resetPageViewShown();
    try {
      localStorage.removeItem("aff_seen");
    } catch {
      /* noop */
    }
  });

  it("starts empty", () => {
    expect(getPageViewShown().size).toBe(0);
  });

  it("tracks marked ids", () => {
    markPageViewShown("ledger");
    markPageViewShown("coinbase");
    expect(getPageViewShown().has("ledger")).toBe(true);
    expect(getPageViewShown().has("coinbase")).toBe(true);
  });

  it("scoreAndPick records its picks into the shown set", () => {
    const ctx = buildContext({ slug: "dca", lang: "en" });
    const decision = scoreAndPick(ctx);
    expect(decision.affiliate_ids.length).toBeGreaterThan(0);
    const shown = getPageViewShown();
    for (const id of decision.affiliate_ids) {
      expect(shown.has(id)).toBe(true);
    }
  });

  it("subsequent scoreAndPick on same page-view excludes prior picks when alternatives exist", () => {
    const ctxA = buildContext({ slug: "dca", lang: "en" });
    const first = scoreAndPick(ctxA);
    const firstId = first.affiliate_ids[0];

    // Same slug+lang: the per-page-view shown filter should push to a
    // different program when one exists. (For slugs with only one
    // eligible program, the graceful fallback keeps it.)
    const second = scoreAndPick(ctxA);
    expect(second.affiliate_ids[0]).not.toBe(firstId);
  });
});
