import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, TrendingUp } from 'lucide-react';
import { format, subYears, subMonths } from 'date-fns';
import { cn } from '@/lib/utils';
import { SUPPORTED_CURRENCIES } from '@/services/bitcoinApi';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocale } from '@/hooks/useLocale';
import { parseLocaleNumber, formatLocaleNumber } from '@/utils/parseLocaleNumber';
import { InputPanel, InputField, CalculateButton } from '@/components/calculator';

interface ModernDCAInputPanelProps {
  onCalculate: (data: {
    totalAmount: number;
    frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly';
    startDate: Date;
    endDate: Date;
    currency: string;
  }) => void;
  loading: boolean;
  initialValues?: Partial<{
    totalAmount: number;
    frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly';
    startDate: Date;
    endDate: Date;
    currency: string;
  }>;
  autoSubmit?: boolean;
}

const QUICK_AMOUNTS = [1000, 5000, 10000, 25000, 50000];

const DATE_PRESETS = [
  { key: '6m', label: '6M', getValue: () => ({ start: subMonths(new Date(), 6), end: new Date() }) },
  { key: '1y', label: '1Y', getValue: () => ({ start: subYears(new Date(), 1), end: new Date() }) },
  { key: '2y', label: '2Y', getValue: () => ({ start: subYears(new Date(), 2), end: new Date() }) },
  { key: '3y', label: '3Y', getValue: () => ({ start: subYears(new Date(), 3), end: new Date() }) },
  { key: '5y', label: '5Y', getValue: () => ({ start: subYears(new Date(), 5), end: new Date() }) },
];

const FREQ_OPTIONS: Array<{ value: 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly'; en: string; tr: string }> = [
  { value: 'daily', en: 'Daily', tr: 'Günlük' },
  { value: 'weekly', en: 'Weekly', tr: 'Haftalık' },
  { value: 'bi-weekly', en: 'Bi-weekly', tr: 'İki Haftada Bir' },
  { value: 'monthly', en: 'Monthly', tr: 'Aylık' },
  { value: 'quarterly', en: 'Quarterly', tr: 'Üç Ayda Bir' },
];

