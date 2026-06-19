/**
 * EN/TR translation parity guard.
 *
 * Catches three classes of i18n drift in src/translations/index.ts:
 *   1. TR is missing a key that EN defines
 *   2. TR defines a key that EN does not (orphan)
 *   3. TR value is empty, whitespace, or identical to EN (silent EN fallback)
 *
 * Whitelisted identical values (brand / ticker / acronym) are exempt
 * because they should NOT be translated.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { translations, loadLocale } from '@/translations';

const IDENTICAL_OK = new Set([
  'BTC', 'USD', 'EUR', 'TRY', 'ETH', 'sats', 'sat', 'PDF', 'CSV',
  'API', 'URL', 'ID', 'OK', 'DCA', 'S2F', 'MVRV', 'CAGR',
  'Bitcoin', 'Lightning', 'Staking', 'HODL',
  // Ticker pairs — must not be translated
  'BTC / USD', 'BTC/USD', 'BTC / TRY', 'BTC/TRY',
  // Proper nouns / brand names — must not be translated
  'Web3Believer', 'S&P 500', 'Nisar Mehar',
]);

describe('EN/TR translation parity', () => {
  beforeAll(async () => { await loadLocale('tr'); });
  const en = translations.en;
  const tr = () => translations.tr;

  it('TR defines every EN key', () => {
    const missing = Object.keys(en).filter((k) => !(k in tr));
    expect(missing, `TR missing ${missing.length} keys:\n${missing.slice(0, 20).join('\n')}`).toEqual([]);
  });

  it('TR has no orphan keys not present in EN', () => {
    const orphans = Object.keys(tr).filter((k) => !(k in en));
    expect(orphans, `TR orphan keys (no EN counterpart):\n${orphans.slice(0, 20).join('\n')}`).toEqual([]);
  });

  it('TR has no empty or whitespace-only values', () => {
    const empties = Object.entries(tr)
      .filter(([, v]) => typeof v !== 'string' || v.trim() === '')
      .map(([k]) => k);
    expect(empties, `TR keys with empty value:\n${empties.join('\n')}`).toEqual([]);
  });

  it('TR is not silently echoing EN (fallback indicator)', () => {
    const echoes = Object.keys(en).filter((k) => {
      if (!(k in tr)) return false;
      const enV = (en[k] ?? '').trim();
      const trV = (tr[k] ?? '').trim();
      if (!enV || !trV || enV !== trV) return false;
      // Allow brand / ticker / single-token identifiers to remain identical.
      if (IDENTICAL_OK.has(enV)) return false;
      if (/^[A-Z0-9]{2,5}$/.test(enV)) return false; // tickers
      return true;
    });
    expect(echoes, `TR values identical to EN (likely untranslated):\n${echoes.slice(0, 20).join('\n')}`).toEqual([]);
  });
});
