import { getAffiliatesForCalculator } from '@/config/affiliates';
import { AffiliateCard } from './AffiliateCard';

interface ContextualAffiliateStripProps {
  calculatorSlug: string;
  heading?: string;
  limit?: number;
  className?: string;
}

export const ContextualAffiliateStrip = ({
  calculatorSlug,
  heading = 'Recommended Tools',
  limit = 3,
  className = '',
}: ContextualAffiliateStripProps) => {
  const partners = getAffiliatesForCalculator(calculatorSlug, limit);

  if (partners.length === 0) return null;

  return (
    <section className={`py-8 ${className}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-sm font-semibold text-foreground">{heading}</h3>
          <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-medium px-1.5 py-0.5 rounded bg-muted/40">
            Sponsored
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {partners.map((partner) => (
            <AffiliateCard key={partner.id} partner={partner} />
          ))}
        </div>
      </div>
    </section>
  );
};
