import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Share2, FileText, Image as ImageIcon, FileSpreadsheet, Link2, Check, Twitter, Linkedin, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { shareExportLabels, pickLabel, type ShareExportKind } from './labels';

/**
 * Single source of truth for every Share / Export UI in the app.
 *
 * Design contract (do NOT diverge):
 *   - Section padding:   py-6 sm:py-8
 *   - Card:              border-border/40 bg-card shadow-sm  (no glass-morphism, no bg-card/80)
 *   - Inner padding:     p-5 sm:p-6
 *   - Button row:        flex flex-wrap gap-2, all buttons size sm h-9
 *   - Eyebrow:           text-sm font-semibold + Share2 w-4 h-4 text-primary
 *   - Description:       text-xs text-muted-foreground
 *
 * Every per-calculator *ExportReport / *ShareCard component must compose this
 * primitive; do not hand-roll another Card wrapper.
 */

export interface ShareExportAction {
  kind: ShareExportKind;
  onClick: () => unknown | Promise<unknown>;
  /** Override the canonical label for this action (rare — only for variants like "PDF report (full)"). */
  label?: string;
  loading?: boolean;
  copied?: boolean;
  disabled?: boolean;
  /** Default 'default'. 'primary' uses the brand-tinted variant. */
  tone?: 'default' | 'primary';
}

export interface ShareExportPanelProps {
  title?: string;
  description?: string;
  actions: ShareExportAction[];
  /** 'card' (default) → full Card section. 'inline' → no Card/section, just the button row (for article footers, etc). */
  variant?: 'card' | 'inline';
  className?: string;
}

const iconFor = (kind: ShareExportKind, copied?: boolean) => {
  switch (kind) {
    case 'pdf':       return <FileText className="w-3.5 h-3.5" />;
    case 'png':       return <ImageIcon className="w-3.5 h-3.5" />;
    case 'csv':       return <FileSpreadsheet className="w-3.5 h-3.5" />;
    case 'copy-link': return copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Link2 className="w-3.5 h-3.5" />;
    case 'twitter':   return <Twitter className="w-3.5 h-3.5" />;
    case 'linkedin':  return <Linkedin className="w-3.5 h-3.5" />;
  }
};

const ShareExportButton: React.FC<ShareExportAction & { language: string }> = ({
  kind, onClick, label, loading, copied, disabled, tone = 'default', language,
}) => {
  const tr = language === 'tr';
  const resolved =
    label ??
    (copied
      ? pickLabel(shareExportLabels.copied, language)
      : pickLabel(shareExportLabels.actions[kind], language));

  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      size="sm"
      variant="outline"
      aria-label={resolved}
      title={resolved}
      data-copied={copied || undefined}
      className={cn(
        'inline-flex items-center justify-center gap-1.5',
        'h-9 px-3.5 rounded-lg text-xs font-medium shrink-0',
        'border-border/60 hover:border-primary/40 hover:bg-primary/5',
        'transition-colors',
        'disabled:opacity-100 disabled:cursor-default',
        'data-[copied=true]:border-primary/50 data-[copied=true]:bg-primary/5',
        tone === 'primary' && 'border-primary/50 bg-primary/5 text-foreground hover:bg-primary/10',
      )}
    >
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : iconFor(kind, copied)}
      <span className="truncate">{loading ? pickLabel(shareExportLabels.loading, language) : resolved}</span>
    </Button>
  );
};

export const ShareExportPanel: React.FC<ShareExportPanelProps> = ({
  title, description, actions, variant = 'card', className,
}) => {
  const { language } = useLanguage();
  const resolvedTitle = title ?? pickLabel(shareExportLabels.eyebrow, language);
  const resolvedDesc = description ?? pickLabel(shareExportLabels.description, language);

  const buttonRow = (
    <div className="flex flex-wrap gap-2 sm:justify-end">
      {actions.map((action, i) => (
        <ShareExportButton key={`${action.kind}-${i}`} {...action} language={language} />
      ))}
    </div>
  );

  if (variant === 'inline') {
    return (
      <div className={cn('flex items-center gap-2', className)} data-share-export-panel="inline">
        {buttonRow}
      </div>
    );
  }

  return (
    <section className={cn('py-6 sm:py-8', className)} data-share-export-panel="card">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <Card className="border-border/40 bg-card shadow-sm">
          <CardContent className="p-5 sm:p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Share2 className="w-4 h-4 text-primary" aria-hidden />
                {resolvedTitle}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-xl">{resolvedDesc}</p>
            </div>
            {buttonRow}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

ShareExportPanel.displayName = 'ShareExportPanel';
