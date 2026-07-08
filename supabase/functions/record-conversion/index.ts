/**
 * S2S postback receiver. Public endpoint (verify_jwt = false).
 * Auth: shared-secret `token` query param (AFFILIATE_POSTBACK_TOKEN).
 *
 * Idempotent on (partner, external_tx_id) so partner retries are safe.
 *
 * Example postback URL to configure inside a partner dashboard:
 *   https://<project-ref>.functions.supabase.co/record-conversion
 *     ?token=<AFFILIATE_POSTBACK_TOKEN>
 *     &partner=ledger
 *     &sub_id={click_id}       ← partner macro; different per network
 *     &amount={payout}
 *     &currency=USD
 *     &tx={order_id}
 *     &status=approved
 *
 * Also served as GET so partners that fire postbacks as a 1x1 pixel work.
 * Response is a 1x1 gif so a raw <img> tag in an email/redirect still works.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type",
};

// 1x1 transparent GIF
const PIXEL = Uint8Array.from(atob(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
), (c) => c.charCodeAt(0));

function pickParam(url: URL, body: Record<string, unknown>, ...keys: string[]): string | null {
  for (const k of keys) {
    const q = url.searchParams.get(k);
    if (q != null && q !== "") return q;
    const b = body[k];
    if (typeof b === "string" && b !== "") return b;
    if (typeof b === "number") return String(b);
  }
  return null;
}

function isUuid(s: string | null): s is string {
  return !!s && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });

  const url = new URL(req.url);
  const token = url.searchParams.get("token") ?? req.headers.get("x-postback-token");
  const expected = Deno.env.get("AFFILIATE_POSTBACK_TOKEN");
  if (!expected || token !== expected) {
    return new Response("unauthorized", { status: 401, headers: CORS });
  }

  let body: Record<string, unknown> = {};
  if (req.method === "POST") {
    try {
      const ct = req.headers.get("content-type") ?? "";
      if (ct.includes("application/json")) {
        body = await req.json();
      } else {
        const text = await req.text();
        const params = new URLSearchParams(text);
        body = Object.fromEntries(params.entries());
      }
    } catch { /* ignore body parse errors */ }
  }

  const partner = pickParam(url, body, "partner", "network", "advertiser");
  const externalTxId = pickParam(url, body, "tx", "transaction_id", "order_id", "oid", "conversion_id");
  const clickIdRaw = pickParam(url, body, "sub_id", "sub1", "s1", "subid", "click_id");
  const clickId = isUuid(clickIdRaw) ? clickIdRaw : null;
  const amountRaw = pickParam(url, body, "amount", "payout", "commission", "value") ?? "0";
  const currency = (pickParam(url, body, "currency", "cur") ?? "USD").toUpperCase().slice(0, 8);
  const status = pickParam(url, body, "status") ?? "pending";
  const payoutUsd = Number.parseFloat(amountRaw) || 0;

  const asPixel = url.searchParams.get("format") === "pixel" || url.searchParams.get("pixel") === "1";

  const respond = (status: number, payload: Record<string, unknown>) => {
    if (asPixel) {
      return new Response(PIXEL, {
        status: 200,
        headers: { ...CORS, "Content-Type": "image/gif", "Cache-Control": "no-store" },
      });
    }
    return new Response(JSON.stringify(payload), {
      status,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  };

  if (!partner || !externalTxId) {
    return respond(400, { error: "missing_partner_or_tx" });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const raw = { query: Object.fromEntries(url.searchParams.entries()), body };

  const { error } = await supabase.from("conversions").upsert(
    {
      partner,
      external_tx_id: externalTxId,
      click_id: clickId,
      payout_usd: payoutUsd,
      currency,
      status,
      raw_payload: raw,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "partner,external_tx_id" },
  );

  if (error) {
    console.error("record-conversion upsert error:", error);
    return respond(500, { error: "db_failed" });
  }

  return respond(200, { ok: true });
});
