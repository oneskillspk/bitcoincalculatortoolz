import { useEffect, useState } from "react";
import { AffiliatePlacement } from "@/components/affiliateAI/AffiliatePlacement";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSafeLanguage } from "@/hooks/useSafeLanguage";
import { registerSlot } from "@/lib/placement/v2Registry";
import type { Lang } from "@/lib/affiliateAI/types";

interface Props {
  slug: string;
  lang?: Lang;
  visible: boolean;
  resultSignals?: string[];
}

/**
 * Slot B — Result Adjacent.
 * Fires the instant the user gets a result. Animates in over 250ms so the
 * eye is already on the result card when the offer appears. This is the
 * highest-intent ad moment we have.
 */
export const SlotB_ResultAdjacent = ({
  slug,
  lang,
  visible,
  resultSignals,
}: Props) => {
  const isMobile = useIsMobile();
  const ctxLang = useSafeLanguage();
  const effectiveLang = lang ?? ctxLang;
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    registerSlot("B");
  }, []);


  useEffect(() => {
    // Test-only: skip entry/exit timers so frames are immediately stable.
    const noAnim =
      typeof window !== "undefined" &&
      (window as unknown as { __TEST_NO_ANIM__?: boolean }).__TEST_NO_ANIM__ === true;
    if (visible) {
      if (noAnim) {
        setShouldRender(true);
        setIsAnimating(true);
        return;
      }
      // Short 200ms entry — timed to land just as the result count-up settles.
      const delay = setTimeout(() => {
        setShouldRender(true);
        requestAnimationFrame(() => setIsAnimating(true));
      }, 200);
      return () => clearTimeout(delay);
    }
    setIsAnimating(false);
    if (noAnim) {
      setShouldRender(false);
      return;
    }
    const t = setTimeout(() => setShouldRender(false), 250);
    return () => clearTimeout(t);
  }, [visible]);

  if (!shouldRender) return null;

  return (
    <div
      data-slot="B"
      style={{
        transform: isAnimating ? "translateY(0)" : "translateY(12px)",
        opacity: isAnimating ? 1 : 0,
        transition:
          "transform 250ms cubic-bezier(0.22,1,0.36,1), opacity 200ms ease",
        marginTop: 16,
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
        {effectiveLang === "tr" ? "Sonucunuza göre:" : "Based on your result:"}
      </p>
      <AffiliatePlacement
        slug={slug}
        lang={effectiveLang}
        zone="post-result"
        resultSignals={resultSignals}
        forceFormat={isMobile ? "single-card" : "two-card-strip"}
      />
    </div>
  );
};

export default SlotB_ResultAdjacent;
