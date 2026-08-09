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
        
        # Inject state
        await page.evaluate("""() => {
            window.__TEST_NO_ANIM__ = true;
            sessionStorage.setItem('aff_cooldown_until', '0');
        }""")
        
        print("Interacting with inputs...")
        # Targeting by role and placeholder to be more resilient
        await page.get_by_label("Total Investment Amount").fill("10000")
        
        print("Clicking Calculate...")
        # Target the specifically labeled container from ModernDCAInputPanel
        await page.locator("[data-calc-cta='true'] button").click()
        
        print("Waiting for results and Slot B...")
        # Result panel check
        try:
            await page.wait_for_selector("[data-testid='result-panel']", timeout=5000)
            print("Result panel detected.")
        except:
            print("Result panel not found.")

        # Slot B check (with orchestrated delays in mind)
        await page.wait_for_timeout(3000)
        
        placements = await page.query_selector_all("section[data-affiliate-zone]")
        print(f"Detected {len(placements)} affiliate zones.")
        for p in placements:
            zone = await p.get_attribute("data-affiliate-zone")
            print(f"Zone {zone} is present.")
            await p.screenshot(path=str(SCREENSHOTS / f"dca_zone_{zone}.png"))

        # Homepage check
        print("Checking Homepage Bybit Grid...")
        await page.goto("http://localhost:8080/", wait_until="networkidle")
        grid = await page.query_selector("section[data-bybit-campaigns]")
        if grid:
            print("Homepage Bybit Grid found.")
            await grid.screenshot(path=str(SCREENSHOTS / "home_bybit_grid.png"))

        await browser.close()
        print("Audit complete.")

if __name__ == "__main__":
    asyncio.run(main())
