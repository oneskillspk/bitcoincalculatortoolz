import { RetirementComparisonTable } from "@/components/retirement/RetirementComparisonTable";
import { RetirementVsTraditionalTable } from "@/components/retirement/RetirementVsTraditionalTable";
import { PageSection } from "@/components/calculator";

interface Props {
  language: string;
}

/**
 * Zone 2 — Data & Comparison. Comparison table, BTC income scenarios,
 * and the 60/40 traditional-portfolio comparison.
 */
export const RetirementZoneTwo = ({ language: _language }: Props) => (
  <PageSection
    tone="subtle"
    width="wide"
    spacing="default"
    eyebrow={_language === 'tr' ? 'Rakamlarla' : 'By the Numbers'}
  >
    <RetirementComparisonTable />
    <RetirementVsTraditionalTable />
  </PageSection>
);
