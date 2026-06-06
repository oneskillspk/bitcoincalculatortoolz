/**
 * Offline Manager for handling offline functionality and data synchronization
 */

import { CalculationResult, BitcoinPrice } from './bitcoinApi';
import { dataCompressionService } from './dataCompression';

interface OfflineCalculationRequest {
  id: string;
  amount: number;
  startDate: Date;
  currency: string;
  timestamp: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

interface CachedData {
  key: string;
  data: any;
  timestamp: number;
  expiresAt: number;
  compressed?: boolean;
}

interface SyncQueueItem {
  id: string;
  type: 'calculation' | 'price-update' | 'user-preference';
  data: any;
  timestamp: number;
  retryCount: number;
}

class OfflineManager {
  private dbName = 'bitcoin-calculator-offline';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;
  private isOnline = navigator.onLine;
  private syncQueue: SyncQueueItem[] = [];
  private maxRetries = 3;
  private syncInterval: number | null = null;

  constructor() {
    this.initializeDB();
    this.setupEventListeners();
    this.startPeriodicSync();
  }

  private async initializeDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Store for calculation requests
        if (!db.objectStoreNames.contains('calculations')) {
          const calculationStore = db.createObjectStore('calculations', { keyPath: 'id' });
          calculationStore.createIndex('status', 'status', { unique: false });
          calculationStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Store for cached API data
        if (!db.objectStoreNames.contains('cache')) {
          const cacheStore = db.createObjectStore('cache', { keyPath: 'key' });
          cacheStore.createIndex('expiresAt', 'expiresAt', { unique: false });
        }

        // Store for calculation results
        if (!db.objectStoreNames.contains('results')) {
          const resultStore = db.createObjectStore('results', { keyPath: 'id' });
          resultStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Store for sync queue
        if (!db.objectStoreNames.contains('syncQueue')) {
          const syncStore = db.createObjectStore('syncQueue', { keyPath: 'id' });
          syncStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Store for user preferences
        if (!db.objectStoreNames.contains('preferences')) {
          db.createObjectStore('preferences', { keyPath: 'key' });
        }
      };
    });
  }

