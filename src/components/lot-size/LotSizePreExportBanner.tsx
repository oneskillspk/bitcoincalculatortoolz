import { useEffect, useMemo } from 'react';
import { ArrowRight, TrendingUp, ShieldCheck, LineChart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { appendUtm, mintClickId } from '@/lib/affiliateAI/utm';
import { logEvent } from '@/lib/affiliateAI/analyticsClient';
import { AffiliateDisclosure } from '@/components/affiliateAI/AffiliateDisclosure';
import { useBanditVariant } from '@/hooks/useBanditVariant';

/**
 * Single-partner affiliate banner rendered directly above the
 * "Share & Export" report block. High-intent placement: the user
 * has just sized a trade and is about to save/share it.
 *
 * Rotates between three real, tracked partners so the same visitor
 * doesn't see identical creative on repeat calculations, and context
 * signals (broker family, liquidation risk) bias which partner wins.
 * Selection is deterministic per pageview via the mint clickId hash,
 * so tests are stable within a mounted instance.
 */

type PartnerId = 'tradingview' | 'ledger' | 'redotpay';

interface Partner {
  id: PartnerId;
  url: string;
  icon: typeof TrendingUp;
  titleEn: string;
  titleTr: string;
  bodyEn: string;
  bodyTr: string;
  ctaEn: string;
  ctaTr: string;
}

const PARTNERS: Record<PartnerId, Partner> = {
  tradingview: {
    id: 'tradingview',
    url: 'https://www.tradingview.com/?aff_id=166891&aff_sub=partners&utm_source=bitcoincalculator&utm_medium=referral&utm_campaign=lot_size_preexport',
    icon: LineChart,
    titleEn: 'Chart the setup before you take it — on TradingView',
    titleTr: 'İşlemi grafikte doğrula — TradingView ile',
    bodyEn: 'Mark your entry, stop and target on the same charts pros use — then export the plan below.',
    bodyTr: 'Girişi, stopu ve hedefi profesyonellerin kullandığı grafiklerde işaretle — plan dışa aktarmaya hazır.',
    ctaEn: 'Try TradingView free',
    ctaTr: 'TradingView\'ı ücretsiz dene',
  },
  ledger: {
    id: 'ledger',
    url: 'https://shop.ledger.com/?r=8c4e8e87cac7',
    icon: ShieldCheck,
    titleEn: 'Move sized-up profits off the exchange — Ledger cold storage',
    titleTr: 'Kazançları borsadan çıkarın — Ledger soğuk cüzdan',
    bodyEn: 'You just planned the risk. Plan the exit too: cold storage keeps profits safe from hacks & forced liquidations.',
    bodyTr: 'Riski planladın. Çıkışı da planla: soğuk cüzdan kârı hack ve zorunlu tasfiyelerden korur.',
    ctaEn: 'Secure your BTC',
    ctaTr: 'BTC\'ni güvene al',
  },
  redotpay: {
    id: 'redotpay',
    url: 'https://wap.redotpay.com/en/invite/affiliates-1?utm_id=36rgik&utm_source=union&utm_uid=15980&utm_s=f29a110dc987f17ad366813652572664712174e0',
    icon: TrendingUp,
    titleEn: 'Cash out this trade to a Visa card — RedotPay',
    titleTr: 'İşlem kârını Visa karta çek — RedotPay',
    bodyEn: 'Turn profits into spendable USD. Apple Pay & Google Pay ready. $5 bonus for new users.',
    bodyTr: 'Kârları harcanabilir USD\'ye çevir. Apple Pay & Google Pay hazır. Yeni kullanıcılara $5 bonus.',
    ctaEn: 'Get $5 free',
    ctaTr: '$5 bonus al',
  },
};

const CRYPTO_BROKERS = new Set(['bybit', 'binance', 'delta']);

interface Props {
  selectedBroker?: string;
  hasLiquidationRisk?: boolean;
}

function pickPartner(clickId: string, selectedBroker?: string, hasLiquidationRisk?: boolean): Partner {
  // Context bias: liquidation risk → Ledger (safety pivot).
  if (hasLiquidationRisk) return PARTNERS.ledger;
  // Crypto-native brokers already have charts → RedotPay for cashout angle.
  if (selectedBroker && CRYPTO_BROKERS.has(selectedBroker)) return PARTNERS.redotpay;
  // Deterministic 3-way rotation based on clickId hash (per pageview).
  const hash = clickId.split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 0);
  const order: Partner[] = [PARTNERS.tradingview, PARTNERS.ledger, PARTNERS.redotpay];
  return order[hash % order.length];
}

