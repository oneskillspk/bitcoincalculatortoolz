/**
 * Regression test: runs the same static audit that scripts/audit-input-mode.mjs
 * runs in CI, but from inside Vitest so it shows up in the unit-test suite.
 *
 * Asserts that every numeric <input>/<Input> in the codebase declares
 * inputMode so mobile devices render the numeric keypad.
 */
import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

describe('inputMode coverage', () => {
  it('every numeric input declares inputMode', () => {
    const script = resolve(__dirname, '../../scripts/audit-input-mode.mjs');
    let output = '';
    let failed = false;
    try {
      output = execFileSync('node', [script], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      });
    } catch (err) {
      failed = true;
      const e = err as { stdout?: string; stderr?: string };
      output = (e.stdout ?? '') + (e.stderr ?? '');
    }
    expect(failed, `inputMode audit reported violations:\n${output}`).toBe(false);
  });
});
