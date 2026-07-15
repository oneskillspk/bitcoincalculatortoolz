import { PageSection } from "@/components/calculator";
import { SectionHeader } from "./SectionHeader";
import { LumpSumDCAContentSections } from "./LumpSumDCAContentSections";
import { LumpSumDCAHowItWorksSection } from "./LumpSumDCAHowItWorksSection";

interface Props {
  language: string;
}

/**
 * Zone 3 — Editorial / How It Works. Mirrors retirement's ZoneThree rhythm.
 */
export const LumpSumDCAZoneThree = ({ language }: Props) => {
  const tr = language === 'tr';
  return (
    <PageSection
      tone="default"
      width="wide"
      spacing="loose"
      aria-labelledby="lump-sum-dca-overview-heading"
    >
      <SectionHeader
        id="lump-sum-dca-overview-heading"
        eyebrow={tr ? 'Genel Bakış' : 'Overview'}
        title={tr ? 'Toplu Yatırım mı, DCA mı?' : 'Lump Sum or DCA?'}
        lead={tr
          ? "Vanguard geleneksel piyasalarda toplu yatırımın kazandığını gösterdi — ancak Bitcoin'in 4 yıllık halving döngüleri hikâyeyi değiştirir. Verinin ne söylediğini görün."
          : "Vanguard showed lump sum wins in traditional markets — but Bitcoin's 4-year halving cycles change the story. See what the data actually says."}
      />

      <LumpSumDCAContentSections />
      <LumpSumDCAHowItWorksSection />
    </PageSection>
  );
};
