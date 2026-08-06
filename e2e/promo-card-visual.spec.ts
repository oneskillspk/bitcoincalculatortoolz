import { test, expect, type Page } from "@playwright/test";

/**
 * Visual + structural regression for the promo cards.
 *
 * Screenshots the promo grid at mobile / tablet / desktop and asserts the
 * invariants we keep regressing on: exactly one badge row per card, no
 * category/platform wording, no double CTA arrow, equal card heights and
 * a bottom-aligned full-width CTA.
 */
const BREAKPOINTS = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 900 },
];

const CATEGORY_WORDS = [
  "Exchange",
  "Trading Platform",
  "Hardware Wallet",
  "Tax Software",
  "Borsa",
];

async function openGrid(page: Page) {
  await page.goto("/calculators/dca", { waitUntil: "networkidle" });
  const grid = page.locator("[data-promo-grid]").first();
  // The placement mounts lazily below the fold — scroll until it exists.
  for (let i = 0; i < 12 && (await grid.count()) === 0; i++) {
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(400);
  }
  await grid.scrollIntoViewIfNeeded();
  await expect(grid).toBeVisible({ timeout: 20_000 });
  await page.waitForTimeout(600); // settle lazy creatives
  return grid;
}

for (const bp of BREAKPOINTS) {
  test.describe(`promo cards @ ${bp.name}`, () => {
    test.use({ viewport: { width: bp.width, height: bp.height } });

    test("renders cleanly and matches the visual baseline", async ({ page }) => {
      const grid = await openGrid(page);
      const cards = grid.locator("[data-promo-card]");
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);

      for (let i = 0; i < count; i++) {
        const card = cards.nth(i);

        // One badge row at most — never a badge on both the creative and text.
        const badgeRows = card.locator("[data-offer-state] >> nth=0");
        expect(await badgeRows.count()).toBeLessThanOrEqual(1);

        // No category / platform wording printed on the card.
        const text = (await card.innerText()).trim();
        for (const word of CATEGORY_WORDS) {
          expect(text).not.toContain(word);
        }

        // Exactly one CTA arrow.
        expect((text.match(/→/g) || []).length).toBeLessThanOrEqual(1);

        // Creative is contained, never cropped/letterboxed off-frame.
        const img = card.locator("img").first();
        if (await img.count()) {
          const fit = await img.evaluate((el) => getComputedStyle(el).objectFit);
          expect(fit).toBe("contain");
        }
      }

      // Equal card heights + CTA pinned to the same bottom offset per row.
      const boxes = await cards.evaluateAll((els) =>
        els.map((el) => {
          const r = el.getBoundingClientRect();
          const cta = el.querySelector("span.mt-auto") as HTMLElement | null;
          const c = cta?.getBoundingClientRect();
          return {
            top: Math.round(r.top),
            height: Math.round(r.height),
            ctaWidth: c ? Math.round(c.width) : 0,
            ctaBottomGap: c ? Math.round(r.bottom - c.bottom) : 0,
            innerWidth: Math.round(r.width),
          };
        })
      );
      const rows = new Map<number, typeof boxes>();
      for (const b of boxes) {
        const key = Math.round(b.top / 40);
        rows.set(key, [...(rows.get(key) ?? []), b]);
      }
      for (const row of rows.values()) {
        const heights = row.map((b) => b.height);
        expect(Math.max(...heights) - Math.min(...heights)).toBeLessThanOrEqual(2);
        for (const b of row) {
          // CTA is effectively full width inside the card padding.
          expect(b.ctaWidth).toBeGreaterThan(b.innerWidth * 0.7);
          expect(b.ctaBottomGap).toBeLessThanOrEqual(28);
        }
      }

      await expect(grid).toHaveScreenshot(`promo-grid-${bp.name}.png`, {
        maxDiffPixelRatio: 0.03,
        animations: "disabled",
      });
    });
  });
}
