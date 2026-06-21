import { test, expect, type Page } from '@playwright/test';

const ROUTE = '/calculators/retirement';

async function calculate(page: Page) {
  await page.goto(ROUTE);
  // Trigger a calculation — the Calculate button label varies, click first
  // visible button matching either language.
  const btn = page.getByRole('button', { name: /(Calculate|Hesapla)/i }).first();
  if (await btn.isVisible().catch(() => false)) {
    await btn.click();
  }
  // Wait for the chart tab to appear
  await page.getByRole('tab', { name: /(Projection Chart|Projeksiyon Grafiği)/i })
    .first().waitFor({ state: 'visible', timeout: 15_000 });
}

async function assertNoHorizontalOverflow(page: Page) {
  // The page itself shouldn't horizontally overflow the viewport.
  const overflow = await page.evaluate(() => {
    const d = document.documentElement;
    return d.scrollWidth - d.clientWidth;
  });
  expect(overflow).toBeLessThanOrEqual(2);
}

async function assertTabRenders(page: Page, name: RegExp) {
  const tab = page.getByRole('tab', { name }).first();
  await tab.click();
  // Tab panel should be in the DOM and visible
  const panel = page.locator('[role="tabpanel"]:visible').first();
  await expect(panel).toBeVisible();
  const box = await panel.boundingBox();
  expect(box?.width ?? 0).toBeGreaterThan(200);
  // Panel must not be clipped to zero height
  expect(box?.height ?? 0).toBeGreaterThan(80);
}

test.describe('Retirement Projection Chart + Year-by-Year — responsive', () => {
  for (const vp of [
    { name: 'mobile', width: 375, height: 812 },
    { name: 'desktop', width: 1440, height: 900 },
  ]) {
    test(`${vp.name} (${vp.width}) renders both tabs without overflow`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await calculate(page);

      await assertTabRenders(page, /(Projection Chart|Projeksiyon Grafiği)/i);
      await assertNoHorizontalOverflow(page);

      await assertTabRenders(page, /(Year-by-Year|Yıl Yıl)/i);
      await assertNoHorizontalOverflow(page);

      // On mobile, the wide year-by-year table should be horizontally
      // scrollable rather than crushed — the inner table keeps a stable
      // mobile minimum width while hiding lower-priority columns.
      if (vp.name === 'mobile') {
        const tableScroller = page.locator('[role="tabpanel"]:visible table').first();
        await expect(tableScroller).toBeVisible();
        const tableBox = await tableScroller.boundingBox();
        expect(tableBox?.width ?? 0).toBeGreaterThanOrEqual(590);
      }
    });
  }
});
