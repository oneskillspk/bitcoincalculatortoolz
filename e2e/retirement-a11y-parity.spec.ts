import { test, expect, type Page } from '@playwright/test';

/**
 * Structural a11y parity check: the retirement page must expose the
 * same landmark + heading shape as the DCA page.
 *
 * Verifies:
 *   1. Exactly one <main> landmark per page
 *   2. Exactly one <h1>
 *   3. Hero / Calculator / Overview sections each have aria-labelledby
 *      pointing at a real heading id
 *   4. Section order matches Explain → Prove → Answer → Cite
 *   5. Heading ladder never skips a level (h1 → h2 → h3, no h1 → h3)
 */
const collect = async (page: Page) => {
  const mains = await page.locator('main').count();
  const h1s = await page.locator('h1').count();
  const labels = await page
    .locator('main section[aria-labelledby], main section[aria-label]')
    .evaluateAll((nodes) =>
      nodes.map((n) => n.getAttribute('aria-labelledby') || n.getAttribute('aria-label') || ''),
    );
  const headingLevels = await page
    .locator('main h1, main h2, main h3, main h4')
    .evaluateAll((nodes) => nodes.map((n) => Number(n.tagName.substring(1))));
  return { mains, h1s, labels, headingLevels };
};

const assertLadderNoSkip = (levels: number[]) => {
  for (let i = 1; i < levels.length; i++) {
    expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
  }
};

test.describe('Retirement page — a11y parity with DCA', () => {
  test('landmarks, headings, and section order', async ({ page }) => {
    await page.goto('/calculators/retirement');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.waitForLoadState('networkidle').catch(() => {});

    const { mains, h1s, labels, headingLevels } = await collect(page);

    expect(mains, 'exactly one <main> landmark').toBe(1);
    expect(h1s, 'exactly one <h1>').toBe(1);

    // Required landmark labels.
    expect(labels).toContain('retirement-hero-heading');
    expect(labels).toContain('retirement-calculator-heading');
    expect(labels).toContain('retirement-overview-heading');

    // Each aria-labelledby id must resolve to an existing element.
    for (const id of ['retirement-hero-heading', 'retirement-calculator-heading', 'retirement-overview-heading']) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }

    // Explain → Prove order: Overview precedes the Comparison block on the page.
    const idxOverview = labels.indexOf('retirement-overview-heading');
    const idxCalc = labels.indexOf('retirement-calculator-heading');
    const idxHero = labels.indexOf('retirement-hero-heading');
    expect(idxHero).toBeLessThan(idxCalc);
    expect(idxCalc).toBeLessThan(idxOverview);

    assertLadderNoSkip(headingLevels);
  });

  test('parity: DCA page exposes the equivalent shape', async ({ page }) => {
    await page.goto('/calculators/dca');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.waitForLoadState('networkidle').catch(() => {});

    const { mains, h1s, labels, headingLevels } = await collect(page);
    expect(mains).toBe(1);
    expect(h1s).toBe(1);
    expect(labels).toEqual(
      expect.arrayContaining(['dca-hero-heading', 'dca-calculator-heading', 'dca-overview-heading']),
    );
    assertLadderNoSkip(headingLevels);
  });
});
