import { useMemo } from 'react';
import { Link } from '@/components/LocalizedLink';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Context-aware related calculators. Instead of a fixed grid, recommendations
 * adapt to the user's setup:
 *   • Broker choice          → surfaces the fee/spread + broker-family calculators
 *   • Leverage tier          → prioritises liquidation + margin + funding tools
 *   • Liquidation-risk flag  → promotes risk-management + stop-loss tools first
 *
 * All items link within the app; slugs must exist in the router.
 */

export interface Rec {
  slug: string;
  slugTr?: string;
  titleEn: string;
  titleTr: string;
  reasonEn: string;
  reasonTr: string;
  weight: number; // higher = more relevant to the current context
}

export interface SmartRelatedContext {
  selectedBroker: string;
  leverage: number;
  hasLiquidationRisk: boolean;
}

interface Props extends SmartRelatedContext {}

export const CATALOG: Rec[] = [
  {
    slug: '/calculators/leverage-liquidation',
    slugTr: '/tr/hesaplayicilar/bitcoin-tasfiye',
    titleEn: 'Leverage & Liquidation Calculator',
    titleTr: 'Kaldıraç & Tasfiye Hesaplayıcısı',
    reasonEn: 'See exactly where your position gets force-closed.',
    reasonTr: 'Pozisyonunuzun tam olarak nerede zorla kapatılacağını görün.',
    weight: 0,
  },
  {
    slug: '/calculators/profit-loss',
    slugTr: '/tr/hesaplayicilar/bitcoin-kar-zarar-hesaplayicisi',
    titleEn: 'Profit & Loss Calculator',
    titleTr: 'Kâr & Zarar Hesaplayıcısı',
    reasonEn: 'Model the P&L on the lot you just sized.',
    reasonTr: 'Boyutlandırdığınız lot için kâr/zararı modelleyin.',
    weight: 0,
  },
  {
    slug: '/calculators/bitcoin-arbitrage',
    slugTr: '/tr/hesaplayicilar/bitcoin-arbitraj',
    titleEn: 'Bitcoin Arbitrage Calculator',
    titleTr: 'Bitcoin Arbitraj Hesaplayıcısı',
    reasonEn: 'Fee-aware spread math across the same brokers.',
    reasonTr: 'Aynı aracılar arasında komisyon-farkındalıklı spread hesabı.',
    weight: 0,
  },
  {
    slug: '/calculators/dca',
    slugTr: '/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi',
    titleEn: 'DCA Calculator',
    titleTr: 'DCA Hesaplayıcısı',
    reasonEn: 'Rather than leverage — accumulate spot BTC over time.',
    reasonTr: 'Kaldıraç yerine — zamana yayarak spot BTC biriktirin.',
    weight: 0,
  },
  {
    slug: '/calculators/bitcoin-converter',
    slugTr: '/tr/hesaplayicilar/bitcoin-donusturucu',
    titleEn: 'BTC ↔ USD Converter',
    titleTr: 'BTC ↔ USD Dönüştürücü',
    reasonEn: 'Convert lot notional to sats / fiat instantly.',
    reasonTr: 'Lot nominalini anında sat / fiat\'a çevirin.',
    weight: 0,
  },
];

export function score(base: Rec, ctx: SmartRelatedContext): number {
  let w = 1;
  const isHighLev = ctx.leverage >= 20;
  const isCrypto = ['bybit', 'binance', 'delta'].includes(ctx.selectedBroker);
  const isMt5 = ['exness', 'icmarkets', 'standard'].includes(ctx.selectedBroker);

  switch (base.slug) {
    case '/calculators/leverage-liquidation':
      w += ctx.hasLiquidationRisk ? 4 : 0;
      w += isHighLev ? 3 : 0;
      break;
    case '/calculators/profit-loss':
      w += 2;
      w += ctx.leverage >= 5 ? 1 : 0;
      break;
    case '/calculators/risk-reward':
      w += 2;
      break;
    case '/calculators/bitcoin-arbitrage':
      w += isCrypto ? 2 : 0;
      break;
    case '/calculators/dca':
      w += isHighLev ? -1 : 2;
      w += ctx.hasLiquidationRisk ? 2 : 0;
      break;
    case '/calculators/bitcoin-converter':
      w += isMt5 ? 1 : 0;
      break;
  }
  return w;
}

/**
 * Pure ranker used by the component (and directly unit-testable).
 * Returns up to `limit` recommendations sorted by descending weight.
 */
export function rankRelated(ctx: SmartRelatedContext, limit = 4): Rec[] {
  return CATALOG
    .map(r => ({ ...r, weight: score(r, ctx) }))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, limit);
}

export const LotSizeSmartRelated = ({ selectedBroker, leverage, hasLiquidationRisk }: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const ranked = useMemo(
    () => rankRelated({ selectedBroker, leverage, hasLiquidationRisk }),
    [selectedBroker, leverage, hasLiquidationRisk],
  );

  return (
    <section className="container mx-auto px-6 pb-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <span className="inline-flex items-center px-3 py-1 rounded-full border border-border/60 bg-muted/40 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-4">
            {tr ? 'Sizin İçin' : 'For You'}
          </span>
          <h2 className="text-h2 font-semibold text-foreground max-w-2xl mx-auto [text-wrap:balance]">
            {tr ? 'İlgili Hesaplayıcılar' : 'Related Calculators'}
          </h2>
          <p className="mt-3 text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            {tr
              ? `${leverage}× kaldıraç ve seçilen aracınıza göre kişiselleştirildi${hasLiquidationRisk ? ' — risk sinyali algılandı' : ''}.`
              : `Personalized for ${leverage}× leverage and your selected broker${hasLiquidationRisk ? ' — risk signal detected' : ''}.`}
          </p>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ranked.map(r => (
            <Link
              key={r.slug}
              to={tr && r.slugTr ? r.slugTr : r.slug}
              className="group flex items-start gap-3 rounded-xl border border-border/40 bg-card p-4 hover:border-primary/40 hover:bg-primary/[0.02] transition"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground group-hover:text-primary text-sm">
                  {tr ? r.titleTr : r.titleEn}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-snug">
                  {tr ? r.reasonTr : r.reasonEn}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-primary opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform mt-1" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
