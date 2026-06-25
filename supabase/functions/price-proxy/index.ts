// Proxies whitelisted CoinGecko endpoints so the browser never hits a
// CORS-restricted third party directly. Keeps any future API keys server-side.
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

// Path allow-list — only endpoints the client actually uses.
const ALLOWED_PATHS: RegExp[] = [
  /^\/simple\/price$/,
  /^\/coins\/markets$/,
  /^\/coins\/bitcoin\/history$/,
  /^\/coins\/bitcoin\/market_chart\/range$/,
  /^\/coins\/bitcoin\/market_chart$/,
];

// Simple in-memory cache (per warm instance) to reduce upstream rate-limit hits.
const cache = new Map<string, { ts: number; status: number; body: string; contentType: string }>();
const TTL_MS = 60_000;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.searchParams.get('path') || '';
    if (!ALLOWED_PATHS.some((re) => re.test(path))) {
      return new Response(JSON.stringify({ error: 'Path not allowed', path }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Forward all params except `path` to upstream.
    const forwarded = new URLSearchParams();
    url.searchParams.forEach((v, k) => {
      if (k !== 'path') forwarded.append(k, v);
    });

    const upstreamUrl = `${COINGECKO_BASE}${path}?${forwarded.toString()}`;
    const cacheKey = upstreamUrl;
    const now = Date.now();
    const cached = cache.get(cacheKey);
    if (cached && now - cached.ts < TTL_MS) {
      return new Response(cached.body, {
        status: cached.status,
        headers: { ...corsHeaders, 'Content-Type': cached.contentType, 'x-proxy-cache': 'HIT' },
      });
    }

    const upstream = await fetch(upstreamUrl, {
      headers: { accept: 'application/json' },
    });
    const body = await upstream.text();
    const contentType = upstream.headers.get('content-type') || 'application/json';

    if (upstream.ok) {
      cache.set(cacheKey, { ts: now, status: upstream.status, body, contentType });
    }

    return new Response(body, {
      status: upstream.status,
      headers: { ...corsHeaders, 'Content-Type': contentType, 'x-proxy-cache': 'MISS' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: message }), {
      status: 502,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
