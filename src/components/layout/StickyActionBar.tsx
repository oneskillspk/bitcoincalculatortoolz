import React from "react";
import { cn } from "@/lib/utils";

interface StickyActionBarProps {
  children: React.ReactNode;
  /** When true (default) the bar is fixed at the bottom on mobile only and
   *  flows inline at lg+. */
  mobileOnly?: boolean;
  className?: string;
}

/**
 * Native-app style sticky action bar for primary CTAs (e.g. "Calculate",
 * "Save", "Continue") on mobile. Sits above the bottom tab bar and respects
 * the iOS home-indicator inset.
 *
 * Usage:
 *   <StickyActionBar>
 *     <Button size="lg" className="w-full">Hesapla</Button>
 *   </StickyActionBar>
 */
export const StickyActionBar: React.FC<StickyActionBarProps> = ({
  children,
  mobileOnly = true,
  className,
}) => {
  return (
    <div
      className={cn(
        // Mobile: fixed above the bottom tab bar (~68px tall + safe-area).
        "fixed left-0 right-0 z-30 bg-background/90 backdrop-blur-xl border-t border-border/30",
        // Hide on desktop when mobileOnly so it doesn't double-up with inline CTAs.
        mobileOnly ? "lg:hidden" : "",
        className
      )}
      style={{
        bottom: "calc(env(safe-area-inset-bottom) + 68px)",
        paddingLeft: "max(env(safe-area-inset-left), 0.75rem)",
        paddingRight: "max(env(safe-area-inset-right), 0.75rem)",
      }}
    >
      <div className="mx-auto max-w-2xl px-3 py-2.5">{children}</div>
    </div>
  );
};

export default StickyActionBar;
