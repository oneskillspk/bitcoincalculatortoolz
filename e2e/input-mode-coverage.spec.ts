/**
 * Site-wide inputMode coverage: visits every static route declared in
 * src/App.tsx and asserts that every numeric <input> on the rendered page
 * carries an `inputmode` attribute so mobile keyboards behave correctly.
 *
 * Static analysis already runs in scripts/audit-input-mode.mjs / the
 * inputMode.audit.test unit test — this spec is the runtime counterpart
 * that catches inputs added dynamically at runtime.
 */
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function extractRoutes(): string[] {
  const src = readFileSync(resolve(__dirname, '../src/App.tsx'), 'utf8');
  const out = new Set<string>();
  const re = /<Route\s+path="([^"]+)"\s+element=\{<([A-Za-z0-9_]+)/g;
  let m;
  while ((m = re.exec(src))) {
    const [, path, comp] = m;
    if (path.includes(':') || path.includes('*')) continue; // dynamic
    if (comp === 'Navigate' || comp === 'LegacyRedirect') continue; // redirects
    out.add(path.replace(/\/+$/, '') || '/');
  }
  return [...out];
}

const ROUTES = extractRoutes();

test.describe('inputMode coverage across every route', () => {
  for (const route of ROUTES) {
    test(`numeric inputs on ${route} declare inputMode`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));

      const resp = await page.goto(route, { waitUntil: 'networkidle' });
      expect(resp?.status(), `navigation to ${route}`).toBeLessThan(400);

      // Give lazy panels / hydration a moment.
      await page.waitForTimeout(500);

      const offenders = await page.evaluate(() => {
        const bad: { selector: string; type: string | null }[] = [];
        const inputs = Array.from(document.querySelectorAll('input'));
        for (const el of inputs) {
          const type = el.getAttribute('type');
          const inputMode = el.getAttribute('inputmode');
          const isNumeric =
            type === 'number' ||
            (type === 'text' &&
              /(amount|price|qty|quantity|value|rate|years?|months?|days?|btc|usd|sats|fee|percent|%)/i.test(
                `${el.name} ${el.id} ${el.getAttribute('aria-label') ?? ''} ${el.placeholder ?? ''}`,
              ));
          if (!isNumeric || inputMode) continue;
          bad.push({
            selector: el.outerHTML.slice(0, 200),
            type,
          });
        }
        return bad;
      });

      expect(
        offenders,
        `Missing inputMode on ${route}:\n${offenders
          .map((o) => `  ${o.selector}`)
          .join('\n')}`,
      ).toEqual([]);

      expect(errors, `runtime errors on ${route}:\n${errors.join('\n')}`).toEqual([]);
    });
  }
});
