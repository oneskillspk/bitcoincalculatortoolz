import { useLanguage } from '@/contexts/LanguageContext';
import { ScrollScene } from './ScrollScene';
import { ParallaxLayer } from './ParallaxLayer';
import { Plus } from 'lucide-react';

const KEYS = [1, 2, 3, 4, 5] as const;

/**
 * "Why this tool" — scroll-revealed editorial FAQ. Native <details> so
 * keyboard nav, screen readers, and reduced-motion users all get a working
 * accordion without JS. Wrapped in ScrollScene for staggered reveal on entry.
 */
export const WhyThisToolFAQ = () => {
  const { t } = useLanguage();

  return (
    <section
      id="why-this-tool"
      aria-labelledby="why-this-tool-heading"
      className="relative overflow-hidden bg-background py-20 sm:py-28 md:py-36"
    >
      <ParallaxLayer
        speed={-0.12}
        ariaHidden
        className="absolute -left-32 top-24 -z-10 hidden sm:block h-[320px] w-[320px] rounded-full opacity-20 blur-3xl"
      >
        <div className="h-full w-full bg-gradient-to-tr from-accent/40 to-primary/20" />
      </ParallaxLayer>

      <div className="container mx-auto px-5 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-20">
          {/* Left rail — editorial intro */}
          <ScrollScene reveal="fade-up" className="lg:sticky lg:top-28 lg:self-start">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-foreground/30" aria-hidden />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:text-xs">
                {t('why.eyebrow')}
              </span>
            </div>
            <h2
              id="why-this-tool-heading"
              className="font-editorial tracking-editorial text-balance text-[2rem] leading-[1.05] text-foreground sm:text-[2.75rem] md:text-[3.25rem]"
            >
              {t('why.title')}
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t('why.intro')}
            </p>
          </ScrollScene>

          {/* Right rail — FAQ list */}
          <ScrollScene
            reveal="stagger-children"
            childSelector="[data-faq-item]"
            className="space-y-2"
          >
            {KEYS.map((i) => (
              <details
                key={i}
                data-faq-item
                className="group hairline-border border-t border-border/50 last:border-b py-5 marker:hidden [&::-webkit-details-marker]:hidden focus-within:bg-foreground/[0.015] transition-colors"
              >
                <summary
                  className="flex cursor-pointer list-none items-start justify-between gap-6 rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <span className="font-editorial text-xl leading-snug text-foreground sm:text-2xl">
                    {t(`why.q${i}`)}
                  </span>
                  <Plus
                    aria-hidden
                    className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-45"
                  />
                </summary>
                <div className="mt-4 pr-10 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                  {t(`why.a${i}`)}
                </div>
              </details>
            ))}
          </ScrollScene>
        </div>
      </div>
    </section>
  );
};
