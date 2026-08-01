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
 */
export const useFileDownload = () => {
  const { toast } = useToast();
  const { language } = useLanguage();
  const tr = language === 'tr';

  const confirm = useCallback(
    (filename: string, result: DownloadBlobResult) => {
      toast({
        title: tr ? 'Dosyanız indiriliyor' : 'Your file is downloading',
        description: filename,
        action: React.createElement(
          ToastAction,
          {
            altText: tr ? 'İndirme başlamadıysa buraya tıklayın' : "Click here if the download didn't start",
            asChild: true,
          },
          React.createElement(
            'a',
            { href: result.url, download: filename },
            tr ? 'Başlamadı mı?' : "Didn't start?",
          ),
        ) as unknown as ToastActionElement,
      });
    },
    [toast, tr],
  );

  /** CSV: build (BOM + preamble) → download → toast with fallback link. */
  const exportCsv = useCallback(
    (options: Omit<DownloadCsvOptions, 'meta'> & { meta: Omit<DownloadCsvOptions['meta'], 'language'> }): DownloadCsvResult => {
      const result = downloadCsv({
        ...options,
        meta: { ...options.meta, language },
      });
      confirm(result.filename, result);
      return result;
    },
    [confirm, language],
  );

  /** Any other blob (PDF, PNG) with the same confirmation + fallback. */
  const exportBlob = useCallback(
    (blob: Blob, filename: string) => {
      const result = downloadBlob(blob, filename, { keepAliveForFallback: true });
      confirm(filename, result);
      return result;
    },
    [confirm],
  );

  return { exportCsv, exportBlob };
};
