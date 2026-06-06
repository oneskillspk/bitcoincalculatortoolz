/**
 * TR articles SEO walker — for every TR article registered in `articlesMeta`,
 * render <LearnArticle /> at its /tr/ogrenin/<slug> route and assert:
 *
 *   1. <link rel="canonical"> points at the TR URL.
 *   2. <link rel="alternate" hreflang="tr"> matches the canonical TR URL.
 *   3. <link rel="alternate" hreflang="en"> points at the EN counterpart.
 *   4. <link rel="alternate" hreflang="x-default"> points at the EN URL.
 *   5. Every JSON-LD block carries `inLanguage: "tr"`.
 *
 * This is the governance counterpart of `tr-article-e2e.test.tsx`, which only
 * exercises a single slug in depth.
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, waitFor, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { articlesMeta } from '@/data/articles';
import { TR_TO_EN } from '@/utils/localizedRoutes';

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

const ORIGIN = 'https://bitcoincalculator.tools';

const renderTR = (slug: string) => {
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
            <MemoryRouter initialEntries={[`/tr/ogrenin/${slug}`]}>
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
  await new Promise((r) => setTimeout(r, 50));
};

const trArticles = articlesMeta.filter((a) => a.language === 'tr');

describe('TR articles SEO walker', () => {
  it('finds at least one TR article to walk', () => {
    expect(trArticles.length).toBeGreaterThan(0);
  });

  describe.each(trArticles.map((a) => [a.slug, a.title] as const))(
    'TR article %s',
    (slug) => {
      it('emits correct canonical, hreflang, and inLanguage', async () => {
        const trUrl = `${ORIGIN}/tr/ogrenin/${slug}`;
        const enPath = TR_TO_EN[`/tr/ogrenin/${slug}`];
        expect(enPath, `EN counterpart missing in TR_TO_EN for ${slug}`).toBeTruthy();
        const enUrl = `${ORIGIN}${enPath}`;

        renderTR(slug);
        await waitForArticleLoaded();

        await waitFor(() => {
          const canon = document
            .querySelector('link[rel="canonical"]')
            ?.getAttribute('href');
          expect(canon, `canonical missing on ${slug}`).toBe(trUrl);
        });

        // Hreflang alternates — collect by hrefLang attribute.
        const alts = Array.from(
          document.querySelectorAll('link[rel="alternate"][hreflang]'),
        ) as HTMLLinkElement[];
        const byLang: Record<string, string> = {};
        for (const a of alts) {
          const lang = a.getAttribute('hreflang') ?? '';
          const href = a.getAttribute('href') ?? '';
          byLang[lang] = href;
        }
        expect(byLang['tr'], `hreflang=tr missing on ${slug}`).toBe(trUrl);
        expect(byLang['en'], `hreflang=en missing on ${slug}`).toBe(enUrl);
        expect(
          byLang['x-default'],
          `hreflang=x-default missing on ${slug}`,
        ).toBe(enUrl);

        // JSON-LD blocks — every one must carry inLanguage:"tr".
        const blocks = Array.from(
          document.querySelectorAll('script[type="application/ld+json"]'),
        )
          .map((s) => {
            try {
              return JSON.parse(s.textContent ?? '') as Record<string, unknown>;
            } catch {
              return null;
            }
          })
          .filter((v): v is Record<string, unknown> => v !== null);

        expect(blocks.length, `no JSON-LD on ${slug}`).toBeGreaterThan(0);
        for (const b of blocks) {
          expect(
            b.inLanguage,
            `JSON-LD ${String(b['@type'])} on ${slug} missing inLanguage:"tr"`,
          ).toBe('tr');
        }
      });
    },
  );
});
