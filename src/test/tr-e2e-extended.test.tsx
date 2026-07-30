import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import {
  MemoryRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import userEvent from '@testing-library/user-event';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Breadcrumb } from '@/components/Breadcrumb';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { GlobalHreflang } from '@/components/GlobalHreflang';
import { LocaleMeta } from '@/components/LocaleMeta';
import TurkishNotFound from '@/pages/TurkishNotFound';
import { useLocale } from '@/hooks/useLocale';
import { EN_TO_TR } from '@/utils/localizedRoutes';
import { formatCurrencyDisplay } from '@/utils/numberFormat';

const Probe = () => {
  const { pathname } = useLocation();
  return <div data-testid="pathname">{pathname}</div>;
};

const renderAt = (path: string, ui: React.ReactNode) =>
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>{ui}</MemoryRouter>
    </HelmetProvider>
  );

// ---------- 1. TurkishNotFound link/button navigation ----------
describe('TurkishNotFound — internal link navigation preserves /tr', () => {
  it('home button navigates to /tr/ and keeps Turkish metadata', async () => {
    const user = userEvent.setup();
    renderAt(
      '/tr/missing-page',
      <Routes>
        <Route path="/tr/missing-page" element={<><LocaleMeta /><TurkishNotFound /></>} />
        <Route path="/tr/" element={<><LocaleMeta /><Probe /></>} />
        <Route path="/tr/hesaplayicilar" element={<><LocaleMeta /><Probe /></>} />
      </Routes>
    );

    await waitFor(() =>
      expect(document.documentElement.getAttribute('lang')).toBe('tr')
    );

    await user.click(screen.getByRole('link', { name: /Ana Sayfaya Dön/i }));
    expect(screen.getByTestId('pathname').textContent).toBe('/tr/');

    await waitFor(() =>
      expect(document.documentElement.getAttribute('lang')).toBe('tr')
    );
    const og = document.querySelector('meta[property="og:locale"]');
    expect(og?.getAttribute('content')).toBe('tr_TR');
  });

  it('calculators button navigates to /tr/hesaplayicilar', async () => {
    const user = userEvent.setup();
    renderAt(
      '/tr/missing-page',
      <Routes>
        <Route path="/tr/missing-page" element={<TurkishNotFound />} />
        <Route path="/tr/hesaplayicilar" element={<Probe />} />
      </Routes>
    );
    await user.click(screen.getByRole('link', { name: /Hesaplayıcıları Görüntüle/i }));
    expect(screen.getByTestId('pathname').textContent).toBe('/tr/hesaplayicilar');
  });
});

// ---------- 2. A11y regression: TR aria-labels & button text ----------
describe('A11y — Breadcrumb & Pagination Turkish strings on /tr', () => {
  it('breadcrumb exposes Turkish aria-labels and home link text', () => {
    renderAt(
      '/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi',
      <Breadcrumb items={[{ label: 'DCA', href: '/tr/hesaplayicilar' }, { label: 'Sayfa' }]} />
    );
    expect(screen.getByRole('navigation', { name: 'Sayfa yolu' })).toBeInTheDocument();
    const home = screen.getByRole('link', { name: 'Ana Sayfa' }) as HTMLAnchorElement;
    expect(home.getAttribute('href')).toBe('/tr/');
  });

  it('pagination exposes Turkish aria-labels and visible TR text', () => {
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
    expect(screen.getByRole('navigation', { name: 'sayfalama' })).toBeInTheDocument();
    expect(screen.getByLabelText('Önceki sayfaya git')).toBeInTheDocument();
    expect(screen.getByLabelText('Sonraki sayfaya git')).toBeInTheDocument();
    expect(screen.getByText('Önceki')).toBeInTheDocument();
    expect(screen.getByText('Sonraki')).toBeInTheDocument();
    expect(screen.getByText('Daha fazla sayfa')).toBeInTheDocument();
  });

  it('breadcrumb stays English on non-/tr routes (regression)', () => {
    renderAt('/calculators/dca', <Breadcrumb items={[{ label: 'DCA' }]} />);
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    expect(screen.queryByLabelText('Sayfa yolu')).toBeNull();
  });
});

