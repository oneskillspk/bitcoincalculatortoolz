import { test, expect, type Page } from '@playwright/test';

/**
 * Mobile responsive audit for the Retirement calculator page.
 *
 * Covers:
 *  1. Uniform sm-breakpoint card transition across all 3 retirement tables.
 *  2. Card layouts use semantic <dl>/<dt>/<dd> with accessible labels.
 *  3. No horizontal overflow of the page or the input panel.
 *  4. Tooltip triggers expose accessible names.
 *  5. Typography & spacing assertions for mobile card labels/values.
 *  6. Visual regression: BTC-retirement card vs. 60/40 card (spacing parity).
 */

const ROUTE = '/calculators/retirement';

const TABLES = [
  {
    key: 'income',
    aria: 'Bitcoin retirement income comparison table',
  },
  {
    key: 'scenarios',
    aria: 'Bitcoin retirement scenarios',
  },
  {
    key: '6040',
    aria: 'Bitcoin retirement vs. 60/40 portfolio comparison',
  },
] as const;

const MOBILE = { width: 375, height: 900 };
const TABLET = { width: 640, height: 900 };
const DESKTOP = { width: 1280, height: 900 };

async function ready(page: Page) {
  await page.goto(ROUTE);
  await page.waitForLoadState('networkidle');
}

test.describe('retirement page — mobile audit @375px', () => {
  test.use({ viewport: MOBILE });

  test('no horizontal page overflow', async ({ page }) => {
    await ready(page);
    const overflow = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    }));
    expect(overflow.scroll).toBeLessThanOrEqual(overflow.client + 1);
  });

  test('input panel fits within viewport', async ({ page }) => {
    await ready(page);
    const panel = page.locator('form, [data-testid="retirement-input-panel"]').first();
    if (await panel.count()) {
      const box = await panel.boundingBox();
      if (box) expect(box.width).toBeLessThanOrEqual(MOBILE.width);
    }
    // Every input/select/button inside the calculator stays in-bounds.
    const fields = page.locator('input, select, button').filter({ visible: true } as any);
    const count = Math.min(await fields.count(), 25);
    for (let i = 0; i < count; i++) {
      const b = await fields.nth(i).boundingBox().catch(() => null);
      if (b) expect(b.x + b.width).toBeLessThanOrEqual(MOBILE.width + 1);
    }
  });

  for (const t of TABLES) {
    test(`${t.key}: collapses to semantic card list with dl/dt/dd`, async ({ page }) => {
      await ready(page);
      const list = page.locator(`ul[aria-label="${t.aria}"]`).first();
      await expect(list).toBeVisible();

      // Region (desktop table) is hidden below sm.
      const region = page.locator(`[role="region"][aria-label="${t.aria}"]`);
      if (await region.count()) {
        await expect(region.first()).toBeHidden();
      }

      // At least one card with dl/dt/dd
      const dls = list.locator('dl');
      expect(await dls.count()).toBeGreaterThan(0);
      expect(await list.locator('dt').count()).toBeGreaterThan(0);
      expect(await list.locator('dd').count()).toBeGreaterThan(0);

      // Cards stay within viewport (no overflow).
      const cards = list.locator('li');
      const n = await cards.count();
      for (let i = 0; i < n; i++) {
        const b = await cards.nth(i).boundingBox();
        if (b) expect(b.x + b.width).toBeLessThanOrEqual(MOBILE.width + 1);
      }
    });

    test(`${t.key}: card typography & spacing match design system`, async ({ page }) => {
      await ready(page);
      const list = page.locator(`ul[aria-label="${t.aria}"]`).first();
      await expect(list).toBeVisible();

      // Eyebrow label
      const eyebrow = list.locator('li p').first();
      const eyebrowStyles = await eyebrow.evaluate((el) => {
        const s = getComputedStyle(el);
        return { fontSize: s.fontSize, textTransform: s.textTransform, fontWeight: s.fontWeight };
      });
      expect(eyebrowStyles.textTransform).toBe('uppercase');
      expect(parseFloat(eyebrowStyles.fontSize)).toBeLessThanOrEqual(12);
      expect(Number(eyebrowStyles.fontWeight)).toBeGreaterThanOrEqual(600);

      // Card padding (Tailwind p-5 = 20px)
      const card = list.locator('li').first();
      const padding = await card.evaluate((el) => getComputedStyle(el).paddingTop);
      expect(parseFloat(padding)).toBeGreaterThanOrEqual(16);

      // dt label sizing (~12px)
      const dt = list.locator('dt').first();
      const dtSize = await dt.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
      expect(dtSize).toBeLessThanOrEqual(13);
    });
  }

  test('tooltip triggers expose accessible names', async ({ page }) => {
    await ready(page);
    const triggers = page.locator('[data-state][aria-describedby], button[aria-label], [role="button"][aria-label]');
    const count = Math.min(await triggers.count(), 20);
    for (let i = 0; i < count; i++) {
      const el = triggers.nth(i);
      const name =
        (await el.getAttribute('aria-label')) ||
        (await el.textContent())?.trim() ||
        '';
      expect(name.length, `trigger ${i} missing accessible name`).toBeGreaterThan(0);
    }
  });
});

