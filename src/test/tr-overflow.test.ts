/**
 * TR UI overflow guard.
 *
 * Turkish strings typically run 10–30% longer than English. Anything beyond
 * that risks breaking buttons, nav items, badges, and tight table cells.
 *
 * This test asserts per-key budgets:
 *   - Button / nav / badge keys (short labels): TR ≤ 28 chars
 *   - Generic keys: TR ≤ 2.5× EN length
 *
 * Add to OVERFLOW_EXEMPT only after confirming the surface visually fits
 * (e.g. multiline subtitle, FAQ answer).
 */
import { describe, it, expect } from 'vitest';
import { translations } from '@/translations';

// Keys allowed to break the heuristic — verified to fit visually
// (subtitles, FAQ answers, multiline disclaimers).
const OVERFLOW_EXEMPT = new Set<string>([
  'hero.subtitle',
  'about.follow',
]);

// Keys that render in tight chrome (buttons, nav, badges, CTAs, tabs).
// These have a hard absolute budget regardless of EN length.
const TIGHT_BUDGET = 28;
const isTightKey = (k: string) =>
  /^(nav|cta|button|btn|tab|badge|hero\.cta|whatif\.inputs\.(calculate|toggle))/i.test(k);

describe('TR UI overflow budget', () => {
  const en = translations.en;
  const tr = translations.tr;

  it('tight chrome strings (nav/cta/button/tab/badge) stay ≤ 28 chars in TR', () => {
    const offenders: string[] = [];
    for (const [k, trV] of Object.entries(tr)) {
      if (OVERFLOW_EXEMPT.has(k)) continue;
      if (!isTightKey(k)) continue;
      if (typeof trV !== 'string') continue;
      if (trV.length > TIGHT_BUDGET) {
        offenders.push(`${k}: ${trV.length}c — "${trV}"`);
      }
    }
    expect(offenders, `Tight TR labels exceeding ${TIGHT_BUDGET} chars:\n${offenders.join('\n')}`).toEqual([]);
  });

  it('generic TR strings stay within 2.5× their EN length', () => {
    const offenders: string[] = [];
    for (const [k, enV] of Object.entries(en)) {
      if (OVERFLOW_EXEMPT.has(k)) continue;
      if (isTightKey(k)) continue;
      const trV = tr[k];
      if (typeof enV !== 'string' || typeof trV !== 'string') continue;
      if (enV.length < 8) continue; // skip very short EN — ratio is noisy
      const ratio = trV.length / Math.max(1, enV.length);
      if (ratio > 2.5) {
        offenders.push(`${k}: ${enV.length}→${trV.length} (${ratio.toFixed(2)}×) — "${trV.slice(0, 60)}"`);
      }
    }
    expect(offenders, `TR strings >2.5× EN length:\n${offenders.join('\n')}`).toEqual([]);
  });

  // D3 — mobile overflow guards at 360/393 px.
  // CalculatorGrid card renders the title inside a ~280px-wide card. With
  // break-words + hyphens-auto the title can wrap, but anything past ~60 chars
  // starts pushing the description below the fold even at 393px. Cap as a
  // regression guard for newly added calculators.
  it('TR calculator card titles stay ≤ 60 chars (360/393px card width)', () => {
    const MAX = 60;
    const offenders: string[] = [];
    for (const [k, v] of Object.entries(tr)) {
      if (!/^calculators\.[a-zA-Z]+\.title$/.test(k)) continue;
      if (typeof v !== 'string') continue;
      if (v.length > MAX) offenders.push(`${k}: ${v.length}c — "${v}"`);
    }
    expect(offenders, `TR calculator titles >${MAX} chars:\n${offenders.join('\n')}`).toEqual([]);
  });

  // Description block has min-h-[5.5rem] reservation on mobile (~5 lines at
  // 13px/1.55 line-height). Hard cap at 170 chars so descriptions don't blow
  // past that reservation and force layout shift on the card grid.
  it('TR calculator card descriptions stay ≤ 170 chars (mobile reservation)', () => {
    const MAX = 170;
    const offenders: string[] = [];
    for (const [k, v] of Object.entries(tr)) {
      if (!/^calculators\.[a-zA-Z]+\.desc$/.test(k)) continue;
      if (typeof v !== 'string') continue;
      if (v.length > MAX) offenders.push(`${k}: ${v.length}c — "${v.slice(0, 80)}…"`);
    }
    expect(offenders, `TR calculator descs >${MAX} chars:\n${offenders.join('\n')}`).toEqual([]);
  });

  // Savings/SIP hero badges render in a rounded pill. With break-words the
  // pill can wrap, but anything past 40 chars stacks 3 lines at 360px.
  it('TR hero badge labels stay ≤ 40 chars (mobile pill)', () => {
    const MAX = 40;
    const offenders: string[] = [];
    for (const [k, v] of Object.entries(tr)) {
      if (!/\.hero\.badge$/.test(k)) continue;
      if (typeof v !== 'string') continue;
      if (v.length > MAX) offenders.push(`${k}: ${v.length}c — "${v}"`);
    }
    expect(offenders, `TR hero badges >${MAX} chars:\n${offenders.join('\n')}`).toEqual([]);
  });
});
