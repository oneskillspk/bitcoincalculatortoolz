import { Calculator, BarChart3, PiggyBank } from "lucide-react";
import { Link } from "@/components/LocalizedLink";

import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollScene } from "@/components/cinematic/ScrollScene";
import { ParallaxLayer } from "@/components/cinematic/ParallaxLayer";
import { TiltCard } from "@/components/cinematic/TiltCard";

export const PremiumCalculatorCards = () => {
  const { t, language } = useLanguage();
  const isTurkish = language === 'tr';

  // Unified card chrome — single neutral surface, hairline icon tile, monochrome ink.
  // Ember reserved for the badge only (semantic accent, not decoration).
  const calculators = [
    {
      id: 1,
      icon: Calculator,
      titleKey: 'cards.profitLoss.title',
      descKey: 'cards.profitLoss.desc',
      link: isTurkish ? '/tr/hesaplayicilar/bitcoin-kar-zarar-hesaplayicisi' : '/calculators/profit-loss',
      badge: "PRO",
      delay: "0.1s"
    },
    {
      id: 2,
      icon: BarChart3,
      titleKey: 'cards.dca.title',
      descKey: 'cards.dca.desc',
      link: isTurkish ? '/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi' : '/calculators/dca',
      badge: "ADVANCED",
      delay: "0.2s"
    },
    {
      id: 3,
      icon: PiggyBank,
      titleKey: 'cards.retirement.title',
      descKey: 'cards.retirement.desc',
      link: isTurkish ? '/tr/hesaplayicilar/bitcoin-emeklilik-hesaplayicisi' : '/calculators/retirement',
      badge: "PREMIUM",
      delay: "0.3s"
    }
  ];

  return (
    <section className="pt-4 md:pt-6 pb-10 md:pb-16 relative overflow-hidden">
      {/* parallax depth orbs */}
      <ParallaxLayer speed={0.3} ariaHidden className="absolute -left-20 top-10 -z-10 h-72 w-72 rounded-full opacity-30 blur-3xl">
        <div className="h-full w-full bg-gradient-to-br from-primary/30 to-transparent" />
      </ParallaxLayer>
      <ParallaxLayer speed={-0.22} ariaHidden className="absolute -right-24 bottom-0 -z-10 h-80 w-80 rounded-full opacity-25 blur-3xl">
        <div className="h-full w-full bg-gradient-to-tl from-accent/30 to-transparent" />
      </ParallaxLayer>

      <div className="container mx-auto px-4 sm:px-6">
        <ScrollScene
          as="div"
          reveal="stagger-children"
          childSelector="[data-tilt-card]"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 max-w-7xl mx-auto"
        >
          {calculators.map((calc) => {
            const IconComponent = calc.icon;
            const title = t(calc.titleKey);
            const description = t(calc.descKey);
            return (
              <TiltCard key={calc.id} max={4} className="h-full rounded-2xl" data-tilt-card>
              <Link
                to={calc.link}
                className="block group h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label={`${title} — ${description}`}
              >
                <div className="relative bg-card border border-border/60 rounded-2xl p-6 sm:p-7 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-lift)] hover:-translate-y-px transition-all duration-300 ease-out h-full flex flex-col">
                  {/* Badge — monochrome ink, single weight, hairline border */}
                  <div className="absolute top-5 right-5 z-20">
                    <span className="inline-flex items-center text-[10px] font-semibold tracking-[0.12em] uppercase px-2 py-0.5 rounded-full border border-border/70 text-muted-foreground bg-background/40">
                      {calc.badge}
                    </span>
                  </div>

                  <div className="relative z-10 flex flex-col flex-1">
                    {/* Icon tile — flat paper-soft, hairline, monochrome ink */}
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 border border-border/60 bg-background/50">
                      <IconComponent className="w-5 h-5 text-foreground/80" strokeWidth={1.5} />
                    </div>

                    <div className="flex-1 min-h-[120px]">
                      <h2 className="text-[17px] sm:text-lg font-semibold text-foreground mb-2 tracking-[-0.015em]">
                        {title}
                      </h2>
                      <p className="text-[13.5px] sm:text-sm text-muted-foreground leading-relaxed">
                        {description}
                      </p>
                    </div>

                    <div className="mt-5 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-foreground/70 group-hover:text-foreground transition-colors duration-200">
                      <span>{t('cards.exploreBtn')}</span>
                      <svg aria-hidden="true" focusable="false" className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
              </TiltCard>
            );
          })}
        </ScrollScene>
      </div>
    </section>
  );
};
