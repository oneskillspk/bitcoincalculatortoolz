import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const BackToTopButton = () => {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setVisible(window.scrollY > 600);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 flex items-center justify-center hover:bg-primary/90 transition-all duration-200 animate-in fade-in slide-in-from-bottom-4"
      aria-label={t('aria.backToTop')}
    >
      <ArrowUp className="w-4 h-4" />
    </button>
  );
};
