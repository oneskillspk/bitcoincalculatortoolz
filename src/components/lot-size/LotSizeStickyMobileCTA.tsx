import { useEffect, useState } from 'react';
import { Calculator } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Mobile-only sticky bottom CTA that returns the user to the lot-size
 * input panel from anywhere deeper on the page (broker matrix, FAQ,
 * related). Appears once the user has scrolled past the input's
 * bottom edge, hides again when they scroll back into it.
 *
 * Target `elementId` should be the id of the input panel or its
 * container section. Renders nothing on tablet/desktop (>= md).
 */
interface Props {
  targetId: string;
}

export const LotSizeStickyMobileCTA = ({ targetId }: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target || typeof IntersectionObserver === 'undefined') return;

    const io = new IntersectionObserver(
      ([entry]) => {
        // Show when target has scrolled OFF screen upward (below viewport).
        const rect = entry.boundingClientRect;
        const passed = !entry.isIntersecting && rect.top < 0;
        setVisible(passed);
      },
      { threshold: 0, rootMargin: '0px 0px -80% 0px' },
    );
    io.observe(target);
    return () => io.disconnect();
  }, [targetId]);

  const handleClick = () => {
    const target = document.getElementById(targetId);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Focus the first input inside the target for keyboard users.
    window.setTimeout(() => {
      const firstInput = target.querySelector<HTMLElement>('input, button, [tabindex]');
      firstInput?.focus?.();
    }, 500);
  };

  if (!visible) return null;

  return (
    <div
      className="md:hidden fixed inset-x-0 bottom-0 z-40 pointer-events-none px-4 pb-[max(env(safe-area-inset-bottom),0.75rem)]"
      aria-hidden={!visible}
    >
      <button
        type="button"
        onClick={handleClick}
        className="pointer-events-auto w-full min-h-12 inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground px-5 py-3 text-sm font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        aria-label={tr ? 'Hesaplayıcıya dön' : 'Back to calculator'}
      >
        <Calculator className="w-4 h-4" aria-hidden />
        {tr ? 'Hesaplayıcıya dön' : 'Back to calculator'}
      </button>
    </div>
  );
};

export default LotSizeStickyMobileCTA;
