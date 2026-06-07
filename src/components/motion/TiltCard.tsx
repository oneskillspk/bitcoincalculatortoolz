import { ReactNode, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useTilt } from '@/hooks/useTilt';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  max?: number;
  perspective?: number;
}

/**
 * Wraps content in a 3D tilt container. No-op on touch / reduced motion.
 * Use sparingly: max 6° feels premium, anything more feels gimmicky.
 */
export const TiltCard = ({ children, className, max = 5, perspective = 900 }: TiltCardProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  useTilt(ref, { max, perspective });
  return (
    <div ref={ref} data-tilt className={cn('will-change-transform', className)}>
      {children}
    </div>
  );
};