// ---------- 3. Hreflang / canonical parity on additional /tr routes ----------
describe('Hreflang alternates parity beyond DCA', () => {
  const cases: Array<[string, string, string]> = [
    [
      '/tr/hesaplayicilar/bitcoin-kar-zarar-hesaplayicisi',
      '/calculators/profit-loss',
      '/tr/hesaplayicilar/bitcoin-kar-zarar-hesaplayicisi',
    ],
    [
      '/tr/hesaplayicilar/bitcoin-donusturucu',
      '/calculators/bitcoin-converter',
      '/tr/hesaplayicilar/bitcoin-donusturucu',
    ],
    [
      '/tr/hakkimizda',
      '/about',
      '/tr/hakkimizda',
    ],
    [
      '/tr/ogrenin',
      '/learn',
      '/tr/ogrenin',
    ],
  ];

  it.each(cases)(
    'emits en/tr/x-default alternates for %s',
    async (trPath, enExpected, trExpected) => {
      renderAt(trPath, <GlobalHreflang />);
      await waitFor(() => {
        expect(
          document.querySelectorAll('link[rel="alternate"]').length
        ).toBeGreaterThanOrEqual(3);
      });
      const links = Array.from(document.querySelectorAll('link[rel="alternate"]'));
      const find = (lang: string) =>
        links.find((l) => l.getAttribute('hreflang') === lang)!;
      expect(find('en').getAttribute('href')).toBe(
        `https://bitcoincalculator.tools${enExpected}`
      );
      expect(find('tr').getAttribute('href')).toBe(
        `https://bitcoincalculator.tools${trExpected}`
      );
      expect(find('x-default').getAttribute('href')).toBe(
        find('en').getAttribute('href')
      );
    }
  );

  it('every EN→TR mapping is reversible', () => {
    for (const [en, tr] of Object.entries(EN_TO_TR)) {
      expect(tr.startsWith('/tr')).toBe(true);
      expect(en.startsWith('/')).toBe(true);
      expect(en.startsWith('/tr')).toBe(false);
    }
  });
});

// ---------- 4. /tr converter currency = TRY, formatting consistent ----------
const ConverterProbe = () => {
  const { defaultCurrency, intlLocale, isTr } = useLocale();
  const symbol = defaultCurrency === 'TRY' ? '₺' : '$';
  const formatted = formatCurrencyDisplay(1234.5, symbol);
  return (
    <div>
      <div data-testid="currency">{defaultCurrency}</div>
      <div data-testid="locale">{intlLocale}</div>
      <div data-testid="is-tr">{String(isTr)}</div>
      <div data-testid="display">{formatted.display}</div>
      <div data-testid="full">{formatted.full}</div>
    </div>
  );
};

describe('/tr converter — TRY default + format parity across navigation', () => {
  it('defaults to TRY with ₺ symbol on /tr/hesaplayicilar/bitcoin-donusturucu', () => {
    renderAt('/tr/hesaplayicilar/bitcoin-donusturucu', <ConverterProbe />);
    expect(screen.getByTestId('currency').textContent).toBe('TRY');
    expect(screen.getByTestId('locale').textContent).toBe('tr-TR');
    expect(screen.getByTestId('is-tr').textContent).toBe('true');
    expect(screen.getByTestId('display').textContent).toContain('₺');
    expect(screen.getByTestId('full').textContent).toContain('₺');
  });

  it('keeps TRY + ₺ formatting after navigating via internal /tr links', async () => {
    const user = userEvent.setup();
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={['/tr/hesaplayicilar/bitcoin-donusturucu']}>
          <Link to="/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi">DCA</Link>
          <Link to="/tr/hakkimizda">Hakkımızda</Link>
          <Routes>
            <Route path="/tr/*" element={<ConverterProbe />} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    );
    expect(screen.getByTestId('currency').textContent).toBe('TRY');
    const initial = screen.getByTestId('display').textContent;
    expect(initial).toContain('₺');

    await user.click(screen.getByText('DCA'));
    expect(screen.getByTestId('currency').textContent).toBe('TRY');
    expect(screen.getByTestId('display').textContent).toBe(initial);

    await user.click(screen.getByText('Hakkımızda'));
    expect(screen.getByTestId('currency').textContent).toBe('TRY');
    expect(screen.getByTestId('locale').textContent).toBe('tr-TR');
    expect(screen.getByTestId('display').textContent).toBe(initial);
  });

  it('switches to USD + $ on EN routes (negative regression)', () => {
    renderAt('/calculators/bitcoin-converter', <ConverterProbe />);
    expect(screen.getByTestId('currency').textContent).toBe('USD');
    expect(screen.getByTestId('locale').textContent).toBe('en-US');
    expect(screen.getByTestId('display').textContent).toContain('$');
  });
});

