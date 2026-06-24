/**
 * Universal placement renderer. Renders cards, image banners, or HTML
 * banners based on the AI decision. Returns null in shadow mode or
 * when hidden.
 */
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import DOMPurify from "dompurify";
import { LanguageContext } from "@/contexts/LanguageContext";
import { useAffiliateAI } from "@/hooks/useAffiliateAI";
import { logEvent } from "@/lib/affiliateAI/analyticsClient";
import { pickCreative, pickResponsiveSet } from "@/lib/affiliateAI/creativePicker";
import { appendUtm } from "@/lib/affiliateAI/utm";
import { AffiliateDisclosure } from "./AffiliateDisclosure";
import type { Lang, Zone } from "@/lib/affiliateAI/types";
import type { ResolvedAffiliate } from "@/lib/affiliateAI/placementResolver";

/** Reads LanguageContext without throwing when the provider is absent
 *  (some integration tests render <AffiliatePlacement> in isolation). */
function useSafeLanguage(): Lang {
  const ctx = useContext(LanguageContext);
  if (ctx) return ctx.language === "tr" ? "tr" : "en";
  if (typeof window === "undefined") return "en";
  const p = window.location.pathname;
  return p === "/tr" || p.startsWith("/tr/") ? "tr" : "en";
}

const RECENCY_KEY = "aff_seen";
function markSeen(affiliateId: string) {
  if (typeof window === "undefined") return;
  try {
    const seen = JSON.parse(localStorage.getItem(RECENCY_KEY) || "{}");
    seen[affiliateId] = Date.now();
    localStorage.setItem(RECENCY_KEY, JSON.stringify(seen));
  } catch {
    /* ignore */
  }
}

interface Props {
  slug: string;
  /** When omitted, auto-detected from URL (`/tr/...` → "tr", else "en"). */
  lang?: Lang;
  resultSignals?: string[];
  zone?: Zone;
  className?: string;
  /** Force a specific affiliate id (bypasses scoring + Cloud fetch). */
  forceAffiliateId?: string;
  /** Optional format override when forcing an affiliate id. */
  forceFormat?:
    | "single-card"
    | "two-card-strip"
    | "comparison"
    | "inline-cta"
    | "sidebar-widget"
    | "image-banner"
    | "html-banner";
}

const detectDevice = (): "mobile" | "tablet" | "desktop" => {
  if (typeof window === "undefined") return "desktop";
  const w = window.innerWidth;
  if (w < 640) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
};


export const AffiliatePlacement = ({
  slug,
  lang,
  resultSignals,
  zone,
  className = "",
  forceAffiliateId,
  forceFormat,
}: Props) => {
  // Single source of truth for locale — same context every other page
  // uses, so /tr/* routes never silently render English copy because
  // pathname parsing happened before hydration.
  const language = useSafeLanguage();
  const resolvedLang: Lang = lang ?? language;
  const { decision, items, hidden, shadow, loading } = useAffiliateAI({
    slug,
    lang: resolvedLang,
    resultSignals,
    zone,
    forceAffiliateId,
    forceFormat,
  });

  // Effective rendered locale — falls back to EN/TR alternate when the
  // partner only ships one language. Analytics + disclosure follow what
  // the user actually sees, not what we requested.
  const effectiveLang: Lang =
    items[0]?.effectiveLang ?? resolvedLang;

  useEffect(() => {
    if (hidden || loading || !decision) return;
    const segment = decision.segment;
    for (const id of decision.affiliate_ids) {
      logEvent({ kind: "impression", affiliate_id: id, slug, lang: effectiveLang, segment });
      markSeen(id);
    }
  }, [hidden, loading, decision, slug, effectiveLang]);

  if (hidden || shadow) return null;

  // Reserve space while the decision is being fetched so the slot does
  // not pop in late after the user has already scrolled past — avoids
  // CLS and keeps the layout stable on slow mobile networks.
  if (loading || items.length === 0 || !decision) {
    return (
      <section
        className={`my-6 ${className}`}
        style={{ minHeight: 110 }}
        aria-hidden="true"
        data-affiliate-placement="loading"
        data-affiliate-slug={slug}
        data-affiliate-state="loading"
      >
        <div className="h-[90px] w-full max-w-2xl mx-auto rounded-md bg-muted/30 animate-pulse" />
      </section>
    );
  }


  const format = decision.format;
  const segment = decision.segment;
  const zoneOut = decision.zone;
  const first = items[0];
  // Forced placements (e.g. the homepage Ledger banner) and inline
  // banners load eagerly so they paint as soon as the user scrolls
  // into them rather than starting a fetch on intersection.
  const eagerBanner = !!forceAffiliateId || zoneOut === 'inline';

  return (
    <section
      className={`my-6 ${className}`}
      style={{ minHeight: 90 }}
      data-affiliate-placement={zoneOut}
      data-affiliate-zone={zoneOut}
      data-affiliate-format={format}
      data-affiliate-lang={effectiveLang}
      data-affiliate-slug={slug}
    >
      <div className="flex items-center justify-between mb-2">
        <AffiliateDisclosure lang={effectiveLang} />
      </div>
      {format === "image-banner" && first ? (
        <ImageBanner item={first} slug={slug} lang={effectiveLang} segment={segment} zone={zoneOut} eager={eagerBanner} />
      ) : format === "html-banner" && first ? (
        <HtmlBanner item={first} slug={slug} lang={effectiveLang} segment={segment} zone={zoneOut} />
      ) : format === "single-card" && first ? (
        <SingleCard item={first} lang={effectiveLang} slug={slug} segment={segment} zone={zoneOut} />
      ) : format === "sidebar-widget" ? (
        <Sidebar items={items} lang={effectiveLang} slug={slug} segment={segment} zone={zoneOut} />
      ) : format === "comparison" ? (
        <Comparison items={items} lang={effectiveLang} slug={slug} segment={segment} zone={zoneOut} />
      ) : format === "inline-cta" && first ? (
        <InlineCTA item={first} lang={effectiveLang} slug={slug} segment={segment} zone={zoneOut} />
      ) : (
        <TwoCardStrip items={items} lang={effectiveLang} slug={slug} segment={segment} zone={zoneOut} />
      )}
    </section>
  );
};

