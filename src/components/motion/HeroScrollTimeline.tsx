import { useEffect, useRef, useState, type ComponentType, type SVGProps } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from '@/components/LocalizedLink';
import { brand } from '@/lib/brandColors';
import { Calculator, Activity, ShieldCheck, Zap } from 'lucide-react';

/**
 * Scroll-synced timeline that reveals value props + stats below the hero.
 * Uses a sticky stage and a tall scroll runway. Each beat ranges 0..1
 * within the section's scroll progress.
 *
 * - Reduced-motion / low-perf: collapses to a single static grid (no pinning).
 * - Mobile (<768): no pin; sequential plain reveal.
 */

type LucideIcon = ComponentType<SVGProps<SVGSVGElement>>;

interface Beat {
  k: string;
  eyebrow: string;
  title: string;
  metric: string;
  unit?: string;
  body: string;
  Icon: LucideIcon;
}

const HERO_BEATS_EN: Beat[] = [
  {
    k: 'free',
    eyebrow: '01 / TOOLS',
    title: '49+ calculators, zero cost.',
    metric: '49',
    unit: '+ tools',
    body: 'DCA, profit, retirement, tax, mining, power-law and more — every tool free forever.',
  },
  {
    k: 'live',
    eyebrow: '02 / DATA',
    title: 'Live prices, real history.',
    metric: '30s',
    unit: ' refresh',
    body: 'BTC price refreshes every 30 seconds. Historical daily closes back to 2013.',
  },
  {
    k: 'priv',
    eyebrow: '03 / PRIVACY',
    title: 'Runs in your browser.',
    metric: '0',
    unit: ' accounts',
    body: 'No signup, no email, no tracking. Calculations never leave your device.',
  },
  {
    k: 'speed',
    eyebrow: '04 / SPEED',
    title: 'Sub-second answers.',
    metric: '<1s',
    unit: ' results',
    body: 'Optimized math, lazy-loaded charts, instant results on any device.',
  },
];

const HERO_BEATS_TR: Beat[] = [
  {
    k: 'free',
    eyebrow: '01 / ARAÇLAR',
    title: '49+ hesaplayıcı, tamamen ücretsiz.',
    metric: '49',
    unit: '+ araç',
    body: 'DCA, kâr/zarar, emeklilik, vergi, madencilik ve daha fazlası — sonsuza dek ücretsiz.',
  },
  {
    k: 'live',
    eyebrow: '02 / VERİ',
    title: 'Canlı fiyat, gerçek geçmiş.',
    metric: '30s',
    unit: ' tazeleme',
    body: 'BTC fiyatı 30 saniyede bir güncellenir. 2013’ten beri günlük kapanışlar.',
  },
  {
    k: 'priv',
    eyebrow: '03 / GİZLİLİK',
    title: 'Hesaplamalar tarayıcınızda.',
    metric: '0',
    unit: ' hesap',
    body: 'Kayıt yok, e-posta yok, takip yok. Verileriniz cihazınızdan çıkmaz.',
  },
  {
    k: 'speed',
    eyebrow: '04 / HIZ',
    title: 'Saniye altı sonuçlar.',
    metric: '<1s',
    unit: ' sonuç',
    body: 'Optimize matematik, tembel grafikler, her cihazda anında sonuç.',
  },
];

