import { useEffect, useRef, useState } from "react";
import { AffiliatePlacement } from "@/components/affiliateAI/AffiliatePlacement";
import type { Lang } from "@/lib/affiliateAI/types";

interface Props {
  slug: string;
  lang?: Lang;
  visible: boolean;
}

/**
 * Zone 3 — single native card placed in the educational content flow.
 * Only animates in once it enters the viewport so it never paints
 * affiliate content off-screen.
 */
export const Zone3ContentGap = ({ slug, lang, visible }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inViewport, setInViewport] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setInViewport(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setInViewport(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (!visible) return <div ref={ref} className="h-0" aria-hidden />;

  return (
    <div
      ref={ref}
      className="my-8 transition-opacity duration-500"
      style={{ opacity: inViewport ? 1 : 0 }}
    >
      <AffiliatePlacement
        slug={slug}
        lang={lang}
        zone="inline-mid-article"
        forceFormat="single-card"
      />
    </div>
  );
};

export default Zone3ContentGap;
