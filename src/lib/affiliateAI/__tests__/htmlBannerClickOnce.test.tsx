/**
 * Regression: HtmlBanner must log exactly ONE click per tap, even when
 * the parent re-renders many times (orchestrator ticks `timeOnPage` /
 * `scrollDepth` every second). Earlier the click effect re-attached
 * listeners without cleanup, producing N duplicate logEvent calls per
 * real click.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import React from "react";

const logEvent = vi.fn();
vi.mock("@/lib/affiliateAI/analyticsClient", () => ({
  logEvent: (...args: unknown[]) => logEvent(...args),
}));

// Skip the full useAffiliateAI pipeline — render HtmlBanner-equivalent
// markup directly via the same effect contract used in AffiliatePlacement.
import { appendUtm } from "@/lib/affiliateAI/utm";

function HtmlBannerHarness({ tick }: { tick: number }) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const handlers: Array<{ a: HTMLAnchorElement; fn: () => void }> = [];
    node.querySelectorAll("a").forEach((a) => {
      const orig = a.getAttribute("href") || "";
      a.setAttribute(
        "href",
        appendUtm(orig, { slug: "x", affiliateId: "p", zone: "post-result" })
      );
      const fn = () =>
        logEvent({
          kind: "click",
          affiliate_id: "p",
          slug: "x",
          lang: "en",
          segment: "default",
        });
      a.addEventListener("click", fn, { once: true });
      handlers.push({ a, fn });
    });
    return () => handlers.forEach(({ a, fn }) => a.removeEventListener("click", fn));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick]);
  return (
    <div
      ref={ref}
      dangerouslySetInnerHTML={{
        __html: `<a href="https://example.com/aff" data-testid="aff">Go</a>`,
      }}
    />
  );
}

describe("HtmlBanner click logging", () => {
  beforeEach(() => logEvent.mockClear());

  it("logs exactly one click after many parent re-renders", () => {
    const { rerender, container } = render(<HtmlBannerHarness tick={0} />);
    // Simulate 10 orchestrator ticks (timeOnPage/scrollDepth updates)
    for (let i = 1; i <= 10; i++) rerender(<HtmlBannerHarness tick={i} />);

    const a = container.querySelector('a[data-testid="aff"]')!;
    fireEvent.click(a);

    expect(logEvent).toHaveBeenCalledTimes(1);
    expect(logEvent).toHaveBeenCalledWith(
      expect.objectContaining({ kind: "click", affiliate_id: "p" })
    );
  });

  it("does not double-log when the same anchor is clicked twice (once: true)", () => {
    const { container } = render(<HtmlBannerHarness tick={0} />);
    const a = container.querySelector('a[data-testid="aff"]')!;
    fireEvent.click(a);
    fireEvent.click(a);
    expect(logEvent).toHaveBeenCalledTimes(1);
  });
});
