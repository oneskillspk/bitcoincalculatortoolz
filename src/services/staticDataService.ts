/**
 * Static Bitcoin Price Data Service
 * Provides historical Bitcoin price data from static JSON file for offline functionality
 */

interface StaticPriceData {
  date: string;
  price: number;
}

export interface StaticLatestPrice {
  date: string;
  priceUsd: number;
  source?: string;
}

interface StaticDataset {
  version: string;
  lastUpdated: string;
  latest?: StaticLatestPrice;
  data: Record<string, StaticPriceData[]>;
}


class StaticDataService {
  private dataset: StaticDataset | null = null;
  private loadPromise: Promise<void> | null = null;

  async loadDataset(): Promise<void> {
    if (this.dataset) return;
    
    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = this.fetchDataset();
    return this.loadPromise;
  }

  private async fetchDataset(): Promise<void> {
    try {
      const response = await fetch('/data/bitcoin_prices_v1.json');
      if (!response.ok) {
        throw new Error(`Failed to load static dataset: ${response.status}`);
      }
      this.dataset = await response.json();
      console.log('Static Bitcoin price dataset loaded:', this.dataset?.version);
    } catch (error) {
      console.error('Error loading static dataset:', error);
      throw error;
    }
  }

  async getHistoricalPrice(date: Date): Promise<number | null> {
    await this.loadDataset();
    if (!this.dataset) return null;

    const year = date.getFullYear().toString();
    const yearData = this.dataset.data[year];
    
    if (!yearData || yearData.length === 0) {
      return null;
    }

    const targetDate = date.toISOString().split('T')[0];
    
    // Find exact match first
    const exactMatch = yearData.find(item => item.date === targetDate);
    if (exactMatch) {
      return exactMatch.price;
    }

    // Find closest date (interpolation)
    const sortedData = yearData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const targetTime = date.getTime();
    
    let closestBefore: StaticPriceData | null = null;
    let closestAfter: StaticPriceData | null = null;
    
    for (const item of sortedData) {
      const itemDate = new Date(item.date);
      const itemTime = itemDate.getTime();
      
      if (itemTime <= targetTime) {
        closestBefore = item;
      } else if (itemTime > targetTime && !closestAfter) {
        closestAfter = item;
        break;
      }
    }

    // Simple interpolation between two dates
    if (closestBefore && closestAfter) {
      const beforeTime = new Date(closestBefore.date).getTime();
      const afterTime = new Date(closestAfter.date).getTime();
      const ratio = (targetTime - beforeTime) / (afterTime - beforeTime);
      
      return closestBefore.price + (closestAfter.price - closestBefore.price) * ratio;
    }

    // Return closest available price
    if (closestBefore) return closestBefore.price;
    if (closestAfter) return closestAfter.price;
    
    return null;
  }

  async getPriceRange(startDate: Date, endDate: Date): Promise<StaticPriceData[]> {
    await this.loadDataset();
    if (!this.dataset) return [];

    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    const result: StaticPriceData[] = [];
    
    for (let year = startYear; year <= endYear; year++) {
      const yearData = this.dataset.data[year.toString()];
      if (!yearData) continue;
      
      for (const item of yearData) {
        const itemDate = new Date(item.date);
        if (itemDate >= startDate && itemDate <= endDate) {
          result.push(item);
        }
      }
    }

    // Fill gaps with interpolated data for better charts
    if (result.length < 10) {
      const interpolated = this.interpolatePriceRange(startDate, endDate, result);
      return interpolated;
    }

    return result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  private interpolatePriceRange(startDate: Date, endDate: Date, existingData: StaticPriceData[]): StaticPriceData[] {
    if (existingData.length === 0) return [];

    const sortedData = existingData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const result: StaticPriceData[] = [...sortedData];
    
    const startPrice = sortedData[0].price;
    const endPrice = sortedData[sortedData.length - 1].price;
    const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Add interpolated points for smoother chart
    const pointsToAdd = Math.min(20, Math.max(5, Math.floor(totalDays / 30)));
    
    for (let i = 1; i < pointsToAdd; i++) {
      const ratio = i / pointsToAdd;
      const interpolatedDate = new Date(startDate.getTime() + ratio * (endDate.getTime() - startDate.getTime()));
      const interpolatedPrice = startPrice + (endPrice - startPrice) * ratio;
      
      result.push({
        date: interpolatedDate.toISOString().split('T')[0],
        price: interpolatedPrice
      });
    }
    
    return result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  /**
   * Last-resort "latest known price" used when every live transport and the
   * offline cache are unavailable. Never throws.
   */
  async getLatestPrice(): Promise<StaticLatestPrice | null> {
    try {
      await this.loadDataset();
    } catch {
      return null;
    }
    if (!this.dataset) return null;
    if (this.dataset.latest?.priceUsd) return this.dataset.latest;

    const years = Object.keys(this.dataset.data).sort();
    for (let i = years.length - 1; i >= 0; i--) {
      const rows = this.dataset.data[years[i]];
      if (rows?.length) {
        const last = [...rows].sort((a, b) => a.date.localeCompare(b.date)).pop()!;
        return { date: last.date, priceUsd: last.price };
      }
    }
    return null;
  }

  isDataAvailable(): boolean {

    return this.dataset !== null;
  }

  getDatasetInfo(): { version: string; lastUpdated: string } | null {
    if (!this.dataset) return null;
    return {
      version: this.dataset.version,
      lastUpdated: this.dataset.lastUpdated
    };
  }
}

export const staticDataService = new StaticDataService();