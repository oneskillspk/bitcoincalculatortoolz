/**
 * Newsletter consent checkbox — behaviour contract.
 *
 * Verifies that the "I agree to receive emails" checkbox:
 *   1. Toggles independently of email input.
 *   2. Blocks submission with a "Consent required" toast when unchecked,
 *      and the backend (supabase rpc / insert) is NOT called.
 *   3. When checked + valid email, allows submission and the backend
 *      receives the normalized (lowercase, trimmed) email.
 *
 * These guards mirror the production handler in NewsletterSection.tsx
 * so a regression that silently bypasses consent (or drops it from the
 * submit path) fails fast in CI.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '@/contexts/LanguageContext';

// --- supabase mock ----------------------------------------------------------
const rpcMock = vi.fn();
const insertMock = vi.fn();
const fromMock = vi.fn(() => ({ insert: insertMock }));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    rpc: (...args: unknown[]) => (rpcMock as (...a: unknown[]) => unknown)(...args),
    from: (...args: unknown[]) => (fromMock as (...a: unknown[]) => unknown)(...args),
  },
}));

// --- toast mock -------------------------------------------------------------
const toastMock = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: toastMock }),
}));

import { NewsletterSection } from '@/components/NewsletterSection';

const renderNewsletter = () =>
  render(
    <HelmetProvider>
      <MemoryRouter>
        <LanguageProvider>
          <NewsletterSection />
        </LanguageProvider>
      </MemoryRouter>
    </HelmetProvider>,
  );

const getCheckbox = () =>
  screen.getByRole('checkbox', { name: /privacy policy/i }) as HTMLInputElement;
const getEmail = () =>
  screen.getByRole('textbox', { name: /email address for newsletter/i }) as HTMLInputElement;
const getSubmit = () => screen.getByRole('button', { name: /subscribe/i });

describe('NewsletterSection — consent checkbox', () => {
  beforeEach(() => {
    rpcMock.mockReset();
    insertMock.mockReset();
    fromMock.mockClear();
    toastMock.mockReset();
  });

  it('toggles on click without affecting the email value', () => {
    renderNewsletter();
    const cb = getCheckbox();
    const email = getEmail();
    fireEvent.change(email, { target: { value: 'a@b.com' } });
    expect(cb.checked).toBe(false);
    fireEvent.click(cb);
    expect(cb.checked).toBe(true);
    expect(email.value).toBe('a@b.com');
    fireEvent.click(cb);
    expect(cb.checked).toBe(false);
  });

  it('blocks submit and skips backend calls when consent is unchecked', async () => {
    const { container } = renderNewsletter();
    fireEvent.change(getEmail(), { target: { value: 'user@example.com' } });
    // Submit the form directly so the handler runs even though the native
    // `required` attribute on the checkbox would normally block the click.
    fireEvent.submit(container.querySelector('form')!);

    await waitFor(() => {
      expect(toastMock).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.stringMatching(/consent required/i),
          variant: 'destructive',
        }),
      );
    });
    expect(rpcMock).not.toHaveBeenCalled();
    expect(fromMock).not.toHaveBeenCalled();
    expect(insertMock).not.toHaveBeenCalled();
  });

  it('submits the normalized email when consent is checked', async () => {
    rpcMock.mockResolvedValueOnce({ data: null, error: null }); // subscribe_newsletter

    renderNewsletter();
    fireEvent.change(getEmail(), { target: { value: '  User@Example.COM  ' } });
    fireEvent.click(getCheckbox());
    expect(getCheckbox().checked).toBe(true);
    fireEvent.click(getSubmit());

    await waitFor(() => {
      expect(rpcMock).toHaveBeenCalledWith('subscribe_newsletter', {
        sub_email: 'user@example.com',
      });
    });
    expect(insertMock).not.toHaveBeenCalled();
    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({ title: expect.stringMatching(/successfully subscribed/i) }),
    );
  });
});
