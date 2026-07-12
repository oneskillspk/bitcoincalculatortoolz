import { ZakatResult, NisabData, NisabStandard, SupportedCurrency, convertUsd, formatCurrency, ZAKAT_RATE } from '@/services/zakatCalculator';
import { HawlStatus } from './ZakatHawlChecker';
import { CheckCircle2, XCircle, AlertTriangle, Scale } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ResultPanel, ResultRow, ResultHero, ResultsGrid, ResultCard } from '@/components/calculator';
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
  const hawlOk = hawlStatus === 'yes';
  const showZakat = result.nisabExceeded && hawlOk;
  const nisabValue = standard === 'silver' ? nisab.silverNisabUsd : nisab.goldNisabUsd;

  return (
    <ResultPanel
      icon={<Scale />}
      title={tr ? 'Zekât Özetiniz' : 'Your Zakat Summary'}
      accentBar={showZakat ? 'positive' : 'primary'}
      aria-live="polite"
      aria-atomic="true"
      aria-label={tr ? 'Hesaplama sonucu' : 'Calculator result'}
      footer={
        <div className="flex items-start gap-2">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden />
          <p className="calc-text-small text-muted-foreground">
            {tr
              ? 'Yalnızca eğitim amaçlıdır. Karmaşık durumlar için nitelikli bir İslam âlimine veya müftüye danışın.'
              : 'Educational purpose only. For complex situations, consult a qualified Islamic scholar or mufti.'}
          </p>
        </div>
      }
    >
      {showZakat && (
        <ResultHero
          label={tr ? 'Zekât Vacip' : 'Zakat Due'}
          value={<span className="text-success">{cDisp(result.zakatDue).display}</span>}
          fullValue={cFull(result.zakatDue)}
          sub={
            <>
              {!tr && currency !== 'USD' && <>= {formatCurrency(result.zakatDue, 'USD')} USD · </>}
              {result.zakatInBtc.toLocaleString(locale, { minimumFractionDigits: 6, maximumFractionDigits: 6 })} BTC
            </>
          }
        />
      )}

      <div className="flex flex-col">
        {result.breakdown.bitcoin > 0 && <ResultRow label="Bitcoin" value={cDisp(result.breakdown.bitcoin).display} fullValue={cFull(result.breakdown.bitcoin)} />}
        {result.breakdown.cash > 0 && <ResultRow label={tr ? 'Nakit ve Tasarruf' : 'Cash & Savings'} value={cDisp(result.breakdown.cash).display} fullValue={cFull(result.breakdown.cash)} />}
        {result.breakdown.gold > 0 && <ResultRow label={tr ? 'Altın' : 'Gold'} value={cDisp(result.breakdown.gold).display} fullValue={cFull(result.breakdown.gold)} />}
        {result.breakdown.silver > 0 && <ResultRow label={tr ? 'Gümüş' : 'Silver'} value={cDisp(result.breakdown.silver).display} fullValue={cFull(result.breakdown.silver)} />}
        {result.breakdown.stocks > 0 && <ResultRow label={tr ? 'Hisse/ETF' : 'Stocks/ETF'} value={cDisp(result.breakdown.stocks).display} fullValue={cFull(result.breakdown.stocks)} />}
      </div>

      <ResultsGrid cols={result.deductions > 0 ? 3 : 2}>
        <ResultCard
          label={tr ? 'Toplam Zekât Matrahı' : 'Total Zakatable'}
          value={cDisp(result.totalZakatable).display}
          fullValue={cFull(result.totalZakatable)}
          tone="primary"
        />
        {result.deductions > 0 && (
          <ResultCard
            label={tr ? 'Eksi Borçlar' : 'Less Debts'}
            value={`−${cDisp(result.deductions).display}`}
            fullValue={`−${cFull(result.deductions)}`}
            tone="negative"
          />
        )}
        <ResultCard
          label={tr ? 'Net Servet' : 'Net Wealth'}
          value={cDisp(result.netWealth).display}
          fullValue={cFull(result.netWealth)}
          tone={showZakat ? 'positive' : 'primary'}
        />
      </ResultsGrid>

      <ResultsGrid cols={2}>
        <ResultCard
          icon={result.nisabExceeded ? <CheckCircle2 /> : <XCircle />}
          label={`${tr ? 'Nisab' : 'Nisab'} (${standard === 'silver' ? (tr ? 'Gümüş' : 'Silver') : (tr ? 'Altın' : 'Gold')})`}
          value={cDisp(nisabValue).display}
          fullValue={cFull(nisabValue)}
          sub={result.nisabExceeded ? (tr ? 'Aşıldı' : 'Exceeded') : (tr ? 'Ulaşılmadı' : 'Not reached')}
          tone={result.nisabExceeded ? 'positive' : 'muted'}
          size="sm"
        />
        <ResultCard
          icon={hawlOk ? <CheckCircle2 /> : <XCircle />}
          label={tr ? 'Havl Tamamlandı' : 'Hawl Complete'}
          value={hawlOk ? (tr ? 'Evet' : 'Yes') : hawlStatus === 'no' ? (tr ? 'Hayır' : 'No') : (tr ? 'Belirsiz' : 'Unsure')}
          tone={hawlOk ? 'positive' : 'muted'}
          size="sm"
        />
      </ResultsGrid>

      {showZakat ? (
        <p className="calc-text-small text-center text-muted-foreground [overflow-wrap:anywhere]">
          {tr ? 'Formül:' : 'Formula:'}{' '}
          <span title={cFull(result.netWealth)}>{cDisp(result.netWealth).display}</span> ×{' '}
          {new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(ZAKAT_RATE * 100)}% ={' '}
          <span title={cFull(result.zakatDue)}>{cDisp(result.zakatDue).display}</span>
        </p>
      ) : result.nisabExceeded && !hawlOk ? (
        <div className="calc-surface-subtle border-warning/30 bg-warning/10 p-4 text-center">
          <p className="calc-text-small text-warning">
            {tr
              ? "Servetiniz Nisab'ı aşıyor, ancak Havl henüz doğrulanmadı. Havl'iniz tamamlandığında Zekât vacip olacak."
              : 'Your wealth exceeds Nisab, but Hawl is not confirmed. Zakat will be due once your Hawl is complete.'}
          </p>
        </div>
      ) : (
        <div className="calc-surface-subtle p-4 text-center">
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
