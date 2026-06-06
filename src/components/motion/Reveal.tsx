import { forwardRef, type ElementType, type HTMLAttributes } from "react";
import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/lib/utils";

type RevealProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  /** Delay in ms before the reveal transition starts. */
  delay?: number;
  /** Slightly larger initial offset for hero-level reveals. */
  intensity?: "soft" | "medium";
};

/**
 * Drop-in wrapper that fades + translates a block in once on scroll.
 *
 * Pure CSS transition (opacity + transform). No layout thrash, no JS loop.
 * Respects `prefers-reduced-motion` automatically.
 *
 *   <Reveal delay={120}>...</Reveal>
 */
export const Reveal = forwardRef<HTMLElement, RevealProps>(
  ({ as, delay, intensity = "soft", className, children, ...rest }, _ref) => {
    const Tag = (as ?? "div") as ElementType;
    const innerRef = useReveal<HTMLElement>({ delay });

    return (
      <Tag
        ref={innerRef as never}
        data-reveal="out"
        data-reveal-intensity={intensity}
        className={cn("reveal", className)}
        {...rest}
      >
        {children}
      </Tag>
    );
  }
);
Reveal.displayName = "Reveal";
