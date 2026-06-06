import { forwardRef } from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { useLocalizedHref } from '@/hooks/useLocalizedHref';

/**
 * Drop-in replacement for react-router-dom's <Link> that rewrites
 * string `to` props through `useLocalizedHref` so cross-promotion
 * links from EN content surfaces stay inside `/tr/*` when the user
 * is on the Turkish locale.
 *
 * Non-string `to` (location objects), external URLs, hash-only,
 * mailto/tel, and already-prefixed paths pass through untouched
 * (handled by `useLocalizedHref`).
 */
export const LocalizedLink = forwardRef<HTMLAnchorElement, LinkProps>(
  function LocalizedLink({ to, ...rest }, ref) {
    const localize = useLocalizedHref();
    const resolved = typeof to === 'string' ? localize(to) : to;
    return <Link ref={ref} to={resolved} {...rest} />;
  },
);

// Re-export under the `Link` name so files can simply swap their
// `import { Link } from 'react-router-dom'` for
// `import { Link } from '@/components/LocalizedLink'` with no other
// changes.
export { LocalizedLink as Link };
