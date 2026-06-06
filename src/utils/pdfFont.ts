/**
 * Localized PDF font helper.
 *
 * jsPDF's default Helvetica is WinAnsi-encoded and cannot render Turkish
 * glyphs (ş ğ İ ı Ç ö ü). When language === 'tr' we lazy-load Noto Sans
 * (regular + bold) TTFs, register them with the pdf instance, and monkey-
 * patch setFont so existing callers like `pdf.setFont(undefined, 'bold')`
 * automatically switch to the Unicode-capable font.
 *
 * Fonts are fetched once and cached in module scope.
 */
import type jsPDF from 'jspdf';

const REGULAR_TTF = '/fonts/NotoSans-Regular.ttf';
const BOLD_TTF = '/fonts/NotoSans-Bold.ttf';

let cachedRegular: string | null = null;
let cachedBold: string | null = null;
let inflight: Promise<void> | null = null;

async function fetchAsBase64(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load font: ${url}`);
  const buf = await res.arrayBuffer();
  let binary = '';
  const bytes = new Uint8Array(buf);
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(
      null,
      Array.from(bytes.subarray(i, i + chunk)),
    );
  }
  return btoa(binary);
}

async function loadFonts(): Promise<void> {
  if (cachedRegular && cachedBold) return;
  if (inflight) return inflight;
  inflight = (async () => {
    const [reg, bold] = await Promise.all([
      fetchAsBase64(REGULAR_TTF),
      fetchAsBase64(BOLD_TTF),
    ]);
    cachedRegular = reg;
    cachedBold = bold;
  })();
  try {
    await inflight;
  } finally {
    inflight = null;
  }
}

/**
 * Register a Unicode font on the given pdf instance and route every
 * subsequent setFont call through it when language === 'tr'. Safe to call
 * multiple times. A no-op for non-Turkish languages.
 */
export async function applyLocalizedPdfFont(
  pdf: jsPDF,
  language: string | undefined,
): Promise<void> {
  if (language !== 'tr') return;
  try {
    await loadFonts();
    if (!cachedRegular || !cachedBold) return;

    pdf.addFileToVFS('NotoSans-Regular.ttf', cachedRegular);
    pdf.addFont('NotoSans-Regular.ttf', 'NotoSans', 'normal');
    pdf.addFileToVFS('NotoSans-Bold.ttf', cachedBold);
    pdf.addFont('NotoSans-Bold.ttf', 'NotoSans', 'bold');

    // Monkey-patch setFont so existing `pdf.setFont(undefined, 'bold'|'normal')`
    // calls automatically use NotoSans instead of Helvetica.
    const originalSetFont = pdf.setFont.bind(pdf);
    (pdf as unknown as { setFont: typeof pdf.setFont }).setFont = ((
      _name?: string,
      style?: string,
    ) => {
      const resolvedStyle = style === 'bold' ? 'bold' : 'normal';
      return originalSetFont('NotoSans', resolvedStyle);
    }) as typeof pdf.setFont;

    // Apply immediately
    originalSetFont('NotoSans', 'normal');
  } catch (err) {
    // Fall back silently to Helvetica – better than crashing the export.
    console.warn('applyLocalizedPdfFont: failed to load Noto Sans', err);
  }
}

/**
 * Helper: write a string into the pdf wrapping at `maxWidth`. Returns the
 * y-coordinate after the last written line so callers can advance their
 * cursor. Uses jsPDF's splitTextToSize so it works for any registered font.
 */
export function wrapPdfText(
  pdf: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight = 6,
  options?: { align?: 'left' | 'center' | 'right' },
): number {
  const lines: string[] = pdf.splitTextToSize(text, maxWidth);
  lines.forEach((line, idx) => {
    pdf.text(line, x, y + idx * lineHeight, options);
  });
  return y + lines.length * lineHeight;
}
