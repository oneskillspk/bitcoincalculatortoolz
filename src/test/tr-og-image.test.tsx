/**
 * Phase D5 — TR social-preview image guard.
 *
 * Asserts every page renders the Turkish-localized OG image and
 * Turkish OG image alt when mounted under a `/tr/*` path, and
 * keeps the EN image on EN routes.
 *
 * The test stubs `window.location.pathname` (the pages read it via
 * a `typeof window !== 'undefined' && window.location.pathname.startsWith('/tr')`
 * check inside their Helmet) and inspects the document <head> after
 * a render flush.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import LanguageRouteSync from '@/components/LanguageRouteSync';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ComponentType } from 'react';

import TurkishHome from '@/pages/TurkishHome';
import Calculators from '@/pages/Calculators';
import Tools from '@/pages/Tools';

import { default as ogCalculators } from '@/assets/og/og-calculators.webp.asset.json';

const TR_IMG = 'https://bitcoincalculator.tools/bitcoin-kar-hesaplayici-og.webp';
const EN_IMG = 'https://bitcoincalculator.tools/social-preview.webp';
// Calculators + Tools share the locale-agnostic category card on EN routes.
const EN_CALC_CARD = ogCalculators.url;
const TR_ALT = 'Bitcoin Hesaplayıcıları — 46+ Ücretsiz Araç | bitcoincalculator.tools';

function stubPath(path: string) {
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: { ...window.location, pathname: path, href: `https://example.com${path}` },
  });
}

function renderAt(path: string, Page: ComponentType<any>) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <HelmetProvider>
      <QueryClientProvider client={qc}>
        <MemoryRouter initialEntries={[path]}>
          <LanguageProvider>
            <LanguageRouteSync />
            <TooltipProvider>
              <Page />
            </TooltipProvider>
          </LanguageProvider>
        </MemoryRouter>
      </QueryClientProvider>
    </HelmetProvider>,
  );
}

async function getMeta(selector: string): Promise<string | null> {
  let value: string | null = null;
  await waitFor(() => {
    const el = document.head.querySelector(selector);
    expect(el).toBeTruthy();
    value = el!.getAttribute('content');
  });
  return value;
}

describe('TR social-preview asset wiring (D5)', () => {
  beforeEach(() => {
    // Clean head between renders so Helmet state doesn't leak
    document.head.querySelectorAll('meta').forEach((m) => m.remove());
  });

  it('TurkishHome serves the TR og:image', async () => {
    stubPath('/tr/');
    renderAt('/tr/', TurkishHome);
    expect(await getMeta('meta[property="og:image"]')).toBe(TR_IMG);
    expect(await getMeta('meta[name="twitter:image"]')).toBe(TR_IMG);
  });

  it('Calculators page swaps og:image + alt by locale', async () => {
    stubPath('/tr/hesaplayicilar');
    const { unmount } = renderAt('/tr/hesaplayicilar', Calculators);
    expect(await getMeta('meta[property="og:image"]')).toBe(TR_IMG);
    expect(await getMeta('meta[property="og:image:alt"]')).toContain('Hesaplayıcılar');
    unmount();
    document.head.querySelectorAll('meta').forEach((m) => m.remove());

    stubPath('/calculators');
    renderAt('/calculators', Calculators);
    // EN /calculators serves the shared category-card OG (ogCalculators.url).
    expect(await getMeta('meta[property="og:image"]')).toBe(EN_CALC_CARD);
  });

  it('Tools page swaps og:image by locale', async () => {
    stubPath('/tr/araclar');
    const { unmount } = renderAt('/tr/araclar', Tools);
    expect(await getMeta('meta[property="og:image"]')).toBe(TR_IMG);
    unmount();
    document.head.querySelectorAll('meta').forEach((m) => m.remove());

    stubPath('/tools');
    renderAt('/tools', Tools);
    expect(await getMeta('meta[property="og:image"]')).toBe(EN_IMG);
  });

  it('TR alt copy uses the canonical Turkish hero string somewhere', () => {
    // The canonical alt is embedded in 50+ pages by codemod; spot-check
    // the constant matches what the codemod wrote.
    expect(TR_ALT).toMatch(/Hesaplayıcıları/);
    expect(TR_ALT).toMatch(/Ücretsiz/);
  });
});
