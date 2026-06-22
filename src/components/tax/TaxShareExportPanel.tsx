import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
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

  // Build a low-cost preview thumbnail (1280×720 painted offscreen, then
  // shrunk with CSS) so users see exactly what the PNG export will look like.
  const payload = useMemo(buildPayload, [region, isTr, url]);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  useEffect(() => {
    try {
      const canvas = createShareCardCanvas(payload);
      setPreviewSrc(canvas.toDataURL("image/png"));
    } catch {
      setPreviewSrc(null);
    }
  }, [payload]);

  const onPrint = () => window.print();

  const tw = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;
  const li = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  return (
    <section
      data-share-export-panel
      aria-label={isTr ? "Paylaş ve dışa aktar" : "Share & export"}
      className="container mx-auto max-w-4xl px-6 py-8 print:hidden"
    >
      {previewSrc ? (
        <figure className="mb-4 overflow-hidden rounded-xl border border-border/60 bg-muted/30">
          <img
            src={previewSrc}
            alt={
              isTr
                ? "Paylaşılacak kartın önizlemesi"
                : "Preview of the share card to be exported"
            }
            width={1280}
            height={720}
            loading="lazy"
            className="block h-auto w-full"
          />
          <figcaption className="border-t border-border/60 bg-card/60 px-4 py-2 text-xs text-muted-foreground">
            {isTr
              ? "PNG / sosyal paylaşımda görünecek önizleme"
              : "Preview shown in PNG export and social shares"}
          </figcaption>
        </figure>
      ) : null}

      <ShareExportPanel
        title={isTr ? "Sonucu paylaş veya dışa aktar" : "Share or export this estimate"}
        description={
          isTr
            ? "PNG kartı indirin, PDF özet alın, yazdırın veya bağlantıyı paylaşın."
            : "Download a PNG card, get the PDF summary, print, or share the link."
        }
        actions={[
          { kind: "png", onClick: onPng, loading: pngLoading, tone: "primary" },
          { kind: "pdf", onClick: onPdf, loading: pdfLoading },
          { kind: "copy-link", onClick: onCopy, copied },
          { kind: "twitter", onClick: () => window.open(tw, "_blank", "noopener") },
          { kind: "linkedin", onClick: () => window.open(li, "_blank", "noopener") },
        ]}
      />

      <div className="mt-3 flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onPrint}
          className="h-9 gap-1.5"
        >
          <Printer className="h-3.5 w-3.5" aria-hidden />
          {isTr ? "Yazdır" : "Print"}
        </Button>
      </div>
    </section>
  );
};

export default TaxShareExportPanel;
