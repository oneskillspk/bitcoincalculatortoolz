import axios from 'axios';
import { format, subDays } from 'date-fns';
import { staticDataService } from './staticDataService';
import { offlineManager } from './offlineManager';

// All upstream price requests are routed through our edge-function proxy
// (`price-proxy`) to eliminate browser CORS issues and keep any future
// upstream credentials server-side. The proxy mirrors the CoinGecko v3
// schema via a `?path=` parameter.
const PROXY_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/price-proxy`;
const PROXY_HEADERS = {
  apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string,
};

function priceProxyGet(path: string, params: Record<string, unknown> = {}, timeout = 8000) {
  return axios.get(PROXY_BASE, {
    params: { path, ...params },
    timeout,
    headers: PROXY_HEADERS,
  });
}

// Kept for any external imports; now points at the proxy + path helper.
const COINGECKO_API = PROXY_BASE;

export interface BitcoinPrice {
  date: string;
  price: number;
}

export interface BitcoinMarketData {
  price: number;
  priceChange24h: number;
  priceChangePercentage24h: number;
  high24h?: number;
  low24h?: number;
  lastUpdated: string;
}

export interface CurrencyRate {
  [key: string]: number;
}

export interface CalculationResult {
  investmentAmount: number;
  currency: string;
  startDate: string;
  startPrice: number;
  currentPrice: number;
  btcAmount: number;
  currentValue: number;
  profitLoss: number;
  roiPercentage: number;
  priceData: BitcoinPrice[];
}

// Supported currencies - Comprehensive global currency list (100+ currencies)
export const SUPPORTED_CURRENCIES = [
  // Major Reserve Currencies
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
  
  // Major Developed Markets
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr.', flag: '🇩🇰' },
  
  // Major Asian Markets
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨', flag: '🇵🇰' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩' },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', flag: '🇻🇳' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', flag: '🇵🇭' },
  { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳', flag: '🇧🇩' },
  { code: 'LKR', name: 'Sri Lankan Rupee', symbol: '₨', flag: '🇱🇰' },
  { code: 'NPR', name: 'Nepalese Rupee', symbol: '₨', flag: '🇳🇵' },
  { code: 'MMK', name: 'Myanmar Kyat', symbol: 'K', flag: '🇲🇲' },
  { code: 'KHR', name: 'Cambodian Riel', symbol: '៛', flag: '🇰🇭' },
  { code: 'LAK', name: 'Lao Kip', symbol: '₭', flag: '🇱🇦' },
  { code: 'BND', name: 'Brunei Dollar', symbol: 'B$', flag: '🇧🇳' },
  
  // European Markets
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', flag: '🇵🇱' },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', flag: '🇨🇿' },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', flag: '🇭🇺' },
  { code: 'RON', name: 'Romanian Leu', symbol: 'lei', flag: '🇷🇴' },
  { code: 'BGN', name: 'Bulgarian Lev', symbol: 'лв', flag: '🇧🇬' },
  // HRK (Croatian Kuna) removed — Croatia adopted EUR in January 2023
  { code: 'RSD', name: 'Serbian Dinar', symbol: 'дин', flag: '🇷🇸' },
  { code: 'BAM', name: 'Bosnia and Herzegovina Mark', symbol: 'KM', flag: '🇧🇦' },
  { code: 'MKD', name: 'Macedonian Denar', symbol: 'ден', flag: '🇲🇰' },
  { code: 'ALL', name: 'Albanian Lek', symbol: 'L', flag: '🇦🇱' },
  { code: 'MDL', name: 'Moldovan Leu', symbol: 'L', flag: '🇲🇩' },
  { code: 'UAH', name: 'Ukrainian Hryvnia', symbol: '₴', flag: '🇺🇦' },
  { code: 'BYN', name: 'Belarusian Ruble', symbol: 'Br', flag: '🇧🇾' },
  { code: 'GEL', name: 'Georgian Lari', symbol: '₾', flag: '🇬🇪' },
  { code: 'AMD', name: 'Armenian Dram', symbol: '֏', flag: '🇦🇲' },
  { code: 'AZN', name: 'Azerbaijani Manat', symbol: '₼', flag: '🇦🇿' },
  { code: 'ISK', name: 'Icelandic Krona', symbol: 'kr', flag: '🇮🇸' },
  
  // Middle East & Africa
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'ر.س', flag: '🇸🇦' },
  { code: 'QAR', name: 'Qatari Riyal', symbol: 'ر.ق', flag: '🇶🇦' },
  { code: 'OMR', name: 'Omani Rial', symbol: 'ر.ع.', flag: '🇴🇲' },
  { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'د.ك', flag: '🇰🇼' },
  { code: 'BHD', name: 'Bahraini Dinar', symbol: '.د.ب', flag: '🇧🇭' },
  { code: 'JOD', name: 'Jordanian Dinar', symbol: 'د.ا', flag: '🇯🇴' },
  { code: 'LBP', name: 'Lebanese Pound', symbol: 'ل.ل', flag: '🇱🇧' },
  { code: 'SYP', name: 'Syrian Pound', symbol: '£S', flag: '🇸🇾' },
  { code: 'IQD', name: 'Iraqi Dinar', symbol: 'ع.د', flag: '🇮🇶' },
  { code: 'IRR', name: 'Iranian Rial', symbol: '﷼', flag: '🇮🇷' },
  { code: 'AFN', name: 'Afghan Afghani', symbol: '؋', flag: '🇦🇫' },
  { code: 'YER', name: 'Yemeni Rial', symbol: '﷼', flag: '🇾🇪' },
  { code: 'ILS', name: 'Israeli Shekel', symbol: '₪', flag: '🇮🇱' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', flag: '🇳🇬' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: '£', flag: '🇪🇬' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', flag: '🇰🇪' },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵', flag: '🇬🇭' },
  { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh', flag: '🇺🇬' },
  { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh', flag: '🇹🇿' },
  { code: 'ETB', name: 'Ethiopian Birr', symbol: 'Br', flag: '🇪🇹' },
  { code: 'MAD', name: 'Moroccan Dirham', symbol: 'د.م.', flag: '🇲🇦' },
  { code: 'TND', name: 'Tunisian Dinar', symbol: 'د.ت', flag: '🇹🇳' },
  { code: 'DZD', name: 'Algerian Dinar', symbol: 'د.ج', flag: '🇩🇿' },
  { code: 'LYD', name: 'Libyan Dinar', symbol: 'ل.د', flag: '🇱🇾' },
  { code: 'SDG', name: 'Sudanese Pound', symbol: 'ج.س.', flag: '🇸🇩' },
  
  // Central Asia
  { code: 'KZT', name: 'Kazakhstani Tenge', symbol: '₸', flag: '🇰🇿' },
  { code: 'UZS', name: 'Uzbekistani Som', symbol: 'сўм', flag: '🇺🇿' },
  { code: 'KGS', name: 'Kyrgyzstani Som', symbol: 'с', flag: '🇰🇬' },
  { code: 'TJS', name: 'Tajikistani Somoni', symbol: 'ЅМ', flag: '🇹🇯' },
  { code: 'TMT', name: 'Turkmenistani Manat', symbol: 'T', flag: '🇹🇲' },
  { code: 'MNT', name: 'Mongolian Tugrik', symbol: '₮', flag: '🇲🇳' },
  
  // Americas
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', flag: '🇲🇽' },
  { code: 'ARS', name: 'Argentine Peso', symbol: '$', flag: '🇦🇷' },
  { code: 'CLP', name: 'Chilean Peso', symbol: '$', flag: '🇨🇱' },
  { code: 'COP', name: 'Colombian Peso', symbol: '$', flag: '🇨🇴' },
  { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/', flag: '🇵🇪' },
  { code: 'UYU', name: 'Uruguayan Peso', symbol: '$U', flag: '🇺🇾' },
  { code: 'PYG', name: 'Paraguayan Guarani', symbol: '₲', flag: '🇵🇾' },
  { code: 'BOB', name: 'Bolivian Boliviano', symbol: 'Bs.', flag: '🇧🇴' },
  { code: 'VES', name: 'Venezuelan Bolívar', symbol: 'Bs.S.', flag: '🇻🇪' },
  { code: 'GYD', name: 'Guyanese Dollar', symbol: 'G$', flag: '🇬🇾' },
  { code: 'SRD', name: 'Surinamese Dollar', symbol: 'Sr$', flag: '🇸🇷' },
  { code: 'CRC', name: 'Costa Rican Colón', symbol: '₡', flag: '🇨🇷' },
  { code: 'GTQ', name: 'Guatemalan Quetzal', symbol: 'Q', flag: '🇬🇹' },
  { code: 'HNL', name: 'Honduran Lempira', symbol: 'L', flag: '🇭🇳' },
  { code: 'NIO', name: 'Nicaraguan Córdoba', symbol: 'C$', flag: '🇳🇮' },
  { code: 'PAB', name: 'Panamanian Balboa', symbol: 'B/.', flag: '🇵🇦' },
  { code: 'JMD', name: 'Jamaican Dollar', symbol: 'J$', flag: '🇯🇲' },
  { code: 'TTD', name: 'Trinidad and Tobago Dollar', symbol: 'TT$', flag: '🇹🇹' },
  { code: 'BBD', name: 'Barbadian Dollar', symbol: 'Bds$', flag: '🇧🇧' },
  { code: 'BSD', name: 'Bahamian Dollar', symbol: 'B$', flag: '🇧🇸' },
  { code: 'BZD', name: 'Belize Dollar', symbol: 'BZ$', flag: '🇧🇿' },
  { code: 'DOP', name: 'Dominican Peso', symbol: 'RD$', flag: '🇩🇴' },
  { code: 'CUP', name: 'Cuban Peso', symbol: '$', flag: '🇨🇺' },
  { code: 'HTG', name: 'Haitian Gourde', symbol: 'G', flag: '🇭🇹' },
  
  // Pacific
  { code: 'FJD', name: 'Fijian Dollar', symbol: 'FJ$', flag: '🇫🇯' },
  { code: 'PGK', name: 'Papua New Guinean Kina', symbol: 'K', flag: '🇵🇬' },
  { code: 'WST', name: 'Samoan Tala', symbol: 'T', flag: '🇼🇸' },
  { code: 'TOP', name: 'Tongan Paʻanga', symbol: 'T$', flag: '🇹🇴' },
  { code: 'VUV', name: 'Vanuatu Vatu', symbol: 'Vt', flag: '🇻🇺' },
  { code: 'SBD', name: 'Solomon Islands Dollar', symbol: 'SI$', flag: '🇸🇧' },
  { code: 'XPF', name: 'CFP Franc', symbol: '₣', flag: '🇵🇫' },
  
  // Other Notable Currencies
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', flag: '🇷🇺' },
  { code: 'CNH', name: 'Chinese Yuan (Offshore)', symbol: '¥', flag: '🇨🇳' },
  { code: 'TWD', name: 'New Taiwan Dollar', symbol: 'NT$', flag: '🇹🇼' },
  { code: 'MOP', name: 'Macanese Pataca', symbol: 'P', flag: '🇲🇴' },
  { code: 'BTC', name: 'Bitcoin', symbol: '₿', flag: '₿' }
];

class BitcoinApiService {
  private cache: Map<string, any> = new Map();
  private readonly cacheDuration = 5 * 60 * 1000; // 5 minutes
  private readonly maxRetries = 3;
  private readonly baseDelay = 1000; // 1 second
  // Only CoinGecko shares the `/simple/price` + `/coins/markets` schema used
  // below. Coinbase and CoinAPI use entirely different endpoints/auth and were
  // producing 401s and CORS failures when blindly appended to. Removed.
  private readonly fallbackAPIs = [
    'https://api.coingecko.com/api/v3',
  ];

  private getCacheKey(endpoint: string, params?: any): string {
    return `${endpoint}-${JSON.stringify(params)}`;
  }

  private isValidCache(timestamp: number): boolean {
    return Date.now() - timestamp < this.cacheDuration;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Resolve with the first successful promise; reject with the last error if all fail.
   * Equivalent to Promise.any without requiring ES2021 lib types.
   */
  private firstSuccessful<T>(promises: Promise<T>[]): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      if (promises.length === 0) {
        reject(new Error('No attempts provided'));
        return;
      }
      let remaining = promises.length;
      let lastError: unknown;
      promises.forEach((p) => {
        p.then(resolve).catch((err) => {
          lastError = err;
          remaining -= 1;
          if (remaining === 0) {
            reject(lastError instanceof Error ? lastError : new Error(String(lastError)));
          }
        });
      });
    });
  }

  private async retryWithExponentialBackoff<T>(
    operation: () => Promise<T>,
    context: string
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        console.warn(`${context} - Attempt ${attempt} failed:`, error);
        
        if (attempt < this.maxRetries) {
          // Full jitter on the upper half avoids thundering-herd retries
          const base = this.baseDelay * Math.pow(2, attempt - 1);
          const delayMs = base + Math.random() * base;
          await this.delay(delayMs);
        }
      }
    }
    
    throw new Error(`${context} failed after ${this.maxRetries} attempts: ${lastError.message}`);
  }

  private validateCurrency(currency: string): boolean {
    return SUPPORTED_CURRENCIES.some(c => c.code === currency.toUpperCase());
  }

  async getCurrentMarketData(currency = 'USD'): Promise<BitcoinMarketData> {
    if (!this.validateCurrency(currency)) {
      throw new Error(`Unsupported currency: ${currency}`);
    }

    const cacheKey = this.getCacheKey('market-data', { currency });
    const cached = this.cache.get(cacheKey);
    
    if (cached && this.isValidCache(cached.timestamp)) {
      return cached.data;
    }

    return this.retryWithExponentialBackoff(async () => {
      let lastError: Error;

      // Try CoinGecko /coins/markets first — returns high_24h and low_24h
      try {
        const response = await priceProxyGet('/coins/markets', {
          vs_currency: currency.toLowerCase(),
          ids: 'bitcoin',
          price_change_percentage: '24h',
        }, 8000);

        const row = Array.isArray(response.data) ? response.data[0] : null;
        if (row && typeof row.current_price === 'number') {
          const price: number = row.current_price;
          const priceChangePercentage24h: number =
            row.price_change_percentage_24h ?? row.price_change_percentage_24h_in_currency ?? 0;
          const priceChange24h: number = row.price_change_24h ?? 0;
          const high24h: number | undefined =
            typeof row.high_24h === 'number' ? row.high_24h : undefined;
          const low24h: number | undefined =
            typeof row.low_24h === 'number' ? row.low_24h : undefined;
          const lastUpdated = row.last_updated
            ? new Date(row.last_updated).toISOString()
            : new Date().toISOString();

          const marketData: BitcoinMarketData = {
            price,
            priceChange24h,
            priceChangePercentage24h,
            high24h,
            low24h,
            lastUpdated,
          };
          this.cache.set(cacheKey, { data: marketData, timestamp: Date.now() });
          return marketData;
        }
      } catch (error) {
        lastError = error as Error;
      // Fallback: /simple/price (no high/low) via the proxy.
      try {
        const response = await priceProxyGet('/simple/price', {
          ids: 'bitcoin',
          vs_currencies: currency.toLowerCase(),
          include_24hr_change: true,
          include_last_updated_at: true,
        }, 8000);

        const data = response.data.bitcoin;
        if (!data) {
          throw new Error(`Market data not available for currency: ${currency}`);
        }

        const price = data[currency.toLowerCase()];
        const priceChange24h = data[`${currency.toLowerCase()}_24h_change`] || 0;
        const lastUpdated = data.last_updated_at
          ? new Date(data.last_updated_at * 1000).toISOString()
          : new Date().toISOString();

        const marketData: BitcoinMarketData = {
          price,
          priceChange24h,
          priceChangePercentage24h: priceChange24h,
          lastUpdated,
        };
        this.cache.set(cacheKey, { data: marketData, timestamp: Date.now() });
        return marketData;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        throw new Error(`All APIs failed. Last error: ${lastError?.message ?? message}`);
      }
    }, `Get current Bitcoin market data (${currency})`);
  }

  async getCurrentPrice(currency = 'USD'): Promise<number> {
    if (!this.validateCurrency(currency)) {
      throw new Error(`Unsupported currency: ${currency}`);
    }

    // Try cached data from offlineManager first
    const cachedPrice = await offlineManager.getCachedData<number>(`current-price-${currency}`);
    if (cachedPrice && navigator.onLine) {
      // Return cached price immediately and update in background
      this.updateCurrentPriceInBackground(currency);
      return cachedPrice;
    }

    const cacheKey = this.getCacheKey('current-price', { currency });
    const cached = this.cache.get(cacheKey);
    
    if (cached && this.isValidCache(cached.timestamp)) {
      return cached.data;
    }

    return this.retryWithExponentialBackoff(async () => {
      // Race endpoints in parallel — first healthy responder wins.
      const fallbackUrls = [COINGECKO_API, ...this.fallbackAPIs.slice(1)];
      const attempts = fallbackUrls.map(async (apiUrl) => {
        const response = await axios.get(`${apiUrl}/simple/price`, {
          params: {
            ids: 'bitcoin',
            vs_currencies: currency.toLowerCase()
          },
          timeout: 8000
        });
        const price = response.data.bitcoin?.[currency.toLowerCase()];
        if (!price) {
          throw new Error(`Price data not available for currency: ${currency}`);
        }
        return price as number;
      });

      try {
        const price = await this.firstSuccessful(attempts);
        this.cache.set(cacheKey, { data: price, timestamp: Date.now() });
        // Cache in offlineManager for 5 minutes
        await offlineManager.cacheData(`current-price-${currency}`, price, 5);
        return price;
      } catch (err) {
        if (cachedPrice) {
          console.warn('Using stale cached price data due to API failures');
          return cachedPrice;
        }
        const message = err instanceof Error ? err.message : String(err);
        throw new Error(`All APIs failed. Last error: ${message}`);
      }
    }, `Get current Bitcoin price (${currency})`);
  }

  async getHistoricalPrice(date: Date, currency = 'USD'): Promise<number> {
    if (!this.validateCurrency(currency)) {
      throw new Error(`Unsupported currency: ${currency}`);
    }

    const dateStr = format(date, 'dd-MM-yyyy');
    
    // Try cached data first
    const cachedPrice = await offlineManager.getCachedData<number>(`historical-price-${dateStr}-${currency}`);
    if (cachedPrice) {
      return cachedPrice;
    }

    const cacheKey = this.getCacheKey('historical-price', { date: dateStr, currency });
    const cached = this.cache.get(cacheKey);
    
    if (cached && this.isValidCache(cached.timestamp)) {
      return cached.data;
    }

    // Try static dataset first for faster response
    try {
      const staticPrice = await staticDataService.getHistoricalPrice(date);
      if (staticPrice && staticPrice > 0) {
        let price = staticPrice;
        
        // Convert currency if needed
        if (currency.toUpperCase() !== 'USD') {
          const exchangeRate = await this.getExchangeRate('USD', currency);
          price = price * exchangeRate;
        }

        // Cache for 24 hours since historical data doesn't change
        await offlineManager.cacheData(`historical-price-${dateStr}-${currency}`, price, 1440);
        this.cache.set(cacheKey, { data: price, timestamp: Date.now() });
        
        return price;
      }
    } catch (error) {
      console.warn('Static data service failed:', error);
    }

    return this.retryWithExponentialBackoff(async () => {
      // Try API strategies as fallback
      const strategies = [
        () => this.fetchFromCoinGeckoHistory(dateStr),
        () => this.fetchFromCoinGeckoRange(date),
        () => this.estimateHistoricalPrice(date)
      ];

      let lastError: Error;
      
      for (const strategy of strategies) {
        try {
          let price = await strategy();
          
          // Convert currency if needed
          if (currency.toUpperCase() !== 'USD') {
            const exchangeRate = await this.getExchangeRate('USD', currency);
            price = price * exchangeRate;
          }

          this.cache.set(cacheKey, { data: price, timestamp: Date.now() });
          await offlineManager.cacheData(`historical-price-${dateStr}-${currency}`, price, 1440);
          
          return price;
        } catch (error) {
          lastError = error as Error;
          console.warn(`Historical price strategy failed:`, error);
          continue;
        }
      }
      
      throw new Error(`All historical price strategies failed. Last error: ${lastError!.message}`);
    }, `Get historical Bitcoin price for ${dateStr} (${currency})`);
  }

  async getPriceRange(startDate: Date, endDate: Date, currency = 'USD'): Promise<BitcoinPrice[]> {
    if (!this.validateCurrency(currency)) {
      throw new Error(`Unsupported currency: ${currency}`);
    }

    const startTimestamp = Math.floor(startDate.getTime() / 1000);
    const endTimestamp = Math.floor(endDate.getTime() / 1000);
    
    // Try cached data first
    const rangeKey = `price-range-${startTimestamp}-${endTimestamp}-${currency}`;
    const cachedRange = await offlineManager.getCachedData<BitcoinPrice[]>(rangeKey);
    if (cachedRange && cachedRange.length > 0) {
      return cachedRange;
    }
    
    const cacheKey = this.getCacheKey('price-range', { 
      start: startTimestamp, 
      end: endTimestamp, 
      currency 
    });
    const cached = this.cache.get(cacheKey);
    
    if (cached && this.isValidCache(cached.timestamp)) {
      return cached.data;
    }

    // Try static dataset first for faster response
    try {
      const staticPriceData = await staticDataService.getPriceRange(startDate, endDate);
      if (staticPriceData.length > 0) {
        let priceData = staticPriceData.map(item => ({
          date: item.date,
          price: item.price
        }));
        
        // Convert currency if needed
        if (currency.toUpperCase() !== 'USD') {
          const exchangeRate = await this.getExchangeRate('USD', currency);
          priceData = priceData.map(item => ({
            ...item,
            price: item.price * exchangeRate
          }));
        }

        // Cache for 1 hour
        await offlineManager.cacheData(rangeKey, priceData, 60);
        this.cache.set(cacheKey, { data: priceData, timestamp: Date.now() });
        
        return priceData;
      }
    } catch (error) {
      console.warn('Static price range failed:', error);
    }

    return this.retryWithExponentialBackoff(async () => {
      // Try API strategies as fallback
      const strategies = [
        () => this.fetchPriceRangeFromAPI(startTimestamp, endTimestamp, currency),
        () => this.generateSimplePriceRange(startDate, endDate, currency)
      ];

      let lastError: Error;
      
      for (const strategy of strategies) {
        try {
          const priceData = await strategy();
          
          if (priceData.length === 0) {
            throw new Error('No price data generated');
          }

          this.cache.set(cacheKey, { data: priceData, timestamp: Date.now() });
          await offlineManager.cacheData(rangeKey, priceData, 60);
          
          return priceData;
        } catch (error) {
          lastError = error as Error;
          console.warn(`Price range strategy failed:`, error);
          continue;
        }
      }
      
      throw new Error(`All price range strategies failed. Last error: ${lastError!.message}`);
    }, `Get Bitcoin price range (${currency})`);
  }

  private async getExchangeRate(from: string, to: string): Promise<number> {
    if (from === to) return 1;
    
    // Try cached exchange rate first
    const rateKey = `exchange-rate-${from}-${to}`;
    const cachedRate = await offlineManager.getCachedData<number>(rateKey);
    if (cachedRate) {
      return cachedRate;
    }
    
    const cacheKey = this.getCacheKey('exchange-rate', { from, to });
    const cached = this.cache.get(cacheKey);
    
    if (cached && this.isValidCache(cached.timestamp)) {
      return cached.data;
    }

    try {
      // Use CoinGecko's simple/price endpoint for exchange rates
      const response = await axios.get(`${COINGECKO_API}/simple/price`, {
        params: {
          ids: 'bitcoin',
          vs_currencies: `${from.toLowerCase()},${to.toLowerCase()}`
        }
      });

      const fromRate = response.data.bitcoin[from.toLowerCase()];
      const toRate = response.data.bitcoin[to.toLowerCase()];
      const rate = toRate / fromRate;

      this.cache.set(cacheKey, { data: rate, timestamp: Date.now() });
      
      // Cache exchange rates for 30 minutes
      await offlineManager.cacheData(rateKey, rate, 30);
      
      return rate;
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      return 1; // Fallback to 1:1 rate
    }
  }

  private async updateCurrentPriceInBackground(currency: string): Promise<void> {
    // Update current price in background without throwing errors
    try {
      const response = await axios.get(`${COINGECKO_API}/simple/price`, {
        params: {
          ids: 'bitcoin',
          vs_currencies: currency.toLowerCase()
        },
        timeout: 5000
      });

      const price = response.data.bitcoin?.[currency.toLowerCase()];
      if (price) {
        await offlineManager.cacheData(`current-price-${currency}`, price, 5);
      }
    } catch (error) {
      console.warn('Background price update failed:', error);
    }
  }

  async calculateInvestment(
    amount: number,
    startDate: Date,
    currency = 'USD'
  ): Promise<CalculationResult> {
    try {
      const [historicalPrice, currentPrice, priceData] = await Promise.all([
        this.getHistoricalPrice(startDate, currency),
        this.getCurrentPrice(currency),
        this.getPriceRange(startDate, new Date(), currency)
      ]);

      const btcAmount = amount / historicalPrice;
      const currentValue = btcAmount * currentPrice;
      const profitLoss = currentValue - amount;
      const roiPercentage = (profitLoss / amount) * 100;

      return {
        investmentAmount: amount,
        currency: currency.toUpperCase(),
        startDate: format(startDate, 'yyyy-MM-dd'),
        startPrice: Math.round(historicalPrice * 100) / 100,
        currentPrice: Math.round(currentPrice * 100) / 100,
        btcAmount: Math.round(btcAmount * 100000000) / 100000000, // 8 decimal places
        currentValue: Math.round(currentValue * 100) / 100,
        profitLoss: Math.round(profitLoss * 100) / 100,
        roiPercentage: Math.round(roiPercentage * 100) / 100,
        priceData
      };
    } catch (error) {
      console.error('Error calculating investment:', error);
      throw error;
    }
  }

  async calculateInvestmentFromBtc(
    btcAmount: number,
    startDate: Date,
    currency = 'USD'
  ): Promise<CalculationResult> {
    try {
      const [historicalPrice, currentPrice, priceData] = await Promise.all([
        this.getHistoricalPrice(startDate, currency),
        this.getCurrentPrice(currency),
        this.getPriceRange(startDate, new Date(), currency)
      ]);

      const investmentAmount = btcAmount * historicalPrice;
      const currentValue = btcAmount * currentPrice;
      const profitLoss = currentValue - investmentAmount;
      const roiPercentage = (profitLoss / investmentAmount) * 100;

      return {
        investmentAmount: Math.round(investmentAmount * 100) / 100,
        currency: currency.toUpperCase(),
        startDate: format(startDate, 'yyyy-MM-dd'),
        startPrice: Math.round(historicalPrice * 100) / 100,
        currentPrice: Math.round(currentPrice * 100) / 100,
        btcAmount: Math.round(btcAmount * 100000000) / 100000000,
        currentValue: Math.round(currentValue * 100) / 100,
        profitLoss: Math.round(profitLoss * 100) / 100,
        roiPercentage: Math.round(roiPercentage * 100) / 100,
        priceData
      };
    } catch (error) {
      console.error('Error calculating investment from BTC:', error);
      throw error;
    }
  }

  // Preset date calculations
  getPresetDate(preset: '1y' | '3y' | '5y' | 'max'): Date {
    const now = new Date();
    switch (preset) {
      case '1y':
        return subDays(now, 365);
      case '3y':
        return subDays(now, 365 * 3);
      case '5y':
        return subDays(now, 365 * 5);
      case 'max':
        return new Date('2009-01-03'); // Bitcoin genesis block date
      default:
        return subDays(now, 365);
    }
  }

  getCurrency(code: string) {
    return SUPPORTED_CURRENCIES.find(c => c.code === code.toUpperCase()) || SUPPORTED_CURRENCIES[0];
  }

  // Fallback strategies for robust data fetching
  private async fetchFromCoinGeckoHistory(dateStr: string): Promise<number> {
    const response = await axios.get(`${COINGECKO_API}/coins/bitcoin/history`, {
      params: { date: dateStr, localization: false },
      timeout: 8000
    });

    if (!response.data?.market_data?.current_price?.usd) {
      throw new Error('Invalid historical price data from CoinGecko history API');
    }

    return response.data.market_data.current_price.usd;
  }

  private async fetchFromCoinGeckoRange(date: Date): Promise<number> {
    const startTimestamp = Math.floor(date.getTime() / 1000);
    const endTimestamp = startTimestamp + 86400; // +1 day

    const response = await axios.get(`${COINGECKO_API}/coins/bitcoin/market_chart/range`, {
      params: {
        vs_currency: 'usd',
        from: startTimestamp,
        to: endTimestamp
      },
      timeout: 8000
    });

    if (!response.data?.prices || response.data.prices.length === 0) {
      throw new Error('No price data from range API');
    }

    // Return closest price to the requested date
    return response.data.prices[0][1];
  }

  private async estimateHistoricalPrice(date: Date): Promise<number> {
    // Simple estimation based on known Bitcoin milestones
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    
    // Very rough historical estimates as last resort
    const estimates: { [key: string]: number } = {
      '2009': 0.001,
      '2010': 0.1,
      '2011': 5,
      '2012': 200,
      '2013': 600,
      '2014': 400,
      '2015': 250,
      '2016': 600,
      '2017': 4000,
      '2018': 6000,
      '2019': 7000,
      '2020': 10000,
      '2021': 35000,
      '2022': 20000,
      '2023': 25000,
      '2024': 45000
    };

    const basePrice = estimates[year.toString()] || 30000;
    
    // Add some variance based on month
    const monthVariance = Math.sin((month / 12) * Math.PI * 2) * 0.2;
    return basePrice * (1 + monthVariance);
  }

  private async fetchPriceRangeFromAPI(startTimestamp: number, endTimestamp: number, currency: string): Promise<BitcoinPrice[]> {
    const response = await axios.get(`${COINGECKO_API}/coins/bitcoin/market_chart/range`, {
      params: {
        vs_currency: currency.toLowerCase(),
        from: startTimestamp,
        to: endTimestamp
      },
      timeout: 12000
    });

    if (!response.data?.prices || !Array.isArray(response.data.prices)) {
      throw new Error('Invalid price range data from API');
    }

    return response.data.prices.map(([timestamp, price]: [number, number]) => ({
      date: format(new Date(timestamp), 'yyyy-MM-dd'),
      price: Math.round(price * 100) / 100
    }));
  }

  async getHistoricalPriceDataRange(startDate: Date, endDate: Date, currency = 'USD'): Promise<BitcoinPrice[]> {
    if (!this.validateCurrency(currency)) {
      throw new Error(`Unsupported currency: ${currency}`);
    }

    const cacheKey = this.getCacheKey('price-range', { 
      start: format(startDate, 'yyyy-MM-dd'), 
      end: format(endDate, 'yyyy-MM-dd'), 
      currency 
    });
    const cached = this.cache.get(cacheKey);
    
    if (cached && this.isValidCache(cached.timestamp)) {
      return cached.data;
    }

    // Skip static data service for now, directly use API/estimation
    // TODO: Implement getHistoricalPriceDataRange in staticDataService if needed

    // Fallback to API or estimation
    return this.retryWithExponentialBackoff(async () => {
      try {
        const startTimestamp = Math.floor(startDate.getTime() / 1000);
        const endTimestamp = Math.floor(endDate.getTime() / 1000);
        
        const priceData = await this.fetchPriceRangeFromAPI(startTimestamp, endTimestamp, currency);
        this.cache.set(cacheKey, { data: priceData, timestamp: Date.now() });
        return priceData;
      } catch (error) {
        console.warn('API failed, using fallback price generation:', error);
        return this.generateSimplePriceRange(startDate, endDate, currency);
      }
    }, `Get historical price range (${currency})`);
  }

  private async generateSimplePriceRange(startDate: Date, endDate: Date, currency: string): Promise<BitcoinPrice[]> {
    try {
      // Get start and end prices, then interpolate
      const [startPrice, currentPrice] = await Promise.all([
        this.estimateHistoricalPrice(startDate),
        this.getCurrentPrice(currency)
      ]);

      const daysDiff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const priceData: BitcoinPrice[] = [];

      // Generate weekly data points with smooth interpolation
      const steps = Math.min(50, Math.max(5, daysDiff / 7)); // Weekly points, max 50
      
      for (let i = 0; i <= steps; i++) {
        const ratio = i / steps;
        const currentDate = new Date(startDate.getTime() + (ratio * (endDate.getTime() - startDate.getTime())));
        
        // Exponential growth interpolation (more realistic for Bitcoin)
        const price = startPrice * Math.pow(currentPrice / startDate.getTime() > endDate.getTime() ? 1 : currentPrice / startPrice, ratio);
        
        priceData.push({
          date: format(currentDate, 'yyyy-MM-dd'),
          price: Math.round(price * 100) / 100
        });
      }

      return priceData;
    } catch (error) {
      throw new Error(`Failed to generate fallback price range: ${error.message}`);
    }
  }
}

export const bitcoinApi = new BitcoinApiService();