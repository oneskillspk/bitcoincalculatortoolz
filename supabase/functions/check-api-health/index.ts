// Pings all upstream APIs the calculators depend on and records the
// result in public.api_health_log. Invoked every 5 minutes by pg_cron.
import { createClient } from 'npm:@supabase/supabase-js@2.45.0';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

type Endpoint = {
  id: string;
  url: string;
  // optional small body length check to detect "200 but empty"
  minBytes?: number;
};

const ENDPOINTS: Endpoint[] = [
  { id: 'coingecko_price', url: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd', minBytes: 10 },
  { id: 'mempool_tip_height', url: 'https://mempool.space/api/blocks/tip/height' },
  { id: 'mempool_fees', url: 'https://mempool.space/api/v1/fees/recommended', minBytes: 10 },
  { id: 'mempool_blocks', url: 'https://mempool.space/api/blocks', minBytes: 10 },
  { id: 'blockchain_hashrate', url: 'https://blockchain.info/q/hashrate' },
  { id: 'blockchain_difficulty', url: 'https://blockchain.info/q/getdifficulty' },
  { id: 'fear_greed', url: 'https://api.alternative.me/fng/?limit=1', minBytes: 10 },
];

const TIMEOUT_MS = 5_000;

async function ping(ep: Endpoint) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  const started = performance.now();
  try {
    const res = await fetch(ep.url, {
      signal: ctrl.signal,
      headers: { 'User-Agent': 'bitcoincalculator.tools health-check/1.0' },
    });
    const body = await res.text();
    const latency = Math.round(performance.now() - started);
    let status: 'ok' | 'degraded' | 'down' = 'ok';
    if (!res.ok) status = 'down';
    else if (ep.minBytes && body.length < ep.minBytes) status = 'degraded';
    else if (latency > 3000) status = 'degraded';
    return {
      endpoint_id: ep.id,
      endpoint_url: ep.url,
      status,
      http_status: res.status,
      latency_ms: latency,
      error: res.ok ? null : body.slice(0, 200),
    };
  } catch (e) {
    const latency = Math.round(performance.now() - started);
    const isAbort = (e as Error).name === 'AbortError';
    return {
      endpoint_id: ep.id,
      endpoint_url: ep.url,
      status: isAbort ? 'timeout' : 'error',
      http_status: null as number | null,
      latency_ms: latency,
      error: ((e as Error).message ?? String(e)).slice(0, 200),
    };
  } finally {
    clearTimeout(t);
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, serviceKey);

  const results = await Promise.all(ENDPOINTS.map(ping));
  const { error } = await supabase.from('api_health_log').insert(results);

  if (error) {
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
  return new Response(
    JSON.stringify({ ok: true, checked: results.length, results }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  );
});
