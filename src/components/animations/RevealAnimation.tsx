import React, { forwardRef, HTMLAttributes } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';

interface RevealAnimationProps extends HTMLAttributes<HTMLDivElement> {
  animation?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade';
  delay?: number;
  duration?: number;
  distance?: number;
  triggerOnce?: boolean;
  threshold?: number;
  children: React.ReactNode;
}

export const RevealAnimation = forwardRef<HTMLDivElement, RevealAnimationProps>(
  (
    {
      animation = 'up',
      delay = 0,
      duration = 600,
      distance = 30,
      triggerOnce = true,
      threshold = 0.1,
      children,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const [elementRef, isVisible] = useIntersectionObserver({
      threshold,
      triggerOnce,
    });

    const animationClass = `animate-reveal-${animation}`;

    return (
      <div
        ref={(node) => {
          if (elementRef.current !== node) {
            (elementRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }
        }}
        className={cn(
          'will-change-transform transform-gpu',
          isVisible && animationClass,
          className
        )}
        style={{
          '--reveal-delay': `${delay}ms`,
          '--reveal-duration': `${duration}ms`,
          '--reveal-distance': `${distance}px`,
          ...style,
        } as React.CSSProperties}
        {...props}
      >
        {children}
      </div>
    );
  }
);

RevealAnimation.displayName = 'RevealAnimation';