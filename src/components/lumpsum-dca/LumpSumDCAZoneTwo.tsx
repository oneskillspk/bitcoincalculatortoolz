import { PageSection } from "@/components/calculator";
import { LumpSumVsDcaWinRateTable } from "./LumpSumVsDcaWinRateTable";
import { LumpSumVsDcaVsTradTable } from "./LumpSumVsDcaVsTradTable";

interface Props {
  language: string;
}

/**
 * Zone 2 — Data & Comparison. Historical win-rate table + BTC-vs-traditional
 * comparison. Mirrors the retirement page's "By the Numbers" zone.
 */
export const LumpSumDCAZoneTwo = ({ language }: Props) => (
  <PageSection
    tone="subtle"
    width="wide"
    spacing="default"
    eyebrow={language === 'tr' ? 'Rakamlarla' : 'By the Numbers'}
  >
    <LumpSumVsDcaWinRateTable />
    <LumpSumVsDcaVsTradTable />
  </PageSection>
);
