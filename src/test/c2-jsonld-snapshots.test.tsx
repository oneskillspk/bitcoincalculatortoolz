/**
 * Phase C2 — Bilingual JSON-LD snapshot guard.
 *
 * Mounts each of the 5 C2 priority pages at both their EN and TR canonical
 * routes, captures every <script type="application/ld+json"> emitted into
 * the document head, projects each block to a stable structural shape
 * (drops volatile fields like dates, prices, countdown values), and
 * snapshots the projection.
 *
 * A regression here means: the bilingual JSON-LD payload changed shape,
 * the wrong locale was served, a FAQ question was lost/renamed, or a
 * required schema block was dropped.
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, waitFor, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { TooltipProvider } from '@/components/ui/tooltip';

// ── Network-free price stubs (mirror misc-pages-i18n-seo) ─────────────
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

vi.mock('@/services/bitcoinApi', async () => {
  const actual = await vi.importActual<typeof import('@/services/bitcoinApi')>(
    '@/services/bitcoinApi',
  );
  const stub = {
    getCurrentPrice: vi.fn(async () => 50000),
    getCurrentMarketData: vi.fn(async () => ({
      price: 50000,
      priceChange24h: 100,
      priceChangePercentage24h: 1.5,
      lastUpdated: new Date('2025-01-01T00:00:00Z').toISOString(),
      marketCap: 1e12,
      volume24h: 5e10,
    })),
    getHistoricalPrice: vi.fn(async () => 48000),
    getHistoricalPrices: vi.fn(async () => []),
    calculateInvestment: vi.fn(async () => null),
  };
  return { ...actual, bitcoinApi: { ...actual.bitcoinApi, ...stub } };
});

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

import BitcoinHalvingCountdown from '@/pages/BitcoinHalvingCountdown';
import LumpSumVsDCACalculator from '@/pages/LumpSumVsDCACalculator';
import BitcoinAverageBuyPriceCalculator from '@/pages/BitcoinAverageBuyPriceCalculator';
import BitcoinPowerLawCalculator from '@/pages/BitcoinPowerLawCalculator';
import BitcoinCapitalGainsTaxCalculator from '@/pages/BitcoinCapitalGainsTaxCalculator';

interface PageCase {
  name: string;
  Page: React.ComponentType;
  enPath: string;
  trPath: string;
}

const PAGES: PageCase[] = [
  {
    name: 'HalvingCountdown',
    Page: BitcoinHalvingCountdown,
    enPath: '/calculators/halving-countdown',
    trPath: '/tr/hesaplayicilar/bitcoin-yarilama',
  },
  {
    name: 'LumpSumVsDCA',
    Page: LumpSumVsDCACalculator,
    enPath: '/calculators/lump-sum-vs-dca',
    trPath: '/tr/hesaplayicilar/bitcoin-maliyet-ortalama',
  },
  {
    name: 'AverageBuyPrice',
    Page: BitcoinAverageBuyPriceCalculator,
    enPath: '/calculators/average-buy-price',
    trPath: '/tr/hesaplayicilar/bitcoin-ortalama-alis',
  },
  {
    name: 'PowerLaw',
    Page: BitcoinPowerLawCalculator,
    enPath: '/calculators/power-law',
    trPath: '/tr/hesaplayicilar/bitcoin-guc-yasasi',
  },
  {
    name: 'CapitalGainsTax',
    Page: BitcoinCapitalGainsTaxCalculator,
    enPath: '/calculators/capital-gains-tax',
    trPath: '/tr/hesaplayicilar/bitcoin-vergi-hesaplayicisi',
  },
];

const buildClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0, staleTime: Infinity } },
  });

const renderAt = (path: string, lang: 'en' | 'tr', Page: React.ComponentType) => {
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
    </HelmetProvider>,
  );
};

/**
 * Reduce a JSON-LD block to a stable structural projection.
 * Strips volatile leaves (timestamps, counters, prices) and keeps the
 * SEO-meaningful surface: types, locale, name/description, FAQ Q&A keys.
 */
const VOLATILE_KEYS = new Set([
  'datePublished',
  'dateModified',
  'uploadDate',
  'startDate',
  'endDate',
  'expires',
  'price',
  'lowPrice',
  'highPrice',
  'ratingValue',
  'reviewCount',
  'ratingCount',
]);

type Json = unknown;
const projectNode = (node: Json): Json => {
  if (Array.isArray(node)) return node.map(projectNode);
  if (node && typeof node === 'object') {
    const out: Record<string, Json> = {};
    for (const [k, v] of Object.entries(node as Record<string, Json>)) {
      if (VOLATILE_KEYS.has(k)) {
        out[k] = '<volatile>';
        continue;
      }
      out[k] = projectNode(v);
    }
    return out;
  }
  return node;
};

