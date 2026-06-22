/**
 * Cookie consent banner — persistence + consentchange event.
 *
 * Verifies against the live preview build that:
 *  - Accept writes `granted` to localStorage under `bct-consent-v1` and
 *    fires a `consentchange` CustomEvent with detail="granted".
 *  - Reject writes `denied` and fires consentchange with detail="denied".
 *  - On reload after a choice, the banner stays hidden.
 *  - A pre-existing window.gtag stub receives a Consent Mode v2 update
 *    call with the matching granted/denied payload.
 */
import { test, expect, Page } from '@playwright/test';

const STORAGE_KEY = 'bct-consent-v1';

async function instrument(page: Page) {
  await page.addInitScript(() => {
    (window as unknown as { __consentEvents: string[] }).__consentEvents = [];
    (window as unknown as { __gtagCalls: unknown[][] }).__gtagCalls = [];
    (window as unknown as { gtag: (...a: unknown[]) => void }).gtag = (
      ...args: unknown[]
    ) => {
      (window as unknown as { __gtagCalls: unknown[][] }).__gtagCalls.push(args);
    };
    window.addEventListener('consentchange', (e: Event) => {
      (window as unknown as { __consentEvents: string[] }).__consentEvents.push(
        String((e as CustomEvent).detail),
      );
    });
    try {
      window.localStorage.removeItem('bct-consent-v1');
    } catch {
      /* ignore */
    }
  });
}

test.describe('CookieConsentBanner', () => {
  test('Accept persists granted + fires consentchange + gtag update', async ({
    page,
  }) => {
    await instrument(page);
    await page.goto('/');
    const accept = page.getByRole('button', { name: /accept all cookies/i });
    await expect(accept).toBeVisible({ timeout: 5_000 });
    await accept.click();

    await expect(page.getByRole('dialog')).toHaveCount(0);
    const stored = await page.evaluate(
      (k) => window.localStorage.getItem(k),
      STORAGE_KEY,
    );
    expect(stored).toBe('granted');
    const events = await page.evaluate(
      () => (window as unknown as { __consentEvents: string[] }).__consentEvents,
    );
    expect(events).toContain('granted');
    const gtagCalls = await page.evaluate(
      () => (window as unknown as { __gtagCalls: unknown[][] }).__gtagCalls,
    );
    const update = gtagCalls.find(
      (c) => c[0] === 'consent' && c[1] === 'update',
    );
    expect(update).toBeTruthy();
    expect(update?.[2]).toMatchObject({
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      analytics_storage: 'granted',
    });
  });

  test('Reject persists denied + fires consentchange + gtag denied', async ({
    page,
  }) => {
    await instrument(page);
    await page.goto('/');
    const reject = page.getByRole('button', {
      name: /reject non-essential cookies/i,
    });
    await expect(reject).toBeVisible({ timeout: 5_000 });
    await reject.click();

    const stored = await page.evaluate(
      (k) => window.localStorage.getItem(k),
      STORAGE_KEY,
    );
    expect(stored).toBe('denied');
    const events = await page.evaluate(
      () => (window as unknown as { __consentEvents: string[] }).__consentEvents,
    );
    expect(events).toContain('denied');
    const gtagCalls = await page.evaluate(
      () => (window as unknown as { __gtagCalls: unknown[][] }).__gtagCalls,
    );
    const update = gtagCalls.find(
      (c) => c[0] === 'consent' && c[1] === 'update',
    );
    expect(update?.[2]).toMatchObject({
      ad_storage: 'denied',
      analytics_storage: 'denied',
    });
  });

  test('banner stays hidden after a stored choice on reload', async ({
    page,
  }) => {
    await instrument(page);
    await page.goto('/');
    await page
      .getByRole('button', { name: /accept all cookies/i })
      .click({ timeout: 5_000 });

    await page.reload();
    // Wait past the 600ms show timer.
    await page.waitForTimeout(900);
    await expect(
      page.getByRole('button', { name: /accept all cookies/i }),
    ).toHaveCount(0);
  });
});
