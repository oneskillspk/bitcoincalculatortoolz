import { test } from "@playwright/test";
test("probe", async ({ page }) => {
  await page.addInitScript(() => { localStorage.setItem("bct-consent-v1","granted"); (window as any).__TEST_NO_ANIM__ = true; });
  if (process.env.NOROUTE !== "1") await page.route(/^https?:\/\/(?!localhost)/, (r) => {
    const q = r.request();
    if (q.isNavigationRequest() && q.resourceType() === "document") return r.abort();
    return r.continue();
  });
  await page.goto("http://localhost:8080/calculators/dca", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(3000);
  for (const f of [0.25,0.5,0.75,1]) { await page.evaluate((y)=>window.scrollTo(0,document.body.scrollHeight*y), f); await page.waitForTimeout(800); }
  await page.waitForTimeout(3000);
  console.log("ALL", await page.evaluate(() => Array.from(document.querySelectorAll('[data-affiliate-zone],[data-slot]')).map(e => e.getAttribute('data-affiliate-zone')||('slot'+e.getAttribute('data-slot')))));
  console.log("anchors", await page.locator('[data-affiliate-zone="post-result"] a[href^="http"]').count());
});