export const LotSizePreExportBanner = ({ selectedBroker, hasLiquidationRisk }: Props = {}) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const clickId = useMemo(() => mintClickId(), []);

  // Bandit picks the partner from live EPC once each arm is mature;
  // until then, deterministic equal-split via useExperiment.
  const bandit = useBanditVariant('lot_size_preexport_banner');

  // Context override: high-risk or crypto-native broker forces a
  // relevant arm regardless of bandit exploit — content relevance
  // beats pure revenue optimization in these cases.
  const forced: PartnerId | null = hasLiquidationRisk
    ? 'ledger'
    : selectedBroker && CRYPTO_BROKERS.has(selectedBroker)
      ? 'redotpay'
      : null;

  const partnerId = (forced ?? (bandit.variantId as PartnerId)) as PartnerId;
  const partner = PARTNERS[partnerId] ?? PARTNERS.tradingview;
  const Icon = partner.icon;

  // Bandit stamp for analytics — real variant id when unforced so
  // per-arm CVR is queryable; forced overrides get their own stamp.
  const variantStamp = forced
    ? `lot_size_preexport_banner:forced-${forced}`
    : bandit.stamp;

  // Fire ONE impression per mount so per-arm CTR is measurable.
  useEffect(() => {
    logEvent({
      kind: 'impression',
      affiliate_id: partner.id,
      slug: 'lot-size',
      lang: tr ? 'tr' : 'en',
      segment: 'pre-export',
      variant_id: variantStamp,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partner.id, variantStamp]);

  const href = appendUtm(partner.url, {
    slug: 'lot-size',
    affiliateId: partner.id,
    zone: 'pre-export-banner',
    creativeId: `lot-size-pre-export-${partner.id}`,
    clickId,
  });

  const handleClick = () => {
    logEvent({
      kind: 'click',
      affiliate_id: partner.id,
      slug: 'lot-size',
      lang: tr ? 'tr' : 'en',
      segment: 'pre-export',
      click_id: clickId,
      variant_id: variantStamp,
    });
  };


  return (
    <aside
      aria-label={tr ? 'Sponsorlu öneri' : 'Sponsored recommendation'}
      data-partner={partner.id}
      className="mt-8 rounded-2xl border border-primary/25 bg-gradient-to-r from-primary/[0.06] via-primary/[0.03] to-transparent p-5 sm:p-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span
            aria-hidden
            className="shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 text-primary"
          >
            <Icon className="w-5 h-5" />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="text-base sm:text-lg font-semibold text-foreground">
                {tr ? partner.titleTr : partner.titleEn}
              </h3>
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-medium px-1.5 py-0.5 rounded bg-muted/50">
                {tr ? 'Sponsor' : 'Partner'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed [text-wrap:pretty]">
              {tr ? partner.bodyTr : partner.bodyEn}
            </p>
            <div className="mt-2">
              <AffiliateDisclosure lang={tr ? 'tr' : 'en'} />
            </div>
          </div>
        </div>
        <a
          href={href}
          onClick={handleClick}
          target="_blank"
          rel="noopener noreferrer nofollow sponsored"
          className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:bg-primary/90 transition self-start sm:self-center min-h-11"
        >
          {tr ? partner.ctaTr : partner.ctaEn}
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </aside>
  );
};

export default LotSizePreExportBanner;
