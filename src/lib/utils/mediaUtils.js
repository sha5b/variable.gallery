/**
 * @typedef {import('./types').Media} Media
 */

/**
 * Get media URL by fingerprint ID
 * @param {Media[]} media - Array of media objects
 * @param {number} fingerprintId - The fingerprint ID to search for
 * @returns {string} The media URL or empty string if not found
 */
export function getMediaUrlByFingerprint(media, fingerprintId) {
    const mediaItem = media.find(item => item.id === fingerprintId);
    return mediaItem ? mediaItem.source_url : '';
}

/**
 * Generate URL-friendly slug from title
 * @param {string} title - The title to convert to a slug
 * @returns {string} URL-friendly slug
 */
export function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

/**
 * Get exhibition URL from title
 * @param {string} title - The exhibition title
 * @returns {string} The exhibition URL
 */
export function getExhibitionUrl(title) {
    return `/exhibitions/${generateSlug(title)}`;
}

/**
 * Get artist URL from title
 * @param {string} title - The artist title
 * @returns {string} The artist URL
 */
export function getArtistUrl(title) {
    return `/artist/${generateSlug(title)}`;
}

/**
 * Get product URL from ID
 * @param {number} id - The product ID
 * @returns {string} The product URL
 */
export function getProductUrl(id) {
    return `/shop/${id}`;
}

/**
 * Handle image loading with fallback
 * @param {string} src - Primary image source
 * @param {string} [fallbackSrc='/placeholder.jpg'] - Fallback image source
 * @returns {Promise<string>} Resolved image source
 */
export function handleImageLoad(src, fallbackSrc = '/placeholder.jpg') {
    return new Promise((resolve) => {
        if (typeof window === 'undefined') {
            resolve(src); // SSR - return original src
            return;
        }

        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = () => resolve(fallbackSrc);
        img.src = src;
    });
}

/**
 * Get first available image URL from a product
 * @param {import('./types').Product} product - The product object
 * @param {string} [fallbackSrc='/placeholder.jpg'] - Fallback image source
 * @returns {string} The image URL or fallback
 */
export function getProductImageUrl(product, fallbackSrc = '/placeholder.jpg') {
    return product?.images?.[0]?.src || fallbackSrc;
}
