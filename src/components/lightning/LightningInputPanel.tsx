import { InputPanel } from "@/components/calculator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TooltipInfo } from "@/components/ui/tooltip-info";
import { Zap, Coffee, CreditCard, Wallet, Banknote, TrendingUp, Info } from "lucide-react";
import {
  PAYMENT_PRESETS,
  LIGHTNING_CONSTANTS,
  LightningNetworkStats,
  convertToSats,
  convertFromSats,
} from "@/services/lightningFeeCalculator";
import { useLanguage } from "@/contexts/LanguageContext";

interface LightningInputPanelProps {
  amountSats: number;
  setAmountSats: (value: number) => void;
  amountUnit: 'sats' | 'btc' | 'usd';
  setAmountUnit: (value: 'sats' | 'btc' | 'usd') => void;
  estimatedHops: number;
  setEstimatedHops: (value: number) => void;
  baseFeePerHop: number;
  setBaseFeePerHop: (value: number) => void;
  feeRatePpm: number;
  setFeeRatePpm: (value: number) => void;
  channelSizeSats: number;
  setChannelSizeSats: (value: number) => void;
  networkStats: LightningNetworkStats | null;
  btcPriceUsd: number;
  isLoading: boolean;
}

const presetIcons = [Coffee, CreditCard, Wallet, Banknote];

