import { useState, useEffect, useCallback } from 'react';

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

  const exportCSV = useCallback(() => {
    if (holdings.length === 0) return;
    const header = 'Label,BTC Amount,Purchase Price (USD),Purchase Date,Created At';
    const rows = holdings.map(h =>
      `"${h.label}",${h.btcAmount},${h.purchasePrice},${h.purchaseDate || ''},${h.createdAt}`
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bitcoin-portfolio-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [holdings]);

  return { holdings, addHolding, updateHolding, deleteHolding, clearAll, exportCSV, storageAvailable };
};
