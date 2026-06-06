/**
 * Phase H — End-to-end TR article render.
 *
 * Mounts <LearnArticle /> at `/tr/ogrenin/bitcoin-dca-nedir` and asserts in
 * a single render:
 *   1. Sidebar headings are Turkish (İçindekiler / İlgili Hesaplayıcılar /
 *      İlgili Makaleler).
 *   2. Calculator display names come from getCalculatorName(_, 'tr').
 *   3. Every internal anchor on the page uses TR prefixes
 *      (/tr/hesaplayicilar/, /tr/ogrenin/, /tr/hakkimizda, etc.) — never
 *      /learn/ or /calculators/.
 *   4. Published/updated dates are rendered with Turkish month names
 *      (tr-TR Intl formatting).
 *   5. <link rel="canonical"> points at the /tr/ogrenin/ URL and every
 *      JSON-LD block carries inLanguage:"tr".
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, waitFor, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { getArticleBySlug } from '@/data/articles';
import { getCalculatorName } from '@/data/calculatorMeta';

vi.mock('@/hooks/useLiveBitcoinPrice', () => ({
  useLiveBitcoinPrice: () => ({
    price: 50000,
    priceChange24h: 100,
    priceChangePercentage24h: 1.5,
    lastUpdated: new Date('2025-01-01T00:00:00Z').toISOString(),
    isLoading: false,
    error: null,
    trend: 'neutral' as const,
    refetch: () => Promise.resolve(),
    price7dAgo: 48000,
  }),
}));

const originalFetch = globalThis.fetch;
beforeEach(() => {
  globalThis.fetch = vi.fn(
    async () =>
      new Response(JSON.stringify({}), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
  ) as unknown as typeof fetch;
});
afterEach(() => {
  globalThis.fetch = originalFetch;
  cleanup();
});

import LearnArticle from '@/pages/LearnArticle';

const TR_SLUG = 'bitcoin-dca-nedir';
const TR_PATH = `/tr/ogrenin/${TR_SLUG}`;
const TR_URL = `https://bitcoincalculator.tools${TR_PATH}`;

const renderTR = () => {
  try {
    window.localStorage.setItem('btc-calc-language', 'tr');
  } catch {
    /* noop */
  }
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0, staleTime: Infinity } },
  });
  return render(
    <HelmetProvider>
      <QueryClientProvider client={client}>
        <LanguageProvider>
          <TooltipProvider delayDuration={0}>
            <MemoryRouter initialEntries={[TR_PATH]}>
              <Routes>
                <Route path="/tr/ogrenin/:slug" element={<LearnArticle />} />
              </Routes>
            </MemoryRouter>
          </TooltipProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </HelmetProvider>,
  );
};

const waitForArticleLoaded = async () => {
  await waitFor(
    () => {
      const h1 = document.querySelector('h1');
      expect(h1?.textContent?.length ?? 0).toBeGreaterThan(0);
      expect(
        document.querySelectorAll('script[type="application/ld+json"]').length,
      ).toBeGreaterThan(0);
    },
    { timeout: 5000 },
  );
  // Allow Helmet flush.
  await new Promise((r) => setTimeout(r, 50));
};

const readJsonLd = () =>
  Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
    .map((s) => {
      try {
        return JSON.parse(s.textContent ?? '');
      } catch {
        return null;
      }
    })
    .filter((v): v is Record<string, unknown> => v !== null);

