/**
 * SEO meta coverage audit.
 *
 * For every EN and TR page in ALL_LOCALIZED_ROUTES, mount the component
 * and assert the head carries a populated:
 *   - <title>
 *   - <meta name="description">
 *   - <meta property="og:title">
 *   - <meta property="og:description">
 *   - <meta property="og:image">
 *   - <meta name="twitter:title">
 *   - <meta name="twitter:description">
 *   - <meta name="twitter:image">
 *
 * "Populated" = non-empty, trimmed, not a placeholder ("TODO", "{title}",
 * "undefined", etc.). Length budgets are enforced elsewhere
 * (tr-og-length.test.tsx) — this guard purely catches missing tags.
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
  document.head
    .querySelectorAll('link, meta, title')
    .forEach((n) => {
      // Keep nothing — Helmet re-emits everything on next render
      n.remove();
    });
  document.documentElement.removeAttribute('lang');
};

beforeEach(resetHead);

const PLACEHOLDER_RE = /\b(TODO|FIXME|undefined|null|\{\{?[a-z_]+\}?\})\b/i;

const REQUIRED_META: { label: string; selector: string; attr: 'content' | 'text' }[] = [
  { label: 'title',                selector: 'title',                                attr: 'text' },
  { label: 'description',          selector: 'meta[name="description"]',             attr: 'content' },
  { label: 'og:title',             selector: 'meta[property="og:title"]',            attr: 'content' },
  { label: 'og:description',       selector: 'meta[property="og:description"]',      attr: 'content' },
  { label: 'og:image',             selector: 'meta[property="og:image"]',            attr: 'content' },
  { label: 'twitter:title',        selector: 'meta[name="twitter:title"]',           attr: 'content' },
  { label: 'twitter:description',  selector: 'meta[name="twitter:description"]',     attr: 'content' },
  { label: 'twitter:image',        selector: 'meta[name="twitter:image"]',           attr: 'content' },
];

async function assertAllMeta(path: string) {
  // Wait for at least the <title> to commit before sampling.
  await waitFor(
    () => {
      const t = document.querySelector('title')?.textContent?.trim() ?? '';
      expect(t.length, `${path} <title> not committed yet`).toBeGreaterThan(0);
    },
    { timeout: 8000 },
  );

  const missing: string[] = [];
  for (const { label, selector, attr } of REQUIRED_META) {
    const el = document.querySelector(selector);
    if (!el) {
      missing.push(`${label} missing`);
      continue;
    }
    const value = (attr === 'text' ? el.textContent : el.getAttribute('content')) ?? '';
    const trimmed = value.trim();
    if (!trimmed) {
      missing.push(`${label} empty`);
    } else if (PLACEHOLDER_RE.test(trimmed)) {
      missing.push(`${label} contains placeholder: "${trimmed}"`);
    }
  }
  expect(missing, `${path}:\n  - ${missing.join('\n  - ')}`).toHaveLength(0);
}

describe('SEO meta coverage — every EN/TR page populates title/desc/OG/Twitter', () => {
  it.each(ALL_LOCALIZED_ROUTES)(
    'EN $enPath emits a complete SEO meta block',
    async ({ enPath, enPage }) => {
      const { unmount } = renderAt(enPath, 'en', enPage);
      await assertAllMeta(`EN ${enPath}`);
      unmount();
      cleanup();
    },
    15_000,
  );

  it.each(ALL_LOCALIZED_ROUTES)(
    'TR $trPath emits a complete SEO meta block',
    async ({ trPath, trPage }) => {
      const { unmount } = renderAt(trPath, 'tr', trPage);
      await assertAllMeta(`TR ${trPath}`);
      unmount();
      cleanup();
    },
    15_000,
  );
});
