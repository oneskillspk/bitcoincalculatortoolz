import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

SCREENSHOTS = Path("/tmp/browser/ads_regression")
SCREENSHOTS.mkdir(parents=True, exist_ok=True)

# Test a single calculator for ad rendering
CALC = {"name": "dca", "url": "http://localhost:8080/calculators/dca"}

async def audit(browser, vp_config):
    vp_name = vp_config["name"]
    context = await browser.new_context(viewport={"width": vp_config["width"], "height": vp_config["height"]})
    page = await context.new_page()
    
    # 1. Establish origin
    await page.goto("http://localhost:8080")
    
    # 2. Inject global override for the flash guard and anims
    # We redefine setTimeout to immediately fire the FLASH_GUARD_MS (1500) 
    # and IDLE_HINT_MS (12000) timers if they look like they belong to our ad code.
    await page.add_init_script("""
        window.__TEST_NO_ANIM__ = true;
        const oldSetTimeout = window.setTimeout;
        window.setTimeout = (fn, delay) => {
            if (delay === 1500 || delay === 12000 || delay === 200 || delay === 250) {
                return oldSetTimeout(fn, 0);
            }
            return oldSetTimeout(fn, delay);
        };
        sessionStorage.setItem('aff_cooldown_until', '0');
    """)
    
    print(f"[{vp_name}] Navigating to DCA...")
    await page.goto(CALC["url"], wait_until="networkidle")
    
    # 3. Fill and Calculate
    print(f"[{vp_name}] Filling DCA amount...")
    amount_input = page.get_by_label("Total Investment Amount", exact=False)
    await amount_input.fill("50000")
    
    print(f"[{vp_name}] Clicking Calculate...")
    await page.click("button:has-text('Calculate')")
    
    # 4. Wait for Slot B
    print(f"[{vp_name}] Waiting for Slot B (10s)...")
    try:
        await page.wait_for_selector("section[data-slot='B']", timeout=10000, state="visible")
        print(f"[{vp_name}] [PASS] Slot B visible")
        
        slot_b = page.locator("section[data-slot='B']")
        await slot_b.scroll_into_view_if_needed()
        await page.wait_for_timeout(1000)
        
        # Take the screenshot
        await slot_b.screenshot(path=str(SCREENSHOTS / f"dca_{vp_name}_slot_b.png"))
        
        # Check for Bybit
        bybit_card = slot_b.locator("[data-promo-card='bybit']")
        if await bybit_card.count() > 0:
            print(f"[{vp_name}] Bybit card detected")
        else:
            cards = await slot_b.locator("[data-promo-card]").all()
            ids = [await c.get_attribute("data-promo-card") for c in cards]
            print(f"[{vp_name}] Other cards detected: {ids}")
            
    except Exception as e:
        print(f"[{vp_name}] [FAIL] Slot B did not appear: {e}")
        await page.screenshot(path=str(SCREENSHOTS / f"DEBUG_{vp_name}_failure.png"))

    await context.close()

async def main():
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(headless=True)
        await audit(browser, {"name": "desktop", "width": 1280, "height": 1800})
        await audit(browser, {"name": "mobile", "width": 375, "height": 812})
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
