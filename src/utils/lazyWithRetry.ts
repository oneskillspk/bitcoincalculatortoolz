import { lazy, ComponentType } from 'react';

type ComponentImportFn = () => Promise<{ default: ComponentType<any> }>;

/**
 * Lazy-load a component with retry-with-backoff on chunk load failure.
 *
 * Why not reload? In sandboxed iframes (preview) a `window.location.reload()`
 * frequently races with route transitions and briefly paints the catch-all
 * `<NotFound />` route, which the user perceives as a broken page. Retrying
 * the dynamic import in-place keeps Suspense holding the previous UI and,
 * if all retries fail, lets <ErrorBoundary> render its proper fallback card.
 */
const RETRY_DELAYS = [200, 500];

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export function lazyWithRetry(importFn: ComponentImportFn) {
  return lazy(async () => {
    let lastError: unknown;
    for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
      try {
        return await importFn();
      } catch (err) {
        lastError = err;
        if (attempt < RETRY_DELAYS.length) {
          await sleep(RETRY_DELAYS[attempt]);
        }
      }
    }
    throw lastError;
  });
}

/**
 * Same retry semantics as `lazyWithRetry`, but for modules that export the
 * component as a named export instead of `default`. Keeps call sites tidy:
 *   const FAQ = lazyNamedWithRetry(() => import('./FAQ'), 'DCAFAQSection');
 */
export function lazyNamedWithRetry<T extends string>(
  importFn: () => Promise<Record<string, unknown>>,
  exportName: T,
) {
  return lazyWithRetry(async () => {
    const mod = await importFn();
    const Component = mod[exportName] as ComponentType<any> | undefined;
    if (!Component) {
      throw new Error(`lazyNamedWithRetry: module has no export "${exportName}"`);
    }
    return { default: Component };
  });
}
