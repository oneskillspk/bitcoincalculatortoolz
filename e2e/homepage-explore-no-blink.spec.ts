import { test, expect } from '@playwright/test';

/**
 * Regression: the "Explore Calculators" section on the homepage must NOT
 * shift, blink, or be overlapped by a sticky companion ad (SlotD).
 *
 * Two guards:
 *   1. SlotD must be suppressed on `/` (disableSlotD on PreFAQPlacement).
 *   2. Visual snapshot of the section after settle is stable across runs.
 *      Animations are disabled via ?testNoAnim=1 to avoid flakiness.
 */
test.describe('Homepage — Explore Calculators stability', () => {
  test('no sticky companion (SlotD) mounts on /', async ({ page }) => {
    await page.goto('/?testNoAnim=1', { waitUntil: 'networkidle' });
    // Scroll through to trigger any depth-gated placements.
    await page.evaluate(async () => {
      const step = window.innerHeight;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 80));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(500);
    const slotD = page.locator('[data-slot="slot-d"], [data-affiliate-slot="D"]');
    await expect(slotD).toHaveCount(0);
  });

  test('Explore Calculators section is visually stable', async ({ page }, testInfo) => {
    await page.goto('/?testNoAnim=1', { waitUntil: 'networkidle' });
    const section = page
      .locator('section, div')
      .filter({ hasText: /Explore.*Calculator/i })
      .first();
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600); // allow any async hydration to settle

    // Sample two frames ~500ms apart; they must be byte-identical (no blink).
    const a = await section.screenshot();
    await page.waitForTimeout(500);
    const b = await section.screenshot();
    expect(a.equals(b)).toBe(true);

    await testInfo.attach('explore-section', { body: a, contentType: 'image/png' });
  });
});
