import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Bitcoin } from "lucide-react";
import { useState } from "react";
import { STAKING_PROTOCOLS, type StakingInput } from "@/services/stakingCalculator";
import { useLanguage } from "@/contexts/LanguageContext";
import { InputPanel, CalculateButton } from "@/components/calculator";

interface StakingInputPanelProps {
  onCalculate: (input: StakingInput) => void;
}

const BTC_PRESETS = [0.1, 0.5, 1, 5];

const RISK_COLORS: Record<string, string> = {
  low: 'text-success bg-success/10 border-success/30',
  medium: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
  high: 'text-destructive bg-destructive/10 border-destructive/30',
};

export const StakingInputPanel = ({ onCalculate }: StakingInputPanelProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const [btcAmount, setBtcAmount] = useState(1);
  const [btcInput, setBtcInput] = useState('1');
  const [selectedProtocolId, setSelectedProtocolId] = useState('babylon');
  const [years, setYears] = useState(5);
  const [compounding, setCompounding] = useState(true);

  const RISK_LABELS: Record<string, string> = {
    low: tr ? 'Düşük Risk' : 'Low Risk',
    medium: tr ? 'Orta Risk' : 'Med Risk',
    high: tr ? 'Yüksek Risk' : 'High Risk',
  };

  const handleCalculate = () => {
    const amount = parseFloat(btcInput) || 0;
    if (amount > 0) {
      onCalculate({ btcAmount: amount, protocolId: selectedProtocolId, years, compounding });
    }
  };

  const handleBtcInput = (val: string) => {
    setBtcInput(val);
    const n = parseFloat(val);
    if (!isNaN(n)) setBtcAmount(n);
  };

  const handlePreset = (preset: number) => {
    setBtcAmount(preset);
    setBtcInput(String(preset));
  };

  return (
    <InputPanel
      title={tr ? 'Staking Parametreleri' : 'Staking Parameters'}
      onSubmit={(e) => { e.preventDefault(); handleCalculate(); }}
      footer={
        <CalculateButton fullWidth>
          {tr ? 'Staking Ödüllerini Hesapla' : 'Calculate Staking Rewards'}
        </CalculateButton>
      }
    >

        {/* BTC Amount */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Bitcoin className="w-4 h-4 text-muted-foreground" />
            {tr ? 'BTC Miktarı' : 'BTC Amount'}
          </Label>
          <Input
            type="number"
            min={0.001}
            step={0.1}
            value={btcInput}
            onChange={e => handleBtcInput(e.target.value)}
            className="text-base"
            placeholder={tr ? 'örn. 1.0' : 'e.g. 1.0'}
          />
          <div className="flex gap-2">
            {BTC_PRESETS.map(preset => (
              <Button
                key={preset}
                variant={btcAmount === preset ? 'default' : 'outline'}
                size="sm"
                onClick={() => handlePreset(preset)}
                className="flex-1 text-xs"
              >
                {preset} BTC
              </Button>
            ))}
          </div>
        </div>

        {/* Protocol Selector */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">{tr ? 'Staking Protokolü' : 'Staking Protocol'}</Label>
          <div className="grid grid-cols-1 gap-2">
            {STAKING_PROTOCOLS.map(protocol => {
              const isSelected = selectedProtocolId === protocol.id;
              return (
                <button
                  key={protocol.id}
                  onClick={() => setSelectedProtocolId(protocol.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all duration-200 ${
                    isSelected
                      ? 'border-primary/50 bg-primary/5 shadow-sm'
                      : 'border-border/30 hover:border-border/60 bg-card/30'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: protocol.color }} />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground leading-tight truncate">{protocol.name}</p>
                        <p className="text-xs text-muted-foreground leading-tight mt-0.5">
                          {protocol.platform} · {protocol.lockPeriod}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${protocol.color}20`, color: protocol.color }}
                      >
                        {(protocol.apy * 100).toFixed(1)}% APY
                      </span>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${RISK_COLORS[protocol.riskLevel]}`}>
                        {RISK_LABELS[protocol.riskLevel]}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Duration Slider */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">
            {tr ? 'Süre:' : 'Duration:'}{' '}
            <span className="text-primary font-bold">
              {years} {tr ? (years !== 1 ? 'yıl' : 'yıl') : (years !== 1 ? 'years' : 'year')}
            </span>
          </Label>
          <Slider
            value={[years]}
            onValueChange={([v]) => setYears(v)}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 {tr ? 'yıl' : 'year'}</span>
            <span>10 {tr ? 'yıl' : 'years'}</span>
          </div>
        </div>

        {/* Compounding Toggle */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">{tr ? 'Bileşikleştirme Yöntemi' : 'Compounding Method'}</Label>
          <div className="flex gap-2">
            <Button
              variant={compounding ? 'default' : 'outline'}
              size="sm"
              className="flex-1"
              onClick={() => setCompounding(true)}
            >
              {tr ? 'Yıllık Bileşik' : 'Annual Compound'}
            </Button>
            <Button
              variant={!compounding ? 'default' : 'outline'}
              size="sm"
              className="flex-1"
              onClick={() => setCompounding(false)}
            >
              {tr ? 'Basit Faiz' : 'Simple Interest'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {compounding
              ? (tr ? 'Ödüller yıllık olarak yeniden yatırılır — bileşik büyüme zamanla hızlanır.' : 'Rewards are reinvested annually — compounding grows faster over time.')
              : (tr ? 'Ödüller yeniden yatırım olmadan doğrusal şekilde birikir.' : 'Rewards accumulate linearly without reinvestment.')}
          </p>
        </div>

    </InputPanel>
  );
};
