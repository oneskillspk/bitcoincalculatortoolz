import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

/**
 * LocaleMeta — emits language-aware <html lang>, og:locale, og:locale:alternate
 * for every route based on URL prefix. Mounted once at the App root so all
 * pages get the right locale signals without per-page boilerplate.
 *
 * Per-page Helmet blocks may still override (e.g. canonical, page-specific
 * og:title) — Helmet merges them. This component only owns the locale tags.
 */
export const LocaleMeta: React.FC = () => {
  const { pathname } = useLocation();
  const isTr = pathname === '/tr' || pathname.startsWith('/tr/');
  const lang = isTr ? 'tr' : 'en';
  const ogLocale = isTr ? 'tr_TR' : 'en_US';
  const ogLocaleAlt = isTr ? 'en_US' : 'tr_TR';

  return (
    <Helmet>
      <html lang={lang} />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:locale:alternate" content={ogLocaleAlt} />
    </Helmet>
  );
};
