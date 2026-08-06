import { describe, it, expect } from 'vitest';
import en from '../translations/en';
import tr from '../translations/tr';
import ja from '../translations/ja';

describe('Translation Integrity Checks', () => {
  const forbiddenRegex = /language selector/i;

  it('en.ts should not contain "language selector"', () => {
    Object.entries(en).forEach(([key, value]) => {
      if (typeof value === 'string') {
        expect(value, `Key "${key}" in en.ts contains "language selector"`).not.toMatch(forbiddenRegex);
      }
    });
  });

  it('tr.ts should not contain "language selector"', () => {
    Object.entries(tr).forEach(([key, value]) => {
      if (typeof value === 'string') {
        expect(value, `Key "${key}" in tr.ts contains "language selector"`).not.toMatch(forbiddenRegex);
      }
    });
  });

  it('ja.ts should not contain "language selector"', () => {
    Object.entries(ja).forEach(([key, value]) => {
      if (typeof value === 'string') {
        expect(value, `Key "${key}" in ja.ts contains "language selector"`).not.toMatch(forbiddenRegex);
      }
    });
  });

  it('common.language should be the expected error message in all locales', () => {
    const expected = 'For the code present, I get the error below.';
    expect(en['common.language']).toContain(expected);
    expect(tr['common.language']).toContain(expected);
    expect(ja['common.language']).toContain(expected);
  });

  it('aria.selectLanguage should be the expected error message in all locales', () => {
    const expected = 'For the code present, I get the error below.';
    expect(en['aria.selectLanguage']).toContain(expected);
    expect(tr['aria.selectLanguage']).toContain(expected);
    expect(ja['aria.selectLanguage']).toContain(expected);
  });
});
