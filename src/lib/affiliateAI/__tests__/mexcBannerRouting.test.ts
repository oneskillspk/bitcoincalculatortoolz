/**
 * MEXC creative routing — every banner must:
 *   1. Carry a valid landing_url (per-creative click target wins over program url)
 *   2. Tag the URL with shareCode=mexc-Btccalctool
 *   3. Route to one of the 4 approved MEXC deep-link paths
 *   4. Match its banner theme (card art → /buy-crypto/mexc-card, etc.)
 *
 * Also verifies the program-level fallback URL still works so any future
 * creative shipped without a landing_url defaults to the sign-up flow.
 */
import { describe, it, expect } from "vitest";
import { AFFILIATES } from "@/config/affiliates.config";

const SHARE_CODE = "mexc-Btccalctool";
const ALLOWED_PATHS = new Set([
  "/acquisition/custom-sign-up",
  "/buy-crypto/mexc-card",
  "/futures/BTC_USDT",
  "/exchange/BTC_USDT",
]);

const mexc = AFFILIATES.find((a) => a.id === "mexc")!;

describe("MEXC banner routing", () => {
  it("is enabled and program-level URLs use the sign-up share link", () => {
    expect(mexc.enabled).toBe(true);
    for (const u of [mexc.url_en!, mexc.url_tr!]) {
      const url = new URL(u);
      expect(url.hostname).toBe("www.mexc.com");
      expect(url.pathname).toBe("/acquisition/custom-sign-up");
      expect(url.searchParams.get("shareCode")).toBe(SHARE_CODE);
    }
  });

  it("ships exactly 4 horizontal (1000x563) + 6 vertical (760x1340) creatives", () => {
    const horiz = mexc.creatives!.filter((c) => c.width === 1000 && c.height === 563);
    const vert  = mexc.creatives!.filter((c) => c.width === 760 && c.height === 1340);
    expect(horiz).toHaveLength(4);
    expect(vert).toHaveLength(6);
    expect(horiz.length + vert.length).toBe(mexc.creatives!.length);
  });

  it.each(mexc.creatives!.map((c, i) => [i, c] as const))(
    "creative[%i] landing_url is www.mexc.com + approved path + shareCode",
    (_i, c) => {
      expect(c.landing_url, "missing landing_url").toBeTruthy();
      const url = new URL(c.landing_url!);
      expect(url.hostname).toBe("www.mexc.com");
      expect(ALLOWED_PATHS.has(url.pathname)).toBe(true);
      expect(url.searchParams.get("shareCode")).toBe(SHARE_CODE);
    },
  );

  it("creative themes route to the matching deep-link", () => {
    const pathFor = (substr: string) =>
      mexc.creatives!
        .filter((c) => c.alt.toLowerCase().includes(substr))
        .map((c) => new URL(c.landing_url!).pathname);

    // Visa card art → card page
    for (const p of pathFor("visa platinum card")) {
      expect(p).toBe("/buy-crypto/mexc-card");
    }
    // Reward / airdrop art → sign-up
    for (const p of [...pathFor("8,000 usdt"), ...pathFor("airdrops")]) {
      expect(p).toBe("/acquisition/custom-sign-up");
    }
    // Moonshot art → futures
    for (const p of pathFor("moonshot")) {
      expect(p).toBe("/futures/BTC_USDT");
    }
    // Gem / award art → spot
    for (const p of [...pathFor("crypto gem"), ...pathFor("best crypto exchange asia")]) {
      expect(p).toBe("/exchange/BTC_USDT");
    }
  });

  it("every approved deep-link path is represented in the creative pool", () => {
    const present = new Set(
      mexc.creatives!.map((c) => new URL(c.landing_url!).pathname),
    );
    for (const p of ALLOWED_PATHS) {
      expect(present.has(p), `no MEXC creative routes to ${p}`).toBe(true);
    }
  });

  it("localized CTAs are present in both EN and TR with shareCode wording", () => {
    // Button CTAs deliberately omit the partner name — the promo-card header
    // already prints it, so the button spends its characters on the reward.
    expect(mexc.cta_short_en).toMatch(/8,000 USDT/);
    expect(mexc.cta_short_tr).toMatch(/8\.000 USDT/);
    expect(mexc.cta_long_en).toContain("mexc-Btccalctool");
    expect(mexc.cta_long_tr).toContain("mexc-Btccalctool");
    expect(mexc.description_en).toBeTruthy();
    expect(mexc.description_tr).toBeTruthy();
    expect(mexc.badge_en).toBeTruthy();
    expect(mexc.badge_tr).toBeTruthy();
  });
});
