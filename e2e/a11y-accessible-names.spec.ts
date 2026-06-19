import { test, expect } from '@playwright/test';

/**
 * Accessible-name guard.
 *
 * Crawls a small set of representative routes (EN + TR) and asserts that
 * every rendered <a> and <button> exposes a non-empty accessible name.
 * The check mirrors what axe-core / Lighthouse evaluate for the
 * `link-name` and `button-name` rules:
 *
 *   accessible name =
 *     aria-labelledby (resolved) ||
 *     aria-label ||
 *     visible text content ||
 *     title ||
 *     (for buttons) value ||
 *     (for links/buttons containing an <img>) img alt
 *
 * Elements that are hidden (display:none, visibility:hidden, aria-hidden,
 * inert, hidden attribute, or zero-size + no children) are skipped — they
 * are not in the accessibility tree.
 *
 * Fails the build with a list of offending selectors + outerHTML snippets.
 */

const ROUTES = [
  '/',
  '/calculators',
  '/tools',
  '/learn',
  '/about',
  '/contact',
  '/tr/',
  '/tr/hesaplayicilar',
  '/tr/araclar',
  '/tr/ogrenin',
];

type Offender = { route: string; tag: string; selector: string; html: string };

async function findOffenders(page: import('@playwright/test').Page, route: string): Promise<Offender[]> {
  return await page.evaluate((route) => {
    const isHidden = (el: Element): boolean => {
      let cur: Element | null = el;
      while (cur) {
        if (cur instanceof HTMLElement) {
          if (cur.hidden) return true;
          if (cur.hasAttribute('inert')) return true;
          const aHidden = cur.getAttribute('aria-hidden');
          if (aHidden === 'true') return true;
          const cs = getComputedStyle(cur);
          if (cs.display === 'none' || cs.visibility === 'hidden') return true;
        }
        cur = cur.parentElement;
      }
      return false;
    };

    const accName = (el: Element): string => {
      const labelledby = el.getAttribute('aria-labelledby');
      if (labelledby) {
        const txt = labelledby
          .split(/\s+/)
          .map((id) => document.getElementById(id)?.textContent?.trim() ?? '')
          .join(' ')
          .trim();
        if (txt) return txt;
      }
      const aria = el.getAttribute('aria-label');
      if (aria && aria.trim()) return aria.trim();

      // Visible text (exclude aria-hidden descendants).
      const clone = el.cloneNode(true) as HTMLElement;
      clone.querySelectorAll('[aria-hidden="true"]').forEach((n) => n.remove());
      const text = clone.textContent?.replace(/\s+/g, ' ').trim() ?? '';
      if (text) return text;

      const title = el.getAttribute('title');
      if (title && title.trim()) return title.trim();

      if (el instanceof HTMLButtonElement || el instanceof HTMLInputElement) {
        const v = (el as HTMLInputElement).value;
        if (v && v.trim()) return v.trim();
      }

      const img = el.querySelector('img[alt]') as HTMLImageElement | null;
      if (img && img.alt.trim()) return img.alt.trim();

      const svgTitle = el.querySelector('svg > title');
      if (svgTitle?.textContent?.trim()) return svgTitle.textContent.trim();

      return '';
    };

    const selectorFor = (el: Element): string => {
      const parts: string[] = [];
      let cur: Element | null = el;
      let depth = 0;
      while (cur && depth < 4) {
        let s = cur.tagName.toLowerCase();
        if (cur.id) {
          s += `#${cur.id}`;
          parts.unshift(s);
          break;
        }
        const cls = (cur.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean).slice(0, 2);
        if (cls.length) s += '.' + cls.join('.');
        parts.unshift(s);
        cur = cur.parentElement;
        depth++;
      }
      return parts.join(' > ');
    };

    const offenders: Offender[] = [];
    const nodes = Array.from(document.querySelectorAll('a, button'));
    for (const el of nodes) {
      // Anchors must have an href to be in the a11y tree as a link.
      if (el.tagName === 'A' && !el.hasAttribute('href')) continue;
      if (isHidden(el)) continue;
      if (accName(el)) continue;
      offenders.push({
        route,
        tag: el.tagName.toLowerCase(),
        selector: selectorFor(el),
        html: (el as HTMLElement).outerHTML.slice(0, 240),
      });
    }
    return offenders;
  }, route);
}

test.describe('Accessible names — anchors & buttons', () => {
  for (const route of ROUTES) {
    test(`every <a>/<button> has an accessible name on ${route}`, async ({ page }) => {
      await page.goto(route, { waitUntil: 'networkidle' });
      // Let lazy hydration settle.
      await page.waitForTimeout(500);
      const offenders = await findOffenders(page, route);
      if (offenders.length) {
        const report = offenders
          .map((o) => `  • <${o.tag}> @ ${o.selector}\n    ${o.html}`)
          .join('\n');
        throw new Error(
          `Found ${offenders.length} element(s) missing an accessible name on ${route}:\n${report}`,
        );
      }
      expect(offenders).toEqual([]);
    });
  }
});
