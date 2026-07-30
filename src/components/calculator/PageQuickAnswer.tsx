import { QuickAnswerBox } from '@/components/calculator/QuickAnswerBox';
import { useLanguage } from '@/contexts/LanguageContext';

interface PageQuickAnswerProps {
  /** 40–60 word English direct answer for AI answer-chunk extraction. */
  en: string;
  /** Turkish equivalent shown on /tr routes. */
  tr: string;
}

/**
 * Bilingual wrapper around <QuickAnswerBox> so calculator pages can drop in a
 * localized answer chunk without wiring up their own language plumbing.
 */
export const PageQuickAnswer = ({ en, tr }: PageQuickAnswerProps) => {
  const { language } = useLanguage();
  return <QuickAnswerBox answer={language === 'tr' ? tr : en} />;
};
