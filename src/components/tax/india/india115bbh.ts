/**
 * India §115BBH tax math (Finance Act 2022) — single source of truth.
 *
 * Rules encoded here:
 *   1. Base income-tax    = gain × 30%                       (§115BBH(1)(a))
 *   2. Health & Edu cess  = base × 4%   → effective 31.2%    (Finance Act, cess)
 *   3. §194S TDS          = proceeds × 1% (withheld, creditable — NOT extra tax)
 *   4. Losses cannot be set off against other income or carried forward
 *
 * Returns:
 *   gain         positive gain (losses clamped to 0 for liability purposes)
 *   baseTax      30% of gain
 *   cess         4% of baseTax
 *   liability    baseTax + cess (= 31.2% of gain) — the actual §115BBH bill
 *   tds          1% of gross proceeds (creditable, shown separately)
 *   refund       max(0, tds − liability)   — refundable via ITR filing
 *   payable      max(0, liability − tds)   — additional cash owed at filing
 *   cashAtSale   liability + tds (what leaves the account at trade time,
 *                before any refund adjustment via ITR)
 *
 * Keeping this pure lets tests lock the constants against Finance Act 2022 /
 * §194S so no future edit can silently break the math.
 */
export function computeIndia115BBH(input: {
  proceeds: number;
  costBasis: number;
}): {
  gain: number;
  baseTax: number;
  cess: number;
  liability: number;
  tds: number;
  refund: number;
  payable: number;
  cashAtSale: number;
} {
  const proceeds = Math.max(0, input.proceeds);
  const costBasis = Math.max(0, input.costBasis);
  const gain = Math.max(0, proceeds - costBasis);
  const baseTax = gain * 0.3;
  const cess = baseTax * 0.04;
  const liability = baseTax + cess;
  const tds = proceeds * 0.01;
  return {
    gain,
    baseTax,
    cess,
    liability,
    tds,
    refund: Math.max(0, tds - liability),
    payable: Math.max(0, liability - tds),
    cashAtSale: liability + tds,
  };
}

/** Effective §115BBH tax rate on a positive gain, expressed as a percentage. */
export const IN_115BBH_EFFECTIVE_RATE_PCT = 31.2;
