/**
 * PromoGrid — the `promo-grid` affiliate format.
 *
 * 1 column mobile / 2 tablet / 3 desktop. Degrades gracefully when the
 * decision resolves fewer than three offers. URL building and click
 * tracking are delegated to the parent so attribution (UTM, click id,
 * variant stamp) stays identical to every other format.
 *
 * Card panels render each partner's own native creative on a brand tint,
 * with a brandmark fallback when no panel-shaped creative exists (see
 * PromoCard).
 */
import { useMemo, useCallback } from "react";
import { PromoCard } from "./PromoCard";
import { appendUtm, mintClickId } from "@/lib/affiliateAI/utm";
import type { Lang, Zone } from "@/lib/affiliateAI/types";
import type { ResolvedAffiliate } from "@/lib/affiliateAI/placementResolver";

export interface PromoGridProps {
  items: ResolvedAffiliate[];
  slug: string;
  lang: Lang;
  zone: Zone;
  variantId?: string;
  /** Max cards rendered (mobile passes 1 to protect LCP). */
  limit?: number;
  onTrack?: (item: ResolvedAffiliate, clickId: string) => void;
}

export function PromoGrid({
  items,
  slug,
  lang,
  zone,
  variantId,
  limit = 3,
  onTrack,
}: PromoGridProps) {
  const visible = items.slice(0, Math.max(1, limit));

  const cards = useMemo(
    () =>
      visible.map((item) => {
        const clickId = mintClickId();
        const href = appendUtm(item.url, {
          slug,
          affiliateId: item.program.id,
          zone,
          clickId,
          variantId,
        });
        return { item, clickId, href };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [visible.map((i) => i.program.id).join("|"), slug, zone, variantId]
  );

  const handleCardClick = useCallback((item: ResolvedAffiliate, clickId: string) => {
    console.log(`[PromoGrid] Click tracked for ${item.program.id} with clickId ${clickId}`);
    onTrack?.(item, clickId);
  }, [onTrack]);

  if (cards.length === 0) return null;

  // Mobile keeps the cards on ONE horizontal snap-scroll row (never a tall
  // vertical stack); from `sm` up it becomes a normal equal-height grid.
  const cols =
    cards.length === 1
      ? "sm:grid-cols-1"
      : cards.length === 2
        ? "sm:grid-cols-[repeat(auto-fit,minmax(240px,1fr))]"
        : "sm:grid-cols-[repeat(auto-fit,minmax(240px,1fr))]";

  return (
    <div
      className={`-mx-1 flex snap-x snap-mandatory scroll-px-1 gap-3 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:w-full sm:items-stretch sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 ${cols}`}
      data-promo-grid={cards.length}
    >
      {cards.map(({ item, clickId, href }) => (
        <div
          key={item.program.id}
          className={cards.length > 1 ? "flex w-[86%] shrink-0 snap-start sm:w-auto sm:shrink" : "flex w-full shrink-0 snap-start"}
        >
        <PromoCard
          affiliateId={item.program.id}
          href={href}
          name={item.program.name}
          description={item.description}
          cta={item.cta}
          badge={item.badge}
          lang={lang}
          tint={item.program.logo_color}
          creatives={item.program.creatives}
          offerStart={item.program.offer_start}
          offerEnd={item.program.offer_end}
          reassurance={item.reassurance}
          onClick={() => handleCardClick(item, clickId)}
        />
        </div>
      ))}
    </div>
  );
}

export default PromoGrid;