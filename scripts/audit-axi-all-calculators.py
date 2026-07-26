#!/usr/bin/env python3
"""Full Axi audit across every calculator route that's in Axi's target_pages.

For each route × breakpoint (desktop/tablet/mobile) we:
  1. Try to trigger results (click "Calculate"/"Compare" buttons if present).
  2. Scroll the full page to force lazy `InViewMount` sections to hydrate.
  3. Reload up to N times (clearing localStorage) so bandit rotation gets a
     fair shot at exposing Axi image creatives.
  4. Record: doc horizontal overflow, count of Axi image creatives, count of
     visible Axi text CTAs, whether any Axi asset overflows the viewport.
  5. Take a screenshot on the last attempt (or first Axi-visible attempt).

Exit 1 if any route is missing Axi entirely at any breakpoint or has any
horizontal overflow.
"""
import asyncio, json, re, sys
from pathlib import Path
from playwright.async_api import async_playwright

OUT = Path("/mnt/documents/axi-audit"); OUT.mkdir(parents=True, exist_ok=True)

BREAKPOINTS = [("desktop", 1280), ("tablet", 768), ("mobile", 375)]

# Every route currently listed in Axi's target_pages that has a real /calculators
# route in App.tsx. TR mirrors are covered under /tr/hesaplayicilar/*.
ROUTES = [
    "/calculators/bitcoin-lot-size",
    "/calculators/leverage-liquidation",
    "/calculators/profit-loss",
    "/calculators/volatility",
    "/calculators/dca",
    "/calculators/lump-sum-vs-dca",
    "/calculators/rainbow-chart",
    "/calculators/power-law",
    "/calculators/sip",
    "/calculators/what-if",
]

AXI_IMG_HOST = "axiapi2.fynxt.com"
AXI_LINK_MATCH = "axi.com/int/live-account"
RELOADS = 5


async def try_click_calculate(page):
    # Best-effort — click any button whose label suggests running the calc.
    for label in ("Calculate", "Compare", "Simulate", "Run", "Hesapla"):
        try:
            btn = page.get_by_role("button", name=re.compile(label, re.I)).first
            if await btn.count() and await btn.is_visible():
                await btn.click(timeout=1500)
                await page.wait_for_timeout(400)
        except Exception:
            pass


async def scroll_full(page):
    h = await page.evaluate("document.body.scrollHeight")
    for y in range(0, int(h) + 800, 600):
        await page.evaluate(f"window.scrollTo(0,{y})")
        await page.wait_for_timeout(90)
    await page.evaluate("window.scrollTo(0,0)"); await page.wait_for_timeout(150)


async def probe(page):
    return await page.evaluate(f"""() => {{
        const doc = document.documentElement;
        const overflow = doc.scrollWidth - doc.clientWidth;
        const imgs = Array.from(document.querySelectorAll('img'))
          .filter(i => (i.src||'').includes('{AXI_IMG_HOST}'))
          .map(i => {{ const r = i.getBoundingClientRect();
            return {{ w: Math.round(r.width), h: Math.round(r.height),
                      overflows: r.right > doc.clientWidth + 1 }}; }});
        const links = Array.from(document.querySelectorAll('a[href]'))
          .filter(a => a.href.includes('{AXI_LINK_MATCH}'))
          .map(a => {{ const r = a.getBoundingClientRect();
            return {{ visible: r.width > 0 && r.height > 0,
                      overflows: r.right > doc.clientWidth + 1 }}; }});
        return {{ overflow, imgs, links }};
    }}""")


async def audit_route(page, url):
    per_bp = []
    label = re.sub(r"[^a-z0-9]+", "-", url.strip("/")).strip("-")
    for bp, w in BREAKPOINTS:
        await page.set_viewport_size({"width": w, "height": 1600})
        best = {"overflow": 0, "img_count": 0, "link_count": 0,
                "img_overflow": False, "link_overflow": False,
                "attempts": 0, "screenshot": None}
        for attempt in range(RELOADS):
            try:
                await page.evaluate("window.localStorage.clear(); window.sessionStorage.clear();")
            except Exception: pass
            await page.goto(f"http://localhost:8080{url}?debugAds=1&_r={attempt}",
                            wait_until="networkidle", timeout=25000)
            await page.wait_for_timeout(500)
            await try_click_calculate(page)
            await scroll_full(page)
            data = await probe(page)
            best["attempts"] += 1
            best["overflow"] = max(best["overflow"], data["overflow"])
            best["img_count"] = max(best["img_count"], len(data["imgs"]))
            visible_links = sum(1 for l in data["links"] if l["visible"])
            best["link_count"] = max(best["link_count"], visible_links)
            if any(i["overflows"] for i in data["imgs"]): best["img_overflow"] = True
            if any(l["overflows"] for l in data["links"]): best["link_overflow"] = True
            if data["imgs"] or visible_links:
                shot = OUT / f"{label}_{bp}.png"
                try: await page.screenshot(path=str(shot))
                except Exception: pass
                best["screenshot"] = str(shot)
                break
        if best["screenshot"] is None:
            shot = OUT / f"{label}_{bp}.png"
            try: await page.screenshot(path=str(shot)); best["screenshot"] = str(shot)
            except Exception: pass
        per_bp.append({"bp": bp, "width": w, **best})
    return per_bp


async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(viewport={"width": 1280, "height": 1600})
        page = await ctx.new_page()
        summary = {}
        for url in ROUTES:
            print(f"→ {url}", flush=True)
            summary[url] = await audit_route(page, url)
            for r in summary[url]:
                print(f"   {r['bp']:>7} imgs={r['img_count']} links={r['link_count']} "
                      f"overflow={r['overflow']} tries={r['attempts']}", flush=True)
        (OUT / "summary.json").write_text(json.dumps(summary, indent=2))

        any_fail = False
        print("\n=== RESULTS ===")
        for url, rows in summary.items():
            for r in rows:
                probs = []
                if r["overflow"] > 0:   probs.append(f"doc_overflow={r['overflow']}")
                if r["img_overflow"]:   probs.append("img_overflow")
                if r["link_overflow"]:  probs.append("link_overflow")
                if r["img_count"] == 0 and r["link_count"] == 0:
                    probs.append("axi_missing")
                if probs:
                    any_fail = True
                    print(f"  ✗ {url} [{r['bp']}] {', '.join(probs)}")
                else:
                    print(f"  ✓ {url} [{r['bp']}] imgs={r['img_count']} links={r['link_count']}")
        print("\nRESULT:", "FAIL" if any_fail else "PASS")
        await browser.close()
        sys.exit(1 if any_fail else 0)


asyncio.run(main())
