import { test, expect, type Page } from '@playwright/test';

/**
 * Stress-test the centered comparison heading with *mocked* extra-long
 * strings to confirm centering + wrapping never let the heading (or a
 * synthetic subheading) collide with surrounding content at the 320 px
 * floor and 1440 px ceiling.
 *
 * The production copy is short ("Bitcoin tax — country comparison")
 * so a padding regression could hide behind the fact that the string
 * fits on one line. This spec inflates the heading to ~180 chars and
 * injects a second synthetic subheading so we exercise multi-line
 * wrapping in the CardHeader.
 *
 * We assert:
 *  1. The inflated heading still computes to text-align: center.
 *  2. The heading + synthetic subheading remain fully inside the
 *     CardHeader wrapper (no vertical bleed).
 *  3. There is still a positive gap between the wrapper's bottom edge
 *     and the results <table>.
 *  4. The heading is horizontally centered within its wrapper
 *     (|left − right| ≤ 2 px) even when wrapped across multiple lines.
 */

const ROUTES = [
  '/calculators/bitcoin-tax-india',
  '/calculators/bitcoin-tax-uk-cgt',
  '/calculators/bitcoin-tax-germany',
];

const EDGE_VIEWPORTS = [
  { width: 320, height: 900, label: 'iphone-se-320' },
  { width: 1440, height: 900, label: 'desktop-1440' },
];

const LONG_HEADING =
  'Bitcoin tax — full multi-jurisdiction country-by-country comparison of long-term vs short-term capital gains rules, allowances, cess surcharges, and holding-period exemptions for the 2026/27 filing year';

const LONG_SUBHEADING =
  'Includes headline rate, annual tax-free allowance, and the treatment of long-term holdings under each jurisdiction — with the row for the currently viewed calculator highlighted';

const MIN_GAP_PX = 4;

async function inflateHeading(page: Page) {
  // Replace the heading text and inject a synthetic <h3> subheading
  // inside the same CardHeader wrapper so we exercise centered
  // multi-line wrapping of BOTH the primary heading and a subheading.
  await page.evaluate(
    ({ heading, sub }) => {
      const h = document.getElementById('tax-compare-heading');
      if (!h) return;
      h.textContent = heading;
      const wrapper = h.parentElement;
      if (!wrapper) return;
      // Only inject once even if the eval runs twice.
      if (!wrapper.querySelector('[data-testid="tax-compare-subheading"]')) {
        const sub_el = document.createElement('h3');
        sub_el.setAttribute('data-testid', 'tax-compare-subheading');
        sub_el.className = 'text-center text-sm text-muted-foreground mt-2';
        sub_el.textContent = sub;
        wrapper.appendChild(sub_el);
      }
    },
    { heading: LONG_HEADING, sub: LONG_SUBHEADING },
  );
}

for (const route of ROUTES) {
  for (const vp of EDGE_VIEWPORTS) {
    test(`long heading + subheading stay centered without overlap at ${vp.label} on ${route}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(route, { waitUntil: 'networkidle' });

      const heading = page.locator('#tax-compare-heading');
      await heading.scrollIntoViewIfNeeded();
      await expect(heading).toBeVisible();

      await inflateHeading(page);
      // Give the browser a paint to re-layout the wrapped text.
      await page.waitForTimeout(50);
      await heading.scrollIntoViewIfNeeded();

      const subheading = page.locator('[data-testid="tax-compare-subheading"]');
      await expect(subheading).toBeVisible();

      // 1) Both nodes compute to text-align: center after inflation.
      for (const [label, loc] of [
        ['heading', heading],
        ['subheading', subheading],
      ] as const) {
        const align = await loc.evaluate(
          (el) => getComputedStyle(el).textAlign,
        );
        expect(
          align,
          `${label} text-align after inflation at ${vp.label} on ${route} was "${align}", expected "center"`,
        ).toBe('center');
      }

      // Bounding boxes for wrapper, heading, subheading, table.
      const headingBox = await heading.boundingBox();
      const subBox = await subheading.boundingBox();
      const wrapperBox = await heading
        .evaluateHandle((el) => el.parentElement)
        .then(async (h) => {
          const el = h.asElement();
          return el ? await el.boundingBox() : null;
        });
      const tableBox = await page
        .locator('section[aria-labelledby="tax-compare-heading"] table')
        .first()
        .boundingBox();

      expect(headingBox, 'heading box').not.toBeNull();
      expect(subBox, 'subheading box').not.toBeNull();
      expect(wrapperBox, 'wrapper box').not.toBeNull();
      expect(tableBox, 'table box').not.toBeNull();

      // Multi-line wrapping actually happened at 320 (sanity check
      // that the stress test is exercising what it claims to).
      if (vp.width === 320) {
        // ~180 chars @ ~288 px content width will wrap to ≥ 3 lines,
        // so heading height should comfortably exceed one line-height.
        expect(
          headingBox!.height,
          `heading did not wrap at 320 (height=${headingBox!.height})`,
        ).toBeGreaterThan(40);
      }

      // 2) Heading + subheading sit fully inside the wrapper.
      for (const [label, box] of [
        ['heading', headingBox!],
        ['subheading', subBox!],
      ] as const) {
        expect(
          box.y,
          `${label} top bleeds above wrapper at ${vp.label} on ${route}`,
        ).toBeGreaterThanOrEqual(wrapperBox!.y - 0.5);
        expect(
          box.y + box.height,
          `${label} bottom bleeds below wrapper at ${vp.label} on ${route}`,
        ).toBeLessThanOrEqual(wrapperBox!.y + wrapperBox!.height + 0.5);
      }

      // 3) Heading and subheading themselves don't overlap.
      const gapBetween = subBox!.y - (headingBox!.y + headingBox!.height);
      expect(
        gapBetween,
        `Heading overlaps subheading at ${vp.label} on ${route} (gap=${gapBetween}px)`,
      ).toBeGreaterThanOrEqual(0);

      // 4) Positive gap between wrapper and the results table.
      const gapBelow = tableBox!.y - (wrapperBox!.y + wrapperBox!.height);
      expect(
        gapBelow,
        `Wrapper overlaps results table at ${vp.label} on ${route} (gap=${gapBelow}px)`,
      ).toBeGreaterThanOrEqual(MIN_GAP_PX);

      // 5) Heading is horizontally centered within its wrapper even
      //    after wrapping (|left − right| ≤ 2 px).
      const offsets = await heading.evaluate((el) => {
        const parent = el.parentElement!;
        const p = parent.getBoundingClientRect();
        const h = el.getBoundingClientRect();
        return { left: h.left - p.left, right: p.right - h.right };
      });
      expect(
        Math.abs(offsets.left - offsets.right),
        `inflated heading not horizontally centered at ${vp.label} on ${route} (left=${offsets.left}, right=${offsets.right})`,
      ).toBeLessThanOrEqual(2);

      // Same horizontal-centering check for the subheading.
      const subOffsets = await subheading.evaluate((el) => {
        const parent = el.parentElement!;
        const p = parent.getBoundingClientRect();
        const s = el.getBoundingClientRect();
        return { left: s.left - p.left, right: p.right - s.right };
      });
      expect(
        Math.abs(subOffsets.left - subOffsets.right),
        `inflated subheading not horizontally centered at ${vp.label} on ${route} (left=${subOffsets.left}, right=${subOffsets.right})`,
      ).toBeLessThanOrEqual(2);
    });
  }
}
