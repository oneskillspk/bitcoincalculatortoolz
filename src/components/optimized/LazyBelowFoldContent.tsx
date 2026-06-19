import React, { Suspense, useEffect, useRef, useState } from 'react';
import { lazyWithRetry } from '@/utils/lazyWithRetry';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ScrollScene } from '@/components/cinematic/ScrollScene';
import { useAfterLCP } from '@/hooks/useAfterLCP';

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
const EagerSection: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
  reveal?: 'fade-up' | 'fade' | 'none';
}> = ({ children, fallback = <SectionSkeleton />, reveal = 'fade-up' }) => {
  const ready = useAfterLCP();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    if (!ready || near) return;
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
      { rootMargin: '800px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ready, near]);

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
      <EagerSection fallback={<SectionSkeleton height="h-[1320px] sm:h-96" />}>
        <ErrorBoundary>
          <CalculatorGrid showOnlyFeatured={true} showExploreSection={true} />
        </ErrorBoundary>
      </EagerSection>

      <EagerSection fallback={<SectionSkeleton height="h-[760px] sm:h-80" />}>
        <ErrorBoundary>
          <CalculationFlowAnimation />
        </ErrorBoundary>
      </EagerSection>

      <EagerSection fallback={<SectionSkeleton height="h-[1180px] sm:h-[620px]" />}>
        <ErrorBoundary>
          <UltraModernAssetComparison />
        </ErrorBoundary>
      </EagerSection>

      <EagerSection fallback={<SectionSkeleton height="h-[520px]" />}>
        <ErrorBoundary>
          <FAQSection />
        </ErrorBoundary>
      </EagerSection>

      <EagerSection fallback={<SectionSkeleton height="h-64" />}>
        <ErrorBoundary>
          <NewsletterSection />
        </ErrorBoundary>
      </EagerSection>
    </>
  );
};
