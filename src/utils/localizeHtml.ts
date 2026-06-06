import { getLocalizedPath } from '@/utils/localizedRoutes';
type Locale = 'en' | 'tr';

/**
 * Rewrite canonical English internal hrefs inside an HTML string to their
 * locale-appropriate mirror. Designed for content rendered via
 * `dangerouslySetInnerHTML` (FAQ answer strings, CMS-style snippets) where
 * we can't use `<Link>` / `useLocalizedHref` directly.
 *
 * Scope: only touches `href="/calculators/..."` style internal paths.
 * Leaves external URLs, anchors, mailto/tel, and already-localized paths
 * untouched.
 */
const INTERNAL_HREF_RE = /(href\s*=\s*["'])(\/(?:calculators|learn|about|contact|tools|sitemap|privacy|terms)(?:\/[^"']*)?)(["'])/g;

export function localizeInternalHtml(html: string, locale: Locale): string {
  if (!html || locale === 'en') return html;
  return html.replace(INTERNAL_HREF_RE, (_match, pre, path, post) => {
    return `${pre}${getLocalizedPath(path, locale)}${post}`;
  });
}