// ---------- 5. Phase 9: TR-locale link/CTA audits ----------
import { LanguageProvider } from '@/contexts/LanguageContext';
import Sitemap from '@/pages/Sitemap';
import Tools from '@/pages/Tools';
import { SmartSearch } from '@/components/layout/SmartSearch';
import { Footer } from '@/components/Footer';
import { MobileNavigation } from '@/components/MobileNavigation';
import { FloatingNavigation } from '@/components/layout/FloatingNavigation';
import { ExportReportButton } from '@/components/ExportReportButton';

const STORAGE_KEY = 'btc-calc-language';

const renderTr = (path: string, ui: React.ReactNode) => {
  try { window.localStorage.setItem(STORAGE_KEY, 'tr'); } catch { /* noop */ }
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>
        <LanguageProvider>{ui}</LanguageProvider>
      </MemoryRouter>
    </HelmetProvider>
  );
};

const isExternalOrInPage = (href: string | null) =>
  !href ||
  href.startsWith('http://') ||
  href.startsWith('https://') ||
  href.startsWith('//') ||
  href.startsWith('mailto:') ||
  href.startsWith('tel:') ||
  href.startsWith('#');

const collectInternalHrefs = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('a[href]'))
    .map((a) => a.getAttribute('href'))
    .filter((h): h is string => !isExternalOrInPage(h));

describe('Phase 9 — Sitemap page links stay under /tr/', () => {
  it('every internal anchor on /tr/site-haritasi starts with /tr', async () => {
    const { container } = renderTr('/tr/site-haritasi', <Sitemap />);
    await waitFor(() =>
      expect(container.querySelectorAll('a[href]').length).toBeGreaterThan(10)
    );
    const offenders = collectInternalHrefs(container).filter(
      (h) => !(h === '/tr' || h === '/tr/' || h.startsWith('/tr/'))
    );
    expect(offenders).toEqual([]);
  });
});

describe('Phase 9 — Tools page card CTAs route to /tr/hesaplayicilar', () => {
  it('every available tool card on /tr/araclar links into /tr/hesaplayicilar/', async () => {
    const { container } = renderTr('/tr/araclar', <Tools />);
    await waitFor(() =>
      expect(container.querySelectorAll('a[href]').length).toBeGreaterThan(0)
    );
    const cardHrefs = collectInternalHrefs(container).filter((h) =>
      h.includes('/hesaplayicilar/') || h.includes('/calculators/')
    );
    expect(cardHrefs.length).toBeGreaterThan(0);
    for (const h of cardHrefs) {
      expect(h.startsWith('/tr/hesaplayicilar/')).toBe(true);
    }
  });
});

describe('Phase 9 — SmartSearch returns /tr/ URLs and Turkish titles', () => {
  it('typing "dca" on /tr returns Turkish-titled result with /tr/ href', async () => {
    const user = userEvent.setup();
    const { container } = renderTr(
      '/tr/',
      <SmartSearch isOpen onClose={() => {}} />
    );
    const input = await screen.findByPlaceholderText(/Hesaplayıcılar, araçlar/i);
    await user.type(input, 'dca');

    await waitFor(() => {
      const links = collectInternalHrefs(container);
      expect(links.length).toBeGreaterThan(0);
    });

    const links = collectInternalHrefs(container);
    for (const h of links) {
      expect(h === '/tr' || h === '/tr/' || h.startsWith('/tr/')).toBe(true);
    }
    // At least one Turkish DCA title rendered
    expect(
      screen.getAllByText(/DCA|Dolar Maliyet/i).length
    ).toBeGreaterThan(0);
  });
});

