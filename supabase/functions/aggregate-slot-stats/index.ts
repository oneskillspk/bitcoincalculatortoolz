// Aggregates impressions + clicks from the last 14 days into per-slot
// totals so the client can rerank Slot A/C/D by observed EPC × CTR.
// Public read-only endpoint — payload is anonymous aggregate counts.
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const EPC_USD: Record<string, number> = { A: 0.35, B: 0.85, C: 0.25, D: 0.45 };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();

    const [imp, clk] = await Promise.all([
      supabase.from("impressions").select("zone", { count: "exact" }).gte("created_at", since),
      supabase.from("clicks").select("zone", { count: "exact" }).gte("created_at", since),
    ]);

    const tally = (rows: Array<{ zone: string | null }> | null) => {
      const out: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
      for (const r of rows ?? []) {
        const z = (r.zone ?? "").toUpperCase();
        if (z in out) out[z]++;
      }
      return out;
    };
    const impressions = tally(imp.data as Array<{ zone: string | null }> | null);
    const clicks = tally(clk.data as Array<{ zone: string | null }> | null);

    const stats: Record<string, { impressions: number; clicks: number; revenue: number }> = {};
    for (const k of ["A", "B", "C", "D"]) {
      stats[k] = {
        impressions: impressions[k],
        clicks: clicks[k],
        revenue: clicks[k] * (EPC_USD[k] ?? 0.3),
      };
    }

    return new Response(JSON.stringify({ updatedAt: Date.now(), stats }), {
      headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "public, max-age=3600" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
