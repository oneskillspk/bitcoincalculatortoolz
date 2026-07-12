"""
Screenshot regression harness for P1 result panels.

Captures a mobile (390x844) and desktop (1280x1800) screenshot for each
migrated P1 calculator so layout regressions can be spotted at a glance.

Run:
    python3 scripts/screenshot-p1-panels.py
    python3 scripts/screenshot-p1-panels.py --base-url http://localhost:8080
    python3 scripts/screenshot-p1-panels.py --only cagr,hodl

Outputs to /tmp/browser/p1-regression/<slug>/<viewport>.png
"""
import argparse
import asyncio
import os
import sys
from pathlib import Path
from playwright.async_api import async_playwright

PANELS = [
    ("accumulation-score", "/calculators/bitcoin-accumulation-score"),
    ("cagr",               "/calculators/cagr"),
    ("hodl",               "/calculators/hodl-strategy"),
    ("inflation",          "/calculators/inflation-dashboard"),
    ("purchasing-power",   "/calculators/purchasing-power"),
    ("zakat",              "/calculators/bitcoin-zakat"),
]

VIEWPORTS = {
    "mobile":  {"width": 390,  "height": 844},
    "desktop": {"width": 1280, "height": 1800},
}

OUT_DIR = Path("/tmp/browser/p1-regression")


async def capture(page, url: str, path: Path):
    path.parent.mkdir(parents=True, exist_ok=True)
    await page.goto(url, wait_until="networkidle", timeout=45_000)
    # Give the result panel time to hydrate + finish any post-mount transitions.
    await page.wait_for_timeout(1500)
    # Prefer screenshotting the results panel if we can find it, else viewport.
    locator = page.locator('[data-testid="result-panel"], [aria-live="polite"]').first
    try:
        if await locator.count() > 0:
            await locator.scroll_into_view_if_needed(timeout=2000)
    except Exception:
        pass
    await page.screenshot(path=str(path))
    print(f"  saved {path}")


async def run(base_url: str, only: list[str] | None):
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    failures: list[str] = []
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        try:
            for slug, route in PANELS:
                if only and slug not in only:
                    continue
                print(f"[{slug}] {route}")
                for vp_name, vp in VIEWPORTS.items():
                    ctx = await browser.new_context(viewport=vp, device_scale_factor=1)
                    # Pre-seed cookie-consent so the banner never mounts.
                    # CookieConsentBanner reads `bct-consent-v1` on mount; any
                    # stored value ("granted" | "denied") suppresses the UI.
                    await ctx.add_init_script(
                        "try { localStorage.setItem('bct-consent-v1', 'denied'); } catch (e) {}"
                    )
                    page = await ctx.new_page()
                    out = OUT_DIR / slug / f"{vp_name}.png"
                    try:
                        await capture(page, f"{base_url}{route}", out)
                    except Exception as e:  # noqa: BLE001
                        failures.append(f"{slug}/{vp_name}: {e}")
                        print(f"  FAIL {vp_name}: {e}")
                    finally:
                        await ctx.close()
        finally:
            await browser.close()

    print("\nDone. Screenshots in", OUT_DIR)
    if failures:
        print("\nFailures:")
        for f in failures:
            print(" -", f)
        sys.exit(1)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base-url", default=os.environ.get("BASE_URL", "http://localhost:8080"))
    ap.add_argument("--only", default="", help="comma-separated slugs to run")
    args = ap.parse_args()
    only = [s.strip() for s in args.only.split(",") if s.strip()] or None
    asyncio.run(run(args.base_url.rstrip("/"), only))


if __name__ == "__main__":
    main()
