import { Link } from "@/components/LocalizedLink";
import { ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LIVE_CALCULATOR_COUNT } from '@/config/siteStats';

interface ArticleAuthorBoxProps {
  /** When true, render Webio as co-author. Defaults to true to match the byline. */
  coAuthor?: boolean;
}

/**
 * Visible author bio block rendered at the bottom of every /learn (and
 * /tr/ogrenin) article. Fully localized — copy switches on the current
 * language context. Strengthens E-E-A-T so AI answer engines can attach a
 * real author entity to the citation.
 */
export const ArticleAuthorBox = ({ coAuthor = true }: ArticleAuthorBoxProps) => {
  const { t, language } = useLanguage();
  const tr = language === 'tr';

  const copy = tr
    ? {
        eyebrow: 'Yazan',
        bio: "2013'ten beri Bitcoin yatırımcısı ve self-custody savunucusu. bitcoincalculator.tools'u, kurumların kullandığı backtesting araçlarının aynısını herkese ücretsiz, kayıt ve takip olmadan sunmak için kurdu. Sitedeki her hesaplayıcı elle yazıldı, her formül belgelendi ve tüm veriler CoinGecko'nun doğrulanmış tarihsel kayıtlarından alındı.",
        stat1: "Bitcoin'de 13+ yıl",
        stat2: `${LIVE_CALCULATOR_COUNT} ücretsiz hesaplayıcı geliştirdi`,
        readBio: 'Tam biyografiyi oku',
      }
    : {
        eyebrow: 'Written by',
        bio: "Bitcoin investor since 2013 and self-custody advocate. Built bitcoincalculator.tools to give everyone the same backtesting tools institutions use — free, with no signup and no tracking. Every calculator on this site is hand-built, every formula is documented, and every data point is sourced from CoinGecko's verified historical record.",
        stat1: '13+ years in Bitcoin',
        stat2: `Built ${LIVE_CALCULATOR_COUNT} free calculators`,
        readBio: 'Read full bio',
      };

  return (
    <aside
      className="mt-14 pt-8 border-t border-border/20"
      aria-label={t('aria.aboutAuthor')}
      itemScope
      itemType="https://schema.org/Person"
    >
      <div className="rounded-2xl border border-border/30 bg-card/50 p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div
            aria-hidden="true"
            className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center"
          >
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
              {copy.eyebrow}
            </p>
            <h3 className="text-h3 font-semibold text-foreground">
              <Link
                to="/about"
                className="hover:text-primary transition-colors"
                itemProp="url"
              >
                <span itemProp="name">
                  Web3Believer{coAuthor ? ' & Webio' : ''}
                </span>
              </Link>
            </h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed" itemProp="description">
              {copy.bio}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span>{copy.stat1}</span>
              <span aria-hidden="true">·</span>
              <span>{copy.stat2}</span>
              <span aria-hidden="true">·</span>
              <Link to="/about" className="text-primary hover:text-primary/80 underline underline-offset-2">
                {copy.readBio}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
