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
  // "$ 200" -> "$200"
  s = s.replace(/([$€£₺])\s+/g, "$1");
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

export default normalizeText;
