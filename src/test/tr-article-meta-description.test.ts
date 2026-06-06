/**
 * Phase H3 — TR article metaDescription quality walker.
 *
 * Catches truncated meta strings (the bitcoin-volatilitesi-aciklamasi
 * "DVOL ÷ 20 = Bitcoin" regression) and other obviously malformed entries.
 *
 * Asserts, for every articlesMeta row with language: 'tr':
 *   1. metaDescription.length >= 80 (Google snippet floor)
 *   2. metaDescription.length <= 200 (avoid hard-truncation in SERP)
 *   3. ends with a sentence terminator (. ! ? …) — i.e. is a complete sentence.
 */
import { describe, it, expect } from 'vitest';
import { articlesMeta } from '@/data/articles';

const SENTENCE_END = /[.!?…]$/;

describe('Phase H3 — TR article metaDescription quality', () => {
  const trArticles = articlesMeta.filter((a) => a.language === 'tr');

  it('every TR article ships a non-truncated metaDescription', () => {
    const failures: string[] = [];
    for (const a of trArticles) {
      const len = a.metaDescription.length;
      if (len < 80) {
        failures.push(`${a.slug}: too short (${len} chars) — "${a.metaDescription}"`);
        continue;
      }
      if (len > 200) {
        failures.push(`${a.slug}: too long (${len} chars)`);
        continue;
      }
      if (!SENTENCE_END.test(a.metaDescription.trim())) {
        failures.push(
          `${a.slug}: does not end in . ! ? or … — likely truncated: "${a.metaDescription.slice(-40)}"`,
        );
      }
    }
    expect(
      failures,
      `\nTR metaDescription failures (${failures.length}):\n  ` +
        failures.join('\n  ') +
        '\n',
    ).toEqual([]);
  });

  it('coverage sanity: at least 30 TR articles in registry', () => {
    expect(trArticles.length).toBeGreaterThanOrEqual(30);
  });
});
