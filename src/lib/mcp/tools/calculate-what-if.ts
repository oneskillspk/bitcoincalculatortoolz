import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

/**
 * Bitcoin "what if you had invested" calculator.
 * Fetches historical BTC price for the given date and computes the value
 * of that hypothetical investment at today's price.
 */
export default defineTool({
  name: "calculate_bitcoin_what_if",
  title: "Bitcoin what-if investment",
  description:
    "Given a past investment date and USD amount, returns what that investment in Bitcoin would be worth today, including BTC amount, current value, gain/loss, and multiple.",
  inputSchema: {
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .describe("Investment date in YYYY-MM-DD format. Bitcoin history is available from 2013-04-28 onward."),
    usd_amount: z
      .number()
      .positive()
      .describe("Amount invested in USD on that date."),
  },
  annotations: { readOnlyHint: true, idempotentHint: false, openWorldHint: true },
  handler: async ({ date, usd_amount }) => {
    // Historical: CoinGecko /coins/bitcoin/history?date=DD-MM-YYYY
    const [y, m, d] = date.split("-");
    const cgDate = `${d}-${m}-${y}`;
    try {
      const [histRes, curRes] = await Promise.all([
        fetch(`https://api.coingecko.com/api/v3/coins/bitcoin/history?date=${cgDate}&localization=false`, {
          headers: { accept: "application/json" },
        }),
        fetch(`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd`, {
          headers: { accept: "application/json" },
        }),
      ]);
      if (!histRes.ok || !curRes.ok) {
        return {
          content: [{ type: "text", text: `Price API error: hist=${histRes.status}, current=${curRes.status}` }],
          isError: true,
        };
      }
      const hist = (await histRes.json()) as { market_data?: { current_price?: { usd?: number } } };
      const cur = (await curRes.json()) as { bitcoin?: { usd?: number } };
      const priceThen = hist.market_data?.current_price?.usd;
      const priceNow = cur.bitcoin?.usd;
      if (!priceThen || !priceNow) {
        return {
          content: [{ type: "text", text: `No price available for ${date}. Bitcoin market data starts 2013-04-28.` }],
          isError: true,
        };
      }
      const btc = usd_amount / priceThen;
      const valueNow = btc * priceNow;
      const gain = valueNow - usd_amount;
      const multiple = valueNow / usd_amount;
      const summary =
        `$${usd_amount.toLocaleString()} on ${date} bought ${btc.toFixed(6)} BTC ` +
        `@ $${priceThen.toLocaleString()}. ` +
        `Today: $${valueNow.toLocaleString(undefined, { maximumFractionDigits: 2 })} ` +
        `(${multiple.toFixed(2)}×, ${gain >= 0 ? "+" : ""}$${gain.toLocaleString(undefined, { maximumFractionDigits: 2 })}).`;
      return {
        content: [{ type: "text", text: summary }],
        structuredContent: {
          date,
          usd_invested: usd_amount,
          price_then_usd: priceThen,
          price_now_usd: priceNow,
          btc_acquired: btc,
          value_now_usd: valueNow,
          gain_usd: gain,
          multiple,
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
