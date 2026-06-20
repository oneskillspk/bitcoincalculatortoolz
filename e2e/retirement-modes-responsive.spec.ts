import { test, expect, type Page } from '@playwright/test';

const ROUTE = '/bitcoin-retirement-calculator';

async function selectModeAndCalculate(page: Page, modeName: RegExp) {
  await page.goto(ROUTE);
  const modeTab = page.getByRole('tab', { name: modeName }).first();
  await modeTab.click();
  const btn = page.getByRole('button', { name: /(Calculate|Hesapla)/i }).first();
  if (await btn.isVisible().catch(() => false)) {
    await btn.click();
  }
}

async function assertNoOverflow(page: Page) {
  const overflow = await page.evaluate(() => {
    const d = document.documentElement;
    return d.scrollWidth - d.clientWidth;
  });
  expect(overflow).toBeLessThanOrEqual(2);
}

test.describe('Retirement FIRE + Goal Planner — responsive layout', () => {
  for (const vp of [
    { name: 'mobile', width: 375, height: 812 },
    { name: 'desktop', width: 1440, height: 900 },
  ]) {
    test(`FIRE mode @${vp.name} renders growth scenarios without overflow`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await selectModeAndCalculate(page, /(FIRE Mode|FIRE Modu|FIRE)/i);

      // The full-width Growth Scenarios section should be visible after
      // calculation and not introduce horizontal page overflow.
      const scenariosHeading = page.getByRole('heading', { name: /(Growth Scenarios|Büyüme senaryoları)/i }).first();
      await scenariosHeading.waitFor({ state: 'visible', timeout: 15_000 });
      await assertNoOverflow(page);

      if (vp.name === 'mobile') {
        // The wide scenario table sits inside a horizontally scrollable
        // region with min-w-[640px] so it stays usable on small screens.
        const scroller = page.locator('.min-w-\\[640px\\]').first();
        await expect(scroller).toBeVisible();
        const box = await scroller.boundingBox();
        expect(box?.width ?? 0).toBeGreaterThanOrEqual(640);
      }
    });

    test(`Goal Planner @${vp.name} renders results without overflow`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await selectModeAndCalculate(page, /(Goal Planner|Hedef Planlayıcı)/i);

      const planHeading = page
        .getByRole('heading', { name: /(Your Goal Achievement Plan|Hedefe Ulaşma Planınız|Investment Strategy Summary|Yatırım Stratejisi)/i })
        .first();
      await planHeading.waitFor({ state: 'visible', timeout: 15_000 });
      await assertNoOverflow(page);
    });
  }
});
