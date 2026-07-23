/**
 * Feeds the adaptive optimizer with a per-slug "engaged" flag.
 * Engaged = user scrolled past 50% of the page AND stayed >15s.
 * The flag lives in sessionStorage; the optimizer reads it to decide
 * whether to promote lower zones (pre-footer, inline) into rotation.
 */
import { useEffect } from "react";
import { recordEngagement } from "@/lib/affiliateAI/adaptiveOptimizer";

const DWELL_MS = 15_000;
const SCROLL_PCT = 0.5;

export function useEngagementSignal(slug: string): void {
  useEffect(() => {
    if (typeof window === "undefined") return;
    let scrolledEnough = false;
    let timerFired = false;

    const timer = window.setTimeout(() => {
      timerFired = true;
      if (scrolledEnough) recordEngagement(slug);
    }, DWELL_MS);

    const onScroll = () => {
      const h = document.documentElement;
      const pct = (h.scrollTop + window.innerHeight) / Math.max(1, h.scrollHeight);
      if (pct >= SCROLL_PCT) {
        scrolledEnough = true;
        if (timerFired) recordEngagement(slug);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [slug]);
}
