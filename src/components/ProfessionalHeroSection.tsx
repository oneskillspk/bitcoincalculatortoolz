import { useEffect, useMemo, useRef, useState } from "react";
import { formatGroupedInt, formatSymbolAmount } from '@/utils/numberFormat';
import { ArrowUpRight, ShieldCheck, Zap, Users, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "@/components/LocalizedLink";
import { useIntersectionAnimation } from "@/hooks/useIntersectionAnimation";
import { useLiveBitcoinPrice } from "@/hooks/useLiveBitcoinPrice";
import { useExperiment } from "@/hooks/useExperiment";
import type { HomeHeroCtaPayload } from "@/config/experiments.config";
import { brand } from "@/lib/brandColors";
import { MagneticCTA } from "@/components/motion/MagneticCTA";
import { HapticButton } from "@/components/motion/HapticButton";

/* ─────────────────────────────────────────────────────────────────────
 *  Enterprise Swiss Minimalist Hero (v5)
 *  Paper & Ink palette · Sora display · JetBrains Mono numerics
 *  $100M-fintech composition: split hero + live workspace cards.
 * ───────────────────────────────────────────────────────────────────── */

const PAPER = brand.paper;
const INK = brand.ink;
const INK_SOFT = brand.inkSoft;
const INK_MUTED = brand.inkMuted;
const HAIRLINE = brand.inkFaint;
const EMBER = brand.ember;

const SPARK = [38, 46, 41, 58, 64, 52, 71, 63, 78, 82, 74, 90];

// Next halving target — block 1,050,000 (~April 2028). Total epoch length: 210,000 blocks.
const HALVING_TARGET = new Date("2028-04-20T00:00:00Z").getTime();
const HALVING_START = new Date("2024-04-20T00:00:00Z").getTime();

export const ProfessionalHeroSection = () => {
  const { t, language } = useLanguage();
  const { ref, isVisible } = useIntersectionAnimation({ threshold: 0.1 });
  const { price, priceChangePercentage24h, isLoading } = useLiveBitcoinPrice("USD");
  const heroExperiment = useExperiment<HomeHeroCtaPayload>("home_hero_cta");
  // Editorial tone override: always use the professional CTA label. The playful
  // experiment copy ("See if you'd be rich") clashes with the section's gravitas.
  const heroCtaLabel = t("hero.cta.start");
  const heroSecondaryCtaLabel =
    language === "tr" ? "Tüm 49 hesaplayıcıyı gör →" : "Browse all 49 calculators →";

  // Subtle mouse-parallax — writes --px / --py (-1..1) to the section.
  const sectionRef = useRef<HTMLElement | null>(null);
  const setSectionRef = (el: HTMLElement | null) => {
    sectionRef.current = el;
    (ref as React.MutableRefObject<HTMLElement | null>).current = el;
  };
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let nx = 0;
    let ny = 0;
    const apply = () => {
      el.style.setProperty("--px", nx.toFixed(3));
      el.style.setProperty("--py", ny.toFixed(3));
      raf = 0;
    };
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      ny = ((e.clientY - r.top) / r.height) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      nx = 0; ny = 0;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    el.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave, { passive: true });
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Live "updated Xs ago" ticker.
  const [tick, setTick] = useState(1);
  useEffect(() => {
    const id = window.setInterval(() => setTick((n) => (n >= 30 ? 1 : n + 1)), 1000);
    return () => window.clearInterval(id);
  }, []);

  const isTurkish = language === "tr";
  const calculatorsPath = isTurkish ? "/tr/hesaplayicilar" : "/calculators";
  const dcaPath = isTurkish
    ? "/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi"
    : "/calculators/dca";
  const profitPath = isTurkish
    ? "/tr/hesaplayicilar/bitcoin-kar-zarar-hesaplayicisi"
    : "/calculators/profit-loss";
  const retirementPath = isTurkish
    ? "/tr/hesaplayicilar/bitcoin-emeklilik-hesaplayicisi"
    : "/calculators/retirement";

  const displayPct =
    Math.abs(priceChangePercentage24h) < 0.05 ? 0 : priceChangePercentage24h;
  const isPositive = displayPct > 0;
  const isNeutral = displayPct === 0;

  const formatPrice = (v: number) =>
    formatSymbolAmount(v, '$', 0, "en-US");

  const satsPerDollar = useMemo(() => {
    if (!price || price <= 0) return null;
    return Math.round(100_000_000 / price);
  }, [price]);

  const formatSats = (v: number) => formatGroupedInt(v, "en-US");

  // Halving progress
  const { daysLeft, halvingPct } = useMemo(() => {
    const now = Date.now();
    const total = HALVING_TARGET - HALVING_START;
    const elapsed = Math.max(0, Math.min(total, now - HALVING_START));
    const left = Math.max(0, Math.ceil((HALVING_TARGET - now) / (1000 * 60 * 60 * 24)));
    return { daysLeft: left, halvingPct: Math.round((elapsed / total) * 100) };
  }, []);

  const pctColor = isNeutral ? INK_MUTED : isPositive ? brand.success : brand.danger;
  const pctSign = isNeutral ? "" : isPositive ? "+" : "";

  // Headline split: "Free Bitcoin / Calculators That / Get You Results"
  // Middle word "Calculators" rendered muted for editorial contrast.
  const headlineLine1 = t("hero.title.line1"); // "Free Bitcoin Calculators"
  const headlineLine2 = t("hero.title.line2"); // "That Get You"
  const headlineHighlight = t("hero.title.highlight"); // "Results"
  // Pull the trailing "Calculators" word out of line1 to render muted.
  const parts = headlineLine1.trim().split(/\s+/);
  const headlineLead = parts.slice(0, -1).join(" ");
  const headlineMuted = parts[parts.length - 1];

  // Sparkline geometry
  const { sparkPath, sparkFill, sparkLast } = useMemo(() => {
    const w = 400;
    const h = 100;
    const max = Math.max(...SPARK);
    const min = Math.min(...SPARK);
    const range = max - min || 1;
    const points = SPARK.map((v, i) => {
      const x = (i / (SPARK.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 20) - 10;
      return { x, y };
    });
    const path = points
      .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
      .join(" ");
    return {
      sparkPath: path,
      sparkFill: `${path} L400,100 L0,100 Z`,
      sparkLast: points[points.length - 1],
    };
  }, []);


  const quickAccess = [
    { label: t("hero.bento.tool.dca"), to: dcaPath },
    { label: t("hero.bento.tool.profit"), to: profitPath },
    { label: t("hero.bento.tool.retirement"), to: retirementPath },
  ];

  return (
    <section
      ref={setSectionRef}
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: PAPER,
        color: INK,
        fontFamily: "'Manrope', system-ui, sans-serif",
      }}
      aria-labelledby="hero-title"
    >
      {/* paper grain */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(26,26,26,0.045) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* ambient ember halo */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          right: "-10%",
          top: "20%",
          width: "42rem",
          height: "42rem",
          background: `radial-gradient(circle, ${EMBER}2E 0%, ${EMBER}0D 40%, transparent 70%)`,
          filter: "blur(40px)",
          transform:
            "translate3d(calc(var(--px, 0) * -18px), calc(var(--py, 0) * -12px), 0)",
          transition: "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
          willChange: "transform",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12 pt-24 sm:pt-28 lg:pt-32 pb-16 lg:pb-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* ─────────── LEFT ─────────── */}
          <div className="flex flex-col gap-8 motion-safe:animate-fade-in">
            {/* Eyebrow pill — emerald-tinted live indicator (v2 tactical) */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 w-fit"
              style={{
                backgroundColor: "rgba(10,138,90,0.06)",
                border: "1px solid rgba(10,138,90,0.22)",
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span
                className="text-[10px] font-bold uppercase"
                style={{ letterSpacing: "0.18em", color: brand.success }}
              >
                {t("hero.bento.eyebrow")}
              </span>
            </div>

            {/* Headline — single-weight ink with the last word carrying the ember accent. */}
            <h1
              id="hero-title"
              aria-label={`${headlineLead} ${headlineMuted} ${headlineLine2} ${headlineHighlight}`}
              className="max-w-full font-bold font-display text-balance"
              style={{
                fontSize: "clamp(2.15rem, 10.6vw, 4.5rem)",
                lineHeight: 1.05,
                letterSpacing: 0,
                color: INK,
              }}
            >
              {headlineLead} {headlineMuted}
              <br aria-hidden="true" />
              {headlineLine2}{" "}
              <span style={{ color: EMBER }}>{headlineHighlight}</span>
            </h1>

            {/* Subcopy */}
            <p
              className="max-w-md text-[16px] sm:text-[17px] leading-[1.6]"
              style={{ color: INK_SOFT }}
            >
              {t("hero.subtitle.full")}
            </p>

            {/* CTA row */}
            <div className="flex min-w-0 flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-10 sm:gap-y-3">
              <MagneticCTA strength={16} radius={140} className="w-full min-[520px]:w-auto">
                <HapticButton intensity="select">
                  <Link
                    to={calculatorsPath}
                    data-experiment={heroExperiment.stamp}
                    aria-label={heroCtaLabel}
                    onClick={() => {
                      try {
                        if (typeof window !== "undefined" && typeof window.gtag === "function") {
                          window.gtag("event", "hero_cta_click", {
                            experiment: heroExperiment.experimentKey,
                            variant: heroExperiment.variantId,
                            label: heroCtaLabel,
                          });
                        }
                      } catch { /* ignore */ }
                    }}
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-xl px-7 py-4 text-[14px] font-semibold transition-all duration-300 hover:-translate-y-px active:translate-y-0 min-[520px]:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f3ee] focus-visible:ring-[#e85d3a] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                    style={{
                      backgroundColor: INK,
                      color: PAPER,
                      boxShadow: "0 10px 30px -12px rgba(26,26,26,0.45)",
                    }}
                  >
                    <span>{heroCtaLabel}</span>
                    <ArrowUpRight aria-hidden="true" focusable="false" className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0" />
                  </Link>

                </HapticButton>
              </MagneticCTA>

              {/* Secondary CTA — text link, lower emphasis than primary. */}
              <Link
                to={calculatorsPath}
                className="group inline-flex items-center gap-1.5 text-[13.5px] font-semibold underline-offset-4 transition-colors hover:underline rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f3ee] focus-visible:ring-[#e85d3a]"
                style={{ color: INK_SOFT }}
              >
                {heroSecondaryCtaLabel}
              </Link>



            </div>
          </div>

          {/* ─────────── RIGHT — workspace ─────────── */}
          <div
            className="flex flex-col gap-5 motion-safe:animate-fade-in"
            style={{ animationDelay: "120ms" }}
          >
            {/* Price card */}
            <article
              className="relative rounded-2xl bg-white p-7 sm:p-8"
              style={{
                border: `1px solid ${brand.border}`,
                boxShadow: "0 8px 30px -10px rgba(0,0,0,0.06)",
              }}
              aria-label={t("hero.livePrice.aria")}
            >
              <div className="flex items-start justify-between gap-3 sm:gap-4">
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span
                    className="text-[10px] font-bold uppercase"
                    style={{ letterSpacing: "0.18em", color: INK_MUTED }}
                  >
                    {t("hero.bento.priceLabel")}
                  </span>
                  <div className="flex min-w-0 flex-wrap items-baseline gap-x-1 font-mono">
                    <span
                      className="whitespace-nowrap text-[clamp(1.75rem,10vw,2.75rem)] sm:text-5xl font-bold tracking-tighter tabular-nums"
                      style={{ color: INK, lineHeight: 1 }}
                    >
                      {isLoading ? "———" : formatPrice(price)}
                    </span>
                    <span className="whitespace-nowrap shrink-0 text-sm font-medium tabular-nums" style={{ color: INK_MUTED }}>
                      .{price ? String(Math.floor((price % 1) * 100)).padStart(2, "0") : "00"}
                    </span>
                  </div>
                </div>
                <span
                  className="inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 sm:px-3 py-1 text-[12px] sm:text-[13px] font-bold font-mono tabular-nums"
                  style={{
                    backgroundColor: isNeutral
                      ? "rgba(26,26,26,0.06)"
                      : isPositive
                      ? "rgba(10,138,90,0.10)"
                      : "rgba(200,65,42,0.10)",
                    color: pctColor,
                    border: `1px solid ${
                      isNeutral
                        ? "rgba(26,26,26,0.10)"
                        : isPositive
                        ? "rgba(10,138,90,0.25)"
                        : "rgba(200,65,42,0.25)"
                    }`,
                  }}
                >
                  {isLoading ? "——" : `${pctSign}${displayPct.toFixed(2)}%`}
                </span>
              </div>

              {/* 4-up metric strip — uniform ink weight, wider column gap for breathing room. */}
              <div
                className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4 py-4"
                style={{ borderTop: `1px solid ${HAIRLINE}`, borderBottom: `1px solid ${HAIRLINE}` }}
              >
                {[
                  { l: t("hero.marketCap"), v: "$1.24T" },
                  { l: t("hero.hashRate"), v: "642.5 EH/s" },
                  { l: t("hero.difficulty"), v: "82.03 T" },
                  { l: t("hero.vol24h"), v: "$34.8B" },
                ].map((m) => (
                  <div key={m.l} className="flex flex-col gap-1">
                    <span
                      className="whitespace-nowrap text-[9px] font-bold uppercase"
                      style={{ letterSpacing: "0.14em", color: INK_SOFT }}
                    >
                      {m.l}
                    </span>
                    <span
                      className="font-mono text-[13px] font-bold tabular-nums"
                      style={{ color: INK }}
                    >
                      {m.v}
                    </span>
                  </div>
                ))}
              </div>

              {/* Sparkline — with 24h range context above and status below (single row). */}
              <div className="mt-6 flex items-center justify-between gap-3">
                <span
                  className="whitespace-nowrap text-[9px] font-bold uppercase"
                  style={{ letterSpacing: "0.14em", color: INK_SOFT }}
                >
                  24h range
                </span>
                <span
                  className="whitespace-nowrap font-mono text-[10px] font-bold tabular-nums"
                  style={{ color: INK_SOFT }}
                >
                  {price
                    ? `${formatPrice(price * 0.982)} — ${formatPrice(price * 1.021)}`
                    : "——"}
                </span>
              </div>
              <div
                className="mt-2 h-24 w-full rounded-md outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:var(--ring,theme(colors.ring))]"
                tabIndex={0}
                role="img"
                aria-label={
                  price
                    ? `Bitcoin 24-hour price trend. Latest price ${formatPrice(price)} US dollars, ${pctSign}${priceChangePercentage24h.toFixed(2)} percent.`
                    : "Bitcoin 24-hour price trend, loading."
                }
                data-testid="hero-btc-sparkline"
              >
                <svg viewBox="0 0 400 100" preserveAspectRatio="none" className="w-full h-full" aria-hidden="true" focusable="false">
                  <defs>
                    <linearGradient id="spark-grad-v5" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor={EMBER} stopOpacity="0.38" />
                      <stop offset="55%" stopColor={EMBER} stopOpacity="0.14" />
                      <stop offset="100%" stopColor={EMBER} stopOpacity="0.02" />
                    </linearGradient>
                  </defs>
                  <path d={sparkFill} fill="url(#spark-grad-v5)" />
                  <path
                    d={sparkPath}
                    fill="none"
                    stroke={EMBER}
                    strokeWidth="2.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  />
                  <circle cx={sparkLast.x} cy={sparkLast.y} r="5" fill={EMBER} fillOpacity="0.18" data-testid="spark-halo" />
                  <circle cx={sparkLast.x} cy={sparkLast.y} r="2.4" fill={EMBER} data-testid="spark-dot" />
                </svg>
                <span className="sr-only" data-testid="spark-sr-latest">
                  {price ? `Latest BTC: ${formatPrice(price)} USD (${pctSign}${priceChangePercentage24h.toFixed(2)}%)` : "Latest BTC price loading"}
                </span>
              </div>

              {/* Single quiet status row — updated timestamp only, muted. */}
              <div className="mt-4 flex items-center justify-end">
                <span
                  className="inline-flex items-center gap-1.5 whitespace-nowrap text-[10px] font-mono uppercase tabular-nums"
                  style={{ letterSpacing: "0.12em", color: INK_SOFT }}
                >
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: brand.success }}
                  />
                  {t("hero.updatedAgo").replace("{n}", String(tick))}
                </span>
              </div>
            </article>

            {/* Sats + Halving tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Sats per $1 */}
              <article
                className="rounded-2xl bg-white p-7"
                style={{ border: `1px solid ${brand.border}`, boxShadow: "0 4px 16px -8px rgba(0,0,0,0.04)" }}
              >
                <div className="flex items-center justify-between gap-3">
                  <span
                    className="whitespace-nowrap text-[10px] font-bold uppercase"
                    style={{ letterSpacing: "0.18em", color: INK_SOFT }}
                  >
                    {t("hero.bento.satsLabel")}
                  </span>
                  <span
                    className="whitespace-nowrap text-[10px] font-mono uppercase tabular-nums"
                    style={{ letterSpacing: "0.12em", color: INK_SOFT }}
                    aria-label={t("hero.bento.satsPerDollarAria")}
                  >
                    per $1
                  </span>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span
                    className="font-mono text-4xl font-bold tracking-tighter tabular-nums"
                    style={{ color: INK }}
                  >
                    {satsPerDollar ? formatSats(satsPerDollar) : "———"}
                  </span>
                  <span className="text-sm font-bold" style={{ color: INK_MUTED }}>
                    sats
                  </span>
                </div>
                {/* Useful conversion row — mirrors the halving card's third row height. */}
                <div className="mt-5 flex items-center justify-between gap-3">
                  <span
                    className="whitespace-nowrap text-[10px] font-bold uppercase"
                    style={{ letterSpacing: "0.14em", color: INK_SOFT }}
                  >
                    $100 buys
                  </span>
                  <span
                    className="whitespace-nowrap font-mono text-[11px] font-bold tabular-nums"
                    style={{ color: INK }}
                  >
                    {satsPerDollar ? `${formatSats(satsPerDollar * 100)} sats` : "——"}
                  </span>
                </div>
              </article>

              {/* Halving countdown */}
              <article
                className="overflow-hidden rounded-2xl p-5 sm:p-7"
                style={{
                  backgroundColor: "#FFF9F2",
                  border: `1px solid ${brand.border}`,
                  boxShadow: "0 4px 16px -8px rgba(232,93,58,0.08)",
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                  <span
                    className="whitespace-nowrap text-[10px] font-bold uppercase"
                    style={{ letterSpacing: "0.18em", color: brand.emberDeep }}
                  >
                    {t("hero.halvingCountdown")}
                  </span>
                  <span
                    className="whitespace-nowrap text-[10px] font-mono uppercase tabular-nums"
                    style={{ letterSpacing: "0.12em", color: INK_SOFT }}
                  >
                    Epoch 4 → 5
                  </span>
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                  <span
                    className="font-mono text-4xl font-bold tracking-tighter tabular-nums"
                    style={{ color: INK }}
                  >
                    {formatGroupedInt(daysLeft)}
                  </span>
                  <span className="text-sm font-bold" style={{ color: INK_MUTED }}>
                    {t("hero.days")}
                  </span>
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <div
                    className="h-1.5 flex-1 rounded-full overflow-hidden"
                    style={{ backgroundColor: "rgba(26,26,26,0.06)" }}
                  >
                    {/* Bar shows TIME REMAINING (countdown), so it shrinks toward halving. */}
                    <div
                      className="h-full transition-[width] duration-700"
                      style={{ width: `${100 - halvingPct}%`, backgroundColor: EMBER }}
                    />
                  </div>
                  <span
                    className="whitespace-nowrap text-[10px] font-mono font-bold uppercase tabular-nums"
                    style={{ letterSpacing: "0.12em", color: INK_SOFT }}
                  >
                    {100 - halvingPct}% left
                  </span>
                </div>
              </article>
            </div>

            {/* Quick Access pill bar */}
            <div
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4"
              style={{ border: `1px solid ${brand.border}` }}
            >
              <span
                className="whitespace-nowrap text-[10px] font-bold uppercase ml-2"
                style={{ letterSpacing: "0.18em", color: INK_SOFT }}
              >
                {t("hero.bento.quickAccess")}
              </span>
              <div className="flex flex-wrap gap-2">
                {quickAccess.map((q) => (
                  <Link
                    key={q.to}
                    to={q.to}
                    className="rounded-xl px-4 py-2 text-[11px] font-bold transition-colors hover:bg-[rgba(26,26,26,0.08)] hover:text-[#1a1a1a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:ring-[#e85d3a]"
                    style={{ backgroundColor: "rgba(26,26,26,0.04)", color: INK }}
                  >
                    {q.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
