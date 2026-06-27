/**
 * AffiliateAI program registry (frontend display metadata).
 *
 * IDs MUST match the `affiliates` table in Cloud — that table is the
 * source of truth for `enabled` and `target_pages`; this file is the
 * fallback used when Cloud is unreachable and the canonical place to
 * hand-tune CTAs, descriptions, and badges.
 *
 * URLs are placeholders until real referral links are pasted into Cloud
 * (admin → Affiliates) or replaced here.
 */
import type { AffiliateProgram } from "@/lib/affiliateAI/types";
import REDOT_IMG_1 from "@/assets/affiliates/redotpay/image_1.webp.asset.json";
import REDOT_IMG_2 from "@/assets/affiliates/redotpay/image_2.webp.asset.json";
import REDOT_IMG_3 from "@/assets/affiliates/redotpay/image_3.webp.asset.json";
import REDOT_IMG_4 from "@/assets/affiliates/redotpay/image_4.webp.asset.json";
import REDOT_IMG_5 from "@/assets/affiliates/redotpay/image_5.webp.asset.json";
import REDOT_IMG_6 from "@/assets/affiliates/redotpay/image_6.webp.asset.json";
import REDOT_IMG_7 from "@/assets/affiliates/redotpay/image_7.png.asset.json";
import REDOT_IMG_8 from "@/assets/affiliates/redotpay/image_8.png.asset.json";
import REDOT_IMG_9 from "@/assets/affiliates/redotpay/image_9_320x50.png.asset.json";
import REDOT_IMG_10 from "@/assets/affiliates/redotpay/image_10_1600x900.webp.asset.json";
import REDOT_IMG_11 from "@/assets/affiliates/redotpay/image_11_1920x1004.webp.asset.json";
import REDOT_IMG_12 from "@/assets/affiliates/redotpay/image_12_1920x1004.webp.asset.json";
import REDOT_IMG_13 from "@/assets/affiliates/redotpay/image_13_1920x1920.webp.asset.json";
import REDOT_IMG_14 from "@/assets/affiliates/redotpay/image_14_1400x2000.webp.asset.json";
import REDOT_IMG_15 from "@/assets/affiliates/redotpay/image_15_900x750.webp.asset.json";
import REDOT_IMG_16 from "@/assets/affiliates/redotpay/image_16_1920x237.png.asset.json";
import REDOT_IMG_17 from "@/assets/affiliates/redotpay/image_17_960x150.png.asset.json";
import REDOT_IMG_18 from "@/assets/affiliates/redotpay/image_18_1920x1080.webp.asset.json";
import REDOT_IMG_19 from "@/assets/affiliates/redotpay/image_19_pink_1920x1004.png.asset.json";
import REDOT_IMG_20 from "@/assets/affiliates/redotpay/image_20_pink_1920x237.png.asset.json";
import REDOT_IMG_21 from "@/assets/affiliates/redotpay/image_21_pink_900x750.png.asset.json";
import REDOT_IMG_22 from "@/assets/affiliates/redotpay/image_22_pink_960x150.png.asset.json";
import REDOT_IMG_23 from "@/assets/affiliates/redotpay/image_23_pink_960x150.png.asset.json";

export const AFFILIATE_ENGINE_ENABLED = true; // master kill switch
export const AFFILIATE_SHADOW_MODE = false; // when true, log impressions but render nothing

