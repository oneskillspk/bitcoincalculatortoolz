import { test, expect, Page } from '@playwright/test';

/**
 * Detects the legacy pre-React beige first-paint flash (hsl(40 22% 95%) ≈
 * rgb(247, 243, 234)) on initial load of `/` and after navigation to
 * `/explore-calculators`.
 *
 * NOTE: We only sample the `commit` phase. The brand's intentional paper
 * background (~rgb 243, 241, 236) falls inside the legacy beige tolerance
 * band, so post-mount samples would be false positives.
 */

const BEIGE_TARGET = { r: 247, g: 243, b: 234 };
const TOLERANCE = 6;

function isBeige(r: number, g: number, b: number) {
  return (
    Math.abs(r - BEIGE_TARGET.r) <= TOLERANCE &&
    Math.abs(g - BEIGE_TARGET.g) <= TOLERANCE &&
    Math.abs(b - BEIGE_TARGET.b) <= TOLERANCE
  );
}

async function sampleTopLeft(page: Page): Promise<{ r: number; g: number; b: number }> {
  const buf = await page.screenshot({ clip: { x: 0, y: 0, width: 4, height: 4 } });
  const dataUrl = `data:image/png;base64,${buf.toString('base64')}`;
  const px = await page.evaluate(
    (url) =>
      new Promise<{ r: number; g: number; b: number }>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const c = document.createElement('canvas');
          c.width = img.width;
          c.height = img.height;
          const ctx = c.getContext('2d')!;
          ctx.drawImage(img, 0, 0);
          const d = ctx.getImageData(0, 0, 1, 1).data;
          resolve({ r: d[0], g: d[1], b: d[2] });
        };
        img.onerror = reject;
        img.src = url;
      }),
    dataUrl,
  );
  return px;
}

test.describe('no beige first-paint flash', () => {
  test('initial load of /', async ({ page }) => {
    await page.goto('/', { waitUntil: 'commit' });
    const early = await sampleTopLeft(page);
    expect(
      isBeige(early.r, early.g, early.b),
      `beige flash detected at first paint: rgb(${early.r}, ${early.g}, ${early.b})`,
    ).toBe(false);
  });

  test('after navigation to /explore-calculators', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.goto('/explore-calculators', { waitUntil: 'commit' });
    const early = await sampleTopLeft(page);
    expect(
      isBeige(early.r, early.g, early.b),
      `beige flash on /explore-calculators first paint: rgb(${early.r}, ${early.g}, ${early.b})`,
    ).toBe(false);
  });
});
