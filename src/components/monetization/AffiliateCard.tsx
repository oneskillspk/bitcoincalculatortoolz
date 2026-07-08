import { useMemo } from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import type { AffiliatePartner } from '@/config/affiliates';
import { appendUtm, mintClickId } from '@/lib/affiliateAI/utm';
import { logEvent } from '@/lib/affiliateAI/analyticsClient';

interface AffiliateCardProps {
  partner: AffiliatePartner;
  compact?: boolean;
  /** Page slug used for UTM attribution (defaults to 'recommended-tools'). */
  slug?: string;
}

export const AffiliateCard = ({
  partner,
  compact = false,
  slug = 'recommended-tools',
}: AffiliateCardProps) => {
  const clickId = useMemo(() => mintClickId(), [partner.id, slug]);
  const trackedHref = appendUtm(partner.url, {
    slug,
    affiliateId: partner.id,
    zone: 'sidebar',
    creativeId: 'recommended-card',
    clickId,
  });
  const handleClick = () => {
    logEvent({
      kind: 'click',
      affiliate_id: partner.id,
      slug,
      lang: typeof window !== 'undefined' && window.location.pathname.startsWith('/tr') ? 'tr' : 'en',
      segment: 'default',
      click_id: clickId,
    });
  };
  return (
    <a
      href={trackedHref}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer nofollow sponsored"
      className="group block rounded-xl border border-border/30 bg-card p-4 hover:border-primary/30 hover:bg-primary/[0.02] transition-all duration-200"
    >
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0 mt-0.5" role="img" aria-label={partner.name}>
          {partner.icon}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
              {partner.name}
            </h4>
            <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-medium px-1.5 py-0.5 rounded bg-muted/40 flex-shrink-0">
              Partner
            </span>
          </div>
          {!compact && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {partner.description}
            </p>
          )}
        </div>
        <div className="flex-shrink-0 flex items-center gap-1 text-xs font-medium text-primary opacity-70 group-hover:opacity-100 transition-opacity mt-0.5">
          <span className="hidden sm:inline">{partner.cta}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </a>
  );
};
