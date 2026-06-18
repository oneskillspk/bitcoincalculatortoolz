/**
 * ArticleAuthorBox — TR localization.
 *
 * Pins that the author bio block renders fully Turkish copy when the
 * language context is 'tr', and English copy on 'en'. Guards against
 * regressions where the bio leaks English on /tr/ogrenin/* pages.
 */
import { describe, it, expect } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ArticleAuthorBox } from '@/components/learn/ArticleAuthorBox';

const renderAt = (path: string, lang: 'en' | 'tr') => {
  try {
    window.localStorage.setItem('btc-calc-language', lang);
  } catch {
    /* noop */
  }
  return render(
    <MemoryRouter initialEntries={[path]}>
      <LanguageProvider>
        <ArticleAuthorBox />
      </LanguageProvider>
    </MemoryRouter>,
  );
};

describe('ArticleAuthorBox locale parity', () => {
  it('renders full Turkish copy on TR', () => {
    renderAt('/tr/ogrenin/bitcoin-dca-nedir', 'tr');
    expect(screen.getByText('Yazan')).toBeInTheDocument();
    expect(
      screen.getByText(/2013'ten beri Bitcoin yatırımcısı/),
    ).toBeInTheDocument();
    expect(screen.getByText("Bitcoin'de 13+ yıl")).toBeInTheDocument();
    expect(screen.getByText('46 ücretsiz hesaplayıcı geliştirdi')).toBeInTheDocument();
    expect(screen.getByText('Tam biyografiyi oku')).toBeInTheDocument();

    // No English leakage.
    expect(screen.queryByText('Written by')).toBeNull();
    expect(screen.queryByText('Read full bio')).toBeNull();

    // "Read full bio" link must route to TR /tr/hakkimizda (LocalizedLink).
    const links = Array.from(
      document.querySelectorAll('a[href]'),
    ) as HTMLAnchorElement[];
    for (const a of links) {
      const href = a.getAttribute('href') || '';
      expect(href.startsWith('/about')).toBe(false);
    }
    cleanup();
  });

  it('renders English copy on EN', () => {
    renderAt('/learn/what-is-bitcoin-dca', 'en');
    expect(screen.getByText('Written by')).toBeInTheDocument();
    expect(screen.getByText('Read full bio')).toBeInTheDocument();
    expect(screen.queryByText('Yazan')).toBeNull();
  });
});
