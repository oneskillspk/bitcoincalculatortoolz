import { useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { appendUtm, mintClickId } from '@/lib/affiliateAI/utm';
import { logEvent } from '@/lib/affiliateAI/analyticsClient';
import { AffiliateDisclosure } from '@/components/affiliateAI/AffiliateDisclosure';

/**
 * Trader-tuned affiliate cluster shown BELOW the results panel (highest-CTR
 * placement on a lot-size page — the user has just committed to a trade
 * setup). Uses tracked URLs from src/config/affiliates.ts.
 *
 * FTC disclosure rendered once at top; each card carries rel="sponsored".
 */
interface TraderPartner {
  id: string;
  name: string;
  pitchEn: string;
  pitchTr: string;
  ctaEn: string;
  ctaTr: string;
  url: string;
  icon: string;
}

const PARTNERS: TraderPartner[] = [
  {
    id: 'axi',
    name: 'Axi',
    pitchEn: 'Execute this Bitcoin setup on MT4/MT5. Micro lots, tight BTC spreads, fast withdrawals. Losses can exceed deposits.',
    pitchTr: 'Bu Bitcoin işlemini MT4/MT5\'te aç. Mikro lot, dar BTC spread\'i, hızlı çekim. Kayıplar depozitoyu aşabilir.',
    ctaEn: 'Open Axi account',
    ctaTr: 'Axi hesabı aç',
    url: 'https://www.axi.com/int/live-account?promocode=4744672',
    icon: '📊',
  },
  {
    id: 'ledger',
    name: 'Ledger',
    pitchEn: 'Move winnings off the exchange. Ledger cold storage keeps profits safe from hacks & liquidations.',
    pitchTr: 'Kazançları borsadan çıkarın. Ledger soğuk cüzdan kârı hack ve tasfiyelerden korur.',
    ctaEn: 'Secure profits',
    ctaTr: 'Kârı güvene al',
    url: 'https://shop.ledger.com/?r=8c4e8e87cac7',
    icon: '🔐',
  },
  {
    id: 'tradingview',
    name: 'TradingView',
    pitchEn: 'Chart BTC on the same platform pros use. Set your stop and entry visually before you size the lot.',
    pitchTr: 'Profesyonellerin kullandığı platformda BTC grafiği. Lotu boyutlandırmadan önce stop ve girişi görsel olarak ayarla.',
    ctaEn: 'Get TradingView',
    ctaTr: 'TradingView\'ı Al',
    url: 'https://www.tradingview.com/?aff_id=166891&aff_sub=partners&utm_source=bitcoincalculator&utm_medium=referral&utm_campaign=lot_size_en',
    icon: '📈',
  },
  {
    id: 'redotpay',
    name: 'RedotPay',
    pitchEn: 'Cash out trading profits to a Visa card. Apple Pay & Google Pay. $5 bonus for new users.',
    pitchTr: 'Trade kârını Visa karta çek. Apple Pay & Google Pay. Yeni kullanıcılara $5 bonus.',
    ctaEn: 'Get $5 free',
    ctaTr: '$5 bonus al',
    url: 'https://wap.redotpay.com/en/invite/affiliates-1?utm_id=36rgik&utm_source=union&utm_uid=15980&utm_s=f29a110dc987f17ad366813652572664712174e0',
    icon: '💳',
  },
  {
    id: 'koinly',
    name: 'Koinly',
    pitchEn: 'Every trade is a tax event. Koinly auto-imports from Binance, Bybit, MT5 and generates the report.',
    pitchTr: 'Her işlem vergi olayıdır. Koinly Binance, Bybit, MT5\'ten otomatik içe aktarır ve raporu oluşturur.',
    ctaEn: 'File taxes',
    ctaTr: 'Vergi ver',
    url: 'https://koinly.io/?via=0481A637&utm_source=affiliate',
    icon: '🧾',
  },
];

export const LotSizeAffiliateCluster = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const clickIds = useMemo(() => Object.fromEntries(PARTNERS.map(p => [p.id, mintClickId()])), []);

  const handleClick = (id: string) => {
    logEvent({
      kind: 'click',
      affiliate_id: id,
      slug: 'lot-size',
      lang: tr ? 'tr' : 'en',
      segment: 'post-result',
      click_id: clickIds[id],
    });
  };

  return (
    <section className="container mx-auto px-6 pb-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <span className="inline-flex items-center px-3 py-1 rounded-full border border-border/60 bg-muted/40 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-4">
            {tr ? 'Trader Araçları' : 'Trader Toolkit'}
          </span>
          <h2 className="text-h2 font-semibold text-foreground max-w-2xl mx-auto [text-wrap:balance]">
            {tr ? 'Önerilen Araçlar' : 'Recommended Tools'}
          </h2>
          <p className="mt-3 text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            {tr ? 'Lot büyüklüğünü hesapladınız. Şimdi işlemi çalıştırın, koruyun ve raporlayın.' : "You've sized the trade. Now execute, secure, and report it."}
          </p>
          <div className="mt-4 flex justify-center">
            <AffiliateDisclosure lang={tr ? 'tr' : 'en'} />
          </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PARTNERS.map(p => {
            const href = appendUtm(p.url, {
              slug: 'lot-size',
              affiliateId: p.id,
              zone: 'post-result-cluster',
              creativeId: 'lot-size-trader-card',
              clickId: clickIds[p.id],
            });
            return (
              <a
                key={p.id}
                href={href}
                onClick={() => handleClick(p.id)}
                target="_blank"
                rel="noopener noreferrer nofollow sponsored"
                className="group rounded-xl border border-border/40 bg-card p-5 hover:border-primary/40 hover:bg-primary/[0.02] transition"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl" aria-hidden>{p.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground group-hover:text-primary">{p.name}</h3>
                      <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-medium px-1.5 py-0.5 rounded bg-muted/40">
                        {tr ? 'Sponsor' : 'Partner'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-snug mb-3">
                      {tr ? p.pitchTr : p.pitchEn}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                      {tr ? p.ctaTr : p.ctaEn}
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};
