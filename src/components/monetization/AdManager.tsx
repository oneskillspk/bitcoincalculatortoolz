import { useEffect } from 'react';
import { ADS_ENABLED, DEFAULT_AD_NETWORK, ADSENSE_PUBLISHER_ID, CARBON_SERVE_URL } from '@/config/adConfig';

/**
 * AdManager: loads ad network scripts once, deferred after page interactive.
 * Place once in App.tsx or layout wrapper.
 */
export const AdManager = () => {
  useEffect(() => {
    if (!ADS_ENABLED) return;

    const loadScript = (src: string, attrs?: Record<string, string>) => {
      if (document.querySelector(`script[src="${src}"]`)) return;
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      if (attrs) Object.entries(attrs).forEach(([k, v]) => script.setAttribute(k, v));
      document.head.appendChild(script);
    };

    // Defer loading until after interactive
    const timer = setTimeout(() => {
      if (DEFAULT_AD_NETWORK === 'adsense' && ADSENSE_PUBLISHER_ID) {
        loadScript(
          `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`,
          { crossorigin: 'anonymous' }
        );
      }

      if (DEFAULT_AD_NETWORK === 'carbon' && CARBON_SERVE_URL) {
        loadScript(CARBON_SERVE_URL, { id: '_carbonads_js' });
      }
    }, 3000); // 3s delay to not compete with critical resources

    return () => clearTimeout(timer);
  }, []);

  return null;
};
