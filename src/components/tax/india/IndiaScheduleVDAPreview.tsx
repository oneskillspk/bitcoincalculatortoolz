import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IN_COPY } from "./inTaxCopy";

interface Props {
  isTr: boolean;
}

const fmtInr = (n: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

export const IndiaScheduleVDAPreview = ({ isTr }: Props) => {
  const pick = <T,>(o: { en: T; tr: T }) => (isTr ? o.tr : o.en);
  const rows = IN_COPY.vda.sample.map((r) => ({
    ...r,
    income: r.consideration - r.cost,
  }));

  return (
    <section
      id="schedule-vda"
      aria-labelledby="schedule-vda-heading"
      className="container mx-auto max-w-5xl px-6 py-12"
    >
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle id="schedule-vda-heading" className="text-xl md:text-2xl">
            {pick(IN_COPY.vda.heading)}
          </CardTitle>
          <p className="text-sm text-muted-foreground leading-relaxed mt-2">
            {pick(IN_COPY.vda.subtitle)}
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="py-2 pr-4 font-medium">{pick(IN_COPY.vda.columns.acquired)}</th>
                  <th className="py-2 pr-4 font-medium">{pick(IN_COPY.vda.columns.transferred)}</th>
                  <th className="py-2 pr-4 font-medium text-right">{pick(IN_COPY.vda.columns.cost)}</th>
                  <th className="py-2 pr-4 font-medium text-right">{pick(IN_COPY.vda.columns.consideration)}</th>
                  <th className="py-2 font-medium text-right">{pick(IN_COPY.vda.columns.income)}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-b border-border/40">
                    <td className="py-2 pr-4 text-foreground">{r.acquired}</td>
                    <td className="py-2 pr-4 text-foreground">{r.transferred}</td>
                    <td className="py-2 pr-4 text-right text-foreground">{fmtInr(r.cost)}</td>
                    <td className="py-2 pr-4 text-right text-foreground">{fmtInr(r.consideration)}</td>
                    <td
                      className={`py-2 text-right font-semibold ${
                        r.income < 0 ? "text-destructive" : "text-foreground"
                      }`}
                    >
                      {fmtInr(r.income)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
            {pick(IN_COPY.vda.footnote)}
          </p>
        </CardContent>
      </Card>
    </section>
  );
};

export default IndiaScheduleVDAPreview;
