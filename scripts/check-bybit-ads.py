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
        
        # Inject immediate page ready and calculation state to bypass idle timers
        # and force SlotB to show immediately after clicking.
        await page.evaluate("""() => {
            window.__TEST_NO_ANIM__ = true;
            // Force the orchestrator to think page is ready and 90s have passed
            const now = Date.now();
            sessionStorage.setItem('aff_cooldown_until', '0');
        }""")
        
        print("Triggering calculation...")
        # Fill in a value to ensure button is enabled
        await page.fill("input[placeholder*='amount']", "5000")
        await page.click("button:has-text('Calculate')")
        
        # Wait for the results and SlotB
        print("Waiting for Slot B...")
        try:
            # SlotB has a 200ms delay in code, plus some render time
            await page.wait_for_selector("[data-slot='B']", timeout=5000)
            print("Slot B detected.")
            
            slot_b = await page.query_selector("[data-slot='B']")
            await slot_b.scroll_into_view_if_needed()
            await page.wait_for_timeout(500)
            await slot_b.screenshot(path=str(SCREENSHOTS / "dca_slot_b_bybit.png"))
            
            # Specifically check if Bybit is in the grid
            bybit_card = await slot_b.query_selector("[data-promo-card='bybit']")
            if bybit_card:
                print("Bybit card found in Slot B.")
                await bybit_card.screenshot(path=str(SCREENSHOTS / "dca_bybit_card_detail.png"))
            else:
                print("Bybit card NOT found in Slot B (possibly randomized out).")
        except Exception as e:
            print(f"Slot B check failed: {e}")
            await page.screenshot(path=str(SCREENSHOTS / "dca_error_state.png"))

        # Check Homepage Grid
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

        await browser.close()
        print("Audit complete.")

if __name__ == "__main__":
    asyncio.run(main())
