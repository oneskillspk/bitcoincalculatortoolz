import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface CorrelationTimeSelectorProps {
  selected: string;
  onChange: (period: string) => void;
}

const periods: { value: string; en: string; tr: string }[] = [
  { value: '30d', en: '30 Days', tr: '30 Gün' },
  { value: '90d', en: '90 Days', tr: '90 Gün' },
  { value: '1y',  en: '1 Year',  tr: '1 Yıl' },
  { value: '3y',  en: '3 Years', tr: '3 Yıl' },
];

export const CorrelationTimeSelector: React.FC<CorrelationTimeSelectorProps> = ({ selected, onChange }) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {periods.map((p) => (
        <button
          key={p.value}
          onClick={() => onChange(p.value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            selected === p.value
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/30'
          }`}
        >
          {tr ? p.tr : p.en}
        </button>
      ))}
    </div>
  );
};
