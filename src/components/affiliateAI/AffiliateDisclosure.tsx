import type { Lang } from "@/lib/affiliateAI/types";

interface Props {
  lang?: Lang;
  className?: string;
  /** Compact "Sponsored" badge vs full FTC sentence. Default: "ftc". */
  variant?: "badge" | "ftc";
}

/**
 * FTC-compliant affiliate disclosure.
 * Renders adjacent to every paid placement (Ledger, TradingView, etc.).
 * `variant="badge"` keeps the legacy uppercase "Sponsored" chip.
 */
export const AffiliateDisclosure = ({
  lang = "en",
  className = "",
  variant = "ftc",
}: Props) => {
  if (variant === "badge") {
    return (
      <p className={`text-[9px] uppercase tracking-wider text-muted-foreground ${className}`}>
        {lang === "tr" ? "Sponsorlu" : "Sponsored"}
      </p>
    );
  }

  return (
    <p className={`text-[10px] leading-snug text-muted-foreground/80 ${className}`}>
      <span className="uppercase tracking-wider font-medium text-muted-foreground">
        {lang === "tr" ? "Sponsorlu" : "Sponsored"}
      </span>
    </p>
  );
};
