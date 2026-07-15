import { useMemo } from 'react';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { appendUtm, mintClickId } from '@/lib/affiliateAI/utm';
import { logEvent } from '@/lib/affiliateAI/analyticsClient';
import { AffiliateDisclosure } from '@/components/affiliateAI/AffiliateDisclosure';

/**
 * Single-partner affiliate banner rendered directly above the
 * "Share & Export" report block. High-intent placement: the user
 * has just sized a trade and is about to save/share it.
 *
 * Kept as ONE partner (TradingView) so it reads as a native
 * pre-action recommendation, not a second affiliate cluster.
 */
const PARTNER = {
  id: 'tradingview-preexport',
  name: 'TradingView',
  url: 'https://www.tradingview.com/?aff_id=166891&aff_sub=partners&utm_source=bitcoincalculator&utm_medium=referral&utm_campaign=lot_size_preexport',
};

export const LotSizePreExportBanner = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const clickId = useMemo(() => mintClickId(), []);

  const href = appendUtm(PARTNER.url, {
    slug: 'lot-size',
    affiliateId: PARTNER.id,
    zone: 'pre-export-banner',
    creativeId: 'lot-size-pre-export',
    clickId,
  });

  const handleClick = () => {
    logEvent({
      kind: 'click',
      affiliate_id: PARTNER.id,
      slug: 'lot-size',
      lang: tr ? 'tr' : 'en',
      segment: 'pre-export',
      click_id: clickId,
    });
  };

  return (
    <aside
      aria-label={tr ? 'Sponsorlu öneri' : 'Sponsored recommendation'}
      className="mt-8 rounded-2xl border border-primary/25 bg-gradient-to-r from-primary/[0.06] via-primary/[0.03] to-transparent p-5 sm:p-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span
            aria-hidden
            className="shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 text-primary"
          >
            <TrendingUp className="w-5 h-5" />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="text-base sm:text-lg font-semibold text-foreground">
                {tr
                  ? 'İşlemi grafikte doğrula — TradingView ile'
                  : 'Chart the setup before you take it — on TradingView'}
              </h3>
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-medium px-1.5 py-0.5 rounded bg-muted/50">
                {tr ? 'Sponsor' : 'Partner'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed [text-wrap:pretty]">
              {tr
                ? 'Girişi, stopu ve hedefi profesyonellerin kullandığı grafiklerde işaretle — plan dışa aktarmaya hazır.'
                : 'Mark your entry, stop and target on the same charts pros use — then export the plan below.'}
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
          {tr ? 'TradingView\'ı ücretsiz dene' : 'Try TradingView free'}
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </aside>
  );
};

export default LotSizePreExportBanner;
