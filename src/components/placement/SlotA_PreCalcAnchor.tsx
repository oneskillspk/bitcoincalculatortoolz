import { useEffect, useRef, useState } from "react";
import { AffiliatePlacement } from "@/components/affiliateAI/AffiliatePlacement";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSafeLanguage } from "@/hooks/useSafeLanguage";
import type { Lang } from "@/lib/affiliateAI/types";

interface Props {
  slug: string;
  lang?: Lang;
  visible: boolean;
}

/**
 * Slot A — Pre-Calc Anchor.
 * 728x90 desktop / 320x50 mobile, anchored directly above the calculator.
 * Reserves space (min-height) to prevent CLS while the decision loads.
 * Collapses smoothly the instant a result fires (orchestrator clears
 * `visible` because SlotB takes over).
 */
export const SlotA_PreCalcAnchor = ({ slug, lang, visible }: Props) => {
  const isMobile = useIsMobile();
  const ctxLang = useSafeLanguage();
  const effectiveLang = lang ?? ctxLang;
  const ref = useRef<HTMLDivElement>(null);
  const [inViewport, setInViewport] = useState(false);

  // Viewport-anchored render: only mount the ad once the slot is visible.
  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setInViewport(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-10% 0px", threshold: 0.1 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      aria-label={effectiveLang === 'tr' ? 'Öne Çıkan Teklif' : 'Featured Offer'}
      ref={ref}
      data-slot="A"
      aria-hidden={!visible}
      className={`transition-all duration-300 ease-out overflow-hidden mb-4 ${
        visible ? "opacity-100" : "opacity-0 max-h-0"
      }`}
      style={{
        minHeight: visible ? (isMobile ? 60 : 100) : 0,
      }}
    >
      {visible && inViewport && (
        <AffiliatePlacement
          slug={slug}
          lang={effectiveLang}
          zone="inline"
          forceFormat="image-banner"
        />
      )}
    </section>
  );
};

export default SlotA_PreCalcAnchor;
