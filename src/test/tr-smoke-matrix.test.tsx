/**
 * Phase 9.1 — TR smoke matrix.
 *
 * Mounts the 10 representative /tr routes directly (not via lazy App routing
 * to keep test deterministic) and asserts that each renders with:
 *   - document.documentElement.lang === 'tr'
 *   - <title> contains the expected Turkish keyword
 *   - At least one non-empty <h1>
 *   - Hreflang trio (en / tr / x-default) emitted
 *   - No raw "Loading..." or "Error" leak in body text
 */
import React from 'react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, waitFor, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { GlobalHreflang } from '@/components/GlobalHreflang';
import { LocaleMeta } from '@/components/LocaleMeta';
import { TooltipProvider } from '@/components/ui/tooltip';

// Deterministic, network-free price + market data for any calculator that
// transitively imports the live price hook or the api singleton.
vi.mock('@/hooks/useLiveBitcoinPrice', () => ({
  useLiveBitcoinPrice: () => ({
    price: 50000,
    priceChange24h: 100,
    priceChangePercentage24h: 1.5,
    lastUpdated: new Date().toISOString(),
    isLoading: false,
    error: null,
    trend: 'neutral' as const,
    refetch: () => Promise.resolve(),
    price7dAgo: 48000,
  }),
}));

vi.mock('@/services/bitcoinApi', async () => {
  const actual = await vi.importActual<typeof import('@/services/bitcoinApi')>(
    '@/services/bitcoinApi'
  );
  const stub = {
    getCurrentPrice: vi.fn(async () => 50000),
    getCurrentMarketData: vi.fn(async () => ({
      price: 50000,
      priceChange24h: 100,
      priceChangePercentage24h: 1.5,
      lastUpdated: new Date().toISOString(),
      marketCap: 1e12,
      volume24h: 5e10,
    })),
    getHistoricalPrice: vi.fn(async () => 48000),
    getHistoricalPrices: vi.fn(async () => []),
    calculateInvestment: vi.fn(async () => null),
  };
  return {
    ...actual,
    bitcoinApi: { ...actual.bitcoinApi, ...stub },
  };
});

// Pages — direct imports so the test runner doesn't have to handle React.lazy.
import TurkishHome from '@/pages/TurkishHome';
import Calculators from '@/pages/Calculators';
import Tools from '@/pages/Tools';
import Sitemap from '@/pages/Sitemap';
import Learn from '@/pages/Learn';
import About from '@/pages/About';
import BitcoinDCACalculator from '@/pages/BitcoinDCACalculator';
import BitcoinConverter from '@/pages/BitcoinConverter';
import BitcoinRetirementCalculator from '@/pages/BitcoinRetirementCalculator';
import BitcoinProfitLossCalculator from '@/pages/BitcoinProfitLossCalculator';

beforeAll(() => {
  try {
    window.localStorage.setItem('btc-calc-language', 'tr');
  } catch {
    /* noop */
  }
});

interface SmokeRoute {
  path: string;
  Page: React.ComponentType;
  titleKeyword: RegExp;
}

export const TR_SMOKE_ROUTES: SmokeRoute[] = [
  { path: '/tr/',                                                Page: TurkishHome,                  titleKeyword: /Bitcoin/i },
  { path: '/tr/hesaplayicilar',                                  Page: Calculators,                  titleKeyword: /Hesaplayıcı/i },
  { path: '/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi',        Page: BitcoinDCACalculator,         titleKeyword: /DCA/i },
  { path: '/tr/hesaplayicilar/bitcoin-donusturucu',              Page: BitcoinConverter,             titleKeyword: /Dönüştürücü|Converter|Bitcoin/i },
  { path: '/tr/hesaplayicilar/bitcoin-emeklilik-hesaplayicisi',  Page: BitcoinRetirementCalculator,  titleKeyword: /Emeklilik|Retirement/i },
  { path: '/tr/hesaplayicilar/bitcoin-kar-zarar-hesaplayicisi',  Page: BitcoinProfitLossCalculator,  titleKeyword: /Kâr|Kar|Zarar|Profit/i },
  { path: '/tr/araclar',                                         Page: Tools,                        titleKeyword: /Araçlar|Tools/i },
  { path: '/tr/site-haritasi',                                   Page: Sitemap,                      titleKeyword: /Site|Harita|Sitemap/i },
  { path: '/tr/ogrenin',                                         Page: Learn,                        titleKeyword: /Öğren|Learn|Bitcoin/i },
  { path: '/tr/hakkimizda',                                      Page: About,                        titleKeyword: /Hakkımızda|Hakkında|About/i },
];

const buildClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0, staleTime: Infinity } },
  });

const renderTrPage = (path: string, Page: React.ComponentType) => {
  // Force language to TR before LanguageProvider initialises.
  window.localStorage.setItem('btc-calc-language', 'tr');
  return render(
    <HelmetProvider>
      <QueryClientProvider client={buildClient()}>
        <LanguageProvider>
          <TooltipProvider delayDuration={0}>
            <MemoryRouter initialEntries={[path]}>
              <LocaleMeta />
              <GlobalHreflang />
              <Routes>
                <Route path={path} element={<Page />} />
              </Routes>
            </MemoryRouter>
          </TooltipProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

describe('Phase 9.1 — TR smoke matrix (10 representative routes)', () => {
  it.each(TR_SMOKE_ROUTES)(
    'renders %s with TR lang, title keyword, h1, hreflang trio',
    async ({ path, Page, titleKeyword }) => {
      const { container, unmount } = renderTrPage(path, Page);

      // (a) Wait for Helmet to commit + lang attribute to flip to "tr"
      await waitFor(() =>
        expect(document.documentElement.getAttribute('lang')).toBe('tr')
      );

      // (b) <title> contains expected TR keyword
      await waitFor(() => expect(document.title).toMatch(titleKeyword));

      // (c) at least one non-empty <h1>
      await waitFor(() => {
        const h1 = container.querySelector('h1');
        expect(h1).not.toBeNull();
        expect((h1!.textContent || '').trim().length).toBeGreaterThan(0);
      });

      // (d) hreflang trio present
      const alts = Array.from(document.querySelectorAll('link[rel="alternate"]'));
      const langs = new Set(alts.map((l) => l.getAttribute('hreflang')));
      expect(langs.has('en')).toBe(true);
      expect(langs.has('tr')).toBe(true);
      expect(langs.has('x-default')).toBe(true);

      // (e) no raw English loading/error leak in body
      const txt = container.textContent || '';
      expect(txt).not.toMatch(/\bLoading\.\.\.?\b/);
      expect(txt).not.toMatch(/\bError\b/);

      unmount();
      cleanup();
    },
    20_000
  );
});