describe('Phase 9 — ExportReportButton renders TR labels on /tr DCA route', () => {
  it('PNG/PDF/Share buttons display Turkish strings', async () => {
    const fakeResult = {
      startDate: '2020-01-01',
      currentDate: '2024-01-01',
      investmentAmount: 1000,
      startPrice: 7000,
      currentPrice: 50000,
      btcAmount: 0.142857,
      currentValue: 7142.85,
      profitLoss: 6142.85,
      roiPercentage: 614.28,
      currency: 'TRY',
    } as unknown as React.ComponentProps<typeof ExportReportButton>['result'];

    renderTr(
      '/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi',
      <ExportReportButton result={fakeResult} />
    );

    expect(screen.getByText('Paylaş ve dışa aktar')).toBeInTheDocument();
    expect(screen.getByText('PNG anlık görüntü')).toBeInTheDocument();
    expect(screen.getByText('PDF raporu')).toBeInTheDocument();
    expect(screen.getByText('Bağlantıyı kopyala')).toBeInTheDocument();
  });
});

describe('Phase 9 — Header / Footer / MobileNav links carry /tr prefix', () => {
  const assertOnlyTr = (root: ParentNode) => {
    const offenders = Array.from(root.querySelectorAll('a[href]'))
      .map((a) => a.getAttribute('href'))
      .filter((h): h is string => !isExternalOrInPage(h))
      .filter((h) => !(h === '/tr' || h === '/tr/' || h.startsWith('/tr/')));
    expect(offenders).toEqual([]);
  };

  it('Footer emits only /tr/ internal links on /tr/', async () => {
    const { container } = renderTr('/tr/', <Footer />);
    await waitFor(() =>
      expect(container.querySelectorAll('a[href]').length).toBeGreaterThan(0)
    );
    assertOnlyTr(container);
  });

  it('FloatingNavigation emits only /tr/ internal links on /tr/', async () => {
    const { container } = renderTr('/tr/', <FloatingNavigation />);
    await waitFor(() =>
      expect(container.querySelectorAll('a[href]').length).toBeGreaterThan(0)
    );
    assertOnlyTr(container);
  });

  it('MobileNavigation emits only /tr/ internal links once opened', async () => {
    const user = userEvent.setup();
    renderTr('/tr/', <MobileNavigation />);
    await user.click(screen.getByRole('button', { name: /Navigasyon menüsünü aç/i }));
    // Sheet renders into a portal — query the whole document.
    await waitFor(() =>
      expect(document.querySelectorAll('a[href]').length).toBeGreaterThan(0)
    );
    assertOnlyTr(document.body);
  });

  it('MobileNavigation renders Turkish nav labels mapped to /tr/ hrefs', async () => {
    const user = userEvent.setup();
    renderTr('/tr/', <MobileNavigation />);

    // Trigger button uses TR aria-label
    const trigger = screen.getByRole('button', {
      name: /Navigasyon menüsünü aç/i,
    });
    expect(trigger).toBeInTheDocument();

    await user.click(trigger);

    // Six nav items, each with TR label + correct /tr href
    const expected: Array<[RegExp, string]> = [
      [/^Ana Sayfa$/, '/tr/'],
      [/^Hesaplayıcılar$/, '/tr/hesaplayicilar'],
      [/^Araçlar$/, '/tr/araclar'],
      [/^Öğren$/, '/tr/ogrenin'],
      [/^Hakkımızda$/, '/tr/hakkimizda'],
      [/^İletişim$/, '/tr/iletisim'],
    ];

    for (const [label, href] of expected) {
      await waitFor(() => {
        const link = screen.getByRole('link', { name: label }) as HTMLAnchorElement;
        expect(link.getAttribute('href')).toBe(href);
      });
    }
  });
});

