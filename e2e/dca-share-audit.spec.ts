import { test, expect, type Page } from '@playwright/test';

/**
 * DCA-scoped share audit.
 *
 * The DCA results panel renders its own <CopyShareLinkButton slug="dca"
 * label="Share results" …/> that lives immediately under the DCA results
 * block. A separate ExportReportButton lower on the page emits a "what-if"
 * share link — a generic first-match `.getByRole('button', { name: /share|copy|link/i })`
 * selector will grab THAT one and give you a false pass.
 *
 * This spec:
 *  1. Fills the DCA inputs, clicks Calculate.
 *  2. Locates the DCA panel's Share button by its unique accessible name
 *     ("Share results") and clicks it.
 *  3. Reads the intercepted clipboard payload and asserts it points at
 *     the DCA slug (either /s/dca or /calculators/dca) with amount, freq,
 *     start, end, currency params.
 *  4. Opens the canonical /calculators/dca?... form of that URL and asserts
 *     the DCA results panel re-hydrates and produces real numeric results
 *     (ROI %, current value, total invested — not the empty state).
 */

async function installClipboardCapture(page: Page) {
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']).catch(() => {});
  await page.evaluate(() => {
    (window as any).__copied = null;
    const original = navigator.clipboard?.writeText?.bind(navigator.clipboard);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          (window as any).__copied = text;
          try { await original?.(text); } catch { /* headless */ }
        },
        readText: async () => (window as any).__copied ?? '',
      },
    });
  });
}

/** Extract the first http(s) URL that appears in a clipboard payload
 *  (which is `${headline} → ${url-without-scheme}` in composeShareText). */
function extractUrl(payload: string): URL {
  const direct = payload.match(/https?:\/\/[^\s]+/);
  if (direct) return new URL(direct[0]);
  // composeShareText strips the scheme; re-attach https for parsing.
  const bare = payload.match(/([\w-]+\.)+[\w-]+\/[^\s]*/);
  if (!bare) throw new Error(`no URL in clipboard payload: ${payload}`);
  return new URL('https://' + bare[0]);
}

/** Turn a shared URL (short /s/<slug> or canonical /calculators/<slug>)
 *  into the canonical path we can open against localhost. */
function toCanonicalDcaPath(u: URL): string {
  const params = u.search || '';
  return `/calculators/dca${params}`;
}

async function fillDcaInputs(page: Page) {
  // ModernDCAInputPanel: amount, frequency select, start date, end date, currency.
  const amount = page.getByLabel(/amount|investment/i).first();
  await amount.fill('1200').catch(() => {});

  // Frequency (native select or shadcn combobox — try both).
  const freqCombo = page.getByRole('combobox', { name: /frequency|interval/i }).first();
  if (await freqCombo.count()) {
    await freqCombo.click().catch(() => {});
    await page.getByRole('option', { name: /monthly/i }).first().click({ timeout: 1500 }).catch(() => {});
  }

  // Date inputs — best-effort; the calculator has sensible defaults so
  // missing dates are OK for a smoke assertion.
  const start = page.locator('input[type="date"]').first();
  if (await start.count()) await start.fill('2020-01-01').catch(() => {});
  const end = page.locator('input[type="date"]').nth(1);
  if (await end.count()) await end.fill('2023-01-01').catch(() => {});
}

async function clickCalculate(page: Page) {
  const cta = page.locator('[data-calc-cta-button="true"]').first();
  if (await cta.count()) {
    await cta.click().catch(() => {});
    return;
  }
  await page.getByRole('button', { name: /^\s*calculate/i }).first().click().catch(() => {});
}

test('DCA share audit · scoped Copy button copies DCA URL and reopens to real results', async ({ page }) => {
  test.setTimeout(90_000);
  await page.setViewportSize({ width: 1280, height: 1600 });
  await page.goto('/calculators/dca', { waitUntil: 'domcontentloaded' });

  await fillDcaInputs(page);
  await clickCalculate(page);

  // Wait for the DCA results panel (which owns the scoped Share button)
  // to render. The share button carries the unique label "Share results".
  const shareBtn = page.getByRole('button', { name: 'Share results' });
  await expect(shareBtn, 'DCA-scoped Share button must render after Calculate').toBeVisible({
    timeout: 30_000,
  });

  await installClipboardCapture(page);
  await shareBtn.scrollIntoViewIfNeeded();
  await shareBtn.click();

  await expect
    .poll(() => page.evaluate(() => (window as any).__copied ?? null), { timeout: 5_000 })
    .toBeTruthy();

  const copied: string = await page.evaluate(() => (window as any).__copied);
  const url = extractUrl(copied);

  // Must be the DCA slug — NOT what-if / any other calculator panel.
  expect(url.pathname, `copied path should target DCA slug, got ${url.pathname}`).toMatch(
    /\/(s|calculators)\/dca$/,
  );

  // Every DCA-defining param the button emits must be present.
  for (const key of ['amount', 'freq', 'start', 'end', 'currency']) {
    expect(url.searchParams.get(key), `param ${key} must be in copied URL`).toBeTruthy();
  }
  expect(url.searchParams.get('freq')).toMatch(/^(daily|weekly|bi-weekly|monthly|quarterly)$/);
  expect(Number(url.searchParams.get('amount'))).toBeGreaterThan(0);

  // Reopen the canonical form and verify DCA results actually re-hydrate.
  await page.goto(toCanonicalDcaPath(url), { waitUntil: 'domcontentloaded' });
  await clickCalculate(page);

  // Real results: the same scoped Share button appears again AND numeric
  // metrics (ROI %, currency-prefixed values) show up in the results panel.
  await expect(page.getByRole('button', { name: 'Share results' })).toBeVisible({
    timeout: 30_000,
  });

  // At least one ROI-shaped or currency-shaped value must be on the page —
  // i.e. we did NOT land on the empty "enter an amount" state.
  const bodyText = await page.locator('main').innerText();
  expect(
    /[-+]?\d+(\.\d+)?\s*%/.test(bodyText) || /\$[\d,]+(\.\d+)?/.test(bodyText),
    'reopened DCA URL must render real numeric results (ROI % or $ value)',
  ).toBe(true);
});
