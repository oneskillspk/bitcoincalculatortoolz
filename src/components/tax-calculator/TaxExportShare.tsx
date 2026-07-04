import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Share2, Link as LinkIcon, Twitter, Linkedin, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { applyLocalizedPdfFont } from '@/utils/pdfFont';
import { EnhancedTaxCalculation, TaxConfiguration, EnhancedTaxCalculatorService } from '@/services/enhancedTaxCalculator';
import { useLanguage } from '@/contexts/LanguageContext';
import { buildExportFilename } from '@/utils/exportFilename';

interface TaxExportShareProps {
  results: EnhancedTaxCalculation;
  config: TaxConfiguration;
}

export const TaxExportShare: React.FC<TaxExportShareProps> = ({ results, config }) => {
  const { language, t } = useLanguage();
  const tr = language === 'tr';

  const [isExporting, setIsExporting] = useState<'png' | 'pdf' | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const report = EnhancedTaxCalculatorService.generateTaxReport(results, config);

  const buildReportElement = () => {
    const el = document.createElement('div');
    el.className = 'p-8 bg-card text-card-foreground max-w-4xl mx-auto';
    el.innerHTML = `
      <div class="space-y-8">
        <div class="text-center border-b border-border pb-6">
          <h1 class="text-3xl font-bold mb-2 text-foreground">${report.title}</h1>
          <p class="text-muted-foreground">Jurisdiction: ${report.jurisdiction}${report.state ? ` • State: ${report.state}` : ''} • Filing: ${report.filingStatus} • Year: ${report.taxYear}</p>
          <p class="text-muted-foreground">Generated on ${report.generatedDate}</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2 text-sm">
            <h2 class="text-xl font-semibold text-foreground">Federal Summary</h2>
            <p><strong>Total Gains:</strong> ${report.federalSummary.totalGains}</p>
            <p><strong>Total Losses:</strong> ${report.federalSummary.totalLosses}</p>
            <p><strong>Net Capital Gains:</strong> ${report.federalSummary.netCapitalGains}</p>
            <p><strong>Federal Tax Owed:</strong> ${report.federalSummary.federalTaxOwed} (NIIT: ${report.federalSummary.niitTax})</p>
            <p><strong>Effective Rate:</strong> ${report.federalSummary.effectiveTaxRate}</p>
          </div>
          <div class="space-y-2 text-sm">
            <h2 class="text-xl font-semibold text-foreground">Totals</h2>
            ${report.stateSummary ? `<p><strong>State Tax Owed:</strong> ${report.stateSummary.stateTaxOwed}</p>` : ''}
            ${report.stateSummary ? `<p><strong>State Effective Rate:</strong> ${report.stateSummary.effectiveTaxRate}</p>` : ''}
            <p><strong>Total Tax Liability:</strong> ${report.totalTaxLiability}</p>
            <p><strong>Net Proceeds After Tax:</strong> ${report.netProceedsAfterTax}</p>
          </div>
        </div>
        <div class="space-y-2 text-sm">
          <h2 class="text-xl font-semibold text-foreground">Breakdown</h2>
          <p><strong>Short-term:</strong> Gains ${report.breakdown.shortTerm.gains}, Losses ${report.breakdown.shortTerm.losses}</p>
          <p><strong>Long-term:</strong> Gains ${report.breakdown.longTerm.gains}, Losses ${report.breakdown.longTerm.losses}</p>
        </div>
        ${report.optimizationSuggestions.length ? `
          <div class="space-y-2 text-sm">
            <h2 class="text-xl font-semibold text-foreground">Optimization Suggestions</h2>
            <ul class="list-disc ml-6 space-y-1">
              ${report.optimizationSuggestions.map((s: string) => `<li>${s}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        <div class="text-xs text-muted-foreground pt-4 border-t border-border">
          <p>This report is for informational purposes only and not tax advice.</p>
        </div>
      </div>
    `;
    return el;
  };

  const exportPNG = async () => {
    setIsExporting('png');
    try {
      const el = buildReportElement();
      document.body.appendChild(el);
      const canvas = await html2canvas(el, { backgroundColor: '#ffffff', scale: 2 });
      const link = document.createElement('a');
      link.download = buildExportFilename({ en: 'bitcoin-tax-report', tr: 'bitcoin-vergi-raporu' }, 'png', language, { extra: String(config.taxYear), withDate: false });
      link.href = canvas.toDataURL('image/png');
      link.click();
      document.body.removeChild(el);
    } finally {
      setIsExporting(null);
    }
  };

  const exportPDF = async () => {
    setIsExporting('pdf');
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      await applyLocalizedPdfFont(pdf, language);
      const pageWidth = pdf.internal.pageSize.getWidth();

      pdf.setFontSize(20);
      pdf.setFont(undefined, 'bold');
      pdf.text(report.title, pageWidth / 2, 20, { align: 'center' });

      pdf.setFontSize(10);
      pdf.setFont(undefined, 'normal');
      pdf.text(`Jurisdiction: ${report.jurisdiction}${report.state ? ` • State: ${report.state}` : ''} • Filing: ${report.filingStatus} • Year: ${report.taxYear}`, pageWidth / 2, 28, { align: 'center' });
      pdf.text(`Generated on ${report.generatedDate}`, pageWidth / 2, 34, { align: 'center' });

      let y = 44;
      pdf.setFont(undefined, 'bold');
      pdf.setFontSize(14);
      pdf.text('Federal Summary', 20, y); y += 8;
      pdf.setFont(undefined, 'normal');
      pdf.setFontSize(11);
      pdf.text(`Total Gains: ${report.federalSummary.totalGains}`, 20, y); y += 6;
      pdf.text(`Total Losses: ${report.federalSummary.totalLosses}`, 20, y); y += 6;
      pdf.text(`Net Capital Gains: ${report.federalSummary.netCapitalGains}`, 20, y); y += 6;
      pdf.text(`Federal Tax Owed: ${report.federalSummary.federalTaxOwed} (NIIT: ${report.federalSummary.niitTax})`, 20, y); y += 6;
      pdf.text(`Effective Rate: ${report.federalSummary.effectiveTaxRate}`, 20, y); y += 10;

      pdf.setFont(undefined, 'bold');
      pdf.text('Totals', 20, y); y += 8;
      pdf.setFont(undefined, 'normal');
      if (report.stateSummary) { pdf.text(`State Tax Owed: ${report.stateSummary.stateTaxOwed}`, 20, y); y += 6; }
      if (report.stateSummary) { pdf.text(`State Effective Rate: ${report.stateSummary.effectiveTaxRate}`, 20, y); y += 6; }
      pdf.text(`Total Tax Liability: ${report.totalTaxLiability}`, 20, y); y += 6;
      pdf.text(`Net Proceeds After Tax: ${report.netProceedsAfterTax}`, 20, y); y += 10;

      pdf.setFont(undefined, 'bold');
      pdf.text('Breakdown', 20, y); y += 8;
      pdf.setFont(undefined, 'normal');
      pdf.text(`Short-term: Gains ${report.breakdown.shortTerm.gains}, Losses ${report.breakdown.shortTerm.losses}`, 20, y); y += 6;
      pdf.text(`Long-term: Gains ${report.breakdown.longTerm.gains}, Losses ${report.breakdown.longTerm.losses}`, 20, y); y += 10;

      if (report.optimizationSuggestions.length) {
        pdf.setFont(undefined, 'bold');
        pdf.text('Optimization Suggestions', 20, y); y += 8;
        pdf.setFont(undefined, 'normal');
        report.optimizationSuggestions.forEach((s: string) => { pdf.text(`• ${s}`, 20, y); y += 6; });
      }

      pdf.save(buildExportFilename({ en: 'bitcoin-tax-report', tr: 'bitcoin-vergi-raporu' }, 'pdf', language, { extra: String(config.taxYear), withDate: false }));
    } finally {
      setIsExporting(null);
    }
  };

  const pageUrl = 'https://bitcoincalculator.tools/calculators/capital-gains-tax';
  const fmt = (n: number) => `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  const shareText = `📊 Bitcoin Capital Gains Tax Report (${config.taxYear}): Total Tax ${fmt(results.totalTaxLiability)} | Effective Rate ${(results.federalTax.effectiveTaxRate * 100).toFixed(1)}% | Net Proceeds ${fmt(results.netProceedsAfterTax)}\n\nCalculate yours 👇\n${pageUrl}`;
  const encodedText = encodeURIComponent(shareText);

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, '_blank');
  };
  const shareToLinkedin = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`, '_blank');
  };
  const shareToReddit = () => {
    window.open(`https://www.reddit.com/submit?url=${encodeURIComponent(pageUrl)}&title=${encodeURIComponent(`Bitcoin Capital Gains Tax Calculator - ${config.taxYear}`)}`, '_blank');
  };
  const copyShareText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      toast({
        title: tr ? 'Kopyalandı!' : 'Copied!',
        description: tr ? 'Paylaşım metni panoya kopyalandı' : 'Share text copied to clipboard'
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: tr ? 'Hata' : 'Error', variant: 'destructive' });
    }
  };

  return (
    <Card className="glass-morphism-card border-border/20">
      <CardContent className="p-4">
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            {tr ? 'Dışa Aktar ve Paylaş' : 'Export & Share'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Button size="sm" variant="outline" onClick={exportPNG} disabled={isExporting !== null} className="h-9">
              {isExporting === 'png' ? (
                <>
                  <div className="w-3 h-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  PNG...
                </>
              ) : (
                <>
                  <Download className="w-3 h-3 mr-2" />
                  {tr ? 'PNG Raporu' : 'PNG Report'}
                </>
              )}
            </Button>
            <Button size="sm" variant="outline" onClick={exportPDF} disabled={isExporting !== null} className="h-9">
              {isExporting === 'pdf' ? (
                <>
                  <div className="w-3 h-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  PDF...
                </>
              ) : (
                <>
                  <FileText className="w-3 h-3 mr-2" />
                  {tr ? 'PDF Raporu' : 'PDF Report'}
                </>
              )}
            </Button>
            <Button size="sm" variant="outline" onClick={copyShareText} className="h-9">
              <LinkIcon className="w-3 h-3 mr-2" />
              {tr ? 'Linki Kopyala' : 'Copy Link'}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border/20">
            <Button onClick={shareToTwitter} size="sm" className="gap-1.5 text-xs bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white h-8 px-3" aria-label={t('aria.shareOnTwitter')}>
              <Twitter className="w-3.5 h-3.5" /><span className="hidden sm:inline">Twitter</span>
            </Button>
            <Button onClick={shareToLinkedin} size="sm" className="gap-1.5 text-xs bg-[#0A66C2] hover:bg-[#094d92] text-white h-8 px-3" aria-label={t('aria.shareOnLinkedIn')}>
              <Linkedin className="w-3.5 h-3.5" /><span className="hidden sm:inline">LinkedIn</span>
            </Button>
            <Button onClick={shareToReddit} size="sm" className="gap-1.5 text-xs bg-[#FF4500] hover:bg-[#e03d00] text-white h-8 px-3" aria-label={t('aria.shareOnReddit')}>
              <LinkIcon className="w-3.5 h-3.5" /><span className="hidden sm:inline">Reddit</span>
            </Button>
            <Button onClick={copyShareText} size="sm" variant="outline" className="gap-1.5 text-xs h-8 px-3" aria-label={t('aria.copyShareText')}>
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? (tr ? 'Kopyalandı!' : 'Copied!') : (tr ? 'Kopyala' : 'Copy')}</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
