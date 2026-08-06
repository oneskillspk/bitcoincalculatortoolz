/**
 * panelCutouts — transparent-background subject artwork for promo card panels.
 *
 * A cutout is a single isolated subject (a real partner product, or a neutral
 * object for partners with no product shot) on transparency. Because there is
 * no baked background, the card composes the panel itself: brand gradient +
 * subject anchored consistently across every partner. Nothing can letterbox
 * and no two partners can share a background.
 *
 * Resolution order used by PromoCard:
 *   1. cutout (this module)
 *   2. partner's own panel-shaped native creative, contained
 *   3. brandmark panel
 */
import LEDGER_CUTOUT from "@/assets/promo-cutouts/ledger.webp";
import BYBIT_CUTOUT from "@/assets/promo-cutouts/bybit.webp";
import REDOTPAY_CUTOUT from "@/assets/promo-cutouts/redotpay.webp";
import AXI_CUTOUT from "@/assets/promo-cutouts/axi.webp";

export type CutoutSource = "native" | "object";

export interface PanelCutout {
  /** Bundled image URL. */
  src: string;
  /** Intrinsic size of the cutout asset. */
  width: number;
  height: number;
  /**
   * How much of the panel height the subject may occupy (0–1).
   * Tall/narrow subjects get a smaller value so they never dominate.
   */
  scale: number;
  /** `native` = derived from the partner's own product creative. */
  source: CutoutSource;
}

export const PANEL_CUTOUTS: Record<string, PanelCutout> = {
  ledger: {
    src: LEDGER_CUTOUT,
    width: 159,
    height: 637,
    scale: 0.82,
    source: "native",
  },
  bybit: {
    src: BYBIT_CUTOUT,
    width: 900,
    height: 775,
    scale: 0.78,
    source: "object",
  },
  redotpay: {
    src: REDOTPAY_CUTOUT,
    width: 517,
    height: 596,
    scale: 0.8,
    source: "native",
  },
  axi: {
    src: AXI_CUTOUT,
    width: 890,
    height: 791,
    scale: 0.8,
    source: "object",
  },
};

/** Cutout for a partner, or null when none has been produced yet. */
export function getPanelCutout(affiliateId: string): PanelCutout | null {
  return PANEL_CUTOUTS[affiliateId] ?? null;
}
