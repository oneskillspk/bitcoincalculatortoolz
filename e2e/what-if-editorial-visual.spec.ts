import { test, expect, type Page } from '@playwright/test';

/**
 * Visual regression for the What-If calculator's editorial blocks:
 *   - How It Works (WhatIfContentSections)
 *   - Why Bitcoin Outperformed (WhatIfWhyBitcoinGrew)
 *   - Key Bitcoin Dates (WhatIfKeyDates)
 *   - What If You Invested $1,000? (WhatIfRealExamples)
 *   - FAQ (WhatIfFAQSection)
 *
 * Snapshots are taken per section, per locale (EN + TR), across the two
 * viewport projects defined in playwright.config.ts (chromium-desktop and
 * mobile-safari). Cross-locale rendering must stay visually identical
 * (layout, spacing, heading tokens, container widths) — copy differs but
 * structure must not.
 *
 * Update baselines with:
 *   npx playwright test what-if-editorial-visual --update-snapshots
 */

const ROUTES = {
  en: '/calculators/what-if',
  tr: '/tr/hesaplayicilar/bitcoin-ya-olsaydi',
} as const;

// Match on stable heading text per locale — these come from the SectionHeader
// title strings in each editorial component.
const SECTIONS: Array<{ id: string; en: RegExp; tr: RegExp }> = [
  { id: 'how-it-works',   en: /How.*Work/i,                        tr: /Nasıl Çalışır/i },
  { id: 'why-outperform', en: /Why Bitcoin Outperformed/i,         tr: /Bitcoin Neden Öne Çıktı/i },
  { id: 'key-dates',      en: /Key Bitcoin Dates/i,                tr: /Önemli Bitcoin Tarihleri/i },
  { id: 'real-examples',  en: /What If You Invested/i,             tr: /1\.000.*Yatırsaydınız/i },
  { id: 'faq',            en: /Frequently Asked Questions/i,       tr: /Sık Sorulan Sorular/i },
];

async function prep(page: Page, url: string) {
  await page.goto(url);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
      }
      [data-testid="live-bitcoin-price"],
      [data-live-price] { visibility: hidden !important; }
    `,
  });
  await page.waitForLoadState('networkidle').catch(() => {});
  // Scroll through page to force lazy sections to mount, then back to top.
  await page.evaluate(async () => {
    const step = window.innerHeight;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(400);
}

/**
 * Locate the nearest ancestor <section>/<div> wrapping a heading so we can
 * screenshot the whole editorial block, not just the heading text.
 */
async function sectionLocator(page: Page, headingRegex: RegExp) {
  const heading = page.getByRole('heading', { name: headingRegex }).first();
  await heading.scrollIntoViewIfNeeded();
  await expect(heading).toBeVisible();
  // Walk up to the containing block (max-w-3xl wrapper used across What-If).
  const block = heading.locator(
    'xpath=ancestor::*[contains(@class,"max-w-3xl") or self::section][1]'
  );
  return (await block.count()) ? block.first() : heading.locator('xpath=ancestor::div[1]');
}

test.describe('What-If editorial — visual regression EN vs TR', () => {
  for (const [locale, url] of Object.entries(ROUTES) as Array<['en' | 'tr', string]>) {
    test.describe(`locale=${locale}`, () => {
      test.beforeEach(async ({ page }) => {
        await prep(page, url);
      });

      for (const section of SECTIONS) {
        test(`${section.id} snapshot`, async ({ page }, testInfo) => {
          const block = await sectionLocator(page, section[locale]);
          const name = `what-if-${section.id}-${locale}-${testInfo.project.name}.png`;
          await expect(block).toHaveScreenshot(name, {
            animations: 'disabled',
            maxDiffPixelRatio: 0.02,
          });
        });
      }
    });
  }

  /**
   * Structural parity: EN and TR must render the same number of editorial
   * blocks in the same order. Guards against a translator adding/removing
   * a section without updating the sibling locale.
   */
  test('EN and TR expose the same editorial section count', async ({ page }) => {
    await prep(page, ROUTES.en);
    const enCount = await page.locator('main h2').count();
    await prep(page, ROUTES.tr);
    const trCount = await page.locator('main h2').count();
    expect(trCount).toBe(enCount);
  });
});
