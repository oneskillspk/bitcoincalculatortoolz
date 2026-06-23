import { useEffect, useState } from "react";

/**
 * Returns 0–100 vertical scroll depth as a whole-number percent.
 * Passive scroll listener; cheap enough to use on calculator pages.
 */
export function useScrollDepth(): number {
  const [depth, setDepth] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handle = () => {
      const el = document.documentElement;
      const denom = el.scrollHeight - el.clientHeight;
      if (denom <= 0) {
        setDepth(0);
        return;
      }
      const next = Math.round((el.scrollTop / denom) * 100);
      setDepth(Math.max(0, Math.min(100, next)));
    };
    handle();
    window.addEventListener("scroll", handle, { passive: true });
    window.addEventListener("resize", handle, { passive: true });
    return () => {
      window.removeEventListener("scroll", handle);
      window.removeEventListener("resize", handle);
    };
  }, []);

  return depth;
}
