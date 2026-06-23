import { useEffect, useRef, useState } from "react";
import { AffiliatePlacement } from "@/components/affiliateAI/AffiliatePlacement";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Lang } from "@/lib/affiliateAI/types";

interface Props {
  slug: string;
  lang?: Lang;
  visible: boolean;
  resultSignals?: string[];
}

/**
 * Zone 4 — Pre-FAQ checkpoint. Render this ABOVE the FAQ block.
 * Fades in once the viewport reaches it.
 */
export const Zone4PreFAQ = ({ slug, lang, visible, resultSignals }: Props) => {
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);
  const [inViewport, setInViewport] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setInViewport(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInViewport(true);
      },
      { threshold: 0.1 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`mt-8 mb-8 transition-opacity duration-700 ${
        visible && inViewport ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden={!visible}
    >
      <hr className="border-border/40 mb-8" />
      {visible && (
        <AffiliatePlacement
          slug={slug}
          lang={lang}
          zone="pre-footer"
          resultSignals={resultSignals}
          forceFormat={isMobile ? "single-card" : "image-banner"}
        />
      )}
    </div>
  );
};

export default Zone4PreFAQ;
