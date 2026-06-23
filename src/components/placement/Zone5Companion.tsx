import { useEffect, useState } from "react";
import { AffiliatePlacement } from "@/components/affiliateAI/AffiliatePlacement";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Lang } from "@/lib/affiliateAI/types";

interface Props {
  slug: string;
  lang?: Lang;
  visible: boolean;
  onDismiss: () => void;
}

/**
 * Zone 5 — sticky companion.
 *  Desktop (≥1024px): right-side fixed 280px sidebar widget.
 *  Mobile (<768px): fixed 60px bottom bar.
 *  Tablet: rendered nothing (orchestrator already gates this, but
 *          we double-guard with Tailwind responsive classes too).
 */
export const Zone5Companion = ({ slug, lang, visible, onDismiss }: Props) => {
  const isMobile = useIsMobile();
  const [animateIn, setAnimateIn] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (visible) {
      setExiting(false);
      const id = requestAnimationFrame(() => setAnimateIn(true));
      return () => cancelAnimationFrame(id);
    }
    setAnimateIn(false);
  }, [visible]);

  const handleDismiss = () => {
    setExiting(true);
    setAnimateIn(false);
    try {
      sessionStorage.setItem(`zone5_dismissed_${slug}`, "1");
    } catch {
      // ignore
    }
    setTimeout(() => onDismiss(), 300);
  };

  if (!visible && !exiting) return null;

  if (isMobile) {
    return (
      <div
        className="lg:hidden"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          transform: animateIn ? "translateY(0)" : "translateY(80px)",
          transition: "transform 350ms ease-out",
          zIndex: 40,
          height: 60,
          background: "rgba(15,26,43,0.97)",
          borderTop: "1px solid rgba(247,147,26,0.2)",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
        }}
        role="complementary"
        aria-label="Sponsored offer"
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <AffiliatePlacement
            slug={slug}
            lang={lang}
            zone="inline"
            forceFormat="image-banner"
          />
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss"
          style={{
            background: "none",
            border: "none",
            color: "#9CA3AF",
            cursor: "pointer",
            padding: 8,
            fontSize: 16,
            flexShrink: 0,
          }}
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <div
      className="hidden lg:block"
      style={{
        position: "fixed",
        right: 24,
        top: "50%",
        transform: animateIn
          ? "translateY(-50%) translateX(0)"
          : "translateY(-50%) translateX(320px)",
        transition: "transform 400ms cubic-bezier(0.34,1.56,0.64,1)",
        zIndex: 40,
        width: 280,
      }}
      role="complementary"
      aria-label="Sponsored offer"
    >
      <div style={{ position: "relative" }}>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss"
          style={{
            position: "absolute",
            top: -8,
            right: -8,
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "#374151",
            border: "none",
            color: "#E5E7EB",
            cursor: "pointer",
            fontSize: 12,
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ✕
        </button>
        <AffiliatePlacement
          slug={slug}
          lang={lang}
          zone="sidebar"
          forceFormat="sidebar-widget"
        />
      </div>
    </div>
  );
};

export default Zone5Companion;
