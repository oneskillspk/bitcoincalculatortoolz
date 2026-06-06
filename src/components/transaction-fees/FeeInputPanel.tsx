import { InputPanel } from "@/components/calculator";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Cpu, Zap, Clock, Leaf, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { AddressType, Priority, FeeRecommendation, MempoolStats } from "@/services/transactionFeeCalculator";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/contexts/LanguageContext";

interface FeeInputPanelProps {
  addressType: AddressType;
  setAddressType: (type: AddressType) => void;
  inputCount: number;
  setInputCount: (count: number) => void;
  outputCount: number;
  setOutputCount: (count: number) => void;
  amountBtc: string;
  setAmountBtc: (amount: string) => void;
  priority: Priority;
  setPriority: (priority: Priority) => void;
  feeRecommendation: FeeRecommendation | null;
  mempoolStats: MempoolStats | null;
  isLoading: boolean;
}

export const FeeInputPanel = ({
  addressType, setAddressType,
  inputCount, setInputCount,
  outputCount, setOutputCount,
  amountBtc, setAmountBtc,
  priority, setPriority,
  feeRecommendation,
  mempoolStats,
  isLoading,
}: FeeInputPanelProps) => {
  const isMobile = useIsMobile();
  const { language } = useLanguage();
  const tr = language === 'tr';

  const getCongestionColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-success/20 text-success border-success/30';
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'high': return 'bg-destructive/20 text-destructive border-destructive/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const congestionLabel = (level: string) => {
    if (!tr) return level.charAt(0).toUpperCase() + level.slice(1);
    const map: Record<string, string> = { low: 'Düşük', medium: 'Orta', high: 'Yüksek' };
    return map[level] ?? level;
  };

  const priorityOptions = [
    { value: 'fastest', label: tr ? 'En Hızlı' : 'Fastest', shortLabel: tr ? 'Hızlı' : 'Fast', desc: '~10 min', icon: Zap, fee: feeRecommendation?.fastestFee },
    { value: 'halfHour', label: '30 min', shortLabel: '30m', desc: '~3 blocks', icon: Clock, fee: feeRecommendation?.halfHourFee },
    { value: 'hour', label: '1 hour', shortLabel: '1hr', desc: '~6 blocks', icon: Clock, fee: feeRecommendation?.hourFee },
    { value: 'economy', label: tr ? 'Ekonomik' : 'Economy', shortLabel: tr ? 'Eko' : 'Eco', desc: '4+ hours', icon: Leaf, fee: feeRecommendation?.economyFee },
  ];

  return (
    <InputPanel
      className="bg-card"
      title={
        <span className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-primary" />
          <span className="hidden sm:inline">{tr ? 'İşlem Parametreleri' : 'Transaction Parameters'}</span>
          <span className="sm:hidden">{tr ? 'TX Parametreleri' : 'TX Parameters'}</span>
        </span>
      }
      description={
        mempoolStats ? (
          <span className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className={`${getCongestionColor(mempoolStats.congestionLevel)} text-xs`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse inline-block" />
              {congestionLabel(mempoolStats.congestionLevel)}
              <span className="hidden sm:inline"> {tr ? 'Yoğunluk' : 'Congestion'}</span>
            </Badge>
            <span className="text-[10px] sm:text-xs text-muted-foreground">
              {mempoolStats.count.toLocaleString()} {tr ? 'bekleyen' : 'pending'}
            </span>
          </span>
        ) : undefined
      }
    >
      <div className="space-y-5 sm:space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="address-type" className="text-sm">{tr ? 'Adres Türü' : 'Address Type'}</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{tr ? 'Farklı adres türlerinin farklı işlem boyutları vardır. Yerel SegWit ve Taproot en düşük ücretleri sunar.' : 'Different address types have different transaction sizes. Native SegWit and Taproot offer the lowest fees.'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Select value={addressType} onValueChange={(v) => setAddressType(v as AddressType)}>
            <SelectTrigger id="address-type" className="h-10 sm:h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="taproot">
                <span className="hidden sm:inline">{tr ? 'Taproot (P2TR) - En düşük ücretler' : 'Taproot (P2TR) - Lowest fees'}</span>
                <span className="sm:hidden">{tr ? 'Taproot - En Düşük' : 'Taproot - Lowest'}</span>
              </SelectItem>
              <SelectItem value="native-segwit">
                <span className="hidden sm:inline">{tr ? 'Yerel SegWit (bc1q) - Çok düşük ücretler' : 'Native SegWit (bc1q) - Very low fees'}</span>
                <span className="sm:hidden">{tr ? 'Yerel SegWit - Düşük' : 'Native SegWit - Low'}</span>
              </SelectItem>
              <SelectItem value="segwit">
                <span className="hidden sm:inline">{tr ? 'SegWit (3...) - Düşük ücretler' : 'SegWit (3...) - Low fees'}</span>
                <span className="sm:hidden">{tr ? 'SegWit - Orta' : 'SegWit - Medium'}</span>
              </SelectItem>
              <SelectItem value="legacy">
                <span className="hidden sm:inline">{tr ? 'Eski (1...) - En yüksek ücretler' : 'Legacy (1...) - Highest fees'}</span>
                <span className="sm:hidden">{tr ? 'Eski - Yüksek' : 'Legacy - High'}</span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label className="text-sm">{tr ? 'Girişler (UTXO)' : 'Inputs (UTXOs)'}</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>{tr ? 'Harcadığınız kullanılmamış işlem çıktısı sayısı. Daha fazla giriş = daha büyük işlem.' : "Number of unspent transaction outputs you're spending from. More inputs = larger transaction."}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-0.5 sm:py-1 rounded">{inputCount}</span>
          </div>
          <Slider value={[inputCount]} onValueChange={(v) => setInputCount(v[0])} min={1} max={10} step={1} className="w-full" />
          <div className="flex justify-between text-[10px] sm:text-xs text-muted-foreground">
            <span>1</span><span>10</span>
          </div>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label className="text-sm">{tr ? 'Çıkışlar' : 'Outputs'}</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>{tr ? 'Para üstü adresi dahil alıcı sayısı. Genellikle 2: biri alıcı için, biri para üstü için.' : 'Number of recipients including change address. Typically 2: one for recipient, one for change.'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-0.5 sm:py-1 rounded">{outputCount}</span>
          </div>
          <Slider value={[outputCount]} onValueChange={(v) => setOutputCount(v[0])} min={1} max={10} step={1} className="w-full" />
          <div className="flex justify-between text-[10px] sm:text-xs text-muted-foreground">
            <span>1</span><span>10</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="amount" className="text-sm">
              <span className="hidden sm:inline">{tr ? 'Tutar (BTC) - İsteğe Bağlı' : 'Amount (BTC) - Optional'}</span>
              <span className="sm:hidden">{tr ? 'Tutar (BTC)' : 'Amount (BTC)'}</span>
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{tr ? 'Ücreti işlem değerinin yüzdesi olarak görmek için tutarı girin.' : 'Enter the amount to see fee as a percentage of the transaction value.'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input id="amount" type="number" step="0.00000001" min="0" placeholder="0.00000000" value={amountBtc} onChange={(e) => setAmountBtc(e.target.value)} className="font-mono h-10 sm:h-11" />
        </div>

        <div className="space-y-2 sm:space-y-3">
          <Label className="text-sm">{tr ? 'Onay Önceliği' : 'Confirmation Priority'}</Label>
          <RadioGroup value={priority} onValueChange={(v) => setPriority(v as Priority)} className="grid grid-cols-2 gap-2 sm:gap-3">
            {priorityOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = priority === option.value;
              return (
                <div key={option.value}>
                  <RadioGroupItem value={option.value} id={option.value} className="peer sr-only" />
                  <Label htmlFor={option.value} className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 min-h-[80px] sm:min-h-[88px] ${isSelected ? 'border-primary bg-primary/10 text-primary' : 'border-border/50 hover:border-primary/30 hover:bg-muted/50'}`}>
                    <Icon className={`w-4 h-4 sm:w-5 sm:h-5 mb-0.5 sm:mb-1 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="text-xs sm:text-sm font-medium">
                      <span className="sm:hidden">{option.shortLabel}</span>
                      <span className="hidden sm:inline">{option.label}</span>
                    </span>
                    <span className="text-[10px] sm:text-xs text-muted-foreground">{option.desc}</span>
                    {option.fee && <span className="text-[10px] sm:text-xs font-mono mt-0.5 sm:mt-1 text-primary">{option.fee} sat/vB</span>}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </div>

        {feeRecommendation && !isLoading && (
          <div className="p-2.5 sm:p-3 bg-muted/30 rounded-lg border border-border/30">
            <p className="text-xs sm:text-xs text-muted-foreground mb-2">
              <span className="hidden sm:inline">{tr ? 'Canlı Önerilen Ücretler (sat/vB)' : 'Live Recommended Fees (sat/vB)'}</span>
              <span className="sm:hidden">{tr ? 'Güncel Ücretler (sat/vB)' : 'Current Fees (sat/vB)'}</span>
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="p-1.5 sm:p-0">
                <p className="text-xs sm:text-xs text-muted-foreground">{tr ? 'Hızlı' : 'Fast'}</p>
                <p className="text-sm sm:text-base font-mono font-medium text-primary">{feeRecommendation.fastestFee}</p>
              </div>
              <div className="p-1.5 sm:p-0">
                <p className="text-xs sm:text-xs text-muted-foreground">30m</p>
                <p className="text-sm sm:text-base font-mono font-medium">{feeRecommendation.halfHourFee}</p>
              </div>
              <div className="p-1.5 sm:p-0">
                <p className="text-xs sm:text-xs text-muted-foreground">1hr</p>
                <p className="text-sm sm:text-base font-mono font-medium">{feeRecommendation.hourFee}</p>
              </div>
              <div className="p-1.5 sm:p-0">
                <p className="text-xs sm:text-xs text-muted-foreground">{tr ? 'Eko' : 'Eco'}</p>
                <p className="text-sm sm:text-base font-mono font-medium">{feeRecommendation.economyFee}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </InputPanel>
  );
};
