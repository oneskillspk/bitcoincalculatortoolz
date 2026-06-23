/**
 * Back-to-back regression: run two full "calculations" in a row,
 * clicking a banner after each. Each tap must log exactly one click
 * carrying the payload of the *current* calculation (slug + signals),
 * not a stale value from the previous run.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, act } from "@testing-library/react";
import { useState } from "react";

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

const makeProgram = (id: string) =>
  ({
    id,
    name: id,
    enabled: true,
    url_en: `https://example.com/${id}`,
    url_tr: `https://example.com/${id}`,
    cta_en: "Go",
    cta_tr: "Git",
    description_en: "d",
    description_tr: "d",
    badge_en: null,
    badge_tr: null,
    logo_color: null,
    creative_html: `<a href="https://example.com/${id}">Go</a>`,
    creatives: [],
  }) as any;

vi.mock("@/hooks/useAffiliateAI", () => ({
  useAffiliateAI: (opts: any) => {
    const id = opts?.forceAffiliateId ?? "aff-a";
    const program = makeProgram(id);
    return {
      decision: {
        affiliate_ids: [id],
        format: opts?.forceFormat ?? "single-card",
        zone: "post-result",
        segment: "default",
      },
      items: [
        {
          program,
          url: program.url_en,
          cta: "Go",
          description: "d",
          badge: null,
          effectiveLang: "en",
        },
      ],
      hidden: false,
      shadow: false,
      loading: false,
    };
  },
}));

import { AffiliatePlacement } from "@/components/affiliateAI/AffiliatePlacement";

/** Mini harness that mimics a calculator page: state per calculation. */
function Harness() {
  const [calc, setCalc] = useState<{ slug: string; aff: string } | null>(null);
  return (
    <div>
      <button
        data-testid="calc-a"
        onClick={() => setCalc({ slug: "power-law", aff: "aff-a" })}
      >
        Calc A
      </button>
      <button
        data-testid="calc-b"
        onClick={() => setCalc({ slug: "sip", aff: "aff-b" })}
      >
        Calc B
      </button>
      {calc && (
        <AffiliatePlacement
          key={`${calc.slug}-${calc.aff}`}
          slug={calc.slug}
          lang="en"
          forceAffiliateId={calc.aff}
          forceFormat="single-card"
        />
      )}
    </div>
  );
}

describe("Back-to-back calculations + banner clicks", () => {
  beforeEach(() => logEvent.mockClear());

  it("each click logs exactly once with the latest calculation's payload", () => {
    const { container, getByTestId } = render(<Harness />);

    // --- Calculation #1 ---
    act(() => {
      fireEvent.click(getByTestId("calc-a"));
    });
    logEvent.mockClear(); // ignore impressions
    let anchor = container.querySelector("a")!;
    expect(anchor).not.toBeNull();
    fireEvent.click(anchor);

    let clicks = logEvent.mock.calls.filter(
      (c) => (c[0] as any)?.kind === "click"
    );
    expect(clicks).toHaveLength(1);
    expect(clicks[0][0]).toMatchObject({
      kind: "click",
      affiliate_id: "aff-a",
      slug: "power-law",
      lang: "en",
    });

    // --- Calculation #2 (different slug + affiliate) ---
    act(() => {
      fireEvent.click(getByTestId("calc-b"));
    });
    logEvent.mockClear();
    anchor = container.querySelector("a")!;
    expect(anchor).not.toBeNull();
    fireEvent.click(anchor);

    clicks = logEvent.mock.calls.filter(
      (c) => (c[0] as any)?.kind === "click"
    );
    expect(clicks).toHaveLength(1);
    expect(clicks[0][0]).toMatchObject({
      kind: "click",
      affiliate_id: "aff-b",
      slug: "sip",
      lang: "en",
    });
    // Make sure no stale "aff-a" leak.
    expect((clicks[0][0] as any).affiliate_id).not.toBe("aff-a");
    expect((clicks[0][0] as any).slug).not.toBe("power-law");
  });
});
