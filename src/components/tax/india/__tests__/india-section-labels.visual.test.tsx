/**
 * Visual regression tests for Section 115BBH / Section 194S label rendering.
 *
 * These guard against the specific class of bugs we shipped and had to hot-fix:
 *   - The `§` glyph rendering as tofu / broken box on Android / Windows fonts
 *   - Mojibake sequences from double-encoded UTF-8 ("Â§", "�", U+FFFD)
 *   - Labels getting split across whitespace or line breaks
 *     ("Section 115 BBH", "115BBH tax + ces s", "194 S", etc.)
 *   - Labels going missing entirely from a section (e.g. TDS panel losing its
 *     "Section 194S" attribution after a copy edit)
 *
 * We render every India-page component that mentions these sections and
 * scan the resulting DOM textContent as a single string. jsdom is enough
 * here — we're checking *what characters make it into the tree*, which is
 * exactly what a screenshot diff would flag.
 */
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { IndiaGlanceStrip } from "@/components/tax/india/IndiaGlanceStrip";
import { IndiaTDSReclaimPanel } from "@/components/tax/india/IndiaTDSReclaimPanel";
import { IndiaTaxCompositionChart } from "@/components/tax/india/IndiaTaxCompositionChart";
import { IndiaScheduleVDAPreview } from "@/components/tax/india/IndiaScheduleVDAPreview";

const renderIn = (ui: React.ReactElement) =>
  render(
    <HelmetProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </HelmetProvider>,
  );

/** Collapse whitespace so we can spot split labels like "115 BBH". */
const flatText = (el: HTMLElement) =>
  (el.textContent ?? "").replace(/\s+/g, " ").trim();

/** Every India component that renders 115BBH or 194S copy. */
const indiaSurfaces = [
  { name: "IndiaGlanceStrip", ui: <IndiaGlanceStrip isTr={false} /> },
  { name: "IndiaGlanceStrip (TR)", ui: <IndiaGlanceStrip isTr /> },
  { name: "IndiaTDSReclaimPanel", ui: <IndiaTDSReclaimPanel isTr={false} /> },
  { name: "IndiaTDSReclaimPanel (TR)", ui: <IndiaTDSReclaimPanel isTr /> },
  { name: "IndiaTaxCompositionChart", ui: <IndiaTaxCompositionChart isTr={false} /> },
  { name: "IndiaTaxCompositionChart (TR)", ui: <IndiaTaxCompositionChart isTr /> },
  { name: "IndiaScheduleVDAPreview", ui: <IndiaScheduleVDAPreview isTr={false} /> },
] as const;

describe("India tax page — Section 115BBH / 194S visual regression", () => {
  describe.each(indiaSurfaces)("$name", ({ ui }) => {
    it("never renders a raw '§' glyph (font-fallback tofu risk)", () => {
      const { container } = renderIn(ui);
      expect(flatText(container)).not.toMatch(/§/);
    });

    it("never renders mojibake or replacement characters", () => {
      const { container } = renderIn(ui);
      const text = flatText(container);
      // U+FFFD replacement char, common double-encoded UTF-8 prefixes.
      expect(text).not.toMatch(/\uFFFD/);
      expect(text).not.toMatch(/Â§|Ã‚Â§|â€/);
    });

    it("never splits '115BBH' or '194S' across whitespace", () => {
      const { container } = renderIn(ui);
      const text = flatText(container);
      // If the token appears at all, its digits and letters must stay glued.
      if (/115/.test(text)) {
        expect(text).not.toMatch(/115\s+BBH/);
        expect(text).not.toMatch(/115B\s+BH/);
      }
      if (/194/.test(text)) {
        expect(text).not.toMatch(/194\s+S\b/);
      }
    });
  });

  it("IndiaGlanceStrip keeps the Section 115BBH heading", () => {
    const { container } = renderIn(<IndiaGlanceStrip isTr={false} />);
    expect(flatText(container)).toMatch(/Section 115BBH/);
  });

  it("IndiaTDSReclaimPanel keeps the Section 194S attribution and 115BBH liability label", () => {
    const { container } = renderIn(<IndiaTDSReclaimPanel isTr={false} />);
    const text = flatText(container);
    expect(text).toMatch(/Section 194S/);
    expect(text).toMatch(/115BBH/);
  });

  it("IndiaTaxCompositionChart mentions Section 115BBH in its explainer", () => {
    const { container } = renderIn(<IndiaTaxCompositionChart isTr={false} />);
    expect(flatText(container)).toMatch(/Section 115BBH/);
  });

  it("Turkish surfaces use '115BBH Bölümü' phrasing, never a bare '§'", () => {
    const { container } = renderIn(<IndiaGlanceStrip isTr />);
    const text = flatText(container);
    expect(text).toMatch(/115BBH Bölümü/);
    expect(text).not.toMatch(/§/);
  });
});
