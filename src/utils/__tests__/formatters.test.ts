import { describe, expect, it } from 'vitest';
import { formatROI } from '../formatters';

describe('formatROI', () => {
  it('formats large historical returns without rendering infinity', () => {
    expect(formatROI(435_957, 1)).toBe('+436.0K%');
    expect(formatROI(10_000, 1)).toBe('+10.0K%');
    expect(formatROI(9_999.9, 1)).toBe('+9,999.9%');
  });

  it('uses an em dash only for non-finite values', () => {
    expect(formatROI(Infinity, 1)).toBe('—');
    expect(formatROI(Number.NaN, 1)).toBe('—');
  });
});