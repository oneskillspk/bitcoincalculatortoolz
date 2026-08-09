import asyncio
import os
from pathlib import Path
from playwright.async_api import async_playwright

SCREENSHOTS = Path("/tmp/browser/ads_regression")
SCREENSHOTS.mkdir(parents=True, exist_ok=True)

CALCULATORS = [
    {"name": "dca", "url": "http://localhost:8080/calculators/dca", "cta": "button:has-text('Calculate')"},
    {"name": "profit-loss", "url": "http://localhost:8080/calculators/profit-loss", "cta": "button:has-text('Calculate')"},
    {"name": "stack-sats", "url": "http://localhost:8080/calculators/stack-sats-goal", "cta": "button:has-text('Calculate')"},
]

VIEWPORTS = [
    {"name": "desktop", "width": 1280, "height": 1800},
    {"name": "mobile", "width": 375, "height": 812},
]

async def audit_calc(browser, calc, viewport_config):
    context = await browser.new_context(viewport={"width": viewport_config["width"], "height": viewport_config["height"]})
    page = await context.new_page()
    
    calc_name = calc["name"]
    vp_name = viewport_config["name"]
    
    print(f"Auditing {calc_name} on {vp_name}...")
    
    await page.goto(calc["url"], wait_until="networkidle")
    
    # Force state to bypass timers
    await page.evaluate("""() => {
        window.__TEST_NO_ANIM__ = true;
        sessionStorage.setItem('aff_cooldown_until', '0');
    }""")
    
    # Fill any required inputs (generic approach)
    inputs = await page.query_selector_all("input[type='text'], input[type='number']")
    for i in inputs:
        if await i.is_visible():
            try:
                await i.fill("1000")
            except:
                pass

    # Click Calculate
    try:
        # Try to find Calculate button or container
        cta = page.locator("[data-calc-cta='true'] button, " + calc["cta"]).first
        await cta.click()
        print(f"  Clicked Calculate on {calc_name}")
    except Exception as e:
        print(f"  Could not click calculate on {calc_name}: {e}")

    # Wait for results and Slot B
    # Slot B has 200ms delay + 1.5s flash guard in orchestrator
    await page.wait_for_timeout(3000)
    
    # Check for Slot B
    slot_b = await page.query_selector("section[data-affiliate-zone='B']")
    if slot_b:
        print(f"  [PASS] Slot B detected on {calc_name} ({vp_name})")
        await slot_b.scroll_into_view_if_needed()
        await page.wait_for_timeout(500)
        await slot_b.screenshot(path=str(SCREENSHOTS / f"{calc_name}_{vp_name}_slot_b.png"))
    else:
        print(f"  [FAIL] Slot B NOT detected on {calc_name} ({vp_name})")
        await page.screenshot(path=str(SCREENSHOTS / f"{calc_name}_{vp_name}_failed.png"))

    await context.close()

async def main():
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(headless=True)
        
        for vp in VIEWPORTS:
            for calc in CALCULATORS:
                await audit_calc(browser, calc, vp)
                
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
