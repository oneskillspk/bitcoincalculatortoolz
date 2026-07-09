import { auth, defineMcp } from "@lovable.dev/mcp-js";
import getBitcoinPrice from "./tools/get-bitcoin-price";
import calculateWhatIf from "./tools/calculate-what-if";
import calculateProfitLoss from "./tools/calculate-profit-loss";
import simulateDca from "./tools/simulate-dca";
import convertBitcoin from "./tools/convert-bitcoin";
import getHalvingCountdown from "./tools/get-halving-countdown";

// The OAuth issuer MUST be the direct supabase.co host, built from the project
// ref (an inlined literal via Vite `define`). Never derive from SUPABASE_URL
// (which is the .lovable.cloud proxy on managed Cloud). The fallback keeps the
// issuer well-formed during the throwaway manifest-extract eval.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "bitcoin-calculator-tools",
  title: "Bitcoin Calculator Tools",
  version: "0.1.0",
  instructions:
    "Bitcoin calculators and live market data from bitcoincalculator.tools. " +
    "Use `get_bitcoin_price` for the current BTC spot price, `convert_bitcoin` " +
    "for BTC↔fiat conversions, `calculate_bitcoin_what_if` to see what a past " +
    "USD investment would be worth today, `simulate_bitcoin_dca` for a " +
    "dollar-cost-averaging backtest, `calculate_bitcoin_profit_loss` for pure " +
    "P/L math on a trade, and `get_bitcoin_halving_countdown` for the next " +
    "halving ETA. All tools are read-only; prices are sourced from CoinGecko " +
    "and mempool.space.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    getBitcoinPrice,
    convertBitcoin,
    calculateWhatIf,
    simulateDca,
    calculateProfitLoss,
    getHalvingCountdown,
  ],
});
