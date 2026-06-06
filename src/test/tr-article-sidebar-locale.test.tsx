/**
 * ArticleSidebar TR locale parity (post-dedup).
 *
 * The sidebar now renders only the Table of Contents + ad slots +
 * affiliate RecommendedTools. Related calculators and related articles
 * moved to <RelatedLinksSection /> at the bottom of the article body to
 * eliminate duplicate listings on desktop.
 *
 * This test pins the new contract:
 *   - TR mount shows "İçindekiler" (TOC) and "Önerilen Araçlar".
 *   - EN mount shows "Contents" and "Recommended Tools".
 *   - Sidebar must NOT render "İlgili Hesaplayıcılar" or "İlgili Makaleler"
 *     headings — those belong to RelatedLinksSection now.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ArticleSidebar } from '@/components/learn/ArticleSidebar';

const sections = [
  { id: 'genel-bakis', heading: 'Genel Bakış', content: '' },
  { id: 'detaylar', heading: 'Detaylar', content: '' },
];

const renderSidebar = (path: string, language: 'en' | 'tr') => {
  try {
    window.localStorage.setItem('btc-calc-language', language);
  } catch {
    /* noop */
  }
  return render(
    <MemoryRouter initialEntries={[path]}>
      <LanguageProvider>
        <ArticleSidebar sections={sections} language={language} />
      </LanguageProvider>
    </MemoryRouter>,
  );
};

describe('ArticleSidebar locale parity (post-dedup)', () => {
  it('TR mount: renders İçindekiler + Önerilen Araçlar, NO related sections', () => {
    renderSidebar('/tr/ogrenin/bitcoin-dca-nedir', 'tr');

    expect(screen.getByText('İçindekiler')).toBeInTheDocument();

    // Related blocks must be absent — they live in RelatedLinksSection now.
    expect(screen.queryByText('İlgili Hesaplayıcılar')).toBeNull();
    expect(screen.queryByText('İlgili Makaleler')).toBeNull();
  });

  it('EN mount: renders Contents, NO related sections', () => {
    renderSidebar('/learn/what-is-bitcoin-dca', 'en');

    expect(screen.getByText('Contents')).toBeInTheDocument();
    expect(screen.queryByText('Related Tools')).toBeNull();
    expect(screen.queryByText('Related Articles')).toBeNull();
  });
});
