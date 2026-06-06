import type { Lang } from "@/lib/affiliateAI/types";

interface Props {
  lang?: Lang;
  className?: string;
}

export const AffiliateDisclosure = ({ lang = "en", className = "" }: Props) => (
  <p
    className={`text-[9px] uppercase tracking-wider text-muted-foreground ${className}`}
  >
    {lang === "tr" ? "Sponsorlu" : "Sponsored"}
  </p>
);
