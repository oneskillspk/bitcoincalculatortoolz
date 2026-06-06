import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * LanguageRouteSync — zero-render component that keeps the language context
 * in sync with the URL path.
 *
 * Rules:
 *   • Any path starting with /tr  → force language to 'tr'
 *   • Any other path while language is 'tr' → switch back to 'en'
 *   • All other cases → leave the user's stored language preference untouched
 *
 * Must be rendered inside both BrowserRouter and LanguageProvider.
 */
const LanguageRouteSync: React.FC = () => {
  const { pathname } = useLocation();
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    const isTurkishPath = pathname === '/tr' || pathname.startsWith('/tr/');

    if (isTurkishPath && language !== 'tr') {
      setLanguage('tr');
    } else if (!isTurkishPath && language === 'tr') {
      setLanguage('en');
    }
  }, [pathname, language, setLanguage]);

  return null;
};

export default LanguageRouteSync;
