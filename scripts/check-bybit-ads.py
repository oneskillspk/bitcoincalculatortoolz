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

        # Check DCA Calculator - it's a primary target for Slot V2
        print("Navigating to DCA Calculator...")
        await page.goto("http://localhost:8080/calculators/dca", wait_until="networkidle")
        
        # Look for the PromoCard with Bybit content
        # Usually these have specific IDs or data-affiliate attributes
        ads_selector = "[data-affiliate='bybit']"
        
        # Wait for potential lazy loading or calculations to trigger SlotB
        # For SlotB (ResultAdjacent), we might need to click Calculate
        print("Checking for SlotA (Pre-Calc)...")
        slot_a = await page.query_selector("[data-slot='A']")
        if slot_a:
            print("SlotA found.")
            await slot_a.screenshot(path=str(SCREENSHOTS / "dca_slot_a.png"))
        
        print("Triggering calculation to reveal SlotB...")
        calculate_btn = await page.get_by_role("button", name="Calculate").first
        if calculate_btn:
            await calculate_btn.click()
            await page.wait_for_timeout(1000) # Wait for animation/render
            
        print("Checking for SlotB (Result Adjacent)...")
        slot_b = await page.query_selector("[data-slot='B'], .promo-slot-b")
        if slot_b:
            print("SlotB found.")
            await slot_b.screenshot(path=str(SCREENSHOTS / "dca_slot_b.png"))
        else:
            # Fallback check for general promo cards if slot-specific selectors are missing
            print("SlotB selector not found, checking for Bybit cards...")
            bybit_cards = await page.query_selector_all(ads_selector)
            for i, card in enumerate(bybit_cards):
                await card.screenshot(path=str(SCREENSHOTS / f"dca_bybit_card_{i}.png"))
        
        # Check Home Page for the BybitCampaignGrid
        print("Navigating to Homepage...")
        await page.goto("http://localhost:8080/", wait_until="networkidle")
        
        grid = await page.query_selector(".bybit-campaign-grid, [data-testid='bybit-campaign-grid']")
        if grid:
            print("Homepage Bybit Grid found.")
            await grid.screenshot(path=str(SCREENSHOTS / "homepage_bybit_grid.png"))

        await browser.close()
        print("Audit complete. Screenshots saved to /tmp/browser/bybit_ads")

if __name__ == "__main__":
    asyncio.run(main())
