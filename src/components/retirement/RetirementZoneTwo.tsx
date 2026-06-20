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
export const RetirementZoneTwo = ({ language }: Props) => (
  <PageSection
    tone="subtle"
    width="wide"
    spacing="default"
    eyebrow={language === 'tr' ? 'Rakamlarla' : 'By the Numbers'}
  >
    <RetirementComparisonTable />
    <RetirementBtcScenariosTable />
    <RetirementVsTraditionalTable />
  </PageSection>
);
