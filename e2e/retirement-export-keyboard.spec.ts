import { test, expect, type Page } from '@playwright/test';

/**
 * Keyboard traversal for the Retirement share/export controls.
 *
 * Verifies that Tab moves focus forward through the PDF → CSV → Copy-link
 * buttons and Shift+Tab walks the same order in reverse, in every mode
 * (Forecaster, Goal Planner, FIRE). Guards against focus traps, hidden
 * buttons, or `tabIndex={-1}` regressions on the export panel.
 */

const MODES = [
  { name: 'forecaster', tabIndex: 0 },
  { name: 'planner', tabIndex: 1 },
  { name: 'fire', tabIndex: 2 },
] as const;

async function calculate(page: Page, tabIndex: number) {
  await page.goto('/calculators/retirement', { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle').catch(() => {});
  const modeButtons = page
    .locator('main button')
    .filter({ hasText: /Forecaster|Goal Planner|FIRE/i });
  const target = modeButtons.nth(tabIndex);
  if (await target.count()) await target.click().catch(() => {});
  const calcBtn = page.getByRole('button', { name: /Calculate/i }).first();
  await calcBtn.click({ trial: false }).catch(() => {});
  await page.waitForTimeout(800);
}

async function labelOf(page: Page): Promise<string> {
  return await page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    if (!el) return '';
    return (el.getAttribute('aria-label') || el.textContent || '').trim().toLowerCase();
  });
}

function classify(label: string): 'pdf' | 'csv' | 'copy' | null {
  if (/pdf/.test(label)) return 'pdf';
  if (/csv/.test(label)) return 'csv';
  if (/(copy|link|share)/.test(label)) return 'copy';
  return null;
}

/**
 * Tab from the PDF button forward until we've observed PDF → CSV → Copy in
 * that relative order (other buttons in between are fine — the panel may
 * live inside a larger toolbar). Bounded by `maxHops` so we can't hang.
 */
async function walk(page: Page, direction: 'forward' | 'backward'): Promise<Array<'pdf' | 'csv' | 'copy'>> {
  const seen: Array<'pdf' | 'csv' | 'copy'> = [];
  const maxHops = 25;
  for (let i = 0; i < maxHops; i++) {
    if (direction === 'forward') await page.keyboard.press('Tab');
    else await page.keyboard.press('Shift+Tab');
    const kind = classify(await labelOf(page));
    if (kind && seen[seen.length - 1] !== kind) seen.push(kind);
    if (seen.length === 3) break;
  }
  return seen;
}

for (const mode of MODES) {
  test(`retirement export · ${mode.name}: Tab walks PDF → CSV → Copy-link, Shift+Tab reverses`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await calculate(page, mode.tabIndex);

    // Scroll the export panel into view and land focus on the PDF button.
    const pdfBtn = page.getByRole('button', { name: /pdf/i }).first();
    await expect(pdfBtn).toBeVisible();
    await pdfBtn.scrollIntoViewIfNeeded();
    await pdfBtn.focus();
    expect(classify(await labelOf(page))).toBe('pdf');

    // Forward: PDF → CSV → Copy
    const forward = await walk(page, 'forward');
    expect(forward).toEqual(['csv', 'copy']);

    // Now focus is on Copy — walk backward, expect Copy → CSV → PDF.
    const backward = await walk(page, 'backward');
    expect(backward).toEqual(['csv', 'pdf']);
  });
}
