import { PageSection } from "@/components/calculator";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import RelatedCalculators from "@/components/RelatedCalculatorsLazy";
import { WhatIfFAQSection } from "./WhatIfFAQSection";

interface Props {
  language: string;
}

/**
 * Zone 4 — Questions & Sources. FAQ (with JSON-LD parity EN=TR),
 * related calculators, and disclaimer. Uses semantic foreground tokens
 * only per spec Section 1 dark-zone rule.
 */
export const WhatIfZoneFour = ({ language }: Props) => {
  const tr = language === "tr";
  return (
    <PageSection
      tone="dark"
      width="wide"
      spacing="loose"
    >
      <div className="space-y-14 text-foreground">
        <WhatIfFAQSection />

        <div className="max-w-6xl mx-auto">
          <RelatedCalculators />
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="border-border/40 bg-card/60 backdrop-blur-sm rounded-2xl">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-warning mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {tr ? "Sorumluluk Reddi" : "Disclaimer"}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tr
                      ? "Bu hesaplayıcı yalnızca eğitim amaçlıdır. Geçmiş performans gelecekteki sonuçları garanti etmez. Bitcoin yatırımları önemli risk taşır."
                      : "This calculator is for educational purposes only. Past performance does not guarantee future results. Bitcoin investments carry significant risk."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageSection>
  );
};
