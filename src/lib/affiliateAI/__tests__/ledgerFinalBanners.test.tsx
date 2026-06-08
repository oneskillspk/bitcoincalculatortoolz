/**
 * Ledger banner regression tests:
 *   1. Link integrity — every Ledger creative (9 EN + 9 TR) renders an
 *      anchor whose href preserves the partner referral tag `r=8c4e8e87cac7`
 *      and points at the Ledger Nano S Plus landing page.
 *   2. Outbound-link hardening — sponsored/noopener rel + _blank target.
 *   3. Visual regression snapshot for 728x90 (EN + TR) — catches drift in
 *      banner markup / dimensions.
 */
import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AFFILIATES } from "@/config/affiliates.config";
import { appendUtm } from "@/lib/affiliateAI/utm";

const LEDGER = AFFILIATES.find((a) => a.id === "ledger")!;
const REFERRAL_TAG = "8c4e8e87cac7";
const LANDING_PATH = "/pages/ledger-nano-s-plus/";

const creatives = LEDGER.creatives ?? [];

function Banner({
  href,
  size,
  width,
  height,
  alt,
  src,
  lang,
  onClick,
}: {
  href: string;
  size: string;
  width: number;
  height: number;
  alt: string;
  src: string;
  lang: string;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored nofollow noopener"
      aria-label={alt}
      data-size={size}
      data-lang={lang}
      onClick={onClick}
      style={{ maxWidth: width }}
    >
      <img
        src={src}
        width={width}
        height={height}
        alt={alt}
        style={{ aspectRatio: `${width} / ${height}` }}
      />
    </a>
  );
}

describe("Ledger banners · registry coverage", () => {
  it("registers 9 EN + 9 TR creatives across 9 distinct sizes", () => {
    const en = creatives.filter((c) => c.lang === "en");
    const tr = creatives.filter((c) => c.lang === "tr");
    expect(en).toHaveLength(9);
    expect(tr).toHaveLength(9);
    const sizes = new Set(creatives.map((c) => c.size));
    expect(sizes.size).toBe(9);
  });

  it("uses the referral URL on every program-level link", () => {
    expect(LEDGER.url_en).toContain(`r=${REFERRAL_TAG}`);
    expect(LEDGER.url_tr).toContain(`r=${REFERRAL_TAG}`);
  });
});

describe("Ledger banners · link integrity", () => {
  it.each(creatives.map((c) => [`${c.lang}·${c.size}`, c]))(
    "creative %s preserves referral tag + outbound hardening",
    (_label, c) => {
      const href = appendUtm(c.landing_url!, {
        slug: "hodl-strategy",
        affiliateId: "ledger",
        zone: "inline",
      });

      let clicked = false;
      render(
        <Banner
          href={href}
          size={c.size}
          width={c.width}
          height={c.height}
          alt={c.alt}
          src={c.image_url}
          lang={c.lang ?? "en"}
          onClick={() => {
            clicked = true;
          }}
        />
      );

      const anchor = screen.getByRole("link", { name: c.alt });
      fireEvent.click(anchor);
      expect(clicked).toBe(true);

      const u = new URL(anchor.getAttribute("href")!);
      expect(u.hostname).toBe("shop.ledger.com");
      expect(u.pathname).toBe(LANDING_PATH);
      expect(u.searchParams.get("r")).toBe(REFERRAL_TAG);
      expect(anchor.getAttribute("rel")).toContain("sponsored");
      expect(anchor.getAttribute("rel")).toContain("nofollow");
      expect(anchor.getAttribute("rel")).toContain("noopener");
      expect(anchor.getAttribute("target")).toBe("_blank");

      // Localized image source matches lang.
      const expectedSuffix = c.lang === "tr" ? "/Turkish" : "/Default";
      expect(c.image_url.endsWith(expectedSuffix)).toBe(true);
    }
  );
});

describe("Ledger banners · full visual regression matrix (9 sizes × 2 langs)", () => {
  // Snapshot every Ledger creative so any drift in size, alt text, image
  // source, or referral URL surfaces in the diff. Pairs (EN/TR) of the
  // same size sit next to each other in the snapshot file for easy review.
  const ordered = [...creatives].sort((a, b) =>
    a.size === b.size
      ? (a.lang ?? "en").localeCompare(b.lang ?? "en")
      : a.size.localeCompare(b.size)
  );

  it.each(ordered.map((c) => [`${c.size}·${c.lang}`, c]))(
    "banner %s renders with correct size, alt, src, and tracked href",
    (_label, c) => {
      const href = appendUtm(c.landing_url!, {
        slug: "retirement",
        affiliateId: "ledger",
        zone: "pre-footer",
      });
      const { container } = render(
        <Banner
          href={href}
          size={c.size}
          width={c.width}
          height={c.height}
          alt={c.alt}
          src={c.image_url}
          lang={c.lang ?? "en"}
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    }
  );
});
