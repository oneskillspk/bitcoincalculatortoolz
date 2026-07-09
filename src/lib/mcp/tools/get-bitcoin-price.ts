import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

/**
 * Fetches the current BTC spot price from CoinGecko (public endpoint, no key).
 * Kept import-safe: no top-level env reads, no I/O at module load.
 */
export default defineTool({
  name: "get_bitcoin_price",
  title: "Get current Bitcoin price",
  description:
    "Returns the current Bitcoin (BTC) spot price in USD (and optionally other fiat currencies) with 24-hour change. Sourced live from CoinGecko.",
  inputSchema: {
    currencies: z
      .array(z.string().min(2).max(6))
      .max(6)
      .optional()
      .describe(
        "Optional list of fiat currency codes (e.g. ['usd','eur','gbp','try']). Defaults to ['usd'].",
      ),
  },
  annotations: { readOnlyHint: true, idempotentHint: false, openWorldHint: true },
  handler: async ({ currencies }) => {
    const vs = (currencies && currencies.length ? currencies : ["usd"])
      .map((c) => c.toLowerCase())
      .join(",");
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=${vs}&include_24hr_change=true&include_market_cap=true`;
    try {
      const res = await fetch(url, { headers: { accept: "application/json" } });
      if (!res.ok) {
        return {
          content: [{ type: "text", text: `CoinGecko error: HTTP ${res.status}` }],
          isError: true,
        };
      }
      const raw = (await res.json()) as Record<string, Record<string, number>>;
      const btc = raw.bitcoin ?? {};
      const prices: Record<string, { price: number; change_24h_pct: number | null; market_cap: number | null }> = {};
      for (const c of vs.split(",")) {
        const price = btc[c];
        if (typeof price !== "number") continue;
        prices[c] = {
          price,
          change_24h_pct: btc[`${c}_24h_change`] ?? null,
          market_cap: btc[`${c}_market_cap`] ?? null,
        };
      }
      const summary = Object.entries(prices)
        .map(([c, v]) => `${c.toUpperCase()}: ${v.price.toLocaleString()} (${v.change_24h_pct?.toFixed(2) ?? "?"}% 24h)`)
        .join(" · ");
      return {
        content: [{ type: "text", text: `BTC — ${summary}` }],
        structuredContent: { source: "coingecko", timestamp: new Date().toISOString(), prices },
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: `Failed to fetch price: ${(err as Error).message}` }],
        isError: true,
      };
    }
  },
});
