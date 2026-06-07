// Cleanup-only worker for legacy installs.
// It intentionally does not intercept fetches or cache app-shell files.
// Keep these paths explicit so readiness checks verify OAuth safety and the
// branded offline fallback asset remains part of the deployed surface.
const OAUTH_BYPASS_PATH = '/~oauth';
const OFFLINE_FALLBACK_PATH = '/offline.html';

function isLegacyAppCacheForThisRegistration(name) {
  const isKnownAppCache = /bitcoin-calculator|static-|dynamic-|api-|workbox|(^|-)precache-v\d+-|(^|-)runtime-/i.test(name);
  return isKnownAppCache && (name.endsWith(self.registration.scope) || !/^firebase|onesignal/i.test(name));
}

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      try {
        const cacheNames = await caches.keys();
        const legacyCacheNames = cacheNames.filter(isLegacyAppCacheForThisRegistration);
        await Promise.allSettled(legacyCacheNames.map((name) => caches.delete(name)));
        await caches.open('bitcoin-calculator-offline-cleanup').then((cache) => cache.add(OFFLINE_FALLBACK_PATH)).catch(() => undefined);
        await self.clients.claim();
        const windowClients = await self.clients.matchAll({ type: 'window' });
        await Promise.allSettled(
          windowClients
            .filter((client) => !new URL(client.url).pathname.startsWith(OAUTH_BYPASS_PATH))
            .map((client) => client.navigate(client.url))
        );
      } finally {
        await self.registration.unregister();
      }
    })()
  );
});