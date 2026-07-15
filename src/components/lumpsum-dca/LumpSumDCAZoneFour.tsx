import { AlertTriangle } from "lucide-react";
import { PageSection } from "@/components/calculator";
import { MethodologyBlock } from "@/components/calculator/MethodologyBlock";
import { LumpSumDCAFAQSection } from "./LumpSumDCAFAQSection";
import RelatedCalculators from "@/components/RelatedCalculatorsLazy";
import { QuickShareLinkPanel } from "@/components/share-export";
import { PreFAQPlacement } from "@/components/placement/PreFAQPlacement";

interface Props {
  language: string;
}

/**
 * Zone 4 — FAQ + Methodology + Related + Disclaimer.
 * Mirrors RetirementZoneFour rhythm.
 */
export const LumpSumDCAZoneFour = ({ language }: Props) => {
  const tr = language === 'tr';
  return (
    <PageSection
      tone="dark"
      width="wide"
      spacing="loose"
      aria-label={tr ? 'Sorular ve Kaynaklar' : 'Questions and Sources'}
    >
      <PreFAQPlacement slug="lump-sum-vs-dca" />
      <LumpSumDCAFAQSection />

      <MethodologyBlock
        methodology={tr
          ? "Hesaplayıcı, seçtiğiniz aralık için CoinGecko'dan gerçek tarihsel Bitcoin fiyatlarını çeker. Toplu yatırım başlangıç günündeki kapanış fiyatında tamamı yatırılır. DCA her frekans döneminde (haftalık/iki haftalık/aylık) sabit tutarla, DVA ise hedef portföy değerini korumak için değişken tutarlarla alır. ROI = (güncel değer − toplam yatırılan) / toplam yatırılan. Maksimum düşüş, oynaklık ve Sharpe oranı günlük portföy değeri serisinden hesaplanır."
          : "The calculator pulls real historical Bitcoin prices from CoinGecko for your selected window. Lump-sum deploys all capital at the start-date close. DCA buys a fixed amount at each frequency (weekly / biweekly / monthly). DVA varies the amount each period to keep the portfolio on a target growth path. ROI = (currentValue − totalInvested) / totalInvested. Max drawdown, volatility, and Sharpe ratio are computed from the daily portfolio-value series."}
        sources={[
          {
            label: 'Bitcoin historical price (2010–present)',
            url: 'https://www.coingecko.com/en/coins/bitcoin/historical_data',
            publisher: 'CoinGecko',
          },
          {
            label: 'Dollar-Cost Averaging Just Means Taking Risk Later (2012)',
            url: 'https://www.vanguard.com/pdf/ISGDCA.pdf',
            publisher: 'Vanguard Research',
          },
          {
            label: 'Sharpe Ratio — original paper',
            url: 'https://web.stanford.edu/~wfsharpe/art/sr/SR.htm',
            publisher: 'William F. Sharpe',
          },
        ]}
        lastReviewed="2026-07-15"
        reviewer="Web3Believer & Webio"
        labels={tr ? {
          title: 'Kaynaklar ve Yöntem',
          howWeCalculate: 'Nasıl hesaplıyoruz',
          primarySources: 'Birincil kaynaklar',
          reviewedBy: 'İncelendi',
          lastUpdated: 'Son güncelleme',
          formulasOpen: 'Tüm formüller açık ve yukarıda belgelenmiştir.',
          disclaimer: 'Feragatname:',
        } : undefined}
        disclaimer={tr
          ? 'Bu hesaplayıcı yalnızca tarihsel analiz sunar ve gelecekteki performansı tahmin edemez. Kripto para yatırımları son derece değişken ve risklidir. Yatırım kararları vermeden önce yetkin bir mali danışmana danışın.'
          : 'This calculator provides historical analysis only and cannot predict future performance. Cryptocurrency investments are highly volatile and risky. Consult a qualified financial advisor before making investment decisions.'}
      />

      <div className="pt-4">
        <QuickShareLinkPanel
          slug="lump-sum-vs-dca"
          headline={tr ? 'Toplu Yatırım vs DCA Hesaplayıcı' : 'Lump-Sum vs DCA Calculator'}
        />
        <RelatedCalculators />
      </div>

      <div className="max-w-3xl mx-auto pt-8">
        <div className="calc-surface-subtle p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                {tr ? 'Yatırım Feragatnamesi' : 'Investment Disclaimer'}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tr
                  ? 'Geçmiş performans gelecekteki sonuçları garanti etmez. Bitcoin yüksek oynaklık taşır — daima kendi araştırmanızı yapın ve risk toleransınızı göz önünde bulundurun.'
                  : 'Past performance does not guarantee future results. Bitcoin carries high volatility — always do your own research and consider your risk tolerance.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageSection>
  );
};
