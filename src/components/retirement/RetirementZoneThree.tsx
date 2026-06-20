import { PageSection } from "@/components/calculator";
import { RetirementContentSections } from "@/components/retirement/RetirementContentSections";
import { RetirementFourPercentRule } from "@/components/retirement/RetirementFourPercentRule";
import { RetirementThreeModes } from "@/components/retirement/RetirementThreeModes";
import { RetirementHowItWorksSection } from "@/components/retirement/RetirementHowItWorksSection";

interface Props {
  language: string;
  onSelectMode: (mode: 'forecaster' | 'planner' | 'fire') => void;
}

/**
 * Zone 3 — Editorial / How It Works. Intro H2 + prose + 4 % rule +
 * three-modes guide + how-it-works.
 */
export const RetirementZoneThree = ({ language, onSelectMode }: Props) => (
  <PageSection
    tone="default"
    width="wide"
    spacing="loose"
  >
    <div className="max-w-3xl mx-auto pb-12 text-center">
      <h2 className="text-h2 font-bold text-foreground mb-4">
        {language === 'tr'
          ? 'Bitcoin ile Emekliliği Planlayın'
          : 'Plan Your Bitcoin Retirement'}
      </h2>

      <p className="text-muted-foreground leading-relaxed mb-4">
        {language === 'tr' ? (
          <>Her ay sat biriktiriyor ya da zaten önemli bir Bitcoin pozisyonu tutuyor olun, bu bitcoin emeklilik hesaplayıcısı finansal bağımsızlık yolculuğunuzu modellemenize yardımcı olur. Mevcut DCA stratejinizin nereye götürdüğünü öngörmek için <strong className="text-foreground">Öngörüleyici</strong>'yi, hedef emeklilik geliriniz için gereken aylık yatırımı tersine hesaplamak için <strong className="text-foreground">Hedef Planlayıcı</strong>'yı ya da Bitcoin varlıklarınızın yıllık harcamalarınızı ne zaman karşılayabileceğini öğrenmek için <strong className="text-foreground">FIRE Modu</strong>'nu kullanın.</>
        ) : (
          <>Whether you're stacking sats every month or already holding a significant Bitcoin position, this bitcoin retirement calculator helps you model your journey to financial independence. Use the <strong className="text-foreground">Forecaster</strong> to project where your current DCA strategy leads, the <strong className="text-foreground">Goal Planner</strong> to reverse-engineer the monthly investment needed for your target retirement income, or <strong className="text-foreground">FIRE Mode</strong> to find out when your Bitcoin holdings could cover your annual expenses.</>
        )}
      </p>
      <p className="text-muted-foreground leading-relaxed">
        {language === 'tr'
          ? 'Her projeksiyon %4 çekim kuralını, enflasyon düzeltmelerini ve Bitcoin\'in beklenen büyüme oranını hesaba katar — bitcoin emeklilik planınız için gerçekçi bir sonuç yelpazesi sunar. Bitcoin ile emekliliğin hem potansiyelini hem de risklerini anlamak için muhafazakâr ve iyimser senaryoları yan yana çalıştırın.'
          : 'Every projection factors in the 4% withdrawal rule, inflation adjustments, and Bitcoin\'s expected growth rate — giving you a realistic range of outcomes for your bitcoin retirement plan. Run conservative and optimistic scenarios side by side to understand both the potential and the risks of retiring on Bitcoin.'}
      </p>
    </div>

    <RetirementContentSections />
    <RetirementFourPercentRule />
    <RetirementThreeModes onSelectMode={onSelectMode} />
    <RetirementHowItWorksSection />
  </PageSection>
);
