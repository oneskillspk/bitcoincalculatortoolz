/**
 * Performance optimization utilities
 */

/**
 * Debounce function to limit the rate of function calls
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>): void => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
};

/**
 * Throttle function to limit function calls to once per specified time
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>): void => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Check if the user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Optimize animations based on user preferences and device capabilities
 */
export const getOptimizedAnimationDuration = (baseDuration: number): number => {
  if (prefersReducedMotion()) return 0;
  
  // Reduce animation duration on lower-end devices
  const isLowEndDevice = navigator.hardwareConcurrency <= 2;
  return isLowEndDevice ? baseDuration * 0.5 : baseDuration;
};

/**
 * Check if WebP is supported
 */
export const supportsWebP = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

/**
 * Get optimal image format based on browser support
 */
export const getOptimalImageFormat = async (originalFormat: string): Promise<string> => {
  const webpSupported = await supportsWebP();
  
  if (webpSupported && !originalFormat.includes('webp')) {
    return 'webp';
  }
  
  return originalFormat;
};