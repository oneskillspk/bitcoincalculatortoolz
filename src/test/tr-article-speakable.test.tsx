/**
 * Phase F6 — SpeakableSpecification parity & selector integrity (TR articles).
 *
 * For every TR article opting into voice/AI surfacing (`speakable: true`):
 *   1. The EN sibling MUST also be `speakable: true` (so EN/TR parity holds
 *      across `/learn/*` and `/tr/ogrenin/*`).
 *   2. The rendered `<ArticleSchema language="tr">` MUST emit a
 *      SpeakableSpecification JSON-LD block with:
 *        - `inLanguage: "tr"`
 *        - canonical `@id` ending in `#speakable`
 *        - cssSelector entries that exist as real DOM ids on the page:
 *            • the first section id (always present)
 *            • `#faq` when the article ships any FAQs
 *   3. The hard-coded selectors `#overview` / `#faq` from the legacy
 *      implementation are NOT silently emitted when the article doesn't
 *      actually render those ids — the schema must mirror what the
 *      crawler will find in the DOM.
 *
 * If a TR article gains `speakable: true`, the EN counterpart must follow,
 * and the article must have at least one section + ideally a FAQ block so
 * Google's voice-answer surface has something to extract.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { render, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { ArticleSchema } from '@/components/learn/ArticleSchema';
import type { Article } from '@/data/articles';

const ARTICLES_DIR = 'src/data/articles';

function trArticleFiles(): string[] {
  return readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.tr.ts'));
}

function hasSpeakableTrue(src: string): boolean {
  return /speakable\s*:\s*true/.test(src);
}

async function loadArticle(file: string): Promise<Article> {
  // Article modules export `default` from `src/data/articles/<slug>(.tr).ts`.
  const mod = await import(/* @vite-ignore */ `../../${ARTICLES_DIR}/${file}`);
  return mod.default as Article;
}

function extractLdJsonScripts(html: string): unknown[] {
  // Helmet renders into <head> via portals during render(); we read from
  // document.head as the source of truth.
  const nodes = Array.from(
    document.head.querySelectorAll('script[type="application/ld+json"]'),
  );
  const _ = html; // unused — kept for future debug
  const out: unknown[] = [];
  for (const n of nodes) {
    try {
      out.push(JSON.parse(n.textContent || 'null'));
    } catch {
      // skip malformed
    }
  }
  return out;
}

describe('TR article SpeakableSpecification (F6)', () => {
  const trFiles = trArticleFiles().filter((f) =>
    hasSpeakableTrue(readFileSync(join(ARTICLES_DIR, f), 'utf8')),
  );

  it('finds at least one TR article opted into speakable', () => {
    expect(trFiles.length).toBeGreaterThan(0);
  });

  it('every TR speakable article has its EN sibling also speakable: true', () => {
    const failures: string[] = [];
    for (const trFile of trFiles) {
      const enFile = trFile.replace(/\.tr\.ts$/, '.ts');
      const enPath = join(ARTICLES_DIR, enFile);
      let enSrc = '';
      try {
        enSrc = readFileSync(enPath, 'utf8');
      } catch {
        failures.push(`${trFile}: EN sibling missing (${enFile})`);
        continue;
      }
      if (!hasSpeakableTrue(enSrc)) {
        failures.push(`${trFile}: EN sibling ${enFile} lacks speakable: true`);
      }
    }
    expect(failures, failures.join('\n')).toEqual([]);
  });

  it.each(trFiles)(
    '%s emits SpeakableSpecification with TR inLanguage + DOM-matching selectors',
    async (file) => {
      const article = await loadArticle(file);
      expect(article.speakable).toBe(true);
      expect(article.sections.length).toBeGreaterThan(0);

      const canonicalUrl = `https://bitcoincalculator.tools/tr/ogrenin/${article.slug}`;

      // Clean head from prior renders so we only inspect this article's tags.
      document.head.innerHTML = '';

      const { container } = render(
        <HelmetProvider>
          <ArticleSchema
            article={article}
            language="tr"
            canonicalUrl={canonicalUrl}
          />
        </HelmetProvider>,
      );

      // react-helmet-async flushes asynchronously into document.head.
      await waitFor(() => {
        expect(
          document.head.querySelectorAll('script[type="application/ld+json"]')
            .length,
        ).toBeGreaterThan(0);
      });

      const blocks = extractLdJsonScripts(container.innerHTML) as Array<
        Record<string, unknown>
      >;
      const speakable = blocks.find(
        (b) => b && (b as { '@id'?: string })['@id'] === `${canonicalUrl}#speakable`,
      );

      expect(speakable, `no SpeakableSpecification block emitted for ${file}`).toBeTruthy();
      expect(speakable!['@type']).toBe('WebPage');
      expect(speakable!['inLanguage']).toBe('tr');
      expect(speakable!['url']).toBe(canonicalUrl);

      const spec = (speakable as { speakable?: { '@type'?: string; cssSelector?: string[] } })
        .speakable;
      expect(spec).toBeTruthy();
      expect(spec!['@type']).toBe('SpeakableSpecification');
      expect(Array.isArray(spec!.cssSelector)).toBe(true);

      const selectors = spec!.cssSelector!;
      // (1) First entry mirrors the first section's id — the "overview" anchor.
      expect(selectors[0]).toBe(`#${article.sections[0].id}`);
      // (2) #faq present iff the article ships any FAQs.
      if (article.faqs.length > 0) {
        expect(selectors).toContain('#faq');
      } else {
        expect(selectors).not.toContain('#faq');
      }
      // (3) No silent legacy `#overview` when the section id is something else.
      if (article.sections[0].id !== 'overview') {
        expect(selectors).not.toContain('#overview');
      }
    },
  );
});
