/**
 * Static guard: react-helmet-async forbids React component / fragment
 * children inside <Helmet>. Only raw DOM tags are valid. This test scans
 * every TSX file under src/ for <Helmet>…</Helmet> blocks and asserts each
 * direct JSX-element child opens with a lowercase, head-legal tag.
 *
 * If this test fails it means somebody nested a component (PascalCase tag)
 * inside a <Helmet>, which crashes the app at runtime with:
 *   "You may be attempting to nest <Helmet> components within each other"
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const ALLOWED = new Set([
  'meta', 'title', 'link', 'script', 'html', 'body', 'base', 'style', 'noscript',
]);

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '__tests__' || entry.name === '__snapshots__') continue;
      walk(p, out);
    } else if (/\.tsx$/.test(entry.name) && !/\.test\.tsx$/.test(entry.name)) {
      out.push(p);
    }
  }
  return out;
}

// Match top-level child JSX tags: <Foo ... /> or <Foo ...>
const TAG_RE = /<([A-Za-z][A-Za-z0-9_.]*)\b/g;
// Match each <Helmet ...>...</Helmet> body. Tolerates props on the opening tag.
const HELMET_RE = /<Helmet\b[^>]*>([\s\S]*?)<\/Helmet>/g;

interface Violation {
  file: string;
  line: number;
  tag: string;
}

function lineOf(src: string, idx: number): number {
  return src.slice(0, idx).split('\n').length;
}

describe('react-helmet-async nesting guard', () => {
  it('no <Helmet> contains a non-DOM (PascalCase) child component', () => {
    const root = path.resolve(__dirname, '..');
    const files = walk(root);
    const violations: Violation[] = [];

    for (const file of files) {
      let src = fs.readFileSync(file, 'utf8');
      // Strip block, line, and JSX `{/* ... */}` comments so prose that
      // mentions "<Helmet>" or "<GlobalHreflang />" doesn't trip the scanner.
      src = src
        .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
        .replace(/\{\/\*[\s\S]*?\*\/\}/g, (m) => m.replace(/[^\n]/g, ' '))
        .replace(/(^|[^:])\/\/[^\n]*/g, (_m, p1) => p1 + '');
      let m: RegExpExecArray | null;
      HELMET_RE.lastIndex = 0;
      while ((m = HELMET_RE.exec(src))) {
        const body = m[1];
        const bodyOffset = m.index + m[0].indexOf(body);
        let t: RegExpExecArray | null;
        TAG_RE.lastIndex = 0;
        while ((t = TAG_RE.exec(body))) {
          const tag = t[1];
          // Lowercase first char => intrinsic DOM element
          const first = tag[0];
          if (first >= 'a' && first <= 'z') {
            if (!ALLOWED.has(tag)) {
              violations.push({ file: path.relative(root, file), line: lineOf(src, bodyOffset + t.index), tag });
            }
            continue;
          }
          // Uppercase first char => React component. Forbidden.
          violations.push({ file: path.relative(root, file), line: lineOf(src, bodyOffset + t.index), tag });
        }
      }
    }

    if (violations.length) {
      const msg = violations
        .map(v => `  ${v.file}:${v.line}  <${v.tag}> inside <Helmet>`)
        .join('\n');
      throw new Error(
        `Found ${violations.length} component(s) rendered inside <Helmet>. ` +
        `react-helmet-async only accepts raw head DOM tags. ` +
        `Move these components out of <Helmet> (they may have their own <Helmet> internally):\n${msg}`,
      );
    }
    expect(violations).toEqual([]);
  });
});
