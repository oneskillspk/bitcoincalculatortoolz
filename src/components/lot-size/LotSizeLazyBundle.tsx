import { lazy, Suspense } from 'react';

/**
 * Lazy wrappers for below-the-fold lot-size sections. Each wrapped
 * component is code-split so it doesn't bloat the LCP-critical bundle.
 * Fallbacks reserve height to prevent CLS.
 */

const Skeleton = ({ h = 320 }: { h?: number }) => (
  <div aria-hidden="true" style={{ minHeight: h }} className="w-full animate-pulse rounded-2xl bg-muted/20 my-6" />
);

const BrokerMatrix = lazy(() => import('./LotSizeBrokerMatrix').then(m => ({ default: m.LotSizeBrokerMatrix })));
const ContentSections = lazy(() => import('./LotSizeContentSections').then(m => ({ default: m.LotSizeContentSections })));
const HowToSection = lazy(() => import('./LotSizeHowToSection').then(m => ({ default: m.LotSizeHowToSection })));
const FAQSection = lazy(() => import('./LotSizeFAQSection').then(m => ({ default: m.LotSizeFAQSection })));
const AffiliateCluster = lazy(() => import('./LotSizeAffiliateCluster').then(m => ({ default: m.LotSizeAffiliateCluster })));
const SmartRelated = lazy(() => import('./LotSizeSmartRelated').then(m => ({ default: m.LotSizeSmartRelated })));
const ExportReport = lazy(() => import('./LotSizeExportReport').then(m => ({ default: m.LotSizeExportReport })));

export const LazyLotSizeBrokerMatrix = () => (
  <Suspense fallback={<Skeleton h={360} />}><BrokerMatrix /></Suspense>
);
export const LazyLotSizeContentSections = (props: { liveBtcPrice: number }) => (
  <Suspense fallback={<Skeleton h={600} />}><ContentSections {...props} /></Suspense>
);
export const LazyLotSizeHowToSection = () => (
  <Suspense fallback={<Skeleton h={480} />}><HowToSection /></Suspense>
);
export const LazyLotSizeFAQSection = () => (
  <Suspense fallback={<Skeleton h={520} />}><FAQSection /></Suspense>
);
export const LazyLotSizeAffiliateCluster = () => (
  <Suspense fallback={<Skeleton h={280} />}><AffiliateCluster /></Suspense>
);
export const LazyLotSizeSmartRelated = (props: {
  selectedBroker: string;
  leverage: number;
  hasLiquidationRisk: boolean;
}) => (
  <Suspense fallback={<Skeleton h={240} />}><SmartRelated {...props} /></Suspense>
);
export const LazyLotSizeExportReport = (props: any) => (
  <Suspense fallback={<Skeleton h={160} />}><ExportReport {...props} /></Suspense>
);
