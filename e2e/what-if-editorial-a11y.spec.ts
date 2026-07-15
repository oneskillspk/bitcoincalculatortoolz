import { test, expect, devices, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * axe-core accessibility checks scoped to the What-If calculator's editorial
 * blocks — How It Works, Why Bitcoin Outperformed, Key Bitcoin Dates,
 * What If You Invested $1,000?, and FAQ — in both English and Turkish,
 * at desktop (1440×900) and mobile (iPhone 13) viewports.
 *
 * We scope each scan to the section container (via AxeBuilder.include) so
 * findings can't leak in from unrelated site chrome (header, footer,
 * cookie banner). Only serious/critical WCAG 2.1 A/AA violations block the
 * build. color-contrast is disabled to match the sitewide policy in
 * a11y-axe-full.spec.ts (gradient backgrounds axe can't sample).
 */

const ROUTES = {
  en: '/calculators/what-if',
  tr: '/tr/hesaplayicilar/bitcoin-ya-olsaydi',
} as const;

const SECTIONS: Array<{ id: string; en: RegExp; tr: RegExp }> = [
  { id: 'how-it-works',   en: /How.*Work/i,                  tr: /Nasıl Çalışır/i },
  { id: 'why-outperform', en: /Why Bitcoin Outperformed/i,   tr: /Bitcoin Neden Öne Çıktı/i },
  { id: 'key-dates',      en: /Key Bitcoin Dates/i,          tr: /Önemli Bitcoin Tarihleri/i },
  { id: 'real-examples',  en: /What If You Invested/i,       tr: /1\.000.*Yatırsaydınız/i },
  { id: 'faq',            en: /Frequently Asked Questions/i, tr: /Sık Sorulan Sorular/i },
];

const VIEWPORTS: Array<{ name: 'desktop' | 'mobile'; viewport: { width: number; height: number } }> = [
  { name: 'desktop', viewport: { width: 1440, height: 900 } },
  { name: 'mobile',  viewport: devices['iPhone 13'].viewport },
];

const DISABLED_RULES = ['color-contrast', 'frame-title'];

async function preparePage(page: Page, url: string) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  // Force lazy sections to mount by walking the page.
  await page.evaluate(async () => {
    const step = window.innerHeight;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(400);
}

/**
 * Return a CSS selector for the nearest editorial-block ancestor of a heading
 * so AxeBuilder.include() can scope the scan. We tag the block with a
 * one-off data attribute we can hand to axe as a stable selector.
 */
async function tagSectionContainer(page: Page, headingRegex: RegExp, tag: string) {
  const heading = page.getByRole('heading', { name: headingRegex }).first();
  await heading.scrollIntoViewIfNeeded();
  await expect(heading).toBeVisible();
  const block = heading.locator(
    'xpath=ancestor::*[contains(@class,"max-w-3xl") or self::section][1]',
  );
  const target = (await block.count()) ? block.first() : heading.locator('xpath=ancestor::div[1]');
  await target.evaluate((el, attr) => el.setAttribute('data-axe-scope', attr), tag);
  return `[data-axe-scope="${tag}"]`;
}

for (const { name: vpName, viewport } of VIEWPORTS) {
  test.describe(`What-If editorial a11y (${vpName})`, () => {
    test.use({ viewport });

    for (const [locale, url] of Object.entries(ROUTES) as Array<['en' | 'tr', string]>) {
      test.describe(`locale=${locale}`, () => {
        test.beforeEach(async ({ page }) => {
          await preparePage(page, url);
        });

        for (const section of SECTIONS) {
          test(`${section.id} — no serious/critical axe violations`, async ({ page }, testInfo) => {
            test.skip(
              testInfo.project.name !== 'chromium-desktop',
              'a11y matrix runs inside a single project',
            );

            const selector = await tagSectionContainer(
              page,
              section[locale],
              `${section.id}-${locale}-${vpName}`,
            );

            const results = await new AxeBuilder({ page })
              .include(selector)
              .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
              .disableRules(DISABLED_RULES)
              .analyze();

            const blocking = results.violations.filter(
              (v) => v.impact === 'serious' || v.impact === 'critical',
            );

            if (blocking.length) {
              const summary = blocking
                .map(
                  (v) =>
                    `- [${v.impact}] ${v.id}: ${v.help}\n    ${v.nodes
                      .slice(0, 3)
                      .map((n) => n.target.join(' '))
                      .join('\n    ')}\n    ${v.helpUrl}`,
                )
                .join('\n');
              throw new Error(
                `axe violation in What-If ${section.id} (${locale}, ${vpName}):\n${summary}`,
              );
            }
            expect(blocking).toEqual([]);
          });
        }
      });
    }
  });
}
