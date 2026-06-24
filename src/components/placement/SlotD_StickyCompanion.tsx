import { useEffect, useRef, useState } from "react";
import { AffiliatePlacement } from "@/components/affiliateAI/AffiliatePlacement";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSafeLanguage } from "@/hooks/useSafeLanguage";
import type { Lang } from "@/lib/affiliateAI/types";

interface Props {
  slug: string;
  lang?: Lang;
  visible: boolean;
  onDismiss: () => void;
}

const FATIGUE_KEY = "aff_fatigue";
const FATIGUE_THRESHOLD = 2;

/**
 * Slot D — Sticky Companion.
 *  Desktop (≥1024px): right-side fixed 280px sidebar widget.
 *  Mobile (<768px): fixed 60px bottom bar.
 *  Tablet: orchestrator blocks (double-guarded by Tailwind responsive cls).
 *
 *  Fatigue: if user dismisses D twice in one session, set aff_fatigue=1
 *  and the orchestrator suppresses D for the rest of the session across
 *  all calculator pages.
 */
export const SlotD_StickyCompanion = ({
  slug,
  lang,
  visible,
  onDismiss,
}: Props) => {
  const isMobile = useIsMobile();
  const ctxLang = useSafeLanguage();
  const effectiveLang = lang ?? ctxLang;
  const [animateIn, setAnimateIn] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [collide, setCollide] = useState(false);
  const dismissCount = useRef<number>(0);

  useEffect(() => {
    if (visible) {
      setExiting(false);
      const id = requestAnimationFrame(() => setAnimateIn(true));
      return () => cancelAnimationFrame(id);
    }
    setAnimateIn(false);
  }, [visible]);

  // Mobile collision avoidance: when the Footer (or its pre-footer
  // affiliate band) scrolls into view, slide the sticky bar away so the
  // two ad surfaces never stack on top of each other. Restore when the
  // user scrolls back up into the article body.
  useEffect(() => {
    if (!visible) return;
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") return;
    const targets = [
      ...Array.from(document.querySelectorAll<HTMLElement>("[data-slot-d-collision]")),
      ...Array.from(document.querySelectorAll<HTMLElement>("footer.site-footer, footer")),
    ];
    if (targets.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        const anyVisible = entries.some((e) => e.isIntersecting);
        setCollide(anyVisible);
      },
      { rootMargin: "0px 0px 80px 0px", threshold: 0 }
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [isMobile, visible]);

  // Reserve 60px of body padding on mobile while the sticky bar is up
  // and not colliding — keeps the last line of content reachable above
  // the bar instead of being permanently covered.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const active = isMobile && visible && !exiting && !collide;
    if (!active) return;
    const prev = document.body.style.paddingBottom;
    document.body.style.paddingBottom = "60px";
    return () => {
      document.body.style.paddingBottom = prev;
    };
  }, [isMobile, visible, exiting, collide]);

  const handleDismiss = () => {
    setExiting(true);
    setAnimateIn(false);
    try {
      sessionStorage.setItem(`zone5_dismissed_${slug}`, "1");
      dismissCount.current += 1;
      const prev = Number(sessionStorage.getItem("aff_dismiss_count") || "0");
      const next = prev + 1;
      sessionStorage.setItem("aff_dismiss_count", String(next));
      if (next >= FATIGUE_THRESHOLD) {
        sessionStorage.setItem(FATIGUE_KEY, "1");
      }
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
          transform:
            animateIn && !collide ? "translateY(0)" : "translateY(80px)",
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
            lang={effectiveLang}
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
          lang={effectiveLang}
          zone="sidebar"
          forceFormat="sidebar-widget"
        />
      </div>
    </div>
  );
};

export default SlotD_StickyCompanion;
