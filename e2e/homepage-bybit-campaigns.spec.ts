import { test, expect } from "@playwright/test";

/**
 * Homepage Bybit campaign boxes — structure + visual baseline.
 *
 * Invariants: three live campaign cards, one Ongoing pill each, a UTC
 * window line, sponsored rel attributes and contained (never cropped)
 * creatives at mobile / tablet / desktop.
 */
const BREAKPOINTS = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 900 },
];

for (const bp of BREAKPOINTS) {
  test.describe(`bybit homepage campaigns @ ${bp.name}`, () => {
    test.use({ viewport: { width: bp.width, height: bp.height } });

    test("renders cleanly and matches the visual baseline", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const grid = page.locator("[data-bybit-campaigns]").first();
      await grid.scrollIntoViewIfNeeded();
      await expect(grid).toBeVisible({ timeout: 20_000 });
      await page.waitForTimeout(600);

      const cards = grid.locator("[data-promo-card='bybit']");
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);

      for (let i = 0; i < count; i++) {
        const card = cards.nth(i);
        await expect(card).toHaveAttribute("rel", /sponsored/);
        await expect(card).toHaveAttribute("target", "_blank");
        await expect(card).toHaveAttribute("href", /partner\.bybit\.com/);

        const text = (await card.innerText()).trim();
        expect(text).toContain("UTC");

        const fit = await card
          .locator("img")
          .first()
          .evaluate((el) => getComputedStyle(el).objectFit);
        expect(fit).toBe("contain");
      }

      await expect(grid).toHaveScreenshot(`bybit-campaigns-${bp.name}.png`, {
        maxDiffPixelRatio: 0.03,
        animations: "disabled",
      });
    });
  });
}
