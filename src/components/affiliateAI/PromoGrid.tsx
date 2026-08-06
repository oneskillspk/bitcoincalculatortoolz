/**
 * PromoGrid — the `promo-grid` affiliate format.
 *
 * 1 column mobile / 2 tablet / 3 desktop. Degrades gracefully when the
 * decision resolves fewer than three offers. URL building and click
 * tracking are delegated to the parent so attribution (UTM, click id,
 * variant stamp) stays identical to every other format.
 */
import { useMemo } from "react";
import { PromoCard } from "./PromoCard";
import { pickCreative } from "@/lib/affiliateAI/creativePicker";
import { appendUtm, mintClickId } from "@/lib/affiliateAI/utm";
import type { Lang, Zone } from "@/lib/affiliateAI/types";
import type { ResolvedAffiliate } from "@/lib/affiliateAI/placementResolver";

/** Sizes that crop well into the 16:9 card panel. */
const PANEL_SIZES = ["1200x628", "336x280", "300x250", "250x250", "200x200"];

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
        const creative = (item.program.creatives || []).find((c) =>
          PANEL_SIZES.includes(c.size)
        );
        return { item, clickId, href, creative };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [visible.map((i) => i.program.id).join("|"), slug, zone, variantId]
  );

  if (cards.length === 0) return null;

  const cols =
    cards.length === 1
      ? "grid-cols-1"
      : cards.length === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={`grid gap-4 ${cols}`} data-promo-grid={cards.length}>
      {cards.map(({ item, clickId, href, creative }) => (
        <PromoCard
          key={item.program.id}
          affiliateId={item.program.id}
          href={href}
          name={item.program.name}
          description={item.description}
          cta={item.cta}
          badge={item.badge}
          category={item.program.category}
          lang={lang}
          tint={item.program.logo_color}
          imageUrl={creative?.image_url ?? null}
          imageAlt={creative?.alt ?? null}
          onClick={() => onTrack?.(item, clickId)}
        />
      ))}
    </div>
  );
}

export default PromoGrid;
