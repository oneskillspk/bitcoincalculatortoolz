import { Card, CardContent } from "@/components/ui/card";
import { IN_COPY } from "./inTaxCopy";

interface Props {
  isTr: boolean;
}

/** §115BBH scannable summary strip. Ids are stable for anchors + speakable. */
export const IndiaGlanceStrip = ({ isTr }: Props) => {
  const pick = <T,>(o: { en: T; tr: T }) => (isTr ? o.tr : o.en);
  return (
    <section
      id="in-tldr"
      aria-labelledby="in-tldr-heading"
      className="container mx-auto max-w-5xl px-6 py-10"
    >
      <h2
        id="in-tldr-heading"
        className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center"
      >
        {pick(IN_COPY.glance.heading)}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {IN_COPY.glance.cards.map((c) => (
          <Card key={c.key} className="border-border/60 h-full">
            <CardContent className="p-5">
              <div className="text-sm font-semibold text-foreground mb-2">
                {pick(c.title)}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {pick(c.body)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default IndiaGlanceStrip;
