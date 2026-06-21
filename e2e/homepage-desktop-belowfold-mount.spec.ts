import { test, expect } from '@playwright/test';

/**
 * Desktop below-the-fold mount check.
 *
 * Regression guard for the gap users were seeing between "Explore all tools"
 * and the footer on desktop. Scrolls to the bottom (which triggers every
 * EagerSection IntersectionObserver) and asserts that:
 *   - UltraModernAssetComparison has rendered real content (not skeleton).
 *   - FAQSection has rendered its accordion items.
 *   - No vertical gap >280px exists between consecutive <main> sections.
 */
test.describe('Homepage desktop — below-fold sections mount without blank bands', () => {
  test.use({ viewport: { width: 1366, height: 900 } });

  test('UltraModernAssetComparison + FAQSection mount, no large gaps', async ({ page }) => {
    await page.goto('/');

    // Walk the page so every IntersectionObserver fires.
    await page.evaluate(async () => {
      const step = Math.max(400, window.innerHeight - 80);
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 200));
      }
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise((r) => setTimeout(r, 400));
    });
    await page.waitForLoadState('networkidle');

    // Asset comparison: locate by its section heading.
    const assetComparison = page
      .locator('section, div')
      .filter({ hasText: /Bitcoin\s+vs|asset comparison|compare assets/i })
      .first();
    await expect(assetComparison, 'UltraModernAssetComparison must mount').toBeVisible({
      timeout: 8000,
    });

    // FAQ section: at least one accordion summary/button must be present.
    const faq = page
      .locator('section')
      .filter({ hasText: /frequently asked|faq/i })
      .first();
    await expect(faq, 'FAQSection must mount').toBeVisible({ timeout: 8000 });
    const faqItems = faq.locator('button, [role="button"], summary');
    expect(await faqItems.count(), 'FAQ should expose interactive items').toBeGreaterThan(0);

    // No blank gap >280px between consecutive top-level main sections.
    const offenders = await page.evaluate(() => {
      const main = document.querySelector('main');
      if (!main) return [] as Array<{ a: string; b: string; gap: number }>;
      const kids = Array.from(main.querySelectorAll(':scope > *')) as HTMLElement[];
      const out: Array<{ a: string; b: string; gap: number }> = [];
      for (let i = 0; i < kids.length - 1; i++) {
        const a = kids[i].getBoundingClientRect();
        const b = kids[i + 1].getBoundingClientRect();
        const gap = b.top - a.bottom;
        if (gap > 280) out.push({ a: kids[i].tagName, b: kids[i + 1].tagName, gap });
      }
      return out;
    });
    expect(
      offenders,
      `Vertical gaps >280px detected:\n${JSON.stringify(offenders, null, 2)}`,
    ).toEqual([]);
  });
});
