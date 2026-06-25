import { test, expect, devices } from "@playwright/test";

/**
 * Duplicate-slot guard.
 *
 * After P0 (slot claim registry), every (slug, slot) pair must have at
 * most ONE rendered owner per page. This walks a representative set of
 * calculator routes on desktop + mobile and asserts each [data-slot]
 * appears no more than once.
 */
const ROUTES = [
  "/calculators/dca",
  "/calculators/retirement",
  "/calculators/rainbow-chart",
  "/calculators/power-law",
  "/calculators/lot-size",
];

const VIEWPORTS = [
  { name: "desktop", viewport: { width: 1280, height: 900 } },
  { name: "mobile", ...devices["iPhone 13"] },
] as const;

for (const v of VIEWPORTS) {
  for (const route of ROUTES) {
    test(`no duplicate slots — ${v.name} ${route}`, async ({ browser }) => {
      const ctx = await browser.newContext(v);
      const page = await ctx.newPage();
      await page.goto(`http://localhost:8080${route}`, {
        waitUntil: "domcontentloaded",
      });
      // Let scroll-gated slots arm.
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(2500);

      for (const slot of ["A", "B", "C", "D"] as const) {
        const count = await page.locator(`[data-slot="${slot}"]`).count();
        expect(count, `slot ${slot} on ${route}`).toBeLessThanOrEqual(1);
      }
      await ctx.close();
    });
  }
}
