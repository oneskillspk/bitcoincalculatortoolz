import React from 'react';
import { cn } from '@/lib/utils';

interface CalculatorPageShellProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wraps the <main> body of a calculator page so every page shares the same
 * container width, horizontal padding, vertical rhythm, and respects the
 * iOS safe-area inset when the app is wrapped in a webview / Capacitor shell.
 *
 * Sections inside should use `py-10 sm:py-14` for consistent rhythm.
 */
export const CalculatorPageShell: React.FC<CalculatorPageShellProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8',
        'pb-16',
        className,
      )}
      style={{ paddingTop: 'max(env(safe-area-inset-top), 5rem)' }}
    >
      {children}
    </div>
  );
};

export default CalculatorPageShell;
