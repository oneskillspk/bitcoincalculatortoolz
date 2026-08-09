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
        
        # Capture full viewport initially
        await page.screenshot(path=str(SCREENSHOTS / "dca_1_initial.png"))
        
        print("Triggering calculation...")
        # Use more robust button selection
        await page.evaluate("window.__TEST_NO_ANIM__ = true")
        await page.click("button:has-text('Calculate')")
        await page.wait_for_timeout(1000)
            
        # Inspect Slot B
        slot_b = await page.query_selector("[data-slot='B']")
        if slot_b:
            print("Slot B detected.")
            # Scroll it into view
            await slot_b.scroll_into_view_if_needed()
            await page.wait_for_timeout(500)
            await slot_b.screenshot(path=str(SCREENSHOTS / "dca_2_slot_b.png"))
            
            # Find Bybit cards specifically
            bybit_cards = await slot_b.query_selector_all("[data-promo-card='bybit']")
            print(f"Found {len(bybit_cards)} Bybit cards in Slot B.")
            for i, card in enumerate(bybit_cards):
                await card.screenshot(path=str(SCREENSHOTS / f"dca_3_bybit_card_{i}.png"))
        else:
            print("Slot B not detected. Capturing post-calc viewport.")
            await page.screenshot(path=str(SCREENSHOTS / "dca_2_post_calc_fail.png"))

        # Check Home Page
        print("Navigating to Homepage...")
        await page.goto("http://localhost:8080/", wait_until="networkidle")
        await page.wait_for_timeout(1000)
        
        bybit_grid = await page.query_selector("section[data-bybit-campaigns]")
        if bybit_grid:
            print("Homepage Bybit Grid found.")
            await bybit_grid.scroll_into_view_if_needed()
            await page.wait_for_timeout(500)
            await bybit_grid.screenshot(path=str(SCREENSHOTS / "home_1_bybit_grid.png"))
            
            cards = await bybit_grid.query_selector_all("[data-promo-card='bybit']")
            for i, card in enumerate(cards):
                await card.screenshot(path=str(SCREENSHOTS / f"home_2_bybit_card_{i}.png"))
        else:
            print("Homepage grid not found. Capturing bottom area.")
            await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            await page.wait_for_timeout(1000)
            await page.screenshot(path=str(SCREENSHOTS / "home_bottom.png"))

        await browser.close()
        print("Audit complete.")

if __name__ == "__main__":
    asyncio.run(main())
