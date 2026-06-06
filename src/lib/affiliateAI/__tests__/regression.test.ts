/**
 * Full-site regression for the affiliate engine.
 *
 * Verifies, post-Phase A/B/C/D, that:
 *   1. Every calculator slug routed in `App.tsx` has SLUG_CATEGORY coverage.
 *   2. `scoreAndPick` returns a valid decision (>=1 affiliate, valid
 *      format/zone) for every slug × lang × zone preset.
 *   3. Weighted rotation across N runs distributes across more than one
 *      affiliate when the candidate pool > 1.
 *   4. `appendUtm` produces the documented utm_source/medium/campaign/content
 *      tuple and never doubles up when the URL already has utm_source.
 *   5. Every enabled affiliate with creatives passes `validateCreatives`.
 */
import { describe, expect, it } from "vitest";
import { AFFILIATES } from "@/config/affiliates.config";
import { SLUG_CATEGORY } from "@/config/placements.config";
import { scoreAndPick } from "@/lib/affiliateAI/scoringEngine";
import { validateCreatives } from "@/lib/affiliateAI/validateCreatives";
import { appendUtm } from "@/lib/affiliateAI/utm";
import type { CalculatorContext, Lang, Zone } from "@/lib/affiliateAI/types";

// Slugs we expect to be routable + tracked. Mirrors App.tsx <Route> table
// (calculator pages only; redirects and dashboards excluded).
const ROUTED_SLUGS = [
  "what-if", "retirement", "dca", "lump-sum-vs-dca", "capital-gains-tax",
  "stack-sats", "purchasing-power", "hodl-strategy", "mining-profitability",
  "transaction-fees", "lightning", "leverage-liquidation", "profit-loss",
  "bitcoin-converter", "investment", "halving-countdown", "bitcoin-savings",
  "fear-greed-index", "rainbow-chart", "wealth-percentile", "etf",
  "power-law", "cagr", "staking", "volatility", "supply", "dominance",
  "time-machine", "drawdown", "sip", "pizza-day", "average-buy-price",
  "price-target", "inheritance-tax", "bitcoin-loan", "correlation",
  "btc-vs-real-estate", "lot-size", "bitcoin-zakat", "arbitrage",
  "pi-to-bitcoin", "accumulation-score",
];

const LANGS: Lang[] = ["en", "tr"];
const ZONES: Zone[] = [
  "post-result",
  "sidebar",
  "inline",
  "inline-mid-article",
  "pre-footer",
];

const ctxFor = (slug: string, lang: Lang): CalculatorContext => ({
  slug,
  lang,
  segment: "default",
  resultSignals: [],
  device: "desktop",
  isReturning: false,
  optedOut: false,
});

describe("Regression · SLUG_CATEGORY coverage", () => {
  for (const slug of ROUTED_SLUGS) {
    it(`${slug} is mapped to a category`, () => {
      expect(SLUG_CATEGORY[slug], `add "${slug}" to SLUG_CATEGORY`).toBeTruthy();
    });
  }
});

describe("Regression · scoreAndPick returns a valid decision for every slug × lang × zone", () => {
  const VALID_FORMATS = new Set([
    "single-card", "two-card-strip", "comparison", "inline-cta",
    "sidebar-widget", "image-banner", "html-banner",
  ]);
  for (const slug of ROUTED_SLUGS) {
    for (const lang of LANGS) {
      for (const zone of ZONES) {
        it(`${slug} / ${lang} / ${zone}`, () => {
          const d = scoreAndPick(ctxFor(slug, lang), { zone });
          expect(d.affiliate_ids.length).toBeGreaterThan(0);
          expect(VALID_FORMATS.has(d.format)).toBe(true);
          expect(d.zone).toBe(zone);
          for (const id of d.affiliate_ids) {
            expect(AFFILIATES.some((a) => a.id === id && a.enabled)).toBe(true);
          }
        });
      }
    }
  }
});

describe("Regression · weighted rotation distributes when pool > 1", () => {
  it("two-card-strip rotates across >1 affiliate over 50 daily buckets", () => {
    // Mock Date.now across a 50-day window so the daily seed flips.
    const realNow = Date.now;
    const seen = new Set<string>();
    try {
      const base = realNow();
      for (let day = 0; day < 50; day++) {
        const ts = base + day * 86400_000;
        Date.now = () => ts;
        const d = scoreAndPick(ctxFor("dca", "en"), { zone: "post-result" });
        d.affiliate_ids.forEach((id) => seen.add(id));
      }
    } finally {
      Date.now = realNow;
    }
    expect(seen.size).toBeGreaterThan(1);
  });
});

describe("Regression · appendUtm", () => {
  it("appends the four UTM params on a bare URL", () => {
    const out = appendUtm("https://example.com/ref", {
      slug: "dca",
      affiliateId: "swan_bitcoin",
      zone: "post-result",
    });
    const u = new URL(out);
    expect(u.searchParams.get("utm_source")).toBe("dca");
    expect(u.searchParams.get("utm_medium")).toBe("affiliate");
    expect(u.searchParams.get("utm_campaign")).toBe("swan_bitcoin");
    expect(u.searchParams.get("utm_content")).toBe("post-result");
  });

  it("preserves an existing utm_source set by the partner", () => {
    const out = appendUtm("https://example.com/?utm_source=partnerX", {
      slug: "dca", affiliateId: "swan_bitcoin", zone: "post-result",
    });
    expect(out).toContain("utm_source=partnerX");
    expect(out).not.toContain("utm_medium=affiliate");
  });

  it("keeps existing query params and is idempotent", () => {
    const first = appendUtm("https://example.com/?ref=abc", {
      slug: "dca", affiliateId: "swan_bitcoin", zone: "post-result",
    });
    const second = appendUtm(first, {
      slug: "dca", affiliateId: "swan_bitcoin", zone: "post-result",
    });
    expect(second).toBe(first);
    expect(first).toContain("ref=abc");
  });

  it("returns '#' for null/empty input safely", () => {
    expect(appendUtm(null, { slug: "x", affiliateId: "y", zone: "inline" })).toBe("#");
    expect(appendUtm("", { slug: "x", affiliateId: "y", zone: "inline" })).toBe("#");
  });
});

describe("Regression · creative validation across all affiliates", () => {
  it("no creative size label mismatches its width × height", () => {
    const errs = validateCreatives(AFFILIATES);
    expect(errs, JSON.stringify(errs, null, 2)).toEqual([]);
  });

  it("every enabled banner-friendly affiliate has at least one creative or html", () => {
    const bannerCapable = AFFILIATES.filter(
      (a) => a.enabled && (a.default_format === "image-banner" || a.default_format === "html-banner")
    );
    for (const a of bannerCapable) {
      const ok = (a.creatives?.length ?? 0) > 0 || !!a.creative_html;
      expect(ok, `${a.id} has no creatives and no creative_html`).toBe(true);
    }
  });
});
