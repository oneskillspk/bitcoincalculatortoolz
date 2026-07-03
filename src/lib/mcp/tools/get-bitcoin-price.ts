import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

/**
 * Fetch the current Bitcoin spot price via the app's public price proxy.
 * No secrets required — the proxy is a public edge function.
 */
export default defineTool({
  name: "get_bitcoin_price",
  title: "Get Bitcoin price",
  description:
    "Fetch the current Bitcoin (BTC) spot price in the requested fiat currency (USD, EUR, GBP, TRY, JPY, etc.).",
  inputSchema: {
    currency: z
      .string()
      .trim()
      .min(3)
      .max(4)
      .describe("ISO fiat currency code, e.g. 'USD', 'EUR', 'GBP', 'TRY'.")
      .default("USD"),
  },
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async ({ currency }) => {
    const cur = (currency || "USD").toUpperCase();
    const url = `https://fyquklzfhkeiybhdnccb.supabase.co/functions/v1/price-proxy?vs=${encodeURIComponent(
      cur.toLowerCase(),
    )}`;
    try {
      const res = await fetch(url, { headers: { accept: "application/json" } });
      if (!res.ok) {
        return {
          content: [
            { type: "text", text: `Price proxy returned HTTP ${res.status}` },
          ],
          isError: true,
        };
      }
      const data = (await res.json()) as Record<string, unknown>;
      const price =
        (data?.bitcoin as Record<string, number> | undefined)?.[
          cur.toLowerCase()
        ] ??
        (data as Record<string, number>)[cur.toLowerCase()] ??
        (data as Record<string, number>).price;
      if (typeof price !== "number") {
        return {
          content: [
            {
              type: "text",
              text: `Could not parse price for ${cur} from response: ${JSON.stringify(data).slice(0, 300)}`,
            },
          ],
          isError: true,
        };
      }
      return {
        content: [
          {
            type: "text",
            text: `1 BTC ≈ ${price.toLocaleString("en-US", { maximumFractionDigits: 2 })} ${cur}`,
          },
        ],
        structuredContent: { currency: cur, price, source: "price-proxy" },
      };
    } catch (err) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to fetch price: ${(err as Error).message}`,
          },
        ],
        isError: true,
      };
    }
  },
});
