import { test, expect, type Page, type Locator } from '@playwright/test';

/**
 * Share round-trip + export-download coverage for the calculators that
 * the earlier share audit script marked SKIP (their share/export panels
 * weren't matched by the generic `[data-share-export-panel]` +
 * `Copy link` selector heuristic).
 *
 * Two shapes are covered explicitly, per each calculator's actual UI:
 *
 *   shape: 'stateful-copy-link'
 *     The panel exposes a Copy-link button that produces a canonical
 *     https://…/calculators/<slug>[?…] URL. We: fill inputs → Calculate
 *     → click Copy → parse clipboard → reopen the canonical URL
 *     → re-Calculate → download the primary export → assert the
 *     download's suggested filename matches the canonical base.
 *
 *   shape: 'pdf-only'
 *     The share/export panel exports a PDF (and sometimes PNG) but does
 *     NOT expose a Copy-link button, so there is no shareable stateful
 *     URL to round-trip. Documented as a limitation of the calculator's
 *     panel design — we still verify the export download itself works
 *     from a fresh page load (`load-then-download`) so the "SKIP" audit
 *     entry stops being a blind spot.
 *
 * Capital-Gains-Tax is intentionally excluded: it has no share/export
 * panel at all. See `skip-list-share-roundtrip.no-panel.md` note in the
 * test output when it fails, if that ever changes.
 */

type Recipe = {
  slug: string; // /calculators/<slug>
  label: string;
  /** English filename base emitted by <SlugExportReport /> (see src/utils/exportFilename.ts). */
  filenameBase: string | null;
  /** Extension the primary export button produces. */
  ext: 'pdf' | 'png' | 'csv';
  shape: 'stateful-copy-link' | 'pdf-only';
  /** Fill inputs enough to produce a result. Kept forgiving — best-effort. */
  fillInputs: (page: Page) => Promise<void>;
};

