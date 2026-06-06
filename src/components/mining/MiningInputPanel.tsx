import { useState, useCallback } from "react";
import { InputPanel, CalculateButton } from "@/components/calculator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Pickaxe, Zap, DollarSign, Percent, Info, RefreshCw, Activity } from "lucide-react";
import { HARDWARE_PRESETS, NETWORK_CONSTANTS, MiningProfitabilityCalculator, MiningParams, NetworkStats } from "@/services/miningProfitabilityCalculator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useLanguage } from "@/contexts/LanguageContext";

interface MiningInputPanelProps {
  onCalculate: (params: MiningParams) => void;
  loading: boolean;
  currentBtcPrice: number;
  networkStats?: NetworkStats;
  networkStatsLoading?: boolean;
}

export const MiningInputPanel = ({ 
  onCalculate, 
  loading, 
  currentBtcPrice,
  networkStats,
  networkStatsLoading
}: MiningInputPanelProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const [selectedPreset, setSelectedPreset] = useState<string>("");
  const [hashRate, setHashRate] = useState<number>(200);
  const [powerConsumption, setPowerConsumption] = useState<number>(3500);
  const [electricityCost, setElectricityCost] = useState<number>(0.08);
  const [poolFee, setPoolFee] = useState<number>(2);
  const [hardwareCost, setHardwareCost] = useState<number>(5500);
  const [difficultyAdjustment, setDifficultyAdjustment] = useState<number>(3.5);

  const handlePresetChange = useCallback((presetId: string) => {
    setSelectedPreset(presetId);
    const preset = HARDWARE_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setHashRate(preset.hashRate);
      setPowerConsumption(preset.powerConsumption);
      setHardwareCost(preset.price);
    }
  }, []);

  const handleCalculate = useCallback(() => {
    const difficulty = networkStats?.difficulty || MiningProfitabilityCalculator.getEstimatedDifficulty();
    
    const params: MiningParams = {
      hashRate,
      powerConsumption,
      electricityCost,
      poolFee,
      hardwareCost,
      bitcoinPrice: currentBtcPrice,
      networkDifficulty: difficulty,
      blockReward: NETWORK_CONSTANTS.BLOCK_REWARD,
      difficultyAdjustment,
      currency: 'USD',
    };
    onCalculate(params);
  }, [hashRate, powerConsumption, electricityCost, poolFee, hardwareCost, currentBtcPrice, difficultyAdjustment, networkStats, onCalculate]);

  return (
    <InputPanel
      className="bg-card"
      onSubmit={(e) => { e.preventDefault(); handleCalculate(); }}
      title={
        <span className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Pickaxe className="w-5 h-5 text-primary" />
          </span>
          {tr ? 'Madencilik Parametreleri' : 'Mining Parameters'}
        </span>
      }
      footer={
        <CalculateButton fullWidth loading={loading} disabled={hashRate <= 0}>
          <Pickaxe className="w-5 h-5 mr-2" />
          {tr ? 'Karlılığı Hesapla' : 'Calculate Profitability'}
        </CalculateButton>
      }
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            {tr ? 'Donanım Ön Ayarı' : 'Hardware Preset'}
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-3.5 h-3.5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{tr ? 'Teknik özellikleri otomatik doldurmak için popüler bir ASIC madenci seçin' : 'Select a popular ASIC miner to auto-fill specs'}</p>
              </TooltipContent>
            </Tooltip>
          </Label>
          <Select value={selectedPreset} onValueChange={handlePresetChange}>
            <SelectTrigger className="bg-background/50">
              <SelectValue placeholder={tr ? 'Madencilik donanımı seçin...' : 'Select mining hardware...'} />
            </SelectTrigger>
            <SelectContent>
              {HARDWARE_PRESETS.map(preset => (
                <SelectItem key={preset.id} value={preset.id}>
                  <span className="flex items-center gap-2">
                    {preset.name} - {preset.hashRate} TH/s
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Zap className="w-4 h-4 text-primary" />
            {tr ? 'Hash Hızı (TH/s)' : 'Hash Rate (TH/s)'}
          </Label>
          <Input
            type="number"
            value={hashRate}
            onChange={(e) => setHashRate(parseFloat(e.target.value) || 0)}
            className="bg-background/50"
            placeholder="200"
          />
          <p className="text-xs text-muted-foreground">
            {MiningProfitabilityCalculator.formatHashRate(hashRate)}
          </p>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Zap className="w-4 h-4 text-amber-500" />
            {tr ? 'Güç Tüketimi (Watt)' : 'Power Consumption (Watts)'}
          </Label>
          <Input
            type="number"
            value={powerConsumption}
            onChange={(e) => setPowerConsumption(parseFloat(e.target.value) || 0)}
            className="bg-background/50"
            placeholder="3500"
          />
          <p className="text-xs text-muted-foreground">
            {((powerConsumption / 1000) * 24).toFixed(2)} kWh/{tr ? 'gün' : 'day'}
          </p>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <DollarSign className="w-4 h-4 text-success" />
            {tr ? 'Elektrik Maliyeti ($/kWh)' : 'Electricity Cost ($/kWh)'}
          </Label>
          <Input
            type="number"
            step="0.01"
            value={electricityCost}
            onChange={(e) => setElectricityCost(parseFloat(e.target.value) || 0)}
            className="bg-background/50"
            placeholder="0.08"
          />
          <p className="text-xs text-muted-foreground">
            {tr ? 'Günlük maliyet:' : 'Daily cost:'} ${((powerConsumption / 1000) * 24 * electricityCost).toFixed(2)}
          </p>
        </div>

        <div className="space-y-3">
          <Label className="flex items-center justify-between text-sm font-medium">
            <span className="flex items-center gap-2">
              <Percent className="w-4 h-4 text-blue-500" />
              {tr ? 'Havuz Ücreti' : 'Pool Fee'}
            </span>
            <span className="text-primary font-semibold">{poolFee}%</span>
          </Label>
          <Slider
            value={[poolFee]}
            onValueChange={([value]) => setPoolFee(value)}
            min={0}
            max={5}
            step={0.1}
            className="py-2"
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <DollarSign className="w-4 h-4 text-primary" />
            {tr ? 'Donanım Maliyeti ($)' : 'Hardware Cost ($)'}
          </Label>
          <Input
            type="number"
            value={hardwareCost}
            onChange={(e) => setHardwareCost(parseFloat(e.target.value) || 0)}
            className="bg-background/50"
            placeholder="5500"
          />
        </div>

        <div className="space-y-3">
          <Label className="flex items-center justify-between text-sm font-medium">
            <span className="flex items-center gap-2">
              {tr ? 'Aylık Zorluk Artışı' : 'Monthly Difficulty Increase'}
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-3.5 h-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{tr ? 'Tarihsel ortalama aylık yaklaşık %3,5\'tir' : 'Historical average is ~3.5% per month'}</p>
                </TooltipContent>
              </Tooltip>
            </span>
            <span className="text-primary font-semibold">{difficultyAdjustment}%</span>
          </Label>
          <Slider
            value={[difficultyAdjustment]}
            onValueChange={([value]) => setDifficultyAdjustment(value)}
            min={0}
            max={10}
            step={0.5}
            className="py-2"
          />
        </div>

        <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{tr ? 'Güncel BTC Fiyatı' : 'Current BTC Price'}</span>
            <span className="text-lg font-semibold text-primary">
              ${currentBtcPrice.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="p-4 bg-muted/30 rounded-xl border border-border/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{tr ? 'Ağ Zorluğu' : 'Network Difficulty'}</span>
            </div>
            <div className="flex items-center gap-2">
              {networkStatsLoading ? (
                <RefreshCw className="w-3.5 h-3.5 text-muted-foreground animate-spin" />
              ) : (
                <span className="text-sm font-semibold text-foreground">
                  {networkStats 
                    ? MiningProfitabilityCalculator.formatDifficulty(networkStats.difficulty)
                    : MiningProfitabilityCalculator.formatDifficulty(MiningProfitabilityCalculator.getEstimatedDifficulty())
                  }
                </span>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {networkStats
              ? (tr ? "mempool.space'ten canlı veri" : 'Live data from mempool.space')
              : (tr ? 'Tahmini zorluk kullanılıyor' : 'Using estimated difficulty')}
          </p>
        </div>
      </div>
    </InputPanel>
  );
};
