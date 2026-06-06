export interface BitcoinObituary {
  id: string;
  date: string;
  headline: string;
  quote: string;
  source: string;
  sourceType: 'media' | 'expert' | 'institution' | 'government';
  btcPriceAtTime: number;
  isFamous: boolean;
  url?: string;
}

export interface FilterOptions {
  dateRange?: { start: string; end: string };
  sourceTypes?: string[];
  priceRange?: { min: number; max: number };
  searchQuery?: string;
}

export interface ObituariesResult {
  totalCount: number;
  filteredObituaries: BitcoinObituary[];
  avgPriceAtObituary: number;
  currentBtcPrice: number;
  avgROI: number;
  mostActiveYear: { year: number; count: number };
  topSources: { source: string; count: number }[];
  yearlyBreakdown: { year: number; count: number }[];
}

export class BitcoinObituariesService {
  private static obituariesData: BitcoinObituary[] = [];
  private static dataLoaded = false;

  static async loadData(): Promise<void> {
    if (this.dataLoaded) return;

    // Relative URLs aren't valid under Node/SSR/tests; skip fetch off-browser.
    if (typeof window === 'undefined') {
      this.obituariesData = [];
      this.dataLoaded = true;
      return;
    }

    try {
      const response = await fetch('/data/bitcoin_obituaries_v1.json');
      const data = await response.json();
      this.obituariesData = Array.isArray(data?.obituaries) ? data.obituaries : [];
      this.dataLoaded = true;
    } catch (error) {
      console.error('Failed to load obituaries data:', error);
      this.obituariesData = [];
      this.dataLoaded = true;
    }
  }

  static filterObituaries(
    filters: FilterOptions,
    currentBtcPrice: number
  ): ObituariesResult {
    const source = Array.isArray(this.obituariesData) ? this.obituariesData : [];
    let filtered = [...source];

    // Date range filter
    if (filters.dateRange) {
      const start = new Date(filters.dateRange.start);
      const end = new Date(filters.dateRange.end);
      filtered = filtered.filter(o => {
        const date = new Date(o.date);
        return date >= start && date <= end;
      });
    }

    // Source type filter
    if (filters.sourceTypes && filters.sourceTypes.length > 0 && !filters.sourceTypes.includes('all')) {
      filtered = filtered.filter(o => filters.sourceTypes!.includes(o.sourceType));
    }

    // Price range filter
    if (filters.priceRange) {
      filtered = filtered.filter(o => 
        o.btcPriceAtTime >= filters.priceRange!.min && 
        o.btcPriceAtTime <= filters.priceRange!.max
      );
    }

    // Search query filter
    if (filters.searchQuery && filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(o => 
        o.headline.toLowerCase().includes(query) ||
        o.quote.toLowerCase().includes(query) ||
        o.source.toLowerCase().includes(query)
      );
    }

    // Calculate metrics
    const avgPrice = filtered.reduce((sum, o) => sum + o.btcPriceAtTime, 0) / (filtered.length || 1);
    const avgROI = this.calculateROI(avgPrice, currentBtcPrice);

    // Get yearly breakdown
    const yearlyMap = new Map<number, number>();
    filtered.forEach(o => {
      const year = new Date(o.date).getFullYear();
      yearlyMap.set(year, (yearlyMap.get(year) || 0) + 1);
    });
    const yearlyBreakdown = Array.from(yearlyMap.entries())
      .map(([year, count]) => ({ year, count }))
      .sort((a, b) => a.year - b.year);

    // Most active year
    const mostActiveYear = yearlyBreakdown.reduce(
      (max, curr) => curr.count > max.count ? curr : max,
      { year: 0, count: 0 }
    );

    // Top sources
    const sourceMap = new Map<string, number>();
    filtered.forEach(o => {
      sourceMap.set(o.source, (sourceMap.get(o.source) || 0) + 1);
    });
    const topSources = Array.from(sourceMap.entries())
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalCount: filtered.length,
      filteredObituaries: filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      avgPriceAtObituary: avgPrice,
      currentBtcPrice,
      avgROI,
      mostActiveYear,
      topSources,
      yearlyBreakdown
    };
  }

  static calculateROI(priceAtTime: number, currentPrice: number): number {
    if (priceAtTime === 0) return 0;
    return ((currentPrice - priceAtTime) / priceAtTime) * 100;
  }

  static getFamousObituaries(): BitcoinObituary[] {
    return this.obituariesData.filter(o => o.isFamous);
  }

  static getObituariesByYear(year: number): BitcoinObituary[] {
    return this.obituariesData.filter(o => new Date(o.date).getFullYear() === year);
  }
}
