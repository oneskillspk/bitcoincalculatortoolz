import { PageSection } from "@/components/calculator";
import { WhatIfRealExamples } from "@/components/what-if/WhatIfRealExamples";
import { WhatIfKeyDates } from "@/components/what-if/WhatIfKeyDates";

interface Props {
  language: string;
}

/**
 * Zone 2 — By the Numbers. Historical scenarios table + key Bitcoin dates.
 * Children render raw content only; PageSection provides the shell (no
 * inner <section>/py wrappers inside the children).
 */
export const WhatIfZoneTwo = ({ language }: Props) => (
  <PageSection
    tone="subtle"
    width="wide"
    spacing="default"
    eyebrow={language === "tr" ? "Rakamlarla" : "By the Numbers"}
  >
    <WhatIfRealExamples />
    <WhatIfKeyDates />
  </PageSection>
);
