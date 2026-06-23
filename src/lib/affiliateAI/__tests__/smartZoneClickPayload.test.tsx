/**
 * Payload regression: each banner click must
 *   (a) log exactly one `click` event,
 *   (b) carry the page slug + affiliate id in the analytics payload,
 *   (c) navigate to a href that includes the destination URL and the
 *       zone (utm_content) from the placement.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";

const logEvent = vi.fn();
vi.mock("@/lib/affiliateAI/analyticsClient", () => ({
  logEvent: (...args: unknown[]) => logEvent(...args),
}));
vi.mock("@/components/affiliateAI/AffiliateDisclosure", () => ({
  AffiliateDisclosure: () => null,
}));

const CREATIVE_LANDING = "https://example.com/aff?creative=banner1";
vi.mock("@/lib/affiliateAI/creativePicker", () => ({
  pickCreative: () => ({
    size: "728x90",
    width: 728,
    height: 90,
    image_url: "https://cdn.example.com/banner.png",
    image_url_2x: null,
    landing_url: CREATIVE_LANDING,
    alt: "Sponsor",
    responsive_group: "g1",
  }),
  pickResponsiveSet: () => [],
}));

const PROGRAM_URL = "https://example.com/aff?ref=card";
const program = {
  id: "payload-aff",
  name: "PayloadAff",
  enabled: true,
  url_en: PROGRAM_URL,
  url_tr: PROGRAM_URL,
  cta_en: "Go",
  cta_tr: "Git",
  description_en: "d",
  description_tr: "d",
  badge_en: null,
  badge_tr: null,
  logo_color: null,
  creative_html: `<a href="${PROGRAM_URL}">Go</a>`,
  creatives: [],
} as any;

vi.mock("@/hooks/useAffiliateAI", () => ({
  useAffiliateAI: (opts: any) => ({
    decision: {
      affiliate_ids: ["payload-aff"],
      format: opts?.forceFormat ?? "single-card",
      zone: "post-result",
      segment: "default",
    },
    items: [
      {
        program,
        url: PROGRAM_URL,
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

const SLUG = "power-law";

interface Case {
  label: string;
  format: any;
  expectedHrefHost: string; // destination URL prefix
}

const CASES: Case[] = [
  { label: "image-banner", format: "image-banner", expectedHrefHost: CREATIVE_LANDING },
  { label: "single-card",  format: "single-card",  expectedHrefHost: PROGRAM_URL },
  { label: "inline-cta",   format: "inline-cta",   expectedHrefHost: PROGRAM_URL },
  { label: "html-banner",  format: "html-banner",  expectedHrefHost: PROGRAM_URL },
];

describe("Banner click payload — slug + affiliate_id + zone in href", () => {
  beforeEach(() => logEvent.mockClear());

  it.each(CASES)("$label logs correct payload and href", ({ format, expectedHrefHost }) => {
    const { container } = render(
      <AffiliatePlacement
        slug={SLUG}
        lang="en"
        forceAffiliateId="payload-aff"
        forceFormat={format}
      />
    );

    logEvent.mockClear();
    const anchor = container.querySelector("a") as HTMLAnchorElement;
    expect(anchor).not.toBeNull();

    // (c) href carries destination + zone via utm_content
    expect(anchor.href).toContain(expectedHrefHost.split("?")[0]);
    expect(anchor.href).toContain("utm_content=post-result");
    expect(anchor.href).toContain(`utm_campaign=${SLUG}`);

    fireEvent.click(anchor);

    const clicks = logEvent.mock.calls.filter(
      (c) => (c[0] as any)?.kind === "click"
    );
    // (a) exactly one
    expect(clicks).toHaveLength(1);
    // (b) payload carries slug + affiliate_id
    expect(clicks[0][0]).toMatchObject({
      kind: "click",
      affiliate_id: "payload-aff",
      slug: SLUG,
      lang: "en",
    });
  });
});
