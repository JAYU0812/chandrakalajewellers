/**
 * Dedicated SEO Utility System for Project AURUM.
 * Dynamically updates document metadata, OpenGraph tags, and structured JSON-LD graphs.
 */

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'product' | 'article';
  canonicalUrl?: string;
}

/**
 * Updates document meta headers dynamically.
 */
export const updateMetadata = (config: SEOConfig) => {
  if (typeof window === 'undefined') return;

  // 1. Dynamic Page Titles
  const brandSuffix = ' | Chandrakala Jewellers';
  const fullTitle = config.title.endsWith(brandSuffix) ? config.title : `${config.title}${brandSuffix}`;
  document.title = fullTitle;

  // Helper to set or create meta elements
  const setMetaTag = (attributeName: string, attributeValue: string, content: string) => {
    let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attributeName, attributeValue);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  // 2. Meta Descriptions & Keywords
  setMetaTag('name', 'description', config.description);
  if (config.keywords) {
    setMetaTag('name', 'keywords', config.keywords);
  }

  // 3. OpenGraph Social Metadata
  const currentUrl = config.canonicalUrl || window.location.href;
  setMetaTag('property', 'og:title', fullTitle);
  setMetaTag('property', 'og:description', config.description);
  setMetaTag('property', 'og:url', currentUrl);
  setMetaTag('property', 'og:type', config.ogType || 'website');
  setMetaTag('property', 'og:image', config.ogImage || '/assets/images/bridal_heritage.jpg');

  // 4. Canonical Links
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', currentUrl);
};

/**
 * Generates and injects structured JSON-LD schema graphs.
 */
export const injectJsonLd = (schemaId: string, schemaData: Record<string, any>) => {
  if (typeof window === 'undefined') return;

  let script = document.getElementById(schemaId) as HTMLScriptElement;
  if (!script) {
    script = document.createElement('script');
    script.id = schemaId;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.text = JSON.stringify({
    '@context': 'https://schema.org',
    ...schemaData,
  });
};

/**
 * Clean up injected JSON-LD graphs on component unmounts.
 */
export const removeJsonLd = (schemaId: string) => {
  if (typeof window === 'undefined') return;
  const script = document.getElementById(schemaId);
  if (script) {
    script.remove();
  }
};
