import asyncio
import os
from pathlib import Path
from playwright.async_api import async_playwright

SCREENSHOTS = Path("/tmp/browser/ads_regression")
SCREENSHOTS.mkdir(parents=True, exist_ok=True)

CALCULATORS = [
    {"name": "dca", "url": "http://localhost:8080/calculators/dca"},
]

VIEWPORTS = [
    {"name": "desktop", "width": 1280, "height": 1800},
]

async def audit_calc(browser, calc, viewport_config):
    context = await browser.new_context(
        viewport={"width": viewport_config["width"], "height": viewport_config["height"]}
    )
    page = await context.new_page()
    calc_name = calc["name"]
    vp_name = viewport_config["name"]
    
    print(f"Auditing {calc_name} on {vp_name}...")
    
    try:
        # Increase timeout and wait for networkidle
        await page.goto(calc["url"], wait_until="networkidle", timeout=20000)
        
        # Inject test overrides
        await page.evaluate("""() => {
            window.__TEST_NO_ANIM__ = true;
            sessionStorage.setItem('aff_cooldown_until', '0');
            // Debug logs to console
            console.log('Test overrides injected');
        }""")
        
        # Monitor for Slot B registration in console (SlotB_ResultAdjacent.tsx calls registerSlot('B'))
        # Although registerSlot is dev-only, the component itself mounts.
        
        # Fill DCA form
        print("  Filling DCA form...")
        await page.locator("input[placeholder*='amount']").first.fill("10000")
        
        # Click Calculate
        cta = page.locator("[data-calc-cta='true'] button, button:has-text('Calculate')").first
        await cta.click()
        print("  Calculation clicked")
        
        # Check for results
        await page.wait_for_timeout(2000)
        results = await page.query_selector_all("[data-testid='result-panel'], .result-card")
        print(f"  Results found: {len(results) > 0}")

        # Wait for Slot B
        print("  Waiting for Slot B...")
        try:
            # Try selector that covers the data-slot attribute
            await page.wait_for_selector("section[data-slot='B']", timeout=10000)
            print("  [PASS] Slot B detected")
            slot_b = page.locator("section[data-slot='B']")
            await slot_b.scroll_into_view_if_needed()
            await page.wait_for_timeout(1000)
            await slot_b.screenshot(path=str(SCREENSHOTS / f"{calc_name}_{vp_name}_slot_b.png"))
        except:
            print("  [FAIL] Slot B not found")
            # Take full page to see what's happening
            await page.screenshot(path=str(SCREENSHOTS / f"DEBUG_{calc_name}_{vp_name}.png"))
            # Dump all data-slot sections
            slots = await page.evaluate("() => Array.from(document.querySelectorAll('section[data-slot]')).map(s => s.getAttribute('data-slot'))")
            print(f"  Available slots: {slots}")

    except Exception as e:
        print(f"  [ERROR] Audit crashed: {e}")
    finally:
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
