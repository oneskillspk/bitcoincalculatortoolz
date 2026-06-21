import React, { Suspense, useEffect, useRef, useState } from 'react';
import { lazyWithRetry } from '@/utils/lazyWithRetry';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ScrollScene } from '@/components/cinematic/ScrollScene';


// Lazy load below-the-fold components with retry logic
const CalculationFlowAnimation = lazyWithRetry(() =>
  import('@/components/modern/CalculationFlowAnimation').then(module => ({
    default: module.CalculationFlowAnimation
  }))
);

const CalculatorGrid = lazyWithRetry(() =>
  import('@/components/CalculatorGrid').then(module => ({
    default: module.CalculatorGrid
  }))
);

const UltraModernAssetComparison = lazyWithRetry(() =>
  import('@/components/modern/UltraModernAssetComparison').then(module => ({
    default: module.UltraModernAssetComparison
  }))
);

const FAQSection = lazyWithRetry(() =>
  import('@/components/FAQSection').then(module => ({
    default: module.FAQSection
  }))
);

const NewsletterSection = lazyWithRetry(() =>
  import('@/components/NewsletterSection').then(module => ({
    default: module.NewsletterSection
  }))
);

const SectionSkeleton = ({ height = 'h-64' }: { height?: string }) => (
  <div className={`${height} animate-pulse bg-muted/20 rounded-lg`} />
);

/**
 * Defers child mount until BOTH:
 *   - LCP window has settled (via useAfterLCP), AND
 *   - the section's placeholder is within ~800px of the viewport.
 *
 * This keeps the lazy chunks (recharts, supabase, framer) out of the
 * initial JS payload — critical for mobile PSI / LCP. The skeleton
 * preserves the same height so there is no CLS.
 */
/**
 * Defers child mount until the section's placeholder is within ~1200px of
 * the viewport. The first section after the hero mounts immediately so the
 * desktop layout has no blank band while LCP resolves. Subsequent sections
 * are gated only by IntersectionObserver — no LCP wait — which closes the
 * gap users were seeing on tall desktop viewports.
 */
const EagerSection: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
  reveal?: 'fade-up' | 'fade' | 'none';
  /** When true (first below-fold section) mount immediately. */
  immediate?: boolean;
}> = ({ children, fallback = <SectionSkeleton />, reveal = 'fade-up', immediate = false }) => {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [near, setNear] = useState(immediate);

  useEffect(() => {
    if (near) return;
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: '1200px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [near]);

  return (
    <ScrollScene as="div" reveal={reveal} className="overflow-anchor-auto" start="top 88%">
      <div ref={wrapRef}>
        {near ? <Suspense fallback={fallback}>{children}</Suspense> : fallback}
      </div>
    </ScrollScene>
  );
};

export const LazyBelowFoldContent: React.FC = () => {
  return (
    <>
      <EagerSection immediate fallback={<SectionSkeleton height="h-[820px] sm:h-[360px]" />}>
        <ErrorBoundary>
          <CalculatorGrid showOnlyFeatured={true} showExploreSection={true} />
        </ErrorBoundary>
      </EagerSection>

      <EagerSection fallback={<SectionSkeleton height="h-[480px] sm:h-[320px]" />}>
        <ErrorBoundary>
          <CalculationFlowAnimation />
        </ErrorBoundary>
      </EagerSection>

      <EagerSection fallback={<SectionSkeleton height="h-[720px] sm:h-[420px]" />}>
        <ErrorBoundary>
          <UltraModernAssetComparison />
        </ErrorBoundary>
      </EagerSection>

      <EagerSection fallback={<SectionSkeleton height="h-[360px] sm:h-[320px]" />}>
        <ErrorBoundary>
          <FAQSection />
        </ErrorBoundary>
      </EagerSection>

      <EagerSection fallback={<SectionSkeleton height="h-56" />}>
        <ErrorBoundary>
          <NewsletterSection />
        </ErrorBoundary>
      </EagerSection>
    </>
  );
};
