import * as React from 'react';
import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

/**
 * Contract: after the visible month changes (via external `month` prop OR the
 * in-caption Select), keyboard focus should land on the same day-of-month tile
 * in the new grid so screen-reader / keyboard users don't lose their place.
 */

beforeAll(() => {
  // Radix / react-day-picker touch these APIs during layout in jsdom.
  if (!('hasPointerCapture' in Element.prototype)) {
    // @ts-expect-error jsdom shim
    Element.prototype.hasPointerCapture = () => false;
  }
  if (!('scrollIntoView' in Element.prototype)) {
    // @ts-expect-error jsdom shim
    Element.prototype.scrollIntoView = () => {};
  }
  if (!('setPointerCapture' in Element.prototype)) {
    // @ts-expect-error jsdom shim
    Element.prototype.setPointerCapture = () => {};
  }
  if (!('releasePointerCapture' in Element.prototype)) {
    // @ts-expect-error jsdom shim
    Element.prototype.releasePointerCapture = () => {};
  }
});

const findDayButton = (day: number, root: HTMLElement) =>
  Array.from(root.querySelectorAll<HTMLButtonElement>('button[name="day"]'))
    .filter((b) => !b.classList.contains('day-outside'))
    .find((b) => (b.textContent ?? '').trim() === String(day));

const CalendarInPopover = () => {
  const [date, setDate] = React.useState(new Date(2024, 6, 15));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button">Pick date</Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(nextDate) => nextDate && setDate(nextDate)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

describe('Calendar a11y', () => {
  it('exposes the group landmark and named month/year selects', () => {
    render(<Calendar mode="single" selected={new Date(2024, 0, 15)} />);
    expect(screen.getByRole('group', { name: /date picker/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /select month/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /select year/i })).toBeInTheDocument();
  });

  it('keeps focus on the same day-of-month after a month change', async () => {
    const { container, rerender } = render(
      <Calendar mode="single" selected={new Date(2024, 0, 15)} month={new Date(2024, 0, 1)} />,
    );

    // Focus Jan 15 — the container's onFocus handler records day-of-month.
    const jan15 = findDayButton(15, container);
    expect(jan15).toBeDefined();
    act(() => jan15!.focus());
    expect(document.activeElement).toBe(jan15);

    // Move to February via the controlled `month` prop.
    rerender(
      <Calendar mode="single" selected={new Date(2024, 0, 15)} month={new Date(2024, 1, 1)} />,
    );

    await waitFor(() => {
      const feb15 = findDayButton(15, container);
      expect(feb15).toBeDefined();
      expect(document.activeElement).toBe(feb15);
    });
  });

  it('falls back safely when the previously-focused day does not exist (Jan 31 → Feb)', async () => {
    const { container, rerender } = render(
      <Calendar mode="single" month={new Date(2023, 0, 1)} />,
    );

    const jan31 = findDayButton(31, container);
    expect(jan31).toBeDefined();
    act(() => jan31!.focus());

    // Feb 2023 has no 31st — the effect should either land on an in-month tile
    // or on an outside-month proxy, but must not crash and must not leave focus
    // stranded on <body>.
    rerender(<Calendar mode="single" month={new Date(2023, 1, 1)} />);

    await waitFor(() => {
      const active = document.activeElement as HTMLElement | null;
      expect(active).not.toBe(document.body);
      expect(active?.tagName).toBe('BUTTON');
    });
  });

  it('does not steal focus on the initial mount', () => {
    render(<Calendar mode="single" selected={new Date(2024, 0, 15)} />);
    // Nothing was focused by the user yet → activeElement should still be body.
    expect(document.activeElement).toBe(document.body);
  });

  it('keeps the popover open when changing month/year from the calendar selects', async () => {
    const user = userEvent.setup();
    render(<CalendarInPopover />);

    await user.click(screen.getByRole('button', { name: /pick date/i }));
    expect(screen.getByRole('group', { name: /date picker/i })).toBeInTheDocument();

    await user.selectOptions(screen.getByRole('combobox', { name: /select month/i }), 'January');
    expect(screen.getByRole('group', { name: /date picker/i })).toBeInTheDocument();

    await user.selectOptions(screen.getByRole('combobox', { name: /select year/i }), '2023');
    expect(screen.getByRole('group', { name: /date picker/i })).toBeInTheDocument();
  });
});
