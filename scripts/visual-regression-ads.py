import asyncio
import os
from pathlib import Path
from playwright.async_api import async_playwright

SCREENSHOTS = Path("/tmp/browser/ads_regression")
SCREENSHOTS.mkdir(parents=True, exist_ok=True)

CALCULATORS = [
    {"name": "dca", "url": "http://localhost:8080/calculators/dca"},
    {"name": "profit-loss", "url": "http://localhost:8080/calculators/profit-loss"},
]

VIEWPORTS = [
    {"name": "desktop", "width": 1280, "height": 1800},
    {"name": "mobile", "width": 375, "height": 812},
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
        await page.goto(calc["url"], wait_until="domcontentloaded", timeout=15000)
        
        await page.evaluate("""() => {
            window.__TEST_NO_ANIM__ = true;
            sessionStorage.setItem('aff_cooldown_until', '0');
        }""")
        
        # Fill amount if exists
        inputs = page.locator("input[placeholder*='amount'], input[placeholder*='Investment'], input[type='number']").first
        if await inputs.is_visible():
            await inputs.fill("10000")
        
        # Click Calculate
        cta = page.locator("[data-calc-cta='true'] button, button:has-text('Calculate')").first
        if await cta.is_visible():
            await cta.click()
            print(f"  Calculation triggered")
        
        # Wait for Slot B
        try:
            await page.wait_for_selector("section[data-slot='B']", timeout=8000)
            print(f"  [PASS] Slot B detected")
            
            slot_b = page.locator("section[data-slot='B']")
            await slot_b.scroll_into_view_if_needed()
            await page.wait_for_timeout(1000)
            await slot_b.screenshot(path=str(SCREENSHOTS / f"{calc_name}_{vp_name}_slot_b.png"))
        except:
            print(f"  [FAIL] Slot B timeout")
            await page.screenshot(path=str(SCREENSHOTS / f"FAIL_{calc_name}_{vp_name}.png"))

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
