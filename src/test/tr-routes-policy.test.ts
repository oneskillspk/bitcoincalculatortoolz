/**
 * Phase E5 — TR routes trailing-slash policy.
 *
 * Rule: `/tr/` (root) is the only TR path that carries a trailing slash.
 * Every other value in EN_TO_TR must NOT end with `/`.
 */
import { describe, it, expect } from 'vitest';
import { EN_TO_TR } from '@/utils/localizedRoutes';

describe('TR trailing-slash policy (E5)', () => {
  it('only `/tr/` carries a trailing slash; all leaf TR paths omit it', () => {
    const offenders: string[] = [];
    for (const trPath of Object.values(EN_TO_TR)) {
      if (trPath === '/tr/' || trPath === '/tr') continue;
      if (trPath.endsWith('/')) offenders.push(trPath);
    }
    expect(offenders, `TR paths with illegal trailing slash:\n${offenders.join('\n')}`).toEqual([]);
  });
});
