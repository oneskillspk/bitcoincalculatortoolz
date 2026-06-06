import { BookOpenCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface QuickAnswerBoxProps {
  /** 40–60 word direct answer designed for AI answer-chunk extraction. */
  answer: string;
  /** Optional override for the chip label (defaults to language-aware "In Plain English"). */
  label?: string;
}

/**
 * Answer-chunk callout rendered above the input panel on top calculators.
 *
 * Generative engines (ChatGPT, Gemini, Perplexity) preferentially cite short,
 * self-contained paragraphs that directly answer the page intent. This component
 * provides exactly that surface: a visually distinct, semantically marked-up
 * lead paragraph that doubles as the calculator's plain-English description.
 */
export const QuickAnswerBox = ({ answer, label }: QuickAnswerBoxProps) => {
  const { language } = useLanguage();
  const displayLabel = label ?? (language==='tr'?'Hızlı Cevap':'Quick Answer');
  return (
    <section
      className="max-w-3xl mx-auto mb-8"
      aria-label={displayLabel}
      itemScope
      itemType="https://schema.org/Answer"
    >
      <div className="relative rounded-2xl border border-primary/20 bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-2.5">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 border border-primary/20">
            <BookOpenCheck className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            {displayLabel}
          </span>
        </div>
        <p
          className="text-sm sm:text-base text-foreground/90 leading-relaxed"
          itemProp="text"
        >
          {answer}
        </p>
      </div>
    </section>
  );
};
