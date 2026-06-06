import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate, useLocation } from 'react-router-dom';
import { getTurkishAlternate } from '@/utils/localizedRoutes';

interface LegacyRedirectProps {
  /** Target path under the same origin, e.g. "/calculators/what-if". */
  to: string;
}

/**
 * SEO-safe legacy slug redirect for a static-hosted SPA.
 *
 * If the user is browsing under /tr, forward to the Turkish mirror when
 * one exists; otherwise fall through to the English canonical.
 */
export const LegacyRedirect = ({ to }: LegacyRedirectProps) => {
  const { search, hash, pathname } = useLocation();
  const isTr = pathname.startsWith('/tr');
  const localized = isTr ? getTurkishAlternate(to) ?? to : to;
  const target = `${localized}${search}${hash}`;
  const absoluteTarget = `https://bitcoincalculator.tools${target}`;

  // Hard fallback for non-SPA crawlers / curl that don't run JS at all.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.history.replaceState({}, '', target);
      } catch { /* noop */ }
    }
  }, [target]);

  return (
    <>
      <Helmet>
        <title>Redirecting…</title>
        <meta httpEquiv="refresh" content={`0; url=${absoluteTarget}`} />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href={absoluteTarget} />
      </Helmet>
      <Navigate to={target} replace />
    </>
  );
};
