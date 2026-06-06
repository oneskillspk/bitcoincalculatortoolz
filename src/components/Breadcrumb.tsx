import { ChevronRight, Home } from "lucide-react";
import { Link } from "@/components/LocalizedLink";
import { useLocale } from "@/hooks/useLocale";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb = ({ items }: BreadcrumbProps) => {
  const { isTr, pick } = useLocale();
  const homeHref = isTr ? "/tr/" : "/";
  return (
    <nav aria-label={pick({ en: "Breadcrumb", tr: "Sayfa yolu" })} className="flex flex-wrap items-center gap-1 sm:gap-2 text-sm text-muted-foreground mb-8 p-2 sm:p-0">
      <Link 
        to={homeHref} 
        className="flex items-center hover:text-primary transition-colors min-w-[2rem] min-h-[2rem] justify-center"
        aria-label={pick({ en: "Home", tr: "Ana Sayfa" })}
      >
        <Home className="w-4 h-4" />
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1 sm:gap-2">
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
          {item.href ? (
            <Link 
              to={item.href} 
              className="hover:text-primary transition-colors text-xs sm:text-sm truncate min-h-[2rem] flex items-center"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium text-xs sm:text-sm truncate min-h-[2rem] flex items-center">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
};