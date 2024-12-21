import { generateSchema } from './schemaUtils.js';
import { generateSeoConfig, generateMetaTags, generateCanonicalUrl } from './seo.js';
import { PAGE_TYPES } from './constants.js';

/**
 * @typedef {import('./types').SeoConfig} SeoConfig
 * @typedef {import('./types').PageData} PageData
 * @typedef {import('./types').SchemaData} SchemaData
 * @typedef {import('./types').MetaTag} MetaTag
 * 
 * @typedef {Object} UnifiedSeoResult
 * @property {SeoConfig} config - Complete SEO configuration
 * @property {MetaTag[]} metaTags - Generated meta tags
 * @property {Object} schema - Generated schema.org data
 * @property {string|null} canonical - Canonical URL if path was provided
 * @property {string} title - Page title
 */

/**
 * Unified SEO configuration generator that handles both meta tags and schema
 * @param {Object} params
 * @param {keyof typeof PAGE_TYPES} params.pageType - Type of the page
 * @param {Partial<SeoConfig>} [params.customConfig] - Optional custom SEO configuration
 * @param {PageData} [params.data] - Page data for schema generation
 * @param {string} [params.path] - Current page path for canonical URL
 * @returns {UnifiedSeoResult} Complete SEO configuration including meta tags and schema
 */
export function generateUnifiedSeo({ pageType, customConfig = {}, data = {}, path }) {
    // Generate base SEO configuration
    const seoConfig = generateSeoConfig(pageType, customConfig);

    // Generate meta tags
    const metaTags = generateMetaTags(seoConfig);

    // Generate schema
    const schema = generateSchema({
        pageType,
        seo: seoConfig,
        data
    });

    // Generate canonical URL if path is provided
    const canonical = path ? generateCanonicalUrl(path) : null;

    return {
        config: seoConfig,
        metaTags,
        schema,
        canonical,
        title: seoConfig.title
    };
}
