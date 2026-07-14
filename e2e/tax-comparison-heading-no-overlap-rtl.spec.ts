import { test, expect, type Page } from '@playwright/test';

/**
 * Two guarantees for the "Bitcoin tax — country comparison" section:
 *
 *  1. NO OVERLAP — at 320 px (iPhone SE floor) and 1440 px (desktop
 *     ceiling) the centered heading (and its CardHeader wrapper +
 *     any subheading nodes inside it) must not visually collide with
 *     the element rendered immediately above it (typically the Card
 *     top border / previous section) or the element rendered
 *     immediately below (the results <table>). This guards against
 *     any future padding regression that would let a centered
 *     heading touch surrounding content.
 *
 *  2. RTL CENTERING — when the document is flipped to `dir="rtl"`
 *     the computed `text-align` must remain `center` (never resolve
 *     to `start` / `right`). Centered headings are direction-neutral;
 *     if a refactor swapped `text-center` for `text-start` the value
 *     would silently flip under RTL.
 */

const ROUTES = [
  '/calculators/bitcoin-tax-india',
  '/calculators/bitcoin-tax-uk-cgt',
  '/calculators/bitcoin-tax-germany',
];

const EDGE_VIEWPORTS = [
  { width: 320, height: 720, label: 'iphone-se-320' },
  { width: 1440, height: 900, label: 'desktop-1440' },
];

// Minimum visual gap (px) we require between the centered heading /
// CardHeader wrapper and the neighbouring nodes above & below.
const MIN_GAP_PX = 4;

async function boxOf(page: Page, selector: string) {
  return page.locator(selector).first().boundingBox();
}

for (const route of ROUTES) {
  for (const vp of EDGE_VIEWPORTS) {
    test(`comparison heading has clearance above & below at ${vp.label} on ${route}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(route, { waitUntil: 'networkidle' });

      const heading = page.locator('#tax-compare-heading');
      await heading.scrollIntoViewIfNeeded();
      await expect(heading).toBeVisible();

      // Bounding boxes: heading, its CardHeader wrapper, the table
      // that follows, and the previous sibling of the <section>.
      const headingBox = await heading.boundingBox();
      expect(headingBox, 'heading bounding box').not.toBeNull();

      const wrapperBox = await page
        .locator('#tax-compare-heading')
        .evaluateHandle((el) => el.parentElement)
        .then(async (h) => {
          const el = h.asElement();
          return el ? await el.boundingBox() : null;
        });
      expect(wrapperBox, 'CardHeader wrapper bounding box').not.toBeNull();

      const tableBox = await boxOf(
        page,
        'section[aria-labelledby="tax-compare-heading"] table',
      );
      expect(tableBox, 'comparison table bounding box').not.toBeNull();

      // Table must sit fully below the heading with a real gap.
      const gapBelow = tableBox!.y - (headingBox!.y + headingBox!.height);
      expect(
        gapBelow,
        `Heading overlaps the results table at ${vp.label} on ${route} (gap=${gapBelow}px)`,
      ).toBeGreaterThanOrEqual(MIN_GAP_PX);

      // The CardHeader wrapper must fully contain the heading (no
      // vertical bleed) — i.e. the heading is nested cleanly and the
      // wrapper's centered padding actually surrounds the text.
      expect(
        headingBox!.y,
        'heading top must sit inside wrapper',
      ).toBeGreaterThanOrEqual(wrapperBox!.y - 0.5);
      expect(
        headingBox!.y + headingBox!.height,
        'heading bottom must sit inside wrapper',
      ).toBeLessThanOrEqual(wrapperBox!.y + wrapperBox!.height + 0.5);

      // Section's previous sibling (if any) must not overlap the wrapper.
      const prevBox = await page
        .locator('section[aria-labelledby="tax-compare-heading"]')
        .evaluateHandle((el) => el.previousElementSibling)
        .then(async (h) => {
          const el = h.asElement();
          return el ? await el.boundingBox() : null;
        });
      if (prevBox) {
        const gapAbove = wrapperBox!.y - (prevBox.y + prevBox.height);
        expect(
          gapAbove,
          `Previous section overlaps comparison heading at ${vp.label} on ${route} (gap=${gapAbove}px)`,
        ).toBeGreaterThanOrEqual(0);
      }

      // Any additional heading-role node inside the wrapper (a future
      // subtitle, badge, etc.) must also stay inside its bounds.
      const extraHeadings = await page
        .locator(
          'section[aria-labelledby="tax-compare-heading"] :is(h1,h2,h3,h4,h5,h6,[role="heading"])',
        )
        .all();
      for (const h of extraHeadings) {
        const box = await h.boundingBox();
        if (!box) continue;
        expect(
          box.y + box.height,
          'nested heading bleeds past wrapper bottom',
        ).toBeLessThanOrEqual(wrapperBox!.y + wrapperBox!.height + 0.5);
      }
    });

    test(`comparison heading (and any subheading) stays centered in RTL at ${vp.label} on ${route}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(route, { waitUntil: 'networkidle' });

      // Flip the whole document to RTL, then re-measure.
      await page.evaluate(() => {
        document.documentElement.setAttribute('dir', 'rtl');
        document.body.setAttribute('dir', 'rtl');
      });

      const heading = page.locator('#tax-compare-heading');
      await heading.scrollIntoViewIfNeeded();
      await expect(heading).toBeVisible();

      const headingAlign = await heading.evaluate(
        (el) => getComputedStyle(el).textAlign,
      );
      expect(
        headingAlign,
        `RTL heading text-align at ${vp.label} on ${route} was "${headingAlign}", expected "center"`,
      ).toBe('center');

      const wrapperAlign = await heading.evaluate((el) => {
        const parent = el.parentElement;
        return parent ? getComputedStyle(parent).textAlign : null;
      });
      expect(
        wrapperAlign,
        `RTL CardHeader wrapper text-align at ${vp.label} on ${route} was "${wrapperAlign}", expected "center"`,
      ).toBe('center');

      // Every additional heading-level node inside the section must
      // also compute to `center` under RTL.
      const nested = await page
        .locator(
          'section[aria-labelledby="tax-compare-heading"] :is(h1,h2,h3,h4,h5,h6,[role="heading"])',
        )
        .all();
      for (const node of nested) {
        const align = await node.evaluate(
          (el) => getComputedStyle(el).textAlign,
        );
        expect(
          align,
          `RTL nested heading text-align at ${vp.label} on ${route} was "${align}", expected "center"`,
        ).toBe('center');
      }

      // Heading must be horizontally centered within its wrapper
      // (left/right offsets equal within 2 px) — a `text-start` regression
      // would push it to the right edge in RTL.
      const offsets = await heading.evaluate((el) => {
        const parent = el.parentElement!;
        const p = parent.getBoundingClientRect();
        const h = el.getBoundingClientRect();
        return { left: h.left - p.left, right: p.right - h.right };
      });
      expect(
        Math.abs(offsets.left - offsets.right),
        `RTL heading not horizontally centered at ${vp.label} on ${route} (left=${offsets.left}, right=${offsets.right})`,
      ).toBeLessThanOrEqual(2);
    });
  }
}
