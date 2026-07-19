/**
 * A/B experiments registry. Add a new entry, ship it, done.
 * Variants split traffic by `weight` (defaults to 1 → equal split).
 * `payload` is whatever the consuming component needs.
 */
export interface Variant<TPayload = unknown> {
  id: string;
  weight?: number;
  payload: TPayload;
}

export interface Experiment<TPayload = unknown> {
  key: string;
  description?: string;
  variants: Variant<TPayload>[];
}

// ---- Homepage hero CTA copy ----
export interface HomeHeroCtaPayload {
  primary: { en: string; tr: string };
  secondary?: { en: string; tr: string };
}

// ---- Calculator result-adjacent slot format ----
export interface SlotFormatPayload {
  format: "single-card" | "image-banner" | "two-card-strip";
}

export const EXPERIMENTS = {
  home_hero_cta: {
    key: "home_hero_cta",
    description: "Homepage hero button copy",
    variants: [
      {
        id: "control",
        weight: 1,
        payload: {
          primary: { en: "Calculate Bitcoin ROI", tr: "Bitcoin ROI Hesapla" },
          secondary: { en: "Try DCA calculator", tr: "DCA hesaplayıcıyı dene" },
        },
      },
      {
        id: "loss-aversion",
        weight: 1,
        payload: {
          primary: { en: "See if you'd be rich", tr: "Zengin olur muydun?" },
          secondary: { en: "Run the numbers", tr: "Hesabı yap" },
        },
      },
    ],
  } satisfies Experiment<HomeHeroCtaPayload>,

  slot_b_format: {
    key: "slot_b_format",
    description: "Result-adjacent affiliate slot format",
    variants: [
      { id: "card", weight: 1, payload: { format: "single-card" } },
      { id: "banner", weight: 1, payload: { format: "image-banner" } },
    ],
  } satisfies Experiment<SlotFormatPayload>,

  // ---- Lot-size pre-export banner (multi-partner bandit) ----
  lot_size_preexport_banner: {
    key: "lot_size_preexport_banner",
    description:
      "Pre-export sponsored banner on the Bitcoin Lot Size page. " +
      "Variants map to partner ids; useBanditVariant() reads epc_live to " +
      "shift traffic toward the top performer with epsilon-greedy exploration.",
    variants: [
      { id: "axi",         weight: 2, payload: { partnerId: "axi" } },
      { id: "tradingview", weight: 1, payload: { partnerId: "tradingview" } },
      { id: "ledger",      weight: 1, payload: { partnerId: "ledger" } },
      { id: "redotpay",    weight: 1, payload: { partnerId: "redotpay" } },
    ],
  } satisfies Experiment<{ partnerId: string }>,
} as const;

export type ExperimentKey = keyof typeof EXPERIMENTS;

