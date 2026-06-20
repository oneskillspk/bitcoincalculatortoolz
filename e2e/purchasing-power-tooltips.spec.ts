import { test, expect, type Page } from '@playwright/test';

/**
 * Hover-tooltip visual regression for the purchasing-power charts.
 *
 * Forces the chart tooltips open (pie + bar) at each breakpoint × theme
 * and snapshots the `.recharts-tooltip-wrapper` so a future change that
 * reintroduces invisible / low-contrast hover text fails CI.
 *
 * Update baselines intentionally with:
 *   npx playwright test purchasing-power-tooltips --update-snapshots
 */

const ROUTE = '/calculators/purchasing-power';

const VIEWPORTS = [
  { name: 'mobile',  width: 375,  height: 900 },
  { name: 'tablet',  width: 834,  height: 1100 },
  { name: 'desktop', width: 1440, height: 1000 },
] as const;

const THEMES = ['light', 'dark'] as const;

async function setTheme(page: Page, theme: 'light' | 'dark') {
  await page.evaluate((t) => {
    document.documentElement.classList.toggle('dark', t === 'dark');
  }, theme);
}

async function hoverCenter(page: Page, selector: string) {
  const el = page.locator(selector).first();
  await el.waitFor({ state: 'visible', timeout: 15_000 });
  const box = await el.boundingBox();
  if (!box) throw new Error(`no bounding box for ${selector}`);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  // Recharts mounts the tooltip in the same wrapper; give it a frame.
  await page.waitForSelector('.recharts-tooltip-wrapper > *', { timeout: 5_000 });
  await page.waitForTimeout(150);
}

for (const vp of VIEWPORTS) {
  for (const theme of THEMES) {
    test.describe(`pp tooltips · ${vp.name} · ${theme}`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(ROUTE, { waitUntil: 'networkidle' });
        await setTheme(page, theme);
        await page.waitForSelector('.recharts-surface', { timeout: 15_000 });
        await page.waitForTimeout(400);
      });

      test('pie (Category Distribution) tooltip', async ({ page }) => {
        await hoverCenter(page, '[data-testid="pp-charts-row"] .recharts-pie-sector');
        await expect(page.locator('.recharts-tooltip-wrapper').first()).toHaveScreenshot(
          `pp-tip-pie-${vp.name}-${theme}.png`,
          { animations: 'disabled', maxDiffPixelRatio: 0.02 },
        );
      });

      test('bar (Top Items) tooltip', async ({ page }) => {
        await hoverCenter(page, '[data-testid="pp-charts-row"] .recharts-bar-rectangle');
        await expect(page.locator('.recharts-tooltip-wrapper').last()).toHaveScreenshot(
          `pp-tip-bar-${vp.name}-${theme}.png`,
          { animations: 'disabled', maxDiffPixelRatio: 0.02 },
        );
      });
    });
  }
}
