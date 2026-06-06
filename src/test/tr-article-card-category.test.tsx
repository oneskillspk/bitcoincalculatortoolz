import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ArticleCard } from '@/components/learn/ArticleCard';
import type { ArticleMeta } from '@/data/articles';

const article: ArticleMeta = {
  slug: 'sample',
  title: 'Sample',
  metaDescription: 'desc',
  category: 'Basics',
  publishedDate: '2026-01-01',
  readingTime: 5,
  updatedDate: '2026-01-01',
  keywords: [],
};

describe('ArticleCard category label localization', () => {
  it('renders Turkish label on /tr/ routes', () => {
    render(
      <MemoryRouter initialEntries={['/tr/ogrenin']}>
        <ArticleCard article={article} />
      </MemoryRouter>,
    );
    expect(screen.getByText('Temeller')).toBeInTheDocument();
    expect(screen.queryByText('Basics')).not.toBeInTheDocument();
  });

  it('renders English label on /learn routes', () => {
    render(
      <MemoryRouter initialEntries={['/learn']}>
        <ArticleCard article={article} />
      </MemoryRouter>,
    );
    expect(screen.getByText('Basics')).toBeInTheDocument();
  });

  it('maps Market Analysis to Piyasa Analizi', () => {
    render(
      <MemoryRouter initialEntries={['/tr/ogrenin']}>
        <ArticleCard article={{ ...article, category: 'Market Analysis' }} />
      </MemoryRouter>,
    );
    expect(screen.getByText('Piyasa Analizi')).toBeInTheDocument();
  });
});
