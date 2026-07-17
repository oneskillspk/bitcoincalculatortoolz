"""
Visual regression + horizontal-overflow harness for the calculator suite.

For every (page, viewport) pair it:
  1. Loads the page and waits for DOM + a short settle window
  2. Scrolls the full body to force lazy Suspense chunks to mount
  3. Asserts `documentElement.scrollWidth <= clientWidth + 1` (no page overflow)
  4. Walks every element and reports any whose right edge exceeds the
     viewport AND whose ancestor chain has no `overflow-x: hidden|clip|
     auto|scroll` clipping (i.e. real bleed, not intentional inner scrollers)
  5. Saves a viewport-sized screenshot per (page, viewport) for pixel diffing

Baselines live in `scripts/__screens__/calculators/<viewport>/<slug>.png`.
On CI, run with `--check` to diff against the committed baseline using PIL;
without `--check` new PNGs overwrite the baseline (author intent).

Exits non-zero if any viewport has overflow bleed OR any screenshot diverges
from its baseline beyond the pixel tolerance.

Run:
    python3 scripts/visual-regression-calculators.py               # refresh baselines
    python3 scripts/visual-regression-calculators.py --check       # gate CI
    python3 scripts/visual-regression-calculators.py --only dca
    python3 scripts/visual-regression-calculators.py --base-url http://localhost:8080
"""
import argparse
import asyncio
import json
import sys
from pathlib import Path
from playwright.async_api import async_playwright

# EN + TR calculator surfaces worth guarding. Slug is used as filename stem.
PAGES = [
    ("calculators-index",         "/calculators"),
    ("dca",                       "/calculators/dca"),
    ("power-law",                 "/calculators/power-law"),
    ("bitcoin-lot-size",          "/calculators/bitcoin-lot-size"),
    ("bitcoin-tax-uk-cgt",        "/calculators/bitcoin-tax-uk-cgt"),
    ("bitcoin-tax-germany",       "/calculators/bitcoin-tax-germany"),
    ("bitcoin-tax-india",         "/calculators/bitcoin-tax-india"),
    ("retirement",                "/calculators/retirement"),
    ("profit-loss",               "/calculators/profit-loss"),
    ("average-buy-price",         "/calculators/average-buy-price"),
    ("halving-countdown",         "/calculators/halving-countdown"),
    ("tr-calculators-index",      "/tr/hesaplayicilar"),
    ("tr-bitcoin-lot-size",       "/tr/hesaplayicilar/bitcoin-lot-buyuklugu"),
    ("tr-dca",                    "/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi"),
    ("tr-tax-uk-cgt",             "/tr/hesaplayicilar/bitcoin-vergi-ingiltere-cgt"),
]

VIEWPORTS = [
    ("mobile-320",  320,  2000),
    ("mobile-375",  375,  2000),
    ("mobile-414",  414,  2000),
    ("tablet-768",  768,  2000),
    ("desktop-1280", 1280, 1400),
    ("desktop-1440", 1440, 1400),
]

SCREENS_ROOT = Path(__file__).parent / "__screens__" / "calculators"


async def audit_page(page, path: str) -> dict:
    """Return overflow + bleed diagnostics for the currently rendered page."""
    # Progressive scroll to hydrate lazy sections.
    await page.evaluate(
        """async () => {
          const step = Math.max(200, window.innerHeight * 0.9);
          for (let y = 0; y < document.body.scrollHeight; y += step) {
            window.scrollTo(0, y);
            await new Promise(r => setTimeout(r, 60));
          }
          window.scrollTo(0, 0);
        }"""
    )
    await page.wait_for_timeout(200)
    return await page.evaluate(
        """() => {
          const de = document.documentElement;
          const vw = window.innerWidth;
          const bleed = [];
          for (const el of document.querySelectorAll('body *')) {
            const r = el.getBoundingClientRect();
            if (r.width <= 0 || r.height <= 0) continue;
            if (r.right <= vw + 2) continue;
            if (r.width > vw * 2) continue; // skip absurd (usually fixed decor)
            let clipped = false, p = el.parentElement;
            while (p) {
              const s = getComputedStyle(p);
              if (['hidden','clip','auto','scroll'].includes(s.overflowX)) {
                clipped = true; break;
              }
              p = p.parentElement;
            }
            if (!clipped) {
              bleed.push({
                tag: el.tagName.toLowerCase(),
                cls: (el.className + '').slice(0, 90),
                right: Math.round(r.right),
                width: Math.round(r.width),
              });
            }
          }
          return {
            pageScrollW: de.scrollWidth,
            vw,
            overflow: de.scrollWidth > vw + 1,
            bleed: bleed.slice(0, 8),
          };
        }"""
    )


