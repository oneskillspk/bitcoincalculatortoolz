import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Language } from "@/types/translations";
import { getLocalizedPath } from "@/utils/localizedRoutes";

const languages: { code: Language; name: string; flag: string; available: boolean }[] = [
  { code: 'en', name: 'English',   flag: '🇺🇸', available: true  },
  { code: 'tr', name: 'Türkçe',    flag: '🇹🇷', available: true  },
  { code: 'es', name: 'Español',   flag: '🇪🇸', available: false },
  { code: 'fr', name: 'Français',  flag: '🇫🇷', available: false },
  { code: 'de', name: 'Deutsch',   flag: '🇩🇪', available: false },
  { code: 'pt', name: 'Português', flag: '🇵🇹', available: false },
  { code: 'it', name: 'Italiano',  flag: '🇮🇹', available: false },
  { code: 'ar', name: 'العربية',   flag: '🇸🇦', available: false },
];

export const LanguageSelector = () => {
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const currentLanguage = languages.find(lang => lang.code === language);

  const handleSelect = (lang: typeof languages[number]) => {
    if (!lang.available) return;
    if (lang.code === language) return;

    if (lang.code === 'tr') {
      // Navigate to Turkish URL — LanguageRouteSync will set language to 'tr'
      navigate(getLocalizedPath(pathname, 'tr'));
    } else if (language === 'tr') {
      // Leaving Turkish: set desired language first so LanguageRouteSync
      // (which checks language === 'tr') doesn't override with 'en'.
      setLanguage(lang.code);
      navigate(getLocalizedPath(pathname, 'en'));
    } else {
      // Non-URL-routed language change (es, fr, de, pt, …)
      setLanguage(lang.code);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-1.5 h-9 px-3 rounded-xl text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
          aria-label={t('aria.selectLanguage')}
        >
          <Globe className="h-[15px] w-[15px]" />
          <span className="hidden sm:inline">{currentLanguage?.flag}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        collisionPadding={12}
        avoidCollisions
        className="w-44 max-h-[min(70vh,28rem)] overflow-y-auto bg-background/95 backdrop-blur-xl border border-border/30 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.12)] rounded-xl p-1 z-[100]"
        sideOffset={8}
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleSelect(lang)}
            className={`cursor-pointer flex items-center justify-between gap-2 py-2 px-2.5 rounded-lg text-sm transition-colors ${
              language === lang.code
                ? 'bg-primary/8 text-primary font-medium'
                : lang.available
                ? 'text-foreground/80 hover:text-foreground hover:bg-muted/40'
                : 'opacity-40 cursor-not-allowed text-foreground/40'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base leading-none">{lang.flag}</span>
              <span>{lang.name}</span>
            </div>
            {!lang.available && (
              <span className="text-[10px] text-muted-foreground/70 font-medium uppercase tracking-wide">
                Soon
              </span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
