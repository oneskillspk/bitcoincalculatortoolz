import { PageSection } from "@/components/calculator";
import { WhatIfContentSections } from "@/components/what-if/WhatIfContentSections";
import { WhatIfWhyBitcoinGrew } from "@/components/what-if/WhatIfWhyBitcoinGrew";

interface Props {
  language: string;
}

/**
 * Zone 3 — How It Works. Editorial / methodology primer for the What If
 * calculator. Children render raw content only.
 */
export const WhatIfZoneThree = ({ language }: Props) => (
  <PageSection
    tone="default"
    width="wide"
    spacing="loose"
    eyebrow={language === "tr" ? "Nasıl Çalışır" : "How It Works"}
  >
    <WhatIfContentSections />
    <WhatIfWhyBitcoinGrew />
  </PageSection>
);
