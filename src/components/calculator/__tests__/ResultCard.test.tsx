import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ResultCard } from '@/components/calculator/ResultCard';

const renderCard = (props: Parameters<typeof ResultCard>[0]) =>
  render(
    <TooltipProvider delayDuration={0}>
      <ResultCard {...props} />
    </TooltipProvider>,
  );

describe('ResultCard tooltip (mobile-friendly)', () => {
  it('renders the abbreviated value', () => {
    renderCard({ label: 'Portfolio', value: '$1.23M', fullValue: '$1,234,567.89' });
    expect(screen.getByTestId('result-card-value')).toHaveTextContent('$1.23M');
  });

  it('exposes the full value via aria-label so it is reachable on touch devices', () => {
    renderCard({ label: 'Portfolio', value: '$1.23M', fullValue: '$1,234,567.89' });
    const trigger = screen.getByTestId('result-card-value');
    expect(trigger.tagName).toBe('BUTTON');
    expect(trigger).toHaveAttribute('aria-label', 'Portfolio: $1,234,567.89');
  });

  it('reveals the full value on focus (keyboard / mobile tap)', async () => {
    renderCard({ label: 'Net Profit', value: '+$2.5M', fullValue: '+$2,500,000.00' });
    const trigger = screen.getByTestId('result-card-value');
    fireEvent.focus(trigger);
    expect((await screen.findAllByText('+$2,500,000.00')).length).toBeGreaterThan(0);
  });

  it('reveals the full value tooltip on tap (mobile)', async () => {
    renderCard({ label: 'Holdings', value: '₿1.23', fullValue: '₿1.23456789' });
    const trigger = screen.getByTestId('result-card-value');
    expect(trigger.tagName).toBe('BUTTON');
    // Mobile tap on a Radix tooltip trigger surfaces it via focus.
    fireEvent.focus(trigger);
    const matches = await screen.findAllByText('₿1.23456789');
    expect(matches.length).toBeGreaterThan(0);
    const tooltips = document.querySelectorAll('[role="tooltip"]');
    expect(tooltips.length).toBeGreaterThan(0);
  });

  it.each([
    ['Enter', 'Enter'],
    ['Space', ' '],
  ])('reveals the full value tooltip on focus + %s key', async (_label, key) => {
    renderCard({ label: 'Stack', value: '₿0.50', fullValue: '₿0.50000000' });
    const trigger = screen.getByTestId('result-card-value');
    fireEvent.focus(trigger);
    fireEvent.keyDown(trigger, { key });
    const matches = await screen.findAllByText('₿0.50000000');
    expect(matches.length).toBeGreaterThan(0);
    expect(document.querySelectorAll('[role="tooltip"]').length).toBeGreaterThan(0);
  });

  it('uses the rendered text as the tooltip value when no fullValue is provided', () => {
    renderCard({ label: 'Frequency', value: 'Monthly' });
    const v = screen.getByTestId('result-card-value');
    expect(v.tagName).toBe('BUTTON');
    expect(v).toHaveAttribute('aria-label', 'Frequency: Monthly');
    expect(v).toHaveAttribute('title', 'Monthly');
  });
});
