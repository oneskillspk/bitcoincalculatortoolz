/**
 * WebView-specific safe-area fallbacks.
 *
 * Problem: inside embedded WebViews (Android WebView, iOS WKWebView shells,
 * in-app browsers) `env(safe-area-inset-bottom)` is often reported as 0px even
 * on devices with a home indicator, and iOS keeps a collapsing URL-bar chrome
 * that shrinks the *visual* viewport while `100vh` / layout viewport stays
 * tall. Both make bottom-fixed UI (tab bar, cookie banner, sticky CTA) sit
 * under system chrome and become untappable.
 *
 * Fix: measure at runtime and expose two CSS custom properties that the
 * bottom-chrome CSS already consumes:
 *
 *  --safe-bottom-floor     minimum inset applied when env() is unavailable/0
 *  --viewport-chrome-bottom  px of layout viewport hidden by browser chrome
 *
 * Also sets `data-webview="true"` on <html> so CSS can branch if needed.
 * Pure progressive enhancement: with JS off, the existing env() values apply.
 */

const NOTCH_FLOOR_PX = 12;

type Nav = Navigator & { standalone?: boolean };

export const isWebViewLike = (): boolean => {
  try {
    const ua = navigator.userAgent || "";
    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches === true ||
      (navigator as Nav).standalone === true ||
      new URLSearchParams(window.location.search).get("app") === "1";
    // Android WebView: "; wv)" token. iOS WKWebView shell: iOS UA without
    // Safari/CriOS/FxiOS tokens. In-app browsers expose their own tokens.
    const androidWebView = /\bwv\b/.test(ua) || /Version\/[\d.]+ Chrome\//.test(ua);
    const iOS = /iPhone|iPad|iPod/.test(ua);
    const iOSWebView = iOS && !/Safari|CriOS|FxiOS|EdgiOS/.test(ua);
    const inAppBrowser = /FBAN|FBAV|Instagram|Line\/|Twitter|GSA\//.test(ua);
    return Boolean(standalone || androidWebView || iOSWebView || inAppBrowser);
  } catch {
    return false;
  }
};

/** Reads the resolved env(safe-area-inset-bottom) in px (0 when unsupported). */
const measureEnvInset = (): number => {
  try {
    const probe = document.createElement("div");
    probe.style.cssText =
      "position:fixed;left:-9999px;bottom:0;width:0;height:env(safe-area-inset-bottom,0px);pointer-events:none;";
    document.body.appendChild(probe);
    const h = probe.getBoundingClientRect().height;
    probe.remove();
    return Number.isFinite(h) ? h : 0;
  } catch {
    return 0;
  }
};

/** Layout-viewport pixels hidden below the visual viewport (iOS URL bar etc). */
const measureViewportChrome = (): number => {
  const vv = window.visualViewport;
  if (!vv) return 0;
  // While the on-screen keyboard is open the gap is huge — ignore it, the
  // keyboard case is handled by the browser scrolling the focused field.
  const gap = window.innerHeight - (vv.height + vv.offsetTop);
  if (!Number.isFinite(gap) || gap <= 0 || gap > 180) return 0;
  return Math.round(gap);
};

export const installWebViewChromeFallbacks = (): (() => void) => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return () => {};
  }

  const root = document.documentElement;
  const webView = isWebViewLike();
  root.setAttribute("data-webview", webView ? "true" : "false");

  const apply = () => {
    const envInset = measureEnvInset();
    // Only synthesise a floor when the platform gave us nothing. Devices that
    // report a real inset keep their native value.
    const floor = webView && envInset < 1 ? NOTCH_FLOOR_PX : 0;
    root.style.setProperty("--safe-bottom-floor", `${floor}px`);
    root.style.setProperty("--viewport-chrome-bottom", `${measureViewportChrome()}px`);
  };

  let raf: number | null = null;
  const schedule = () => {
    if (raf !== null) return;
    raf = requestAnimationFrame(() => {
      raf = null;
      apply();
    });
  };

  apply();

  const vv = window.visualViewport;
  vv?.addEventListener("resize", schedule);
  vv?.addEventListener("scroll", schedule);
  window.addEventListener("resize", schedule);
  window.addEventListener("orientationchange", schedule);

  return () => {
    if (raf !== null) cancelAnimationFrame(raf);
    vv?.removeEventListener("resize", schedule);
    vv?.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    window.removeEventListener("orientationchange", schedule);
  };
};
