import { GALLERY_INFO, PAGE_TYPES } from './constants.js';

/**
 * @typedef {import('./types').SeoConfig} SeoConfig
 * @typedef {import('./types').SchemaData} SchemaData
 * @typedef {import('./types').Exhibition} Exhibition
 */

/**
 * Generate gallery organization schema that's used in multiple contexts
 * @returns {Object} Gallery organization schema
 */
function generateGalleryOrg() {
    return {
        "@type": "ArtGallery",
        "name": GALLERY_INFO.name,
        "url": GALLERY_INFO.baseUrl,
        "address": {
            "@type": "PostalAddress",
            "addressLocality": GALLERY_INFO.address.locality,
            "addressCountry": GALLERY_INFO.address.country
        },
        "openingHours": GALLERY_INFO.openingHours,
        "telephone": GALLERY_INFO.telephone,
        "sameAs": [
            GALLERY_INFO.social.twitter,
            GALLERY_INFO.social.instagram
        ]
    };
}

/**
 * Generate exhibition event schema
 * @param {Exhibition} exhibition - Exhibition data
 * @returns {Object} Exhibition event schema
 */
function generateExhibitionEvent(exhibition) {
    return {
        "@type": "Event",
        "name": exhibition.title.rendered,
        "description": exhibition.description,
        "startDate": exhibition.date,
        "location": exhibition.acf?.virtual ? {
            "@type": "VirtualLocation",
            "url": `${GALLERY_INFO.baseUrl}/exhibitions/${exhibition.slug}`
        } : {
            "@type": "Place",
            "name": exhibition.acf?.location || GALLERY_INFO.name,
            "address": {
                "@type": "PostalAddress",
                "addressLocality": GALLERY_INFO.address.locality,
                "addressCountry": GALLERY_INFO.address.country
            }
        }
    };
}

/**
 * Generate unified schema for any page type
 * @param {Object} params
 * @param {keyof typeof PAGE_TYPES} params.pageType - Type of the page
 * @param {SeoConfig} params.seo - SEO configuration
 * @param {SchemaData} [params.data] - Additional data needed for the schema
 * @returns {Object} Schema.org JSON-LD data
 */
export function generateSchema({ pageType, seo, data = {} }) {
    // Base schema that's common across all pages
    const baseSchema = {
        "@context": "https://schema.org",
        "url": seo.openGraph?.url || GALLERY_INFO.baseUrl
    };

    // Gallery organization schema
    const galleryOrg = generateGalleryOrg();

    switch (pageType) {
        case PAGE_TYPES.HOME:
            return {
                ...baseSchema,
                ...galleryOrg,
                "description": seo.description,
                "image": seo.openGraph?.image,
                "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "Digital Art Collection",
                    "itemListElement": [
                        {
                            "@type": "OfferCatalog",
                            "name": "Digital Artworks",
                            "itemListElement": data.products?.map(product => ({
                                "@type": "Product",
                                "name": product.name,
                                "url": `${GALLERY_INFO.baseUrl}/shop/${product.id}`
                            })) || []
                        }
                    ]
                }
            };

        case PAGE_TYPES.EXHIBITIONS:
            return {
                ...baseSchema,
                "@type": "CollectionPage",
                "name": "Exhibitions at variable.gallery",
                "description": seo.description,
                "mainEntity": {
                    "@type": "ItemList",
                    "itemListElement": data.exhibitions?.map((exhibition, index) => ({
                        "@type": "ListItem",
                        "position": index + 1,
                        "item": generateExhibitionEvent(exhibition)
                    })) || []
                }
            };

        case PAGE_TYPES.ARTIST:
            return {
                ...baseSchema,
                "@type": "CollectionPage",
                "name": "Artists at variable.gallery",
                "description": seo.description,
                "mainEntity": {
                    "@type": "ItemList",
                    "itemListElement": data.artists?.map((artist, index) => ({
                        "@type": "ListItem",
                        "position": index + 1,
                        "item": {
                            "@type": "Person",
                            "name": artist.title.rendered,
                            "url": `${GALLERY_INFO.baseUrl}/artist/${artist.slug}`,
                            "@id": `${GALLERY_INFO.baseUrl}/artist/${artist.slug}`,
                            "description": artist.acf?.description,
                            "location": artist.acf?.location
                        }
                    })) || []
                }
            };

        case PAGE_TYPES.PRODUCT:
            if (!data.product) return baseSchema;
            return {
                ...baseSchema,
                "@type": "Product",
                "name": data.product.name,
                "description": data.product.description,
                "image": data.product.images?.[0]?.src,
                "category": data.product.categories?.[0]?.name,
                "offers": {
                    "@type": "Offer",
                "price": data.product.regular_price,
                    "priceCurrency": "EUR",
                    "availability": "https://schema.org/InStock",
                    "seller": galleryOrg
                }
            };

        case PAGE_TYPES.SHOP:
            return {
                ...baseSchema,
                "@type": "CollectionPage",
                "name": seo.title,
                "description": seo.description,
                "numberOfItems": data.products?.length || 0,
                "mainEntity": {
                    "@type": "ItemList",
                    "itemListElement": data.products?.map((product, index) => ({
                        "@type": "ListItem",
                        "position": index + 1,
                        "item": {
                            "@type": "Product",
                            "name": product.name,
                            "description": product.description,
                            "image": product.images?.[0]?.src,
                            "offers": {
                                "@type": "Offer",
                            "price": product.regular_price,
                                "priceCurrency": "EUR"
                            }
                        }
                    })) || []
                }
            };

        case PAGE_TYPES.CART:
            return {
                ...baseSchema,
                "@type": "ItemPage",
                "name": seo.title,
                "description": seo.description,
                "isPartOf": {
                    "@type": "WebSite",
                    "name": GALLERY_INFO.name,
                    "url": GALLERY_INFO.baseUrl
                }
            };

        case PAGE_TYPES.CHECKOUT:
            return {
                ...baseSchema,
                "@type": "CheckoutPage",
                "name": seo.title,
                "description": seo.description,
                "provider": galleryOrg
            };

        default:
            return {
                ...baseSchema,
                "@type": "WebPage",
                "name": seo.title,
                "description": seo.description,
                "isPartOf": {
                    "@type": "WebSite",
                    "name": GALLERY_INFO.name,
                    "url": GALLERY_INFO.baseUrl
                }
            };
    }
}