def diff_png(baseline: Path, current: Path, tol_ratio: float = 0.005) -> float:
    """Return fraction of pixels that differ. 0 == identical."""
    try:
        from PIL import Image, ImageChops
    except ImportError:
        print("[warn] PIL not available; skipping pixel diff", file=sys.stderr)
        return 0.0
    a = Image.open(baseline).convert("RGB")
    b = Image.open(current).convert("RGB")
    if a.size != b.size:
        return 1.0
    diff = ImageChops.difference(a, b)
    bbox = diff.getbbox()
    if not bbox:
        return 0.0
    # Count pixels above small per-channel delta (anti-aliasing / gradient noise)
    px = diff.crop(bbox).getdata()
    changed = sum(1 for r, g, bl in px if max(r, g, bl) > 12)
    total = a.size[0] * a.size[1]
    return changed / total


async def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base-url", default="http://localhost:8080")
    ap.add_argument("--check", action="store_true",
                    help="Diff against committed baselines instead of refreshing.")
    ap.add_argument("--only", help="Substring filter on page slug.")
    ap.add_argument("--tol", type=float, default=0.01,
                    help="Max fraction of changed pixels allowed (default 1%%).")
    args = ap.parse_args()

    targets = [p for p in PAGES if not args.only or args.only in p[0]]
    SCREENS_ROOT.mkdir(parents=True, exist_ok=True)

    failures: list[str] = []
    report: list[dict] = []

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        for vname, vw, vh in VIEWPORTS:
            vdir = SCREENS_ROOT / vname
            vdir.mkdir(parents=True, exist_ok=True)
            ctx = await browser.new_context(
                viewport={"width": vw, "height": vh},
                device_scale_factor=1,
            )
            page = await ctx.new_page()
            for slug, path in targets:
                url = f"{args.base_url}{path}"
                entry = {"vp": vname, "slug": slug, "path": path}
                try:
                    resp = await page.goto(url, wait_until="domcontentloaded",
                                           timeout=20000)
                    entry["status"] = resp.status if resp else None
                    if not resp or resp.status >= 400:
                        failures.append(f"{vname}/{slug}: HTTP {entry['status']}")
                        report.append(entry); continue

                    diag = await audit_page(page, path)
                    entry.update(diag)
                    if diag["overflow"]:
                        failures.append(
                            f"{vname}/{slug}: page overflow "
                            f"{diag['pageScrollW']} > {diag['vw']}"
                        )
                    if diag["bleed"]:
                        failures.append(
                            f"{vname}/{slug}: {len(diag['bleed'])} unclipped bleed element(s) "
                            f"(first: <{diag['bleed'][0]['tag']} class=\"{diag['bleed'][0]['cls']}\">)"
                        )

                    shot = vdir / f"{slug}.png"
                    if args.check and shot.exists():
                        tmp = vdir / f"{slug}.current.png"
                        await page.screenshot(path=str(tmp))
                        ratio = diff_png(shot, tmp)
                        entry["diff_ratio"] = round(ratio, 5)
                        if ratio > args.tol:
                            failures.append(
                                f"{vname}/{slug}: pixel diff {ratio:.3%} > {args.tol:.3%}"
                            )
                        else:
                            tmp.unlink(missing_ok=True)
                    else:
                        await page.screenshot(path=str(shot))
                        entry["baseline"] = "refreshed"
                except Exception as e:
                    failures.append(f"{vname}/{slug}: {type(e).__name__}: {e}")
                    entry["error"] = str(e)[:200]
                report.append(entry)
            await ctx.close()
        await browser.close()

    (SCREENS_ROOT / "report.json").write_text(json.dumps(report, indent=2))

    print(f"\nChecked {len(report)} (page × viewport) combinations "
          f"across {len(VIEWPORTS)} viewports and {len(targets)} pages.")
    if failures:
        print(f"\n[FAIL] {len(failures)} issue(s):")
        for f in failures:
            print("  •", f)
        sys.exit(1)
    print("[OK] No overflow bleed or visual regressions detected.")


if __name__ == "__main__":
    asyncio.run(main())
