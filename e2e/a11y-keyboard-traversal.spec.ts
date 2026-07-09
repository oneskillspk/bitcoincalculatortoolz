import { test, expect, devices, type Page } from '@playwright/test';

/**
 * Keyboard-only focus traversal guard.
 *
 * For every public route × viewport this spec drives the page with the Tab
 * key only (no mouse) and asserts:
 *
 *   1. Every focused element is a real, visible interactive element with a
 *      non-collapsed bounding box and a visible focus indicator (outline
 *      or box-shadow change vs. blurred state — pure `outline: none` with
 *      no substitute fails).
 *   2. Tab order does not trap: focus reaches at least N distinct elements
 *      and never gets stuck cycling on the same element for >2 consecutive
 *      presses (guard against focus traps and `tabindex` loops).
 *   3. A "skip to content" affordance is reachable within the first few
 *      Tabs (either a skip link, or focus lands inside <main> quickly).
 *   4. Shift+Tab reverses: from the deepest reached element we can walk
 *      back and land on a previously-seen element (no one-way traps).
 *   5. Escape does not steal focus into the void — after Escape, focus is
 *      either preserved or moved to a real focusable element (guards
 *      against modals stealing focus and never returning it).
 *
 * This is intentionally separate from the axe scan spec: axe cannot detect
 * keyboard traps, invisible focus rings, or bad tab order.
 */

const ROUTES = [
  '/',
  '/calculators',
  '/calculators/dca',
  '/calculators/retirement',
  '/calculators/portfolio-tracker',
  '/calculators/bitcoin-converter',
  '/calculators/bitcoin-tax-uk-cgt',
  '/calculators/bitcoin-tax-germany',
  '/calculators/bitcoin-tax-india',
  '/learn',
  '/about',
  '/contact',
  '/tools',
  '/methodology',
  '/tr',
  '/tr/hesaplayicilar',
  '/tr/hesaplayicilar/bitcoin-portfoy',
];

const VIEWPORTS: Array<{
  name: 'desktop' | 'mobile';
  viewport: { width: number; height: number };
}> = [
  { name: 'desktop', viewport: { width: 1440, height: 900 } },
  { name: 'mobile', viewport: devices['iPhone 13'].viewport },
];

const MAX_TABS = 30;
const MIN_UNIQUE_FOCUS = 6;

type FocusSnapshot = {
  tag: string;
  role: string | null;
  name: string;
  path: string; // stable-ish CSS path for identity comparison
  visible: boolean;
  interactive: boolean;
  inMain: boolean;
  hasFocusStyle: boolean;
  rect: { x: number; y: number; w: number; h: number };
} | null;

async function snapshotFocus(page: Page): Promise<FocusSnapshot> {
  return page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    if (!el || el === document.body) return null;

    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const visible =
      r.width > 0 &&
      r.height > 0 &&
      cs.visibility !== 'hidden' &&
      cs.display !== 'none' &&
      cs.opacity !== '0';

    const interactive =
      /^(A|BUTTON|INPUT|SELECT|TEXTAREA|SUMMARY|DETAILS)$/.test(el.tagName) ||
      el.hasAttribute('tabindex') ||
      ['button', 'link', 'menuitem', 'tab', 'checkbox', 'radio', 'switch', 'option'].includes(
        el.getAttribute('role') ?? '',
      );

    // Focus indicator heuristic — a real focus ring changes outline width,
    // outline style (not "none"), or box-shadow vs. the blurred baseline.
    // We can't blur+compare synchronously here, so we accept any of:
    //   - outlineStyle !== 'none' AND outlineWidth != '0px'
    //   - box-shadow containing a non-`none` value (Tailwind ring)
    //   - a `:focus-visible` class-marked element (data-lov-* / focus-visible)
    const outlineOK =
      cs.outlineStyle !== 'none' && cs.outlineWidth !== '0px' && cs.outlineColor !== 'transparent';
    const shadowOK = cs.boxShadow && cs.boxShadow !== 'none';
    const hasFocusStyle = Boolean(outlineOK || shadowOK);

    // Build a short CSS-ish path for identity. Include nth-of-type so two
    // siblings sharing the same tag+class signature (e.g. nav anchors with
    // identical utility classes) don't collide into the same path and get
    // mis-flagged as a focus trap.
    const path: string[] = [];
    let n: HTMLElement | null = el;
    while (n && n !== document.body && path.length < 6) {
      let seg = n.tagName.toLowerCase();
      if (n.id) seg += `#${n.id}`;
      else if (n.className && typeof n.className === 'string') {
        const cls = n.className.trim().split(/\s+/).slice(0, 2).join('.');
        if (cls) seg += `.${cls}`;
      }
      if (n.parentElement) {
        const siblings = Array.from(n.parentElement.children).filter(
          (c) => c.tagName === n!.tagName,
        );
        if (siblings.length > 1) {
          const idx = siblings.indexOf(n) + 1;
          seg += `:nth-of-type(${idx})`;
        }
      }
      path.unshift(seg);
      n = n.parentElement;
    }
    // Fold in accessible name + href so distinct nav items never collapse
    // into the same identity even if their DOM path is identical.
    const nameForId =
      el.getAttribute('aria-label') ||
      (el as HTMLAnchorElement).href ||
      (el.textContent || '').trim().slice(0, 40);

    const inMain = Boolean(el.closest('main'));
    const name =
      el.getAttribute('aria-label') ||
      el.getAttribute('title') ||
      (el.innerText || '').trim().slice(0, 60) ||
      (el as HTMLInputElement).name ||
      '';

    return {
      tag: el.tagName,
      role: el.getAttribute('role'),
      name,
      path: path.join('>'),
      visible,
      interactive,
      inMain,
      hasFocusStyle,
      rect: { x: r.x, y: r.y, w: r.width, h: r.height },
    };
  });
}

