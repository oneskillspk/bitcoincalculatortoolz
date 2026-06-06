import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';

interface ArticleSearchBarProps {
  query: string;
  onChange: (query: string) => void;
}

export const ArticleSearchBar = ({ query, onChange }: ArticleSearchBarProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      <Input
        type="text"
        placeholder={tr ? 'Makalelerde ara…' : 'Search articles…'}
        value={query}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 md:pl-9 pr-8 md:pr-8 h-9 rounded-lg border-border/40 bg-card text-sm"
      />
      {query && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label={tr ? 'Aramayı temizle' : 'Clear search'}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
