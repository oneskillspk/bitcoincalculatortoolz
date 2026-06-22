import { CompactLiveBitcoinPrice } from "@/components/CompactLiveBitcoinPrice";
import { REGION_META, type RegionId } from "./regionMeta";

interface TaxHeroProps {
  region: RegionId;
  isTr: boolean;
}

/**
 * Hero matching the RetirementHero rhythm: uppercase eyebrow pill →
 * H1 with gradient highlight → muted subtitle → metric chips → live BTC chip.
 */
export const TaxHero = ({ region, isTr }: TaxHeroProps) => {
  const m = REGION_META[region];
  const pick = <T,>(o: { en: T; tr: T }): T => (isTr ? o.tr : o.en);

  return (
    <section
      aria-labelledby="tax-hero-heading"
      className="container mx-auto px-6 py-12 md:py-16 text-center"
    >
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/60 bg-muted/40 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-6">
        <span aria-hidden>{m.flag}</span>
        {pick(m.authority)}
      </span>

      <h1
        id="tax-hero-heading"
        className="text-h1 font-bold text-foreground mb-5"
      >
        {pick(m.heading)}{" "}
        <span className="text-gradient-premium">{pick(m.highlight)}</span>
      </h1>

      <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-7 leading-relaxed">
        {pick(m.subtitle)}
      </p>

      <ul
        role="list"
        className="flex flex-wrap justify-center gap-2 mb-8"
        aria-label={isTr ? "Vergi özet metrikleri" : "Tax summary metrics"}
      >
        {pick(m.chips).map((chip) => (
          <li
            key={chip}
            className="inline-flex items-center rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs font-medium text-foreground"
          >
            {chip}
          </li>
        ))}
      </ul>

      <CompactLiveBitcoinPrice currency={m.currency} />
    </section>
  );
};

export default TaxHero;
