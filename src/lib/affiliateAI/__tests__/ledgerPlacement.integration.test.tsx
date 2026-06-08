/**
 * Ledger placement integration tests.
 *
 * Verifies that — across every banner size, every language route
 * (/ vs /tr), and every device breakpoint — the rendered <AffiliatePlacement>
 * for a forced `ledger` decision:
 *   - selects a creative whose `lang` matches the active route
 *   - emits an outbound link that retains the partner tracking tag
 *     `r=8c4e8e87cac7`
 *   - applies the sponsored/noopener `rel` and `target="_blank"`
 *   - resolves to one of the 9 known Ledger banner sizes
 */
import { afterEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { AffiliatePlacement } from "@/components/affiliateAI/AffiliatePlacement";
import { AFFILIATES } from "@/config/affiliates.config";
import { pickCreative } from "@/lib/affiliateAI/creativePicker";
import type { Zone } from "@/lib/affiliateAI/types";

const LEDGER = AFFILIATES.find((a) => a.id === "ledger")!;
const REFERRAL_TAG = "8c4e8e87cac7";
const ALL_SIZES = ["120x600","850x420","728x90","468x60","320x50","300x600","300x250","250x100","160x600"];

function setViewport(width: number) {
  Object.defineProperty(window, "innerWidth", { configurable: true, value: width });
  Object.defineProperty(window, "innerHeight", { configurable: true, value: 800 });
  window.dispatchEvent(new Event("resize"));
}

function setRoute(path: string) {
  window.history.replaceState({}, "", path);
}

afterEach(() => {
  setRoute("/");
  setViewport(1280);
});

describe("Ledger placement · creative selection across breakpoints", () => {
  const zones: Zone[] = ["inline", "pre-footer", "post-result", "sidebar", "footer", "inline-mid-article"];
  const devices: Array<["mobile" | "tablet" | "desktop", number]> = [
    ["mobile", 375],
    ["tablet", 768],
    ["desktop", 1280],
  ];

  it.each(
    zones.flatMap((z) =>
      devices.flatMap(([d, w]) =>
        (["en", "tr"] as const).map((lang) => [`${z} · ${d} (${w}px) · ${lang}`, z, d, w, lang] as const)
      )
    )
  )("%s picks a Ledger creative of the right language", (_label, zone, device, _w, lang) => {
    const creative = pickCreative(LEDGER, zone, device, lang, () => 0.5);
    expect(creative).not.toBeNull();
    expect(creative!.lang).toBe(lang);
    expect(ALL_SIZES).toContain(creative!.size);
    expect(creative!.landing_url).toContain(`r=${REFERRAL_TAG}`);
    // Image URL must match the language-specific Ledger endpoint.
    expect(creative!.image_url).toMatch(lang === "tr" ? /\/Turkish$/ : /\/Default$/);
  });
});

describe("Ledger placement · /tr route → Turkish creative rendered", () => {
  it("renders Turkish banner under /tr/* with tracking tag preserved", async () => {
    setRoute("/tr/hesaplayicilar/hodl-stratejisi");
    setViewport(1280);
    const { container } = render(
      <AffiliatePlacement
        slug="hodl-strategy"
        zone="inline"
        forceAffiliateId="ledger"
        forceFormat="image-banner"
      />
    );
    const anchor = await screen.findByRole("link");
    const href = anchor.getAttribute("href")!;
    expect(href).toContain(`r=${REFERRAL_TAG}`);
    expect(href).toContain("shop.ledger.com/pages/ledger-nano-s-plus");
    expect(anchor.getAttribute("target")).toBe("_blank");
    expect(anchor.getAttribute("rel")).toContain("sponsored");
    expect(anchor.getAttribute("rel")).toContain("nofollow");
    expect(anchor.getAttribute("rel")).toContain("noopener");
    const img = container.querySelector("img")!;
    expect(img.getAttribute("src")).toMatch(/\/Turkish$/);
  });
});

describe("Ledger placement · / route → English creative rendered", () => {
  it("renders English banner under /* with tracking tag preserved", async () => {
    setRoute("/calculators/hodl-strategy");
    setViewport(1280);
    const { container } = render(
      <AffiliatePlacement
        slug="hodl-strategy"
        zone="inline"
        forceAffiliateId="ledger"
        forceFormat="image-banner"
      />
    );
    const anchor = await screen.findByRole("link");
    const href = anchor.getAttribute("href")!;
    expect(href).toContain(`r=${REFERRAL_TAG}`);
    expect(anchor.getAttribute("target")).toBe("_blank");
    expect(anchor.getAttribute("rel")).toContain("sponsored");
    const img = container.querySelector("img")!;
    expect(img.getAttribute("src")).toMatch(/\/Default$/);
  });
});

describe("Ledger placement · responsive size at each breakpoint", () => {
  const cases: Array<[number, "mobile" | "tablet" | "desktop", string[]]> = [
    [375,  "mobile",  ["300x250", "320x50"]],
    [768,  "tablet",  ["468x60", "300x250"]],
    [1280, "desktop", ["728x90", "468x60"]],
  ];

  it.each(cases)("at %ipx (%s) renders one of the preferred sizes", async (w, device, allowed) => {
    setRoute("/");
    setViewport(w);
    // Force a deterministic high-weight pick by stubbing Math.random low.
    const orig = Math.random;
    Math.random = () => 0.01;
    try {
      const { container } = render(
        <AffiliatePlacement
          slug="home"
          lang="en"
          zone="inline"
          forceAffiliateId="ledger"
          forceFormat="image-banner"
        />
      );
      await screen.findByRole("link");
      const img = container.querySelector("img")!;
      const size = `${img.getAttribute("width")}x${img.getAttribute("height")}`;
      // Sanity: should pick one of the Ledger sizes; preferred sizes for that
      // breakpoint should match top-of-list selection under deterministic RNG.
      expect(ALL_SIZES).toContain(size);
      expect(allowed).toContain(size);
      // Device snapshot — guards against accidental zone-preference drift.
      expect({ device, size }).toMatchSnapshot();
    } finally {
      Math.random = orig;
    }
  });
});
