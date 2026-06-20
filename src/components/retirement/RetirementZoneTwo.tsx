import { RetirementComparisonTable } from "@/components/retirement/RetirementComparisonTable";
import { RetirementBtcScenariosTable } from "@/components/retirement/RetirementBtcScenariosTable";
import { RetirementVsTraditionalTable } from "@/components/retirement/RetirementVsTraditionalTable";

interface Props {
  language: string;
}

/**
 * Zone 2 — Data & Comparison. Comparison table, BTC income scenarios,
 * and the 60/40 traditional-portfolio comparison.
 */
export const RetirementZoneTwo = ({ language: _language }: Props) => (
  <>
    <RetirementComparisonTable />
    <RetirementBtcScenariosTable />
    <RetirementVsTraditionalTable />
  </>
);
