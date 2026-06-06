/**
 * Phase D5 — TR OG/meta description length guard (F-OG3, partial F-GV1).
 *
 * Walks the page modules that emit per-page Helmet metadata and asserts:
 *   - every TR `<meta name="description">`  ≤ 160 chars (Google snippet cap)
 *   - every TR `<meta property="og:description">` ≤ 200 chars (OG truncation)
 *   - every TR `<meta name="twitter:description">` ≤ 200 chars
 *
 * Implementation: greps the rendered page source for TR copy inside
 * `language === 'tr' ? '...'` / `tr ? '...'` ternaries that appear next
 * to the relevant meta tags. This is intentionally a source-text guard
 * (cheap, deterministic) rather than a render walk.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const PAGES_DIR = 'src/pages';

// Tags we want to length-check, with their max chars.
const RULES: Array<{
  field: string;
  max: number;
  // Regex group 1 must capture the TR string literal
  matchers: RegExp[];
}> = [
  {
    field: 'title',
    max: 60,
    matchers: [
      // <title>{language === 'tr' ? 'TR title' : 'EN title'}</title>
      /<title>\{(?:language\s*===\s*['"]tr['"]|tr)\s*\?\s*['"]([^'"]+)['"]\s*:/g,
      // <meta property="og:title" content={language === 'tr' ? '...' : '...'} />
      /<meta property="og:title" content=\{(?:language\s*===\s*['"]tr['"]|tr)\s*\?\s*['"]([^'"]+)['"]\s*:/g,
      // <meta name="twitter:title" content={...}
      /<meta name="twitter:title" content=\{(?:language\s*===\s*['"]tr['"]|tr)\s*\?\s*['"]([^'"]+)['"]\s*:/g,
    ],
  },
  {
    field: 'meta description',
    max: 160,
    matchers: [
      /<meta name="description" content=\{(?:language\s*===\s*['"]tr['"]|tr)\s*\?\s*['"]([^'"]+)['"]\s*:/g,
    ],
  },
  {
    field: 'og:description',
    max: 200,
    matchers: [
      /<meta property="og:description" content=\{(?:language\s*===\s*['"]tr['"]|tr)\s*\?\s*['"]([^'"]+)['"]\s*:/g,
    ],
  },
  {
    field: 'twitter:description',
    max: 200,
    matchers: [
      /<meta name="twitter:description" content=\{(?:language\s*===\s*['"]tr['"]|tr)\s*\?\s*['"]([^'"]+)['"]\s*:/g,
    ],
  },
];

function findViolations() {
  const files = readdirSync(PAGES_DIR).filter((f) => f.endsWith('.tsx'));
  const violations: string[] = [];
  for (const file of files) {
    const src = readFileSync(join(PAGES_DIR, file), 'utf8');
    for (const rule of RULES) {
      for (const matcher of rule.matchers) {
        let m: RegExpExecArray | null;
        const re = new RegExp(matcher.source, matcher.flags);
        while ((m = re.exec(src)) !== null) {
          const text = m[1];
          if (text.length > rule.max) {
            violations.push(
              `${file} — TR ${rule.field} is ${text.length}/${rule.max} chars: "${text.slice(0, 80)}…"`,
            );
          }
        }
      }
    }
  }
  return violations;
}

describe('TR description length budgets (D5 / F-OG3)', () => {
  it('every TR per-page meta/og/twitter description fits the SERP+social budget', () => {
    const violations = findViolations();
    expect(violations, violations.join('\n')).toEqual([]);
  });
});
