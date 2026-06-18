/**
 * Per-page-view "shown set". When multiple <AffiliatePlacement>
 * components render on the same page, each one records the affiliate
 * id(s) it chose so the next placement can hard-exclude duplicates.
 *
 * Resets automatically when the URL pathname changes (SPA navigation).
 */

let currentPath: string | null = null;
let shown: Set<string> = new Set();

function path(): string {
  if (typeof window === "undefined") return "__ssr__";
  return window.location.pathname + window.location.search;
}

function ensureFresh(): void {
  const p = path();
  if (p !== currentPath) {
    currentPath = p;
    shown = new Set();
  }
}

export function getPageViewShown(): Set<string> {
  ensureFresh();
  return shown;
}

export function markPageViewShown(id: string): void {
  ensureFresh();
  shown.add(id);
}

/** Test-only helper. */
export function resetPageViewShown(): void {
  currentPath = null;
  shown = new Set();
}
