import { describe, it, expect } from 'vitest';
import { getLocalizedPath, getArticleHref } from '../localizedRoutes';

describe('TR article href resolution', () => {
  it('maps EN-shaped paths carrying a Turkish slug to the TR mirror', () => {
    expect(getLocalizedPath('/learn/1-bitcoin-kac-dolar', 'tr')).toBe(
      '/tr/ogrenin/1-bitcoin-kac-dolar',
    );
    expect(getLocalizedPath('/calculators/bitcoin-dca-hesaplayicisi', 'tr')).toBe(
      '/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi',
    );
  });

  it('still maps canonical EN paths', () => {
    expect(getLocalizedPath('/learn/how-much-is-one-bitcoin-worth', 'tr')).toBe(
      '/tr/ogrenin/1-bitcoin-kac-dolar',
    );
  });

  it('keeps the homepage fallback for genuinely unknown paths', () => {
    expect(getLocalizedPath('/learn/does-not-exist', 'tr')).toBe('/tr/');
  });

  it('getArticleHref builds locale-correct article links', () => {
    expect(getArticleHref('bitcoin-iyi-bir-yatirim-mi', 'tr')).toBe(
      '/tr/ogrenin/bitcoin-iyi-bir-yatirim-mi',
    );
    expect(getArticleHref('is-bitcoin-a-good-investment', 'en')).toBe(
      '/learn/is-bitcoin-a-good-investment',
    );
    expect(getArticleHref('is-bitcoin-a-good-investment', 'tr')).toBe(
      '/tr/ogrenin/bitcoin-iyi-bir-yatirim-mi',
    );
  });
});
