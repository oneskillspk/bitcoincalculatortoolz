import asyncio
import os
from pathlib import Path
from playwright.async_api import async_playwright

SCREENSHOTS = Path("/tmp/browser/ads_regression")
SCREENSHOTS.mkdir(parents=True, exist_ok=True)

# Test a subset of high-traffic calculators that are already migrated to Slot B
CALCULATORS = [
    {"name": "dca", "url": "http://localhost:8080/calculators/dca"},
    {"name": "profit-loss", "url": "http://localhost:8080/calculators/profit-loss"},
]

VIEWPORTS = [
    {"name": "desktop", "width": 1280, "height": 1800},
    {"name": "mobile", "width": 375, "height": 812},
]

async def audit_calc(browser, calc, viewport_config):
    # Fresh context for each run
    context = await browser.new_context(
        viewport={"width": viewport_config["width"], "height": viewport_config["height"]}
    )
    page = await context.new_page()
    
    calc_name = calc["name"]
    vp_name = viewport_config["name"]
    
    print(f"Auditing {calc_name} on {vp_name}...")
    
    try:
        # Load page - use domcontentloaded for speed since we bypass timers manually
        await page.goto(calc["url"], wait_until="domcontentloaded", timeout=15000)
        
        # Inject test bypasses:
        # 1. No animation for SlotB
        # 2. Reset cooldown session storage
        # 3. Suppress the 1.5s flash guard by marking page as ready immediately if possible
        #    (Orchestrator uses pageReady state which is local to the hook, but we can bypass timers)
        await page.evaluate("""() => {
            window.__TEST_NO_ANIM__ = true;
            sessionStorage.setItem('aff_cooldown_until', '0');
        }""")
        
        # 1. Slot A Check (Pre-calc)
        # Note: Slot A requires 12s idle or manual trigger. We don't wait 12s.
        # We focus on Slot B (Result Adjacent) as per user request.

        # 2. Trigger Calculation for Slot B
        # Standard input fill
        input_amount = await page.get_by_label("Amount", exact=False).first
        if await input_amount.is_visible():
            await input_amount.fill("10000")
        
        # Click Calculate
        cta = page.locator("[data-calc-cta='true'] button, button:has-text('Calculate')").first
        if await cta.is_visible():
            await cta.click()
            print(f"  Calculation triggered for {calc_name}")
        
        # Wait for Slot B to appear
        # We wait up to 5s. In real app SlotB has 200ms delay + 1.5s flash guard.
        try:
            await page.wait_for_selector("section[data-slot='B']", timeout=6000)
            print(f"  [PASS] Slot B detected on {calc_name} ({vp_name})")
            
            # Screenshot Slot B
            slot_b = page.locator("section[data-slot='B']")
            await slot_b.scroll_into_view_if_needed()
            await page.wait_for_timeout(500) # Small settle time for any lazy images
            await slot_b.screenshot(path=str(SCREENSHOTS / f"{calc_name}_{vp_name}_slot_b.png"))
            
            # Verify children (PromoGrid)
            promo_grid = slot_b.locator("[data-promo-grid]")
            if await promo_grid.count() > 0:
                print(f"  [PASS] PromoGrid found inside Slot B")
            else:
                print(f"  [WARN] Slot B is visible but [data-promo-grid] missing (possible fallback format)")
                
        except Exception as e:
            print(f"  [FAIL] Slot B NOT detected on {calc_name} ({vp_name}) within timeout")
            # Take full page screenshot for debugging failures
            await page.screenshot(path=str(SCREENSHOTS / f"FAIL_{calc_name}_{vp_name}.png"))

    except Exception as e:
        print(f"  [ERROR] Audit crashed for {calc_name}: {e}")
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
