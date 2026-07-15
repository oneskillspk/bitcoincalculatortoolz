"""
Visual regression + horizontal-overflow harness for the Bitcoin Lot Size
Calculator page (which also hosts the Bitcoin Pip Value section).

For each small/medium viewport it:
  1. Loads the page and waits for network idle
  2. Scrolls the full body to force every lazy Suspense chunk to mount
  3. Asserts `documentElement.scrollWidth <= clientWidth + 1` (no overflow)
  4. Walks every element and reports any whose bounding box extends past
     the viewport right edge (usually the true culprit when the page
     itself is fine but a child <table>/<pre>/<div> bleeds out)
  5. Saves a full-height screenshot per viewport for eyeballing

Run:
    python3 scripts/visual-regression-lot-size.py
    python3 scripts/visual-regression-lot-size.py --base-url http://localhost:8080
    python3 scripts/visual-regression-lot-size.py --lang tr

Non-zero exit code if any viewport has horizontal overflow, so this
script can guard CI.
"""
import argparse
import asyncio
import sys
from pathlib import Path
from playwright.async_api import async_playwright

ROUTES = {
    "en": "/calculators/bitcoin-lot-size",
    "tr": "/tr/hesaplayicilar/bitcoin-lot-buyuklugu",
}

VIEWPORTS = [
    ("mobile-320", 320, 2000),
    ("mobile-375", 375, 2000),
    ("mobile-414", 414, 2000),
    ("tablet-768", 768, 2000),
    ("desktop-1024", 1024, 2000),
]

OUT_DIR = Path("/tmp/browser/lot-size-visual")


async def scroll_to_bottom(page):
    """Scroll in steps so Suspense/IntersectionObserver chunks all hydrate."""
    last = 0
    for _ in range(40):
        h = await page.evaluate("document.documentElement.scrollHeight")
        await page.evaluate(f"window.scrollTo(0, {last})")
        await page.wait_for_timeout(120)
        last += 900
        if last > h + 2000:
            break
    await page.evaluate("window.scrollTo(0, 0)")
    await page.wait_for_timeout(400)


async def find_overflowing_elements(page, viewport_width):
    """Return elements whose right edge exceeds the viewport width."""
    return await page.evaluate(
        """(vw) => {
          const bleeders = [];
          const nodes = document.body.querySelectorAll('*');
          for (const el of nodes) {
            const r = el.getBoundingClientRect();
            if (r.width === 0 || r.height === 0) continue;
            if (r.right > vw + 1) {
              // ignore anything inside a scroll container (that's fine)
              let p = el.parentElement, scrollable = false;
              while (p && p !== document.body) {
                const s = getComputedStyle(p);
                if ((s.overflowX === 'auto' || s.overflowX === 'scroll') &&
                    p.scrollWidth > p.clientWidth) { scrollable = true; break; }
                p = p.parentElement;
              }
              if (scrollable) continue;
              bleeders.push({
                tag: el.tagName.toLowerCase(),
                cls: (el.className || '').toString().slice(0, 80),
                right: Math.round(r.right),
                width: Math.round(r.width),
                text: (el.textContent || '').trim().slice(0, 60),
              });
            }
          }
          // De-dupe – keep only leaf-most bleeders
          return bleeders.slice(0, 15);
        }""",
        viewport_width,
    )


async def run(base_url: str, lang: str):
    route = ROUTES[lang]
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    failures = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        for label, w, h in VIEWPORTS:
            ctx = await browser.new_context(viewport={"width": w, "height": h})
            page = await ctx.new_page()
            url = f"{base_url}{route}"
            print(f"\n== [{lang}] {label} ({w}x{h}) → {url}")
            await page.goto(url, wait_until="networkidle", timeout=45_000)
            await page.wait_for_timeout(1000)
            await scroll_to_bottom(page)

            sw = await page.evaluate("document.documentElement.scrollWidth")
            cw = await page.evaluate("document.documentElement.clientWidth")
            print(f"   scrollWidth={sw}  clientWidth={cw}")
            if sw > cw + 1:
                bleeders = await find_overflowing_elements(page, w)
                print(f"   ❌ page overflows by {sw - cw}px. First bleeders:")
                for b in bleeders[:8]:
                    print(f"      · <{b['tag']} class='{b['cls']}'> right={b['right']} text='{b['text']}'")
                failures.append((lang, label, sw - cw, bleeders))
            else:
                print("   ✅ no horizontal overflow")

            out = OUT_DIR / f"{lang}_{label}.png"
            await page.screenshot(path=str(out))
            print(f"   📸 {out}")
            await ctx.close()
        await browser.close()

    if failures:
        print(f"\n💥 {len(failures)} viewport(s) with overflow")
        return 1
    print("\n✅ all viewports pass overflow check")
    return 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base-url", default="http://localhost:8080")
    ap.add_argument("--lang", choices=["en", "tr", "both"], default="both")
    args = ap.parse_args()
    langs = ["en", "tr"] if args.lang == "both" else [args.lang]
    rc = 0
    for l in langs:
        rc |= asyncio.run(run(args.base_url, l))
    sys.exit(rc)


if __name__ == "__main__":
    main()
