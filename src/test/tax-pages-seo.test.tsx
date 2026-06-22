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

      it(`${p.label} ${locale.toUpperCase()} emits canonical, og:url, hreflang, JSON-LD, and current-year content`, async () => {
        const { container } = renderAt(path, p.Page);

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

        // Title must advertise the current (2026) tax year, never the stale 2025 label.
        const title = document.title;
        expect(title).toMatch(/2026/);
        expect(title).not.toMatch(/\b2025\b/);

        // BreadcrumbList JSON-LD: the Calculators crumb must point at the
        // locale-correct index (TR → /tr/hesaplayicilar).
        const expectedCalc =
          locale === 'tr'
            ? `${BASE}/tr/hesaplayicilar`
            : `${BASE}/calculators`;
        const breadcrumbItems = Array.from(
          document.querySelectorAll('script[type="application/ld+json"]'),
        )
          .map((s) => {
            try { return JSON.parse(s.textContent ?? ''); } catch { return null; }
          })
          .find((j) => j && j['@type'] === 'BreadcrumbList')?.itemListElement ?? [];
        const calcCrumb = breadcrumbItems.find(
          (it: { name: string }) => /Calculator|Hesapla/i.test(it.name),
        );
        expect(calcCrumb?.item).toBe(expectedCalc);

        // Guard against drift: no '2025' literal in the rendered body for these pages.
        expect(container.textContent ?? '').not.toMatch(/\b2025\b/);
      });
    }
  }
});
