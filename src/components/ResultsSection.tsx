import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Bitcoin, DollarSign, Gauge, BarChart3, ListChecks } from 'lucide-react';
import { CalculationResult, SUPPORTED_CURRENCIES } from '@/services/bitcoinApi';
import { ROIGauge } from './ROIGauge';
import { formatROI, formatCurrency } from '@/utils/formatters';
import { useLanguage } from '@/contexts/LanguageContext';
import { ResultPanel, ResultsGrid, ResultCard, ResultRow } from '@/components/calculator';

interface ResultsSectionProps {
  result: CalculationResult;
  showInBtc: boolean;
}

export const ResultsSection = ({ result, showInBtc }: ResultsSectionProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const [animatedValues, setAnimatedValues] = useState({
    btcAmount: 0,
    currentValue: 0,
    profitLoss: 0,
    startPrice: 0,
    currentPrice: 0,
  });

  const currency = SUPPORTED_CURRENCIES.find(c => c.code === result.currency);
  const isProfit = result.profitLoss >= 0;

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const stepDuration = duration / steps;
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setAnimatedValues({
        btcAmount: result.btcAmount * easeOut,
        currentValue: result.currentValue * easeOut,
        profitLoss: result.profitLoss * easeOut,
        startPrice: result.startPrice * easeOut,
        currentPrice: result.currentPrice * easeOut,
      });
      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedValues({
          btcAmount: result.btcAmount,
          currentValue: result.currentValue,
          profitLoss: result.profitLoss,
          startPrice: result.startPrice,
          currentPrice: result.currentPrice,
        });
      }
    }, stepDuration);
    return () => clearInterval(timer);
  }, [result]);

  const formatValue = (value: number) => formatCurrency(value, currency, showInBtc);
  const formatPrice = (value: number) =>
    `${currency?.symbol}${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const priceDelta = result.currentPrice - result.startPrice;
  const pricePctDelta = (priceDelta / result.startPrice) * 100;
  const priceUp = priceDelta >= 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <ResultPanel
        eyebrow={tr ? 'Anlık görünüm' : 'Snapshot'}
        title={tr ? 'Sonuçlar' : 'Results'}
        icon={<Bitcoin />}
        accentBar={isProfit ? 'positive' : 'negative'}
      >
        <ResultsGrid cols={3}>
          <ResultCard
            label={tr ? 'Satın Alınan Bitcoin' : 'Bitcoin Purchased'}
            value={`${animatedValues.btcAmount.toFixed(8)} BTC`}
            sub={`@ ${formatPrice(animatedValues.startPrice)}`}
            icon={<Bitcoin />}
          />
          <ResultCard
            label={tr ? 'Güncel Değer' : 'Current Value'}
            value={formatValue(animatedValues.currentValue)}
            sub={`@ ${formatPrice(animatedValues.currentPrice)}`}
            icon={<DollarSign />}
          />
          <ResultCard
            label={isProfit ? (tr ? 'Kâr' : 'Profit') : (tr ? 'Zarar' : 'Loss')}
            value={`${isProfit ? '+' : ''}${formatValue(animatedValues.profitLoss)}`}
            sub={`${formatROI(result.roiPercentage, 2)} ${tr ? 'YG' : 'ROI'}`}
            tone={isProfit ? 'positive' : 'negative'}
            icon={isProfit ? <TrendingUp /> : <TrendingDown />}
          />
        </ResultsGrid>
      </ResultPanel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResultPanel
          eyebrow="ROI"
          title={tr ? 'Yatırım Getirisi' : 'Return on Investment'}
          icon={<Gauge />}
        >
          <div className="flex items-center justify-center py-4">
            <ROIGauge percentage={result.roiPercentage} />
          </div>
        </ResultPanel>

        <ResultPanel
          eyebrow={tr ? 'Fiyat' : 'Price'}
          title={tr ? 'Bitcoin Fiyat Karşılaştırması' : 'Bitcoin Price Comparison'}
          icon={<BarChart3 />}
        >
          <ResultsGrid cols={2}>
            <ResultCard
              label={tr ? 'Başlangıç Tarihi Fiyatı' : 'Start Date Price'}
              value={formatPrice(result.startPrice)}
              sub={result.startDate}
            />
            <ResultCard
              label={tr ? 'Güncel Fiyat' : 'Current Price'}
              value={formatPrice(result.currentPrice)}
              sub={tr ? 'Bugün' : 'Today'}
            />
          </ResultsGrid>
          <ResultRow
            label={tr ? 'Fiyat Değişimi' : 'Price Change'}
            value={`${priceUp ? '+' : ''}${formatPrice(priceDelta)}`}
            sub={`${priceUp ? '+' : ''}${pricePctDelta.toFixed(2)}%`}
            tone={priceUp ? 'positive' : 'negative'}
            emphasis
            divider
          />
        </ResultPanel>
      </div>

      <ResultPanel
        eyebrow={tr ? 'Özet' : 'Summary'}
        title={tr ? 'Yatırım Özeti' : 'Investment Summary'}
        icon={<ListChecks />}
      >
        <ResultsGrid cols={4}>
          <ResultCard
            label={tr ? 'Başlangıç Yatırımı' : 'Initial Investment'}
            value={formatPrice(result.investmentAmount)}
            size="sm"
          />
          <ResultCard
            label={tr ? 'Edinilen Bitcoin' : 'Bitcoin Acquired'}
            value={`${result.btcAmount.toFixed(8)} BTC`}
            size="sm"
          />
          <ResultCard
            label={tr ? 'Güncel Değer' : 'Current Worth'}
            value={formatPrice(result.currentValue)}
            size="sm"
          />
          <ResultCard
            label={tr ? 'Toplam Getiri' : 'Total Return'}
            value={formatROI(result.roiPercentage, 2)}
            tone={isProfit ? 'positive' : 'negative'}
            size="sm"
          />
        </ResultsGrid>
      </ResultPanel>
    </div>
  );
};
