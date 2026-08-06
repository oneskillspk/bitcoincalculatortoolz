# Promotional "Cards" Layout Plan

The goal is to implement a high-performance, visually polished promotional card system (inspired by the Bybit UI) across high-impression areas of the site.

## 1. Visual Design (Reference: user-uploads://file-23)
- **Card Structure**: Soft rounded corners (`rounded-2xl`), subtle borders (`border-border/40`), and a light gray/white background.
- **Header/Badge**: A small, high-contrast label (e.g., "Hot", "Exclusive", "Ongoing") using pill-shaped badges.
- **Imagery**: High-quality, centered isometric 3D renders or vector graphics.
- **Typography**: 
  - Title: Bold, slightly condensed sans-serif (Inter/SF Pro) for impact.
  - Subtitle: Muted gray text for date ranges or secondary info.
- **CTA**: A distinctive button (orange/premium gradient) that stands out against the clean background.

## 2. Technical Architecture
- **Component**: Create a reusable `PromoCard` primitive in `src/components/modern/PromoCard.tsx`.
- **Integration**:
  - **Calculators**: Place in the `RelatedCalculators` section or as a sticky sidebar element on desktop.
  - **Articles**: Insert into the content flow (after H2 or midway through the body) to maximize conversion without breaking readability.
- **Localization**: Full support for English and Turkish text fields.
- **Dynamic Content**: Integrate with the existing `affiliates.config.ts` to rotate offers based on page context (e.g., DCA cards on the DCA page).

## 3. Implementation Phases
### Phase 1: Primitive Construction
- Scaffold the `PromoCard` and `PromoGrid` components using Tailwind and Radix UI (for accessibility).
- Standardize spacing and responsive breakpoints (1 column mobile, 3 column desktop).

### Phase 2: Content Population
- Define "Special Offers" for Vantage, Axi, and internal tools.
- Add metadata: status badges, valid-thru dates, and localized CTAs.

### Phase 3: Global Deployment
- Inject the `PromoGrid` into the `Footer` (above the main links) or within the `PageSection` logic of all 49+ calculators.
- Audit for CLS (Cumulative Layout Shift) to ensure these boxes don't push content down as they load.

## 4. Expected Impact
- **RPM Increase**: Higher click-through rates (CTR) on affiliate partners due to improved visual trust.
- **Engagement**: Increased internal traffic by cross-promoting related calculators in a "Premium" format.
