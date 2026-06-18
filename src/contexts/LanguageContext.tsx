import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '@/types/translations';
import { translations } from '@/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'btc-calc-language';

function getInitialLanguage(): Language {
  // 1) URL prefix wins — prevents EN flash on direct /tr/* loads.
  try {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/tr' || path.startsWith('/tr/')) return 'tr';
    }
  } catch {
    // ignore
  }
  // 2) Stored preference next.
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (stored && translations[stored]) return stored;
  } catch {
    // localStorage may be unavailable in some environments
  }
  return 'en';
}

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // localStorage may be unavailable in some environments
    }
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const raw = translations[language]?.[key] || translations.en[key] || key;
    if (!params) return raw;
    return raw.replace(/\{\{(\w+)\}\}/g, (_, k) => {
      const v = params[k];
      return v === undefined ? `{{${k}}}` : String(v);
    });
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
