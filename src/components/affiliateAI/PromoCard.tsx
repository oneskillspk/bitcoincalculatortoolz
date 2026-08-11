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
  /** One-line objection handler shown under the CTA button. */
  reassurance?: string | null;
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

/** Partner CTA copy sometimes ships its own arrow — the card draws one. */
function cleanCta(text: string): string {
  return text.replace(/[\s]*[→›»>]+\s*$/u, "").trim();
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
  reassurance,
}: PromoCardProps) {
  const resolved =
    pickPanelCreative(creatives, lang) ?? pickPanelCreativeById(affiliateId, lang);
  const [failed, setFailed] = useState(false);
  const panelCreative = failed ? null : resolved;

  const status = getOfferStatus(offerStart, offerEnd, lang);
  // Dedupe rule: a partner's native creative already carries its own offer
  // badge and category wording, so the text badge is only drawn when the
  // brandmark fallback panel is used. Never both.
  const emphasis =
    status.showBadge && !panelCreative ? shortBadge(badge) : null;
  const label = cleanCta(cta);
  const brand = tint || "#64748b";
  // Screen-reader label: partner, offer state, action, and the two facts a
  // non-sighted user cannot infer — that this is a sponsored link and that
  // it opens in a new tab.
  const srParts = [
    name,
    emphasis || null,
    status.label || null,
    label,
    lang === "tr"
      ? "sponsorlu bağlantı, yeni sekmede açılır"
      : "sponsored link, opens in a new tab",
  ].filter(Boolean);
  const srLabel = srParts.join(" — ");
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
      aria-label={srLabel}
      className="group flex h-full w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg active:translate-y-0 active:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {/* Visual panel — fixed 16:10 box holding the partner's OWN creative,
          contained (never cropped) on a brand-tinted surface with softly
          rounded corners. Partners with no usable creative get a clean
          brandmark panel instead. */}
      <div className="p-2.5 pb-0 sm:p-3 sm:pb-0">
        <div
          className="relative w-full shrink-0 overflow-hidden rounded-xl bg-muted/30 ring-1 ring-inset ring-border/50"
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
              className="absolute inset-0 h-full w-full rounded-xl object-contain object-center p-2.5 transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div
              aria-hidden="true"
              className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-5 text-center"
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-xl text-xl font-extrabold uppercase leading-none tracking-tight"
                style={{ color: brand, backgroundColor: `${brand}1F` }}
              >
                {name.slice(0, 1)}
              </span>
              <span
                className="h-0.5 w-10 rounded-full"
                style={{ backgroundColor: brand }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Header row — partner name leads, offer status pill trails on the
            right. The name is always printed here exactly once; the fallback
            panel shows only a monogram so it never duplicates. */}
        <div className="mb-2.5 flex min-h-[22px] items-center gap-2">
            <h3 className="min-w-0 flex-1 truncate text-[15px] font-bold leading-snug tracking-tight text-foreground">
              {name}
            </h3>
            <div className="flex shrink-0 flex-nowrap items-center gap-1.5 overflow-hidden">
              {status.label && (
                <span
                  aria-hidden="true"
                  className={`inline-flex h-[22px] shrink-0 items-center rounded-full px-2.5 text-[11px] font-semibold uppercase leading-none tracking-[0.04em] ring-1 ring-inset ${
                    status.tone === "warning"
                      ? "bg-warning-soft text-warning ring-warning/40"
                      : "bg-success-soft text-success ring-success/40"
                  }`}
                >
                  {status.label}
                </span>
              )}
              {emphasis && (
                <span aria-hidden="true" className="inline-flex h-[22px] min-w-0 items-center truncate rounded-full bg-primary/10 px-2.5 ring-1 ring-inset ring-primary/30 text-[11px] font-bold uppercase leading-none tracking-[0.04em] text-primary">
                  {emphasis}
                </span>
              )}
            </div>
        </div>

        {description && (
          <p className="mt-2 mb-5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {trimDescription(description)}
          </p>
        )}

        <span className="mt-auto flex h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-primary px-4 pt-[1px] text-[13px] font-semibold leading-none text-primary-foreground shadow-sm transition-all duration-200 group-hover:bg-primary/90 group-hover:shadow-md group-active:scale-[0.985]">
          <span className="truncate">{label}</span>
          <span
            aria-hidden="true"
            className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
          >
            →
          </span>
        </span>

        {/* Objection handler — the last four words a hesitating visitor
            reads before deciding. Verifiable facts only. */}
        {reassurance && (
          <span className="mt-2 block text-center text-xs leading-tight text-muted-foreground">
            {reassurance}
          </span>
        )}
      </div>
    </a>
  );
}


export default PromoCard;
