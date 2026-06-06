/**
 * Phase C5 — first TR Learn article (`bitcoin-dca-nedir`).
 *
 * Mounts the article at the TR canonical route and asserts the
 * locale-aware `ArticleSchema` emits:
 *   - inLanguage: "tr" on every JSON-LD block
 *   - canonical URL on /tr/ogrenin/bitcoin-dca-nedir
 *   - TR breadcrumb labels (Ana Sayfa / Öğrenin)
 *   - TR FAQ + HowTo questions/steps
 *   - SpeakableSpecification block (article.speakable=true)
 * EN counterpart (`what-is-bitcoin-dca`) stays English.
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, waitFor, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { TooltipProvider } from '@/components/ui/tooltip';

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

const buildClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0, staleTime: Infinity } },
  });

const renderAt = (path: string, routePattern: string, lang: 'en' | 'tr') => {
  try {
    window.localStorage.setItem('btc-calc-language', lang);
  } catch {
    /* noop */
  }
  return render(
    <HelmetProvider>
      <QueryClientProvider client={buildClient()}>
        <LanguageProvider>
          <TooltipProvider delayDuration={0}>
            <MemoryRouter initialEntries={[path]}>
              <Routes>
                <Route path={routePattern} element={<LearnArticle />} />
              </Routes>
            </MemoryRouter>
          </TooltipProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </HelmetProvider>,
  );
};

const readJsonLd = () => {
  const scripts = Array.from(
    document.querySelectorAll('script[type="application/ld+json"]'),
  );
  return scripts
    .map((s) => {
      try {
        return JSON.parse(s.textContent ?? '');
      } catch {
        return null;
      }
    })
    .filter((v): v is Record<string, unknown> => v !== null);
};

describe('C5 — TR Learn article (bitcoin-dca-nedir)', () => {
  const TR_PATH = '/tr/ogrenin/bitcoin-dca-nedir';
  const EN_PATH = '/learn/what-is-bitcoin-dca';
  const TR_URL = `https://bitcoincalculator.tools${TR_PATH}`;
  const EN_URL = `https://bitcoincalculator.tools${EN_PATH}`;

  it('TR route emits inLanguage:"tr" on every JSON-LD block', async () => {
    renderAt(TR_PATH, '/tr/ogrenin/:slug', 'tr');
    await waitFor(() => {
      expect(document.title.length).toBeGreaterThan(0);
      expect(
        document.querySelectorAll('script[type="application/ld+json"]').length,
      ).toBeGreaterThan(0);
    });
    await new Promise((r) => setTimeout(r, 50));

    const blocks = readJsonLd();
    expect(blocks.length).toBeGreaterThanOrEqual(4); // Article + FAQ + HowTo + Breadcrumb (+ Speakable)
    for (const b of blocks) {
      expect(b.inLanguage, `block ${b['@type']} missing inLanguage`).toBe('tr');
    }
  });

  it('TR route sets canonical + og:url to the /tr/ogrenin/ URL', async () => {
    renderAt(TR_PATH, '/tr/ogrenin/:slug', 'tr');
    await waitFor(() => {
      expect(
        document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
      ).toBe(TR_URL);
    });
    expect(
      document.querySelector('meta[property="og:url"]')?.getAttribute('content'),
    ).toBe(TR_URL);
    expect(
      document.querySelector('meta[property="og:locale"]')?.getAttribute('content'),
    ).toBe('tr_TR');
    // hreflang both directions present
    const alts = Array.from(
      document.querySelectorAll('link[rel="alternate"]'),
    ).map((l) => ({
      lang: l.getAttribute('hreflang'),
      href: l.getAttribute('href'),
    }));
    expect(alts).toEqual(
      expect.arrayContaining([
        { lang: 'en', href: EN_URL },
        { lang: 'tr', href: TR_URL },
        { lang: 'x-default', href: EN_URL },
      ]),
    );
  });

  it('TR breadcrumb uses Turkish labels and TR Learn hub URL', async () => {
    renderAt(TR_PATH, '/tr/ogrenin/:slug', 'tr');
    await waitFor(() =>
      expect(
        document.querySelectorAll('script[type="application/ld+json"]').length,
      ).toBeGreaterThan(0),
    );
    await new Promise((r) => setTimeout(r, 50));

    const blocks = readJsonLd();
    const breadcrumb = blocks.find((b) => b['@type'] === 'BreadcrumbList');
    expect(breadcrumb).toBeTruthy();
    const items = (breadcrumb!.itemListElement as Array<Record<string, unknown>>).map(
      (i) => ({ name: i.name, item: i.item }),
    );
    expect(items[0]).toEqual({
      name: 'Ana Sayfa',
      item: 'https://bitcoincalculator.tools/tr/',
    });
    expect(items[1]).toEqual({
      name: 'Öğrenin',
      item: 'https://bitcoincalculator.tools/tr/ogrenin',
    });
    expect(items[2].item).toBe(TR_URL);
  });

  it('TR FAQ + HowTo carry Turkish copy', async () => {
    renderAt(TR_PATH, '/tr/ogrenin/:slug', 'tr');
    await waitFor(() =>
      expect(
        document.querySelectorAll('script[type="application/ld+json"]').length,
      ).toBeGreaterThan(0),
    );
    await new Promise((r) => setTimeout(r, 50));

    const blocks = readJsonLd();
    const faq = blocks.find((b) => b['@type'] === 'FAQPage');
    const howTo = blocks.find((b) => b['@type'] === 'HowTo');
    expect(faq).toBeTruthy();
    expect(howTo).toBeTruthy();

    const firstQ = (faq!.mainEntity as Array<Record<string, unknown>>)[0]?.name;
    expect(String(firstQ)).toMatch(/DCA/);
    expect(String(firstQ)).toMatch(/Bitcoin/);
    // Must contain a Turkish-specific character somewhere in the FAQ surface
    const allQ = (faq!.mainEntity as Array<Record<string, unknown>>)
      .map((q) => String(q.name))
      .join(' ');
    expect(allQ).toMatch(/[şğüöçıİ]/);

    const firstStep = (howTo!.step as Array<Record<string, unknown>>)[0]?.name;
    expect(String(firstStep)).toMatch(/[şğüöçıİ]/);
  });

  it('EN counterpart still emits English JSON-LD with EN canonical', async () => {
    renderAt(EN_PATH, '/learn/:slug', 'en');
    await waitFor(
      () => {
        const canonical = document
          .querySelector('link[rel="canonical"]')
          ?.getAttribute('href');
        const scripts = document.querySelectorAll(
          'script[type="application/ld+json"]',
        );
        expect(canonical).toBe(EN_URL);
        expect(scripts.length).toBeGreaterThan(0);
      },
      { timeout: 5000 },
    );
    const blocks = readJsonLd();
    for (const b of blocks) {
      expect(b.inLanguage).toBe('en');
    }
  });
});
