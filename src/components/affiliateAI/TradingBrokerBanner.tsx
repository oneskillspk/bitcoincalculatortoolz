import { useEffect, useMemo } from 'react';
import { ArrowRight, TrendingUp, ShieldCheck, LineChart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { appendUtm, mintClickId } from '@/lib/affiliateAI/utm';
import { logEvent } from '@/lib/affiliateAI/analyticsClient';
import { AffiliateDisclosure } from '@/components/affiliateAI/AffiliateDisclosure';
import { useBanditVariant } from '@/hooks/useBanditVariant';

/**
 * Guaranteed broker banner for trading-intent calculator pages
 * (leverage-liquidation, profit-loss, volatility, risk-reward, ...).
 *
 * Same partner pool + bandit as LotSizePreExportBanner, but slug is
 * parameterized so analytics/UTM tag the correct page. Biased toward
 * Axi (highest CPA IB) via bandit weight + forced fallback so Axi is
 * guaranteed to render at least on every mount where the bandit
 * isn't already exploiting a mature winner.
 */

type PartnerId = 'axi' | 'tradingview' | 'ledger' | 'redotpay';

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
  axi: {
    id: 'axi',
    url: 'https://www.axi.com/int/live-account?promocode=4744672',
    icon: LineChart,
    titleEn: 'Trade this Bitcoin setup on MT4/MT5 — with Axi',
    titleTr: "Bu Bitcoin işlemini MT4/MT5'te aç — Axi ile",
    bodyEn: 'Regulated broker with micro lots, tight BTC spreads and fast withdrawals. Losses can exceed deposits.',
    bodyTr: "Regüle broker, mikro lot, dar BTC spread'i ve hızlı çekim. Kayıplar depozitoyu aşabilir.",
    ctaEn: 'Open Axi account',
    ctaTr: 'Axi hesabı aç',
  },
  tradingview: {
    id: 'tradingview',
    url: 'https://www.tradingview.com/?aff_id=166891&aff_sub=partners&utm_source=bitcoincalculator&utm_medium=referral&utm_campaign=trading_broker_banner',
    icon: LineChart,
    titleEn: 'Chart the setup before you take it — on TradingView',
    titleTr: 'İşlemi grafikte doğrula — TradingView ile',
    bodyEn: 'Mark your entry, stop and target on the same charts pros use.',
    bodyTr: 'Girişi, stopu ve hedefi profesyonellerin kullandığı grafiklerde işaretle.',
    ctaEn: 'Try TradingView free',
    ctaTr: "TradingView'ı ücretsiz dene",
  },
  ledger: {
    id: 'ledger',
    url: 'https://shop.ledger.com/?r=8c4e8e87cac7',
    icon: ShieldCheck,
    titleEn: 'Move profits off the exchange — Ledger cold storage',
    titleTr: 'Kazançları borsadan çıkarın — Ledger soğuk cüzdan',
    bodyEn: 'Cold storage keeps profits safe from hacks & forced liquidations.',
    bodyTr: 'Soğuk cüzdan kârı hack ve zorunlu tasfiyelerden korur.',
    ctaEn: 'Secure your BTC',
    ctaTr: "BTC'ni güvene al",
  },
  redotpay: {
    id: 'redotpay',
    url: 'https://wap.redotpay.com/en/invite/affiliates-1?utm_id=36rgik&utm_source=union&utm_uid=15980&utm_s=f29a110dc987f17ad366813652572664712174e0',
    icon: TrendingUp,
    titleEn: 'Cash out this trade to a Visa card — RedotPay',
    titleTr: 'İşlem kârını Visa karta çek — RedotPay',
    bodyEn: 'Turn profits into spendable USD. Apple Pay & Google Pay ready.',
    bodyTr: "Kârları harcanabilir USD'ye çevir. Apple Pay & Google Pay hazır.",
    ctaEn: 'Get $5 free',
    ctaTr: '$5 bonus al',
  },
};

const CRYPTO_BROKERS = new Set(['bybit', 'binance', 'delta']);
const FOREX_BROKERS = new Set(['axi', 'vantage', 'oanda', 'ig', 'pepperstone', 'forex', 'mt4', 'mt5']);

interface Props {
  slug: string;
  segment?: string;
  selectedBroker?: string;
  hasLiquidationRisk?: boolean;
  /** When true, force Axi (used on pure forex/leverage intent pages). */
  forceAxi?: boolean;
}

export const TradingBrokerBanner = ({
  slug,
  segment = 'trading-broker',
  selectedBroker,
  hasLiquidationRisk,
  forceAxi = false,
}: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const clickId = useMemo(() => mintClickId(), []);

  const bandit = useBanditVariant('lot_size_preexport_banner');

  const forced: PartnerId | null = forceAxi
    ? 'axi'
    : selectedBroker && FOREX_BROKERS.has(selectedBroker.toLowerCase())
      ? 'axi'
      : hasLiquidationRisk
        ? 'ledger'
        : selectedBroker && CRYPTO_BROKERS.has(selectedBroker.toLowerCase())
          ? 'redotpay'
          : null;

  const banditPick = (bandit.variantId as PartnerId) in PARTNERS
    ? (bandit.variantId as PartnerId)
    : ('axi' as PartnerId);
  const partnerId = (forced ?? banditPick) as PartnerId;
  const partner = PARTNERS[partnerId] ?? PARTNERS.axi;
  const Icon = partner.icon;

  const variantStamp = forced
    ? `trading_broker_banner:forced-${forced}`
    : bandit.stamp;

  useEffect(() => {
    logEvent({
      kind: 'impression',
      affiliate_id: partner.id,
      slug,
      lang: tr ? 'tr' : 'en',
      segment,
      variant_id: variantStamp,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partner.id, variantStamp, slug]);

  const href = appendUtm(partner.url, {
    slug,
    affiliateId: partner.id,
    zone: 'trading-broker-banner',
    creativeId: `${slug}-broker-${partner.id}`,
    clickId,
  });

  const handleClick = () => {
    logEvent({
      kind: 'click',
      affiliate_id: partner.id,
      slug,
      lang: tr ? 'tr' : 'en',
      segment,
      click_id: clickId,
      variant_id: variantStamp,
    });
  };

  return (
    <aside
      aria-label={tr ? 'Sponsorlu öneri' : 'Sponsored recommendation'}
      data-partner={partner.id}
      data-slug={slug}
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

export default TradingBrokerBanner;
