#!/usr/bin/env python3
"""
Visual-regression + presence check for Axi across the key trading
calculator routes.

For every route × breakpoint we verify:
  1. No horizontal document overflow (page-wide).
  2. Axi is actually present on the page — either as an image creative
     served from `axiapi2.fynxt.com` OR as a text/CTA link pointing at
     `axi.com/int/live-account?promocode=4744672` (our IB promocode).
  3. No individual Axi asset overflows the viewport.

Fails hard (exit 1) if any route has overflow OR is missing Axi entirely.
"""
import asyncio, json, os, re, sys
from pathlib import Path
from playwright.async_api import async_playwright

OUT = Path("/tmp/browser/axi-overflow")
OUT.mkdir(parents=True, exist_ok=True)

BREAKPOINTS = [
    ("desktop", 1280),
    ("tablet",  768),
    ("mobile",  375),
]

TARGET_PAGES = [
    "/calculators/bitcoin-lot-size",
    "/calculators/leverage-liquidation",
    "/calculators/profit-loss",
    "/calculators/volatility",
]

AXI_IMG_HOST = "axiapi2.fynxt.com"
AXI_LINK_MATCH = "axi.com/int/live-account"


async def scroll_full(page):
    for y in range(0, 12000, 700):
        await page.evaluate(f"window.scrollTo(0,{y})")
        await page.wait_for_timeout(120)
    await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
    await page.wait_for_timeout(800)
    await page.evaluate("window.scrollTo(0,0)")
    await page.wait_for_timeout(200)


async def check_page(page, url, label, reloads=4):
    """Reload up to `reloads` times per breakpoint so bandit rotation has a
    fair chance to expose Axi; report best-case presence + worst-case
    overflow."""
    results = []
    for name, width in BREAKPOINTS:
        await page.set_viewport_size({"width": width, "height": 1600})
        agg = {"overflow": 0, "imgs": [], "links": [], "attempts": 0}
        for attempt in range(reloads):
            # Clear bandit state so each reload re-samples.
            try:
                await page.evaluate("window.localStorage.clear(); window.sessionStorage.clear();")
            except Exception:
                pass
            await page.goto(f"http://localhost:8080{url}?debugAds=1&_r={attempt}",
                            wait_until="networkidle")
            await page.wait_for_timeout(600)
            await scroll_full(page)
            data = await page.evaluate(f"""() => {{
                const doc = document.documentElement;
                const overflow = doc.scrollWidth - doc.clientWidth;
                const imgs = Array.from(document.querySelectorAll('img'))
                  .filter(i => (i.src || '').includes('{AXI_IMG_HOST}'))
                  .map(i => {{ const r = i.getBoundingClientRect();
                    return {{ src: i.src, w: Math.round(r.width),
                              overflows: r.right > doc.clientWidth + 1 }}; }});
                const links = Array.from(document.querySelectorAll('a[href]'))
                  .filter(a => a.href.includes('{AXI_LINK_MATCH}'))
                  .map(a => {{ const r = a.getBoundingClientRect();
                    return {{ href: a.href,
                              text: (a.innerText || '').trim().slice(0,60),
                              visible: r.width > 0 && r.height > 0,
                              overflows: r.right > doc.clientWidth + 1 }}; }});
                return {{ overflow, imgs, links }};
            }}""")
            agg["attempts"] += 1
            agg["overflow"] = max(agg["overflow"], data["overflow"])
            agg["imgs"].extend(data["imgs"])
            agg["links"].extend(data["links"])
            if data["imgs"] or any(l["visible"] for l in data["links"]):
                shot = OUT / f"{label}_{name}.png"
                await page.screenshot(path=str(shot))
                agg["screenshot"] = str(shot)
                break
        else:
            shot = OUT / f"{label}_{name}.png"
            await page.screenshot(path=str(shot))
            agg["screenshot"] = str(shot)
        results.append({"bp": name, "width": width, **agg})
    return results



async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={"width": 1280, "height": 1600})
        page = await context.new_page()

        summary = {}
        for url in TARGET_PAGES:
            label = re.sub(r"[^a-z0-9]+", "-", url.strip("/")).strip("-")
            print(f"→ {url}")
            summary[url] = await check_page(page, url, label)

        (OUT / "summary.json").write_text(json.dumps(summary, indent=2))

        any_fail = False
        for url, rows in summary.items():
            for r in rows:
                doc_over = r["overflow"] > 0
                img_over = any(i["overflows"] for i in r["imgs"])
                link_over = any(l["overflows"] for l in r["links"])
                axi_present = len(r["imgs"]) > 0 or any(
                    l["visible"] for l in r["links"])
                problems = []
                if doc_over:  problems.append(f"doc_overflow={r['overflow']}")
                if img_over:  problems.append("img_overflow")
                if link_over: problems.append("link_overflow")
                if not axi_present: problems.append("axi_missing")
                if problems:
                    any_fail = True
                    print(f"  ✗ {url} [{r['bp']}] {', '.join(problems)}")
                else:
                    print(f"  ✓ {url} [{r['bp']}] "
                          f"axi_imgs={len(r['imgs'])} axi_links="
                          f"{sum(1 for l in r['links'] if l['visible'])}")
        print("\nRESULT:", "FAIL" if any_fail else "PASS")
        await browser.close()
        sys.exit(1 if any_fail else 0)

asyncio.run(main())