const summarizeBlock = (raw: string) => {
  let parsed: Json;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { parseError: true, raw: raw.slice(0, 80) };
  }
  const obj = parsed as Record<string, unknown>;
  const type = obj['@type'];
  const inLanguage = obj['inLanguage'] ?? null;
  const name = obj['name'] ?? null;
  const description =
    typeof obj['description'] === 'string'
      ? (obj['description'] as string).slice(0, 120)
      : obj['description'] ?? null;

  // FAQ → array of question strings (order matters)
  let faqQuestions: string[] | undefined;
  if (type === 'FAQPage' && Array.isArray(obj['mainEntity'])) {
    faqQuestions = (obj['mainEntity'] as Array<Record<string, unknown>>).map(
      (q) => String(q?.name ?? ''),
    );
  }

  // HowTo → step names (order matters)
  let howToSteps: string[] | undefined;
  if (type === 'HowTo' && Array.isArray(obj['step'])) {
    howToSteps = (obj['step'] as Array<Record<string, unknown>>).map((s) =>
      String(s?.name ?? ''),
    );
  }

  // featureList for WebApplication
  let featureList: unknown;
  if (Array.isArray(obj['featureList'])) {
    featureList = obj['featureList'];
  }

  return projectNode({
    '@type': type,
    inLanguage,
    name,
    description,
    priceCurrency:
      (obj['offers'] as Record<string, unknown> | undefined)?.['priceCurrency'] ?? null,
    faqQuestions,
    howToSteps,
    featureList,
  });
};

const readJsonLd = () => {
  const scripts = Array.from(
    document.querySelectorAll('script[type="application/ld+json"]'),
  );
  return scripts
    .map((s) => (s.textContent ?? '').trim())
    .filter(Boolean)
    .map(summarizeBlock);
};

describe('C2 — Bilingual JSON-LD snapshots', () => {
  for (const c of PAGES) {
    describe(c.name, () => {
      it(`EN ${c.enPath} emits stable JSON-LD blocks`, async () => {
        const { unmount } = renderAt(c.enPath, 'en', c.Page);
        await waitFor(() => {
          const blocks = document.querySelectorAll(
            'script[type="application/ld+json"]',
          );
          expect(blocks.length).toBeGreaterThan(0);
        });
        // Give Helmet a tick to flush all blocks
        await new Promise((r) => setTimeout(r, 50));
        const summary = readJsonLd();
        expect(summary.length).toBeGreaterThan(0);
        // No block should be Turkish
        for (const b of summary) {
          const lang = (b as Record<string, unknown>)?.inLanguage;
          if (lang != null) expect(lang).not.toBe('tr');
        }
        expect(summary).toMatchSnapshot();
        unmount();
      }, 20_000);

      it(`TR ${c.trPath} emits stable JSON-LD blocks`, async () => {
        const { unmount } = renderAt(c.trPath, 'tr', c.Page);
        await waitFor(() => {
          const blocks = document.querySelectorAll(
            'script[type="application/ld+json"]',
          );
          expect(blocks.length).toBeGreaterThan(0);
        });
        await new Promise((r) => setTimeout(r, 50));
        const summary = readJsonLd();
        expect(summary.length).toBeGreaterThan(0);
        // At least one block must explicitly mark inLanguage tr
        const hasTr = summary.some(
          (b) => (b as Record<string, unknown>)?.inLanguage === 'tr',
        );
        expect(hasTr, 'expected at least one JSON-LD block with inLanguage="tr"').toBe(
          true,
        );
        // No block may be English
        for (const b of summary) {
          const lang = (b as Record<string, unknown>)?.inLanguage;
          if (lang != null) expect(lang).not.toBe('en');
        }
        expect(summary).toMatchSnapshot();
        unmount();
      }, 20_000);

      it(`${c.name} EN and TR JSON-LD differ`, async () => {
        const { unmount: u1 } = renderAt(c.enPath, 'en', c.Page);
        await waitFor(() =>
          expect(
            document.querySelectorAll('script[type="application/ld+json"]').length,
          ).toBeGreaterThan(0),
        );
        await new Promise((r) => setTimeout(r, 50));
        const enSummary = JSON.stringify(readJsonLd());
        u1();
        cleanup();

        const { unmount: u2 } = renderAt(c.trPath, 'tr', c.Page);
        await waitFor(() =>
          expect(
            document.querySelectorAll('script[type="application/ld+json"]').length,
          ).toBeGreaterThan(0),
        );
        await new Promise((r) => setTimeout(r, 50));
        const trSummary = JSON.stringify(readJsonLd());
        u2();

        expect(trSummary).not.toBe(enSummary);
      }, 30_000);
    });
  }
});
