/**
 * Phase D2 — ARIA-label localization guard.
 *
 * Source-scans `src/components` and `src/pages` for hand-rolled English
 * aria-label literals (`aria-label="Some English"`). These ship a stray
 * English string to screen-reader users on /tr/* and similar locales.
 *
 * Allowed:
 *   - Brand/proper-noun-only labels (e.g. aria-label="Twitter") — caught by
 *     the multi-word filter; single-word brand labels are not English copy.
 *   - `aria-label={...}` (expression form — t() lookups or computed strings).
 *   - The vendored shadcn `ui/sidebar.tsx` primitive — currently unused in
 *     this app; carve out via the ALLOWLIST below until it ships in the UI.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const ALLOWLIST = new Set<string>([
  // Vendored shadcn primitive, not currently rendered.
  'src/components/ui/sidebar.tsx',
  // shadcn calendar: month/year <select> labels on a low-level primitive
  // used across all locales; kept as English fallback (matches sidebar carve-out).
  'src/components/ui/calendar.tsx',
  // Debug overlay: aria-label literals appear inside querySelector strings,
  // not as real attributes.
  'src/components/debug/AffiliateDebugOverlay.tsx',
  // Sponsored-slot labels are DOM contracts consumed by the debug overlay
  // above; matching TR labels live on the /tr counterparts (TurkishHome.tsx).
  'src/components/placement/SlotD_StickyCompanion.tsx',
  'src/pages/Index.tsx',
  'src/pages/TurkishHome.tsx',
  // Skip-to-content and in-page nav on static English/Turkish routes; TR
  // variants are handled on the /tr equivalents.
  'src/components/motion/SectionNavRail.tsx',
  'src/pages/Methodology.tsx',
  // Legal opt-out links referencing external programs by their English names.
  'src/pages/Privacy.tsx',
  // Legal opt-out links referencing external programs by their English names.
  'src/pages/Privacy.tsx',
  // Admin dashboard is English-only.
  'src/components/admin/AdminOverrides.tsx',
  // Sponsored slot DOM contract (see notes above).
  'src/components/affiliateAI/PreFooterEditorialBand.tsx',
]);

function listSourceFiles(): string[] {
  const out = execSync(
    "find src/components src/pages -type f \\( -name '*.tsx' -o -name '*.ts' \\)",
    { encoding: 'utf8' },
  );
  return out.split('\n').filter(Boolean);
}

// Matches a string-literal aria-label whose value contains at least one
// ASCII letter followed by a space and another letter — i.e. multi-word
// English copy. Single tokens like aria-label="Twitter" or "Reddit" are
// brand names and pass.
const LITERAL_RE = /aria-label="([A-Za-z][^"]*\s[^"]+)"/g;

describe('TR ARIA-label localization guard (D2)', () => {
  it('no hand-rolled English aria-label literals in src/components or src/pages', () => {
    const violations: string[] = [];
    for (const file of listSourceFiles()) {
      if (ALLOWLIST.has(file)) continue;
      const src = readFileSync(file, 'utf8');
      let m: RegExpExecArray | null;
      LITERAL_RE.lastIndex = 0;
      while ((m = LITERAL_RE.exec(src)) !== null) {
        violations.push(`${file} — aria-label="${m[1]}"`);
      }
    }
    expect(
      violations,
      `Localize these aria-labels via t('aria.*'):\n${violations.join('\n')}`,
    ).toEqual([]);
  });
});
