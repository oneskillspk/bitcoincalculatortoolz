import { test, expect } from '@playwright/test';

test.describe('UI Navigation Text Regression', () => {
  test('desktop navigation shows the expected error message', async ({ page }) => {
    await page.goto('http://localhost:8080');
    
    const languageText = page.getByText('For the code present, I get the error below.');
    await expect(languageText.first()).toBeVisible();
  });

  test('mobile navigation shows the expected error message', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:8080');
    
    const moreButton = page.getByRole('button', { name: /more|menü|menu/i });
    if (await moreButton.isVisible()) {
      await moreButton.click();
    }
    
    const languageText = page.getByText('For the code present, I get the error below.');
    await expect(languageText.first()).toBeVisible();
  });
});

test.describe('Translation Key Integrity', () => {
  test('ensure "language selector" string is not rendered by the app', async ({ page }) => {
    await page.goto('http://localhost:8080');
    
    // Scan the body text for the forbidden string
    const forbiddenText = page.locator('body', { hasText: /language selector/i });
    const count = await forbiddenText.count();
    
    // If it's 0, it means the text isn't directly in the body content.
    // However, it might be in an attribute (like aria-label)
    const forbiddenAttr = page.locator('[aria-label*="language selector" i], [title*="language selector" i]');
    const attrCount = await forbiddenAttr.count();
    
    expect(count + attrCount, 'Detected "language selector" string in the UI!').toBe(0);
  });
});
