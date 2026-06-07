import {
  cloneElement,
  isValidElement,
  MouseEvent,
  PointerEvent,
  ReactElement,
  useCallback,
  useRef,
} from 'react';
import { useHaptics } from '@/hooks/useHaptics';
import { cn } from '@/lib/utils';

interface Props {
  children: ReactElement;
  /** Haptic intensity. Default 'tap'. */
  intensity?: 'tap' | 'select' | 'success' | 'warn';
  /** Disable the ripple visual. */
  noRipple?: boolean;
}

/**
 * Wraps a single child (Button/Link/etc.) and adds:
 *  • Subtle scale-down on press (CSS `:active` style)
 *  • Ink-style ripple on tap/click that respects perf tier
 *  • navigator.vibrate haptic on mobile via useHaptics
 *  • Reduced-motion safe — visual ripple disabled, vibration disabled
 */
export const HapticButton = ({ children, intensity = 'tap', noRipple = false }: Props) => {
  const haptic = useHaptics();
  const hostRef = useRef<HTMLElement | null>(null);

  const handleDown = useCallback(
    (e: PointerEvent | MouseEvent) => {
      haptic(intensity);
      if (noRipple) return;
      if (typeof window === 'undefined') return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const host = hostRef.current;
      if (!host) return;
      const rect = host.getBoundingClientRect();
      const cx = ('clientX' in e ? e.clientX : 0) - rect.left;
      const cy = ('clientY' in e ? e.clientY : 0) - rect.top;
      const size = Math.max(rect.width, rect.height) * 1.6;
      const ripple = document.createElement('span');
      ripple.className = 'haptic-ripple';
      ripple.style.left = `${cx - size / 2}px`;
      ripple.style.top = `${cy - size / 2}px`;
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      host.appendChild(ripple);
      window.setTimeout(() => ripple.remove(), 620);
    },
    [haptic, intensity, noRipple]
  );

  if (!isValidElement(children)) return children;

  const child = children as ReactElement<{
    ref?: React.Ref<unknown>;
    className?: string;
    onPointerDown?: (e: PointerEvent) => void;
  }>;
  const existingRef = (child as unknown as { ref?: React.Ref<HTMLElement> }).ref;

  const mergedRef = (node: HTMLElement | null) => {
    hostRef.current = node;
    if (typeof existingRef === 'function') existingRef(node);
    else if (existingRef && 'current' in existingRef) {
      (existingRef as React.MutableRefObject<HTMLElement | null>).current = node;
    }
  };

  return cloneElement(child, {
    ref: mergedRef,
    className: cn('haptic-host', child.props.className),
    onPointerDown: (e: PointerEvent) => {
      handleDown(e);
      child.props.onPointerDown?.(e);
    },
  });
};
