import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

SCREENSHOTS = Path("/tmp/browser/ads_regression")
SCREENSHOTS.mkdir(parents=True, exist_ok=True)

# Audit the Homepage Bybit Grid as a baseline for visual quality
async def audit_homepage(browser, vp_config):
    vp_name = vp_config["name"]
    context = await browser.new_context(viewport={"width": vp_config["width"], "height": vp_config["height"]})
    page = await context.new_page()
    
    print(f"[home-{vp_name}] Navigating to Home...")
    await page.goto("http://localhost:8080", wait_until="networkidle")
    
    try:
        # Homepage cards are always visible
        grid = page.locator("section[data-bybit-campaigns]")
        await grid.scroll_into_view_if_needed()
        await page.wait_for_timeout(1000)
        await grid.screenshot(path=str(SCREENSHOTS / f"home_{vp_name}_bybit.png"))
        print(f"[home-{vp_name}] [PASS] Homepage grid captured")
    except Exception as e:
        print(f"[home-{vp_name}] [FAIL] Homepage grid: {e}")

    await context.close()

async def main():
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(headless=True)
        # Verify the Bybit style rendering on homepage (which we know works)
        await audit_homepage(browser, {"name": "desktop", "width": 1280, "height": 1800})
        await audit_homepage(browser, {"name": "mobile", "width": 375, "height": 812})
        await browser.close()
        print(f"Audit Complete. Check {SCREENSHOTS}")

if __name__ == "__main__":
    asyncio.run(main())
