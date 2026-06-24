import { useEffect, useRef, useState } from "react";
import { AffiliatePlacement } from "@/components/affiliateAI/AffiliatePlacement";
import { useSafeLanguage } from "@/hooks/useSafeLanguage";
import { registerSlot } from "@/lib/placement/v2Registry";
import type { Lang } from "@/lib/affiliateAI/types";

interface Props {
  slug: string;
  lang?: Lang;
  visible: boolean;
}

/**
 * Slot C — Mid-Content.
 * Only renders when the orchestrator confirms the page is long-form
 * (content-height gate already applied upstream). Uses an IO with a
 * small 2s viewport-idle hold before mounting the ad, so it doesn't
 * fire during fast scroll-throughs.
 */
export const SlotC_MidContent = ({ slug, lang, visible }: Props) => {
  const ctxLang = useSafeLanguage();
  const effectiveLang = lang ?? ctxLang;
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    registerSlot("C");
  }, []);


  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setArmed(true);
      return;
    }
    let idleTimer: ReturnType<typeof setTimeout> | null = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Wait 2s of in-view dwell before mounting.
          idleTimer = setTimeout(() => setArmed(true), 2000);
        } else if (idleTimer) {
          clearTimeout(idleTimer);
          idleTimer = null;
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      if (idleTimer) clearTimeout(idleTimer);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`my-8 transition-opacity duration-500 ${
        visible && armed ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden={!visible}
      style={{ minHeight: visible ? 110 : 0 }}
    >
      {visible && armed && (
        <AffiliatePlacement
          slug={slug}
          lang={effectiveLang}
          zone="inline-mid-article"
          forceFormat="single-card"
        />
      )}
    </div>
  );
};

export default SlotC_MidContent;
