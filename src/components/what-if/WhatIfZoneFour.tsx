import { PageSection } from "@/components/calculator";
import RelatedCalculators from "@/components/RelatedCalculatorsLazy";

interface Props {
  language: string;
}

/**
 * Zone 4 — Questions & Sources. Placeholder wrapper populated in Phase 4
 * with FAQ (+ JSON-LD parity EN=TR), methodology, sources, related
 * calculators, and disclaimer. Uses semantic foreground tokens only per
 * spec Section 1 dark-zone rule.
 */
export const WhatIfZoneFour = ({ language }: Props) => (
  <PageSection
    tone="dark"
    width="wide"
    spacing="loose"
    eyebrow={language === "tr" ? "Sorular ve Kaynaklar" : "Questions & Sources"}
  >
    <div className="text-foreground">
      <RelatedCalculators />
    </div>
  </PageSection>
);
