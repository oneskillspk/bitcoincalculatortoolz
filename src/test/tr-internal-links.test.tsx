/**
 * Regression guard: every internal <a href> rendered under /tr/* must
 * either be locale-prefixed (start with /tr/), be exactly '/tr', or be
 * external/hash/mailto. Catches future regressions where a contributor
 * imports Link from 'react-router-dom' instead of '@/components/LocalizedLink'.
 */
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from '@/contexts/LanguageContext';

// Components that historically leaked EN internal links on TR.
import { Breadcrumb } from '@/components/Breadcrumb';
import TurkishNotFound from '@/pages/TurkishNotFound';

function renderTr(ui: React.ReactNode, path = '/tr/hesaplayicilar/bitcoin-ya-olsaydi') {
  document.documentElement.lang = 'tr';
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>
        <LanguageProvider>{ui}</LanguageProvider>
      </MemoryRouter>
    </HelmetProvider>,
  );
}

function isAcceptable(href: string | null): boolean {
  if (!href) return true;
  if (href.startsWith('http://') || href.startsWith('https://')) return true;
  if (href.startsWith('mailto:') || href.startsWith('tel:')) return true;
  if (href.startsWith('#')) return true;
  if (href === '/tr' || href === '/tr/') return true;
  if (href.startsWith('/tr/')) return true;
  return false;
}

describe('TR internal-link guard', () => {
  it('Breadcrumb on /tr/* never emits bare EN hrefs', () => {
    const { container } = renderTr(
      <Breadcrumb
        items={[
          { label: 'Hesaplayıcılar', href: '/calculators' },
          { label: 'Ya Şöyle Olsaydı' },
        ]}
      />,
    );
    const anchors = Array.from(container.querySelectorAll('a'));
    expect(anchors.length).toBeGreaterThan(0);
    for (const a of anchors) {
      expect(
        isAcceptable(a.getAttribute('href')),
        `Bad TR href: ${a.getAttribute('href')}`,
      ).toBe(true);
    }
  });

  it('TurkishNotFound emits only /tr/* internal hrefs', () => {
    const { container } = renderTr(<TurkishNotFound />, '/tr/nope');
    const anchors = Array.from(container.querySelectorAll('a'));
    for (const a of anchors) {
      expect(
        isAcceptable(a.getAttribute('href')),
        `Bad TR href: ${a.getAttribute('href')}`,
      ).toBe(true);
    }
  });
});
