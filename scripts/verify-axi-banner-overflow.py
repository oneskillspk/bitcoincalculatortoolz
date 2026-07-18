#!/usr/bin/env python3
"""
Verify every Axi creative renders on the targeted calculator pages without
causing horizontal overflow at desktop / tablet / mobile viewports.

Loads the admin banner preview page (must be signed-in first if guarded) and
also visits three trading calculators to check live rendering.
"""
import asyncio, json, os, re
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
    "/calculators/lot-size",
    "/calculators/liquidation",
    "/calculators/leverage",
    "/calculators/profit-loss",
    "/calculators/pip-value",
]

async def restore_session(context, page):
    session = os.environ.get("LOVABLE_BROWSER_SUPABASE_SESSION_JSON")
    key = os.environ.get("LOVABLE_BROWSER_SUPABASE_STORAGE_KEY")
    cookies_json = os.environ.get("LOVABLE_BROWSER_SUPABASE_COOKIES_JSON")
    if cookies_json:
        cookies = json.loads(cookies_json)
        for c in cookies:
            c["url"] = "http://localhost:8080"
        await context.add_cookies(cookies)
    await page.goto("http://localhost:8080", wait_until="domcontentloaded")
    if key and session:
        await page.evaluate(
            f"window.localStorage.setItem({json.dumps(key)}, {json.dumps(session)})"
        )

async def check_page(page, url, label):
    results = []
    for name, width in BREAKPOINTS:
        await page.set_viewport_size({"width": width, "height": 1600})
        await page.goto(f"http://localhost:8080{url}", wait_until="networkidle")
        await page.wait_for_timeout(1200)
        # measure page overflow
        data = await page.evaluate("""() => {
            const doc = document.documentElement;
            const overflow = doc.scrollWidth - doc.clientWidth;
            // find axi banner imgs
            const imgs = Array.from(document.querySelectorAll('img'))
              .filter(i => (i.src || '').includes('axiapi2.fynxt.com'))
              .map(i => ({
                src: i.src,
                w: i.getBoundingClientRect().width,
                cw: i.clientWidth,
                naturalW: i.naturalWidth,
                overflows: i.getBoundingClientRect().right > document.documentElement.clientWidth + 1,
              }));
            return { overflow, imgs };
        }""")
        shot = OUT / f"{label}_{name}.png"
        await page.screenshot(path=str(shot))
        results.append({"bp": name, "width": width, **data, "screenshot": str(shot)})
    return results

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1280, "height": 1600})
        page = await context.new_page()
        try:
            await restore_session(context, page)
        except Exception as e:
            print("session restore skipped:", e)

        summary = {}
        for url in TARGET_PAGES:
            label = re.sub(r"[^a-z0-9]+", "-", url.strip("/")).strip("-")
            print(f"→ {url}")
            summary[url] = await check_page(page, url, label)

        # Save summary
        (OUT / "summary.json").write_text(json.dumps(summary, indent=2))
        # Print concise verdict
        any_overflow = False
        for url, rows in summary.items():
            for r in rows:
                doc_over = r["overflow"] > 0
                img_over = any(i["overflows"] for i in r["imgs"])
                if doc_over or img_over:
                    any_overflow = True
                    print(f"  ✗ {url} [{r['bp']}] doc_overflow={r['overflow']} imgs_overflow={sum(i['overflows'] for i in r['imgs'])}")
                else:
                    print(f"  ✓ {url} [{r['bp']}] no overflow · {len(r['imgs'])} axi img(s)")
        print("\nRESULT:", "FAIL" if any_overflow else "PASS")
        await browser.close()

asyncio.run(main())
