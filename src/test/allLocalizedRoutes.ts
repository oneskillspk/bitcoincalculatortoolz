/**
 * Master EN ↔ TR route table for SEO walkers.
 *
 * For every entry, both the EN canonical path and its TR mirror are mounted
 * with the listed page component. Static pages with a separate TR page
 * module (e.g. `/` → Index, `/tr/` → TurkishHome) expose `enPage` and
 * `trPage` separately. Most calculators share a single component that
 * branches on the active language.
 */
import type { ComponentType } from 'react';
import { EN_TO_TR } from '@/utils/localizedRoutes';
import { TR_CALC_ROUTES } from './trCalculatorRoutes';

import Index from '@/pages/Index';
import TurkishHome from '@/pages/TurkishHome';
import Calculators from '@/pages/Calculators';
import Tools from '@/pages/Tools';
import Learn from '@/pages/Learn';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import Sitemap from '@/pages/Sitemap';

export interface LocalizedRouteEntry {
  enPath: string;
  trPath: string;
  enPage: ComponentType;
  trPage: ComponentType;
}

const STATIC_PAGES: LocalizedRouteEntry[] = [
  { enPath: '/',          trPath: '/tr/',                enPage: Index,       trPage: TurkishHome },
  { enPath: '/calculators', trPath: '/tr/hesaplayicilar', enPage: Calculators, trPage: Calculators },
  { enPath: '/tools',     trPath: '/tr/araclar',         enPage: Tools,       trPage: Tools },
  { enPath: '/learn',     trPath: '/tr/ogrenin',         enPage: Learn,       trPage: Learn },
  { enPath: '/about',     trPath: '/tr/hakkimizda',      enPage: About,       trPage: About },
  { enPath: '/contact',   trPath: '/tr/iletisim',        enPage: Contact,     trPage: Contact },
  { enPath: '/terms',     trPath: '/tr/kosullar',        enPage: Terms,       trPage: Terms },
  { enPath: '/privacy',   trPath: '/tr/gizlilik',        enPage: Privacy,     trPage: Privacy },
  { enPath: '/sitemap',   trPath: '/tr/site-haritasi',   enPage: Sitemap,     trPage: Sitemap },
];

// Reverse TR→EN map so we can pair calculator pages from TR_CALC_ROUTES.
const TR_TO_EN = Object.fromEntries(
  Object.entries(EN_TO_TR).map(([en, tr]) => [tr, en])
) as Record<string, string>;

const CALCULATOR_PAGES: LocalizedRouteEntry[] = TR_CALC_ROUTES.map((r) => {
  const enPath = TR_TO_EN[r.trPath];
  if (!enPath) {
    throw new Error(`No EN mirror for TR calc route ${r.trPath}`);
  }
  return { enPath, trPath: r.trPath, enPage: r.page, trPage: r.page };
});

export const ALL_LOCALIZED_ROUTES: LocalizedRouteEntry[] = [
  ...STATIC_PAGES,
  ...CALCULATOR_PAGES,
];
