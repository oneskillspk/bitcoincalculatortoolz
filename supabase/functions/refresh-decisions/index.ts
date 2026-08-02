// supabase/functions/refresh-decisions/index.ts
// Nightly job: for each (slug × lang × segment), ask Lovable AI to pick
// the best affiliates + format + zone, then upsert into decisions_cache.
//
// Auth: callers must present either
//   - x-cron-secret: <REFRESH_DECISIONS_SECRET>  (used by pg_cron)
//   - Bearer <jwt of an admin user>              (used from admin UI)
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-cron-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
const CRON_SECRET = Deno.env.get("REFRESH_DECISIONS_SECRET");

const MODEL = "google/gemini-3-flash-preview";
const LANGS = ["en", "tr"] as const;
const SEGMENTS = ["default", "mobile", "returning"] as const;

// Slugs we generate decisions for. Keep in sync with src/config/placements.config.ts
const SLUGS = [
  "dca", "stack-sats", "bitcoin-savings", "sip", "millionaire",
  "hodl-strategy", "retirement", "capital-gains-tax", "profit-loss",
  "volatility", "drawdown", "fear-greed-index", "rainbow-chart",
  "power-law", "stock-to-flow", "liquidation", "mining-profitability",
  "lump-sum-vs-dca", "btc-vs-assets", "btc-vs-real-estate",
  // High-traffic trading + general surfaces (were missing → no cached decision)
  "lot-size", "leverage-liquidation", "pip-value", "correlation",
  "what-if", "wealth-percentile", "transaction-fees", "bitcoin-loan",
  "purchasing-power", "accumulation-score", "staking", "lightning",
  "cagr", "home",
];

const FORMATS = ["single-card", "two-card-strip", "comparison", "inline-cta", "sidebar-widget"];
const ZONES = ["post-result", "sidebar", "inline", "comparison", "footer"];

interface AffiliateRow {
  id: string; name: string; category: string; tier: number; priority: number;
  language_restriction: string[]; target_pages: string[]; target_results: string[];
  conversion_intent: string | null; commission_rate: number | null;
}

const toolSchema = {
  type: "function",
  function: {
    name: "pick_affiliates",
    description: "Pick the best affiliates and placement for this slug/lang/segment.",
    parameters: {
      type: "object",
      properties: {
        affiliate_ids: {
          type: "array",
          items: { type: "string" },
          description: "1-2 affiliate ids ranked best-first. Empty array if none fit.",
        },
        format: { type: "string", enum: FORMATS },
        zone: { type: "string", enum: ZONES },
        delay_ms: { type: "number", minimum: 0, maximum: 5000 },
        reasoning: { type: "string", description: "Brief explanation (<200 chars)." },
      },
      required: ["affiliate_ids", "format", "zone", "delay_ms", "reasoning"],
      additionalProperties: false,
    },
  },
} as const;

