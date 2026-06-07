/**
 * Canonical 1280×720 social share card painter.
 *
 * Every calculator's `*ShareSnapshot.tsx` builds a typed payload and hands it
 * to `drawShareCard` instead of painting raw canvas. This keeps the brand
 * (paper/ink/ember tokens from `src/lib/brandColors.ts`), typography (Sora /
 * Manrope, falling back to system-ui so html2canvas-free contexts still ship a
 * legible PNG), and disclaimer surface aligned across the suite.
 *
 * Round 3 of the 2026-06 launch audit collapsed seven divergent canvas
 * painters into this primitive — see docs/audit-2026-06-launch.md §5.
 */
import { brand } from '@/lib/brandColors';

export const SHARE_CARD_WIDTH = 1280;
export const SHARE_CARD_HEIGHT = 720;

export type ShareCardTone = 'success' | 'destructive' | 'ember' | 'ink' | 'info' | 'warning';

export interface ShareCardStat {
  label: string;
  value: string;
  sub?: string;
  tone?: ShareCardTone;
}

export interface ShareCardPayload {
  /** Calculator name pill — top-left under the wordmark. */
  calculatorLabel: string;
  /** Optional small line above the hero headline. */
  eyebrow?: string;
  /** Hero phrase, e.g. "Net profit" / "I would have had". */
  headline: string;
  /** Hero number, e.g. "$1.2M" / "+312%". */
  headlineValue: string;
  /** Hero tint. Defaults to `ember`. */
  headlineTone?: ShareCardTone;
  /** Optional context line under the hero value. */
  subline?: string;
  /** Optional badge floated to the right of the hero (ROI etc.). */
  badge?: { label: string; tone?: ShareCardTone };
  /** Up to 4 stat tiles below the hero. */
  stats?: ShareCardStat[];
  /** Bottom-left footer (canonical URL). */
  footerLeft: string;
  /** Bottom-right footer (date, disclaimer, source). */
  footerRight?: string;
}

const TONE_COLOR: Record<ShareCardTone, string> = {
  success: brand.success,
  destructive: brand.danger,
  ember: brand.ember,
  ink: brand.ink,
  info: '#1f6feb',
  warning: '#b45309',
};

const TONE_SOFT: Record<ShareCardTone, string> = {
  success: brand.successSoft,
  destructive: brand.dangerSoft,
  ember: 'rgba(232, 93, 58, 0.10)',
  ink: 'rgba(26, 26, 26, 0.06)',
  info: 'rgba(31, 111, 235, 0.10)',
  warning: 'rgba(180, 83, 9, 0.10)',
};

const DISPLAY_FONT = `"Sora", system-ui, -apple-system, "Segoe UI", sans-serif`;
const BODY_FONT = `"Manrope", system-ui, -apple-system, "Segoe UI", sans-serif`;

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

/**
 * Fit a single line of text inside `maxWidth` by stepping the font size down
 * from `startSize` to `minSize`. Returns the final size that was applied.
 */
function fitText(
  ctx: CanvasRenderingContext2D,
  text: string,
  fontTemplate: (size: number) => string,
  maxWidth: number,
  startSize: number,
  minSize: number,
): number {
  let size = startSize;
  ctx.font = fontTemplate(size);
  while (ctx.measureText(text).width > maxWidth && size > minSize) {
    size -= 2;
    ctx.font = fontTemplate(size);
  }
  return size;
}

