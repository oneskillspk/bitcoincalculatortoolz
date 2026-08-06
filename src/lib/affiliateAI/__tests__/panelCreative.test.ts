import { describe, it, expect } from "vitest";
import { pickPanelCreative, isPanelShaped } from "@/lib/affiliateAI/panelCreative";
import { AFFILIATES } from "@/config/affiliates.config";
import type { AffiliateCreative } from "@/lib/affiliateAI/types";

const c = (w: number, h: number, url: string, lang?: "en" | "tr"): AffiliateCreative =>
  ({ size: `${w}x${h}`, width: w, height: h, image_url: url, alt: "x", lang: lang ?? null }) as AffiliateCreative;

describe("pickPanelCreative", () => {
  it("returns null when the partner has no creatives", () => {
    expect(pickPanelCreative([], "en")).toBeNull();
    expect(pickPanelCreative(undefined, "en")).toBeNull();
  });

  it("excludes leaderboards and skyscrapers", () => {
    expect(pickPanelCreative([c(728, 90, "a"), c(160, 600, "b")], "en")).toBeNull();
  });

  it("prefers the ratio closest to 16:10", () => {
    const got = pickPanelCreative([c(300, 250, "square"), c(1600, 1000, "panel")], "en");
    expect(got?.image_url).toBe("panel");
  });

  it("prefers the matching language", () => {
    const got = pickPanelCreative([c(850, 420, "en-art", "en"), c(850, 420, "tr-art", "tr")], "tr");
    expect(got?.image_url).toBe("tr-art");
  });

  it("is deterministic for the same input", () => {
    const pool = [c(300, 250, "a"), c(336, 280, "b"), c(900, 750, "cc")];
    expect(pickPanelCreative(pool, "en")).toEqual(pickPanelCreative(pool, "en"));
  });

  it("never selects a creative wider than 3:1 across the real config", () => {
    for (const p of AFFILIATES) {
      const picked = pickPanelCreative(p.creatives, "en");
      if (picked) expect(picked.width / picked.height).toBeLessThanOrEqual(2);
    }
  });

  it("classifies shapes correctly", () => {
    expect(isPanelShaped(c(1600, 900, "x"))).toBe(true);
    expect(isPanelShaped(c(1080, 1080, "x"))).toBe(false);
  });
});
