import React from 'react';
import { Link } from "@/components/LocalizedLink";
import { useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Search, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useMobileMenuOpen, setMobileMenuOpen } from '@/components/layout/mobileMenuStore';
import { cn } from '@/lib/utils';

interface MobileNavigationProps {
  onSearchOpen?: () => void;
}

/**
 * Secondary "More" menu for mobile.
 *
 * The five primary destinations (Home / Calculators / Tools / Learn / About)
 * live in the bottom tab bar, so this sheet only carries the overflow links,
 * search and the Plan Batch 6 the final batch (Rows 26–30) by outlining the five highest-intent SEO modules and which calculator page each one should be added to.. It has no trigger of its own — the bottom
 * tab bar's "More" tab opens it through the shared store, so there is exactly
 * one navigation entry point on mobile.
 */
export const MobileNavigation = ({ onSearchOpen }: MobileNavigationProps) => {
  const isOpen = useMobileMenuOpen();
  const { language } = useLanguage();
  const location = useLocation();

  const isTurkish = language === 'tr';

  const normPath = (p: string) => (p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p);
  const isActive = (path: string) => normPath(location.pathname) === normPath(path);

  const navItems = isTurkish
    ? [
        { path: '/tr/hakkimizda',                 label: 'Hakkımızda'          },
        { path: '/tr/iletisim',                   label: 'İletişim'            },
        { path: '/tr/yontem',                     label: 'Yöntem'              },
        { path: '/tr/gizlilik',                   label: 'Gizlilik'            },
        { path: '/tr/bagli-kurulus-aciklamasi',   label: 'Bağlı Kuruluş'       },
      ]
    : [
        { path: '/about',                 label: 'About'                },
        { path: '/contact',               label: 'Contact'              },
        { path: '/methodology',           label: 'Methodology'          },
        { path: '/privacy',               label: 'Privacy'              },
        { path: '/affiliate-disclosure',  label: 'Affiliate Disclosure' },
      ];

  const handleLinkClick = () => setMobileMenuOpen(false);

  return (
    <Sheet open={isOpen} onOpenChange={setMobileMenuOpen}>
      <SheetContent
        side="right"
        className="w-[min(88vw,320px)] max-w-[320px] bg-background border-l border-border/60 p-0 pt-[max(env(safe-area-inset-top,0px),0px)] pb-[max(env(safe-area-inset-bottom,0px),0px)] flex flex-col overflow-hidden"
        aria-describedby="mobile-nav-description"
      >
        <SheetHeader className="px-5 sm:px-6 pt-6 pb-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <span className="ip-dot" aria-hidden />
            <SheetTitle className="text-left font-mono text-[10.5px] tracking-[0.14em] uppercase text-muted-foreground font-normal">
              NAV · {isTurkish ? 'DAHA FAZLA' : 'MORE'}
            </SheetTitle>
          </div>
          <div id="mobile-nav-description" className="sr-only">
            {isTurkish
              ? 'Ek sayfalar, arama ve dil seçimi içeren mobil menü'
              : 'Mobile menu with additional pages, search and language selection'}
          </div>
        </SheetHeader>

        <nav
          data-bottom-inset
          className="flex flex-col px-3 mt-3 gap-0.5 flex-1 min-h-0 overflow-y-auto overscroll-contain"
          role="navigation"
          aria-label={isTurkish ? 'Ek navigasyon' : 'Secondary navigation'}
        >

          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  "flex items-center justify-between min-h-[48px] py-3 px-4 rounded-lg text-[14px] font-medium transition-all duration-200 border outline-none",
                  "focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  "active:scale-[0.98]",
                  active
                    ? "bg-muted/50 border-border/70 text-foreground"
                    : "border-transparent text-foreground/70 hover:text-foreground hover:bg-muted/40 active:bg-muted/60"
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
              className="flex items-center gap-2.5 min-h-[48px] py-3 px-4 rounded-lg text-[14px] font-medium text-foreground/70 hover:text-foreground hover:bg-muted/40 active:bg-muted/60 active:scale-[0.98] transition-all duration-200 border border-transparent outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
