/**
 * Runtime JSON-LD parity walker — FAQPage + Organization.
 *
 * Mounts every EN/TR route from ALL_LOCALIZED_ROUTES and inspects the
 * rendered <script type="application/ld+json"> blocks. For any FAQPage
 * or Organization block emitted, asserts:
 *   - FAQPage carries `inLanguage` matching the active locale
 *     (`en` on EN routes, `tr` on TR routes).
 *   - Organization, when emitted per-route, carries `inLanguage`
 *     matching the active locale. Organization without inLanguage is
 *     accepted as a site-wide signal (e.g. emitted by index.html).
 *
 * Complements the static `tr-jsonld-inlanguage` walker which greps
 * source for TR-gated literals; this one validates actual head output.
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

const BASE = 'https://bitcoincalculator.tools';

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
  document.head.querySelectorAll('link, meta, title, script[type="application/ld+json"]').forEach((n) => n.remove());
  document.documentElement.removeAttribute('lang');
};

beforeEach(resetHead);

function readJsonLdBlocks(): any[] {
  const blocks: any[] = [];
  for (const s of document.querySelectorAll('script[type="application/ld+json"]')) {
    try { blocks.push(JSON.parse(s.textContent || '')); } catch { /* ignore parse errors here */ }
  }
  return blocks;
}

function* walk(node: any): IterableIterator<any> {
  if (!node) return;
  if (Array.isArray(node)) { for (const v of node) yield* walk(v); return; }
  if (typeof node === 'object') {
    yield node;
    for (const v of Object.values(node)) yield* walk(v);
  }
}

async function assertParity(path: string, lang: 'en' | 'tr') {
  await waitFor(
    () => {
      expect(document.querySelector('title')?.textContent?.trim() ?? '').not.toBe('');
    },
    { timeout: 8000 },
  );

  const offenders: string[] = [];
  for (const block of readJsonLdBlocks()) {
    for (const node of walk(block)) {
      const t = node['@type'];
      const types = Array.isArray(t) ? t : [t];
      if (types.includes('FAQPage')) {
        if (node.inLanguage !== lang) {
          offenders.push(`FAQPage inLanguage="${node.inLanguage}" expected "${lang}"`);
        }
      }
      if (types.includes('Organization')) {
        // Per-route Organization (has its own inLanguage) must match the
        // locale. A site-wide Organization without inLanguage is allowed.
        if ('inLanguage' in node && node.inLanguage !== lang) {
          offenders.push(`Organization inLanguage="${node.inLanguage}" expected "${lang}"`);
        }
      }
    }
  }
  expect(offenders, `${path}:\n  - ${offenders.join('\n  - ')}`).toEqual([]);
}

describe('JSON-LD parity — FAQPage + Organization inLanguage matches active locale', () => {
  it.each(ALL_LOCALIZED_ROUTES)(
    'EN $enPath emits FAQPage/Organization JSON-LD with inLanguage="en" (or omitted)',
    async ({ enPath, enPage }) => {
      const { unmount } = renderAt(enPath, 'en', enPage);
      await assertParity(`EN ${enPath}`, 'en');
      unmount();
      cleanup();
    },
    15_000,
  );

  it.each(ALL_LOCALIZED_ROUTES)(
    'TR $trPath emits FAQPage/Organization JSON-LD with inLanguage="tr" (or omitted)',
    async ({ trPath, trPage }) => {
      const { unmount } = renderAt(trPath, 'tr', trPage);
      await assertParity(`TR ${trPath}`, 'tr');
      unmount();
      cleanup();
    },
    15_000,
  );
});
