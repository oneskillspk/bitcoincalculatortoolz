import { test, expect } from '@playwright/test';
import { EN_TO_TR } from '../src/utils/localizedRoutes';

/**
 * Regression guard: after the initial splash detaches, NO client-side
 * navigation between any mapped route may re-inject a `.splash-container`
 * (or `[data-testid="splash"]`) node into the DOM.
 *
 * Strategy:
 *  - Install a MutationObserver before the app boots that records every
 *    added node matching the splash selectors after `window.__splashGone`
 *    is set (we set it the moment Playwright observes the splash detach).
 *  - Walk every EN → TR mapped route pair via history.pushState + popstate,
 *    which is what React Router uses under the hood for <Link> clicks.
 *  - Assert the recorded re-injection list stays empty.
 */

const EN_ROUTES = Object.keys(EN_TO_TR);
const TR_ROUTES = Object.values(EN_TO_TR);
const ALL_ROUTES = Array.from(new Set([...EN_ROUTES, ...TR_ROUTES]));

test('splash node is never re-injected during client-side navigation across all mapped routes', async ({
  page,
}) => {
  await page.addInitScript(() => {
    (window as unknown as { __splashReinjections: string[] }).__splashReinjections = [];
    const isSplash = (node: Node): node is Element => {
      if (!(node instanceof Element)) return false;
      return (
        node.matches?.('.splash-container, [data-testid="splash"]') ||
        !!node.querySelector?.('.splash-container, [data-testid="splash"]')
      );
    };
    const observer = new MutationObserver((records) => {
      if (!(window as unknown as { __splashGone?: boolean }).__splashGone) return;
      for (const r of records) {
        r.addedNodes.forEach((n) => {
          if (isSplash(n)) {
            (window as unknown as { __splashReinjections: string[] }).__splashReinjections.push(
              `${location.pathname} :: ${(n as Element).outerHTML.slice(0, 120)}`,
            );
          }
        });
      }
    });
    const start = () =>
      observer.observe(document.documentElement, { childList: true, subtree: true });
    if (document.documentElement) start();
    else document.addEventListener('DOMContentLoaded', start, { once: true });
  });

  await page.goto('/');
  // Wait for splash to fully detach, then flip the flag so the observer
  // begins recording any reappearance.
  await page.locator('[data-testid="splash"]').waitFor({ state: 'detached', timeout: 10_000 });
  await page.evaluate(() => {
    (window as unknown as { __splashGone: boolean }).__splashGone = true;
  });

  for (const route of ALL_ROUTES) {
    await page.evaluate((href) => {
      window.history.pushState({}, '', href);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }, route);

    await expect(page).toHaveURL(new RegExp(`${route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/?$`));
    // Give React Router + Suspense a frame to mount the next route.
    await page.waitForFunction(() => !!document.querySelector('#root')?.children.length);

    const reinjections = await page.evaluate(
      () => (window as unknown as { __splashReinjections: string[] }).__splashReinjections,
    );
    expect(
      reinjections,
      `Splash node was re-injected on route ${route}:\n${reinjections.join('\n')}`,
    ).toEqual([]);
    await expect(page.locator('[data-testid="splash"]')).toHaveCount(0);
  }
});