const todayIso = (): string => {
  const d = new Date();
  const p = (n: number) => (n < 10 ? `0${n}` : String(n));
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

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

function extractUrl(payload: string): URL {
  const direct = payload.match(/https?:\/\/[^\s]+/);
  if (direct) return new URL(direct[0]);
  const bare = payload.match(/([\w-]+\.)+[\w-]+\/[^\s]*/);
  if (!bare) throw new Error(`no URL in clipboard payload: ${payload}`);
  return new URL('https://' + bare[0]);
}

/** Preferred Calculate trigger: the shared data-attribute; fall back to any
 *  primary button whose accessible name starts with "Calculate" (English) or
 *  "Hesapla" (Turkish). Skips FAQ accordions by requiring `type="submit"`
 *  or the CTA attribute. */
async function clickCalculate(page: Page) {
  const cta = page.locator('[data-calc-cta-button="true"]').first();
  if (await cta.count()) {
    await cta.click({ trial: false }).catch(() => {});
    return;
  }
  const submit = page.locator('button[type="submit"]').first();
  if (await submit.count()) {
    await submit.click().catch(() => {});
    return;
  }
  await page
    .getByRole('button', { name: /^\s*(calculate|hesapla)/i })
    .first()
    .click()
    .catch(() => {});
}

/** Fill the first N number inputs inside the input panel with a sensible
 *  default. Skips inputs that already carry a non-empty value. */
async function seedFirstNumberInputs(page: Page, defaults: string[]) {
  const inputs = page.locator('input[type="number"]');
  const count = Math.min(await inputs.count(), defaults.length);
  for (let i = 0; i < count; i++) {
    const el = inputs.nth(i);
    const existing = await el.inputValue().catch(() => '');
    if (existing && existing !== '0') continue;
    await el.fill(defaults[i]).catch(() => {});
  }
}

async function findSharePanel(page: Page): Promise<Locator | null> {
  // Scroll progressively so lazy panels mount, then look for the canonical marker.
  const panel = page.locator('[data-share-export-panel]').first();
  for (let y = 0; y < 8; y++) {
    if (await panel.count()) {
      await panel.scrollIntoViewIfNeeded().catch(() => {});
      return panel;
    }
    await page.mouse.wheel(0, 900);
    await page.waitForTimeout(250);
  }
  return (await panel.count()) ? panel : null;
}

async function firstDownloadButton(panel: Locator): Promise<Locator> {
  // Try each canonical export kind in priority order.
  const namePatterns = [/pdf/i, /csv|spreadsheet/i, /png|image|snapshot/i];
  for (const re of namePatterns) {
    const btn = panel.getByRole('button', { name: re }).first();
    if (await btn.count()) return btn;
  }
  return panel.getByRole('button').first();
}

const RECIPES: Recipe[] = [
  // ---- pdf-only ---------------------------------------------------------
  {
    slug: 'bitcoin-savings',
    label: 'Bitcoin Savings Plan',
    filenameBase: 'bitcoin-savings-plan',
    ext: 'pdf',
    shape: 'pdf-only',
    fillInputs: async (page) => {
      await seedFirstNumberInputs(page, ['5000', '100']);
    },
  },
  {
    slug: 'mining-profitability',
    label: 'Bitcoin Mining Profitability',
    filenameBase: 'bitcoin-mining-report',
    ext: 'pdf',
    shape: 'pdf-only',
    fillInputs: async (page) => {
      // Hashrate + power + electricity cost defaults.
      await seedFirstNumberInputs(page, ['100', '3000', '0.10', '3']);
    },
  },
  {
    slug: 'bitcoin-lot-size',
    label: 'Bitcoin Lot Size',
    filenameBase: 'bitcoin-lot-size-report',
    ext: 'pdf',
    shape: 'pdf-only',
    fillInputs: async (page) => {
      await seedFirstNumberInputs(page, ['10000', '1', '85000', '83000', '1']);
    },
  },
  {
    slug: 'leverage-liquidation',
    label: 'Bitcoin Leverage Liquidation',
    filenameBase: 'leverage-analysis',
    ext: 'pdf',
    // panel exposes a copy-link BUT it copies static share text (not a
    // stateful URL) — treat as pdf-only for round-trip purposes.
    shape: 'pdf-only',
    fillInputs: async (page) => {
      await seedFirstNumberInputs(page, ['90000', '10', '1000']);
    },
  },
  {
    slug: 'fear-greed-index',
    label: 'Bitcoin Fear & Greed',
    filenameBase: 'bitcoin-fear-greed-index-report',
    ext: 'pdf',
    shape: 'pdf-only',
    fillInputs: async () => { /* data-driven, no inputs */ },
  },
  {
    slug: 'rainbow-chart',
    label: 'Bitcoin Rainbow Chart',
    filenameBase: 'bitcoin-rainbow-chart-report',
    ext: 'pdf',
    shape: 'pdf-only',
    fillInputs: async () => { /* data-driven */ },
  },

  // ---- stateful-copy-link (short-URL round-trip via /s/<slug>) ---------
  //
  // These panels copy a text payload that embeds the canonical
  // https://bitcoincalculator.tools/calculators/<slug> URL. The URL itself
  // has no query state (see BitcoinLoanShareCard etc.) — the round-trip
  // still verifies (a) the panel actually copies the correct slug URL and
  // (b) reopening that URL renders the calculator and produces an
  // export-capable panel.
  {
    slug: 'bitcoin-loan',
    label: 'Bitcoin Loan',
    filenameBase: null, // ShareCard has no PDF/CSV export
    ext: 'pdf',
    shape: 'stateful-copy-link',
    fillInputs: async (page) => {
      await seedFirstNumberInputs(page, ['1.5', '90000', '10000', '10']);
    },
  },
  {
    slug: 'inheritance-tax',
    label: 'Bitcoin Inheritance Tax',
    filenameBase: null,
    ext: 'pdf',
    shape: 'stateful-copy-link',
    fillInputs: async (page) => {
      await seedFirstNumberInputs(page, ['1.5', '20000', '90000']);
    },
  },
  {
    slug: 'bitcoin-accumulation-score',
    label: 'Bitcoin Accumulation Score',
    filenameBase: null,
    ext: 'pdf',
    shape: 'stateful-copy-link',
    fillInputs: async (page) => {
      await seedFirstNumberInputs(page, ['0.5']);
    },
  },
];

for (const recipe of RECIPES) {
  test(`SKIP-audit round-trip · ${recipe.slug} · ${recipe.shape}`, async ({ page }) => {
    test.setTimeout(90_000);
    await page.setViewportSize({ width: 1280, height: 1600 });
    await page.goto(`/calculators/${recipe.slug}`, { waitUntil: 'domcontentloaded' });
    await recipe.fillInputs(page);
    await clickCalculate(page);
    await page.waitForTimeout(1200);

    const panel = await findSharePanel(page);
    expect(panel, `${recipe.slug}: [data-share-export-panel] must be reachable`).not.toBeNull();

    if (recipe.shape === 'stateful-copy-link') {
      await installClipboardCapture(page);
      const copyBtn = panel!
        .getByRole('button', { name: /copy|link|share|paylaş|kopy/i })
        .first();
      await expect(copyBtn, `${recipe.slug}: copy-link button must render`).toBeVisible({
        timeout: 10_000,
      });
      await copyBtn.click();
      await expect
        .poll(() => page.evaluate(() => (window as any).__copied ?? null), { timeout: 5_000 })
        .toBeTruthy();

      const payload: string = await page.evaluate(() => (window as any).__copied);
      const url = extractUrl(payload);
      expect(
        url.pathname,
        `${recipe.slug}: copied URL should target this calculator's slug`,
      ).toMatch(new RegExp(`/(s|calculators)/${recipe.slug}$`));

      // Reopen the canonical form and re-hydrate.
      await page.goto(`/calculators/${recipe.slug}${url.search}`, {
        waitUntil: 'domcontentloaded',
      });
      await recipe.fillInputs(page);
      await clickCalculate(page);
      await page.waitForTimeout(1200);

      const reopenedPanel = await findSharePanel(page);
      expect(
        reopenedPanel,
        `${recipe.slug}: reopened copied URL must still render the share/export panel`,
      ).not.toBeNull();

      // If the panel exposes a downloadable export, verify it downloads.
      // (Loan / inheritance / accumulation share cards intentionally omit
      // PDF/CSV — twitter + linkedin + copy-link only — so we skip the
      // download assertion when no filenameBase is set.)
      if (recipe.filenameBase) {
        const dlBtn = await firstDownloadButton(reopenedPanel!);
        const [download] = await Promise.all([
          page.waitForEvent('download', { timeout: 15_000 }),
          dlBtn.click(),
        ]);
        const filename = download.suggestedFilename();
        expect(
          filename,
          `${recipe.slug}: download filename base must match ${recipe.filenameBase}`,
        ).toMatch(new RegExp(`^${recipe.filenameBase}-\\d{4}-\\d{2}-\\d{2}\\.${recipe.ext}$`));
        expect(filename).toContain(todayIso());
      }
      return;
    }

    // shape === 'pdf-only'
    expect(
      recipe.filenameBase,
      `${recipe.slug}: pdf-only recipe must declare a filenameBase`,
    ).toBeTruthy();
    const dlBtn = await firstDownloadButton(panel!);
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 15_000 }),
      dlBtn.click(),
    ]);
    const filename = download.suggestedFilename();
    expect(
      filename,
      `${recipe.slug}: pdf-only download must match canonical base ${recipe.filenameBase}`,
    ).toMatch(new RegExp(`^${recipe.filenameBase!}-\\d{4}-\\d{2}-\\d{2}\\.${recipe.ext}$`));
    expect(filename).toContain(todayIso());
  });
}

test.describe('SKIP-audit · not applicable', () => {
  test('capital-gains-tax has no share/export panel — documented gap', async ({ page }) => {
    await page.goto('/calculators/capital-gains-tax', { waitUntil: 'domcontentloaded' });
    // Should NOT render a share/export panel — if this starts finding one,
    // migrate this route into RECIPES above.
    const panel = page.locator('[data-share-export-panel]').first();
    await page.waitForTimeout(800);
    expect(
      await panel.count(),
      'capital-gains-tax gained a share/export panel — add it to the RECIPES list',
    ).toBe(0);
  });
});
