import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

/**
 * Return a catalog of the site's calculators with their public URLs so an
 * assistant can deep-link users to the right tool.
 */
const CALCULATORS: Array<{ name: string; slug: string; description: string }> = [
  { name: "Bitcoin Converter", slug: "bitcoin-converter", description: "BTC ↔ sats ↔ fiat converter." },
  { name: "Bitcoin DCA Calculator", slug: "bitcoin-dca-calculator", description: "Backtest dollar-cost-averaging into BTC." },
  { name: "Bitcoin Profit / Loss", slug: "bitcoin-profit-loss-calculator", description: "P&L from a BTC buy at price X and sell at price Y." },
  { name: "Bitcoin Retirement", slug: "bitcoin-retirement-calculator", description: "FIRE and retirement planning around a BTC nest egg." },
  { name: "Bitcoin Investment Calculator", slug: "bitcoin-investment-calculator", description: "Growth projection for a lump-sum BTC investment." },
  { name: "Bitcoin Savings Calculator", slug: "bitcoin-savings-calculator", description: "Compare BTC vs fiat savings growth." },
  { name: "Bitcoin Capital Gains Tax", slug: "bitcoin-capital-gains-tax-calculator", description: "Generic BTC capital-gains estimator." },
  { name: "Bitcoin UK CGT", slug: "bitcoin-uk-cgt-calculator", description: "UK Capital Gains Tax estimator for BTC." },
  { name: "Bitcoin Germany Tax", slug: "bitcoin-germany-tax-calculator", description: "Germany BTC tax estimator (1-year rule)." },
  { name: "Bitcoin India Tax", slug: "bitcoin-india-tax-calculator", description: "India 30% VDA tax estimator." },
  { name: "Bitcoin Mining Profitability", slug: "bitcoin-mining-profitability-calculator", description: "Mining P&L given hashrate, power cost, difficulty." },
  { name: "Bitcoin Halving Countdown", slug: "bitcoin-halving-countdown", description: "Time until the next Bitcoin halving." },
  { name: "Bitcoin Fear & Greed", slug: "bitcoin-fear-greed-index", description: "Current market sentiment index." },
  { name: "Bitcoin Rainbow Chart", slug: "bitcoin-rainbow-chart", description: "Long-term price valuation band chart." },
  { name: "Bitcoin Purchasing Power", slug: "bitcoin-purchasing-power-calculator", description: "What USD purchasing power your BTC represents." },
  { name: "Bitcoin Pizza Day", slug: "bitcoin-pizza-day-calculator", description: "Value today of the 10 000 BTC pizza purchase." },
];

const BASE_URL = "https://bitcoincalculatortoolz.lovable.app";

export default defineTool({
  name: "list_calculators",
  title: "List calculators",
  description:
    "List available Bitcoin calculators on the site with descriptions and public URLs. Supports optional keyword filtering.",
  inputSchema: {
    query: z
      .string()
      .trim()
      .optional()
      .describe("Optional case-insensitive substring to filter by name/description."),
    lang: z
      .enum(["en", "tr"])
      .default("en")
      .describe("Language variant for the returned URLs (English or Turkish)."),
  },
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: ({ query, lang }) => {
    const q = query?.toLowerCase();
    const items = CALCULATORS.filter(
      (c) =>
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.slug.includes(q),
    ).map((c) => ({
      ...c,
      url: lang === "tr" ? `${BASE_URL}/tr/${c.slug}` : `${BASE_URL}/${c.slug}`,
    }));

    const text = items.length
      ? items
          .map((c) => `• ${c.name} — ${c.description}\n  ${c.url}`)
          .join("\n")
      : "No calculators matched that query.";

    return {
      content: [{ type: "text", text }],
      structuredContent: { count: items.length, items },
    };
  },
});
