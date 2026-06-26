/**
 * Canonical share-link utility for Bitcoin Calculator Tools.
 *
 * Builds clean, human-readable, prefilled URLs for any calculator and
 * appends a branded attribution suffix so every shared link doubles
 * as a backlink whenever it gets pasted into Reddit, X, Discord, blogs,
 * Notion docs, Substack newsletters, etc.
 *
 * Strategy chosen by the product owner:
 *   - Plain query params (?amount=1000&date=2017-01-01) — readable & SEO-friendly
 *   - Short branded path (/s/<slug>?...) that 301-style redirects to
 *     the full /calculators/<slug>?... URL on first hit, so shared
 *     links stay short while crawlers still see the canonical target.
 */

const SHARE_BASE_URL = 'https://bitcoincalculator.tools';

export type ShareParamValue = string | number | boolean | Date | null | undefined;
export type ShareParams = Record<string, ShareParamValue>;

/**
 * Serialize a JS object into a URLSearchParams string.
 * - Dates → YYYY-MM-DD
 * - Numbers → trimmed string (no trailing zeros)
 * - null / undefined / '' → omitted (keeps URLs tidy)
 * - Booleans → '1' / '0'
 */
function serializeShareParams(params: ShareParams): string {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') return;
    if (value instanceof Date) {
      if (!Number.isNaN(value.getTime())) {
        usp.set(key, value.toISOString().slice(0, 10));
      }
      return;
    }
    if (typeof value === 'boolean') {
      usp.set(key, value ? '1' : '0');
      return;
    }
    if (typeof value === 'number') {
      if (!Number.isFinite(value)) return;
      // strip useless trailing zeros: 1000 → "1000", 0.10 → "0.1"
      usp.set(key, String(value));
      return;
    }
    usp.set(key, String(value));
  });
  return usp.toString();
}

/**
 * Read prefilled params from the current location.
 * Returns a typed accessor that parses common shapes safely.
 */
export function readShareParams(search: string = window.location.search) {
  const usp = new URLSearchParams(search);
  return {
    raw: usp,
    has: (k: string) => usp.has(k),
    string: (k: string, fallback?: string) => usp.get(k) ?? fallback,
    number: (k: string, fallback?: number) => {
      const v = usp.get(k);
      if (v === null) return fallback;
      const n = Number(v);
      return Number.isFinite(n) ? n : fallback;
    },
    bool: (k: string, fallback?: boolean) => {
      const v = usp.get(k);
      if (v === null) return fallback;
      return v === '1' || v === 'true';
    },
    date: (k: string, fallback?: Date) => {
      const v = usp.get(k);
      if (!v) return fallback;
      const d = new Date(v);
      return Number.isNaN(d.getTime()) ? fallback : d;
    },
  };
}

/**
 * Build the canonical (long, crawler-friendly) share URL.
 */
export function buildCanonicalShareUrl(slug: string, params: ShareParams = {}): string {
  const qs = serializeShareParams(params);
  const path = `/calculators/${slug}`;
  return qs ? `${SHARE_BASE_URL}${path}?${qs}` : `${SHARE_BASE_URL}${path}`;
}

/**
 * Build the short branded share URL — earns the same backlink while
 * fitting cleanly into 280-char tweets and Discord embeds.
 */
function buildShortShareUrl(slug: string, params: ShareParams = {}): string {
  const qs = serializeShareParams(params);
  return qs
    ? `${SHARE_BASE_URL}/s/${slug}?${qs}`
    : `${SHARE_BASE_URL}/s/${slug}`;
}

/**
 * Compose the full clipboard payload: a short title + the short URL.
 * Examples:
 *   "Bitcoin DCA backtest → bitcoincalculator.tools/s/dca?amount=1000..."
 */
export function composeShareText(opts: {
  headline: string;
  slug: string;
  params?: ShareParams;
}): { text: string; url: string } {
  const url = buildShortShareUrl(opts.slug, opts.params);
  const text = `${opts.headline} → ${url.replace(/^https?:\/\//, '')}`;
  return { text, url };
}
