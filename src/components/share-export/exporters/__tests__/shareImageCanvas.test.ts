/**
 * Share PNG spacing guard.
 *
 * The 1280×720 share card is painted by `drawShareCard` and is the same pixel
 * payload regardless of which viewport the user is on (the preview <canvas>
 * just scales via CSS aspect-ratio). What we DO want to lock down is that the
 * hero block — eyebrow → headline → headlineValue → subline → badge — never
 * overlaps itself, even when the headline value is the kind of huge currency
 * string that broke Round 5 ("$596.7" crashing into "from $1,000…").
 *
 * The test stubs a 2D context, replays a few payloads (with and without
 * eyebrow / badge), and asserts the y-positions of the painted text leave
 * enough room for the font sizes that were actually used.
 */
import { describe, it, expect } from 'vitest';
import {
  drawShareCard,
  SHARE_CARD_WIDTH,
  SHARE_CARD_HEIGHT,
  type ShareCardPayload,
} from '../shareImageCanvas';

interface FillTextCall {
  text: string;
  x: number;
  y: number;
  font: string;
  fillStyle: string;
}

function fontSize(font: string): number {
  const m = /(\d+(?:\.\d+)?)px/.exec(font);
  return m ? parseFloat(m[1]) : 16;
}

function stubCanvas() {
  const fillTextCalls: FillTextCall[] = [];
  const ctx: any = {
    fillStyle: '#000',
    strokeStyle: '#000',
    font: '16px sans-serif',
    lineWidth: 1,
    textAlign: 'left',
    textBaseline: 'alphabetic',
    fillRect: () => {},
    fill: () => {},
    stroke: () => {},
    beginPath: () => {},
    moveTo: () => {},
    arcTo: () => {},
    arc: () => {},
    closePath: () => {},
    createRadialGradient: () => ({ addColorStop: () => {} }),
    createLinearGradient: () => ({ addColorStop: () => {} }),
    measureText(text: string) {
      // Width ≈ 0.55 * char count * font-size px — close enough for
      // exercising the fitText shrink loop.
      return { width: text.length * fontSize(this.font) * 0.55 };
    },
    fillText(text: string, x: number, y: number) {
      fillTextCalls.push({ text, x, y, font: this.font, fillStyle: this.fillStyle });
    },
  };
  const canvas: any = {
    width: 0,
    height: 0,
    getContext: () => ctx,
  };
  return { canvas, ctx, fillTextCalls };
}

const basePayload: ShareCardPayload = {
  calculatorLabel: 'What-If Calculator',
  eyebrow: "TODAY'S VALUE",
  headline: 'I would have had',
  headlineValue: '$596.7',
  headlineTone: 'destructive',
  subline: 'from $1,000 on Jun 7, 2025',
  badge: { label: '-40.3% ROI', tone: 'destructive' },
  stats: [
    { label: 'TOTAL ROI', value: '-40.3%', tone: 'destructive' },
    { label: 'ANNUALIZED (CAGR)', value: '-40.3%', tone: 'destructive' },
    { label: 'BTC ACCUMULATED', value: '0.0095 BTC', tone: 'ember' },
  ],
  footerLeft: 'bitcoincalculator.tools/calculators/what-if',
  footerRight: 'Jun 7, 2026',
};

function find(calls: FillTextCall[], text: string): FillTextCall {
  const hit = calls.find((c) => c.text === text);
  if (!hit) throw new Error(`fillText for "${text}" was never called`);
  return hit;
}

describe('shareImageCanvas — hero text spacing', () => {
  it('paints a fixed 1280×720 canvas regardless of caller dimensions', () => {
    const { canvas } = stubCanvas();
    drawShareCard(canvas, basePayload);
    expect(canvas.width).toBe(SHARE_CARD_WIDTH);
    expect(canvas.height).toBe(SHARE_CARD_HEIGHT);
  });

  it('keeps eyebrow → headline → value → subline from overlapping (short hero value)', () => {
    const { canvas, fillTextCalls } = stubCanvas();
    drawShareCard(canvas, basePayload);

    const headline = find(fillTextCalls, basePayload.headline);
    const value = find(fillTextCalls, basePayload.headlineValue);
    const subline = find(fillTextCalls, basePayload.subline!);

    const headlineSize = fontSize(headline.font);
    const valueSize = fontSize(value.font);

    // headline → headlineValue: the value baseline must sit at least one full
    // value cap-height below the headline baseline so the giant currency text
    // never bleeds up into "I would have had".
    expect(value.y - headline.y).toBeGreaterThanOrEqual(valueSize);
    // headlineValue → subline: subline baseline must sit comfortably below the
    // value's descender. Allow a small slack (~ 0.2 * size) for descenders.
    expect(subline.y - value.y).toBeGreaterThan(valueSize * 0.2);
    // sanity: headline doesn't paint on top of eyebrow
    const eyebrow = find(fillTextCalls, basePayload.eyebrow!.toUpperCase());
    expect(headline.y - eyebrow.y).toBeGreaterThanOrEqual(headlineSize * 0.9);
  });

  it('shrinks the headline value font when the string is very long (fitText)', () => {
    const { canvas: shortCanvas, fillTextCalls: shortCalls } = stubCanvas();
    drawShareCard(shortCanvas, basePayload);
    const shortSize = fontSize(find(shortCalls, basePayload.headlineValue).font);

    const longPayload: ShareCardPayload = {
      ...basePayload,
      headlineValue: '$12,345,678,901.23',
    };
    const { canvas: longCanvas, fillTextCalls: longCalls } = stubCanvas();
    drawShareCard(longCanvas, longPayload);
    const longSize = fontSize(find(longCalls, longPayload.headlineValue).font);

    expect(longSize).toBeLessThanOrEqual(shortSize);
    // Even when shrunk, the value font must stay readable (>= 52px floor).
    expect(longSize).toBeGreaterThanOrEqual(52);
  });

  it('keeps the headline value clear of the badge on the right edge', () => {
    const { canvas, fillTextCalls } = stubCanvas();
    drawShareCard(canvas, basePayload);

    const value = find(fillTextCalls, basePayload.headlineValue);
    const valueSize = fontSize(value.font);
    // Approximate the right-edge of the painted value using the same width
    // heuristic the stub uses; it must not run into the right gutter where
    // the badge sits (the badge takes the rightmost 260 px + 72 px gutter).
    const approxValueRight = value.x + basePayload.headlineValue.length * valueSize * 0.55;
    expect(approxValueRight).toBeLessThanOrEqual(SHARE_CARD_WIDTH - 260);
  });

  it('still spaces hero block correctly when the eyebrow is omitted', () => {
    const { canvas, fillTextCalls } = stubCanvas();
    drawShareCard(canvas, { ...basePayload, eyebrow: undefined });

    const headline = find(fillTextCalls, basePayload.headline);
    const value = find(fillTextCalls, basePayload.headlineValue);
    const subline = find(fillTextCalls, basePayload.subline!);

    const valueSize = fontSize(value.font);
    expect(value.y - headline.y).toBeGreaterThanOrEqual(valueSize);
    expect(subline.y - value.y).toBeGreaterThan(valueSize * 0.2);
  });
});
