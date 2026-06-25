import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SUPPORTED_CURRENCIES } from '@/services/bitcoinApi';
import { useLanguage } from '@/contexts/LanguageContext';
import { InputPanel, CalculateButton } from '@/components/calculator';

interface HODLInputPanelProps {
  onCalculate: (params: {
    investmentAmount: number;
    startDate: Date;
    endDate: Date;
    currency: string;
    strategies: ('hodl' | 'dca-weekly' | 'dca-monthly' | 'buy-dip' | 'rebalance')[];
  }) => void;
  isCalculating: boolean;
}

export const HODLInputPanel = ({ onCalculate, isCalculating }: HODLInputPanelProps) => {
  const { language } = useLanguage();
  const tr = language==='tr';
  const [amount, setAmount] = useState('10000');
  const [currency, setCurrency] = useState('USD');
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 4);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedStrategies, setSelectedStrategies] = useState<Set<string>>(
    new Set(['hodl', 'dca-monthly'])
  );

  const quickAmounts = [
    { label: tr ? '₺1B' : '$1K', value: 1000 },
    { label: tr ? '₺5B' : '$5K', value: 5000 },
    { label: tr ? '₺10B' : '$10K', value: 10000 },
    { label: tr ? '₺50B' : '$50K', value: 50000 }
  ];

  const datePresets = [
    { label: tr ? '1 Yıl' : '1 Year', months: 12 },
    { label: tr ? '2 Yıl' : '2 Years', months: 24 },
    { label: tr ? '4 Yıl' : '4 Years', months: 48 },
    { label: tr ? '8 Yıl' : '8 Years', months: 96 }
  ];

  const strategies = [
    { id: 'hodl', label: tr ? 'Saf HODL' : 'Pure HODL', description: tr ? 'Başta bir kez al' : 'Buy once at start' },
    { id: 'dca-weekly', label: tr ? 'Haftalık DCA' : 'DCA Weekly', description: tr ? 'Haftalık alımlar' : 'Weekly purchases' },
    { id: 'dca-monthly', label: tr ? 'Aylık DCA' : 'DCA Monthly', description: tr ? 'Aylık alımlar' : 'Monthly purchases' },
    { id: 'buy-dip', label: tr ? 'Düşüşten Al' : 'Buy the Dip', description: tr ? '%10+ düşüşlerde al' : 'Buy on 10%+ drops' },
    { id: 'rebalance', label: tr ? 'Dengeleme' : 'Rebalancing', description: tr ? '60/40 BTC/Nakit' : '60/40 BTC/Cash' }
  ];

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleDatePreset = (months: number) => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - months);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  const toggleStrategy = (strategyId: string) => {
    const newStrategies = new Set(selectedStrategies);
    if (newStrategies.has(strategyId)) {
      newStrategies.delete(strategyId);
    } else {
      newStrategies.add(strategyId);
    }
    setSelectedStrategies(newStrategies);
  };

  const handleCalculate = () => {
    if (selectedStrategies.size < 2) {
      alert(tr ? 'Lütfen karşılaştırmak için en az 2 strateji seçin' : 'Please select at least 2 strategies to compare');
      return;
    }

    onCalculate({
      investmentAmount: parseFloat(amount) || 0,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      currency,
      strategies: Array.from(selectedStrategies) as any[]
    });
  };

  return (
    <InputPanel
      title={tr ? 'Strateji Parametreleri' : 'Strategy Parameters'}
      onSubmit={(e) => { e.preventDefault(); if (!isCalculating && selectedStrategies.size >= 2) handleCalculate(); }}
      footer={
        <div className="space-y-2">
          <CalculateButton loading={isCalculating} disabled={selectedStrategies.size < 2} fullWidth>
            {tr ? 'Stratejileri Karşılaştır' : 'Compare Strategies'}
          </CalculateButton>
          {selectedStrategies.size < 2 && (
            <p className="text-xs text-muted-foreground text-center">
              {tr ? 'Karşılaştırmaya başlamak için en az 2 strateji seçin' : 'Select at least 2 strategies to begin comparison'}
            </p>
          )}
        </div>
      }
    >
        {/* Investment Amount */}
        <div className="space-y-2">
          <Label htmlFor="investment-amount" className="text-sm font-medium">
            {tr ? 'Toplam Yatırım Tutarı' : 'Total Investment Amount'}
          </Label>
          <div className="flex gap-2">
            <Input
              id="investment-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="10000"
              className="h-11"
              aria-label={tr ? 'Toplam yatırım tutarını girin' : 'Enter total investment amount'}
            />
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-24 h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_CURRENCIES.map(curr => (
                  <SelectItem key={curr.code} value={curr.code}>
                    {curr.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Quick Amount Buttons */}
          <div className="flex gap-2">
            {quickAmounts.map(qa => (
              <Button
                key={qa.value}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAmount(qa.value)}
                className="flex-1 h-9 bg-muted/50"
              >
                {qa.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">{tr ? 'Zaman Aralığı' : 'Time Period'}</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="start-date" className="text-xs text-muted-foreground">
                {tr ? 'Başlangıç Tarihi' : 'Start Date'}
              </Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={endDate}
                className="h-11"
              />
            </div>
            <div>
              <Label htmlFor="end-date" className="text-xs text-muted-foreground">
                {tr ? 'Bitiş Tarihi' : 'End Date'}
              </Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                max={new Date().toISOString().split('T')[0]}
                className="h-11"
              />
            </div>
          </div>
          
          {/* Date Presets */}
          <div className="grid grid-cols-2 gap-2">
            {datePresets.map(preset => (
              <Button
                key={preset.label}
                variant="outline"
                size="sm"
                onClick={() => handleDatePreset(preset.months)}
                className="h-9 bg-muted/50"
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Strategy Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">{tr ? 'Stratejileri Seçin (en az 2)' : 'Select Strategies (minimum 2)'}</Label>
          <div className="space-y-2">
            {strategies.map(strategy => (
              <label
                key={strategy.id}
                htmlFor={strategy.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-border/30 bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer"
              >
                <Checkbox
                  id={strategy.id}
                  checked={selectedStrategies.has(strategy.id)}
                  onCheckedChange={() => toggleStrategy(strategy.id)}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <span className="block text-sm font-medium">
                    {strategy.label}
                  </span>
                  <p className="text-xs text-muted-foreground">{strategy.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

    </InputPanel>
  );
};
