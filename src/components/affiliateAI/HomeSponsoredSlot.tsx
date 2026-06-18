import { useEffect, useState } from 'react';
import { AffiliatePlacement } from './AffiliatePlacement';
import {
  HOME_SPONSORED_VARIANT,
  HOME_SPONSORED_SCROLL_THRESHOLD,
} from '@/config/adConfig';

/**
 * Phase 4.6 — homepage sponsored slot.
 * - A/B variant flag from `adConfig.ts`.
 * - Lazy-mounts only after the user scrolls past 50% of the document
 *   (better viewability, no above-the-fold ad weight).
 * - Positioned above FAQ inside the LazyBelowFoldContent flow.
 */
export const HomeSponsoredSlot = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const check = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const ratio = window.scrollY / max;
      if (ratio >= HOME_SPONSORED_SCROLL_THRESHOLD) {
        setMounted(true);
      }
    };

    check();
    window.addEventListener('scroll', check, { passive: true });
    return () => window.removeEventListener('scroll', check);
  }, []);

  const isNative = HOME_SPONSORED_VARIANT === 'native-300x250';

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      <div
        className="my-10 border-t border-border/60 pt-8"
        role="complementary"
        aria-label="Sponsored partner"
        data-ad-variant={HOME_SPONSORED_VARIANT}
      >
        {mounted ? (
          <div className={isNative ? 'flex justify-center' : ''}>
            <AffiliatePlacement
              slug="home"
              lang="en"
              zone="inline"
              forceAffiliateId="ledger"
              forceFormat={isNative ? 'single-card' : 'image-banner'}
            />
          </div>
        ) : (
          <div
            className={
              isNative
                ? 'mx-auto h-[250px] w-[300px]'
                : 'mx-auto h-[60px] w-full max-w-[468px]'
            }
            aria-hidden
          />
        )}
      </div>
    </div>
  );
};
