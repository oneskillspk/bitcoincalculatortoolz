import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WifiOff, Wifi, AlertTriangle, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const OfflineIndicator = React.memo(() => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasStaticData, setHasStaticData] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    fetch('/data/bitcoin_prices_v1.json')
      .then(() => setHasStaticData(true))
      .catch(() => setHasStaticData(false));

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await fetch('/data/bitcoin_prices_v1.json');
      window.location.reload();
    } catch (error) {
      console.warn('Retry failed:', error);
    } finally {
      setIsRetrying(false);
    }
  };

  if (isOnline && hasStaticData) {
    return null;
  }

  return (
    <Card className="mb-4 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          {!isOnline ? (
            <WifiOff className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          )}

          <div className="flex-1 min-w-0">
            {!isOnline ? (
              <div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  {tr ? 'Çevrimdışısınız' : "You're offline"}
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-300">
                  {hasStaticData
                    ? (tr
                        ? 'Hesaplamalar için önbelleğe alınmış veriler kullanılıyor. Bazı fiyatlar tahmini olabilir.'
                        : 'Using cached data for calculations. Some prices may be estimates.')
                    : (tr
                        ? 'Sınırlı işlevsellik mevcut. Tam özellikler için internete bağlanın.'
                        : 'Limited functionality available. Connect to internet for full features.')}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  {tr ? 'Sınırlı veri mevcut' : 'Limited data available'}
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-300">
                  {tr
                    ? 'Bazı hesaplamalar tahmini fiyatlar kullanabilir.'
                    : 'Some calculations may use estimated prices.'}
                </p>
              </div>
            )}
          </div>

          {!isOnline && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleRetry}
              disabled={isRetrying}
              className="h-7 px-2 text-xs border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-800"
            >
              {isRetrying ? (
                <RefreshCw className="h-3 w-3 animate-spin" />
              ) : (
                <>
                  <Wifi className="h-3 w-3 mr-1" />
                  {tr ? 'Yeniden Dene' : 'Retry'}
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

OfflineIndicator.displayName = 'OfflineIndicator';
