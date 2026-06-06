/**
 * TR article — no duplicate related blocks.
 *
 * After dedup, the article page must show "İlgili Hesaplayıcılar" and
 * "İlgili Makaleler" exactly ONCE — rendered by RelatedLinksSection
 * (in-flow), not the sidebar.
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
    price: 50000, priceChange24h: 0, priceChangePercentage24h: 0,
    lastUpdated: new Date().toISOString(), isLoading: false, error: null,
    trend: 'neutral' as const, refetch: () => Promise.resolve(), price7dAgo: 48000,
  }),
}));

const originalFetch = globalThis.fetch;
beforeEach(() => {
  globalThis.fetch = vi.fn(async () => new Response('{}', { status: 200 })) as unknown as typeof fetch;
});
afterEach(() => { globalThis.fetch = originalFetch; cleanup(); });

import LearnArticle from '@/pages/LearnArticle';

describe('TR article — no duplicate related blocks', () => {
  it('renders İlgili Hesaplayıcılar and İlgili Makaleler exactly once each', async () => {
    try { window.localStorage.setItem('btc-calc-language', 'tr'); } catch { /* noop */ }
    const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
    render(
      <HelmetProvider>
        <QueryClientProvider client={client}>
          <LanguageProvider>
            <TooltipProvider delayDuration={0}>
              <MemoryRouter initialEntries={['/tr/ogrenin/bitcoin-dca-nedir']}>
                <Routes>
                  <Route path="/tr/ogrenin/:slug" element={<LearnArticle />} />
                </Routes>
              </MemoryRouter>
            </TooltipProvider>
          </LanguageProvider>
        </QueryClientProvider>
      </HelmetProvider>,
    );

    await waitFor(() => {
      const h1 = document.querySelector('h1');
      expect(h1?.textContent?.length ?? 0).toBeGreaterThan(0);
    }, { timeout: 5000 });

    const headings = Array.from(document.querySelectorAll('h1, h2, h3')) as HTMLElement[];
    const calcCount = headings.filter(h => h.textContent?.includes('İlgili Hesaplayıcılar')).length;
    const artCount = headings.filter(h => h.textContent?.includes('İlgili Makaleler')).length;

    expect(calcCount, 'expected exactly one İlgili Hesaplayıcılar heading').toBe(1);
    expect(artCount, 'expected exactly one İlgili Makaleler heading').toBe(1);
  });
});
