import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ScrollableTableProps {
  children: React.ReactNode;
  className?: string;
  /** Optional aria-label for the scroll region */
  ariaLabel?: string;
}

/**
 * Horizontal scroll wrapper with edge-fade scroll affordances.
 * - Shows a fade on the right while more content is scrollable
 * - Shows a fade on the left once the user has scrolled
 * - Uses semantic role="region" + tabIndex so keyboard users can scroll too
 */
export const ScrollableTable = ({ children, className, ariaLabel = "Scrollable table" }: ScrollableTableProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const update = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      setShowLeftFade(scrollLeft > 4);
      setShowRightFade(scrollLeft + clientWidth < scrollWidth - 4);
    };

    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  return (
    <div className={cn("relative", className)}>
      {/* Left edge fade */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-background to-transparent transition-opacity duration-200",
          showLeftFade ? "opacity-100" : "opacity-0"
        )}
      />
      {/* Right edge fade */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-background to-transparent transition-opacity duration-200",
          showRightFade ? "opacity-100" : "opacity-0"
        )}
      />
      <div
        ref={scrollRef}
        role="region"
        aria-label={ariaLabel}
        tabIndex={0}
        className="overflow-x-auto px-1 -mx-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg"
        style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "thin" }}
      >
        {children}
      </div>
    </div>
  );
};
