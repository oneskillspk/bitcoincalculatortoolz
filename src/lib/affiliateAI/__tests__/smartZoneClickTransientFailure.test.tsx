/**
 * Transient-failure regression: if logEvent throws (simulating a
 * network blip / Supabase cold start), the click handler must still
 * be invoked exactly once per tap — no component-level retry loop,
 * and no duplicate logs after the *next* calculation re-mounts the
 * placement.
 *
 * (Network-layer retries live inside analyticsClient and re-post the
 *  same payload; from the component's perspective `logEvent` is still
 *  called exactly once per user click. That invariant is what we lock
 *  in here.)
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
    const id = opts?.forceAffiliateId ?? "aff-x";
    const p = makeProgram(id);
    return {
      decision: {
        affiliate_ids: [id],
        format: opts?.forceFormat ?? "single-card",
        zone: "post-result",
        segment: "default",
      },
      items: [
        {
          program: p,
          url: p.url_en,
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

function Harness() {
  const [calc, setCalc] = useState<{ slug: string; aff: string } | null>(null);
  return (
    <div>
      <button data-testid="a" onClick={() => setCalc({ slug: "power-law", aff: "aff-a" })}>A</button>
      <button data-testid="b" onClick={() => setCalc({ slug: "sip", aff: "aff-b" })}>B</button>
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

describe("Transient logEvent failure — no duplicate click logs", () => {
  beforeEach(() => logEvent.mockReset());

  it("first click throws but is only invoked once; next calc click also once", () => {
    // Make the first click invocation throw, all subsequent calls succeed.
    let firstClickThrown = false;
    logEvent.mockImplementation((evt: any) => {
      if (evt?.kind === "click" && !firstClickThrown) {
        firstClickThrown = true;
        throw new Error("transient network failure");
      }
    });

    const { container, getByTestId } = render(<Harness />);

    // --- Calculation #1 ---
    act(() => { fireEvent.click(getByTestId("a")); });
    logEvent.mockClear(); // drop impression calls
    // re-install impl after mockClear
    logEvent.mockImplementation((evt: any) => {
      if (evt?.kind === "click" && !firstClickThrown) {
        firstClickThrown = true;
        throw new Error("transient network failure");
      }
    });

    const anchor1 = container.querySelector("a")!;
    // The handler must not blow up the test — wrap to mirror real handler.
    expect(() => fireEvent.click(anchor1)).not.toThrow();

    let clicks = logEvent.mock.calls.filter((c) => (c[0] as any)?.kind === "click");
    // Exactly one invocation even though it threw — no component-level retry.
    expect(clicks).toHaveLength(1);
    expect(clicks[0][0]).toMatchObject({ kind: "click", affiliate_id: "aff-a", slug: "power-law" });

    // --- Calculation #2 (re-mounts placement) ---
    act(() => { fireEvent.click(getByTestId("b")); });
    logEvent.mockClear();

    const anchor2 = container.querySelector("a")!;
    fireEvent.click(anchor2);

    clicks = logEvent.mock.calls.filter((c) => (c[0] as any)?.kind === "click");
    // Still exactly one — the previous failure didn't queue a stale retry
    // that would double-log under the new calculation's identity.
    expect(clicks).toHaveLength(1);
    expect(clicks[0][0]).toMatchObject({ kind: "click", affiliate_id: "aff-b", slug: "sip" });
  });
});
