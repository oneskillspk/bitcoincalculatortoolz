import { useMemo } from "react";
import type { RetirementInputs, RetirementProjection } from "@/pages/BitcoinRetirementCalculator";

export interface RetirementMetrics {
  totalBtcAtRetirement: number;
  btcPriceAtRetirement: number;
  totalFiatValueAtRetirement: number;
  yearsUntilRetirement: number;
  projectedYearsOfRetirement: number;
  totalContributions: number;
  roi: number;
}

export interface RetirementCalculations {
  projections: RetirementProjection[];
  metrics: RetirementMetrics | null;
}

/**
 * Forecaster mode projection. Pure derivation from inputs + live BTC price;
 * mirrors the original inline `useMemo` from the page shell verbatim so the
 * P2 refactor is behaviour-preserving.
 */
export function useRetirementCalculations(
  inputs: RetirementInputs,
  currentBtcPrice: number,
  hasCalculated: boolean,
): RetirementCalculations {
  return useMemo(() => {
    if (!currentBtcPrice || !hasCalculated) {
      return { projections: [], metrics: null };
    }

    const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
    const monthsToRetirement = yearsToRetirement * 12;

    let totalBtcAtRetirement = inputs.currentBtcHoldings;
    for (let month = 1; month <= monthsToRetirement; month++) {
      totalBtcAtRetirement += inputs.monthlyContribution / currentBtcPrice;
    }

    const btcPriceAtRetirement =
      currentBtcPrice * Math.pow(1 + inputs.expectedGrowthRate / 100, yearsToRetirement);
    const totalFiatValueAtRetirement = totalBtcAtRetirement * btcPriceAtRetirement;

    const projections: RetirementProjection[] = [];
    let remainingBtc = totalBtcAtRetirement;
    const currentYear = new Date().getFullYear() + yearsToRetirement;

    if (inputs.mode === "conservative") {
      const adjustedValue =
        totalFiatValueAtRetirement /
        Math.pow(1 + inputs.inflationRate / 100, yearsToRetirement);
      const annualBudget = adjustedValue * 0.04;
      const yearsOfRetirement = Math.floor(adjustedValue / annualBudget);
      for (let year = 0; year < Math.min(yearsOfRetirement, 30); year++) {
        projections.push({
          year: currentYear + year,
          age: inputs.retirementAge + year,
          btcHoldings: 0,
          btcPrice:
            btcPriceAtRetirement * Math.pow(1 + inputs.expectedGrowthRate / 100, year),
          fiatValue: Math.max(0, adjustedValue - annualBudget * year),
          annualBudget: annualBudget / Math.pow(1 + inputs.inflationRate / 100, year),
          monthlyBudget:
            annualBudget / 12 / Math.pow(1 + inputs.inflationRate / 100, year),
        });
      }
    } else {
      for (let year = 0; year < 30; year++) {
        const yearBtcPrice =
          btcPriceAtRetirement * Math.pow(1 + inputs.expectedGrowthRate / 100, year);
        const currentValue = remainingBtc * yearBtcPrice;
        const annualWithdrawal = currentValue * 0.04;
        const btcToSell = annualWithdrawal / yearBtcPrice;
        remainingBtc = Math.max(0, remainingBtc - btcToSell);
        projections.push({
          year: currentYear + year,
          age: inputs.retirementAge + year,
          btcHoldings: remainingBtc,
          btcPrice: yearBtcPrice,
          fiatValue: remainingBtc * yearBtcPrice,
          annualBudget: annualWithdrawal / Math.pow(1 + inputs.inflationRate / 100, year),
          monthlyBudget:
            annualWithdrawal / 12 / Math.pow(1 + inputs.inflationRate / 100, year),
          withdrawnBtc: btcToSell,
          remainingBtc,
        });
        if (remainingBtc <= 0) break;
      }
    }

    const baseInvested =
      inputs.currentBtcHoldings * currentBtcPrice +
      inputs.monthlyContribution * monthsToRetirement;

    const metrics: RetirementMetrics = {
      totalBtcAtRetirement,
      btcPriceAtRetirement,
      totalFiatValueAtRetirement,
      yearsUntilRetirement: yearsToRetirement,
      projectedYearsOfRetirement: projections.length,
      totalContributions: inputs.monthlyContribution * monthsToRetirement,
      roi: ((totalFiatValueAtRetirement - baseInvested) / baseInvested) * 100,
    };

    return { projections, metrics };
  }, [inputs, currentBtcPrice, hasCalculated]);
}
