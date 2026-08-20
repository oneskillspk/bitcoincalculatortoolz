# Keep calculators working when the backend is paused

## What's actually happening

The workspace ran out of credits, so Lovable Cloud services are paused. Every price request in the app goes through one single door: the `price-proxy` edge function (`bitcoinApi.ts` builds every call as `${VITE_SUPABASE_URL}/functions/v1/price-proxy`). When that door is closed, live and historical price fetches fail, and most calculators can't produce a result.

There are two separate fixes, and you want both:

1. **Restore the backend** — top up credits in Lovable so Cloud resumes. That's an account action, not a code change.
2. **Make the app survive it next time** — the app must never be one paused function away from being unusable. That's the work below.

## The resilience plan (code)

### 1. Multi-transport price layer
Replace the single `priceProxyGet` with a transport chain that tries, in order, and stops at the first success:

```text
1. price-proxy edge function   (preferred: caching, keys stay server-side)
2. direct CoinGecko public API (browser-side, CORS-enabled, no key)
3. secondary public source     (mempool.space / Coinbase spot for USD price)
4. cached value (IndexedDB via offlineManager, even if stale)
5. static snapshot (public/data/bitcoin_prices_v1.json)
```

A failure at any level (network error, 5xx, 401, 404 from a paused function) immediately demotes to the next transport, with a short timeout so users don't stare at a spinner. Once a transport fails, it's marked unhealthy for a few minutes so every later call skips straight to the working one.

### 2. Never return "no price"
`getCurrentPrice`, `getCurrentMarketData`, `getHistoricalPrice` and range fetches all end at the static snapshot rather than throwing. Results carry a `source` field (`live | cached | snapshot`) so the UI can be honest about freshness.

### 3. Honest freshness UI
When the value came from cache or snapshot, show a small, non-alarming notice near the price ("Live feed unavailable — using last known price from <date>") plus a retry button. Calculators still compute and still export; nothing gets blocked. No new visual system — reuse the existing badge/alert styles.

### 4. Refresh the static snapshot
`public/data/bitcoin_prices_v1.json` becomes the guaranteed floor, so bring its latest entries up to date and make sure it has a top-level "latest price + as-of date" field the app can read instantly on first paint.

### 5. Same treatment for the other Cloud-dependent reads
Health check, CPI data, metal prices, slot stats: these should degrade silently (feature hides or uses defaults) rather than surfacing errors, so a paused backend never breaks a page render.

## What this does NOT change

- No visual redesign, no calculator math changes.
- Affiliate/ads slots, SEO, and routing untouched.
- The proxy stays the preferred path when Cloud is running — direct calls are only a fallback, so upstream rate limits stay controlled.

## Technical notes

- Files: `src/services/bitcoinApi.ts` (transport chain), a new `src/services/priceTransport.ts`, `src/services/staticDataService.ts` (snapshot "latest" accessor), `src/hooks/useLiveBitcoinPrice.ts` (expose `source`), plus a small `PriceFreshnessNotice` component consumed where prices display.
- Direct CoinGecko free endpoints used: `/simple/price`, `/coins/markets`, `/coins/bitcoin/market_chart/range` — all CORS-enabled and key-free, matching the schemas the app already parses, so no parsing changes are needed.
- Transport health kept in a module-level map with a cooldown; no extra state library.
- Tests: unit tests that simulate proxy failure and assert each fallback level returns a usable price, and that a total blackout still returns the snapshot value.

## Order of work

1. Transport chain + never-throw price accessors.
2. Snapshot refresh and instant "latest price" read.
3. Freshness notice in the UI.
4. Degrade-gracefully pass on the other Cloud reads.
5. Unit tests + a browser check with the proxy forced to fail.
