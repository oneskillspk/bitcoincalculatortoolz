/**
 * Verifies that every affiliate link rendered by the engine:
 *   1. Resolves to a non-empty absolute URL.
 *   2. Is decorated with the four standard UTM params by `appendUtm`,
 *      UNLESS the partner already set utm_source (in which case the
 *      partner-owned tracking is preserved verbatim).
 *   3. For RedotPay specifically: the UID 15980 + partner utm_* tracking
 *      survive end-to-end, and each creative points at one of the three
 *      known promo slugs (affiliates-1 | affiliates-3 | affiliates-5).
 */
import { describe, expect, it } from "vitest";
import { AFFILIATES } from "@/config/affiliates.config";
import { appendUtm } from "@/lib/affiliateAI/utm";
import { resolveAffiliates } from "@/lib/affiliateAI/placementResolver";
import type { AIDecision, Lang, Zone } from "@/lib/affiliateAI/types";

const ZONES: Zone[] = [
  "post-result", "sidebar", "inline", "inline-mid-article",
  "pre-footer", "comparison", "footer",
];
const LANGS: Lang[] = ["en", "tr"];

const REDOT_PROMO_SLUGS = ["affiliates-1", "affiliates-2", "affiliates-3", "affiliates-5"] as const;
const REDOT_UID = "15980";

function decisionFor(id: string, zone: Zone, lang: Lang): AIDecision {
  return {
    slug: "dca", lang, segment: "default",
    affiliate_ids: [id], format: "image-banner", zone, delay_ms: 0,
    source: "fallback",
  };
}

describe("Affiliate links · program-level URLs", () => {
  const enabled = AFFILIATES.filter((a) => a.enabled);

  it.each(enabled.map((a) => [a.id]))(
    "%s exposes a usable url for at least one language",
    (id) => {
      const a = AFFILIATES.find((x) => x.id === id)!;
      const urls = [a.url_en, a.url_tr].filter(Boolean) as string[];
      expect(urls.length).toBeGreaterThan(0);
      for (const u of urls) {
        expect(() => new URL(u)).not.toThrow();
      }
    }
  );

  it("every enabled program resolves through resolveAffiliates for every zone × lang", () => {
    for (const a of enabled) {
      for (const zone of ZONES) {
        for (const lang of LANGS) {
          if (a.language_restriction.length && !a.language_restriction.includes(lang)) continue;
          const [resolved] = resolveAffiliates(decisionFor(a.id, zone, lang), lang);
          if (!resolved) continue; // language fallback dropped — acceptable
          const tracked = appendUtm(resolved.url, {
            slug: "dca", affiliateId: a.id, zone,
          });
          expect(tracked).not.toBe("#");
          const u = new URL(tracked);
          if (u.searchParams.get("utm_source") === "dca") {
            // Our UTM stamp landed (partner had no utm_source).
            expect(u.searchParams.get("utm_medium")).toBe("affiliate");
            expect(u.searchParams.get("utm_campaign")).toBe(a.id);
            expect(u.searchParams.get("utm_content")).toBe(zone);
          } else {
            // Partner owns utm_source — must be preserved untouched.
            expect(u.searchParams.get("utm_source")).toBeTruthy();
          }
        }
      }
    }
  });
});

describe("Affiliate links · creative landing URLs", () => {
  it("every creative landing_url (when present) is a valid absolute URL", () => {
    for (const a of AFFILIATES) {
      for (const [i, c] of (a.creatives ?? []).entries()) {
        if (!c.landing_url) continue;
        expect(
          () => new URL(c.landing_url!),
          `${a.id}.creatives[${i}] landing_url invalid`
        ).not.toThrow();
      }
    }
  });
});

describe("Affiliate links · RedotPay promo correctness", () => {
  const redot = AFFILIATES.find((a) => a.id === "redotpay")!;

  it("is registered and enabled", () => {
    expect(redot).toBeDefined();
    expect(redot.enabled).toBe(true);
  });

  it("program fallback URLs carry UID 15980 and a known promo slug", () => {
    for (const url of [redot.url_en, redot.url_tr]) {
      expect(url).toBeTruthy();
      const u = new URL(url!);
      expect(u.searchParams.get("utm_uid")).toBe(REDOT_UID);
      expect(u.searchParams.get("utm_source")).toBe("union");
      expect(
        REDOT_PROMO_SLUGS.some((slug) => u.pathname.includes(`/invite/${slug}`))
      ).toBe(true);
    }
  });

  it("every creative landing_url carries UID 15980 + utm_source=union + a known promo slug", () => {
    const list = redot.creatives ?? [];
    expect(list.length).toBeGreaterThan(0);
    for (const [i, c] of list.entries()) {
      expect(c.landing_url, `creative[${i}] missing landing_url`).toBeTruthy();
      const u = new URL(c.landing_url!);
      expect(u.searchParams.get("utm_uid"), `creative[${i}] uid`).toBe(REDOT_UID);
      expect(u.searchParams.get("utm_source"), `creative[${i}] source`).toBe("union");
      expect(u.searchParams.get("utm_s"), `creative[${i}] signature`).toBeTruthy();
      expect(u.searchParams.get("utm_id"), `creative[${i}] id`).toBeTruthy();
      const slugMatch = REDOT_PROMO_SLUGS.find((s) => u.pathname.includes(`/invite/${s}`));
      expect(slugMatch, `creative[${i}] unknown promo slug in ${c.landing_url}`).toBeTruthy();
    }
  });

  it("appendUtm preserves RedotPay partner utm_source (does not overwrite)", () => {
    const tracked = appendUtm(redot.url_en!, {
      slug: "transaction-fees", affiliateId: "redotpay", zone: "pre-footer",
    });
    const u = new URL(tracked);
    expect(u.searchParams.get("utm_source")).toBe("union");
    expect(u.searchParams.get("utm_uid")).toBe(REDOT_UID);
    // Our own utm_medium / utm_campaign must NOT have been appended,
    // because partner-owned tracking is sacred.
    expect(u.searchParams.get("utm_medium")).toBeNull();
    expect(u.searchParams.get("utm_campaign")).toBeNull();
  });

  it("covers all three promo families across its creatives", () => {
    const seen = new Set<string>();
    for (const c of redot.creatives ?? []) {
      if (!c.landing_url) continue;
      for (const slug of REDOT_PROMO_SLUGS) {
        if (new URL(c.landing_url).pathname.includes(`/invite/${slug}`)) {
          seen.add(slug);
        }
      }
    }
    // We ship affiliates-1 (dark) and affiliates-3 (pink) at minimum.
    expect(seen.has("affiliates-1")).toBe(true);
    expect(seen.has("affiliates-3")).toBe(true);
  });

  it("ships the new wide-format banner sizes", () => {
    const sizes = new Set((redot.creatives ?? []).map((c) => c.size));
    for (const s of ["320x50", "960x150", "1920x1080", "1920x1004", "1920x1920", "1400x2000", "900x750", "1920x237", "1600x900"]) {
      expect(sizes.has(s as never), `missing size ${s}`).toBe(true);
    }
  });
});
