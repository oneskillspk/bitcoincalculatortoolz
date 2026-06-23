import { useEffect, useState } from "react";
import { AffiliatePlacement } from "@/components/affiliateAI/AffiliatePlacement";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Lang } from "@/lib/affiliateAI/types";

interface Props {
  slug: string;
  lang?: Lang;
  visible: boolean;
  resultSignals?: string[];
  onAfterAppear?: () => void;
}

/**
 * Zone 2 — GOLD ZONE.
 * Slides in 700 ms after the user's result appears so it reads as a
 * natural extension of the calculation, not an ad break.
 */
export const Zone2ResultsSpotlight = ({
  slug,
  lang,
  visible,
  resultSignals,
  onAfterAppear,
}: Props) => {
  const isMobile = useIsMobile();
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (visible) {
      const delay = setTimeout(() => {
        setShouldRender(true);
        requestAnimationFrame(() => setIsAnimating(true));
        onAfterAppear?.();
      }, 700);
      return () => clearTimeout(delay);
    }
    setIsAnimating(false);
    const t = setTimeout(() => setShouldRender(false), 300);
    return () => clearTimeout(t);
  }, [visible, onAfterAppear]);

  if (!shouldRender) return null;

  return (
    <div
      style={{
        transform: isAnimating ? "translateY(0)" : "translateY(20px)",
        opacity: isAnimating ? 1 : 0,
        transition:
          "transform 500ms cubic-bezier(0.34,1.56,0.64,1), opacity 400ms ease",
        marginTop: 20,
      }}
    >
      <p
        className="text-muted-foreground"
        style={{
          fontSize: 11,
          marginBottom: 8,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {lang === "tr" ? "Sonucunuza göre:" : "Based on your result:"}
      </p>
      <AffiliatePlacement
        slug={slug}
        lang={lang}
        zone="post-result"
        resultSignals={resultSignals}
        forceFormat={isMobile ? "single-card" : "two-card-strip"}
      />
    </div>
  );
};

export default Zone2ResultsSpotlight;