  private setupEventListeners(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('App is online - starting sync');
      this.syncPendingData();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('App is offline - queuing operations');
    });

    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.isOnline) {
        this.syncPendingData();
      }
    });

    // Handle service worker messages
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'BACKGROUND_SYNC_SUCCESS') {
          this.handleBackgroundSyncSuccess(event.data.result);
        }
      });
    }
  }

  private startPeriodicSync(): void {
    // Sync every 5 minutes when online
    this.syncInterval = window.setInterval(() => {
      if (this.isOnline) {
        this.syncPendingData();
      }
    }, 5 * 60 * 1000);
  }

  // Cache management
  async cacheData(key: string, data: any, ttlMinutes: number = 60): Promise<void> {
    if (!this.db) await this.initializeDB();

    const expiresAt = Date.now() + (ttlMinutes * 60 * 1000);
    
    // Compress large datasets
    let finalData = data;
    let compressed = false;
    
    if (Array.isArray(data) && data.length > 100) {
      try {
        finalData = dataCompressionService.compressPriceData(data as BitcoinPrice[]);
        compressed = true;
      } catch (error) {
        console.warn('Failed to compress data:', error);
      }
    }

    const cacheItem: CachedData = {
      key,
      data: finalData,
      timestamp: Date.now(),
      expiresAt,
      compressed
    };

    return this.storeData('cache', cacheItem);
  }

  async getCachedData<T>(key: string): Promise<T | null> {
    if (!this.db) await this.initializeDB();

    const cached = await this.getData<CachedData>('cache', key);
    
    if (!cached) return null;
    
    // Check expiration
    if (cached.expiresAt < Date.now()) {
      await this.deleteData('cache', key);
      return null;
    }

    // Decompress if needed
    if (cached.compressed) {
      try {
        return dataCompressionService.decompressPriceData(cached.data) as T;
      } catch (error) {
        console.warn('Failed to decompress cached data:', error);
        return null;
      }
    }

    return cached.data as T;
  }

  // Offline calculation queue
  async queueCalculation(
    amount: number,
    startDate: Date,
    currency: string
  ): Promise<string> {
    const id = `calc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const request: OfflineCalculationRequest = {
      id,
      amount,
      startDate,
      currency,
      timestamp: Date.now(),
      status: 'pending'
    };

    await this.storeData('calculations', request);

    // Try to process immediately if online
    if (this.isOnline) {
      this.processCalculation(id);
    } else {
      // Register for background sync if available  
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.ready;
          if (registration && (registration as any).sync) {
            await (registration as any).sync.register('background-calculation');
          }
        } catch (error) {
          console.warn('Background sync not available:', error);
        }
      }
    }

    return id;
  }

  async getCalculationResult(id: string): Promise<CalculationResult | null> {
    return this.getData<CalculationResult>('results', id);
  }

  async getCalculationStatus(id: string): Promise<string | null> {
    const request = await this.getData<OfflineCalculationRequest>('calculations', id);
    return request?.status || null;
  }

  private async processCalculation(id: string): Promise<void> {
    const request = await this.getData<OfflineCalculationRequest>('calculations', id);
    if (!request || request.status !== 'pending') return;

    try {
      // Update status
      await this.storeData('calculations', { ...request, status: 'processing' });

      // Perform calculation (would use actual API in real implementation)
      const result = await this.performOfflineCalculation(request);

      // Store result
      await this.storeData('results', { ...result, id });

      // Update status
      await this.storeData('calculations', { ...request, status: 'completed' });

      // Notify user if possible
      this.notifyCalculationComplete(id, result);

    } catch (error) {
      console.error('Calculation failed:', error);
      await this.storeData('calculations', { ...request, status: 'failed' });
    }
  }

  private async performOfflineCalculation(
    request: OfflineCalculationRequest
  ): Promise<CalculationResult> {
    // This would integrate with the actual calculation logic
    // For now, return a mock result
    
    const startPrice = 30000; // Mock historical price
    const currentPrice = 45000; // Mock current price
    const btcAmount = request.amount / startPrice;
    const currentValue = btcAmount * currentPrice;
    const profitLoss = currentValue - request.amount;
    const roiPercentage = (profitLoss / request.amount) * 100;

    return {
      investmentAmount: request.amount,
      currency: request.currency,
      startDate: request.startDate.toISOString().split('T')[0],
      startPrice,
      currentPrice,
      btcAmount,
      currentValue,
      profitLoss,
      roiPercentage,
      priceData: [] // Would include actual price data
    };
  }

  // Sync management
  private async syncPendingData(): Promise<void> {
    if (!this.isOnline) return;

    // Sync pending calculations
    const pendingCalculations = await this.getAllData<OfflineCalculationRequest>(
      'calculations',
      'status',
      'pending'
    );

    for (const calc of pendingCalculations) {
      await this.processCalculation(calc.id);
    }

    // Process sync queue
    await this.processSyncQueue();
  }

  private async processSyncQueue(): Promise<void> {
    const queueItems = await this.getAllData<SyncQueueItem>('syncQueue');
    
    for (const item of queueItems) {
      try {
        await this.syncItem(item);
        await this.deleteData('syncQueue', item.id);
      } catch (error) {
        console.error('Sync failed for item:', item.id, error);
        
        if (item.retryCount < this.maxRetries) {
          await this.storeData('syncQueue', {
            ...item,
            retryCount: item.retryCount + 1
          });
        } else {
          console.error('Max retries exceeded for sync item:', item.id);
          await this.deleteData('syncQueue', item.id);
        }
      }
    }
  }

  private async syncItem(item: SyncQueueItem): Promise<void> {
    // Implement actual sync logic based on item type
    switch (item.type) {
      case 'calculation':
        // Sync calculation result to server
        break;
      case 'price-update':
        // Sync price updates
        break;
      case 'user-preference':
        // Sync user preferences
        break;
    }
  }

  // Utility methods
  private async storeData(storeName: string, data: any): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async getData<T>(storeName: string, key: string): Promise<T | null> {
    if (!this.db) await this.initializeDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result as T || null);
      request.onerror = () => reject(request.error);
    });
  }

  private async getAllData<T>(
    storeName: string,
    indexName?: string,
    indexValue?: any
  ): Promise<T[]> {
    if (!this.db) await this.initializeDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      
      let request: IDBRequest;
      if (indexName && indexValue) {
        const index = store.index(indexName);
        request = index.getAll(indexValue);
      } else {
        request = store.getAll();
      }

      request.onsuccess = () => resolve(request.result as T[]);
      request.onerror = () => reject(request.error);
    });
  }

  private async deleteData(storeName: string, key: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private notifyCalculationComplete(id: string, result: CalculationResult): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Calculation Complete', {
        body: `Your Bitcoin investment calculation is ready!`,
        icon: '/favicon.ico'
      });
    }

    // Also dispatch custom event for in-app handling
    window.dispatchEvent(new CustomEvent('calculationComplete', {
      detail: { id, result }
    }));
  }

  private handleBackgroundSyncSuccess(result: any): void {
    console.log('Background sync completed:', result);
    // Handle successful background sync
  }

  // Public utility methods
  async clearExpiredCache(): Promise<void> {
    if (!this.db) await this.initializeDB();

    const transaction = this.db!.transaction(['cache'], 'readwrite');
    const store = transaction.objectStore('cache');
    const index = store.index('expiresAt');
    
    const request = index.openCursor(IDBKeyRange.upperBound(Date.now()));
    
    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };
  }

  async getStorageUsage(): Promise<{ used: number; quota: number }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        used: estimate.usage || 0,
        quota: estimate.quota || 0
      };
    }
    return { used: 0, quota: 0 };
  }

  destroy(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    if (this.db) {
      this.db.close();
    }
  }
}

export const offlineManager = new OfflineManager();