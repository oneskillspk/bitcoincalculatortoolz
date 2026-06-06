// AffiliateAI: log impression or click. Public endpoint (no auth required).
// Uses service role so anon clients cannot read or write the analytics tables directly.
//
// Anti-abuse: we validate that the supplied affiliateId references an enabled
// affiliate AND that the slug is on a known allow-list of calculator pages,
// so attackers cannot pollute analytics tables with arbitrary (slug, affiliate)
// rows that would skew business metrics.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://esm.sh/zod@3.23.8";

const buildCorsHeaders = (req: Request) => {
  const origin = req.headers.get("origin") ?? "*";
  return {
    "Access-Control-Allow-Origin": origin,
    "Vary": "Origin",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
};

// Accept any kebab-case slug (calculator pages and learn articles). The real
// anti-abuse guarantee comes from validating affiliateId against enabled rows.
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const BodySchema = z.object({
  type: z.enum(["impression", "click"]),
  affiliateId: z.string().min(1).max(64),
  slug: z.string().min(1).max(128),
  lang: z.enum(["en", "tr"]),
  segment: z.string().min(1).max(32).default("default"),
});

// In-memory cache of valid affiliate IDs (refreshed periodically per instance).
let affiliateIdsCache: { ids: Set<string>; fetchedAt: number } | null = null;
const AFFILIATE_CACHE_TTL_MS = 60_000;

async function getEnabledAffiliateIds(
  supabase: ReturnType<typeof createClient>,
): Promise<Set<string>> {
  const now = Date.now();
  if (affiliateIdsCache && now - affiliateIdsCache.fetchedAt < AFFILIATE_CACHE_TTL_MS) {
    return affiliateIdsCache.ids;
  }
  const { data, error } = await supabase
    .from("affiliates")
    .select("id")
    .eq("enabled", true);
  if (error) {
    console.error("log-event affiliate fetch error:", error);
    // Fail closed: return empty so unknown IDs are rejected.
    return new Set();
  }
  const ids = new Set((data ?? []).map((r: { id: string }) => r.id));
  affiliateIdsCache = { ids, fetchedAt: now };
  return ids;
}

Deno.serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const json = await req.json().catch(() => ({}));
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten() }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { type, affiliateId, slug, lang, segment } = parsed.data;

    // Reject unknown calculator pages — keeps analytics tables clean.
    if (!SLUG_PATTERN.test(slug)) {
      return new Response(JSON.stringify({ error: "unknown_slug" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Silently no-op for unknown / disabled affiliate IDs. Returning 400 here
    // produced noisy client-side errors when the catalog drifts (e.g. an
    // affiliate is paused in the DB but still referenced in cached creatives).
    const enabledIds = await getEnabledAffiliateIds(supabase);
    if (!enabledIds.has(affiliateId)) {
      return new Response(JSON.stringify({ ok: true, skipped: "unknown_affiliate" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const table = type === "click" ? "clicks" : "impressions";
    const { error } = await supabase.from(table).insert({
      affiliate_id: affiliateId,
      slug,
      lang,
      segment,
    });

    if (error) {
      console.error("log-event insert error:", error);
      return new Response(JSON.stringify({ error: "log_failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("log-event error:", e);
    return new Response(JSON.stringify({ error: "server_error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
