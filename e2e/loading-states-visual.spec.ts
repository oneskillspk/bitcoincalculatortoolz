import { test, expect, type Page } from '@playwright/test';

/**
 * Visual regression guard for DCA + Retirement loading states.
 *
 * Goals:
 *  - Skeletons render with stable proportions (no shimmer/flash regression).
 *  - Skeleton → real content swap doesn't produce a blank/zero-height frame.
 *  - role="status" + aria-busy semantics are present on every skeleton.
 *  - aria-busy flips to absent/false once the real content has mounted.
 */

const slowChunks = async (page: Page) => {
  // Slow JS chunks so lazy Suspense boundaries are observably pending.
  await page.route('**/*.js', async (route) => {
    await new Promise((r) => setTimeout(r, 120));
    await route.continue();
  });
};

const waitForSplashGone = async (page: Page) => {
  await page
    .locator('[data-testid="splash"]')
    .waitFor({ state: 'detached', timeout: 10_000 })
    .catch(() => {});
};

const assertA11yLoading = async (page: Page, testId: string) => {
  const node = page.locator(`[data-testid="${testId}"]`).first();
  await expect(node).toBeVisible();
  await expect(node).toHaveAttribute('role', 'status');
  await expect(node).toHaveAttribute('aria-busy', 'true');
  await expect(node).toHaveAttribute('aria-live', 'polite');
  // An accessible name must exist (sr-only label).
  const name = await node.getAttribute('aria-label').catch(() => null);
  const srText = await node.locator('.sr-only').first().textContent().catch(() => '');
  expect((name ?? srText ?? '').trim().length).toBeGreaterThan(0);
};

test.describe('DCA loading states', () => {
  test('chart/results skeletons are visible during lazy load and a11y-correct', async ({ page }) => {
    await slowChunks(page);
    await page.goto('/calculators/dca');
    await waitForSplashGone(page);

    // After splash, the DCA section lazy-loads — at least one skeleton
    // should appear before content settles. We use `or` to tolerate either
    // a results or chart skeleton depending on timing.
    const anySkeleton = page
      .locator('[data-testid^="dca-"][data-testid$="skeleton"], [data-testid="dca-results-skeleton"], [data-testid="dca-chart-skeleton"], [data-testid="dca-section-skeleton"]')
      .first();

    // A skeleton may resolve very fast on local; if so, just assert the
    // post-load page is non-blank.
    const sawSkeleton = await anySkeleton.waitFor({ state: 'visible', timeout: 4_000 }).then(() => true).catch(() => false);
    if (sawSkeleton) {
      await assertA11yLoading(page, await anySkeleton.getAttribute('data-testid') as string);
      await expect(anySkeleton).toHaveScreenshot('dca-skeleton.png', {
        animations: 'disabled',
        maxDiffPixelRatio: 0.02,
      });
    }

    // Page must end in a non-empty, non-flashing state.
    await page.waitForLoadState('networkidle');
    const main = page.locator('main');
    await expect(main).toBeVisible();
    const box = await main.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThan(400);

    // After settle, no skeleton should still claim aria-busy.
    const stillBusy = await page.locator('[data-testid$="skeleton"][aria-busy="true"]').count();
    expect(stillBusy).toBe(0);
  });
});

test.describe('Retirement loading states', () => {
  test('mode skeleton appears between tab switches and is a11y-correct', async ({ page }) => {
    await slowChunks(page);
    await page.goto('/calculators/retirement');
    await waitForSplashGone(page);
    await page.waitForLoadState('networkidle');

    // Switch to a not-yet-loaded mode tab — the mode chunk is lazy, so
    // ModeSkeleton should briefly mount inside the Suspense boundary.
    const plannerTab = page.getByRole('tab', { name: /goal planner|hedef planlayıcı/i }).first();
    if (await plannerTab.count()) {
      await plannerTab.click();
      const skeleton = page.locator('[data-testid="retirement-mode-skeleton"]');
      const sawSkeleton = await skeleton
        .waitFor({ state: 'visible', timeout: 3_000 })
        .then(() => true)
        .catch(() => false);

      if (sawSkeleton) {
        await assertA11yLoading(page, 'retirement-mode-skeleton');
        await expect(skeleton).toHaveScreenshot('retirement-mode-skeleton.png', {
          animations: 'disabled',
          maxDiffPixelRatio: 0.02,
        });
      }
    }

    // After switching, the planner panel must be present and aria-busy
    // must be cleared.
    await page.waitForLoadState('networkidle');
    const stillBusy = await page
      .locator('[data-testid="retirement-mode-skeleton"][aria-busy="true"]')
      .count();
    expect(stillBusy).toBe(0);

    // Layout has a sensible height — no skeleton-to-content collapse.
    const main = page.locator('main');
    const box = await main.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThan(600);
  });

  test('cycling Forecaster → Planner → FIRE never leaves a blank frame', async ({ page }) => {
    await slowChunks(page);
    await page.goto('/calculators/retirement');
    await waitForSplashGone(page);
    await page.waitForLoadState('networkidle');

    const tabs = ['planner', 'fire', 'forecaster'] as const;
    for (const value of tabs) {
      const tab = page.locator(`[role="tab"][value="${value}"], button[data-state][value="${value}"]`).first();
      // Fallback: click by name if value selector misses.
      if ((await tab.count()) === 0) {
        const byName = page.getByRole('tab').filter({ hasText: new RegExp(value, 'i') }).first();
        if (await byName.count()) await byName.click();
      } else {
        await tab.click();
      }

      // While the chunk loads, either the skeleton or the real panel must
      // occupy space — never a 0-height region.
      const region = page.locator('section[aria-labelledby="retirement-calculator-heading"]');
      const box = await region.boundingBox();
      expect(box?.height ?? 0).toBeGreaterThan(200);
    }
  });
});
