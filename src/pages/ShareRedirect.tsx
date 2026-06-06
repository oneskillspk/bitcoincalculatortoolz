import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useLocation, Navigate } from 'react-router-dom';

/**
 * /s/:slug short-link handler.
 *
 * Forwards the visitor (and any prefilled query params) to the
 * canonical /calculators/:slug URL so the long, crawler-friendly URL
 * remains the indexed source while shared links stay short.
 *
 * Uses <Navigate replace> so back-button doesn't bounce users back to /s/.
 * Emits noindex so the short-link path itself never appears in SERPs.
 */
const ShareRedirect = () => {
  const { slug = '' } = useParams<{ slug: string }>();
  const { search } = useLocation();

  useEffect(() => {
    document.title = 'Opening Bitcoin Calculator…';
  }, []);

  if (!slug) {
    return <Navigate to="/calculators" replace />;
  }

  const target = `/calculators/${slug}${search}`;
  return (
    <>
      <Helmet>
        <title>Opening Bitcoin Calculator…</title>
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href={`https://bitcoincalculator.tools${target}`} />
      </Helmet>
      <Navigate to={target} replace />
    </>
  );
};

export default ShareRedirect;
