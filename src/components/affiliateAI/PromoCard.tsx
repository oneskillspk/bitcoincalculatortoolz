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
import promoExchange from "@/assets/promo/promo-exchange.png";
import artLedger from "@/assets/promo/ledger.jpg";
import artTrezor from "@/assets/promo/trezor.jpg";
import artSwan from "@/assets/promo/swan_bitcoin.jpg";
import artKoinly from "@/assets/promo/koinly.jpg";
import artBtcturk from "@/assets/promo/btcturk.jpg";
import artKraken from "@/assets/promo/kraken.jpg";
import artCoinbase from "@/assets/promo/coinbase.jpg";
import artMexc from "@/assets/promo/mexc.jpg";
import artParibu from "@/assets/promo/paribu.jpg";
import artBybit from "@/assets/promo/bybit.jpg";
import artTradingview from "@/assets/promo/tradingview.jpg";
import artCoinledger from "@/assets/promo/coinledger.jpg";
import artRedotpay from "@/assets/promo/redotpay.jpg";
import artAxi from "@/assets/promo/axi.jpg";
import artVantage from "@/assets/promo/vantage.jpg";

/**
 * Per-partner studio artwork. Unique per affiliate so no two cards in a
 * grid can ever repeat the same image. Falls back to the category art
 * only for partners that have no bespoke render yet.
 */
const PARTNER_ILLUSTRATION: Record<string, string> = {
  ledger: artLedger,
  trezor: artTrezor,
  swan_bitcoin: artSwan,
  koinly: artKoinly,
  btcturk: artBtcturk,
  kraken: artKraken,
  coinbase: artCoinbase,
  mexc: artMexc,
  paribu: artParibu,
  bybit: artBybit,
  tradingview: artTradingview,
  coinledger: artCoinledger,
  redotpay: artRedotpay,
  axi: artAxi,
};

const CATEGORY_ILLUSTRATION: Record<AffiliateCategory, string> = {
  trading: promoTrading,
  mining: promoTrading,
  news: promoTrading,
  "hardware-wallet": promoSecurity,
  "software-wallet": promoSecurity,
  tax: promoSecurity,
  education: promoSecurity,
  lending: promoRewards,
  exchange: promoExchange,
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
  const illustration =
    PARTNER_ILLUSTRATION[affiliateId] || CATEGORY_ILLUSTRATION[category] || promoRewards;

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
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg active:translate-y-0 active:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      {/* Visual panel — fixed 16:10 ratio, art is cropped (object-cover) so
          nothing ever letterboxes regardless of source aspect ratio. */}
      <div
        className="relative w-full shrink-0 overflow-hidden bg-muted/40"
        style={{ aspectRatio: "16 / 10", ...panelStyle }}
      >
        <img
          src={illustration}
          alt=""
          aria-hidden="true"
          width={1200}
          height={750}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.04]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-background/70 to-transparent"
        />
        <span className="absolute left-3 top-3 inline-flex h-6 max-w-[70%] items-center truncate rounded-md bg-background/85 px-2 text-[11px] font-semibold tracking-tight text-foreground shadow-sm backdrop-blur-sm">
          {name}
        </span>
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
