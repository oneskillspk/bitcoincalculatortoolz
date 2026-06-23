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

const removeInlineSplash = () => {
  const splash = document.querySelector<HTMLElement>('.splash-container');
  if (!splash) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    splash.remove();
    return;
  }

  // Wait two rAFs so the freshly mounted page has painted at least one frame
  // before we start fading the splash out — prevents any black/blank flash on
  // slow CPUs where commit → paint can lag the React effect.
  requestAnimationFrame(() => requestAnimationFrame(() => {
    // Slightly longer, eased fade — feels premium on fast networks and
    // forgiving on slow ones (page is already painted underneath).
    splash.style.transition = 'opacity 420ms cubic-bezier(0.22, 1, 0.36, 1)';
    splash.style.opacity = '0';
    splash.style.pointerEvents = 'none';
    splash.setAttribute('aria-hidden', 'true');
    const done = () => splash.remove();
    splash.addEventListener('transitionend', done, { once: true });
    window.setTimeout(done, 700); // safety net if transitionend never fires
  }));
};



// Production cache hardening: remove legacy service workers/app-shell caches.
// The site is not relying on offline app-shell behavior, and stale workers can
// keep old HTML/chunk references alive after deploys, leaving users on splash.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations?.().then((registrations) => {
    registrations.forEach((registration) => registration.unregister());
  }).catch(() => {});
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

// Remove the inline splash only once real route content has mounted
// (signaled by <SplashRemover /> inside the Suspense boundary in App.tsx).
// This eliminates the "splash → blank fallback → page" double-screen flash.
let splashRemoved = false;
const triggerSplashRemoval = () => {
  if (splashRemoved) return;
  splashRemoved = true;
  removeInlineSplash();
};
window.addEventListener('app:route-ready', triggerSplashRemoval, { once: true });
// Safety net: if something goes wrong upstream, never leave the splash forever.
window.setTimeout(triggerSplashRemoval, 6000);

