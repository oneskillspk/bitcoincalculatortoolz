import type { CalculatorContext, Lang, Segment } from "./types";
import { SLUG_CATEGORY } from "@/config/placements.config";

const RETURNING_KEY = "btc_returning_visitor";
const OPTOUT_KEY = "btc_affiliate_optout";

const detectDevice = (): CalculatorContext["device"] => {
  if (typeof window === "undefined") return "desktop";
  const w = window.innerWidth;
  if (w < 640) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
};

const detectReturning = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    const seen = localStorage.getItem(RETURNING_KEY);
    if (!seen) {
      localStorage.setItem(RETURNING_KEY, String(Date.now()));
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

const detectOptOut = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(OPTOUT_KEY) === "1";
  } catch {
    return false;
  }
};

const inferSegment = (
  device: CalculatorContext["device"],
  isReturning: boolean
): Segment => {
  if (isReturning) return "returning";
  if (device === "mobile") return "mobile";
  return "default";
};

interface BuildContextInput {
  slug: string;
  lang: Lang;
  resultSignals?: string[];
}

export function buildContext({
  slug,
  lang,
  resultSignals = [],
}: BuildContextInput): CalculatorContext {
  const device = detectDevice();
  const isReturning = detectReturning();
  return {
    slug,
    lang,
    segment: inferSegment(device, isReturning),
    category: SLUG_CATEGORY[slug],
    resultSignals,
    device,
    isReturning,
    optedOut: detectOptOut(),
  };
}

/**
 * Derive lightweight result signals from a numeric calculator outcome.
 * Pages can call this and pass the result into buildContext.
 */
export function deriveResultSignals(opts: {
  profit?: number;
  invested?: number;
  years?: number;
}): string[] {
  const signals: string[] = [];
  const { profit, invested, years } = opts;
  if (typeof profit === "number") {
    if (profit > 0) signals.push("profit");
    else if (profit < 0) signals.push("loss");
  }
  if (typeof invested === "number" && invested >= 10_000) {
    signals.push("high-value");
  }
  if (typeof years === "number") {
    if (years >= 4) signals.push("long-term");
    else if (years <= 1) signals.push("active");
  }
  if (typeof profit === "number" && profit > 1000) {
    signals.push("tax-relevant");
  }
  return signals;
}
