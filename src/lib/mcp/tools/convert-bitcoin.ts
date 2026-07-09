import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

/**
 * Bitcoin <-> USD converter using live spot price.
 */
export default defineTool({
  name: "convert_bitcoin",
  title: "Bitcoin/fiat converter",
  description:
    "Convert between BTC (or satoshis) and USD (or another fiat) at the current market price. Provide EITHER btc/sats OR fiat_amount, not both.",
  inputSchema: {
    btc: z.number().positive().optional().describe("Amount in BTC to convert TO fiat."),
    sats: z.number().positive().optional().describe("Amount in satoshis (1 BTC = 100,000,000 sats) to convert TO fiat."),
    fiat_amount: z.number().positive().optional().describe("Amount in fiat to convert TO BTC."),
    fiat: z.string().min(2).max(6).default("usd").describe("Fiat currency code, e.g. 'usd', 'eur', 'try'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: false, openWorldHint: true },
  handler: async ({ btc, sats, fiat_amount, fiat }) => {
    const provided = [btc, sats, fiat_amount].filter((v) => v !== undefined).length;
    if (provided !== 1) {
      return {
        content: [{ type: "text", text: "Provide exactly one of: btc, sats, fiat_amount." }],
        isError: true,
      };
    }
    const cur = fiat.toLowerCase();
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=${cur}`,
        { headers: { accept: "application/json" } },
      );
      if (!res.ok) {
        return { content: [{ type: "text", text: `Price API HTTP ${res.status}` }], isError: true };
      }
      const raw = (await res.json()) as { bitcoin?: Record<string, number> };
      const rate = raw.bitcoin?.[cur];
      if (!rate) {
        return { content: [{ type: "text", text: `No rate for BTC/${cur.toUpperCase()}.` }], isError: true };
      }
      let btcAmount: number;
      if (btc !== undefined) btcAmount = btc;
      else if (sats !== undefined) btcAmount = sats / 1e8;
      else btcAmount = (fiat_amount as number) / rate;
      const fiatValue = btcAmount * rate;
      return {
        content: [
          {
            type: "text",
            text: `${btcAmount.toFixed(8)} BTC = ${fiatValue.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${cur.toUpperCase()} @ ${rate.toLocaleString()} ${cur.toUpperCase()}/BTC`,
          },
        ],
        structuredContent: {
          btc: btcAmount,
          sats: Math.round(btcAmount * 1e8),
          fiat: cur,
          fiat_value: fiatValue,
          rate,
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
