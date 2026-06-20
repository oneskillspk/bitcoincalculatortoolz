import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "default" | "subtle" | "dark";
type Width = "wide" | "prose";
type Spacing = "tight" | "default" | "loose";

export interface PageSectionProps extends React.HTMLAttributes<HTMLElement> {
  tone?: Tone;
  width?: Width;
  spacing?: Spacing;
  eyebrow?: string;
  children: React.ReactNode;
}

const TONE_CLASSES: Record<Tone, string> = {
  default: "bg-background text-foreground",
  subtle: "bg-muted/30 text-foreground",
  // Dark zone uses semantic secondary tokens with a subtle top border so the
  // architectural break is visible without forcing text inversion (nested
  // cards keep their own *-foreground tokens for contrast).
  dark: "bg-secondary/70 text-secondary-foreground border-t border-border/60",
};

const WIDTH_CLASSES: Record<Width, string> = {
  wide: "max-w-6xl",
  prose: "max-w-3xl",
};

const SPACING_CLASSES: Record<Spacing, string> = {
  tight: "py-12",
  default: "py-16 md:py-20",
  loose: "py-20 md:py-28",
};

/**
 * PageSection — standard wrapper for calculator content sections
 * (data tables, editorial blocks, FAQ, etc). Not intended for the hero
 * or the input/results calculator grid itself.
 *
 * Provides a small, fixed vocabulary of tones, widths, and spacings so
 * stacked sections feel architected rather than ad hoc.
 */
export const PageSection = React.forwardRef<HTMLElement, PageSectionProps>(
  (
    {
      tone = "default",
      width = "wide",
      spacing = "default",
      eyebrow,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    return (
      <section
        ref={ref}
        className={cn(TONE_CLASSES[tone], SPACING_CLASSES[spacing], className)}
        {...rest}
      >
        <div className={cn("container mx-auto px-6", WIDTH_CLASSES[width])}>
          {eyebrow ? (
            <div className="calc-text-label mb-6 opacity-80">{eyebrow}</div>
          ) : null}
          {children}
        </div>
      </section>
    );
  },
);

PageSection.displayName = "PageSection";

export default PageSection;
