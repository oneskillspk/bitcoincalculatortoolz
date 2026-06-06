/**
 * Data compression and optimization utilities for Bitcoin price data
 */

import { BitcoinPrice } from './bitcoinApi';

interface CompressedPriceData {
  basePrice: number;
  baseTimestamp: number;
  deltas: number[];
  timestamps: number[];
  metadata: {
    originalLength: number;
    compressionRatio: number;
    version: string;
  };
}

interface DataValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  integrity: {
    priceRange: { min: number; max: number };
    timeRange: { start: string; end: string };
    gaps: number[];
    duplicates: number[];
  };
}

class DataCompressionService {
  private readonly VERSION = '1.0.0';
  private readonly MAX_DELTA = 65535; // 16-bit signed integer range
  private readonly TIMESTAMP_PRECISION = 1000; // Millisecond precision

  /**
   * Compress price data using delta encoding
   */
  compressPriceData(data: BitcoinPrice[]): CompressedPriceData {
    if (!data || data.length === 0) {
      throw new Error('Cannot compress empty price data');
    }

    // Sort by date to ensure proper delta calculation
    const sortedData = [...data].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const basePrice = sortedData[0].price;
    const baseTimestamp = new Date(sortedData[0].date).getTime();
    
    const deltas: number[] = [];
    const timestamps: number[] = [];

    for (let i = 0; i < sortedData.length; i++) {
      const current = sortedData[i];
      const currentTimestamp = new Date(current.date).getTime();
      
      if (i === 0) {
        deltas.push(0);
        timestamps.push(0);
      } else {
        const priceDelta = current.price - sortedData[i - 1].price;
        const timestampDelta = currentTimestamp - new Date(sortedData[i - 1].date).getTime();
        
        // Clamp delta to prevent overflow
        const clampedDelta = Math.max(-this.MAX_DELTA, Math.min(this.MAX_DELTA, priceDelta));
        
        deltas.push(clampedDelta);
        timestamps.push(Math.floor(timestampDelta / this.TIMESTAMP_PRECISION));
      }
    }

    const originalSize = JSON.stringify(data).length;
    const compressedSize = JSON.stringify({ deltas, timestamps, basePrice, baseTimestamp }).length;
    const compressionRatio = originalSize / compressedSize;

    return {
      basePrice,
      baseTimestamp,
      deltas,
      timestamps,
      metadata: {
        originalLength: data.length,
        compressionRatio: Math.round(compressionRatio * 100) / 100,
        version: this.VERSION
      }
    };
  }

  /**
   * Decompress price data from delta encoding
   */
  decompressPriceData(compressed: CompressedPriceData): BitcoinPrice[] {
    const { basePrice, baseTimestamp, deltas, timestamps } = compressed;
    const result: BitcoinPrice[] = [];

    let currentPrice = basePrice;
    let currentTimestamp = baseTimestamp;

    for (let i = 0; i < deltas.length; i++) {
      if (i > 0) {
        currentPrice += deltas[i];
        currentTimestamp += timestamps[i] * this.TIMESTAMP_PRECISION;
      }

      result.push({
        date: new Date(currentTimestamp).toISOString(),
        price: Math.round(currentPrice * 100) / 100 // Round to 2 decimal places
      });
    }

    return result;
  }

  /**
   * Validate price data integrity
   */
  validatePriceData(data: BitcoinPrice[]): DataValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const gaps: number[] = [];
    const duplicates: number[] = [];

    if (!data || !Array.isArray(data)) {
      errors.push('Data must be an array');
      return {
        isValid: false,
        errors,
        warnings,
        integrity: {
          priceRange: { min: 0, max: 0 },
          timeRange: { start: '', end: '' },
          gaps: [],
          duplicates: []
        }
      };
    }

    if (data.length === 0) {
      warnings.push('Empty dataset');
    }

    let minPrice = Infinity;
    let maxPrice = -Infinity;
    let minDate = '';
    let maxDate = '';
    const seenDates = new Set<string>();
    const timestamps: number[] = [];

