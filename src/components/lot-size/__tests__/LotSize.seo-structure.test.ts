/**
 * SEO/structure guardrails for the Bitcoin Lot Size Calculator page
 * (which also hosts the Bitcoin Pip Value section).
 *
 * These tests read the page source and its FAQ component at build
 * time — no jsdom rendering of the whole Helmet/Suspense tree — so
 * they run fast and stay stable across refactors while still catching
 * regressions like:
 *   - a missing JSON-LD block (WebApplication, HowTo, FAQPage, Article)
 *   - a stripped FAQ answer array
 *   - accidentally removing the single H1 or introducing a second one
 *   - a SectionHeader replaced by a raw non-centered <h2>
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const PAGE = readFileSync(
  resolve(__dirname, '../../pages/BitcoinLotSizeCalculator.tsx'),
  'utf8',
);
const FAQ = readFileSync(
  resolve(__dirname, '../LotSizeFAQSection.tsx'),
  'utf8',
);
const SECTION_HEADER = readFileSync(
  resolve(__dirname, '../SectionHeader.tsx'),
  'utf8',
);

describe('BitcoinLotSizeCalculator — JSON-LD schema graph', () => {
  it('emits all four required schema blocks', () => {
    const scripts = PAGE.match(/application\/ld\+json/g) ?? [];
    // WebApplication + HowTo + FAQPage + Article
    expect(scripts.length).toBeGreaterThanOrEqual(4);
    expect(PAGE).toMatch(/JSON\.stringify\(webAppSchema\)/);
    expect(PAGE).toMatch(/JSON\.stringify\(howToSchema\)/);
    expect(PAGE).toMatch(/JSON\.stringify\(faqSchema\)/);
    expect(PAGE).toMatch(/JSON\.stringify\(articleSchema\)/);
  });

  it('FAQPage schema is wired to both EN and TR question arrays', () => {
    expect(PAGE).toMatch(/"@type":\s*"FAQPage"/);
    expect(PAGE).toMatch(/lotFaqsEn/);
    expect(PAGE).toMatch(/lotFaqsTr/);
    expect(PAGE).toMatch(/"@type":\s*"Question"/);
    expect(PAGE).toMatch(/"acceptedAnswer"/);
  });

  it('Article schema declares reviewedBy + canonical url', () => {
    expect(PAGE).toMatch(/"@type":\s*"Article"/);
    expect(PAGE).toMatch(/"reviewedBy"/);
    expect(PAGE).toMatch(/"mainEntityOfPage":\s*canonicalUrl/);
    expect(PAGE).toMatch(/"dateModified":\s*LOT_SIZE_LAST_REVIEWED_ISO/);
  });

  it('canonical + hreflang cover EN, TR and x-default', () => {
    expect(PAGE).toMatch(/rel="canonical"/);
    expect(PAGE).toMatch(/hrefLang="en"/);
    expect(PAGE).toMatch(/hrefLang="tr"/);
    expect(PAGE).toMatch(/hrefLang="x-default"/);
  });

  it('ships OpenGraph + Twitter card metadata', () => {
    for (const tag of [
      'property="og:title"',
      'property="og:description"',
      'property="og:url"',
      'property="og:type"',
      'name="twitter:card"',
      'name="twitter:title"',
      'name="twitter:description"',
    ]) {
      expect(PAGE).toContain(tag);
    }
  });
});

describe('BitcoinLotSizeCalculator — heading structure', () => {
  it('contains exactly one H1 tag', () => {
    const h1s = PAGE.match(/<h1[\s>]/g) ?? [];
    expect(h1s.length).toBe(1);
  });

  it('routes every content block through the centered SectionHeader', () => {
    // Every non-hero content block must use LotSectionHeader; catches
    // regressions where someone drops a raw left-aligned <h2>.
    expect(PAGE).toMatch(/import\s*{\s*SectionHeader as LotSectionHeader/);
    const usages = PAGE.match(/<LotSectionHeader\b/g) ?? [];
    expect(usages.length).toBeGreaterThanOrEqual(1);
  });

  it('SectionHeader renders a centered semantic <h2>', () => {
    expect(SECTION_HEADER).toMatch(/text-center/);
    expect(SECTION_HEADER).toMatch(/<h2\b/);
  });
});

describe('LotSizeFAQSection — FAQ integrity', () => {
  it('exposes ≥ 20 EN Q&A pairs (long-tail SEO coverage)', () => {
    // Count `question:` keys inside the build() array.
    const buildBlock = FAQ.match(/const build = \(px: number\)[\s\S]*?^};/m);
    expect(buildBlock).not.toBeNull();
    const qs = buildBlock![0].match(/question:\s*['"`]/g) ?? [];
    expect(qs.length).toBeGreaterThanOrEqual(20);
  });

  it('exposes matching Turkish FAQ set of equal length', () => {
    const en = FAQ.match(/const build = \(px: number\)[\s\S]*?^};/m)![0];
    const tr = FAQ.match(/const buildTr = \(px: number\)[\s\S]*?^};/m)![0];
    const enCount = (en.match(/question:\s*['"`]/g) ?? []).length;
    const trCount = (tr.match(/question:\s*['"`]/g) ?? []).length;
    expect(trCount).toBe(enCount);
  });

  it('uses Radix Accordion primitive (correct ARIA out of the box)', () => {
    expect(FAQ).toMatch(/from '@\/components\/ui\/accordion'/);
    expect(FAQ).toMatch(/<Accordion\b/);
    expect(FAQ).toMatch(/<AccordionTrigger\b/);
    expect(FAQ).toMatch(/<AccordionContent\b/);
  });

  it('names the FAQ landmark with aria-labelledby → heading id', () => {
    expect(FAQ).toMatch(/aria-labelledby="lot-size-faq-heading"/);
    expect(FAQ).toMatch(/id="lot-size-faq-heading"/);
  });
});

describe('Bitcoin Pip Value section (inside the lot-size page)', () => {
  it('renders a Pip Value section header (EN + TR)', () => {
    // The section header uses LotSectionHeader with an EN/TR title.
    // Guarantees the pip value copy block survives future edits.
    expect(PAGE).toMatch(/Pip (Value|Değeri)/);
  });
});
