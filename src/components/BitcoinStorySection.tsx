import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalculationResult } from "@/services/bitcoinApi";
import { TrendingUp, TrendingDown, Calendar, Coins, DollarSign, Share, ToggleLeft, ToggleRight, Zap, Award } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface BitcoinStorySectionProps {
  result: CalculationResult;
  showInBtc: boolean;
}

export const BitcoinStorySection = ({ result, showInBtc }: BitcoinStorySectionProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const [showSats, setShowSats] = useState(false);
  const isProfit = result.roiPercentage > 0;
  const daysSince = differenceInDays(new Date(), new Date(result.startDate));
  const currency = result.currency;

  const getCurrencySymbol = () => {
    const currencyMap: Record<string, string> = {
      'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'CAD': 'CA$',
      'AUD': 'A$', 'CHF': 'CHF', 'CNY': '¥', 'INR': '₹', 'KRW': '₩',
      'SGD': 'S$', 'HKD': 'HK$', 'THB': '฿', 'MYR': 'RM', 'IDR': 'Rp',
      'VND': '₫', 'PHP': '₱', 'PLN': 'zł', 'CZK': 'Kč', 'HUF': 'Ft',
      'AED': 'د.إ', 'SAR': 'ر.س', 'ZAR': 'R', 'TRY': '₺', 'EGP': '£',
      'ILS': '₪', 'BRL': 'R$', 'MXN': '$', 'ARS': '$', 'CLP': '$',
      'COP': '$', 'RUB': '₽', 'PKR': '₨', 'NZD': 'NZ$', 'SEK': 'kr',
      'NOK': 'kr', 'DKK': 'kr.'
    };
    return currencyMap[currency] || currency;
  };

  const formatCurrency = (amount: number) => {
    const symbol = getCurrencySymbol();
    return `${symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatBTC = (amount: number) => `₿${amount.toFixed(8)}`;
  const formatSats = (amount: number) => `${(amount * 100000000).toLocaleString()} SATS`;

  const priceMultiple = (result.currentPrice / result.startPrice).toFixed(1);
  const estimatedSP500Return = Math.min(300, Math.max(50, daysSince * 0.2));
  const vsSpReturn = result.roiPercentage - estimatedSP500Return;

  const handleShare = async () => {
    const story = tr
      ? `🚀 Bitcoin yatırım hikayem: ${format(new Date(result.startDate), 'MMM yyyy')} tarihinde ${formatCurrency(result.investmentAmount)} yatırdım, şu an değeri ${formatCurrency(result.currentValue)}! Bu %${result.roiPercentage.toFixed(1)} getiri! 📈 #Bitcoin`
      : `🚀 My Bitcoin investment story: Invested ${formatCurrency(result.investmentAmount)} in ${format(new Date(result.startDate), 'MMM yyyy')}, now worth ${formatCurrency(result.currentValue)}! That's a ${result.roiPercentage.toFixed(1)}% return! 📈 #Bitcoin`;
    try {
      if (navigator.share && navigator.canShare?.({ text: story })) {
        await navigator.share({ title: tr ? 'Bitcoin Yatırım Hikayem' : 'My Bitcoin Investment Story', text: story });
      } else {
        await navigator.clipboard.writeText(story);
      }
    } catch {
      try { await navigator.clipboard.writeText(story); } catch { /* silent */ }
    }
  };

  const whatIfScenarios = [
    { multiplier: 0.5, labelEn: 'Half Investment', labelTr: 'Yarı Yatırım' },
    { multiplier: 2,   labelEn: 'Double Investment', labelTr: 'İki Kat Yatırım' },
    { multiplier: 10,  labelEn: '10x Investment', labelTr: '10x Yatırım' },
  ];

  return (
    <Card className="glass-morphism-card border-border/30 overflow-hidden">
      <CardContent className="p-0">
        <div className="relative p-6 text-center bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
          <div className="absolute top-4 right-4">
            <Button size="sm" variant="ghost" onClick={handleShare} className="h-8 w-8 p-0">
              <Share className="w-4 h-4" />
            </Button>
          </div>

          <Badge variant={isProfit ? "default" : "destructive"} className="mb-3">
            {isProfit
              ? (tr ? '💰 Karlı Yatırım' : '💰 Profitable Investment')
              : (tr ? '📉 Yatırım Kaybı' : '📉 Investment Loss')}
          </Badge>

          <h3 className="text-h3 font-bold text-foreground mb-2">
            {tr ? 'Bitcoin Yatırım Yolculuğunuz' : 'Your Bitcoin Investment Journey'}
          </h3>

          <div className="space-y-2">
            <p className="text-sm text-foreground/70">
              {tr
                ? `${format(new Date(result.startDate), 'dd MMM yyyy')} tarihinde ${formatCurrency(result.investmentAmount)} yatırıldı`
                : `${formatCurrency(result.investmentAmount)} invested on ${format(new Date(result.startDate), 'MMM d, yyyy')}`}
            </p>
            <div className="flex items-center justify-center gap-4 text-xs">
              <Badge variant="secondary" className="text-xs">
                <Zap className="w-3 h-3 mr-1" />
                {priceMultiple}x {tr ? 'Fiyat Artışı' : 'Price Growth'}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <Award className="w-3 h-3 mr-1" />
                {daysSince} {tr ? 'Gün Tutuldu' : 'Days Held'}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-t border-border/30">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <div className="text-xs text-foreground/60">{tr ? 'Süre' : 'Duration'}</div>
            <div className="font-bold text-foreground text-sm">
              {Math.floor(daysSince / 365)}{tr ? 'y ' : 'y '}{Math.floor((daysSince % 365) / 30)}{tr ? 'a' : 'm'}
            </div>
          </div>

          <div className="text-center space-y-2">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center mx-auto">
              <Button variant="ghost" size="sm" onClick={() => setShowSats(!showSats)} className="w-8 h-8 p-0">
                <Coins className="w-4 h-4 text-accent" />
              </Button>
            </div>
            <div className="text-xs text-foreground/60">{tr ? 'Bitcoin Miktarı' : 'Bitcoin Amount'}</div>
            <div className="font-bold text-foreground text-sm">
              {showSats ? formatSats(result.btcAmount) : formatBTC(result.btcAmount)}
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowSats(!showSats)} className="h-6 px-2 text-xs">
              {showSats ? <ToggleRight className="w-3 h-3 mr-1" /> : <ToggleLeft className="w-3 h-3 mr-1" />}
              {showSats ? 'SATS' : 'BTC'}
            </Button>
          </div>

          <div className="text-center space-y-2">
            <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center mx-auto">
              <DollarSign className="w-4 h-4 text-secondary-foreground" />
            </div>
            <div className="text-xs text-foreground/60">{tr ? 'Güncel Değer' : 'Current Value'}</div>
            <div className="font-bold text-foreground text-sm">{formatCurrency(result.currentValue)}</div>
            <div className="text-xs text-foreground/50">{priceMultiple}x {tr ? 'büyüme' : 'growth'}</div>
          </div>

          <div className="text-center space-y-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto ${isProfit ? 'bg-success/10' : 'bg-destructive/10'}`}>
              {isProfit ? <TrendingUp className="w-4 h-4 text-success" /> : <TrendingDown className="w-4 h-4 text-destructive" />}
            </div>
            <div className="text-xs text-foreground/60">{tr ? 'Toplam ROI' : 'Total ROI'}</div>
            <div className={`font-bold text-sm ${isProfit ? 'text-success' : 'text-destructive'}`}>
              {result.roiPercentage > 0 ? '+' : ''}{result.roiPercentage.toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border/30">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-1">{tr ? 'Piyasa Karşılaştırması' : 'Market Comparison'}</h4>
              <p className="text-xs text-foreground/60">{tr ? 'Geleneksel Yatırıma Karşı' : 'vs Traditional Investment'}</p>
            </div>
            <div className="text-right">
              <div className={`text-sm font-bold ${vsSpReturn > 0 ? 'text-success' : 'text-destructive'}`}>
                {vsSpReturn > 0 ? '+' : ''}{vsSpReturn.toFixed(1)}% vs S&P 500
              </div>
              <p className="text-xs text-foreground/50">{tr ? 'Tahmini S&P 500:' : 'Est. S&P 500:'} +{estimatedSP500Return.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border/30">
          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            {tr ? 'Ya Olsaydı Senaryoları' : 'What If Scenarios'}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {whatIfScenarios.map(({ multiplier, labelEn, labelTr }) => {
              const hypotheticalValue = result.currentValue * multiplier;
              const hypotheticalProfit = hypotheticalValue - (result.investmentAmount * multiplier);
              return (
                <div key={labelEn} className="p-3 calc-surface-card">
                  <div className="text-xs font-medium text-foreground mb-1">{tr ? labelTr : labelEn}</div>
                  <div className="text-xs text-foreground/60 mb-2">
                    {formatCurrency(result.investmentAmount * multiplier)} {tr ? 'yatırıldı' : 'invested'}
                  </div>
                  <div className="font-bold text-foreground text-sm">{formatCurrency(hypotheticalValue)}</div>
                  <div className={`text-xs ${hypotheticalProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {hypotheticalProfit >= 0 ? '+' : ''}{formatCurrency(hypotheticalProfit)} {tr ? 'kâr' : 'profit'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 border-t border-border/30">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-xs text-foreground/60">{tr ? 'Yatırım Tarihi' : 'Investment Date'}</div>
              <div className="font-medium text-foreground text-sm">
                {format(new Date(result.startDate), tr ? 'dd MMM yyyy' : 'MMM d, yyyy')}
              </div>
              <div className="text-xs text-foreground/50">BTC: {formatCurrency(result.startPrice)}</div>
            </div>

            <div className="flex items-center">
              <div className="w-8 h-px bg-gradient-to-r from-primary/50 to-primary/10" />
              <div className="w-2 h-2 rounded-full bg-primary mx-2" />
              <div className="w-8 h-px bg-gradient-to-l from-primary/50 to-primary/10" />
            </div>

            <div className="space-y-1 text-right">
              <div className="text-xs text-foreground/60">{tr ? 'Bugün' : 'Today'}</div>
              <div className="font-medium text-foreground text-sm">
                {format(new Date(), tr ? 'dd MMM yyyy' : 'MMM d, yyyy')}
              </div>
              <div className="text-xs text-foreground/50">BTC: {formatCurrency(result.currentPrice)}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
