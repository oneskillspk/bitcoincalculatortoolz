import React, { useRef } from 'react';
import { ShareExportPanel } from '@/components/share-export';
import { type ProjectionResult, formatCurrency, formatPercentage } from '@/services/investmentProjectionCalculator';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { applyLocalizedPdfFont } from '@/utils/pdfFont';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { buildExportFilename } from '@/utils/exportFilename';

interface InvestmentExportReportProps {
  results: ProjectionResult[];
  lumpSum: number;
  monthlyContribution: number;
  timeHorizon: number;
  btcPrice: number;
}

export const InvestmentExportReport: React.FC<InvestmentExportReportProps> = ({
  results,
  lumpSum,
  monthlyContribution,
  timeHorizon,
  btcPrice,
}) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const reportRef = useRef<HTMLDivElement>(null);

  const handleExportPNG = async () => {
    if (!reportRef.current) return;
    try {
      const canvas = await html2canvas(reportRef.current, { backgroundColor: '#1a1a2e', scale: 2, useCORS: true });
      const link = document.createElement('a');
      link.download = buildExportFilename({ en: 'bitcoin-investment-projection', tr: 'bitcoin-yatirim-projeksiyonu' }, 'png', language);
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast({ title: tr ? 'Rapor PNG olarak aktarıldı' : 'Report exported as PNG' });
    } catch {
      toast({ title: tr ? 'Dışa aktarma başarısız' : 'Export failed', variant: 'destructive' });
    }
  };

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    try {
      const canvas = await html2canvas(reportRef.current, { backgroundColor: '#1a1a2e', scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      await applyLocalizedPdfFont(pdf, language);
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(buildExportFilename({ en: 'bitcoin-investment-projection', tr: 'bitcoin-yatirim-projeksiyonu' }, 'pdf', language));
      toast({ title: tr ? 'Rapor PDF olarak aktarıldı' : 'Report exported as PDF' });
    } catch {
      toast({ title: tr ? 'Dışa aktarma başarısız' : 'Export failed', variant: 'destructive' });
    }
  };

  if (results.length === 0) return null;

  return (
    <>
      <ShareExportPanel
        actions={[
          { kind: 'pdf', onClick: handleExportPDF },
          { kind: 'png', onClick: handleExportPNG },
        ]}
      />
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">



        <div className="absolute -left-[9999px]" aria-hidden="true">
          <div ref={reportRef} className="w-[800px] p-8 bg-card text-card-foreground border border-border/40 font-sans">
            <h2 className="text-h2 font-bold mb-1">{tr ? 'Bitcoin Yatırım Projeksiyonu' : 'Bitcoin Investment Projection'}</h2>
            <p className="text-sm text-muted-foreground mb-6">{tr ? 'Oluşturuldu:' : 'Generated on'} {new Date().toLocaleDateString()} — bitcoincalculator.tools</p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-xs text-muted-foreground">{tr ? 'Başlangıç Yatırımı' : 'Initial Investment'}</p>
                <p className="text-lg font-bold">{formatCurrency(lumpSum)}</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-xs text-muted-foreground">{tr ? 'Aylık DCA' : 'Monthly DCA'}</p>
                <p className="text-lg font-bold">{formatCurrency(monthlyContribution)}</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-xs text-muted-foreground">{tr ? 'Zaman Ufku' : 'Time Horizon'}</p>
                <p className="text-lg font-bold">{timeHorizon} {tr ? 'yıl' : 'years'}</p>
              </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-4 mb-6">
              <p className="text-xs text-muted-foreground mb-1">{tr ? 'Hesaplama Anındaki BTC Fiyatı' : 'BTC Price at Calculation'}</p>
              <p className="text-lg font-bold">${btcPrice.toLocaleString()}</p>
            </div>

            {results.map((r) => (
              <div key={r.modelId} className="bg-muted/30 rounded-lg p-4 mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: r.color }} />
                  <p className="font-semibold">{r.modelName}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">{tr ? 'Tahmini Değer: ' : 'Projected Value: '}</span>
                    <span className="font-mono">{formatCurrency(r.finalValue)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{tr ? 'Kâr: ' : 'Profit: '}</span>
                    <span className="font-mono text-success">+{formatCurrency(r.projectedProfit)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">ROI: </span>
                    <span className="font-mono">{formatPercentage(r.projectedROI)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{tr ? 'Tahmini BTC: ' : 'Est. BTC: '}</span>
                    <span className="font-mono">{r.estimatedBtcHoldings.toFixed(6)}</span>
                  </div>
                </div>
              </div>
            ))}

            <p className="text-xs text-muted-foreground mt-4">
              {tr
                ? 'Yasal Uyarı: Bu projeksiyonlar varsayımsal büyüme oranlarına dayanmaktadır ve gelecekteki getirileri garanti etmez. Geçmiş performans gelecekteki sonuçları tahmin etmez. Her zaman kendi araştırmanızı yapın.'
                : 'Disclaimer: These projections are based on hypothetical growth rates and do not guarantee future returns. Past performance does not predict future results. Always do your own research.'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
