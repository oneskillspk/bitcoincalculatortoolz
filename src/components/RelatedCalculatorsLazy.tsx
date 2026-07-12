import { lazy, Suspense } from "react";

/**
 * Lazy wrapper for the ~478 KB `RelatedCalculators` chunk. Rendered below
 * the fold on every calculator page, so deferring it removes the chunk
 * from the initial preload/parse cost and only loads when the user scrolls
 * (or the browser idles) past the results.
 */
const RelatedCalculators = lazy(() => import("./RelatedCalculators"));

function RelatedCalculatorsFallback() {
  return (
    <div
      aria-hidden="true"
      className="min-h-[320px] w-full animate-pulse rounded-2xl bg-muted/20"
    />
  );
}

export default function RelatedCalculatorsLazy() {
  return (
    <Suspense fallback={<RelatedCalculatorsFallback />}>
      <RelatedCalculators />
    </Suspense>
  );
}
