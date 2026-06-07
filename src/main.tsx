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

requestAnimationFrame(() => {
  requestAnimationFrame(removeInlineSplash);
});
