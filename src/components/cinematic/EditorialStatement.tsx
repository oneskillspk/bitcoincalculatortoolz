import { useLanguage } from '@/contexts/LanguageContext';
import { WordReveal } from './WordReveal';
import { ParallaxLayer } from './ParallaxLayer';

/**
 * Editorial intro strip — full-width pinned-feel scene with serif statement,
 * hairline divider, and monospaced data row. Sits between hero and grid.
 */
export const EditorialStatement = () => {
  const { t } = useLanguage();

  return (
    <section
      aria-labelledby="editorial-statement"
      className="relative overflow-hidden bg-background pt-6 pb-12 sm:pt-10 sm:pb-16 md:pt-12 md:pb-20"
    >
      {/* subtle parallax background slabs */}
      <ParallaxLayer
        speed={-0.15}
        ariaHidden
        className="absolute inset-x-0 top-0 h-[60%] -z-10 opacity-[0.05]"
      >
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              'linear-gradient(to right, hsl(var(--foreground) / 0.6) 1px, transparent 1px)',
            backgroundSize: '120px 100%',
          }}
        />
      </ParallaxLayer>
      <ParallaxLayer
        speed={0.18}
        ariaHidden
        className="absolute -right-24 top-12 -z-10 hidden sm:block h-[280px] w-[280px] rounded-full opacity-30 blur-3xl"
      >
        <div className="h-full w-full bg-gradient-to-br from-primary/40 to-accent/20" />
      </ParallaxLayer>

      <div className="container mx-auto px-5 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex items-center gap-3 sm:gap-4">
            <span className="h-px w-8 bg-foreground/30" aria-hidden />
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {t('editorial.eyebrow')}
            </span>
          </div>

          <WordReveal
            text={t('editorial.statement')}
            as="h2"
            scrub
            className="font-editorial tracking-[-0.02em] text-balance text-[1.75rem] leading-[1.15] text-foreground sm:text-[2.25rem] md:text-[2.75rem] lg:text-[3.25rem] min-h-[100px] sm:min-h-[130px] md:min-h-[160px] lg:min-h-[180px] max-w-[28ch]"
          />

          <div className="mt-10 hairline-divider" />

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg min-h-[80px] sm:min-h-[64px]">
            {t('editorial.caption')}
          </p>
        </div>
      </div>
    </section>
  );
};