export const HeroScrollTimeline = () => {
  const { language } = useLanguage();
  const beats = language === 'tr' ? HERO_BEATS_TR : HERO_BEATS_EN;
  const path = language === 'tr' ? '/tr/hesaplayicilar' : '/calculators';
  const ctaLabel = language === 'tr' ? 'Tüm araçları keşfet' : 'Explore all tools';

  const sectionRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [enableScroll, setEnableScroll] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const lowPerf = document.documentElement.getAttribute('data-perf') === 'low';
    setEnableScroll(!reduced && !isMobile && !lowPerf);
  }, []);

  useEffect(() => {
    if (!enableScroll) return;
    const el = sectionRef.current;
    if (!el) return;
    let raf = 0;
    const compute = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const total = rect.height - vh;
      if (total <= 0) return;
      const traveled = -rect.top;
      const p = Math.max(0, Math.min(1, traveled / total));
      setProgress(p);
    };
    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(compute);
    };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enableScroll]);

  const active = Math.min(beats.length - 1, Math.floor(progress * beats.length * 0.999));
  const localProgress = (progress * beats.length) % 1;
  const railWidth = ((active + localProgress) / beats.length) * 100;
  // Runway: 100vh sticky stage + 35vh per beat. Keeps each beat readable while
  // avoiding a tall trailing blank band after the final beat finishes.
  const runwayVh = 100 + beats.length * 35;

  return (
    <section
      ref={sectionRef}
      aria-label={language === 'tr' ? 'Öne çıkanlar zaman çizelgesi' : 'Hero value timeline'}
      className="relative w-full"
      style={{
        backgroundColor: brand.paper,
        color: brand.ink,
        minHeight: enableScroll ? `${runwayVh}vh` : 'auto',
      }}
      data-hero-timeline
    >
      <div
        className={
          enableScroll
            ? 'sticky top-0 h-screen flex flex-col justify-center overflow-hidden'
            : 'py-10 sm:py-20'
        }
      >
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          {/* Terminal strip */}
          <div className="mb-10 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.18em]" style={{ color: brand.inkMuted }}>
            <div className="flex items-center gap-2">
              <span className="ip-anim-breathe inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: brand.ember }} />
              <span>TIMELINE · HERO</span>
            </div>
            <span className="font-mono tabular-nums">
              {String(active + 1).padStart(2, '0')} / {String(beats.length).padStart(2, '0')}
            </span>
          </div>

          {enableScroll ? (
            // Scroll-pinned cinematic stage — desktop, full-perf
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              {/* Big metric */}
              <div className="lg:col-span-5">
                <div className="relative h-[260px] sm:h-[300px]">
                  {beats.map((b, i) => {
                    const isActive = i === active;
                    const dist = i - active - localProgress;
                    return (
                      <div
                        key={b.k}
                        className="absolute inset-0 flex flex-col justify-center"
                        style={{
                          opacity: isActive
                            ? (i === beats.length - 1 ? 1 : 1 - localProgress * 0.4)
                            : Math.max(0, 1 - Math.abs(dist) * 2),
                          transform: `translate3d(0, ${dist * 30}px, 0)`,
                          transition: 'opacity 400ms cubic-bezier(0.22,1,0.36,1)',
                        }}
                        aria-hidden={!isActive}
                      >
                        <span
                          className="font-mono text-[11px] uppercase tracking-[0.2em] mb-3"
                          style={{ color: brand.ember }}
                        >
                          {b.eyebrow}
                        </span>
                        <div className="flex items-baseline gap-2 font-display font-bold">
                          <span
                            className="tabular-nums"
                            style={{
                              fontSize: 'clamp(4rem, 12vw, 9rem)',
                              lineHeight: 0.9,
                              letterSpacing: '-0.04em',
                              color: brand.ink,
                            }}
                          >
                            {b.metric}
                          </span>
                          {b.unit && (
                            <span
                              className="font-mono text-xl sm:text-2xl"
                              style={{ color: brand.inkMuted }}
                            >
                              {b.unit}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Stacked beats */}
              <div className="lg:col-span-7">
                <ol className="space-y-1">
                  {beats.map((b, i) => {
                    const isActive = i === active;
                    return (
                      <li
                        key={b.k}
                        className="grid grid-cols-[auto_1fr] gap-5 py-5 border-t"
                        style={{
                          borderColor: brand.border,
                          opacity: isActive ? 1 : 0.45,
                          transition: 'opacity 380ms cubic-bezier(0.22,1,0.36,1)',
                        }}
                      >
                        <span
                          className="font-mono text-[11px] tabular-nums pt-1"
                          style={{ color: isActive ? brand.ember : brand.inkMuted }}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <h2
                            className="font-display font-bold text-xl sm:text-2xl mb-2"
                            style={{
                              color: brand.ink,
                              letterSpacing: '-0.015em',
                            }}
                          >
                            {b.title}
                          </h2>
                          <p
                            className="text-sm sm:text-[15px] leading-relaxed max-w-xl"
                            style={{ color: brand.inkSoft }}
                          >
                            {b.body}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ol>

                <div className="mt-8 flex items-center gap-4">
                  <Link
                    to={path}
                    className="haptic-host inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-transform hover:-translate-y-px"
                    style={{
                      backgroundColor: brand.ink,
                      color: brand.paper,
                      boxShadow: '0 10px 30px -12px rgba(26,26,26,0.45)',
                    }}
                  >
                    {ctaLabel}
                    <span aria-hidden>→</span>
                  </Link>
                  <div
                    className="flex-1 h-px relative overflow-hidden"
                    style={{ backgroundColor: brand.border }}
                  >
                    <div
                      className="absolute inset-y-0 left-0"
                      style={{
                        width: `${railWidth}%`,
                        backgroundColor: brand.ember,
                        transition: 'width 240ms cubic-bezier(0.22,1,0.36,1)',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Static fallback for reduced-motion / mobile / low-perf
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              {beats.map((b, i) => (
                <div
                  key={b.k}
                  className="rounded-2xl p-4 sm:p-6 bg-white"
                  style={{ border: `1px solid ${brand.border}` }}
                >
                  <span
                    className="font-mono text-[10px] uppercase tracking-[0.2em]"
                    style={{ color: brand.ember }}
                  >
                    {b.eyebrow}
                  </span>
                  <div className="mt-2 sm:mt-3 flex items-baseline gap-2">
                    <span
                      className="font-display font-bold tabular-nums"
                      style={{
                        fontSize: 'clamp(1.75rem, 7vw, 3.5rem)',
                        lineHeight: 1,
                        color: brand.ink,
                      }}
                    >
                      {b.metric}
                    </span>
                    {b.unit && (
                      <span className="font-mono text-sm" style={{ color: brand.inkMuted }}>
                        {b.unit}
                      </span>
                    )}
                  </div>
                  <h2
                    className="mt-3 sm:mt-4 font-display font-bold text-base sm:text-lg"
                    style={{ color: brand.ink }}
                  >
                    {b.title}
                  </h2>
                  <p className="mt-1.5 sm:mt-2 text-sm leading-relaxed" style={{ color: brand.inkSoft }}>
                    {b.body}
                  </p>
                  {i === beats.length - 1 && (
                    <Link
                      to={path}
                      className="haptic-host mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold"
                      style={{ backgroundColor: brand.ink, color: brand.paper }}
                    >
                      {ctaLabel} <span aria-hidden>→</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