export const AFFILIATES: AffiliateProgram[] = [
  {
    id: "ledger",
    name: "Ledger",
    category: "hardware-wallet",
    tier: 1,
    priority: 9,
    enabled: true,
    url_en: "https://shop.ledger.com/pages/ledger-nano-s-plus/?r=8c4e8e87cac7",
    url_tr: "https://shop.ledger.com/pages/ledger-nano-s-plus/?r=8c4e8e87cac7",
    cta_short_en: "Protect your BTC today",
    cta_short_tr: "Bitcoin'ini bugün koru",
    cta_long_en: "Move your Bitcoin off exchanges — Ledger Nano S Plus from $79",
    cta_long_tr: "Bitcoin'ini borsadan çıkar — Ledger Nano S Plus, 79$'dan başlar",
    description_en: "6M+ users trust Ledger. One hack on your exchange could wipe years of stacking — cold storage from $79.",
    description_tr: "6M+ kullanıcı Ledger'a güveniyor. Borsa hack'i yıllarca biriktirdiklerini silebilir — soğuk cüzdan 79$'dan başlar.",
    badge_en: "Most trusted • From $79",
    badge_tr: "En güvenilir • 79$'dan",
    logo_color: "#000000",
    // Real routed slugs only — removed "cold-storage"/"security"/"millionaire"
    // which never existed and silently disabled the +5 page-match bonus.
    target_pages: ["accumulation-score", "retirement", "wealth-percentile", "hodl-strategy", "bitcoin-savings", "inheritance-tax", "btc-vs-real-estate"],
    target_results: ["high-value", "long-term", "profit", "accumulation", "security"],
    language_restriction: [],
    commission_rate: 10,
    commission_currency: "USD",
    cookie_days: 30,
    conversion_intent: "high",
    default_format: "image-banner",
    // Responsive groups are split STRICTLY by aspect ratio so the
    // browser cannot stretch a billboard creative into a leaderboard
    // slot (or vice versa). See AffiliatePlacement ImageBanner.
    creatives: [
      // EN — billboard (≈ 2.02:1)
      { size: "850x420", width: 850, height: 420, image_url: "https://affiliate.ledger.com/image/850/420/Default", alt: "Ledger Nano S Plus — Secure your Bitcoin", landing_url: "https://shop.ledger.com/pages/ledger-nano-s-plus/?r=8c4e8e87cac7", lang: "en", responsive_group: "ledger-billboard" },
      // EN — leaderboard (≈ 8:1)
      { size: "728x90",  width: 728, height: 90,  image_url: "https://affiliate.ledger.com/image/728/90/Default",  alt: "Ledger Nano S Plus — Secure your Bitcoin", landing_url: "https://shop.ledger.com/pages/ledger-nano-s-plus/?r=8c4e8e87cac7", lang: "en", responsive_group: "ledger-leaderboard" },
      { size: "468x60",  width: 468, height: 60,  image_url: "https://affiliate.ledger.com/image/468/60/Default",  alt: "Ledger Nano S Plus — Secure your Bitcoin", landing_url: "https://shop.ledger.com/pages/ledger-nano-s-plus/?r=8c4e8e87cac7", lang: "en", responsive_group: "ledger-leaderboard" },
      { size: "320x50",  width: 320, height: 50,  image_url: "https://affiliate.ledger.com/image/320/50/Default",  alt: "Ledger Nano S Plus — Secure your Bitcoin", landing_url: "https://shop.ledger.com/pages/ledger-nano-s-plus/?r=8c4e8e87cac7", lang: "en", responsive_group: "ledger-mobile-banner" },
      // EN — small rect (2.5:1)
      { size: "250x100", width: 250, height: 100, image_url: "https://affiliate.ledger.com/image/250/100/Default", alt: "Ledger Nano S Plus — Secure your Bitcoin", landing_url: "https://shop.ledger.com/pages/ledger-nano-s-plus/?r=8c4e8e87cac7", lang: "en", responsive_group: "ledger-small-rect" },
      // EN — square / sidebar
      { size: "300x250", width: 300, height: 250, image_url: "https://affiliate.ledger.com/image/300/250/Default", alt: "Ledger Nano S Plus — Secure your Bitcoin", landing_url: "https://shop.ledger.com/pages/ledger-nano-s-plus/?r=8c4e8e87cac7", lang: "en", responsive_group: "ledger-square" },
      // EN — skyscraper
      { size: "120x600", width: 120, height: 600, image_url: "https://affiliate.ledger.com/image/120/600/Default", alt: "Ledger Nano S Plus — Secure your Bitcoin", landing_url: "https://shop.ledger.com/pages/ledger-nano-s-plus/?r=8c4e8e87cac7", lang: "en", responsive_group: "ledger-skyscraper-thin" },
      { size: "160x600", width: 160, height: 600, image_url: "https://affiliate.ledger.com/image/160/600/Default", alt: "Ledger Nano S Plus — Secure your Bitcoin", landing_url: "https://shop.ledger.com/pages/ledger-nano-s-plus/?r=8c4e8e87cac7", lang: "en", responsive_group: "ledger-skyscraper-wide" },
      { size: "300x600", width: 300, height: 600, image_url: "https://affiliate.ledger.com/image/300/600/Default", alt: "Ledger Nano S Plus — Secure your Bitcoin", landing_url: "https://shop.ledger.com/pages/ledger-nano-s-plus/?r=8c4e8e87cac7", lang: "en", responsive_group: "ledger-half-page" },

      // TR — billboard
      { size: "850x420", width: 850, height: 420, image_url: "https://affiliate.ledger.com/image/850/420/Turkish", alt: "Ledger Nano S Plus — Bitcoin'ini güvene al", landing_url: "https://shop.ledger.com/pages/ledger-nano-s-plus/?r=8c4e8e87cac7", lang: "tr", responsive_group: "ledger-billboard" },
      // TR — leaderboard
      { size: "728x90",  width: 728, height: 90,  image_url: "https://affiliate.ledger.com/image/728/90/Turkish",  alt: "Ledger Nano S Plus — Bitcoin'ini güvene al", landing_url: "https://shop.ledger.com/pages/ledger-nano-s-plus/?r=8c4e8e87cac7", lang: "tr", responsive_group: "ledger-leaderboard" },
      { size: "468x60",  width: 468, height: 60,  image_url: "https://affiliate.ledger.com/image/468/60/Turkish",  alt: "Ledger Nano S Plus — Bitcoin'ini güvene al", landing_url: "https://shop.ledger.com/pages/ledger-nano-s-plus/?r=8c4e8e87cac7", lang: "tr", responsive_group: "ledger-leaderboard" },
      { size: "320x50",  width: 320, height: 50,  image_url: "https://affiliate.ledger.com/image/320/50/Turkish",  alt: "Ledger Nano S Plus — Bitcoin'ini güvene al", landing_url: "https://shop.ledger.com/pages/ledger-nano-s-plus/?r=8c4e8e87cac7", lang: "tr", responsive_group: "ledger-mobile-banner" },
      // TR — small rect
      { size: "250x100", width: 250, height: 100, image_url: "https://affiliate.ledger.com/image/250/100/Turkish", alt: "Ledger Nano S Plus — Bitcoin'ini güvene al", landing_url: "https://shop.ledger.com/pages/ledger-nano-s-plus/?r=8c4e8e87cac7", lang: "tr", responsive_group: "ledger-small-rect" },
      // TR — square
      { size: "300x250", width: 300, height: 250, image_url: "https://affiliate.ledger.com/image/300/250/Turkish", alt: "Ledger Nano S Plus — Bitcoin'ini güvene al", landing_url: "https://shop.ledger.com/pages/ledger-nano-s-plus/?r=8c4e8e87cac7", lang: "tr", responsive_group: "ledger-square" },
      // TR — skyscraper
      { size: "120x600", width: 120, height: 600, image_url: "https://affiliate.ledger.com/image/120/600/Turkish", alt: "Ledger Nano S Plus — Bitcoin'ini güvene al", landing_url: "https://shop.ledger.com/pages/ledger-nano-s-plus/?r=8c4e8e87cac7", lang: "tr", responsive_group: "ledger-skyscraper-thin" },
      { size: "160x600", width: 160, height: 600, image_url: "https://affiliate.ledger.com/image/160/600/Turkish", alt: "Ledger Nano S Plus — Bitcoin'ini güvene al", landing_url: "https://shop.ledger.com/pages/ledger-nano-s-plus/?r=8c4e8e87cac7", lang: "tr", responsive_group: "ledger-skyscraper-wide" },
      { size: "300x600", width: 300, height: 600, image_url: "https://affiliate.ledger.com/image/300/600/Turkish", alt: "Ledger Nano S Plus — Bitcoin'ini güvene al", landing_url: "https://shop.ledger.com/pages/ledger-nano-s-plus/?r=8c4e8e87cac7", lang: "tr", responsive_group: "ledger-half-page" },
    ],
  },
  {
    id: "trezor",
    name: "Trezor",
    category: "hardware-wallet",
    tier: 1,
    priority: 8,
    enabled: false, // disabled: awaiting real Trezor offer_id
    url_en: null,
    url_tr: null,
    cta_short_en: "Get Trezor",
    cta_short_tr: "Trezor edinin",
    cta_long_en: "Open-source hardware wallet since 2013",
    cta_long_tr: "2013'ten beri açık kaynak donanım cüzdanı",
    description_en: "Open-source, audited, and battle-tested.",
    description_tr: "Açık kaynak, denetlenmiş ve test edilmiş.",
    badge_en: "Open source",
    badge_tr: "Açık kaynak",
    logo_color: "#1a1a1a",
    target_pages: ["retirement", "hodl-strategy"],
    target_results: ["high-value", "long-term"],
    language_restriction: [],
    commission_rate: 12,
    commission_currency: "USD",
    cookie_days: 30,
    conversion_intent: "high",
  },
  {
    id: "swan_bitcoin",
    name: "Swan Bitcoin",
    category: "exchange",
    tier: 1,
    priority: 9,
    enabled: false, // disabled: Swan Bitcoin does not currently offer an affiliate program
    url_en: null,
    url_tr: null,
    cta_short_en: "Stack sats weekly",
    cta_short_tr: null,
    cta_long_en: "Automate your Bitcoin DCA with Swan",
    cta_long_tr: null,
    description_en: "Bitcoin-only DCA platform for long-term stackers.",
    description_tr: null,
    badge_en: "Bitcoin-only",
    badge_tr: null,
    logo_color: "#f97316",
    target_pages: ["dca", "stack-sats", "bitcoin-savings", "retirement", "sip"],
    target_results: ["long-term", "accumulation"],
    language_restriction: ["en"],
    commission_rate: 25,
    commission_currency: "USD",
    cookie_days: 90,
    conversion_intent: "high",
  },
  {
    id: "koinly",
    name: "Koinly",
    category: "tax",
    tier: 1,
    priority: 9,
    enabled: true,
    url_en: "https://koinly.io/?via=0481A637&utm_source=affiliate",
    url_tr: "https://koinly.io/?via=0481A637&utm_source=affiliate",
    cta_short_en: "Calculate crypto taxes",
    cta_short_tr: "Kripto vergisi hesaplayın",
    cta_long_en: "Generate crypto tax reports in minutes",
    cta_long_tr: "Dakikalar içinde kripto vergi raporu",
    description_en: "Tax reports for 20+ countries.",
    description_tr: "20+ ülke için vergi raporu.",
    logo_color: "#7c3aed",
    target_pages: ["capital-gains-tax", "profit-loss", "inheritance-tax", "zakat", "dca", "investment", "hodl-strategy", "average-buy-price"],
    target_results: ["profit", "tax-relevant"],
    language_restriction: [],
    commission_rate: 25,
    commission_currency: "USD",
    cookie_days: 30,
    conversion_intent: "high",
  },
  {
    id: "btcturk",
    name: "BTCTurk",
    category: "exchange",
    tier: 1,
    priority: 8,
    enabled: false, // disabled: BTCTurk does not currently offer an affiliate program
    url_en: null,
    url_tr: null,
    cta_short_en: null,
    cta_short_tr: "BTCTurk'te başlayın",
    cta_long_en: null,
    cta_long_tr: "Türkiye'nin köklü kripto borsası",
    description_en: null,
    description_tr: "TL ile Bitcoin almanın en kolay yolu.",
    logo_color: "#1d4ed8",
    target_pages: ["dca", "profit-loss", "stack-sats", "bitcoin-savings"],
    target_results: ["trading", "accumulation"],
    language_restriction: ["tr"],
    commission_rate: 30,
    commission_currency: "USD",
    cookie_days: 60,
    conversion_intent: "high",
  },
  // --- Below: in registry, not yet enabled. Flip in admin when ready. ---
  {
    id: "kraken",
    name: "Kraken",
    category: "exchange",
    tier: 2,
    priority: 7,
    enabled: false,
    url_en: null,
    url_tr: null,
    cta_short_en: "Trade on Kraken",
    cta_short_tr: "Kraken'de işlem yapın",
    cta_long_en: "Pro-grade Bitcoin exchange with low fees",
    cta_long_tr: "Düşük komisyonlu profesyonel Bitcoin borsası",
    description_en: "Trusted exchange since 2011.",
    description_tr: "2011'den beri güvenilir borsa.",
    logo_color: "#5848d6",
    target_pages: ["profit-loss", "retirement"],
    target_results: ["trading", "active"],
    language_restriction: [],
    commission_rate: 20,
    commission_currency: "USD",
    cookie_days: 45,
    conversion_intent: "medium",
  },
  {
    id: "coinbase",
    name: "Coinbase",
    category: "exchange",
    tier: 1,
    priority: 8,
    enabled: true,

    // Generic text-link tracker — used as fallback for non-banner formats.
    url_en: "https://coinbase-consumer.sjv.io/c/7283174/3383210/9251",
    url_tr: "https://coinbase-consumer.sjv.io/c/7283174/3383210/9251",
    cta_short_en: "Earn up to $2,000 in crypto",
    cta_short_tr: "Coinbase'de $2,000'a kadar kazanın",
    cta_long_en: "Buy $50 in crypto on Coinbase and earn up to $2,000 in rewards",
    cta_long_tr: "Coinbase'de $50 kripto alın, $2,000'a kadar ödül kazanın",
    description_en: "Publicly traded, regulated US exchange trusted by 100M+ users.",
    description_tr: "100M+ kullanıcının güvendiği, regüle ABD borsası.",
    badge_en: "Up to $2,000",
    badge_tr: "$2,000'a kadar",
    logo_color: "#0052ff",
    target_pages: ["*"],
    target_results: ["*"],
    language_restriction: [],
    commission_rate: 10,
    commission_currency: "USD",
    cookie_days: 30,
    conversion_intent: "high",
    default_format: "image-banner",
    creatives: [
      // 728x90 Leaderboard
      { size: "728x90",  width: 728, height: 90,  image_url: "https://a.impactradius-go.com/display-ad/9251-830075",  alt: "Coinbase — Buy Bitcoin",                landing_url: "https://coinbase-consumer.sjv.io/c/7283174/830075/9251" },
      { size: "728x90",  width: 728, height: 90,  image_url: "https://a.impactradius-go.com/display-ad/9251-2152018", alt: "Coinbase — Trusted US exchange",        landing_url: "https://coinbase-consumer.sjv.io/c/7283174/2152018/9251" },
      // 300x250 Medium Rectangle
      { size: "300x250", width: 300, height: 250, image_url: "https://a.impactradius-go.com/display-ad/9251-3841020", alt: "Coinbase — Buy Bitcoin in minutes",     landing_url: "https://coinbase-consumer.sjv.io/c/7283174/3841020/9251" },
      { size: "300x250", width: 300, height: 250, image_url: "https://a.impactradius-go.com/display-ad/9251-3840984", alt: "Coinbase — Buy Bitcoin in minutes",     landing_url: "https://coinbase-consumer.sjv.io/c/7283174/3840984/9251" },
      { size: "300x250", width: 300, height: 250, image_url: "https://a.impactradius-go.com/display-ad/9251-3840947", alt: "Coinbase — Buy Bitcoin in minutes",     landing_url: "https://coinbase-consumer.sjv.io/c/7283174/3840947/9251" },
      { size: "300x250", width: 300, height: 250, image_url: "https://a.impactradius-go.com/display-ad/9251-3840908", alt: "Coinbase — Buy Bitcoin in minutes",     landing_url: "https://coinbase-consumer.sjv.io/c/7283174/3840908/9251" },
      { size: "300x250", width: 300, height: 250, image_url: "https://a.impactradius-go.com/display-ad/9251-830078",  alt: "Coinbase — Start with $10 in BTC",      landing_url: "https://coinbase-consumer.sjv.io/c/7283174/830078/9251" },
      { size: "300x250", width: 300, height: 250, image_url: "https://a.impactradius-go.com/display-ad/9251-2151988", alt: "Coinbase — Trusted US exchange",        landing_url: "https://coinbase-consumer.sjv.io/c/7283174/2151988/9251" },
      // 160x600 Wide Skyscraper
      { size: "160x600", width: 160, height: 600, image_url: "https://a.impactradius-go.com/display-ad/9251-830077",  alt: "Coinbase — Buy Bitcoin",                landing_url: "https://coinbase-consumer.sjv.io/c/7283174/830077/9251" },
      { size: "160x600", width: 160, height: 600, image_url: "https://a.impactradius-go.com/display-ad/9251-2151995", alt: "Coinbase — Trusted US exchange",        landing_url: "https://coinbase-consumer.sjv.io/c/7283174/2151995/9251" },
      { size: "160x600", width: 160, height: 600, image_url: "https://a.impactradius-go.com/display-ad/9251-2151980", alt: "Coinbase — Trusted US exchange",        landing_url: "https://coinbase-consumer.sjv.io/c/7283174/2151980/9251" },
      { size: "160x600", width: 160, height: 600, image_url: "https://a.impactradius-go.com/display-ad/9251-2151966", alt: "Coinbase — Trusted US exchange",        landing_url: "https://coinbase-consumer.sjv.io/c/7283174/2151966/9251" },
      // 300x600 Half Page
      { size: "300x600", width: 300, height: 600, image_url: "https://a.impactradius-go.com/display-ad/9251-2151990", alt: "Coinbase — Trusted US exchange",        landing_url: "https://coinbase-consumer.sjv.io/c/7283174/2151990/9251" },
      { size: "300x600", width: 300, height: 600, image_url: "https://a.impactradius-go.com/display-ad/9251-2151968", alt: "Coinbase — Trusted US exchange",        landing_url: "https://coinbase-consumer.sjv.io/c/7283174/2151968/9251" },
      // 320x50 Mobile Banner
      { size: "320x50",  width: 320, height: 50,  image_url: "https://a.impactradius-go.com/display-ad/9251-3841021", alt: "Coinbase — Buy Bitcoin",                landing_url: "https://coinbase-consumer.sjv.io/c/7283174/3841021/9251" },
      { size: "320x50",  width: 320, height: 50,  image_url: "https://a.impactradius-go.com/display-ad/9251-3840985", alt: "Coinbase — Buy Bitcoin",                landing_url: "https://coinbase-consumer.sjv.io/c/7283174/3840985/9251" },
    ],
    creative_html: `<a rel="sponsored" href="https://coinbase-consumer.sjv.io/c/7283174/3383210/9251" target="_blank">Earn up to $2,000 when you buy $50 in crypto. Terms apply.</a>`,
  },
  {
    id: "mexc",
    name: "MEXC",
    category: "exchange",
    tier: 2,
    priority: 8,
    enabled: true,
    url_en: "https://www.mexc.com/acquisition/custom-sign-up?shareCode=mexc-Btccalctool",
    url_tr: "https://www.mexc.com/acquisition/custom-sign-up?shareCode=mexc-Btccalctool",
    cta_short_en: "Claim 8,000 USDT on MEXC →",
    cta_short_tr: "MEXC'te 8.000 USDT kazan →",
    cta_long_en: "Sign up with code mexc-Btccalctool — 8,000 USDT beginner reward, lowest trading fees →",
    cta_long_tr: "mexc-Btccalctool koduyla kayıt ol — 8.000 USDT başlangıç ödülü, en düşük işlem ücretleri →",
    description_en: "Trusted by 10M+ users. Daily USDT payouts and 1,400+ tradable coins.",
    description_tr: "10M+ kullanıcı tarafından tercih edilen borsa. Günlük USDT ödemesi, 1.400+ coin.",
    badge_en: "8,000 USDT Beginner Reward",
    badge_tr: "8.000 USDT Başlangıç Ödülü",
    logo_color: "#1972f5",
    target_pages: [
      "dca", "investment", "profit-loss", "mining-profitability",
      "time-machine", "what-if", "lump-sum-vs-dca", "savings",
      "average-buy-price", "bitcoin-savings", "stack-sats", "sip",
      "lot-size", "arbitrage",
    ],
    target_results: ["trading", "buy-bitcoin", "accumulation"],
    language_restriction: [],
    commission_rate: 40,
    commission_currency: "USD",
    cookie_days: 60,
    conversion_intent: "high",
    default_format: "image-banner",
    creatives: [
      // Horizontal (16:9) — render in pre-footer / inline / post-result zones.
      // landing_url routes each themed creative to the most relevant MEXC deep-link
      // (sign-up / Visa card / spot BTC / futures BTC), all tagged with our shareCode.
      { size: "1000x563", width: 1000, height: 563, image_url: "/__l5e/assets-v1/8cac352b-16e6-4ddf-b12a-bc4a9a9946b5/mexc-poster-0_1.png", alt: "MEXC Visa Platinum card — spend your crypto anywhere.",                  landing_url: "https://www.mexc.com/buy-crypto/mexc-card?shareCode=mexc-Btccalctool" },
      { size: "1000x563", width: 1000, height: 563, image_url: "/__l5e/assets-v1/c077af3c-23fc-47f9-a460-e45f821a8d80/mexc-poster-1_1.png", alt: "MEXC — 8,000 USDT beginner reward. Sign up to claim now.",              landing_url: "https://www.mexc.com/acquisition/custom-sign-up?shareCode=mexc-Btccalctool" },
      { size: "1000x563", width: 1000, height: 563, image_url: "/__l5e/assets-v1/5991493f-c139-4665-8fea-6e57d78e1e7c/mexc-poster-2_1.png", alt: "MEXC — Best place to earn airdrops. Up to 50% APR.",                      landing_url: "https://www.mexc.com/acquisition/custom-sign-up?shareCode=mexc-Btccalctool" },
      { size: "1000x563", width: 1000, height: 563, image_url: "/__l5e/assets-v1/82f27d90-a42c-41ef-8a33-fdefaccbf11b/mexc-poster-3_1.png", alt: "MEXC — Winner of Best Crypto Exchange Asia. Trusted by 10M+ users.",      landing_url: "https://www.mexc.com/exchange/BTC_USDT?shareCode=mexc-Btccalctool" },
      // Vertical (9:16) — render in sidebar zone.
      { size: "760x1340", width: 760, height: 1340, image_url: "/__l5e/assets-v1/5dbea1f3-e34a-4dd1-835f-a9742eaa2b50/mexc-poster-0.png", alt: "MEXC Visa Platinum card — spend your crypto anywhere.",                   landing_url: "https://www.mexc.com/buy-crypto/mexc-card?shareCode=mexc-Btccalctool" },
      { size: "760x1340", width: 760, height: 1340, image_url: "/__l5e/assets-v1/7f0f4261-e1aa-49c3-945e-be38e02f11e4/mexc-poster-1.png", alt: "MEXC — 8,000 USDT beginner reward. Sign up to claim now.",               landing_url: "https://www.mexc.com/acquisition/custom-sign-up?shareCode=mexc-Btccalctool" },
      { size: "760x1340", width: 760, height: 1340, image_url: "/__l5e/assets-v1/fbfd4fff-f1af-47eb-974c-92b5623dd25c/mexc-poster-2.png", alt: "MEXC — Best place to earn airdrops. Up to 50% APR.",                       landing_url: "https://www.mexc.com/acquisition/custom-sign-up?shareCode=mexc-Btccalctool" },
      { size: "760x1340", width: 760, height: 1340, image_url: "/__l5e/assets-v1/bbe98ce7-ee40-4c1e-86d3-92d95fbf329d/mexc-poster-3.png", alt: "MEXC — Winner of Best Crypto Exchange Asia.",                              landing_url: "https://www.mexc.com/exchange/BTC_USDT?shareCode=mexc-Btccalctool" },
      { size: "760x1340", width: 760, height: 1340, image_url: "/__l5e/assets-v1/64f53bbc-c7c5-44e6-81b4-1ec626761062/mexc-poster-4.png", alt: "MEXC — Find your next moonshot. 1st stop for SHIB, GALA, AXS.",            landing_url: "https://www.mexc.com/futures/BTC_USDT?shareCode=mexc-Btccalctool" },
      { size: "760x1340", width: 760, height: 1340, image_url: "/__l5e/assets-v1/c6396e8e-0988-435c-a823-adfa92b24edc/mexc-poster-5.png", alt: "MEXC — Never miss a crypto gem. 1,400+ cryptocurrencies available.",       landing_url: "https://www.mexc.com/exchange/BTC_USDT?shareCode=mexc-Btccalctool" },
    ],
  },
  {
    id: "paribu",
    name: "Paribu",
    category: "exchange",
    tier: 2,
    priority: 6,
    enabled: false,
    url_en: null,
    url_tr: null,
    cta_short_en: null,
    cta_short_tr: "Paribu'da işlem yapın",
    cta_long_en: null,
    cta_long_tr: "Türkiye'nin popüler kripto platformu",
    description_en: null,
    description_tr: "TL ile hızlı kripto alım satımı.",
    logo_color: "#ffc107",
    target_pages: ["dca"],
    target_results: ["accumulation"],
    language_restriction: ["tr"],
    commission_rate: 25,
    commission_currency: "USD",
    cookie_days: 60,
    conversion_intent: "medium",
  },
  {
    id: "bybit",
    name: "Bybit",
    category: "trading",
    tier: 2,
    priority: 7,
    enabled: true,
    url_en: "https://www.bybit.com/invite?ref=160486",
    url_tr: "https://www.bybit.com/invite?ref=160486",
    cta_short_en: "Trade on Bybit →",
    cta_short_tr: "Bybit'te İşlem Yap →",
    cta_long_en: "Professional Bitcoin trading. Daily USDT payouts →",
    cta_long_tr: "Profesyonel Bitcoin işlemi. Günlük USDT ödemesi →",
    description_en: "Pro trading platform. 30–50% lifetime commission.",
    description_tr: "Profesyonel işlem platformu. %30–50 komisyon.",
    badge_en: "30–50% Lifetime",
    badge_tr: "%30–50 Ömür Boyu",
    logo_color: "#f7a600",
    target_pages: [
      "lot-size", "volatility", "leverage-liquidation",
      "arbitrage", "correlation", "cagr", "dominance",
      "bitcoin-lot-size", "lightning", "lump-sum-vs-dca",
    ],
    target_results: ["trading", "professional", "active"],
    language_restriction: [],
    commission_rate: 30,
    commission_currency: "USD",
    cookie_days: 30,
    conversion_intent: "high",
    default_format: "single-card",
  },
  {
    id: "tradingview",
    name: "TradingView",
    category: "trading",
    tier: 1,
    priority: 9,
    enabled: true,
    url_en: "https://www.tradingview.com/?aff_id=166891&aff_sub=creative&utm_source=bitcoincalculator&utm_medium=referral&utm_campaign=creative_en",
    url_tr: "https://www.tradingview.com/?aff_id=166891&aff_sub=creative&utm_source=bitcoincalculator&utm_medium=referral&utm_campaign=creative_tr",
    cta_short_en: "Chart like a pro",
    cta_short_tr: "Profesyonel grafikler",
    cta_long_en: "Professional charting for Bitcoin traders",
    cta_long_tr: "Bitcoin traderları için profesyonel grafikler",
    description_en: "Industry-standard charting platform.",
    description_tr: "Endüstri standardı grafik platformu.",
    logo_color: "#2962ff",
    target_pages: ["*"],
    target_results: ["*"],
    language_restriction: [],
    commission_rate: 15,
    commission_currency: "USD",
    cookie_days: 30,
    conversion_intent: "medium",
    default_format: "image-banner",
    creatives: [
      { size: "728x90",  width: 728, height: 90,  image_url: "https://s3.tradingview.com/pub/referrals/creatives/WT/EN/728x90Leaderboard.jpg",     image_url_2x: "https://s3.tradingview.com/pub/referrals/creatives/WT/EN/1456x180Leaderboard.jpg",   alt: "TradingView — Track all markets" },
      { size: "468x60",  width: 468, height: 60,  image_url: "https://s3.tradingview.com/pub/referrals/creatives/WT/EN/468x60Banner.jpg",          image_url_2x: "https://s3.tradingview.com/pub/referrals/creatives/WT/EN/936x120Banner.jpg",        alt: "TradingView — Track all markets" },
      { size: "200x200", width: 200, height: 200, image_url: "https://s3.tradingview.com/pub/referrals/creatives/WT/EN/200x200SmallSquare.jpg",    image_url_2x: "https://s3.tradingview.com/pub/referrals/creatives/WT/EN/400x400SmallSquare.jpg",   alt: "TradingView — Track all markets" },
      { size: "250x250", width: 250, height: 250, image_url: "https://s3.tradingview.com/pub/referrals/creatives/WT/EN/250x250Square.jpg",         image_url_2x: "https://s3.tradingview.com/pub/referrals/creatives/WT/EN/500x500Square.jpg",        alt: "TradingView — Track all markets" },
      { size: "300x250", width: 300, height: 250, image_url: "https://s3.tradingview.com/pub/referrals/creatives/WT/EN/300x250InlineRectangle.jpg",image_url_2x: "https://s3.tradingview.com/pub/referrals/creatives/WT/EN/600x500InlineRectangle.jpg", alt: "TradingView — Track all markets" },
      { size: "336x280", width: 336, height: 280, image_url: "https://s3.tradingview.com/pub/referrals/creatives/WT/EN/336x280LargeRectangle.jpg",image_url_2x: "https://s3.tradingview.com/pub/referrals/creatives/WT/EN/672x560LargeRectangle.jpg", alt: "TradingView — Track all markets" },
      { size: "120x600", width: 120, height: 600, image_url: "https://s3.tradingview.com/pub/referrals/creatives/WT/EN/120x600Skyscraper.jpg",     image_url_2x: "https://s3.tradingview.com/pub/referrals/creatives/WT/EN/240x1200Skyscraper.jpg",   alt: "TradingView — Track all markets" },
      { size: "160x600", width: 160, height: 600, image_url: "https://s3.tradingview.com/pub/referrals/creatives/WT/EN/160x600WideSkyscraper.jpg", image_url_2x: "https://s3.tradingview.com/pub/referrals/creatives/WT/EN/320x1200WideSkyscraper.jpg", alt: "TradingView — Track all markets" },
    ],
  },
  {
    id: "coinledger",
    name: "CoinLedger",
    category: "tax",
    tier: 2,
    priority: 6,
    enabled: false, // disabled: awaiting real fpr= referral id
    url_en: null,
    url_tr: null,
    cta_short_en: "Crypto tax made easy",
    cta_short_tr: null,
    cta_long_en: "US-focused crypto tax filing",
    cta_long_tr: null,
    description_en: "TurboTax-friendly crypto tax software.",
    description_tr: null,
    logo_color: "#22c55e",
    target_pages: ["capital-gains-tax"],
    target_results: ["profit", "tax-relevant"],
    language_restriction: ["en"],
    commission_rate: 30,
    commission_currency: "USD",
    cookie_days: 60,
    conversion_intent: "medium",
  },
  // ---------------------------------------------------------------------------
  // RedotPay — crypto Visa card. UID 15980. Three landing variants:
  //   affiliates-1 → "Spend Crypto Like Fiat" dark theme
  //   affiliates-3 → Social App-Friendly Card (pink)
  //   affiliates-5 → Social App-Friendly Card (pink, variant 2)
  // Commissions: 20% card application + 0.05% spending + 10% tier-2 for 365d.
  // ---------------------------------------------------------------------------
  {
    id: "redotpay",
    name: "RedotPay",
    category: "card",
    tier: 1,
    priority: 9,
    enabled: true,
    url_en: "https://wap.redotpay.com/en/invite/affiliates-1?utm_id=36rgik&utm_source=union&utm_uid=15980&utm_s=f29a110dc987f17ad366813652572664712174e0",
    url_tr: "https://wap.redotpay.com/en/invite/affiliates-1?utm_id=36rgik&utm_source=union&utm_uid=15980&utm_s=f29a110dc987f17ad366813652572664712174e0",
    cta_short_en: "Get $5 free",
    cta_short_tr: "5$ ücretsiz al",
    cta_long_en: "Spend crypto like fiat — get a $5 bonus",
    cta_long_tr: "Kriptoyu fiat gibi harca — 5$ bonus kazan",
    description_en: "Crypto Visa card with Apple Pay & Google Pay. Pay for X, Telegram, Reddit and more with BTC.",
    description_tr: "Apple Pay & Google Pay destekli kripto Visa kartı. X, Telegram, Reddit aboneliklerini BTC ile öde.",
    badge_en: "$5 bonus",
    badge_tr: "5$ bonus",
    logo_color: "#FF2C5B",
    target_pages: [
      "*",
    ],
    target_results: ["profit", "cashout", "spend", "high-value"],
    language_restriction: [],
    commission_rate: 20,
    commission_currency: "USD",
    cookie_days: 365,
    conversion_intent: "high",
    default_format: "image-banner",
    creatives: (() => {
      // The 5 valid RedotPay affiliate landings (UID 15980). Do not introduce
      // any other RedotPay URLs — these are the only approved tracking links.
      const PINK_LANDING =
        "https://wap.redotpay.com/en/invite/affiliates-3/?utm_id=ue39ua&utm_source=union&utm_uid=15980&utm_s=3333e78fd51cc64e4280dcc6e8c2231df38ec9cf";
      const PINK_LANDING_2 =
        "https://wap.redotpay.com/en/invite/affiliates-5/?utm_id=a5pkmi&utm_source=union&utm_uid=15980&utm_s=45cfbf9038e7917d455d0af5fdaee45f1844defb";
      const DARK_LANDING =
        "https://wap.redotpay.com/en/invite/affiliates-1?utm_id=36rgik&utm_source=union&utm_uid=15980&utm_s=f29a110dc987f17ad366813652572664712174e0";
      const DARK_LANDING_2 =
        "https://wap.redotpay.com/en/invite/affiliates-1?utm_id=fvsxb3&utm_source=union&utm_uid=15980&utm_s=12056a8eb2f9f16006850116b6f27bcbe5c13e9e";
      const DARK_LANDING_3 =
        "https://wap.redotpay.com/en/invite/affiliates-1?utm_id=zea5t4&utm_source=union&utm_uid=15980&utm_s=f2f6b55f131ff32ce7480bd78065abef0a02a8db";
      const DARK_LANDING_4 =
        "https://wap.redotpay.com/en/invite/affiliates-2?utm_id=mr4pzv&utm_source=union&utm_uid=15980&utm_s=5727756c88411f01bcd0b585fbe5feadb18718b2";
      return [
        { size: "728x90" as const,    width: 728,  height: 90,   image_url: REDOT_IMG_8.url,  alt: "RedotPay — The Best Social App-Friendly Crypto Card", landing_url: PINK_LANDING,   lang: null },
        { size: "300x250" as const,   width: 300,  height: 250,  image_url: REDOT_IMG_7.url,  alt: "RedotPay — Social App-Friendly Crypto Card. Register to get $5", landing_url: PINK_LANDING, lang: null },
        { size: "700x1000" as const,  width: 700,  height: 1000, image_url: REDOT_IMG_6.url,  alt: "RedotPay — Subscription payments for X, Facebook, Telegram, Reddit, TikTok using crypto", landing_url: PINK_LANDING,   lang: null },
        { size: "1080x1080" as const, width: 1080, height: 1080, image_url: REDOT_IMG_5.url,  alt: "RedotPay — The Best Social App-Friendly Crypto Card",                    landing_url: PINK_LANDING_2, lang: null },
        { size: "1200x628" as const,  width: 1200, height: 628,  image_url: REDOT_IMG_4.url,  alt: "RedotPay — The Best Social App-Friendly Crypto Card. Register to get $5", landing_url: PINK_LANDING,   lang: null },
        { size: "700x1000" as const,  width: 700,  height: 1000, image_url: REDOT_IMG_3.url,  alt: "RedotPay — The Best Crypto Card. Spend Crypto Like Fiat",                landing_url: DARK_LANDING_2, lang: null },
        { size: "1600x900" as const,  width: 1600, height: 900,  image_url: REDOT_IMG_2.url,  alt: "RedotPay — The Best Crypto Card. Spend Crypto Like Fiat",                landing_url: DARK_LANDING_3, lang: null },
        { size: "1200x628" as const,  width: 1200, height: 628,  image_url: REDOT_IMG_1.url,  alt: "RedotPay — The Best Crypto Card. Spend Crypto Like Fiat. Register to get $5", landing_url: DARK_LANDING, lang: null },
        { size: "320x50" as const,    width: 320,  height: 50,   image_url: REDOT_IMG_9.url,  alt: "RedotPay — Best Social App-Friendly Crypto Card. Register to get $5",   landing_url: PINK_LANDING,   lang: null },
        { size: "1600x900" as const,  width: 1600, height: 900,  image_url: REDOT_IMG_10.url, alt: "RedotPay — The Best Social App-Friendly Crypto Card",                   landing_url: PINK_LANDING_2, lang: null },
        { size: "1920x1004" as const, width: 1920, height: 1004, image_url: REDOT_IMG_11.url, alt: "RedotPay — The Best Crypto Card for Online Ads. Register to get 5 USD", landing_url: DARK_LANDING,   lang: null },
        { size: "1920x1004" as const, width: 1920, height: 1004, image_url: REDOT_IMG_12.url, alt: "RedotPay — The Best Crypto Card for Online Ads. Register to get 5 USD", landing_url: DARK_LANDING_2, lang: null },
        { size: "1920x1920" as const, width: 1920, height: 1920, image_url: REDOT_IMG_13.url, alt: "RedotPay — The Best Crypto Card for Online Ads. Register to get 5 USD", landing_url: DARK_LANDING_3, lang: null },
        { size: "1400x2000" as const, width: 1400, height: 2000, image_url: REDOT_IMG_14.url, alt: "RedotPay — The Best Crypto Card for Online Ads. Register to get 5 USD", landing_url: DARK_LANDING_4, lang: null },
        { size: "900x750" as const,   width: 900,  height: 750,  image_url: REDOT_IMG_15.url, alt: "RedotPay — The Best Crypto Card for Online Ads. Register to get $5",   landing_url: DARK_LANDING_2, lang: null },
        { size: "1920x237" as const,  width: 1920, height: 237,  image_url: REDOT_IMG_16.url, alt: "RedotPay — The Best Crypto Card for Online Ads. Register to get $5",   landing_url: DARK_LANDING_3, lang: null },
        { size: "960x150" as const,   width: 960,  height: 150,  image_url: REDOT_IMG_17.url, alt: "RedotPay — Best Social App-Friendly Crypto Card. Register to get $5",   landing_url: PINK_LANDING,   lang: null },
        { size: "1920x1080" as const, width: 1920, height: 1080, image_url: REDOT_IMG_18.url, alt: "RedotPay — The Best Crypto Card for Online Ads. Register to get 5 USD", landing_url: DARK_LANDING_4, lang: null },
        { size: "1920x1004" as const, width: 1920, height: 1004, image_url: REDOT_IMG_19.url, alt: "RedotPay — The Best Social App-Friendly Crypto Card. Subscription payments for X, Facebook, Telegram, Reddit, TikTok", landing_url: PINK_LANDING,   lang: null },
        { size: "1920x237" as const,  width: 1920, height: 237,  image_url: REDOT_IMG_20.url, alt: "RedotPay — The Best Social App-Friendly Crypto Card. Register to get $5", landing_url: PINK_LANDING_2, lang: null },
        { size: "900x750" as const,   width: 900,  height: 750,  image_url: REDOT_IMG_21.url, alt: "RedotPay — The Best Social App-Friendly Crypto Card. Register to get $5", landing_url: PINK_LANDING,   lang: null },
        { size: "960x150" as const,   width: 960,  height: 150,  image_url: REDOT_IMG_22.url, alt: "RedotPay — The Best Social App-Friendly Crypto Card. Register to get $5", landing_url: PINK_LANDING_2, lang: null },
        { size: "960x150" as const,   width: 960,  height: 150,  image_url: REDOT_IMG_23.url, alt: "RedotPay — The Best Social App-Friendly Crypto Card. Register to get $5", landing_url: PINK_LANDING,   lang: null },
      ];
    })(),
  },
];

