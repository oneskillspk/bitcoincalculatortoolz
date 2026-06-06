import { useState, useEffect } from 'react';

interface UseNumberCounterProps {
  end: number;
  duration?: number;
  isActive?: boolean;
  decimals?: number;
}

export const useNumberCounter = ({ 
  end, 
  duration = 2000, 
  isActive = true,
  decimals = 0 
}: UseNumberCounterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    // Respect prefers-reduced-motion
    const prefersReducedMotion = typeof window !== 'undefined' && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion || duration <= 0) {
      setCount(Number(end.toFixed(decimals)));
      return;
    }

    const startTime = Date.now();
    const startCount = 0;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = startCount + (end - startCount) * easeOutQuart;

      setCount(Number(currentCount.toFixed(decimals)));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [end, duration, isActive, decimals]);

  return count;
};
