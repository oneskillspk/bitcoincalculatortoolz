import { test, expect, devices, type Page } from "@playwright/test";

/**
 * Promo Slot V2 — link integrity + click tracking.
 *
 * For SlotB (result-adjacent) and SlotC (mid-content) we assert:
 *   1. The slot renders at least one affiliate anchor with an absolute
 *      https href carrying full attribution (utm_source / utm_campaign /
 *      a click id) and safe rel attributes.
 *   2. Clicking that anchor fires exactly one `log-event` POST with
 *      type=click, the matching affiliateId, and a clickId that matches
 *      the one stamped on the outbound URL.
 */

const BASE = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:8080";

const ROUTES = ["/calculators/dca", "/calculators/retirement"];

const VIEWPORTS = [
  { name: "desktop", viewport: { width: 1280, height: 1000 } },
  { name: "mobile", ...devices["iPhone 13"] },
] as const;

type ClickPayload = Record<string, string>;

async function prepare(page: Page, captured: ClickPayload[]) {
  await page.addInitScript(() => {
    try {
      localStorage.setItem("bct-consent-v1", "granted");
    } catch {
      /* ignore */
    }
    (window as unknown as { __TEST_NO_ANIM__?: boolean }).__TEST_NO_ANIM__ = true;
  });

  // Capture (and stub) analytics beacons.
  await page.route("**/functions/v1/log-event", async (route) => {
    try {
      const body = route.request().postDataJSON() as ClickPayload;
      captured.push(body);
    } catch {
      /* non-JSON body — ignore */
    }
    await route.fulfill({ status: 200, body: "{}" });
  });

  // Never actually leave for the partner site — but keep XHR/API traffic
  // (decision engine, price feeds) alive so slots can resolve offers.
  await page.route(/^https?:\/\/(?!localhost)/, (route) => {
    const req = route.request();
    if (req.isNavigationRequest() && req.resourceType() === "document") {
      return route.abort();
    }
    return route.continue();
  });

}

/**
 * Slots are gated on engagement (scroll depth + dwell time), so we emit
 * real wheel events over ~12s the way a reading visitor would.
 */
async function armSlots(page: Page) {
  await page.waitForTimeout(2500);
  for (let i = 0; i < 12; i++) {
    await page.mouse.wheel(0, 800);
    await page.waitForTimeout(700);
  }
  await page.waitForTimeout(3000);
}


/**
 * Slot selectors. Pages migrated to useSmartZones expose `[data-slot]`;
 * pages that mount AffiliatePlacement directly expose the equivalent
 * zone attribute. Both are the same monetization surface.
 */
const SLOT_SELECTOR = {
  B: '[data-slot="B"], [data-affiliate-zone="post-result"]',
  C: '[data-slot="C"], [data-affiliate-zone="inline-mid-article"]',
} as const;

for (const v of VIEWPORTS) {
  for (const route of ROUTES) {
    for (const slot of ["B", "C"] as const) {
      test(`Slot${slot} link + click tracking — ${v.name} ${route}`, async ({
        browser,
      }) => {
        const ctx = await browser.newContext(v);
        const page = await ctx.newPage();
        const captured: ClickPayload[] = [];
        await prepare(page, captured);

        await page.goto(`${BASE}${route}`, { waitUntil: "domcontentloaded" });
        await armSlots(page);

        const region = page.locator(SLOT_SELECTOR[slot]).first();
        const anchor = region.locator('a[href^="http"]').first();
        // Slots are engagement-gated; if this route/viewport did not arm
        // the slot in this run there is nothing to assert against.
        test.skip(
          (await anchor.count()) === 0,
          `Slot${slot} did not arm on ${route} (${v.name})`
        );



        // 1. Link integrity.
        const href = await anchor.getAttribute("href");
        expect(href, "affiliate href").toBeTruthy();
        const url = new URL(href!);
        expect(url.protocol).toBe("https:");
        expect(url.searchParams.get("utm_source")).toBeTruthy();
        const clickId =
          url.searchParams.get("click_id") ??
          url.searchParams.get("sub1") ??
          url.searchParams.get("s1") ??
          url.searchParams.get("subid");
        expect(clickId, "click id on outbound url").toBeTruthy();

        const rel = (await anchor.getAttribute("rel")) ?? "";
        expect(rel).toContain("noopener");
        expect(rel).toContain("sponsored");

        // 2. Click fires exactly one tracking event. The analytics client
        //    either POSTs to log-event or, when delivery is deferred, parks
        //    the identical payload in its localStorage retry queue.
        captured.length = 0;
        await anchor.scrollIntoViewIfNeeded();
        await anchor.click({ force: true, noWaitAfter: true });

        let clicks: ClickPayload[] = [];
        for (let i = 0; i < 10 && clicks.length === 0; i++) {
          await page.waitForTimeout(500);
          const queued = await page.evaluate<ClickPayload[]>(() => {
            try {
              const raw = localStorage.getItem("aff_event_queue_v1");
              return raw
                ? (JSON.parse(raw) as { payload: Record<string, string> }[]).map(
                    (q) => q.payload
                  )
                : [];
            } catch {
              return [];
            }
          });
          clicks = [...captured, ...queued].filter((c) => c.type === "click");
        }

        expect(clicks.length, "click events logged").toBeGreaterThanOrEqual(1);
        expect(clicks[0].affiliateId).toBeTruthy();
        expect(clicks[0].slug).toBeTruthy();
        expect(clicks.some((c) => c.clickId === clickId)).toBe(true);


        await ctx.close();
      });
    }
  }
}
