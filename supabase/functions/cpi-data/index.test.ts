// E2E test: verifies the deployed cpi-data edge function returns live CPI
// values (BLS CUUR0000SA0) that the inflation-adjustment toggle relies on.
//
// Run from project root:
//   deno test --allow-net --allow-env supabase/functions/cpi-data/index.test.ts

import "https://deno.land/std@0.224.0/dotenv/load.ts";
import {
  assert,
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL") ?? Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY =
  Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!;

const FN_URL = `${SUPABASE_URL}/functions/v1/cpi-data`;

// Hardcoded fallback baseline that the client uses for instant render.
// Live values must (a) include all these years and (b) deviate slightly from
// the static baseline as new monthly CPI prints land.
const FALLBACK = {
  2017: 245.120,
  2018: 251.107,
  2019: 255.657,
  2020: 258.811,
  2021: 270.970,
  2022: 292.655,
  2023: 304.702,
  2024: 313.689,
} as const;

interface CpiResponse {
  cpi: Record<string, number>;
  latest_value: number;
  source: string;
  fetched_at: string;
  cached?: boolean;
  cache_layer?: "db" | "fresh" | "db_stale";
}

async function callCpi(): Promise<CpiResponse> {
  const res = await fetch(FN_URL, {
    method: "GET",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  const body = await res.json();
  assertEquals(res.status, 200, `cpi-data returned ${res.status}: ${JSON.stringify(body)}`);
  return body as CpiResponse;
}

Deno.test("cpi-data returns a well-formed payload", async () => {
  const data = await callCpi();
  assertExists(data.cpi, "cpi map missing");
  assertExists(data.source, "source missing");
  assertExists(data.fetched_at, "fetched_at missing");
  assert(typeof data.latest_value === "number" && data.latest_value > 0, "latest_value invalid");
  assert(
    new Date(data.fetched_at).getTime() > Date.now() - 1000 * 60 * 60 * 24 * 7,
    `fetched_at is older than 7 days: ${data.fetched_at}`,
  );
});

Deno.test("cpi-data reports a live BLS or DB-cached source (never permanent fallback)", async () => {
  const data = await callCpi();
  // Acceptable: fresh BLS pull, DB-cached BLS pull, or stale DB row.
  // Not acceptable: 'fallback_2026' or 'fallback_error' — those mean BLS never
  // succeeded and the inflation toggle would show stale 2026 numbers forever.
  const acceptable = [
    "bls_cuur0000sa0",
    "bls_cuur0000sa0_stale",
  ];
  assert(
    acceptable.includes(data.source),
    `Expected live BLS source, got '${data.source}'. The inflation toggle would silently degrade.`,
  );
});

Deno.test("cpi-data covers every year the inflation toggle needs (2017-2024)", async () => {
  const data = await callCpi();
  for (const year of Object.keys(FALLBACK)) {
    const v = data.cpi[year];
    assert(typeof v === "number" && v > 0, `Missing CPI for year ${year}`);
  }
});

Deno.test("cpi-data live values are within sanity bounds of BLS history", async () => {
  const data = await callCpi();
  // BLS CUUR0000SA0 annual averages drift but stay in a tight band per year.
  // Tolerate ±2.5 index points vs the hardcoded baseline (covers revisions).
  const TOL = 2.5;
  for (const [yearStr, baseline] of Object.entries(FALLBACK)) {
    const live = data.cpi[yearStr];
    const delta = Math.abs(live - baseline);
    assert(
      delta <= TOL,
      `CPI ${yearStr}: live=${live}, baseline=${baseline}, delta=${delta.toFixed(3)} > ${TOL}. ` +
        `Either BLS revised history significantly or the function is returning bad data.`,
    );
  }
});

Deno.test("cpi-data latest_value matches the most recent year in the cpi map", async () => {
  const data = await callCpi();
  const years = Object.keys(data.cpi).map(Number).sort((a, b) => a - b);
  const latestYear = years[years.length - 1];
  const expected = data.cpi[String(latestYear)];
  assert(
    Math.abs(data.latest_value - expected) < 0.001,
    `latest_value=${data.latest_value} does not match cpi[${latestYear}]=${expected}`,
  );
  // The inflation toggle multiplies by latest_value/cpi[entryYear]; a stale
  // latest_value silently understates inflation, so this guard matters.
  assert(latestYear >= 2024, `latest year ${latestYear} is older than 2024 — cron pre-warm may be broken`);
});

Deno.test("cpi-data inflation factor for 2017 dollars is realistic (>1.25, <1.65)", async () => {
  // Sanity check the exact math the WhatIfScenarioInsightsPanel runs:
  //   adjusted = nominal * (cpi[latestYear] / cpi[entryYear])
  // For a 2017 entry, BLS shows ~30-35% cumulative inflation through 2024-2026.
  const data = await callCpi();
  const factor = data.latest_value / data.cpi["2017"];
  assert(
    factor > 1.25 && factor < 1.65,
    `2017→latest inflation factor ${factor.toFixed(3)} outside plausible BLS range [1.25, 1.65]. ` +
      `Inflation toggle would display wrong real-return numbers.`,
  );
});

Deno.test("cpi-data is served from the persistent DB cache on a second call", async () => {
  // First call may be 'fresh' (cold) or 'db' (warm). Second call MUST hit the
  // DB cache layer — proves the cpi_cache table survives cold starts and the
  // pg_cron pre-warm strategy is wired correctly.
  await callCpi();
  const second = await callCpi();
  assertEquals(
    second.cached,
    true,
    `Second call should be cached; got cached=${second.cached}, layer=${second.cache_layer}`,
  );
  assert(
    second.cache_layer === "db" || second.cache_layer === "db_stale",
    `Expected cache_layer 'db' or 'db_stale', got '${second.cache_layer}'`,
  );
});
