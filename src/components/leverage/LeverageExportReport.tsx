import React, { useState } from 'react';
import { formatSymbolAmount } from '@/utils/numberFormat';
import { ShareExportPanel, downloadStandardPdf } from '@/components/share-export';
import { LiquidationResult } from '@/services/leverageLiquidationCalculator';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFileDownload } from '@/hooks/useFileDownload';
import { csvNumber, csvPercent } from '@/utils/csvExport';

interface LeverageExportReportProps {
  result: LiquidationResult | null;
  entryPrice: number;
  leverage: number;
  marginAmount: number;
  positionType: 'long' | 'short';
  exchangeName: string;
}

const money = (v: number) =>
  formatSymbolAmount(v, '$', 2, 'en-US');
const pct = (v: number) => `${v.toFixed(2)}%`;

export const LeverageExportReport: React.FC<LeverageExportReportProps> = ({
  result, entryPrice, leverage, marginAmount, positionType, exchangeName,
}) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { exportCsv } = useFileDownload();

  const handlePdf = async () => {
    if (!result) return;
    setBusy(true);
    try {
      const riskAccent =
        result.riskScore === 'low' ? 'success' :
        result.riskScore === 'medium' ? 'ember' : 'danger';
      await downloadStandardPdf({
        title: tr ? 'Bitcoin Kaldıraç Analizi' : 'Bitcoin Leverage Analysis',
        subtitle: `${positionType.toUpperCase()} · ${leverage}x · ${exchangeName}`,
        language,
        filename: { en: 'leverage-analysis', tr: 'kaldirac-analizi' },
        canonicalUrl: 'bitcoincalculator.tools/calculators/leverage-liquidation',
        headline: { label: tr ? 'Likidasyon Fiyatı' : 'Liquidation Price', value: money(result.liquidationPrice), accent: 'danger' },
        sections: [
          {
            heading: tr ? 'Pozisyon Detayları' : 'Position Details',
            rows: [
              [tr ? 'Pozisyon Tipi' : 'Position Type', positionType.toUpperCase()],
              [tr ? 'Borsa' : 'Exchange', exchangeName],
              [tr ? 'Giriş Fiyatı' : 'Entry Price', money(entryPrice)],
              [tr ? 'Kaldıraç' : 'Leverage', `${leverage}x`],
              [tr ? 'Teminat' : 'Margin', money(marginAmount)],
              [tr ? 'Pozisyon Büyüklüğü' : 'Position Size', money(result.positionSizeUsd)],
            ],
          },
          {
            heading: tr ? 'Risk Analizi' : 'Risk Analysis',
            rows: [
              [tr ? 'Likidasyon Fiyatı' : 'Liquidation Price', money(result.liquidationPrice)],
              [tr ? 'Likidasyona Uzaklık' : 'Distance to Liq.', pct(result.distanceToLiquidation)],
              [tr ? 'Teminat Çağrısı Fiyatı' : 'Margin Call Price', money(result.marginCallPrice)],
              [tr ? 'Başabaş Fiyatı' : 'Break-Even Price', money(result.breakEvenPrice)],
              [tr ? 'Risk Skoru' : 'Risk Score', result.riskScore.toUpperCase()],
            ],
          },
        ],
        disclaimer: tr
          ? ['Bu analiz eğitim amaçlıdır; kaldıraçlı işlemler önemli kayıp riski taşır.']
          : ['This analysis is for educational purposes only; leveraged trading carries significant risk of loss.'],
      });
      // riskAccent used implicitly by section colour selection above
      void riskAccent;
    } finally { setBusy(false); }
  };

  /** CSV mirrors the PDF's position + risk rows so both exports always agree. */
  const handleCsv = () => {
    if (!result) return;
    exportCsv({
      meta: {
        calculator: tr ? 'Bitcoin Kaldıraç & Likidasyon Hesaplayıcı' : 'Bitcoin Leverage & Liquidation Calculator',
        currency: 'USD',
        path: '/calculators/leverage-liquidation',
        extraRows: [
          [tr ? 'Pozisyon tipi' : 'Position type', positionType.toUpperCase()],
          [tr ? 'Borsa' : 'Exchange', exchangeName],
          [tr ? 'Giriş fiyatı (USD)' : 'Entry price (USD)', csvNumber(entryPrice)],
          [tr ? 'Kaldıraç' : 'Leverage', `${leverage}x`],
          [tr ? 'Teminat (USD)' : 'Margin (USD)', csvNumber(marginAmount)],
        ],
      },
      filename: { en: 'bitcoin-leverage-analysis', tr: 'bitcoin-kaldirac-analizi' },
      columns: tr ? ['Metrik', 'Değer'] : ['Metric', 'Value'],
      rows: [
        [tr ? 'Pozisyon büyüklüğü (USD)' : 'Position size (USD)', csvNumber(result.positionSizeUsd)],
        [tr ? 'Likidasyon fiyatı (USD)' : 'Liquidation price (USD)', csvNumber(result.liquidationPrice)],
        [tr ? 'Likidasyona uzaklık' : 'Distance to liquidation', csvPercent(result.distanceToLiquidation)],
        [tr ? 'Teminat çağrısı fiyatı (USD)' : 'Margin call price (USD)', csvNumber(result.marginCallPrice)],
        [tr ? 'Başabaş fiyatı (USD)' : 'Break-even price (USD)', csvNumber(result.breakEvenPrice)],
        [tr ? 'Risk skoru' : 'Risk score', result.riskScore.toUpperCase()],
      ],
    });
  };

  const handleShare = async () => {
    if (!result) return;
    const posLabel = positionType.toUpperCase();
    const text = tr
      ? `📊 Bitcoin Kaldıraç Analizi\n\n${posLabel} ${leverage}x\nGiriş: ${money(entryPrice)}\nLikidasyon: ${money(result.liquidationPrice)}\nUzaklık: ${pct(result.distanceToLiquidation)}\nRisk: ${result.riskScore.toUpperCase()}\n\nbitcoincalculator.tools/calculators/leverage-liquidation`
      : `📊 Bitcoin Leverage Analysis\n\n${posLabel} ${leverage}x\nEntry: ${money(entryPrice)}\nLiquidation: ${money(result.liquidationPrice)}\nDistance: ${pct(result.distanceToLiquidation)}\nRisk: ${result.riskScore.toUpperCase()}\n\nbitcoincalculator.tools/calculators/leverage-liquidation`;
    try {
      if (navigator.share) {
        await navigator.share({ title: tr ? 'Bitcoin Kaldıraç Analizi' : 'Bitcoin Leverage Analysis', text });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({ title: tr ? 'Panoya kopyalandı' : 'Copied to clipboard' });
      }
    } catch { /* noop */ }
  };

  if (!result) return null;

  return (
    <ShareExportPanel
      actions={[
        { kind: 'pdf', onClick: handlePdf, loading: busy },
        { kind: 'csv', onClick: handleCsv },
        { kind: 'copy-link', onClick: handleShare, copied },
      ]}
    />
  );
};
