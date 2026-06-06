/**
 * ArticleShareButtons — TR share URL.
 *
 * On TR the share URL must point at /tr/ogrenin/<slug>, not /learn/<slug>,
 * so Twitter/LinkedIn share the Turkish article — not the EN counterpart.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ArticleShareButtons } from '@/components/learn/ArticleShareButtons';

describe('ArticleShareButtons TR URL', () => {
  it('shares /tr/ogrenin/<slug> when language=tr', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    render(
      <MemoryRouter initialEntries={['/tr/ogrenin/bitcoin-dca-nedir']}>
        <LanguageProvider>
          <ArticleShareButtons
            title="Bitcoin DCA Nedir?"
            slug="bitcoin-dca-nedir"
            language="tr"
          />
        </LanguageProvider>
      </MemoryRouter>,
    );

    const twitterBtn = screen.getByRole('button', { name: /Twitter/i });
    fireEvent.click(twitterBtn);
    expect(openSpy).toHaveBeenCalledTimes(1);
    const url = openSpy.mock.calls[0][0] as string;
    expect(url).toContain(
      encodeURIComponent('https://bitcoincalculator.tools/tr/ogrenin/bitcoin-dca-nedir'),
    );
    expect(url).not.toContain(
      encodeURIComponent('https://bitcoincalculator.tools/learn/bitcoin-dca-nedir'),
    );
    openSpy.mockRestore();
  });

  it('shares /learn/<slug> when language=en', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    render(
      <MemoryRouter initialEntries={['/learn/what-is-bitcoin-dca']}>
        <LanguageProvider>
          <ArticleShareButtons
            title="Bitcoin DCA Explained"
            slug="what-is-bitcoin-dca"
            language="en"
          />
        </LanguageProvider>
      </MemoryRouter>,
    );

    const twitterBtn = screen.getByRole('button', { name: /Twitter/i });
    fireEvent.click(twitterBtn);
    const url = openSpy.mock.calls[0][0] as string;
    expect(url).toContain(
      encodeURIComponent('https://bitcoincalculator.tools/learn/what-is-bitcoin-dca'),
    );
    openSpy.mockRestore();
  });
});
