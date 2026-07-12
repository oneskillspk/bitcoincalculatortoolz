import { useState, useMemo } from 'react';
import { getDcaCatchUp } from '@/services/accumulationScoreService';
import { Link } from "@/components/LocalizedLink";
import { ArrowRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatGroupedInt } from '@/utils/numberFormat';

interface Props {
  gapBtc: number;
  btcPrice: number;
}

const TIMELINES_EN = [
  { months: 6, label: '6 months' },
  { months: 12, label: '1 year' },
  { months: 24, label: '2 years' },
  { months: 60, label: '5 years' },
];

const TIMELINES_TR = [
  { months: 6, label: '6 ay' },
  { months: 12, label: '1 yıl' },
  { months: 24, label: '2 yıl' },
  { months: 60, label: '5 yıl' },
];

export const AccumulationDcaCatchUp = ({ gapBtc, btcPrice }: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const TIMELINES = tr ? TIMELINES_TR : TIMELINES_EN;

  const [selectedMonths, setSelectedMonths] = useState(12);

  const monthlyDca = useMemo(
    () => getDcaCatchUp(gapBtc, btcPrice, selectedMonths),
    [gapBtc, btcPrice, selectedMonths]
  );

  if (gapBtc <= 0) return null;

  const selectedLabel = TIMELINES.find(t => t.months === selectedMonths)?.label ?? '';

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <Calendar className="w-5 h-5 text-primary" />
        {tr ? 'DCA Yetişme Planı' : 'DCA Catch-Up Plan'}
      </h3>
      <p className="text-sm text-muted-foreground">
        {tr
          ? "Açığı kapatmak için aylık ne kadar yatırım yapmanız gerektiği — bugünkü fiyatın sabit kaldığı varsayımıyla."
          : "How much you'd need to invest monthly to close the gap — assuming today's price stays constant."}
      </p>

      <div className="flex gap-2 flex-wrap">
        {TIMELINES.map((t) => (
          <Button
            key={t.months}
            variant={selectedMonths === t.months ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedMonths(t.months)}
          >
            {t.label}
          </Button>
        ))}
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center">
        <p className="text-sm text-muted-foreground mb-1">
          {tr ? 'Gereken aylık DCA' : 'Monthly DCA needed'}
        </p>
        <p className="text-3xl font-bold text-foreground">
          ${formatGroupedInt(monthlyDca, tr ? 'tr-TR' : 'en-US')}
          <span className="text-base font-normal text-muted-foreground">{tr ? '/ay' : '/month'}</span>
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          {tr
            ? `${selectedLabel} boyunca ${gapBtc.toFixed(4)} BTC açığınızı kapatmak için`
            : `Over ${selectedLabel} to close your ${gapBtc.toFixed(4)} BTC gap`}
        </p>
      </div>

      <Link
        to={tr ? '/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi' : '/calculators/dca'}
        className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
      >
        {tr
          ? 'Bitcoin DCA Hesaplayıcısı ile DCA stratejinizi modelleyin'
          : 'Model your DCA strategy with the Bitcoin DCA Calculator'}
        <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  );
};