export function drawShareCard(canvas: HTMLCanvasElement, payload: ShareCardPayload): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const W = SHARE_CARD_WIDTH;
  const H = SHARE_CARD_HEIGHT;
  canvas.width = W;
  canvas.height = H;

  // Paper background.
  ctx.fillStyle = brand.paper;
  ctx.fillRect(0, 0, W, H);

  // Soft ember glow top-right.
  const glow = ctx.createRadialGradient(W * 0.85, H * 0.15, 0, W * 0.85, H * 0.15, 520);
  glow.addColorStop(0, 'rgba(232, 93, 58, 0.18)');
  glow.addColorStop(1, 'rgba(232, 93, 58, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // Top brand bar.
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';

  // Bitcoin mark.
  ctx.fillStyle = brand.bitcoin;
  ctx.beginPath();
  ctx.arc(72, 76, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = `700 26px ${DISPLAY_FONT}`;
  ctx.textAlign = 'center';
  ctx.fillText('₿', 72, 78);
  ctx.textAlign = 'left';

  // Wordmark + tagline.
  ctx.fillStyle = brand.ink;
  ctx.font = `700 26px ${DISPLAY_FONT}`;
  ctx.fillText('Bitcoin Calculator Tools', 110, 68);
  ctx.fillStyle = brand.inkSoft;
  ctx.font = `500 16px ${BODY_FONT}`;
  ctx.fillText(payload.calculatorLabel, 110, 92);

  // Date / footer-right preview pill.
  if (payload.footerRight) {
    const pillFont = `500 14px ${BODY_FONT}`;
    ctx.font = pillFont;
    const pillW = ctx.measureText(payload.footerRight).width + 32;
    const pillH = 34;
    const pillX = W - pillW - 60;
    const pillY = 60;
    ctx.fillStyle = 'rgba(26, 26, 26, 0.06)';
    roundRect(ctx, pillX, pillY, pillW, pillH, 17);
    ctx.fill();
    ctx.fillStyle = brand.inkSoft;
    ctx.textAlign = 'center';
    ctx.fillText(payload.footerRight, pillX + pillW / 2, pillY + pillH / 2 + 1);
    ctx.textAlign = 'left';
  }

  // Hero block.
  ctx.textBaseline = 'alphabetic';
  let heroY = 200;

  if (payload.eyebrow) {
    ctx.fillStyle = brand.ember;
    ctx.font = `600 18px ${BODY_FONT}`;
    ctx.fillText(payload.eyebrow.toUpperCase(), 72, heroY);
    heroY += 36;
  }

  ctx.fillStyle = brand.ink;
  ctx.font = `600 32px ${DISPLAY_FONT}`;
  ctx.fillText(payload.headline, 72, heroY);
  heroY += 96;

  const headlineTone = payload.headlineTone ?? 'ember';
  ctx.fillStyle = TONE_COLOR[headlineTone];
  const heroSize = fitText(
    ctx,
    payload.headlineValue,
    (s) => `800 ${s}px ${DISPLAY_FONT}`,
    payload.badge ? W - 144 - 260 : W - 144,
    84,
    52,
  );
  ctx.fillText(payload.headlineValue, 72, heroY);
  const heroValueHeight = heroSize;

  if (payload.badge) {
    const badgeTone = payload.badge.tone ?? headlineTone;
    ctx.font = `700 24px ${DISPLAY_FONT}`;
    const badgeText = payload.badge.label;
    const badgeW = ctx.measureText(badgeText).width + 44;
    const badgeH = 56;
    const badgeX = W - 72 - badgeW;
    const badgeY = heroY - heroValueHeight + 4;
    ctx.fillStyle = TONE_SOFT[badgeTone];
    roundRect(ctx, badgeX, badgeY, badgeW, badgeH, badgeH / 2);
    ctx.fill();
    ctx.strokeStyle = TONE_COLOR[badgeTone];
    ctx.lineWidth = 1.5;
    roundRect(ctx, badgeX, badgeY, badgeW, badgeH, badgeH / 2);
    ctx.stroke();
    ctx.fillStyle = TONE_COLOR[badgeTone];
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(badgeText, badgeX + badgeW / 2, badgeY + badgeH / 2 + 1);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  }

  if (payload.subline) {
    ctx.fillStyle = brand.inkSoft;
    ctx.font = `500 22px ${BODY_FONT}`;
    ctx.fillText(payload.subline, 72, heroY + 48);
  }


  // Stats row.
  const stats = (payload.stats ?? []).slice(0, 4);
  if (stats.length) {
    const rowY = 528;
    const rowH = 120;
    const padding = 60;
    const gap = 16;
    const cardW = (W - padding * 2 - gap * (stats.length - 1)) / stats.length;
    stats.forEach((stat, i) => {
      const x = padding + i * (cardW + gap);
      ctx.fillStyle = '#ffffff';
      roundRect(ctx, x, rowY, cardW, rowH, 18);
      ctx.fill();
      ctx.strokeStyle = brand.border;
      ctx.lineWidth = 1;
      roundRect(ctx, x, rowY, cardW, rowH, 18);
      ctx.stroke();

      ctx.fillStyle = brand.inkMuted;
      ctx.font = `500 14px ${BODY_FONT}`;
      ctx.fillText(stat.label.toUpperCase(), x + 20, rowY + 32);

      const valueColor = stat.tone ? TONE_COLOR[stat.tone] : brand.ink;
      ctx.fillStyle = valueColor;
      const vSize = fitText(
        ctx,
        stat.value,
        (s) => `700 ${s}px ${DISPLAY_FONT}`,
        cardW - 40,
        28,
        18,
      );
      ctx.fillText(stat.value, x + 20, rowY + 32 + vSize + 8);

      if (stat.sub) {
        ctx.fillStyle = brand.inkMuted;
        ctx.font = `400 12px ${BODY_FONT}`;
        ctx.fillText(stat.sub, x + 20, rowY + rowH - 14);
      }
    });
  }

  // Bottom divider.
  ctx.fillStyle = brand.border;
  ctx.fillRect(60, H - 64, W - 120, 1);

  // Footer.
  ctx.fillStyle = brand.inkSoft;
  ctx.font = `500 16px ${BODY_FONT}`;
  ctx.textAlign = 'left';
  ctx.fillText(payload.footerLeft, 72, H - 32);

  ctx.fillStyle = brand.ember;
  ctx.font = `700 16px ${DISPLAY_FONT}`;
  ctx.textAlign = 'right';
  ctx.fillText('bitcoincalculator.tools', W - 72, H - 32);
  ctx.textAlign = 'left';
}

/** Build a fresh 1280×720 canvas already painted with the payload. */
export function createShareCardCanvas(payload: ShareCardPayload): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  drawShareCard(canvas, payload);
  return canvas;
}
