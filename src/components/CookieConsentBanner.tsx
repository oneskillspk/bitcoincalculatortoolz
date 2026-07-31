import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Lightweight EU-style cookie / consent banner.
 *
 * Stores the user's choice in localStorage under `bct-consent-v1` as
 * either `granted` or `denied`. Until a choice exists we set Google
 * Consent Mode v2 signals to *denied* defaults via `gtag('consent', ...)`,
 * so analytics + affiliate impression logging never fire pre-consent on
 * EU traffic. After the user picks, we update those signals accordingly.
 *
 * No tracking is done by this banner itself — it only writes to
 * localStorage and dispatches a `consentchange` window event so other
 * modules (analytics loaders, affiliate logging) can react.
 */
const STORAGE_KEY = "bct-consent-v1";

type ConsentValue = "granted" | "denied";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function pushConsent(value: ConsentValue) {
  try {
    window.dataLayer = window.dataLayer || [];
    const update = {
      ad_storage: value,
      ad_user_data: value,
      ad_personalization: value,
      analytics_storage: value,
    } as const;
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", update);
    } else {
      // Queue for when gtag loads (Google Consent Mode v2 pattern).
      window.dataLayer.push(["consent", "update", update]);
    }
    window.dispatchEvent(new CustomEvent("consentchange", { detail: value }));
  } catch {
    /* no-op */
  }
}

export const CookieConsentBanner = () => {
  const { language } = useLanguage();
  const isTr = language === "tr";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as
        | ConsentValue
        | null;
      if (!stored) {
        // Show banner after first paint so we don't slow LCP.
        const id = window.setTimeout(() => setVisible(true), 600);
        return () => window.clearTimeout(id);
      }
      // Replay the stored choice so consent-aware loaders pick it up.
      pushConsent(stored);
    } catch {
      /* localStorage blocked — banner stays hidden, defaults remain denied */
    }
  }, []);

  // Reserve space at the bottom of the document while the dialog is up so
  // it never sits on top of a page CTA or the sticky mobile action bar.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.classList.toggle("has-consent-banner", visible);
    return () => document.body.classList.remove("has-consent-banner");
  }, [visible]);

  const choose = (value: ConsentValue) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
    pushConsent(value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={isTr ? "Çerez onayı" : "Cookie consent"}
      className="fixed inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4 z-[70] mx-auto max-w-3xl rounded-2xl border border-border bg-background/95 p-4 shadow-2xl backdrop-blur-md"
      style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <p className="text-sm leading-relaxed text-foreground/90">
          {isTr
            ? "Site deneyimini ölçmek ve ilgili reklamları göstermek için çerez kullanıyoruz. Onayınız olmadan analitik ve reklam çerezleri çalışmaz."
            : "We use cookies to measure usage and serve relevant ads. Analytics and ad cookies stay off until you accept."}{" "}
          <Link
            to={isTr ? "/tr/gizlilik" : "/privacy"}
            className="underline underline-offset-2 hover:text-primary"
          >
            {isTr ? "Gizlilik" : "Privacy"}
          </Link>
        </p>
        <div className="flex shrink-0 gap-2 sm:ml-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => choose("denied")}
            aria-label={isTr ? "Reddet" : "Reject non-essential cookies"}
          >
            {isTr ? "Reddet" : "Reject"}
          </Button>
          <Button
            size="sm"
            onClick={() => choose("granted")}
            aria-label={isTr ? "Tümünü kabul et" : "Accept all cookies"}
          >
            {isTr ? "Kabul Et" : "Accept"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
