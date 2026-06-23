import { AffiliatePlacement } from "@/components/affiliateAI/AffiliatePlacement";
import type { Lang } from "@/lib/affiliateAI/types";

interface Props {
  slug: string;
  lang?: Lang;
  visible: boolean;
}

/**
 * Zone 1 — slim leaderboard above the calculator card.
 * Fades + collapses when `visible` flips false (i.e., a result fired).
 */
export const Zone1SlimBanner = ({ slug, lang, visible }: Props) => {
  return (
    <div
      aria-hidden={!visible}
      className={`transition-all duration-300 ease-out overflow-hidden mb-4 ${
        visible ? "opacity-100 max-h-24" : "opacity-0 max-h-0"
      }`}
    >
      <AffiliatePlacement
        slug={slug}
        lang={lang}
        zone="inline"
        forceFormat="image-banner"
      />
    </div>
  );
};

export default Zone1SlimBanner;
