import { PiggyBank } from "lucide-react";
import { CompactLiveBitcoinPrice } from "@/components/CompactLiveBitcoinPrice";

interface RetirementHeroProps {
  language: string;
  badge: string;
  currency: string;
}

/**
 * Page hero: badge, gradient H1, lead paragraph, and live BTC price chip.
 * Lifted verbatim from page shell.
 */
export const RetirementHero = ({ language, badge, currency }: RetirementHeroProps) => {
  return (
    <div className="container mx-auto px-6 py-16 text-center">
      <div className="inline-flex items-center gap-2 bg-primary/5 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6 border border-primary/10">
        <PiggyBank className="w-4 h-4" />
        {badge}
      </div>

      <h1 className="text-h1 font-bold text-foreground mb-6">
        {language === 'tr'
          ? <>Bitcoin <span className="text-gradient-premium">Emeklilik</span> Hesaplayıcısı</>
          : <>Bitcoin <span className="text-gradient-premium">Retirement</span> Calculator</>}
      </h1>

      <p className="text-xl text-foreground/70 max-w-4xl mx-auto mb-8">
        {language === 'tr'
          ? 'Bitcoin ile finansal bağımsızlığınızı planlayın. Emeklilik projeksiyonlarını hesaplayın, DCA stratejilerini optimize edin ve farklı çekim senaryolarını simüle edin.'
          : 'Plan your financial independence with Bitcoin. Calculate retirement projections, optimize DCA strategies, and simulate different withdrawal scenarios.'}
      </p>

      <CompactLiveBitcoinPrice currency={currency} />
    </div>
  );
};
