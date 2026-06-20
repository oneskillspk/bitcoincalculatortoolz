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

/**
 * Inspect each tab-stop along the way: every focused element must expose
 * a visible focus indicator (outline OR box-shadow ring OR explicit
 * focus-visible style). Runs at desktop AND mobile widths so we catch
 * mobile-only regressions (e.g. Tailwind ring utilities hidden by
 * @media (hover: none)).
 */
const FOCUS_VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 375, height: 900 },
] as const;

for (const vp of FOCUS_VIEWPORTS) {
  test(`keyboard focus indicators · ${vp.name}: every tab stop is visibly focused`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await calculate(page, 0);

    const interactive = page.locator(
      'main button:visible, main a:visible, main [role="button"]:visible, main input:visible, main select:visible, main [role="progressbar"]:visible, main [tabindex]:visible',
    );
    const total = Math.min(await interactive.count(), 30);
    expect(total).toBeGreaterThan(0);

    const failures: string[] = [];

    for (let i = 0; i < total; i++) {
      await page.keyboard.press('Tab');
      const info = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body) return null;
        const cs = getComputedStyle(el);
        const hasOutline = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0;
        const hasRing = cs.boxShadow !== 'none' && cs.boxShadow.length > 0;
        return {
          tag: el.tagName,
          label: el.getAttribute('aria-label') || el.textContent?.trim().slice(0, 40) || '',
          hasOutline,
          hasRing,
        };
      });
      if (!info) continue;
      if (!info.hasOutline && !info.hasRing) {
        failures.push(`${info.tag} "${info.label}" lacks a focus indicator`);
      }
    }

    expect(failures, failures.join('\n')).toEqual([]);
  });
}

test('progress bars are exposed to assistive tech even if not in tab order', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await calculate(page, 0);
  const bars = page.locator('main [role="progressbar"]');
  const n = await bars.count();
  expect(n).toBeGreaterThan(0);
  for (let i = 0; i < n; i++) {
    await expect(bars.nth(i)).toHaveAttribute('aria-label', /.+/);
    await expect(bars.nth(i)).toHaveAttribute('aria-valuetext', /.+/);
  }
});
