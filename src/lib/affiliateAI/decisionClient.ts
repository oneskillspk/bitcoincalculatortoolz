/**
 * Rule-based, client-side decision. The previous implementation read
 * `decisions_cache` and `affiliate_overrides` from Cloud, but the
 * round-trip added measurable layout shift on calculator pages and the
 * cache was never reliably populated. We now run the deterministic
 * scoring engine in-process — zero network, zero layout shift.
 *
 * The function is still async-returning so existing call sites that
 * `await` it keep working without changes.
 */
import type { AIDecision, CalculatorContext } from "./types";
import { scoreAndPick } from "./scoringEngine";

export async function fetchDecision(
  ctx: CalculatorContext
): Promise<AIDecision> {
  return scoreAndPick(ctx);
}
