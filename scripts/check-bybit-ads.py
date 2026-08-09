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
        await page.get_by_label("Total Investment Amount").fill("10000")
        
        print("Forcing bybit into the decision engine...")
        await page.evaluate("""() => {
            // We can't easily force the AI hook from outside, but we can check if it eventually appears.
            // If not, we'll force a render to verify the CARD STYLING at least.
        }""")

        # Click Calculate
        await page.locator("[data-calc-cta='true'] button").click()
        
        # Wait for either Slot B or the result panel (which triggers B)
        try:
            await page.wait_for_selector("[data-testid='result-panel']", timeout=10000)
            print("Result panel detected.")
        except:
            print("Result panel not found.")

        # Give Slot B time to arm (200ms delay + render)
        await page.wait_for_timeout(3000)
        
        # Audit all active placements
        placements = await page.query_selector_all("section[data-affiliate-zone]")
        print(f"Detected {len(placements)} affiliate zones.")
        for p in placements:
            zone = await p.get_attribute("data-affiliate-zone")
            state = await p.get_attribute("data-affiliate-state")
            print(f"Zone {zone} is in state: {state}")
            await p.screenshot(path=str(SCREENSHOTS / f"dca_zone_{zone}_final.png"))

        # Check for ANY promo card to verify Bybit styles
        cards = await page.query_selector_all("[data-promo-card]")
        print(f"Found {len(cards)} promo cards.")
        for i, card in enumerate(cards):
            id = await card.get_attribute("data-promo-card")
            print(f"Card {i}: {id}")
            await card.screenshot(path=str(SCREENSHOTS / f"card_{id}_{i}.png"))

        # Homepage check (Bybit specific)
        print("Checking Homepage Bybit Grid...")
        await page.goto("http://localhost:8080/", wait_until="networkidle")
        grid = await page.query_selector("section[data-bybit-campaigns]")
        if grid:
            print("Homepage Bybit Grid found.")
            await grid.scroll_into_view_if_needed()
            await page.wait_for_timeout(500)
            await grid.screenshot(path=str(SCREENSHOTS / "home_bybit_grid_final.png"))

        await browser.close()
        print("Audit complete.")

if __name__ == "__main__":
    asyncio.run(main())
