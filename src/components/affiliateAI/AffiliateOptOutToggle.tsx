/**
 * Footer toggle: lets visitors disable all AffiliateAI placements site-wide.
 * Writes localStorage key `btc_affiliate_optout` ("1" = opted out).
 * Reloads the page so the engine picks up the new context.
 */
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/contexts/LanguageContext";

const KEY = "btc_affiliate_optout";

export const AffiliateOptOutToggle = () => {
  const { language } = useLanguage();
  const isTr = language === "tr";
  const [optedOut, setOptedOut] = useState(false);

  useEffect(() => {
    try {
      setOptedOut(localStorage.getItem(KEY) === "1");
    } catch {
      /* ignore */
    }
  }, []);

  const onChange = (next: boolean) => {
    try {
      if (next) localStorage.setItem(KEY, "1");
      else localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    setOptedOut(next);
    // Re-evaluate the engine context on the next render cycle.
    setTimeout(() => window.location.reload(), 150);
  };

  return (
    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
      <Switch
        id="affiliate-optout"
        checked={optedOut}
        onCheckedChange={onChange}
        aria-label={isTr ? "Ortaklık önerilerini gizle" : "Hide affiliate recommendations"}
      />
      <label htmlFor="affiliate-optout" className="cursor-pointer select-none">
        {isTr ? "Ortaklık önerilerini gizle" : "Hide affiliate recommendations"}
      </label>
    </div>
  );
};
