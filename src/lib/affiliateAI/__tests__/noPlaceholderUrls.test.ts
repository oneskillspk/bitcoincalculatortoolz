/**
 * CI guard: every enabled affiliate must ship with real tracking URLs.
 * Mirrors scripts/audit-affiliate-links.mjs but runs inside vitest so
 * any regression blocks PR merges.
 */
import { describe, it, expect } from "vitest";
import { AFFILIATES } from "@/config/affiliates.config";

describe("affiliate registry · no placeholder URLs in enabled partners", () => {
  const enabled = AFFILIATES.filter((a) => a.enabled);

  it("has at least one enabled affiliate", () => {
    expect(enabled.length).toBeGreaterThan(0);
  });

  it.each(enabled.map((a) => [a.id, a] as const))(
    "%s — url_en/url_tr/landing_urls contain no PLACEHOLDER",
    (_id, a) => {
      if (a.url_en) expect(a.url_en).not.toMatch(/PLACEHOLDER/i);
      if (a.url_tr) expect(a.url_tr).not.toMatch(/PLACEHOLDER/i);
      if (a.cta_short_en) expect(a.url_en).toBeTruthy();
      if (a.cta_short_tr) expect(a.url_tr).toBeTruthy();
      for (const c of a.creatives ?? []) {
        if (c.landing_url) expect(c.landing_url).not.toMatch(/PLACEHOLDER/i);
      }
    },
  );

  it("koinly is wired to the real via=0481A637 affiliate id", () => {
    const k = AFFILIATES.find((a) => a.id === "koinly");
    expect(k?.enabled).toBe(true);
    expect(k?.url_en).toContain("via=0481A637");
    expect(k?.url_tr).toContain("via=0481A637");
  });

  it("ledger creatives group cleanly by aspect ratio", () => {
    const ledger = AFFILIATES.find((a) => a.id === "ledger")!;
    const groups = new Map<string, number[]>();
    for (const c of ledger.creatives ?? []) {
      if (!c.responsive_group) continue;
      const arr = groups.get(c.responsive_group) ?? [];
      arr.push(c.width / c.height);
      groups.set(c.responsive_group, arr);
    }
    for (const [name, ratios] of groups) {
      const base = ratios[0];
      for (const r of ratios) {
        const drift = Math.abs(r - base) / base;
        expect(drift, `group ${name} mixes aspect ratios`).toBeLessThanOrEqual(0.05);
      }
    }
  });
});
