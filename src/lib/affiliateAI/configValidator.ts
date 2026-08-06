/**
 * Partner config validator.
 *
 * Guards the promo-card content rules that keep cards clean:
 *  1. no category/platform wording duplicated inside badge copy
 *     (the card already knows the category — it must never be printed),
 *  2. no badge text repeated inside the CTA or description of the same
 *     partner (that's the "double badge" look we removed),
 *  3. no identical badge copy shared by two different partners,
 *  4. money amounts promised in config copy must match the amounts written
 *     on the partner's own native creative (the Coinbase "$200 vs $2,000"
 *     class of bug),
 *  5. CTA copy must not ship its own trailing arrow — the card draws one.
 *
 * Pure and dependency-free so it can run in unit tests or a CI script.
 */
import type { AffiliateProgram } from "./types";
import {
  normalizeText,
  normalizeAmount,
  textIncludes,
  diffTokens,
  formatTokenDiff,
  type TokenDiff,
} from "./textNormalize";

export type ConfigIssueCode =
  | "category-in-badge"
  | "badge-repeated-in-copy"
  | "duplicate-badge-across-partners"
  | "amount-mismatch-with-creative"
  | "unqualified-amount-claim"
  | "cta-trailing-arrow";

export interface ConfigIssueDetails {
  /** Normalized form of the config copy that was checked. */
  normalizedValue: string;
  /** Normalized form of the compared text (creative alt, other field…). */
  normalizedCompared?: string;
  /** Which normalized tokens differ, when a comparison happened. */
  tokenDiff?: TokenDiff;
  /** Canonical numeric amounts parsed from each side. */
  amounts?: { config: string[]; creative: string[] };
}

export interface ConfigIssue {
  affiliateId: string;
  code: ConfigIssueCode;
  field: string;
  message: string;
  /** Debugging payload: exactly what was compared, after normalization. */
  details?: ConfigIssueDetails;
}

/** Wording that describes a partner's category — never allowed in badges. */
const CATEGORY_WORDS = [
  "exchange",
  "borsa",
  "trading platform",
  "işlem platformu",
  "hardware wallet",
  "donanım cüzdan",
  "broker",
  "aracı kurum",
  "tax software",
  "vergi yazılımı",
  "charting",
  "grafik platformu",
  "crypto card",
  "kripto kart",
];

const norm = (s: string) => normalizeText(s);

/**
 * Extract money-ish amounts ("$200", "8,000 USDT", "8.000 USDT", "€79",
 * "USD 2k") from copy. Text is normalized first so config copy and native
 * creative text are always compared on the same canonical footing.
 */
export function extractAmounts(text: string): string[] {
  if (!text) return [];
  const normalized = normalizeText(text);
  const out = new Set<string>();
  const re = /([$€£₺])\s?(\d[\d.,]*)\s?(k|m)?\b|\b(\d[\d.,]*)\s?(k|m)?\s?([$€£₺])/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(normalized))) {
    const raw = m[2] ?? m[4] ?? "";
    const mult = m[3] ?? m[5] ?? "";
    const n = normalizeAmount(raw, mult);
    if (n === null) continue;
    out.add(String(n));
  }
  return [...out];
}


/** True when two amounts differ only by a factor of 10, 100 or 1000. */
function isTenfold(a: number, b: number): boolean {
  if (!a || !b || a === b) return false;
  const [lo, hi] = a < b ? [a, b] : [b, a];
  const ratio = hi / lo;
  return [10, 100, 1000].includes(ratio);
}

const COPY_FIELDS = [
  "cta_short_en",
  "cta_short_tr",
  "cta_long_en",
  "cta_long_tr",
  "description_en",
  "description_tr",
] as const;

/** Fields where a money amount is a promise to the user. */
const AMOUNT_CLAIM_FIELDS = [
  "badge_en",
  "badge_tr",
  "cta_short_en",
  "cta_short_tr",
  "cta_long_en",
  "cta_long_tr",
] as const;

/** Wording that correctly caps a bonus claim. */
const QUALIFIERS = ["up to", "kadar", "as much as", "max"];

/** Verbs that make an amount sound guaranteed. */
const CLAIM_VERBS = ["claim", "get", "earn", "receive", "kazan", "al ", "kap"];

/**
 * Small fixed rewards (a $5 sign-up credit) really are guaranteed, so only
 * headline-sized amounts — the tiered bonus pools partners advertise — need a
 * qualifier to be honest.
 */
const CLAIM_QUALIFIER_THRESHOLD = 100;

