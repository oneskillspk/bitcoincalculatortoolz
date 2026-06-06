import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

// Hardcoded BLS CPI fallback table (CUUR0000SA0, annual averages, 2026 reference)
const FALLBACK_CPI: Record<string, number> = {
  '2010': 218.056,
  '2011': 224.939,
  '2012': 229.594,
  '2013': 232.957,
  '2014': 236.736,
  '2015': 237.017,
  '2016': 240.007,
  '2017': 245.120,
  '2018': 251.107,
  '2019': 255.657,
  '2020': 258.811,
  '2021': 270.970,
  '2022': 292.655,
  '2023': 304.702,
  '2024': 313.689,
  '2025': 322.000,
  '2026': 329.500,
};

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

function buildClient() {
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function fetchFromBls(): Promise<Record<string, number> | null> {
  try {
    const res = await fetch(
      'https://api.bls.gov/publicAPI/v2/timeseries/data/CUUR0000SA0?startyear=2010&endyear=2026',
      { method: 'GET', headers: { 'Content-Type': 'application/json' } },
    );
    if (!res.ok) return null;
    const json = await res.json();
    if (json.status !== 'REQUEST_SUCCEEDED' || !json.Results?.series?.[0]?.data) return null;
    const series: Array<{ year: string; period: string; value: string }> = json.Results.series[0].data;
    const buckets: Record<string, number[]> = {};
    for (const obs of series) {
      if (!/^M(0[1-9]|1[0-2])$/.test(obs.period)) continue;
      const v = parseFloat(obs.value);
      if (!isFinite(v)) continue;
      (buckets[obs.year] ??= []).push(v);
    }
    const out: Record<string, number> = {};
    for (const [year, arr] of Object.entries(buckets)) {
      out[year] = arr.reduce((a, b) => a + b, 0) / arr.length;
    }
    return Object.keys(out).length ? out : null;
  } catch (e) {
    console.error('BLS fetch failed:', e);
    return null;
  }
}

function jsonResp(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const client = buildClient();

  try {
    // 1) Try DB cache first (survives cold starts)
    const { data: cacheRow, error: cacheErr } = await client
      .from('cpi_cache')
      .select('cpi, latest_value, source, fetched_at, ttl_until')
      .eq('id', 1)
      .maybeSingle();

    if (cacheErr) console.error('cpi_cache read error:', cacheErr);

    const now = Date.now();
    if (cacheRow && new Date(cacheRow.ttl_until).getTime() > now) {
      return jsonResp({
        cpi: cacheRow.cpi,
        latest_value: Number(cacheRow.latest_value),
        source: cacheRow.source,
        fetched_at: cacheRow.fetched_at,
        cached: true,
        cache_layer: 'db',
      });
    }

    // 2) Stale or missing — refresh from BLS
    const fresh = await fetchFromBls();
    const data: Record<string, number> = fresh ?? { ...FALLBACK_CPI };
    const source = fresh ? 'bls_cuur0000sa0' : 'fallback_2026';

    for (const [y, v] of Object.entries(FALLBACK_CPI)) {
      if (!(y in data)) data[y] = v;
    }

    const years = Object.keys(data).map(Number).sort();
    const latest = data[String(years[years.length - 1])];
    const fetchedAt = new Date(now).toISOString();
    const ttlUntil = new Date(now + CACHE_TTL_MS).toISOString();

    // 3) Persist to DB cache (upsert singleton row id=1)
    const { error: upsertErr } = await client
      .from('cpi_cache')
      .upsert(
        {
          id: 1,
          cpi: data,
          latest_value: latest,
          source,
          fetched_at: fetchedAt,
          ttl_until: ttlUntil,
        },
        { onConflict: 'id' },
      );

    if (upsertErr) console.error('cpi_cache upsert error:', upsertErr);

    return jsonResp({
      cpi: data,
      latest_value: latest,
      source,
      fetched_at: fetchedAt,
      cached: false,
      cache_layer: 'fresh',
    });
  } catch (e) {
    console.error('cpi-data error:', e);
    // Last-resort: try to serve any DB cache row even if expired.
    try {
      const { data: stale } = await client
        .from('cpi_cache')
        .select('cpi, latest_value, source, fetched_at')
        .eq('id', 1)
        .maybeSingle();
      if (stale) {
        return jsonResp({
          cpi: stale.cpi,
          latest_value: Number(stale.latest_value),
          source: stale.source + '_stale',
          fetched_at: stale.fetched_at,
          cached: true,
          cache_layer: 'db_stale',
        });
      }
    } catch (_) { /* ignore */ }

    return jsonResp({
      cpi: FALLBACK_CPI,
      latest_value: FALLBACK_CPI['2026'],
      source: 'fallback_error',
      error: e instanceof Error ? e.message : String(e),
    });
  }
});
