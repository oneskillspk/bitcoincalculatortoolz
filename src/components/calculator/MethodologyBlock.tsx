import { ShieldCheck, ExternalLink, FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export interface MethodologySource {
  label: string;
  url: string;
  publisher: string;
}

interface MethodologyBlockProps {
  methodology: string;
  sources: MethodologySource[];
  lastReviewed: string;
  reviewedBy?: string;
  reviewer?: string;
  disclaimer?: string;
  labels?: {
    title: string;
    howWeCalculate: string;
    primarySources: string;
    reviewedBy: string;
    lastUpdated: string;
    formulasOpen: string;
    disclaimer: string;
  };
}

export const MethodologyBlock = ({
  methodology,
  sources,
  lastReviewed,
  reviewedBy = 'Web3Believer & Webio',
  reviewer,
  disclaimer,
  labels,
}: MethodologyBlockProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const reviewerText = reviewer || reviewedBy;
  const formattedDate = new Intl.DateTimeFormat(tr ? 'tr-TR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(lastReviewed));

  const defaultLabels = {
    title: labels?.title ?? (tr ? 'Kaynaklar ve Metodoloji' : 'Sources & Methodology'),
    howWeCalculate: labels?.howWeCalculate ?? (tr ? 'Nasıl hesaplıyoruz' : 'How we calculate'),
    primarySources: labels?.primarySources ?? (tr ? 'Birincil kaynaklar' : 'Primary sources'),
    reviewedBy: labels?.reviewedBy ?? (tr ? 'İncelendi:' : 'Reviewed by'),
    lastUpdated: labels?.lastUpdated ?? (tr ? 'Son güncelleme' : 'Last updated'),
    formulasOpen: labels?.formulasOpen ?? (tr ? 'Tüm formüller açık ve yukarıda belgelenmiştir.' : 'All formulas are open and documented above.'),
    disclaimer: labels?.disclaimer ?? (tr ? 'Sorumluluk Reddi:' : 'Disclaimer:'),
  };

  return (
    <section
      className="max-w-5xl mx-auto my-10 sm:my-14"
      aria-labelledby="methodology-heading"
    >
      <div className="rounded-2xl border border-border/40 bg-card/50 p-5 sm:p-7">
        <div className="flex items-center gap-2.5 mb-4">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 border border-primary/20">
            <ShieldCheck className="w-3 h-3 text-primary" aria-hidden="true" />
          </span>
          <h2
            id="methodology-heading"
            className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
          >
            {defaultLabels.title}
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
          <div>
            <div className="flex items-center gap-1.5 mb-2 text-xs uppercase tracking-wider text-muted-foreground">
              <FileText className="w-3.5 h-3.5" aria-hidden="true" />
              {defaultLabels.howWeCalculate}
            </div>
            <p className="text-sm text-foreground/85 leading-relaxed max-w-prose">{methodology}</p>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
              {defaultLabels.primarySources}
            </div>
            <ul className="space-y-2">
              {sources.map((s) => (
                <li key={s.url} className="flex items-start gap-2 text-sm">
                  <ExternalLink
                    className="w-3.5 h-3.5 mt-1 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span className="leading-snug min-w-0">
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="text-primary font-medium underline underline-offset-2 decoration-primary/40 hover:decoration-primary hover:text-primary/80 transition-colors"
                    >
                      {s.label}
                    </a>
                    <span className="text-muted-foreground"> — {s.publisher}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-muted-foreground">
          <span>
            {defaultLabels.reviewedBy} <span className="text-foreground/80 font-medium">{reviewerText}</span> ·{' '}
            {defaultLabels.lastUpdated} <time dateTime={lastReviewed}>{formattedDate}</time>
          </span>
          <span className="text-muted-foreground/70">
            {defaultLabels.formulasOpen}
          </span>
        </div>

        {disclaimer && (
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground/70 border-t border-border/20 pt-3 max-w-prose">
            <span className="font-semibold text-muted-foreground">{defaultLabels.disclaimer}</span> {disclaimer}
          </p>
        )}
      </div>
    </section>
  );
};
