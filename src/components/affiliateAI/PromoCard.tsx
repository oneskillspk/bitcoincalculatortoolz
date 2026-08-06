/**
 * PromoCard — premium promotional card used by the `promo-grid` format.
 *
 * Purely presentational: the parent (PromoGrid / AffiliatePlacement) owns
 * URL building (UTM + click id) and click tracking, so this card inherits
 * the exact same attribution path as every other affiliate format.
 *
 * Art direction rule: the visual panel is ALWAYS our own composition —
 * a brand-tinted gradient plus a category illustration. Third-party
 * banner creatives (leaderboards, skyscrapers, baked-in ad art) are never
 * rendered here; they letterbox and look like ad slots.
 */
import type { AffiliateCategory, Lang } from "@/lib/affiliateAI/types";
import promoTrading from "@/assets/promo/promo-trading.png";
import promoSecurity from "@/assets/promo/promo-security.png";
import promoRewards from "@/assets/promo/promo-rewards.png";

const CATEGORY_ILLUSTRATION: Record<AffiliateCategory, string> = {
  trading: promoTrading,
  mining: promoTrading,
  news: promoTrading,
  "hardware-wallet": promoSecurity,
  "software-wallet": promoSecurity,
  tax: promoSecurity,
  education: promoSecurity,
  lending: promoRewards,
  exchange: promoRewards,
  card: promoRewards,
};

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
  /** Partner brand colour used for the illustration panel tint. */
  tint?: string | null;
  onClick?: () => void;
  affiliateId: string;
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
}: PromoCardProps) {
  const illustration = CATEGORY_ILLUSTRATION[category] || promoRewards;
  const meta = CATEGORY_LABEL[category]?.[lang] ?? CATEGORY_LABEL[category]?.en ?? "";
  const emphasis = shortBadge(badge);
  const panelStyle = tint
    ? {
        backgroundImage: `linear-gradient(135deg, ${tint}1F 0%, ${tint}0A 55%, transparent 100%)`,
      }
    : undefined;

  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored nofollow noopener"
      onClick={onClick}
      data-promo-card={affiliateId}
      aria-label={`${name} — ${cta}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <div
        className="relative w-full overflow-hidden bg-muted/40"
        style={{ aspectRatio: "16 / 10", ...panelStyle }}
      >
        <img
          src={illustration}
          alt=""
          aria-hidden="true"
          width={1072}
          height={670}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-contain p-5 transition-transform duration-300 group-hover:scale-[1.04]"
        />
        <span className="absolute left-3 top-3 rounded-md bg-background/80 px-2 py-0.5 text-[11px] font-semibold tracking-tight text-foreground backdrop-blur-sm">
          {name}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex h-5 items-center rounded-full bg-muted px-2 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            {STATUS_LABEL[lang]}
          </span>
          {emphasis && (
            <span className="inline-flex h-5 items-center rounded-full bg-primary/10 px-2 text-[10px] font-semibold uppercase tracking-wide text-primary">
              {emphasis}
            </span>
          )}
        </div>

        <h3 className="line-clamp-2 text-sm font-semibold leading-snug tracking-tight text-foreground">
          {name}
        </h3>

        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>

        {meta && (
          <p className="truncate text-[11px] text-muted-foreground/70">{meta}</p>
        )}

        <span className="mt-auto inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-xl bg-primary px-3 text-xs font-semibold text-primary-foreground transition group-hover:brightness-110">
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
