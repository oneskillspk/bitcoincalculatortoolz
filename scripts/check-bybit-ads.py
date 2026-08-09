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
        
        print("Filling form...")
        await page.get_by_label("Total Investment Amount").fill("10000")
        
        # Click Calculate
        print("Clicking Calculate...")
        await page.locator("[data-calc-cta='true'] button").click()
        
        # Wait for either Slot B or the result panel
        print("Waiting for Result Panel...")
        try:
            # Result panel usually shows quickly
            await page.wait_for_selector("[data-testid='result-panel']", timeout=10000)
            print("Result panel detected.")
        except:
            # Fallback if testid is missing or name differs (it might be data-testid or just a class)
            print("Result panel wait timed out. Checking for any calculation results...")
        
        # Slot B has a 200ms delay + 1.5s flash guard
        print("Waiting for Slot B to arm (3s)...")
        await page.wait_for_timeout(3000)
        
        # Check all placements
        placements = await page.query_selector_all("section[data-affiliate-zone]")
        print(f"Detected {len(placements)} affiliate zones.")
        for p in placements:
            zone = await p.get_attribute("data-affiliate-zone")
            format = await p.get_attribute("data-affiliate-format")
            print(f"Zone {zone}: format={format}")
            await p.screenshot(path=str(SCREENSHOTS / f"dca_zone_{zone}.png"))

        # Homepage check
        print("Checking Homepage Bybit Grid...")
        await page.goto("http://localhost:8080/", wait_until="networkidle")
        grid = await page.query_selector("section[data-bybit-campaigns]")
        if grid:
            print("Homepage Bybit Grid found.")
            await grid.screenshot(path=str(SCREENSHOTS / "home_bybit_grid_final.png"))

        await browser.close()
        print("Audit complete.")

if __name__ == "__main__":
    asyncio.run(main())
