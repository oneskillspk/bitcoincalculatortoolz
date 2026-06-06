import { FloatingNavigation } from "@/components/layout/FloatingNavigation";
import { useInRouterContext } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export const Header = () => {
  const inRouter = useInRouterContext();
  const { language } = useLanguage();
  const tr = language === 'tr';

  if (!inRouter) return null;
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[9999] focus:bg-background focus:text-foreground focus:px-4 focus:py-2 focus:rounded focus:border focus:border-border"
      >
        {tr ? 'Ana içeriğe geç' : 'Skip to main content'}
      </a>
      <FloatingNavigation />
    </>
  );
};
