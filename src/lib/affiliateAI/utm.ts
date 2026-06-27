/**
 * Append UTM tags to an outbound affiliate URL.
 *
 * Two tracking realities are handled:
 *
 *  1. Partner URLs that DO NOT own `utm_source` (Ledger, Koinly, Coinbase,
 *     Bybit, TradingView, …): we stamp the full UTM quartet
 *     (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`).
 *
 *  2. Partner URLs that DO own `utm_source` (RedotPay `utm_source=union`,
 *     MEXC `ref=…`): we MUST NOT overwrite their tracking or affiliate
 *     credit can be lost. But we still need a way to attribute the click
 *     back to a specific page/zone/creative inside the partner dashboard,
 *     so we always append `aff_sid` — a Lovable-owned sub-id channel
 *     every partner network we use will surface in their reporting.
 *
 * `aff_sid` format: `${slug}__${zone}[__${creativeId}]`.
 * Keep it short, lowercase, underscore-safe.
 */
export interface AppendUtmParams {
  slug: string;
  affiliateId: string;
  zone: string;
  /** Optional creative identifier (size, group, or any stable id). */
  creativeId?: string;
}

function buildSubId(p: AppendUtmParams): string {
  const parts = [p.slug, p.zone];
  if (p.creativeId) parts.push(p.creativeId);
  return parts
    .map((s) => String(s).toLowerCase().replace(/[^a-z0-9-]+/g, "-"))
    .join("__");
}

export function appendUtm(
  href: string | null | undefined,
  params: AppendUtmParams,
): string {
  if (!href || href === "#") return href || "#";
  try {
    const url = new URL(href, "https://x.invalid");
    const subId = buildSubId(params);

    if (url.searchParams.has("utm_source")) {
      // Partner owns the UTM chain — preserve everything they set,
      // only add our sub-id channel for in-dashboard attribution.
      if (!url.searchParams.has("aff_sid")) {
        url.searchParams.set("aff_sid", subId);
      }
    } else {
      url.searchParams.set("utm_source", params.slug || "bitcoincalculator");
      url.searchParams.set("utm_medium", "affiliate");
      url.searchParams.set("utm_campaign", params.affiliateId);
      url.searchParams.set("utm_content", params.zone);
      url.searchParams.set("aff_sid", subId);
    }

    if (url.origin === "https://x.invalid") {
      return `${url.pathname}${url.search}${url.hash}`;
    }
    return url.toString();
  } catch {
    return href;
  }
}
