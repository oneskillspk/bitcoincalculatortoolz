// AffiliateAI shared types
export type Lang = "en" | "tr";
export type Segment = "default" | "mobile" | "returning";
export type Zone =
  | "post-result"
  | "sidebar"
  | "inline"
  | "inline-mid-article"
  | "pre-footer"
  | "comparison"
  | "footer";
export type Format =
  | "single-card"
  | "two-card-strip"
  | "comparison"
  | "inline-cta"
  | "sidebar-widget"
  | "image-banner"
  | "html-banner";

export type AffiliateCategory =
  | "exchange"
  | "hardware-wallet"
  | "software-wallet"
  | "tax"
  | "education"
  | "trading"
  | "mining"
  | "lending"
  | "news"
  | "card";

export type CreativeSize =
  | "728x90"
  | "468x60"
  | "300x250"
  | "336x280"
  | "250x250"
  | "200x200"
  | "160x600"
  | "120x600"
  | "970x90"
  | "970x250"
  | "300x600"
  | "320x50"
  | "850x420"
  | "250x100"
  | "700x1000"
  | "1080x1080"
  | "1200x628"
  | "1600x900"
  | "960x150"
  | "1920x237"
  | "1920x1080"
  | "1920x1004"
  | "1920x1920"
  | "1400x2000"
  | "900x750"
  | "1000x563"
  | "760x1340";

export interface AffiliateCreative {
  size: CreativeSize;
  width: number;
  height: number;
  image_url: string;
  image_url_2x?: string | null;
  alt: string;
  lang?: Lang | null; // null = any
  /** Optional per-creative click URL (overrides program url_en/url_tr).
   *  Used by Impact-style networks that attribute clicks per creative ID. */
  landing_url?: string | null;
  /** Art-direction family — all creatives sharing a group form one
   *  responsive <picture>. Examples: "ledger-horizontal", "ledger-square",
   *  "ledger-skyscraper". Unset = standalone (legacy behavior). */
  responsive_group?: string | null;
}

export interface AffiliateProgram {
  id: string;
  name: string;
  category: AffiliateCategory;
  tier: 1 | 2 | 3;
  priority: number; // 1-10, higher = stronger preference
  enabled: boolean;
  url_en?: string | null;
  url_tr?: string | null;
  cta_short_en?: string | null;
  cta_short_tr?: string | null;
  cta_long_en?: string | null;
  cta_long_tr?: string | null;
  description_en?: string | null;
  description_tr?: string | null;
  badge_en?: string | null;
  badge_tr?: string | null;
  logo_color?: string | null;
  target_pages: string[]; // calculator slugs or ["*"]
  target_results: string[]; // e.g. ["profit", "loss", "high-value"]
  language_restriction: Lang[]; // empty => all
  commission_rate?: number | null;
  commission_currency?: string | null;
  cookie_days?: number | null;
  conversion_intent?: "high" | "medium" | "low" | null;
  creatives?: AffiliateCreative[];
  creative_html?: string | null;
  default_format?: Format | null;
}

export interface CalculatorContext {
  slug: string;
  lang: Lang;
  segment: Segment;
  category?: string;
  resultSignals: string[]; // e.g. ["profit", "high-value", "long-term"]
  device: "mobile" | "tablet" | "desktop";
  isReturning: boolean;
  optedOut: boolean;
}

export interface AIDecision {
  slug: string;
  lang: Lang;
  segment: Segment;
  affiliate_ids: string[];
  format: Format;
  zone: Zone;
  delay_ms: number;
  cta_override?: string | null;
  reasoning?: string | null;
  generated_at?: string;
  source: "cache" | "override" | "fallback";
}

export interface OverrideRecord {
  slug: string;
  lang: Lang;
  forced_affiliate_id?: string | null;
  forced_zone?: string | null;
  hidden: boolean;
  expires_at?: string | null;
}
