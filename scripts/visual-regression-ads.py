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
    
    print(f"[{vp_name}] Navigating to DCA...")
    await page.goto(CALC["url"], wait_until="networkidle")
    
    # Inject test flags
    await page.evaluate("""() => {
        window.__TEST_NO_ANIM__ = true;
        sessionStorage.setItem('aff_cooldown_until', '0');
        localStorage.removeItem('aff_seen');
    }""")
    
    # Pre-fill DCA amount
    print(f"[{vp_name}] Filling DCA amount...")
    amount_input = page.get_by_label("Total Investment Amount", exact=False)
    await amount_input.fill("10000")
    
    # Trigger Calculation
    print(f"[{vp_name}] Clicking Calculate...")
    # Find all buttons and click the one that looks like Calculate
    buttons = await page.query_selector_all("button")
    for btn in buttons:
        text = await btn.inner_text()
        if "Calculate" in text:
            await btn.click()
            break
    
    # Wait for result panel
    print(f"[{vp_name}] Waiting for result panel...")
    try:
        # Most results have a specific structure or heading
        await page.wait_for_selector("h2:has-text('Result'), h3:has-text('Result'), .calc-surface-card", timeout=10000)
        print(f"[{vp_name}] Result panel detected")
    except:
        print(f"[{vp_name}] Result panel not found, continuing anyway...")

    # Wait for the Slot B to render. 
    # Flash guard (1.5s) + animation + potential network delay for AI decision.
    print(f"[{vp_name}] Waiting for Slot B visibility...")
    try:
        # The section has data-slot="B"
        await page.wait_for_selector("section[data-slot='B']", timeout=15000)
        print(f"[{vp_name}] [PASS] Slot B visible")
        
        slot_b = page.locator("section[data-slot='B']")
        await slot_b.scroll_into_view_if_needed()
        await page.wait_for_timeout(2000)
        
        # Take the screenshot
        await slot_b.screenshot(path=str(SCREENSHOTS / f"dca_{vp_name}_slot_b.png"))
        
        # Log cards
        card_count = await slot_b.locator("[data-promo-card]").count()
        print(f"[{vp_name}] Found {card_count} promo cards")
        
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
