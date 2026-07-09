import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

/**
 * Days until the next Bitcoin halving (approx. every 210,000 blocks / ~4 years).
 * Uses mempool.space public API for current block height, then extrapolates
 * with a 10-minute block target.
 */
export default defineTool({
  name: "get_bitcoin_halving_countdown",
  title: "Bitcoin halving countdown",
  description:
    "Returns the current block height, next halving block, estimated days until the next halving, and post-halving block subsidy.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: false, openWorldHint: true },
  handler: async () => {
    try {
      const res = await fetch("https://mempool.space/api/blocks/tip/height");
      if (!res.ok) {
        return { content: [{ type: "text", text: `mempool.space HTTP ${res.status}` }], isError: true };
      }
      const height = Number(await res.text());
      if (!Number.isFinite(height)) {
        return { content: [{ type: "text", text: "Unexpected height response." }], isError: true };
      }
      const HALVING_INTERVAL = 210_000;
      const halvingsPassed = Math.floor(height / HALVING_INTERVAL);
      const nextHalvingBlock = (halvingsPassed + 1) * HALVING_INTERVAL;
      const blocksLeft = nextHalvingBlock - height;
      const minutesLeft = blocksLeft * 10;
      const days = minutesLeft / 60 / 24;
      const eta = new Date(Date.now() + minutesLeft * 60_000);
      const nextSubsidy = 50 / Math.pow(2, halvingsPassed + 1);
      return {
        content: [
          {
            type: "text",
            text:
              `Block ${height.toLocaleString()}. Next halving at block ${nextHalvingBlock.toLocaleString()} ` +
              `in ~${blocksLeft.toLocaleString()} blocks (~${days.toFixed(1)} days, ETA ${eta.toISOString().slice(0, 10)}). ` +
              `Subsidy after halving: ${nextSubsidy} BTC/block.`,
          },
        ],
        structuredContent: {
          current_block: height,
          next_halving_block: nextHalvingBlock,
          blocks_remaining: blocksLeft,
          estimated_days: days,
          estimated_date_iso: eta.toISOString(),
          next_block_subsidy_btc: nextSubsidy,
          halvings_passed: halvingsPassed,
        },
      };
    } catch (err) {
      return { content: [{ type: "text", text: `Failed: ${(err as Error).message}` }], isError: true };
    }
  },
});
