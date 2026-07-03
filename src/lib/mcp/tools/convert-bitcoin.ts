import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

/**
 * Convert between BTC, satoshis, and fiat using the live spot price.
 */
export default defineTool({
  name: "convert_bitcoin",
  title: "Convert Bitcoin ↔ fiat / sats",
  description:
    "Convert an amount between BTC, satoshis (sats), and a fiat currency using the live spot price.",
  inputSchema: {
    amount: z.number().positive().describe("Amount to convert."),
    from: z
      .enum(["BTC", "SATS", "FIAT"])
      .describe("Unit of the input amount."),
    to: z.enum(["BTC", "SATS", "FIAT"]).describe("Unit to convert to."),
    currency: z
      .string()
      .trim()
      .min(3)
      .max(4)
      .default("USD")
      .describe("Fiat currency code used when 'from' or 'to' is 'FIAT'."),
  },
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async ({ amount, from, to, currency }) => {
    const cur = (currency || "USD").toUpperCase();
    const priceUrl = `https://fyquklzfhkeiybhdnccb.supabase.co/functions/v1/price-proxy?vs=${cur.toLowerCase()}`;
    let price: number | null = null;
    try {
      const res = await fetch(priceUrl);
      if (res.ok) {
        const data = (await res.json()) as Record<string, unknown>;
        price =
          (data?.bitcoin as Record<string, number> | undefined)?.[
            cur.toLowerCase()
          ] ??
          (data as Record<string, number>)[cur.toLowerCase()] ??
          (data as Record<string, number>).price ??
          null;
      }
    } catch {
      /* handled below */
    }
    if (from !== to && (from === "FIAT" || to === "FIAT") && !price) {
      return {
        content: [
          { type: "text", text: "Could not fetch live BTC price for conversion." },
        ],
        isError: true,
      };
    }

    // Normalize input to BTC first.
    let btc: number;
    if (from === "BTC") btc = amount;
    else if (from === "SATS") btc = amount / 1e8;
    else btc = amount / (price as number); // FIAT

    let output: number;
    let unit: string;
    if (to === "BTC") {
      output = btc;
      unit = "BTC";
    } else if (to === "SATS") {
      output = Math.round(btc * 1e8);
      unit = "sats";
    } else {
      output = btc * (price as number);
      unit = cur;
    }

    const formatted =
      to === "SATS"
        ? `${output.toLocaleString("en-US")} sats`
        : `${output.toLocaleString("en-US", { maximumFractionDigits: to === "BTC" ? 8 : 2 })} ${unit}`;

    return {
      content: [
        {
          type: "text",
          text: `${amount} ${from === "FIAT" ? cur : from} = ${formatted}`,
        },
      ],
      structuredContent: {
        input: { amount, from, currency: cur },
        output: { value: output, unit },
        spot_price: price,
      },
    };
  },
});
