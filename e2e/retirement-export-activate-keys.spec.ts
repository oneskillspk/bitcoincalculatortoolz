import { test, expect, type Page } from '@playwright/test';

/**
 * Keyboard activation for the Retirement share/export controls.
 *
 * Verifies that pressing Enter and Space while a button is focused actually
 * fires its action in every mode (Forecaster, Goal Planner, FIRE):
 *   - PDF button       → triggers a file download
 *   - CSV button       → triggers a file download
 *   - Copy-link button → writes a shareable URL to the clipboard
 *
 * Guards against regressions where a button becomes a non-native element
 * (e.g. <div role="button">) that silently swallows Enter/Space, or where
 * `preventDefault` on keydown blocks native activation.
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

/** Grant clipboard permission and stub the writeText so we can observe copy actions
 *  without depending on OS-level clipboard access in headless CI. */
async function installClipboardCapture(page: Page) {
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']).catch(() => {});
  await page.evaluate(() => {
    (window as any).__copiedText = null;
    const original = navigator.clipboard?.writeText?.bind(navigator.clipboard);
    // Override writeText to always record, even if the original rejects in headless.
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          (window as any).__copiedText = text;
          try { await original?.(text); } catch { /* headless can reject; capture is what matters */ }
        },
        readText: async () => (window as any).__copiedText ?? '',
      },
    });
  });
}

async function readCopiedText(page: Page): Promise<string | null> {
  return await page.evaluate(() => (window as any).__copiedText ?? null);
}

async function focusButton(page: Page, name: RegExp) {
  const btn = page.getByRole('button', { name }).first();
  await expect(btn).toBeVisible();
  await btn.scrollIntoViewIfNeeded();
  await btn.focus();
  await expect(btn).toBeFocused();
  return btn;
}

for (const mode of MODES) {
  test(`retirement export · ${mode.name}: Enter/Space activate PDF, CSV, Copy-link`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await calculate(page, mode.tabIndex);
    await installClipboardCapture(page);

    // --- PDF via Enter ---
    await focusButton(page, /pdf/i);
    const pdfDownloadEnter = page.waitForEvent('download', { timeout: 15_000 });
    await page.keyboard.press('Enter');
    const pdfEnter = await pdfDownloadEnter;
    expect(pdfEnter.suggestedFilename()).toMatch(/\.pdf$/i);

    // --- CSV via Space ---
    await focusButton(page, /csv/i);
    const csvDownloadSpace = page.waitForEvent('download', { timeout: 15_000 });
    await page.keyboard.press('Space');
    const csvSpace = await csvDownloadSpace;
    expect(csvSpace.suggestedFilename()).toMatch(/\.csv$/i);

    // --- Copy-link via Enter ---
    await page.evaluate(() => { (window as any).__copiedText = null; });
    await focusButton(page, /(copy|link|share)/i);
    await page.keyboard.press('Enter');
    await expect.poll(() => readCopiedText(page), { timeout: 5_000 }).toBeTruthy();
    const copiedViaEnter = await readCopiedText(page);
    expect(copiedViaEnter).toMatch(/^https?:\/\//);

    // --- Copy-link via Space (re-activation) ---
    await page.evaluate(() => { (window as any).__copiedText = null; });
    await focusButton(page, /(copy|link|share)/i);
    await page.keyboard.press('Space');
    await expect.poll(() => readCopiedText(page), { timeout: 5_000 }).toBeTruthy();
    const copiedViaSpace = await readCopiedText(page);
    expect(copiedViaSpace).toMatch(/^https?:\/\//);
    expect(copiedViaSpace).toEqual(copiedViaEnter);
  });
}
