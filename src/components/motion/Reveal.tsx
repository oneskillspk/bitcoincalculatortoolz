import {
  CSSProperties,
  ElementType,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { cn } from '@/lib/utils';

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Delay in ms before revealing once in viewport. */
  delay?: number;
  /** Initial Y offset override in px (otherwise CSS var). */
  y?: number;
  /** Initial blur in px. */
  blur?: number;
  /** Distance from viewport bottom that triggers (default '-10%'). */
  threshold?: string;
  /** Tag id for testing. */
  id?: string;
  style?: CSSProperties;
}

/**
 * Lightweight intersection-driven reveal. Pure CSS transition via data-attr.
 * Runs once. Honors reduced motion via the global CSS rule.
 */
export const Reveal = ({
  children,
  as,
  className,
  delay = 0,
  y,
  blur,
  threshold = '0px 0px -10% 0px',
  id,
  style,
}: RevealProps) => {
  const Tag = (as ?? 'div') as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === 'undefined') return;
    if (!('IntersectionObserver' in window)) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  const inlineStyle: CSSProperties = {
    ['--reveal-delay' as any]: `${delay}ms`,
    ...(y !== undefined ? { ['--reveal-y' as any]: `${y}px` } : null),
    ...(blur !== undefined ? { ['--reveal-blur' as any]: `${blur}px` } : null),
    ...style,
  };

  return (
    <Tag
      ref={ref as any}
      id={id}
      data-reveal={shown ? 'in' : 'out'}
      className={cn(className)}
      style={inlineStyle}
    >
      {children}
    </Tag>
  );
};
