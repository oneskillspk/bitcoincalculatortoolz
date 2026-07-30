/**
 * Domain lock-in guard.
 *
 * Production domain is https://bitcoincalculator.tools and ONLY that.
 * Any `.lovable.app` reference in SEO-emitting / shipped surfaces is a
 * regression that would split canonical/hreflang/sitemap signals across
 * two hostnames. This test scans the repo and fails on any new offender.
 *
 * Allow-listed (benign, non-SEO):
 *   - src/main.tsx — runtime hostname check that DISABLES the service worker
 *     on Lovable preview hosts. Emits no SEO output. ALSO REQUIRED for
 *     forward-compatibility with Lovable's built-in prerender migration —
 *     do not remove. See src/test/prerender-compat.test.ts.
 *   - This test file itself (contains the literal string in comments).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();

const SCAN_DIRS = ['src', 'public', 'scripts'];
const SCAN_FILES = ['index.html', 'vercel.json', 'vite.config.ts', 'package.json'];
const EXTENSIONS = /\.(ts|tsx|js|mjs|cjs|json|xml|html|md|yml|yaml|txt)$/;

const ALLOWLIST = new Set([
  'src/main.tsx',                  // SW-suppression hostname check
  'vite.config.ts',                // dev-only CDN asset proxy upstream; emits no SEO signal
  'src/test/domain-lock.test.ts',  // this file
]);

const SKIP_DIRS = new Set(['node_modules', 'dist', '.lovable', 'tmp', '.git']);

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (EXTENSIONS.test(name)) out.push(p);
  }
  return out;
}

describe('Domain lock — bitcoincalculator.tools is the only production domain', () => {
  it('no .lovable.app references in shipped/SEO surfaces', () => {
    const files: string[] = [];
    for (const d of SCAN_DIRS) {
      try { files.push(...walk(join(ROOT, d))); } catch { /* dir missing */ }
    }
    for (const f of SCAN_FILES) {
      try { statSync(join(ROOT, f)); files.push(join(ROOT, f)); } catch { /* missing */ }
    }

    const offenders: string[] = [];
    for (const abs of files) {
      const rel = relative(ROOT, abs).replace(/\\/g, '/');
      if (ALLOWLIST.has(rel)) continue;
      const src = readFileSync(abs, 'utf8');
      if (src.includes('lovable.app')) offenders.push(rel);
    }

    expect(
      offenders,
      `Found .lovable.app references in:\n${offenders.join('\n')}\n` +
      `Production domain is bitcoincalculator.tools only. ` +
      `Add an explicit allow-list entry only if the reference emits no SEO signal.`,
    ).toEqual([]);
  });

  it('sitemap, robots, hreflang, and generators target bitcoincalculator.tools', () => {
    const targets = [
      'public/sitemap.xml',
      'public/robots.txt',
      'src/components/GlobalHreflang.tsx',
      'scripts/generate-sitemap.mjs',
    ];
    for (const t of targets) {
      const src = readFileSync(join(ROOT, t), 'utf8');
      expect(src, `${t} must reference bitcoincalculator.tools`).toMatch(/bitcoincalculator\.tools/);
      expect(src.includes('lovable.app'), `${t} must NOT reference lovable.app`).toBe(false);
    }
  });
});
