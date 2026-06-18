export type AdNetwork = 'adsense' | 'carbon' | 'house';
export type AdSize = 'leaderboard' | 'rectangle' | 'skyscraper' | 'mobile-banner' | 'inline' | 'sidebar-sm' | 'sidebar-lg';

export interface AdSlotConfig {
  id: string;
  size: AdSize;
  network: AdNetwork;
  /** AdSense slot ID or Carbon placement ID */
  networkSlotId?: string;
  /** Only show on these breakpoints */
  visibleOn?: 'desktop' | 'mobile' | 'all';
}

export interface AdPageRules {
  maxAdsPerPage: number;
  noAdsAboveFold: boolean;
  lazyLoad: boolean;
  minSpacingPx: number;
}

/** Global ad toggle */
export const ADS_ENABLED = true;

/** Per-page-type rules */
export const AD_RULES: Record<string, AdPageRules> = {
  calculator: {
    maxAdsPerPage: 2,
    noAdsAboveFold: true,
    lazyLoad: true,
    minSpacingPx: 600,
  },
  article: {
    maxAdsPerPage: 4,
    noAdsAboveFold: false,
    lazyLoad: true,
    minSpacingPx: 400,
  },
  hub: {
    maxAdsPerPage: 1,
    noAdsAboveFold: true,
    lazyLoad: true,
    minSpacingPx: 800,
  },
};

/** Ad size dimensions for styling */
export const AD_SIZE_MAP: Record<AdSize, { className: string; label: string }> = {
  leaderboard: {
    className: 'max-w-[728px] w-full min-h-[90px]',
    label: '728×90',
  },
  rectangle: {
    className: 'w-full min-h-[250px] max-w-[300px]',
    label: '300×250',
  },
  skyscraper: {
    className: 'w-full min-h-[600px] max-w-[300px]',
    label: '300×600',
  },
  'mobile-banner': {
    className: 'w-full min-h-[50px] max-w-[320px]',
    label: '320×50',
  },
  inline: {
    className: 'max-w-[728px] w-full min-h-[90px]',
    label: '728×90',
  },
  'sidebar-sm': {
    className: 'w-full min-h-[250px]',
    label: '300×250',
  },
  'sidebar-lg': {
    className: 'w-full min-h-[600px]',
    label: '300×600',
  },
};

/** Default network — change when you sign up for an ad network */
export const DEFAULT_AD_NETWORK: AdNetwork = 'house';

/** AdSense publisher ID — set when ready */
export const ADSENSE_PUBLISHER_ID = '';

/** Carbon Ads serve URL — set when ready */
export const CARBON_SERVE_URL = '';

/** Homepage sponsored slot A/B test (Phase 4.6) */
export type HomeSponsoredVariant = 'native-300x250' | 'image-banner-468x60';

/** Active variant. Flip to A/B test. */
export const HOME_SPONSORED_VARIANT: HomeSponsoredVariant = 'native-300x250';

/** Lazy-mount homepage sponsored slot only after user scrolls past this fraction of the document. */
export const HOME_SPONSORED_SCROLL_THRESHOLD = 0.5;
