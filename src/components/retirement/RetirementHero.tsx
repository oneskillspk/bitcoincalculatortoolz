import { CompactLiveBitcoinPrice } from "@/components/CompactLiveBitcoinPrice";

interface RetirementHeroProps {
  language: string;
  badge: string;
  currency: string;
}

/**
 * Page hero — matches the unified SectionHeader rhythm
 * (uppercase eyebrow pill → H1 → muted lead → live BTC price chip).
 */
export const RetirementHero = ({ language, badge, currency }: RetirementHeroProps) => {
  return (
    <section aria-labelledby="retirement-hero-heading" className="container mx-auto px-6 py-16 text-center">
      <span className="inline-flex items-center px-3 py-1 rounded-full border border-border/60 bg-muted/40 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-6">
        {badge}
      </span>

      <h1 id="retirement-hero-heading" className="text-h1 font-bold text-foreground mb-6">
        {language === 'tr'
          ? <>Bitcoin <span className="text-gradient-premium">Emeklilik</span> Hesaplayıcısı</>
          : <>Bitcoin <span className="text-gradient-premium">Retirement</span> Calculator</>}
      </h1>


      <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
        {language === 'tr'
          ? 'Bitcoin ile finansal bağımsızlığınızı planlayın. Emeklilik projeksiyonlarını hesaplayın, DCA stratejilerini optimize edin ve farklı çekim senaryolarını simüle edin.'
          : 'Plan your financial independence with Bitcoin. Calculate retirement projections, optimize DCA strategies, and simulate different withdrawal scenarios.'}
      </p>

      <CompactLiveBitcoinPrice currency={currency} />
    </div>
  );
};
