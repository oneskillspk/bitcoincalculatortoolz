import { describe, it, expect } from 'vitest';
import { formatArticleDateShort, formatReadingTime } from '@/utils/articleLocale';

describe('formatArticleDateShort', () => {
  it('formats EN with short month', () => {
    expect(formatArticleDateShort('2026-01-18', 'en')).toMatch(/Jan 18, 2026/);
  });
  it('formats TR with Turkish month abbreviation', () => {
    const out = formatArticleDateShort('2026-01-18', 'tr');
    // tr-TR short month for January is "Oca"
    expect(out).toMatch(/Oca/);
    expect(out).toMatch(/2026/);
    expect(out).toMatch(/18/);
  });
});

describe('formatReadingTime', () => {
  it('short EN', () => expect(formatReadingTime(5, 'en')).toBe('5 min'));
  it('short TR', () => expect(formatReadingTime(5, 'tr')).toBe('5 dk'));
  it('long EN', () => expect(formatReadingTime(7, 'en', 'long')).toBe('7 min read'));
  it('long TR', () => expect(formatReadingTime(7, 'tr', 'long')).toBe('7 dk okuma'));
});
