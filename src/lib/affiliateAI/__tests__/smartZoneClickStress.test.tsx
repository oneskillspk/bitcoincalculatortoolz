/**
 * Stress test: hammer the AffiliatePlacement with rapid re-renders
 * (simulating orchestrator timeOnPage/scrollDepth ticks at 60 fps for
 * 1 second) and confirm a single user click still logs exactly once.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, act } from "@testing-library/react";

const logEvent = vi.fn();
vi.mock("@/lib/affiliateAI/analyticsClient", () => ({
  logEvent: (...args: unknown[]) => logEvent(...args),
}));
vi.mock("@/components/affiliateAI/AffiliateDisclosure", () => ({
  AffiliateDisclosure: () => null,
}));
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
  id: "stress-aff",
  name: "Stress",
  enabled: true,
  url_en: "https://example.com/aff",
  url_tr: "https://example.com/aff",
  cta_en: "Go",
  cta_tr: "Git",
  description_en: "d",
  description_tr: "d",
  badge_en: null,
  badge_tr: null,
  logo_color: null,
  creative_html: `<a href="https://example.com/aff">Go</a>`,
  creatives: [],
} as any;

vi.mock("@/hooks/useAffiliateAI", () => ({
  useAffiliateAI: (opts: any) => ({
    decision: {
      affiliate_ids: ["stress-aff"],
      format: opts?.forceFormat ?? "image-banner",
      zone: "post-result",
      segment: "default",
    },
    items: [
      {
        program,
        url: "https://example.com/aff",
        cta: "Go",
        description: "d",
        badge: null,
        effectiveLang: "en",
      },
    ],
    hidden: false,
    shadow: false,
    loading: false,
  }),
}));

import { AffiliatePlacement } from "@/components/affiliateAI/AffiliatePlacement";

const FORMATS = [
  "image-banner",
  "single-card",
  "inline-cta",
  "html-banner",
] as const;

describe("AffiliatePlacement stress — 60 re-renders + click ⇒ one log", () => {
  beforeEach(() => logEvent.mockClear());

  it.each(FORMATS)("%s survives rapid re-renders", (format) => {
    const Tree = ({ tick }: { tick: number }) => (
      <AffiliatePlacement
        slug={`s-${tick % 2}`}
        lang="en"
        forceAffiliateId="stress-aff"
        forceFormat={format as any}
      />
    );
    const { container, rerender } = render(<Tree tick={0} />);

    // 60 ticks ≈ 1s at 60fps
    act(() => {
      for (let i = 1; i <= 60; i++) rerender(<Tree tick={i} />);
    });

    logEvent.mockClear();
    const anchor = container.querySelector("a");
    expect(anchor).not.toBeNull();
    fireEvent.click(anchor!);

    const clicks = logEvent.mock.calls.filter(
      (c) => (c[0] as any)?.kind === "click"
    );
    expect(clicks).toHaveLength(1);
  });
});
