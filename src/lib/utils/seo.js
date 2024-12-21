import { GALLERY_INFO, DEFAULT_META, PAGE_CONFIGS, PAGE_TYPES } from './constants.js';

/**
 * @typedef {import('./types').SeoConfig} SeoConfig
 * @typedef {import('./types').PageConfig} PageConfig
 * @typedef {import('./types').MetaTag} MetaTag
 */

export const defaultSEO = DEFAULT_META;

/**
 * Generate SEO configuration for a specific page type
 * @param {keyof typeof PAGE_TYPES} pageType - Type of the page
 * @param {Partial<SeoConfig>} [customConfig] - Optional custom configuration to override defaults
 * @returns {SeoConfig} Complete SEO configuration for the page
 */
export function generateSeoConfig(pageType, customConfig = {}) {
    const pageDefaults = PAGE_CONFIGS[pageType] || PAGE_CONFIGS[PAGE_TYPES.HOME];
    
    // Merge keywords from all sources, removing duplicates
    const keywords = Array.from(new Set([
        ...defaultSEO.keywords,
        ...pageDefaults.keywords,
        ...(customConfig.keywords || [])
    ]));

    // Merge OpenGraph data with proper fallbacks
    const openGraph = {
        ...defaultSEO.openGraph,
        ...pageDefaults.openGraph,
        ...(customConfig.openGraph || {}),
        title: customConfig.openGraph?.title || customConfig.title || pageDefaults.title,
        description: customConfig.openGraph?.description || customConfig.description || pageDefaults.description,
        type: customConfig.openGraph?.type || pageDefaults.openGraph.type || defaultSEO.openGraph.type
    };

    // Return merged configuration
    return {
        ...defaultSEO,
        ...pageDefaults,
        ...customConfig,
        keywords,
        openGraph
    };
}

/**
 * Generate meta tags from SEO configuration
 * @param {SeoConfig} seoConfig - SEO configuration object
 * @returns {MetaTag[]} Array of meta tags
 */
export function generateMetaTags(seoConfig) {
    /** @type {MetaTag[]} */
    const tags = [
        // Basic meta tags
        { name: 'description', content: seoConfig.description },
        { name: 'keywords', content: seoConfig.keywords.join(', ') },
        
        // Open Graph tags
        { property: 'og:title', content: seoConfig.openGraph.title || seoConfig.title },
        { property: 'og:description', content: seoConfig.openGraph.description || seoConfig.description },
        { property: 'og:image', content: seoConfig.openGraph.image || '' },
        { property: 'og:url', content: seoConfig.openGraph.url || '' },
        { property: 'og:type', content: seoConfig.openGraph.type || 'website' },
        
        // Twitter Card tags
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@variablegallery' },
        { name: 'twitter:title', content: seoConfig.openGraph.title || seoConfig.title },
        { name: 'twitter:description', content: seoConfig.openGraph.description || seoConfig.description },
        { name: 'twitter:image', content: seoConfig.openGraph.image || '' }
    ];

    return tags.filter(tag => tag.content); // Remove tags with empty content
}

/**
 * Generate canonical URL for a given path
 * @param {string} path - URL path (e.g., '/shop', '/artist/name')
 * @returns {string} Full canonical URL
 */
export function generateCanonicalUrl(path) {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${GALLERY_INFO.baseUrl}${cleanPath}`;
}