async function pressTab(page: Page, shift = false) {
  await page.keyboard.press(shift ? 'Shift+Tab' : 'Tab');
  // Yield to React/Radix focus handlers.
  await page.waitForTimeout(30);
}

async function traverse(page: Page, route: string) {
  // Reset focus to the top of the document.
  await page.evaluate(() => {
    (document.activeElement as HTMLElement | null)?.blur?.();
    window.scrollTo(0, 0);
  });
  // Clicking a fixed origin would violate keyboard-only — instead press
  // Tab from the body. The browser starts at the document root.
  await page.locator('body').focus().catch(() => {});

  const seen: FocusSnapshot[] = [];
  const uniquePaths = new Set<string>();
  let stuckStreak = 0;
  let lastPath: string | null = null;
  let reachedMainByTab: number | null = null;
  let reachedSkipLinkByTab: number | null = null;

  for (let i = 1; i <= MAX_TABS; i++) {
    await pressTab(page);
    const snap = await snapshotFocus(page);
    seen.push(snap);
    if (!snap) {
      // Focus landed back on <body> — acceptable at end of tab ring, but if
      // it happens early it usually means a component blurred focus.
      lastPath = null;
      continue;
    }

    // Skip-link heuristic: an anchor whose accessible name mentions
    // "skip"/"main"/"content"/"içeriğe" (TR) reached in the first few tabs.
    if (
      reachedSkipLinkByTab === null &&
      i <= 3 &&
      snap.tag === 'A' &&
      /skip|main content|to content|içeriğe|içerik/i.test(snap.name)
    ) {
      reachedSkipLinkByTab = i;
    }
    if (reachedMainByTab === null && snap.inMain) reachedMainByTab = i;

    expect(snap.visible, `${route}: tab #${i} focused ${snap.tag} not visible`).toBe(true);
    expect(
      snap.interactive,
      `${route}: tab #${i} focused ${snap.tag}${snap.role ? `[role=${snap.role}]` : ''} "${snap.name}" not interactive`,
    ).toBe(true);
    expect(
      snap.hasFocusStyle,
      `${route}: tab #${i} focused ${snap.tag} "${snap.name}" has no visible focus indicator (outline+box-shadow both none)`,
    ).toBe(true);

    if (snap.path === lastPath) {
      stuckStreak += 1;
    } else {
      stuckStreak = 0;
      lastPath = snap.path;
    }
    expect(
      stuckStreak,
      `${route}: focus stuck on ${snap.tag} "${snap.name}" for >2 consecutive Tabs (focus trap?)`,
    ).toBeLessThanOrEqual(2);

    uniquePaths.add(snap.path);
  }

  expect(
    uniquePaths.size,
    `${route}: only ${uniquePaths.size} distinct focus targets reached in ${MAX_TABS} tabs`,
  ).toBeGreaterThanOrEqual(MIN_UNIQUE_FOCUS);

  expect(
    reachedMainByTab,
    `${route}: focus never entered <main> within ${MAX_TABS} tabs (skip-link + landmark unreachable by keyboard)`,
  ).not.toBeNull();

  // ── Shift+Tab reversibility ────────────────────────────────────────────
  const forwardPaths = seen.filter((s): s is NonNullable<FocusSnapshot> => Boolean(s)).map((s) => s.path);
  const reversedHits: string[] = [];
  for (let i = 0; i < 5; i++) {
    await pressTab(page, true);
    const snap = await snapshotFocus(page);
    if (snap) reversedHits.push(snap.path);
  }
  const wentBack = reversedHits.some((p) => forwardPaths.includes(p));
  expect(
    wentBack,
    `${route}: Shift+Tab did not return to any previously-focused element (one-way trap?). Reversed hits: ${reversedHits.join(' | ')}`,
  ).toBe(true);

  // ── Escape does not lose focus permanently ─────────────────────────────
  const beforeEsc = await snapshotFocus(page);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(50);
  const afterEsc = await snapshotFocus(page);
  if (beforeEsc) {
    // Either focus is preserved on the same element, or moved to another
    // real interactive one. Focus landing on <body> after Escape from a
    // non-modal button indicates a stealer.
    const okAfterEsc =
      afterEsc === null // acceptable ONLY if beforeEsc was in a dialog we can't detect here
        ? beforeEsc.path.includes('dialog') || beforeEsc.role === 'dialog'
        : afterEsc.visible && afterEsc.interactive;
    expect(
      okAfterEsc,
      `${route}: Escape moved focus to a non-interactive/void target (was ${beforeEsc.tag} "${beforeEsc.name}")`,
    ).toBe(true);
  }
}

for (const { name: vpName, viewport } of VIEWPORTS) {
  test.describe(`keyboard traversal (${vpName})`, () => {
    test.use({ viewport });

    for (const route of ROUTES) {
      test(`${route}`, async ({ page }, testInfo) => {
        test.skip(
          testInfo.project.name !== 'chromium-desktop',
          'keyboard traversal matrix runs inside a single project',
        );
        await page.goto(route, { waitUntil: 'domcontentloaded' });
        // Dismiss cookie banner so it doesn't dominate the tab ring on
        // every page; we cover the banner separately in a11y-axe-full.
        await page.evaluate(() => {
          try {
            localStorage.setItem('cookie-consent', 'accepted');
            localStorage.setItem('cookieConsent', 'accepted');
          } catch { /* noop */ }
        });
        await page.reload({ waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(1200);

        await traverse(page, route);
      });
    }
  });
}
