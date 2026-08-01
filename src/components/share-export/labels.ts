// Canonical TR/EN labels for every share / export surface.
// Edit here once — applied everywhere via ShareExportPanel.

export type ShareExportKind = 'pdf' | 'png' | 'csv' | 'copy-link' | 'twitter' | 'linkedin';

export const shareExportLabels = {
  eyebrow: { en: 'Share & export', tr: 'Paylaş ve dışa aktar' },
  description: {
    en: 'Save this result, share a prefilled link, or hand off the report.',
    tr: 'Bu sonucu kaydet, önceden doldurulmuş bağlantıyı paylaş veya raporu ilet.',
  },
  actions: {
    // Labels always name the file type explicitly — never an icon alone.
    pdf:          { en: 'Download PDF',   tr: 'PDF indir' },
    png:          { en: 'Download PNG',   tr: 'PNG indir' },
    csv:          { en: 'Download CSV',   tr: 'CSV indir' },
    'copy-link':  { en: 'Copy link',      tr: 'Bağlantıyı kopyala' },
    twitter:      { en: 'Share on X',     tr: "X'te paylaş" },
    linkedin:     { en: 'Share on LinkedIn', tr: "LinkedIn'de paylaş" },
  } satisfies Record<ShareExportKind, { en: string; tr: string }>,
  loading: { en: 'Preparing…', tr: 'Hazırlanıyor…' },
  copied: { en: 'Copied!', tr: 'Kopyalandı!' },
} as const;

export const pickLabel = (
  pair: { en: string; tr: string },
  language: string,
) => (language === 'tr' ? pair.tr : pair.en);
