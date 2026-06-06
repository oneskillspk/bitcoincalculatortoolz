import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Phase 2 terminology lock — guards the TR translation glossary.
 * See docs/TR_COPY_AUDIT.md §3.1 for canonical forms.
 */
const source = readFileSync(resolve(__dirname, '../translations/index.ts'), 'utf-8');

// Isolate the `tr:` block so we don't accidentally lint English source strings.
function extractTrBlock(src: string): string {
  const start = src.indexOf('tr: {');
  expect(start, 'tr: block not found').toBeGreaterThan(-1);
  // naive but sufficient: walk braces from the opening one
  let depth = 0;
  for (let i = start + 'tr:'.length; i < src.length; i++) {
    const ch = src[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return src.slice(start, i + 1);
    }
  }
  throw new Error('Unterminated tr: block');
}

const tr = extractTrBlock(source);

describe('TR terminology lock (Phase 2)', () => {
  it('does not use "Beni Bildir" (means: Report me)', () => {
    expect(tr).not.toMatch(/Beni Bildir/);
  });

  it('does not use "Birikim Notu" (use Birikim Skoru)', () => {
    expect(tr).not.toMatch(/Birikim Notu/);
  });

  it('does not use "Takipçi" for software trackers (use Takip Aracı / İzleyici)', () => {
    expect(tr).not.toMatch(/Portföy Takipçisi/);
    expect(tr).not.toMatch(/Ölüm İlanları Takipçisi/);
  });

  it('does not use "Toplu Tutar" for lump sum (use Toplu Yatırım)', () => {
    expect(tr).not.toMatch(/Toplu Tutar/);
  });

  it('does not use "Sonsuza Dek" (use Sonsuza Kadar)', () => {
    expect(tr).not.toMatch(/Sonsuza Dek/);
  });

  it('does not use "Stok/Akış" (use Stok-Akış)', () => {
    expect(tr).not.toMatch(/Stok\/Akış/);
  });

  it('does not use "S&P 500\'e Karşı" (use Kıyasla)', () => {
    expect(tr).not.toMatch(/S&P 500'e Karşı/);
  });

  it('does not use "Dolar Maliyet Ortalama" without genitive -ı (use Dolar Maliyeti Ortalaması)', () => {
    // bare "Maliyet Ortalama" without the genitive "i" is the banned form
    expect(tr).not.toMatch(/Dolar Maliyet Ortalama[^s]/);
  });

  it('does not use "dalgalanma" as volatility translation (use oynaklık)', () => {
    // dalgalanma is allowed as narrative "ups and downs" but flagged here as a guard;
    // current corpus must be clean after Phase 2.
    expect(tr).not.toMatch(/dalgalanma/);
  });

  it('uses TR decimal comma in marquee accuracy claim (not %99.9)', () => {
    expect(tr).not.toMatch(/%\d+\.\d/);
  });

  it('does not concatenate digits with "sn" without a space (30sn / 60sn)', () => {
    expect(tr).not.toMatch(/\d+sn(?![a-zA-ZçğıöşüÇĞİÖŞÜ])/);
  });

  it('uses "Maksimum Düşüş" for drawdown calculator title', () => {
    expect(tr).toMatch(/Maksimum Düşüş Hesaplayıcısı/);
  });

  it('uses "Yüzdelik Dilim" for percentile (not Yüzdesi)', () => {
    expect(tr).not.toMatch(/Servet Yüzdesi/);
  });
});
