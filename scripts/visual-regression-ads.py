import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

SCREENSHOTS = Path("/tmp/browser/ads_regression")
SCREENSHOTS.mkdir(parents=True, exist_ok=True)

async def main():
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(headless=True)
        # 1. Homepage Desktop
        context = await browser.new_context(viewport={"width": 1280, "height": 1800})
        page = await context.new_page()
        print("[home-desktop] Capturing Bybit grid...")
        await page.goto("http://localhost:8080", wait_until="networkidle")
        grid = page.locator("section[data-bybit-campaigns]")
        await grid.scroll_into_view_if_needed()
        await grid.screenshot(path=str(SCREENSHOTS / "home_desktop_bybit.png"))
        await context.close()
        
        # 2. Homepage Mobile
        context = await browser.new_context(viewport={"width": 375, "height": 812})
        page = await context.new_page()
        print("[home-mobile] Capturing Bybit grid...")
        await page.goto("http://localhost:8080", wait_until="networkidle")
        grid = page.locator("section[data-bybit-campaigns]")
        await grid.scroll_into_view_if_needed()
        await grid.screenshot(path=str(SCREENSHOTS / "home_mobile_bybit.png"))
        await context.close()
        
        await browser.close()
        print("Baseline screenshots captured.")

if __name__ == "__main__":
    asyncio.run(main())
