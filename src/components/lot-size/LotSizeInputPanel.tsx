import React from 'react';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Settings2 } from 'lucide-react';
import { brokerPresets } from '@/services/lotSizeCalculator';
import { useLanguage } from '@/contexts/LanguageContext';
import { InputPanel } from '@/components/calculator';

interface LotSizeInputPanelProps {
  accountBalance: number;
  setAccountBalance: (v: number) => void;
  riskPercent: number;
  setRiskPercent: (v: number) => void;
  entryPrice: number;
  setEntryPrice: (v: number) => void;
  stopLossPrice: number;
  setStopLossPrice: (v: number) => void;
  leverage: number;
  setLeverage: (v: number) => void;
  selectedBroker: string;
  setSelectedBroker: (v: string) => void;
  contractSize: number;
  setContractSize: (v: number) => void;
  takeProfitPrice: number;
  setTakeProfitPrice: (v: number) => void;
  maxDailyDrawdown: number;
  setMaxDailyDrawdown: (v: number) => void;
  liveBtcPrice: number;
  isLoadingPrice: boolean;
}

export const LotSizeInputPanel: React.FC<LotSizeInputPanelProps> = ({
  accountBalance, setAccountBalance,
  riskPercent, setRiskPercent,
  entryPrice, setEntryPrice,
  stopLossPrice, setStopLossPrice,
  leverage, setLeverage,
  selectedBroker, setSelectedBroker,
  contractSize, setContractSize,
  takeProfitPrice, setTakeProfitPrice,
  maxDailyDrawdown, setMaxDailyDrawdown,
}) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [advancedOpen, setAdvancedOpen] = React.useState(false);

  const handleBrokerChange = (brokerId: string) => {
    setSelectedBroker(brokerId);
    const preset = brokerPresets.find(b => b.id === brokerId);
    if (preset && brokerId !== 'custom') {
      setContractSize(preset.contractSize);
    }
  };

  const riskColor = riskPercent <= 1 ? 'text-success' : riskPercent <= 2 ? 'text-warning' : 'text-destructive';

  return (
    <InputPanel title={tr ? 'Pozisyon Parametreleri' : 'Position Parameters'}>

        {/* Account Balance */}
        <div className="space-y-2">
          <Label htmlFor="account-balance">{tr ? 'Hesap Bakiyesi (USD)' : 'Account Balance (USD)'}</Label>
          <Input
            id="account-balance"
            type="number"
            value={accountBalance || ''}
            onChange={e => setAccountBalance(parseFloat(e.target.value) || 0)}
            placeholder="10000"
            min={0}
          />
        </div>

        {/* Risk Percentage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>{tr ? 'İşlem Başına Risk' : 'Risk per Trade'}</Label>
            <span className={`text-sm font-bold ${riskColor}`}>{riskPercent}%</span>
          </div>
          <Slider
            value={[riskPercent]}
            onValueChange={([v]) => setRiskPercent(v)}
            min={0.5}
            max={5}
            step={0.1}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{tr ? '0.5% (Muhafazakâr)' : '0.5% (Conservative)'}</span>
            <span>{tr ? '5% (Agresif)' : '5% (Aggressive)'}</span>
          </div>
        </div>

        {/* Entry Price */}
        <div className="space-y-2">
          <Label htmlFor="entry-price">{tr ? 'Giriş Fiyatı (USD)' : 'Entry Price (USD)'}</Label>
          <Input
            id="entry-price"
            type="number"
            value={entryPrice || ''}
            onChange={e => setEntryPrice(parseFloat(e.target.value) || 0)}
            placeholder="85000"
            min={0}
          />
        </div>

        {/* Stop Loss Price */}
        <div className="space-y-2">
          <Label htmlFor="stop-loss">{tr ? 'Zarar Durdur Fiyatı (USD)' : 'Stop Loss Price (USD)'}</Label>
          <Input
            id="stop-loss"
            type="number"
            value={stopLossPrice || ''}
            onChange={e => setStopLossPrice(parseFloat(e.target.value) || 0)}
            placeholder="83000"
            min={0}
          />
          {entryPrice > 0 && stopLossPrice > 0 && (
            <p className="text-xs text-muted-foreground">
              {tr ? 'Stop mesafesi' : 'Stop distance'}: ${Math.abs(entryPrice - stopLossPrice).toLocaleString()} ({((Math.abs(entryPrice - stopLossPrice) / entryPrice) * 100).toFixed(2)}%)
            </p>
          )}
        </div>

        {/* Leverage */}
        <div className="space-y-2">
          <Label htmlFor="leverage">{tr ? 'Kaldıraç' : 'Leverage'}</Label>
          <div className="flex items-center gap-2">
            <Input
              id="leverage"
              type="number"
              value={leverage || ''}
              onChange={e => setLeverage(Math.max(1, parseFloat(e.target.value) || 1))}
              placeholder="1"
              min={1}
              max={200}
              className="w-24"
            />
            <span className="text-sm text-muted-foreground">{tr ? '× (1x = kaldıraç yok)' : '× (1x = no leverage)'}</span>
          </div>
        </div>

        {/* Broker Preset */}
        <div className="space-y-2">
          <Label>{tr ? 'Broker / Borsa' : 'Broker / Exchange'}</Label>
          <Select value={selectedBroker} onValueChange={handleBrokerChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {brokerPresets.map(b => (
                <SelectItem key={b.id} value={b.id}>
                  <span className="font-medium">{b.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">— {b.description}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Custom Contract Size */}
        {selectedBroker === 'custom' && (
          <div className="space-y-2">
            <Label htmlFor="contract-size">{tr ? 'Kontrat Büyüklüğü (lot başına BTC)' : 'Contract Size (BTC per lot)'}</Label>
            <Input
              id="contract-size"
              type="number"
              value={contractSize || ''}
              onChange={e => setContractSize(parseFloat(e.target.value) || 1)}
              placeholder="1"
              min={0.001}
              step={0.001}
            />
          </div>
        )}

        {/* Advanced Toggle */}
        <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
          <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            <Settings2 className="w-4 h-4" />
            {tr ? 'Gelişmiş Seçenekler' : 'Advanced Options'}
            <ChevronDown className={`w-4 h-4 transition-transform ${advancedOpen ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="take-profit">{tr ? 'Kâr Al Fiyatı (USD)' : 'Take Profit Price (USD)'}</Label>
              <Input
                id="take-profit"
                type="number"
                value={takeProfitPrice || ''}
                onChange={e => setTakeProfitPrice(parseFloat(e.target.value) || 0)}
                placeholder="90000"
                min={0}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-drawdown">{tr ? 'Maks. Günlük Düşüş (%)' : 'Max Daily Drawdown (%)'}</Label>
              <Input
                id="max-drawdown"
                type="number"
                value={maxDailyDrawdown || ''}
                onChange={e => setMaxDailyDrawdown(parseFloat(e.target.value) || 0)}
                placeholder="5"
                min={0}
                max={100}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
    </InputPanel>
  );
};
