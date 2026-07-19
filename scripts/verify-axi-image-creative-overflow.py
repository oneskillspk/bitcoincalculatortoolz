#!/usr/bin/env python3
"""
Targeted overflow check for the Axi *image* creatives (not the text CTA).
Scrolls each route until the InViewMount hydrates the <img src="axiapi2.fynxt.com/...">,
then measures both the document scrollWidth and the image's own boundingBox
against the viewport. Screenshots the image element for visual review.
"""
import asyncio, sys
from pathlib import Path
from playwright.async_api import async_playwright

OUT = Path("/tmp/browser/axi-image-overflow")
OUT.mkdir(parents=True, exist_ok=True)

BREAKPOINTS = [("desktop", 1280), ("tablet", 768), ("mobile", 375)]
ROUTES = [
    "/calculators/leverage-liquidation",
    "/calculators/profit-loss",
    "/calculators/volatility",
]
AXI_IMG_SEL = 'img[src*="axiapi2.fynxt.com"]'


async def scroll_full(page):
    h = await page.evaluate("document.body.scrollHeight")
    for y in range(0, h + 1000, 500):
        await page.evaluate(f"window.scrollTo(0,{y})")
        await page.wait_for_timeout(150)


async def check(page, url, label, vw):
    await page.goto(f"http://localhost:8080{url}", wait_until="domcontentloaded")
    await page.wait_for_timeout(1500)
    await scroll_full(page)
    try:
        await page.wait_for_selector(AXI_IMG_SEL, timeout=10000)
    except Exception:
        return {"url": url, "label": label, "status": "no_image"}
    imgs = await page.query_selector_all(AXI_IMG_SEL)
    results = []
    for i, img in enumerate(imgs):
        box = await img.bounding_box()
        if not box:
            continue
        overflow = box["x"] < -1 or (box["x"] + box["width"]) > vw + 1
        results.append({"i": i, "w": round(box["width"]), "x": round(box["x"]), "overflow": overflow})
    doc_w = await page.evaluate("document.documentElement.scrollWidth")
    doc_overflow = doc_w > vw + 1
    shot = OUT / f"{url.strip('/').replace('/','-')}_{label}.png"
    await page.screenshot(path=str(shot))
    return {"url": url, "label": label, "vw": vw, "doc_w": doc_w,
            "doc_overflow": doc_overflow, "imgs": results, "shot": str(shot)}


async def main():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        fails = 0
        for label, vw in BREAKPOINTS:
            ctx = await browser.new_context(viewport={"width": vw, "height": 1800})
            page = await ctx.new_page()
            for url in ROUTES:
                r = await check(page, url, label, vw)
                if r.get("status") == "no_image":
                    print(f"  ✗ {url} [{label}] NO IMAGE"); fails += 1; continue
                any_overflow = r["doc_overflow"] or any(i["overflow"] for i in r["imgs"])
                mark = "✗" if any_overflow else "✓"
                if any_overflow: fails += 1
                print(f"  {mark} {url} [{label}] doc={r['doc_w']}px imgs={r['imgs']}")
            await ctx.close()
        await browser.close()
        print(f"\nRESULT: {'FAIL' if fails else 'PASS'} ({fails} issues)")
        sys.exit(1 if fails else 0)

asyncio.run(main())
