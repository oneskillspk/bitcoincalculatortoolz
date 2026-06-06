/**
 * Canonical URL parity — every EN page must emit
 * `<link rel="canonical">` = absolute EN URL, and every TR mirror must
 * emit the absolute TR URL. Catches the most common SEO bug where a
 * page hardcodes its EN canonical and forgets to swap on TR.
 *
 * og:url is asserted in lockstep with canonical (Google requires both to
 * agree for the alternate to be honored).
 */
import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, waitFor, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import LanguageRouteSync from '@/components/LanguageRouteSync';
import { GlobalHreflang } from '@/components/GlobalHreflang';
import { LocaleMeta } from '@/components/LocaleMeta';
import { ALL_LOCALIZED_ROUTES } from './allLocalizedRoutes';

const BASE = 'https://bitcoincalculator.tools';

vi.mock('@/hooks/useLiveBitcoinPrice', () => ({
  useLiveBitcoinPrice: () => ({
    price: 50000, priceChange24h: 100, priceChangePercentage24h: 1.5,
    lastUpdated: new Date().toISOString(), isLoading: false, error: null,
    trend: 'neutral' as const, refetch: () => Promise.resolve(), price7dAgo: 48000,
  }),
}));
vi.mock('@/services/bitcoinApi', async () => {
  const actual = await vi.importActual<typeof import('@/services/bitcoinApi')>('@/services/bitcoinApi');
  return {
    ...actual,
    bitcoinApi: {
      ...actual.bitcoinApi,
      getCurrentPrice: vi.fn(async () => 50000),
      getCurrentMarketData: vi.fn(async () => ({
        price: 50000, priceChange24h: 100, priceChangePercentage24h: 1.5,
        lastUpdated: new Date().toISOString(), marketCap: 1e12, volume24h: 5e10,
      })),
      getHistoricalPrice: vi.fn(async () => 48000),
      getHistoricalPrices: vi.fn(async () => []),
      calculateInvestment: vi.fn(async () => null),
    },
  };
});

function stubPath(path: string) {
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: { ...window.location, pathname: path, href: `${BASE}${path}` },
  });
}

const renderAt = (path: string, lang: 'en' | 'tr', Page: React.ComponentType) => {
  window.localStorage.setItem('btc-calc-language', lang);
  stubPath(path);
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  return render(
    <HelmetProvider>
      <QueryClientProvider client={qc}>
        <MemoryRouter initialEntries={[path]}>
          <LanguageProvider>
            <TooltipProvider delayDuration={0}>
              <LanguageRouteSync />
              <LocaleMeta />
              <GlobalHreflang />
              <Routes>
                <Route path={path} element={<Page />} />
              </Routes>
            </TooltipProvider>
          </LanguageProvider>
        </MemoryRouter>
      </QueryClientProvider>
    </HelmetProvider>,
  );
};

const resetHead = () => {
  document.head
    .querySelectorAll('link[rel="canonical"], link[rel="alternate"], meta[property^="og:"], meta[name^="twitter:"], meta[name="description"], title')
    .forEach((n) => n.remove());
  document.documentElement.removeAttribute('lang');
};

beforeEach(resetHead);

describe('Canonical URL parity — EN and TR pages render correct absolute canonical', () => {
  it.each(ALL_LOCALIZED_ROUTES)(
    'EN $enPath → canonical=$enPath',
    async ({ enPath, enPage }) => {
      const { unmount } = renderAt(enPath, 'en', enPage);
      await waitFor(
        () => expect(document.querySelector('link[rel="canonical"]')).not.toBeNull(),
        { timeout: 8000 },
      );
      const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
      const ogUrl = document.querySelector('meta[property="og:url"]')?.getAttribute('content');
      expect(canonical, `EN ${enPath} canonical`).toBe(`${BASE}${enPath}`);
      expect(ogUrl, `EN ${enPath} og:url`).toBe(`${BASE}${enPath}`);
      // Canonical must never accidentally point at /tr
      expect(canonical).not.toMatch(/\/tr(\/|$)/);
      unmount();
      cleanup();
    },
    15_000,
  );

  it.each(ALL_LOCALIZED_ROUTES)(
    'TR $trPath → canonical=$trPath',
    async ({ trPath, trPage }) => {
      const { unmount } = renderAt(trPath, 'tr', trPage);
      await waitFor(
        () => expect(document.querySelector('link[rel="canonical"]')).not.toBeNull(),
        { timeout: 8000 },
      );
      const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
      const ogUrl = document.querySelector('meta[property="og:url"]')?.getAttribute('content');
      expect(canonical, `TR ${trPath} canonical`).toBe(`${BASE}${trPath}`);
      expect(ogUrl, `TR ${trPath} og:url`).toBe(`${BASE}${trPath}`);
      // TR canonical must include /tr — guards against EN canonical leaking
      expect(canonical).toMatch(/\/tr(\/|$)/);
      unmount();
      cleanup();
    },
    15_000,
  );
});
