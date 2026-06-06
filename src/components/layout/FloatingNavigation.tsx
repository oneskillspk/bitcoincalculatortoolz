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
          "mx-auto transition-all duration-500 ease-out",
          isScrolled ? "max-w-5xl px-2 sm:px-4" : "max-w-6xl px-2 sm:px-6"
        )}>
          <div className={cn(
            "flex items-center justify-between rounded-2xl transition-all duration-500 ease-out",
            // Thinner editorial bar — compact on mobile, airy hairline pill on desktop.
            "h-[52px] sm:h-[56px] px-3 sm:px-7 py-1.5 sm:py-2",
            isScrolled
              ? "bg-background/75 backdrop-blur-2xl border border-border/25 shadow-[0_6px_24px_-12px_hsl(0_0%_0%/0.08)]"
              : "bg-background/40 backdrop-blur-xl border border-transparent"
          )}>
            {/* Logo — icon-only on mobile to keep the bar compact and native-feeling. */}
            <Link to={homePath} className="relative group flex items-center min-w-0">
              <span className="lg:hidden"><AnimatedBrandLogo variant="icon" size="sm" /></span>
              <span className="hidden lg:flex"><AnimatedBrandLogo variant="full" size="sm" /></span>
            </Link>


            {/* Desktop Navigation — quiet editorial row with ember underline on active */}
            <nav className="hidden lg:flex items-center gap-8" role="navigation" aria-label={t('aria.mainNavigation')}>
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "relative text-[13px] font-medium tracking-tight transition-colors duration-300",
                    "after:absolute after:left-0 after:right-0 after:-bottom-1.5 after:h-px after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-300",
                    isActive(item.path)
                      ? "text-foreground after:scale-x-100"
                      : "text-muted-foreground/80 hover:text-foreground hover:after:scale-x-100"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>


            {/* Right Side Actions */}
            <div className="flex items-center gap-1.5">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center justify-center w-11 h-11 lg:w-auto lg:h-9 lg:px-3 lg:gap-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 text-[12px] font-medium"
                aria-label={isTurkish ? 'Ara' : 'Search'}
              >
                <Search className="w-[18px] h-[18px] lg:hidden" />
                <span className="hidden lg:inline text-[11px] font-medium text-muted-foreground/70 tracking-wide">⌘K</span>
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

      {/* Keyboard shortcut listener */}
      {typeof window !== 'undefined' && (
        <div
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
              e.preventDefault();
              setIsSearchOpen(true);
            }
          }}
          style={{ position: 'fixed', top: 0, left: 0, width: 0, height: 0, opacity: 0 }}
          tabIndex={-1}
        />
      )}
    </>
  );
};