export const ModernDCAInputPanel = ({ onCalculate, loading, initialValues, autoSubmit }: ModernDCAInputPanelProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const { defaultCurrency, intlLocale } = useLocale();
  const [totalAmount, setTotalAmount] = useState<string>(
    initialValues?.totalAmount ? String(initialValues.totalAmount) : '10000',
  );
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly'>(
    initialValues?.frequency ?? 'monthly',
  );
  const [startDate, setStartDate] = useState<Date>(initialValues?.startDate ?? subYears(new Date(), 2));
  const [endDate, setEndDate] = useState<Date>(initialValues?.endDate ?? new Date());
  const [currency, setCurrency] = useState(initialValues?.currency ?? defaultCurrency);
  const [selectedPreset, setSelectedPreset] = useState('');

  const selectedCurrency = SUPPORTED_CURRENCIES.find(c => c.code === currency);

  const isValidAmount = useMemo(() => {
    const num = parseLocaleNumber(totalAmount, intlLocale);
    return !isNaN(num) && num > 0 && num <= 10000000;
  }, [totalAmount]);

  const isValidDateRange = useMemo(() => startDate && endDate && startDate < endDate, [startDate, endDate]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTotalAmount(e.target.value.replace(/[^0-9.,]/g, ''));
  };

  const handleQuickAmount = (value: number) => setTotalAmount(value.toString());

  const handleDatePreset = (preset: typeof DATE_PRESETS[0]) => {
    const dates = preset.getValue();
    setStartDate(dates.start);
    setEndDate(dates.end);
    setSelectedPreset(preset.key);
  };

  const handleCalculate = () => {
    if (!isValidAmount || !isValidDateRange) return;
    const numAmount = parseLocaleNumber(totalAmount, intlLocale);
    onCalculate({ totalAmount: numAmount, frequency, startDate, endDate, currency });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleCalculate();
  };

  const didAutoSubmitRef = useRef(false);
  useEffect(() => {
    if (!autoSubmit || didAutoSubmitRef.current) return;
    if (!isValidAmount || !isValidDateRange) return;
    didAutoSubmitRef.current = true;
    handleCalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSubmit, isValidAmount, isValidDateRange]);

  const formatAmount = (value: string) => {
    const num = parseLocaleNumber(value, intlLocale);
    return isNaN(num) ? value : formatLocaleNumber(num, intlLocale);
  };

  const getAmountPerPeriod = () => {
    const total = parseLocaleNumber(totalAmount, intlLocale);
    if (isNaN(total) || !isValidDateRange) return 0;
    const diffDays = Math.ceil(Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    let periods = 0;
    switch (frequency) {
      case 'daily': periods = diffDays; break;
      case 'weekly': periods = Math.ceil(diffDays / 7); break;
      case 'bi-weekly': periods = Math.ceil(diffDays / 14); break;
      case 'monthly': periods = Math.ceil(diffDays / 30); break;
      case 'quarterly': periods = Math.ceil(diffDays / 90); break;
    }
    return periods > 0 ? total / periods : 0;
  };

  const perPeriod = getAmountPerPeriod();

  return (
    <InputPanel
      id="dca-calc"
      onSubmit={handleSubmit}
      title={tr ? 'DCA Hesaplayıcısı' : 'DCA Calculator'}
      description={tr ? 'Dolar Maliyet Ortalama Stratejisi' : 'Dollar Cost Averaging Strategy'}
      footer={
        <div data-calc-cta="true">
          <CalculateButton
            type="submit"
            loading={loading}
            loadingLabel={tr ? 'Hesaplanıyor…' : 'Calculating…'}
            disabled={!isValidAmount || !isValidDateRange}
          >
            <TrendingUp className="h-4 w-4" aria-hidden />
            {tr ? 'DCA Getirilerini Hesapla' : 'Calculate DCA Returns'}
          </CalculateButton>
        </div>
      }
    >
      <InputField
        label={tr ? 'Toplam Yatırım Tutarı' : 'Total Investment Amount'}
        error={!isValidAmount && totalAmount ? (tr ? 'Geçerli bir tutar girin' : 'Enter a valid amount') : undefined}
      >
        {({ id, ...aria }) => (
          <div className="space-y-2">
            <div className="grid grid-cols-5 gap-2">
              {QUICK_AMOUNTS.map((value) => (
                <Button
                  key={value}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAmount(value)}
                  className={cn(
                    "h-8 text-xs border-border/40 hover:border-primary/40",
                    totalAmount === value.toString() && "border-primary bg-primary/5 text-primary"
                  )}
                >
                  ${value >= 1000 ? `${value / 1000}K` : value}
                </Button>
              ))}
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">{selectedCurrency?.symbol}</span>
              <Input
                id={id}
                {...aria}
                type="text"
                inputMode="decimal"
                value={formatAmount(totalAmount)}
                onChange={handleAmountChange}
                placeholder={tr ? 'Toplam tutarı girin' : 'Enter total amount'}
                className={cn("pl-8 h-11 font-mono", !isValidAmount && totalAmount && "border-destructive/50")}
              />
            </div>
          </div>
        )}
      </InputField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--calc-space-field)]">
        <InputField
          label={tr ? 'Sıklık' : 'Frequency'}
          tooltip={perPeriod > 0
            ? `${selectedCurrency?.symbol}${perPeriod.toFixed(0)} ${tr ? 'her' : 'per'} ${tr ? FREQ_OPTIONS.find(f => f.value === frequency)?.tr.toLowerCase() : frequency}`
            : undefined}
        >
          {({ id }) => (
            <Select value={frequency} onValueChange={(v: any) => setFrequency(v)}>
              <SelectTrigger id={id} className="h-11"><SelectValue /></SelectTrigger>
              <SelectContent>
                {FREQ_OPTIONS.map(f => (
                  <SelectItem key={f.value} value={f.value}>{tr ? f.tr : f.en}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </InputField>

        <InputField label={tr ? 'Para Birimi' : 'Currency'}>
          {({ id }) => (
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger id={id} className="h-11">
                <SelectValue>
                  <span className="flex items-center gap-2">
                    <span>{selectedCurrency?.flag}</span>
                    <span className="font-medium">{selectedCurrency?.code}</span>
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-96 overflow-y-auto">
                {SUPPORTED_CURRENCIES.map((curr) => (
                  <SelectItem key={curr.code} value={curr.code}>
                    <span className="flex items-center gap-2">
                      <span>{curr.flag}</span>
                      <span className="font-medium">{curr.code}</span>
                      <span className="text-muted-foreground text-sm">{curr.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </InputField>
      </div>

      <InputField
        label={tr ? 'Yatırım Dönemi' : 'Investment Period'}
        tooltip={tr
          ? 'Yatırımlarınızı yaymak istediğiniz zaman dilimi. Toplam tutar bu dönem boyunca eşit olarak bölünür.'
          : 'Time period to spread your investments. Total amount is divided equally across this period.'}
      >
        <div className="space-y-2">
          <div className="grid grid-cols-5 gap-2">
            {DATE_PRESETS.map((preset) => (
              <Button
                key={preset.key}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleDatePreset(preset)}
                className={cn(
                  "h-8 text-xs border-border/40 hover:border-primary/40",
                  selectedPreset === preset.key && "border-primary bg-primary/5 text-primary"
                )}
              >
                {preset.label}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button type="button" variant="outline" className="w-full justify-start h-11 font-normal text-sm">
                  <CalendarIcon className="mr-2 h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{startDate ? format(startDate, "MMM dd, yyyy") : (tr ? 'Başlangıç' : 'Start')}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50">
                <Calendar mode="single" selected={startDate} onSelect={(d) => d && setStartDate(d)}
                  disabled={(date) => date > new Date() || date < new Date("2009-01-03")} initialFocus />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button type="button" variant="outline" className="w-full justify-start h-11 font-normal text-sm">
                  <CalendarIcon className="mr-2 h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{endDate ? format(endDate, "MMM dd, yyyy") : (tr ? 'Bitiş' : 'End')}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50">
                <Calendar mode="single" selected={endDate} onSelect={(d) => d && setEndDate(d)}
                  disabled={(date) => date > new Date() || date < startDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </InputField>
    </InputPanel>
  );
};
