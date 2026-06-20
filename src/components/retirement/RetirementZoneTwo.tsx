import { PageSection } from "@/components/calculator";
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
  <PageSection tone="subtle" width="wide" spacing="tight" className="!pt-4 !pb-0 md:!pt-6">
    <RetirementComparisonTable />
    <RetirementBtcScenariosTable />
    <RetirementVsTraditionalTable />
  </PageSection>
);
