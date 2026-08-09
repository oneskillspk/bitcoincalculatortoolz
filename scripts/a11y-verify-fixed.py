import asyncio
import os
import json
from pathlib import Path
from playwright.async_api import async_playwright

async def run_audit():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        # Ensure axe-core is available or we inject it
        # Actually, let's just check the DOM for the attributes we added
        context = await browser.new_context(viewport={"width": 1280, "height": 1800})
        page = await context.new_page()
        
        routes = ["/calculators/dca", "/calculators/investment"]
        results = {}

        for route in routes:
            url = f"http://localhost:8080{route}"
            await page.goto(url, wait_until="networkidle")
            
            # 1. Check SelectTriggers have aria-labels
            triggers_missing_labels = await page.evaluate("""() => {
                const triggers = Array.from(document.querySelectorAll('button[role="combobox"]'));
                return triggers.filter(t => !t.getAttribute('aria-label') && !t.innerText.trim()).length;
            }""")
            
            # 2. Check main containers have aria-labelledby/describedby
            sections_check = await page.evaluate("""() => {
                const sections = Array.from(document.querySelectorAll('section[aria-labelledby]'));
                return sections.length;
            }""")

            results[route] = {
                "missing_labels": triggers_missing_labels,
                "accessible_sections": sections_check
            }
            print(f"Route {route}: {results[route]}")

        await browser.close()
        return results

if __name__ == "__main__":
    asyncio.run(run_audit())
