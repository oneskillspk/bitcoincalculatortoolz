import React, { useState, useMemo, useEffect, useRef } from 'react';
import { formatGroupedInt } from '@/utils/numberFormat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CalendarIcon,
  Calculator,
  TrendingUp,
  DollarSign,
  Bitcoin,
} from 'lucide-react';
import { format, subYears, subMonths, differenceInMonths } from 'date-fns';
import { cn } from '@/lib/utils';
import { SUPPORTED_CURRENCIES } from '@/services/bitcoinApi';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocale } from '@/hooks/useLocale';
import { parseLocaleNumber, formatLocaleNumber } from '@/utils/parseLocaleNumber';
import { InputPanel, InputField, CalculateButton } from '@/components/calculator';

interface ModernInputPanelProps {
  onCalculate: (data: {
    amount: number;
    startDate: Date;
    currency: string;
    showInBtc: boolean;
    inputMode: 'fiat' | 'btc';
  }) => void;
  loading: boolean;
  initialValues?: Partial<{
    amount: number;
    startDate: Date;
    currency: string;
    showInBtc: boolean;
    inputMode: 'fiat' | 'btc';
  }>;
  autoSubmit?: boolean;
}

const QUICK_AMOUNTS = [100, 500, 1000, 5000, 10000];
const QUICK_BTC_AMOUNTS = [0.01, 0.1, 0.5, 1, 5];

const DATE_PRESETS = [
  { key: '6m', label: '6M', getValue: () => subMonths(new Date(), 6) },
  { key: '1y', label: '1Y', getValue: () => subYears(new Date(), 1) },
  { key: '3y', label: '3Y', getValue: () => subYears(new Date(), 3) },
  { key: '5y', label: '5Y', getValue: () => subYears(new Date(), 5) },
  { key: 'max', label: 'Max', getValue: () => new Date('2009-01-03') },
];

const chipClass = cn(
  'h-10 min-h-[44px] sm:min-h-0 rounded-full text-xs font-medium',
  'border border-border/40 transition-colors',
  'active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
);

