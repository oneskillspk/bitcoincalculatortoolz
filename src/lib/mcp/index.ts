import { defineMcp } from "@lovable.dev/mcp-js";
import getBitcoinPrice from "./tools/get-bitcoin-price";
import convertBitcoin from "./tools/convert-bitcoin";
import simulateDca from "./tools/simulate-dca";
import listCalculators from "./tools/list-calculators";

export default defineMcp({
  name: "bitcoin-calculator-toolz-mcp",
  title: "Bitcoin Calculator Toolz MCP",
  version: "0.1.0",
  instructions:
    "Tools for Bitcoin Calculator Toolz. Fetch the live BTC spot price, convert between BTC / sats / fiat, run a quick DCA projection, and browse the site's calculator catalog with deep links (EN or TR).",
  tools: [getBitcoinPrice, convertBitcoin, simulateDca, listCalculators],
});
