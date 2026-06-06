import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from '@/contexts/LanguageContext';

import { FAQSection } from '@/components/FAQSection';
import { NewsletterSection } from '@/components/NewsletterSection';
import { PremiumCalculatorCards } from '@/components/PremiumCalculatorCards';

expect.extend(toHaveNoViolations);

const wrap = (ui: React.ReactNode) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <LanguageProvider>{ui}</LanguageProvider>
        </MemoryRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

// Rules disabled: 'region' (these components are mounted standalone in tests
// without a surrounding <main>) and 'color-contrast' (jsdom can't compute it).
const axeOpts = {
  rules: {
    region: { enabled: false },
    'color-contrast': { enabled: false },
  },
};

describe('Homepage a11y', () => {
  it('FAQSection has no detectable a11y violations', async () => {
    const { container } = render(wrap(<FAQSection />));
    const results = await axe(container, axeOpts);
    expect(results).toHaveNoViolations();
  });

  it('NewsletterSection has no detectable a11y violations', async () => {
    const { container } = render(wrap(<NewsletterSection />));
    const results = await axe(container, axeOpts);
    expect(results).toHaveNoViolations();
  });

  it('PremiumCalculatorCards has no detectable a11y violations', async () => {
    const { container } = render(wrap(<PremiumCalculatorCards />));
    const results = await axe(container, axeOpts);
    expect(results).toHaveNoViolations();
  });

  it('PremiumCalculatorCards links expose accessible names', () => {
    const { getAllByRole } = render(wrap(<PremiumCalculatorCards />));
    const links = getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
    for (const link of links) {
      expect(link).toHaveAccessibleName();
    }
  });
});
