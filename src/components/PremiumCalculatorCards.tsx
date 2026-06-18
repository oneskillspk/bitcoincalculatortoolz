import { Calculator, BarChart3, PiggyBank, Sparkles, Receipt, Cpu, ArrowUpRight } from "lucide-react";
import { Link } from "@/components/LocalizedLink";

import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollScene } from "@/components/cinematic/ScrollScene";
import { TiltCard } from "@/components/cinematic/TiltCard";
import { LIVE_CALCULATOR_COUNT } from "@/config/siteStats";


/**
 * Instrument Panel — option 02.
 * Dense SaaS / data terminal feel: mono metadata, hairline rules,
 * numeric module index, compact ember status dot. No orbs, no gradients.
 */
export const PremiumCalculatorCards = () => {
  const { t, language } = useLanguage();
  const isTurkish = language === 'tr';

  const calculators = [
    {
      id: 1,
      moduleId: "CALC-01",
      icon: Calculator,
      titleKey: 'cards.profitLoss.title',
      descKey: 'cards.profitLoss.desc',
      link: isTurkish ? '/tr/hesaplayicilar/bitcoin-kar-zarar-hesaplayicisi' : '/calculators/profit-loss',
      badge: "PRO",
    },
    {
      id: 2,
      moduleId: "CALC-02",
      icon: BarChart3,
      titleKey: 'cards.dca.title',
      descKey: 'cards.dca.desc',
      link: isTurkish ? '/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi' : '/calculators/dca',
      badge: "ADVANCED",
    },
    {
      id: 3,
      moduleId: "CALC-03",
      icon: PiggyBank,
      titleKey: 'cards.retirement.title',
      descKey: 'cards.retirement.desc',
      link: isTurkish ? '/tr/hesaplayicilar/bitcoin-emeklilik-hesaplayicisi' : '/calculators/retirement',
      badge: "PREMIUM",
    },
    {
      id: 4,
      moduleId: "CALC-04",
      icon: Sparkles,
      titleKey: 'calculators.rainbowChart.title',
      descKey: 'calculators.rainbowChart.desc',
      link: isTurkish ? '/tr/hesaplayicilar/bitcoin-gokkusagi-grafigi' : '/calculators/rainbow-chart',
      badge: "LIVE",
    },
    {
      id: 5,
      moduleId: "CALC-05",
      icon: Receipt,
      titleKey: 'calculators.taxCalculator.title',
      descKey: 'calculators.taxCalculator.desc',
      link: isTurkish ? '/tr/hesaplayicilar/bitcoin-vergi-hesaplayicisi' : '/calculators/capital-gains-tax',
      badge: "TAX",
    },
    {
      id: 6,
      moduleId: "CALC-06",
      icon: Cpu,
      titleKey: 'calculators.mining.title',
      descKey: 'calculators.mining.desc',
      link: isTurkish ? '/tr/hesaplayicilar/bitcoin-madencilik-hesaplayicisi' : '/calculators/mining-profitability',
      badge: "ROI",
    },
  ];

  return (
    <section className="pt-2 md:pt-4 pb-8 md:pb-12 relative">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Featured label + browse-all link */}
        <div className="max-w-7xl mx-auto mb-5 flex items-end justify-between gap-4">
          <div className="font-mono text-[10.5px] tracking-[0.18em] uppercase text-muted-foreground">
            <span className="text-primary">●</span> Featured · 6 of 47
          </div>
          <Link
            to={isTurkish ? '/tr/hesaplayicilar' : '/calculators'}
            className="inline-flex items-center gap-1 font-mono text-[10.5px] tracking-[0.14em] uppercase text-foreground/70 hover:text-primary transition-colors"
          >
            Browse all
            <ArrowUpRight className="w-3 h-3" strokeWidth={1.75} />
          </Link>
        </div>

        <ScrollScene
          as="div"
          reveal="stagger-children"
          childSelector="[data-tilt-card]"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-7xl mx-auto"
        >
          {calculators.map((calc) => {
            const IconComponent = calc.icon;
            const title = t(calc.titleKey);
            const description = t(calc.descKey);
            return (
              <TiltCard key={calc.id} max={2} className="h-full rounded-xl" data-tilt-card>
                <Link
                  to={calc.link}
                  className="block group h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-label={`${title} — ${description}`}
                >
                  <article className="relative bg-card border border-border/70 rounded-xl shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-lift)] hover:border-border transition-all duration-300 ease-out h-full flex flex-col overflow-hidden">
                    {/* Terminal header strip */}
                    <header className="flex items-center justify-between px-4 sm:px-5 py-2.5 border-b border-border/60 bg-background/40">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" aria-hidden />
                        <span className="font-mono text-[10.5px] tracking-[0.14em] text-muted-foreground">
                          {calc.moduleId}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] font-semibold tracking-[0.16em] uppercase text-foreground/70">
                        {calc.badge}
                      </span>
                    </header>

                    {/* Body */}
                    <div className="flex-1 flex flex-col p-5 sm:p-6">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center border border-border/60 bg-background/60">
                          <IconComponent className="w-[18px] h-[18px] text-foreground/80" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-[16px] sm:text-[17px] font-semibold text-foreground leading-snug tracking-[-0.015em] mt-0.5">
                          {title}
                        </h2>
                      </div>
                      <p className="text-[13px] sm:text-[13.5px] text-muted-foreground leading-relaxed flex-1">
                        {description}
                      </p>
                    </div>

                    {/* Footer rail */}
                    <footer className="flex items-center justify-between px-4 sm:px-5 py-3 border-t border-border/60 bg-background/30">
                      <span className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-muted-foreground">
                        {isTurkish ? 'MODÜL' : 'MODULE'} · {isTurkish ? 'AKTİF' : 'LIVE'}
                      </span>
                      <span className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.12em] uppercase text-foreground group-hover:text-primary transition-colors">
                        {t('cards.exploreBtn')}
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={1.75} />
                      </span>
                    </footer>
                  </article>
                </Link>
              </TiltCard>
            );
          })}
        </ScrollScene>
      </div>
    </section>
  );
};
