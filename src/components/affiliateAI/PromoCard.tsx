/**
 * PromoCard — premium promotional card used by the `promo-grid` format.
 *
 * Purely presentational: the parent (PromoGrid / AffiliatePlacement) owns
 * URL building (UTM + click id) and click tracking, so this card inherits
 * the exact same attribution path as every other affiliate format.
 *
 * Art direction rule: the visual panel shows the partner's OWN native
 * creative (never generated artwork), contained on a brand-tinted surface
 * so nothing is cropped or letterboxed. Only panel-shaped creatives are
 * eligible — leaderboards and skyscrapers stay in the banner formats.
 *
 * Content rule: the partner name appears exactly once per card, there is
 * no category caption, and the status pill reflects the real offer window.
 */
import { useState } from "react";
import type { AffiliateCreative, Lang } from "@/lib/affiliateAI/types";
import { pickPanelCreative, pickPanelCreativeById } from "@/lib/affiliateAI/panelCreative";
import { getOfferStatus, shortBadge } from "@/lib/affiliateAI/offerStatus";

export interface PromoCardProps {
  href: string;
  name: string;
  description: string;
  cta: string;
  badge?: string | null;
  lang: Lang;
  /** Partner brand colour used for the panel tint / brandmark fallback. */
  tint?: string | null;
  onClick?: () => void;
  affiliateId: string;
  /** Partner's own creative set; resolved from config when omitted. */
  creatives?: AffiliateCreative[] | null;
  /** Optional offer window (YYYY-MM-DD). */
  offerStart?: string | null;
  offerEnd?: string | null;
}

/** Clamp copy to the first sentence(s) that fit a compact two-line block. */
function trimDescription(text: string, max = 96): string {
  const clean = text.trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const stop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! "));
  if (stop > max * 0.5) return cut.slice(0, stop + 1);
  const space = cut.lastIndexOf(" ");
  return `${(space > 0 ? cut.slice(0, space) : cut).replace(/[,;:]$/, "")}…`;
}

export function PromoCard({
  href,
  name,
  description,
  cta,
  badge,
  lang,
  tint,
  onClick,
  affiliateId,
  creatives,
  offerStart,
  offerEnd,
}: PromoCardProps) {
  const resolved =
    pickPanelCreative(creatives, lang) ?? pickPanelCreativeById(affiliateId, lang);
  const [failed, setFailed] = useState(false);
  const panelCreative = failed ? null : resolved;

  const status = getOfferStatus(offerStart, offerEnd, lang);
  const emphasis = status.showBadge ? shortBadge(badge) : null;
  const brand = tint || "#64748b";
  const panelStyle = {
    backgroundImage: `linear-gradient(135deg, ${brand}1F 0%, ${brand}0A 55%, ${brand}05 100%)`,
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored nofollow noopener"
      onClick={onClick}
      data-promo-card={affiliateId}
      data-offer-state={status.state}
      aria-label={`${name} — ${cta}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg active:translate-y-0 active:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      {/* Visual panel — fixed 16:10 box holding the partner's OWN creative,
          contained (never cropped) on a brand-tinted surface. Partners with
          no usable creative get a clean brandmark panel instead. */}
      <div
        className="relative w-full shrink-0 overflow-hidden bg-muted/30"
        style={{ aspectRatio: "16 / 10", ...panelStyle }}
        data-promo-panel={panelCreative ? "creative" : "brandmark"}
      >
        {panelCreative ? (
          <img
            src={panelCreative.image_url}
            alt=""
            aria-hidden="true"
            width={panelCreative.width}
            height={panelCreative.height}
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
            className="absolute inset-0 h-full w-full object-contain object-center p-3 transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-5 text-center"
          >
            <span
              className="text-xl font-extrabold leading-tight tracking-tight"
              style={{ color: brand }}
            >
              {name}
            </span>
            <span
              className="h-0.5 w-10 rounded-full"
              style={{ backgroundColor: brand }}
            />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        {(status.label || emphasis) && (
          <div className="mb-2 flex min-h-[22px] flex-nowrap items-center gap-1.5 overflow-hidden">
            {status.label && (
              <span
                className={`inline-flex h-[22px] shrink-0 items-center rounded-full px-2.5 text-[10px] font-semibold uppercase leading-none tracking-[0.04em] ring-1 ring-inset ${
                  status.tone === "warning"
                    ? "bg-warning/10 text-warning ring-warning/25"
                    : "bg-success/10 text-success ring-success/25"
                }`}
              >
                {status.label}
              </span>
            )}
            {emphasis && (
              <span className="inline-flex h-[22px] min-w-0 items-center truncate rounded-full bg-primary/10 px-2.5 ring-1 ring-inset ring-primary/20 text-[10px] font-bold uppercase leading-none tracking-[0.04em] text-primary">
                {emphasis}
              </span>
            )}
          </div>
        )}

        {panelCreative && (
          <h3 className="truncate text-[15px] font-bold leading-snug tracking-tight text-foreground">
            {name}
          </h3>
        )}


        {description && (
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {trimDescription(description)}
          </p>
        )}

        <span className="mt-auto flex h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-primary px-4 pt-[1px] text-[13px] font-semibold leading-none text-primary-foreground shadow-sm transition-all duration-200 group-hover:bg-primary/90 group-hover:shadow-md group-active:scale-[0.985]">
          {cta}
          <span
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          >
            →
          </span>
        </span>
      </div>
    </a>
  );
}

export default PromoCard;