const trackClick = (
  item: ResolvedAffiliate,
  slug: string,
  lang: Lang,
  segment: string
) => {
  logEvent({
    kind: "click",
    affiliate_id: item.program.id,
    slug,
    lang,
    segment,
  });
  // GA4 — mirrors the click into the customer's analytics property so
  // affiliate-revenue funnels show up alongside organic events.
  try {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "affiliate_click", {
        affiliate_id: item.program.id,
        slug,
        lang,
        segment,
      });
    }
  } catch {
    // ignore
  }
  // Notify the V2 orchestrator so it can apply a 90s post-click cooldown
  // across remaining slots on the page.
  try {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("aff:click", {
          detail: { slug, affiliate_id: item.program.id },
        })
      );
    }
  } catch {
    // ignore
  }
};

const linkProps = { target: "_blank", rel: "sponsored nofollow noopener" } as const;

// ---- Card formats (existing) ----

// ---- Card formats ----

interface CardProps {
  item: ResolvedAffiliate;
  slug: string;
  lang: Lang;
  segment: string;
  zone: Zone;
}

function Card({ item, slug, lang, segment, zone }: CardProps) {
  const href = appendUtm(item.url, { slug, affiliateId: item.program.id, zone });
  return (
    <a
      href={href}
      {...linkProps}
      onClick={() => trackClick(item, slug, lang, segment)}
      className="block rounded-lg border border-border bg-card p-4 hover:border-primary/40 hover:shadow-sm transition"
    >
      <div className="flex items-center justify-between mb-1">
        <span
          className="text-sm font-semibold text-foreground"
          style={item.program.logo_color ? { color: item.program.logo_color } : undefined}
        >
          {item.program.name}
        </span>
        {item.badge && (
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            {item.badge}
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{item.description}</p>
      <span className="text-xs font-medium text-primary">{item.cta} →</span>
    </a>
  );
}

const SingleCard = (p: CardProps) => (
  <div className="max-w-md"><Card {...p} /></div>
);

interface MultiCardProps {
  items: ResolvedAffiliate[];
  slug: string;
  lang: Lang;
  segment: string;
  zone: Zone;
}

const TwoCardStrip = ({ items, ...rest }: MultiCardProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    {items.slice(0, 2).map((item) => (
      <Card key={item.program.id} item={item} {...rest} />
    ))}
  </div>
);

const Sidebar = ({ items, ...rest }: MultiCardProps) => (
  <div className="flex flex-col gap-2">
    {items.map((item) => (
      <Card key={item.program.id} item={item} {...rest} />
    ))}
  </div>
);

const Comparison = ({ items, ...rest }: MultiCardProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border border-border rounded-lg p-3 bg-muted/20">
    {items.map((item) => (
      <Card key={item.program.id} item={item} {...rest} />
    ))}
  </div>
);

const InlineCTA = ({ item, slug, lang, segment, zone }: CardProps) => {
  const href = appendUtm(item.url, { slug, affiliateId: item.program.id, zone });
  return (
    <a
      href={href}
      {...linkProps}
      onClick={() => trackClick(item, slug, lang, segment)}
      className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90"
    >
      {item.cta} →
    </a>
  );
};

// ---- Banner formats ----

function ImageBanner({ item, slug, lang, segment, zone, eager = false }: CardProps & { eager?: boolean }) {
  const device = detectDevice();
  const creative = useMemo(
    () => pickCreative(item.program, zone, device, lang),
    [item.program, zone, device, lang]
  );

  // NOTE: every hook below MUST run unconditionally on every render —
  // returning early before later hooks violates the Rules of Hooks and
  // crashes with "Rendered fewer hooks than expected" the first time a
  // partner has no creative for this device.
  const set = useMemo(
    () => (creative ? pickResponsiveSet(item.program, creative, lang) : []),
    [item.program, creative, lang]
  );

  if (!creative) {
    return <SingleCard item={item} slug={slug} lang={lang} segment={segment} zone={zone} />;
  }

  const href = appendUtm(creative.landing_url || item.url, {
    slug,
    affiliateId: item.program.id,
    zone,
  });

  const chosenRatio = creative.width / creative.height;
  const sameAspect = set.filter(
    (c) => Math.abs(c.width / c.height - chosenRatio) / chosenRatio <= 0.05,
  );
  const pool = sameAspect.length > 0 ? sameAspect : [creative];
  const sorted = [...pool].sort((a, b) => a.width - b.width);


  const largerSources = sorted
    .filter((c) => c.width > creative.width)
    .sort((a, b) => b.width - a.width);

  return (
    <div className="flex justify-center">
      <a
        href={href}
        {...linkProps}
        onClick={() => trackClick(item, slug, lang, segment)}
        className="block max-w-full"
        aria-label={creative.alt}
        style={{ maxWidth: creative.width }}
      >
        <picture>
          {largerSources.map((c) => (
            <source
              key={c.size}
              media={`(min-width: ${c.width}px)`}
              srcSet={c.image_url_2x ? `${c.image_url} 1x, ${c.image_url_2x} 2x` : c.image_url}
              width={c.width}
              height={c.height}
            />
          ))}
          <img
            src={creative.image_url}
            srcSet={creative.image_url_2x ? `${creative.image_url} 1x, ${creative.image_url_2x} 2x` : undefined}
            sizes={`(max-width: ${creative.width}px) 100vw, ${creative.width}px`}
            width={creative.width}
            height={creative.height}
            alt={creative.alt}
            loading={eager ? "eager" : "lazy"}
            // @ts-expect-error fetchpriority is valid HTML, not yet in React types
            fetchpriority={eager ? "high" : undefined}
            decoding="async"
            className="block h-auto w-full rounded-md"
            style={{
              aspectRatio: `${creative.width} / ${creative.height}`,
              objectFit: "contain",
            }}
          />
        </picture>
      </a>
    </div>
  );
}


function HtmlBanner({ item, slug, lang, segment, zone }: CardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [html] = useState(() =>
    DOMPurify.sanitize(item.program.creative_html ?? "", {
      ADD_ATTR: ["target", "rel"],
    })
  );

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const handlers: Array<{ a: HTMLAnchorElement; fn: () => void }> = [];
    node.querySelectorAll("a").forEach((a) => {
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "sponsored nofollow noopener");
      const orig = a.getAttribute("href");
      if (orig) {
        a.setAttribute(
          "href",
          appendUtm(orig, { slug, affiliateId: item.program.id, zone })
        );
      }
      const fn = () => trackClick(item, slug, lang, segment);
      a.addEventListener("click", fn, { once: true });
      handlers.push({ a, fn });
    });
    return () => {
      handlers.forEach(({ a, fn }) => a.removeEventListener("click", fn));
    };
  }, [html, item, slug, lang, segment, zone]);

  if (!html) return null;
  return <div ref={ref} className="flex justify-center" dangerouslySetInnerHTML={{ __html: html }} />;
}