export function validateAffiliateConfig(programs: AffiliateProgram[]): ConfigIssue[] {
  const issues: ConfigIssue[] = [];
  const badgeOwners = new Map<string, string>();

  for (const p of programs) {
    const rec = p as unknown as Record<string, string | undefined>;
    const badges: Array<[string, string]> = (["badge_en", "badge_tr"] as const)
      .map((f) => [f, rec[f] ?? ""] as [string, string])
      .filter(([, v]) => Boolean(v));

    for (const [field, badge] of badges) {
      const nb = norm(badge);

      // 1. category wording inside a badge
      const hit = CATEGORY_WORDS.find((w) => nb.includes(w));
      if (hit) {
        issues.push({
          affiliateId: p.id,
          code: "category-in-badge",
          field,
          message: `Badge repeats the category wording "${hit}" — the card never prints categories.`,
          details: { normalizedValue: nb, normalizedCompared: hit },
        });
      }

      // 2. badge text echoed inside CTA/description of the same partner
      for (const cf of COPY_FIELDS) {
        if (nb.length > 4 && textIncludes(rec[cf], badge)) {
          issues.push({
            affiliateId: p.id,
            code: "badge-repeated-in-copy",
            field: cf,
            message: `"${badge}" appears both in ${field} and ${cf} — duplicate badge text on one card.`,
            details: {
              normalizedValue: norm(rec[cf] ?? ""),
              normalizedCompared: nb,
              tokenDiff: diffTokens(rec[cf], badge),
            },
          });
        }
      }


      // 3. same badge copy on two partners
      const owner = badgeOwners.get(nb);
      if (owner && owner !== p.id) {
        issues.push({
          affiliateId: p.id,
          code: "duplicate-badge-across-partners",
          field,
          message: `Badge "${badge}" is also used by "${owner}".`,
          details: { normalizedValue: nb, normalizedCompared: owner },
        });
      } else {
        badgeOwners.set(nb, p.id);
      }
    }

    // 5. CTA copy shipping its own arrow
    for (const cf of ["cta_short_en", "cta_short_tr", "cta_long_en", "cta_long_tr"] as const) {
      const v = rec[cf] ?? "";
      if (/[→›»>]\s*$/u.test(v)) {
        issues.push({
          affiliateId: p.id,
          code: "cta-trailing-arrow",
          field: cf,
          message: `CTA "${v}" ends with an arrow — the card renders its own.`,
          details: { normalizedValue: norm(v) },
        });
      }
    }

    // 6. guaranteed-sounding money claims ("Claim 8,000 USDT") for offers that
    //    are really capped/tiered. Partner bonus pools must be qualified with
    //    "up to" / "kadar", otherwise the card promises money we can't deliver.
    for (const cf of AMOUNT_CLAIM_FIELDS) {
      const v = rec[cf] ?? "";
      const nv = norm(v);
      const amounts = extractAmounts(v);
      const headline = amounts.filter((a) => Number(a) >= CLAIM_QUALIFIER_THRESHOLD);
      if (headline.length === 0) continue;
      if (QUALIFIERS.some((q) => nv.includes(q))) continue;
      const verb = CLAIM_VERBS.find((w) => nv.includes(w));
      if (!verb) continue;
      issues.push({
        affiliateId: p.id,
        code: "unqualified-amount-claim",
        field: cf,
        message: `"${v}" promises ${headline.join(", ")} as guaranteed ("${verb}") with no "up to" qualifier — capped bonus pools must be qualified.`,
        details: { normalizedValue: nv, amounts: { config: amounts, creative: [] } },
      });
    }

    // 4. amounts promised in copy vs amounts printed on the native creative
    const creativeAmounts = new Set<string>();
    const creativeTexts: string[] = [];
    for (const c of p.creatives ?? []) {
      const alt = c.alt ?? "";
      if (alt) creativeTexts.push(alt);
      for (const a of extractAmounts(alt)) creativeAmounts.add(a);
    }
    if (creativeAmounts.size > 0) {
      for (const cf of ["badge_en", "badge_tr", "cta_short_en", "cta_long_en"] as const) {
        for (const a of extractAmounts(rec[cf] ?? "")) {
          // Only the order-of-magnitude class of bug counts (Coinbase's
          // "$2,000" vs the creative's "$200"). A partner legitimately runs
          // several unrelated offers, so unrelated amounts are not errors.
          const conflicting = [...creativeAmounts].filter((c) => isTenfold(Number(c), Number(a)));
          if (conflicting.length > 0) {
            // Name the exact creative whose text disagrees, so the report
            // points at one alt string instead of the whole creative set.
            const culprit =
              creativeTexts.find((t) =>
                extractAmounts(t).some((x) => conflicting.includes(x))
              ) ?? creativeTexts.join(" / ");
            issues.push({
              affiliateId: p.id,
              code: "amount-mismatch-with-creative",
              field: cf,
              message: `${cf} promises ${a} but the native creative advertises ${conflicting.join(", ")} — off by a factor of ten.`,
              details: {
                normalizedValue: norm(rec[cf] ?? ""),
                normalizedCompared: norm(culprit),
                tokenDiff: diffTokens(rec[cf], culprit),
                amounts: { config: extractAmounts(rec[cf] ?? ""), creative: [...creativeAmounts] },
              },
            });
          }
        }
      }
    }
  }

  return issues;
}

/**
 * Human-readable report. Each issue prints its headline plus an indented
 * debug line naming the normalized strings, the differing tokens and the
 * parsed amounts — everything needed to fix the copy without re-deriving it.
 */
export function formatIssues(issues: ConfigIssue[], verbose = true): string {
  return issues
    .map((i) => {
      const head = `[${i.code}] ${i.affiliateId}.${i.field}: ${i.message}`;
      if (!verbose || !i.details) return head;
      const d = i.details;
      const lines: string[] = [];
      if (d.tokenDiff) {
        lines.push(`  ↳ ${formatTokenDiff(d.tokenDiff)}`);
      } else {
        lines.push(
          `  ↳ config="${d.normalizedValue}"${d.normalizedCompared ? ` | compared="${d.normalizedCompared}"` : ""}`
        );
      }
      if (d.amounts) {
        lines.push(
          `  ↳ amounts config=[${d.amounts.config.join(", ") || "—"}] creative=[${d.amounts.creative.join(", ") || "—"}]`
        );
      }
      return [head, ...lines].join("\n");
    })
    .join("\n");
}

export default validateAffiliateConfig;
