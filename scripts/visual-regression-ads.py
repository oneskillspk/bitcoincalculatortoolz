import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

SCREENSHOTS = Path("/tmp/browser/ads_regression")
SCREENSHOTS.mkdir(parents=True, exist_ok=True)

# Test a single calculator to confirm Slot B rendering
CALC = {"name": "dca", "url": "http://localhost:8080/calculators/dca"}

async def audit(browser, vp_config):
    vp_name = vp_config["name"]
    context = await browser.new_context(viewport={"width": vp_config["width"], "height": vp_config["height"]})
    page = await context.new_page()
    
    print(f"[{vp_name}] Navigating to DCA...")
    await page.goto(CALC["url"], wait_until="networkidle")
    
    # Inject test flags
    await page.evaluate("""() => {
        window.__TEST_NO_ANIM__ = true;
        sessionStorage.setItem('aff_cooldown_until', '0');
    }""")
    
    # Fill form - targeting specifically via role and name
    print(f"[{vp_name}] Filling DCA amount...")
    amount_input = page.get_by_label("Total Investment Amount", exact=False)
    await amount_input.fill("10000")
    
    # Trigger Calculation
    print(f"[{vp_name}] Clicking Calculate...")
    # Target via the specific container used in ModernDCAInputPanel
    cta = page.locator("[data-calc-cta='true'] button")
    await cta.click()
    
    # We wait longer here to ensure the orchestrator's flash guard (1.5s) and 
    # SlotB's internal 200ms delay pass. Also allowing time for decision logic.
    print(f"[{vp_name}] Waiting for Slot B (10s)...")
    try:
        # Use wait_for_selector for robust presence check
        await page.wait_for_selector("section[data-slot='B']", timeout=12000)
        print(f"[{vp_name}] [PASS] Slot B visible")
        
        slot_b = page.locator("section[data-slot='B']")
        await slot_b.scroll_into_view_if_needed()
        await page.wait_for_timeout(1000)
        
        # Take the screenshot
        await slot_b.screenshot(path=str(SCREENSHOTS / f"dca_{vp_name}_slot_b.png"))
        
        # Log detected cards
        cards = await slot_b.locator("[data-promo-card]").all()
        ids = [await c.get_attribute("data-promo-card") for c in cards]
        print(f"[{vp_name}] Detected cards: {ids}")
        
    except Exception as e:
        print(f"[{vp_name}] [FAIL] Slot B not detected: {e}")
        await page.screenshot(path=str(SCREENSHOTS / f"DEBUG_{vp_name}_failure.png"))

    await context.close()

async def main():
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(headless=True)
        # Desktop
        await audit(browser, {"name": "desktop", "width": 1280, "height": 1800})
        # Mobile
        await audit(browser, {"name": "mobile", "width": 375, "height": 812})
        await browser.close()
        print(f"Audit Complete. Check {SCREENSHOTS}")

if __name__ == "__main__":
    asyncio.run(main())
