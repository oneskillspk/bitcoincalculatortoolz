/**
 * BybitCampaignGrid — homepage-only, Bybit-only campaign promo boxes.
 *
 * Shares the promo-card visual language (creative panel, pill badges,
 * equal-height cards, mobile snap-scroll) but is campaign-driven: each card
 * is one live Bybit promotion with its own creative, badges, UTC window and
 * affiliate link. The partner scoring engine and `PromoGrid` are untouched.
 */
import { useMemo } from "react";
import {
  liveBybitCampaigns,
  formatCampaignDate,
  type BybitCampaign,
} from "@/config/bybitCampaigns";
import { appendUtm, mintClickId } from "@/lib/affiliateAI/utm";
import { logEvent } from "@/lib/affiliateAI/analyticsClient";
import type { Lang } from "@/lib/affiliateAI/types";

const COPY = {
  en: {
    eyebrow: "Partner offers",
    heading: "Live Bybit campaigns",
    disclosure:
      "Advertising disclosure: these are sponsored links. We may earn a commission at no cost to you.",
    ongoing: "Ongoing",
    hot: "Hot",
    exclusive: "Exclusive",
    sponsored: "sponsored link, opens in a new tab",
  },
  tr: {
    eyebrow: "Partner teklifleri",
    heading: "Aktif Bybit kampanyaları",
    disclosure:
      "Reklam açıklaması: bunlar sponsorlu bağlantılardır. Size ek maliyet olmadan komisyon kazanabiliriz.",
    ongoing: "Devam ediyor",
    hot: "Popüler",
    exclusive: "Özel",
    sponsored: "sponsorlu bağlantı, yeni sekmede açılır",
  },
} as const;

type CampaignCopy = (typeof COPY)[keyof typeof COPY];



export interface BybitCampaignGridProps {
  lang?: Lang;
  /** Page slug used for attribution (homepage = "home"). */
  slug?: string;
}

export function BybitCampaignGrid({
  lang = "en",
  slug = "home",
}: BybitCampaignGridProps) {
  const t = COPY[lang] ?? COPY.en;

  const cards = useMemo(() => {
    return liveBybitCampaigns().map((campaign) => {
      const clickId = mintClickId();
      return {
        campaign,
        clickId,
        href: appendUtm(campaign.url, {
          slug,
          affiliateId: "bybit",
          zone: "homepage-campaigns",
          creativeId: campaign.id,
          clickId,
        }),
      };
    });
  }, [slug]);

  if (cards.length === 0) return null;

  const cols =
    cards.length === 1
      ? "sm:grid-cols-1"
      : cards.length === 2
        ? "sm:grid-cols-2"
        : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <section
      aria-label={t.heading}
      className="relative py-12 md:py-20"
      data-bybit-campaigns={cards.length}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {t.eyebrow}
              </p>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {t.heading}
              </h2>
            </div>
          </div>

          <div
            className={`-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3.5 overflow-x-auto px-4 pb-4 [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:w-full sm:items-stretch sm:overflow-visible sm:px-0 sm:pb-0 ${cols}`}
            data-promo-grid={cards.length}
          >
            {cards.map(({ campaign, clickId, href }) => (
              <div
                key={campaign.id}
                className={
                  cards.length > 1
                    ? "flex w-[88%] shrink-0 snap-center sm:w-auto sm:shrink"
                    : "flex w-full shrink-0 snap-center"
                }
              >
                <CampaignCard
                  campaign={campaign}
                  href={href}
                  lang={lang}
                  copy={t}
                  onClick={() =>
                    logEvent({
                      kind: "click",
                      affiliate_id: "bybit",
                      slug,
                      lang,
                      click_id: clickId,
                      variant_id: `campaign:${campaign.id}`,
                    })
                  }
                />
              </div>
            ))}
          </div>

          {cards.length > 1 && (
            <div
              aria-hidden="true"
              className="mt-3 flex items-center justify-center gap-1.5 sm:hidden"
            >
              {cards.map(({ campaign }) => (
                <span
                  key={campaign.id}
                  className="h-1 w-5 rounded-full bg-border/40"
                />
              ))}
            </div>
          )}

          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            {t.disclosure}
          </p>
        </div>
      </div>
    </section>
  );
}


function CampaignCard({
  campaign,
  href,
  lang,
  copy,
  onClick,
}: {
  campaign: BybitCampaign;
  href: string;
  lang: Lang;
  copy: CampaignCopy;
  onClick: () => void;
}) {
  const title = lang === "tr" ? campaign.title_tr : campaign.title_en;
  const alt = lang === "tr" ? campaign.alt_tr : campaign.alt_en;
  const window = `${formatCampaignDate(campaign.start)} – ${formatCampaignDate(
    campaign.end
  )} (UTC)`;
  const badgeLabels = [
    ...campaign.badges.map((b) => (b === "hot" ? copy.hot : copy.exclusive)),
    copy.ongoing,
  ];
  const srLabel = [title, ...badgeLabels, window, copy.sponsored].join(" — ");

  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored nofollow noopener"
      onClick={onClick}
      aria-label={srLabel}
      data-promo-card="bybit"
      data-campaign={campaign.id}
      data-offer-state="ongoing"
      className="group flex h-full w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:border-border/80 hover:shadow-xl active:translate-y-0 active:scale-[0.98] active:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="p-2.5 pb-0 sm:p-3 sm:pb-0">
        <div
          className="relative w-full shrink-0 overflow-hidden rounded-xl bg-muted/40 ring-1 ring-inset ring-border/40"
          style={{ aspectRatio: "16 / 10" }}
          data-promo-panel="creative"
        >
          <img
            src={campaign.image}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full rounded-xl object-contain object-center p-2.5 transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>
      </div>

      <div className="flex min-h-[44px] flex-1 flex-col p-4 sm:p-5 md:p-6">
        <div
          aria-hidden="true"
          className="mb-2.5 flex min-h-[22px] items-center justify-between gap-2"
          data-promo-badges
        >
          <span className="flex min-w-0 items-center">
            {campaign.badges.includes("hot") && (
              <span className="inline-flex h-[22px] items-center rounded-full bg-warning-soft px-2.5 text-[11px] font-semibold uppercase leading-none tracking-[0.04em] text-warning ring-1 ring-inset ring-warning/40">
                {copy.hot}
              </span>
            )}
            {campaign.badges.includes("exclusive") && (
              <span className="inline-flex h-[22px] items-center rounded-full bg-primary/10 px-2.5 text-[11px] font-bold uppercase leading-none tracking-[0.04em] text-primary ring-1 ring-inset ring-primary/30">
                {copy.exclusive}
              </span>
            )}
          </span>
          <span
            className="inline-flex h-[22px] shrink-0 items-center rounded-full bg-success-soft px-2.5 text-[11px] font-semibold uppercase leading-none tracking-[0.04em] text-success ring-1 ring-inset ring-success/40"
            data-badge="ongoing"
          >
            {copy.ongoing}
          </span>
        </div>

        <h3
          aria-hidden="true"
          className="truncate text-[15px] font-bold leading-snug tracking-tight text-foreground"
        >
          {title}
        </h3>

        <p
          aria-hidden="true"
          className="mt-auto pt-3 text-xs leading-relaxed text-muted-foreground"
        >
          {window}
        </p>
      </div>

    </a>
  );
}

export default BybitCampaignGrid;
