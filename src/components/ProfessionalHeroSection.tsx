import { useEffect, useMemo, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "@/components/LocalizedLink";
import { useIntersectionAnimation } from "@/hooks/useIntersectionAnimation";
import { useLiveBitcoinPrice } from "@/hooks/useLiveBitcoinPrice";
import { brand } from "@/lib/brandColors";

/* ─────────────────────────────────────────────────────────────────────
 *  Magazine-Asymmetric Bento Hero
 *  Paper & Ink palette · Sora display · Manrope body
 *  Brand colors sourced from src/lib/brandColors.ts (mirrors index.css tokens).
 * ───────────────────────────────────────────────────────────────────── */

const PAPER = brand.paper;
const SURFACE = brand.surfaceWarm;
const INK = brand.ink;
const INK_SOFT = brand.inkSoft;
const INK_MUTED = brand.inkMuted;
const HAIRLINE = brand.inkFaint;
const EMBER = brand.ember;

// Deterministic sparkline bar heights — fills the chart card without flicker.
const SPARK = [38, 46, 41, 58, 64, 52, 71, 63, 78, 82, 74, 90];

export const ProfessionalHeroSection = () => {
  const { t, language } = useLanguage();
  const { ref, isVisible } = useIntersectionAnimation({ threshold: 0.1 });
  const { price, priceChangePercentage24h, isLoading } = useLiveBitcoinPrice("USD");

  // Subtle mouse-parallax — writes --px / --py (-1..1) to the section.
  // Disabled on touch + reduced-motion. rAF-throttled.
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


  const isTurkish = language === "tr";
  const calculatorsPath = isTurkish ? "/tr/hesaplayicilar" : "/calculators";
  const dcaPath = isTurkish
    ? "/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi"
    : "/calculators/dca";
  const profitPath = isTurkish
    ? "/tr/hesaplayicilar/bitcoin-kar-zarar-hesaplayicisi"
    : "/calculators/profit-loss";
  const halvingPath = isTurkish
    ? "/tr/hesaplayicilar/bitcoin-yarilama"
    : "/calculators/halving-countdown";
  const retirementPath = isTurkish
    ? "/tr/hesaplayicilar/bitcoin-emeklilik-hesaplayicisi"
    : "/calculators/retirement";
  const converterPath = isTurkish
    ? "/tr/hesaplayicilar/bitcoin-donusturucu"
    : "/calculators/bitcoin-converter";

  const displayPct =
    Math.abs(priceChangePercentage24h) < 0.05 ? 0 : priceChangePercentage24h;
  const isPositive = displayPct > 0;
  const isNeutral = displayPct === 0;

  const formatPrice = (v: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(v);

  const satsPerDollar = useMemo(() => {
    if (!price || price <= 0) return null;
    return Math.round(100_000_000 / price);
  }, [price]);

  const formatSats = (v: number) =>
    new Intl.NumberFormat("en-US").format(v);

  const pctColor = isNeutral
    ? INK_MUTED
    : isPositive
    ? brand.success
    : brand.danger;
  const pctSign = isNeutral ? "" : isPositive ? "+" : "";

  const tools = [
    { label: t("hero.bento.tool.dca"),        to: dcaPath,        tag: "Tracker" },
    { label: t("hero.bento.tool.profit"),     to: profitPath,     tag: "Calc"    },
    { label: t("hero.bento.tool.halving"),    to: halvingPath,    tag: "Live"    },
    { label: t("hero.bento.tool.retirement"), to: retirementPath, tag: "Plan"    },
    { label: t("hero.bento.tool.converter"),  to: converterPath,  tag: "Tool"    },
  ];

  return (
    <section
      ref={setSectionRef}
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: PAPER, color: INK, fontFamily: "'Manrope', system-ui, sans-serif" }}
      role="banner"
      aria-labelledby="hero-title"
    >
      {/* faint paper grain via radial dots — extremely subtle */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(26,26,26,0.045) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* cinematic SVG grain — ultra subtle, premium photographic feel */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: "160px 160px",
        }}
      />
      {/* ambient ember glow — upper-left, behind hero tile (parallax) */}
      <div
        aria-hidden
        className="absolute pointer-events-none ambient-drift"
        style={{
          left: "-6%",
          top: "8%",
          width: "38rem",
          height: "38rem",
          background:
            "radial-gradient(ellipse at center, rgba(232,93,58,0.07) 0%, transparent 60%)",
          filter: "blur(20px)",
          transform:
            "translate3d(calc(var(--px, 0) * 14px), calc(var(--py, 0) * 10px), 0)",
          transition: "transform 600ms cubic-bezier(0.22, 1, 0.36, 1)",
          willChange: "transform",
        }}
      />
      {/* warm ember halo, far bottom-right (parallax, inverse) */}
      <div
        aria-hidden
        className="absolute pointer-events-none rounded-full"
        style={{
          right: "-12%",
          bottom: "-18%",
          width: "44rem",
          height: "44rem",
          background:
            "radial-gradient(circle, rgba(232,93,58,0.10) 0%, transparent 65%)",
          filter: "blur(40px)",
          transform:
            "translate3d(calc(var(--px, 0) * -18px), calc(var(--py, 0) * -12px), 0)",
          transition: "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
          willChange: "transform",
        }}
      />
      {/* cool ink wash, bottom-right balance (parallax, mid) */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          right: "5%",
          bottom: "12%",
          width: "30rem",
          height: "30rem",
          background:
            "radial-gradient(ellipse at center, rgba(26,26,26,0.04) 0%, transparent 65%)",
          filter: "blur(30px)",
          transform:
            "translate3d(calc(var(--px, 0) * 8px), calc(var(--py, 0) * 6px), 0)",
          transition: "transform 800ms cubic-bezier(0.22, 1, 0.36, 1)",
          willChange: "transform",
        }}
      />
      {/* Header → hero gradient bridge — top edge fades from page bg into paper */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-20 sm:h-28 pointer-events-none z-[1]"
        style={{
          background:
            "linear-gradient(180deg, hsl(var(--background)) 0%, rgba(245,243,238,0.6) 55%, transparent 100%)",
        }}
      />


      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12 pt-20 sm:pt-28 lg:pt-32 pb-14 lg:pb-20">
        {/* ── 12-col bento ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 lg:gap-5 auto-rows-auto">

          {/* ══ HERO TILE — headline + CTA ══ */}
          <article
            className={`relative lg:col-span-7 lg:row-span-2 flex flex-col justify-between rounded-2xl p-7 sm:p-10 lg:p-14 ${
              isVisible ? "motion-safe:animate-fade-in" : "opacity-0"
            }`}
            style={{
              backgroundColor: brand.paperSoft,
              border: `1px solid ${HAIRLINE}`,
              animationDelay: "0ms",
            }}
          >
            {/* (Removed decorative ember pulse — the eyebrow dot already signals liveness) */}

            <div>
              {/* Eyebrow */}
              <div className="flex items-center gap-2.5 mb-8 sm:mb-10">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inset-0 rounded-full bg-success/$3 animate-ping" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                <span
                  className="text-[10.5px] font-semibold uppercase"
                  style={{ letterSpacing: "0.18em", color: INK_SOFT }}
                >
                  {t("hero.bento.eyebrow")}
                </span>
              </div>


              {/* Headline — editorial restraint, ember reserved for data not decoration */}
              <h1
                id="hero-title"
                className="text-balance font-bold font-display"
                style={{
                  fontSize: "clamp(2rem, 4.6vw, 3.75rem)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                  color: INK,
                }}
              >
                {t("hero.title.line1")}
                <br />
                {t("hero.title.line2")}{" "}
                <span
                  className="relative inline-block"
                  style={{
                    color: INK,
                    backgroundImage: `linear-gradient(${EMBER}, ${EMBER})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "100% 2px",
                    backgroundPosition: "0 100%",
                    paddingBottom: "0.04em",
                  }}
                >
                  {t("hero.title.highlight")}
                </span>
              </h1>

              {/* Subtitle */}
              <p
                className="mt-6 sm:mt-8 max-w-[46ch] text-[15px] sm:text-[16.5px] leading-[1.6]"
                style={{ color: INK_SOFT }}
              >
                {t("hero.subtitle.full")}
              </p>
            </div>

            {/* CTA cluster — primary in ink, ember reserved for live data */}
            <div className="mt-10 sm:mt-14 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6">
              <Link
                to={calculatorsPath}
                className="group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[14.5px] font-semibold transition-all duration-300 ease-out hover:-translate-y-px active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{
                  backgroundColor: INK,
                  color: PAPER,
                  letterSpacing: "-0.005em",
                  boxShadow: "0 6px 24px -12px rgba(26,26,26,0.35)",
                  // @ts-ignore
                  "--tw-ring-color": INK,
                  // @ts-ignore
                  "--tw-ring-offset-color": SURFACE,
                }}
              >
                {t("hero.cta.start")}
                <ArrowUpRight className="w-[16px] h-[16px] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <span className="text-[12px]" style={{ color: INK_MUTED, letterSpacing: "0.02em" }}>
                {t("hero.trust.free")} · {t("hero.cta.disclaimer")}
              </span>
            </div>
          </article>

          {/* ══ LIVE PRICE + SPARKLINE ══ */}
          <article
            className={`lg:col-span-5 relative flex flex-col rounded-2xl p-6 sm:p-8 lg:p-9 overflow-hidden transition-shadow duration-500 ${
              isVisible ? "motion-safe:animate-fade-in" : "opacity-0"
            }`}
            style={{
              backgroundColor: brand.paperSoft,
              border: `1px solid ${HAIRLINE}`,
              boxShadow:
                "0 1px 0 rgba(255,255,255,0.6) inset, 0 6px 24px -12px rgba(26,26,26,0.08)",
              animationDelay: "90ms",
            }}
            aria-label={t("hero.livePrice.aria")}
          >
            {/* LIVE dot — top-left corner for at-a-glance liveness */}
            <span className="absolute top-5 left-5 sm:top-6 sm:left-6 inline-flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 rounded-full bg-success/$3 animate-ping" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              <span
                className="text-[9.5px] font-bold uppercase"
                style={{ letterSpacing: "0.2em", color: INK_MUTED }}
              >
                {t("hero.liveBtc")}
              </span>
            </span>
            <div className="mt-4 sm:mt-5 flex justify-between items-start gap-4">
              <div>
                <p
                  className="text-[10.5px] font-bold uppercase mb-2"
                  style={{ letterSpacing: "0.18em", color: INK_MUTED }}
                >
                  {t("hero.bento.priceLabel")}
                </p>
                <p
                  className="font-extrabold tabular-nums"
                  style={{
                    fontSize: "clamp(1.85rem, 3.4vw, 2.6rem)",
                    letterSpacing: "-0.035em",
                    color: INK,
                    lineHeight: 1,
                  }}
                >
                  {isLoading ? "———" : formatPrice(price)}
                </p>
              </div>
              <span
                className="shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-[11.5px] font-bold tabular-nums"
                style={{
                  backgroundColor: isNeutral
                    ? "rgba(26,26,26,0.06)"
                    : isPositive
                    ? "rgba(10,138,90,0.12)"
                    : "rgba(200,65,42,0.12)",
                  color: pctColor,
                }}
              >
                {isLoading ? "——" : `${pctSign}${displayPct.toFixed(2)}%`}
              </span>
            </div>

            {/* Sparkline — luxury fintech line with soft ember fill */}
            <div className="mt-8 relative h-24 sm:h-28 w-full">
              <svg
                viewBox="0 0 100 40"
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full overflow-visible"
                aria-hidden
              >
                <defs>
                  <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={EMBER} stopOpacity="0.08" />
                    <stop offset="100%" stopColor={EMBER} stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* filled area */}
                <path
                  d={`M 0,${40 - (SPARK[0] * 0.36)} ${SPARK.map((h, i) =>
                    `L ${(i / (SPARK.length - 1)) * 100},${40 - h * 0.36}`
                  ).join(" ")} L 100,40 L 0,40 Z`}
                  fill="url(#spark-fill)"
                />
                {/* hairline stroke — 1px ember, traces itself in on mount */}
                <path
                  className="spark-draw-in"
                  d={`M 0,${40 - (SPARK[0] * 0.36)} ${SPARK.map((h, i) =>
                    `L ${(i / (SPARK.length - 1)) * 100},${40 - h * 0.36}`
                  ).join(" ")}`}
                  fill="none"
                  stroke={EMBER}
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  pathLength={220}
                />
                {/* end-point — small, fades in after the line completes */}
                <circle
                  className="spark-endpoint"
                  cx="100" cy={40 - SPARK[SPARK.length - 1] * 0.36}
                  r="1.4" fill={EMBER}
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>

            <p
              className="mt-3 text-[10.5px] font-bold uppercase"
              style={{ letterSpacing: "0.16em", color: INK_MUTED }}
            >
              {t("hero.bento.chart24h")}
            </p>
          </article>

          {/* ══ SATS COUNTER ══ */}
          <article
            className={`lg:col-span-2 flex flex-col justify-between rounded-2xl p-6 ${
              isVisible ? "motion-safe:animate-fade-in" : "opacity-0"
            }`}
            style={{
              backgroundColor: brand.paperSoft,
              border: `1px solid ${HAIRLINE}`,
              animationDelay: "180ms",
              minHeight: "150px",
            }}
          >
            <p
              className="text-[10.5px] font-bold uppercase"
              style={{ letterSpacing: "0.16em", color: INK_MUTED }}
            >
              {t("hero.bento.satsLabel")}
            </p>
            <div>
              <p
                className="font-extrabold tabular-nums"
                style={{
                  fontSize: "clamp(1.6rem, 2.4vw, 2rem)",
                  letterSpacing: "-0.035em",
                  color: INK,
                  lineHeight: 1,
                }}
              >
                {satsPerDollar ? formatSats(satsPerDollar) : "———"}
              </p>
              <p
                className="mt-1.5 text-[10.5px] font-semibold uppercase"
                style={{ letterSpacing: "0.12em", color: INK_MUTED }}
              >
                {t("hero.bento.satsCaption")}
              </p>
            </div>
          </article>

          {/* ══ QUICK ACCESS LIST — editorial index ══ */}
          <article
            className={`lg:col-span-3 relative flex flex-col rounded-2xl p-6 overflow-hidden ${
              isVisible ? "motion-safe:animate-fade-in" : "opacity-0"
            }`}
            style={{
              backgroundColor: brand.paperSoft,
              border: `1px solid ${HAIRLINE}`,
              animationDelay: "240ms",
              minHeight: "150px",
              boxShadow: "0 1px 0 rgba(255,255,255,0.6) inset, 0 6px 24px -12px rgba(26,26,26,0.08)",
            }}
          >
            {/* eyebrow with rule + index marker */}
            <div className="flex items-center gap-2.5 mb-5">
              <span
                className="text-[10px] font-bold uppercase"
                style={{ letterSpacing: "0.22em", color: EMBER }}
              >
                ◆
              </span>
              <span
                className="text-[10.5px] font-bold uppercase"
                style={{ letterSpacing: "0.18em", color: INK }}
              >
                {t("hero.bento.quickAccess")}
              </span>
              <span
                className="flex-1 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(26,26,26,0.18), transparent)",
                }}
              />
            </div>

            <ul className="flex flex-col">
              {tools.map((tool, i) => (
                <li
                  key={tool.to}
                  className="border-t"
                  style={{
                    borderColor: i === 0 ? "transparent" : "rgba(26,26,26,0.08)",
                    animationDelay: `${300 + i * 60}ms`,
                  }}
                >
                  <Link
                    to={tool.to}
                    className="group relative flex items-center gap-3 py-3 pl-3 -ml-3 transition-all"
                    style={{ color: INK }}
                  >
                    {/* ember leading bar — grows on hover */}
                    <span
                      aria-hidden
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-0 rounded-full transition-all duration-300 ease-out group-hover:h-[60%]"
                      style={{ backgroundColor: EMBER }}
                    />

                    {/* index number */}
                    <span
                      className="font-mono text-[10px] tabular-nums transition-colors group-hover:text-[hsl(var(--ember))]"
                      style={{ color: INK_MUTED, letterSpacing: "0.05em" }}
                    >
                      0{i + 1}
                    </span>

                    <span
                      className="flex-1 text-[14px] font-semibold tracking-tight transition-all group-hover:translate-x-0.5 group-hover:text-[hsl(var(--ember))]"
                      style={{ }}
                    >
                      {tool.label}
                    </span>

                    {/* category micro-tag — fades out on hover so arrow takes over */}
                    <span
                      className="hidden sm:inline text-[9.5px] font-semibold uppercase transition-opacity duration-300 group-hover:opacity-0"
                      style={{ letterSpacing: "0.18em", color: INK_MUTED }}
                    >
                      {tool.tag}
                    </span>

                    <ArrowUpRight
                      className="absolute right-0 w-[16px] h-[16px] -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                      style={{ color: EMBER }}
                    />
                  </Link>
                </li>
              ))}
            </ul>

          </article>

          {/* ══ TRUST / SOCIAL PROOF — extended editorial dark band ══ */}
          <article
            className={`lg:col-span-12 relative rounded-2xl overflow-hidden group ${
              isVisible ? "motion-safe:animate-fade-in" : "opacity-0"
            }`}
            style={{
              background: 'var(--ink-gradient)',
              color: PAPER,
              animationDelay: "300ms",
              boxShadow:
                "0 1px 0 rgba(255,255,255,0.06) inset, 0 12px 40px -16px rgba(0,0,0,0.35)",
            }}
          >
            {/* ambient ember glow — left */}
            <div
              aria-hidden
              className="absolute -top-24 -left-16 w-72 h-72 rounded-full opacity-25 blur-3xl pointer-events-none"
              style={{ background: `radial-gradient(circle, ${EMBER} 0%, transparent 70%)` }}
            />
            {/* ambient ember glow — right */}
            <div
              aria-hidden
              className="absolute -bottom-28 -right-20 w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none"
              style={{ background: `radial-gradient(circle, ${EMBER} 0%, transparent 70%)` }}
            />
            {/* fine grid texture */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.05] pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(245,243,238,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(245,243,238,0.6) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />

            <div className="relative p-7 sm:p-9 lg:p-10 flex flex-col lg:flex-row lg:items-center gap-7 lg:gap-10">
              {/* LEFT — eyebrow + headline + sub */}
              <div className="flex-1 min-w-0 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className="text-[10px] font-bold uppercase whitespace-nowrap"
                    style={{ letterSpacing: "0.22em", color: EMBER }}
                  >
                    ◆ Trusted
                  </span>
                  <span
                    className="flex-1 h-px"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(232,93,58,0.5), rgba(245,243,238,0.06))",
                    }}
                  />
                </div>

                <p
                  className="text-balance font-bold text-[22px] sm:text-[26px] lg:text-[30px] leading-[1.1] tracking-tight max-w-[28ch]"
                  style={{ }}
                >
                  {t("hero.bento.trusted")}
                </p>

                <div className="flex flex-col gap-1.5 max-w-[52ch]">
                  <span
                    className="text-[9.5px] font-bold uppercase"
                    style={{ letterSpacing: "0.18em", color: "rgba(245,243,238,0.4)" }}
                  >
                    Methodology
                  </span>
                  <p
                    className="text-[12.5px] leading-relaxed"
                    style={{ color: "rgba(245,243,238,0.55)" }}
                  >
                    {t("hero.bento.trustedSub")}
                  </p>
                </div>
              </div>

              {/* DIVIDER — vertical on lg, hidden below */}
              <span
                aria-hidden
                className="hidden lg:block w-px self-stretch"
                style={{
                  background:
                    "linear-gradient(180deg, transparent, rgba(245,243,238,0.12), transparent)",
                }}
              />

              {/* RIGHT — chips + micro-stats arranged for the wide canvas */}
              <div className="lg:w-[44%] flex flex-col gap-5">
                <div className="flex flex-wrap gap-2 items-center">
                  {/* Dominant chip — 100% Free */}
                  <span
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[11.5px] font-bold uppercase transition-colors"
                    style={{
                      letterSpacing: "0.12em",
                      color: PAPER,
                      backgroundColor: "rgba(232,93,58,0.14)",
                      border: `1px solid rgba(232,93,58,0.5)`,
                      boxShadow: "0 0 24px -8px rgba(232,93,58,0.4)",
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: EMBER, boxShadow: `0 0 10px ${EMBER}` }}
                    />
                    {t("hero.trust.free")}
                  </span>
                  {/* Quiet chips */}
                  {[t("hero.trust.noSignup"), t("hero.trust.realTimeShort")].map((label) => (
                    <span
                      key={label}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-[10.5px] font-semibold uppercase transition-colors hover:bg-[rgba(245,243,238,0.08)]"
                      style={{
                        letterSpacing: "0.1em",
                        color: "rgba(245,243,238,0.75)",
                        backgroundColor: "rgba(245,243,238,0.04)",
                        border: "1px solid rgba(245,243,238,0.1)",
                      }}
                    >
                      <span
                        className="w-1 h-1 rounded-full"
                        style={{ backgroundColor: "rgba(245,243,238,0.5)" }}
                      />
                      {label}
                    </span>
                  ))}
                </div>

                {/* micro-stats row */}
                <div className="flex items-center gap-5">
                  <div className="flex flex-col">
                    <span
                      className="font-bold tabular-nums text-[18px]"
                      style={{ color: PAPER }}
                    >
                      45+
                    </span>
                    <span
                      className="text-[9.5px] font-semibold uppercase mt-0.5"
                      style={{ letterSpacing: "0.16em", color: "rgba(245,243,238,0.4)" }}
                    >
                      Calculators
                    </span>
                  </div>
                  <span className="w-px h-8" style={{ background: "rgba(245,243,238,0.12)" }} />
                  <div className="flex flex-col">
                    <span
                      className="font-bold tabular-nums text-[18px]"
                      style={{ color: PAPER }}
                    >
                      30<span className="text-[12px]" style={{ color: "rgba(245,243,238,0.55)" }}>s</span>
                    </span>
                    <span
                      className="text-[9.5px] font-semibold uppercase mt-0.5"
                      style={{ letterSpacing: "0.16em", color: "rgba(245,243,238,0.4)" }}
                    >
                      Refresh
                    </span>
                  </div>
                  <span className="w-px h-8" style={{ background: "rgba(245,243,238,0.12)" }} />
                  <div className="flex flex-col">
                    <span
                      className="font-bold tabular-nums text-[18px]"
                      style={{ color: PAPER }}
                    >
                      0<span className="text-[12px]" style={{ color: "rgba(245,243,238,0.55)" }}>%</span>
                    </span>
                    <span
                      className="text-[9.5px] font-semibold uppercase mt-0.5"
                      style={{ letterSpacing: "0.16em", color: "rgba(245,243,238,0.4)" }}
                    >
                      Tracking
                    </span>
                  </div>
                </div>
              </div>
            </div>


            {/* corner accent rule */}
            <div
              aria-hidden
              className="absolute top-0 right-0 h-full w-[3px]"
              style={{
                background: `linear-gradient(180deg, ${EMBER} 0%, transparent 100%)`,
              }}
            />
          </article>
        </div>
      </div>
    </section>
  );
};
