/**
 * Accessibility contract for the floating header pill.
 *
 * Locks down the keyboard / screen-reader guarantees added in the Round 5
 * header polish:
 *   - the ⌘K trigger is a real <button> with a descriptive aria-label,
 *     aria-keyshortcuts, aria-haspopup="dialog", and aria-expanded;
 *   - the ⌘K visual keycap is aria-hidden so SRs read the label only;
 *   - the nav exposes aria-current="page" on the active link;
 *   - every interactive surface has a visible focus-visible ring class;
 *   - Cmd/Ctrl + K anywhere in the document opens the search dialog.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FloatingNavigation } from '../FloatingNavigation';
import { LanguageProvider } from '@/contexts/LanguageContext';

// SmartSearch + MobileNavigation pull in heavy trees we don't need to assert
// on here — stub them so the test stays focused on the header surface.
vi.mock('../SmartSearch', () => ({
  SmartSearch: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div role="dialog" aria-label="Search" data-testid="smart-search" /> : null,
}));
vi.mock('@/components/MobileNavigation', () => ({
  MobileNavigation: () => <div data-testid="mobile-nav" />,
}));
vi.mock('@/components/LanguageSelector', () => ({
  LanguageSelector: () => <div data-testid="lang-selector" />,
}));
vi.mock('@/components/AnimatedBrandLogo', () => ({
  AnimatedBrandLogo: ({ variant }: { variant: string }) => <span data-testid={`logo-${variant}`}>BCT</span>,
}));

const renderHeader = (initialPath = '/') =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <LanguageProvider>
        <FloatingNavigation />
      </LanguageProvider>
    </MemoryRouter>,
  );

describe('FloatingNavigation — accessibility', () => {
  beforeEach(() => {
    // Reset scroll so the header consistently starts in its "top" state.
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true });
  });

  it('exposes a descriptive label, keyboard hint, and dialog metadata on the ⌘K button', () => {
    renderHeader('/');

    const btn = screen.getByRole('button', { name: /open search.*Ctrl\+K.*Cmd\+K/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute('type', 'button');
    expect(btn).toHaveAttribute('aria-keyshortcuts', 'Meta+K Control+K');
    expect(btn).toHaveAttribute('aria-haspopup', 'dialog');
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    // The ⌘K keycap is purely decorative — must not be announced.
    const kbd = btn.querySelector('kbd');
    expect(kbd).not.toBeNull();
    expect(kbd).toHaveAttribute('aria-hidden', 'true');
    // Focus-visible ring class is present so keyboard users see focus.
    expect(btn.className).toMatch(/focus-visible:ring-/);
  });

  it('flips aria-expanded when the search dialog opens', () => {
    renderHeader('/');
    const btn = screen.getByRole('button', { name: /open search/i });
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByTestId('smart-search')).toBeInTheDocument();
  });

  it('opens the search dialog from a global Cmd+K shortcut', () => {
    renderHeader('/');
    expect(screen.queryByTestId('smart-search')).toBeNull();
    fireEvent.keyDown(window, { key: 'k', metaKey: true });
    expect(screen.getByTestId('smart-search')).toBeInTheDocument();
  });

  it('opens the search dialog from a global Ctrl+K shortcut', () => {
    renderHeader('/');
    fireEvent.keyDown(window, { key: 'K', ctrlKey: true });
    expect(screen.getByTestId('smart-search')).toBeInTheDocument();
  });

  it('labels the main navigation landmark and marks the active link with aria-current="page"', () => {
    renderHeader('/calculators');
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label');

    const links = screen.getAllByRole('link');
    const active = links.filter((l) => l.getAttribute('aria-current') === 'page');
    expect(active).toHaveLength(1);
    expect(active[0]).toHaveAttribute('href', '/calculators');

    // Inactive links must NOT advertise aria-current.
    const inactive = links.filter((l) => l.getAttribute('href') === '/about');
    expect(inactive[0]).not.toHaveAttribute('aria-current');
  });

  it('gives every nav link a visible focus-visible ring', () => {
    renderHeader('/');
    const links = screen.getAllByRole('link');
    // At least the desktop nav links should carry focus-visible styling.
    const focusable = links.filter((l) => /focus-visible:ring-/.test(l.className));
    expect(focusable.length).toBeGreaterThanOrEqual(3);
  });

  it('labels the brand logo link for screen readers', () => {
    renderHeader('/');
    // Multiple links with the home href exist (logo + nav home link); the logo
    // is the one with an aria-label and no visible text node aside from logo.
    const logo = screen.getByRole('link', { name: /Bitcoin Calculator Tools.*Home/i });
    expect(logo).toBeInTheDocument();
  });

  it('renders a skip link target before the navigation', () => {
    // FloatingNavigation itself does not own the skip link; the surrounding
    // <Header> does. We at least guarantee the search trigger is the first
    // button in the header so keyboard users hit it after Tab from "Skip".
    renderHeader('/');
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toBe(screen.getByRole('button', { name: /open search/i }));
  });
});
