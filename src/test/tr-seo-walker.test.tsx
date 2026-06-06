/**
 * Phase F — TR SEO walker.
 *
 * For every entry in EN_TO_TR, mount LocaleMeta + GlobalHreflang at the TR
 * path and assert the multilingual SEO infrastructure emits the right tags:
 *   - <html lang="tr">
 *   - <meta property="og:locale" content="tr_TR">
 *   - <meta property="og:locale:alternate" content="en_US">
 *   - <link rel="alternate" hreflang="en|tr|x-default"> with absolute URLs
 *     that match EN_TO_TR exactly.
 *
 * Rendering only the SEO components (not the page bodies) keeps the walker
 * fast and deterministic — per-page <title>/JSON-LD assertions live in the
 * route-specific suites.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LocaleMeta } from '@/components/LocaleMeta';
import { GlobalHreflang } from '@/components/GlobalHreflang';
import { EN_TO_TR } from '@/utils/localizedRoutes';

const BASE = 'https://bitcoincalculator.tools';

const renderAt = (path: string) =>
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>
        <LocaleMeta />
        <GlobalHreflang />
      </MemoryRouter>
    </HelmetProvider>,
  );

const trEntries = Object.entries(EN_TO_TR).map(([en, tr]) => ({ en, tr }));

describe('Phase F — TR SEO walker', () => {
  beforeEach(() => {
    // Reset between tests so Helmet doesn't leak alternates across cases.
    document.querySelectorAll('link[rel="alternate"]').forEach((n) => n.remove());
    document.querySelectorAll('meta[property^="og:locale"]').forEach((n) => n.remove());
    document.documentElement.removeAttribute('lang');
  });

  it.each(trEntries)('$tr emits lang=tr, og:locale=tr_TR, hreflang triplet → $en', async ({ en, tr }) => {
    renderAt(tr);

    await waitFor(() => {
      expect(document.documentElement.getAttribute('lang')).toBe('tr');
    });

    const og = document.querySelector('meta[property="og:locale"]');
    const ogAlt = document.querySelector('meta[property="og:locale:alternate"]');
    expect(og?.getAttribute('content')).toBe('tr_TR');
    expect(ogAlt?.getAttribute('content')).toBe('en_US');

    const links = Array.from(document.querySelectorAll('link[rel="alternate"]'));
    const enLink = links.find((l) => l.getAttribute('hreflang') === 'en');
    const trLink = links.find((l) => l.getAttribute('hreflang') === 'tr');
    const xd = links.find((l) => l.getAttribute('hreflang') === 'x-default');

    expect(enLink?.getAttribute('href')).toBe(`${BASE}${en}`);
    // GlobalHreflang re-emits the TR path verbatim from location, so /tr/
    // and /tr (root) both stay as their EN_TO_TR value.
    const expectedTr = tr === '/tr/' ? '/tr/' : tr;
    expect(trLink?.getAttribute('href')).toBe(`${BASE}${expectedTr}`);
    expect(xd?.getAttribute('href')).toBe(enLink?.getAttribute('href'));
  });

  it('emits og:locale=en_US on canonical EN routes', async () => {
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={['/calculators/dca']}>
          <LocaleMeta />
        </MemoryRouter>
      </HelmetProvider>,
    );
    await waitFor(() => {
      expect(document.documentElement.getAttribute('lang')).toBe('en');
    });
    const og = document.querySelector('meta[property="og:locale"]');
    expect(og?.getAttribute('content')).toBe('en_US');
  });
});
