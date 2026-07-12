import RelatedCalculators from "@/components/RelatedCalculatorsLazy";

interface Props {
  isTr: boolean;
}

/**
 * Tax-themed wrapper around the shared `RelatedCalculators` rail.
 * The underlying component resolves themed picks via the page's pathname
 * and the `related` lists registered in `RelatedCalculators.tsx`.
 */
export const TaxRelatedCalculators = ({ isTr }: Props) => {
  return (
    <section
      aria-labelledby="tax-related-heading"
      className="container mx-auto max-w-6xl px-4 pb-16"
    >
      <h2
        id="tax-related-heading"
        className="mb-4 text-2xl md:text-3xl font-semibold text-foreground text-center"
      >
        {isTr ? "İlgili vergi & kazanç hesaplayıcıları" : "Related tax & gains calculators"}
      </h2>
      <p className="mb-8 text-center text-sm text-muted-foreground">
        {isTr
          ? "Diğer yargı bölgelerindeki Bitcoin vergisini karşılaştırın veya net kazancı doğrulayın."
          : "Compare Bitcoin tax across other jurisdictions or verify your net gain."}
      </p>
      <RelatedCalculators />
    </section>
  );
};

export default TaxRelatedCalculators;
