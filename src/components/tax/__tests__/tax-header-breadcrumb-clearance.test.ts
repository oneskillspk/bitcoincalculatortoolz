/**
 * Static regression: the UK and Germany tax pages must keep enough top
 * padding on the breadcrumb container so the fixed FloatingNavigation
 * header does not overlap it on mobile.
 *
 * India was hit by this bug when `pt-6` (24 px) let the ~56–70 px fixed
 * header slide over the breadcrumb. We locked it in for India; this test
 * enforces the same guard on UK + Germany.
 *
 * A vitest test can't measure layout, but it *can* assert that the class
 * tokens survive future refactors. Combined with `header-breadcrumb-clearance.spec.ts`
 * (Playwright), this catches both regressions in the source string and in
 * the rendered layout.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();

const PAGES = [
  {
    label: "UK CGT",
    path: "src/pages/BitcoinUKCGTCalculator.tsx",
  },
  {
    label: "Germany",
    path: "src/pages/BitcoinGermanyTaxCalculator.tsx",
  },
  {
    label: "India (reference)",
    path: "src/pages/BitcoinIndiaTaxCalculator.tsx",
  },
];

describe("Tax page breadcrumb — header clearance padding", () => {
  it.each(PAGES)(
    "$label page keeps pt-20 sm:pt-24 on the breadcrumb container",
    ({ path }) => {
      const src = readFileSync(join(ROOT, path), "utf8");
      // Match the breadcrumb wrapper (`container mx-auto max-w-5xl px-4 pt-...`)
      // and require the mobile-safe top padding tokens.
      const match = src.match(
        /className="container mx-auto max-w-5xl px-4 (pt-[^"]*)"/,
      );
      expect(match, "breadcrumb wrapper className not found").not.toBeNull();
      const padding = match![1];
      expect(
        padding,
        `Expected 'pt-20 sm:pt-24' (or larger) to clear the fixed header, got: ${padding}`,
      ).toMatch(/\bpt-(20|24|28|32)\b/);
      expect(padding).toMatch(/\bsm:pt-(20|24|28|32)\b/);
    },
  );

  it.each(PAGES)("$label page never falls back to bare pt-6", ({ path }) => {
    const src = readFileSync(join(ROOT, path), "utf8");
    expect(src).not.toMatch(/className="container mx-auto max-w-5xl px-4 pt-6"/);
  });
});
