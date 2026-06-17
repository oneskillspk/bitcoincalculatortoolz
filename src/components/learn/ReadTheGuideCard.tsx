import { useLocation } from "react-router-dom";
import { BookOpen, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLocalizedPath } from "@/utils/localizedRoutes";
import { calculatorToArticle } from "@/data/calculatorToArticle";
import { EN_TO_TR } from "@/utils/localizedRoutes";

const TR_TO_EN: Record<string, string> = Object.fromEntries(
  Object.entries(EN_TO_TR).map(([en, tr]) => [tr, en]),
);

/**
 * Auto-rendered "Read the guide" card that pairs each calculator with its
 * companion Learn article. Detects the current calculator slug from the URL
 * and resolves the localized article path. Renders nothing when no pairing
 * exists for the current route.
 *
 * Mount once globally (App.tsx) — placement renders inline at the bottom
 * of every calculator page via a portal-free fixed position? No: render
 * inline. To avoid wiring it into 46 page files, this component is
 * imported by the shared CalculatorPageShell, or mounted by individual
 * pages that opt in. For zero-touch coverage we expose `<ReadTheGuideCard />`
 * for opt-in.
 */
export const ReadTheGuideCard = () => {
  const { language } = useLanguage();
  const { pathname } = useLocation();

  // Normalize TR routes to EN canonical so the slug lookup works in both locales.
  const isTr = pathname.startsWith("/tr/");
  let enPath = pathname.replace(/\/$/, "");
  if (isTr) enPath = TR_TO_EN[enPath] ?? "";
  const match = enPath.match(/^\/calculators\/([a-z0-9-]+)$/i);
  if (!match) return null;
  const articleSlug = calculatorToArticle[match[1]];
  if (!articleSlug) return null;

  const targetLang: "en" | "tr" = language === "tr" ? "tr" : "en";
  const href = getLocalizedPath(`/learn/${articleSlug}`, targetLang);
  const tr = language === "tr";

  return (
    <section
      aria-label={tr ? "İlgili rehber" : "Related guide"}
      className="container mx-auto px-4 sm:px-6 my-10"
    >
      <a
        href={href}
        className="group block max-w-3xl mx-auto rounded-xl border border-border/60 bg-card hover:border-primary/40 transition-colors p-5 sm:p-6"
      >
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary" strokeWidth={1.75} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-muted-foreground mb-1">
              {tr ? "İlgili rehber" : "Read the guide"}
            </p>
            <p className="text-base sm:text-lg font-semibold text-foreground leading-snug group-hover:text-primary transition-colors">
              {tr
                ? "Bu hesaplayıcının arkasındaki metodolojiyi öğrenin"
                : "Learn the methodology behind this calculator"}
            </p>
          </div>
          <ArrowRight
            className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all mt-1.5"
            strokeWidth={1.75}
          />
        </div>
      </a>
    </section>
  );
};
