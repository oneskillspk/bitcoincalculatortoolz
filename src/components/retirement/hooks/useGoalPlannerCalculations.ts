import { useMemo } from "react";
import type { GoalPlannerInputs } from "@/components/retirement/GoalPlannerInputsPanel";
import type { RetirementProjection } from "@/pages/BitcoinRetirementCalculator";

export interface GoalPlannerCalculations {
  requiredMonthlyInvestment: number;
  totalBtcNeededAtRetirement: number;
  totalInvestmentRequired: number;
  feasible: boolean;
  alternativeSuggestions?: {
    retireOneYearLater: number;
    retireTwoYearsLater: number;
    reduceBudgetBy10Percent: number;
    reduceBudgetBy20Percent: number;
  };
  /** Year-by-year projection driven by the required monthly investment. */
  projections: RetirementProjection[];
}


/**
 * Goal Planner reverse calculation. Lifted verbatim from the page shell.
 */
export function useGoalPlannerCalculations(
  goalInputs: GoalPlannerInputs,
  currentBtcPrice: number,
  hasGoalCalculated: boolean,
): GoalPlannerCalculations | null {
  return useMemo(() => {
    if (!currentBtcPrice || !hasGoalCalculated) return null;

    const yearsToRetirement = goalInputs.desiredRetirementAge - goalInputs.currentAge;
    const monthsToRetirement = yearsToRetirement * 12;

    const inflationAdjustedAnnualBudget =
      goalInputs.desiredAnnualBudget *
      Math.pow(1 + goalInputs.inflationRate / 100, yearsToRetirement);

    const totalFiatNeededAtRetirement = inflationAdjustedAnnualBudget / 0.04;
    const btcPriceAtRetirement =
      currentBtcPrice *
      Math.pow(1 + goalInputs.expectedGrowthRate / 100, yearsToRetirement);
    const totalBtcNeededAtRetirement = totalFiatNeededAtRetirement / btcPriceAtRetirement;
    const btcShortfall = Math.max(0, totalBtcNeededAtRetirement - goalInputs.currentBtcHoldings);
    const requiredBtcPerMonth = btcShortfall / monthsToRetirement;
    const requiredMonthlyInvestment = requiredBtcPerMonth * currentBtcPrice;
    const totalInvestmentRequired = requiredMonthlyInvestment * monthsToRetirement;
    const feasible = requiredMonthlyInvestment <= 10000;

    let alternativeSuggestions: GoalPlannerCalculations["alternativeSuggestions"];
    if (!feasible) {
      const computeAlt = (extraYears: number) => {
        const months = (yearsToRetirement + extraYears) * 12;
        const price =
          currentBtcPrice *
          Math.pow(1 + goalInputs.expectedGrowthRate / 100, yearsToRetirement + extraYears);
        const btcNeeded =
          (inflationAdjustedAnnualBudget *
            Math.pow(1 + goalInputs.inflationRate / 100, extraYears)) /
          0.04 /
          price;
        const shortfall = Math.max(0, btcNeeded - goalInputs.currentBtcHoldings);
        return (shortfall / months) * currentBtcPrice;
      };

      const computeReduced = (factor: number) => {
        const reducedBudget = goalInputs.desiredAnnualBudget * factor;
        const reducedInflationAdjusted =
          reducedBudget * Math.pow(1 + goalInputs.inflationRate / 100, yearsToRetirement);
        const reducedFiatNeeded = reducedInflationAdjusted / 0.04;
        const reducedBtcNeeded = reducedFiatNeeded / btcPriceAtRetirement;
        const reducedShortfall = Math.max(0, reducedBtcNeeded - goalInputs.currentBtcHoldings);
        return (reducedShortfall / monthsToRetirement) * currentBtcPrice;
      };

      alternativeSuggestions = {
        retireOneYearLater: computeAlt(1),
        retireTwoYearsLater: computeAlt(2),
        reduceBudgetBy10Percent: computeReduced(0.9),
        reduceBudgetBy20Percent: computeReduced(0.8),
      };
    }

    return {
      requiredMonthlyInvestment: Math.max(0, requiredMonthlyInvestment),
      totalBtcNeededAtRetirement,
      totalInvestmentRequired,
      feasible,
      alternativeSuggestions,
    };
  }, [goalInputs, currentBtcPrice, hasGoalCalculated]);
}
