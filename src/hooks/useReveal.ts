import { useEffect, useRef } from "react";

/**
 * Lightweight scroll-reveal hook.
 *
 * Uses a single IntersectionObserver per element, fires once, and only
 * toggles a data-attribute — the actual transition lives in CSS
 * (see `.reveal` / `[data-reveal="in"]` in index.css). This keeps the
 * runtime cost trivial and avoids any JS animation loop.
 *
 * Respects `prefers-reduced-motion` via CSS, so no JS branch needed here.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(options?: {
  rootMargin?: string;
  threshold?: number;
  delay?: number;
}) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If IO is unavailable (very old browsers), reveal immediately.
    if (typeof IntersectionObserver === "undefined") {
      el.setAttribute("data-reveal", "in");
      return;
    }

    if (options?.delay) {
      el.style.setProperty("--reveal-delay-ms", `${options.delay}ms`);
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-reveal", "in");
            io.unobserve(entry.target);
          }
        }
      },
      {
        rootMargin: options?.rootMargin ?? "0px 0px -10% 0px",
        threshold: options?.threshold ?? 0.15,
      }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [options?.rootMargin, options?.threshold, options?.delay]);

  return ref;
}
