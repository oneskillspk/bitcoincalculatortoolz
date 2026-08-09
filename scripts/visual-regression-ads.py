import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

SCREENSHOTS = Path("/tmp/browser/ads_regression")
SCREENSHOTS.mkdir(parents=True, exist_ok=True)

# Just test DCA as it's the gold standard for Slot B
CALC = {"name": "dca", "url": "http://localhost:8080/calculators/dca"}

async def audit(browser, vp_config):
    vp_name = vp_config["name"]
    context = await browser.new_context(viewport={"width": vp_config["width"], "height": vp_config["height"]})
    page = await context.new_page()
    
    print(f"[{vp_name}] Navigating to DCA...")
    await page.goto(CALC["url"], wait_until="networkidle")
    
    await page.evaluate("window.__TEST_NO_ANIM__ = true; sessionStorage.setItem('aff_cooldown_until', '0');")
    
    # Fill form
    print(f"[{vp_name}] Filling form...")
    # Target by label or placeholder
    await page.fill("input[placeholder*='amount']", "10000")
    
    # Click calculate
    print(f"[{vp_name}] Clicking calculate...")
    await page.click("button:has-text('Calculate')")
    
    # Wait for results panel or Slot B
    print(f"[{vp_name}] Waiting for Slot B...")
    try:
        # Give it a bit more time for flash guard and network
        await page.wait_for_selector("section[data-slot='B']", timeout=12000)
        print(f"[{vp_name}] [PASS] Slot B detected")
        
        slot_b = page.locator("section[data-slot='B']")
        await slot_b.scroll_into_view_if_needed()
        await page.wait_for_timeout(1000)
        await slot_b.screenshot(path=str(SCREENSHOTS / f"dca_{vp_name}_slot_b.png"))
        
        # Verify card rendering
        cards = await slot_b.locator("[data-promo-card]").count()
        print(f"[{vp_name}] Found {cards} promo cards in Slot B")
        
    except Exception as e:
        print(f"[{vp_name}] [FAIL] Slot B not found")
        await page.screenshot(path=str(SCREENSHOTS / f"FAIL_dca_{vp_name}.png"))

    await context.close()

async def main():
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(headless=True)
        # Desktop
        await audit(browser, {"name": "desktop", "width": 1280, "height": 1800})
        # Mobile
        await audit(browser, {"name": "mobile", "width": 375, "height": 812})
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
