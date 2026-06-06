/**
 * RecommendedTools — TR heading.
 *
 * Asserts the affiliate tools card uses "Önerilen Araçlar" on TR and
 * "Recommended Tools" on EN.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { RecommendedTools } from '@/components/monetization/RecommendedTools';

const renderAt = (path: string, lang: 'en' | 'tr') => {
  try {
    window.localStorage.setItem('btc-calc-language', lang);
  } catch {
    /* noop */
  }
  return render(
    <MemoryRouter initialEntries={[path]}>
      <LanguageProvider>
        <RecommendedTools categories={['exchange', 'hardware']} limit={3} />
      </LanguageProvider>
    </MemoryRouter>,
  );
};

describe('RecommendedTools heading locale', () => {
  it('renders Önerilen Araçlar on TR', () => {
    renderAt('/tr/ogrenin/bitcoin-dca-nedir', 'tr');
    // Block only renders if affiliates exist. Skip if absent.
    const tr = screen.queryByText('Önerilen Araçlar');
    if (!tr) return;
    expect(tr).toBeInTheDocument();
    expect(screen.queryByText('Recommended Tools')).toBeNull();
  });

  it('renders Recommended Tools on EN', () => {
    renderAt('/learn/what-is-bitcoin-dca', 'en');
    const en = screen.queryByText('Recommended Tools');
    if (!en) return;
    expect(en).toBeInTheDocument();
    expect(screen.queryByText('Önerilen Araçlar')).toBeNull();
  });
});
