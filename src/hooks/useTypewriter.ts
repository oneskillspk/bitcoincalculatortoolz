import { useEffect, useState } from 'react';

/**
 * Animates `value` -> rendered number with rAF over `duration` ms.
 * Returns formatted number. Respects reduced motion (returns target instantly).
 */
export const useTypewriter = (text: string, msPerChar = 22): string => {
  const [out, setOut] = useState(() => (typeof window === 'undefined' ? text : ''));

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOut(text);
      return;
    }
    let i = 0;
    setOut('');
    const id = window.setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) window.clearInterval(id);
    }, msPerChar);
    return () => window.clearInterval(id);
  }, [text, msPerChar]);

  return out;
};