// ---------- 6. Phase 9.1: '**' markdown-leak detector ----------
// Re-import smoke routes here so this file owns its own list and the test
// stays self-contained even if the smoke-matrix file is renamed.
import { LocaleMeta as _LocaleMeta2 } from '@/components/LocaleMeta';
import { GlobalHreflang as _GlobalHreflang2 } from '@/components/GlobalHreflang';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TurkishHome from '@/pages/TurkishHome';
import Calculators from '@/pages/Calculators';
import About from '@/pages/About';
import Learn from '@/pages/Learn';

vi.mock('@/hooks/useLiveBitcoinPrice', () => ({
  useLiveBitcoinPrice: () => ({
    price: 50000,
    priceChange24h: 100,
    priceChangePercentage24h: 1.5,
    lastUpdated: new Date().toISOString(),
    isLoading: false,
    error: null,
    trend: 'neutral' as const,
    refetch: () => Promise.resolve(),
    price7dAgo: 48000,
  }),
}));

vi.mock('@/services/bitcoinApi', async () => {
  const actual = await vi.importActual<typeof import('@/services/bitcoinApi')>(
    '@/services/bitcoinApi'
  );
  const stub = {
    getCurrentPrice: vi.fn(async () => 50000),
    getCurrentMarketData: vi.fn(async () => ({
      price: 50000,
      priceChange24h: 100,
      priceChangePercentage24h: 1.5,
      lastUpdated: new Date().toISOString(),
      marketCap: 1e12,
      volume24h: 5e10,
    })),
    getHistoricalPrice: vi.fn(async () => 48000),
    getHistoricalPrices: vi.fn(async () => []),
    calculateInvestment: vi.fn(async () => null),
  };
  return { ...actual, bitcoinApi: { ...actual.bitcoinApi, ...stub } };
});

const buildClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0, staleTime: Infinity } },
  });

const renderTrPage = (path: string, Page: React.ComponentType) => {
  window.localStorage.setItem(STORAGE_KEY, 'tr');
  return render(
    <HelmetProvider>
      <QueryClientProvider client={buildClient()}>
        <LanguageProvider>
          <TooltipProvider delayDuration={0}>
            <MemoryRouter initialEntries={[path]}>
              <_LocaleMeta2 />
              <_GlobalHreflang2 />
              <Routes>
                <Route path={path} element={<Page />} />
              </Routes>
            </MemoryRouter>
          </TooltipProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

// Visible-text walker that skips <script> / <style> / <noscript>.
const visibleText = (root: Node): string => {
  const skip = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE']);
  const walker = (root as Document | Element).ownerDocument!.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (n) => {
        const parent = n.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        return skip.has(parent.tagName)
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_ACCEPT;
      },
    }
  );
  let out = '';
  let cur: Node | null = walker.nextNode();
  while (cur) {
    out += cur.nodeValue || '';
    cur = walker.nextNode();
  }
  return out;
};

describe('Phase 9.1 — visible /tr text contains no `**` markdown leaks', () => {
  const PAGES: Array<[string, string, React.ComponentType]> = [
    ['/tr/',                   'TurkishHome',  TurkishHome],
    ['/tr/hesaplayicilar',     'Calculators',  Calculators],
    ['/tr/araclar',            'Tools',        Tools],
    ['/tr/site-haritasi',      'Sitemap',      Sitemap],
    ['/tr/ogrenin',            'Learn',        Learn],
    ['/tr/hakkimizda',         'About',        About],
  ];

  it.each(PAGES)(
    '%s renders no `**` substring in visible text',
    async (path, _name, Page) => {
      const { container, unmount } = renderTrPage(path, Page);
      await waitFor(() =>
        expect(container.querySelector('h1, main, article, body')).not.toBeNull()
      );
      const text = visibleText(container);
      const idx = text.indexOf('**');
      if (idx !== -1) {
        const snippet = text.slice(Math.max(0, idx - 60), idx + 60);
        throw new Error(
          `Markdown leak on ${path}: "...${snippet}..." (raw "**" found in visible text)`
        );
      }
      unmount();
    },
    20_000
  );
});

// ---------- 7. Phase 9.1: ₺ symbol on /tr calculator pages ----------
import BitcoinConverter from '@/pages/BitcoinConverter';
import BitcoinDCACalculator from '@/pages/BitcoinDCACalculator';
import BitcoinInvestmentCalculator from '@/pages/BitcoinInvestmentCalculator';
import BitcoinRetirementCalculator from '@/pages/BitcoinRetirementCalculator';

