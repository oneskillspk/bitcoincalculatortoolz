/**
 * Canonical PNG snapshot helper. Wraps html2canvas with the project's paper
 * background by default so screenshots match the live light-theme UI (kills
 * the leftover `#0a0a0a` dark dumps from earlier per-calculator exporters).
 */
import { buildExportFilename, type ExportLanguage } from '@/utils/exportFilename';

export interface CaptureSnapshotOptions {
  /** CSS color for the rasterized background. Defaults to the paper token (#f5f3ee). */
  background?: string;
  scale?: number;
}

export const PAPER_BACKGROUND = '#f5f3ee';

export const captureSnapshot = async (
  target: HTMLElement,
  { background = PAPER_BACKGROUND, scale = 2 }: CaptureSnapshotOptions = {},
): Promise<HTMLCanvasElement> => {
  const { default: html2canvas } = await import('html2canvas');
  return html2canvas(target, {
    backgroundColor: background,
    scale,
    useCORS: true,
    allowTaint: true,
  });
};

export interface DownloadSnapshotOptions extends CaptureSnapshotOptions {
  filename: { en: string; tr: string };
  language: ExportLanguage;
  withDate?: boolean;
}

export const downloadSnapshot = async (
  target: HTMLElement,
  { filename, language, withDate, ...rest }: DownloadSnapshotOptions,
) => {
  const canvas = await captureSnapshot(target, rest);
  const link = document.createElement('a');
  link.download = buildExportFilename(filename, 'png', language, withDate === false ? { withDate: false } : undefined);
  link.href = canvas.toDataURL('image/png');
  link.click();
};