describe('TR article E2E — /tr/ogrenin/bitcoin-dca-nedir', () => {
  it('renders Turkish sidebar headings + TR calculator names', async () => {
    renderTR();
    await waitForArticleLoaded();

    // Desktop sidebar is hidden under lg in CSS but still in the DOM (jsdom
    // ignores media queries). Headings should appear.
    expect(document.body.textContent).toContain('İçindekiler');
    expect(document.body.textContent).toContain('İlgili Hesaplayıcılar');
    expect(document.body.textContent).toContain('İlgili Makaleler');

    // The article wires relatedCalculators — assert at least one TR name renders.
    const article = await getArticleBySlug(TR_SLUG);
    expect(article).toBeTruthy();
    const firstCalc = article!.relatedCalculators[0];
    if (firstCalc) {
      const trName = getCalculatorName(firstCalc, 'tr');
      expect(document.body.textContent).toContain(trName);
    }
  });

  it('uses TR-prefixed internal anchors in sidebar + breadcrumb (presentational surfaces)', async () => {
    renderTR();
    await waitForArticleLoaded();

    // Scope: structural navigation surfaces that are 100 % generated from
    // localized route maps — the desktop <aside> sidebar and the breadcrumb
    // <nav>. Body anchors authored inside article markdown are audited by
    // a separate walker (tr-internal-links.test.tsx).
    const sidebar = document.querySelector('aside');
    expect(sidebar, 'expected <aside> sidebar rendered on TR article').toBeTruthy();
    const breadcrumb = document.querySelector('nav[aria-label]');
    expect(breadcrumb, 'expected breadcrumb <nav>').toBeTruthy();

    const surfaces = [sidebar!, breadcrumb!];
    let checked = 0;
    for (const root of surfaces) {
      const anchors = Array.from(
        root.querySelectorAll('a[href]'),
      ) as HTMLAnchorElement[];
      for (const a of anchors) {
        const href = a.getAttribute('href') ?? '';
        if (!href.startsWith('/')) continue;
        if (href === '/' || href.startsWith('#')) continue;
        checked++;
        expect(
          href.startsWith('/learn/'),
          `EN learn prefix leaked into TR sidebar/breadcrumb: ${href}`,
        ).toBe(false);
        expect(
          href.startsWith('/calculators/'),
          `EN calculators prefix leaked into TR sidebar/breadcrumb: ${href}`,
        ).toBe(false);
        expect(
          href === '/about' || href.startsWith('/about/'),
          `EN /about leaked into TR sidebar/breadcrumb: ${href}`,
        ).toBe(false);
      }
    }
    expect(checked, 'expected at least one internal anchor on sidebar/breadcrumb').toBeGreaterThan(0);
  });

  it('formats dates with Turkish month names (tr-TR Intl)', async () => {
    renderTR();
    await waitForArticleLoaded();

    // tr-TR month names — at least one must appear in the rendered header.
    const trMonths = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
    ];
    const body = document.body.textContent ?? '';
    expect(
      trMonths.some((m) => body.includes(m)),
      `expected a Turkish month name in the article header — body sample: "${body.slice(0, 400)}"`,
    ).toBe(true);

    // No English month names from the article date block should leak.
    const enMonths = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    const headerEl = document.querySelector('header');
    const headerText = headerEl?.textContent ?? '';
    for (const m of enMonths) {
      expect(
        headerText.includes(m),
        `English month "${m}" leaked into TR article header: ${headerText}`,
      ).toBe(false);
    }
  });

  it('emits TR canonical + every JSON-LD block has inLanguage:"tr"', async () => {
    renderTR();
    await waitForArticleLoaded();

    await waitFor(() => {
      expect(
        document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
      ).toBe(TR_URL);
    });

    const blocks = readJsonLd();
    expect(blocks.length).toBeGreaterThan(0);
    for (const b of blocks) {
      expect(
        b.inLanguage,
        `JSON-LD block ${String(b['@type'])} missing inLanguage:"tr"`,
      ).toBe('tr');
    }
  });
});

// ---------------------------------------------------------------------------
// Click-through coverage: every internal "related" link on the rendered TR
// article must navigate to a /tr/... URL. We mount LearnArticle plus a
// catch-all sink route that records the resolved location, then fire a click
// on each <Link> inside the related-tools and related-articles sidebar
// sections and assert the path begins with `/tr/`.
// ---------------------------------------------------------------------------
import { fireEvent } from '@testing-library/react';
import { useLocation } from 'react-router-dom';

const LocationProbe = () => {
  const loc = useLocation();
  return <div data-testid="probe-path">{loc.pathname}</div>;
};

const renderTRWithProbe = () => {
  try {
    window.localStorage.setItem('btc-calc-language', 'tr');
  } catch {
    /* noop */
  }
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0, staleTime: Infinity } },
  });
  return render(
    <HelmetProvider>
      <QueryClientProvider client={client}>
        <LanguageProvider>
          <TooltipProvider delayDuration={0}>
            <MemoryRouter initialEntries={[TR_PATH]}>
              {/* Probe lives outside <Routes> so it always renders the
                  current pathname regardless of which page matched. */}
              <LocationProbe />
              <Routes>
                <Route path="/tr/ogrenin/:slug" element={<LearnArticle />} />
                <Route path="*" element={<div data-testid="catchall" />} />
              </Routes>
            </MemoryRouter>
          </TooltipProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </HelmetProvider>,
  );
};

