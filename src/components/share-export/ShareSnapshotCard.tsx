import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { buildExportFilename, type ExportLanguage } from '@/utils/exportFilename';
import { ShareExportPanel, type ShareExportAction } from './ShareExportPanel';
import {
  drawShareCard,
  SHARE_CARD_WIDTH,
  SHARE_CARD_HEIGHT,
  type ShareCardPayload,
} from './exporters/shareImageCanvas';

/**
 * Round 3 of the 2026-06 launch audit: one component for every
 * "share a 1280×720 PNG of my result" surface. Builds a fresh canvas from a
 * typed `ShareCardPayload`, renders a live preview, and exposes the canonical
 * share / download / copy actions through `ShareExportPanel`.
 *
 * Per-calculator wrappers just translate their domain result into the payload
 * shape — they no longer paint pixels themselves.
 */
export interface ShareSnapshotCardProps {
  payload: ShareCardPayload;
  /** Localized export filename root, e.g. `{ en: 'bitcoin-what-if', tr: 'bitcoin-ya-olsaydi' }`. */
  filename: { en: string; tr: string };
  /** Plain text to copy / accompany the PNG when the native share sheet opens. */
  shareText: string;
  /** Title for the native share sheet. */
  shareTitle: string;
  /** Card eyebrow + description override (defaults to "Share snapshot"). */
  title?: { en: string; tr: string };
  description?: { en: string; tr: string };
  /** Extra actions appended to the button row (e.g. a CSV export). */
  extraActions?: ShareExportAction[];
}

const SHARE_DEFAULTS = {
  title: { en: 'Share snapshot', tr: 'Anlık görüntüyü paylaş' },
  description: {
    en: 'Generates a branded 1280×720 PNG you can drop into X, LinkedIn, or any chat.',
    tr: "X, LinkedIn veya sohbetlere bırakabileceğin markalı 1280×720 PNG oluşturur.",
  },
} as const;

const pickLang = (pair: { en: string; tr: string }, lang: ExportLanguage) =>
  lang === 'tr' ? pair.tr : pair.en;

export const ShareSnapshotCard: React.FC<ShareSnapshotCardProps> = ({
  payload, filename, shareText, shareTitle, title, description, extraActions,
}) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const [textCopied, setTextCopied] = useState(false);
  const [busy, setBusy] = useState<'share' | 'png' | null>(null);

  useEffect(() => {
    if (canvasRef.current) drawShareCard(canvasRef.current, payload);
  }, [payload]);

  const fileBase = pickLang(filename, language as ExportLanguage);

  const buildBlob = useCallback(
    () =>
      new Promise<Blob | null>((resolve) => {
        const canvas = document.createElement('canvas');
        drawShareCard(canvas, payload);
        canvas.toBlob((b) => resolve(b), 'image/png');
      }),
    [payload],
  );

  const handleDownload = useCallback(async () => {
    setBusy('png');
    try {
      const blob = await buildBlob();
      const name = buildExportFilename(filename, 'png', language as ExportLanguage);
      if (!blob) {
        // canvas.toBlob can return null (memory pressure, tainted canvas).
        // Never fail silently — the user pressed a download button.
        toast({
          variant: 'destructive',
          title: tr ? 'Görsel oluşturulamadı' : "Couldn't generate the image",
          description: tr ? 'Lütfen tekrar deneyin.' : 'Please try again.',
        });
        return;
      }
      // Shared helper: appends the anchor to the DOM (required by iOS Safari
      // and Android WebViews), keeps the object URL alive for the fallback
      // link, and reports blocked downloads instead of swallowing them.
      exportBlob(blob, name);
    } finally {
      setBusy(null);
    }
  }, [buildBlob, filename, language, exportBlob, toast, tr]);

  const handleShare = useCallback(async () => {
    setBusy('share');
    try {
      const blob = await buildBlob();
      if (!blob) return;
      const file = new File([blob], `${fileBase}.png`, { type: 'image/png' });
      const navAny = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
      if (navAny.share && navAny.canShare?.({ files: [file] })) {
        try {
          await navAny.share({ files: [file], title: shareTitle, text: shareText });
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          return;
        } catch {
          // user cancelled — fall through to download
        }
      }
      await handleDownload();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } finally {
      setBusy(null);
    }
  }, [buildBlob, fileBase, handleDownload, shareText, shareTitle]);

  const handleCopyText = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setTextCopied(true);
      setTimeout(() => setTextCopied(false), 2000);
      toast({
        title: tr ? 'Paylaşım metni kopyalandı' : 'Share text copied',
        description: tr ? 'Yapıştırarak paylaşabilirsiniz.' : 'Paste it into your post.',
      });
    } catch {
      toast({
        title: tr ? 'Kopyalanamadı' : 'Copy failed',
        description: tr ? 'Lütfen manuel olarak seçip kopyalayın.' : 'Select the text manually and copy it.',
        variant: 'destructive',
      });
    }
  }, [shareText, toast, tr]);

  const resolvedTitle = pickLang(title ?? SHARE_DEFAULTS.title, language as ExportLanguage);
  const resolvedDescription = pickLang(description ?? SHARE_DEFAULTS.description, language as ExportLanguage);

  return (
    <Card className="border-border/40 bg-card shadow-sm">
      <CardContent className="p-5 sm:p-6 space-y-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <ImageIcon className="w-5 h-5 text-primary" aria-hidden />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-foreground">{resolvedTitle}</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-xl">{resolvedDescription}</p>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden bg-background ring-1 ring-border/60">
          <canvas
            ref={canvasRef}
            className="w-full h-auto block"
            style={{ aspectRatio: `${SHARE_CARD_WIDTH} / ${SHARE_CARD_HEIGHT}` }}
            aria-label={tr ? 'Paylaşılabilir sonuç anlık görüntüsü' : 'Shareable result snapshot'}
          />
        </div>

        <ShareExportPanel
          variant="inline"
          actions={[
            { kind: 'png', onClick: handleShare, loading: busy === 'share', copied, tone: 'primary' },
            { kind: 'png', onClick: handleDownload, label: tr ? 'PNG indir' : 'Download PNG', loading: busy === 'png' },
            { kind: 'copy-link', onClick: handleCopyText, copied: textCopied, label: tr ? 'Metni kopyala' : 'Copy text' },
            ...(extraActions ?? []),
          ]}
        />
      </CardContent>
    </Card>
  );
};

ShareSnapshotCard.displayName = 'ShareSnapshotCard';
