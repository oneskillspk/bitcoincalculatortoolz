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

  splash.style.transition = 'opacity 180ms ease-out';
  splash.style.opacity = '0';
  splash.style.pointerEvents = 'none';
  window.setTimeout(() => splash.remove(), 220);
};

const isInIframe = (() => {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
})();

const isLovablePreviewHost =
  window.location.hostname.includes('lovableproject.com') ||
  window.location.hostname.includes('id-preview--') ||
  window.location.hostname.includes('lovable.app');

// Service worker — re-enabled with versioned cache busting + auto-update.
// - Skipped in dev and Lovable preview iframes (would interfere with HMR).
// - On a new SW activation, the page reloads exactly once so users on the
//   splash never get stranded with a stale shell after a deploy.
// - The kill switch ?sw=off unregisters everything and purges caches.
const swKilled = new URLSearchParams(window.location.search).get('sw') === 'off';
const swShouldRegister =
  'serviceWorker' in navigator &&
  import.meta.env.PROD &&
  !isInIframe &&
  !isLovablePreviewHost &&
  !swKilled;

if ('serviceWorker' in navigator && (swKilled || !swShouldRegister)) {
  navigator.serviceWorker.getRegistrations?.().then((registrations) => {
    registrations.forEach((registration) => registration.unregister());
  }).catch(() => {});
  if (swKilled && 'caches' in window) {
    caches.keys().then((keys) => keys.forEach((k) => caches.delete(k))).catch(() => {});
  }
}

if (swShouldRegister) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((reg) => {
      // When an updated SW finishes installing, tell it to take over immediately.
      const promote = (sw: ServiceWorker | null) => {
        if (sw && sw.state === 'installed' && navigator.serviceWorker.controller) {
          sw.postMessage({ type: 'SKIP_WAITING' });
        }
      };
      if (reg.waiting) promote(reg.waiting);
      reg.addEventListener('updatefound', () => {
        const installing = reg.installing;
        installing?.addEventListener('statechange', () => promote(installing));
      });
      // Periodically check for updates (every 60 min) so long-lived tabs catch deploys.
      setInterval(() => reg.update().catch(() => {}), 60 * 60 * 1000);
    }).catch(() => {});

    // When the new SW takes control, reload once to load fresh chunks.
    let reloaded = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (reloaded) return;
      reloaded = true;
      window.location.reload();
    });
  });
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

requestAnimationFrame(() => {
  requestAnimationFrame(removeInlineSplash);
});
