import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';

// Parity test: every visible FAQ question (EN and TR) from DrawdownFAQSection
// must appear verbatim in the JSON-LD blob inside BitcoinDrawdownCalculator.tsx.
// This guards against stale schema.org markup drifting from on-page copy.

const pageSrc = readFileSync(
  path.resolve(__dirname, '../../../pages/BitcoinDrawdownCalculator.tsx'),
  'utf8'
);
const faqSrc = readFileSync(
  path.resolve(__dirname, '../DrawdownFAQSection.tsx'),
  'utf8'
);

function extractQuestions(src: string, arrayName: string): string[] {
  // Match the array body between `const arrayName = [` and the closing `];`
  const re = new RegExp(`const\\s+${arrayName}\\s*=\\s*\\[([\\s\\S]*?)\\n\\];`);
  const m = src.match(re);
  if (!m) throw new Error(`Could not locate ${arrayName} in source`);
  const body = m[1];
  // Pull every q: "..." literal (single or double quotes).
  const out: string[] = [];
  const qRe = /q:\s*"((?:\\"|[^"])*)"/g;
  let match: RegExpExecArray | null;
  while ((match = qRe.exec(body)) !== null) {
    out.push(match[1].replace(/\\"/g, '"').replace(/\\'/g, "'"));
  }
  return out;
}

describe('Drawdown FAQ JSON-LD parity', () => {
  const enQuestions = extractQuestions(faqSrc, 'faqsEn');
  const trQuestions = extractQuestions(faqSrc, 'faqsTr');

  it('extracts a non-empty FAQ list', () => {
    expect(enQuestions.length).toBeGreaterThanOrEqual(8);
    expect(trQuestions.length).toBe(enQuestions.length);
  });

  it('every visible EN question appears in the page JSON-LD', () => {
    for (const q of enQuestions) {
      expect(pageSrc, `EN question missing from JSON-LD: ${q}`).toContain(q);
    }
  });

  it('every visible TR question appears in the page JSON-LD', () => {
    for (const q of trQuestions) {
      expect(pageSrc, `TR question missing from JSON-LD: ${q}`).toContain(q);
    }
  });

  it('FAQ JSON-LD declares schema.org FAQPage type', () => {
    expect(pageSrc).toMatch(/"@type":\s*"FAQPage"/);
    expect(pageSrc).toMatch(/"@context":\s*"https:\/\/schema\.org"/);
  });
});
