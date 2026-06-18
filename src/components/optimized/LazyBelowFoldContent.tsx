import React, { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
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

// Loading skeleton for sections
const SectionSkeleton = ({ height = 'h-64' }: { height?: string }) => (
  <div className={`${height} animate-pulse bg-muted/20 rounded-lg`} />
);

const EagerSection: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
  reveal?: 'fade-up' | 'fade' | 'none';
}> = ({ children, fallback = <SectionSkeleton />, reveal = 'fade-up' }) => {
  return (
    <ScrollScene as="div" reveal={reveal} className="overflow-anchor-auto" start="top 88%">
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </ScrollScene>
  );
};

export const LazyBelowFoldContent: React.FC = () => {
  return (
    <>
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