import { describe, it, expect } from 'vitest';
import { getClassification, getColor, calculateTrend } from '../fearGreedService';

describe('fearGreedService', () => {
  it('classification thresholds', () => {
    expect(getClassification(0)).toBe('Extreme Fear');
    expect(getClassification(24)).toBe('Extreme Fear');
    expect(getClassification(25)).toBe('Fear');
    expect(getClassification(44)).toBe('Fear');
    expect(getClassification(50)).toBe('Neutral');
    expect(getClassification(56)).toBe('Greed');
    expect(getClassification(75)).toBe('Greed');
    expect(getClassification(80)).toBe('Extreme Greed');
  });

  it('color matches classification', () => {
    expect(getColor(10)).toBe('#ea384c'); // extreme fear
    expect(getColor(80)).toBe('#16a34a'); // extreme greed
  });

  it('calculateTrend: single point returns stable', () => {
    const t = calculateTrend([{ value: 50, classification: 'Neutral', timestamp: 0, date: '2026-01-01' }]);
    expect(t.direction).toBe('stable');
    expect(t.avg7d).toBe(50);
  });

  it('calculateTrend: 7-day delta > 3 → improving', () => {
    // data[0] is most recent. delta7d = data[0].value - data[6].value.
    const data = Array.from({ length: 7 }).map((_, i) => ({
      value: 70 - i * 5,             // 70, 65, 60, 55, 50, 45, 40
      classification: '',
      timestamp: i,
      date: `2026-01-0${7 - i}`,
    }));
    const t = calculateTrend(data);
    expect(t.delta7d).toBe(30);
    expect(t.direction).toBe('improving');
  });

  it('calculateTrend: large negative delta → declining', () => {
    const data = Array.from({ length: 7 }).map((_, i) => ({
      value: 30 + i * 5,             // 30 latest, 60 a week ago
      classification: '',
      timestamp: i,
      date: `2026-01-0${7 - i}`,
    }));
    const t = calculateTrend(data);
    expect(t.delta7d).toBe(-30);
    expect(t.direction).toBe('declining');
  });

  it('calculateTrend: avg7d is mean of first 7 entries', () => {
    const data = Array.from({ length: 10 }).map((_, i) => ({
      value: 50,
      classification: '',
      timestamp: i,
      date: `2026-01-${String(10 - i).padStart(2, '0')}`,
    }));
    const t = calculateTrend(data);
    expect(t.avg7d).toBe(50);
    expect(t.avg30d).toBe(50);
  });
});
