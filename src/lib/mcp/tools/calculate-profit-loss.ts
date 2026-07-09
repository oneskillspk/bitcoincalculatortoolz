import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

/**
 * Pure profit/loss calculator — no external API calls.
 */
export default defineTool({
  name: "calculate_bitcoin_profit_loss",
  title: "Bitcoin profit/loss",
  description:
    "Calculate profit or loss on a Bitcoin trade from buy price, sell price, and amount. Returns absolute P/L, percentage return, and total invested/sold values.",
  inputSchema: {
    buy_price_usd: z.number().positive().describe("Purchase price per BTC in USD."),
    sell_price_usd: z.number().positive().describe("Sell (or current) price per BTC in USD."),
    btc_amount: z.number().positive().describe("Amount of BTC in the position."),
    fee_pct: z
      .number()
      .min(0)
      .max(10)
      .optional()
      .describe("Optional round-trip fee percentage (e.g. 0.5 for 0.5%)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ buy_price_usd, sell_price_usd, btc_amount, fee_pct }) => {
    const invested = buy_price_usd * btc_amount;
    const gross = sell_price_usd * btc_amount;
    const fees = ((fee_pct ?? 0) / 100) * (invested + gross);
    const net = gross - invested - fees;
    const pct = (net / invested) * 100;
    return {
      content: [
        {
          type: "text",
          text:
            `Invested $${invested.toLocaleString()} · Sold $${gross.toLocaleString()} · ` +
            `Fees $${fees.toLocaleString(undefined, { maximumFractionDigits: 2 })} · ` +
            `Net ${net >= 0 ? "+" : ""}$${net.toLocaleString(undefined, { maximumFractionDigits: 2 })} (${pct.toFixed(2)}%)`,
        },
      ],
      structuredContent: {
        invested_usd: invested,
        gross_usd: gross,
        fees_usd: fees,
        net_profit_usd: net,
        return_pct: pct,
      },
    };
  },
});
