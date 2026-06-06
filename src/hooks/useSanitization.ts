import { useMemo } from 'react';
import { sanitizeHTML, sanitizeUserInput, sanitizeURL } from '@/utils/sanitizer';

interface UseSanitizationOptions {
  allowedTags?: string[];
  allowedAttributes?: string[];
}

/**
 * React hook for content sanitization to prevent XSS attacks
 */
export const useSanitization = (options: UseSanitizationOptions = {}) => {
  
  const sanitizeContent = useMemo(() => ({
    /**
     * Sanitize HTML content while preserving allowed tags
     */
    html: (content: string): string => {
      return sanitizeHTML(content, options);
    },

    /**
     * Sanitize user input by stripping all HTML tags
     */
    userInput: (input: string): string => {
      return sanitizeUserInput(input);
    },

    /**
     * Sanitize URLs to prevent script injection
     */
    url: (url: string): string => {
      return sanitizeURL(url);
    },

    /**
     * Safe innerHTML replacement
     */
    dangerouslySetInnerHTML: (content: string) => ({
      __html: sanitizeHTML(content, options)
    })
  }), [options]);

  return sanitizeContent;
};

/**
 * Hook for sanitizing dynamic content in components
 */
export const useSafeContent = (content: string, type: 'html' | 'text' | 'url' = 'text') => {
  const { html, userInput, url } = useSanitization();
  
  return useMemo(() => {
    switch (type) {
      case 'html':
        return html(content);
      case 'url':
        return url(content);
      case 'text':
      default:
        return userInput(content);
    }
  }, [content, type, html, userInput, url]);
};