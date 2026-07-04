import { ARTICLE_CATEGORIES, type ArticleMeta } from '@/data/articles';
import { useLanguage } from '@/contexts/LanguageContext';
import { CATEGORY_TR_LABELS } from '@/utils/articleCategoryLabel';

interface CategoryFilterProps {
  selected: string;
  onSelect: (category: string) => void;
  articles: ArticleMeta[];
}

const TR_LABELS = CATEGORY_TR_LABELS;

export const CategoryFilter = ({ selected, onSelect, articles }: CategoryFilterProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const getCategoryCount = (category: string) => {
    if (category === 'All') return articles.length;
    return articles.filter(a => a.category === category).length;
  };

  return (
    <div className="flex gap-6 overflow-x-auto scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
      {ARTICLE_CATEGORIES.map((category) => {
        const count = getCategoryCount(category);
        if (count === 0 && category !== 'All') return null;
        const isActive = selected === category;
        const label = tr ? (TR_LABELS[category] ?? category) : category;

        return (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className={`
              shrink-0 py-3 text-[13px] whitespace-nowrap border-b-2 transition-colors duration-200
              ${isActive
                ? 'border-primary text-foreground font-medium'
                : 'border-transparent text-muted-foreground hover:text-foreground'
              }
            `}
          >
            {label}
            <span className="ml-1.5 text-[11px] text-muted-foreground font-mono">
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
