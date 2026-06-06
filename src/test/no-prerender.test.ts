/**
 * SPA-only lock-in.
 *
 * Crawler rendering is handled EXTERNALLY by lovablehtml.com. Adding any
 * internal prerender / SSR / SSG machinery would:
 *   - produce duplicate HTML versions of every route
 *   - split hreflang / canonical signals
 *   - introduce hydration mismatches
 *   - risk soft-duplicate penalties
 *
 * This test fails if any banned dependency or plugin appears.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();

const BANNED_PACKAGES = [
  'react-snap',
  'vite-plugin-prerender',
  'vite-plugin-ssr',
  'vite-plugin-ssg',
  'vite-ssg',
  'prerenderer',
  '@prerenderer/prerenderer',
  '@prerenderer/renderer-puppeteer',
  '@prerenderer/rollup-plugin',
  'vike',
  'rendertron',
  'react-snapshot',
];

describe('SPA-only — no internal prerender / SSR / SSG', () => {
  it('package.json has no prerender/SSR dependencies', () => {
    const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
    const all = {
      ...(pkg.dependencies || {}),
      ...(pkg.devDependencies || {}),
      ...(pkg.peerDependencies || {}),
      ...(pkg.optionalDependencies || {}),
    };
    const offenders = BANNED_PACKAGES.filter((name) => name in all);
    expect(
      offenders,
      `Banned prerender/SSR dependencies present: ${offenders.join(', ')}. ` +
      `Crawler rendering is handled externally by lovablehtml.com — the app must remain a pure SPA.`,
    ).toEqual([]);
  });

  it('vite.config.ts does not import or invoke a prerender plugin', () => {
    const cfg = readFileSync(join(ROOT, 'vite.config.ts'), 'utf8');
    for (const name of BANNED_PACKAGES) {
      expect(
        cfg.includes(name),
        `vite.config.ts must not reference banned plugin "${name}".`,
      ).toBe(false);
    }
    // Catch generic patterns too.
    expect(cfg, 'vite.config.ts must not call a prerender plugin').not.toMatch(/prerender\s*\(/i);
  });
});