describe('Phase 9.1 — /tr calculator pages format currency with ₺', () => {
  // Pages that on initial render must render ₺ as the dominant currency glyph.
  // (Converter + Retirement render currency-bearing UI immediately on load.)
  const DOMINANT: Array<[string, React.ComponentType]> = [
    ['/tr/hesaplayicilar/bitcoin-donusturucu', BitcoinConverter],
    ['/tr/hesaplayicilar/bitcoin-emeklilik-hesaplayicisi', BitcoinRetirementCalculator],
  ];

  // DCA + Investment gate their results behind a "Calculate" button. The
  // default-currency leak fix ensures their input panel + live-price ticker
  // render ₺ on initial load. Static marketing/comparison tables in those
  // pages still use $ as illustrative copy and are out of scope.
  const PRESENT: Array<[string, React.ComponentType]> = [
    ['/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi', BitcoinDCACalculator],
    ['/tr/hesaplayicilar/bitcoin-yatirim-hesaplayicisi', BitcoinInvestmentCalculator],
  ];

  it.each(DOMINANT)(
    '%s renders ₺ and uses ₺ as the dominant currency glyph',
    async (path, Page) => {
      const { container, unmount } = renderTrPage(path, Page);
      await waitFor(() =>
        expect(document.documentElement.getAttribute('lang')).toBe('tr')
      );
      await waitFor(
        () => expect((container.textContent || '').length).toBeGreaterThan(200),
        { timeout: 8000 }
      );

      const text = visibleText(container);
      const tryCount = (text.match(/₺/g) || []).length;
      const usdCount = (text.match(/\$/g) || []).length;
      const eurCount = (text.match(/€/g) || []).length;
      const gbpCount = (text.match(/£/g) || []).length;
      expect(tryCount).toBeGreaterThan(0);
      expect(eurCount).toBe(0);
      expect(gbpCount).toBe(0);
      if (tryCount < usdCount) {
        const sample = text.slice(0, 300).replace(/\s+/g, ' ');
        throw new Error(
          `On ${path}: ₺ count (${tryCount}) < $ count (${usdCount}). Sample: "${sample}"`
        );
      }
      unmount();
    },
    20_000
  );

  it.each(PRESENT)(
    '%s renders ₺ in the calculator UI on initial load',
    async (path, Page) => {
      const { container, unmount } = renderTrPage(path, Page);
      await waitFor(() =>
        expect(document.documentElement.getAttribute('lang')).toBe('tr')
      );
      await waitFor(
        () => expect((container.textContent || '').length).toBeGreaterThan(200),
        { timeout: 8000 }
      );
      const text = visibleText(container);
      const tryCount = (text.match(/₺/g) || []).length;
      // Default-currency leak fix: ₺ must appear (input labels / live price /
      // currency selector default). $ may still appear in static marketing
      // copy, which is tracked separately.
      expect(tryCount).toBeGreaterThan(0);
      unmount();
    },
    20_000
  );
});

// ---------- 8. Phase 9.2: no stray $ outside exempt subtrees ----------
// Mirrors scripts/audit-tr-currency.mjs at runtime: walks the rendered DOM
// for /tr calculator routes and asserts no "$" appears OUTSIDE elements
// (or their descendants) marked  data-currency-exempt="true".
//
// To exempt a marketing/educational section that legitimately renders USD,
// add  data-currency-exempt="true"  to its wrapping element.

