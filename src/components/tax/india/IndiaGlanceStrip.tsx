import { Percent, ReceiptIndianRupee, Landmark, Ban } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { IN_COPY } from "./inTaxCopy";

interface Props {
  isTr: boolean;
}

const ICONS = {
  flat: Percent,
  cess: ReceiptIndianRupee,
  tds: Landmark,
  noOffset: Ban,
} as const;

/** §115BBH scannable summary strip with icons for faster scanning. */
export const IndiaGlanceStrip = ({ isTr }: Props) => {
  const pick = <T,>(o: { en: T; tr: T }) => (isTr ? o.tr : o.en);
  return (
    <section
      id="in-tldr"
      aria-labelledby="in-tldr-heading"
      className="bg-muted/30 border-y border-border/40 py-12"
    >
      <div className="container mx-auto max-w-5xl px-6">
        <h2
          id="in-tldr-heading"
          className="text-2xl md:text-3xl font-bold text-foreground mb-2 text-center"
        >
          {pick(IN_COPY.glance.heading)}
        </h2>
        <p className="text-sm text-muted-foreground text-center mb-8">
          {isTr
            ? "Hindistan kripto vergisinin dört temel kuralı — tek bakışta."
            : "The four rules that shape every India crypto tax bill — at a glance."}
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {IN_COPY.glance.cards.map((c) => {
            const Icon = ICONS[c.key as keyof typeof ICONS];
            return (
              <Card
                key={c.key}
                className="border-border/60 bg-card/80 h-full transition-colors hover:border-primary/40"
              >
                <CardContent className="p-5">
                  <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {Icon ? <Icon className="h-4.5 w-4.5" aria-hidden /> : null}
                  </div>
                  <div className="text-sm font-semibold text-foreground mb-2">
                    {pick(c.title)}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {pick(c.body)}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default IndiaGlanceStrip;
