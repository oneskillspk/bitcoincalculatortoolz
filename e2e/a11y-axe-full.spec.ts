import { test, expect, devices, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Full accessibility guard.
 *
 * For every public route × viewport (desktop + mobile) this spec runs:
 *
 *   1. axe-core wcag2a/wcag2aa/wcag21a/wcag21aa scan — fails on any
 *      serious/critical violation.
 *   2. Keyboard traversal — presses Tab a handful of times from the
 *      document root and asserts focus lands on real, visible interactive
 *      elements (guards against tabindex traps and invisible focus).
 *   3. Cookie-consent banner assertion — the banner is aria-live and was
 *      previously collapsed to 1×1px by the sr-only rule. Assert its
 *      bounding box is a real visible size when present.
 *
 * Any regression fails the build. Rules that are known-noisy for our
 * marketing surfaces (color-contrast on gradient backgrounds validated
 * manually, region on decorative wrappers) are disabled explicitly with a
 * comment so silencing is auditable.
 */

const ROUTES = [
  '/',
  '/calculators',
  '/calculators/dca',
  '/calculators/retirement',
  '/calculators/portfolio-tracker',
  '/calculators/bitcoin-converter',
  '/calculators/bitcoin-tax-uk-cgt',
  '/calculators/bitcoin-tax-germany',
  '/calculators/bitcoin-tax-india',
  '/learn',
  '/about',
  '/contact',
  '/tools',
  '/methodology',
  '/tr',
  '/tr/hesaplayicilar',
  '/tr/hesaplayicilar/bitcoin-portfoy',
];

const VIEWPORTS: Array<{ name: 'desktop' | 'mobile'; viewport: { width: number; height: number } }> = [
  { name: 'desktop', viewport: { width: 1440, height: 900 } },
  { name: 'mobile', viewport: devices['iPhone 13'].viewport },
];

// Rules we intentionally skip and why. Keep this list tiny and justified.
const DISABLED_RULES = [
  // Marketing gradients pass contrast against sampled swatches but axe cannot
  // measure gradient backgrounds and flags every text node over them. Audited
  // manually per direction change; blocking the whole build on it is noise.
  'color-contrast',
  // Cookie/consent scripts inject <iframe title=""> we don't control.
  'frame-title',
];

async function runAxe(page: Page, route: string, viewport: string) {
  const results = await new AxeBuilder({ page })
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
            .join('\n    ')}`,
      )
      .join('\n');
    throw new Error(
      `Axe violations on ${route} (${viewport}):\n${summary}\nHelp: ${blocking[0].helpUrl}`,
    );
  }
}

async function assertKeyboardFocus(page: Page, route: string) {
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur?.());
  // Tab through the first several stops; any stop must be visible + interactive.
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press('Tab');
    const info = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) return null;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        tag: el.tagName,
        visible:
          r.width > 0 &&
          r.height > 0 &&
          cs.visibility !== 'hidden' &&
          cs.display !== 'none' &&
          cs.opacity !== '0',
        interactive:
          /^(A|BUTTON|INPUT|SELECT|TEXTAREA|SUMMARY)$/.test(el.tagName) ||
          el.hasAttribute('tabindex') ||
          el.getAttribute('role') === 'button' ||
          el.getAttribute('role') === 'link',
        outline: cs.outlineStyle,
        boxShadow: cs.boxShadow,
      };
    });
    if (!info) continue; // reached end / skip-link may consume focus off-screen
    expect(info.visible, `${route}: focused element ${info.tag} not visible`).toBe(true);
    expect(info.interactive, `${route}: focused element ${info.tag} not interactive`).toBe(true);
  }
}

async function assertCookieBannerHealth(page: Page, route: string) {
  // Clear any prior consent so the banner has a chance to render.
  await page.evaluate(() => {
    try {
      localStorage.removeItem('cookie-consent');
      localStorage.removeItem('cookieConsent');
      localStorage.removeItem('consent');
    } catch { /* noop */ }
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  const banner = await page.evaluate(() => {
    const candidates = [
      ...document.querySelectorAll('[aria-live]'),
      ...document.querySelectorAll('[role="dialog"]'),
    ];
    // Heuristic: find an aria-live node that contains the word "cookie".
    const el = candidates.find((n) =>
      /cookie|çerez/i.test((n as HTMLElement).innerText || ''),
    ) as HTMLElement | undefined;
    if (!el) return { present: false };
    const r = el.getBoundingClientRect();
    return {
      present: true,
      width: r.width,
      height: r.height,
      classList: [...el.classList],
      ariaLive: el.getAttribute('aria-live'),
    };
  });

  if (!banner.present) return; // route may not render the banner (e.g. already dismissed variants)

  expect(banner.width, `${route}: cookie banner width collapsed`).toBeGreaterThan(200);
  expect(banner.height, `${route}: cookie banner height collapsed`).toBeGreaterThan(30);
  // The original bug was the sr-only utility being applied to every aria-live
  // region. Guard against a regression by asserting the banner is NOT sr-only.
  expect(banner.classList.includes('sr-only')).toBe(false);
}

for (const { name: vpName, viewport } of VIEWPORTS) {
  test.describe(`a11y (${vpName})`, () => {
    test.use({ viewport });

    for (const route of ROUTES) {
      test(`${route}`, async ({ page }) => {
        await page.goto(route, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(1500);

        await runAxe(page, route, vpName);
        await assertKeyboardFocus(page, route);
        await assertCookieBannerHealth(page, route);
      });
    }
  });
}