export const LightningInputPanel = ({
  amountSats, setAmountSats,
  amountUnit, setAmountUnit,
  estimatedHops, setEstimatedHops,
  baseFeePerHop, setBaseFeePerHop,
  feeRatePpm, setFeeRatePpm,
  channelSizeSats, setChannelSizeSats,
  networkStats,
  btcPriceUsd,
  isLoading,
}: LightningInputPanelProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const getDisplayAmount = () => convertFromSats(amountSats, amountUnit, btcPriceUsd);

  const handleAmountChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    const satsValue = convertToSats(numValue, amountUnit, btcPriceUsd);
    setAmountSats(Math.max(0, satsValue));
  };

  const useNetworkAverages = () => {
    if (networkStats) {
      setBaseFeePerHop(networkStats.avgBaseFee);
      setFeeRatePpm(networkStats.avgFeeRate);
    }
  };

  const useMedianFees = () => {
    if (networkStats) {
      setBaseFeePerHop(networkStats.medianBaseFee);
      setFeeRatePpm(networkStats.medianFeeRate);
    }
  };

  return (
    <InputPanel
      className="bg-card h-full"
      title={
        <span className="flex items-center gap-2 text-base sm:text-lg">
          <span className="w-8 h-8 rounded-lg bg-warning/$3 flex items-center justify-center">
            <Zap className="w-4 h-4 text-warning" />
          </span>
          {tr ? 'Ödeme Parametreleri' : 'Payment Parameters'}
        </span>
      }
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            {tr ? 'Ödeme Tutarı' : 'Payment Amount'}
            <TooltipInfo content={tr ? 'Lightning Network üzerinden göndermek istediğiniz tutar' : 'The amount you want to send via Lightning Network'} />
          </Label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={getDisplayAmount() || ''}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="10000"
              className="flex-1 bg-background/50"
            />
            <Select value={amountUnit} onValueChange={(v) => setAmountUnit(v as 'sats' | 'btc' | 'usd')}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sats">Sats</SelectItem>
                <SelectItem value="btc">BTC</SelectItem>
                <SelectItem value="usd">USD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-muted-foreground">{tr ? 'Hızlı Ön Ayarlar' : 'Quick Presets'}</Label>
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            {PAYMENT_PRESETS.map((preset, index) => {
              const Icon = presetIcons[index];
              const isActive = amountSats === preset.sats;
              return (
                <Button
                  key={preset.name}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAmountSats(preset.sats)}
                  className={`flex items-center gap-1.5 sm:gap-2 h-auto py-1.5 sm:py-2 px-2 sm:px-3 ${isActive ? 'bg-yellow-500 hover:bg-yellow-600 text-black' : ''}`}
                >
                  <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                  <div className="text-left min-w-0">
                    <div className="text-[10px] sm:text-xs font-medium truncate">{preset.name}</div>
                    <div className="text-[9px] sm:text-[10px] opacity-70">{preset.sats.toLocaleString()}</div>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2 text-sm font-medium">
              {tr ? 'Yönlendirme Atlamaları' : 'Routing Hops'}
              <TooltipInfo content={tr ? "Ödemenin geçeceği ara düğüm sayısı. Daha fazla atlama = daha yüksek ücret ama daha iyi gizlilik." : "Number of intermediate nodes the payment will route through. More hops = higher fees but better privacy."} />
            </Label>
            <Badge variant="secondary" className="text-xs">
              {estimatedHops} {tr ? (estimatedHops !== 1 ? 'atlama' : 'atlama') : (estimatedHops !== 1 ? 'hops' : 'hop')}
            </Badge>
          </div>
          <Slider
            value={[estimatedHops]}
            onValueChange={([value]) => setEstimatedHops(value)}
            min={LIGHTNING_CONSTANTS.MIN_HOPS}
            max={LIGHTNING_CONSTANTS.MAX_HOPS}
            step={1}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{tr ? 'Doğrudan (1)' : 'Direct (1)'}</span>
            <span>{tr ? 'Ortalama (3)' : 'Average (3)'}</span>
            <span>{tr ? 'Maks (10)' : 'Max (10)'}</span>
          </div>
        </div>

        <div className="space-y-4 pt-2 border-t border-border/30">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">{tr ? 'Ücret Parametreleri' : 'Fee Parameters'}</Label>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={useNetworkAverages} disabled={!networkStats || isLoading} className="h-7 text-xs px-2">
                {tr ? 'Ort. Kullan' : 'Use Avg'}
              </Button>
              <Button variant="ghost" size="sm" onClick={useMedianFees} disabled={!networkStats || isLoading} className="h-7 text-xs px-2">
                {tr ? 'Medyan Kullan' : 'Use Median'}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-xs text-muted-foreground">
              {tr ? 'Taban Ücret (msat/atlama)' : 'Base Fee (msat/hop)'}
              <TooltipInfo content={tr ? "Her yönlendirme düğümünün ödeme boyutundan bağımsız olarak aldığı sabit ücret. Millisatoshi cinsinden ölçülür." : "Fixed fee charged by each routing node regardless of payment size. Measured in millisatoshis."} />
            </Label>
            <Input type="number" value={baseFeePerHop} onChange={(e) => setBaseFeePerHop(Math.max(0, parseInt(e.target.value) || 0))} placeholder="1000" className="bg-background/50" />
            {networkStats && (
              <p className="text-xs text-muted-foreground">
                {tr ? 'Ağ ort:' : 'Network avg:'} {networkStats.avgBaseFee} msat | {tr ? 'Medyan:' : 'Median:'} {networkStats.medianBaseFee} msat
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-xs text-muted-foreground">
              {tr ? 'Ücret Oranı (ppm)' : 'Fee Rate (ppm)'}
              <TooltipInfo content={tr ? "Milyonda pay olarak orantılı ücret. 100 ppm = atlama başına ödeme tutarının %0,01'i." : "Proportional fee as parts per million. 100 ppm = 0.01% of payment amount per hop."} />
            </Label>
            <Input type="number" value={feeRatePpm} onChange={(e) => setFeeRatePpm(Math.max(0, parseInt(e.target.value) || 0))} placeholder="100" className="bg-background/50" />
            {networkStats && (
              <p className="text-xs text-muted-foreground">
                {tr ? 'Ağ ort:' : 'Network avg:'} {networkStats.avgFeeRate} ppm | {tr ? 'Medyan:' : 'Median:'} {networkStats.medianFeeRate} ppm
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-border/30">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <TrendingUp className="w-4 h-4" />
            {tr ? 'Kanal Ekonomisi (İsteğe Bağlı)' : 'Channel Economics (Optional)'}
            <TooltipInfo content={tr ? "Düğüm operatörü olarak potansiyel yönlendirme gelirini görmek için kanal boyutunuzu girin." : "Enter your channel size to see potential routing revenue as a node operator."} />
          </Label>
          <Input type="number" value={channelSizeSats || ''} onChange={(e) => setChannelSizeSats(Math.max(0, parseInt(e.target.value) || 0))} placeholder="0" className="bg-background/50" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            {tr ? 'Yönlendirme geliri potansiyelini hesaplamak için kanal kapasitesini sats cinsinden girin' : 'Enter channel capacity in sats to calculate routing revenue potential'}
          </p>
        </div>

        {networkStats && (
          <div className="bg-muted/30 rounded-lg p-3 border border-border/30">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-warning" />
              <span className="text-xs font-medium">{tr ? 'Canlı Ağ Verisi' : 'Live Network Data'}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div>{tr ? 'Düğüm:' : 'Nodes:'} {networkStats.nodeCount.toLocaleString()}</div>
              <div>{tr ? 'Kanal:' : 'Channels:'} {networkStats.channelCount.toLocaleString()}</div>
              <div>{tr ? 'Ort. Taban:' : 'Avg Base:'} {networkStats.avgBaseFee} msat</div>
              <div>{tr ? 'Ort. Oran:' : 'Avg Rate:'} {networkStats.avgFeeRate} ppm</div>
            </div>
          </div>
        )}
      </div>
    </InputPanel>
  );
};

export default LightningInputPanel;
