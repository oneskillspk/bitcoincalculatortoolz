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
import { normalizeText, normalizeAmount, textIncludes } from "./textNormalize";

export type ConfigIssueCode =
  | "category-in-badge"
  | "badge-repeated-in-copy"
  | "duplicate-badge-across-partners"
  | "amount-mismatch-with-creative"
  | "cta-trailing-arrow";

export interface ConfigIssue {
  affiliateId: string;
  code: ConfigIssueCode;
  field: string;
  message: string;
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

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();

/** Extract money-ish amounts ("$200", "8,000 USDT", "€79") from copy. */
export function extractAmounts(text: string): string[] {
  if (!text) return [];
  const out = new Set<string>();
  const re = /(?:[$€£₺]\s?)(\d[\d.,]*)\s?(k|m)?|(\d[\d.,]*)\s?(usdt|usd|eur|try|btc)\b/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const raw = (m[1] ?? m[3] ?? "").replace(/[.,](?=\d{3}\b)/g, "");
    if (!raw) continue;
    const mult = (m[2] || "").toLowerCase();
    let n = Number(raw.replace(/,/g, ""));
    if (!Number.isFinite(n)) continue;
    if (mult === "k") n *= 1_000;
    if (mult === "m") n *= 1_000_000;
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
        });
      }

      // 2. badge text echoed inside CTA/description of the same partner
      for (const cf of COPY_FIELDS) {
        const copy = norm(rec[cf] ?? "");
        if (copy && nb.length > 4 && copy.includes(nb)) {
          issues.push({
            affiliateId: p.id,
            code: "badge-repeated-in-copy",
            field: cf,
            message: `"${badge}" appears both in ${field} and ${cf} — duplicate badge text on one card.`,
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
        });
      }
    }

    // 4. amounts promised in copy vs amounts printed on the native creative
    const creativeAmounts = new Set<string>();
    for (const c of p.creatives ?? []) {
      for (const a of extractAmounts(c.alt ?? "")) creativeAmounts.add(a);
    }
    if (creativeAmounts.size > 0) {
      for (const cf of ["badge_en", "badge_tr", "cta_short_en", "cta_long_en"] as const) {
        for (const a of extractAmounts(rec[cf] ?? "")) {
          // Only the order-of-magnitude class of bug counts (Coinbase's
          // "$2,000" vs the creative's "$200"). A partner legitimately runs
          // several unrelated offers, so unrelated amounts are not errors.
          const conflicting = [...creativeAmounts].some((c) => isTenfold(Number(c), Number(a)));
          if (conflicting) {
            issues.push({
              affiliateId: p.id,
              code: "amount-mismatch-with-creative",
              field: cf,
              message: `${cf} promises ${a} but the native creative advertises ${[...creativeAmounts].join(", ")} — off by a factor of ten.`,
            });
          }
        }
      }
    }
  }

  return issues;
}

export function formatIssues(issues: ConfigIssue[]): string {
  return issues.map((i) => `[${i.code}] ${i.affiliateId}.${i.field}: ${i.message}`).join("\n");
}

export default validateAffiliateConfig;
