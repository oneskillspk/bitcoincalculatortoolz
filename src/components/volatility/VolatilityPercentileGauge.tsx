import { Card, CardContent } from "@/components/ui/card";
import { Gauge } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Props {
  percentile: number;
  vol30d: number;
}

const getZone = (p: number, isTr: boolean) => {
  if (p < 25) return {
    label: isTr ? 'Toparlanıyor' : 'Coiled',
    color: 'text-success',
    bar: 'bg-success',
    note: isTr
      ? '25. yüzdeliğin altında. Tarihsel olarak genellikle büyük yönlü hareketlerden önce gelir.'
      : 'Below 25th percentile. Historically often precedes large directional moves.'
  };
  if (p < 50) return {
    label: isTr ? 'Sakin' : 'Calm',
    color: 'text-blue-600',
    bar: 'bg-blue-500',
    note: isTr
      ? 'Tipik değerden daha sessiz. Aralıklar uzun vadeli ortalamadan daha dar.'
      : 'Quieter than typical. Ranges are tighter than the long-run average.'
  };
  if (p < 75) return {
    label: isTr ? 'Aktif' : 'Active',
    color: 'text-amber-600',
    bar: 'bg-amber-500',
    note: isTr
      ? 'Medyan 30 günlük pencerenin üzerinde çalışıyor.'
      : 'Running hotter than the median 30-day window.'
  };
  return {
    label: isTr ? 'Sıcak' : 'Hot',
    color: 'text-destructive',
    bar: 'bg-destructive',
    note: isTr
      ? 'En üst çeyrek. Pozisyon boyutlandırması ve durdurmalar daha geniş hareketleri hesaba katmalıdır.'
      : 'Top quartile. Position sizing and stops should account for wider moves.'
  };
};

export const VolatilityPercentileGauge = ({ percentile, vol30d }: Props) => {
  const { language } = useLanguage();
  const isTr = language === 'tr';
  const zone = getZone(percentile, isTr);

  return (
    <Card className="glass-morphism-card border-border/20 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Gauge className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {isTr ? 'Oynaklık Yüzdeliği' : 'Volatility Percentile'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {isTr
                ? "Bugünün 30 günlük oynaklığının son 1 yıllık dağılımdaki yeri."
                : "Where today's 30-day vol sits in the trailing 1-year distribution."}
            </p>
          </div>
        </div>

        <div className="flex items-baseline gap-3 mb-3">
          <span className="text-4xl font-bold text-foreground">
            {percentile}<span className="text-xl text-muted-foreground">{isTr ? '.' : 'th'}</span>
          </span>
          <span className={`text-sm font-medium ${zone.color}`}>{zone.label}</span>
          <span className="text-sm text-muted-foreground ml-auto">{vol30d.toFixed(1)}% {isTr ? 'yıllık' : 'annualized'}</span>
        </div>

        <div className="relative h-3 bg-muted rounded-full overflow-hidden mb-2">
          <div
            className={`absolute inset-y-0 left-0 ${zone.bar} transition-all`}
            style={{ width: `${Math.min(100, Math.max(2, percentile))}%` }}
          />
          <div className="absolute inset-0 flex justify-between px-0">
            {[25, 50, 75].map(t => (
              <div key={t} style={{ marginLeft: `${t}%` }} className="w-px h-full bg-background/60" />
            ))}
          </div>
        </div>
        <div className="flex justify-between text-[10px] sm:text-xs text-muted-foreground mb-4">
          <span>0</span><span>25</span><span>50</span><span>75</span><span>100</span>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">{zone.note}</p>
      </CardContent>
    </Card>
  );
};
