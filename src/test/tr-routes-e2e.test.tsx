import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import userEvent from '@testing-library/user-event';
import { Breadcrumb } from '@/components/Breadcrumb';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { LocaleMeta } from '@/components/LocaleMeta';
import { GlobalHreflang } from '@/components/GlobalHreflang';
import TurkishNotFound from '@/pages/TurkishNotFound';
import { EN_TO_TR } from '@/utils/localizedRoutes';

const PathProbe = () => {
  const { pathname } = useLocation();
  return <div data-testid="pathname">{pathname}</div>;
};

const renderAt = (path: string, ui: React.ReactNode) =>
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>{ui}</MemoryRouter>
    </HelmetProvider>
  );

describe('Turkish breadcrumb / pagination localization', () => {
  it('breadcrumb uses Turkish aria-labels and /tr/ home href on /tr routes', () => {
    renderAt(
      '/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi',
      <Breadcrumb items={[{ label: 'DCA' }]} />
    );
    expect(screen.getByLabelText('Sayfa yolu')).toBeInTheDocument();
    const home = screen.getByLabelText('Ana Sayfa') as HTMLAnchorElement;
    expect(home.getAttribute('href')).toBe('/tr/');
  });

  it('breadcrumb stays English on /en routes', () => {
    renderAt('/calculators/dca', <Breadcrumb items={[{ label: 'DCA' }]} />);
    expect(screen.getByLabelText('Breadcrumb')).toBeInTheDocument();
    expect((screen.getByLabelText('Home') as HTMLAnchorElement).getAttribute('href')).toBe('/');
  });

  it('pagination uses Turkish strings on /tr', () => {
    renderAt(
      '/tr/ogrenin',
      <Pagination>
        <PaginationContent>
          <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
          <PaginationItem><PaginationEllipsis /></PaginationItem>
          <PaginationItem><PaginationNext href="#" /></PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    expect(screen.getByLabelText('sayfalama')).toBeInTheDocument();
    expect(screen.getByLabelText('Önceki sayfaya git')).toBeInTheDocument();
    expect(screen.getByLabelText('Sonraki sayfaya git')).toBeInTheDocument();
    expect(screen.getByText('Önceki')).toBeInTheDocument();
    expect(screen.getByText('Sonraki')).toBeInTheDocument();
    expect(screen.getByText('Daha fazla sayfa')).toBeInTheDocument();
  });
});

describe('Turkish internal links keep /tr prefix', () => {
  it('every EN→TR mapped TR path begins with /tr', () => {
    for (const tr of Object.values(EN_TO_TR)) {
      expect(tr.startsWith('/tr')).toBe(true);
    }
  });

  it('clicking a /tr internal link lands on a /tr destination', async () => {
    const user = userEvent.setup();
    renderAt(
      '/tr/',
      <>
        <Link to="/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi">DCA</Link>
        <Routes>
          <Route path="/tr/*" element={<PathProbe />} />
        </Routes>
      </>
    );
    await user.click(screen.getByText('DCA'));
    expect(screen.getByTestId('pathname').textContent).toMatch(/^\/tr\//);
  });
});

describe('Hreflang + canonical alternates on /tr pages', () => {
  it('emits en, tr, x-default alternates on /tr/hesaplayicilar/bitcoin-dca-hesaplayicisi', async () => {
    renderAt('/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi', <GlobalHreflang />);
    await waitFor(() => {
      const links = Array.from(document.querySelectorAll('link[rel="alternate"]'));
      const langs = links.map((l) => l.getAttribute('hreflang'));
      expect(langs).toEqual(expect.arrayContaining(['en', 'tr', 'x-default']));
    });
    const links = Array.from(document.querySelectorAll('link[rel="alternate"]'));
    const en = links.find((l) => l.getAttribute('hreflang') === 'en')!;
    const tr = links.find((l) => l.getAttribute('hreflang') === 'tr')!;
    const xd = links.find((l) => l.getAttribute('hreflang') === 'x-default')!;
    expect(en.getAttribute('href')).toBe('https://bitcoincalculator.tools/calculators/dca');
    expect(tr.getAttribute('href')).toBe(
      'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi'
    );
    expect(xd.getAttribute('href')).toBe(en.getAttribute('href'));
  });

  it('LocaleMeta sets html lang=tr and og:locale=tr_TR on /tr', async () => {
    renderAt('/tr/hakkimizda', <LocaleMeta />);
    await waitFor(() => {
      expect(document.documentElement.getAttribute('lang')).toBe('tr');
    });
    const og = document.querySelector('meta[property="og:locale"]');
    expect(og?.getAttribute('content')).toBe('tr_TR');
  });
});

describe('TurkishNotFound regression', () => {
  it('renders Turkish 404 content and noindex metadata', async () => {
    renderAt('/tr/this-route-does-not-exist', <TurkishNotFound />);
    expect(screen.getByText('Sayfa Bulunamadı')).toBeInTheDocument();
    expect(screen.getByText(/Ana Sayfaya Dön/)).toBeInTheDocument();
    expect(screen.getByText(/Hesaplayıcıları Görüntüle/)).toBeInTheDocument();
    await waitFor(() => {
      const robots = document.querySelector('meta[name="robots"]');
      expect(robots?.getAttribute('content')).toBe('noindex, nofollow');
    });
    const canonical = document.querySelector('link[rel="canonical"]');
    expect(canonical?.getAttribute('href')).toBe('https://bitcoincalculator.tools/tr/404');
    expect(document.documentElement.getAttribute('lang')).toBe('tr');
  });
});
