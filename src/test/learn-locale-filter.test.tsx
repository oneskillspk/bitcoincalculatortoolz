import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from './utils';
import Learn from '@/pages/Learn';
import { articlesMeta } from '@/data/articles';

/**
 * Regression: the Learn hub's featured hero and grid must respect the active
 * locale. A Turkish-only article (language: 'tr') must NEVER surface on the
 * English /learn page, and vice versa.
 */
describe('Learn page locale filtering', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/learn');
    localStorage.removeItem('language');
  });

  it('excludes Turkish-only articles from the English Learn page', async () => {
    const trOnly = articlesMeta.filter(a => a.language === 'tr');
    expect(trOnly.length).toBeGreaterThan(0); // sanity: TR articles exist

    render(<Learn />);

    // None of the TR-only titles should render anywhere on the English hub
    for (const tr of trOnly) {
      expect(screen.queryByText(tr.title)).toBeNull();
    }
  });

  it('featured hero on English Learn is an English article', () => {
    render(<Learn />);
    const enArticles = articlesMeta.filter(a => (a.language ?? 'en') === 'en');
    const mostRecentEn = enArticles[enArticles.length - 1];
    expect(screen.getAllByText(mostRecentEn.title).length).toBeGreaterThan(0);
  });
});
