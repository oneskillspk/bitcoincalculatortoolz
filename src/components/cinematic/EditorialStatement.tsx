import { useLanguage } from '@/contexts/LanguageContext';
import { WordReveal } from './WordReveal';
import { ParallaxLayer } from './ParallaxLayer';
import { SectionTerminalStrip } from './SectionTerminalStrip';

/**
 * Editorial intro strip — Instrument Panel chrome wrapped around a serif
 * statement. No orbs, no gradients; only hairline rules and the ember dot.
 */
export const EditorialStatement = () => {
  const { t, language } = useLanguage();
  const isTurkish = language === 'tr';

  return (
    <section
      aria-labelledby="editorial-statement"
      className="relative overflow-hidden bg-background py-12 md:py-20 border-y border-border/60"
    >
      {/* subtle parallax grid only — orb removed */}
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

      <div className="container mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <SectionTerminalStrip
            moduleId="STATEMENT"
            context={isTurkish ? 'MANİFESTO' : 'MANIFESTO'}
            status={t('editorial.eyebrow')}
            className="border-t-0 mb-8 sm:mb-10"
          />

          <div className="max-w-5xl">
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
      </div>
    </section>
  );
};
