import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

SCREENSHOTS = Path("/tmp/browser/ads_regression")
SCREENSHOTS.mkdir(parents=True, exist_ok=True)

# Test the DCA calculator for ad rendering
CALC = {"name": "dca", "url": "http://localhost:8080/calculators/dca"}

async def audit(browser, vp_config):
    vp_name = vp_config["name"]
    context = await browser.new_context(viewport={"width": vp_config["width"], "height": vp_config["height"]})
    page = await context.new_page()
    
    print(f"[{vp_name}] Navigating to DCA...")
    await page.goto(CALC["url"], wait_until="networkidle")
    
    # Inject test flags:
    # 1. Bypass SlotB animations
    # 2. Reset cooldowns
    # 3. Suppress the 1.5s flash guard in orchestrator by forcing pageReady true immediately (via internal state manipulation if we could, but we wait instead)
    await page.evaluate("""() => {
        window.__TEST_NO_ANIM__ = true;
        sessionStorage.setItem('aff_cooldown_until', '0');
        // We can't easily force pageReady true inside the hook without HMR or code change,
        // so we simply wait for it in the audit script.
    }""")
    
    # Pre-fill DCA amount
    print(f"[{vp_name}] Filling investment amount...")
    await page.get_by_label("Total Investment Amount").fill("10000")
    
    # Trigger Calculation
    print(f"[{vp_name}] Triggering calculation...")
    await page.locator("[data-calc-cta='true'] button").click()
    
    # Wait for the Slot B to render. 
    # Flash guard (1.5s) + animation + potential network delay for AI decision.
    # Total wait: ~8s.
    print(f"[{vp_name}] Waiting for Slot B visibility...")
    try:
        # data-slot="B" is a stable attribute for the result-adjacent placement
        await page.wait_for_selector("section[data-slot='B']", state="visible", timeout=12000)
        print(f"[{vp_name}] [PASS] Slot B is visible")
        
        slot_b = page.locator("section[data-slot='B']")
        await slot_b.scroll_into_view_if_needed()
        await page.wait_for_timeout(1000) # Wait for settle
        
        # Take the screenshot
        await slot_b.screenshot(path=str(SCREENSHOTS / f"dca_{vp_name}_slot_b.png"))
        
        # Detect card presence
        card_count = await slot_b.locator("[data-promo-card]").count()
        print(f"[{vp_name}] Found {card_count} promo cards")
        
    except Exception as e:
        print(f"[{vp_name}] [FAIL] Slot B did not appear: {e}")
        # Capture for debug
        await page.screenshot(path=str(SCREENSHOTS / f"DEBUG_{vp_name}_failure.png"))

    await context.close()

async def main():
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(headless=True)
        # Desktop Test
        await audit(browser, {"name": "desktop", "width": 1280, "height": 1800})
        # Mobile Test
        await audit(browser, {"name": "mobile", "width": 375, "height": 812})
        await browser.close()
        print(f"Audit Complete. Screenshots in {SCREENSHOTS}")

if __name__ == "__main__":
    asyncio.run(main())
