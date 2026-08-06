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
 */
import { useState } from "react";
import type { AffiliateCategory, AffiliateCreative, Lang } from "@/lib/affiliateAI/types";
import { pickPanelCreative, pickPanelCreativeById } from "@/lib/affiliateAI/panelCreative";
import { getPanelCutout } from "@/lib/affiliateAI/panelCutouts";

const CATEGORY_LABEL: Record<AffiliateCategory, { en: string; tr: string }> = {
  exchange: { en: "Exchange", tr: "Borsa" },
  "hardware-wallet": { en: "Hardware wallet", tr: "Donanım cüzdanı" },
  "software-wallet": { en: "Software wallet", tr: "Yazılım cüzdanı" },
  tax: { en: "Tax & reporting", tr: "Vergi ve raporlama" },
  education: { en: "Education", tr: "Eğitim" },
  trading: { en: "Trading platform", tr: "İşlem platformu" },
  mining: { en: "Mining", tr: "Madencilik" },
  lending: { en: "Lending", tr: "Kredi" },
  news: { en: "Research", tr: "Araştırma" },
  card: { en: "Crypto card", tr: "Kripto kart" },
};

const STATUS_LABEL: Record<Lang, string> = {
  en: "Ongoing",
  tr: "Devam ediyor",
};

/** Trim the partner badge to a single short emphasis token. */
function shortBadge(badge?: string | null): string | null {
  if (!badge) return null;
  const first = badge.split("•")[0].trim();
  if (!first) return null;
  return first.length > 18 ? first.slice(0, 18).trim() + "…" : first;
}

export interface PromoCardProps {
  href: string;
  name: string;
  description: string;
  cta: string;
  badge?: string | null;
  category: AffiliateCategory;
  lang: Lang;
  /** Partner brand colour used for the panel tint / brandmark fallback. */
  tint?: string | null;
  onClick?: () => void;
  affiliateId: string;
  /** Partner's own creative set; resolved from config when omitted. */
  creatives?: AffiliateCreative[] | null;
}

export function PromoCard({
  href,
  name,
  description,
  cta,
  badge,
  category,
  lang,
  tint,
  onClick,
  affiliateId,
  creatives,
}: PromoCardProps) {
  const [failed, setFailed] = useState(false);
  const cutout = failed ? null : getPanelCutout(affiliateId);
  const resolved =
    pickPanelCreative(creatives, lang) ?? pickPanelCreativeById(affiliateId, lang);
  const panelCreative = cutout || failed ? null : resolved;

  const meta = CATEGORY_LABEL[category]?.[lang] ?? CATEGORY_LABEL[category]?.en ?? "";
  const emphasis = shortBadge(badge);
  const brand = tint || "#64748b";
  const panelStyle = {
    backgroundImage: `radial-gradient(120% 90% at 50% 12%, ${brand}26 0%, ${brand}0F 45%, ${brand}05 100%)`,
  };
  const panelMode = cutout ? "cutout" : panelCreative ? "creative" : "brandmark";


  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored nofollow noopener"
      onClick={onClick}
      data-promo-card={affiliateId}
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
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-background/70 to-transparent"
        />
        {panelCreative && (
          <span className="absolute left-3 top-3 inline-flex h-6 max-w-[70%] items-center truncate rounded-md bg-background/85 px-2 text-[11px] font-semibold tracking-tight text-foreground shadow-sm backdrop-blur-sm">
            {name}
          </span>
        )}
      </div>


      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex min-h-[22px] flex-wrap items-center gap-1.5">
          <span className="inline-flex h-[22px] max-w-full items-center truncate rounded-full bg-muted px-2.5 text-[10px] font-semibold uppercase leading-none tracking-[0.04em] text-muted-foreground">
            {STATUS_LABEL[lang]}
          </span>
          {emphasis && (
            <span className="inline-flex h-[22px] max-w-full items-center truncate rounded-full bg-primary/10 px-2.5 ring-1 ring-inset ring-primary/20 text-[10px] font-bold uppercase leading-none tracking-[0.04em] text-primary">
              {emphasis}
            </span>
          )}
        </div>

        <h3 className="line-clamp-2 text-[15px] font-bold leading-snug tracking-tight text-foreground">
          {name}
        </h3>

        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>

        {meta && (
          <p className="mt-1.5 truncate text-[11px] font-medium text-muted-foreground/70">
            {meta}
          </p>
        )}

        <span className="mt-4 inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-primary px-4 text-[13px] font-semibold leading-none text-primary-foreground shadow-sm transition-all duration-200 group-hover:bg-primary/90 group-hover:shadow-md group-active:scale-[0.985]">
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
