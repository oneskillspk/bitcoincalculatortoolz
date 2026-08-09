import RelatedCalculators from "@/components/RelatedCalculatorsLazy";
import { useLanguage } from "@/contexts/LanguageContext";

interface Props {
  isTr: boolean;
}

/**
 * Tax-themed wrapper around the shared `RelatedCalculators` rail.
 * The underlying component resolves themed picks via the page's pathname
 * and the `related` lists registered in `RelatedCalculators.tsx`.
 */
export const TaxRelatedCalculators = ({ isTr: _isTr }: Props) => {
  const { t } = useLanguage();
  // Heading + intro deliberately removed — the underlying `RelatedCalculators`
  // rail renders its own "Explore More" section, so keeping our own heading
  // above it created a duplicate section on every tax page.
  return (
    <section
      aria-label={t('aria.relatedCalculators')}
      className="container mx-auto max-w-6xl px-4 pb-16"
    >
      <RelatedCalculators />
    </section>
  );
};

export default TaxRelatedCalculators;
