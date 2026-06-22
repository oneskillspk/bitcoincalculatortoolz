import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { REGION_META, TAX_LAST_REVIEWED_LABEL, type RegionId } from "./regionMeta";

interface Props {
  region: RegionId;
  isTr: boolean;
}

export const TaxMethodologySection = ({ region, isTr }: Props) => {
  const m = REGION_META[region];
  const steps = isTr ? m.methodology.tr : m.methodology.en;

  return (
    <section
      aria-labelledby="tax-method-heading"
      className="container mx-auto max-w-4xl px-6 py-12"
    >
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle id="tax-method-heading" className="text-xl md:text-2xl">
            {isTr ? "Nasıl hesaplıyoruz" : "How we calculate"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
            {steps.map((step, i) => (
              <li key={i}>
                <span className="text-foreground">{step}</span>
              </li>
            ))}
          </ol>

          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <div className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
              {isTr ? "Kaynaklar" : "Sources"}
            </div>
            <ul className="space-y-1.5 text-sm">
              {m.sources.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-primary hover:underline"
                  >
                    {s.label}
                    <ExternalLink className="h-3 w-3" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-muted-foreground">
            {isTr
              ? "Yalnızca tahmin. Resmi başvuru için nitelikli bir vergi danışmanına başvurun."
              : "Estimate only. Consult a qualified tax advisor before filing."}
          </p>
        </CardContent>
      </Card>
    </section>
  );
};

export default TaxMethodologySection;
