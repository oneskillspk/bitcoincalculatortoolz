// Service Worker Registration Script
// This is the actual service worker file that will be registered

const CACHE_VERSION = 'v5-2026-06-07';
const CACHE_NAME = `bitcoin-calculator-${CACHE_VERSION}`;
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;
const API_CACHE = `api-${CACHE_VERSION}`;

// Allow the page to fast-forward an updated SW past the "waiting" phase.
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Assets to cache on install — trimmed to highest-traffic shells.
// Other routes are cached on-demand by the navigation handler.
const STATIC_ASSETS = [
  '/',
  '/calculators',
  '/calculators/dca',
  '/calculators/what-if',
  '/calculators/profit-loss',
  '/offline.html',
  '/learn',
  '/robots.txt',
  '/sitemap.xml'
];

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch(error => {
        console.error('Service Worker: Cache installation failed', error);
      })
  );
  
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE && 
              cacheName !== API_CACHE) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  return self.clients.claim();
});

// Fetch event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Never cache internal auth/redirect plumbing.
  if (url.pathname.startsWith('/~oauth') || url.pathname.startsWith('/auth/')) return;
  
  // Skip Chrome extensions and blob URLs
  if (!url.protocol.startsWith('http')) return;
  
  // Skip module scripts and JS files to prevent MIME type issues
  if (url.pathname.endsWith('.tsx') || 
      url.pathname.endsWith('.ts') || 
      url.pathname.endsWith('.jsx') || 
      url.pathname.includes('/src/')) {
    return;
  }
  
  // Handle built assets (JS, CSS) with long-term caching
  if (url.pathname.startsWith('/assets/') && 
      (url.pathname.endsWith('.js') || 
       url.pathname.endsWith('.css') || 
       url.pathname.endsWith('.mjs'))) {
    event.respondWith(handleBuiltAssets(request));
  }
  // Handle API requests
  else if (url.href.includes('api.coingecko.com')) {
    event.respondWith(handleAPIRequest(request));
  }
  // Handle static assets
  else if (url.pathname.startsWith('/static/') || 
           url.pathname.endsWith('.png') ||
           url.pathname.endsWith('.jpg') ||
           url.pathname.endsWith('.svg') ||
           url.pathname.endsWith('.webp') ||
           url.pathname.endsWith('.ico') ||
           url.pathname.endsWith('.woff') ||
           url.pathname.endsWith('.woff2')) {
    event.respondWith(handleStaticAsset(request));
  }
  // Handle navigation requests (HTML pages)
  else if (request.mode === 'navigate' || 
           (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'))) {
    event.respondWith(handleNavigation(request));
  }
});

// API request handler - Network first with cache fallback
async function handleAPIRequest(request) {
  const cache = await caches.open(API_CACHE);
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      // Cache successful responses for 5 minutes
      const response = networkResponse.clone();
      const headers = new Headers(response.headers);
      headers.set('sw-cached-at', Date.now().toString());
      
      const cachedResponse = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers
      });
      
      cache.put(request, cachedResponse);
    }
    return networkResponse;
  } catch (error) {
    // Try cache if network fails
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      const cachedAt = cachedResponse.headers.get('sw-cached-at');
      // Check if cache is less than 5 minutes old
      if (cachedAt && Date.now() - parseInt(cachedAt) < 300000) {
        return cachedResponse;
      }
    }
    
    throw error;
  }
}

// Built assets handler - Cache first with long-term storage
async function handleBuiltAssets(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      // Add cache headers for 1 year caching
      const headers = new Headers(networkResponse.headers);
      headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      
      const cachedResponse = new Response(networkResponse.body, {
        status: networkResponse.status,
        statusText: networkResponse.statusText,
        headers
      });
      
      cache.put(request, cachedResponse.clone());
      return cachedResponse;
    }
    return networkResponse;
  } catch (error) {
    console.error('Failed to fetch built asset:', request.url);
    throw error;
  }
}

// Static asset handler - Cache first
async function handleStaticAsset(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Failed to fetch static asset:', request.url);
    throw error;
  }
}

// Navigation handler - Network first (critical for SEO: crawlers must get fresh HTML with correct meta tags)
async function handleNavigation(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  try {
    // Always try network first so crawlers and users get fresh HTML with current chunk hashes and Helmet meta tags
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Network failed — fall back to cache (offline support)
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // No cache either — show branded offline page
    const offlineResponse = await caches.match('/offline.html');
    if (offlineResponse) return offlineResponse;

    return new Response(
      '<!DOCTYPE html><html lang="en"><head><title>Offline | Bitcoin Calculator App</title><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><main style="font-family:system-ui,-apple-system,sans-serif;min-height:100vh;display:grid;place-items:center;padding:24px;text-align:center;background:#fff7ed;color:#111827"><div><h1>Bitcoin Calculator App</h1><p>You are offline. Reconnect to refresh live Bitcoin data.</p></div></main></body></html>',
      { headers: { 'Content-Type': 'text/html' } }
    );
  }
}