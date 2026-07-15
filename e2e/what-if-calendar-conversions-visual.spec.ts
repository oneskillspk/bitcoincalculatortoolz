import { test, expect, type Page } from '@playwright/test';

/**
 * Visual regression coverage for the What-If date picker and conversion table.
 *
 * Update baselines intentionally with:
 *   npx playwright test what-if-calendar-conversions-visual --update-snapshots
 */

const ROUTES = {
  en: '/calculators/what-if',
  tr: '/tr/hesaplayicilar/bitcoin-ya-olsaydi',
} as const;

async function prep(page: Page, url: string) {
  await page.goto(url);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        scroll-behavior: auto !important;
      }
      [data-testid="live-bitcoin-price"],
      [data-live-price],
      iframe { visibility: hidden !important; }
    `,
  });
  await page.waitForLoadState('networkidle').catch(() => {});
}

test.describe('What-If calendar + conversion rows — visual regression', () => {
  test('calendar stays open while changing month/year and selecting a date', async ({ page }, testInfo) => {
    await prep(page, ROUTES.en);

    const trigger = page.getByRole('button', { name: /^Investment date$/i });
    await trigger.scrollIntoViewIfNeeded();
    await trigger.click();

    const picker = page.getByRole('group', { name: /date picker/i });
    await expect(picker).toBeVisible();

    await page.getByRole('combobox', { name: /select month/i }).selectOption({ label: 'January' });
    await page.getByRole('combobox', { name: /select year/i }).selectOption('2020');
    await expect(picker).toBeVisible();

    await expect(picker).toHaveScreenshot(`what-if-calendar-jan-2020-${testInfo.project.name}.png`, {
      animations: 'disabled',
      maxDiffPixelRatio: 0.01,
    });

    const day20 = picker.locator('button[name="day"]:not(.day-outside)', { hasText: /^20$/ }).first();
    await day20.click();

    await expect(trigger).toContainText(/Jan(?:uary)? 20(?:th)?, 2020/i);
  });

  for (const [locale, url] of Object.entries(ROUTES) as Array<['en' | 'tr', string]>) {
    test(`conversion table separators + rounding snapshot (${locale})`, async ({ page }, testInfo) => {
      await prep(page, url);

      const table = page.getByTestId('what-if-conversion-table');
      await table.scrollIntoViewIfNeeded();
      await expect(table).toBeVisible();

      const athRow = page.getByTestId('ath-conversion-row');
      await expect(athRow).toContainText(locale === 'tr' ? 'Eki 2025 zirvesi' : 'Oct 2025 peak');
      await expect(athRow).toContainText('$126,198');
      await expect(athRow).toContainText('0.000792 BTC');
      await expect(athRow).toContainText('$52');

      await expect(table).toHaveScreenshot(`what-if-conversion-table-${locale}-${testInfo.project.name}.png`, {
        animations: 'disabled',
        maxDiffPixelRatio: 0.015,
      });
    });
  }
});