import { Sparkles } from 'lucide-react';
import { getAffiliatesByCategory, type AffiliateCategory } from '@/config/affiliates';
import { AffiliateCard } from './AffiliateCard';
import { useLanguage } from '@/contexts/LanguageContext';

interface RecommendedToolsProps {
  categories?: AffiliateCategory[];
  limit?: number;
}

export const RecommendedTools = ({ categories = ['exchange', 'hardware'], limit = 3 }: RecommendedToolsProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const partners = categories.flatMap(c => getAffiliatesByCategory(c, 2)).slice(0, limit);

  if (partners.length === 0) return null;

  return (
    <div className="rounded-xl border border-border/30 bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary" />
        {tr ? 'Önerilen Araçlar' : 'Recommended Tools'}
      </h3>
      <div className="space-y-2">
        {partners.map((partner) => (
          <AffiliateCard key={partner.id} partner={partner} compact />
        ))}
      </div>
    </div>
  );
};
