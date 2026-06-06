import { ZakatResult, NisabData, NisabStandard, SupportedCurrency, convertUsd, formatCurrency, ZAKAT_RATE } from '@/services/zakatCalculator';
import { HawlStatus } from './ZakatHawlChecker';
import { CheckCircle2, XCircle, AlertTriangle, Scale } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ResultPanel, ResultRow } from '@/components/calculator';
import { formatCurrencyForDisplay } from '@/utils/formatCurrency';

interface Props {
  result: ZakatResult;
  nisab: NisabData;
  standard: NisabStandard;
  currency: SupportedCurrency;
  hawlStatus: HawlStatus;
}

export const ZakatResultsPanel = ({ result, nisab, standard, currency, hawlStatus }: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const locale = tr ? 'tr-TR' : 'en-US';

  const cFull = (usd: number) => formatCurrency(convertUsd(usd, currency, nisab.exchangeRates), currency);
  const cDisp = (usd: number) => formatCurrencyForDisplay(convertUsd(usd, currency, nisab.exchangeRates), currency, { locale });
  // legacy alias kept for inline copy lines
  const c = cFull;
  const hawlOk = hawlStatus === 'yes';
  const showZakat = result.nisabExceeded && hawlOk;

  return (
    <ResultPanel
      icon={<Scale />}
      title={tr ? 'Zekât Özetiniz' : 'Your Zakat Summary'}
      accentBar={showZakat ? 'positive' : 'primary'}
      footer={
        <div className="flex items-start gap-2">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden />
          <p className="calc-text-small text-muted-foreground">
            {tr
              ? 'Yalnızca eğitim amaçlıdır. Karmaşık durumlar için nitelikli bir İslam âlimine veya müftüye danışın.'
              : 'Educational purpose only. For complex situations, consult a qualified Islamic scholar or mufti.'}
          </p>
        </div>
      }
    >
      <div className="flex flex-col">
        {result.breakdown.bitcoin > 0 && <ResultRow label="Bitcoin" value={cDisp(result.breakdown.bitcoin).display} fullValue={cFull(result.breakdown.bitcoin)} />}
        {result.breakdown.cash > 0 && <ResultRow label={tr ? 'Nakit ve Tasarruf' : 'Cash & Savings'} value={cDisp(result.breakdown.cash).display} fullValue={cFull(result.breakdown.cash)} />}
        {result.breakdown.gold > 0 && <ResultRow label={tr ? 'Altın' : 'Gold'} value={cDisp(result.breakdown.gold).display} fullValue={cFull(result.breakdown.gold)} />}
        {result.breakdown.silver > 0 && <ResultRow label={tr ? 'Gümüş' : 'Silver'} value={cDisp(result.breakdown.silver).display} fullValue={cFull(result.breakdown.silver)} />}
        {result.breakdown.stocks > 0 && <ResultRow label={tr ? 'Hisse/ETF' : 'Stocks/ETF'} value={cDisp(result.breakdown.stocks).display} fullValue={cFull(result.breakdown.stocks)} />}
      </div>

      <div className="flex flex-col">
        <ResultRow divider label={tr ? 'Toplam Zekât Matrahı' : 'Total Zakatable'} value={cDisp(result.totalZakatable).display} fullValue={cFull(result.totalZakatable)} />
        {result.deductions > 0 && (
          <ResultRow label={tr ? 'Eksi Borçlar' : 'Less Debts'} value={`-${cDisp(result.deductions).display}`} fullValue={`-${cFull(result.deductions)}`} tone="negative" />
        )}
        <ResultRow divider emphasis label={tr ? 'Net Servet' : 'Net Wealth'} value={cDisp(result.netWealth).display} fullValue={cFull(result.netWealth)} />
      </div>

      <div className="space-y-2 calc-text-small">
        <div className="flex items-center gap-2">
          {result.nisabExceeded ? <CheckCircle2 className="h-4 w-4 text-success" /> : <XCircle className="h-4 w-4 text-destructive" />}
          <span className="text-foreground">
            {tr ? 'Nisab' : 'Nisab'} ({standard === 'silver' ? (tr ? 'Gümüş' : 'Silver') : (tr ? 'Altın' : 'Gold')}):{' '}
            {c(standard === 'silver' ? nisab.silverNisabUsd : nisab.goldNisabUsd)}
            {result.nisabExceeded ? (tr ? ' — Aşıldı' : ' — Exceeded') : (tr ? ' — Ulaşılmadı' : ' — Not reached')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {hawlOk ? <CheckCircle2 className="h-4 w-4 text-success" /> : <XCircle className="h-4 w-4 text-amber-500" />}
          <span className="text-foreground">
            {tr ? 'Havl Tamamlandı:' : 'Hawl Complete:'}{' '}
            {hawlOk ? (tr ? 'Evet' : 'Yes') : hawlStatus === 'no' ? (tr ? 'Hayır' : 'No') : (tr ? 'Belirsiz' : 'Unsure')}
          </span>
        </div>
      </div>

      {showZakat ? (
        <div className="rounded-[var(--calc-radius-card)] border border-success/30 bg-success/10 p-5 text-center">
          <p className="calc-text-label text-success">{tr ? 'ZEKÂT VACIP' : 'ZAKAT DUE'}</p>
          <p className="calc-text-display mt-2 text-foreground [overflow-wrap:anywhere]" title={cFull(result.zakatDue)}>{cDisp(result.zakatDue).display}</p>
          <p className="calc-text-small mt-2 text-muted-foreground">
            {!tr && currency !== 'USD' && <>= {formatCurrency(result.zakatDue, 'USD')} USD = </>}
            {result.zakatInBtc.toFixed(6)} BTC
          </p>
          <p className="calc-text-small mt-2 text-muted-foreground [overflow-wrap:anywhere]">
            {tr ? 'Formül:' : 'Formula:'} {cDisp(result.netWealth).display} × {(ZAKAT_RATE * 100).toFixed(1)}% = {cDisp(result.zakatDue).display}
          </p>
        </div>
      ) : result.nisabExceeded && !hawlOk ? (
        <div className="rounded-[var(--calc-radius-card)] border border-amber-500/30 bg-amber-500/10 p-4 text-center">
          <p className="calc-text-small text-amber-600">
            {tr
              ? "Servetiniz Nisab'ı aşıyor, ancak Havl henüz doğrulanmadı. Havl'iniz tamamlandığında Zekât vacip olacak."
              : 'Your wealth exceeds Nisab, but Hawl is not confirmed. Zakat will be due once your Hawl is complete.'}
          </p>
        </div>
      ) : (
        <div className="rounded-[var(--calc-radius-card)] border border-border/40 bg-muted/30 p-4 text-center">
          <p className="calc-text-small text-muted-foreground">
            {tr
              ? 'Net servetiniz Nisab eşiğini aşmıyor. Şu anda Zekât vacip değil.'
              : 'Your net wealth does not exceed the Nisab threshold. Zakat is not currently due.'}
          </p>
        </div>
      )}
    </ResultPanel>
  );
};
