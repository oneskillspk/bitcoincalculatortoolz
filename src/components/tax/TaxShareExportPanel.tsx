import { useState } from "react";
import {
  ShareExportPanel,
  createShareCardCanvas,
  downloadStandardPdf,
  type ShareCardPayload,
} from "@/components/share-export";
import { REGION_META, type RegionId } from "./regionMeta";

interface Props {
  region: RegionId;
  isTr: boolean;
  url: string;
}

/**
 * Single consolidated share+export surface for regional tax pages.
 * Follows `src/components/share-export/README.md` — one panel per page,
 * PNG via `drawShareCard`, PDF via `downloadStandardPdf`.
 */
export const TaxShareExportPanel = ({ region, isTr, url }: Props) => {
  const m = REGION_META[region];
  const pick = <T,>(o: { en: T; tr: T }): T => (isTr ? o.tr : o.en);
  const [pngLoading, setPngLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const heading = pick(m.heading);
  const highlight = pick(m.highlight);
  const chips = pick(m.chips);
  const title = `${heading} — ${highlight}`;
  const shareText = isTr
    ? `${title} · ${chips.join(" · ")} — bitcoincalculator.tools`
    : `${title} · ${chips.join(" · ")} — bitcoincalculator.tools`;

  const buildPayload = (): ShareCardPayload => ({
    calculatorLabel: pick(m.authority),
    eyebrow: `${m.flag}  ${highlight}`,
    headline: heading,
    headlineValue: chips[0],
    headlineTone: "ember",
    subline: pick(m.subtitle).split(".")[0] + ".",
    stats: chips.slice(1, 4).map((c) => ({
      label: isTr ? "Kural" : "Rule",
      value: c,
    })),
    footerLeft: url.replace(/^https?:\/\//, ""),
    footerRight: new Date().toLocaleDateString(isTr ? "tr-TR" : "en-US"),
  });

  const onPng = async () => {
    setPngLoading(true);
    try {
      const canvas = createShareCardCanvas(buildPayload());
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `bitcoin-tax-${region}-${isTr ? "tr" : "en"}.png`;
      a.click();
    } finally {
      setPngLoading(false);
    }
  };

  const onPdf = async () => {
    setPdfLoading(true);
    try {
      await downloadStandardPdf({
        title,
        language: isTr ? "tr" : "en",
        filename: {
          en: `bitcoin-tax-${region}-summary`,
          tr: `bitcoin-vergi-${region}-ozet`,
        },
        canonicalUrl: url,
        headline: { label: isTr ? "Yetki" : "Authority", value: pick(m.authority) },
        sections: [
          {
            heading: isTr ? "Temel kurallar" : "Headline rules",
            rows: chips.map(
              (c, i) => [`${isTr ? "Kural" : "Rule"} ${i + 1}`, c] as [string, string],
            ),
          },
          {
            heading: isTr ? "Nasıl hesaplıyoruz" : "How we calculate",
            rows: (isTr ? m.methodology.tr : m.methodology.en).map(
              (s, i) => [`${i + 1}.`, s] as [string, string],
            ),
          },
          {
            heading: isTr ? "Kaynaklar" : "Sources",
            rows: m.sources.map((s) => [s.label, s.url] as [string, string]),
          },
        ],
      });
    } finally {
      setPdfLoading(false);
    }
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  const tw = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;
  const li = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  return (
    <section
      data-share-export-panel
      aria-label={isTr ? "Paylaş ve dışa aktar" : "Share & export"}
      className="container mx-auto max-w-4xl px-6 py-8"
    >
      <ShareExportPanel
        title={isTr ? "Sonucu paylaş veya dışa aktar" : "Share or export this estimate"}
        description={
          isTr
            ? "PNG kartı indirin, PDF özet alın veya bağlantıyı paylaşın."
            : "Download a PNG card, get the PDF summary, or share the link."
        }
        actions={[
          { kind: "png", onClick: onPng, loading: pngLoading, tone: "primary" },
          { kind: "pdf", onClick: onPdf, loading: pdfLoading },
          { kind: "copy-link", onClick: onCopy, copied },
          { kind: "twitter", onClick: () => window.open(tw, "_blank", "noopener") },
          { kind: "linkedin", onClick: () => window.open(li, "_blank", "noopener") },
        ]}
      />
    </section>
  );
};

export default TaxShareExportPanel;
