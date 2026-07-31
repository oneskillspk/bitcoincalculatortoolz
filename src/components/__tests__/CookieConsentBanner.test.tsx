/**
 * CookieConsentBanner — copy + behavior coverage.
 *
 * Asserts:
 *  1. EN copy renders all interactive elements (Privacy link, Accept, Reject).
 *  2. TR copy renders the localized strings when language=tr.
 *  3. Accept/Reject persist the choice to localStorage under `bct-consent-v1`.
 *  4. Google Consent Mode v2 update is pushed (gtag called with the correct
 *     `granted` / `denied` payload for ad_storage, ad_user_data,
 *     ad_personalization, analytics_storage).
 *  5. A `consentchange` window event fires with the chosen value.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@/test/utils';
import { act, fireEvent } from '@testing-library/react';
import CookieConsentBanner from '@/components/CookieConsentBanner';
import { LanguageContext } from '@/contexts/LanguageContext';

const STORAGE_KEY = 'bct-consent-v1';

function renderWithLang(language: 'en' | 'tr') {
  return render(
    <LanguageContext.Provider
      value={{ language, setLanguage: () => {}, t: (k) => k }}
    >
      <CookieConsentBanner />
    </LanguageContext.Provider>,
  );
}

async function waitForBanner() {
  // Banner shows after a 600ms timer in useEffect.
  await act(async () => {
    vi.advanceTimersByTime(700);
  });
}

describe('CookieConsentBanner', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.localStorage.clear();
    
    delete window.gtag;
    
    delete window.dataLayer;
  });

  it('renders EN copy with Privacy link, Reject, and Accept buttons', async () => {
    renderWithLang('en');
    await waitForBanner();
    expect(
      screen.getByText(/We use cookies to measure usage/i),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /privacy/i })).toHaveAttribute(
      'href',
      '/privacy',
    );
    expect(
      screen.getByRole('button', { name: /reject non-essential cookies/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /accept all cookies/i }),
    ).toBeInTheDocument();
  });

  it('renders TR copy with localized link + buttons', async () => {
    renderWithLang('tr');
    await waitForBanner();
    expect(
      screen.getByText(/Site deneyimini ölçmek/i),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /gizlilik/i })).toHaveAttribute(
      'href',
      '/tr/gizlilik',
    );
    expect(screen.getByRole('button', { name: /reddet/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /tümünü kabul et/i }),
    ).toBeInTheDocument();
  });

  it('Accept persists "granted" and pushes Consent Mode v2 update + event', async () => {
    const gtag = vi.fn();
    
    window.gtag = gtag;
    const onConsent = vi.fn();
    window.addEventListener('consentchange', onConsent as EventListener);

    renderWithLang('en');
    await waitForBanner();

    fireEvent.click(screen.getByRole('button', { name: /accept all cookies/i }));

    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('granted');
    expect(gtag).toHaveBeenCalledWith('consent', 'update', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      analytics_storage: 'granted',
    });
    expect(onConsent).toHaveBeenCalledTimes(1);
    expect((onConsent.mock.calls[0][0] as CustomEvent).detail).toBe('granted');

    window.removeEventListener('consentchange', onConsent as EventListener);
  });

  it('Reject persists "denied" and pushes denied Consent Mode v2 update', async () => {
    const gtag = vi.fn();
    
    window.gtag = gtag;
    const onConsent = vi.fn();
    window.addEventListener('consentchange', onConsent as EventListener);

    renderWithLang('en');
    await waitForBanner();

    fireEvent.click(
      screen.getByRole('button', { name: /reject non-essential cookies/i }),
    );

    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('denied');
    expect(gtag).toHaveBeenCalledWith('consent', 'update', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
    });
    expect((onConsent.mock.calls[0][0] as CustomEvent).detail).toBe('denied');

    window.removeEventListener('consentchange', onConsent as EventListener);
  });

  it('queues consent on window.dataLayer when gtag is not yet loaded', async () => {
    renderWithLang('en');
    await waitForBanner();

    fireEvent.click(screen.getByRole('button', { name: /accept all cookies/i }));

    expect(Array.isArray(window.dataLayer)).toBe(true);
    const queued = (window.dataLayer as unknown[]).find(
      (e) =>
        Array.isArray(e) &&
        e[0] === 'consent' &&
        e[1] === 'update' &&
        (e[2] as { ad_storage: string }).ad_storage === 'granted',
    );
    expect(queued).toBeTruthy();
  });

  it('stays hidden and replays stored choice on mount when already chosen', async () => {
    window.localStorage.setItem(STORAGE_KEY, 'denied');
    const gtag = vi.fn();
    
    window.gtag = gtag;

    renderWithLang('en');
    await waitForBanner();

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(gtag).toHaveBeenCalledWith(
      'consent',
      'update',
      expect.objectContaining({ ad_storage: 'denied' }),
    );
  });
});