describe('TR article E2E — related-link click-through', () => {
  it('every related-tool and related-article link navigates to a /tr/ URL', async () => {
    renderTRWithProbe();
    await waitForArticleLoaded();

    const sidebar = document.querySelector('aside');
    expect(sidebar, 'expected sidebar rendered').toBeTruthy();

    // Collect related-tool and related-article anchors — these are the two
    // sidebar surfaces driven by relatedCalculators / relatedArticles. Skip
    // hash anchors (TOC), external links, and the ad/recommended-tools slots
    // which render under different parents.
    // Collect every related-tool / related-article anchor across BOTH
    // surfaces that wire related links on the article page:
    //   • <aside> sidebar (desktop, ArticleSidebar) — uses <h3> headings
    //   • in-flow <section> (RelatedLinksSection, all breakpoints) — <h2>
    // Walk every heading on the page, match by Turkish related-content
    // labels, then collect anchors within the heading's parent container.
    const allHeadings = Array.from(
      document.querySelectorAll('h2, h3'),
    ) as HTMLElement[];
    const candidateAnchors: HTMLAnchorElement[] = [];
    for (const h of allHeadings) {
      const text = h.textContent ?? '';
      if (
        !text.includes('İlgili Hesaplayıcılar') &&
        !text.includes('İlgili Makaleler')
      ) {
        continue;
      }
      // Walk up to the nearest card-like container so we capture sibling
      // anchors but not the entire page.
      let container: HTMLElement | null = h.parentElement;
      // Climb one extra level if the immediate parent is just a flex-row
      // wrapper around the icon + heading.
      if (
        container &&
        container.parentElement &&
        container.querySelectorAll('a[href]').length === 0
      ) {
        container = container.parentElement;
      }
      if (!container) continue;
      for (const a of Array.from(
        container.querySelectorAll('a[href]'),
      ) as HTMLAnchorElement[]) {
        const href = a.getAttribute('href') ?? '';
        if (href.startsWith('#')) continue;
        if (!href.startsWith('/')) continue;
        candidateAnchors.push(a);
      }
    }

    expect(
      candidateAnchors.length,
      `expected at least one related link in TR article; headings seen: ${allHeadings
        .map((h) => h.textContent)
        .join(' | ')}`,
    ).toBeGreaterThan(0);

    // Snapshot hrefs first so navigation away from the article doesn't
    // invalidate our enumeration.
    const hrefs = candidateAnchors.map((a) => a.getAttribute('href')!);

    for (const href of hrefs) {
      // Static href check — must already be /tr/-prefixed.
      expect(
        href.startsWith('/tr/'),
        `Related link "${href}" does not start with /tr/ — likely an EN-prefix leak`,
      ).toBe(true);
    }

    // Now actually click each link and verify the router resolves a /tr/ path.
    // Use a fresh render per click so the previous navigation doesn't pollute
    // the next iteration's DOM tree.
    cleanup();
    for (const href of hrefs) {
      renderTRWithProbe();
      await waitForArticleLoaded();
      const link = Array.from(
        document.querySelectorAll('a[href]'),
      ).find((a) => a.getAttribute('href') === href) as
        | HTMLAnchorElement
        | undefined;
      expect(
        link,
        `link with href ${href} not found after re-render`,
      ).toBeTruthy();
      fireEvent.click(link!, { button: 0 });
      await waitFor(() => {
        const p = document.querySelector('[data-testid="probe-path"]');
        expect(p, `probe not mounted after clicking ${href}`).toBeTruthy();
        expect(
          p!.textContent,
          `Click on ${href} did not navigate`,
        ).not.toBe(TR_PATH);
        expect(
          p!.textContent?.startsWith('/tr/'),
          `Click on ${href} resolved to non-TR path: ${p!.textContent}`,
        ).toBe(true);
      });
      cleanup();
    }
  });
});
