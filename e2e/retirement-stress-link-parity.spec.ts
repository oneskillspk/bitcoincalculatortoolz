import { test, expect, type Page } from '@playwright/test';

/**
 * Verifies the "stress-test downside" cross-link in RetirementZoneFour
 * stays identical across EN and TR: same href, same Tailwind classes
 * on the <a>, same surrounding paragraph structure (one link inside
 * a single <div>). Guards against accidental drift when copy is
 * translated or restyled.
 */
const STRESS_HREF_FRAGMENT = '/calculators/drawdown';

const grabLink = async (page: Page) => {
  const link = page.locator(`a[href*="${STRESS_HREF_FRAGMENT}"]`).first();
  await expect(link).toBeVisible();
  const href = await link.getAttribute('href');
  const className = await link.getAttribute('class');
  const text = (await link.innerText()).trim();
  const parentTag = await link.evaluate((el) => el.parentElement?.tagName.toLowerCase() ?? '');
  return { href, className, text, parentTag };
};

test.describe('Retirement stress-test link — EN/TR parity', () => {
  test('href + classes + parent structure match across languages', async ({ page }) => {
    await page.goto('/calculators/retirement');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const en = await grabLink(page);

    await page.goto('/tr/hesaplayicilar/bitcoin-emeklilik-hesaplayicisi');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const tr = await grabLink(page);

    // Same destination.
    expect(en.href).toBe(tr.href);
    expect(en.href).toContain(STRESS_HREF_FRAGMENT);

    // Identical styling classes (order included — Tailwind classes are deterministic here).
    expect(en.className).toBe(tr.className);

    // Identical parent element type (both should be wrapped in the same <div> paragraph).
    expect(en.parentTag).toBe(tr.parentTag);

    // Both languages render non-empty visible text.
    expect(en.text.length).toBeGreaterThan(0);
    expect(tr.text.length).toBeGreaterThan(0);
  });
});
