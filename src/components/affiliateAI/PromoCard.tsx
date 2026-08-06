/**
 * PromoCard — premium promotional card used by the `promo-grid` format.
 *
 * Purely presentational: the parent (PromoGrid / AffiliatePlacement) owns
 * URL building (UTM + click id) and click tracking, so this card inherits
 * the exact same attribution path as every other affiliate format.
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
  /** Partner image creative; falls back to a category illustration. */
  imageUrl?: string | null;
  imageAlt?: string | null;
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
  imageUrl,
  imageAlt,
  onClick,
  affiliateId,
}: PromoCardProps) {
  const illustration = imageUrl || CATEGORY_ILLUSTRATION[category] || promoRewards;
  const meta = CATEGORY_LABEL[category]?.[lang] ?? CATEGORY_LABEL[category]?.en ?? "";
  const panelStyle = tint
    ? { backgroundColor: `${tint}14` }
    : { backgroundColor: "hsl(var(--muted))" };

  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored nofollow noopener"
      onClick={onClick}
      data-promo-card={affiliateId}
      aria-label={`${name} — ${cta}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/40 bg-card transition duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: "16 / 9", ...panelStyle }}
      >
        <img
          src={illustration}
          alt={imageAlt || `${name} offer`}
          width={1072}
          height={624}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {STATUS_LABEL[lang]}
          </span>
          {badge && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
              {badge}
            </span>
          )}
        </div>

        <h3
          className="line-clamp-2 text-sm font-semibold leading-snug tracking-tight text-foreground"
          style={tint ? { color: undefined } : undefined}
        >
          {name}
        </h3>

        <p className="line-clamp-2 text-xs text-muted-foreground">{description}</p>

        {meta && (
          <p className="truncate text-[11px] text-muted-foreground/80">{meta}</p>
        )}

        <span className="mt-auto inline-flex w-fit items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition group-hover:brightness-110">
          {cta}
          <span aria-hidden="true">→</span>
        </span>
      </div>
    </a>
  );
}

export default PromoCard;
