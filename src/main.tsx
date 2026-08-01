import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";

import App from "./App.tsx";
import "./index.css";
import { installChartTokenGuard } from "./lib/chartTokenGuard";

installChartTokenGuard();

/**
 * Test-only animation freeze.
 *
 * Activated when `?testNoAnim=1` is in the URL OR
 * `window.__TEST_NO_ANIM__ = true` is set before navigation.
 *
 * Purpose: visual regression tests need pixel-stable frames after
 * Calculate. SlotB's 200ms entry transition and result count-up
 * animations would otherwise diff across consecutive snapshots and
 * be misreported as "blink". This injects a global stylesheet that
 * disables transitions, animations, and CSS scroll-behavior so the
 * post-Calculate frame is immediately at its final state.
 *
 * NOT enabled in production unless the flag is explicitly set — has
 * zero effect on real users.
 */
(() => {
  try {
    const flagOn =
      new URLSearchParams(window.location.search).get("testNoAnim") === "1" ||
      (window as unknown as { __TEST_NO_ANIM__?: boolean }).__TEST_NO_ANIM__ === true;
    if (!flagOn) return;
    (window as unknown as { __TEST_NO_ANIM__?: boolean }).__TEST_NO_ANIM__ = true;
    const style = document.createElement("style");
    style.setAttribute("data-test-no-anim", "true");
    style.textContent = `
      *, *::before, *::after {
        animation-duration: 0ms !important;
        animation-delay: 0ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0ms !important;
        transition-delay: 0ms !important;
        scroll-behavior: auto !important;
      }
    `;
    document.head.appendChild(style);
  } catch {
    /* noop */
  }
})();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      retry: 2,
    },
  },
});

// Production cache hardening: remove legacy service workers/app-shell caches.
// The site is not relying on offline app-shell behavior, and stale workers can
// keep old HTML/chunk references alive after deploys.
//
// Lovable preview / prerender hosts (`*.lovable.app`, `id-preview--*`,
// `*.lovableproject.com`) must NEVER keep a service worker alive: a cached
// shell would be served to crawlers during prerender. This branch is required
// for forward-compatibility with Lovable's built-in prerender — do not remove.
// It emits no SEO output (see src/test/domain-lock.test.ts allow-list).
const isLovablePreviewHost = (() => {
  try {
    const h = window.location.hostname;
    return (
      h.endsWith('.lovable.app') ||
      h.startsWith('id-preview--') ||
      h.endsWith('.lovableproject.com')
    );
  } catch {
    return false;
  }
})();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations?.().then((registrations) => {
    registrations.forEach((registration) => registration.unregister());
  }).catch(() => {});
  if (isLovablePreviewHost) {
    // Extra guard on preview/prerender hosts: never register, always unregister.
    navigator.serviceWorker.getRegistration?.().then((reg) => reg?.unregister()).catch(() => {});
  }
}


if ('caches' in window) {
  caches.keys().then((keys) => {
    keys
      .filter((key) => /bitcoin-calculator|static-|dynamic-|api-|workbox|vite/i.test(key))
      .forEach((key) => caches.delete(key));
  }).catch(() => {});
}


const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

// Add a non-intrusive accessible name; avoid role="application" so screen readers
// can use normal document landmarks and navigation shortcuts.
rootElement.setAttribute('aria-label', 'Bitcoin Calculator App');

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <LanguageProvider>
            <TooltipProvider>
              <App />
              <Toaster aria-live="polite" />
            </TooltipProvider>
          </LanguageProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);

/**
 * Mount-safe splash teardown.
 *
 * #boot lives outside #root, so React never reconciles it. We fade it out on
 * the first frame after React has committed and remove it from the DOM, so
 * there is no flash, no re-render, and no orphaned overlay.
 */
requestAnimationFrame(() => {
  const boot = document.getElementById("boot");
  if (!boot) return;
  boot.setAttribute("data-out", "");
  const drop = () => boot.remove();
  boot.addEventListener("transitionend", drop, { once: true });
  window.setTimeout(drop, 250);
});


