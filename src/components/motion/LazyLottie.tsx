import { lazy, Suspense, useEffect, useState } from "react";

/**
 * LazyLottie — performance-safe wrapper around lottie-react.
 *
 * Why this exists:
 *  • lottie-react + lottie-web is ~60KB gzip. We only want to pay
 *    that cost AFTER the page is interactive, so it never hurts LCP.
 *  • The runtime is dynamically imported on the first idle tick so
 *    the initial JS payload is unchanged.
 *  • If the asset (URL or inline JSON) fails to load, we render
 *    nothing — never a broken state.
 *  • Auto-disabled when `prefers-reduced-motion: reduce` is set.
 *
 * Usage:
 *   <LazyLottie src="https://lottie.host/xyz.json" className="w-32 h-32" />
 *   <LazyLottie animationData={chartPulse} loop />
 */

const Player = lazy(async () => {
  const mod = await import("lottie-react");
  return { default: mod.default };
});

type LazyLottieProps = {
  /** Public URL to a .json or .lottie animation file. */
  src?: string;
  /** Pre-loaded animationData JSON object. */
  animationData?: object;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
  /** Idle delay before mounting (ms). Keeps it off the LCP path. */
  mountDelayMs?: number;
  /** Optional aria-label since Lottie is decorative by default. */
  ariaLabel?: string;
};

export const LazyLottie = ({
  src,
  animationData: inlineData,
  className,
  loop = true,
  autoplay = true,
  mountDelayMs = 600,
  ariaLabel,
}: LazyLottieProps) => {
  const [ready, setReady] = useState(false);
  const [data, setData] = useState<object | null>(inlineData ?? null);
  const [failed, setFailed] = useState(false);

  // Defer mount until the page is past LCP. When mountDelayMs === 0,
  // mount immediately — used for user-initiated moments (calculating,
  // success) that must respond on the same frame as the click.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (mountDelayMs === 0) {
      setReady(true);
      return;
    }

    const ric =
      (window as unknown as { requestIdleCallback?: (cb: () => void) => number })
        .requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, mountDelayMs));
    const id = ric(() => setReady(true));
    return () => {
      const cic = (window as unknown as { cancelIdleCallback?: (id: number) => void })
        .cancelIdleCallback;
      if (cic && typeof id === "number") cic(id);
    };
  }, [mountDelayMs]);

  // Fetch remote JSON only once we're ready and no inline data provided.
  useEffect(() => {
    if (!ready || data || !src) return;
    let cancelled = false;
    fetch(src)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [ready, src, data]);

  if (failed || !ready || !data) {
    // Reserve layout space so adding the animation doesn't cause CLS.
    return <div className={className} aria-hidden={!ariaLabel} aria-label={ariaLabel} />;
  }

  return (
    <Suspense fallback={<div className={className} aria-hidden />}>
      <div className={className} role={ariaLabel ? "img" : undefined} aria-label={ariaLabel}>
        <Player
          animationData={data}
          loop={loop}
          autoplay={autoplay}
          rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </Suspense>
  );
};

export default LazyLottie;
