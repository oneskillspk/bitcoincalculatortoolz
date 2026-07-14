import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IN_COPY } from "./inTaxCopy";

interface Props {
  isTr: boolean;
}

const fmtInr = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

/**
 * TDS reclaim / refund estimator.
 * Formula:
 *   gain      = max(0, proceeds - cost)
 *   liability = gain * 0.30 * 1.04
 *   tds       = proceeds * 0.01
 *   refund    = max(0, tds - liability)
 *   payable   = max(0, liability - tds)
 */
export const IndiaTDSReclaimPanel = ({ isTr }: Props) => {
  const pick = <T,>(o: { en: T; tr: T }) => (isTr ? o.tr : o.en);
  const [proceeds, setProceeds] = useState<number>(400_000);
  const [cost, setCost] = useState<number>(250_000);

  const calc = useMemo(() => {
    const gain = Math.max(0, proceeds - cost);
    const liability = gain * 0.3 * 1.04;
    const tds = Math.max(0, proceeds) * 0.01;
    return {
      gain,
      liability,
      tds,
      refund: Math.max(0, tds - liability),
      payable: Math.max(0, liability - tds),
    };
  }, [proceeds, cost]);

  return (
    <section
      id="tds-reclaim"
      aria-labelledby="tds-reclaim-heading"
      className="container mx-auto max-w-4xl px-6 py-12"
    >
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle id="tds-reclaim-heading" className="text-xl md:text-2xl">
            {pick(IN_COPY.tds.heading)}
          </CardTitle>
          <p className="text-sm text-muted-foreground leading-relaxed mt-2">
            {pick(IN_COPY.tds.subtitle)}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="in-tds-proceeds">{pick(IN_COPY.tds.inputs.proceeds)}</Label>
              <Input
                id="in-tds-proceeds"
                type="number"
                inputMode="decimal"
                min={0}
                value={proceeds}
                onChange={(e) => setProceeds(Number(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="in-tds-cost">{pick(IN_COPY.tds.inputs.cost)}</Label>
              <Input
                id="in-tds-cost"
                type="number"
                inputMode="decimal"
                min={0}
                value={cost}
                onChange={(e) => setCost(Number(e.target.value) || 0)}
              />
            </div>
          </div>

          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 text-sm">
            {[
              { label: pick(IN_COPY.tds.outputs.gain), value: calc.gain },
              { label: pick(IN_COPY.tds.outputs.liability), value: calc.liability },
              { label: pick(IN_COPY.tds.outputs.tds), value: calc.tds },
              { label: pick(IN_COPY.tds.outputs.refund), value: calc.refund, accent: true },
              { label: pick(IN_COPY.tds.outputs.payable), value: calc.payable },
            ].map((row) => (
              <div
                key={row.label}
                className={`rounded-lg border p-3 ${
                  row.accent ? "border-primary/60 bg-primary/5" : "border-border/60 bg-card/50"
                }`}
              >
                <dt className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                  {row.label}
                </dt>
                <dd className="text-base font-semibold text-foreground">
                  {fmtInr(Math.round(row.value))}
                </dd>
              </div>
            ))}
          </dl>

          <p className="text-xs text-muted-foreground leading-relaxed">
            {pick(IN_COPY.tds.note)}
          </p>
        </CardContent>
      </Card>
    </section>
  );
};

export default IndiaTDSReclaimPanel;