export const ModernInputPanel: React.FC<ModernInputPanelProps> = ({
  onCalculate,
  loading,
  initialValues,
  autoSubmit,
}) => {
  const { language } = useLanguage();
  const isTr = language === 'tr';
  const { intlLocale } = useLocale();

  const [amount, setAmount] = useState<string>(
    initialValues?.amount ? String(initialValues.amount) : '1000',
  );
  const [currency, setCurrency] = useState(initialValues?.currency ?? 'USD');
  const [startDate, setStartDate] = useState<Date>(
    initialValues?.startDate ?? subYears(new Date(), 1),
  );
  const [showInBtc, setShowInBtc] = useState(initialValues?.showInBtc ?? false);
  const [selectedPreset, setSelectedPreset] = useState('1y');
  const [inputMode, setInputMode] = useState<'fiat' | 'btc'>(initialValues?.inputMode ?? 'fiat');
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const selectedCurrency = SUPPORTED_CURRENCIES.find((c) => c.code === currency);

  const isValidAmount = useMemo(() => {
    const num = parseLocaleNumber(amount, intlLocale);
    if (inputMode === 'btc') return !isNaN(num) && num > 0 && num <= 21_000_000;
    return !isNaN(num) && num > 0 && num <= 1_000_000;
  }, [amount, inputMode, intlLocale]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value.replace(/[^0-9.,]/g, ''));
  };

  const handleQuickAmount = (value: number) => setAmount(value.toString());

  const handleDatePreset = (preset: typeof DATE_PRESETS[0]) => {
    setStartDate(preset.getValue());
    setSelectedPreset(preset.key);
  };

  const handleCalculate = () => {
    if (!isValidAmount || !startDate) return;
    onCalculate({
      amount: parseLocaleNumber(amount, intlLocale),
      startDate,
      currency,
      showInBtc,
      inputMode,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleCalculate();
  };

  const didAutoSubmitRef = useRef(false);
  useEffect(() => {
    if (!autoSubmit || didAutoSubmitRef.current) return;
    if (!isValidAmount || !startDate) return;
    didAutoSubmitRef.current = true;
    handleCalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSubmit, isValidAmount]);

  const handleInputModeChange = (mode: 'fiat' | 'btc') => {
    setInputMode(mode);
    setAmount(mode === 'btc' ? '0.1' : '1000');
  };

  const formatAmount = (value: string) => {
    const num = parseLocaleNumber(value, intlLocale);
    return isNaN(num) ? value : formatLocaleNumber(num, intlLocale);
  };

  const ctaDisabled = loading || !isValidAmount || !startDate;

  // Derived summary values (retirement-style timeline strip).
  const monthsHeld = startDate ? Math.max(0, differenceInMonths(new Date(), startDate)) : 0;
  const yearsHeldLabel = useMemo(() => {
    if (monthsHeld < 12) {
      return `${monthsHeld} ${isTr ? 'ay' : monthsHeld === 1 ? 'month' : 'months'}`;
    }
    const y = Math.floor(monthsHeld / 12);
    const m = monthsHeld % 12;
    const yLabel = isTr ? (y === 1 ? 'yıl' : 'yıl') : y === 1 ? 'year' : 'years';
    const mLabel = isTr ? 'ay' : m === 1 ? 'month' : 'months';
    return m === 0 ? `${y} ${yLabel}` : `${y} ${yLabel} ${m} ${mLabel}`;
  }, [monthsHeld, isTr]);
  const startDateLabel = startDate ? format(startDate, 'PP') : '—';

  return (
    <InputPanel
      id="what-if-calc"
      onSubmit={handleSubmit}
      title={
        <span className="inline-flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Calculator className="h-4 w-4" aria-hidden />
          </span>
          {isTr ? 'Yatırım Hesaplayıcısı' : 'Investment Calculator'}
        </span>
      }
      footer={
        <div data-calc-cta="true">
          <CalculateButton
            type="submit"
            loading={loading}
            disabled={ctaDisabled}
            loadingLabel={isTr ? 'Hesaplanıyor…' : 'Calculating…'}
          >
            <TrendingUp className="h-4 w-4" aria-hidden />
            {isTr ? 'Getirileri Hesapla' : 'Calculate Returns'}
          </CalculateButton>
        </div>
      }
    >
      {/* Input mode — top-of-panel Tabs, retirement pattern */}
      <InputField
        label={isTr ? 'Giriş Türü' : 'Input Mode'}
        tooltip={
          isTr
            ? 'Fiat: para birimi cinsinden bir tutar yatırın. BTC: belirli bir BTC miktarını modelleyin.'
            : 'Fiat: invest a fiat amount. BTC: model a specific BTC holding.'
        }
      >
        <Tabs value={inputMode} onValueChange={(v) => handleInputModeChange(v as 'fiat' | 'btc')} className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-full border border-border/40 bg-card/60 p-1 h-auto">
            {([
              { value: 'fiat', icon: <DollarSign className="h-3.5 w-3.5" />, label: isTr ? 'Fiat' : 'Fiat' },
              { value: 'btc', icon: <Bitcoin className="h-3.5 w-3.5" />, label: 'BTC' },
            ] as const).map((t) => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                className={cn(
                  'flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium text-muted-foreground transition-all hover:text-foreground',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                  // Mode-tinted active state per spec Section 3b.
                  t.value === 'fiat'
                    ? 'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm'
                    : 'data-[state=active]:bg-[hsl(var(--blue-accent))] data-[state=active]:text-white data-[state=active]:shadow-sm',
                )}
              >
                {t.icon}
                <span>{t.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </InputField>

      {/* Currency — own row, retirement pattern */}
      {inputMode === 'fiat' && (
        <InputField
          label={isTr ? 'Para Birimi' : 'Currency'}
          tooltip={isTr ? 'Yatırım tutarınızın ve sonuçların gösterileceği para birimi.' : 'Currency for your investment amount and results.'}
        >
          {(bag) => (
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger
                {...bag}
                className="w-full focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background"
                aria-label={isTr ? 'Para birimi seçin' : 'Select currency'}
              >
                <SelectValue>
                  <span className="inline-flex items-center gap-2">
                    <span aria-hidden>{selectedCurrency?.flag}</span>
                    <span>{selectedCurrency?.code} — {selectedCurrency?.name}</span>
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-80">
                {SUPPORTED_CURRENCIES.map((curr) => (
                  <SelectItem key={curr.code} value={curr.code}>
                    <span className="flex items-center gap-2">
                      <span aria-hidden>{curr.flag}</span>
                      <span>{curr.code} - {curr.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </InputField>
      )}

      {/* Amount */}
      <InputField
        label={inputMode === 'btc' ? (isTr ? 'BTC Miktarı' : 'BTC Amount') : (isTr ? 'Yatırım Tutarı' : 'Investment Amount')}
        tooltip={
          inputMode === 'btc'
            ? (isTr ? 'Seçilen tarihte elinizde bulundurduğunuz BTC miktarı.' : 'BTC amount you held on the selected date.')
            : (isTr ? 'O tarihte yatırım yaptığınız toplam tutar.' : 'Total fiat amount you would have invested on that date.')
        }
        error={!isValidAmount && amount ? (isTr ? 'Lütfen geçerli bir miktar giriniz.' : 'Please enter a valid amount.') : undefined}
      >
        {(bag) => (
          <div className="space-y-2">
            {/* Quick chips */}
            <div
              role="group"
              aria-label={isTr ? 'Hızlı miktar seçimi' : 'Quick amount presets'}
              className="grid grid-cols-5 gap-1.5"
            >
              {(inputMode === 'btc' ? QUICK_BTC_AMOUNTS : QUICK_AMOUNTS).map((value) => {
                const active = amount === value.toString();
                const chipLabel = inputMode === 'btc'
                  ? `₿${value}`
                  : `$${value >= 1000 ? `${value / 1000}K` : value}`;
                const fullLabel = inputMode === 'btc'
                  ? `${value} BTC`
                  : `${formatGroupedInt(value)} ${currency}`;
                return (
                  <Button
                    key={value}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAmount(value)}
                    aria-pressed={active}
                    aria-label={fullLabel}
                    className={cn(chipClass, active && 'border-primary bg-primary/10 text-primary')}
                  >
                    {chipLabel}
                  </Button>
                );
              })}
            </div>

            <div className="relative">
              <div
                aria-hidden
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none calc-text-mono"
              >
                {inputMode === 'btc' ? '₿' : selectedCurrency?.symbol}
              </div>
              <Input
                {...bag}
                type="text"
                inputMode="decimal"
                aria-label={
                  inputMode === 'btc'
                    ? (isTr ? 'BTC cinsinden tutar' : 'Amount in BTC')
                    : (isTr ? `${currency} cinsinden tutar` : `Amount in ${currency}`)
                }
                value={inputMode === 'btc' ? amount : formatAmount(amount)}
                onChange={handleAmountChange}
                placeholder={inputMode === 'btc' ? '0.00000000' : (isTr ? 'Miktar giriniz' : 'Enter amount')}
                className={cn(
                  'h-12 pl-8 pr-3 text-center calc-text-mono bg-background/60 border-border/40',
                  'focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  !isValidAmount && amount && 'border-destructive/50',
                )}
              />
            </div>
          </div>
        )}
      </InputField>

      {/* Investment date */}
      <InputField
        label={isTr ? 'Yatırım Tarihi' : 'Investment Date'}
        tooltip={isTr ? 'Bu hesaplama için varsayılan satın alma tarihi.' : 'The hypothetical purchase date used for this calculation.'}
      >
        {(bag) => (
          <div className="space-y-2">
            <div
              role="group"
              aria-label={isTr ? 'Hızlı tarih seçimi' : 'Quick date presets'}
              className="grid grid-cols-5 gap-1.5"
            >
              {DATE_PRESETS.map((preset) => {
                const active = selectedPreset === preset.key;
                return (
                  <Button
                    key={preset.key}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleDatePreset(preset)}
                    aria-pressed={active}
                    aria-label={isTr ? `Son ${preset.label}` : preset.key === 'max' ? 'All time' : `Last ${preset.label}`}
                    className={cn(chipClass, active && 'border-primary bg-primary/10 text-primary')}
                  >
                    {preset.label}
                  </Button>
                );
              })}
            </div>
            <Popover modal={false} open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  {...bag}
                  type="button"
                  variant="outline"
                  aria-label={isTr ? 'Yatırım tarihi' : 'Investment date'}
                  className="w-full justify-start h-12 border-border/40 bg-background/60 font-normal focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" aria-hidden />
                  {startDate ? format(startDate, 'PPP') : (isTr ? 'Tarih seçin' : 'Pick a date')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-background/95 backdrop-blur-sm border-border/40" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(d) => {
                    if (!d) return;
                    setStartDate(d);
                    setSelectedPreset('custom');
                    setDatePickerOpen(false);
                  }}
                  disabled={(date) => date > new Date() || date < new Date('2009-01-03')}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
      </InputField>

      {/* Derived summary strip — retirement-style */}
      <div className="calc-surface-subtle px-4 py-3 grid grid-cols-2 gap-4">
        <div>
          <div className="calc-text-label">{isTr ? 'Tutulan Süre' : 'Time Held'}</div>
          <div className="calc-text-mono text-primary text-sm mt-1">{yearsHeldLabel}</div>
        </div>
        <div>
          <div className="calc-text-label">{isTr ? 'Başlangıç Tarihi' : 'Start Date'}</div>
          <div className="calc-text-mono text-primary text-sm mt-1">{startDateLabel}</div>
        </div>
      </div>

      {/* Display toggle */}
      <div className="flex items-center justify-between rounded-[var(--calc-radius-input)] border border-border/40 bg-card/40 px-4 py-3">
        <label htmlFor="show-in-btc" className="calc-text-small font-medium text-foreground cursor-pointer">
          {isTr ? 'BTC cinsinden göster' : 'Show in BTC'}
        </label>
        <Switch
          id="show-in-btc"
          checked={showInBtc}
          onCheckedChange={setShowInBtc}
          aria-label={isTr ? `Sonuçları ${currency} yerine ₿ ile göster` : `Display results in ₿ instead of ${currency}`}
        />
      </div>
    </InputPanel>
  );
};

export default ModernInputPanel;
