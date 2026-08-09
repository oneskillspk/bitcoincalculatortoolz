import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

SCREENSHOTS = Path("/tmp/browser/bybit_ads")
SCREENSHOTS.mkdir(parents=True, exist_ok=True)

async def main():
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1280, "height": 1800})
        page = await context.new_page()

        print("Navigating to DCA Calculator...")
        await page.goto("http://localhost:8080/calculators/dca", wait_until="networkidle")
        
        # Capture full viewport initially to see layout
        await page.screenshot(path=str(SCREENSHOTS / "dca_initial.png"))
        
        print("Triggering calculation...")
        # Try finding button by text or role
        try:
            calculate_btn = page.get_by_role("button", name="Calculate").first
            await calculate_btn.click()
            await page.wait_for_timeout(2000)
        except Exception as e:
            print(f"Click failed: {e}")
            
        # Inspect Slot B
        slot_b = await page.query_selector("[data-slot='B']")
        if slot_b:
            print("Slot B detected.")
            await slot_b.screenshot(path=str(SCREENSHOTS / "dca_slot_b.png"))
        else:
            print("Slot B not detected by selector, capturing below CTA area.")
            # Capture the area where it SHOULD be
            await page.screenshot(path=str(SCREENSHOTS / "dca_post_calc_area.png"))

        # Check Home Page
        print("Navigating to Homepage...")
        await page.goto("http://localhost:8080/", wait_until="networkidle")
        await page.wait_for_timeout(1000)
        
        bybit_grid = await page.query_selector(".bybit-campaign-grid")
        if bybit_grid:
            print("Homepage Bybit Grid found.")
            await bybit_grid.screenshot(path=str(SCREENSHOTS / "homepage_bybit_grid.png"))
        else:
            # Maybe it's further down?
            await page.evaluate("window.scrollTo(0, 1000)")
            await page.wait_for_timeout(500)
            await page.screenshot(path=str(SCREENSHOTS / "homepage_scroll.png"))

        await browser.close()
        print("Audit complete.")

if __name__ == "__main__":
    asyncio.run(main())
