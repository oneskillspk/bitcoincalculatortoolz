import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { downloadCsv, csvBtc, csvNumber } from '@/utils/csvExport';

export interface Holding {
  id: string;
  label: string;
  btcAmount: number;
  purchasePrice: number;
  purchaseDate: string | null;
  createdAt: string;
}

const STORAGE_KEY = 'btc_portfolio_holdings';

const isLocalStorageAvailable = (): boolean => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

const loadHoldings = (): Holding[] => {
  if (!isLocalStorageAvailable()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const usePortfolioStorage = () => {
  const [holdings, setHoldings] = useState<Holding[]>(loadHoldings);
  const { language } = useLanguage();
  const [storageAvailable] = useState(isLocalStorageAvailable);

  useEffect(() => {
    if (storageAvailable) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(holdings));
    }
  }, [holdings, storageAvailable]);

  const addHolding = useCallback((holding: Omit<Holding, 'id' | 'createdAt'>) => {
    const newHolding: Holding = {
      ...holding,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setHoldings(prev => [...prev, newHolding]);
  }, []);

  const updateHolding = useCallback((id: string, updates: Partial<Omit<Holding, 'id' | 'createdAt'>>) => {
    setHoldings(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
  }, []);

  const deleteHolding = useCallback((id: string) => {
    setHoldings(prev => prev.filter(h => h.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setHoldings([]);
  }, []);

  /**
   * Routed through `useFileDownload` (not `downloadCsv` directly) so the
   * tracker gets the same confirmation toast, "Didn't start?" fallback link
   * and Retry action as every other export on the site.
   */
  const exportCSV = useCallback((btcPrice?: number) => {
    if (holdings.length === 0) return null;
    const tr = language === 'tr';
    return exportCsv({
      meta: {
        calculator: tr ? 'Bitcoin Portföy Takipçisi' : 'Bitcoin Portfolio Tracker',
        // The live price the tracker is rendering with — passed in by the page
        // so the export can never show a stale/cached value.
        btcPrice,
        currency: 'USD',
        path: tr ? '/tr/bitcoin-portfoy-takipcisi' : '/bitcoin-portfolio-tracker',
      },
      filename: { en: 'bitcoin-portfolio-holdings', tr: 'bitcoin-portfoy-varliklari' },
      columns: tr
        ? ['Etiket', 'BTC Miktarı (BTC)', 'Alış Fiyatı (USD)', 'Alış Tarihi', 'Eklenme Zamanı']
        : ['Label', 'BTC amount (BTC)', 'Purchase price (USD)', 'Purchase date', 'Created at'],
      rows: holdings.map((h) => [
        h.label,
        csvBtc(h.btcAmount),
        csvNumber(h.purchasePrice),
        h.purchaseDate || '',
        h.createdAt,
      ]),
    });
  }, [holdings, language, exportCsv]);

  return { holdings, addHolding, updateHolding, deleteHolding, clearAll, exportCSV, storageAvailable };
};
