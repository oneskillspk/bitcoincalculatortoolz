/**
 * SEO consistency walker.
 *
 * Mounts a representative set of EN + TR routes wrapped with the global
 * SEO components (LocaleMeta + GlobalHreflang) plus the page's own
 * <Helmet> block, then asserts:
 *
 *   1. There is no DUPLICATE-AND-CONFLICTING tag emitted across nested
 *      components — i.e. multiple <link rel="canonical">, multiple
 *      <meta property="og:url">, multiple <meta property="og:locale">,
 *      or multiple <link rel="alternate" hreflang="X"> with DIFFERENT
 *      href / content values.
 *   2. <link rel="canonical"> matches the expected absolute URL for the
 *      current locale (EN → bitcoincalculator.tools/<en>, TR → /tr/<tr>).
 *   3. <meta property="og:url"> matches the same absolute URL.
 *   4. The hreflang triplet (en, tr, x-default) is present and points at
 *      the EN_TO_TR-correct absolute URLs.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import LanguageRouteSync from '@/components/LanguageRouteSync';
import { LocaleMeta } from '@/components/LocaleMeta';
import { GlobalHreflang } from '@/components/GlobalHreflang';
import { EN_TO_TR } from '@/utils/localizedRoutes';

import BitcoinDCACalculator from '@/pages/BitcoinDCACalculator';
import BitcoinRetirementCalculator from '@/pages/BitcoinRetirementCalculator';
import BitcoinConverter from '@/pages/BitcoinConverter';

const BASE = 'https://bitcoincalculator.tools';

interface Case {
  label: string;
  enPath: string;
  Page: React.ComponentType;
}

const CASES: Case[] = [
  { label: 'DCA',        enPath: '/calculators/dca',         Page: BitcoinDCACalculator },
  { label: 'Retirement', enPath: '/calculators/retirement',  Page: BitcoinRetirementCalculator },
  { label: 'Converter',  enPath: '/calculators/bitcoin-converter', Page: BitcoinConverter },
];

const renderAt = (path: string, Page: React.ComponentType) => {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return render(
    <HelmetProvider>
      <QueryClientProvider client={qc}>
        <MemoryRouter initialEntries={[path]}>
          <LanguageProvider>
            <TooltipProvider>
              <LanguageRouteSync />
              <LocaleMeta />
              <GlobalHreflang />
              <Suspense fallback={<div data-testid="loading" />}>
                <Routes>
                  <Route path={path} element={<Page />} />
                </Routes>
              </Suspense>
            </TooltipProvider>
          </LanguageProvider>
        </MemoryRouter>
      </QueryClientProvider>
    </HelmetProvider>,
  );
};

const allValues = (selector: string, attr: string): string[] =>
  Array.from(document.querySelectorAll(selector))
    .map((el) => el.getAttribute(attr))
    .filter((v): v is string => v !== null);

const uniq = (xs: string[]) => Array.from(new Set(xs));

beforeEach(() => {
  document.head.querySelectorAll('link[rel="canonical"], link[rel="alternate"], meta[property^="og:"], meta[name="description"]').forEach((n) => n.remove());
  document.documentElement.removeAttribute('lang');
});

describe('SEO consistency — no duplicate / conflicting tags across nested components', () => {
  it.each(CASES)('$label EN route emits unique, consistent SEO tags', async ({ enPath, Page }) => {
    renderAt(enPath, Page);

    await waitFor(() => {
      expect(document.querySelector('link[rel="canonical"]')).not.toBeNull();
    }, { timeout: 4000 });

    const canonicals = uniq(allValues('link[rel="canonical"]', 'href'));
    const ogUrls     = uniq(allValues('meta[property="og:url"]', 'content'));
    const ogLocales  = uniq(allValues('meta[property="og:locale"]', 'content'));

    expect(canonicals, `multiple canonical hrefs: ${canonicals.join(', ')}`).toHaveLength(1);
    expect(ogUrls,     `multiple og:url values: ${ogUrls.join(', ')}`).toHaveLength(1);
    expect(ogLocales,  `multiple og:locale values: ${ogLocales.join(', ')}`).toHaveLength(1);

    const expectedAbs = `${BASE}${enPath}`;
    expect(canonicals[0]).toBe(expectedAbs);
    expect(ogUrls[0]).toBe(expectedAbs);
    expect(ogLocales[0]).toBe('en_US');

    // hreflang: same lang → same href across all emitters
    for (const lang of ['en', 'tr', 'x-default']) {
      const hrefs = uniq(allValues(`link[rel="alternate"][hreflang="${lang}"]`, 'href'));
      expect(hrefs.length, `conflicting hreflang="${lang}" hrefs: ${hrefs.join(', ')}`).toBeLessThanOrEqual(1);
    }
    const enAlt = allValues('link[rel="alternate"][hreflang="en"]', 'href')[0];
    const trAlt = allValues('link[rel="alternate"][hreflang="tr"]', 'href')[0];
    const xdAlt = allValues('link[rel="alternate"][hreflang="x-default"]', 'href')[0];
    const trExpected = EN_TO_TR[enPath];
    expect(enAlt).toBe(`${BASE}${enPath}`);
    if (trExpected) expect(trAlt).toBe(`${BASE}${trExpected}`);
    expect(xdAlt).toBe(`${BASE}${enPath}`);
  });

  it.each(CASES)('$label TR route emits unique, consistent SEO tags', async ({ enPath, Page }) => {
    const trPath = EN_TO_TR[enPath];
    expect(trPath, `no TR mirror for ${enPath}`).toBeTruthy();
    renderAt(trPath, Page);

    await waitFor(() => {
      expect(document.querySelector('link[rel="canonical"]')).not.toBeNull();
    }, { timeout: 4000 });

    const canonicals = uniq(allValues('link[rel="canonical"]', 'href'));
    const ogUrls     = uniq(allValues('meta[property="og:url"]', 'content'));
    const ogLocales  = uniq(allValues('meta[property="og:locale"]', 'content'));

    expect(canonicals, `multiple canonical hrefs: ${canonicals.join(', ')}`).toHaveLength(1);
    expect(ogUrls,     `multiple og:url values: ${ogUrls.join(', ')}`).toHaveLength(1);
    expect(ogLocales,  `multiple og:locale values: ${ogLocales.join(', ')}`).toHaveLength(1);

    const expectedAbs = `${BASE}${trPath}`;
    expect(canonicals[0]).toBe(expectedAbs);
    expect(ogUrls[0]).toBe(expectedAbs);
    expect(ogLocales[0]).toBe('tr_TR');

    for (const lang of ['en', 'tr', 'x-default']) {
      const hrefs = uniq(allValues(`link[rel="alternate"][hreflang="${lang}"]`, 'href'));
      expect(hrefs.length, `conflicting hreflang="${lang}" hrefs: ${hrefs.join(', ')}`).toBeLessThanOrEqual(1);
    }
    const enAlt = allValues('link[rel="alternate"][hreflang="en"]', 'href')[0];
    const trAlt = allValues('link[rel="alternate"][hreflang="tr"]', 'href')[0];
    const xdAlt = allValues('link[rel="alternate"][hreflang="x-default"]', 'href')[0];
    expect(enAlt).toBe(`${BASE}${enPath}`);
    expect(trAlt).toBe(`${BASE}${trPath}`);
    expect(xdAlt).toBe(`${BASE}${enPath}`);
  });
});
