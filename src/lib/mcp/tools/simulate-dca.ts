import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

/**
 * Simulates a Dollar-Cost-Averaging (DCA) strategy against BTC historical
 * daily closes. Uses CoinGecko's market_chart endpoint for the range.
 */
export default defineTool({
  name: "simulate_bitcoin_dca",
  title: "Bitcoin DCA simulation",
  description:
    "Simulate a Dollar-Cost-Averaging strategy: buy a fixed USD amount of BTC on a regular cadence between two dates. Returns total invested, BTC accumulated, current value, and ROI.",
  inputSchema: {
    start_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .describe("Start date YYYY-MM-DD (>= 2013-04-28)."),
    end_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional()
      .describe("End date YYYY-MM-DD. Defaults to today."),
    usd_per_purchase: z.number().positive().describe("USD amount to buy each period."),
    cadence_days: z
      .number()
      .int()
      .min(1)
      .max(90)
      .default(7)
      .describe("Days between purchases. Default 7 (weekly)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: false, openWorldHint: true },
  handler: async ({ start_date, end_date, usd_per_purchase, cadence_days }) => {
    const start = new Date(`${start_date}T00:00:00Z`).getTime();
    const end = end_date ? new Date(`${end_date}T00:00:00Z`).getTime() : Date.now();
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
      return { content: [{ type: "text", text: "Invalid date range." }], isError: true };
    }
    const from = Math.floor(start / 1000);
    const to = Math.floor(end / 1000);
    try {
      const url = `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=usd&from=${from}&to=${to}`;
      const res = await fetch(url, { headers: { accept: "application/json" } });
      if (!res.ok) {
        return {
          content: [{ type: "text", text: `CoinGecko error: HTTP ${res.status}` }],
          isError: true,
        };
      }
      const raw = (await res.json()) as { prices?: [number, number][] };
      const prices = raw.prices ?? [];
      if (!prices.length) {
        return { content: [{ type: "text", text: "No price data in range." }], isError: true };
      }
      // Reduce to daily closes (last sample per UTC day).
      const dailies = new Map<string, number>();
      for (const [ts, p] of prices) {
        const d = new Date(ts).toISOString().slice(0, 10);
        dailies.set(d, p);
      }
      const ordered = [...dailies.entries()].sort();
      let totalUsd = 0;
      let totalBtc = 0;
      let purchases = 0;
      let lastBuyTs = -Infinity;
      const oneDayMs = 86_400_000;
      for (const [d, price] of ordered) {
        const ts = new Date(`${d}T00:00:00Z`).getTime();
        if (ts - lastBuyTs >= cadence_days * oneDayMs) {
          totalUsd += usd_per_purchase;
          totalBtc += usd_per_purchase / price;
          purchases += 1;
          lastBuyTs = ts;
        }
      }
      const lastPrice = ordered[ordered.length - 1][1];
      const value = totalBtc * lastPrice;
      const roiPct = ((value - totalUsd) / totalUsd) * 100;
      return {
        content: [
          {
            type: "text",
            text:
              `${purchases} purchases · $${totalUsd.toLocaleString()} invested → ` +
              `${totalBtc.toFixed(6)} BTC worth $${value.toLocaleString(undefined, { maximumFractionDigits: 2 })} ` +
              `(${roiPct >= 0 ? "+" : ""}${roiPct.toFixed(1)}% ROI)`,
          },
        ],
        structuredContent: {
          purchases,
          total_invested_usd: totalUsd,
          total_btc: totalBtc,
          current_price_usd: lastPrice,
          current_value_usd: value,
          roi_pct: roiPct,
          cadence_days,
        },
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: `Failed: ${(err as Error).message}` }],
        isError: true,
      };
    }
  },
});
