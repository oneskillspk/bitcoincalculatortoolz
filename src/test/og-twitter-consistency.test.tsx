/**
 * OG / Twitter meta consistency walker (read-only audit as a test).
 *
 * Mounts every EN and TR route in ALL_LOCALIZED_ROUTES and asserts:
 *
 *   1. og:title / og:description / twitter:title / twitter:description
 *      are present, non-empty, and not placeholders.
 *   2. twitter:card === "summary_large_image".
 *   3. og:image (and og:image:secure_url when present) match the
 *      locale-expected asset:
 *         EN → https://bitcoincalculator.tools/social-preview.webp
 *         TR → https://bitcoincalculator.tools/bitcoin-kar-hesaplayici-og.webp
 *      twitter:image mirrors og:image.
 *   4. The rich image metadata block emitted by <HelmetOgImage> is
 *      complete and consistent:
 *         og:image:type   === "image/webp"
 *         og:image:width  === "1200"
 *         og:image:height === "630"
 *         og:image:alt    non-empty
 *         twitter:image:alt non-empty and matches og:image:alt
 *   5. There is exactly ONE resolved value per og:image / twitter:image /
 *      twitter:card (no conflicting duplicates across nested Helmets).
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
const EN_IMG = `${BASE}/social-preview.webp`;
const TR_IMG = `${BASE}/bitcoin-kar-hesaplayici-og.webp`;

const PLACEHOLDER_RE = /\b(TODO|FIXME|undefined|null|\{\{?[a-z_]+\}?\})\b/i;

function stubPath(path: string) {
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: { ...window.location, pathname: path, href: `${BASE}${path}` },
  });
}

function renderAt(path: string, lang: 'en' | 'tr', Page: React.ComponentType) {
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
}

const allValues = (selector: string, attr: string): string[] =>
  Array.from(document.querySelectorAll(selector))
    .map((el) => el.getAttribute(attr))
    .filter((v): v is string => v !== null && v.trim().length > 0);

const uniq = (xs: string[]) => Array.from(new Set(xs));

function resetHead() {
  document.head.querySelectorAll('link, meta, title').forEach((n) => n.remove());
  document.documentElement.removeAttribute('lang');
}

beforeEach(resetHead);

interface Field {
  label: string;
  selector: string;
  attr: 'content' | 'text';
}

const TEXT_FIELDS: Field[] = [
  { label: 'og:title',            selector: 'meta[property="og:title"]',           attr: 'content' },
  { label: 'og:description',      selector: 'meta[property="og:description"]',     attr: 'content' },
  { label: 'twitter:title',       selector: 'meta[name="twitter:title"]',          attr: 'content' },
  { label: 'twitter:description', selector: 'meta[name="twitter:description"]',    attr: 'content' },
];

async function auditRoute(path: string, expectedImg: string) {
  await waitFor(
    () => {
      const t = document.querySelector('title')?.textContent?.trim() ?? '';
      expect(t.length, `${path} <title> not committed yet`).toBeGreaterThan(0);
    },
    { timeout: 8000 },
  );

  const failures: string[] = [];

  // 1) Text fields present, non-empty, no placeholders.
  for (const { label, selector, attr } of TEXT_FIELDS) {
    const el = document.querySelector(selector);
    if (!el) {
      failures.push(`${label} missing`);
      continue;
    }
    const value = ((attr === 'text' ? el.textContent : el.getAttribute(attr)) ?? '').trim();
    if (!value) failures.push(`${label} empty`);
    else if (PLACEHOLDER_RE.test(value)) failures.push(`${label} placeholder: "${value}"`);
  }

  // 2) twitter:card === summary_large_image (single value).
  const cards = uniq(allValues('meta[name="twitter:card"]', 'content'));
  if (cards.length === 0) failures.push('twitter:card missing');
  else if (cards.length > 1) failures.push(`twitter:card has conflicting values: ${cards.join(', ')}`);
  else if (cards[0] !== 'summary_large_image')
    failures.push(`twitter:card expected "summary_large_image" got "${cards[0]}"`);

  // 3) og:image / secure_url / twitter:image resolve to the locale asset (one value each).
  const ogImgs        = uniq(allValues('meta[property="og:image"]', 'content'));
  const ogImgSecure   = uniq(allValues('meta[property="og:image:secure_url"]', 'content'));
  const twitterImgs   = uniq(allValues('meta[name="twitter:image"]', 'content'));

  if (ogImgs.length !== 1) failures.push(`og:image expected 1 unique value, got ${ogImgs.length}: ${ogImgs.join(', ')}`);
  else if (ogImgs[0] !== expectedImg) failures.push(`og:image expected ${expectedImg} got ${ogImgs[0]}`);

  if (twitterImgs.length !== 1) failures.push(`twitter:image expected 1 unique value, got ${twitterImgs.length}: ${twitterImgs.join(', ')}`);
  else if (twitterImgs[0] !== expectedImg) failures.push(`twitter:image expected ${expectedImg} got ${twitterImgs[0]}`);

  if (ogImgSecure.length > 1) failures.push(`og:image:secure_url conflicting values: ${ogImgSecure.join(', ')}`);
  else if (ogImgSecure.length === 1 && ogImgSecure[0] !== expectedImg)
    failures.push(`og:image:secure_url expected ${expectedImg} got ${ogImgSecure[0]}`);

  // 4) Rich image metadata block (emitted by HelmetOgImage).
  const type   = uniq(allValues('meta[property="og:image:type"]', 'content'));
  const width  = uniq(allValues('meta[property="og:image:width"]', 'content'));
  const height = uniq(allValues('meta[property="og:image:height"]', 'content'));
  const ogAlt  = uniq(allValues('meta[property="og:image:alt"]', 'content'));
  const twAlt  = uniq(allValues('meta[name="twitter:image:alt"]', 'content'));

  if (type.length !== 1 || type[0] !== 'image/webp')
    failures.push(`og:image:type expected "image/webp" got ${JSON.stringify(type)}`);
  if (width.length !== 1 || width[0] !== '1200')
    failures.push(`og:image:width expected "1200" got ${JSON.stringify(width)}`);
  if (height.length !== 1 || height[0] !== '630')
    failures.push(`og:image:height expected "630" got ${JSON.stringify(height)}`);
  if (ogAlt.length !== 1 || !ogAlt[0])
    failures.push(`og:image:alt expected 1 non-empty value, got ${JSON.stringify(ogAlt)}`);
  if (twAlt.length !== 1 || !twAlt[0])
    failures.push(`twitter:image:alt expected 1 non-empty value, got ${JSON.stringify(twAlt)}`);
  if (ogAlt.length === 1 && twAlt.length === 1 && ogAlt[0] !== twAlt[0])
    failures.push(`og:image:alt (${ogAlt[0]}) !== twitter:image:alt (${twAlt[0]})`);

  expect(failures, `${path}:\n  - ${failures.join('\n  - ')}`).toHaveLength(0);
}

describe('OG / Twitter meta consistency — every EN/TR route', () => {
  it.each(ALL_LOCALIZED_ROUTES)(
    'EN $enPath emits consistent OG + Twitter meta',
    async ({ enPath, enPage }) => {
      const { unmount } = renderAt(enPath, 'en', enPage);
      await auditRoute(`EN ${enPath}`, EN_IMG);
      unmount();
      cleanup();
    },
    15_000,
  );

  it.each(ALL_LOCALIZED_ROUTES)(
    'TR $trPath emits consistent OG + Twitter meta',
    async ({ trPath, trPage }) => {
      const { unmount } = renderAt(trPath, 'tr', trPage);
      await auditRoute(`TR ${trPath}`, TR_IMG);
      unmount();
      cleanup();
    },
    15_000,
  );
});
