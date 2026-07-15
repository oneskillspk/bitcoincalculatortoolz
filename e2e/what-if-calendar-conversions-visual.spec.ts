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
  test('date input accepts a historical date without layout drift', async ({ page }, testInfo) => {
    await prep(page, ROUTES.en);

    const dateInput = page.getByLabel(/^Investment date$/i);
    await dateInput.scrollIntoViewIfNeeded();
    await dateInput.fill('2017-08-17');

    await expect(dateInput).toHaveValue('2017-08-17');

    await expect(page.locator('section[aria-labelledby="what-if-calc-title"]')).toHaveScreenshot(`what-if-date-input-aug-2017-${testInfo.project.name}.png`, {
      animations: 'disabled',
      maxDiffPixelRatio: 0.01,
    });
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