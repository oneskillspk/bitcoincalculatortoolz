import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { EN_TO_TR, TR_TO_EN } from '@/utils/localizedRoutes';

const BASE_URL = 'https://bitcoincalculator.tools';

/**
 * Automatically injects hreflang alternate link tags on every page
 * that has a registered Turkish mirror. Place once inside BrowserRouter in
 * App.tsx — it covers all routes without touching individual calculator pages.
 *
 * Pages with no Turkish mirror (e.g. /tools) render nothing.
 */
export const GlobalHreflang: React.FC = () => {
  const { pathname } = useLocation();

  const isTurkish = pathname === '/tr' || pathname.startsWith('/tr/');
  const norm = (p: string) => (p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p);
  const path = norm(pathname);

  let enPath: string | null;
  let trPath: string | null;

  if (isTurkish) {
    enPath = TR_TO_EN[path] ?? TR_TO_EN[pathname] ?? null;
    trPath = path === '/tr' ? '/tr/' : pathname;
  } else {
    enPath = pathname;
    trPath = EN_TO_TR[path] ?? EN_TO_TR[pathname] ?? null;
  }

  if (!enPath || !trPath) return null;

  return (
    <Helmet>
      <link rel="alternate" hrefLang="en" href={`${BASE_URL}${enPath}`} />
      <link rel="alternate" hrefLang="tr" href={`${BASE_URL}${trPath}`} />
      <link rel="alternate" hrefLang="x-default" href={`${BASE_URL}${enPath}`} />
    </Helmet>
  );
};
