import React, { useState } from 'react';
import { Link } from "@/components/LocalizedLink";
import { useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Menu, Search, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from '@/components/LanguageSelector';
import { cn } from '@/lib/utils';

interface MobileNavigationProps {
  onSearchOpen?: () => void;
}

export const MobileNavigation = ({ onSearchOpen }: MobileNavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, language } = useLanguage();
  const location = useLocation();

  const isTurkish = language === 'tr';

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

  const handleLinkClick = () => setIsOpen(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button
          className="lg:hidden flex items-center justify-center w-11 h-11 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 active:bg-muted/70 active:scale-95 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label={isTurkish ? 'Navigasyon menüsünü aç' : 'Open navigation menu'}
        >
          <Menu className="h-[18px] w-[18px]" />
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[min(88vw,320px)] max-w-[320px] bg-background border-l border-border/60 p-0 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
        aria-describedby="mobile-nav-description"
      >
        <SheetHeader className="px-5 sm:px-6 pt-6 pb-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <span className="ip-dot" aria-hidden />
            <SheetTitle className="text-left font-mono text-[10.5px] tracking-[0.14em] uppercase text-muted-foreground font-normal">
              NAV · {isTurkish ? 'MENÜ' : 'MENU'}
            </SheetTitle>
          </div>
          <div id="mobile-nav-description" className="sr-only">
            {isTurkish
              ? 'Sitenin farklı bölümlerine bağlantılar içeren mobil navigasyon menüsü'
              : 'Mobile navigation menu with links to different sections of the site'}
          </div>
        </SheetHeader>

        <nav
          className="flex flex-col px-3 mt-3 gap-0.5"
          role="navigation"
          aria-label={isTurkish ? 'Mobil navigasyon' : 'Mobile navigation'}
        >
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className={cn(
                  "flex items-center justify-between min-h-[48px] py-3 px-4 rounded-lg text-[14px] font-medium transition-all duration-200 border",
                  active
                    ? "bg-background border-border/70 text-foreground"
                    : "border-transparent text-foreground/70 hover:text-foreground hover:bg-muted/40"
                )}
              >
                <span className="inline-flex items-center gap-2.5">
                  <span
                    aria-hidden
                    className={cn("ip-dot transition-opacity", active ? "opacity-100" : "opacity-0")}
                  />
                  {item.label}
                </span>
                {active && (
                  <ArrowRight className="w-3.5 h-3.5 text-primary" />
                )}
              </Link>
            );
          })}

          {onSearchOpen && (
            <button
              onClick={() => { handleLinkClick(); onSearchOpen(); }}
              className="flex items-center gap-2.5 min-h-[48px] py-3 px-4 rounded-lg text-[14px] font-medium text-foreground/70 hover:text-foreground hover:bg-muted/40 transition-all duration-200 border border-transparent"
            >
              <Search className="w-4 h-4" />
              {isTurkish ? 'Ara' : 'Search'}
            </button>
          )}

          <div className="border-t border-border/60 mt-4 pt-4 mx-1">
            <div className="px-3 mb-3 flex items-center gap-2">
              <span className="ip-dot ip-dot--muted" aria-hidden />
              <span className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-muted-foreground">
                {isTurkish ? 'DİL' : 'LANG'}
              </span>
            </div>
            <div className="px-3">
              <LanguageSelector />
            </div>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
};
