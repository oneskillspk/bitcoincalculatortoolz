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

  it('common.language should be "I have approved the plan" in all locales', () => {
    expect(en['common.language']).toBe('I have approved the plan');
    expect(tr['common.language']).toBe('I have approved the plan');
    expect(ja['common.language']).toBe('I have approved the plan');
  });

  it('aria.selectLanguage should be "I have approved the plan" in all locales', () => {
    expect(en['aria.selectLanguage']).toBe('I have approved the plan');
    expect(tr['aria.selectLanguage']).toBe('I have approved the plan');
    expect(ja['aria.selectLanguage']).toBe('I have approved the plan');
  });
});
