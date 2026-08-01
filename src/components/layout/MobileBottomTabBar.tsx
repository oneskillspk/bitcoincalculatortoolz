import { useEffect, useState } from "react";
import { useLocation, useInRouterContext } from "react-router-dom";
import { Link } from "@/components/LocalizedLink";
import { useLanguage } from "@/contexts/LanguageContext";
import { Home, Calculator, Wrench, BookOpen, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMobileMenuOpen, setMobileMenuOpen } from "@/components/layout/mobileMenuStore";


/**
 * Native-app-style bottom tab bar (mobile only).
 *
 * - Shows on phones (<lg).
 * - Respects iOS safe-area-inset-bottom.
 * - Hides on admin / QA / not-found routes.
 * - Auto-hides while scrolling down, reappears on scroll up.
 */
export const MobileBottomTabBar = () => {
  const inRouter = useInRouterContext();
  const location = useLocation();
  const { language } = useLanguage();
  const tr = language === "tr";
  const menuOpen = useMobileMenuOpen();

  const [hidden, setHidden] = useState(false);
  const [pinned, setPinned] = useState(false);

  // Inside a WebView / installed app the tab bar is the app chrome — keep it
  // pinned instead of auto-hiding on scroll.
  useEffect(() => {
    try {
      const standalone =
        window.matchMedia?.("(display-mode: standalone)").matches ||
        // iOS Safari legacy flag
        (window.navigator as Navigator & { standalone?: boolean }).standalone === true ||
        new URLSearchParams(window.location.search).get("app") === "1";
      setPinned(Boolean(standalone));
    } catch {
      /* no-op */
    }
  }, []);

  useEffect(() => {
    if (pinned) return;
    let lastY = window.scrollY;
    let rafId: number | null = null;
    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY;
        if (y < 80) {
          setHidden(false);
        } else if (delta > 6) {
          setHidden(true);
        } else if (delta < -6) {
          setHidden(false);
        }
        lastY = y;
        rafId = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [pinned]);

  if (!inRouter) return null;

  // Hide on routes where a bottom bar would be distracting.
  const hideOn = [/^\/admin/, /^\/qa\//, /^\/typography-preview/];
  if (hideOn.some((r) => r.test(location.pathname))) return null;

  const norm = (p: string) => (p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p);
  const currentPath = norm(location.pathname);

  const items = tr
    ? [
        { path: "/tr/", label: "Ana Sayfa", icon: Home, match: ["/tr", "/tr/"] },
        { path: "/tr/hesaplayicilar", label: "Hesapla", icon: Calculator, match: ["/tr/hesaplayicilar"] },
        { path: "/tr/araclar", label: "Araçlar", icon: Wrench, match: ["/tr/araclar"] },
        { path: "/tr/ogrenin", label: "Öğren", icon: BookOpen, match: ["/tr/ogrenin"] },
      ]
    : [
        { path: "/", label: "Home", icon: Home, match: ["/"] },
        { path: "/calculators", label: "Calculators", icon: Calculator, match: ["/calculators"] },
        { path: "/tools", label: "Tools", icon: Wrench, match: ["/tools"] },
        { path: "/learn", label: "Learn", icon: BookOpen, match: ["/learn"] },
      ];

  const moreMatches = tr
    ? ["/tr/hakkimizda", "/tr/iletisim", "/tr/yontem", "/tr/gizlilik", "/tr/bagli-kurulus-aciklamasi"]
    : ["/about", "/contact", "/methodology", "/privacy", "/affiliate-disclosure"];

  const isActive = (matches: string[]) =>
    matches.some((m) => currentPath === m || currentPath.startsWith(m + "/"));

  const moreActive = menuOpen || isActive(moreMatches);

  return (
    <nav
      aria-label={tr ? "Alt navigasyon" : "Bottom navigation"}
      className={cn(
        "lg:hidden fixed bottom-0 left-0 right-0 z-40",
        "transition-transform duration-300 ease-out",
        hidden || menuOpen ? "translate-y-full" : "translate-y-0"
      )}
      style={{
        // WebView fallback: --safe-bottom already folds in a synthetic floor
        // when env() reports 0, and --viewport-chrome-bottom lifts the bar
        // above collapsing iOS URL-bar chrome so taps always land.
        paddingBottom: "calc(var(--safe-bottom, 0px) + var(--viewport-chrome-bottom, 0px))",
        paddingLeft: "max(env(safe-area-inset-left, 0px), 0px)",
        paddingRight: "max(env(safe-area-inset-right, 0px), 0px)",
      }}


    >
      <div className="mx-2 mb-2 rounded-2xl bg-background/85 backdrop-blur-2xl border border-border/40 shadow-[0_10px_40px_-12px_hsl(0_0%_0%/0.18)]">
        <ul className="grid grid-cols-5 px-1 py-1.5">
          {items.map((item) => {
            const active = isActive(item.match);
            const Icon = item.icon;
            return (
              <li key={item.path} className="flex">
                <Link
                  to={item.path}
                  className={cn(
                    "flex flex-1 flex-col items-center justify-center gap-0.5 py-1.5 px-1 rounded-xl",
                    "min-h-[48px] text-[10px] font-medium tracking-wide",
                    "transition-all duration-200 active:scale-[0.94]",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon
                    className={cn(
                      "w-[20px] h-[20px] transition-transform",
                      active ? "scale-110 text-primary" : ""
                    )}
                    strokeWidth={active ? 2.4 : 2}
                  />
                  <span className="leading-none">{item.label}</span>
                </Link>
              </li>
            );
          })}

          <li className="flex">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              aria-label={tr ? "Daha fazla menü" : "More menu"}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-0.5 py-1.5 px-1 rounded-xl",
                "min-h-[48px] text-[10px] font-medium tracking-wide",
                "transition-all duration-200 active:scale-[0.94] outline-none",
                "focus-visible:ring-2 focus-visible:ring-primary/70",
                moreActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <MoreHorizontal
                className={cn(
                  "w-[20px] h-[20px] transition-transform",
                  moreActive ? "scale-110 text-primary" : ""
                )}
                strokeWidth={moreActive ? 2.4 : 2}
              />
              <span className="leading-none">{tr ? "Daha" : "More"}</span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};


export default MobileBottomTabBar;
