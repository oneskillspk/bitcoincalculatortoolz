import { useEffect, useState } from "react";

/**
 * Sticky right-edge section nav rail.
 * Desktop only (lg+). Tracks visible section via IntersectionObserver.
 * Click dot → smooth-scroll to section. Respects reduced motion.
 */

type Item = { id: string; label: string };

interface Props {
  items?: Item[];
}

const DEFAULT_ITEMS: Item[] = [
  { id: "hero", label: "Hero" },
  { id: "hero-timeline", label: "Why" },
  { id: "live-demo", label: "Live" },
  { id: "statement", label: "About" },
  { id: "tools", label: "Tools" },
  { id: "comparison", label: "Compare" },
  { id: "faq", label: "FAQ" },
];

export const SectionNavRail = ({ items = DEFAULT_ITEMS }: Props) => {
  const [active, setActive] = useState<string>(items[0]?.id ?? "");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Reveal once user scrolls past hero (~80vh).
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const targets = items
      .map((it) => document.getElementById(it.id))
      .filter((el): el is HTMLElement => !!el);
    if (!targets.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        // Pick most-visible entry
        const inView = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (inView) setActive(inView.target.id);
      },
      { rootMargin: "-30% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  const onJump = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="Page sections"
      data-section-nav-rail
      className={`fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 lg:flex flex-col gap-3 transition-opacity duration-500 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      {items.map((it) => {
        const isActive = active === it.id;
        return (
          <a
            key={it.id}
            href={`#${it.id}`}
            onClick={onJump(it.id)}
            className="group relative flex items-center justify-end gap-2 py-1 pr-1"
            aria-label={it.label}
            aria-current={isActive ? "true" : undefined}
          >
            <span
              className={`pointer-events-none font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/70 opacity-0 translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 ${
                isActive ? "opacity-100 translate-x-0 text-foreground" : ""
              }`}
            >
              {it.label}
            </span>
            <span
              className={`block rounded-full transition-all duration-300 ${
                isActive
                  ? "h-2 w-2 bg-primary shadow-[0_0_0_4px_hsl(var(--primary)/0.12)]"
                  : "h-1.5 w-1.5 bg-foreground/30 group-hover:bg-foreground/60"
              }`}
            />
          </a>
        );
      })}
    </nav>
  );
};
