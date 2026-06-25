import { test, expect, devices } from "@playwright/test";
import { readFileSync } from "node:fs";

/**
 * Calculator-wide ad/result overlap guard + slot region snapshots.
 *
 * For every calculator route (extracted live from src/App.tsx), across
 * three breakpoints, we assert:
 *
 *   1. At most one DOM owner per V2 slot (`[data-slot=A|B|C|D]`).
 *   2. No visible `[data-affiliate-placement]` overlaps any other
 *      affiliate placement OR a result region
 *      (`[data-result-region], [data-testid*="result"], main section`
 *      ancestors carrying calculator output).
 *   3. Each visible slot has a stable element screenshot baseline
 *      (toHaveScreenshot) so layout drift surfaces in CI.
 *
 * Designed to be cheap: element-only screenshots, no full-page captures.
 */
const ROUTES: string[] = (() => {
  const src = readFileSync("src/App.tsx", "utf8");
  const re = /path="(\/calculators\/[a-z0-9-]+)"/g;
  const set = new Set<string>();
  for (const m of src.matchAll(re)) set.add(m[1]);
  return [...set].sort();
})();

const VIEWPORTS = [
  { name: "mobile", ...devices["iPhone 13"] },
  { name: "tablet", viewport: { width: 768, height: 1024 } },
  { name: "desktop", viewport: { width: 1280, height: 900 } },
] as const;

type Rect = { x: number; y: number; width: number; height: number };
const overlaps = (a: Rect, b: Rect) =>
  a.x < b.x + b.width &&
  a.x + a.width > b.x &&
  a.y < b.y + b.height &&
  a.y + a.height > b.y;

for (const v of VIEWPORTS) {
  test.describe(`calculator visuals — ${v.name}`, () => {
    for (const route of ROUTES) {
      test(`${route}`, async ({ browser }, testInfo) => {
        const ctx = await browser.newContext(v);
        const page = await ctx.newPage();
        await page.goto(`http://localhost:8080${route}?testNoAnim=1`, {
          waitUntil: "domcontentloaded",
        });

        // Drive scroll to arm gated slots, then settle.
        await page.evaluate(async () => {
          for (let y = 0; y < document.body.scrollHeight; y += 600) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 80));
          }
          window.scrollTo(0, document.body.scrollHeight);
        });
        await page.waitForTimeout(2500);

        // 1. Single owner per slot.
        for (const slot of ["A", "B", "C", "D"] as const) {
          const count = await page.locator(`[data-slot="${slot}"]`).count();
          expect(count, `slot ${slot}`).toBeLessThanOrEqual(1);
        }

        // 2. No overlap among visible affiliate placements & result regions.
        const visibleRects = async (sel: string): Promise<Rect[]> => {
          const handles = await page.locator(sel).all();
          const rects: Rect[] = [];
          for (const h of handles) {
            if (!(await h.isVisible().catch(() => false))) continue;
            const box = await h.boundingBox();
            if (box && box.width > 4 && box.height > 4) rects.push(box);
          }
          return rects;
        };
        const ads = await visibleRects("[data-affiliate-placement]");
        const results = await visibleRects(
          '[data-result-region], [data-testid*="result"]'
        );

        for (let i = 0; i < ads.length; i++) {
          for (let j = i + 1; j < ads.length; j++) {
            expect(
              overlaps(ads[i], ads[j]),
              `ad ${i} overlaps ad ${j} on ${route}`
            ).toBe(false);
          }
          for (let k = 0; k < results.length; k++) {
            expect(
              overlaps(ads[i], results[k]),
              `ad ${i} overlaps result region ${k} on ${route}`
            ).toBe(false);
          }
        }

        // 3. Per-slot screenshot baselines (when present and visible).
        for (const slot of ["A", "B", "C", "D"] as const) {
          const loc = page.locator(`[data-slot="${slot}"]`);
          if ((await loc.count()) === 0) continue;
          if (!(await loc.isVisible().catch(() => false))) continue;
          await loc.scrollIntoViewIfNeeded().catch(() => {});
          await page.waitForTimeout(150);
          const safeRoute = route.replace(/\W+/g, "_");
          await expect(loc).toHaveScreenshot(
            `${v.name}__${safeRoute}__slot${slot}.png`,
            { maxDiffPixelRatio: 0.02, animations: "disabled" }
          );
        }

        await testInfo.attach(`viewport-${v.name}`, {
          body: await page.screenshot(),
          contentType: "image/png",
        });
        await ctx.close();
      });
    }
  });
}
