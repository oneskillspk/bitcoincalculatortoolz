import { AffiliatePlacement } from "@/components/affiliateAI/AffiliatePlacement";
import type { Lang } from "@/lib/affiliateAI/types";
import { useLanguage } from "@/contexts/LanguageContext";

interface Props {
  /** Page slug used for analytics + decision context. */
  slug: string;
  /** Force a specific editorial partner (default: ledger). */
  affiliateId?: string;
  lang?: Lang;
}

/**
 * Pre-footer editorial affiliate band.
 *
 * Calculator pages cannot import `AffiliatePlacement` directly
 * (enforced by `scripts/audit-legacy-placements.mjs`) — they must go
 * through the V2 Slot system or a vetted editorial wrapper like this
 * one. This component is the wrapper: it always renders an editorial
 * brand banner just above the Footer so every monetizable route has a
 * guaranteed end-to-end placement on desktop AND mobile, regardless of
 * whether the user has triggered a calculation.
 *
 * The `data-slot-d-collision` attribute makes SlotD's
 * IntersectionObserver yield to this band when it scrolls into view,
 * so the two surfaces never visually overlap.
 */
export const PreFooterEditorialBand = ({
  slug,
  affiliateId = "ledger",
  lang,
}: Props) => {
  const { t } = useLanguage();
  return (
    <div
      className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8"
      data-slot-d-collision
    >
      <div
        className="my-10 border-t border-border/60 pt-8"
        role="complementary"
        aria-label={t('aria.sponsoredPartner')}
      >
        <AffiliatePlacement
          slug={slug}
          lang={lang}
          zone="inline"
          forceAffiliateId={affiliateId}
          forceFormat="image-banner"
        />
      </div>
    </div>
  );
};

export default PreFooterEditorialBand;
