import { useEffect, useState } from 'react';

/**
 * One-shot ember scan-line that sweeps top→bottom once on page load,
 * then unmounts. Fires after idle so it never blocks LCP.
 */
export const PageLoadScan = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const idle = (window as any).requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 200));
    const cancel = (window as any).cancelIdleCallback ?? clearTimeout;
    const handle = idle(() => setShow(true));
    const off = window.setTimeout(() => setShow(false), 1500);
    return () => {
      cancel(handle);
      window.clearTimeout(off);
    };
  }, []);

  if (!show) return null;
  return <div className="ip-scan-line" aria-hidden="true" />;
};
