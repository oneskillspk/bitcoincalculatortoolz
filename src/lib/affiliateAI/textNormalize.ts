/**
 * Text normalization shared by the partner config validator.
 *
 * Config copy and the text written on a partner's native creative come from
 * two different sources (our CMS-ish config vs. the network's media kit), so
 * they disagree on trivia: non-breaking spaces, curly quotes, "USD $" vs "$",
 * "8.000" (tr) vs "8,000" (en), casing, and stray punctuation. Comparing raw
 * strings produces false positives/negatives, so everything is normalized to
 * one canonical form before comparison.
 */

/** Currency words/symbols mapped to a single canonical symbol. */
const CURRENCY_MAP: Array<[RegExp, string]> = [
  [/\b(usdt|usdc|busd|usd|dollars?)\b|\$/gi, "$"],
  [/\b(eur|euros?)\b|€/gi, "€"],
  [/\b(gbp|pounds?)\b|£/gi, "£"],
  [/\b(try|tl|lira|turkish lira)\b|₺/gi, "₺"],
];

/**
 * Canonical text form: lowercase, unicode-folded, currency-unified,
 * whitespace-collapsed and stripped of decorative punctuation.
 */
export function normalizeText(input?: string | null): string {
  if (!input) return "";
  let s = input.normalize("NFKC").toLowerCase();
  // unicode spaces (nbsp, narrow nbsp, thin space) -> plain space
  s = s.replace(/[\u00a0\u2007\u202f\u2009\u200a\u2002-\u2006]/g, " ");
  // curly quotes/dashes -> ascii
  s = s.replace(/[\u2018\u2019\u201b]/g, "'").replace(/[\u201c\u201d]/g, '"');
  s = s.replace(/[\u2010-\u2015]/g, "-");
  // arrows and bullets are decoration, never content
  s = s.replace(/[→›»‹«•·]/g, " ");
  for (const [re, sym] of CURRENCY_MAP) s = s.replace(re, sym);
  // "200 $" -> "$200" then "$ 200" -> "$200" (symbol always leads the number).
  // Both rules are anchored on a digit so a currency word that trails a number
  // and precedes a plain word ("8,000 USDT beginner reward") can never glue the
  // symbol onto the next word ("$8,000beginner") and corrupt amount parsing.
  s = s.replace(/(\d[\d.,]*)\s*([$€£₺])/g, "$2$1 ");
  s = s.replace(/([$€£₺])\s+(?=\d)/g, "$1");

  // trailing/duplicated punctuation
  s = s.replace(/[.,;:!?]+(?=\s|$)/g, " ");
  return s.replace(/\s+/g, " ").trim();
}

/**
 * Canonical numeric value of a money token, resolving thousands separators
 * used by both en (1,000.50) and tr (1.000,50) copy plus k/m multipliers.
 */
export function normalizeAmount(raw: string, multiplier?: string | null): number | null {
  if (!raw) return null;
  let s = raw.trim();
  // strip grouping separators (either , or . followed by exactly 3 digits)
  s = s.replace(/[.,](?=\d{3}(\D|$))/g, "");
  // remaining separator is a decimal point
  s = s.replace(",", ".");
  let n = Number(s);
  if (!Number.isFinite(n)) return null;
  const mult = (multiplier || "").toLowerCase();
  if (mult === "k") n *= 1_000;
  if (mult === "m") n *= 1_000_000;
  return n;
}

/** True when two normalized strings say the same thing. */
export function textEquals(a?: string | null, b?: string | null): boolean {
  return normalizeText(a) === normalizeText(b);
}

/** True when `needle` appears inside `haystack` after normalization. */
export function textIncludes(haystack?: string | null, needle?: string | null): boolean {
  const n = normalizeText(needle);
  return n.length > 0 && normalizeText(haystack).includes(n);
}

/** Canonical token list of a string (normalized, split on whitespace). */
export function tokenize(input?: string | null): string[] {
  const n = normalizeText(input);
  return n.length === 0 ? [] : n.split(" ");
}

export interface TokenDiff {
  /** Tokens present in both strings, in `a` order. */
  shared: string[];
  /** Tokens only in the first (config copy) string. */
  onlyA: string[];
  /** Tokens only in the second (creative) string. */
  onlyB: string[];
  /** Normalized forms actually compared — the debugging money shot. */
  normalizedA: string;
  normalizedB: string;
}

/**
 * Token-level diff of two strings AFTER normalization. Used by the config
 * validator to report exactly which normalized tokens differ between our
 * config copy and the partner's native creative text, so a failure names the
 * offending words instead of just "these differ".
 */
export function diffTokens(a?: string | null, b?: string | null): TokenDiff {
  const ta = tokenize(a);
  const tb = tokenize(b);
  const sa = new Set(ta);
  const sb = new Set(tb);
  return {
    shared: [...new Set(ta.filter((t) => sb.has(t)))],
    onlyA: [...new Set(ta.filter((t) => !sb.has(t)))],
    onlyB: [...new Set(tb.filter((t) => !sa.has(t)))],
    normalizedA: normalizeText(a),
    normalizedB: normalizeText(b),
  };
}

/** One-line human-readable rendering of a token diff. */
export function formatTokenDiff(diff: TokenDiff): string {
  const side = (label: string, tokens: string[]) =>
    tokens.length ? `${label}: ${tokens.join(", ")}` : `${label}: —`;
  return [
    `config="${diff.normalizedA}"`,
    `creative="${diff.normalizedB}"`,
    side("only-in-config", diff.onlyA),
    side("only-in-creative", diff.onlyB),
    side("shared", diff.shared),
  ].join(" | ");
}

export default normalizeText;
