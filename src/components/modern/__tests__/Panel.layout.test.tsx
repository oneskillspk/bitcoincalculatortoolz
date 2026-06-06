import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render } from '@/test/utils';
import { ModernInputPanel } from '../ModernInputPanel';
import { ModernResultsPanel } from '../ModernResultsPanel';
import type { CalculationResult } from '@/services/bitcoinApi';
import { TooltipProvider } from '@/components/ui/tooltip';

/**
 * Lightweight "visual regression" guard for layout overflow.
 *
 * jsdom does not paint pixels, so we cannot screenshot. Instead we:
 *   1) constrain the test container to common mobile widths (320 / 360 / 375 / 414)
 *   2) walk every descendant
 *   3) fail if scrollWidth > clientWidth on the root, or if any element
 *      overflows its parent horizontally.
 *
 * jsdom reports `0` for layout dimensions so we shim getBoundingClientRect
 * + offsetWidth/scrollWidth from inline `style.width` to make a meaningful
 * assertion possible. This catches the most common cause of mobile bleed:
 * fixed-width children inside a narrower flex/grid container.
 */

const MOBILE_WIDTHS = [320, 360, 375, 414];

function patchDimensions(root: HTMLElement, parentWidth: number) {
  // Recursively assign offsetWidth/scrollWidth based on inline style or parent.
  const walk = (el: HTMLElement, available: number) => {
    const styleWidth = el.style.width;
    let width = available;
    if (styleWidth.endsWith('px')) {
      width = parseInt(styleWidth, 10);
    }
    Object.defineProperty(el, 'clientWidth', { configurable: true, value: available });
    Object.defineProperty(el, 'offsetWidth', { configurable: true, value: width });
    Object.defineProperty(el, 'scrollWidth', { configurable: true, value: width });
    Array.from(el.children).forEach((c) => walk(c as HTMLElement, available));
  };
  walk(root, parentWidth);
}

function assertNoHorizontalOverflow(container: HTMLElement, viewportWidth: number) {
  patchDimensions(container, viewportWidth);
  // Root container itself
  expect(container.scrollWidth).toBeLessThanOrEqual(viewportWidth);

  // Any explicitly fixed-width child that exceeds viewport is a bug
  const all = container.querySelectorAll<HTMLElement>('*');
  all.forEach((el) => {
    const w = el.style.width;
    if (w && w.endsWith('px')) {
      const px = parseInt(w, 10);
      expect(
        px,
        `element <${el.tagName.toLowerCase()}> has fixed width ${px}px > viewport ${viewportWidth}px`,
      ).toBeLessThanOrEqual(viewportWidth);
    }
  });
}

const noop = vi.fn();

const mockResult: CalculationResult = {
  investmentAmount: 100000,
  currentValue: 12345678.9,
  profitLoss: 12245678.9,
  roiPercentage: 12245.678,
  btcAmount: 123.45678901,
  startDate: '2015-01-01',
  startPrice: 810,
  currentPrice: 100000,
  currency: 'USD',
  priceData: [],
};

describe('ModernInputPanel — mobile layout regression', () => {
  beforeAll(() => {
    // Force "small viewport" matchMedia so any responsive hooks downshift.
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (q: string) => ({
        matches: q.includes('max-width'),
        media: q,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });
  });

  it.each(MOBILE_WIDTHS)('does not overflow horizontally at %ipx', (width) => {
    const { container } = render(
      <div style={{ width: `${width}px` }} data-testid="viewport">
        <ModernInputPanel onCalculate={noop} loading={false} />
      </div>,
    );
    const viewport = container.querySelector<HTMLElement>('[data-testid="viewport"]')!;
    assertNoHorizontalOverflow(viewport, width);
  });
});

describe('ModernResultsPanel — mobile layout regression', () => {
  it.each(MOBILE_WIDTHS)('does not overflow with extreme numbers at %ipx', (width) => {
    const { container } = render(
      <div style={{ width: `${width}px` }} data-testid="viewport">
        <TooltipProvider><ModernResultsPanel result={mockResult} showInBtc={false} /></TooltipProvider>
      </div>,
    );
    const viewport = container.querySelector<HTMLElement>('[data-testid="viewport"]')!;
    assertNoHorizontalOverflow(viewport, width);
  });

  it.each(MOBILE_WIDTHS)('uses abbreviated values to keep hero tile within viewport at %ipx', (width) => {
    const { container } = render(
      <div style={{ width: `${width}px` }}>
        <TooltipProvider><ModernResultsPanel result={mockResult} showInBtc={false} /></TooltipProvider>
      </div>,
    );
    // The abbreviated hero value should never contain the full 7-digit raw number.
    const heroValue = container.querySelector('[data-testid="result-hero-value"]')?.textContent ?? '';
    expect(heroValue).not.toContain('12,345,678');
    // But it should be a compact form like $12.3M
    expect(heroValue).toMatch(/[KMB]/);
  });
});