    // Validate each data point
    data.forEach((item, index) => {
      // Validate structure
      if (!item || typeof item !== 'object') {
        errors.push(`Invalid item at index ${index}: not an object`);
        return;
      }

      if (!item.date || !item.price) {
        errors.push(`Invalid item at index ${index}: missing date or price`);
        return;
      }

      // Validate date
      const date = new Date(item.date);
      if (isNaN(date.getTime())) {
        errors.push(`Invalid date at index ${index}: ${item.date}`);
        return;
      }

      // Check for duplicates
      if (seenDates.has(item.date)) {
        duplicates.push(index);
      } else {
        seenDates.add(item.date);
      }

      // Validate price
      if (typeof item.price !== 'number' || isNaN(item.price) || item.price < 0) {
        errors.push(`Invalid price at index ${index}: ${item.price}`);
        return;
      }

      // Track ranges
      if (item.price < minPrice) minPrice = item.price;
      if (item.price > maxPrice) maxPrice = item.price;
      
      if (!minDate || item.date < minDate) minDate = item.date;
      if (!maxDate || item.date > maxDate) maxDate = item.date;

      timestamps.push(date.getTime());

      // Check for extreme price movements (>50% in one day)
      if (index > 0) {
        const prevPrice = data[index - 1].price;
        const priceChange = Math.abs((item.price - prevPrice) / prevPrice);
        if (priceChange > 0.5) {
          warnings.push(`Large price movement at index ${index}: ${(priceChange * 100).toFixed(1)}%`);
        }
      }
    });

    // Check for time gaps (more than 2 days)
    const sortedTimestamps = [...timestamps].sort((a, b) => a - b);
    for (let i = 1; i < sortedTimestamps.length; i++) {
      const gap = sortedTimestamps[i] - sortedTimestamps[i - 1];
      const dayGap = gap / (1000 * 60 * 60 * 24);
      if (dayGap > 2) {
        gaps.push(i);
      }
    }

    // Additional validations
    if (data.length > 0 && (minPrice === Infinity || maxPrice === -Infinity)) {
      errors.push('Could not determine price range');
    }

    if (duplicates.length > 0) {
      warnings.push(`Found ${duplicates.length} duplicate dates`);
    }

    if (gaps.length > 0) {
      warnings.push(`Found ${gaps.length} time gaps larger than 2 days`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      integrity: {
        priceRange: { min: minPrice === Infinity ? 0 : minPrice, max: maxPrice === -Infinity ? 0 : maxPrice },
        timeRange: { start: minDate, end: maxDate },
        gaps,
        duplicates
      }
    };
  }

  /**
   * Optimize dataset by removing redundant points
   */
  optimizeDataset(data: BitcoinPrice[], tolerance: number = 0.01): BitcoinPrice[] {
    if (!data || data.length <= 2) return data;

    const sortedData = [...data].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const optimized: BitcoinPrice[] = [sortedData[0]]; // Always keep first point

    for (let i = 1; i < sortedData.length - 1; i++) {
      const prev = sortedData[i - 1];
      const current = sortedData[i];
      const next = sortedData[i + 1];

      // Calculate if current point is significant
      const prevChange = Math.abs((current.price - prev.price) / prev.price);
      const nextChange = Math.abs((next.price - current.price) / current.price);
      
      // Keep point if it represents a significant change or is a local extremum
      if (prevChange > tolerance || nextChange > tolerance ||
          (current.price > prev.price && current.price > next.price) || // Local maximum
          (current.price < prev.price && current.price < next.price)) { // Local minimum
        optimized.push(current);
      }
    }

    optimized.push(sortedData[sortedData.length - 1]); // Always keep last point

    return optimized;
  }

  /**
   * Create efficient lookup structure for price data
   */
  createPriceLookupIndex(data: BitcoinPrice[]) {
    const index = new Map<string, number>();
    const sortedData = [...data].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    sortedData.forEach((item, idx) => {
      const dateKey = new Date(item.date).toISOString().split('T')[0]; // YYYY-MM-DD format
      index.set(dateKey, idx);
    });

    return {
      data: sortedData,
      index,
      findPriceByDate: (date: string | Date): BitcoinPrice | null => {
        const dateKey = typeof date === 'string' ? 
          new Date(date).toISOString().split('T')[0] : 
          date.toISOString().split('T')[0];
        
        const idx = index.get(dateKey);
        return idx !== undefined ? sortedData[idx] : null;
      },
      findClosestPrice: (date: string | Date): BitcoinPrice | null => {
        const targetTime = typeof date === 'string' ? new Date(date).getTime() : date.getTime();
        
        let closest = sortedData[0];
        let minDiff = Math.abs(new Date(closest.date).getTime() - targetTime);

        for (const item of sortedData) {
          const diff = Math.abs(new Date(item.date).getTime() - targetTime);
          if (diff < minDiff) {
            minDiff = diff;
            closest = item;
          }
        }

        return closest;
      }
    };
  }
}

export const dataCompressionService = new DataCompressionService();
export type { CompressedPriceData, DataValidationResult };
