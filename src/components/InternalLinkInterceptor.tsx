import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalizedHref } from '@/hooks/useLocalizedHref';
import { normalizeLocalizedPath } from '@/utils/localizedRoutes';

/**
 * InternalLinkInterceptor — global click handler that catches plain
 * <a href="/..."> internal anchors (commonly emitted from FAQ answer
 * strings or other HTML-injected copy), rewrites the path to the
 * locale-appropriate mirror, and routes navigation through React Router
 * instead of triggering a full page reload.
 *
 * Two layers of rewriting are applied:
 *   1. `useLocalizedHref` — maps canonical EN paths (e.g. "/calculators/dca")
 *      to their TR mirror when the current locale is TR.
 *   2. `normalizeLocalizedPath` — forward-fixes already-`/tr/`-prefixed
 *      hrefs that leak through with an English slug or wrong segment, e.g.
 *      `/tr/ogrenin/bitcoin-tax-guide-capital-gains` →
 *      `/tr/ogrenin/bitcoin-vergi-rehberi-sermaye-kazanci`. This is the
 *      safety net for misbuilt article-card hrefs.
 *
 * Skips:
 *   - external URLs, hash-only links, mailto, tel
 *   - links with target="_blank", download, or modifier keys
 *   - links with data-no-intercept attribute
 *   - links inside elements opting out via data-no-intercept
 */
const InternalLinkInterceptor: React.FC = () => {
  const navigate = useNavigate();
  const localize = useLocalizedHref();

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const path = event.composedPath ? event.composedPath() : [];
      const anchor = (path.find((n) => (n as HTMLElement)?.tagName === 'A') ||
        (event.target as HTMLElement)?.closest?.('a')) as HTMLAnchorElement | null;
      if (!anchor) return;

      if (anchor.target && anchor.target !== '' && anchor.target !== '_self') return;
      if (anchor.hasAttribute('download')) return;
      if (anchor.dataset.noIntercept === 'true') return;
      if (anchor.closest('[data-no-intercept="true"]')) return;

      const rawHref = anchor.getAttribute('href');
      if (!rawHref) return;
      if (
        rawHref.startsWith('http://') ||
        rawHref.startsWith('https://') ||
        rawHref.startsWith('//') ||
        rawHref.startsWith('mailto:') ||
        rawHref.startsWith('tel:') ||
        rawHref.startsWith('#')
      )
        return;

      if (!rawHref.startsWith('/')) return;

      // Layer 1: locale-aware mapping (EN → TR when needed)
      // Layer 2: forward-fix any misbuilt /tr/... hrefs (article-cards,
      // FAQ HTML, etc.) that still carry an English slug or wrong segment.
      const next = normalizeLocalizedPath(localize(rawHref));
      event.preventDefault();
      navigate(next);
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [navigate, localize]);

  return null;
};

export default InternalLinkInterceptor;
