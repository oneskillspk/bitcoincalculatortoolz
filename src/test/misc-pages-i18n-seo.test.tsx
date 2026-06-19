/**
 * Misc family — EN/TR SEO end-to-end.
 *
 * For each of the 5 Misc pages, mount the page once at the EN canonical
 * route and once at the TR canonical route. Assert that:
 *   - <title> matches the {ns}.meta.title translation for that language
 *   - <meta name="description"> matches {ns}.meta.description
 *   - <link rel="canonical"> matches the expected absolute URL
 *   - <meta property="og:url"> matches the expected absolute URL
 *
 * The page's own <Helmet> drives all four — this test verifies the
 * language switch flips every one of them, not just the visible UI.
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, waitFor, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { translations, loadLocale } from '@/translations';

await loadLocale('tr');

// Network-free price stubs (mirrors tr-smoke-matrix).
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
  return { ...actual, bitcoinApi: { ...actual.bitcoinApi, ...stub } };
});

// PiToBitcoin uses raw fetch() to coingecko; stub to an empty payload so
// the useQuery resolves deterministically without network.
const originalFetch = globalThis.fetch;
beforeEach(() => {
  globalThis.fetch = vi.fn(async () =>
    new Response(JSON.stringify({}), { status: 200, headers: { 'Content-Type': 'application/json' } })
  ) as unknown as typeof fetch;
});
afterEach(() => {
  globalThis.fetch = originalFetch;
  cleanup();
});

import PiToBitcoinCalculator from '@/pages/PiToBitcoinCalculator';
import BitcoinPizzaDayCalculator from '@/pages/BitcoinPizzaDayCalculator';
import BitcoinArbitrageCalculator from '@/pages/BitcoinArbitrageCalculator';
import BtcVsRealEstateCalculator from '@/pages/BtcVsRealEstateCalculator';
import BitcoinObituariesTracker from '@/pages/BitcoinObituariesTracker';

const BASE = 'https://bitcoincalculator.tools';

interface MiscCase {
  name: string;
  Page: React.ComponentType;
  ns: string; // translation namespace prefix, e.g. 'pi'
  enPath: string;
  trPath: string;
}

const MISC_PAGES: MiscCase[] = [
  {
    name: 'PiToBitcoin',
    Page: PiToBitcoinCalculator,
    ns: 'pi',
    enPath: '/calculators/pi-to-bitcoin',
    trPath: '/tr/hesaplayicilar/bitcoin-pi-donusturucu',
  },
  {
    name: 'PizzaDay',
    Page: BitcoinPizzaDayCalculator,
    ns: 'pizza',
    enPath: '/calculators/pizza-day',
    trPath: '/tr/hesaplayicilar/bitcoin-pizza-gunu',
  },
  {
    name: 'Arbitrage',
    Page: BitcoinArbitrageCalculator,
    ns: 'arb',
    enPath: '/calculators/bitcoin-arbitrage',
    trPath: '/tr/hesaplayicilar/bitcoin-arbitraj',
  },
  {
    name: 'BtcVsRealEstate',
    Page: BtcVsRealEstateCalculator,
    ns: 're',
    enPath: '/calculators/btc-vs-real-estate',
    trPath: '/tr/hesaplayicilar/bitcoin-gayrimenkul',
  },
  {
    name: 'Obituaries',
    Page: BitcoinObituariesTracker,
    ns: 'obit',
    enPath: '/calculators/obituaries-tracker',
    trPath: '/tr/hesaplayicilar/bitcoin-olum-ilanlari',
  },
];

const buildClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0, staleTime: Infinity } },
  });

const renderAt = (path: string, lang: 'en' | 'tr', Page: React.ComponentType) => {
  // Force language via storage before LanguageProvider initialises so the
  // first render commits the correct locale.
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
                <Route path={path} element={<Page />} />
              </Routes>
            </MemoryRouter>
          </TooltipProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

const readMeta = () => ({
  title: document.title,
  description:
    document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '',
  canonical:
    document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '',
  ogUrl:
    document.querySelector('meta[property="og:url"]')?.getAttribute('content') ?? '',
});

describe('Misc pages — EN/TR SEO end-to-end', () => {
  for (const c of MISC_PAGES) {
    describe(c.name, () => {
      it(`EN ${c.enPath} emits English title/description/canonical/og:url`, async () => {
        const expectedTitle = translations.en[`${c.ns}.meta.title`];
        const expectedDesc = translations.en[`${c.ns}.meta.description`];
        const expectedUrl = `${BASE}${c.enPath}`;
        expect(expectedTitle, `missing translations.en[${c.ns}.meta.title]`).toBeTruthy();
        expect(expectedDesc, `missing translations.en[${c.ns}.meta.description]`).toBeTruthy();

        const { unmount } = renderAt(c.enPath, 'en', c.Page);

        await waitFor(() => expect(document.title).toBe(expectedTitle));
        const meta = readMeta();
        expect(meta.description).toBe(expectedDesc);
        expect(meta.canonical).toBe(expectedUrl);
        expect(meta.ogUrl).toBe(expectedUrl);

        unmount();
      }, 20_000);

      it(`TR ${c.trPath} emits Turkish title/description/canonical/og:url`, async () => {
        const expectedTitle = translations.tr[`${c.ns}.meta.title`];
        const expectedDesc = translations.tr[`${c.ns}.meta.description`];
        const expectedUrl = `${BASE}${c.trPath}`;
        expect(expectedTitle, `missing translations.tr[${c.ns}.meta.title]`).toBeTruthy();
        expect(expectedDesc, `missing translations.tr[${c.ns}.meta.description]`).toBeTruthy();

        const { unmount } = renderAt(c.trPath, 'tr', c.Page);

        await waitFor(() => expect(document.title).toBe(expectedTitle));
        const meta = readMeta();
        expect(meta.description).toBe(expectedDesc);
        expect(meta.canonical).toBe(expectedUrl);
        expect(meta.ogUrl).toBe(expectedUrl);

        unmount();
      }, 20_000);

      it(`${c.name} EN ≠ TR for title, description, canonical, og:url`, async () => {
        const enTitle = translations.en[`${c.ns}.meta.title`];
        const trTitle = translations.tr[`${c.ns}.meta.title`];
        const enDesc = translations.en[`${c.ns}.meta.description`];
        const trDesc = translations.tr[`${c.ns}.meta.description`];
        expect(trTitle).not.toBe(enTitle);
        expect(trDesc).not.toBe(enDesc);
        expect(c.trPath).not.toBe(c.enPath);
      });
    });
  }
});
