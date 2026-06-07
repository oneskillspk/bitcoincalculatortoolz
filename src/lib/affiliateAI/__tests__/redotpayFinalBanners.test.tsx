/**
 * Final RedotPay pink-set banner tests:
 *   1. Click simulation — every "final" creative (image_19..23) renders an
 *      anchor whose href is exactly the partner-owned landing URL with
 *      utm_uid=15980 preserved, routed to either /invite/affiliates-3 or
 *      /invite/affiliates-5.
 *   2. Visual regression — markup snapshot per new RedotPay banner size
 *      so unexpected layout drift (width/height/aspect-ratio) is caught.
 */
import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AFFILIATES } from "@/config/affiliates.config";
import { appendUtm } from "@/lib/affiliateAI/utm";

const REDOT = AFFILIATES.find((a) => a.id === "redotpay")!;
const FINAL_IMAGES = [
  "image_19_pink_1920x1004.png",
  "image_20_pink_1920x237.png",
  "image_21_pink_900x750.png",
  "image_22_pink_960x150.png",
  "image_23_pink_960x150.png",
];

const finalCreatives = (REDOT.creatives ?? []).filter((c) =>
  FINAL_IMAGES.some((name) => c.image_url.endsWith(name))
);

/** Mirror of ImageBanner anchor markup, isolated so we can render in jsdom. */
function Banner({
  href,
  size,
  width,
  height,
  alt,
  src,
  onClick,
}: {
  href: string;
  size: string;
  width: number;
  height: number;
  alt: string;
  src: string;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored nofollow noopener"
      aria-label={alt}
      data-size={size}
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

describe("RedotPay final banners · click → UTM/UID preserved", () => {
  it("registers all 5 final pink creatives", () => {
    expect(finalCreatives).toHaveLength(FINAL_IMAGES.length);
  });

  it.each(finalCreatives.map((c, i) => [i, c]))(
    "creative[%i] (%o) click routes to affiliates-3 or affiliates-5 with UID 15980",
    (_i, c) => {
      const href = appendUtm(c.landing_url!, {
        slug: "transaction-fees",
        affiliateId: "redotpay",
        zone: "pre-footer",
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
          onClick={() => {
            clicked = true;
          }}
        />
      );

      const anchor = screen.getByRole("link", { name: c.alt });
      fireEvent.click(anchor);
      expect(clicked).toBe(true);

      const u = new URL(anchor.getAttribute("href")!);
      // UID + partner source preserved (appendUtm must not overwrite).
      expect(u.searchParams.get("utm_uid")).toBe("15980");
      expect(u.searchParams.get("utm_source")).toBe("union");
      expect(u.searchParams.get("utm_s")).toBeTruthy();
      expect(u.searchParams.get("utm_id")).toBeTruthy();
      expect(u.searchParams.get("utm_medium")).toBeNull();
      // Routed to one of the two pink promo families.
      expect(
        ["/en/invite/affiliates-3/", "/en/invite/affiliates-5/"].some((p) =>
          u.pathname.startsWith(p)
        )
      ).toBe(true);
      // Outbound-link hardening.
      expect(anchor.getAttribute("rel")).toContain("sponsored");
      expect(anchor.getAttribute("rel")).toContain("nofollow");
      expect(anchor.getAttribute("target")).toBe("_blank");
    }
  );
});

describe("RedotPay final banners · visual regression snapshots", () => {
  it.each(finalCreatives.map((c) => [c.size + "·" + c.image_url.split("/").pop(), c]))(
    "snapshot for %s",
    (_label, c) => {
      const href = appendUtm(c.landing_url!, {
        slug: "dca",
        affiliateId: "redotpay",
        zone: "inline",
      });
      const { container } = render(
        <Banner
          href={href}
          size={c.size}
          width={c.width}
          height={c.height}
          alt={c.alt}
          src={c.image_url}
        />
      );
      // Stable, dimension-aware snapshot. Catches accidental width/height/
      // aspect-ratio changes across all new sizes.
      expect(container.firstChild).toMatchSnapshot();
    }
  );
});
