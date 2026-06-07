/**
 * Round 3 of the 2026-06 launch audit: this component used to paint its own
 * 1200×630 dark canvas with hardcoded hex (#0a0a0a, #f7931a, #10b981, #ef4444).
 * It now translates the WhatIf result into a typed `ShareCardPayload` and lets
 * the shared `ShareSnapshotCard` draw a paper-bg, brand-token 1280×720 PNG.
 */
import React from 'react';
import type { CalculationResult } from '@/services/bitcoinApi';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatCurrencyAmount } from '@/utils/formatCurrency';
import { ShareSnapshotCard } from '@/components/share-export';
import type { ShareCardPayload } from '@/components/share-export';

interface Props {
  result: CalculationResult;
}

const fmtMoney = (n: number, lang: 'en' | 'tr', currency: string) => {
  const locale = lang === 'tr' ? 'tr-TR' : 'en-US';
  if (n >= 1_000_000) return formatCurrencyAmount(n, currency, { locale, compact: true, decimals: 2 });
  if (n >= 1000) return formatCurrencyAmount(n, currency, { locale, decimals: 0 });
  return formatCurrencyAmount(n, currency, { locale, decimals: 2 });
};

const fmtPct = (n: number) =>
  Math.abs(n) >= 1000
    ? `${n >= 0 ? '+' : ''}${(n / 100).toFixed(1)}x`
    : `${n >= 0 ? '+' : ''}${n.toFixed(1)}%`;

const formatStartDate = (iso: string, lang: 'en' | 'tr') => {
  const d = new Date(iso);
  return d.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const computeCagr = (result: CalculationResult): number => {
  const start = new Date(result.startDate).getTime();
  const years = Math.max(0.01, (Date.now() - start) / (365.25 * 24 * 60 * 60 * 1000));
  if (result.investmentAmount <= 0) return 0;
  return (Math.pow(result.currentValue / result.investmentAmount, 1 / years) - 1) * 100;
};

export const WhatIfShareSnapshot: React.FC<Props> = ({ result }) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const lang: 'en' | 'tr' = tr ? 'tr' : 'en';
  const currency = (result as any).currency || (tr ? 'TRY' : 'USD');
  const cagr = computeCagr(result);
  const tone = result.roiPercentage >= 0 ? 'success' : 'destructive';

  const payload: ShareCardPayload = {
    calculatorLabel: tr ? 'Ya Olsaydı Hesaplayıcısı' : 'What-If Calculator',
    eyebrow: tr ? 'Bugünkü değer' : "Today's value",
    headline: tr ? 'Şu kadarım olurdu' : 'I would have had',
    headlineValue: fmtMoney(result.currentValue, lang, currency),
    headlineTone: tone,
    subline: tr
      ? `${formatStartDate(result.startDate, lang)} tarihinde ${fmtMoney(result.investmentAmount, lang, currency)} yatırarak`
      : `from ${fmtMoney(result.investmentAmount, lang, currency)} on ${formatStartDate(result.startDate, lang)}`,
    badge: { label: `${fmtPct(result.roiPercentage)} ROI`, tone },
    stats: [
      { label: tr ? 'Toplam ROI' : 'Total ROI', value: fmtPct(result.roiPercentage), tone },
      { label: tr ? 'Yıllıklandırılmış (CAGR)' : 'Annualized (CAGR)', value: fmtPct(cagr), tone },
      { label: tr ? 'Biriktirilen BTC' : 'BTC accumulated', value: `${result.btcAmount.toFixed(4)} BTC`, tone: 'ember' },
    ],
    footerLeft: tr
      ? 'bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-ya-olsaydi'
      : 'bitcoincalculator.tools/calculators/what-if',
    footerRight: new Date().toLocaleDateString(tr ? 'tr-TR' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  };

  const shareText = tr
    ? `${formatStartDate(result.startDate, lang)} tarihinde ${fmtMoney(result.investmentAmount, lang, currency)} BTC alınsaydı → bugün ${fmtMoney(result.currentValue, lang, currency)} (${fmtPct(result.roiPercentage)}, CAGR ${fmtPct(cagr)}) — ${payload.footerLeft}`
    : `${fmtMoney(result.investmentAmount, lang, currency)} in BTC on ${formatStartDate(result.startDate, lang)} → ${fmtMoney(result.currentValue, lang, currency)} today (${fmtPct(result.roiPercentage)}, ${fmtPct(cagr)} CAGR) — ${payload.footerLeft}`;

  return (
    <ShareSnapshotCard
      payload={payload}
      filename={{ en: 'bitcoin-what-if', tr: 'bitcoin-ya-olsaydi' }}
      shareText={shareText}
      shareTitle={tr ? 'Bitcoin Ya Alsaydım Hesabım' : 'My Bitcoin What-If'}
    />
  );
};

export default WhatIfShareSnapshot;