test.describe('retirement tables — breakpoint switch is uniform', () => {
  for (const t of TABLES) {
    test(`${t.key}: card@375, table@1280`, async ({ page }) => {
      await page.setViewportSize(MOBILE);
      await ready(page);
      await expect(page.locator(`ul[aria-label="${t.aria}"]`).first()).toBeVisible();

      await page.setViewportSize(DESKTOP);
      await page.waitForTimeout(150);
      await expect(page.locator(`[role="region"][aria-label="${t.aria}"]`).first()).toBeVisible();
      await expect(page.locator(`ul[aria-label="${t.aria}"]`).first()).toBeHidden();
    });
  }

  test('all three tables flip at the same sm breakpoint (640px)', async ({ page }) => {
    await page.setViewportSize({ width: 639, height: 900 });
    await ready(page);
    for (const t of TABLES) {
      await expect(page.locator(`ul[aria-label="${t.aria}"]`).first()).toBeVisible();
    }
    await page.setViewportSize(TABLET);
    await page.waitForTimeout(150);
    for (const t of TABLES) {
      await expect(page.locator(`[role="region"][aria-label="${t.aria}"]`).first()).toBeVisible();
    }
  });
});

test.describe('retirement cards — visual parity @375px', () => {
  test.use({ viewport: MOBILE });

  test('income card vs 60/40 card spacing parity', async ({ page }) => {
    await ready(page);
    const incomeCard = page.locator('ul[aria-label="Bitcoin retirement income comparison table"] li').first();
    const sixtyFortyCard = page.locator('ul[aria-label="Bitcoin retirement vs. 60/40 portfolio comparison"] li').first();
    await incomeCard.scrollIntoViewIfNeeded();
    const a = await incomeCard.evaluate((el) => {
      const s = getComputedStyle(el);
      return { p: s.padding, radius: s.borderRadius };
    });
    await sixtyFortyCard.scrollIntoViewIfNeeded();
    const b = await sixtyFortyCard.evaluate((el) => {
      const s = getComputedStyle(el);
      return { p: s.padding, radius: s.borderRadius };
    });
    expect(a.p).toBe(b.p);
    expect(a.radius).toBe(b.radius);

    // Snapshot comparison (writes baseline on first run with --update-snapshots).
    expect(await incomeCard.screenshot()).toMatchSnapshot('income-card-mobile.png', {
      maxDiffPixelRatio: 0.05,
    });
    expect(await sixtyFortyCard.screenshot()).toMatchSnapshot('sixtyforty-card-mobile.png', {
      maxDiffPixelRatio: 0.05,
    });
  });
});
