import { test, expect, devices } from '@playwright/test';

/**
 * Round 4 — 360px Android-baseline overflow smoke.
 *
 * Visits the top calculators at 360×800 and asserts:
 *   - document.scrollingElement has no horizontal overflow
 *   - no descendant element extends past the viewport's right edge
 *
 * If a future change introduces a fixed-width child or a missing
 * `overflow-x-auto` wrapper, this test catches it before launch.
 */

const ROUTES = [
  '/',
  '/calculators/dca',
  '/calculators/what-if',
  '/calculators/retirement',
  '/calculators/profit-loss',
  '/calculators/bitcoin-converter',
  '/calculators/volatility',
  '/calculators/cagr',
];

test.use({ ...devices['Pixel 5'], viewport: { width: 360, height: 800 } });

for (const route of ROUTES) {
  test(`no horizontal overflow at 360px on ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: 'networkidle' });

    // 1) root scrollWidth must not exceed viewport width
    const { rootOverflow, viewport } = await page.evaluate(() => {
      const root = document.scrollingElement || document.documentElement;
      return {
        rootOverflow: root.scrollWidth - root.clientWidth,
        viewport: window.innerWidth,
      };
    });
    expect(rootOverflow, `Root scrollWidth overflow on ${route}`).toBeLessThanOrEqual(1);
    expect(viewport).toBe(360);

    // 2) no element's right edge extends past viewport (allow 2px tolerance for AA)
    const offenders = await page.evaluate(() => {
      const vw = window.innerWidth;
      const out: { tag: string; cls: string; right: number }[] = [];
      document.querySelectorAll<HTMLElement>('body *').forEach((el) => {
        // Skip elements inside scroll containers — horizontal scroll is allowed there.
        let p: HTMLElement | null = el.parentElement;
        let inScroll = false;
        while (p && p !== document.body) {
          const s = getComputedStyle(p);
          if (s.overflowX === 'auto' || s.overflowX === 'scroll') {
            inScroll = true;
            break;
          }
          p = p.parentElement;
        }
        if (inScroll) return;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;
        if (r.right > vw + 2) {
          out.push({ tag: el.tagName.toLowerCase(), cls: el.className?.toString().slice(0, 80) ?? '', right: r.right });
        }
      });
      return out.slice(0, 5);
    });
    expect(offenders, `Overflow offenders on ${route}: ${JSON.stringify(offenders, null, 2)}`).toEqual([]);
  });
}
