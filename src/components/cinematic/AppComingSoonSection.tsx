import { ScrollScene } from './ScrollScene';
import { GooglePlayBadge } from './badges/GooglePlayBadge';
import { AppStoreBadge } from './badges/AppStoreBadge';

/**
 * Editorial-minimal "App Coming Soon" section.
 * Sits just above the footer. EN only for now.
 */
export const AppComingSoonSection = () => {
  return (
    <section
      aria-labelledby="app-coming-soon-heading"
      className="relative min-h-[520px] overflow-hidden border-y border-border/40 bg-card/40 backdrop-blur-sm"
    >
      {/* subtle radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          background:
            'radial-gradient(60% 60% at 80% 50%, hsl(var(--primary) / 0.08), transparent 70%)',
        }}
      />
      {/* hairline grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(to right, hsl(var(--foreground) / 0.6) 1px, transparent 1px)',
          backgroundSize: '120px 100%',
        }}
      />

      <ScrollScene
        as="div"
        reveal="fade-up"
        className="container mx-auto px-5 py-20 sm:px-8 sm:py-24 md:py-28"
      >
        <div className="mx-auto grid max-w-6xl items-start gap-12 md:grid-cols-2 md:items-center md:gap-16">
          {/* Left — copy */}
          <div>
            <div className="mb-6 flex items-center gap-3 sm:gap-4">
              <span className="h-px w-8 bg-primary/60" aria-hidden />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:text-xs">
                Coming Soon · Q3 2026
              </span>
            </div>

            <h2
              id="app-coming-soon-heading"
              className="font-editorial tracking-editorial text-balance text-[2rem] leading-[1.05] text-foreground sm:text-[2.75rem] md:text-[3.25rem]"
            >
              Bitcoin Calculator,
              <br />
              now in your pocket.
            </h2>

            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
              46+ tools. Live BTC prices. Zero signup. The full web experience,
              wrapped in a native iOS &amp; Android app — built for offline use.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:text-xs">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary/70" /> Native
                iOS
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary/70" /> Native
                Android
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary/70" /> Offline
                Ready
              </span>
            </div>
          </div>

          {/* Right — badges */}
          <div className="flex flex-col items-start gap-4 md:items-end">
            <div className="flex flex-col gap-4 sm:flex-row md:flex-col lg:flex-row">
              <GooglePlayBadge />
              <AppStoreBadge />
            </div>
            <p className="mt-2 max-w-xs font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground md:text-right">
              Launching to both stores. Stay tuned.
            </p>
          </div>
        </div>
      </ScrollScene>
    </section>
  );
};
