/**
 * Multi-transport price fetching.
 *
 * The app used to route every upstream price call through the `price-proxy`
 * edge function. When the backend is paused (out of credits, cold start,
 * maintenance) that single door closes and every calculator breaks.
 *
 * This module keeps the proxy as the PREFERRED transport but demotes to
 * public, CORS-enabled, key-free endpoints when it fails, so calculators keep
 * producing results. Failing transports are marked unhealthy for a cooldown
 * window so later calls skip straight to the one that works.
 */
import axios from 'axios';

export type PriceSource = 'proxy' | 'direct' | 'secondary';

export interface TransportResponse<T = any> {
  data: T;
  source: PriceSource;
}

const PROXY_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/price-proxy`;
const PROXY_HEADERS = {
  apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string,
};
const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';
const COINBASE_SPOT = 'https://api.coinbase.com/v2/prices';

const UNHEALTHY_COOLDOWN_MS = 3 * 60 * 1000;
const health = new Map<PriceSource, number>();

function isUnhealthy(source: PriceSource): boolean {
  const until = health.get(source);
  if (!until) return false;
  if (Date.now() > until) {
    health.delete(source);
    return false;
  }
  return true;
}

function markUnhealthy(source: PriceSource) {
  health.set(source, Date.now() + UNHEALTHY_COOLDOWN_MS);
}

function markHealthy(source: PriceSource) {
  health.delete(source);
}

/** Exposed for diagnostics/tests. */
export function resetTransportHealth() {
  health.clear();
}

async function viaProxy(path: string, params: Record<string, unknown>, timeout: number) {
  const res = await axios.get(PROXY_BASE, {
    params: { path, ...params },
    timeout,
    headers: PROXY_HEADERS,
  });
  return res.data;
}

async function viaDirectCoinGecko(
  path: string,
  params: Record<string, unknown>,
  timeout: number,
) {
  const res = await axios.get(`${COINGECKO_BASE}${path}`, { params, timeout });
  return res.data;
}

/**
 * Secondary source. Coinbase only exposes a spot price, so it can only stand in
 * for `/simple/price` (and `/coins/markets`, minus the 24h fields) in USD-ish
 * currencies it supports. Returns a CoinGecko-shaped payload so callers need no
 * special-casing.
 */
async function viaSecondary(
  path: string,
  params: Record<string, unknown>,
  timeout: number,
): Promise<any> {
  const currency =
    (params.vs_currencies as string | undefined)?.split(',')[0] ??
    (params.vs_currency as string | undefined);

  if (!currency) throw new Error('Secondary transport: no currency in request');

  if (path === '/simple/price') {
    const res = await axios.get(`${COINBASE_SPOT}/BTC-${currency.toUpperCase()}/spot`, {
      timeout,
    });
    const amount = Number(res.data?.data?.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error('Secondary transport: invalid spot price');
    }
    return {
      bitcoin: {
        [currency.toLowerCase()]: amount,
        last_updated_at: Math.floor(Date.now() / 1000),
      },
    };
  }

  if (path === '/coins/markets') {
    const res = await axios.get(`${COINBASE_SPOT}/BTC-${currency.toUpperCase()}/spot`, {
      timeout,
    });
    const amount = Number(res.data?.data?.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error('Secondary transport: invalid spot price');
    }
    return [
      {
        current_price: amount,
        price_change_24h: 0,
        price_change_percentage_24h: 0,
        last_updated: new Date().toISOString(),
      },
    ];
  }

  throw new Error(`Secondary transport does not support ${path}`);
}

const TRANSPORTS: {
  source: PriceSource;
  run: (path: string, params: Record<string, unknown>, timeout: number) => Promise<any>;
}[] = [
  { source: 'proxy', run: viaProxy },
  { source: 'direct', run: viaDirectCoinGecko },
  { source: 'secondary', run: viaSecondary },
];

/**
 * Fetch a CoinGecko-v3-shaped payload through the first working transport.
 * Throws only when every transport fails; callers then fall back to cache or
 * the static snapshot.
 */
export async function priceGet<T = any>(
  path: string,
  params: Record<string, unknown> = {},
  timeout = 8000,
): Promise<TransportResponse<T>> {
  let lastError: unknown;

  // Healthy transports first, then the cooling-off ones as a last resort.
  const ordered = [
    ...TRANSPORTS.filter((t) => !isUnhealthy(t.source)),
    ...TRANSPORTS.filter((t) => isUnhealthy(t.source)),
  ];

  for (const transport of ordered) {
    try {
      const data = await transport.run(path, params, timeout);
      markHealthy(transport.source);
      return { data, source: transport.source };
    } catch (err) {
      lastError = err;
      // Don't blacklist a transport that simply can't serve this path.
      const message = err instanceof Error ? err.message : String(err);
      if (!message.includes('does not support')) {
        markUnhealthy(transport.source);
      }
      console.warn(`[priceTransport] ${transport.source} failed for ${path}:`, message);
    }
  }

  throw new Error(
    `All price transports failed for ${path}. Last error: ${
      lastError instanceof Error ? lastError.message : String(lastError)
    }`,
  );
}
