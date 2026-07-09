import { useState, useEffect } from 'react';
import { SmartSearch } from './SmartSearch';
import { Link } from "@/components/LocalizedLink";
import { useLocation } from "react-router-dom";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatedBrandLogo } from "@/components/AnimatedBrandLogo";
import { MobileNavigation } from "@/components/MobileNavigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export const FloatingNavigation = () => {
  const { t, language } = useLanguage();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const isTurkish = language === 'tr';

  useEffect(() => {
    let rafId: number | null = null;
    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 20);
        rafId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // Global ⌘K / Ctrl+K shortcut — bound to window so it works regardless of focus.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);


  // Normalize trailing slash for comparison (except root '/')
  const normPath = (p: string) => (p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p);
  const isActive = (path: string) => normPath(location.pathname) === normPath(path);

  const navItems = isTurkish
    ? [
        { path: '/tr/',               label: t('nav.home')        },
        { path: '/tr/hesaplayicilar', label: t('nav.calculators') },
        { path: '/tr/araclar',        label: t('nav.tools')       },
        { path: '/tr/ogrenin',        label: 'Öğren'              },
        { path: '/tr/hakkimizda',     label: t('nav.about')       },
        { path: '/tr/iletisim',       label: t('nav.contact')     },
      ]
    : [
        { path: '/',             label: t('nav.home')        },
        { path: '/calculators', label: t('nav.calculators') },
        { path: '/tools',       label: t('nav.tools')       },
        { path: '/learn',       label: 'Learn'              },
        { path: '/about',       label: t('nav.about')       },
        { path: '/contact',     label: t('nav.contact')     },
      ];

  const homePath = isTurkish ? '/tr/' : '/';

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out motion-safe:animate-nav-slide-in",
          isScrolled ? "py-1.5 sm:py-2" : "py-2 sm:py-4"
        )}
        style={{
          contain: 'layout style',
          paddingTop: 'max(0px, env(safe-area-inset-top))',
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)',
        }}
      >
        <div className={cn(
          "mx-auto transition-all duration-500 ease-out max-w-6xl px-2",
          isScrolled ? "sm:max-w-5xl sm:px-4" : "sm:px-6"
        )}>

          <div className={cn(
            "flex items-center justify-between transition-all duration-500 ease-out rounded-xl",
            // Instrument Panel pill — hairline, paper-toned, square-ish corners
            "h-[48px] sm:h-[54px] pl-3 pr-2 sm:pl-5 sm:pr-3",
            isScrolled
              ? "bg-background/85 backdrop-blur-2xl border border-border/70 shadow-[var(--ip-card-shadow)]"
              : "bg-background/55 backdrop-blur-xl border border-border/40"
          )}>
            {/* Logo */}
            <Link
              to={homePath}
              aria-label={isTurkish ? 'Bitcoin Calculator Tools — Ana sayfa' : 'Bitcoin Calculator Tools — Home'}
              className="relative group flex items-center min-w-0 -ml-1 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span className="lg:hidden"><AnimatedBrandLogo variant="compact" size="sm" /></span>
              <span className="hidden lg:flex"><AnimatedBrandLogo variant="full" size="sm" /></span>
            </Link>


            {/* Desktop Navigation — terminal-style links with ember dot on active */}
            <nav className="hidden lg:flex items-center gap-6" aria-label={t('aria.mainNavigation')}>
              {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      "group relative inline-flex items-center gap-1.5 text-[12.5px] font-medium tracking-tight transition-colors duration-200",
                      "outline-none rounded-sm focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-4 focus-visible:ring-offset-background",
                      active
                        ? "text-foreground"
                        : "text-muted-foreground/80 hover:text-foreground"
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "ip-dot transition-all duration-200",
                        active
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-75 group-hover:opacity-60 group-hover:scale-100"
                      )}
                    />
                    <span className="relative">
                      {item.label}
                      <span
                        aria-hidden
                        className={cn(
                          "pointer-events-none absolute -bottom-1 left-0 h-px bg-primary/70 transition-[width,opacity] duration-300 ease-out",
                          active
                            ? "w-full opacity-100"
                            : "w-0 opacity-0 group-hover:w-full group-hover:opacity-70"
                        )}
                      />
                    </span>
                  </Link>
                );
              })}
            </nav>



            {/* Right Side Actions */}
            <div className="flex items-center gap-1">
              {/* Search — opens command palette; also bound globally to ⌘K / Ctrl+K */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className={cn(
                  "flex items-center justify-center rounded-lg transition-all duration-200",
                  "w-11 h-11 lg:w-auto lg:h-9 lg:pl-2.5 lg:pr-1.5 lg:gap-2",
                  "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                  "outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                )}
                aria-label={isTurkish ? 'Aramayı aç (Ctrl+K veya Cmd+K)' : 'Open search (Ctrl+K or Cmd+K)'}
                aria-keyshortcuts="Meta+K Control+K"
                aria-haspopup="dialog"
                aria-expanded={isSearchOpen}
              >
                <Search aria-hidden="true" className="w-[18px] h-[18px] lg:w-[14px] lg:h-[14px]" />
                <kbd
                  aria-hidden="true"
                  className="hidden lg:inline-flex items-center justify-center h-6 min-w-[28px] px-1.5 rounded-md border border-border/60 bg-background/40 text-[10px] font-mono font-medium text-muted-foreground/80 tracking-wider"
                >
                  ⌘K
                </kbd>
              </button>

              {/* Language */}
              <div className="hidden md:block">
                <LanguageSelector />
              </div>

              {/* Mobile Menu */}
              <MobileNavigation onSearchOpen={() => setIsSearchOpen(true)} />
            </div>
          </div>

        </div>
      </header>

      {/* Smart Search Modal */}
      <SmartSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
