/**
 * Sweep regression: across every format used by SmartZone placements
 * (Zone1 image-banner, Zone2 two-card-strip / single-card, Zone3 inline-cta,
 * Zone4 image-banner, Zone5 sidebar-widget / image-banner, plus HtmlBanner),
 * a single click must produce exactly one logEvent("click") — even after
 * the orchestrator forces several re-renders.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";

const logEvent = vi.fn();
vi.mock("@/lib/affiliateAI/analyticsClient", () => ({
  logEvent: (...args: unknown[]) => logEvent(...args),
}));

// Stub the disclosure (renders fine in jsdom but irrelevant here).
vi.mock("@/components/affiliateAI/AffiliateDisclosure", () => ({
  AffiliateDisclosure: () => null,
}));

// Force a deterministic creative for ImageBanner formats.
vi.mock("@/lib/affiliateAI/creativePicker", () => ({
  pickCreative: () => ({
    size: "728x90",
    width: 728,
    height: 90,
    image_url: "https://cdn.example.com/banner.png",
    image_url_2x: null,
    landing_url: "https://example.com/aff?creative=1",
    alt: "Sponsor",
    responsive_group: "g1",
  }),
  pickResponsiveSet: () => [],
}));

const program = {
  id: "test-aff",
  name: "TestAff",
  enabled: true,
  url_en: "https://example.com/aff",
  url_tr: "https://example.com/aff",
  cta_en: "Sign up",
  cta_tr: "Kayıt",
  description_en: "desc",
  description_tr: "desc",
  badge_en: null,
  badge_tr: null,
  logo_color: null,
  creative_html:
    `<a href="https://example.com/aff" data-testid="html-anchor">Go</a>`,
  creatives: [],
} as any;

const items = [
  {
    program,
    url: "https://example.com/aff",
    cta: "Sign up",
    description: "desc",
    badge: null,
    effectiveLang: "en",
  },
  {
    program: { ...program, id: "test-aff-2", name: "TestAff2" },
    url: "https://example.com/aff2",
    cta: "Sign up",
    description: "desc",
    badge: null,
    effectiveLang: "en",
  },
];

vi.mock("@/hooks/useAffiliateAI", () => ({
  useAffiliateAI: (opts: any) => ({
    decision: {
      affiliate_ids: ["test-aff", "test-aff-2"],
      format: opts?.forceFormat ?? "two-card-strip",
      zone: "post-result",
      segment: "default",
    },
    items,
    hidden: false,
    shadow: false,
    loading: false,
  }),
}));

import { AffiliatePlacement } from "@/components/affiliateAI/AffiliatePlacement";

const FORMATS: Array<{
  label: string;
  format: any;
  anchorSelector: string;
}> = [
  { label: "Zone1 image-banner", format: "image-banner", anchorSelector: 'a[aria-label="Sponsor"]' },
  { label: "Zone2 single-card",  format: "single-card",  anchorSelector: "a" },
  { label: "Zone2 two-card-strip", format: "two-card-strip", anchorSelector: "a" },
  { label: "Zone3 inline-cta",   format: "inline-cta",   anchorSelector: "a" },
  { label: "Zone5 sidebar-widget", format: "sidebar-widget", anchorSelector: "a" },
  { label: "comparison",         format: "comparison",   anchorSelector: "a" },
  { label: "html-banner",        format: "html-banner",  anchorSelector: 'a[data-testid="html-anchor"]' },
];

describe("SmartZone banner click logging — one click ⇒ one log", () => {
  beforeEach(() => logEvent.mockClear());

  it.each(FORMATS)("$label fires exactly one click event", ({ format, anchorSelector }) => {
    const { container, rerender } = render(
      <AffiliatePlacement slug="test" lang="en" forceAffiliateId="test-aff" forceFormat={format} />
    );

    // Simulate 5 orchestrator-driven re-renders before the click.
    for (let i = 0; i < 5; i++) {
      rerender(
        <AffiliatePlacement slug="test" lang="en" forceAffiliateId="test-aff" forceFormat={format} />
      );
    }

    logEvent.mockClear(); // ignore impression logs
    const anchor = container.querySelector(anchorSelector);
    expect(anchor, `no anchor for ${format}`).not.toBeNull();
    fireEvent.click(anchor!);

    const clicks = logEvent.mock.calls.filter(
      (c) => (c[0] as any)?.kind === "click"
    );
    expect(clicks).toHaveLength(1);
  });
});
