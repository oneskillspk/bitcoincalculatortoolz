import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertTriangle,
  Wifi,
  Clock,
  Database,
  RefreshCw,
  Info,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface EnhancedErrorDisplayProps {
  error: Error | string;
  onRetry?: () => void;
  context?: 'network' | 'data' | 'calculation' | 'general';
  className?: string;
}

export const EnhancedErrorDisplay = ({
  error,
  onRetry,
  context = 'general',
  className
}: EnhancedErrorDisplayProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const errorMessage = typeof error === 'string' ? error : error.message;

  const getErrorInfo = () => {
    if (errorMessage.includes('Network Error') || errorMessage.includes('Failed to fetch')) {
      return {
        type: 'network',
        icon: Wifi,
        title: tr ? 'Bağlantı Sorunu' : 'Connection Issue',
        description: tr
          ? 'Bitcoin fiyat verisi alınamıyor. Lütfen internet bağlantınızı kontrol edin.'
          : 'Unable to fetch Bitcoin price data. Please check your internet connection.',
        suggestions: tr
          ? ['İnternet bağlantınızı kontrol edin', 'Sayfayı yenilemeyi deneyin', 'Reklam engelleyiciyi geçici olarak devre dışı bırakın']
          : ['Check your internet connection', 'Try refreshing the page', 'Disable any ad blockers temporarily'],
        actionText: tr ? 'Yeniden Bağlan' : 'Retry Connection'
      };
    }

    if (errorMessage.includes('timeout') || errorMessage.includes('429')) {
      return {
        type: 'rate-limit',
        icon: Clock,
        title: tr ? 'Hizmet Geçici Olarak Kullanılamıyor' : 'Service Temporarily Unavailable',
        description: tr
          ? 'Bitcoin API şu anda meşgul. Lütfen bir süre bekleyip tekrar deneyin.'
          : 'The Bitcoin API is currently busy. Please wait a moment and try again.',
        suggestions: tr
          ? ['30 saniye bekleyip tekrar deneyin', 'Hizmet otomatik olarak devam edecek', 'Farklı bir zaman aralığı deneyin']
          : ['Wait 30 seconds and try again', 'The service will resume automatically', 'Try using a different time range'],
        actionText: tr ? 'Tekrar Dene' : 'Try Again'
      };
    }

    if (errorMessage.includes('No price data') || errorMessage.includes('data not available')) {
      return {
        type: 'no-data',
        icon: Database,
        title: tr ? 'Veri Mevcut Değil' : 'Data Not Available',
        description: tr
          ? 'Seçilen tarih veya para birimi için fiyat verisi mevcut değil.'
          : 'Price data is not available for the selected date or currency.',
        suggestions: tr
          ? ['Daha yeni bir tarih deneyin (2010 sonrası)', 'Daha iyi kapsam için USD kullanın', 'Farklı bir zaman aralığı seçin']
          : ['Try a more recent date (after 2010)', 'Switch to USD currency for better coverage', 'Select a different time period'],
        actionText: tr ? 'Ayarları Düzenle' : 'Adjust Settings'
      };
    }

    if (errorMessage.includes('date') || errorMessage.includes('Invalid')) {
      return {
        type: 'date-error',
        icon: Info,
        title: tr ? 'Geçersiz Tarih Seçimi' : 'Invalid Date Selection',
        description: tr
          ? 'Seçilen tarih Bitcoin fiyat hesaplamaları için desteklenmiyor.'
          : 'The selected date is not supported for Bitcoin price calculations.',
        suggestions: tr
          ? ['Bitcoin 3 Ocak 2009\'da başladı', '2009 ile bugün arasında bir tarih seçin', 'Güvenilirlik için hazır tarih seçeneklerini kullanın']
          : ['Bitcoin started on January 3, 2009', 'Choose a date between 2009 and today', 'Use preset date options for reliability'],
        actionText: tr ? 'Geçerli Tarih Seç' : 'Select Valid Date'
      };
    }

    return {
      type: 'general',
      icon: AlertTriangle,
      title: tr ? 'Hesaplama Hatası' : 'Calculation Error',
      description: tr
        ? 'Yatırım hesaplamanız işlenirken bir hata oluştu.'
        : 'An error occurred while processing your investment calculation.',
      suggestions: tr
        ? ['Farklı yatırım tutarlarıyla deneyin', 'Sayfayı yenileyip tekrar deneyin', 'Tüm alanların doğru doldurulduğunu kontrol edin']
        : ['Try with different investment amounts', 'Refresh the page and try again', 'Check if all fields are filled correctly'],
      actionText: tr ? 'Tekrar Dene' : 'Try Again'
    };
  };

  const errorInfo = getErrorInfo();
  const IconComponent = errorInfo.icon;

  return (
    <Card className={cn("glass-morphism-card border-destructive/20", className)}>
      <CardContent className="p-8">
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto">
              <IconComponent className="w-8 h-8 text-destructive" />
            </div>
            <div className="space-y-2">
              <h3 className="text-h3 font-bold text-foreground">
                {errorInfo.title}
              </h3>
              <p className="text-foreground/70">
                {errorInfo.description}
              </p>
            </div>
          </div>

          <Alert className="border-destructive/20 bg-destructive/5">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm text-destructive/80">
              <span className="font-medium">{tr ? 'Teknik detaylar:' : 'Technical details:'}</span> {errorMessage}
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <h4 className="font-medium text-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              {tr ? 'Deneyebileceğiniz hızlı çözümler:' : 'Quick fixes to try:'}
            </h4>
            <ul className="space-y-2">
              {errorInfo.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-foreground/70">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3">
            {onRetry && (
              <Button onClick={onRetry} className="btn-premium flex-1">
                <RefreshCw className="w-4 h-4 mr-2" />
                {errorInfo.actionText}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="flex-1"
            >
              {tr ? 'Sayfayı Yenile' : 'Refresh Page'}
            </Button>
          </div>

          <div className="text-center p-4 rounded-lg bg-background/50 border border-border/30">
            <p className="text-xs text-foreground/60">
              {tr
                ? 'Hâlâ sorun yaşıyor musunuz? Hesaplayıcımız CoinGecko API\'sinden canlı veri kullanıyor. Eski tarihler veya bazı para birimleri için veri kullanılabilirliği değişebilir.'
                : 'Still having issues? Our calculator uses live data from CoinGecko API. Data availability may vary for older dates or certain currencies.'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