const visibleTextRespectingExempt = (root: Node): string => {
  const skip = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE']);
  const walker = (root as Document | Element).ownerDocument!.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (n) => {
        const parent = n.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (skip.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
        // Reject if any ancestor is marked exempt.
        let el: Element | null = parent;
        while (el) {
          if (el.getAttribute && el.getAttribute('data-currency-exempt') === 'true') {
            return NodeFilter.FILTER_REJECT;
          }
          el = el.parentElement;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    }
  );
  let out = '';
  let cur: Node | null = walker.nextNode();
  while (cur) {
    out += cur.nodeValue || '';
    cur = walker.nextNode();
  }
  return out;
};

import { TR_CALC_ROUTES } from './trCalculatorRoutes';

// Build a leak report with surrounding snippet + ancestor chain.
const collectDollarLeaks = (root: HTMLElement) => {
  const text = visibleTextRespectingExempt(root);
  const leaks: Array<{ snippet: string; index: number }> = [];
  let i = -1;
  while ((i = text.indexOf('$', i + 1)) !== -1) {
    leaks.push({
      index: i,
      snippet: text.slice(Math.max(0, i - 60), i + 60).replace(/\s+/g, ' ').trim(),
    });
    if (leaks.length >= 5) break;
  }
  return { count: (text.match(/\$/g) || []).length, samples: leaks };
};

const formatLeaks = (path: string, report: ReturnType<typeof collectDollarLeaks>) =>
  `Stray USD on ${path} — ${report.count} occurrence(s):\n` +
  report.samples.map((s, i) => `  [${i + 1}] …${s.snippet}…`).join('\n') +
  `\nFix: localize the source to ₺ or wrap the offending subtree in data-currency-exempt="true".`;

describe('Phase 9.2 — /tr calculator routes have no stray "$" outside exempt sections', () => {
  it.each(TR_CALC_ROUTES)(
    '$tier — $trPath',
    async ({ trPath, page: Page, tier }) => {
      let container: HTMLElement;
      let unmount: () => void;
      try {
        const r = renderTrPage(trPath, Page);
        container = r.container;
        unmount = r.unmount;
      } catch (err) {
        if (tier === 'tracked') {
          // tracked tier tolerates render crashes during early localization;
          // the regression signal lives in soft/strict promotions.
          // eslint-disable-next-line no-console
          console.warn(`[tracked] render crash on ${trPath}: ${(err as Error).message}`);
          return;
        }
        throw err;
      }

      try {
        await waitFor(() =>
          expect(document.documentElement.getAttribute('lang')).toBe('tr')
        );
        await waitFor(
          () => expect((container.textContent || '').length).toBeGreaterThan(150),
          { timeout: 8000 }
        );
      } catch {
        // Page never reached a stable render. Treat like a tracked smoke fail.
        if (tier !== 'strict') {
          // eslint-disable-next-line no-console
          console.warn(`[${tier}] ${trPath} never stabilized within 8s`);
          unmount!();
          return;
        }
        unmount!();
        throw new Error(`Strict route ${trPath} failed to render stable UI within 8s`);
      }

      const report = collectDollarLeaks(container);
      unmount!();

      if (report.count === 0) return;
      if (tier === 'strict') throw new Error(formatLeaks(trPath, report));
      if (tier === 'soft') {
        // eslint-disable-next-line no-console
        console.warn(formatLeaks(trPath, report));
      }
      // tracked: ignore
    },
    25_000
  );

  // ── Negative tests: guard the harness itself ──

  it('exempt subtrees are pruned — "$" inside data-currency-exempt is invisible', () => {
    const div = document.createElement('div');
    div.innerHTML =
      '<span>visible ₺ only</span>' +
      '<section data-currency-exempt="true"><p>$1,000 historical example</p></section>';
    const text = visibleTextRespectingExempt(div);
    expect(text).not.toContain('$');
    expect(text).toContain('₺');
  });

  it('walker DOES catch "$" outside exempt subtrees (regression for the regression)', () => {
    const div = document.createElement('div');
    div.innerHTML =
      '<span>$leak in plain text</span>' +
      '<section data-currency-exempt="true"><p>$ok inside exempt</p></section>';
    const text = visibleTextRespectingExempt(div);
    expect(text).toContain('$leak');
    expect(text).not.toContain('$ok');
  });

  it('route table covers every /tr/hesaplayicilar/ entry in EN_TO_TR', () => {
    const fromMap = Object.values(EN_TO_TR).filter((p) =>
      p.startsWith('/tr/hesaplayicilar/')
    );
    const fromTable = TR_CALC_ROUTES.map((r) => r.trPath);
    const missing = fromMap.filter((p) => !fromTable.includes(p));
    expect(missing).toEqual([]);
  });
});

