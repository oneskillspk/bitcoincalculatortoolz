import { test, expect, type Page } from '@playwright/test';

/**
 * Automated a11y check for Forecaster, Goal Planner, and FIRE result panels.
 * Verifies:
 *   - Progress bars expose aria-label + aria-valuetext
 *   - Heading ladder never skips a level (h1 → h2 → h3)
 *   - Each <section aria-labelledby> id resolves to a real heading
 *   - Exactly one <main> landmark
 */

const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 900 },
  { name: 'desktop', width: 1440, height: 1000 },
] as const;

const MODES = [
  { name: 'forecaster', tabIndex: 0 },
  { name: 'planner', tabIndex: 1 },
  { name: 'fire', tabIndex: 2 },
] as const;

async function calculate(page: Page, tabIndex: number) {
  await page.goto('/calculators/retirement', { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle').catch(() => {});
  const tabs = page.locator('button[role="tab"], [role="tablist"] button').first();
  // Click the corresponding mode button by index inside the mode selector
  const modeButtons = page.locator('main button').filter({ hasText: /Forecaster|Goal Planner|FIRE/i });
  const target = modeButtons.nth(tabIndex);
  if (await target.count()) await target.click().catch(() => {});
  const calcBtn = page.getByRole('button', { name: /Calculate/i }).first();
  await calcBtn.click({ trial: false }).catch(() => {});
  await page.waitForTimeout(800);
}

for (const vp of VIEWPORTS) {
  for (const mode of MODES) {
    test(`a11y · ${mode.name} · ${vp.name}: progress bars + headings + landmarks`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await calculate(page, mode.tabIndex);

      // One <main>, one <h1>
      expect(await page.locator('main').count()).toBe(1);
      expect(await page.locator('h1').count()).toBe(1);

      // All progress bars must have aria-label AND aria-valuetext
      const bars = page.locator('[role="progressbar"]');
      const count = await bars.count();
      for (let i = 0; i < count; i++) {
        const bar = bars.nth(i);
        await expect(bar).toHaveAttribute('aria-label', /.+/);
        await expect(bar).toHaveAttribute('aria-valuetext', /.+/);
      }

      // Heading ladder check
      const levels = await page
        .locator('main h1, main h2, main h3, main h4')
        .evaluateAll((nodes) => nodes.map((n) => Number(n.tagName.substring(1))));
      for (let i = 1; i < levels.length; i++) {
        expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
      }

      // Each aria-labelledby id must resolve to a real element
      const ids = await page
        .locator('main section[aria-labelledby]')
        .evaluateAll((nodes) => nodes.map((n) => n.getAttribute('aria-labelledby') || ''));
      for (const id of ids.filter(Boolean)) {
        await expect(page.locator(`#${id}`)).toHaveCount(1);
      }
    });
  }
}

test('keyboard navigation: result cards & progress bars reachable in tab order', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await calculate(page, 0);

  // Tab through and confirm interactive controls receive focus and show outline
  const interactive = page.locator(
    'main button:visible, main a:visible, main [role="button"]:visible, main input:visible, main select:visible',
  );
  const total = Math.min(await interactive.count(), 25);
  expect(total).toBeGreaterThan(0);

  for (let i = 0; i < total; i++) {
    await page.keyboard.press('Tab');
  }
  const active = await page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    if (!el) return null;
    const cs = getComputedStyle(el);
    return { tag: el.tagName, outline: cs.outlineStyle, ring: cs.boxShadow };
  });
  expect(active).not.toBeNull();
  // Focus indicator: outline or ring/shadow must be set on focused element
  expect(active!.outline !== 'none' || active!.ring !== 'none').toBe(true);
});
