import React, { useState, useMemo } from 'react';
import { formatGroupedInt } from '@/utils/numberFormat';
import { InputPanel, CalculateButton } from '@/components/calculator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { CalendarIcon, DollarSign, GitCompare, Target } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, subMonths, subYears } from 'date-fns';
import { cn } from '@/lib/utils';
import { SUPPORTED_CURRENCIES } from '@/services/bitcoinApi';
import { LumpSumParams, DCAParams, DVAParams } from '@/services/lumpSumDcaComparator';
import { useLanguage } from '@/contexts/LanguageContext';

interface ComparisonInputPanelProps {
  onCalculate: (params: { lumpSum: LumpSumParams; dca: DCAParams; dva?: DVAParams }) => void;
  loading?: boolean;
}

export const ComparisonInputPanel = ({ onCalculate, loading }: ComparisonInputPanelProps) => {
  const { language } = useLanguage();
  const tr = language==='tr';
  // Lump Sum State
  const [lumpSumAmount, setLumpSumAmount] = useState<string>('10000');
  const [lumpSumDate, setLumpSumDate] = useState<Date>(subYears(new Date(), 2));
  
  // DCA State
  const [dcaAmount, setDcaAmount] = useState<string>('10000');
  const [dcaFrequency, setDcaFrequency] = useState<'daily' | 'weekly' | 'bi-weekly' | 'monthly'>('monthly');
  const [dcaStartDate, setDcaStartDate] = useState<Date>(subYears(new Date(), 2));
  const [dcaEndDate, setDcaEndDate] = useState<Date>(subMonths(new Date(), 1));
  
  // DVA State
  const [dvaEnabled, setDvaEnabled] = useState(false);
  const [dvaTargetGrowth, setDvaTargetGrowth] = useState<string>('');
  
  // Shared State
  const [currency, setCurrency] = useState<string>('USD');
  const [lumpSumCalendarOpen, setLumpSumCalendarOpen] = useState(false);
  const [dcaStartCalendarOpen, setDcaStartCalendarOpen] = useState(false);
  const [dcaEndCalendarOpen, setDcaEndCalendarOpen] = useState(false);

  // Auto-calculate default DVA target growth
  const defaultDvaTargetGrowth = useMemo(() => {
    const total = parseFloat(dcaAmount) || 0;
    const dates = [];
    let cur = new Date(dcaStartDate);
    const interval = dcaFrequency === 'daily' ? 1 : dcaFrequency === 'weekly' ? 7 : dcaFrequency === 'bi-weekly' ? 14 : 30;
    while (cur <= dcaEndDate) {
      dates.push(new Date(cur));
      cur = new Date(cur);
      cur.setDate(cur.getDate() + interval);
    }
    return dates.length > 0 ? Math.round(total / dates.length) : 0;
  }, [dcaAmount, dcaFrequency, dcaStartDate, dcaEndDate]);

  const effectiveDvaTarget = dvaTargetGrowth ? parseFloat(dvaTargetGrowth) : defaultDvaTargetGrowth;

  const handleCalculate = () => {
    const lumpSumParams: LumpSumParams = {
      amount: parseFloat(lumpSumAmount) || 0,
      investmentDate: lumpSumDate,
      currency
    };

    const dcaParams: DCAParams = {
      totalAmount: parseFloat(dcaAmount) || 0,
      frequency: dcaFrequency,
      startDate: dcaStartDate,
      endDate: dcaEndDate,
      currency
    };

    const dvaParams: DVAParams | undefined = dvaEnabled ? {
      totalAmount: parseFloat(dcaAmount) || 0,
      targetGrowthPerPeriod: effectiveDvaTarget,
      frequency: dcaFrequency,
      startDate: dcaStartDate,
      endDate: dcaEndDate,
      currency
    } : undefined;

    onCalculate({ lumpSum: lumpSumParams, dca: dcaParams, dva: dvaParams });
  };

  const isValidCalculation = () => {
    return (
      parseFloat(lumpSumAmount) > 0 &&
      parseFloat(dcaAmount) > 0 &&
      lumpSumDate &&
      dcaStartDate &&
      dcaEndDate &&
      dcaStartDate < dcaEndDate
    );
  };

  const frequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'bi-weekly', label: 'Bi-weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  const currencySymbol = SUPPORTED_CURRENCIES.find(c => c.code === currency)?.symbol || '$';

  return (
    <InputPanel
      onSubmit={(e) => { e.preventDefault(); if (isValidCalculation() && !loading) handleCalculate(); }}
      title={
        <span className="inline-flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <GitCompare className="h-4 w-4" aria-hidden />
          </span>
          <span>{tr ? 'Strateji Karşılaştırması' : 'Strategy Comparison'}</span>
        </span>
      }
      description={tr ? `Toplu yatırım, DCA${dvaEnabled ? ' ve DVA' : ''} stratejilerini karşılaştırın` : `Compare lump sum, DCA${dvaEnabled ? ', and DVA' : ''} strategies`}
      footer={
        <CalculateButton fullWidth loading={loading} disabled={!isValidCalculation()} loadingLabel={tr ? 'Stratejiler analiz ediliyor...' : 'Analyzing Strategies...'}>
          <GitCompare className="w-4 h-4 mr-2" />
          {tr ? 'Stratejileri Karşılaştır' : 'Compare Strategies'}
        </CalculateButton>
      }
    >
      <div className="space-y-6">
        {/* Currency Selection */}
        <div className="space-y-2">
          <Label htmlFor="currency" className="text-sm font-medium text-foreground">
            {tr ? 'Para Birimi' : 'Currency'}
          </Label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger id="currency" aria-label={tr ? 'Para Birimi' : 'Currency'} className="">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-64">
              {SUPPORTED_CURRENCIES.slice(0, 20).map((curr) => (
                <SelectItem key={curr.code} value={curr.code}>
                  <div className="flex items-center gap-2">
                    <span>{curr.flag}</span>
                    <span>{curr.code}</span>
                    <span className="text-muted-foreground">- {curr.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Lump Sum Section */}
        <div className="calc-surface-subtle space-y-4 p-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-foreground">{tr ? 'Toplu Yatırım Stratejisi' : 'Lump Sum Strategy'}</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lump-sum-amount" className="text-sm font-medium text-foreground">
                {tr ? 'Yatırım Tutarı' : 'Investment Amount'}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
                  {currencySymbol}
                </span>
                <Input
                  id="lump-sum-amount"
                  type="number" inputMode="decimal"
                  value={lumpSumAmount}
                  onChange={(e) => setLumpSumAmount(e.target.value)}
                  placeholder="10000"
                  className="pl-8"
                  min="1"
                  step="1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lump-sum-date" className="text-sm font-medium text-foreground">
                {tr ? 'Yatırım Tarihi' : 'Investment Date'}
              </Label>
              <Popover open={lumpSumCalendarOpen} onOpenChange={setLumpSumCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal w-full",
                      !lumpSumDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {lumpSumDate ? format(lumpSumDate, "PPP") : (tr ? 'Tarih seçin' : 'Pick a date')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={lumpSumDate}
                    onSelect={(date) => {
                      if (date) setLumpSumDate(date);
                      setLumpSumCalendarOpen(false);
                    }}
                    disabled={(date) => 
                      date > new Date() || date < new Date("2010-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <Separator className="bg-border/40" />

        {/* DCA Section */}
        <div className="calc-surface-subtle space-y-4 p-4">
          <div className="flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-foreground">{tr ? 'Dolar Maliyet Ortalaması' : 'Dollar Cost Averaging'}</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dca-amount" className="text-sm font-medium text-foreground">
                {tr ? 'Toplam Tutar' : 'Total Amount'}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
                  {currencySymbol}
                </span>
                <Input
                  id="dca-amount"
                  type="number" inputMode="decimal"
                  value={dcaAmount}
                  onChange={(e) => setDcaAmount(e.target.value)}
                  placeholder="10000"
                  className="pl-8"
                  min="1"
                  step="1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dca-frequency" className="text-sm font-medium text-foreground">
                {tr ? 'Alım Sıklığı' : 'Purchase Frequency'}
              </Label>
              <Select value={dcaFrequency} onValueChange={(value: any) => setDcaFrequency(value)}>
                <SelectTrigger className="">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {frequencyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="dca-start-date" className="text-sm font-medium text-foreground">
                  {tr ? 'Başlangıç Tarihi' : 'Start Date'}
                </Label>
                <Popover open={dcaStartCalendarOpen} onOpenChange={setDcaStartCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal w-full",
                        !dcaStartDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dcaStartDate ? format(dcaStartDate, "MMM dd") : (tr ? 'Başlangıç' : 'Start')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dcaStartDate}
                      onSelect={(date) => {
                        if (date) setDcaStartDate(date);
                        setDcaStartCalendarOpen(false);
                      }}
                      disabled={(date) => 
                        date > new Date() || date < new Date("2010-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dca-end-date" className="text-sm font-medium text-foreground">
                  {tr ? 'Bitiş Tarihi' : 'End Date'}
                </Label>
                <Popover open={dcaEndCalendarOpen} onOpenChange={setDcaEndCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal w-full",
                        !dcaEndDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dcaEndDate ? format(dcaEndDate, "MMM dd") : (tr ? 'Bitiş' : 'End')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dcaEndDate}
                      onSelect={(date) => {
                        if (date) setDcaEndDate(date);
                        setDcaEndCalendarOpen(false);
                      }}
                      disabled={(date) => 
                        date > new Date() || date < dcaStartDate
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-border/40" />

        {/* DVA Toggle & Section */}
        <div className="calc-surface-subtle space-y-4 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-foreground">{tr ? 'Dolar Değeri Ortalaması (DVA)' : 'Dollar Value Averaging (DVA)'}</h3>
            </div>
            <Switch
              checked={dvaEnabled}
              onCheckedChange={setDvaEnabled}
              aria-label={tr ? 'DVA karşılaştırmasını etkinleştir' : 'Enable DVA comparison'}
            />
          </div>
          
          {dvaEnabled && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tr ? 'DVA, portföyünüzün her dönemde sabit bir hedef tutar kadar büyümesi için her yatırımı ayarlar. DCA ile aynı sıklık ve tarih aralığını kullanır.' : 'DVA adjusts each investment so your portfolio grows by a fixed target amount per period. Uses the same frequency and date range as DCA.'}
              </p>
              
              <div className="space-y-2">
                <Label htmlFor="dva-target" className="text-sm font-medium text-foreground">
                  {tr ? 'Dönem Başına Hedef Büyüme' : 'Target Growth Per Period'}
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
                    {currencySymbol}
                  </span>
                  <Input
                    id="dva-target"
                    type="number" inputMode="decimal"
                    value={dvaTargetGrowth}
                    onChange={(e) => setDvaTargetGrowth(e.target.value)}
                    placeholder={defaultDvaTargetGrowth.toString()}
                    className="pl-8"
                    min="1"
                    step="1"
                  />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {tr ? 'Varsayılan: ' : 'Default: '}{currencySymbol}{formatGroupedInt(defaultDvaTargetGrowth)}{tr ? ' dönem başına (DCA toplamı ile eşleşir)' : ' per period (matches DCA total)'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Calculate moved to footer */}

        {/* Quick Preset Buttons */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">{tr ? 'Hızlı Hazır Ayarlar' : 'Quick Presets'}</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setLumpSumAmount('10000');
                setDcaAmount('10000');
                setDcaFrequency('monthly');
                setLumpSumDate(subYears(new Date(), 2));
                setDcaStartDate(subYears(new Date(), 2));
                setDcaEndDate(subMonths(new Date(), 1));
              }}
              className="text-xs"
            >
              {tr ? '2 Yıllık Karşılaştırma' : '2 Year Comparison'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setLumpSumAmount('5000');
                setDcaAmount('5000');
                setDcaFrequency('weekly');
                setLumpSumDate(subYears(new Date(), 1));
                setDcaStartDate(subYears(new Date(), 1));
                setDcaEndDate(subMonths(new Date(), 1));
              }}
              className="text-xs"
            >
              {tr ? '1 Yıllık Test' : '1 Year Test'}
            </Button>
          </div>
        </div>
      </div>
    </InputPanel>
  );
};
