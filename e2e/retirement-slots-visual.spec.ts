import { test, expect, type Page } from '@playwright/test';

/**
 * Visual regression + non-overlap guard for the V2 Slot system on the
 * Bitcoin Retirement Calculator. Confirms SlotA/B/C/D each render in
 * their expected vertical region and never overlap one another on
 * mobile and desktop breakpoints.
 *
 * Update baselines:
 *   npx playwright test retirement-slots-visual --update-snapshots
 */

const ROUTE = '/calculators/retirement';

const VIEWPORTS = [
  { name: 'mobile',  width: 390,  height: 844 },
  { name: 'desktop', width: 1280, height: 900 },
] as const;

const SLOTS = ['A', 'B', 'C', 'D'] as const;

async function grantConsent(page: Page) {
  await page.addInitScript(() => {
    try { localStorage.setItem('bct-consent-v1', 'granted'); } catch {}
  });
}

async function fullScroll(page: Page) {
  // Walk the page top→bottom in steps so IntersectionObserver-gated
  // slots (B/C/D) all get a chance to mount.
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = await page.evaluate(() => window.innerHeight * 0.75);
  for (let y = 0; y < height; y += step) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(250);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);
}

type Rect = { x: number; y: number; width: number; height: number };

async function slotRect(page: Page, slot: string): Promise<Rect | null> {
  return await page.evaluate((s) => {
    const el = document.querySelector(`[data-slot="${s}"]`) as HTMLElement | null;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) {
      return null;
    }
    if (r.width < 2 || r.height < 2) return null;
    return {
      x: r.x + window.scrollX,
      y: r.y + window.scrollY,
      width: r.width,
      height: r.height,
    };
  }, slot);
}

function overlaps(a: Rect, b: Rect): boolean {
  return !(
    a.x + a.width  <= b.x ||
    b.x + b.width  <= a.x ||
    a.y + a.height <= b.y ||
    b.y + b.height <= a.y
  );
}

for (const vp of VIEWPORTS) {
  test.describe(`Retirement V2 slots · ${vp.name}`, () => {
    test.beforeEach(async ({ page }) => {
      await grantConsent(page);
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(ROUTE, { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});
      await fullScroll(page);
    });

    test('every slot renders in its expected vertical region', async ({ page }, testInfo) => {
      const docHeight = await page.evaluate(() => document.documentElement.scrollHeight);
      const rects: Record<string, Rect> = {};
      for (const s of SLOTS) {
        const r = await slotRect(page, s);
        expect(r, `Slot${s} must be rendered & visible on ${vp.name}`).not.toBeNull();
        rects[s] = r!;
      }

      // Region expectations (fractions of full document height).
      // A = pre-calc (top 35%), B = result-adjacent (15–70%),
      // C = mid-content (25–85%), D = sticky companion (anywhere).
      const ranges: Record<string, [number, number]> = {
        A: [0.00, 0.35],
        B: [0.15, 0.75],
        C: [0.20, 0.90],
        D: [0.00, 1.00],
      };
      for (const s of SLOTS) {
        const mid = (rects[s].y + rects[s].height / 2) / docHeight;
        const [lo, hi] = ranges[s];
        expect(
          mid,
          `Slot${s} centerY=${mid.toFixed(3)} outside expected [${lo}, ${hi}] on ${vp.name}`,
        ).toBeGreaterThanOrEqual(lo);
        expect(mid).toBeLessThanOrEqual(hi);
      }

      // Pairwise non-overlap. SlotD is sticky/floating, so we check it
      // against the others using viewport coords at the moment it's
      // painted rather than absolute doc coords (sticky position).
      for (let i = 0; i < SLOTS.length; i++) {
        for (let j = i + 1; j < SLOTS.length; j++) {
          const a = SLOTS[i];
          const b = SLOTS[j];
          if (a === 'D' || b === 'D') continue; // sticky checked below
          expect(
            overlaps(rects[a], rects[b]),
            `Slot${a} overlaps Slot${b} on ${vp.name}\n  ${a}=${JSON.stringify(rects[a])}\n  ${b}=${JSON.stringify(rects[b])}`,
          ).toBe(false);
        }
      }

      // SlotD sticky overlap: scroll to each inline slot and assert that
      // SlotD does not visually cover it in the viewport.
      for (const s of ['A', 'B', 'C'] as const) {
        await page.evaluate((sel) => {
          document.querySelector(sel)?.scrollIntoView({ block: 'center' });
        }, `[data-slot="${s}"]`);
        await page.waitForTimeout(200);
        const conflict = await page.evaluate((sel) => {
          const target = document.querySelector(sel) as HTMLElement | null;
          const d = document.querySelector('[data-slot="D"]') as HTMLElement | null;
          if (!target || !d) return false;
          const a = target.getBoundingClientRect();
          const b = d.getBoundingClientRect();
          const cs = getComputedStyle(d);
          if (cs.display === 'none' || cs.visibility === 'hidden') return false;
          return !(a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top);
        }, `[data-slot="${s}"]`);
        expect(conflict, `SlotD visually overlaps Slot${s} on ${vp.name}`).toBe(false);
      }

      // Attach a viewport screenshot per slot for human review.
      for (const s of SLOTS) {
        await page.evaluate((sel) => {
          document.querySelector(sel)?.scrollIntoView({ block: 'center' });
        }, `[data-slot="${s}"]`);
        await page.waitForTimeout(200);
        const buf = await page.screenshot({ fullPage: false });
        await testInfo.attach(`retirement_${vp.name}_slot${s}.png`, {
          body: buf,
          contentType: 'image/png',
        });
      }
    });

    test('per-slot visual snapshot (element screenshot)', async ({ page }) => {
      for (const s of SLOTS) {
        const loc = page.locator(`[data-slot="${s}"]`).first();
        await loc.scrollIntoViewIfNeeded();
        await page.waitForTimeout(200);
        await expect(loc).toHaveScreenshot(`retirement-${vp.name}-slot-${s}.png`, {
          animations: 'disabled',
          maxDiffPixelRatio: 0.03,
        });
      }
    });
  });
}
