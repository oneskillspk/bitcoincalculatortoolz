import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PageSection } from "@/components/calculator";
import { MethodologyBlock } from "@/components/calculator/MethodologyBlock";
import { RetirementFAQSection } from "@/components/retirement/RetirementFAQSection";
import RelatedCalculators from "@/components/RelatedCalculators";
import { QuickShareLinkPanel } from "@/components/share-export";
import { Link } from "@/components/LocalizedLink";


interface Props {
  language: string;
  disclaimer: string;
}

/**
 * Zone 4 — FAQ + Methodology + Related Calculators + Disclaimer (dark zone).
 */
export const RetirementZoneFour = ({ language, disclaimer }: Props) => (
  <PageSection
    tone="dark"
    width="wide"
    spacing="loose"
    aria-label={language === 'tr' ? 'Sorular ve Kaynaklar' : 'Questions and Sources'}
  >

    <RetirementFAQSection />


    <MethodologyBlock
      methodology={language === 'tr'
        ? 'Seçtiğiniz bileşik yıllık büyüme oranını (CAGR) kullanarak Bitcoin bakiyenizi ileriye projelendiriyor, ardından Bitcoin’in daha yüksek oynaklığına göre uyarlanmış %4 güvenli çekim oranına dayalı bir çekim modeli uyguluyoruz. Enflasyona göre düzeltilmiş emeklilik geliri, varsaydığınız TÜFE oranı kullanılarak bugünün parasıyla hesaplanır. Model; muhafazakâr (%10 CAGR), temel (%25 CAGR) ve agresif (%40 CAGR) olmak üzere üç senaryo sunar ve tarihi 13 yıllık Bitcoin CAGR’si olan yaklaşık %60’ı geniş bir güvenlik payıyla çevreler.'
        : 'We project your Bitcoin balance forward using a compounded annual growth rate (CAGR) you choose, then apply a withdrawal model based on the 4% safe withdrawal rate (Bengen, 1994) adjusted for Bitcoin\'s higher volatility. Inflation-adjusted retirement income is computed in today\'s dollars using your assumed CPI rate. The model surfaces three scenarios — conservative (10% CAGR), base (25% CAGR), and aggressive (40% CAGR) — bracketing the historical 13-year Bitcoin CAGR of ~60% with a wide margin of safety.'}
      sources={[
        { label: 'Bengen (1994) — Determining Withdrawal Rates Using Historical Data', url: 'https://www.retailinvestor.org/pdf/Bengen1.pdf', publisher: 'Journal of Financial Planning' },
        { label: 'BLS Consumer Price Index (CPI-U) historical data', url: 'https://www.bls.gov/cpi/', publisher: 'U.S. Bureau of Labor Statistics' },
        { label: 'Bitcoin historical price (2010–present)', url: 'https://www.coingecko.com/en/coins/bitcoin/historical_data', publisher: 'CoinGecko' },
      ]}
      lastReviewed="2026-06-20"
      reviewer="Web3Believer & Webio"
      labels={language === 'tr'
        ? { title: 'Kaynaklar ve Yöntem', howWeCalculate: 'Nasıl hesaplıyoruz', primarySources: 'Birincil kaynaklar', reviewedBy: 'İncelendi', lastUpdated: 'Son güncelleme', formulasOpen: 'Tüm formüller yukarıda açıkça belgelenmiştir.', disclaimer: 'Feragatname:' }
        : undefined}
      disclaimer={language === 'tr'
        ? 'Emeklilik projeksiyonları yalnızca örnek amaçlıdır, tahmin değildir. Geçmiş Bitcoin getirileri gelecekteki performansı garanti etmez. Tahsis kararları vermeden önce geleneksel emeklilik hesapları (401k, IRA) ile birleştirin ve yetkin bir mali danışmana danışın.'
        : 'Retirement projections are illustrative, not predictive. Past Bitcoin returns do not guarantee future performance. Combine with traditional retirement accounts (401k, IRA) and consult a fiduciary financial planner before making allocation decisions.'}
    />

    {/* Downside-risk internal link — mirrors DCA page */}
    <div className="max-w-3xl mx-auto text-center text-sm text-muted-foreground pt-8">
      {language === 'tr' ? (
        <>Emeklilik birikiminizin düşüş riskini stres testi yapmak ister misiniz? <Link to="/calculators/drawdown" className="text-primary hover:underline font-medium">Bitcoin düzeltme hesaplayıcısı</Link> ile %10–80 senaryolarını modelleyin.</>
      ) : (
        <>Want to stress-test downside risk to your retirement stack? Model 10–80% scenarios with our <Link to="/calculators/drawdown" className="text-primary hover:underline font-medium">bitcoin correction calculator</Link>.</>
      )}
    </div>

    <div className="pt-8">
      <RelatedCalculators />
    </div>


    <div className="max-w-3xl mx-auto pt-8">
      <Card className="glass-morphism-card border-border/20 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                {language === 'tr' ? 'Feragatname' : 'Disclaimer'}
              </h3>
              <p className="text-sm text-muted-foreground">{disclaimer}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </PageSection>
);
