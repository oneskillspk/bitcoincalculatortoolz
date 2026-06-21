import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, ShieldCheck, Zap, Users, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "@/components/LocalizedLink";
import { useIntersectionAnimation } from "@/hooks/useIntersectionAnimation";
import { useLiveBitcoinPrice } from "@/hooks/useLiveBitcoinPrice";
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

  const formatSats = (v: number) => new Intl.NumberFormat("en-US").format(v);

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
      role="banner"
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
          background: `radial-gradient(circle, ${EMBER}1A 0%, transparent 60%)`,
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
            {/* Eyebrow pill */}
            <div
              className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 w-fit shadow-sm"
              style={{ border: `1px solid ${EMBER}33` }}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span
                className="text-[10px] font-bold uppercase"
                style={{ letterSpacing: "0.16em", color: INK_SOFT }}
              >
                {t("hero.bento.eyebrow")}
              </span>
            </div>

            {/* Headline — "Calculators" rendered in muted silver tone for editorial contrast. */}
            <h1
              id="hero-title"
              className="max-w-full font-bold font-display text-balance"
              style={{
                fontSize: "clamp(2.15rem, 10.6vw, 4.5rem)",
                lineHeight: 1.05,
                letterSpacing: 0,
                color: INK,
              }}
            >
              {headlineLead}{" "}
              <span style={{ color: "rgba(26,26,26,0.3)" }}>{headlineMuted}</span>
              <br />
              {headlineLine2} {headlineHighlight}
            </h1>

            {/* Subcopy */}
            <p
              className="max-w-md text-[16px] sm:text-[17px] leading-[1.6]"
              style={{ color: INK_SOFT }}
            >
              {t("hero.subtitle.full")}
            </p>

            {/* CTA row */}
            <div className="flex min-w-0 flex-col items-start gap-4 xl:flex-row xl:flex-wrap xl:items-center xl:gap-5">
              <MagneticCTA strength={16} radius={140} className="w-full min-[520px]:w-auto">
                <HapticButton intensity="select">
                  <Link
                    to={calculatorsPath}
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-xl px-7 py-4 text-[14px] font-semibold transition-all duration-300 hover:-translate-y-px active:translate-y-0 min-[520px]:w-auto"
                    style={{
                      backgroundColor: INK,
                      color: PAPER,
                      boxShadow: "0 10px 30px -12px rgba(26,26,26,0.45)",
                    }}
                  >
                    {t("hero.cta.start")}
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </HapticButton>
              </MagneticCTA>

              {/* Trust badge — clean, minimal, inline with CTA */}
              <div
                className="inline-flex items-center gap-3 rounded-full border px-3.5 py-2.5 shadow-sm"
                style={{
                  backgroundColor: PAPER,
                  borderColor: brand.border,
                }}
              >
                {/* Avatar stack — 3 overlapping circles with icons */}
                <div className="flex shrink-0 -space-x-2" aria-hidden="true">
                  <div
                    className="relative flex h-7 w-7 items-center justify-center rounded-full"
                    style={{
                      border: `2px solid ${PAPER}`,
                      backgroundColor: "hsl(var(--surface-warm))",
                    }}
                  >
                    <ShieldCheck className="h-3.5 w-3.5" style={{ color: INK_MUTED }} />
                  </div>
                  <div
                    className="relative flex h-7 w-7 items-center justify-center rounded-full"
                    style={{
                      border: `2px solid ${PAPER}`,
                      backgroundColor: "hsl(var(--hairline) / 0.5)",
                    }}
                  >
                    <Zap className="h-3.5 w-3.5" style={{ color: brand.ember }} />
                  </div>
                  <div
                    className="relative flex h-7 w-7 items-center justify-center rounded-full text-[9px] font-bold"
                    style={{
                      border: `2px solid ${PAPER}`,
                      backgroundColor: INK,
                      color: PAPER,
                    }}
                  >
                    <Users className="h-3.5 w-3.5" style={{ color: PAPER }} />
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden h-4 w-px sm:block" style={{ backgroundColor: brand.border }} />

                {/* Text */}
                <span
                  className="text-[11px] font-semibold tracking-tight sm:text-xs"
                  style={{ color: INK_SOFT }}
                >
                  {t("hero.trustedBy")}
                </span>
              </div>
            </div>
          </div>

          {/* ─────────── RIGHT — workspace ─────────── */}
          <div
            className="flex flex-col gap-5 motion-safe:animate-fade-in"
            style={{ animationDelay: "120ms" }}
          >
            {/* Price card */}
            <article
              className="relative rounded-[2rem] bg-white p-7 sm:p-8"
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

              {/* 4-up metric strip */}
              <div
                className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 py-4"
                style={{ borderTop: `1px solid ${HAIRLINE}`, borderBottom: `1px solid ${HAIRLINE}` }}
              >
                {[
                  { l: t("hero.marketCap"), v: "$1.24T", accent: false },
                  { l: t("hero.hashRate"), v: "642.5 EH/s", accent: true },
                  { l: t("hero.difficulty"), v: "82.03 T", accent: false },
                  { l: t("hero.vol24h"), v: "$34.8B", accent: false },
                ].map((m) => (
                  <div key={m.l} className="flex flex-col gap-1">
                    <span
                      className="text-[9px] font-bold uppercase"
                      style={{ letterSpacing: "0.08em", color: INK_MUTED }}
                    >
                      {m.l}
                    </span>
                    <span
                      className="font-mono text-[13px] font-bold tabular-nums"
                      style={{ color: m.accent ? brand.success : INK }}
                    >
                      {m.v}
                    </span>
                  </div>
                ))}
              </div>

              {/* Sparkline */}
              <div className="mt-6 h-24 w-full">
                <svg viewBox="0 0 400 100" preserveAspectRatio="none" className="w-full h-full">
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
                </svg>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span
                  className="text-[10px] font-bold uppercase"
                  style={{ letterSpacing: "0.16em", color: INK_MUTED }}
                >
                  {t("hero.networkHealthy")}
                </span>
                <span
                  className="text-[10px] font-bold font-mono tabular-nums"
                  style={{ color: brand.success }}
                >
                  {t("hero.updatedAgo").replace("{n}", String(tick))}
                </span>
              </div>
            </article>

            {/* Sats + Halving tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Sats per $1 */}
              <article
                className="rounded-[2rem] bg-white p-7"
                style={{ border: `1px solid ${brand.border}`, boxShadow: "0 4px 16px -8px rgba(0,0,0,0.04)" }}
              >
                <span
                  className="text-[10px] font-bold uppercase"
                  style={{ letterSpacing: "0.18em", color: INK_MUTED }}
                >
                  {t("hero.bento.satsLabel")}
                </span>
                <div className="mt-4 flex items-baseline gap-2">
                  <span
                    className="font-mono text-4xl font-bold tracking-tighter tabular-nums"
                    style={{ color: INK }}
                  >
                    {satsPerDollar ? formatSats(satsPerDollar) : "———"}
                  </span>
                  <span
                    className="text-[10px] font-bold uppercase px-2 py-0.5 rounded"
                    style={{
                      letterSpacing: "0.12em",
                      color: EMBER,
                      backgroundColor: `${EMBER}1A`,
                    }}
                  >
                    {t("hero.tickDown")}
                  </span>
                </div>
                <div
                  className="mt-5 h-1 w-full overflow-hidden rounded-full"
                  style={{ backgroundColor: "rgba(26,26,26,0.06)" }}
                >
                  <div className="h-full w-2/3" style={{ backgroundColor: "rgba(10,138,90,0.3)" }} />
                </div>
              </article>

              {/* Halving countdown */}
              <article
                className="rounded-[2rem] p-7"
                style={{
                  backgroundColor: "#FFF9F2",
                  border: `1px solid ${brand.border}`,
                  boxShadow: "0 4px 16px -8px rgba(232,93,58,0.08)",
                }}
              >
                <span
                  className="text-[10px] font-bold uppercase"
                  style={{ letterSpacing: "0.18em", color: EMBER }}
                >
                  {t("hero.halvingCountdown")}
                </span>
                <div className="mt-4 flex items-baseline gap-2">
                  <span
                    className="font-mono text-4xl font-bold tracking-tighter tabular-nums"
                    style={{ color: INK }}
                  >
                    {daysLeft.toLocaleString()}
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
                    className="font-mono text-[10px] font-bold tabular-nums uppercase tracking-wider"
                    style={{ color: INK_MUTED }}
                  >
                    {100 - halvingPct}% left
                  </span>
                </div>
              </article>
            </div>

            {/* Quick Access pill bar */}
            <div
              className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white p-4"
              style={{ border: `1px solid ${brand.border}` }}
            >
              <span
                className="text-[9px] font-bold uppercase ml-2"
                style={{ letterSpacing: "0.2em", color: INK_MUTED }}
              >
                {t("hero.bento.quickAccess")}
              </span>
              <div className="flex flex-wrap gap-2">
                {quickAccess.map((q) => (
                  <Link
                    key={q.to}
                    to={q.to}
                    className="rounded-xl px-4 py-2 text-[11px] font-bold transition-colors hover:bg-[rgba(26,26,26,0.08)]"
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
