import { describe, it, expect } from 'vitest';
import { parseLocaleNumber, formatLocaleNumber } from '../parseLocaleNumber';

describe('parseLocaleNumber', () => {
  describe('en-US', () => {
    it('parses plain integers', () => {
      expect(parseLocaleNumber('1000', 'en-US')).toBe(1000);
    });
    it('parses dotted decimals', () => {
      expect(parseLocaleNumber('1.5', 'en-US')).toBe(1.5);
    });
    it('strips comma thousands', () => {
      expect(parseLocaleNumber('1,234.56', 'en-US')).toBe(1234.56);
    });
    it('handles negative', () => {
      expect(parseLocaleNumber('-1,000.25', 'en-US')).toBe(-1000.25);
    });
  });

  describe('tr-TR', () => {
    it('parses TR decimal comma', () => {
      expect(parseLocaleNumber('1,5', 'tr-TR')).toBe(1.5);
    });
    it('parses TR thousands dot + decimal comma', () => {
      expect(parseLocaleNumber('1.234,56', 'tr-TR')).toBe(1234.56);
    });
    it('strips multiple thousands dots', () => {
      expect(parseLocaleNumber('1.234.567,89', 'tr-TR')).toBe(1234567.89);
    });
    it('plain integers are unaffected', () => {
      expect(parseLocaleNumber('1000', 'tr-TR')).toBe(1000);
    });
  });

  it('returns NaN for empty/garbage', () => {
    expect(parseLocaleNumber('', 'en-US')).toBeNaN();
    expect(parseLocaleNumber('abc', 'en-US')).toBeNaN();
    expect(parseLocaleNumber(null)).toBeNaN();
  });

  it('passes numbers through', () => {
    expect(parseLocaleNumber(42, 'tr-TR')).toBe(42);
  });
});

describe('formatLocaleNumber', () => {
  it('uses TR separators', () => {
    expect(formatLocaleNumber(1234.56, 'tr-TR')).toMatch(/1\.234,56/);
  });
  it('uses US separators', () => {
    expect(formatLocaleNumber(1234.56, 'en-US')).toBe('1,234.56');
  });
});
