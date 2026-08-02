import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { ToastAction } from '@/components/ui/toast';
import type { ToastActionElement } from '@/components/ui/toast';
import { downloadCsv, type DownloadCsvOptions, type DownloadCsvResult } from '@/utils/csvExport';
import { downloadBlob, type DownloadBlobResult } from '@/utils/downloadFile';
import React from 'react';

/**
 * Download UX wrapper: fires the download, confirms with a toast, and always
 * offers a manual fallback link in case the browser blocked the programmatic
 * click (common in in-app browsers and some Android WebViews).
 *
 * When the download fails outright we surface a destructive toast with a
 * Retry action, plus a direct fallback link whenever the blob URL survived.
 */
export const useFileDownload = () => {
  const { toast } = useToast();
  const { language } = useLanguage();
  const tr = language === 'tr';

  const fallbackLink = useCallback(
    (url: string, filename: string, label: string, altText: string) =>
      React.createElement(
        ToastAction,
        { altText, asChild: true },
        React.createElement('a', { href: url, download: filename }, label),
      ) as unknown as ToastActionElement,
    [],
  );

  const retryAction = useCallback(
    (retry: () => void) =>
      React.createElement(
        ToastAction,
        { altText: tr ? 'İndirmeyi tekrar dene' : 'Retry the download', onClick: retry },
        tr ? 'Tekrar dene' : 'Retry',
      ) as unknown as ToastActionElement,
    [tr],
  );

  const notifyFailure = useCallback(
    (filename: string, retry: () => void, url?: string) => {
      toast({
        variant: 'destructive',
        title: tr ? 'İndirme başlatılamadı' : "Download didn't start",
        description: url
          ? tr
            ? `${filename} — tekrar deneyin veya dosyayı doğrudan açın.`
            : `${filename} — retry, or open the file directly.`
          : tr
            ? `${filename} oluşturulamadı. Lütfen tekrar deneyin.`
            : `We couldn't generate ${filename}. Please try again.`,
        action: url
          ? fallbackLink(
              url,
              filename,
              tr ? 'Dosyayı aç' : 'Open file',
              tr ? 'İndirilen dosyayı doğrudan aç' : 'Open the generated file directly',
            )
          : retryAction(retry),
      });
    },
    [toast, tr, fallbackLink, retryAction],
  );

  const confirm = useCallback(
    (filename: string, result: DownloadBlobResult, retry: () => void) => {
      if (!result.ok) {
        notifyFailure(filename, retry, result.url || undefined);
        return;
      }
      toast({
        title: tr ? 'Dosyanız indiriliyor' : 'Your file is downloading',
        description: filename,
        action: fallbackLink(
          result.url,
          filename,
          tr ? 'Başlamadı mı?' : "Didn't start?",
          tr ? 'İndirme başlamadıysa buraya tıklayın' : "Click here if the download didn't start",
        ),
      });
    },
    [toast, tr, fallbackLink, notifyFailure],
  );

  /** CSV: build (BOM + preamble) → download → toast with fallback link. */
  const exportCsv = useCallback(
    (
      options: Omit<DownloadCsvOptions, 'meta'> & { meta: Omit<DownloadCsvOptions['meta'], 'language'> },
    ): DownloadCsvResult | null => {
      const run = (): DownloadCsvResult | null => {
        try {
          const result = downloadCsv({ ...options, meta: { ...options.meta, language } });
          confirm(result.filename, result, () => run());
          return result;
        } catch (err) {
          console.error('CSV export failed', err);
          notifyFailure(`${options.filename}.csv`, () => run());
          return null;
        }
      };
      return run();
    },
    [confirm, notifyFailure, language],
  );

  /** Any other blob (PDF, PNG) with the same confirmation + fallback. */
  const exportBlob = useCallback(
    (blob: Blob, filename: string): DownloadBlobResult | null => {
      const run = (): DownloadBlobResult | null => {
        try {
          const result = downloadBlob(blob, filename, { keepAliveForFallback: true });
          confirm(filename, result, () => run());
          return result;
        } catch (err) {
          console.error('File export failed', err);
          notifyFailure(filename, () => run());
          return null;
        }
      };
      return run();
    },
    [confirm, notifyFailure],
  );

  return { exportCsv, exportBlob };
};
