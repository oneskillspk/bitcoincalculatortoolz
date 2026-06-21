import { test, expect, type Page } from '@playwright/test';

/**
 * Homepage visual + contrast checks (post sparkline / manifesto / skeleton work).
 *
 *  1. LazyBelowFoldContent skeletons must not leave large blank gaps on
 *     desktop. After scrolling and giving the lazy chunks time to mount,
 *     we walk consecutive `<section>` elements and assert no vertical
 *     gap between them exceeds 320px.
 *  2. The manifesto headline + caption must meet WCAG AA contrast against
 *     their painted background at the mobile and desktop sizes that the
 *     editorial copy actually renders at.
 *  3. Cross-viewport screenshot snapshots lock in the sparkline gradient,
 *     contrast, and tightened skeleton spacing.
 */

// --- WCAG AA helpers --------------------------------------------------------
function parseRgb(input: string): [number, number, number, number] {
  const m = input.match(/rgba?\(([^)]+)\)/i);
  if (!m) return [0, 0, 0, 1];
  const parts = m[1].split(',').map((p) => parseFloat(p.trim()));
  const [r, g, b, a = 1] = parts;
  return [r, g, b, a];
}
function relLuminance([r, g, b]: number[]): number {
  const ch = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
}
function contrastRatio(fg: string, bg: string): number {
  const [fr, fgn, fb, fa] = parseRgb(fg);
  const [br, bgn, bb] = parseRgb(bg);
  // composite fg over bg if fg has alpha
  const cr = fr * fa + br * (1 - fa);
  const cg = fgn * fa + bgn * (1 - fa);
  const cb = fb * fa + bb * (1 - fa);
  const l1 = relLuminance([cr, cg, cb]);
  const l2 = relLuminance([br, bgn, bb]);
  const [a, b] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (a + 0.05) / (b + 0.05);
}

async function paintedBg(page: Page, selector: string): Promise<string> {
  return page.evaluate((sel) => {
    let el: Element | null = document.querySelector(sel);
    while (el) {
      const c = getComputedStyle(el).backgroundColor;
      if (c && !c.includes('rgba(0, 0, 0, 0)') && c !== 'transparent') return c;
      el = el.parentElement;
    }
    return getComputedStyle(document.body).backgroundColor;
  }, selector);
}

const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1366, height: 900 },
] as const;

test.describe('Homepage — lazy skeletons, manifesto contrast, visual snapshots', () => {
  for (const vp of VIEWPORTS) {
    test(`no blank gaps between sections @ ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');
      // Scroll the page so EagerSection IntersectionObservers trigger and
      // every lazy chunk has time to swap from skeleton -> real content.
      await page.evaluate(async () => {
        const step = Math.max(400, window.innerHeight - 100);
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 150));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForLoadState('networkidle');

      const gaps = await page.evaluate(() => {
        const main = document.querySelector('main');
        if (!main) return [] as Array<{ a: string; b: string; gap: number }>;
        const sections = Array.from(main.querySelectorAll(':scope > *')) as HTMLElement[];
        const out: Array<{ a: string; b: string; gap: number }> = [];
        for (let i = 0; i < sections.length - 1; i++) {
          const a = sections[i].getBoundingClientRect();
          const b = sections[i + 1].getBoundingClientRect();
          const gap = b.top - a.bottom;
          if (gap > 0) out.push({ a: sections[i].tagName, b: sections[i + 1].tagName, gap });
        }
        return out;
      });

      const offenders = gaps.filter((g) => g.gap > 320);
      expect(
        offenders,
        `Vertical gaps >320px between top-level main sections:\n${JSON.stringify(offenders, null, 2)}`,
      ).toEqual([]);
    });

    test(`manifesto meets WCAG AA contrast @ ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');
      // Scroll the manifesto into view so the WordReveal tween reaches its
      // final, fully-opaque state (worst case for contrast is the resting
      // state — pre-reveal is intentionally faded).
      const heading = page.locator('h2.font-editorial').first();
      await heading.scrollIntoViewIfNeeded();
      await page.waitForTimeout(900);

      const headingColor = await heading.evaluate((el) => getComputedStyle(el).color);
      const headingBg = await paintedBg(page, 'h2.font-editorial');
      const headingRatio = contrastRatio(headingColor, headingBg);
      // Large text (>= 24px / 18.66px bold) → AA threshold 3.0.
      expect(headingRatio, `heading ${headingColor} on ${headingBg}`).toBeGreaterThanOrEqual(3.0);

      const caption = heading.locator('xpath=following::p[1]');
      await expect(caption).toBeVisible();
      const capColor = await caption.evaluate((el) => getComputedStyle(el).color);
      const capBg = await paintedBg(page, 'h2.font-editorial ~ * p, h2.font-editorial + div + p');
      const capRatio = contrastRatio(capColor, capBg || headingBg);
      // Body text → AA threshold 4.5.
      expect(capRatio, `caption ${capColor} on ${capBg}`).toBeGreaterThanOrEqual(4.5);
    });

    test(`visual snapshot @ ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveScreenshot(`home-${vp.name}.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.03,
      });
    });
  }
});
