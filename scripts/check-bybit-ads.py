import asyncio
import json
from pathlib import Path
from playwright.async_api import async_playwright

SCREENSHOTS = Path("/tmp/browser/bybit_ads")
SCREENSHOTS.mkdir(parents=True, exist_ok=True)

async def main():
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1280, "height": 1800})
        page = await context.new_page()

        # Check Homepage Grid First (it was working)
        print("Navigating to Homepage...")
        await page.goto("http://localhost:8080/", wait_until="networkidle")
        grid = await page.query_selector("section[data-bybit-campaigns]")
        if grid:
            print("Homepage Bybit Grid found.")
            await grid.scroll_into_view_if_needed()
            await page.wait_for_timeout(500)
            await grid.screenshot(path=str(SCREENSHOTS / "home_bybit_grid.png"))
        else:
            print("Homepage Bybit Grid NOT found.")

        # Check DCA Calculator
        print("Navigating to DCA Calculator...")
        await page.goto("http://localhost:8080/calculators/dca", wait_until="networkidle")
        
        # Inject state
        await page.evaluate("""() => {
            window.__TEST_NO_ANIM__ = true;
            // Force the orchestrator to think page is ready and no cooldown
            sessionStorage.setItem('aff_cooldown_until', '0');
        }""")
        
        print("Filling form and triggering calculation...")
        # Fill in values to ensure button is enabled and results are generated
        await page.fill("input[placeholder*='amount']", "5000")
        await page.fill("input[placeholder*='frequency']", "7")
        await page.click("button:has-text('Calculate')")
        
        # Wait for the results panel to appear first
        print("Waiting for Result Panel...")
        try:
            await page.wait_for_selector("[data-testid='result-panel']", timeout=5000)
            print("Result panel detected.")
        except:
            print("Result panel not found, checking with standard button click again...")
            await page.click("button:has-text('Calculate')")
            await page.wait_for_timeout(1000)

        # SlotB has a 200ms delay + 1.5s flash guard in orchestrator
        print("Waiting for Slot B (allowing 3s for flash guard + delay)...")
        await page.wait_for_timeout(3000)
        
        # Take a full page screenshot to see where we are
        await page.screenshot(path=str(SCREENSHOTS / "dca_full_page_after_calc.png"))
        
        # Try to find any affiliate placement
        placements = await page.query_selector_all("section[data-affiliate-placement]")
        print(f"Found {len(placements)} affiliate placements on page.")
        for i, p in enumerate(placements):
            zone = await p.get_attribute("data-affiliate-zone")
            state = await p.get_attribute("data-affiliate-state")
            print(f"Placement {i}: Zone={zone}, State={state}")
            await p.screenshot(path=str(SCREENSHOTS / f"placement_{zone}_{i}.png"))

        # Specifically check if Slot B exists
        slot_b = await page.query_selector("section[data-affiliate-zone='B']")
        if slot_b:
            print("Slot B detected.")
            await slot_b.scroll_into_view_if_needed()
            await page.wait_for_timeout(500)
            await slot_b.screenshot(path=str(SCREENSHOTS / "dca_slot_b_detected.png"))
            
            # Check for Bybit card
            bybit_card = await slot_b.query_selector("[data-promo-card='bybit']")
            if bybit_card:
                print("Bybit card found in Slot B.")
                await bybit_card.screenshot(path=str(SCREENSHOTS / "dca_bybit_card_detail.png"))
            else:
                print("Bybit card NOT found in Slot B.")
        else:
            print("Slot B NOT detected.")

        await browser.close()
        print("Audit complete.")

if __name__ == "__main__":
    asyncio.run(main())
