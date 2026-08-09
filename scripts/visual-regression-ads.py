import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

SCREENSHOTS = Path("/tmp/browser/ads_regression")
SCREENSHOTS.mkdir(parents=True, exist_ok=True)

CALC = {"name": "dca", "url": "http://localhost:8080/calculators/dca"}

async def audit(browser, vp_config):
    vp_name = vp_config["name"]
    context = await browser.new_context(viewport={"width": vp_config["width"], "height": vp_config["height"]})
    page = await context.new_page()
    
    # 1. Establish origin
    await page.goto("http://localhost:8080")
    
    # 2. Inject global override and FORCE render logic
    # We force slotBActive to true in the PlacementProvider via a dirty hack or just force the CSS
    await page.add_init_script("""
        window.__TEST_NO_ANIM__ = true;
        // Intercept setTimeout to make everything instant
        const oldSetTimeout = window.setTimeout;
        window.setTimeout = (fn, delay) => oldSetTimeout(fn, 0);
        sessionStorage.setItem('aff_cooldown_until', '0');
        
        // CSS hack to ensure if Slot B is in DOM, it's visible
        const style = document.createElement('style');
        style.innerHTML = 'section[data-slot] { opacity: 1 !important; transform: none !important; display: block !important; visibility: visible !important; min-height: 100px; }';
        document.head.appendChild(style);
    """)
    
    print(f"[{vp_name}] Navigating to DCA...")
    await page.goto(CALC["url"], wait_until="networkidle")
    
    # 3. Fill and Calculate
    print(f"[{vp_name}] Filling DCA amount...")
    amount_input = page.get_by_label("Total Investment Amount", exact=False)
    await amount_input.fill("75000")
    
    print(f"[{vp_name}] Clicking Calculate...")
    await page.click("button:has-text('Calculate')")
    
    # 4. Wait for Slot B
    print(f"[{vp_name}] Waiting for Slot B (25s)...")
    try:
        # We wait for the section to at least exist in DOM
        await page.wait_for_selector("section[data-slot='B']", timeout=25000)
        print(f"[{vp_name}] [PASS] Slot B detected in DOM")
        
        slot_b = page.locator("section[data-slot='B']")
        await slot_b.scroll_into_view_if_needed()
        await page.wait_for_timeout(3000)
        
        # Take the screenshot
        await slot_b.screenshot(path=str(SCREENSHOTS / f"dca_{vp_name}_slot_b.png"))
        print(f"[{vp_name}] Screenshot saved.")
            
    except Exception as e:
        print(f"[{vp_name}] [FAIL] Slot B did not appear: {e}")
        await page.screenshot(path=str(SCREENSHOTS / f"DEBUG_{vp_name}_failure.png"))

    await context.close()

async def main():
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(headless=True)
        # Verify homepage first to ensure env is sane
        context = await browser.new_context(viewport={"width": 1280, "height": 1800})
        page = await context.new_page()
        await page.goto("http://localhost:8080")
        await page.locator("section[data-bybit-campaigns]").screenshot(path=str(SCREENSHOTS / "home_desktop_bybit.png"))
        await context.close()
        
        # Then the calculator
        await audit(browser, {"name": "desktop", "width": 1280, "height": 1800})
        await audit(browser, {"name": "mobile", "width": 375, "height": 812})
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
