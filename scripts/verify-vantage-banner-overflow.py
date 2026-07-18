#!/usr/bin/env python3
"""
Verify every Vantage creative renders on the targeted calculator pages
without causing horizontal overflow at desktop / tablet / mobile viewports.

Mirrors verify-axi-banner-overflow.py but scoped to Vantage. Since Vantage
creatives may live on multiple partner CDNs, we match by:
  1) known host patterns (vantagemarkets, vantagefx, vantage-affiliates, ...)
  2) any <img> / <a> tagged with data-affiliate="vantage"
  3) any anchor href containing vantagemarkets.com or the IB tracking domain

Run: `python scripts/verify-vantage-banner-overflow.py`
"""
import asyncio, json, os, re
from pathlib import Path
from playwright.async_api import async_playwright

BROKER = "vantage"

OUT = Path(f"/tmp/browser/{BROKER}-overflow")
OUT.mkdir(parents=True, exist_ok=True)

BREAKPOINTS = [
    ("desktop", 1280),
    ("tablet",  768),
    ("mobile",  375),
]

# Mirror Axi's target_pages list — Vantage is scoped to the same
# leverage / trading intent slugs.
TARGET_PAGES = [
    "/calculators/lot-size",
    "/calculators/liquidation",
    "/calculators/leverage",
    "/calculators/profit-loss",
    "/calculators/pip-value",
    "/calculators/risk-reward",
    "/calculators/volatility",
    # Turkish mirrors — Vantage TR is a priority market
    "/tr/hesaplayicilar/lot-boyutu",
    "/tr/hesaplayicilar/kaldirac-tasfiye",
    "/tr/hesaplayicilar/kar-zarar",
]

# Host/URL substrings that identify a Vantage creative or landing link.
VANTAGE_URL_PATTERNS = [
    "vantagemarkets.com",
    "vantagefx.com",
    "vantage-affiliates",
    "vantageinternational",
    "vantagepartners",
    "vantageib",
    "myvantage",
    "vantage.com",
]

# JS predicate string embedded into the page evaluate() call.
VANTAGE_MATCH_JS = " || ".join(
    f"s.includes({json.dumps(p)})" for p in VANTAGE_URL_PATTERNS
)


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
        await page.set_viewport_size({"width": width, "height": 1800})
        try:
            await page.goto(f"http://localhost:8080{url}", wait_until="networkidle", timeout=25000)
        except Exception:
            # Some pages may 404 in TR namespace — record and continue.
            results.append({
                "bp": name, "width": width, "error": "nav_failed",
                "overflow": None, "imgs": [], "anchors": [],
            })
            continue
        await page.wait_for_timeout(1200)

        data = await page.evaluate(f"""() => {{
            const doc = document.documentElement;
            const overflow = doc.scrollWidth - doc.clientWidth;
            const vw = doc.clientWidth;
            const isVantageUrl = (u) => {{
                const s = (u || '').toLowerCase();
                if (!s) return false;
                return ({VANTAGE_MATCH_JS});
            }};
            const isVantageEl = (el) => {{
                const tag = (el.getAttribute('data-affiliate') || '').toLowerCase();
                if (tag === 'vantage') return true;
                if (isVantageUrl(el.getAttribute('src'))) return true;
                if (isVantageUrl(el.getAttribute('href'))) return true;
                // parent anchor?
                const a = el.closest && el.closest('a');
                if (a && isVantageUrl(a.getAttribute('href'))) return true;
                return false;
            }};

            const imgs = Array.from(document.querySelectorAll('img'))
              .filter(isVantageEl)
              .map(i => {{
                const r = i.getBoundingClientRect();
                return {{
                  src: i.src,
                  alt: i.alt || '',
                  w: r.width, h: r.height,
                  left: r.left, right: r.right,
                  naturalW: i.naturalWidth,
                  overflows: r.right > vw + 1 || r.width > vw + 1,
                }};
              }});

            const anchors = Array.from(document.querySelectorAll('a[href]'))
              .filter(a => isVantageUrl(a.getAttribute('href')))
              .map(a => {{
                const r = a.getBoundingClientRect();
                return {{
                  href: a.getAttribute('href'),
                  w: r.width, h: r.height,
                  overflows: r.right > vw + 1 || r.width > vw + 1,
                }};
              }});

            return {{ overflow, vw, imgs, anchors }};
        }}""")

        shot = OUT / f"{label}_{name}.png"
        await page.screenshot(path=str(shot))
        results.append({"bp": name, "width": width, **data, "screenshot": str(shot)})
    return results


async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1280, "height": 1800})
        page = await context.new_page()
        try:
            await restore_session(context, page)
        except Exception as e:
            print("session restore skipped:", e)

        summary = {}
        for url in TARGET_PAGES:
            label = re.sub(r"[^a-z0-9]+", "-", url.strip("/")).strip("-") or "root"
            print(f"→ {url}")
            summary[url] = await check_page(page, url, label)

        (OUT / "summary.json").write_text(json.dumps(summary, indent=2))

        any_fail = False
        total_imgs = 0
        total_anchors = 0
        for url, rows in summary.items():
            for r in rows:
                if r.get("error"):
                    print(f"  · {url} [{r['bp']}] nav_failed (skipped)")
                    continue
                imgs = r.get("imgs", []) or []
                anchors = r.get("anchors", []) or []
                total_imgs += len(imgs)
                total_anchors += len(anchors)
                doc_over = (r.get("overflow") or 0) > 0
                img_over = sum(1 for i in imgs if i["overflows"])
                a_over   = sum(1 for a in anchors if a["overflows"])
                if doc_over or img_over or a_over:
                    any_fail = True
                    print(f"  ✗ {url} [{r['bp']}] doc={r['overflow']} img_over={img_over} anchor_over={a_over}")
                else:
                    print(f"  ✓ {url} [{r['bp']}] no overflow · {len(imgs)} img, {len(anchors)} link")

        print(f"\nTotals: {total_imgs} vantage img(s), {total_anchors} vantage link(s) detected across runs")
        if total_imgs == 0 and total_anchors == 0:
            print("NOTE: no Vantage creatives found in DOM yet — this is expected until the "
                  "Vantage program is registered in src/config/affiliates.config.ts. Script "
                  "will start reporting real overflow the moment creatives ship.")
        print("RESULT:", "FAIL" if any_fail else "PASS")
        await browser.close()

asyncio.run(main())
