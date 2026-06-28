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
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));

function extractRoutes(): string[] {
  const src = readFileSync(resolve(HERE, '../src/App.tsx'), 'utf8');
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
        function cssPath(el: Element): string {
          const parts: string[] = [];
          let node: Element | null = el;
          while (node && node.nodeType === 1 && parts.length < 6) {
            let part = node.tagName.toLowerCase();
            if (node.id) {
              part += `#${node.id}`;
              parts.unshift(part);
              break;
            }
            const parent = node.parentElement;
            if (parent) {
              const siblings = Array.from(parent.children).filter(
                (s) => s.tagName === node!.tagName,
              );
              if (siblings.length > 1) {
                part += `:nth-of-type(${siblings.indexOf(node) + 1})`;
              }
            }
            parts.unshift(part);
            node = parent;
          }
          return parts.join(' > ');
        }
        const bad: {
          cssPath: string;
          name: string;
          id: string;
          ariaLabel: string;
          placeholder: string;
          type: string | null;
          outerHTML: string;
        }[] = [];
        const inputs = Array.from(document.querySelectorAll('input'));
        for (const el of inputs) {
          const type = el.getAttribute('type');
          const inputMode = el.getAttribute('inputmode');
          const meta = `${el.name} ${el.id} ${el.getAttribute('aria-label') ?? ''} ${el.placeholder ?? ''}`;
          const isNumeric =
            type === 'number' ||
            (type === 'text' &&
              /(amount|price|qty|quantity|value|rate|years?|months?|days?|btc|usd|sats|fee|percent|%)/i.test(
                meta,
              ));
          if (!isNumeric || inputMode) continue;
          bad.push({
            cssPath: cssPath(el),
            name: el.name,
            id: el.id,
            ariaLabel: el.getAttribute('aria-label') ?? '',
            placeholder: el.placeholder ?? '',
            type,
            outerHTML: el.outerHTML.slice(0, 240),
          });
        }
        return bad;
      });

      if (offenders.length > 0) {
        const banner = `\n✗ Missing inputMode — route: ${route} — ${offenders.length} input(s)`;
        // eslint-disable-next-line no-console
        console.error(banner);
        offenders.forEach((o, i) => {
          // eslint-disable-next-line no-console
          console.error(
            `  [${i + 1}] route=${route}\n      selector: ${o.cssPath}\n      type=${o.type} name="${o.name}" id="${o.id}" aria-label="${o.ariaLabel}" placeholder="${o.placeholder}"\n      html: ${o.outerHTML}`,
          );
        });
      }

      expect(
        offenders,
        `Missing inputMode on ${route} (${offenders.length}):\n` +
          offenders
            .map(
              (o, i) =>
                `  [${i + 1}] ${o.cssPath} — type=${o.type} name="${o.name}" id="${o.id}" aria-label="${o.ariaLabel}" placeholder="${o.placeholder}"`,
            )
            .join('\n'),
      ).toEqual([]);

      expect(errors, `runtime errors on ${route}:\n${errors.join('\n')}`).toEqual([]);
    });
  }
});
