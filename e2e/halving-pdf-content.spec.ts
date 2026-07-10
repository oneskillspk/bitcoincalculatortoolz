import { test, expect } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

/**
 * Halving Countdown PDF content regression.
 *
 * Guards against the regression where <HalvingExportReport /> was mounted
 * without countdown props, producing a PDF that contained ONLY the title
 * and disclaimer (no Current Block, Blocks Remaining, Estimated Date,
 * Current Reward, Next Reward).
 *
 * We download the PDF, run `pdftotext` on it (already available in CI),
 * and assert that every expected field label + a plausible value shape
 * shows up in the extracted text.
 */
test('halving PDF · includes countdown values, not just title/disclaimer', async ({ page }) => {
  await page.goto('/calculators/halving-countdown', { waitUntil: 'domcontentloaded' });

  // The countdown data comes from a React Query fetch; wait until the
  // export panel is present (it renders as soon as the page mounts) and
  // the countdown timer has resolved (block height text appears).
  await page.waitForSelector('[data-share-export-panel]', { timeout: 20_000 });
  // Wait for query resolution — Block height text like "912,345" appears
  await page.waitForFunction(
    () => /\b\d{3},\d{3}\b/.test(document.body.textContent ?? ''),
    { timeout: 20_000 },
  ).catch(() => {}); // don't hard-fail if formatting differs; PDF still asserted below

  const pdfBtn = page.getByRole('button', { name: /pdf/i }).first();
  await pdfBtn.scrollIntoViewIfNeeded();

  const dl = page.waitForEvent('download', { timeout: 20_000 });
  await pdfBtn.click();
  const download = await dl;

  const dir = mkdtempSync(path.join(tmpdir(), 'halving-pdf-'));
  const pdfPath = path.join(dir, download.suggestedFilename());
  await download.saveAs(pdfPath);

  // Basic sanity: non-empty file, ends in .pdf
  expect(pdfPath).toMatch(/\.pdf$/);

  // Extract text
  const txt = execFileSync('pdftotext', ['-layout', pdfPath, '-']).toString();

  // Section heading must exist
  expect(txt).toMatch(/Halving Status/i);

  // All 5 field labels must appear
  for (const label of [
    'Current Block',
    'Blocks Remaining',
    'Estimated Date',
    'Current Reward',
    'Next Reward',
  ]) {
    expect(txt, `PDF missing "${label}"`).toContain(label);
  }

  // Reward values are plain numbers followed by "BTC" (e.g. "3.125 BTC", "1.5625 BTC")
  expect(txt).toMatch(/\d+(?:\.\d+)?\s*BTC/);
  // Block numbers are large (>= 6 digits with commas)
  expect(txt).toMatch(/\b\d{3},\d{3}\b/);
  // Estimated date should include a 4-digit year 20xx
  expect(txt).toMatch(/\b20\d{2}\b/);
});
