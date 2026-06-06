import { describe, it, expect } from 'vitest';
import {
  getDaysSinceGenesis,
  getRegressionPrice,
  getAllBandPrices,
  getCurrentBand,
  BANDS,
  HALVING_DATES,
} from '../rainbowChartService';

// Reference: log10(price) = 5.84 * log10(daysSinceGenesis) - 17.01 + bandOffset
//   Genesis = 2009-01-03 UTC

describe('rainbowChartService', () => {
  it('getDaysSinceGenesis: ~5840 days on 2025-01-03', () => {
    const days = getDaysSinceGenesis(new Date('2025-01-03T00:00:00Z'));
    expect(days).toBeCloseTo(5844, 0);
  });

  it('getDaysSinceGenesis: genesis = 0', () => {
    expect(getDaysSinceGenesis(new Date('2009-01-03T00:00:00Z'))).toBeCloseTo(0, 6);
  });

  it('getRegressionPrice matches log10(p)=5.84·log10(d)-17.01 closed form', () => {
    const d = new Date('2024-01-01T00:00:00Z');
    const days = getDaysSinceGenesis(d);
    const expected = Math.pow(10, 5.84 * Math.log10(days) - 17.01);
    expect(getRegressionPrice(d, 0)).toBeCloseTo(expected, 4);
  });

  it('band offset shifts log price by +offset', () => {
    const d = new Date('2024-01-01T00:00:00Z');
    const base = getRegressionPrice(d, 0);
    const shifted = getRegressionPrice(d, 0.5);
    expect(Math.log10(shifted) - Math.log10(base)).toBeCloseTo(0.5, 6);
  });

  it('getAllBandPrices: returns one entry per BAND, increasing in offset = increasing price', () => {
    const prices = getAllBandPrices(new Date('2024-01-01T00:00:00Z'));
    expect(prices).toHaveLength(BANDS.length);
    // Highest band (offset 0.63) should have highest price
    const sortedByOffset = [...BANDS].sort((a, b) => a.offset - b.offset);
    const lowestPrice = getRegressionPrice(new Date('2024-01-01T00:00:00Z'), sortedByOffset[0].offset);
    const highestPrice = getRegressionPrice(new Date('2024-01-01T00:00:00Z'), sortedByOffset.at(-1)!.offset);
    expect(highestPrice).toBeGreaterThan(lowestPrice);
  });

  it('getCurrentBand: extremely low price → "Below Rainbow"', () => {
    const b = getCurrentBand(1, new Date('2024-01-01T00:00:00Z'));
    expect(b.bandIndex).toBe(0);
    expect(b.name).toBe('Below Rainbow');
  });

  it('getCurrentBand: extremely high price → top band (Maximum Bubble Territory)', () => {
    const b = getCurrentBand(10_000_000, new Date('2024-01-01T00:00:00Z'));
    expect(b.bandIndex).toBe(9);
    expect(b.name).toMatch(/Maximum Bubble/);
  });

  it('HALVING_DATES are chronologically ordered and span H1..H5', () => {
    expect(HALVING_DATES).toHaveLength(5);
    for (let i = 1; i < HALVING_DATES.length; i++) {
      expect(HALVING_DATES[i].date > HALVING_DATES[i - 1].date).toBe(true);
    }
  });
});
