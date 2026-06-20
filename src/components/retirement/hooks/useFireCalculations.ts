import { useMemo } from "react";
import type { FireModeInputs } from "@/components/retirement/FireModeInputsPanel";
import type { FireModeResultsData, FireScenario } from "@/components/retirement/FireModeResults";

const GROWTH_SCENARIOS = [
  { label: "Bear", rate: 8 },
  { label: "Base", rate: 15 },
  { label: "Bull", rate: 25 },
  { label: "Hyper", rate: 35 },
] as const;

/**
 * FIRE Mode "years to FIRE" simulator. Lifted verbatim from page shell.
 */
export function useFireCalculations(
  fireInputs: FireModeInputs,
  currentBtcPrice: number,
  hasFireCalculated: boolean,
): FireModeResultsData | null {
  return useMemo(() => {
    if (!currentBtcPrice || !hasFireCalculated) return null;

    const fireTarget = fireInputs.annualExpenses / (fireInputs.withdrawalRate / 100);
    const currentPortfolio = fireInputs.currentBtcHoldings * currentBtcPrice;
    const currentProgress = (currentPortfolio / fireTarget) * 100;

    const scenarios: FireScenario[] = GROWTH_SCENARIOS.map(({ label, rate }) => {
      let btcHoldings = fireInputs.currentBtcHoldings;
      let year = 0;
      const maxYears = 60;

      while (year < maxYears) {
        const btcPrice = currentBtcPrice * Math.pow(1 + rate / 100, year);
        const portfolioValue = btcHoldings * btcPrice;
        if (portfolioValue >= fireTarget) {
          const annualBtcWithdrawal = fireInputs.annualExpenses / btcPrice;
          return {
            label,
            growthRate: rate,
            fireAge: fireInputs.currentAge + year,
            yearsToFire: year,
            totalBtcAtFire: btcHoldings,
            btcPriceAtFire: btcPrice,
            portfolioValueAtFire: portfolioValue,
            annualBtcWithdrawal,
            monthlyBtcWithdrawal: annualBtcWithdrawal / 12,
          };
        }
        for (let m = 0; m < 12; m++) {
          btcHoldings +=
            fireInputs.monthlyContribution /
            (currentBtcPrice * Math.pow(1 + rate / 100, year + m / 12));
        }
        year++;
      }

      const finalPrice = currentBtcPrice * Math.pow(1 + rate / 100, maxYears);
      const finalValue = btcHoldings * finalPrice;
      const annualBtcWithdrawal = fireInputs.annualExpenses / finalPrice;
      return {
        label,
        growthRate: rate,
        fireAge: fireInputs.currentAge + maxYears,
        yearsToFire: maxYears,
        totalBtcAtFire: btcHoldings,
        btcPriceAtFire: finalPrice,
        portfolioValueAtFire: finalValue,
        annualBtcWithdrawal,
        monthlyBtcWithdrawal: annualBtcWithdrawal / 12,
      };
    });

    return { scenarios, fireTarget, currentProgress };
  }, [fireInputs, currentBtcPrice, hasFireCalculated]);
}