async function pickForCell(
  affiliates: AffiliateRow[],
  slug: string,
  lang: string,
  segment: string
) {
  const eligible = affiliates.filter((a) => {
    const langOk = a.language_restriction.length === 0 || a.language_restriction.includes(lang);
    const pageOk = a.target_pages.includes("*") || a.target_pages.includes(slug);
    return langOk && pageOk;
  });

  if (eligible.length === 0) {
    return { affiliate_ids: [], format: "two-card-strip", zone: "post-result", delay_ms: 800, reasoning: "no eligible affiliates" };
  }

  const systemPrompt =
    "You are an affiliate-placement optimizer for a Bitcoin calculator site. " +
    "Given a calculator slug, language, visitor segment, and a list of enabled affiliate programs, " +
    "pick the 1–2 best affiliates and the format/zone that will convert best without harming UX. " +
    "Prefer fewer ads (1) for tax/accumulation slugs; allow 2 for trading/mining. " +
    "Mobile segments: prefer single-card and faster delay_ms (300–600). " +
    "Returning visitors: prefer inline-cta. " +
    "Never pick more than 2 affiliates.";

  const userPrompt = JSON.stringify({
    slug, lang, segment,
    candidates: eligible.map((a) => ({
      id: a.id, name: a.name, category: a.category, tier: a.tier, priority: a.priority,
      target_pages: a.target_pages, target_results: a.target_results,
      conversion_intent: a.conversion_intent, commission_rate: a.commission_rate,
    })),
  });

  const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      tools: [toolSchema],
      tool_choice: { type: "function", function: { name: "pick_affiliates" } },
    }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`AI ${resp.status}: ${text.slice(0, 200)}`);
  }
  const data = await resp.json();
  const call = data.choices?.[0]?.message?.tool_calls?.[0];
  if (!call?.function?.arguments) throw new Error("no tool call in response");
  const args = JSON.parse(call.function.arguments);
  // Hard-clip to 2 + ensure ids exist
  const validIds = new Set(eligible.map((a) => a.id));
  args.affiliate_ids = (args.affiliate_ids || []).filter((id: string) => validIds.has(id)).slice(0, 2);
  return args;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  // Auth: cron secret, service role key (for pg_cron), OR admin JWT
  const cronHeader = req.headers.get("x-cron-secret");
  const isCron = CRON_SECRET && cronHeader === CRON_SECRET;
  const admin = createClient(SUPABASE_URL, SERVICE_KEY);

  if (!isCron) {
    const auth = req.headers.get("Authorization") ?? "";
    const token = auth.replace(/^Bearer\s+/i, "");
    if (!token) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    // Service role key path (used by pg_cron)
    if (token === SERVICE_KEY) {
      // authorized
    } else {
      const { data: userData } = await admin.auth.getUser(token);
      const userId = userData?.user?.id;
      if (!userId) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const { data: isAdmin } = await admin.rpc("has_role", { _user_id: userId, _role: "admin" });
      if (!isAdmin) return new Response(JSON.stringify({ error: "forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
  }

  const { data: affiliates, error: affErr } = await admin
    .from("affiliates")
    .select("id,name,category,tier,priority,language_restriction,target_pages,target_results,conversion_intent,commission_rate")
    .eq("enabled", true);
  if (affErr) {
    console.error("refresh-decisions affiliate fetch error:", affErr);
    return new Response(JSON.stringify({ error: affErr.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const cells: Array<{ slug: string; lang: string; segment: string }> = [];
  for (const slug of SLUGS) for (const lang of LANGS) for (const segment of SEGMENTS) {
    cells.push({ slug, lang, segment });
  }

  // The full grid (~200 cells × 1 AI call) far exceeds the 150s request
  // idle timeout, and the old code only wrote rows at the very end — so a
  // timeout meant zero rows persisted. Now: respond immediately, run the
  // grid in the background, and flush to decisions_cache incrementally.
  const CONCURRENCY = 5;
  const FLUSH_EVERY = 20;

  const run = async () => {
    let written = 0;
    let failures = 0;
    let buffer: any[] = [];

    const flush = async () => {
      if (buffer.length === 0) return;
      const chunk = buffer;
      buffer = [];
      const { error } = await admin
        .from("decisions_cache")
        .upsert(chunk, { onConflict: "slug,lang,segment" });
      if (error) console.error("decisions_cache upsert error:", error.message);
      else written += chunk.length;
    };

    for (let i = 0; i < cells.length; i += CONCURRENCY) {
      const batch = cells.slice(i, i + CONCURRENCY);
      const results = await Promise.all(
        batch.map(async (cell) => {
          try {
            const decision = await pickForCell(affiliates ?? [], cell.slug, cell.lang, cell.segment);
            return {
              slug: cell.slug, lang: cell.lang, segment: cell.segment,
              affiliate_ids: decision.affiliate_ids,
              format: decision.format,
              zone: decision.zone,
              delay_ms: decision.delay_ms,
              reasoning: (decision.reasoning || "").slice(0, 500),
              generated_at: new Date().toISOString(),
            };
          } catch (e) {
            failures++;
            console.error(`cell ${cell.slug}/${cell.lang}/${cell.segment} failed:`, (e as Error).message);
            return null;
          }
        })
      );
      buffer.push(...results.filter(Boolean));
      if (buffer.length >= FLUSH_EVERY) await flush();
      // Soft throttle to respect AI rate limits
      await new Promise((r) => setTimeout(r, 150));
    }
    await flush();
    console.log(`refresh-decisions done: written=${written} failures=${failures} cells=${cells.length}`);
  };

  const bg = (globalThis as unknown as { EdgeRuntime?: { waitUntil: (p: Promise<unknown>) => void } }).EdgeRuntime;
  if (bg?.waitUntil) bg.waitUntil(run());
  else run().catch((e) => console.error("refresh-decisions error:", e));

  return new Response(
    JSON.stringify({ ok: true, started: true, cells: cells.length, affiliates: affiliates?.length ?? 0 }),
    { status: 202, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});

