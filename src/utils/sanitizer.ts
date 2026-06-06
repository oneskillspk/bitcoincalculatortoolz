import DOMPurify from 'dompurify';

// XSS Protection - Content Sanitization Utility
export interface SanitizeOptions {
  allowedTags?: string[];
  allowedAttributes?: string[];
  stripTags?: boolean;
}

/**
 * Sanitizes HTML content to prevent XSS attacks
 */
export const sanitizeHTML = (
  dirty: string, 
  options: SanitizeOptions = {}
): string => {
  const defaultConfig = {
    ALLOWED_TAGS: options.allowedTags || ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: options.allowedAttributes || [],
    STRIP_COMMENTS: true,
    STRIP_CDATA_SECTIONS: true,
    FORBID_SCRIPT: true,
    FORBID_TAGS: ['script', 'object', 'embed', 'iframe', 'form', 'input'],
    FORBID_ATTR: ['onclick', 'onerror', 'onload', 'onmouseover']
  };

  if (options.stripTags) {
    return DOMPurify.sanitize(dirty, { 
      ...defaultConfig, 
      ALLOWED_TAGS: [] 
    });
  }

  return DOMPurify.sanitize(dirty, defaultConfig);
};

/**
 * Sanitizes user input for safe display
 */
export const sanitizeUserInput = (input: string): string => {
  return sanitizeHTML(input, { stripTags: true });
};

/**
 * Sanitizes URLs to prevent javascript: and data: URI attacks
 */
export const sanitizeURL = (url: string): string => {
  if (!url) return '';
  
  // Remove dangerous protocols
  const dangerous = /^(javascript|data|vbscript|file|about):/i;
  if (dangerous.test(url)) {
    return '';
  }
  
  // Allow only http, https, mailto, and relative URLs
  const safe = /^(https?:|mailto:|\/|#)/i;
  if (!safe.test(url)) {
    return '';
  }
  
  return url;
};