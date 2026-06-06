/**
 * Append UTM tags to an outbound affiliate URL. Preserves existing query
 * string and never overwrites a utm_source the partner already set.
 */
export function appendUtm(
  href: string | null | undefined,
  params: { slug: string; affiliateId: string; zone: string }
): string {
  if (!href || href === "#") return href || "#";
  try {
    const url = new URL(href, "https://x.invalid");
    if (url.searchParams.has("utm_source")) return href;
    url.searchParams.set("utm_source", params.slug || "bitcoincalculator");
    url.searchParams.set("utm_medium", "affiliate");
    url.searchParams.set("utm_campaign", params.affiliateId);
    url.searchParams.set("utm_content", params.zone);
    // Restore original host shape: if input was relative, return path+search.
    if (url.origin === "https://x.invalid") {
      return `${url.pathname}${url.search}${url.hash}`;
    }
    return url.toString();
  } catch {
    return href;
  }
}
