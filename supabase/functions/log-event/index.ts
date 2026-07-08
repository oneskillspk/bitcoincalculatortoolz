// AffiliateAI: log impression or click. Public endpoint.
// Accepts optional click_id (UUID) + variant_id so we can attribute
// partner S2S postbacks back to a click and to an A/B experiment variant.

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

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const BodySchema = z.object({
  type: z.enum(["impression", "click"]),
  affiliateId: z.string().min(1).max(64),
  slug: z.string().min(1).max(128),
  lang: z.enum(["en", "tr"]),
  segment: z.string().min(1).max(32).default("default"),
  clickId: z.string().uuid().optional(),
  variantId: z.string().min(1).max(64).optional(),
});

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
    const { type, affiliateId, slug, lang, segment, clickId, variantId } = parsed.data;

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

    const enabledIds = await getEnabledAffiliateIds(supabase);
    if (!enabledIds.has(affiliateId)) {
      return new Response(JSON.stringify({ ok: true, skipped: "unknown_affiliate" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const table = type === "click" ? "clicks" : "impressions";
    const row: Record<string, unknown> = {
      affiliate_id: affiliateId,
      slug,
      lang,
      segment,
    };
    if (type === "click" && clickId) row.click_id = clickId;
    if (variantId) row.variant_id = variantId;

    const { error } = await supabase.from(table).insert(row);

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
