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
          ? 'Emekli olmak için kaç Bitcoin gerekir? Yaşınızı, hedef gelirinizi ve aylık BTC katkınızı girin — hedef yığın boyutunu, aylık birikim planını ve çıkabileceğiniz yılı üç modda (Tahminci, Hedef Planlayıcı, FIRE) hesaplayın.'
          : 'How much Bitcoin do you need to retire? Enter your age, target income, and monthly BTC contribution — see the stack size you need, a month-by-month savings plan, and the exact year you can leave work, across Forecaster, Goal Planner, and FIRE modes.'}
      </p>

      <CompactLiveBitcoinPrice currency={currency} />
    </section>
  );
};
