import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

/**
 * Simple constant-price DCA projection. Uses the live spot price as
 * a stand-in for average cost — a rough estimate matching the
 * calculator's "flat-price" preview mode, not a historical backtest.
 */
export default defineTool({
  name: "simulate_dca",
  title: "Simulate Bitcoin DCA",
  description:
    "Estimate the outcome of a Bitcoin dollar-cost-averaging plan: total invested, BTC accumulated, and current value at the live spot price.",
  inputSchema: {
    contribution: z
      .number()
      .positive()
      .describe("Amount contributed each period."),
    frequency: z
      .enum(["daily", "weekly", "monthly"])
      .default("monthly")
      .describe("Contribution frequency."),
    years: z
      .number()
      .positive()
      .max(50)
      .describe("Number of years to run the plan."),
    currency: z
      .string()
      .trim()
      .min(3)
      .max(4)
      .default("USD")
      .describe("Fiat currency of the contribution."),
  },
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async ({ contribution, frequency, years, currency }) => {
    const cur = currency.toUpperCase();
    const periodsPerYear =
      frequency === "daily" ? 365 : frequency === "weekly" ? 52 : 12;
    const periods = Math.round(years * periodsPerYear);
    const totalInvested = contribution * periods;

    let price: number | null = null;
    try {
      const res = await fetch(
        `https://fyquklzfhkeiybhdnccb.supabase.co/functions/v1/price-proxy?vs=${cur.toLowerCase()}`,
      );
      if (res.ok) {
        const data = (await res.json()) as Record<string, unknown>;
        price =
          (data?.bitcoin as Record<string, number> | undefined)?.[
            cur.toLowerCase()
          ] ??
          (data as Record<string, number>)[cur.toLowerCase()] ??
          null;
      }
    } catch {
      /* fall through */
    }
    if (!price) {
      return {
        content: [
          { type: "text", text: "Could not fetch BTC price for the projection." },
        ],
        isError: true,
      };
    }

    const btcAccumulated = totalInvested / price;
    const currentValue = btcAccumulated * price;
    const roi = ((currentValue - totalInvested) / totalInvested) * 100;

    const fmt = (n: number, d = 2) =>
      n.toLocaleString("en-US", { maximumFractionDigits: d });

    return {
      content: [
        {
          type: "text",
          text:
            `DCA plan: ${fmt(contribution)} ${cur} ${frequency} for ${years} years (${periods} contributions)\n` +
            `Total invested: ${fmt(totalInvested)} ${cur}\n` +
            `BTC accumulated (at flat ${fmt(price)} ${cur}/BTC): ${fmt(btcAccumulated, 8)} BTC\n` +
            `Current value: ${fmt(currentValue)} ${cur} (ROI ${fmt(roi)}%)\n` +
            `Note: assumes constant price. For a historical backtest, use the DCA calculator on the site.`,
        },
      ],
      structuredContent: {
        contribution,
        frequency,
        years,
        periods,
        currency: cur,
        total_invested: totalInvested,
        btc_accumulated: btcAccumulated,
        spot_price: price,
        current_value: currentValue,
        roi_percent: roi,
      },
    };
  },
});
