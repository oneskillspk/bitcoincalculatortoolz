import { useState } from 'react';
import { format } from 'date-fns';
import { calculateHawlDate, LUNAR_YEAR_DAYS } from '@/services/zakatCalculator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

export type HawlStatus = 'yes' | 'no' | 'unsure';

interface Props {
  value: HawlStatus;
  onChange: (v: HawlStatus) => void;
}

export const ZakatHawlChecker = ({ value, onChange }: Props) => {
  const { language } = useLanguage();
  const tr = language==='tr';

  const [hawlDate, setHawlDate] = useState<Date | undefined>();
  const hawlResult = hawlDate ? calculateHawlDate(hawlDate) : null;

  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-foreground">
        {tr ? 'Adım 5 — Havl Doğrulaması' : 'Step 5 — Hawl Confirmation'}
      </h3>
      <p className="text-sm text-muted-foreground">
        {tr
          ? `Servetinizi 1 tam ay takvimi yılı (${LUNAR_YEAR_DAYS} gün) boyunca Nisab üzerinde tuttunuz mu?`
          : `Have you held wealth above Nisab for 1 full lunar year (${LUNAR_YEAR_DAYS} days)?`}
      </p>

      <div className="flex flex-col gap-2" role="radiogroup" aria-label={tr ? 'Havl doğrulaması' : 'Hawl confirmation'}>
        {(['yes', 'no', 'unsure'] as HawlStatus[]).map(opt => (
          <button
            key={opt}
            type="button"
            role="radio"
            aria-checked={value === opt}
            onClick={() => onChange(opt)}
            className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
              value === opt ? 'border-primary bg-primary/5' : 'border-border/30 hover:border-primary/30'
            }`}
          >
            <div aria-hidden className={`w-3 h-3 rounded-full border-2 ${value === opt ? 'border-primary bg-primary' : 'border-muted-foreground'}`} />
            <span className="text-sm text-foreground">
              {opt === 'yes' && (
                tr
                  ? <><CheckCircle2 className="w-4 h-4 inline text-success mr-1" /> Evet — servetim 1 tam ay takvimi yılı boyunca Nisab üzerindeydi</>
                  : <><CheckCircle2 className="w-4 h-4 inline text-success mr-1" /> Yes — my wealth has been above Nisab for 1 full lunar year</>
              )}
              {opt === 'no' && (
                tr
                  ? <><XCircle className="w-4 h-4 inline text-destructive mr-1" /> Hayır — geçen yıl içinde Nisab'ı aştı</>
                  : <><XCircle className="w-4 h-4 inline text-destructive mr-1" /> No — it exceeded Nisab within the past year</>
              )}
              {opt === 'unsure' && (
                tr
                  ? <><HelpCircle className="w-4 h-4 inline text-warning mr-1" /> Emin değilim — hesaplamamda yardım edin</>
                  : <><HelpCircle className="w-4 h-4 inline text-warning mr-1" /> Not sure — help me calculate</>
              )}
            </span>
          </button>
        ))}
      </div>

      {value === 'unsure' && (
        <div className="mt-4 p-4 bg-muted/30 rounded-xl space-y-3">
          <p className="text-sm text-foreground font-medium">
            {tr ? 'Servetiniz Nisab\'ı ilk ne zaman aştı?' : 'When did your wealth first exceed the Nisab?'}
          </p>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-[240px] justify-start text-left font-normal", !hawlDate && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {hawlDate ? format(hawlDate, "PPP") : <span>{tr ? 'Tarih seçin' : 'Pick a date'}</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={hawlDate}
                onSelect={setHawlDate}
                disabled={d => d > new Date() || d < new Date('2009-01-03')}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>

          {hawlResult && (
            <div className={`p-3 rounded-lg text-sm ${hawlResult.isDue ? 'bg-success/10 text-success' : 'bg-warning/$3 text-warning'}`}>
              <p className="font-medium">
                {tr ? 'Havl yıl dönümünüz:' : 'Your Hawl anniversary:'} {format(hawlResult.anniversary, "PPP")}
              </p>
              <p>
                {hawlResult.isDue
                  ? (tr ? "✅ Zekât VAKTİ GELMİŞTİR — Havl'iniz tamamlandı." : '✅ Zakat IS due — your Hawl has been completed.')
                  : (tr
                      ? `⏳ Zekât henüz vacip değil. Havl'iniz ${format(hawlResult.anniversary, "PPP")} tarihinde tamamlanır.`
                      : `⏳ Zakat is NOT yet due. Your Hawl completes on ${format(hawlResult.anniversary, "PPP")}.`)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
