/**
 * Canonical browser download helper.
 *
 * Why this exists: every export path used to hand-roll its own anchor +
 * object-URL dance, and several of them were subtly broken:
 *   - `link.click()` without appending the anchor to the DOM is ignored by
 *     iOS Safari and most Android WebViews.
 *   - Revoking the object URL synchronously after `click()` cancels the
 *     download on slower devices before the browser has read the blob.
 *
 * `downloadBlob` does it once, correctly, and returns the object URL so the
 * caller can offer a manual "click here if the download didn't start"
 * fallback (browsers occasionally block programmatic downloads).
 */

/** How long the object URL stays alive for the manual fallback link. */
const FALLBACK_TTL_MS = 60_000;
/** Grace period before revoking after a successful programmatic click. */
const REVOKE_DELAY_MS = 4_000;

export interface DownloadBlobResult {
  /** Object URL kept alive so a fallback link can reuse it. */
  url: string;
  /** Revoke early (e.g. the fallback toast was dismissed). */
  revoke: () => void;
}

export const downloadBlob = (
  blob: Blob,
  filename: string,
  options: { keepAliveForFallback?: boolean } = {},
): DownloadBlobResult => {
  const url = URL.createObjectURL(blob);
  let revoked = false;
  const revoke = () => {
    if (revoked) return;
    revoked = true;
    URL.revokeObjectURL(url);
  };

  const anchor = document.createElement('a');
  anchor.href = url;
  // HTML5 download attribute — honoured by Chrome Android (saves to Downloads)
  // and iOS Safari 13+ (routes to the Files app).
  anchor.download = filename;
  anchor.rel = 'noopener';
  anchor.style.position = 'fixed';
  anchor.style.left = '-9999px';
  // Must be in the document for the synthetic click to work in iOS/WebView.
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  window.setTimeout(revoke, options.keepAliveForFallback ? FALLBACK_TTL_MS : REVOKE_DELAY_MS);

  return { url, revoke };
};

/** Convenience wrapper for text payloads (CSV, TXT, JSON). */
export const downloadTextFile = (
  text: string,
  filename: string,
  mime: string,
  options?: { keepAliveForFallback?: boolean },
): DownloadBlobResult =>
  downloadBlob(new Blob([text], { type: mime }), filename, options);
