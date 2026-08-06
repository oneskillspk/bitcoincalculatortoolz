/**
 * Bybit homepage campaign offers.
 *
 * Homepage-only, Bybit-only promo boxes. Unlike the partner-driven
 * `PromoGrid` (one card per partner, chosen by the scoring engine), these
 * are CAMPAIGN-driven: one card per live Bybit promotion, each with its own
 * native creative, badges, campaign window and affiliate link.
 *
 * Campaign windows are UTC. A campaign whose `end` is in the past is
 * filtered out at render time so the homepage never shows a dead offer.
 */
import depositBlastoff from "@/assets/affiliates/bybit/deposit-blastoff.png.asset.json";
import stockEarnings from "@/assets/affiliates/bybit/stock-earnings.png.asset.json";
import q32026 from "@/assets/affiliates/bybit/q3-2026.png.asset.json";

export type CampaignBadge = "hot" | "exclusive" | "ongoing";

export interface BybitCampaign {
  id: string;
  /** Card heading (partner campaign name). */
  title_en: string;
  title_tr: string;
  /** Extra badges rendered before the automatic status pill. */
  badges: Exclude<CampaignBadge, "ongoing">[];
  /** Campaign window, UTC ISO strings. */
  start: string;
  end: string;
  /** Campaign-specific affiliate URL. */
  url: string;
  image: string;
  alt_en: string;
  alt_tr: string;
}

export const BYBIT_CAMPAIGNS: BybitCampaign[] = [
  {
    id: "deposit-blastoff",
    title_en: "$30,100 Deposit Blast-Off + $5,040 TradFi Rewards",
    title_tr: "30.100$ Yatırım Patlaması + 5.040$ TradFi Ödülü",
    badges: ["hot"],
    start: "2023-02-20T21:30:00Z",
    end: "2027-12-31T21:30:00Z",
    url: "https://partner.bybit.com/b/aff_7_160486",
    image: depositBlastoff.url,
    alt_en: "Bybit deposit bonus campaign creative",
    alt_tr: "Bybit yatırım bonusu kampanya görseli",
  },
  {
    id: "stock-earnings",
    title_en: "Stock Earnings Season — Trade. Predict. Win a Cybertruck",
    title_tr: "Hisse Bilanço Sezonu — İşlem yap, tahmin et, Cybertruck kazan",
    badges: [],
    start: "2026-07-21T14:43:00Z",
    end: "2026-08-30T10:43:00Z",
    url: "https://partner.bybit.com/b/aff_61103_160486",
    image: stockEarnings.url,
    alt_en: "Bybit stock earnings season campaign creative",
    alt_tr: "Bybit hisse bilanço sezonu kampanya görseli",
  },
  {
    id: "q3-2026",
    title_en: "Q3 2026 — Deposit 100 USDT, get 20 USDT",
    title_tr: "3. Çeyrek 2026 — 100 USDT yatır, 20 USDT kazan",
    badges: ["exclusive"],
    start: "2026-07-09T12:46:00Z",
    end: "2026-09-30T00:00:00Z",
    url: "https://partner.bybit.com/b/aff_59843_160486",
    image: q32026.url,
    alt_en: "Bybit Q3 2026 exclusive rewards campaign creative",
    alt_tr: "Bybit 3. çeyrek 2026 özel ödül kampanyası görseli",
  },
];

/** Campaigns whose window has not ended yet, in config order. */
export function liveBybitCampaigns(now: Date = new Date()): BybitCampaign[] {
  return BYBIT_CAMPAIGNS.filter((c) => new Date(c.end).getTime() > now.getTime());
}

/** `2026-07-21 14:43` — UTC, no seconds, locale-agnostic. */
export function formatCampaignDate(iso: string): string {
  return iso.slice(0, 16).replace("T", " ");
}
