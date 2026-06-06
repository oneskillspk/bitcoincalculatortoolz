/**
 * Lovable prerender forward-compatibility guard.
 *
 * We currently use a 3rd-party prerender service, but plan to migrate to
 * Lovable's built-in prerender (React + Vite track, see
 * https://docs.lovable.dev/features/seo-aeo) in a future release. The
 * invariants asserted here are required for that migration to succeed —
 * do NOT remove the referenced code, even if it looks unused today.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8');

describe('Lovable prerender forward-compatibility', () => {
  it('main.tsx keeps the Lovable preview-host SW-suppression branch', () => {
    const src = read('src/main.tsx');
    // Required for prerender hosts so the SW never serves stale shells to crawlers.
    expect(src).toMatch(/lovable\.app/);
    expect(src).toMatch(/id-preview--/);
    expect(src).toMatch(/lovableproject\.com/);
    expect(src).toMatch(/unregister/);
  });

  it('main.tsx still wires BrowserRouter + HelmetProvider at the root', () => {
    const src = read('src/main.tsx');
    expect(src).toMatch(/BrowserRouter/);
    expect(src).toMatch(/HelmetProvider/);
  });

  it('crawler-discovery files are present in public/', () => {
    expect(existsSync(join(ROOT, 'public/robots.txt'))).toBe(true);
    expect(existsSync(join(ROOT, 'public/sitemap.xml'))).toBe(true);
    expect(existsSync(join(ROOT, 'public/llms.txt'))).toBe(true);
  });

  it('SEO-emitting components do not touch window/document at module top level', () => {
    const files = [
      'src/components/GlobalHreflang.tsx',
      'src/components/LocaleMeta.tsx',
      'src/components/seo/BreadcrumbSchema.tsx',
    ];
    for (const f of files) {
      const src = read(f);
      // Strip everything from the first component/function body onward,
      // then check the remaining module-top-level scope.
      const topLevel = src.split(/export\s+(?:const|function|default)/)[0];
      expect(topLevel, `${f} must not reference window at module top level`).not.toMatch(/\bwindow\./);
      expect(topLevel, `${f} must not reference document at module top level`).not.toMatch(/\bdocument\./);
    }
  });

  it('GlobalHreflang renders deterministically from pathname (no Date.now/Math.random)', () => {
    const src = read('src/components/GlobalHreflang.tsx');
    expect(src).not.toMatch(/Date\.now\(/);
    expect(src).not.toMatch(/Math\.random\(/);
  });
});
