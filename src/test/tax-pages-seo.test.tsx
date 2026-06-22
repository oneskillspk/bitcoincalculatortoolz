/**
 * Regression: the three new regional Bitcoin tax calculator pages must emit
 * the correct canonical, og:url, hreflang triplet, and JSON-LD blocks
 * (WebApplication + HowTo from TaxJsonLd, FAQPage from TaxAccordionFAQ) for
 * both EN and TR routes.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { TooltipProvider } from '@/components/ui/tooltip';

import BitcoinIndiaTaxCalculator from '@/pages/BitcoinIndiaTaxCalculator';
import BitcoinUKCGTCalculator from '@/pages/BitcoinUKCGTCalculator';
import BitcoinGermanyTaxCalculator from '@/pages/BitcoinGermanyTaxCalculator';

const BASE = 'https://bitcoincalculator.tools';

const PAGES = [
  {
    label: 'India',
    Page: BitcoinIndiaTaxCalculator,
    en: '/calculators/bitcoin-tax-india',
    tr: '/tr/hesaplayicilar/bitcoin-vergi-hindistan',
  },
  {
    label: 'UK CGT',
    Page: BitcoinUKCGTCalculator,
    en: '/calculators/bitcoin-tax-uk-cgt',
    tr: '/tr/hesaplayicilar/bitcoin-vergi-ingiltere-cgt',
  },
  {
    label: 'Germany',
    Page: BitcoinGermanyTaxCalculator,
    en: '/calculators/bitcoin-tax-germany',
    tr: '/tr/hesaplayicilar/bitcoin-vergi-almanya',
  },
] as const;

function renderAt(path: string, Page: React.ComponentType) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  return render(
    <HelmetProvider>
      <QueryClientProvider client={qc}>
        <MemoryRouter initialEntries={[path]}>
          <LanguageProvider>
            <TooltipProvider>
              <Suspense fallback={null}>
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
}

const attrs = (sel: string, attr: string) =>
  Array.from(document.querySelectorAll(sel))
    .map((n) => n.getAttribute(attr))
    .filter((v): v is string => v !== null);

const jsonLdTypes = (): string[] => {
  const out: string[] = [];
  document.querySelectorAll('script[type="application/ld+json"]').forEach((s) => {
    try {
      const parsed = JSON.parse(s.textContent ?? '');
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      for (const node of arr) if (node && node['@type']) out.push(String(node['@type']));
    } catch {
      /* ignore */
    }
  });
  return out;
};

beforeEach(() => {
  document.head
    .querySelectorAll('link[rel="canonical"], link[rel="alternate"], meta[property^="og:"], script[type="application/ld+json"]')
    .forEach((n) => n.remove());
});

describe('New tax calculator pages — SEO regression', () => {
  for (const p of PAGES) {
    for (const locale of ['en', 'tr'] as const) {
      const path = locale === 'en' ? p.en : p.tr;
      const expected = `${BASE}${path}`;

      it(`${p.label} ${locale.toUpperCase()} emits canonical, og:url, hreflang, and JSON-LD`, async () => {
        renderAt(path, p.Page);

        await waitFor(
          () => expect(document.querySelector('link[rel="canonical"]')).not.toBeNull(),
          { timeout: 4000 },
        );

        expect(attrs('link[rel="canonical"]', 'href')).toContain(expected);
        expect(attrs('meta[property="og:url"]', 'content')).toContain(expected);

        const en = attrs('link[rel="alternate"][hreflang="en"]', 'href');
        const tr = attrs('link[rel="alternate"][hreflang="tr"]', 'href');
        const xd = attrs('link[rel="alternate"][hreflang="x-default"]', 'href');
        expect(en).toContain(`${BASE}${p.en}`);
        expect(tr).toContain(`${BASE}${p.tr}`);
        expect(xd).toContain(`${BASE}${p.en}`);

        const types = jsonLdTypes();
        expect(types, `JSON-LD types: ${types.join(',')}`).toEqual(
          expect.arrayContaining(['WebApplication', 'HowTo', 'FAQPage']),
        );
      });
    }
  }
});
