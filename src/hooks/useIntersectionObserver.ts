import { useEffect, useRef, useState, RefObject } from 'react';

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
  triggerOnce?: boolean;
}

export const useIntersectionObserver = (
  options: UseIntersectionObserverOptions = {}
): [RefObject<HTMLElement>, boolean] => {
  const {
    root = null,
    rootMargin = '0px',
    threshold = 0.1,
    freezeOnceVisible = false,
    triggerOnce = true,
  } = options;

  const elementRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    
    if (!element || (triggerOnce && hasTriggered)) {
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      // Fallback for browsers that don't support IntersectionObserver
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementVisible = entry.isIntersecting;
        
        if (isElementVisible && !hasTriggered) {
          setIsVisible(true);
          setHasTriggered(true);
        } else if (!freezeOnceVisible) {
          setIsVisible(isElementVisible);
        }
      },
      {
        root,
        rootMargin,
        threshold,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [root, rootMargin, threshold, freezeOnceVisible, triggerOnce, hasTriggered]);

  return [elementRef, isVisible];
};

// Hook for multiple elements with staggered animations
export const useStaggeredIntersectionObserver = (
  count: number,
  staggerDelay: number = 100,
  options: UseIntersectionObserverOptions = {}
) => {
  const [refs, setRefs] = useState<RefObject<HTMLDivElement>[]>([]);
  const [visibleStates, setVisibleStates] = useState<boolean[]>(new Array(count).fill(false));

  useEffect(() => {
    setRefs(Array.from({ length: count }, () => useRef<HTMLDivElement>(null)));
  }, [count]);

  useEffect(() => {
    if (refs.length === 0) return;

    const observers = refs.map((ref, index) => {
      if (!ref.current) return null;

      return new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setVisibleStates(prev => {
                const newStates = [...prev];
                newStates[index] = true;
                return newStates;
              });
            }, index * staggerDelay);
          }
        },
        {
          root: options.root || null,
          rootMargin: options.rootMargin || '0px',
          threshold: options.threshold || 0.1,
        }
      );
    });

    refs.forEach((ref, index) => {
      if (ref.current && observers[index]) {
        observers[index]!.observe(ref.current);
      }
    });

    return () => {
      observers.forEach((observer, index) => {
        if (observer && refs[index]?.current) {
          observer.unobserve(refs[index].current!);
        }
      });
    };
  }, [refs, staggerDelay, options]);

  return { refs, visibleStates };
};