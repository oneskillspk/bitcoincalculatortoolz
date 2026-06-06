import { useCallback, useMemo, useRef, useEffect } from 'react';
import { throttle, debounce } from 'lodash-es';

/**
 * Performance optimization hooks for heavy computations and UI updates
 */

// Hook for throttling expensive operations
export const useThrottledCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 100
): T => {
  const throttledCallback = useMemo(
    () => throttle(callback, delay, { leading: true, trailing: true }),
    [callback, delay]
  );

  useEffect(() => {
    return () => {
      throttledCallback.cancel();
    };
  }, [throttledCallback]);

  return throttledCallback as T;
};

// Hook for debouncing user inputs
export const useDebouncedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300
): T => {
  const debouncedCallback = useMemo(
    () => debounce(callback, delay, { leading: false, trailing: true }),
    [callback, delay]
  );

  useEffect(() => {
    return () => {
      debouncedCallback.cancel();
    };
  }, [debouncedCallback]);

  return debouncedCallback as T;
};

// Hook for intersection observer (virtualization support)
export const useIntersectionObserver = (
  elementRef: React.RefObject<Element>,
  options?: IntersectionObserverInit
) => {
  const isIntersecting = useRef(false);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    observer.current = new IntersectionObserver(([entry]) => {
      isIntersecting.current = entry.isIntersecting;
    }, options);

    observer.current.observe(elementRef.current);

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [elementRef, options]);

  return isIntersecting;
};

// Hook for performance monitoring
export const usePerformanceMonitor = (componentName: string) => {
  const renderStart = useRef<number>(0);
  const renderCount = useRef<number>(0);

  useEffect(() => {
    renderStart.current = performance.now();
    renderCount.current += 1;
  });

  useEffect(() => {
    const renderTime = performance.now() - renderStart.current;
    if (renderTime > 16) { // If render takes more than 16ms (60fps threshold)
      console.warn(`${componentName} slow render: ${renderTime.toFixed(2)}ms (render #${renderCount.current})`);
    }
  });

  return {
    getRenderCount: () => renderCount.current,
    measureRender: (label: string) => {
      const start = performance.now();
      return () => {
        const end = performance.now();
        console.log(`${componentName} - ${label}: ${(end - start).toFixed(2)}ms`);
      };
    }
  };
};

// Hook for memory usage monitoring
export const useMemoryMonitor = (componentName: string) => {
  useEffect(() => {
    const checkMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
          console.warn(`${componentName}: High memory usage detected`);
        }
      }
    };

    const interval = setInterval(checkMemory, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [componentName]);
};