import { describe, it, expect, vi, beforeAll } from 'vitest';
import { fireEvent, render, screen, userEvent, waitFor } from '@/test/utils';
import { ModernInputPanel } from '../ModernInputPanel';

/**
 * Accessibility contract for the calculator input panel.
 * These rules are enforced because the panel is reused across all
 * calculator pages and must remain keyboard- and screen-reader-friendly.
 */
describe('ModernInputPanel — accessibility', () => {
  const noop = vi.fn();

  beforeAll(() => {
    // Radix Select / Popover call these in real browsers; jsdom needs shims.
    if (!('hasPointerCapture' in Element.prototype)) {
      // @ts-expect-error jsdom shim
      Element.prototype.hasPointerCapture = () => false;
    }
    if (!('setPointerCapture' in Element.prototype)) {
      // @ts-expect-error jsdom shim
      Element.prototype.setPointerCapture = () => {};
    }
    if (!('releasePointerCapture' in Element.prototype)) {
      // @ts-expect-error jsdom shim
      Element.prototype.releasePointerCapture = () => {};
    }
    if (!('scrollIntoView' in Element.prototype)) {
      // @ts-expect-error jsdom shim
      Element.prototype.scrollIntoView = () => {};
    }
  });

  it('every interactive control has an accessible name', () => {
    render(<ModernInputPanel onCalculate={noop} loading={false} />);

    // Amount input has a label via aria-label
    expect(screen.getByLabelText(/amount in usd/i)).toBeInTheDocument();

    // Currency select trigger
    expect(screen.getByLabelText(/select currency/i)).toBeInTheDocument();

    // Date trigger
    expect(screen.getByLabelText(/investment date/i)).toBeInTheDocument();

    // Show in BTC switch
    expect(screen.getByLabelText(/show in btc/i)).toBeInTheDocument();

    // Calculate CTA
    expect(screen.getByRole('button', { name: /calculate returns/i })).toBeInTheDocument();
  });

  it('toggle and chip controls expose pressed state', () => {
    render(<ModernInputPanel onCalculate={noop} loading={false} />);

    // Fiat/BTC toggle uses tab semantics with active state.
    const fiatBtn = screen.getByRole('tab', { name: 'Fiat' });
    const btcBtn = screen.getByRole('tab', { name: 'BTC' });
    expect(fiatBtn).toHaveAttribute('aria-selected', 'true');
    expect(btcBtn).toHaveAttribute('aria-selected', 'false');

    // Quick amount chips use aria-pressed (1,000 USD chip is active by default)
    const activeChip = screen.getByRole('button', { name: /1,000 USD/i });
    expect(activeChip).toHaveAttribute('aria-pressed', 'true');

    // Date presets use aria-pressed (1Y is the default)
    const oneY = screen.getByRole('button', { name: /Last 1Y/i });
    expect(oneY).toHaveAttribute('aria-pressed', 'true');
  });

  it('groups quick chip rows under aria-label group regions', () => {
    render(<ModernInputPanel onCalculate={noop} loading={false} />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getByRole('group', { name: /quick amount presets/i })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: /quick date presets/i })).toBeInTheDocument();
  });

  it('CTA reflects busy state when loading', () => {
    render(<ModernInputPanel onCalculate={noop} loading={true} />);
    const cta = screen.getByRole('button', { name: /calculating/i });
    expect(cta).toHaveAttribute('aria-busy', 'true');
    expect(cta).toBeDisabled();
  });

  it('all visible buttons are keyboard-focusable (no tabindex=-1 traps)', () => {
    const { container } = render(<ModernInputPanel onCalculate={noop} loading={false} />);
    const buttons = container.querySelectorAll('button');
    buttons.forEach((btn) => {
      // Allow disabled buttons to be skipped, but otherwise tabIndex must not be -1.
      if (!(btn as HTMLButtonElement).disabled) {
        // Radix Tabs uses roving tabindex: inactive tabs are intentionally -1
        // while still keyboard reachable through arrow-key navigation.
        if (btn.getAttribute('role') === 'tab') return;
        expect(btn.getAttribute('tabindex')).not.toBe('-1');
      }
    });
  });

  it('allows choosing a date without submitting the form', async () => {
    const onCalculate = vi.fn();
    const user = userEvent.setup();

    render(<ModernInputPanel onCalculate={onCalculate} loading={false} />);

    fireEvent.change(screen.getByLabelText(/investment date/i), { target: { value: '2020-01-20' } });

    await waitFor(() => {
      expect(screen.getByLabelText(/investment date/i)).toHaveValue('2020-01-20');
    });
    expect(onCalculate).not.toHaveBeenCalled();
  });

  it('clamps typed investment dates to the supported Bitcoin history range', async () => {
    const user = userEvent.setup();
    render(<ModernInputPanel onCalculate={noop} loading={false} />);

    fireEvent.change(screen.getByLabelText(/investment date/i), { target: { value: '2008-12-31' } });

    await waitFor(() => {
      expect(screen.getByLabelText(/investment date/i)).toHaveValue('2009-01-03');
    });
  });
});
